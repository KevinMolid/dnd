import type { CharacterSheetData, Trait } from "./types";
import { getSpeciesTraits } from "./getSpeciesTraits";
import {
  getBackgroundById,
  getClassById,
  getOriginFeatById,
} from "./helpers";

export function getAllCharacterTraits(
  character: Pick<
    CharacterSheetData,
    "classId" | "speciesId" | "backgroundId" | "originFeatId" | "level" | "choices"
  >,
): Trait[] {
  const allTraits: Trait[] = [];

  const speciesTraits = getSpeciesTraits(
    character.speciesId,
    character.choices,
  );
  allTraits.push(...speciesTraits);

  const classDef = getClassById(character.classId);
  if (classDef) {
    for (let lvl = 1; lvl <= character.level; lvl += 1) {
      const traitsAtLevel = classDef.featuresByLevel[lvl] ?? [];
      allTraits.push(...traitsAtLevel);
    }
  }

  const backgroundDef = getBackgroundById(character.backgroundId);
  if (backgroundDef?.originFeatId) {
    const feat = getOriginFeatById(backgroundDef.originFeatId);
    if (feat) {
      allTraits.push(...feat.traits);
    }
  }

  if (character.originFeatId) {
    const feat = getOriginFeatById(character.originFeatId);
    if (feat) {
      allTraits.push(...feat.traits);
    }
  }

  return dedupeTraits(allTraits);
}

function dedupeTraits(traits: Trait[]): Trait[] {
  const seen = new Set<string>();
  const result: Trait[] = [];

  for (const trait of traits) {
    if (seen.has(trait.id)) continue;
    seen.add(trait.id);
    result.push(trait);
  }

  return result;
}