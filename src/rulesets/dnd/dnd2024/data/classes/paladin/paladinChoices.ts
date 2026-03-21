import type {
  ChoiceDefinition,
  ChoiceMapByLevel,
  FightingStyleId,
  SkillId,
  SpellId,
  WeaponMasteryChoiceId,
} from "../../../types";

export const paladinSkillChoiceOptions: SkillId[] = [
  "athletics",
  "insight",
  "intimidation",
  "medicine",
  "persuasion",
  "religion",
];

export const paladinWeaponMasteryChoices: ChoiceMapByLevel<WeaponMasteryChoiceId> =
  {
    1: [
      {
        id: "paladin-weapon-mastery",
        level: 1,
        name: "Weapon Mastery",
        choose: 2,
        source: "weapon-mastery",
        options: [
          "club",
          "dagger",
          "dart",
          "handaxe",
          "javelin",
          "light-crossbow",
          "mace",
          "quarterstaff",
          "rapier",
          "scimitar",
          "shortbow",
          "shortsword",
          "sickle",
          "sling",
          "spear",
          "battleaxe",
          "flail",
          "glaive",
          "greataxe",
          "greatclub",
          "greatsword",
          "halberd",
          "lance",
          "light-hammer",
          "longbow",
          "longsword",
          "maul",
          "morningstar",
          "pike",
          "trident",
          "war-pick",
          "warhammer",
          "whip",
          "heavy-crossbow",
          "hand-crossbow",
        ],
        description:
          "Choose two kinds of weapons with which you have proficiency to use their mastery properties.",
      },
    ],
  };

export const paladinFightingStyleChoicesByLevel: ChoiceMapByLevel<FightingStyleId> =
  {
    2: [
      {
        id: "paladin-fighting-style",
        level: 2,
        name: "Fighting Style",
        choose: 1,
        source: "fighting-style",
        options: [
          "blessed-warrior",
          "defense",
          "dueling",
          "great-weapon-fighting",
          "interception",
          "protection",
        ],
        description:
          "Choose one Fighting Style feat. You can choose Blessed Warrior instead of a Fighting Style feat.",
      },
    ],
  };

export const paladinSubclassChoicesByLevel: ChoiceMapByLevel<string> = {
  3: [
    {
      id: "paladin-subclass",
      level: 3,
      name: "Paladin Subclass",
      choose: 1,
      source: "subclass",
      options: [
        "oath-of-devotion",
        "oath-of-glory",
        "oath-of-the-ancients",
        "oath-of-vengeance",
      ],
      description: "Choose a Paladin subclass.",
    },
  ],
};

export const paladinBlessedWarriorCantripChoice: ChoiceDefinition<SpellId> = {
  id: "paladin-blessed-warrior-cantrips",
  level: 2,
  name: "Blessed Warrior Cantrips",
  choose: 2,
  source: "cantrips",
  options: [
    "guidance",
    "light",
    "mending",
    "resistance",
    "sacred-flame",
    "spare-the-dying",
    "thaumaturgy",
    "toll-the-dead",
    "word-of-radiance",
  ],
  description:
    "If you choose Blessed Warrior, choose two Cleric cantrips. These count as Paladin spells for you.",
};