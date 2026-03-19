import {
  getBackgroundById,
  getClassById,
  getOriginFeatById,
  getSpeciesById,
} from "./helpers";
import { getSpeciesGrantedFeatIds } from "./getSpeciesGrantedFeatIds";
import { getSpeciesGrantedSkillProficiencies } from "./getSpeciesGrantedSkillProficiencies";
import { getSpeciesTraits } from "./getSpeciesTraits";
import type {
  AbilityKey,
  CharacterFeature,
  CharacterSheetData,
  DerivedCharacterData,
  ScalingValue,
  SkillId,
  ToolId,
  Trait,
  WeaponMasteryChoiceId,
} from "./types";

const unique = <T>(values: T[]): T[] => [...new Set(values)];

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

const getAbilityModifier = (score: number) => Math.floor((score - 10) / 2);
const getProficiencyBonus = (level: number) => 2 + Math.floor((level - 1) / 4);
const getAverageHpPerLevel = (hitDie: number) => Math.floor(hitDie / 2) + 1;

const applyBackgroundBonuses = (
  abilityScores: CharacterSheetData["abilityScores"],
  choices: CharacterSheetData["choices"],
  backgroundAbilityOptions: AbilityKey[],
) => {
  const nextScores = { ...abilityScores };

  const bonuses = choices?.backgroundAbilityBonuses;
  if (!bonuses) return nextScores;

  const { plus2, plus1 } = bonuses;

  if (backgroundAbilityOptions.includes(plus2)) {
    nextScores[plus2] += 2;
  }

  if (backgroundAbilityOptions.includes(plus1) && plus1 !== plus2) {
    nextScores[plus1] += 1;
  }

  return nextScores;
};

const resolveScalingValue = (
  value: ScalingValue,
  context: {
    level: number;
    proficiencyBonus: number;
    abilityScores: CharacterSheetData["abilityScores"];
  },
): number => {
  switch (value.type) {
    case "fixed":
      return value.value;

    case "proficiency-bonus":
      return context.proficiencyBonus;

    case "ability-modifier":
      return getAbilityModifier(context.abilityScores[value.ability]);

    case "level-based": {
      const eligibleLevels = Object.keys(value.levels)
        .map(Number)
        .filter((lvl) => lvl <= context.level)
        .sort((a, b) => b - a);

      if (eligibleLevels.length === 0) {
        return 0;
      }

      return value.levels[eligibleLevels[0]];
    }

    case "formula":
      return value.parts.reduce((sum, part) => {
        switch (part.type) {
          case "fixed":
            return sum + part.value;
          case "proficiency-bonus":
            return sum + context.proficiencyBonus;
          case "ability-modifier":
            return sum + getAbilityModifier(context.abilityScores[part.ability]);
          default:
            return sum;
        }
      }, 0);

    default:
      return 0;
  }
};

const getSpeciesMaxHpBonus = (
  traits: Trait[],
  context: {
    level: number;
    proficiencyBonus: number;
    abilityScores: CharacterSheetData["abilityScores"];
  },
): number => {
  let bonus = 0;

  for (const trait of traits) {
    for (const effect of trait.effects ?? []) {
      if (effect.type === "hp-max-bonus") {
        bonus += resolveScalingValue(effect.amount, context);
      }
    }

    // Temporary compatibility for Dwarven Toughness.
    // The current data stores +1 in effects and the per-level scaling in notes.
    if (trait.id === "dwarven-toughness") {
      bonus += Math.max(0, context.level - 1);
    }
  }

  return bonus;
};

const getPassiveWalkSpeedBonus = (
  traits: Trait[],
  level: number,
): number => {
  let bonus = 0;

  for (const trait of traits) {
    for (const effect of trait.effects ?? []) {
      if (effect.type !== "speed-bonus") continue;
      if (effect.speedType !== "walk") continue;
      if (effect.minimumLevel && level < effect.minimumLevel) continue;

      // Current model does not yet distinguish clearly between
      // "walk speed becomes X" and "walk speed increases by X".
      // So only structured fixed bonuses should be handled here later
      // if you add such an effect type.
    }

    // Temporary compatibility for Wood Elf.
    if (trait.id === "wood-elf-speed") {
      bonus += 5;
    }
  }

  return bonus;
};

export const buildDerivedCharacterData = (
  character: CharacterSheetData,
): DerivedCharacterData => {
  const classDef = getClassById(character.classId);
  const speciesDef = getSpeciesById(character.speciesId);
  const backgroundDef = getBackgroundById(character.backgroundId);
  const featDef = character.originFeatId
    ? getOriginFeatById(character.originFeatId)
    : undefined;

  const speciesTraits = getSpeciesTraits(character.speciesId, character.choices);

  const speciesGrantedSkillProficiencies = getSpeciesGrantedSkillProficiencies(
    character.speciesId,
    character.choices,
  );

  const speciesGrantedFeatIds = getSpeciesGrantedFeatIds(
    character.speciesId,
    character.choices,
  );

  const speciesGrantedFeats = speciesGrantedFeatIds
    .map((featId) => getOriginFeatById(featId))
    .filter((feat): feat is NonNullable<typeof feat> => Boolean(feat));

  const finalAbilityScores = applyBackgroundBonuses(
    character.abilityScores,
    character.choices,
    backgroundDef?.abilityOptions ?? [],
  );

  const proficiencyBonus = getProficiencyBonus(character.level);

  const scalingContext = {
    level: character.level,
    proficiencyBonus,
    abilityScores: finalAbilityScores,
  };

  const dexMod = getAbilityModifier(finalAbilityScores.dex);
  const wisMod = getAbilityModifier(finalAbilityScores.wis);
  const conMod = getAbilityModifier(finalAbilityScores.con);

  const classSkillChoices = character.choices?.classSkillChoices ?? [];
  const extraToolChoices = character.choices?.toolChoices ?? [];
  const extraLanguageChoices = character.choices?.languageChoices ?? [];

  const rogueBonusLanguage =
    character.classId === "rogue"
      ? character.choices?.rogueBonusLanguage
      : undefined;

  const skillProficiencies = unique<SkillId>([
    ...(backgroundDef?.skillProficiencies ?? []),
    ...classSkillChoices,
    ...speciesGrantedSkillProficiencies,
  ]);

  const toolProficiencies = unique<ToolId>([
    ...(backgroundDef ? [backgroundDef.toolProficiency] : []),
    ...(classDef?.toolProficiencies ?? []),
    ...extraToolChoices,
  ]);

  const savingThrowProficiencies = classDef
    ? [...classDef.savingThrowProficiencies]
    : [];

  const armorTraining = classDef?.armorTraining ?? [];
  const weaponProficiencies = classDef?.weaponProficiencies ?? [];

  const languages = unique([
    ...(speciesDef?.languages ?? []),
    ...extraLanguageChoices,
    ...(rogueBonusLanguage ? [rogueBonusLanguage] : []),
  ]);

  const classFeatures: CharacterFeature[] = classDef
    ? Object.entries(classDef.featuresByLevel)
        .flatMap(([level, features]) => {
          const numericLevel = Number(level);
          if (numericLevel > character.level) return [];

          return features.map((feature) => ({
            id: feature.id,
            name: feature.name,
            level: feature.level ?? feature.minLevel ?? numericLevel,
            sourceType: "class" as const,
            sourceId: classDef.id,
          }));
        })
        .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
    : [];

  const speciesFeatures: CharacterFeature[] = speciesDef
    ? speciesTraits.map((feature) => ({
        id: feature.id,
        name: feature.name,
        level: feature.level ?? feature.minLevel ?? 1,
        sourceType: "species" as const,
        sourceId: speciesDef.id,
      }))
    : [];

  const backgroundFeatures: CharacterFeature[] = backgroundDef
    ? [
        {
          id: backgroundDef.id,
          name: backgroundDef.name,
          level: 1,
          sourceType: "background" as const,
          sourceId: backgroundDef.id,
        },
      ]
    : [];

  const featFeatures: CharacterFeature[] = [
    ...(featDef
      ? featDef.traits.map((feature) => ({
          id: feature.id,
          name: feature.name,
          level: feature.level ?? feature.minLevel ?? 1,
          sourceType: "feat" as const,
          sourceId: featDef.id,
        }))
      : []),
    ...speciesGrantedFeats.flatMap((feat) =>
      feat.traits.map((feature) => ({
        id: feature.id,
        name: feature.name,
        level: feature.level ?? feature.minLevel ?? 1,
        sourceType: "feat" as const,
        sourceId: feat.id,
      })),
    ),
  ];

  const features = uniqueById<CharacterFeature>([
    ...classFeatures,
    ...speciesFeatures,
    ...backgroundFeatures,
    ...featFeatures,
  ]);

  const speciesMaxHpBonus = getSpeciesMaxHpBonus(speciesTraits, scalingContext);
  const passiveWalkSpeedBonus = getPassiveWalkSpeedBonus(
    speciesTraits,
    character.level,
  );

  const maxHp =
    classDef && character.level > 0
      ? classDef.hitDie +
        conMod +
        (character.level - 1) *
          (getAverageHpPerLevel(classDef.hitDie) + conMod) +
        speciesMaxHpBonus
      : undefined;

  const expertise =
    character.classId === "rogue"
      ? unique(character.choices?.rogueExpertiseChoices ?? [])
      : [];

  const weaponMasteries: WeaponMasteryChoiceId[] =
    character.classId === "rogue"
      ? unique(character.choices?.rogueWeaponMasteryChoices ?? []).slice(0, 2)
      : [];

  return {
    stats: {
      proficiencyBonus,
      maxHp,
      currentHp: character.derived?.stats?.currentHp ?? maxHp,
      armorClass: character.derived?.stats?.armorClass ?? 10 + dexMod,
      initiativeBonus: character.derived?.stats?.initiativeBonus ?? dexMod,
      speed:
        character.derived?.stats?.speed ??
        ((speciesDef?.speed ?? 30) + passiveWalkSpeedBonus),
      passivePerception:
        character.derived?.stats?.passivePerception ?? 10 + wisMod,
    },
    skillProficiencies,
    toolProficiencies,
    savingThrowProficiencies,
    armorTraining,
    weaponProficiencies,
    languages,
    features,
    spells: character.derived?.spells ?? [],
    expertise,
    weaponMasteries,
  };
};