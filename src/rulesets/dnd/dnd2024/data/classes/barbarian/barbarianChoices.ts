import type {
  ChoiceMapByLevel,
  SkillId,
  WeaponMasteryChoiceId,
} from "../../../types";

export const barbarianSkillChoiceOptions: SkillId[] = [
  "animal-handling",
  "athletics",
  "intimidation",
  "nature",
  "perception",
  "survival",
];

export const barbarianWeaponMasteryOptions: WeaponMasteryChoiceId[] = [
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
];

export const barbarianSubclassChoicesByLevel: ChoiceMapByLevel<string> = {
  3: [
    {
      id: "barbarian-subclass",
      level: 3,
      name: "Barbarian Subclass",
      choose: 1,
      source: "subclass",
      options: [
        "path-of-the-berserker",
        "path-of-the-wild-heart",
        "path-of-the-world-tree",
        "path-of-the-zealot",
      ],
      description: "Choose a Barbarian subclass.",
    },
  ],
};

export const barbarianPrimalKnowledgeChoicesByLevel: ChoiceMapByLevel<SkillId> =
  {
    3: [
      {
        id: "barbarian-primal-knowledge",
        level: 3,
        name: "Primal Knowledge",
        choose: 1,
        source: "class-feature",
        options: [
          "animal-handling",
          "athletics",
          "intimidation",
          "nature",
          "perception",
          "survival",
        ],
        description:
          "Choose one additional Barbarian class skill proficiency.",
      },
    ],
  };

export const barbarianWeaponMasteryChoicesByLevel: ChoiceMapByLevel<WeaponMasteryChoiceId> =
  {
    1: [
      {
        id: "barbarian-weapon-mastery-1",
        level: 1,
        name: "Weapon Mastery",
        choose: 2,
        source: "weapon-mastery",
        options: barbarianWeaponMasteryOptions,
        description:
          "Choose two kinds of Simple or Martial Melee weapons for Weapon Mastery.",
      },
    ],
    4: [
      {
        id: "barbarian-weapon-mastery-4",
        level: 4,
        name: "Additional Weapon Mastery",
        choose: 1,
        source: "weapon-mastery",
        options: barbarianWeaponMasteryOptions,
        description: "Choose one additional weapon for Weapon Mastery.",
      },
    ],
    10: [
      {
        id: "barbarian-weapon-mastery-10",
        level: 10,
        name: "Additional Weapon Mastery",
        choose: 1,
        source: "weapon-mastery",
        options: barbarianWeaponMasteryOptions,
        description: "Choose one additional weapon for Weapon Mastery.",
      },
    ],
  };