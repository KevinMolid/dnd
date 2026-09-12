import type {
  ChoiceDefinition,
  ChoiceMapByLevel,
  FightingStyleId,
  SkillId,
  SpellId,
  WeaponMasteryChoiceId,
} from "../../../types";

export const rangerSkillChoiceOptions: SkillId[] = [
  "animal-handling",
  "athletics",
  "insight",
  "investigation",
  "nature",
  "perception",
  "stealth",
  "survival",
];

export const rangerWeaponMasteryChoices: ChoiceMapByLevel<WeaponMasteryChoiceId> =
  {
    1: [
      {
        id: "ranger-weapon-mastery",
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

export const rangerFightingStyleChoicesByLevel: ChoiceMapByLevel<FightingStyleId> =
  {
    2: [
      {
        id: "ranger-fighting-style",
        level: 2,
        name: "Fighting Style",
        choose: 1,
        source: "fighting-style",
        options: [
          "archery",
          "defense",
          "dueling",
          "two-weapon-fighting",
          "druidic-warrior",
        ],
        description:
          "Choose a Fighting Style feat. You can choose Druidic Warrior instead of a Fighting Style feat.",
      },
    ],
  };

export const rangerSubclassChoicesByLevel: ChoiceMapByLevel<string> = {
  3: [
    {
      id: "ranger-subclass",
      level: 3,
      name: "Ranger Subclass",
      choose: 1,
      source: "subclass",
      options: [
        "beast-master",
        "fey-wanderer",
        "gloom-stalker",
        "hunter",
      ],
      description: "Choose a Ranger subclass.",
    },
  ],
};

export const rangerDruidicWarriorCantripChoice: ChoiceDefinition<SpellId> = {
  id: "ranger-druidic-warrior-cantrips",
  level: 2,
  name: "Druidic Warrior Cantrips",
  choose: 2,
  source: "cantrips",
  options: [
    "druidcraft",
    "elementalism",
    "guidance",
    "mending",
    "poison-spray",
    "produce-flame",
    "resistance",
    "shillelagh",
    "spare-the-dying",
    "starry-wisp",
    "thorn-whip",
    "thunderclap",
  ],
  description:
    "Choose two Druid cantrips. These count as Ranger spells for you, and Wisdom is your spellcasting ability for them.",
};