
import type { CharacterSubclass } from "../../../types";

export const cartographer: CharacterSubclass = {
  id: "cartographer",
  name: "Cartographer",
  classId: "artificer",
  description:
    "Use magical maps to aid exploration and reposition allies.",

  featuresByLevel: {
    3: [
      {
        id: "cartographer-magical-cartography",
        name: "Magical Cartography",
        level: 3,
        description:
          "Create and use magical maps to support exploration.",
      },
    ],
    5: [
      {
        id: "cartographer-feature-5",
        name: "Cartographer Feature",
        level: 5,
        description:
          "Gain additional map-based subclass abilities.",
      },
    ],
    9: [
      {
        id: "cartographer-feature-9",
        name: "Cartographer Feature",
        level: 9,
        description:
          "Improve magical navigation and map capabilities.",
      },
    ],
    15: [
      {
        id: "cartographer-feature-15",
        name: "Cartographer Feature",
        level: 15,
        description:
          "Gain your final cartographic subclass feature.",
      },
    ],
  },
};
