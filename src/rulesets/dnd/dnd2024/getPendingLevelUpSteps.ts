import { getClassById } from "./helpers";
import type {
  CharacterSheetData,
  CharacterFeature,
  CharacterSubclass,
  ChoiceDefinition,
  LevelNumber,
  SpellcastingRules,
  SpellId,
  SpellLevel,
} from "./types";
import {
  rogueExpertiseChoicesByLevel,
  rogueLanguageChoice,
  rogueWeaponMasteryChoices,
} from "./data/classes/rogue";
import {
  paladinBlessedWarriorCantripChoice,
  paladinFightingStyleChoicesByLevel,
  paladinSubclassChoicesByLevel,
  paladinWeaponMasteryChoices,
} from "./data/classes/paladin";

export type PendingLevelUpStepType =
  | "feature"
  | "subclass-choice"
  | "feat-choice"
  | "fighting-style-choice"
  | "expertise-choice"
  | "language-choice"
  | "weapon-mastery-choice"
  | "cantrip-choice"
  | "spell-choice"
  | "cantrip-replacement"
  | "spell-replacement";

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

const FIGHTING_STYLE_FEATURE_IDS = new Set([
  "fighting-style",
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

const collectPriorCantripChoices = (
  character: CharacterSheetData,
  upToLevel: number,
): SpellId[] => {
  const result: SpellId[] = [];
  const levelUpDecisions = character.choices?.levelUpDecisions ?? {};

  const levels = Object.keys(levelUpDecisions)
    .map(Number)
    .filter((level) => level < upToLevel)
    .sort((a, b) => a - b);

  for (const level of levels) {
    const decision = levelUpDecisions[level];
    if (!decision) continue;

    if (Array.isArray(decision.cantripChoices)) {
      for (const spellId of decision.cantripChoices) {
        if (spellId && !result.includes(spellId)) {
          result.push(spellId);
        }
      }
    }

    if (Array.isArray(decision.cantripReplacements)) {
      for (const replacement of decision.cantripReplacements) {
        if (!replacement?.removeSpellId || !replacement?.addSpellId) continue;

        const removeIndex = result.indexOf(replacement.removeSpellId);
        if (removeIndex >= 0) {
          result.splice(removeIndex, 1);
        }

        if (!result.includes(replacement.addSpellId)) {
          result.push(replacement.addSpellId);
        }
      }
    }
  }

  return result;
};

const collectPriorSpellChoices = (
  character: CharacterSheetData,
  upToLevel: number,
): Array<{ spellId: SpellId; level: SpellLevel }> => {
  const result: Array<{ spellId: SpellId; level: SpellLevel }> = [];
  const levelUpDecisions = character.choices?.levelUpDecisions ?? {};

  const levels = Object.keys(levelUpDecisions)
    .map(Number)
    .filter((level) => level < upToLevel)
    .sort((a, b) => a - b);

  for (const level of levels) {
    const decision = levelUpDecisions[level];
    if (!decision) continue;

    if (Array.isArray(decision.spellChoices)) {
      for (const spell of decision.spellChoices) {
        if (
          spell &&
          spell.spellId &&
          typeof spell.level === "number" &&
          !result.some((entry) => entry.spellId === spell.spellId)
        ) {
          result.push({
            spellId: spell.spellId,
            level: spell.level as SpellLevel,
          });
        }
      }
    }

    if (Array.isArray(decision.spellReplacements)) {
      for (const replacement of decision.spellReplacements) {
        if (
          !replacement?.removeSpellId ||
          !replacement?.addSpellId ||
          typeof replacement.level !== "number"
        ) {
          continue;
        }

        const removeIndex = result.findIndex(
          (entry) => entry.spellId === replacement.removeSpellId,
        );

        if (removeIndex >= 0) {
          result.splice(removeIndex, 1);
        }

        if (!result.some((entry) => entry.spellId === replacement.addSpellId)) {
          result.push({
            spellId: replacement.addSpellId,
            level: replacement.level as SpellLevel,
          });
        }
      }
    }
  }

  return result;
};

const canReplaceCantripAtLevel = (
  rules: SpellcastingRules,
  level: LevelNumber,
): boolean => {
  if (!rules.cantrips?.replacementRules?.length) return false;
  return level > 3;
};

const canReplaceSpellAtLevel = (
  rules: SpellcastingRules,
  level: LevelNumber,
): boolean => {
  const hasReplacementRules =
    !!rules.learnedSpells?.replacementRules?.length ||
    !!rules.preparedSpells?.replacementRules?.length;

  if (!hasReplacementRules) return false;

  return level > 3;
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

  const definedLevels = Object.keys(rules.cantrips.knownByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  const firstCantripLevel = definedLevels[0];

  if (
    level === firstCantripLevel &&
    typeof rules.cantrips.chooseAtStart === "number"
  ) {
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

  const definedLevels = Object.keys(rules.preparedSpells.preparedByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  const firstPreparedLevel = definedLevels[0];

  if (
    level === firstPreparedLevel &&
    typeof rules.preparedSpells.chooseAtStart?.count === "number"
  ) {
    granted += rules.preparedSpells.chooseAtStart.count;
  }

  const levels = definedLevels.filter((definedLevel) => definedLevel <= level);
  const previousLevels = definedLevels.filter(
    (definedLevel) => definedLevel <= level - 1,
  );

  const currentCount =
    levels.length > 0
      ? rules.preparedSpells.preparedByLevel[
          levels[levels.length - 1] as LevelNumber
        ] ?? 0
      : 0;

  const previousCount =
    previousLevels.length > 0
      ? rules.preparedSpells.preparedByLevel[
          previousLevels[previousLevels.length - 1] as LevelNumber
        ] ?? 0
      : 0;

  if (level !== firstPreparedLevel && currentCount > previousCount) {
    granted += currentCount - previousCount;
  }

  return granted;
};

const getClassSpellcastingChoiceSteps = (
  character: CharacterSheetData,
  rules: SpellcastingRules,
  level: LevelNumber,
  className: string,
): PendingLevelUpStep[] => {
  const steps: PendingLevelUpStep[] = [];
  const decisions = character.choices?.levelUpDecisions?.[level];

  const cantripChoicesRequired = getCantripChoiceCountGrantedAtLevel(rules, level);
  const chosenCantrips = decisions?.cantripChoices ?? [];

  if (cantripChoicesRequired > 0 && chosenCantrips.length < cantripChoicesRequired) {
    steps.push({
      level,
      type: "cantrip-choice",
      id: `${rules.sourceId}-class-cantrips-${level}`,
      title:
        level === 1 || level === 3
          ? `${className} Cantrips`
          : "Choose Additional Cantrip",
      description:
        level === 1 || level === 3
          ? `Choose ${cantripChoicesRequired} cantrip${cantripChoicesRequired > 1 ? "s" : ""} for ${className}.`
          : `Choose ${cantripChoicesRequired} additional cantrip${cantripChoicesRequired > 1 ? "s" : ""}.`,
      choice: {
        id: `${rules.sourceId}-class-cantrip-choice-${level}`,
        level,
        name: `${className} Cantrip Choice`,
        choose: cantripChoicesRequired,
        source: "cantrips",
      },
    });
  }

  const spellChoicesRequired = getPreparedSpellChoiceCountGrantedAtLevel(rules, level);
  const chosenSpells = decisions?.spellChoices ?? [];

  if (spellChoicesRequired > 0 && chosenSpells.length < spellChoicesRequired) {
    const spellLevel =
      level === 1 || level === 3
        ? rules.preparedSpells?.chooseAtStart?.spellLevel ?? 1
        : undefined;

    steps.push({
      level,
      type: "spell-choice",
      id: `${rules.sourceId}-class-spells-${level}`,
      title:
        level === 1 || level === 3
          ? `${className} Spells`
          : "Choose Additional Spell",
      description:
        level === 1 || level === 3
          ? `Choose ${spellChoicesRequired} level ${spellLevel} spell${spellChoicesRequired > 1 ? "s" : ""} for ${className}.`
          : `Choose ${spellChoicesRequired} additional spell${spellChoicesRequired > 1 ? "s" : ""} for ${className}.`,
      choice: {
        id: `${rules.sourceId}-class-spell-choice-${level}`,
        level,
        name: `${className} Spell Choice`,
        choose: spellChoicesRequired,
        source: "spells",
        restrictions:
          spellLevel !== undefined
            ? [`Must be a level ${spellLevel} spell.`]
            : undefined,
      },
    });
  }

  const priorCantrips = collectPriorCantripChoices(character, level);
  const priorSpells = collectPriorSpellChoices(character, level);

  if (
    canReplaceCantripAtLevel(rules, level) &&
    priorCantrips.length > 0 &&
    !(decisions?.cantripReplacements?.length)
  ) {
    steps.push({
      level,
      type: "cantrip-replacement",
      id: `${rules.sourceId}-class-cantrip-replacement-${level}`,
      title: "Replace a Cantrip",
      description:
        "You can replace one cantrip you already know with another eligible cantrip.",
      choice: {
        id: `${rules.sourceId}-class-cantrip-replacement-choice-${level}`,
        level,
        name: `${className} Cantrip Replacement`,
        choose: 1,
        source: "cantrips",
      },
    });
  }

  if (
    canReplaceSpellAtLevel(rules, level) &&
    priorSpells.length > 0 &&
    !(decisions?.spellReplacements?.length)
  ) {
    steps.push({
      level,
      type: "spell-replacement",
      id: `${rules.sourceId}-class-spell-replacement-${level}`,
      title: "Replace a Spell",
      description:
        "You can replace one spell you already know with another eligible spell.",
      choice: {
        id: `${rules.sourceId}-class-spell-replacement-choice-${level}`,
        level,
        name: `${className} Spell Replacement`,
        choose: 1,
        source: "spells",
      },
    });
  }

  return steps;
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

  const priorCantrips = collectPriorCantripChoices(character, level);
  const priorSpells = collectPriorSpellChoices(character, level);

  if (
    canReplaceCantripAtLevel(rules, level) &&
    priorCantrips.length > 0 &&
    !(decisions?.cantripReplacements?.length)
  ) {
    steps.push({
      level,
      type: "cantrip-replacement",
      id: `${subclass.id}-cantrip-replacement-${level}`,
      title: "Replace a Cantrip",
      description:
        "You can replace one cantrip you already know with another eligible cantrip.",
      choice: {
        id: `${subclass.id}-cantrip-replacement-choice-${level}`,
        level,
        name: `${subclass.name} Cantrip Replacement`,
        choose: 1,
        source: "cantrips",
      },
    });
  }

  if (
    canReplaceSpellAtLevel(rules, level) &&
    priorSpells.length > 0 &&
    !(decisions?.spellReplacements?.length)
  ) {
    steps.push({
      level,
      type: "spell-replacement",
      id: `${subclass.id}-spell-replacement-${level}`,
      title: "Replace a Spell",
      description:
        "You can replace one spell you already know with another eligible spell.",
      choice: {
        id: `${subclass.id}-spell-replacement-choice-${level}`,
        level,
        name: `${subclass.name} Spell Replacement`,
        choose: 1,
        source: "spells",
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

const getPaladinPendingChoiceSteps = (
  character: CharacterSheetData,
  level: LevelNumber,
): PendingLevelUpStep[] => {
  if (character.classId !== "paladin") return [];

  const steps: PendingLevelUpStep[] = [];
  const decisions = character.choices?.levelUpDecisions?.[level];

  const weaponMasteryDefinition = paladinWeaponMasteryChoices[level]?.[0];
  if (weaponMasteryDefinition && !decisions?.weaponMastery) {
    steps.push({
      level,
      type: "weapon-mastery-choice",
      id: `paladin-weapon-mastery-${level}`,
      title: "Choose Weapon Masteries",
      description: weaponMasteryDefinition.description,
      choice: weaponMasteryDefinition as ChoiceDefinition<string>,
    });
  }

  const fightingStyleDefinition = paladinFightingStyleChoicesByLevel[level]?.[0];
  if (fightingStyleDefinition && !decisions?.fightingStyleId) {
    steps.push({
      level,
      type: "fighting-style-choice",
      id: `paladin-fighting-style-${level}`,
      title: "Choose Fighting Style",
      description: fightingStyleDefinition.description,
      choice: fightingStyleDefinition as ChoiceDefinition<string>,
    });
  }

  const subclassDefinition = paladinSubclassChoicesByLevel[level]?.[0];
  if (subclassDefinition && !decisions?.subclassId) {
    steps.push({
      level,
      type: "subclass-choice",
      id: `paladin-subclass-choice-${level}`,
      title: "Choose Subclass",
      description: subclassDefinition.description,
      choice: subclassDefinition as ChoiceDefinition<string>,
    });
  }

  const choseBlessedWarrior =
    decisions?.fightingStyleId === "blessed-warrior" ||
    character.choices?.levelUpDecisions?.[2]?.fightingStyleId === "blessed-warrior";

  if (
    level === 2 &&
    choseBlessedWarrior &&
    !(decisions?.cantripChoices?.length)
  ) {
    steps.push({
      level,
      type: "cantrip-choice",
      id: "paladin-blessed-warrior-cantrips",
      title: "Choose Blessed Warrior Cantrips",
      description: paladinBlessedWarriorCantripChoice.description,
      choice: paladinBlessedWarriorCantripChoice as ChoiceDefinition<string>,
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

      if (
        !feature.id.includes("subclass-feature") &&
        !FIGHTING_STYLE_FEATURE_IDS.has(feature.id)
      ) {
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

    if (classDef.spellcasting) {
      steps.push(
        ...getClassSpellcastingChoiceSteps(
          character,
          classDef.spellcasting,
          level,
          classDef.name,
        ),
      );
    }

    if (subclass) {
      steps.push(...getSubclassSpellcastingChoiceSteps(character, subclass, level));
    }

    steps.push(...getRoguePendingChoiceSteps(character, level));
    steps.push(...getPaladinPendingChoiceSteps(character, level));
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