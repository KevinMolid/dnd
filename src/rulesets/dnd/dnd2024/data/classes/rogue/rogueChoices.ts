import type {
  ChoiceDefinition,
  ChoiceMapByLevel,
  LanguageId,
  RogueCunningStrikeOption,
  SkillId,
  WeaponMasteryChoiceId,
} from "../../../types";

export const rogueExpertiseChoiceOptions: Array<SkillId | "thieves-tools"> = [
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
  "thieves-tools",
];

export const rogueExpertiseChoicesByLevel: ChoiceMapByLevel<
  SkillId | "thieves-tools"
> = {
  1: [
    {
      id: "rogue-expertise-1",
      level: 1,
      name: "Expertise",
      choose: 2,
      source: "expertise",
      options: rogueExpertiseChoiceOptions,
      description:
        "Choose two of your skill proficiencies or Thieves’ Tools to gain Expertise.",
    },
  ],
  6: [
    {
      id: "rogue-expertise-2",
      level: 6,
      name: "Expertise",
      choose: 2,
      source: "expertise",
      options: rogueExpertiseChoiceOptions,
      description:
        "Choose two more of your skill proficiencies or Thieves’ Tools to gain Expertise.",
    },
  ],
};

export const rogueLanguageChoice: ChoiceDefinition<LanguageId> = {
  id: "rogue-language-choice",
  level: 1,
  name: "Thieves’ Cant Bonus Language",
  choose: 1,
  source: "languages",
  options: [
    "common",
    "draconic",
    "dwarvish",
    "elvish",
    "giant",
    "gnomish",
    "goblin",
    "halfling",
    "orc",
    "primordial",
    "sylvan",
    "infernal",
    "celestial",
    "abyssal",
    "undercommon",
    "deep-speech",
  ],
  description:
    "You know Thieves’ Cant and one other language of your choice.",
};

export const rogueWeaponMasteryChoices: ChoiceMapByLevel<WeaponMasteryChoiceId> =
  {
    1: [
      {
        id: "rogue-weapon-mastery",
        level: 1,
        name: "Weapon Mastery",
        choose: 2,
        source: "weapon-mastery",
        options: [
          "dagger",
          "dart",
          "light-crossbow",
          "rapier",
          "scimitar",
          "shortbow",
          "shortsword",
          "sling",
        ],
        description:
          "Choose two kinds of weapons with which you have proficiency to use their mastery properties.",
      },
    ],
  };

export const rogueCunningStrikeOptions: RogueCunningStrikeOption[] = [
  {
    id: "poison",
    name: "Poison",
    level: 5,
    costDice: 1,
    description:
      "The target must make a Constitution saving throw. On a failed save, the target has the Poisoned condition for 1 minute. At the end of each of its turns, the Poisoned target repeats the save, ending the effect on itself on a success.",
    savingThrow: "con",
    requires: ["poisoners-kit"],
  },
  {
    id: "trip",
    name: "Trip",
    level: 5,
    costDice: 1,
    description:
      "If the target is Large or smaller, it must succeed on a Dexterity saving throw or have the Prone condition.",
    savingThrow: "dex",
  },
  {
    id: "withdraw",
    name: "Withdraw",
    level: 5,
    costDice: 1,
    description:
      "Immediately after the attack, you move up to half your Speed without provoking Opportunity Attacks.",
  },
  {
    id: "daze",
    name: "Daze",
    level: 14,
    costDice: 2,
    description:
      "The target must succeed on a Constitution saving throw, or on its next turn it can do only one of the following: move or take an action or a Bonus Action.",
    savingThrow: "con",
  },
  {
    id: "knock-out",
    name: "Knock Out",
    level: 14,
    costDice: 6,
    description:
      "The target must succeed on a Constitution saving throw, or it has the Unconscious condition for 1 minute or until it takes any damage. The Unconscious target repeats the save at the end of each of its turns, ending the effect on itself on a success.",
    savingThrow: "con",
  },
  {
    id: "obscure",
    name: "Obscure",
    level: 14,
    costDice: 3,
    description:
      "The target must succeed on a Dexterity saving throw, or it has the Blinded condition until the end of its next turn.",
    savingThrow: "dex",
  },
];