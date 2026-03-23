import type { CharacterSubclass } from "../../../types";

export const collegeOfDance: CharacterSubclass = {
  id: "college-of-dance",
  name: "College of Dance",
  classId: "bard",
  description:
    "Bards of the College of Dance transform rhythm and movement into magic.",
  featuresByLevel: {},
};

export const collegeOfGlamour: CharacterSubclass = {
  id: "college-of-glamour",
  name: "College of Glamour",
  classId: "bard",
  description:
    "Bards of the College of Glamour wield enchanting beauty and beguiling presence.",
  featuresByLevel: {},
};

export const collegeOfLore: CharacterSubclass = {
  id: "college-of-lore",
  name: "College of Lore",
  classId: "bard",
  description:
    "Bards of the College of Lore seek knowledge, stories, and magical insight.",
  featuresByLevel: {},
};

export const collegeOfValor: CharacterSubclass = {
  id: "college-of-valor",
  name: "College of Valor",
  classId: "bard",
  description:
    "Bards of the College of Valor inspire courage and stand in the thick of battle.",
  featuresByLevel: {},
};

export const bardSubclasses: CharacterSubclass[] = [
  collegeOfDance,
  collegeOfGlamour,
  collegeOfLore,
  collegeOfValor,
];