import type { MonsterDefinition } from "../monsterTypes";

/**
 * Complete Ooze catalog from SRD 5.2.1.
 *
 * This work includes material from the System Reference Document 5.2.1
 * ("SRD 5.2.1") by Wizards of the Coast LLC, available at
 * https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the
 * Creative Commons Attribution 4.0 International License, available at
 * https://creativecommons.org/licenses/by/4.0/legalcode.
 */
export const oozes: MonsterDefinition[] = [
  {
    id: "black-pudding",
    name: "Black Pudding",
    type: "Ooze",
    size: "Large",
    alignment: "Unaligned",

    armorClass: 7,
    hp: 68,
    hitDice: "8d10 + 24",

    initiative: {
      modifier: -3,
      score: 7,
    },

    speed: {
      walk: 20,
      climb: 20,
    },

    stats: {
      str: 16,
      dex: 5,
      con: 16,
      int: 1,
      wis: 6,
      cha: 1,
    },

    damageImmunities: ["Acid", "Cold", "Lightning", "Slashing"],
    conditionImmunities: [
      "Charmed",
      "Deafened",
      "Exhaustion",
      "Frightened",
      "Grappled",
      "Prone",
      "Restrained",
    ],

    senses: {
      blindsight: 60,
      passivePerception: 8,
    },

    languages: [],

    challengeRating: "4",
    xp: 1100,
    proficiencyBonus: 2,

    traits: [
      {
        name: "Amorphous",
        text: "The pudding can move through a space as narrow as 1 inch without expending extra movement to do so.",
      },
      {
        name: "Corrosive Form",
        text: "A creature that hits the pudding with a melee attack roll takes 4 (1d8) Acid damage. Nonmagical ammunition is destroyed immediately after hitting the pudding and dealing any damage. Any nonmagical weapon takes a cumulative −1 penalty to attack rolls immediately after dealing damage to the pudding and coming into contact with it. The weapon is destroyed if the penalty reaches −5. The penalty can be removed by casting the Mending spell on the weapon. In 1 minute, the pudding can eat through 2 feet of nonmagical wood or metal.",
      },
      {
        name: "Spider Climb",
        text: "The pudding can climb difficult surfaces, including along ceilings, without needing to make an ability check.",
      },
    ],

    actions: [
      {
        name: "Dissolving Pseudopod",
        text: "Melee Attack Roll: +5, reach 10 ft. Hit: 17 (4d6 + 3) Acid damage. Nonmagical armor worn by the target takes a −1 penalty to the AC it offers. The armor is destroyed if the penalty reduces its AC to 10. The penalty can be removed by casting the Mending spell on the armor.",
      },
    ],

    reactions: [
      {
        name: "Split",
        text: "Trigger: While the pudding is Large or Medium and has 10+ Hit Points, it becomes Bloodied or is subjected to Lightning or Slashing damage. Response: The pudding splits into two new Black Puddings. Each new pudding is one size smaller than the original pudding and acts on its Initiative. The original pudding's Hit Points are divided evenly between the new puddings (round down).",
      },
    ],
  },

  {
    id: "gelatinous-cube",
    name: "Gelatinous Cube",
    type: "Ooze",
    size: "Large",
    alignment: "Unaligned",

    armorClass: 6,
    hp: 63,
    hitDice: "6d10 + 30",

    initiative: {
      modifier: -4,
      score: 6,
    },

    speed: {
      walk: 15,
    },

    stats: {
      str: 14,
      dex: 3,
      con: 20,
      int: 1,
      wis: 6,
      cha: 1,
    },

    damageImmunities: ["Acid"],
    conditionImmunities: [
      "Blinded",
      "Charmed",
      "Deafened",
      "Exhaustion",
      "Frightened",
      "Prone",
    ],

    senses: {
      blindsight: 60,
      passivePerception: 8,
    },

    languages: [],

    challengeRating: "2",
    xp: 450,
    proficiencyBonus: 2,

    traits: [
      {
        name: "Ooze Cube",
        text: "The cube fills its entire space and is transparent. Other creatures can enter that space, but a creature that does so is subjected to the cube's Engulf and has Disadvantage on the saving throw. Creatures inside the cube have Total Cover, and the cube can hold one Large creature or up to four Medium or Small creatures inside itself at a time. As an action, a creature within 5 feet of the cube can pull a creature or an object out of the cube by succeeding on a DC 12 Strength (Athletics) check, and the puller takes 10 (3d6) Acid damage.",
      },
      {
        name: "Transparent",
        text: "Even when the cube is in plain sight, a creature must succeed on a DC 15 Wisdom (Perception) check to notice the cube if the creature hasn't witnessed the cube move or otherwise act.",
      },
    ],

    actions: [
      {
        name: "Pseudopod",
        text: "Melee Attack Roll: +4, reach 5 ft. Hit: 12 (3d6 + 2) Acid damage.",
      },
      {
        name: "Engulf",
        text: "The cube moves up to its Speed without provoking Opportunity Attacks. The cube can move through the spaces of Large or smaller creatures if it has room inside itself to contain them (see the Ooze Cube trait). Dexterity Saving Throw: DC 12, each creature whose space the cube enters for the first time during this move. Failure: 10 (3d6) Acid damage, and the target is engulfed. An engulfed target is suffocating, can't cast spells with a Verbal component, has the Restrained condition, and takes 10 (3d6) Acid damage at the start of each of the cube's turns. When the cube moves, the engulfed target moves with it. An engulfed target can try to escape by taking an action to make a DC 12 Strength (Athletics) check. On a successful check, the target escapes and enters the nearest unoccupied space. Success: Half damage, and the target moves to an unoccupied space within 5 feet of the cube. If there is no unoccupied space, the target fails the save instead.",
      },
    ],
  },

  {
    id: "gray-ooze",
    name: "Gray Ooze",
    type: "Ooze",
    size: "Medium",
    alignment: "Unaligned",

    armorClass: 9,
    hp: 22,
    hitDice: "3d8 + 9",

    initiative: {
      modifier: -2,
      score: 13,
    },

    speed: {
      walk: 10,
      climb: 10,
    },

    stats: {
      str: 12,
      dex: 6,
      con: 16,
      int: 1,
      wis: 6,
      cha: 2,
    },

    skills: {
      Stealth: 2,
    },

    damageResistances: ["Acid", "Cold", "Fire"],
    conditionImmunities: [
      "Blinded",
      "Charmed",
      "Deafened",
      "Exhaustion",
      "Frightened",
      "Grappled",
      "Prone",
      "Restrained",
    ],

    senses: {
      blindsight: 60,
      passivePerception: 8,
    },

    languages: [],

    challengeRating: "1/2",
    xp: 100,
    proficiencyBonus: 2,

    traits: [
      {
        name: "Amorphous",
        text: "The ooze can move through a space as narrow as 1 inch without expending extra movement to do so.",
      },
      {
        name: "Corrosive Form",
        text: "Nonmagical ammunition is destroyed immediately after hitting the ooze and dealing any damage. Any nonmagical weapon takes a cumulative −1 penalty to attack rolls immediately after dealing damage to the ooze and coming into contact with it. The weapon is destroyed if the penalty reaches −5. The penalty can be removed by casting the Mending spell on the weapon. The ooze can eat through 2-inch-thick, nonmagical metal or wood in 1 round.",
      },
    ],

    actions: [
      {
        name: "Pseudopod",
        text: "Melee Attack Roll: +3, reach 5 ft. Hit: 10 (2d8 + 1) Acid damage. Nonmagical armor worn by the target takes a −1 penalty to the AC it offers. The armor is destroyed if the penalty reduces its AC to 10. The penalty can be removed by casting the Mending spell on the armor.",
      },
    ],
  },

  {
    id: "ochre-jelly",
    name: "Ochre Jelly",
    type: "Ooze",
    size: "Large",
    alignment: "Unaligned",

    armorClass: 8,
    hp: 52,
    hitDice: "7d10 + 14",

    initiative: {
      modifier: -2,
      score: 8,
    },

    speed: {
      walk: 20,
      climb: 20,
    },

    stats: {
      str: 15,
      dex: 6,
      con: 14,
      int: 2,
      wis: 6,
      cha: 1,
    },

    damageResistances: ["Acid"],
    damageImmunities: ["Lightning", "Slashing"],
    conditionImmunities: [
      "Charmed",
      "Deafened",
      "Exhaustion",
      "Frightened",
      "Grappled",
      "Prone",
      "Restrained",
    ],

    senses: {
      blindsight: 60,
      passivePerception: 8,
    },

    languages: [],

    challengeRating: "2",
    xp: 450,
    proficiencyBonus: 2,

    traits: [
      {
        name: "Amorphous",
        text: "The jelly can move through a space as narrow as 1 inch without expending extra movement to do so.",
      },
      {
        name: "Spider Climb",
        text: "The jelly can climb difficult surfaces, including along ceilings, without needing to make an ability check.",
      },
    ],

    actions: [
      {
        name: "Pseudopod",
        text: "Melee Attack Roll: +4, reach 5 ft. Hit: 12 (3d6 + 2) Acid damage.",
      },
    ],
  },
];
