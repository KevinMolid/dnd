import type {
  ChoiceMapByLevel,
  SkillId,
  SpellId,
} from "../../../types";

export const druidSkillChoiceOptions: SkillId[] = [
  "arcana",
  "animal-handling",
  "insight",
  "medicine",
  "nature",
  "perception",
  "religion",
  "survival",
];

export const druidPrimalOrderChoicesByLevel: ChoiceMapByLevel<string> = {
  1: [
    {
      id: "druid-primal-order",
      level: 1,
      name: "Primal Order",
      choose: 1,
      source: "class-feature",
      options: ["magician", "warden"],
      description: "Choose your Primal Order: Magician or Warden.",
    },
  ],
};

export const druidSubclassChoicesByLevel: ChoiceMapByLevel<string> = {
  3: [
    {
      id: "druid-subclass",
      level: 3,
      name: "Druid Subclass",
      choose: 1,
      source: "subclass",
      options: [
        "circle-of-the-land",
        "circle-of-the-moon",
        "circle-of-the-sea",
        "circle-of-the-stars",
      ],
      description: "Choose a Druid subclass.",
    },
  ],
};

export const druidCantripChoicesByLevel: ChoiceMapByLevel<SpellId> = {
  1: [
    {
      id: "druid-cantrips-1",
      level: 1,
      name: "Druid Cantrips",
      choose: 2,
      source: "cantrips",
      options: [
        "druidcraft",
        "elementalism",
        "guidance",
        "mending",
        "message",
        "poison-spray",
        "produce-flame",
        "resistance",
        "shillelagh",
        "spare-the-dying",
        "starry-wisp",
        "thorn-whip",
      ],
      description: "Choose two Druid cantrips.",
    },
  ],
  4: [
    {
      id: "druid-cantrip-4",
      level: 4,
      name: "Additional Druid Cantrip",
      choose: 1,
      source: "cantrips",
      options: [
        "druidcraft",
        "elementalism",
        "guidance",
        "mending",
        "message",
        "poison-spray",
        "produce-flame",
        "resistance",
        "shillelagh",
        "spare-the-dying",
        "starry-wisp",
        "thorn-whip",
      ],
      description: "Choose one additional Druid cantrip.",
    },
  ],
  10: [
    {
      id: "druid-cantrip-10",
      level: 10,
      name: "Additional Druid Cantrip",
      choose: 1,
      source: "cantrips",
      options: [
        "druidcraft",
        "elementalism",
        "guidance",
        "mending",
        "message",
        "poison-spray",
        "produce-flame",
        "resistance",
        "shillelagh",
        "spare-the-dying",
        "starry-wisp",
        "thorn-whip",
      ],
      description: "Choose one additional Druid cantrip.",
    },
  ],
};

export const druidElementalFuryChoicesByLevel: ChoiceMapByLevel<string> = {
  7: [
    {
      id: "druid-elemental-fury",
      level: 7,
      name: "Elemental Fury",
      choose: 1,
      source: "class-feature",
      options: ["potent-spellcasting", "primal-strike"],
      description:
        "Choose Potent Spellcasting or Primal Strike for your Elemental Fury.",
    },
  ],
};

export const druidCircleOfTheLandChoicesByLevel: ChoiceMapByLevel<string> = {
  3: [
    {
      id: "circle-of-the-land-type",
      level: 3,
      name: "Circle of the Land Type",
      choose: 1,
      source: "other",
      options: ["arid", "polar", "temperate", "tropical"],
      description:
        "If you choose Circle of the Land, choose your current land type.",
    },
  ],
};