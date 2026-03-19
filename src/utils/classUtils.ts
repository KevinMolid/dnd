import type {
  CharacterFeature,
  Trait,
} from "../rulesets/dnd/dnd2024/types";

export const unique = <T,>(values: T[]): T[] => {
  return [...new Set(values)];
};

export const getTraitsUpToLevel = (
  featuresByLevel: Partial<Record<number, Trait[]>>,
  level: number,
): Trait[] => {
  const features: Trait[] = [];

  for (let currentLevel = 1; currentLevel <= level; currentLevel += 1) {
    features.push(...(featuresByLevel[currentLevel] ?? []));
  }

  return features;
};

export const getFeatureRefsUpToLevel = (
  sourceType: CharacterFeature["sourceType"],
  sourceId: string,
  featuresByLevel: Partial<Record<number, Trait[]>>,
  level: number,
): CharacterFeature[] => {
  const features: CharacterFeature[] = [];

  for (let currentLevel = 1; currentLevel <= level; currentLevel += 1) {
    for (const feature of featuresByLevel[currentLevel] ?? []) {
      features.push({
        id: feature.id,
        name: feature.name,
        sourceType,
        sourceId,
        level: feature.level ?? feature.minLevel ?? currentLevel,
      });
    }
  }

  return features;
};