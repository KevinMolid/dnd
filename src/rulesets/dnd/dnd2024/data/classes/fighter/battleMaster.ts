import type { CharacterSubclass } from "../../../types";

export const battleMaster: CharacterSubclass = {
  id: "battle-master",
  name: "Battle Master",
  classId: "fighter",
  description:
    "Battle Masters are students of the art of battle, learning martial techniques that are fueled by Superiority Dice.",

  featuresByLevel: {
    3: [
      {
        id: "combat-superiority",
        name: "Combat Superiority",
        level: 3,
        description: "You learn maneuvers fueled by Superiority Dice.",
        effects: [
          {
            type: "resource",
            resourceId: "superiority-dice",
            amount: {
              type: "fixed",
              value: 4,
            },
          },
          {
            type: "resource-die",
            resourceId: "superiority-dice",
            die: "d8",
          },
        ],
      },
      {
        id: "maneuvers",
        name: "Maneuvers",
        level: 3,
        description: "You learn three maneuvers of your choice.",
        effects: [
          {
            type: "choice-ref",
            choiceId: "fighter-maneuvers",
          },
        ],
      },
    ],
    7: [
      {
        id: "student-of-war",
        name: "Student of War",
        level: 7,
        description:
          "Gain proficiency with one type of Artisan’s Tools and one skill available to Fighters at level 1.",
        effects: [
          {
            type: "choice-ref",
            choiceId: "battle-master-student-of-war",
          },
        ],
      },
    ],
    10: [
      {
        id: "improved-combat-superiority",
        name: "Improved Combat Superiority",
        level: 10,
        description: "Your Superiority Die becomes a d10.",
        effects: [
          {
            type: "resource-die",
            resourceId: "superiority-dice",
            die: "d10",
          },
        ],
      },
    ],
    15: [
      {
        id: "relentless",
        name: "Relentless",
        level: 15,
        description:
          "Once per turn, when you use a maneuver, you can roll 1d8 and use that number instead of expending a Superiority Die.",
      },
    ],
    18: [
      {
        id: "ultimate-combat-superiority",
        name: "Ultimate Combat Superiority",
        level: 18,
        description: "Your Superiority Die becomes a d12.",
        effects: [
          {
            type: "resource-die",
            resourceId: "superiority-dice",
            die: "d12",
          },
        ],
      },
    ],
  },
};