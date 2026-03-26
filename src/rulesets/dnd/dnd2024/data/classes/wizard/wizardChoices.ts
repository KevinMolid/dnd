import type {
  ChoiceMapByLevel,
  SkillId,
  SpellId,
} from "../../../types";

export const wizardSkillChoiceOptions: SkillId[] = [
  "arcana",
  "history",
  "insight",
  "investigation",
  "medicine",
  "nature",
  "religion",
];

export const wizardScholarChoicesByLevel: ChoiceMapByLevel<string> = {
  2: [
    {
      id: "wizard-scholar",
      level: 2,
      name: "Scholar",
      choose: 1,
      source: "class-feature",
      options: [
        "arcana",
        "history",
        "investigation",
        "medicine",
        "nature",
        "religion",
      ],
      description:
        "Choose one proficient skill to gain Expertise from Scholar.",
    },
  ],
};

export const wizardSubclassChoicesByLevel: ChoiceMapByLevel<string> = {
  3: [
    {
      id: "wizard-subclass",
      level: 3,
      name: "Wizard Subclass",
      choose: 1,
      source: "subclass",
      options: ["abjurer", "diviner", "evoker", "illusionist"],
      description: "Choose a Wizard subclass.",
    },
  ],
};

export const wizardCantripChoicesByLevel: ChoiceMapByLevel<SpellId> = {
  1: [
    {
      id: "wizard-cantrips-1",
      level: 1,
      name: "Wizard Cantrips",
      choose: 3,
      source: "cantrips",
      options: [
        "acid-splash",
        "blade-ward",
        "chill-touch",
        "dancing-lights",
        "elementalism",
        "fire-bolt",
        "friends",
        "light",
        "mage-hand",
        "mending",
        "message",
        "mind-sliver",
        "minor-illusion",
        "poison-spray",
        "prestidigitation",
        "ray-of-frost",
        "shocking-grasp",
        "thunderclap",
        "true-strike",
      ],
      description: "Choose three Wizard cantrips.",
    },
  ],
  4: [
    {
      id: "wizard-cantrip-4",
      level: 4,
      name: "Additional Wizard Cantrip",
      choose: 1,
      source: "cantrips",
      options: [
        "acid-splash",
        "blade-ward",
        "chill-touch",
        "dancing-lights",
        "elementalism",
        "fire-bolt",
        "friends",
        "light",
        "mage-hand",
        "mending",
        "message",
        "mind-sliver",
        "minor-illusion",
        "poison-spray",
        "prestidigitation",
        "ray-of-frost",
        "shocking-grasp",
        "thunderclap",
        "true-strike",
      ],
      description: "Choose one additional Wizard cantrip.",
    },
  ],
  10: [
    {
      id: "wizard-cantrip-10",
      level: 10,
      name: "Additional Wizard Cantrip",
      choose: 1,
      source: "cantrips",
      options: [
        "acid-splash",
        "blade-ward",
        "chill-touch",
        "dancing-lights",
        "elementalism",
        "fire-bolt",
        "friends",
        "light",
        "mage-hand",
        "mending",
        "message",
        "mind-sliver",
        "minor-illusion",
        "poison-spray",
        "prestidigitation",
        "ray-of-frost",
        "shocking-grasp",
        "thunderclap",
        "true-strike",
      ],
      description: "Choose one additional Wizard cantrip.",
    },
  ],
};

const wizardLevel1SpellOptions: SpellId[] = [
  "alarm",
  "burning-hands",
  "charm-person",
  "chromatic-orb",
  "color-spray",
  "comprehend-languages",
  "detect-magic",
  "disguise-self",
  "expeditious-retreat",
  "false-life",
  "feather-fall",
  "find-familiar",
  "fog-cloud",
  "grease",
  "ice-knife",
  "identify",
  "jump",
  "longstrider",
  "mage-armor",
  "magic-missile",
  "protection-from-evil-and-good",
  "ray-of-sickness",
  "shield",
  "silent-image",
  "sleep",
  "tashas-hideous-laughter",
  "tensers-floating-disk",
  "thunderwave",
  "unseen-servant",
  "witch-bolt",
];

const wizardLevel2SpellOptions: SpellId[] = [
  "alter-self",
  "arcane-lock",
  "blindness-deafness",
  "blur",
  "cloud-of-daggers",
  "continual-flame",
  "darkness",
  "darkvision",
  "detect-thoughts",
  "enlarge-reduce",
  "flaming-sphere",
  "gentle-repose",
  "gust-of-wind",
  "hold-person",
  "invisibility",
  "knock",
  "levitate",
  "locate-object",
  "magic-mouth",
  "magic-weapon",
  "mirror-image",
  "misty-step",
  "phantasmal-force",
  "rope-trick",
  "scorching-ray",
  "see-invisibility",
  "shatter",
  "spider-climb",
  "suggestion",
  "web",
];

const wizardLevel3SpellOptions: SpellId[] = [
  "blink",
  "clairvoyance",
  "counterspell",
  "daylight",
  "dispel-magic",
  "fear",
  "fireball",
  "fly",
  "gaseous-form",
  "glyph-of-warding",
  "haste",
  "hypnotic-pattern",
  "lightning-bolt",
  "magic-circle",
  "major-image",
  "nondetection",
  "protection-from-energy",
  "remove-curse",
  "sending",
  "sleet-storm",
  "slow",
  "stinking-cloud",
  "thunder-step",
  "tiny-hut",
  "tongues",
  "vampiric-touch",
  "water-breathing",
];

const wizardLevel4SpellOptions: SpellId[] = [
  "arcane-eye",
  "banishment",
  "blight",
  "confusion",
  "conjure-minor-elementals",
  "control-water",
  "dimension-door",
  "fabricate",
  "fire-shield",
  "greater-invisibility",
  "hallucinatory-terrain",
  "ice-storm",
  "locate-creature",
  "phantasmal-killer",
  "polymorph",
  "resilient-sphere",
  "secret-chest",
  "stoneskin",
  "wall-of-fire",
];

const wizardLevel5SpellOptions: SpellId[] = [
  "animate-objects",
  "arcane-hand",
  "cloudkill",
  "cone-of-cold",
  "conjure-elemental",
  "contact-other-plane",
  "creation",
  "dominate-person",
  "dream",
  "geas",
  "hold-monster",
  "legend-lore",
  "mislead",
  "modify-memory",
  "passwall",
  "planar-binding",
  "scrying",
  "seeming",
  "telekinesis",
  "teleportation-circle",
  "wall-of-force",
];

const wizardLevel6SpellOptions: SpellId[] = [
  "arcane-gate",
  "chain-lightning",
  "circle-of-death",
  "contingency",
  "create-undead",
  "disintegrate",
  "drawmijs-instant-summons",
  "eyebite",
  "flesh-to-stone",
  "globe-of-invulnerability",
  "guards-and-wards",
  "magic-jar",
  "mass-suggestion",
  "move-earth",
  "sunbeam",
  "true-seeing",
  "wall-of-ice",
];

const wizardLevel7SpellOptions: SpellId[] = [
  "delayed-blast-fireball",
  "etherealness",
  "finger-of-death",
  "forcecage",
  "magnificent-mansion",
  "mirage-arcane",
  "plane-shift",
  "prismatic-spray",
  "project-image",
  "reverse-gravity",
  "sequester",
  "simulacrum",
  "symbol",
  "teleport",
];

const wizardLevel8SpellOptions: SpellId[] = [
  "antimagic-field",
  "antipathy-sympathy",
  "clone",
  "control-weather",
  "demiplane",
  "dominate-monster",
  "feeblemind",
  "incendiary-cloud",
  "maze",
  "mind-blank",
  "power-word-stun",
  "sunburst",
  "telepathy",
];

const wizardLevel9SpellOptions: SpellId[] = [
  "foresight",
  "gate",
  "imprisonment",
  "meteor-swarm",
  "power-word-kill",
  "prismatic-wall",
  "shapechange",
  "time-stop",
  "true-polymorph",
  "weird",
  "wish",
];

const wizardSpellbookOptionsUpToLevel1: SpellId[] = [
  ...wizardLevel1SpellOptions,
];

const wizardSpellbookOptionsUpToLevel2: SpellId[] = [
  ...wizardLevel1SpellOptions,
  ...wizardLevel2SpellOptions,
];

const wizardSpellbookOptionsUpToLevel3: SpellId[] = [
  ...wizardLevel1SpellOptions,
  ...wizardLevel2SpellOptions,
  ...wizardLevel3SpellOptions,
];

const wizardSpellbookOptionsUpToLevel4: SpellId[] = [
  ...wizardLevel1SpellOptions,
  ...wizardLevel2SpellOptions,
  ...wizardLevel3SpellOptions,
  ...wizardLevel4SpellOptions,
];

const wizardSpellbookOptionsUpToLevel5: SpellId[] = [
  ...wizardLevel1SpellOptions,
  ...wizardLevel2SpellOptions,
  ...wizardLevel3SpellOptions,
  ...wizardLevel4SpellOptions,
  ...wizardLevel5SpellOptions,
];

const wizardSpellbookOptionsUpToLevel6: SpellId[] = [
  ...wizardLevel1SpellOptions,
  ...wizardLevel2SpellOptions,
  ...wizardLevel3SpellOptions,
  ...wizardLevel4SpellOptions,
  ...wizardLevel5SpellOptions,
  ...wizardLevel6SpellOptions,
];

const wizardSpellbookOptionsUpToLevel7: SpellId[] = [
  ...wizardLevel1SpellOptions,
  ...wizardLevel2SpellOptions,
  ...wizardLevel3SpellOptions,
  ...wizardLevel4SpellOptions,
  ...wizardLevel5SpellOptions,
  ...wizardLevel6SpellOptions,
  ...wizardLevel7SpellOptions,
];

const wizardSpellbookOptionsUpToLevel8: SpellId[] = [
  ...wizardLevel1SpellOptions,
  ...wizardLevel2SpellOptions,
  ...wizardLevel3SpellOptions,
  ...wizardLevel4SpellOptions,
  ...wizardLevel5SpellOptions,
  ...wizardLevel6SpellOptions,
  ...wizardLevel7SpellOptions,
  ...wizardLevel8SpellOptions,
];

const wizardSpellbookOptionsUpToLevel9: SpellId[] = [
  ...wizardLevel1SpellOptions,
  ...wizardLevel2SpellOptions,
  ...wizardLevel3SpellOptions,
  ...wizardLevel4SpellOptions,
  ...wizardLevel5SpellOptions,
  ...wizardLevel6SpellOptions,
  ...wizardLevel7SpellOptions,
  ...wizardLevel8SpellOptions,
  ...wizardLevel9SpellOptions,
];

export const wizardSpellbookChoicesByLevel: ChoiceMapByLevel<SpellId> = {
  1: [
    {
      id: "wizard-spellbook-1",
      level: 1,
      name: "Wizard Spellbook",
      choose: 6,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel1,
      description: "Choose six level 1 Wizard spells for your spellbook.",
    },
  ],
  2: [
    {
      id: "wizard-spellbook-2",
      level: 2,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel1,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  3: [
    {
      id: "wizard-spellbook-3",
      level: 3,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel2,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  4: [
    {
      id: "wizard-spellbook-4",
      level: 4,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel2,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  5: [
    {
      id: "wizard-spellbook-5",
      level: 5,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel3,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  6: [
    {
      id: "wizard-spellbook-6",
      level: 6,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel3,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  7: [
    {
      id: "wizard-spellbook-7",
      level: 7,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel4,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  8: [
    {
      id: "wizard-spellbook-8",
      level: 8,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel4,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  9: [
    {
      id: "wizard-spellbook-9",
      level: 9,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel5,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  10: [
    {
      id: "wizard-spellbook-10",
      level: 10,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel5,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  11: [
    {
      id: "wizard-spellbook-11",
      level: 11,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel6,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  12: [
    {
      id: "wizard-spellbook-12",
      level: 12,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel6,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  13: [
    {
      id: "wizard-spellbook-13",
      level: 13,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel7,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  14: [
    {
      id: "wizard-spellbook-14",
      level: 14,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel7,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  15: [
    {
      id: "wizard-spellbook-15",
      level: 15,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel8,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  16: [
    {
      id: "wizard-spellbook-16",
      level: 16,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel8,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  17: [
    {
      id: "wizard-spellbook-17",
      level: 17,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel9,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  18: [
    {
      id: "wizard-spellbook-18",
      level: 18,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel9,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  19: [
    {
      id: "wizard-spellbook-19",
      level: 19,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel9,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
  20: [
    {
      id: "wizard-spellbook-20",
      level: 20,
      name: "Wizard Spellbook",
      choose: 2,
      source: "spells",
      options: wizardSpellbookOptionsUpToLevel9,
      description:
        "Choose two Wizard spells to add to your spellbook. Each spell must be of a level for which you have spell slots.",
    },
  ],
};