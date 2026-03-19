import { getClassById } from "./helpers";
import type {
  CharacterSheetData,
  CharacterFeature,
  CharacterSubclass,
  ChoiceDefinition,
} from "./types";
import {
  rogueExpertiseChoicesByLevel,
  rogueLanguageChoice,
  rogueWeaponMasteryChoices,
} from "./data/classes/rogue";

export type PendingLevelUpStepType =
  | "feature"
  | "subclass-choice"
  | "feat-choice"
  | "expertise-choice"
  | "language-choice"
  | "weapon-mastery-choice";

export type PendingLevelUpStep = {
  level: number;
  type: PendingLevelUpStepType;
  id: string;
  title: string;
  description?: string;
  feature?: CharacterFeature;
  choice?: ChoiceDefinition<string>;
};

const ASI_FEATURE_IDS = new Set([
  "ability-score-improvement",
  "ability-score-improvement-2",
  "ability-score-improvement-3",
  "ability-score-improvement-4",
  "ability-score-improvement-5",
]);

const SUBCLASS_FEATURE_IDS = new Set([
  "rogue-subclass",
  "fighter-subclass",
  "cleric-subclass",
  "wizard-subclass",
  "bard-subclass",
  "barbarian-subclass",
  "druid-subclass",
  "monk-subclass",
  "paladin-subclass",
  "ranger-subclass",
  "sorcerer-subclass",
  "warlock-subclass",
]);

const uniqueById = <T extends { id: string }>(values: T[]): T[] => {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const value of values) {
    if (seen.has(value.id)) continue;
    seen.add(value.id);
    result.push(value);
  }

  return result;
};

const getPendingLevelRange = (character: CharacterSheetData): number[] => {
  const pending = character.pendingLevelUp;
  if (!pending) return [];

  const levels: number[] = [];
  for (let level = pending.fromLevel + 1; level <= pending.toLevel; level += 1) {
    levels.push(level);
  }

  return levels;
};

const toFeatureRef = (
  feature: { id: string; name: string; level?: number; minLevel?: number },
  sourceId: string,
  level: number,
): CharacterFeature => {
  return {
    id: feature.id,
    name: feature.name,
    sourceType: "class",
    sourceId,
    level: feature.level ?? feature.minLevel ?? level,
  };
};

const getRoguePendingChoiceSteps = (
  character: CharacterSheetData,
  level: number,
): PendingLevelUpStep[] => {
  if (character.classId !== "rogue") return [];

  const steps: PendingLevelUpStep[] = [];
  const decisions = character.choices?.levelUpDecisions?.[level];

  // Expertise
  const expertiseDefinition = rogueExpertiseChoicesByLevel[level]?.[0];
  if (expertiseDefinition && !decisions?.expertise) {
    steps.push({
      level,
      type: "expertise-choice",
      id: `rogue-expertise-${level}`,
      title: "Choose Expertise",
      description: expertiseDefinition.description,
      choice: expertiseDefinition as ChoiceDefinition<string>,
    });
  }

  // Language (level 1)
  if (level === 1 && !decisions?.language) {
    steps.push({
      level,
      type: "language-choice",
      id: "rogue-language-choice",
      title: "Choose Bonus Language",
      description: rogueLanguageChoice.description,
      choice: rogueLanguageChoice as ChoiceDefinition<string>,
    });
  }

  // Weapon mastery
  const weaponMasteryDefinition = rogueWeaponMasteryChoices[level]?.[0];
  if (weaponMasteryDefinition && !decisions?.weaponMastery) {
    steps.push({
      level,
      type: "weapon-mastery-choice",
      id: `rogue-weapon-mastery-${level}`,
      title: "Choose Weapon Masteries",
      description: weaponMasteryDefinition.description,
      choice: weaponMasteryDefinition as ChoiceDefinition<string>,
    });
  }

  return steps;
};

export const getPendingLevelUpSteps = (
  character: CharacterSheetData,
  subclass?: CharacterSubclass | null,
): PendingLevelUpStep[] => {
  const pendingLevels = getPendingLevelRange(character);
  if (pendingLevels.length === 0) return [];

  const classDef = getClassById(character.classId);
  if (!classDef) return [];

  const steps: PendingLevelUpStep[] = [];

  for (const level of pendingLevels) {
    const classFeatures = classDef.featuresByLevel[level] ?? [];

    for (const feature of classFeatures) {
      const featureRef = toFeatureRef(feature, classDef.id, level);

      const decisions = character.choices?.levelUpDecisions?.[level];

      if (ASI_FEATURE_IDS.has(feature.id) && !decisions?.featId && !decisions?.asi) {
        steps.push({
          level,
          type: "feat-choice",
          id: `${feature.id}-${level}`,
          title: "Choose Feat or Ability Score Improvement",
          description: feature.description,
          feature: featureRef,
        });
        continue;
      }

      if (SUBCLASS_FEATURE_IDS.has(feature.id)) {
        if (!decisions?.subclassId) {
          steps.push({
            level,
            type: "subclass-choice",
            id: `${feature.id}-${level}`,
            title: "Choose Subclass",
            description: feature.description,
            feature: featureRef,
          });
        } else if (subclass) {
  const subclassFeatures = subclass.featuresByLevel[level] ?? [];
          for (const subclassFeature of subclassFeatures) {
            steps.push({
              level,
              type: "feature",
              id: `${subclassFeature.id}-${level}`,
              title: subclassFeature.name,
              description: subclassFeature.description,
              feature: {
                id: subclassFeature.id,
                name: subclassFeature.name,
                sourceType: "subclass",
                sourceId: subclass.id,
                level: subclassFeature.level ?? subclassFeature.minLevel ?? level,
              },
            });
          }
        }
        continue;
      }

      if (!feature.id.includes("subclass-feature")) {
        steps.push({
          level,
          type: "feature",
          id: `${feature.id}-${level}`,
          title: feature.name,
          description: feature.description,
          feature: featureRef,
        });
      }
    }

    steps.push(...getRoguePendingChoiceSteps(character, level));
  }

  return uniqueById(steps).sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return a.title.localeCompare(b.title);
  });
};

export const hasPendingLevelUpSteps = (
  character: CharacterSheetData,
  subclass?: CharacterSubclass | null,
): boolean => {
  return getPendingLevelUpSteps(character, subclass).length > 0;
};