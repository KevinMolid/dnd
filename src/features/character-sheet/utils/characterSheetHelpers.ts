import type {
  AbilityKey,
  CharacterSpell,
  SpellId,
} from "../../../rulesets/dnd/dnd2024/types";
import type { CharacterSheetData } from "../../../rulesets/dnd/dnd2024/types";
import type { CharacterEquipmentEntry } from "../../../rulesets/dnd/dnd2024/types";
import { abilityValues } from "./characterSheetConstants";

export const unique = <T,>(values: T[]) => [...new Set(values)];

export const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const formatModifier = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);

export const getAbilityModifier = (score: number) =>
  Math.floor((score - 10) / 2);

export const isAbility = (value: unknown): value is AbilityKey =>
  typeof value === "string" && abilityValues.includes(value as AbilityKey);

export const getOrdinalSuffix = (value: number) => {
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

export const getSneakAttackDice = (level: number) => {
  if (level < 1) return null;
  const dice = Math.ceil(level / 2);
  return `${dice}d6`;
};

export const getDragonbornBreathWeaponDice = (level: number) => {
  if (level >= 17) return "4d10";
  if (level >= 11) return "3d10";
  if (level >= 5) return "2d10";
  return "1d10";
};

export const getRulesItemIdFromEquipmentEntry = (
  entry: CharacterEquipmentEntry,
) => (entry.source === "campaign" ? entry.baseItemId : entry.itemId);

export const getTieflingLegacyCastingAbility = (
  character: CharacterSheetData,
): AbilityKey | null => {
  const raw =
    character.choices?.speciesTraitChoices?.["fiendish-legacy-ability-choice"];

  return isAbility(raw) ? raw : null;
};

export const getMagicInitiateCastingAbility = (
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

export const applyBackgroundBonuses = (
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

export const formatSpellUsage = (
  usage?: CharacterSpell["usage"],
): string | null => {
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

export const collectSpellSelections = (
  character: CharacterSheetData,
  maxLevel: number,
) => {
  const cantripIds: SpellId[] = [];
  const spellSelections: Array<{ spellId: SpellId; level: number }> = [];

  const pushCantrip = (spellId: SpellId | undefined) => {
    if (!spellId) return;
    if (!cantripIds.includes(spellId)) {
      cantripIds.push(spellId);
    }
  };

  const pushSpell = (
    spell:
      | {
          spellId?: SpellId;
          level?: number;
        }
      | undefined,
  ) => {
    if (!spell?.spellId || typeof spell.level !== "number") return;

    if (!spellSelections.some((s) => s.spellId === spell.spellId)) {
      spellSelections.push({
        spellId: spell.spellId,
        level: spell.level,
      });
    }
  };

  for (const spellId of character.choices?.classCantripChoices ?? []) {
    pushCantrip(spellId);
  }

  for (const spell of character.choices?.classSpellChoices ?? []) {
    pushSpell(spell);
  }

  for (const spellId of character.choices?.subclassCantripChoices ?? []) {
    pushCantrip(spellId);
  }

  for (const spell of character.choices?.subclassSpellChoices ?? []) {
    pushSpell(spell);
  }

  const levelUpDecisions = character.choices?.levelUpDecisions ?? {};

  const sortedLevels = Object.keys(levelUpDecisions)
    .map(Number)
    .filter((level) => level <= maxLevel)
    .sort((a, b) => a - b);

  for (const level of sortedLevels) {
    const decision = levelUpDecisions[level];
    if (!decision) continue;

    if (Array.isArray(decision.cantripChoices)) {
      for (const spellId of decision.cantripChoices) {
        pushCantrip(spellId);
      }
    }

    if (Array.isArray(decision.spellChoices)) {
      for (const spell of decision.spellChoices) {
        pushSpell(spell);
      }
    }

    if (Array.isArray(decision.cantripReplacements)) {
      for (const replacement of decision.cantripReplacements) {
        if (
          replacement?.removeSpellId &&
          cantripIds.includes(replacement.removeSpellId)
        ) {
          const index = cantripIds.indexOf(replacement.removeSpellId);
          if (index >= 0) {
            cantripIds.splice(index, 1);
          }
        }

        if (replacement?.addSpellId) {
          pushCantrip(replacement.addSpellId);
        }
      }
    }

    if (Array.isArray(decision.spellReplacements)) {
      for (const replacement of decision.spellReplacements) {
        if (replacement?.removeSpellId) {
          const removeIndex = spellSelections.findIndex(
            (s) => s.spellId === replacement.removeSpellId,
          );

          if (removeIndex >= 0) {
            spellSelections.splice(removeIndex, 1);
          }
        }

        if (replacement?.addSpellId && typeof replacement.level === "number") {
          pushSpell({
            spellId: replacement.addSpellId,
            level: replacement.level,
          });
        }
      }
    }
  }

  return { cantripIds, spellSelections };
};