import type { CharacterClass } from "../../types";

export const fighter: CharacterClass = {
  id: "fighter",
  name: "Fighter",
  hitDie: 10,
  primaryAbilities: ["str", "dex"],
  savingThrowProficiencies: ["str", "con"],
  armorTraining: ["light-armor", "medium-armor", "heavy-armor", "shields"],
  weaponProficiencies: ["simple-weapons", "martial-weapons"],
  skillChoice: {
    choose: 2,
    options: [
      "acrobatics",
      "animal-handling",
      "athletics",
      "history",
      "insight",
      "intimidation",
      "perception",
      "survival",
    ],
  },
  featuresByLevel: {
    1: [
      { id: "fighting-style", name: "Fighting Style", level: 1 },
      { id: "second-wind", name: "Second Wind", level: 1 },
    ],
  },
};