import type { CharacterSubclass } from "../../../types";

export const pathOfTheWorldTree: CharacterSubclass = {
  id: "path-of-the-world-tree",
  name: "Path of the World Tree",
  classId: "barbarian",
  description:
    "Barbarians who follow the Path of the World Tree connect with the cosmic tree Yggdrasil through their Rage, drawing on its life-giving magic and roots that span the planes.",

  featuresByLevel: {
    3: [
      {
        id: "vitality-of-the-tree",
        name: "Vitality of the Tree",
        level: 3,
        description:
          "Your Rage taps into the life force of the World Tree, granting resilience to you and your allies.",
        notes: [
          "Vitality Surge. When you activate your Rage, you gain a number of Temporary Hit Points equal to your Barbarian level.",
          "Life-Giving Force. At the start of each of your turns while your Rage is active, you can choose another creature within 10 feet of yourself to gain Temporary Hit Points.",
          "To determine those Temporary Hit Points, roll a number of d6s equal to your Rage Damage bonus and add them together.",
          "If any of these Temporary Hit Points remain when your Rage ends, they vanish.",
        ],
      },
    ],

    6: [
      {
        id: "branches-of-the-tree",
        name: "Branches of the Tree",
        level: 6,
        description:
          "You can summon spectral branches of the World Tree to displace nearby foes.",
        notes: [
          "Whenever a creature you can see starts its turn within 30 feet of you while your Rage is active, you can take a Reaction to summon spectral branches around it.",
          "The target must succeed on a Strength saving throw.",
          "The DC equals 8 plus your Strength modifier plus your Proficiency Bonus.",
          "On a failed save, the target is teleported to an unoccupied space you can see within 5 feet of yourself or to the nearest unoccupied space you can see.",
          "After the target teleports, you can reduce its Speed to 0 until the end of the current turn.",
        ],
      },
    ],

    10: [
      {
        id: "battering-roots",
        name: "Battering Roots",
        level: 10,
        description:
          "World Tree tendrils extend the reach of your weapons and let you force foes backward or off balance.",
        notes: [
          "During your turn, your reach is 10 feet greater with any Melee weapon that has the Heavy or Versatile property.",
          "When you hit with such a weapon on your turn, you can activate the Push or Topple mastery property in addition to a different mastery property you're using with that weapon.",
        ],
      },
    ],

    14: [
      {
        id: "travel-along-the-tree",
        name: "Travel Along the Tree",
        level: 14,
        description:
          "The World Tree opens paths through space for you and your companions while your Rage is active.",
        notes: [
          "When you activate your Rage and as a Bonus Action while your Rage is active, you can teleport up to 60 feet to an unoccupied space you can see.",
          "In addition, once per Rage, you can increase the range of that teleport to 150 feet.",
          "When you do so, you can also bring up to six willing creatures who are within 10 feet of you.",
          "Each creature teleports to an unoccupied space of your choice within 10 feet of your destination space.",
        ],
      },
    ],
  },
};