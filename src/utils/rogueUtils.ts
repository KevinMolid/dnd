import type {
  CharacterSheetData,
  DerivedCharacterData,
  LanguageId,
  SkillId,
  ToolId,
  Trait,
  WeaponMasteryChoiceId,
} from "../rulesets/dnd/dnd2024/types";
import {
  getRogueCunningStrikeMaxEffects,
  getRogueSneakAttackDice,
  getRogueTotalExpertiseChoices,
} from "../rulesets/dnd/dnd2024/data/classes/rogue";
import {
  getFeatureRefsUpToLevel,
  getTraitsUpToLevel,
  unique,
} from "./classUtils";

const ROGUE_CLASS_ID = "rogue";

const isRogue = (character: CharacterSheetData): boolean => {
  return character.classId === ROGUE_CLASS_ID;
};

export const getRogueClassFeaturesUpToLevel = (
  rogueFeaturesByLevel: Partial<Record<number, Trait[]>>,
  level: number,
): Trait[] => {
  return getTraitsUpToLevel(rogueFeaturesByLevel, level);
};

export const getRogueFeatureRefs = (
  rogueFeaturesByLevel: Partial<Record<number, Trait[]>>,
  level: number,
) => {
  return getFeatureRefsUpToLevel(
    "class",
    ROGUE_CLASS_ID,
    rogueFeaturesByLevel,
    level,
  );
};

export const getRogueExpertiseChoices = (
  character: CharacterSheetData,
): Array<SkillId | "thieves-tools"> => {
  if (!isRogue(character)) return [];

  return unique(character.choices?.rogueExpertiseChoices ?? []);
};

export const getRogueBonusLanguage = (
  character: CharacterSheetData,
): LanguageId[] => {
  if (!isRogue(character)) return [];

  const bonusLanguage = character.choices?.rogueBonusLanguage;
  return bonusLanguage ? [bonusLanguage] : [];
};

export const getRogueWeaponMasteries = (
  character: CharacterSheetData,
): WeaponMasteryChoiceId[] => {
  if (!isRogue(character)) return [];

  return unique(character.choices?.rogueWeaponMasteryChoices ?? []);
};

export const getRogueSneakAttackSummary = (level: number) => {
  const dice = getRogueSneakAttackDice(level);

  return {
    diceCount: dice,
    diceSize: 6,
    display: dice > 0 ? `${dice}d6` : "—",
  };
};

export const getRogueCunningStrikeSummary = (level: number) => {
  return {
    maxEffects: getRogueCunningStrikeMaxEffects(level),
    unlocked: level >= 5,
    improvedUnlocked: level >= 11,
    deviousStrikesUnlocked: level >= 14,
  };
};

export const getRogueValidationIssues = (
  character: CharacterSheetData,
): string[] => {
  if (!isRogue(character)) return [];

  const issues: string[] = [];
  const level = character.level;

  const expertiseChoices = character.choices?.rogueExpertiseChoices ?? [];
  const expectedExpertiseChoices = getRogueTotalExpertiseChoices(level);

  if (expertiseChoices.length > expectedExpertiseChoices) {
    issues.push(
      `Rogue has too many Expertise choices (${expertiseChoices.length}/${expectedExpertiseChoices}).`,
    );
  }

  if (level >= 1 && !character.choices?.rogueBonusLanguage) {
    issues.push("Rogue is missing the Thieves’ Cant bonus language choice.");
  }

  const weaponMasteries = character.choices?.rogueWeaponMasteryChoices ?? [];
  if (level >= 1 && weaponMasteries.length > 2) {
    issues.push(
      `Rogue has too many Weapon Mastery choices (${weaponMasteries.length}/2).`,
    );
  }

  const uniqueExpertiseChoices = new Set(expertiseChoices);
  if (uniqueExpertiseChoices.size !== expertiseChoices.length) {
    issues.push("Rogue has duplicate Expertise choices.");
  }

  const uniqueWeaponMasteries = new Set(weaponMasteries);
  if (uniqueWeaponMasteries.size !== weaponMasteries.length) {
    issues.push("Rogue has duplicate Weapon Mastery choices.");
  }

  return issues;
};

export const deriveRogueData = (
  character: CharacterSheetData,
  rogueFeaturesByLevel: Partial<Record<number, Trait[]>>,
  baseData?: Partial<DerivedCharacterData>,
): Partial<DerivedCharacterData> => {
  if (!isRogue(character)) {
    return baseData ?? {};
  }

  const level = character.level;
  const rogueFeatures = getRogueFeatureRefs(rogueFeaturesByLevel, level);
  const expertise = getRogueExpertiseChoices(character);
  const weaponMasteries = getRogueWeaponMasteries(character);
  const bonusLanguages = getRogueBonusLanguage(character);

  return {
    ...baseData,
    languages: unique([...(baseData?.languages ?? []), ...bonusLanguages]),
    features: [...(baseData?.features ?? []), ...rogueFeatures],
    expertise,
    weaponMasteries,
  };
};

export const getRogueDerivedSummary = (
  character: CharacterSheetData,
  rogueFeaturesByLevel: Partial<Record<number, Trait[]>>,
) => {
  if (!isRogue(character)) return null;

  const level = character.level;

  return {
    classId: ROGUE_CLASS_ID,
    level,
    features: getRogueClassFeaturesUpToLevel(rogueFeaturesByLevel, level),
    featureRefs: getRogueFeatureRefs(rogueFeaturesByLevel, level),
    expertise: getRogueExpertiseChoices(character),
    bonusLanguages: getRogueBonusLanguage(character),
    weaponMasteries: getRogueWeaponMasteries(character),
    sneakAttack: getRogueSneakAttackSummary(level),
    cunningStrike: getRogueCunningStrikeSummary(level),
    validationIssues: getRogueValidationIssues(character),
  };
};

export const rogueGetsAdditionalSavingThrowProficiencies = (
  level: number,
): Array<"wis" | "cha"> => {
  if (level < 15) return [];
  return ["wis", "cha"];
};

export const rogueGetsReliableTalent = (level: number): boolean => {
  return level >= 7;
};

export const rogueGetsElusive = (level: number): boolean => {
  return level >= 18;
};

export const rogueGetsStrokeOfLuck = (level: number): boolean => {
  return level >= 20;
};

export const rogueToolProficiencies = (): ToolId[] => {
  return ["thieves-tools"];
};