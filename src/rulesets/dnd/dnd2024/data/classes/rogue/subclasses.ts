import type { CharacterSubclass } from "../../../types";

export const rogueSubclasses: CharacterSubclass[] = [
  {
    id: "assassin",
    name: "Assassin",
    classId: "rogue",
    featuresByLevel: {
      3: [
        {
          id: "assassins-strike",
          name: "Assassin Feature",
          description: "Subclass feature text here.",
        },
      ],
    },
  },
  {
    id: "thief",
    name: "Thief",
    classId: "rogue",
    featuresByLevel: {
      3: [
        {
          id: "fast-hands",
          name: "Fast Hands",
          description: "Subclass feature text here.",
        },
      ],
    },
  },
];