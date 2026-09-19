import type { Species } from "../../types";

export const halfling: Species = {
  id: "halfling",

  name: "Halfling",

  size: "Small",

  speed: 30,

  languages: ["common", "halfling"],

  traits: [
    {
      id: "brave",
      name: "Brave",
      description:
        "You have Advantage on saving throws you make to avoid or end the Frightened condition.",
      effects: [
        {
          type: "advantage-on-saving-throws-against",
          conditions: ["frightened"],
        },
      ],
    },

    {
      id: "halfling-nimbleness",
      name: "Halfling Nimbleness",
      description:
        "You can move through the space of any creature that is a size larger than you, but you can't stop in the same space.",
      notes: [
        "You can move through the space of any creature that is a size larger than you, but you can't stop in the same space.",
      ],
    },

    {
      id: "luck",
      name: "Luck",
      description:
        "When you roll a 1 on the d20 of a D20 Test, you can reroll the die, and you must use the new roll.",
      notes: [
        "When you roll a 1 on the d20 of a D20 Test, you can reroll the die, and you must use the new roll.",
      ],
    },

    {
      id: "naturally-stealthy",
      name: "Naturally Stealthy",
      description:
        "You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.",
      notes: [
        "You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.",
      ],
    },
  ],
};