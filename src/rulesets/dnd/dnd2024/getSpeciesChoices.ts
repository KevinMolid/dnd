import type { TraitChoice } from "./types";
import { species } from "./data";

export function getSpeciesChoices(speciesId: string): TraitChoice[] {
  const selectedSpecies = species.find((entry) => entry.id === speciesId);

  if (!selectedSpecies) {
    return [];
  }

  return selectedSpecies.traits.flatMap((trait) => trait.choices ?? []);
}