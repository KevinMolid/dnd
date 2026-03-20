import type { CharacterClass } from "../../../types";

export const rogue: CharacterClass = {
  id: "rogue",
  name: "Rogue",
  hitDie: 8,
  primaryAbilities: ["dex"],
  savingThrowProficiencies: ["dex", "int"],
  armorTraining: ["light-armor"],
  weaponProficiencies: ["simple-weapons", "martial-finesse-or-light"],
  toolProficiencies: ["thieves-tools"],
  skillChoice: {
    choose: 4,
    options: [
      "acrobatics",
      "athletics",
      "deception",
      "insight",
      "intimidation",
      "investigation",
      "perception",
      "persuasion",
      "sleight-of-hand",
      "stealth",
    ],
  },
  startingEquipment: {
    choose: 1,
    options: [
      {
        id: "rogue-starting-equipment-a",
        label:
          "Leather Armor, 2 Daggers, Shortsword, Shortbow, 20 Arrows, Quiver, Thieves’ Tools, Burglar’s Pack, and 8 GP",
        grants: [
          { type: "item", id: "leather-armor", quantity: 1 },
          { type: "item", id: "dagger", quantity: 2 },
          { type: "item", id: "shortsword", quantity: 1 },
          { type: "item", id: "shortbow", quantity: 1 },
          { type: "item", id: "arrow", quantity: 20 },
          { type: "item", id: "quiver", quantity: 1 },
          { type: "item", id: "thieves-tools", quantity: 1 },
          { type: "item", id: "burglars-pack", quantity: 1 },
          { type: "currency", amount: 8, currency: "gp" },
        ],
      },
      {
        id: "rogue-starting-equipment-b",
        label: "100 GP",
        grants: [{ type: "currency", amount: 100, currency: "gp" }],
      },
    ],
  },
  subclasses: [
    {
      id: "assassin",
      name: "Assassin",
      description:
        "A Rogue who specializes in stealth, poison, and disguise to eliminate foes with deadly efficiency.",
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: "expertise",
        name: "Expertise",
        level: 1,
        description:
          "You gain Expertise in two of your skill proficiencies of your choice. Sleight of Hand and Stealth are recommended if you have proficiency in them. At Rogue level 6, you gain Expertise in two more of your skill proficiencies of your choice.",
      },
      {
        id: "sneak-attack",
        name: "Sneak Attack",
        level: 1,
        description:
          "Once per turn, you can deal extra damage to one creature you hit with an attack roll if you have Advantage on the roll and the attack uses a Finesse or a Ranged weapon. You don’t need Advantage if at least one of your allies is within 5 feet of the target, the ally doesn’t have the Incapacitated condition, and you don’t have Disadvantage on the attack roll.",
      },
      {
        id: "thieves-cant",
        name: "Thieves’ Cant",
        level: 1,
        description:
          "You know Thieves’ Cant and one other language of your choice.",
      },
      {
        id: "weapon-mastery",
        name: "Weapon Mastery",
        level: 1,
        description:
          "Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have proficiency.",
      },
    ],
    2: [
      {
        id: "cunning-action",
        name: "Cunning Action",
        level: 2,
        description:
          "On your turn, you can take one of the following actions as a Bonus Action: Dash, Disengage, or Hide.",
      },
    ],
    3: [
      {
        id: "rogue-subclass",
        name: "Rogue Subclass",
        level: 3,
        description:
          "You gain a Rogue subclass of your choice. A subclass is a specialization that grants you features at certain Rogue levels.",
      },
      {
        id: "steady-aim",
        name: "Steady Aim",
        level: 3,
        activation: "bonus-action",
        description:
          "As a Bonus Action, you give yourself Advantage on your next attack roll on the current turn. You can use this feature only if you haven’t moved during this turn, and after you use it, your Speed is 0 until the end of the current turn.",
      },
    ],
    4: [
      {
        id: "ability-score-improvement",
        name: "Ability Score Improvement",
        level: 4,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    5: [
      {
        id: "cunning-strike",
        name: "Cunning Strike",
        level: 5,
        description:
          "When you deal Sneak Attack damage, you can add one of the available Cunning Strike effects by removing Sneak Attack dice before rolling.",
      },
      {
        id: "uncanny-dodge",
        name: "Uncanny Dodge",
        level: 5,
        activation: "reaction",
        description:
          "When an attacker that you can see hits you with an attack roll, you can take a Reaction to halve the attack’s damage against you.",
      },
    ],
    6: [
      {
        id: "expertise-2",
        name: "Expertise",
        level: 6,
        description:
          "You gain Expertise in two more of your skill proficiencies of your choice.",
      },
    ],
    7: [
      {
        id: "evasion",
        name: "Evasion",
        level: 7,
        description:
          "When you’re subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed and only half damage if you fail. You can’t use this feature if you have the Incapacitated condition.",
      },
      {
        id: "reliable-talent",
        name: "Reliable Talent",
        level: 7,
        description:
          "Whenever you make an ability check that uses one of your skill or tool proficiencies, you can treat a d20 roll of 9 or lower as a 10.",
      },
    ],
    8: [
      {
        id: "ability-score-improvement-2",
        name: "Ability Score Improvement",
        level: 8,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    9: [
      {
        id: "subclass-feature-9",
        name: "Subclass Feature",
        level: 9,
      },
    ],
    10: [
      {
        id: "ability-score-improvement-3",
        name: "Ability Score Improvement",
        level: 10,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    11: [
      {
        id: "improved-cunning-strike",
        name: "Improved Cunning Strike",
        level: 11,
        description:
          "You can use up to two Cunning Strike effects when you deal Sneak Attack damage, paying the die cost for each effect.",
      },
    ],
    12: [
      {
        id: "ability-score-improvement-4",
        name: "Ability Score Improvement",
        level: 12,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    13: [
      {
        id: "subclass-feature-13",
        name: "Subclass Feature",
        level: 13,
      },
    ],
    14: [
      {
        id: "devious-strikes",
        name: "Devious Strikes",
        level: 14,
        description:
          "You gain additional Cunning Strike options: Daze, Knock Out, and Obscure.",
      },
    ],
    15: [
      {
        id: "slippery-mind",
        name: "Slippery Mind",
        level: 15,
        description:
          "You gain proficiency in Wisdom and Charisma saving throws.",
      },
    ],
    16: [
      {
        id: "ability-score-improvement-5",
        name: "Ability Score Improvement",
        level: 16,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    17: [
      {
        id: "subclass-feature-17",
        name: "Subclass Feature",
        level: 17,
      },
    ],
    18: [
      {
        id: "elusive",
        name: "Elusive",
        level: 18,
        description:
          "No attack roll can have Advantage against you unless you have the Incapacitated condition.",
      },
    ],
    19: [
      {
        id: "epic-boon",
        name: "Epic Boon",
        level: 19,
        description:
          "You gain an Epic Boon feat or another feat of your choice for which you qualify.",
      },
    ],
    20: [
      {
        id: "stroke-of-luck",
        name: "Stroke of Luck",
        level: 20,
        description:
          "If you fail a D20 Test, you can turn the roll into a 20. Once you use this feature, you can’t use it again until you finish a Short or Long Rest.",
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "short-rest",
        },
      },
    ],
  },
};