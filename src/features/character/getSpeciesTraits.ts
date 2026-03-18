import type { CharacterChoices, Trait } from "../../rulesets/dnd/dnd2024/types"
import { species, elfLineages } from "../../rulesets/dnd/dnd2024/data"

export function getSpeciesTraits(
  speciesId: string,
  choices?: CharacterChoices,
): Trait[] {
  const selectedSpecies = species.find((s) => s.id === speciesId);

  if (!selectedSpecies) return [];

  const traits: Trait[] = [...selectedSpecies.traits];
  const speciesTraitChoices = choices?.speciesTraitChoices;

  switch (speciesId) {
    case "elf": {
      const lineageId = speciesTraitChoices?.["elven-lineage-choice"];

      if (typeof lineageId === "string") {
        const lineage = elfLineages.find((l) => l.id === lineageId);
        if (lineage) {
          traits.push(...lineage.traits);
        }
      }

      break;
    }

    default:
      break;
  }

  return traits;
}