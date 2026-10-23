import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PDFDocument,
  PDFTextField,
  PDFCheckBox,
  StandardFonts,
  rgb,
} from "pdf-lib";
import { getTraitCatalogEntries } from "../rulesets/dnd/dnd2024/data/traits/traitCatalog";
import { useCharacterSheetData } from "../features/character-sheet/hooks/useCharacterSheetData";
import { classesById } from "../rulesets/dnd/dnd2024/helpers";
import { getUnarmedStrikeAttack } from "../rulesets/dnd/dnd2024/getUnarmedStrikeAttack";
import { resolveItemFromEquipmentEntry } from "../rulesets/dnd/dnd2024/resolveItem";
import { spells as spellCatalog } from "../rulesets/dnd/dnd2024/data/spells";
import "./character-sheet-print.css";

const A4_W = 595.2756;
const A4_H = 841.8898;
const templateUrl = "/character-template.pdf";
const abilityKeys = ["str", "dex", "con", "int", "wis", "cha"] as const;
const statFields = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;
const modFields = [
  "STRmod",
  "DEXmod ",
  "CONmod",
  "INTmod",
  "WISmod",
  "CHamod",
] as const;
const saveFields = [
  "ST Strength",
  "ST Dexterity",
  "ST Constitution",
  "ST Intelligence",
  "ST Wisdom",
  "ST Charisma",
];
const skills: Array<[string, string, string]> = [
  ["acrobatics", "Acrobatics", "dex"],
  ["animal-handling", "Animal", "wis"],
  ["arcana", "Arcana", "int"],
  ["athletics", "Athletics", "str"],
  ["deception", "Deception ", "cha"],
  ["history", "History ", "int"],
  ["insight", "Insight", "wis"],
  ["intimidation", "Intimidation", "cha"],
  ["investigation", "Investigation ", "int"],
  ["medicine", "Medicine", "wis"],
  ["nature", "Nature", "int"],
  ["perception", "Perception ", "wis"],
  ["performance", "Performance", "cha"],
  ["persuasion", "Persuasion", "cha"],
  ["religion", "Religion", "int"],
  ["sleight-of-hand", "SleightofHand", "dex"],
  ["stealth", "Stealth ", "dex"],
  ["survival", "Survival", "wis"],
];
const spellMap = new Map(spellCatalog.map((s) => [s.id, s]));
const mod = (score: number) => Math.floor((score - 10) / 2);
const signed = (n: number) => `${n >= 0 ? "+" : ""}${n}`;
const label = (v: unknown) =>
  String(v ?? "")
    .replace(/[-_]/g, " ")
    .trim();
const list = (v: unknown) =>
  Array.isArray(v) ? v.map(label).filter(Boolean).join(", ") : label(v);
const normalize = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
const safeNumber = (v: unknown, fallback = 0) =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

/** The browser preview and exported file use the exact same finished A4 PDF. */
async function generate(
  character: any,
  derived: any,
  campaignItemsById: Record<string, any>,
): Promise<Uint8Array> {
  const response = await fetch(templateUrl);
  if (!response.ok)
    throw new Error(
      `Could not load ${templateUrl}. Place the supplied PDF in public/character-template.pdf.`,
    );
  const source = await PDFDocument.load(await response.arrayBuffer());
  const form = source.getForm();
  const font = await source.embedFont(StandardFonts.Helvetica);
  const byName = new Map(
    form.getFields().map((field) => [field.getName(), field]),
  );
  const missing: string[] = [];
  const overlays: Array<{
    name: string;
    value: string;
    size: number;
    align?: "center" | "left";
    page?: number;
  }> = [];
  const constrained = new Set([
    "PersonalityTraits ",
    "Ideals",
    "Bonds",
    "Flaws",
    "ProficienciesLang",
    "Equipment",
    "Allies",
    "Backstory",
    "Treasure",
    "Character Appearance",
    "AttacksSpellcasting",
  ]);
  function overlay(
    name: string,
    value: unknown,
    size: number,
    align: "center" | "left" = "left",
    page?: number,
  ) {
    overlays.push({ name, value: String(value ?? ""), size, align, page });
    const field = byName.get(name);
    // Overlay must replace, not paint over, the original form appearance.
    if (field instanceof PDFTextField) field.setText("");
  }
  // Wrap by rendered font width; no line can be wider than the actual widget.
  function wrap(value: string, width: number, size: number): string[] {
    const lines: string[] = [];
    for (const paragraph of value.replace(/\r/g, "").split("\n")) {
      let line = "";
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        const candidate = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) <= width) {
          line = candidate;
        } else {
          if (line) lines.push(line);
          line = word;
          // Extremely long words cannot overflow the box either.
          while (
            line.length > 1 &&
            font.widthOfTextAtSize(line, size) > width
          ) {
            let cut = line.length - 1;
            while (
              cut > 1 &&
              font.widthOfTextAtSize(line.slice(0, cut), size) > width
            )
              cut--;
            lines.push(line.slice(0, cut));
            line = line.slice(cut);
          }
        }
      }
      if (line) lines.push(line);
      if (!paragraph.trim()) lines.push("");
    }
    return lines;
  }
  const rectFor = (name: string) => {
    const field = byName.get(name) as PDFTextField | undefined;
    const rect = field?.acroField.getWidgets()[0]?.getRectangle();
    return rect ?? null;
  };
  function fitContent(name: string, content: string, size: number) {
    const rect = rectFor(name);
    if (!rect) return "";
    const maxLines = Math.max(0, Math.floor((rect.height - 9) / (size * 1.27)));
    return wrap(content, rect.width - 12, size)
      .slice(0, maxLines)
      .join("\n");
  }
  // Assign complete features to the two template boxes. Descriptions that
  // cannot fit are reduced to their headings; nothing is continued off-page.
  function featureBoxes(features: any[]): [string, string] {
    const boxes = ["Features and Traits", "Feat+Traits"];
    const output = ["", ""];
    let box = 0;
    for (const feature of features) {
      const title = String(feature.name ?? "Feature").trim();
      const description = [feature.description, feature.notes]
        .filter(Boolean)
        .join(" ")
        .trim();
      const candidates = [
        description ? `${title}: ${description}` : title,
        title,
      ];
      let placed = false;
      for (let destination = box; destination < 2 && !placed; destination++) {
        for (const candidate of candidates) {
          const combined = output[destination]
            ? `${output[destination]}\n${candidate}`
            : candidate;
          if (fitContent(boxes[destination], combined, 8.25) === combined) {
            output[destination] = combined;
            box = destination;
            placed = true;
            break;
          }
        }
      }
      if (!placed) break;
    }
    return [output[0], output[1]];
  }
  function text(name: string, value: unknown) {
    const field = byName.get(name);
    if (!(field instanceof PDFTextField)) {
      missing.push(name);
      return;
    }
    const str = String(value ?? "");
    // updateAppearances uses automatic font sizing when the PDF has no /DA font size.
    // setFontSize(0) throws for this template because many fields lack /DA.
    if (constrained.has(name)) {
      overlay(name, str, name === "Equipment" ? 7.5 : 8.25);
      field.setText("");
    } else {
      field.setText(str);
      field.updateAppearances(font);
    }
  }
  function check(name: string, value: boolean) {
    const field = byName.get(name);
    if (field instanceof PDFCheckBox) value ? field.check() : field.uncheck();
  }
  const custom = character.buildMode === "custom";
  const cs = character.customStats ?? {};
  const cp = character.customProficiencies ?? {};
  const scores: Record<string, number> = custom
    ? (character.abilityScores ?? {})
    : (derived?.finalAbilityScores ?? {});
  const level = safeNumber(character.level, 1);
  const proficiency = custom
    ? safeNumber(cs.proficiencyBonus, 2)
    : safeNumber(derived?.proficiencyBonus, 2);
  const rawSkillRows: any[] = derived?.skillRows ?? [];
  const customSkillProfs = cp.skills ?? {};
  const customSkillTotal = (id: string, ability: string) => {
    const key = Object.keys(customSkillProfs).find(
      (k) => normalize(k) === normalize(id),
    );
    const status = customSkillProfs[key ?? id];
    const multiplier =
      status === "expertise" ? 2 : status === "proficient" ? 1 : 0;
    return mod(safeNumber(scores[ability], 10)) + proficiency * multiplier;
  };
  const customSaves: string[] = cp.savingThrows ?? [];
  const classDef: any =
    classesById[character.classId as keyof typeof classesById];
  const proficientSaves: string[] = custom
    ? customSaves
    : (derived?.savingThrowProficiencies ?? []);
  overlay("CharacterName", character.name, 13.5);
  overlay(
    "ClassLevel",
    `${custom ? (character.className ?? "") : (derived?.className ?? "")} ${level}`,
    10.5,
  );
  overlay(
    "Background",
    custom ? character.backgroundName : derived?.backgroundName,
    10.5,
  );
  overlay("Race ", custom ? character.speciesName : derived?.speciesName, 10.5);
  overlay("Alignment", character.alignment, 10.5);
  overlay("XP", custom ? character.xp : (derived?.xp ?? character.xp), 10.5);
  overlay("PlayerName", character.playerName ?? "", 10.5);
  text("Inspiration", character.heroicInspiration ? "Yes" : "");
  overlay("ProfBonus", signed(proficiency), 14, "center");
  abilityKeys.forEach((ability, i) => {
    const score = safeNumber(scores[ability], 10);
    // Printed template: large rectangle holds modifier; small circle holds base score.
    overlay(statFields[i], signed(mod(score)), 17, "center");
    overlay(modFields[i], score, 11.5, "center");
    const proficient = proficientSaves.some(
      (v) =>
        normalize(v) === normalize(ability) ||
        normalize(v) === normalize(statFields[i]),
    );
    const saveRow = derived?.saveRows?.find((row: any) => row.id === ability);
    overlay(
      saveFields[i],
      signed(
        custom
          ? mod(score) + (proficient ? proficiency : 0)
          : (saveRow?.total ?? mod(score)),
      ),
      8.1,
      "center",
    );
    check(
      [
        "Check Box 11",
        "Check Box 18",
        "Check Box 19",
        "Check Box 20",
        "Check Box 21",
        "Check Box 22",
      ][i],
      proficient,
    );
  });
  skills.forEach(([id, field, ability], index) => {
    const row = rawSkillRows.find(
      (s) => normalize(s.id ?? s.name ?? "") === normalize(id),
    );
    overlay(
      field,
      signed(
        custom
          ? customSkillTotal(id, ability)
          : safeNumber(row?.total, mod(safeNumber(scores[ability], 10))),
      ),
      8.1,
      "center",
    );
    const customStatus =
      customSkillProfs[
        Object.keys(customSkillProfs).find(
          (k) => normalize(k) === normalize(id),
        ) ?? id
      ];
    check(
      `Check Box ${23 + index}`,
      custom
        ? customStatus === "proficient" || customStatus === "expertise"
        : Boolean(row?.proficient),
    );
  });
  const hp = custom ? cs : derived;
  overlay(
    "AC",
    custom ? (cs.armorClass ?? cs.manualArmorClass ?? 10) : derived?.armorClass,
    17,
    "center",
  );
  overlay(
    "Initiative",
    signed(
      custom
        ? mod(safeNumber(scores.dex, 10))
        : safeNumber(derived?.initiativeBonus),
    ),
    17,
    "center",
  );
  overlay("Speed", custom ? (cs.speed ?? 30) : derived?.speed, 17, "center");
  text("HPMax", hp?.maxHp ?? 0);
  overlay("HPCurrent", hp?.currentHp ?? 0, 17, "center");
  overlay(
    "HPTemp",
    character.temporaryHp ?? character.tempHp ?? 0,
    17,
    "center",
  );
  const successes = Math.max(
    0,
    Math.min(
      3,
      Number(
        character.deathSaves?.successes ?? character.deathSaveSuccesses ?? 0,
      ),
    ),
  );
  const failures = Math.max(
    0,
    Math.min(
      3,
      Number(
        character.deathSaves?.failures ?? character.deathSaveFailures ?? 0,
      ),
    ),
  );
  for (let i = 0; i < 3; i++) {
    check(`Check Box ${12 + i}`, i < successes);
    check(`Check Box ${15 + i}`, i < failures);
  }
  overlay("HDTotal", level, 10.5, "center");
  overlay(
    "HD",
    custom
      ? `${cs.hitDiceRemaining ?? level} ${cs.hitDie ?? ""}`
      : `${character.hitDiceRemaining ?? level} d${classDef?.hitDie ?? classDef?.hitDice ?? 10}`,
    12.5,
    "center",
  );
  overlay(
    "Passive",
    custom
      ? 10 + customSkillTotal("perception", "wis")
      : derived?.passivePerception,
    12,
    "center",
  );
  text("PersonalityTraits ", character.personalityTraits);
  text("Ideals", character.ideals);
  text("Bonds", character.bonds);
  text("Flaws", character.flaws);
  const languages = custom ? cp.languages : derived?.languages;
  const armor = custom
    ? cp.armor
    : (classDef?.armorProficiencies ?? classDef?.armorTraining);
  const weapons = custom
    ? cp.weapons
    : (classDef?.weaponProficiencies ?? classDef?.weaponTraining);
  const tools = custom ? cp.tools : derived?.toolProficiencies;
  text(
    "ProficienciesLang",
    `Languages: ${list(languages)}\nArmor: ${list(armor)}\nWeapons: ${list(weapons)}\nTools: ${list(tools)}`,
  );
  const money = custom ? character.money : (derived?.money ?? character.money);
  for (const k of ["CP", "SP", "EP", "GP", "PP"])
    text(k, money?.[k.toLowerCase()] ?? 0);
  const equipment: any[] = character.equipment ?? [];
  const equipmentText = equipment
    .map((e) => {
      const catalog = campaignItemsById[e.campaignItemId] ?? {};
      return `${safeNumber(e.quantity, 1)}× ${e.name ?? catalog.name ?? e.itemId ?? e.baseItemId ?? "Item"}`;
    })
    .join("\n");
  text("Equipment", equipmentText);
  // Match the live Attacks panel: Unarmed Strike first, then weapon profiles.
  // The print route can occasionally receive no derived equipped-weapon rows,
  // so rebuild a fallback directly from the character's saved equipment.
  const unarmedTraits = custom
    ? [
        ...getTraitCatalogEntries(character.catalogTraitIds ?? []).map(
          (entry) => entry.trait,
        ),
        ...(character.customTraits ?? []),
      ]
    : (derived?.traitGroups ?? []).flatMap((group: any) => group.traits ?? []);
  const unarmedAttack = getUnarmedStrikeAttack({
    abilityScores: scores as any,
    proficiencyBonus: proficiency,
    level,
    traits: unarmedTraits,
    equipment: character.equipment ?? [],
    resolveItem: (entry: any) =>
      resolveItemFromEquipmentEntry(entry, campaignItemsById),
  });

  const getDamageString = (damage: any): string => {
    if (typeof damage === "string") return damage;
    if (!damage || typeof damage !== "object") return "";
    const dice = damage.dice;
    if (
      dice &&
      typeof dice.count === "number" &&
      typeof dice.die === "number"
    ) {
      return `${dice.count}d${dice.die}`;
    }
    return "";
  };

  const fallbackWeaponAttacks = (character.equipment ?? [])
    .map((entry: any) => {
      const item: any = resolveItemFromEquipmentEntry(entry, campaignItemsById);
      if (!item?.weapon) return null;
      const properties: string[] = (item.weapon.properties ?? []).map(
        (p: any) => String(p).toLowerCase(),
      );
      const weaponKind = String(item.weapon.weaponKind ?? "").toLowerCase();
      const isRanged =
        weaponKind.includes("ranged") || properties.includes("ammunition");
      const ability = isRanged
        ? "dex"
        : properties.includes("finesse") &&
            mod(safeNumber(scores.dex, 10)) > mod(safeNumber(scores.str, 10))
          ? "dex"
          : "str";
      const abilityModifier = mod(safeNumber(scores[ability], 10));
      const proficiencies: string[] = custom
        ? (cp.weapons ?? [])
        : (classDef?.weaponProficiencies ??
          classDef?.weaponTraining ??
          classDef?.proficiencies?.weapons ??
          []);
      const normalizedProficiencies = proficiencies.map((value: string) =>
        normalize(String(value)),
      );
      const isSimple = weaponKind.includes("simple");
      const isMartial = weaponKind.includes("martial");
      const proficient =
        normalizedProficiencies.includes("allweapons") ||
        normalizedProficiencies.includes("weapons") ||
        (isSimple &&
          (normalizedProficiencies.includes("simpleweapons") ||
            normalizedProficiencies.includes("simpleweapon"))) ||
        (isMartial &&
          (normalizedProficiencies.includes("martialweapons") ||
            normalizedProficiencies.includes("martialweapon"))) ||
        normalizedProficiencies.some((value: string) =>
          [item.id, item.name, entry.itemId, entry.name].some(
            (candidate) => candidate && value === normalize(String(candidate)),
          ),
        );
      const twoHanded =
        entry.wieldMode === "two-handed" ||
        ((entry.equippedSlots ?? []).includes("main-hand") &&
          (entry.equippedSlots ?? []).includes("off-hand"));
      const damageData =
        twoHanded && item.weapon.versatileDamage
          ? item.weapon.versatileDamage
          : item.weapon.damage;
      const baseDamage = getDamageString(damageData);
      const damageModifier =
        abilityModifier +
        safeNumber(item.damageBonus) +
        safeNumber(entry.damageBonus);
      const damageText = baseDamage
        ? `${baseDamage}${damageModifier === 0 ? "" : damageModifier > 0 ? `+${damageModifier}` : damageModifier} ${damageData?.damageType ?? item.weapon.damage?.damageType ?? ""}`.trim()
        : "";
      return {
        name: item.name ?? entry.name ?? "Weapon",
        attackBonus:
          abilityModifier +
          (proficient ? proficiency : 0) +
          safeNumber(item.attackBonus) +
          safeNumber(entry.attackBonus),
        damage: damageText,
        equipped: Boolean(entry.equipped || (entry.equippedSlots ?? []).length),
      };
    })
    .filter((attack: any) => Boolean(attack));

  const derivedWeapons: any[] =
    !custom && Array.isArray(derived?.equippedWeaponAttacks)
      ? derived.equippedWeaponAttacks
      : [];
  // Prefer the rules engine's computed attacks. If the print route lacks
  // those entries, use resolved equipment as a defensive fallback.
  const weaponAttacks: any[] = derivedWeapons.length
    ? derivedWeapons
    : fallbackWeaponAttacks.sort(
        (a: any, b: any) => Number(b.equipped) - Number(a.equipped),
      );
  const attacks: any[] = [unarmedAttack, ...weaponAttacks].filter(Boolean);
  const attackNameFields = ["Wpn Name", "Wpn Name 2", "Wpn Name 3"];
  const attackBonusFields = [
    "Wpn1 AtkBonus",
    "Wpn2 AtkBonus ",
    "Wpn3 AtkBonus  ",
  ];
  const attackDamageFields = ["Wpn1 Damage", "Wpn2 Damage ", "Wpn3 Damage "];

  attacks.slice(0, 3).forEach((attack, i) => {
    const isUnarmed = attack === unarmedAttack;
    overlay(
      attackNameFields[i],
      isUnarmed ? "Unarmed Strike" : (attack.name ?? ""),
      8.3,
    );
    const bonus = attack.attackBonus ?? attack.toHitBonus ?? attack.bonus;
    overlay(
      attackBonusFields[i],
      typeof bonus === "number" ? signed(bonus) : "",
      9.2,
      "center",
    );
    const damage =
      typeof attack.damage === "string"
        ? attack.damage
        : typeof attack.damageText === "string"
          ? attack.damageText
          : "";
    overlay(
      attackDamageFields[i],
      isUnarmed && /^\d+(?:\s|$)/.test(damage) && !/bludgeoning/i.test(damage)
        ? `${damage} bludgeoning`
        : damage,
      7.8,
    );
  });
  text("AttacksSpellcasting", "");
  const features: any[] = custom
    ? [
        ...getTraitCatalogEntries(character.catalogTraitIds ?? []).map(
          (entry) => ({ ...entry.trait, source: entry.sourceName }),
        ),
        ...(character.customTraits ?? []),
      ]
    : (derived?.traitGroups ?? []).flatMap((group: any) => group.traits ?? []);
  const [mainFeatures, secondFeatures] = featureBoxes(features);
  overlay("Features and Traits", mainFeatures, 8.25);
  overlay("Feat+Traits", secondFeatures, 8.25);
  const backstoryPageTwo = String(
    character.characterBackstory ?? character.notes ?? "",
  );
  text("CharacterName 2", character.name);
  for (const key of ["Age", "Height", "Weight", "Eyes", "Skin", "Hair"])
    text(key, character[key.toLowerCase()]);
  text("Allies", character.alliesAndOrganizations);
  text("Backstory", backstoryPageTwo);
  text("Treasure", character.treasure ?? "");
  text("FactionName", "");
  const rawSpells = custom
    ? (character.customSpellcasting?.spells ?? [])
    : [
        ...(derived?.groupedTieflingLegacySpells ?? []).flatMap(
          (g: any) => g.spells,
        ),
        ...(derived?.groupedSpells ?? []).flatMap((g: any) => g.spells),
      ];
  const unique = new Map<string, any>();
  for (const s of rawSpells) {
    const id = String(s.spellId ?? s.id ?? s.name ?? "");
    const full = spellMap.get(id) ?? {};
    if (id) unique.set(id, { ...full, ...s });
  }
  overlay(
    "Spellcasting Class 2",
    custom ? character.className : derived?.className,
    15,
    "center",
    2,
  );
  const ability = custom
    ? character.customSpellcasting?.ability
    : derived?.spellcastingAbility;
  overlay(
    "SpellcastingAbility 2",
    ability ? label(ability).toUpperCase() : "",
    17,
    "center",
    2,
  );
  const saveDc = ability
    ? 8 + proficiency + mod(safeNumber(scores[ability], 10))
    : "";
  const attackBonus = ability
    ? signed(proficiency + mod(safeNumber(scores[ability], 10)))
    : "";
  overlay(
    "SpellSaveDC  2",
    custom ? saveDc : (derived?.spellSaveDc ?? saveDc),
    17,
    "center",
    2,
  );
  overlay(
    "SpellAtkBonus 2",
    custom ? attackBonus : (derived?.spellAttackBonus ?? attackBonus),
    17,
    "center",
    2,
  );
  const spellLists = Array.from({ length: 10 }, () => [] as string[]);
  for (const s of unique.values()) {
    const n = Math.min(9, Math.max(0, safeNumber(s.level, 0)));
    spellLists[n].push(s.name);
  }
  // PDF widgets use top-left coordinates. Assign names by fixed visual rows,
  // not a heuristic based on bottom-left PDF coordinates.
  const ranges = [
    { level: 0, x0: 0, x1: 205, y0: 155, y1: 300 },
    { level: 1, x0: 0, x1: 205, y0: 350, y1: 550 },
    { level: 2, x0: 0, x1: 205, y0: 565, y1: 760 },
    { level: 3, x0: 205, x1: 405, y0: 165, y1: 365 },
    { level: 4, x0: 205, x1: 405, y0: 395, y1: 600 },
    { level: 5, x0: 205, x1: 405, y0: 620, y1: 760 },
    { level: 6, x0: 405, x1: 620, y0: 165, y1: 330 },
    { level: 7, x0: 405, x1: 620, y0: 340, y1: 480 },
    { level: 8, x0: 405, x1: 620, y0: 510, y1: 625 },
    { level: 9, x0: 405, x1: 620, y0: 645, y1: 760 },
  ];
  const spellFieldPositions: Array<{ name: string; x: number; yTop: number }> =
    [];
  for (const field of form.getFields()) {
    if (!field.getName().startsWith("Spells ")) continue;
    const widget = (field as any).acroField.getWidgets()[0];
    const rect = widget?.getRectangle();
    if (rect) {
      const scale = Math.min(A4_W / 612, A4_H / 792);
      const left = (A4_W - 612 * scale) / 2;
      const top = (A4_H - 792 * scale) / 2;
      spellFieldPositions.push({
        name: field.getName(),
        x: (rect.x - left) / scale,
        yTop: (A4_H - rect.y - rect.height - top) / scale,
      });
    }
  }
  const extraSpellLines: string[] = [];
  for (const range of ranges) {
    const names = spellFieldPositions
      .filter(
        (p) =>
          p.x >= range.x0 &&
          p.x < range.x1 &&
          p.yTop >= range.y0 &&
          p.yTop < range.y1,
      )
      .sort((a, b) => a.yTop - b.yTop)
      .map((x) => x.name);
    const levelSpells = spellLists[range.level].sort((a, b) =>
      a.localeCompare(b),
    );
    names.forEach((name, i) =>
      overlay(name, levelSpells[i] ?? "", 10.5, "left", 2),
    );
    if (levelSpells.length > names.length)
      extraSpellLines.push(
        `Level ${range.level}: ${levelSpells.slice(names.length).join(", ")}`,
      );
  }
  const slotSource = custom
    ? (character.customSpellcasting?.spellSlots ?? {})
    : (derived?.spellSlots ?? {});
  for (let i = 1; i <= 9; i++) {
    const raw = slotSource[i] ?? slotSource[String(i)] ?? 0;
    const maximum = typeof raw === "number" ? raw : (raw.max ?? 0);
    const remaining =
      typeof raw === "number"
        ? (character.spellSlotsRemaining?.[i] ?? raw)
        : (raw.remaining ?? maximum);
    overlay(
      `SlotsTotal ${18 + i}`,
      maximum > 0 ? maximum : "",
      12,
      "center",
      2,
    );
    overlay(
      `SlotsRemaining ${18 + i}`,
      maximum > 0 && maximum - remaining > 0 ? maximum - remaining : "",
      12,
      "center",
      2,
    );
  }
  if (missing.length) console.warn("Missing PDF form fields", missing);
  // The supplied character-template.pdf already has native A4 pages.
  // Do not call scaleContent()/translateContent(): those operations caused
  // the source template to render as completely blank pages.
  for (const page of source.getPages()) {
    const size = page.getSize();
    if (Math.abs(size.width - A4_W) > 2 || Math.abs(size.height - A4_H) > 2) {
      throw new Error(
        "Wrong PDF template. Use the new character-template.pdf (A4) included in this package.",
      );
    }
  }
  const overlayRects = new Map(
    overlays.map((item) => [item.name, rectFor(item.name)]),
  );
  form.flatten();
  // Draw all larger, centered statistics and all bounded text on the flattened PDF.
  // This prevents PDF viewer differences in auto-sized form fields.
  for (const item of overlays) {
    const rect = overlayRects.get(item.name);
    if (!rect) {
      console.warn("Missing overlay field", item.name);
      continue;
    }
    const padding = item.align === "center" ? 0 : 5;
    const width = Math.max(1, rect.width - padding * 2);
    const height = Math.max(1, rect.height - 7);
    const lineHeight = item.size * 1.24;
    const lines = wrap(item.value, width, item.size).slice(
      0,
      Math.max(1, Math.floor(height / lineHeight)),
    );
    const verticalCenter = item.align === "center";
    const textHeight = lines.length * lineHeight;
    // Spell lines in the template sit directly below their short form fields.
    // Lift the text baseline so glyphs rest above the ruled line instead of
    // crossing through it. Keep the existing 10.5pt font size unchanged.
    const spellBaselineLift = item.name.startsWith("Spells ") ? 7.5 : 0;
    const top = verticalCenter
      ? rect.y + rect.height / 2 + textHeight / 2 - item.size
      : rect.y + rect.height - 5 - item.size + spellBaselineLift;
    const pageIndex =
      item.page ??
      ([
        "Feat+Traits",
        "Backstory",
        "Allies",
        "Treasure",
        "Character Appearance",
      ].includes(item.name)
        ? 1
        : 0);
    const targetPage = source.getPage(pageIndex);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const textWidth = font.widthOfTextAtSize(line, item.size);
      targetPage.drawText(line, {
        x:
          item.align === "center"
            ? rect.x + Math.max(0, (rect.width - textWidth) / 2)
            : rect.x + padding,
        y: top - i * lineHeight,
        size: item.size,
        font,
        color: rgb(0.06, 0.06, 0.07),
      });
    }
  }
  return source.save();
}

export default function CharacterSheetPrintPage() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const { character, derived, campaignItemsById, loading, error } =
    useCharacterSheetData(characterId);
  const [pdfUrl, setPdfUrl] = useState("");
  const [buildError, setBuildError] = useState("");
  useEffect(() => {
    if (loading || !character || (!derived && character.buildMode !== "custom"))
      return;
    let cancelled = false;
    let nextUrl = "";
    setBuildError("");
    generate(character, derived, campaignItemsById ?? {})
      .then((bytes) => {
        if (cancelled) return;
        nextUrl = URL.createObjectURL(
          new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
        );
        setPdfUrl(nextUrl);
      })
      .catch(
        (e) =>
          !cancelled &&
          setBuildError(e instanceof Error ? e.message : String(e)),
      );
    return () => {
      cancelled = true;
      if (nextUrl) URL.revokeObjectURL(nextUrl);
    };
  }, [character, derived, campaignItemsById, loading]);
  const fileName = useMemo(
    () =>
      `${(character?.name ?? "character").replace(/[^a-z0-9-_ ]/gi, "")}-character-sheet.pdf`,
    [character?.name],
  );
  return (
    <div className="character-print-page workspace-scrollbar">
      <header className="character-print-toolbar">
        <div>
          <strong>Printable Character Sheet</strong>
          <p>
            {character?.name ?? "Character"} · A4 · 3 template pages · fitted
            text
          </p>
        </div>
        <div className="character-print-actions">
          <button onClick={() => navigate(`/characters/${characterId}`)}>
            Back
          </button>
          <button
            disabled={!pdfUrl}
            onClick={() => {
              const a = document.createElement("a");
              a.href = pdfUrl;
              a.download = fileName;
              a.click();
            }}
          >
            Save PDF
          </button>
          <button
            disabled={!pdfUrl}
            onClick={() => {
              const frame = document.getElementById(
                "character-print-preview",
              ) as HTMLIFrameElement | null;
              frame?.contentWindow?.focus();
              frame?.contentWindow?.print();
            }}
          >
            Print
          </button>
        </div>
      </header>
      {error || buildError ? (
        <p role="alert" className="character-print-error">
          {error || buildError}
        </p>
      ) : null}
      {loading || (!pdfUrl && !buildError) ? (
        <p className="character-print-loading">Preparing A4 sheets…</p>
      ) : null}
      {pdfUrl ? (
        <iframe
          id="character-print-preview"
          className="character-print-preview"
          title={`${character?.name} printable character sheet`}
          src={pdfUrl}
        />
      ) : null}
    </div>
  );
}
