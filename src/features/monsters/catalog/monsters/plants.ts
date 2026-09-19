import type { MonsterDefinition } from "../monsterTypes";

/**
 * Complete Plant catalog from SRD 5.2.1.
 *
 * This work includes material from the System Reference Document 5.2.1
 * ("SRD 5.2.1") by Wizards of the Coast LLC, available at
 * https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the
 * Creative Commons Attribution 4.0 International License, available at
 * https://creativecommons.org/licenses/by/4.0/legalcode.
 */
export const plants: MonsterDefinition[] = [
  {
    id: "awakened-shrub",
    name: "Awakened Shrub",
    type: "Plant",
    size: "Small",
    alignment: "Neutral",
    armorClass: 9,
    hp: 10,
    hitDice: "3d6",
    initiative: { modifier: -1, score: 9 },
    speed: { walk: 20 },
    stats: {
      str: 3,
      dex: 8,
      con: 11,
      int: 10,
      wis: 10,
      cha: 6,
    },
    damageVulnerabilities: ["Fire"],
    damageResistances: ["Piercing"],
    senses: { passivePerception: 10 },
    languages: ["Common", "One other language"],
    challengeRating: "0",
    xp: 10,
    proficiencyBonus: 2,
    actions: [
      {
        name: "Rake",
        text: "Melee Attack Roll: +1, reach 5 ft. Hit: 1 Slashing damage.",
      },
    ],
  },

  {
    id: "awakened-tree",
    name: "Awakened Tree",
    type: "Plant",
    size: "Huge",
    alignment: "Neutral",
    armorClass: 13,
    hp: 59,
    hitDice: "7d12 + 14",
    initiative: { modifier: -2, score: 8 },
    speed: { walk: 20 },
    stats: {
      str: 19,
      dex: 6,
      con: 15,
      int: 10,
      wis: 10,
      cha: 7,
    },
    damageVulnerabilities: ["Fire"],
    damageResistances: ["Bludgeoning", "Piercing"],
    senses: { passivePerception: 10 },
    languages: ["Common", "One other language"],
    challengeRating: "2",
    xp: 450,
    proficiencyBonus: 2,
    actions: [
      {
        name: "Slam",
        text: "Melee Attack Roll: +6, reach 10 ft. Hit: 14 (3d6 + 4) Bludgeoning damage.",
      },
    ],
  },

  {
    id: "shrieker-fungus",
    name: "Shrieker Fungus",
    type: "Plant",
    size: "Medium",
    alignment: "Unaligned",
    armorClass: 5,
    hp: 13,
    hitDice: "3d8",
    initiative: { modifier: -5, score: 5 },
    speed: { walk: 5 },
    stats: {
      str: 1,
      dex: 1,
      con: 10,
      int: 1,
      wis: 3,
      cha: 1,
    },
    conditionImmunities: [
      "Blinded",
      "Charmed",
      "Deafened",
      "Frightened",
    ],
    senses: {
      blindsight: 30,
      passivePerception: 6,
    },
    languages: [],
    challengeRating: "0",
    xp: 0,
    proficiencyBonus: 2,
    reactions: [
      {
        name: "Shriek",
        text: "Trigger: A creature or a source of Bright Light moves within 30 feet of the shrieker. Response: The shrieker emits a shriek audible within 300 feet of itself for 1 minute or until the shrieker dies.",
      },
    ],
  },

  {
    id: "violet-fungus",
    name: "Violet Fungus",
    type: "Plant",
    size: "Medium",
    alignment: "Unaligned",
    armorClass: 5,
    hp: 18,
    hitDice: "4d8",
    initiative: { modifier: -5, score: 5 },
    speed: { walk: 5 },
    stats: {
      str: 3,
      dex: 1,
      con: 10,
      int: 1,
      wis: 3,
      cha: 1,
    },
    conditionImmunities: [
      "Blinded",
      "Charmed",
      "Deafened",
      "Frightened",
    ],
    senses: {
      blindsight: 30,
      passivePerception: 6,
    },
    languages: [],
    challengeRating: "1/4",
    xp: 50,
    proficiencyBonus: 2,
    actions: [
      {
        name: "Multiattack",
        text: "The fungus makes two Rotting Touch attacks.",
      },
      {
        name: "Rotting Touch",
        text: "Melee Attack Roll: +2, reach 10 ft. Hit: 4 (1d8) Necrotic damage.",
      },
    ],
  },

  {
    id: "shambling-mound",
    name: "Shambling Mound",
    type: "Plant",
    size: "Large",
    alignment: "Unaligned",
    armorClass: 15,
    hp: 110,
    hitDice: "13d10 + 39",
    initiative: { modifier: -1, score: 9 },
    speed: {
      walk: 30,
      swim: 20,
    },
    stats: {
      str: 18,
      dex: 8,
      con: 16,
      int: 5,
      wis: 10,
      cha: 5,
    },
    skills: {
      Stealth: 3,
    },
    damageResistances: ["Cold", "Fire"],
    damageImmunities: ["Lightning"],
    conditionImmunities: ["Deafened", "Exhaustion"],
    senses: {
      blindsight: 60,
      passivePerception: 10,
    },
    languages: [],
    challengeRating: "5",
    xp: 1800,
    proficiencyBonus: 3,
    traits: [
      {
        name: "Lightning Absorption",
        text: "Whenever the shambling mound is subjected to Lightning damage, it regains a number of Hit Points equal to the Lightning damage dealt.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        text: "The shambling mound makes three Charged Tendril attacks. It can replace one attack with a use of Engulf.",
      },
      {
        name: "Charged Tendril",
        text: "Melee Attack Roll: +7, reach 10 ft. Hit: 7 (1d6 + 4) Bludgeoning damage plus 5 (2d4) Lightning damage. If the target is a Medium or smaller creature, the shambling mound pulls the target 5 feet straight toward itself.",
      },
      {
        name: "Engulf",
        text: "Strength Saving Throw: DC 15, one Medium or smaller creature within 5 feet. Failure: The target is pulled into the shambling mound's space and has the Grappled condition (escape DC 14). Until the grapple ends, the target has the Blinded and Restrained conditions, and it takes 10 (3d6) Lightning damage at the start of each of its turns. When the shambling mound moves, the Grappled target moves with it, costing it no extra movement. The shambling mound can have only one creature Grappled by this action at a time.",
      },
    ],
  },

  {
    id: "treant",
    name: "Treant",
    type: "Plant",
    size: "Huge",
    alignment: "Chaotic Good",
    armorClass: 16,
    hp: 138,
    hitDice: "12d12 + 60",
    initiative: { modifier: 3, score: 13 },
    speed: { walk: 30 },
    stats: {
      str: 23,
      dex: 8,
      con: 21,
      int: 12,
      wis: 16,
      cha: 12,
    },
    damageVulnerabilities: ["Fire"],
    damageResistances: ["Bludgeoning", "Piercing"],
    senses: { passivePerception: 13 },
    languages: ["Common", "Druidic", "Elvish", "Sylvan"],
    challengeRating: "9",
    xp: 5000,
    proficiencyBonus: 4,
    traits: [
      {
        name: "Siege Monster",
        text: "The treant deals double damage to objects and structures.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        text: "The treant makes two Slam attacks.",
      },
      {
        name: "Slam",
        text: "Melee Attack Roll: +10, reach 5 ft. Hit: 16 (3d6 + 6) Bludgeoning damage.",
      },
      {
        name: "Hail of Bark",
        text: "Ranged Attack Roll: +10, range 180 ft. Hit: 28 (4d10 + 6) Piercing damage.",
      },
      {
        name: "Animate Trees (1/Day)",
        text: "The treant magically animates up to two trees it can see within 60 feet of itself. Each tree uses the Treant stat block, except it has Intelligence and Charisma scores of 1, it can't speak, and it lacks this action. The tree takes its turn immediately after the treant on the same Initiative count, and it obeys the treant. A tree remains animate for 1 day or until it dies, the treant dies, or it is more than 120 feet from the treant. The tree then takes root if possible.",
      },
    ],
  },
];
