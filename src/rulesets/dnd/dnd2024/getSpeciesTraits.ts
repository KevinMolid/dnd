import type { CharacterChoices, Trait } from "./types";
import { species, elfLineages, gnomeLineages, goliathAncestries, tieflingLegacies } from "./data";

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

    case "gnome": {
      const lineageId = speciesTraitChoices?.["gnomish-lineage-choice"];

      if (typeof lineageId === "string") {
        const lineage = gnomeLineages.find((l) => l.id === lineageId);
        if (lineage) {
          traits.push(...lineage.traits);
        }
      }

      break;
    }

    case "goliath": {
      const ancestryId = speciesTraitChoices?.["giant-ancestry-choice"];

      if (typeof ancestryId === "string") {
        const ancestry = goliathAncestries.find((a) => a.id === ancestryId);
        if (ancestry) {
          traits.push(...ancestry.traits);
        }
      }

      break;
    }

    case "tiefling": {
      const legacyId = speciesTraitChoices?.["fiendish-legacy-choice"];

      if (typeof legacyId === "string") {
        const legacy = tieflingLegacies.find((l) => l.id === legacyId);
        if (legacy) {
          traits.push(...legacy.traits);
        }
      }

      break;
    }

    default:
      break;
  }

  return traits;
}