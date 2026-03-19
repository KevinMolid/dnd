import type { CharacterChoices, OriginFeatId } from "./types";

const originFeatIds: OriginFeatId[] = [
  "alert",
  "crafter",
  "healer",
  "lucky",
  "magic-initiate",
  "musician",
  "savage-attacker",
  "skilled",
  "tavern-brawler",
  "tough",
];

function isOriginFeatId(value: string): value is OriginFeatId {
  return originFeatIds.includes(value as OriginFeatId);
}

export function getSpeciesGrantedFeatIds(
  speciesId: string,
  choices?: CharacterChoices,
): OriginFeatId[] {
  const speciesTraitChoices = choices?.speciesTraitChoices;

  switch (speciesId) {
    case "human": {
      const selectedFeat = speciesTraitChoices?.["human-origin-feat-choice"];

      if (typeof selectedFeat === "string" && isOriginFeatId(selectedFeat)) {
        return [selectedFeat];
      }

      return [];
    }

    default:
      return [];
  }
}