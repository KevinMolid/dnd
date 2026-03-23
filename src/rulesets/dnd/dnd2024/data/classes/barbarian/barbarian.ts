import type { CharacterClass } from "../../../types";

export const barbarian: CharacterClass = {
  id: "barbarian",
  name: "Barbarian",
  hitDie: 12,
  primaryAbilities: ["str"],
  savingThrowProficiencies: ["str", "con"],
  armorTraining: ["light-armor", "medium-armor", "shields"],
  weaponProficiencies: ["simple-weapons", "martial-weapons"],
  skillChoice: {
    choose: 2,
    options: [
      "animal-handling",
      "athletics",
      "intimidation",
      "nature",
      "perception",
      "survival",
    ],
  },
weaponMasteryOptions: [
  "club",
  "dagger",
  "greatclub",
  "handaxe",
  "javelin",
  "light-hammer",
  "mace",
  "quarterstaff",
  "sickle",
  "spear",
  "battleaxe",
  "flail",
  "glaive",
  "greataxe",
  "greatsword",
  "halberd",
  "lance",
  "longsword",
  "maul",
  "morningstar",
  "pike",
  "rapier",
  "scimitar",
  "shortsword",
  "trident",
  "war-pick",
  "warhammer",
  "whip",
],
  startingEquipment: {
    choose: 1,
    options: [
      {
        id: "barbarian-starting-equipment-a",
        label: "Greataxe, 4 Handaxes, Explorer’s Pack, and 15 GP",
        grants: [
          { type: "item", id: "greataxe", quantity: 1 },
          { type: "item", id: "handaxe", quantity: 4 },
          { type: "item", id: "explorers-pack", quantity: 1 },
          { type: "currency", amount: 15, currency: "gp" },
        ],
      },
      {
        id: "barbarian-starting-equipment-b",
        label: "75 GP",
        grants: [{ type: "currency", amount: 75, currency: "gp" }],
      },
    ],
  },
  subclasses: [
    {
      id: "path-of-the-berserker",
      name: "Path of the Berserker",
      description:
        "Berserkers channel fury into a devastating battle frenzy.",
    },
    {
      id: "path-of-the-wild-heart",
      name: "Path of the Wild Heart",
      description:
        "Warriors of the Wild Heart draw primal strength from the natural world.",
    },
    {
      id: "path-of-the-world-tree",
      name: "Path of the World Tree",
      description:
        "Barbarians of the World Tree channel the cosmic strength of the roots and branches that connect the planes.",
    },
    {
      id: "path-of-the-zealot",
      name: "Path of the Zealot",
      description:
        "Zealots rage with divine fervor and supernatural purpose.",
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: "rage",
        name: "Rage",
        level: 1,
        activation: "bonus-action",
        description:
          "You can imbue yourself with a primal power called Rage.",
        notes: [
          "You can enter your Rage as a Bonus Action if you aren’t wearing Heavy armor.",
          "You can use Rage the number of times shown in the Barbarian Features table.",
          "You regain one expended use when you finish a Short Rest, and all expended uses when you finish a Long Rest.",
          "While active, you have Resistance to Bludgeoning, Piercing, and Slashing damage.",
          "When you make an attack using Strength with either a weapon or an Unarmed Strike, you gain a bonus to the damage that increases as you gain Barbarian levels.",
          "You have Advantage on Strength checks and Strength saving throws.",
          "You can’t maintain Concentration, and you can’t cast spells.",
          "Your Rage lasts until the end of your next turn, and it ends early if you don’t do one of the following on your turn: make an attack roll against an enemy, force an enemy to make a saving throw, or take a Bonus Action to extend your Rage.",
          "Each time the Rage is extended, it lasts until the end of your next turn.",
          "You can maintain a Rage for up to 10 minutes.",
        ],
        usage: {
          type: "limited",
          uses: {
            type: "level-based",
            levels: {
              1: 2,
              2: 2,
              3: 3,
              4: 3,
              5: 3,
              6: 4,
              7: 4,
              8: 4,
              9: 4,
              10: 4,
              11: 4,
              12: 5,
              13: 5,
              14: 5,
              15: 5,
              16: 5,
              17: 6,
              18: 6,
              19: 6,
              20: 6,
            },
          },
          recharge: "short-rest",
        },
      },
      {
        id: "unarmored-defense",
        name: "Unarmored Defense",
        level: 1,
        description:
          "While you aren’t wearing armor, your base Armor Class equals 10 plus your Dexterity and Constitution modifiers.",
        notes: [
          "You can use a Shield and still gain this benefit.",
        ],
      },
      {
        id: "weapon-mastery",
        name: "Weapon Mastery",
        level: 1,
        description:
          "Your training with weapons allows you to use the mastery properties of weapons.",
        notes: [
          "You can use the mastery properties of two kinds of Simple or Martial Melee weapons of your choice, such as Greataxes and Handaxes.",
          "Whenever you finish a Long Rest, you can practice weapon drills and change one of those weapon choices.",
          "You gain the ability to use the mastery properties of more kinds of weapons as shown in the Weapon Mastery column of the Barbarian Features table.",
        ],
      },
    ],
    2: [
      {
        id: "danger-sense",
        name: "Danger Sense",
        level: 2,
        description:
          "You gain an uncanny sense of when things aren’t as they should be.",
        notes: [
          "You have Advantage on Dexterity saving throws unless you have the Incapacitated condition.",
        ],
      },
      {
        id: "reckless-attack",
        name: "Reckless Attack",
        level: 2,
        description:
          "You can throw aside all concern for defense to attack with increased ferocity.",
        notes: [
          "When you make your first attack roll on your turn, you can decide to attack recklessly.",
          "Doing so gives you Advantage on attack rolls using Strength until the start of your next turn, but attack rolls against you have Advantage during that time.",
        ],
      },
    ],
    3: [
      {
        id: "barbarian-subclass",
        name: "Barbarian Subclass",
        level: 3,
        description:
          "You gain a Barbarian subclass of your choice.",
      },
      {
        id: "primal-knowledge",
        name: "Primal Knowledge",
        level: 3,
        description:
          "You gain proficiency in another skill of your choice from the skill list available to Barbarians at level 1.",
        notes: [
          "While your Rage is active, you can channel primal power when you attempt certain tasks.",
          "Whenever you make an ability check using one of the following skills, you can make it as a Strength check even if it normally uses a different ability: Acrobatics, Intimidation, Perception, Stealth, or Survival.",
        ],
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
        id: "extra-attack",
        name: "Extra Attack",
        level: 5,
        description:
          "You can attack twice instead of once whenever you take the Attack action on your turn.",
      },
      {
        id: "fast-movement",
        name: "Fast Movement",
        level: 5,
        description:
          "Your speed increases by 10 feet while you aren’t wearing Heavy armor.",
      },
    ],
    6: [
      {
        id: "subclass-feature-6",
        name: "Subclass Feature",
        level: 6,
      },
    ],
    7: [
      {
        id: "feral-instinct",
        name: "Feral Instinct",
        level: 7,
        description:
          "Your instincts are so honed that you have Advantage on Initiative rolls.",
      },
      {
        id: "instinctive-pounce",
        name: "Instinctive Pounce",
        level: 7,
        description:
          "As part of the Bonus Action you take to enter your Rage, you can move up to half your Speed.",
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
        id: "brutal-strike",
        name: "Brutal Strike",
        level: 9,
        description:
          "If you use Reckless Attack, you can forgo any Advantage on one Strength-based attack roll of your choice on your turn to empower the hit.",
        notes: [
          "The chosen attack roll must not have Disadvantage.",
          "If the chosen attack roll hits, the target takes an extra 1d10 damage of the same type dealt by the weapon or Unarmed Strike.",
          "You can then cause one Brutal Strike effect of your choice.",
          "Forceful Blow: The target is pushed 15 feet straight away from you, and you can then move up to half your Speed straight toward the target without provoking Opportunity Attacks.",
          "Hamstring Blow: The target’s Speed is reduced by 15 feet until the start of your next turn. A target can be affected by only one Hamstring Blow at a time.",
        ],
      },
    ],
    10: [
      {
        id: "subclass-feature-10",
        name: "Subclass Feature",
        level: 10,
      },
    ],
    11: [
      {
        id: "relentless-rage",
        name: "Relentless Rage",
        level: 11,
        description:
          "Your Rage can keep you fighting despite grievous wounds.",
        notes: [
          "If you drop to 0 Hit Points while your Rage is active and don’t die outright, you can make a DC 10 Constitution saving throw.",
          "If you succeed, your Hit Points instead change to a number equal to twice your Barbarian level.",
          "Each time you use this feature after the first, the DC increases by 5.",
          "When you finish a Short Rest or Long Rest, the DC resets to 10.",
        ],
      },
    ],
    12: [
      {
        id: "ability-score-improvement-3",
        name: "Ability Score Improvement",
        level: 12,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    13: [
      {
        id: "improved-brutal-strike",
        name: "Improved Brutal Strike",
        level: 13,
        description:
          "You have honed new ways to attack furiously.",
        notes: [
          "The following effects are now among your Brutal Strike options.",
          "Staggering Blow: The target has Disadvantage on the next saving throw it makes, and it can’t make Opportunity Attacks until the start of your next turn.",
        ],
      },
    ],
    14: [
      {
        id: "subclass-feature-14",
        name: "Subclass Feature",
        level: 14,
      },
    ],
    15: [
      {
        id: "persistent-rage",
        name: "Persistent Rage",
        level: 15,
        description:
          "Your Rage is so fierce that it now lasts without you needing to do anything to extend it from round to round.",
        notes: [
          "When you roll Initiative, you can regain all expended uses of Rage.",
          "After you regain uses of Rage in this way, you can’t do so again until you finish a Long Rest.",
          "Your Rage now lasts for 10 minutes without needing to be extended.",
          "Your Rage ends early only if you have the Unconscious condition, not just the Incapacitated condition, or don Heavy armor.",
        ],
      },
    ],
    16: [
      {
        id: "ability-score-improvement-4",
        name: "Ability Score Improvement",
        level: 16,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    17: [
      {
        id: "improved-brutal-strike-2",
        name: "Improved Brutal Strike",
        level: 17,
        description:
          "The extra damage of your Brutal Strike increases to 2d10, and you can use two different Brutal Strike effects whenever you use Brutal Strike.",
      },
    ],
    18: [
      {
        id: "indomitable-might",
        name: "Indomitable Might",
        level: 18,
        description:
          "If your total for a Strength check or Strength saving throw is less than your Strength score, you can use that score in place of the total.",
      },
    ],
    19: [
      {
        id: "epic-boon",
        name: "Epic Boon",
        level: 19,
        description:
          "You gain an Epic Boon feat or another feat of your choice for which you qualify.",
        notes: ["Boon of Irresistible Offense is recommended."],
      },
    ],
    20: [
      {
        id: "primal-champion",
        name: "Primal Champion",
        level: 20,
        description:
          "You embody primal power. Your Strength and Constitution scores increase by 4, to a maximum of 25.",
      },
    ],
  },
};