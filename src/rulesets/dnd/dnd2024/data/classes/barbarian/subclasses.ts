import type { CharacterSubclass } from "../../../types";

export const pathOfTheBerserker: CharacterSubclass = {
  id: "path-of-the-berserker",
  name: "Path of the Berserker",
  classId: "barbarian",
  description: "Berserkers channel their fury into a devastating frenzy.",
  featuresByLevel: {},
};

export const pathOfTheWildHeart: CharacterSubclass = {
  id: "path-of-the-wild-heart",
  name: "Path of the Wild Heart",
  classId: "barbarian",
  description:
    "Barbarians of the Wild Heart draw primal strength from the natural world.",
  featuresByLevel: {},
};

export const pathOfTheWorldTree: CharacterSubclass = {
  id: "path-of-the-world-tree",
  name: "Path of the World Tree",
  classId: "barbarian",
  description:
    "Barbarians of the World Tree are tied to the cosmic roots and branches connecting the planes.",
  featuresByLevel: {},
};

export const pathOfTheZealot: CharacterSubclass = {
  id: "path-of-the-zealot",
  name: "Path of the Zealot",
  classId: "barbarian",
  description: "Zealots fight with divine fury and supernatural purpose.",
  featuresByLevel: {},
};

export const barbarianSubclasses: CharacterSubclass[] = [
  pathOfTheBerserker,
  pathOfTheWildHeart,
  pathOfTheWorldTree,
  pathOfTheZealot,
];