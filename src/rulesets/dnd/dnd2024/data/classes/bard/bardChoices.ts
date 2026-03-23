import type {
  ChoiceMapByLevel,
  SkillId,
  SpellId,
  ToolId,
} from "../../../types";

export const bardSkillChoiceOptions: SkillId[] = [
  "acrobatics",
  "animal-handling",
  "arcana",
  "athletics",
  "deception",
  "history",
  "insight",
  "intimidation",
  "investigation",
  "medicine",
  "nature",
  "perception",
  "performance",
  "persuasion",
  "religion",
  "sleight-of-hand",
  "stealth",
  "survival",
];

export const bardToolChoicesByLevel: ChoiceMapByLevel<ToolId> = {
  1: [
    {
      id: "bard-musical-instruments",
      level: 1,
      name: "Musical Instruments",
      choose: 3,
      source: "tool-proficiencies",
      options: [
        "bagpipes",
        "drum",
        "dulcimer",
        "flute",
        "horn",
        "lute",
        "lyre",
        "pan-flute",
        "shawm",
        "viol",
      ],
      description: "Choose three Musical Instruments.",
    },
  ],
};

export const bardSubclassChoicesByLevel: ChoiceMapByLevel<string> = {
  3: [
    {
      id: "bard-subclass",
      level: 3,
      name: "Bard Subclass",
      choose: 1,
      source: "subclass",
      options: [
        "college-of-dance",
        "college-of-glamour",
        "college-of-lore",
        "college-of-valor",
      ],
      description: "Choose a Bard subclass.",
    },
  ],
};

export const bardCantripChoicesByLevel: ChoiceMapByLevel<SpellId> = {
  1: [
    {
      id: "bard-cantrips-1",
      level: 1,
      name: "Bard Cantrips",
      choose: 2,
      source: "cantrips",
      options: [
        "blade-ward",
        "dancing-lights",
        "friends",
        "light",
        "mage-hand",
        "mending",
        "message",
        "minor-illusion",
        "prestidigitation",
        "starry-wisp",
        "thunderclap",
        "true-strike",
        "vicious-mockery",
      ],
      description: "Choose two Bard cantrips.",
    },
  ],
  4: [
    {
      id: "bard-cantrip-4",
      level: 4,
      name: "Additional Bard Cantrip",
      choose: 1,
      source: "cantrips",
      options: [
        "blade-ward",
        "dancing-lights",
        "friends",
        "light",
        "mage-hand",
        "mending",
        "message",
        "minor-illusion",
        "prestidigitation",
        "starry-wisp",
        "thunderclap",
        "true-strike",
        "vicious-mockery",
      ],
      description: "Choose one additional Bard cantrip.",
    },
  ],
  10: [
    {
      id: "bard-cantrip-10",
      level: 10,
      name: "Additional Bard Cantrip",
      choose: 1,
      source: "cantrips",
      options: [
        "blade-ward",
        "dancing-lights",
        "friends",
        "light",
        "mage-hand",
        "mending",
        "message",
        "minor-illusion",
        "prestidigitation",
        "starry-wisp",
        "thunderclap",
        "true-strike",
        "vicious-mockery",
      ],
      description: "Choose one additional Bard cantrip.",
    },
  ],
};

export const bardExpertiseChoicesByLevel: ChoiceMapByLevel<string> = {
  2: [
    {
      id: "bard-expertise-2",
      level: 2,
      name: "Expertise",
      choose: 2,
      source: "expertise",
      description:
        "Choose two of your skill proficiencies to gain Expertise in.",
    },
  ],
  9: [
    {
      id: "bard-expertise-9",
      level: 9,
      name: "Expertise",
      choose: 2,
      source: "expertise",
      description:
        "Choose two more of your skill proficiencies to gain Expertise in.",
    },
  ],
};