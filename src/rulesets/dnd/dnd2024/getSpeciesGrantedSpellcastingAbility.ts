import type { AbilityKey, CharacterChoices } from "./types";

export function getSpeciesGrantedSpellcastingAbility(
  speciesId: string,
  choices?: CharacterChoices,
): AbilityKey | null {
  const speciesTraitChoices = choices?.speciesTraitChoices;

  switch (speciesId) {
    case "tiefling": {
      const selectedAbility =
        speciesTraitChoices?.["fiendish-legacy-ability-choice"];

      if (
        selectedAbility === "str" ||
        selectedAbility === "dex" ||
        selectedAbility === "con" ||
        selectedAbility === "int" ||
        selectedAbility === "wis" ||
        selectedAbility === "cha"
      ) {
        return selectedAbility;
      }

      return null;
    }

    default:
      return null;
  }
}