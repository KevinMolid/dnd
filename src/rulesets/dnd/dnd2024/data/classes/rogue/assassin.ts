import type { CharacterSubclass } from "../../../types";

export const assassin: CharacterSubclass = {
  id: "assassin",
  name: "Assassin",
  classId: "rogue",
  description:
    "An Assassin’s training focuses on using stealth, poison, and disguise to eliminate foes with deadly efficiency. While some Rogues who follow this path are hired killers, spies, or bounty hunters, the capabilities of this subclass are equally useful to adventurers facing a variety of monstrous enemies.",
  featuresByLevel: {
    3: [
      {
        id: "assassinate",
        name: "Assassinate",
        level: 3,
        description:
          "You are adept at ambushing a target, granting you the following benefits.",
        notes: [
          "Initiative: You have Advantage on Initiative rolls.",
          "Surprising Strikes: During the first round of each combat, you have Advantage on attack rolls against any creature that hasn’t taken a turn.",
          "If your Sneak Attack hits any target during that round, the target takes extra damage of the weapon’s type equal to your Rogue level.",
        ],
      },
      {
        id: "assassins-tools",
        name: "Assassin’s Tools",
        level: 3,
        description:
          "You gain a Disguise Kit and a Poisoner’s Kit, and you have proficiency with them.",
        effects: [
          {
            type: "item-grant",
            itemId: "disguise-kit",
            quantity: 1,
          },
          {
            type: "item-grant",
            itemId: "poisoners-kit",
            quantity: 1,
          },
          {
            type: "tool-proficiency",
            tool: "disguise-kit",
          },
          {
            type: "tool-proficiency",
            tool: "poisoners-kit",
          },
        ],
      },
    ],
    9: [
      {
        id: "infiltration-expertise",
        name: "Infiltration Expertise",
        level: 9,
        description:
          "You are expert at the following techniques that aid your infiltrations.",
        notes: [
          "Masterful Mimicry: You can uncannily mimic another person’s speech, handwriting, or both if you have spent at least 1 hour studying them.",
          "Roving Aim: Your Speed isn’t reduced to 0 by using Steady Aim.",
        ],
      },
    ],
    13: [
      {
        id: "envenom-weapons",
        name: "Envenom Weapons",
        level: 13,
        description:
          "When you use the Poison option of your Cunning Strike, the target also takes 2d6 Poison damage whenever it fails the saving throw. This damage ignores Resistance to Poison damage.",
      },
    ],
    17: [
      {
        id: "death-strike",
        name: "Death Strike",
        level: 17,
        description:
          "When you hit with your Sneak Attack on the first round of a combat, the target must succeed on a Constitution saving throw (DC 8 + your Dexterity modifier + your Proficiency Bonus), or the attack’s damage is doubled against the target.",
      },
    ],
  },
};