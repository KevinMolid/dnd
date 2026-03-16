import {
  getBackgroundById,
  getClassById,
  getOriginFeatById,
  getSpeciesById,
} from "./helpers";
import type {
  AbilityKey,
  CharacterFeature,
  CharacterSheetData,
  DerivedCharacterData,
  SkillId,
  ToolId,
} from "./types";

const unique = <T>(values: T[]): T[] => [...new Set(values)];

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

  const plus2Allowed = backgroundAbilityOptions.includes(plus2);
  const plus1Allowed = backgroundAbilityOptions.includes(plus1);

  if (plus2Allowed) {
    nextScores[plus2] += 2;
  }

  if (plus1Allowed && plus1 !== plus2) {
    nextScores[plus1] += 1;
  }

  return nextScores;
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

  const finalAbilityScores = applyBackgroundBonuses(
    character.abilityScores,
    character.choices,
    backgroundDef?.abilityOptions ?? [],
  );

  const dexMod = getAbilityModifier(finalAbilityScores.dex);
  const wisMod = getAbilityModifier(finalAbilityScores.wis);
  const conMod = getAbilityModifier(finalAbilityScores.con);

  const classSkillChoices = character.choices?.classSkillChoices ?? [];
  const extraToolChoices = character.choices?.toolChoices ?? [];
  const extraLanguageChoices = character.choices?.languageChoices ?? [];

  const skillProficiencies = unique<SkillId>([
    ...(backgroundDef?.skillProficiencies ?? []),
    ...classSkillChoices,
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
  ]);

  const classFeatures: CharacterFeature[] = classDef
    ? Object.entries(classDef.featuresByLevel)
        .flatMap(([level, features]) => {
          const numericLevel = Number(level);

          if (numericLevel > character.level) return [];

          return features.map((feature) => ({
            id: feature.id,
            name: feature.name,
            level: feature.level ?? numericLevel,
            sourceType: "class" as const,
            sourceId: classDef.id,
          }));
        })
        .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
    : [];

  const speciesFeatures: CharacterFeature[] = speciesDef
    ? speciesDef.traits.map((feature) => ({
        id: feature.id,
        name: feature.name,
        level: feature.level ?? 1,
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

  const featFeatures: CharacterFeature[] = featDef
    ? featDef.traits.map((feature) => ({
        id: feature.id,
        name: feature.name,
        level: feature.level ?? 1,
        sourceType: "feat" as const,
        sourceId: featDef.id,
      }))
    : [];

  const features = [
    ...classFeatures,
    ...speciesFeatures,
    ...backgroundFeatures,
    ...featFeatures,
  ];

  const proficiencyBonus = getProficiencyBonus(character.level);

  const maxHp =
    classDef && character.level > 0
      ? classDef.hitDie +
        conMod +
        (character.level - 1) * (getAverageHpPerLevel(classDef.hitDie) + conMod)
      : undefined;

  return {
    stats: {
      proficiencyBonus,
      maxHp,
      currentHp: character.derived?.stats?.currentHp ?? maxHp,
      armorClass: character.derived?.stats?.armorClass ?? 10 + dexMod,
      initiativeBonus: character.derived?.stats?.initiativeBonus ?? dexMod,
      speed: character.derived?.stats?.speed ?? speciesDef?.speed ?? 30,
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
  };
};