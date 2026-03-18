import type {
  Background,
  CharacterClass,
  ElfLineage,
  Feat,
  Species,
} from "./types";

export const classes: CharacterClass[] = [
  {
    id: "fighter",
    name: "Fighter",
    hitDie: 10,
    primaryAbilities: ["str", "dex"],
    savingThrowProficiencies: ["str", "con"],
    armorTraining: ["light-armor", "medium-armor", "heavy-armor", "shields"],
    weaponProficiencies: ["simple-weapons", "martial-weapons"],
    skillChoice: {
      choose: 2,
      options: [
        "acrobatics",
        "animal-handling",
        "athletics",
        "history",
        "insight",
        "intimidation",
        "perception",
        "survival",
      ],
    },
    featuresByLevel: {
      1: [
        { id: "fighting-style", name: "Fighting Style", level: 1 },
        { id: "second-wind", name: "Second Wind", level: 1 },
      ],
    },
  },
  {
    id: "rogue",
    name: "Rogue",
    hitDie: 8,
    primaryAbilities: ["dex"],
    savingThrowProficiencies: ["dex", "int"],
    armorTraining: ["light-armor"],
    weaponProficiencies: ["simple-weapons", "martial-finesse-or-light"],
    toolProficiencies: ["thieves-tools"],
    skillChoice: {
      choose: 4,
      options: [
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
      ],
    },
    featuresByLevel: {
      1: [
        { id: "expertise", name: "Expertise", level: 1 },
        { id: "sneak-attack", name: "Sneak Attack", level: 1 },
        { id: "thieves-cant", name: "Thieves’ Cant", level: 1 },
        { id: "weapon-mastery", name: "Weapon Mastery", level: 1 },
      ],
      2: [{ id: "cunning-action", name: "Cunning Action", level: 2 }],
      3: [
        { id: "rogue-subclass", name: "Rogue Subclass", level: 3 },
        { id: "steady-aim", name: "Steady Aim", level: 3 },
      ],
      4: [
        {
          id: "ability-score-improvement",
          name: "Ability Score Improvement",
          level: 4,
        },
      ],
      5: [
        { id: "cunning-strike", name: "Cunning Strike", level: 5 },
        { id: "uncanny-dodge", name: "Uncanny Dodge", level: 5 },
      ],
      6: [{ id: "expertise-2", name: "Expertise", level: 6 }],
      7: [
        { id: "evasion", name: "Evasion", level: 7 },
        { id: "reliable-talent", name: "Reliable Talent", level: 7 },
      ],
      8: [
        {
          id: "ability-score-improvement-2",
          name: "Ability Score Improvement",
          level: 8,
        },
      ],
      9: [{ id: "subclass-feature-9", name: "Subclass Feature", level: 9 }],
      10: [
        {
          id: "ability-score-improvement-3",
          name: "Ability Score Improvement",
          level: 10,
        },
      ],
      11: [
        {
          id: "improved-cunning-strike",
          name: "Improved Cunning Strike",
          level: 11,
        },
      ],
      12: [
        {
          id: "ability-score-improvement-4",
          name: "Ability Score Improvement",
          level: 12,
        },
      ],
      13: [{ id: "subclass-feature-13", name: "Subclass Feature", level: 13 }],
      14: [{ id: "devious-strikes", name: "Devious Strikes", level: 14 }],
      15: [{ id: "slippery-mind", name: "Slippery Mind", level: 15 }],
      16: [
        {
          id: "ability-score-improvement-5",
          name: "Ability Score Improvement",
          level: 16,
        },
      ],
      17: [{ id: "subclass-feature-17", name: "Subclass Feature", level: 17 }],
      18: [{ id: "elusive", name: "Elusive", level: 18 }],
      19: [{ id: "epic-boon", name: "Epic Boon", level: 19 }],
      20: [{ id: "stroke-of-luck", name: "Stroke of Luck", level: 20 }],
    },
  },
];

export const species: Species[] = [
  {
    id: "human",
    name: "Human",
    size: "Medium",
    speed: 30,
    languages: ["common"],
    traits: [
      { id: "resourceful", name: "Resourceful" },
      { id: "skillful", name: "Skillful" },
      { id: "versatile", name: "Versatile" },
    ],
  },
  {
  id: "elf",
  name: "Elf",
  size: "Medium",
  speed: 30,
  languages: ["common", "elvish"],
  traits: [
    {
      id: "darkvision",
      name: "Darkvision",
      effects: [
        {
          type: "sense",
          sense: "darkvision",
          range: 60,
        },
      ],
    },
    {
      id: "fey-ancestry",
      name: "Fey Ancestry",
      effects: [
        {
          type: "advantage-on-saving-throws-against",
          conditions: ["charmed"],
        },
      ],
    },
    {
      id: "keen-senses",
      name: "Keen Senses",
      choices: [
        {
          id: "keen-senses-skill",
          name: "Keen Senses Skill",
          choose: 1,
          options: [
            { id: "insight", name: "Insight" },
            { id: "perception", name: "Perception" },
            { id: "survival", name: "Survival" },
          ],
        },
      ],
    },
    {
      id: "trance",
      name: "Trance",
      notes: [
        "You don't need to sleep, and magic can't put you to sleep.",
        "You can finish a Long Rest in 4 hours if you spend them in a trancelike meditation.",
      ],
    },
    {
      id: "elven-lineage",
      name: "Elven Lineage",
      description:
        "Choose a lineage that grants you supernatural abilities and spells.",
      choices: [
        {
          id: "elven-lineage-choice",
          name: "Elven Lineage",
          choose: 1,
          options: [
            { id: "drow", name: "Drow" },
            { id: "high-elf", name: "High Elf" },
            { id: "wood-elf", name: "Wood Elf" },
          ],
        },
      ],
    },
  ],
},
  {
  id: "dwarf",
  name: "Dwarf",
  size: "Medium",
  speed: 30,
  languages: ["common", "dwarvish"],
  traits: [
    { id: "darkvision", name: "Darkvision" },
    { id: "dwarven-resilience", name: "Dwarven Resilience" },
    { id: "dwarven-toughness", name: "Dwarven Toughness" },
    { id: "stonecunning", name: "Stonecunning" },
  ],
},
  {
    id: "halfling",
    name: "Halfling",
    size: "Small",
    speed: 30,
    languages: ["common", "halfling"],
    traits: [
      { id: "brave", name: "Brave" },
      { id: "halfling-nimbleness", name: "Halfling Nimbleness" },
      { id: "luck", name: "Luck" },
      { id: "naturally-stealthy", name: "Naturally Stealthy" },
    ],
  },
  {
    id: "aasimar",
    name: "Aasimar",
    size: "Medium",
    speed: 30,
    languages: ["common", "celestial"],
    traits: [
      { id: "darkvision", name: "Darkvision" },
      { id: "celestial-resistance", name: "Celestial Resistance" },
      { id: "healing-hands", name: "Healing Hands" },
      { id: "light-bearer", name: "Light Bearer" },
      { id: "celestial-revelation", name: "Celestial Revelation" },
    ],
  },
  {
    id: "dragonborn",
    name: "Dragonborn",
    size: "Medium",
    speed: 30,
    languages: ["common", "draconic"],
    traits: [
      { id: "draconic-ancestry", name: "Draconic Ancestry" },
      { id: "breath-weapon", name: "Breath Weapon" },
      { id: "damage-resistance", name: "Damage Resistance" },
      { id: "darkvision", name: "Darkvision" },
      { id: "draconic-flight", name: "Draconic Flight" },
    ],
  },
];

export const draconicAncestors = [
  { id: "black", name: "Black", damageType: "acid" },
  { id: "blue", name: "Blue", damageType: "lightning" },
  { id: "brass", name: "Brass", damageType: "fire" },
  { id: "bronze", name: "Bronze", damageType: "lightning" },
  { id: "copper", name: "Copper", damageType: "acid" },
  { id: "gold", name: "Gold", damageType: "fire" },
  { id: "green", name: "Green", damageType: "poison" },
  { id: "red", name: "Red", damageType: "fire" },
  { id: "silver", name: "Silver", damageType: "cold" },
  { id: "white", name: "White", damageType: "cold" },
] as const;

export const elfLineages: ElfLineage[] = [
  {
    id: "drow",
    name: "Drow",
    traits: [
      {
        id: "drow-darkvision",
        name: "Superior Darkvision",
        effects: [
          {
            type: "sense",
            sense: "darkvision",
            range: 120,
          },
        ],
      },
      {
        id: "drow-magic",
        name: "Drow Magic",
        effects: [
          {
            type: "spell",
            spellName: "Dancing Lights",
            frequency: { type: "at-will" },
          },
          {
            type: "spell",
            spellName: "Faerie Fire",
            level: 3,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
          {
            type: "spell",
            spellName: "Darkness",
            level: 5,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
        ],
        notes: [
          "You always have these spells prepared.",
          "You can cast them with spell slots if you have them.",
        ],
      },
    ],
  },
  {
    id: "high-elf",
    name: "High Elf",
    traits: [
      {
        id: "high-elf-cantrip",
        name: "High Elf Cantrip",
        effects: [
          {
            type: "spell",
            spellName: "Prestidigitation",
            frequency: { type: "at-will" },
          },
        ],
        notes: [
          "You can replace this cantrip with another Wizard cantrip when you finish a Long Rest.",
        ],
      },
      {
        id: "high-elf-magic",
        name: "High Elf Magic",
        effects: [
          {
            type: "spell",
            spellName: "Detect Magic",
            level: 3,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
          {
            type: "spell",
            spellName: "Misty Step",
            level: 5,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
        ],
      },
    ],
  },
  {
    id: "wood-elf",
    name: "Wood Elf",
    traits: [
      {
        id: "wood-elf-speed",
        name: "Fleet of Foot",
        notes: ["Your speed increases to 35 feet."],
      },
      {
        id: "wood-elf-magic",
        name: "Wood Elf Magic",
        effects: [
          {
            type: "spell",
            spellName: "Druidcraft",
            frequency: { type: "at-will" },
          },
          {
            type: "spell",
            spellName: "Longstrider",
            level: 3,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
          {
            type: "spell",
            spellName: "Pass without Trace",
            level: 5,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
        ],
      },
    ],
  },
];

export const originFeats: Feat[] = [
  { id: "alert", name: "Alert", category: "origin", traits: [] },
  { id: "crafter", name: "Crafter", category: "origin", traits: [] },
  { id: "healer", name: "Healer", category: "origin", traits: [] },
  { id: "lucky", name: "Lucky", category: "origin", traits: [] },
  { id: "magic-initiate", name: "Magic Initiate", category: "origin", traits: [] },
  { id: "musician", name: "Musician", category: "origin", traits: [] },
  { id: "savage-attacker", name: "Savage Attacker", category: "origin", traits: [] },
  { id: "skilled", name: "Skilled", category: "origin", traits: [] },
  { id: "tavern-brawler", name: "Tavern Brawler", category: "origin", traits: [] },
  { id: "tough", name: "Tough", category: "origin", traits: [] },
];

export const backgrounds: Background[] = [
  {
    id: "acolyte",
    name: "Acolyte",
    abilityOptions: ["int", "wis", "cha"],
    skillProficiencies: ["insight", "religion"],
    toolProficiency: "calligraphers-supplies",
    originFeatId: "magic-initiate",
    equipmentGold: 50,
  },
  {
    id: "criminal",
    name: "Criminal",
    abilityOptions: ["dex", "con", "int"],
    skillProficiencies: ["sleight-of-hand", "stealth"],
    toolProficiency: "thieves-tools",
    originFeatId: "alert",
    equipmentGold: 50,
  },
];