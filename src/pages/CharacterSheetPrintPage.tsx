import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PDFDocument, PDFTextField, PDFCheckBox, StandardFonts, rgb } from "pdf-lib";
import { getTraitCatalogEntries } from "../rulesets/dnd/dnd2024/data/traits/traitCatalog";
import { useCharacterSheetData } from "../features/character-sheet/hooks/useCharacterSheetData";
import { classesById } from "../rulesets/dnd/dnd2024/helpers";
import { spells as spellCatalog } from "../rulesets/dnd/dnd2024/data/spells";
import "./character-sheet-print.css";

const A4_W = 595.2756;
const A4_H = 841.8898;
const templateUrl = "/character-template.pdf";
const abilityKeys = ["str", "dex", "con", "int", "wis", "cha"] as const;
const statFields = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;
const modFields = ["STRmod", "DEXmod ", "CONmod", "INTmod", "WISmod", "CHamod"] as const;
const saveFields = ["ST Strength", "ST Dexterity", "ST Constitution", "ST Intelligence", "ST Wisdom", "ST Charisma"];
const skills: Array<[string, string, string]> = [
  ["acrobatics", "Acrobatics", "dex"], ["animal-handling", "Animal", "wis"],
  ["arcana", "Arcana", "int"], ["athletics", "Athletics", "str"],
  ["deception", "Deception ", "cha"], ["history", "History ", "int"],
  ["insight", "Insight", "wis"], ["intimidation", "Intimidation", "cha"],
  ["investigation", "Investigation ", "int"], ["medicine", "Medicine", "wis"],
  ["nature", "Nature", "int"], ["perception", "Perception ", "wis"],
  ["performance", "Performance", "cha"], ["persuasion", "Persuasion", "cha"],
  ["religion", "Religion", "int"], ["sleight-of-hand", "SleightofHand", "dex"],
  ["stealth", "Stealth ", "dex"], ["survival", "Survival", "wis"],
];
const spellMap = new Map(spellCatalog.map((s) => [s.id, s]));
const mod = (score: number) => Math.floor((score - 10) / 2);
const signed = (n: number) => `${n >= 0 ? "+" : ""}${n}`;
const label = (v: unknown) => String(v ?? "").replace(/[-_]/g, " ").trim();
const list = (v: unknown) => Array.isArray(v) ? v.map(label).filter(Boolean).join(", ") : label(v);
const normalize = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
const safeNumber = (v: unknown, fallback = 0) => typeof v === "number" && Number.isFinite(v) ? v : fallback;

/** The browser preview and exported file use the exact same finished A4 PDF. */
async function generate(character: any, derived: any, campaignItemsById: Record<string, any>): Promise<Uint8Array> {
  const response = await fetch(templateUrl);
  if (!response.ok) throw new Error(`Could not load ${templateUrl}. Place the supplied PDF in public/character-template.pdf.`);
  const source = await PDFDocument.load(await response.arrayBuffer());
  const form = source.getForm();
  const font = await source.embedFont(StandardFonts.Helvetica);
  const byName = new Map(form.getFields().map(field => [field.getName(), field]));
  const missing: string[] = [];
  function text(name: string, value: unknown) {
    const field = byName.get(name);
    if (!(field instanceof PDFTextField)) { missing.push(name); return; }
    const str = String(value ?? "");
    // updateAppearances uses automatic font sizing when the PDF has no /DA font size.
    // setFontSize(0) throws for this template because many fields lack /DA.
    field.setText(str);
    field.updateAppearances(font);
  }
  function check(name: string, value: boolean) {
    const field = byName.get(name);
    if (field instanceof PDFCheckBox) value ? field.check() : field.uncheck();
  }
  const custom = character.buildMode === "custom";
  const cs = character.customStats ?? {};
  const cp = character.customProficiencies ?? {};
  const scores: Record<string, number> = custom ? character.abilityScores ?? {} : derived?.finalAbilityScores ?? {};
  const level = safeNumber(character.level, 1);
  const proficiency = custom ? safeNumber(cs.proficiencyBonus, 2) : safeNumber(derived?.proficiencyBonus, 2);
  const rawSkillRows: any[] = derived?.skillRows ?? [];
  const customSkillProfs = cp.skills ?? {};
  const customSkillTotal = (id: string, ability: string) => {
    const key = Object.keys(customSkillProfs).find(k => normalize(k) === normalize(id));
    const status = customSkillProfs[key ?? id];
    const multiplier = status === "expertise" ? 2 : status === "proficient" ? 1 : 0;
    return mod(safeNumber(scores[ability], 10)) + proficiency * multiplier;
  };
  const customSaves: string[] = cp.savingThrows ?? [];
  const classDef: any = classesById[character.classId as keyof typeof classesById];
  const proficientSaves: string[] = custom ? customSaves : derived?.savingThrowProficiencies ?? [];
  text("CharacterName", character.name);
  text("ClassLevel", `${custom ? character.className ?? "" : derived?.className ?? ""} ${level}`);
  text("Background", custom ? character.backgroundName : derived?.backgroundName);
  text("Race ", custom ? character.speciesName : derived?.speciesName);
  text("Alignment", character.alignment);
  text("XP", custom ? character.xp : derived?.xp ?? character.xp);
  text("PlayerName", character.playerName ?? "");
  text("Inspiration", character.heroicInspiration ? "Yes" : "");
  text("ProfBonus", signed(proficiency));
  abilityKeys.forEach((ability, i) => {
    const score = safeNumber(scores[ability], 10);
    text(statFields[i], score);
    text(modFields[i], signed(mod(score)));
    const proficient = proficientSaves.some(v => normalize(v) === normalize(ability) || normalize(v) === normalize(statFields[i]));
    const saveRow = derived?.saveRows?.find((row: any) => row.id === ability);
    text(saveFields[i], signed(custom ? mod(score) + (proficient ? proficiency : 0) : saveRow?.total ?? mod(score)));
    check(["Check Box 11", "Check Box 18", "Check Box 19", "Check Box 20", "Check Box 21", "Check Box 22"][i], proficient);
  });
  skills.forEach(([id, field, ability], index) => {
    const row = rawSkillRows.find(s => normalize(s.id ?? s.name ?? "") === normalize(id));
    text(field, signed(custom ? customSkillTotal(id, ability) : safeNumber(row?.total, mod(safeNumber(scores[ability], 10)))));
    const customStatus = customSkillProfs[Object.keys(customSkillProfs).find(k => normalize(k) === normalize(id)) ?? id];
    check(`Check Box ${23 + index}`, custom ? customStatus === "proficient" || customStatus === "expertise" : Boolean(row?.proficient));
  });
  const hp = custom ? cs : derived;
  text("AC", custom ? (cs.armorClass ?? cs.manualArmorClass ?? 10) : derived?.armorClass);
  text("Initiative", signed(custom ? mod(safeNumber(scores.dex, 10)) : safeNumber(derived?.initiativeBonus)));
  text("Speed", custom ? cs.speed ?? 30 : derived?.speed);
  text("HPMax", hp?.maxHp ?? 0);
  text("HPCurrent", hp?.currentHp ?? 0);
  text("HPTemp", character.temporaryHp ?? character.tempHp ?? 0);
  const successes = Math.max(0, Math.min(3, Number(character.deathSaves?.successes ?? character.deathSaveSuccesses ?? 0)));
  const failures = Math.max(0, Math.min(3, Number(character.deathSaves?.failures ?? character.deathSaveFailures ?? 0)));
  for (let i = 0; i < 3; i++) {
    check(`Check Box ${12 + i}`, i < successes);
    check(`Check Box ${15 + i}`, i < failures);
  }
  text("HDTotal", level);
  text("HD", custom ? `${cs.hitDiceRemaining ?? level} ${cs.hitDie ?? ""}` : `${character.hitDiceRemaining ?? level} d${classDef?.hitDie ?? classDef?.hitDice ?? 10}`);
  text("Passive", custom ? 10 + customSkillTotal("perception", "wis") : derived?.passivePerception);
  text("PersonalityTraits ", character.personalityTraits);
  text("Ideals", character.ideals);
  text("Bonds", character.bonds);
  text("Flaws", character.flaws);
  const languages = custom ? cp.languages : derived?.languages;
  const armor = custom ? cp.armor : classDef?.armorProficiencies ?? classDef?.armorTraining;
  const weapons = custom ? cp.weapons : classDef?.weaponProficiencies ?? classDef?.weaponTraining;
  const tools = custom ? cp.tools : derived?.toolProficiencies;
  text("ProficienciesLang", `Languages: ${list(languages)}\nArmor: ${list(armor)}\nWeapons: ${list(weapons)}\nTools: ${list(tools)}`);
  const money = custom ? character.money : derived?.money ?? character.money;
  for (const k of ["CP", "SP", "EP", "GP", "PP"]) text(k, money?.[k.toLowerCase()] ?? 0);
  const equipment: any[] = character.equipment ?? [];
  const equipmentText = equipment.map(e => {
    const catalog = campaignItemsById[e.campaignItemId] ?? {};
    return `${safeNumber(e.quantity, 1)}× ${e.name ?? catalog.name ?? e.itemId ?? e.baseItemId ?? "Item"}`;
  }).join("\n");
  text("Equipment", equipmentText);
  const attacks = custom ? [] : derived?.equippedWeaponAttacks ?? [];
  // Custom attack profiles are computed in CustomCharacterSheet, not in this hook.
  // Leave those PDF cells blank rather than printing fabricated modifiers.
  attacks.slice(0, 3).forEach((attack: any, i: number) => {
    text(["Wpn Name", "Wpn Name 2", "Wpn Name 3"][i], attack.name);
    text(["Wpn1 AtkBonus", "Wpn2 AtkBonus ", "Wpn3 AtkBonus  "][i], signed(safeNumber(attack.attackBonus)));
    text(["Wpn1 Damage", "Wpn2 Damage ", "Wpn3 Damage "][i], attack.damage);
  });
  text("AttacksSpellcasting", "");
  const features: any[] = custom
    ? [...getTraitCatalogEntries(character.catalogTraitIds ?? []).map(entry => ({...entry.trait, source: entry.sourceName})), ...(character.customTraits ?? [])]
    : (derived?.traitGroups ?? []).flatMap((group: any) => group.traits ?? []);
  const featureLines = features.map(f => `${f.name ?? "Feature"}: ${f.description ?? ""}${f.notes ? ` (${f.notes})` : ""}`);
  const featureContent = featureLines.join("\n\n");
  // Keep original page areas readable. Any additional content is printed in
  // supplementary A4 pages rather than being silently truncated.
  function splitNear(textValue: string, limit: number): [string, string] {
    if (textValue.length <= limit) return [textValue, ""];
    const cutAt = textValue.lastIndexOf("\n", limit);
    const cut = cutAt >= limit / 2 ? cutAt : textValue.lastIndexOf(" ", limit);
    const pos = cut >= limit / 2 ? cut : limit;
    return [textValue.slice(0, pos), textValue.slice(pos).trimStart()];
  }
  const [mainFeatures, pendingFeatures] = splitNear(featureContent, 850);
  const [secondFeatures, additionalFeatures] = splitNear(pendingFeatures, 850);
  text("Features and Traits", mainFeatures);
  text("Feat+Traits", secondFeatures);
  const [backstoryPageTwo, additionalBackstory] = splitNear(String(character.characterBackstory ?? character.notes ?? ""), 1300);
  text("CharacterName 2", character.name);
  for (const key of ["Age", "Height", "Weight", "Eyes", "Skin", "Hair"]) text(key, character[key.toLowerCase()]);
  text("Allies", character.alliesAndOrganizations);
  text("Backstory", backstoryPageTwo);
  text("Treasure", character.treasure ?? "");
  text("FactionName", "");
  const rawSpells = custom ? character.customSpellcasting?.spells ?? [] : [
    ...(derived?.groupedTieflingLegacySpells ?? []).flatMap((g: any) => g.spells),
    ...(derived?.groupedSpells ?? []).flatMap((g: any) => g.spells),
  ];
  const unique = new Map<string, any>();
  for (const s of rawSpells) {
    const id = String(s.spellId ?? s.id ?? s.name ?? "");
    const full = spellMap.get(id) ?? {};
    if (id) unique.set(id, { ...full, ...s });
  }
  text("Spellcasting Class 2", custom ? character.className : derived?.className);
  const ability = custom ? character.customSpellcasting?.ability : derived?.spellcastingAbility;
  text("SpellcastingAbility 2", ability ? label(ability).toUpperCase() : "");
  const saveDc = ability ? 8 + proficiency + mod(safeNumber(scores[ability], 10)) : "";
  const attackBonus = ability ? signed(proficiency + mod(safeNumber(scores[ability], 10))) : "";
  text("SpellSaveDC  2", custom ? saveDc : derived?.spellSaveDc ?? saveDc);
  text("SpellAtkBonus 2", custom ? attackBonus : derived?.spellAttackBonus ?? attackBonus);
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
  const spellFieldPositions: Array<{name: string; x: number; yTop: number}> = [];
  for (const field of form.getFields()) {
    if (!field.getName().startsWith("Spells ")) continue;
    const widget = (field as any).acroField.getWidgets()[0];
    const rect = widget?.getRectangle();
    if (rect) {
      const scale = Math.min(A4_W / 612, A4_H / 792);
      const left = (A4_W - 612 * scale) / 2;
      const top = (A4_H - 792 * scale) / 2;
      spellFieldPositions.push({ name: field.getName(), x: (rect.x - left) / scale, yTop: (A4_H - rect.y - rect.height - top) / scale });
    }
  }
  const extraSpellLines: string[] = [];
  for (const range of ranges) {
    const names = spellFieldPositions.filter(p => p.x >= range.x0 && p.x < range.x1 && p.yTop >= range.y0 && p.yTop < range.y1)
      .sort((a,b) => a.yTop - b.yTop).map(x => x.name);
    const levelSpells = spellLists[range.level].sort((a,b) => a.localeCompare(b));
    names.forEach((name, i) => text(name, levelSpells[i] ?? ""));
    if (levelSpells.length > names.length) extraSpellLines.push(`Level ${range.level}: ${levelSpells.slice(names.length).join(", ")}`);
  }
  const slotSource = custom ? character.customSpellcasting?.spellSlots ?? {} : derived?.spellSlots ?? {};
  for (let i = 1; i <= 9; i++) {
    const raw = slotSource[i] ?? slotSource[String(i)] ?? 0;
    const maximum = typeof raw === "number" ? raw : raw.max ?? 0;
    const remaining = typeof raw === "number" ? character.spellSlotsRemaining?.[i] ?? raw : raw.remaining ?? maximum;
    text(`SlotsTotal ${18 + i}`, maximum);
    text(`SlotsRemaining ${18 + i}`, maximum - remaining);
  }
  if (missing.length) console.warn("Missing PDF form fields", missing);
  // The supplied character-template.pdf already has native A4 pages.
  // Do not call scaleContent()/translateContent(): those operations caused
  // the source template to render as completely blank pages.
  for (const page of source.getPages()) {
    const size = page.getSize();
    if (Math.abs(size.width - A4_W) > 2 || Math.abs(size.height - A4_H) > 2) {
      throw new Error("Wrong PDF template. Use the new character-template.pdf (A4) included in this package.");
    }
  }
  form.flatten();
  // Continued long-form content gets extra A4 pages, not discarded.
  const continuationSections = [
    { title: "Features & Traits — continued", content: additionalFeatures },
    { title: "Character Backstory — continued", content: additionalBackstory },
    { title: "Spells — continued", content: extraSpellLines.join("\n") },
  ].filter(section => section.content.trim().length > 0);
  for (const section of continuationSections) {
    const availableWidth = A4_W - 84;
    const textSize = 10;
    const lineHeight = 14;
    const maxLines = 48;
    const words = section.content.split(/\s+/);
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, textSize) <= availableWidth) current = candidate;
      else { if (current) lines.push(current); current = word; }
    }
    if (current) lines.push(current);
    for (let start = 0; start < lines.length; start += maxLines) {
      const page = source.addPage([A4_W, A4_H]);
      page.drawText(section.title, { x: 42, y: A4_H - 55, size: 16, font, color: rgb(0, 0, 0) });
      for (let i = 0; i < maxLines && start + i < lines.length; i++) {
        page.drawText(lines[start + i], { x: 42, y: A4_H - 90 - i * lineHeight, size: textSize, font, color: rgb(0, 0, 0) });
      }
    }
  }
  return source.save();
}

export default function CharacterSheetPrintPage() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const { character, derived, campaignItemsById, loading, error } = useCharacterSheetData(characterId);
  const [pdfUrl, setPdfUrl] = useState("");
  const [buildError, setBuildError] = useState("");
  useEffect(() => {
    if (loading || !character || (!derived && character.buildMode !== "custom")) return;
    let cancelled = false;
    let nextUrl = "";
    setBuildError("");
    generate(character, derived, campaignItemsById ?? {})
      .then(bytes => {
        if (cancelled) return;
        nextUrl = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
        setPdfUrl(nextUrl);
      })
      .catch(e => !cancelled && setBuildError(e instanceof Error ? e.message : String(e)));
    return () => { cancelled = true; if (nextUrl) URL.revokeObjectURL(nextUrl); };
  }, [character, derived, campaignItemsById, loading]);
  const fileName = useMemo(() => `${(character?.name ?? "character").replace(/[^a-z0-9-_ ]/gi, "")}-character-sheet.pdf`, [character?.name]);
  return <div className="character-print-page">
    <header className="character-print-toolbar">
      <div><strong>Printable Character Sheet</strong><p>{character?.name ?? "Character"} · A4 · 3 template pages + optional continuations</p></div>
      <div className="character-print-actions">
        <button onClick={() => navigate(`/characters/${characterId}`)}>Back</button>
        <button disabled={!pdfUrl} onClick={() => { const a = document.createElement("a"); a.href = pdfUrl; a.download = fileName; a.click(); }}>Save PDF</button>
        <button disabled={!pdfUrl} onClick={() => { const frame = document.getElementById("character-print-preview") as HTMLIFrameElement | null; frame?.contentWindow?.focus(); frame?.contentWindow?.print(); }}>Print</button>
      </div>
    </header>
    {error || buildError ? <p role="alert" className="character-print-error">{error || buildError}</p> : null}
    {loading || (!pdfUrl && !buildError) ? <p className="character-print-loading">Preparing A4 sheets…</p> : null}
    {pdfUrl ? <iframe id="character-print-preview" className="character-print-preview" title={`${character?.name} printable character sheet`} src={pdfUrl} /> : null}
  </div>;
}
