import type { CharacterSubclass } from "../../../types";

export const hunter: CharacterSubclass = {
  id: "hunter",
  name: "Hunter",
  classId: "ranger",

  description:
    "Hunters stalk dangerous prey and adapt their combat techniques to destroy the foes that threaten civilization and the wilderness.",

  featuresByLevel: {
    3: [
      {
        id: "hunters-lore",
        name: "Hunter's Lore",
        level: 3,
        description:
          "You can call on the forces of nature to reveal the strengths and weaknesses of your prey.",
        notes: [
          "While a creature is marked by your Hunter's Mark, you know whether that creature has any Immunities, Resistances, or Vulnerabilities.",
          "If it has any, you know what they are.",
        ],
      },

      {
        id: "hunters-prey",
        name: "Hunter's Prey",
        level: 3,
        description:
          "You gain one Hunter's Prey option of your choice.",
        notes: [
          "Whenever you finish a Short Rest or Long Rest, you can replace your chosen option with the other one.",
          "Colossus Slayer: When you hit a creature with a weapon, the weapon deals an extra 1d8 damage if the creature is missing any Hit Points. You can deal this extra damage only once per turn.",
          "Horde Breaker: Once on each of your turns when you make an attack with a weapon, you can make another attack with the same weapon against a different creature within 5 feet of the original target, within the weapon's range, and which you haven't attacked this turn.",
        ],
      },
    ],

    7: [
      {
        id: "defensive-tactics",
        name: "Defensive Tactics",
        level: 7,
        description:
          "You gain one Defensive Tactics option of your choice.",
        notes: [
          "Whenever you finish a Short Rest or Long Rest, you can replace your chosen option with the other one.",
          "Escape the Horde: Opportunity Attacks have Disadvantage against you.",
          "Multiattack Defense: When a creature hits you with an attack roll, that creature has Disadvantage on all other attack rolls against you this turn.",
        ],
      },
    ],

    11: [
      {
        id: "superior-hunters-prey",
        name: "Superior Hunter's Prey",
        level: 11,
        description:
          "Once per turn when you deal damage to a creature marked by your Hunter's Mark, you can also deal that spell's extra damage to a different creature you can see within 30 feet of the first creature.",
      },
    ],

    15: [
      {
        id: "superior-hunters-defense",
        name: "Superior Hunter's Defense",
        level: 15,
        activation: "reaction",
        description:
          "When you take damage, you can take a Reaction to give yourself Resistance to that damage and any other damage of the same type until the end of the current turn.",
      },
    ],
  },
};