import { getClassById } from "./helpers";
import type {
  CharacterSheetData,
  CharacterFeature,
  CharacterSubclass,
  ChoiceDefinition,
  LevelNumber,
  SpellcastingRules,
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
  | "weapon-mastery-choice"
  | "cantrip-choice"
  | "spell-choice";

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

const getPendingLevelRange = (character: CharacterSheetData): LevelNumber[] => {
  const pending = character.pendingLevelUp;
  if (!pending) return [];

  const levels: LevelNumber[] = [];
  for (
    let level = pending.fromLevel + 1;
    level <= pending.toLevel;
    level += 1
  ) {
    levels.push(level as LevelNumber);
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

const getCantripChoiceCountGrantedAtLevel = (
  rules: SpellcastingRules,
  level: LevelNumber,
): number => {
  if (!rules.cantrips) return 0;

  let granted = 0;

  if (level === 3 && typeof rules.cantrips.chooseAtStart === "number") {
    granted += rules.cantrips.chooseAtStart;
  }

  granted += rules.cantrips.additionalChoicesByLevel?.[level] ?? 0;

  return granted;
};

const getPreparedSpellChoiceCountGrantedAtLevel = (
  rules: SpellcastingRules,
  level: LevelNumber,
): number => {
  if (!rules.preparedSpells) return 0;

  let granted = 0;

  if (
    level === 3 &&
    typeof rules.preparedSpells.chooseAtStart?.count === "number"
  ) {
    granted += rules.preparedSpells.chooseAtStart.count;
  }

  const previousLevel = (level - 1) as LevelNumber;

  const previousCount =
    level > 1 ? (rules.preparedSpells.preparedByLevel[previousLevel] ?? 0) : 0;

  const currentCount = rules.preparedSpells.preparedByLevel[level] ?? 0;

  if (level !== 3 && currentCount > previousCount) {
    granted += currentCount - previousCount;
  }

  return granted;
};

const getSubclassSpellcastingChoiceSteps = (
  character: CharacterSheetData,
  subclass: CharacterSubclass,
  level: LevelNumber,
): PendingLevelUpStep[] => {
  const rules = subclass.spellcasting;
  if (!rules) return [];

  const steps: PendingLevelUpStep[] = [];
  const decisions = character.choices?.levelUpDecisions?.[level];

  const cantripChoicesRequired = getCantripChoiceCountGrantedAtLevel(rules, level);
  const chosenCantrips = decisions?.cantripChoices ?? [];

  if (cantripChoicesRequired > 0 && chosenCantrips.length < cantripChoicesRequired) {
    steps.push({
      level,
      type: "cantrip-choice",
      id: `${subclass.id}-cantrips-${level}`,
      title:
        level === 3
          ? `${subclass.name} Cantrips`
          : "Choose Additional Cantrip",
      description:
        level === 3
          ? `Choose ${cantripChoicesRequired} cantrips for ${subclass.name}.`
          : `Choose ${cantripChoicesRequired} additional cantrip${cantripChoicesRequired > 1 ? "s" : ""}.`,
      choice: {
        id: `${subclass.id}-cantrip-choice-${level}`,
        level,
        name: `${subclass.name} Cantrip Choice`,
        choose: cantripChoicesRequired,
        source: "cantrips",
      },
    });
  }

  const spellChoicesRequired = getPreparedSpellChoiceCountGrantedAtLevel(rules, level);
  const chosenSpells = decisions?.spellChoices ?? [];

  if (spellChoicesRequired > 0 && chosenSpells.length < spellChoicesRequired) {
    const spellLevel =
      level === 3
        ? rules.preparedSpells?.chooseAtStart?.spellLevel ?? 1
        : undefined;

    steps.push({
      level,
      type: "spell-choice",
      id: `${subclass.id}-spells-${level}`,
      title:
        level === 3 ? `${subclass.name} Spells` : "Choose Additional Spell",
      description:
        level === 3
          ? `Choose ${spellChoicesRequired} level ${spellLevel} spell${spellChoicesRequired > 1 ? "s" : ""} for ${subclass.name}.`
          : `Choose ${spellChoicesRequired} additional spell${spellChoicesRequired > 1 ? "s" : ""} for ${subclass.name}.`,
      choice: {
        id: `${subclass.id}-spell-choice-${level}`,
        level,
        name: `${subclass.name} Spell Choice`,
        choose: spellChoicesRequired,
        source: "spells",
        restrictions:
          spellLevel !== undefined
            ? [`Must be a level ${spellLevel} spell.`]
            : undefined,
      },
    });
  }

  return steps;
};

const getRoguePendingChoiceSteps = (
  character: CharacterSheetData,
  level: LevelNumber,
): PendingLevelUpStep[] => {
  if (character.classId !== "rogue") return [];

  const steps: PendingLevelUpStep[] = [];
  const decisions = character.choices?.levelUpDecisions?.[level];

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

      if (
        ASI_FEATURE_IDS.has(feature.id) &&
        !decisions?.featId &&
        !decisions?.asi
      ) {
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
        const activeSubclassId = decisions?.subclassId ?? subclass?.id;
        const activeSubclass = activeSubclassId
          ? subclass && subclass.id === activeSubclassId
            ? subclass
            : null
          : null;

        if (!activeSubclassId) {
          steps.push({
            level,
            type: "subclass-choice",
            id: `${feature.id}-${level}`,
            title: "Choose Subclass",
            description: feature.description,
            feature: featureRef,
          });
        } else if (activeSubclass) {
          const subclassFeatures = activeSubclass.featuresByLevel[level] ?? [];

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
                sourceId: activeSubclass.id,
                level:
                  subclassFeature.level ??
                  subclassFeature.minLevel ??
                  level,
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

    if (subclass) {
      steps.push(...getSubclassSpellcastingChoiceSteps(character, subclass, level));
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