import type {
  ChoiceMapByLevel,
  SkillId,
  SpellId,
} from "../../../types";

export const clericSkillChoiceOptions: SkillId[] = [
  "history",
  "insight",
  "medicine",
  "persuasion",
  "religion",
];

export const clericDivineOrderChoicesByLevel: ChoiceMapByLevel<string> = {
  1: [
    {
      id: "cleric-divine-order",
      level: 1,
      name: "Divine Order",
      choose: 1,
      source: "class-feature",
      options: ["protector", "thaumaturge"],
      description: "Choose your Divine Order: Protector or Thaumaturge.",
    },
  ],
};

export const clericSubclassChoicesByLevel: ChoiceMapByLevel<string> = {
  3: [
    {
      id: "cleric-subclass",
      level: 3,
      name: "Cleric Subclass",
      choose: 1,
      source: "subclass",
      options: [
        "life-domain",
        "light-domain",
        "trickery-domain",
        "war-domain",
      ],
      description: "Choose a Cleric subclass.",
    },
  ],
};

export const clericCantripChoicesByLevel: ChoiceMapByLevel<SpellId> = {
  1: [
    {
      id: "cleric-cantrips-1",
      level: 1,
      name: "Cleric Cantrips",
      choose: 3,
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
      description: "Choose three Cleric cantrips.",
    },
  ],
  4: [
    {
      id: "cleric-cantrip-4",
      level: 4,
      name: "Additional Cleric Cantrip",
      choose: 1,
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
      description: "Choose one additional Cleric cantrip.",
    },
  ],
  10: [
    {
      id: "cleric-cantrip-10",
      level: 10,
      name: "Additional Cleric Cantrip",
      choose: 1,
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
      description: "Choose one additional Cleric cantrip.",
    },
  ],
};

export const clericBlessedStrikesChoicesByLevel: ChoiceMapByLevel<string> = {
  7: [
    {
      id: "cleric-blessed-strikes",
      level: 7,
      name: "Blessed Strikes",
      choose: 1,
      source: "class-feature",
      options: ["divine-strike", "potent-spellcasting"],
      description:
        "Choose Divine Strike or Potent Spellcasting for your Blessed Strikes.",
    },
  ],
};

/**
 * Optional:
 * Add this only if your character-creation / level-up system supports
 * conditional choices tied to previous feature selections.
 */
export const clericThaumaturgeBonusCantripChoicesByLevel: ChoiceMapByLevel<SpellId> =
  {
    1: [
      {
        id: "cleric-thaumaturge-bonus-cantrip",
        level: 1,
        name: "Thaumaturge Bonus Cantrip",
        choose: 1,
        source: "class-feature",
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
          "If you chose Thaumaturge for Divine Order, choose one extra Cleric cantrip.",
      },
    ],
  };