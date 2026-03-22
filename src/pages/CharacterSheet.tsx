import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  backgroundsById,
  classesById,
  featsById,
  getSubclassById,
  speciesById,
} from "../rulesets/dnd/dnd2024/helpers";
import {
  getXpProgressWithinLevel,
  completePendingLevelUp,
} from "../rulesets/dnd/dnd2024/xpProgression";
import { getPendingLevelUpSteps } from "../rulesets/dnd/dnd2024/getPendingLevelUpSteps";
import { applyLevelUpDecision } from "../rulesets/dnd/dnd2024/applyLevelUpDecision";
import type {
  AbilityKey,
  SkillId,
  LanguageId,
  Money,
  WeaponMasteryChoiceId,
  Trait,
  TraitEffect,
  LevelNumber,
  CharacterSpell,
  SpellId,
} from "../rulesets/dnd/dnd2024/types";

import {
  getSpellById,
  getSpellSlotsForLevel,
  getCantripsKnownForLevel,
  getPreparedSpellCountForLevel,
  getKnownSpellCountForLevel,
} from "../rulesets/dnd/dnd2024/data/spells/helpers";

import type { CharacterSheetData } from "../rulesets/dnd/dnd2024/types";

import { getCharacterHp } from "../rulesets/dnd/dnd2024/getCharacterHp";
import { getAllCharacterTraits } from "../rulesets/dnd/dnd2024/getAllCharacterTraits";
import { getSpeciesTraits } from "../rulesets/dnd/dnd2024/getSpeciesTraits";
import { getSpeciesGrantedFeatIds } from "../rulesets/dnd/dnd2024/getSpeciesGrantedFeatIds";

type CharacterDoc = CharacterSheetData & {
  maxHp?: number;
  currentHp?: number;
  armorClass?: number;
  speed?: number;
  proficiencyBonus?: number;
  initiativeBonus?: number;
  skillProficiencies?: string[];
  toolProficiencies?: string[];
  savingThrowProficiencies?: string[];
  languages?: string[];
  subclassId?: string | null;
  money?: Money;
};

const abilityLabels: Record<AbilityKey, string> = {
  str: "STR",
  dex: "DEX",
  con: "CON",
  int: "INT",
  wis: "WIS",
  cha: "CHA",
};

const abilityFullLabels: Record<AbilityKey, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

const skillAbilityMap: Record<SkillId, AbilityKey> = {
  acrobatics: "dex",
  "animal-handling": "wis",
  arcana: "int",
  athletics: "str",
  deception: "cha",
  history: "int",
  insight: "wis",
  intimidation: "cha",
  investigation: "int",
  medicine: "wis",
  nature: "int",
  perception: "wis",
  performance: "cha",
  persuasion: "cha",
  religion: "int",
  "sleight-of-hand": "dex",
  stealth: "dex",
  survival: "wis",
};

const allSkills: SkillId[] = [
  "acrobatics",
  "animal-handling",
  "arcana",
  "athletics",
  "deception",
  "history",
  "insight",
  "intimidation",
  "investigation",
  "medicine",
  "nature",
  "perception",
  "performance",
  "persuasion",
  "religion",
  "sleight-of-hand",
  "stealth",
  "survival",
];

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatSpellUsage = (usage?: CharacterSpell["usage"]): string | null => {
  if (!usage) return null;

  if (usage.type === "at-will") {
    return "At will";
  }

  if (usage.type === "limited") {
    const count = usage.max ?? 1;

    if (usage.recharge === "long-rest") {
      return `${count} / Long Rest`;
    }

    if (usage.recharge === "short-rest") {
      return `${count} / Short Rest`;
    }

    return `${count} use${count === 1 ? "" : "s"}`;
  }

  return null;
};

const getAbilityModifier = (score: number) => Math.floor((score - 10) / 2);

const getMagicInitiateCastingAbility = (
  spellListId: string | undefined,
): AbilityKey => {
  switch (spellListId) {
    case "cleric":
    case "druid":
      return "wis";
    case "wizard":
      return "int";
    default:
      return "int";
  }
};

const applyBackgroundBonuses = (
  abilityScores: Record<AbilityKey, number>,
  bonuses:
    | {
        plus2: AbilityKey;
        plus1: AbilityKey;
      }
    | undefined,
  allowedOptions: AbilityKey[],
) => {
  const nextScores = { ...abilityScores };

  if (!bonuses) return nextScores;

  const { plus2, plus1 } = bonuses;

  if (allowedOptions.includes(plus2)) {
    nextScores[plus2] += 2;
  }

  if (allowedOptions.includes(plus1) && plus1 !== plus2) {
    nextScores[plus1] += 1;
  }

  return nextScores;
};

const formatModifier = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);

const unique = <T,>(values: T[]) => [...new Set(values)];

const getSneakAttackDice = (level: number) => {
  if (level < 1) return null;
  const dice = Math.ceil(level / 2);
  return `${dice}d6`;
};

const StatCard = ({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string | number;
  subValue?: string;
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {subValue && <p className="mt-1 text-sm text-zinc-400">{subValue}</p>}
    </div>
  );
};

const SectionCard = ({
  title,
  children,
  right,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">
          {title}
        </h2>
        {right}
      </div>
      {children}
    </section>
  );
};

type TraitGroupKey =
  | "species"
  | "class"
  | "subclass"
  | "background"
  | "feats"
  | "other";

type TraitGroup = {
  key: TraitGroupKey;
  title: string;
  subtitle?: string;
  traits: Trait[];
};

const dedupeTraits = (traits: Trait[]) => {
  const seen = new Set<string>();
  const result: Trait[] = [];

  for (const trait of traits) {
    if (seen.has(trait.id)) continue;
    seen.add(trait.id);
    result.push(trait);
  }

  return result;
};

const formatUsage = (usage: Trait["usage"]) => {
  if (!usage) return null;

  if (usage.type === "at-will") {
    return "At will";
  }

  if (usage.type === "limited") {
    if (usage.recharge === "short-rest") return "Limited • Short Rest";
    if (usage.recharge === "long-rest") return "Limited • Long Rest";
    return "Limited use";
  }

  return null;
};

const getEffectLabel = (effect: TraitEffect) => {
  switch (effect.type) {
    case "sense":
      return `${formatLabel(effect.sense)} ${effect.range} ft`;
    case "resistance":
      return `${formatLabel(effect.damageType)} resistance`;
    case "advantage-on-saving-throws-against":
      return `Advantage vs ${effect.conditions.map(formatLabel).join(", ")}`;
    case "advantage-on-saving-throws":
      return `Advantage on ${effect.abilities.map((a) => a.toUpperCase()).join(", ")} saves`;
    case "hp-max-bonus":
      return "HP maximum bonus";
    case "spell":
      return `Spell: ${effect.spellId}`;
    case "healing":
      return "Healing";
    case "transformation":
      return "Transformation";
    case "speed-bonus":
      return `${formatLabel(effect.speedType)} speed`;
    case "aoe-damage":
      return "Area damage";
    case "condition":
      return `Condition: ${formatLabel(effect.condition)}`;
    case "light":
      return "Creates light";
    case "choice-ref":
      return "Choice";
    case "text":
      return "Special effect";
    default:
      return "Feature";
  }
};

const getGroupMeta = (key: TraitGroupKey) => {
  switch (key) {
    case "species":
      return {
        label: "SP",
        className: "border-sky-500/20 bg-sky-500/10 text-sky-300",
      };
    case "class":
      return {
        label: "CL",
        className: "border-violet-500/20 bg-violet-500/10 text-violet-300",
      };
    case "subclass":
      return {
        label: "SC",
        className: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300",
      };
    case "background":
      return {
        label: "BG",
        className: "border-amber-500/20 bg-amber-500/10 text-amber-300",
      };
    case "feats":
      return {
        label: "FT",
        className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      };
    default:
      return {
        label: "TR",
        className: "border-white/10 bg-white/5 text-zinc-300",
      };
  }
};

const SourceBadge = ({ groupKey }: { groupKey: TraitGroupKey }) => {
  const meta = getGroupMeta(groupKey);

  return (
    <div
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border text-[11px] font-bold tracking-[0.18em] ${meta.className}`}
    >
      {meta.label}
    </div>
  );
};

const TraitPill = ({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent";
}) => {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${
        tone === "accent"
          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          : "border border-white/10 bg-zinc-800 text-zinc-300"
      }`}
    >
      {children}
    </span>
  );
};

const TraitCard = ({ trait }: { trait: Trait }) => {
  const usageLabel = formatUsage(trait.usage);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold text-white">{trait.name}</p>

              {typeof trait.level === "number" && (
                <TraitPill>Level {trait.level}</TraitPill>
              )}

              {typeof trait.minLevel === "number" &&
                typeof trait.level !== "number" && (
                  <TraitPill>Min Level {trait.minLevel}</TraitPill>
                )}

              {trait.activation && (
                <TraitPill>{formatLabel(trait.activation)}</TraitPill>
              )}

              {usageLabel && <TraitPill tone="accent">{usageLabel}</TraitPill>}
            </div>

            {trait.description && (
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {trait.description}
              </p>
            )}
          </div>
        </div>

        {trait.effects && trait.effects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {trait.effects.map((effect, index) => (
              <TraitPill key={`${trait.id}-effect-${index}`}>
                {getEffectLabel(effect)}
              </TraitPill>
            ))}
          </div>
        )}

        {trait.choices && trait.choices.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Choices
            </p>

            <div className="space-y-3">
              {trait.choices.map((choice) => (
                <div key={choice.id}>
                  <p className="text-sm font-medium text-zinc-200">
                    {choice.name} • Choose {choice.choose}
                  </p>

                  {choice.options?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {choice.options.map((option) => (
                        <TraitPill key={option.id}>{option.name}</TraitPill>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {trait.notes && trait.notes.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Notes
            </p>

            <ul className="space-y-1 text-sm text-zinc-400">
              {trait.notes.map((note, index) => (
                <li key={`${trait.id}-note-${index}`}>• {note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const TraitGroupSection = ({
  group,
  isOpen,
  onToggle,
}: {
  group: TraitGroup;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-white/5"
      >
        <div className="flex min-w-0 items-center gap-3">
          <SourceBadge groupKey={group.key} />

          <div className="min-w-0">
            <p className="text-base font-semibold text-white">{group.title}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {group.subtitle ??
                `${group.traits.length} trait${group.traits.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
          {isOpen ? "Hide" : "Show"}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-white/10 px-4 py-4">
          <div className="space-y-3">
            {group.traits.map((trait) => (
              <TraitCard key={trait.id} trait={trait} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const collectSpellSelectionsFromLevelUp = (
  levelUpDecisions: Record<number, any> | undefined,
  maxLevel: number,
) => {
  const cantripIds: SpellId[] = [];
  const spellSelections: Array<{ spellId: SpellId; level: number }> = [];

  if (!levelUpDecisions) {
    return { cantripIds, spellSelections };
  }

  const sortedLevels = Object.keys(levelUpDecisions)
    .map(Number)
    .filter((level) => level <= maxLevel)
    .sort((a, b) => a - b);

  for (const level of sortedLevels) {
    const decision = levelUpDecisions[level];
    if (!decision) continue;

    if (Array.isArray(decision.cantripChoices)) {
      for (const spellId of decision.cantripChoices) {
        if (!cantripIds.includes(spellId)) {
          cantripIds.push(spellId);
        }
      }
    }

    if (Array.isArray(decision.spellChoices)) {
      for (const spell of decision.spellChoices) {
        if (
          spell &&
          typeof spell.spellId === "string" &&
          !spellSelections.some((s) => s.spellId === spell.spellId)
        ) {
          spellSelections.push(spell);
        }
      }
    }
  }

  return { cantripIds, spellSelections };
};

const getOrdinalSuffix = (value: number) => {
  if (value % 100 >= 11 && value % 100 <= 13) return "th";

  switch (value % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const CharacterSheet = () => {
  const { characterId } = useParams();
  const { user } = useAuth();

  const [character, setCharacter] = useState<CharacterDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openTraitGroups, setOpenTraitGroups] = useState<
    Record<TraitGroupKey, boolean>
  >({
    species: true,
    class: true,
    subclass: true,
    background: true,
    feats: true,
    other: false,
  });

  useEffect(() => {
    const loadCharacter = async () => {
      if (!characterId) {
        setError("Missing character ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const snap = await getDoc(doc(db, "characters", characterId));

        if (!snap.exists()) {
          setError("Character not found.");
          setCharacter(null);
          setLoading(false);
          return;
        }

        const data = snap.data() as CharacterDoc;

        setCharacter(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load character.");
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [characterId, user]);

  const toggleTraitGroup = (key: TraitGroupKey) => {
    setOpenTraitGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleApplyDecision = (
    level: number,
    decision:
      | { subclassId: string }
      | { featId: string }
      | { expertise: Array<SkillId | "thieves-tools"> }
      | { language: LanguageId }
      | { weaponMastery: WeaponMasteryChoiceId[] },
  ) => {
    if (!character) return;

    const updated = applyLevelUpDecision(character as any, level, decision);
    setCharacter(updated as CharacterDoc);
  };

  const handleCompleteLevelUp = () => {
    if (!character) return;

    const updated = completePendingLevelUp(character as any);
    setCharacter(updated as CharacterDoc);
  };

  const derived = useMemo(() => {
    if (!character) return null;

    const background = backgroundsById[character.backgroundId];
    const classDef = classesById[character.classId];

    const finalAbilityScores = applyBackgroundBonuses(
      character.abilityScores,
      character.choices?.backgroundAbilityBonuses,
      background?.abilityOptions ?? [],
    );

    const proficiencyBonus =
      character.derived?.stats?.proficiencyBonus ??
      character.proficiencyBonus ??
      2 + Math.floor((character.level - 1) / 4);

    const strMod = getAbilityModifier(finalAbilityScores.str);
    const dexMod = getAbilityModifier(finalAbilityScores.dex);
    const wisMod = getAbilityModifier(finalAbilityScores.wis);

    const fallbackSkillProficiencies = unique<SkillId>([
      ...(background?.skillProficiencies ?? []),
      ...(character.choices?.classSkillChoices ?? []),
    ]);

    const skillProficiencies = unique<SkillId>([
      ...(character.derived?.skillProficiencies ?? []),
      ...((character.skillProficiencies as SkillId[] | undefined) ?? []),
      ...fallbackSkillProficiencies,
    ]);

    const expertise = unique<SkillId | "thieves-tools">([
      ...((character.derived?.expertise ?? []) as Array<
        SkillId | "thieves-tools"
      >),
      ...(character.choices?.rogueExpertiseChoices ?? []),
    ]);

    const savingThrowProficiencies = unique<AbilityKey>([
      ...(character.derived?.savingThrowProficiencies ?? []),
      ...((character.savingThrowProficiencies as AbilityKey[] | undefined) ??
        []),
      ...(classDef?.savingThrowProficiencies ?? []),
    ]);

    const skillRows = allSkills.map((skill) => {
      const ability = skillAbilityMap[skill];
      const baseMod = getAbilityModifier(finalAbilityScores[ability]);
      const proficient = skillProficiencies.includes(skill);
      const expertiseApplies = expertise.includes(skill);

      const total =
        baseMod +
        (proficient ? proficiencyBonus : 0) +
        (expertiseApplies ? proficiencyBonus : 0);

      return {
        id: skill,
        name: formatLabel(skill),
        ability,
        proficient,
        expertise: expertiseApplies,
        total,
      };
    });

    const saveRows = (Object.keys(abilityLabels) as AbilityKey[]).map(
      (ability) => {
        const baseMod = getAbilityModifier(finalAbilityScores[ability]);
        const proficient = savingThrowProficiencies.includes(ability);
        const total = baseMod + (proficient ? proficiencyBonus : 0);

        return {
          id: ability,
          name: abilityFullLabels[ability],
          proficient,
          total,
        };
      },
    );

    const hpData = getCharacterHp(character as any);

    const genericAttackBonuses = {
      strengthWeapon: strMod + proficiencyBonus,
      finesseOrRanged: dexMod + proficiencyBonus,
      unarmed: strMod + proficiencyBonus,
    };

    const rogueSneakAttack =
      character.classId === "rogue"
        ? getSneakAttackDice(character.level)
        : null;

    const xp = character.xp ?? 0;
    const xpProgress = getXpProgressWithinLevel(xp);
    const pendingSteps = getPendingLevelUpSteps(character as any);

    const levelUpDecisions = character.choices?.levelUpDecisions ?? {};

    const speciesTraits = dedupeTraits(
      getSpeciesTraits(character.speciesId, character.choices),
    );

    const classTraits = dedupeTraits(
      Array.from({ length: character.level }, (_, index) => index + 1).flatMap(
        (level) => classDef?.featuresByLevel[level] ?? [],
      ),
    );

    const selectedSubclassId =
      character.subclassId ??
      character.choices?.subclassId ??
      Object.values(levelUpDecisions).find(
        (decision: any) => typeof decision?.subclassId === "string",
      )?.subclassId ??
      null;

    const subclassDef = selectedSubclassId
      ? getSubclassById(selectedSubclassId)
      : null;

    const subclassTraits = dedupeTraits(
      subclassDef
        ? Array.from(
            { length: character.level },
            (_, index) => index + 1,
          ).flatMap((level) => subclassDef.featuresByLevel[level] ?? [])
        : [],
    );

    const classOrSubclassSpellcasting =
      subclassDef?.spellcasting ?? classDef?.spellcasting ?? null;

    const backgroundFeatSpellListId =
      character.choices?.backgroundFeatSpellListId;

    const backgroundFeatCantripChoices =
      character.choices?.backgroundFeatCantripChoices ?? [];

    const backgroundFeatSpellChoices =
      character.choices?.backgroundFeatSpellChoices ?? [];

    const hasBackgroundMagicInitiate =
      character.originFeatId === "magic-initiate" &&
      !!backgroundFeatSpellListId &&
      (backgroundFeatCantripChoices.length > 0 ||
        backgroundFeatSpellChoices.length > 0);

    const magicInitiateSpellcasting = hasBackgroundMagicInitiate
      ? {
          id: "background-magic-initiate",
          name: `Magic Initiate (${formatLabel(backgroundFeatSpellListId!)})`,
          sourceType: "feat" as const,
          sourceId: "magic-initiate",
          castingAbility: getMagicInitiateCastingAbility(
            backgroundFeatSpellListId,
          ),
          spellListId: backgroundFeatSpellListId,
          preparationMode: "known" as const,
          progressionType: "custom" as const,
        }
      : null;

    const activeSpellcasting =
      classOrSubclassSpellcasting ?? magicInitiateSpellcasting;

    const spellcastingAbility = activeSpellcasting?.castingAbility ?? null;

    const spellcastingAbilityMod = spellcastingAbility
      ? getAbilityModifier(finalAbilityScores[spellcastingAbility])
      : null;

    const spellSaveDc =
      spellcastingAbilityMod !== null
        ? 8 + proficiencyBonus + spellcastingAbilityMod
        : null;

    const spellAttackBonus =
      spellcastingAbilityMod !== null
        ? proficiencyBonus + spellcastingAbilityMod
        : null;

    const spellSlots = classOrSubclassSpellcasting
      ? getSpellSlotsForLevel(
          classOrSubclassSpellcasting,
          character.level as LevelNumber,
        )
      : {};

    const cantripsKnownCapacity = classOrSubclassSpellcasting
      ? getCantripsKnownForLevel(
          classOrSubclassSpellcasting,
          character.level as LevelNumber,
        )
      : hasBackgroundMagicInitiate
        ? 2
        : 0;

    const spellListCapacity = classOrSubclassSpellcasting?.preparedSpells
      ? getPreparedSpellCountForLevel(
          classOrSubclassSpellcasting,
          character.level as LevelNumber,
        )
      : 0;

    const knownSpellCapacity = classOrSubclassSpellcasting?.learnedSpells
      ? getKnownSpellCountForLevel(
          classOrSubclassSpellcasting,
          character.level as LevelNumber,
        )
      : hasBackgroundMagicInitiate
        ? 1
        : 0;

    const collectedSpellChoices = collectSpellSelectionsFromLevelUp(
      levelUpDecisions,
      character.level,
    );

    const fixedCantripIds =
      classOrSubclassSpellcasting?.cantrips?.fixedKnown ?? [];

    const allKnownCantripIds = unique<SpellId>([
      ...fixedCantripIds,
      ...collectedSpellChoices.cantripIds,
    ]);

    const selectedCantripCount =
      allKnownCantripIds.length + backgroundFeatCantripChoices.length;

    const selectedLeveledSpellCount =
      collectedSpellChoices.spellSelections.length +
      backgroundFeatSpellChoices.length;

    const missingSpellListCount =
      activeSpellcasting?.preparationMode === "custom" && spellListCapacity > 0
        ? Math.max(0, spellListCapacity - selectedLeveledSpellCount)
        : 0;

    const sourceType =
      activeSpellcasting?.sourceType ??
      (hasBackgroundMagicInitiate ? ("feat" as const) : ("subclass" as const));

    const sourceId =
      activeSpellcasting?.sourceId ??
      (hasBackgroundMagicInitiate
        ? "magic-initiate"
        : (selectedSubclassId ?? character.classId));

    const derivedKnownSpells: CharacterSpell[] = [
      ...allKnownCantripIds.map((spellId) => ({
        spellId,
        level: 0 as const,
        sourceType,
        sourceId,
        known: true,
        prepared: false,
        countsAgainstKnownLimit: true,
        countsAgainstPreparationLimit: false,
      })),
      ...collectedSpellChoices.spellSelections.map((selection) => ({
        spellId: selection.spellId,
        level: selection.level as any,
        sourceType,
        sourceId,
        known: true,
        prepared: false,
        countsAgainstKnownLimit: true,
        countsAgainstPreparationLimit: true,
      })),
      ...backgroundFeatCantripChoices.map((spellId) => ({
        spellId,
        level: 0 as const,
        sourceType: "feat" as const,
        sourceId: "magic-initiate",
        known: true,
        prepared: false,
        countsAgainstKnownLimit: false,
        countsAgainstPreparationLimit: false,
        usage: {
          type: "at-will" as const,
        },
      })),
      ...backgroundFeatSpellChoices.map((selection) => ({
        spellId: selection.spellId,
        level: selection.level,
        sourceType: "feat" as const,
        sourceId: "magic-initiate",
        known: true,
        prepared: false,
        countsAgainstKnownLimit: false,
        countsAgainstPreparationLimit: false,
        usage: {
          type: "limited" as const,
          recharge: "long-rest" as const,
          max: 1,
        },
      })),
    ];

    const spells = unique(derivedKnownSpells.map((spell) => spell.spellId))
      .map((spellId) =>
        derivedKnownSpells.find((spell) => spell.spellId === spellId),
      )
      .filter((spell): spell is NonNullable<typeof spell> => Boolean(spell))
      .map((spell) => {
        const spellData = getSpellById(spell.spellId);

        return {
          ...spell,
          level: spellData?.level ?? spell.level,
          school: spellData?.school,
          name: spellData?.name ?? spell.spellId,
        };
      })
      .sort((a, b) => {
        const levelDiff = (a.level ?? 0) - (b.level ?? 0);
        if (levelDiff !== 0) return levelDiff;
        return a.name.localeCompare(b.name);
      });

    const groupedSpells = spells
      .reduce<
        Array<{
          level: number;
          title: string;
          spells: typeof spells;
        }>
      >((groups, spell) => {
        const spellLevel = spell.level ?? 0;

        let group = groups.find((entry) => entry.level === spellLevel);

        if (!group) {
          group = {
            level: spellLevel,
            title:
              spellLevel === 0
                ? "Cantrips"
                : `${spellLevel}${getOrdinalSuffix(spellLevel)}-Level Spells`,
            spells: [],
          };
          groups.push(group);
        }

        group.spells.push(spell);
        return groups;
      }, [])
      .sort((a, b) => a.level - b.level)
      .map((group) => ({
        ...group,
        spells: [...group.spells].sort((a, b) => a.name.localeCompare(b.name)),
      }));

    const backgroundTraits = dedupeTraits(
      background?.originFeatId
        ? (featsById[background.originFeatId]?.traits ?? [])
        : [],
    );

    const originFeatTraits = dedupeTraits(
      character.originFeatId
        ? (featsById[character.originFeatId]?.traits ?? [])
        : [],
    );

    const speciesGrantedFeatTraits = dedupeTraits(
      getSpeciesGrantedFeatIds(character.speciesId, character.choices).flatMap(
        (featId) => featsById[featId]?.traits ?? [],
      ),
    );

    const levelUpFeatTraits = dedupeTraits(
      Object.values(levelUpDecisions).flatMap((decision: any) =>
        decision?.featId ? (featsById[decision.featId]?.traits ?? []) : [],
      ),
    );

    const featTraits = dedupeTraits([
      ...originFeatTraits,
      ...speciesGrantedFeatTraits,
      ...levelUpFeatTraits,
    ]);

    const allTraits = getAllCharacterTraits(character as any);

    const groupedTraitCandidates: TraitGroup[] = [
      {
        key: "species",
        title: `${speciesById[character.speciesId]?.name ?? "Species"} Traits`,
        subtitle: "Ancestry, senses, resistances, innate gifts",
        traits: speciesTraits,
      },
      {
        key: "class",
        title: `${classDef?.name ?? "Class"} Features`,
        subtitle: "Features gained from your class levels",
        traits: classTraits,
      },
      {
        key: "subclass",
        title: `${subclassDef?.name ?? "Subclass"} Features`,
        subtitle: "Specialized features from your subclass",
        traits: subclassTraits,
      },
      {
        key: "background",
        title: `${background?.name ?? "Background"} Traits`,
        subtitle: "Background benefits and granted origin feature",
        traits: backgroundTraits,
      },
      {
        key: "feats",
        title: "Feats & Special Training",
        subtitle: "Origin feat, species-granted feats, and level-up feats",
        traits: featTraits,
      },
    ];

    const groupedTraits: TraitGroup[] = groupedTraitCandidates
      .filter((group) => group.traits.length > 0)
      .map((group) => ({
        ...group,
        traits: dedupeTraits(group.traits),
      }));

    const groupedTraitIds = new Set(
      groupedTraits.flatMap((group) => group.traits.map((trait) => trait.id)),
    );

    const otherTraits = allTraits.filter(
      (trait) => !groupedTraitIds.has(trait.id),
    );

    if (otherTraits.length > 0) {
      groupedTraits.push({
        key: "other",
        title: "Other Traits",
        subtitle: "Rules content not yet assigned to a source group",
        traits: dedupeTraits(otherTraits),
      });
    }

    return {
      className: classDef?.name ?? character.classId,
      speciesName:
        speciesById[character.speciesId]?.name ?? character.speciesId,
      backgroundName: background?.name ?? character.backgroundId,
      featName: character.originFeatId
        ? character.originFeatId === "magic-initiate" &&
          backgroundFeatSpellListId
          ? `${featsById[character.originFeatId]?.name ?? character.originFeatId} (${formatLabel(backgroundFeatSpellListId)})`
          : (featsById[character.originFeatId]?.name ?? character.originFeatId)
        : null,
      subclassName: subclassDef?.name ?? null,
      proficiencyBonus,
      initiativeBonus:
        character.derived?.stats?.initiativeBonus ??
        character.initiativeBonus ??
        dexMod,
      passivePerception:
        character.derived?.stats?.passivePerception ?? 10 + wisMod,
      armorClass:
        character.derived?.stats?.armorClass ??
        character.armorClass ??
        10 + dexMod,
      speed: character.derived?.stats?.speed ?? character.speed ?? 30,
      currentHp: hpData.currentHp,
      maxHp: hpData.maxHp,
      finalAbilityScores,
      skillRows,
      saveRows,
      skillProficiencies,
      savingThrowProficiencies,
      toolProficiencies:
        character.derived?.toolProficiencies ??
        character.toolProficiencies ??
        (background?.toolProficiency ? [background.toolProficiency] : []),
      languages:
        character.derived?.languages ??
        character.languages ??
        speciesById[character.speciesId]?.languages ??
        [],
      expertise,
      genericAttackBonuses,
      rogueSneakAttack,
      xp,
      xpProgress,
      pendingSteps,
      traitGroups: groupedTraits,
      activeSpellcasting,
      spellcastingAbility,
      spellcastingAbilityMod,
      spellSaveDc,
      spellAttackBonus,
      spellSlots,
      cantripsKnown: cantripsKnownCapacity,
      spellsKnown: knownSpellCapacity,
      spellsPrepared: spellListCapacity,
      missingSpellListCount,
      spells,
      groupedSpells,
      selectedCantripCount,
      selectedLeveledSpellCount,
      money: {
        cp: character.money?.cp ?? 0,
        sp: character.money?.sp ?? 0,
        ep: character.money?.ep ?? 0,
        gp: character.money?.gp ?? 0,
        pp: character.money?.pp ?? 0,
      },
    };
  }, [character]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-zinc-400">Loading character...</p>
        </div>
      </div>
    );
  }

  if (error || !character || !derived) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            {error || "Something went wrong."}
          </div>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 shadow-2xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Character Sheet
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {character.name}
              </h1>

              <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
                {derived.speciesName} • {derived.className}
                {derived.subclassName ? ` • ${derived.subclassName}` : ""} •
                Level {character.level}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                  Background: {derived.backgroundName}
                </span>

                {derived.featName && (
                  <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                    Origin Feat: {derived.featName}
                  </span>
                )}

                {character.alignment && (
                  <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                    {character.alignment}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back home
              </Link>

              <Link
                to={`/characters/${characterId}/edit`}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Edit character
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <StatCard
            label="HP"
            value={`${derived.currentHp}/${derived.maxHp}`}
            subValue="Current / Max"
          />
          <StatCard label="AC" value={derived.armorClass} />
          <StatCard
            label="Initiative"
            value={formatModifier(derived.initiativeBonus)}
          />
          <StatCard label="Speed" value={`${derived.speed} ft`} />
          <StatCard
            label="Prof Bonus"
            value={formatModifier(derived.proficiencyBonus)}
          />
          <StatCard
            label="Passive Perception"
            value={derived.passivePerception}
          />
        </div>

        <div className="mb-6 flex flex-col gap-6">
          <SectionCard title="Progression">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>XP</span>
                  <span>
                    {derived.xp} / {derived.xpProgress.nextLevelXp ?? "MAX"}
                  </span>
                </div>

                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full bg-white"
                    style={{
                      width: `${derived.xpProgress.progressPercent}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-zinc-500">
                  <span>Level {derived.xpProgress.level}</span>
                  <span>
                    {derived.xpProgress.nextLevelXp === null
                      ? "Max level reached"
                      : `${derived.xpProgress.progressXp}/${derived.xpProgress.neededXp} XP this level`}
                  </span>
                </div>
              </div>

              {character.pendingLevelUp && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300">
                  Level up available! ({character.pendingLevelUp.fromLevel} →{" "}
                  {character.pendingLevelUp.toLevel})
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Features & Traits"
            right={
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
                {derived.traitGroups.reduce(
                  (total, group) => total + group.traits.length,
                  0,
                )}{" "}
                total
              </div>
            }
          >
            {derived.traitGroups.length > 0 ? (
              <div className="space-y-3">
                {derived.traitGroups.map((group) => (
                  <TraitGroupSection
                    key={group.key}
                    group={group}
                    isOpen={openTraitGroups[group.key]}
                    onToggle={() => toggleTraitGroup(group.key)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No traits found yet.</p>
            )}
          </SectionCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            {derived.pendingSteps.length > 0 && (
              <SectionCard title="Level Up">
                <div className="space-y-3">
                  {derived.pendingSteps.map((step) => (
                    <div
                      key={step.id}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium text-white">{step.title}</p>
                          <p className="text-xs text-zinc-500">
                            Level {step.level}
                          </p>
                          {step.description && (
                            <p className="mt-2 text-sm text-zinc-400">
                              {step.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {step.type === "subclass-choice" && (
                            <button
                              onClick={() =>
                                handleApplyDecision(step.level, {
                                  subclassId: "assassin",
                                })
                              }
                              className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
                            >
                              Choose
                            </button>
                          )}

                          {step.type === "feat-choice" && (
                            <button
                              onClick={() =>
                                handleApplyDecision(step.level, {
                                  featId: "alert",
                                })
                              }
                              className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
                            >
                              Choose
                            </button>
                          )}

                          {step.type === "expertise-choice" && (
                            <button
                              onClick={() =>
                                handleApplyDecision(step.level, {
                                  expertise: ["stealth", "perception"],
                                })
                              }
                              className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
                            >
                              Choose
                            </button>
                          )}

                          {step.type === "language-choice" && (
                            <button
                              onClick={() =>
                                handleApplyDecision(step.level, {
                                  language: "elvish" as LanguageId,
                                })
                              }
                              className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
                            >
                              Choose
                            </button>
                          )}

                          {step.type === "weapon-mastery-choice" && (
                            <button
                              onClick={() =>
                                handleApplyDecision(step.level, {
                                  weaponMastery: [
                                    "dagger",
                                    "shortsword",
                                  ] as WeaponMasteryChoiceId[],
                                })
                              }
                              className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
                            >
                              Choose
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleCompleteLevelUp}
                    className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
                  >
                    Complete Level Up
                  </button>
                </div>
              </SectionCard>
            )}

            <SectionCard title="Ability Scores">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(Object.keys(derived.finalAbilityScores) as AbilityKey[]).map(
                  (key) => {
                    const score = derived.finalAbilityScores[key];
                    const mod = getAbilityModifier(score);
                    const baseScore = character.abilityScores[key];
                    const bonus = score - baseScore;

                    return (
                      <div
                        key={key}
                        className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                          {abilityLabels[key]}
                        </p>
                        <div className="mt-3 flex items-end justify-between">
                          <p className="text-3xl font-bold text-white">
                            {score}
                          </p>
                          <p className="text-lg font-semibold text-zinc-300">
                            {formatModifier(mod)}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-zinc-500">
                          Base {baseScore}
                          {bonus > 0 ? ` • +${bonus} background` : ""}
                        </p>
                      </div>
                    );
                  },
                )}
              </div>
            </SectionCard>

            <SectionCard title="Combat">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm font-semibold text-zinc-200">
                    Weapon Attack Bonuses
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-zinc-300">
                    <div className="flex items-center justify-between">
                      <span>Strength-based weapon</span>
                      <span className="font-semibold">
                        {formatModifier(
                          derived.genericAttackBonuses.strengthWeapon,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Finesse / ranged weapon</span>
                      <span className="font-semibold">
                        {formatModifier(
                          derived.genericAttackBonuses.finesseOrRanged,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Unarmed strike</span>
                      <span className="font-semibold">
                        {formatModifier(derived.genericAttackBonuses.unarmed)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-zinc-500">
                    These are generic bonuses for proficient attacks. Exact
                    weapon entries will be more precise once weapon data is
                    added.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm font-semibold text-zinc-200">
                    Class Combat Features
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-zinc-300">
                    {derived.rogueSneakAttack && (
                      <div className="flex items-center justify-between">
                        <span>Sneak Attack</span>
                        <span className="font-semibold">
                          {derived.rogueSneakAttack}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Initiative</span>
                      <span className="font-semibold">
                        {formatModifier(derived.initiativeBonus)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Armor Class</span>
                      <span className="font-semibold">
                        {derived.armorClass}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Skills">
              <div className="grid gap-2">
                {derived.skillRows.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-white">{skill.name}</p>
                        <span className="rounded-full border border-white/10 bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                          {abilityLabels[skill.ability]}
                        </span>
                        {skill.proficient && (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                            Proficient
                          </span>
                        )}
                        {skill.expertise && (
                          <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-blue-300">
                            Expertise
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="ml-4 text-sm font-semibold text-zinc-200">
                      {formatModifier(skill.total)}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Saving Throws">
              <div className="grid gap-3 sm:grid-cols-2">
                {derived.saveRows.map((save) => (
                  <div
                    key={save.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-white">{save.name}</p>
                      {save.proficient && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                          Proficient
                        </span>
                      )}
                    </div>

                    <p className="ml-4 text-sm font-semibold text-zinc-200">
                      {formatModifier(save.total)}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Tools">
              {derived.toolProficiencies.length > 0 ? (
                <div className="grid gap-3">
                  {derived.toolProficiencies.map((tool) => {
                    const expertiseApplies = derived.expertise.includes(
                      tool as SkillId | "thieves-tools",
                    );

                    return (
                      <div
                        key={tool}
                        className="rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-white">
                              {formatLabel(tool)}
                            </p>
                            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                              Proficient
                            </span>
                            {expertiseApplies && (
                              <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-blue-300">
                                Expertise
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-zinc-300">
                            +PB
                            {expertiseApplies
                              ? ` + doubled proficiency (${formatModifier(
                                  derived.proficiencyBonus * 2,
                                )})`
                              : ` (${formatModifier(derived.proficiencyBonus)})`}
                          </p>
                        </div>

                        <p className="mt-2 text-xs text-zinc-500">
                          Tool checks use a relevant ability chosen by the DM or
                          situation, plus your proficiency bonus if proficient.
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  No tool proficiencies yet.
                </p>
              )}
            </SectionCard>

            <SectionCard title="Inventory">
              {character.equipment?.length ? (
                <div className="space-y-3">
                  {character.equipment.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                    >
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        {item.equipped && (
                          <p className="mt-1 text-xs text-zinc-500">Equipped</p>
                        )}
                      </div>
                      <p className="text-sm text-zinc-300">x{item.quantity}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No equipment added yet.</p>
              )}
            </SectionCard>

            <SectionCard title="Spells">
              {derived.activeSpellcasting ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Spellcasting Ability
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {derived.spellcastingAbility
                          ? abilityFullLabels[derived.spellcastingAbility]
                          : "—"}
                      </p>
                      {derived.spellcastingAbilityMod !== null && (
                        <p className="mt-1 text-sm text-zinc-400">
                          Mod {formatModifier(derived.spellcastingAbilityMod)}
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Spell Save DC
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {derived.spellSaveDc ?? "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Spell Attack Bonus
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {derived.spellAttackBonus !== null
                          ? formatModifier(derived.spellAttackBonus)
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Spellcasting Source
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {derived.subclassName ?? derived.className}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                    <p className="text-sm font-semibold text-zinc-200">
                      Spell Slots
                    </p>

                    {Object.keys(derived.spellSlots).length > 0 ? (
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {Object.entries(derived.spellSlots).map(
                          ([slotLevel, count]) => (
                            <div
                              key={slotLevel}
                              className="rounded-xl border border-white/10 bg-zinc-950/60 p-3"
                            >
                              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                                Level {slotLevel}
                              </p>
                              <p className="mt-2 text-xl font-bold text-white">
                                {count}
                              </p>
                              <p className="mt-1 text-xs text-zinc-400">
                                slot{count === 1 ? "" : "s"}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-zinc-500">
                        No spell slots available yet.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="rounded-full border border-white/10 bg-zinc-800 px-3 py-1 text-zinc-300">
                        Cantrips: {derived.selectedCantripCount}
                        {derived.cantripsKnown > 0
                          ? ` / ${derived.cantripsKnown}`
                          : ""}
                      </span>

                      {derived.spellsPrepared > 0 && (
                        <span
                          className={`rounded-full px-3 py-1 ${
                            derived.missingSpellListCount > 0
                              ? "border border-amber-500/20 bg-amber-500/10 text-amber-300"
                              : "border border-white/10 bg-zinc-800 text-zinc-300"
                          }`}
                        >
                          Spell list: {derived.selectedLeveledSpellCount} /{" "}
                          {derived.spellsPrepared}
                        </span>
                      )}

                      {derived.spellsKnown > 0 && (
                        <span className="rounded-full border border-white/10 bg-zinc-800 px-3 py-1 text-zinc-300">
                          Spells known: {derived.spellsKnown}
                        </span>
                      )}
                    </div>

                    {derived.missingSpellListCount > 0 && (
                      <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300">
                        This character is missing{" "}
                        {derived.missingSpellListCount} spell
                        {derived.missingSpellListCount === 1 ? "" : "s"} on its
                        spell list.
                      </div>
                    )}
                  </div>

                  {derived.groupedSpells.length > 0 ? (
                    <div className="space-y-4">
                      {derived.groupedSpells.map((group) => (
                        <div
                          key={group.level}
                          className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">
                              {group.title}
                            </h3>

                            <span className="rounded-full border border-white/10 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                              {group.spells.length} spell
                              {group.spells.length === 1 ? "" : "s"}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {group.spells.map((spell) => {
                              const usageLabel = formatSpellUsage(spell.usage);

                              return (
                                <div
                                  key={spell.spellId}
                                  className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    <div>
                                      <p className="font-medium text-white">
                                        {spell.name}
                                      </p>

                                      {spell.school && (
                                        <p className="mt-1 text-sm text-zinc-500">
                                          {spell.school}
                                        </p>
                                      )}
                                    </div>

                                    {usageLabel && (
                                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                                        {usageLabel}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500">
                      No spells known yet.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  This character does not currently have spellcasting.
                </p>
              )}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="Character Info">
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Species
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {derived.speciesName}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Class
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {derived.className}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Background
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {derived.backgroundName}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Origin Feat
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {derived.featName ?? "None"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Alignment
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {character.alignment || "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Campaign
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {character.campaignId || "Not assigned"}
                  </dd>
                </div>
              </dl>
            </SectionCard>

            <SectionCard title="Money">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 xl:grid-cols-2">
                {(["cp", "sp", "ep", "gp", "pp"] as const).map((currency) => (
                  <div
                    key={currency}
                    className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {currency.toUpperCase()}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {derived.money[currency] ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Notes">
              {character.notes ? (
                <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                  {character.notes}
                </p>
              ) : (
                <p className="text-sm text-zinc-500">No notes yet.</p>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
