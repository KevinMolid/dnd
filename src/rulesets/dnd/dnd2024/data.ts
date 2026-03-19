import type {
  Background,
  CharacterClass,
  ElfLineage,
  Feat,
  GnomeLineage,
  GoliathAncestry,
  TieflingLegacy,
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
    sizeOptions: ["Medium", "Small"],
    speed: 30,
    languages: ["common"],
    traits: [
      {
        id: "resourceful",
        name: "Resourceful",
        notes: [
          "You gain Heroic Inspiration whenever you finish a Long Rest.",
        ],
      },
      {
        id: "skillful",
        name: "Skillful",
        notes: [
          "You gain proficiency in one skill of your choice.",
        ],
        choices: [
          {
            id: "human-skill-choice",
            name: "Skillful — Choose One Skil",
            choose: 1,
            options: [
              { id: "acrobatics", name: "Acrobatics" },
              { id: "animal-handling", name: "Animal Handling" },
              { id: "arcana", name: "Arcana" },
              { id: "athletics", name: "Athletics" },
              { id: "deception", name: "Deception" },
              { id: "history", name: "History" },
              { id: "insight", name: "Insight" },
              { id: "intimidation", name: "Intimidation" },
              { id: "investigation", name: "Investigation" },
              { id: "medicine", name: "Medicine" },
              { id: "nature", name: "Nature" },
              { id: "perception", name: "Perception" },
              { id: "performance", name: "Performance" },
              { id: "persuasion", name: "Persuasion" },
              { id: "religion", name: "Religion" },
              { id: "sleight-of-hand", name: "Sleight of Hand" },
              { id: "stealth", name: "Stealth" },
              { id: "survival", name: "Survival" },
            ],
          },
        ],
      },
      {
        id: "versatile",
        name: "Versatile",
        notes: [
          "You gain an Origin feat of your choice.",
        ],
        choices: [
          {
            id: "human-origin-feat-choice",
            name: "Versatile — Choose One Origin Feat",
            choose: 1,
            options: [
              { id: "alert", name: "Alert" },
              { id: "crafter", name: "Crafter" },
              { id: "healer", name: "Healer" },
              { id: "lucky", name: "Lucky" },
              { id: "magic-initiate", name: "Magic Initiate" },
              { id: "musician", name: "Musician" },
              { id: "savage-attacker", name: "Savage Attacker" },
              { id: "skilled", name: "Skilled" },
              { id: "tavern-brawler", name: "Tavern Brawler" },
              { id: "tough", name: "Tough" },
            ],
          },
        ],
      },
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
      {
        id: "brave",
        name: "Brave",
        effects: [
          {
            type: "advantage-on-saving-throws-against",
            conditions: ["frightened"],
          },
        ],
      },
      {
        id: "halfling-nimbleness",
        name: "Halfling Nimbleness",
        notes: [
          "You can move through the space of any creature that is a size larger than you, but you can't stop in the same space.",
        ],
      },
      {
        id: "luck",
        name: "Luck",
        notes: [
          "When you roll a 1 on the d20 of a D20 Test, you can reroll the die, and you must use the new roll.",
        ],
      },
      {
        id: "naturally-stealthy",
        name: "Naturally Stealthy",
        notes: [
          "You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.",
        ],
      },
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
  {
    id: "gnome",
    name: "Gnome",
    size: "Small",
    speed: 30,
    languages: ["common", "gnomish"],
    traits: [
      {
        id: "gnome-darkvision",
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
        id: "gnomish-cunning",
        name: "Gnomish Cunning",
        effects: [
          {
            type: "advantage-on-saving-throws",
            abilities: ["int", "wis", "cha"],
          },
        ],
      },
      {
        id: "gnomish-lineage",
        name: "Gnomish Lineage",
        choices: [
          {
            id: "gnomish-lineage-choice",
            name: "Gnome Lineage",
            choose: 1,
            options: [
              { id: "forest-gnome", name: "Forest Gnome" },
              { id: "rock-gnome", name: "Rock Gnome" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "goliath",
    name: "Goliath",
    size: "Medium",
    speed: 35,
    languages: ["common", "giant"],
    traits: [
      {
        id: "giant-ancestry",
        name: "Giant Ancestry",
        description:
          "Choose one supernatural giant ancestry benefit. You can use the chosen benefit a number of times equal to your Proficiency Bonus per Long Rest.",
        choices: [
          {
            id: "giant-ancestry-choice",
            name: "Giant Ancestry",
            choose: 1,
            options: [
              { id: "clouds-jaunt", name: "Cloud's Jaunt" },
              { id: "fires-burn", name: "Fire's Burn" },
              { id: "frosts-chill", name: "Frost's Chill" },
              { id: "hills-tumble", name: "Hill's Tumble" },
              { id: "stones-endurance", name: "Stone's Endurance" },
              { id: "storms-thunder", name: "Storm's Thunder" },
            ],
          },
        ],
      },
      {
        id: "large-form",
        name: "Large Form",
        minLevel: 5,
        activation: "bonus-action",
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
        notes: [
          "If you are in a big enough space, you can change your size to Large for 10 minutes.",
          "During that time, you have Advantage on Strength checks.",
          "Your Speed increases by 10 feet.",
        ],
      },
      {
        id: "powerful-build",
        name: "Powerful Build",
        effects: [
          {
            type: "advantage-on-saving-throws-against",
            conditions: ["grappled"],
          },
        ],
        notes: [
          "You have Advantage on any saving throw you make to end the Grappled condition.",
          "You also count as one size larger when determining your carrying capacity.",
        ],
      },
    ],
  },
  {
    id: "orc",
    name: "Orc",
    size: "Medium",
    speed: 30,
    languages: ["common", "orc"],
    traits: [
      {
        id: "adrenaline-rush",
        name: "Adrenaline Rush",
        activation: "bonus-action",
        usage: {
          type: "limited",
          uses: { type: "proficiency-bonus" },
          recharge: "short-rest",
        },
        notes: [
          "You take the Dash action as a Bonus Action.",
          "When you do so, you gain Temporary Hit Points equal to your Proficiency Bonus.",
        ],
      },
      {
        id: "darkvision",
        name: "Darkvision",
        effects: [
          {
            type: "sense",
            sense: "darkvision",
            range: 120,
          },
        ],
      },
      {
        id: "relentless-endurance",
        name: "Relentless Endurance",
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
        notes: [
          "When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead.",
        ],
      },
    ],
  },
  {
    id: "tiefling",
    name: "Tiefling",
    sizeOptions: ["Medium", "Small"],
    speed: 30,
    languages: ["common", "infernal"],
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
      id: "fiendish-legacy",
      name: "Fiendish Legacy",
      description:
        "Choose a fiendish legacy that grants you supernatural abilities.",
      choices: [
        {
          id: "fiendish-legacy-choice",
          name: "Fiendish Legacy",
          choose: 1,
          options: [
            { id: "abyssal", name: "Abyssal" },
            { id: "chthonic", name: "Chthonic" },
            { id: "infernal", name: "Infernal" },
          ],
        },
        {
          id: "fiendish-legacy-ability-choice",
          name: "Fiendish Legacy Spellcasting Ability",
          choose: 1,
          options: [
            { id: "int", name: "Intelligence" },
            { id: "wis", name: "Wisdom" },
            { id: "cha", name: "Charisma" },
          ],
        },
      ],
    },
      {
        id: "otherworldly-presence",
        name: "Otherworldly Presence",
        effects: [
          {
            type: "spell",
            spellName: "Thaumaturgy",
            frequency: { type: "at-will" },
          },
        ],
        notes: [
          "When you cast this spell, use the same spellcasting ability you chose for your Fiendish Legacy trait.",
        ],
      },
    ],
  }
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

export const gnomeLineages: GnomeLineage[] = [
  {
    id: "forest-gnome",
    name: "Forest Gnome",
    traits: [
      {
        id: "forest-gnome-magic",
        name: "Forest Gnome Magic",
        effects: [
          {
            type: "spell",
            spellName: "Minor Illusion",
            frequency: { type: "at-will" },
          },
          {
            type: "spell",
            spellName: "Speak with Animals",
            frequency: {
              type: "limited",
              uses: { type: "proficiency-bonus" },
              recharge: "long-rest",
            },
          },
        ],
        notes: [
          "You always have Speak with Animals prepared.",
          "You can also cast it using spell slots you have of the appropriate level.",
        ],
      },
    ],
  },
  {
    id: "rock-gnome",
    name: "Rock Gnome",
    traits: [
      {
        id: "rock-gnome-magic",
        name: "Rock Gnome Magic",
        effects: [
          {
            type: "spell",
            spellName: "Mending",
            frequency: { type: "at-will" },
          },
          {
            type: "spell",
            spellName: "Prestidigitation",
            frequency: { type: "at-will" },
          },
        ],
      },
      {
        id: "rock-gnome-tinkering",
        name: "Tinker",
        effects: [
          {
            type: "text",
            text: "You can create tiny clockwork devices using Prestidigitation effects.",
          },
        ],
        notes: [
          "Devices last 8 hours.",
          "You can have up to 3 devices at a time.",
          "You can activate a device with a Bonus Action.",
        ],
      },
    ],
  },
];

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

export const goliathAncestries: GoliathAncestry[] = [
  {
    id: "clouds-jaunt",
    name: "Cloud's Jaunt",
    traits: [
      {
        id: "clouds-jaunt-trait",
        name: "Cloud's Jaunt",
        activation: "bonus-action",
        usage: {
          type: "limited",
          uses: { type: "proficiency-bonus" },
          recharge: "long-rest",
        },
        notes: [
          "You magically teleport up to 30 feet to an unoccupied space you can see.",
        ],
      },
    ],
  },
  {
    id: "fires-burn",
    name: "Fire's Burn",
    traits: [
      {
        id: "fires-burn-trait",
        name: "Fire's Burn",
        usage: {
          type: "limited",
          uses: { type: "proficiency-bonus" },
          recharge: "long-rest",
        },
        effects: [
          {
            type: "text",
            text: "When you hit a target with an attack roll and deal damage to it, you can also deal 1d10 Fire damage to that target.",
          },
        ],
      },
    ],
  },
  {
    id: "frosts-chill",
    name: "Frost's Chill",
    traits: [
      {
        id: "frosts-chill-trait",
        name: "Frost's Chill",
        usage: {
          type: "limited",
          uses: { type: "proficiency-bonus" },
          recharge: "long-rest",
        },
        effects: [
          {
            type: "text",
            text: "When you hit a target with an attack roll and deal damage to it, you can also deal 1d6 Cold damage to that target and reduce its Speed by 10 feet until the start of your next turn.",
          },
        ],
      },
    ],
  },
  {
    id: "hills-tumble",
    name: "Hill's Tumble",
    traits: [
      {
        id: "hills-tumble-trait",
        name: "Hill's Tumble",
        usage: {
          type: "limited",
          uses: { type: "proficiency-bonus" },
          recharge: "long-rest",
        },
        effects: [
          {
            type: "text",
            text: "When you hit a Large or smaller creature with an attack roll and deal damage to it, you can give that target the Prone condition.",
          },
        ],
      },
    ],
  },
  {
    id: "stones-endurance",
    name: "Stone's Endurance",
    traits: [
      {
        id: "stones-endurance-trait",
        name: "Stone's Endurance",
        activation: "reaction",
        usage: {
          type: "limited",
          uses: { type: "proficiency-bonus" },
          recharge: "long-rest",
        },
        effects: [
          {
            type: "text",
            text: "When you take damage, you can roll 1d12 and add your Constitution modifier to reduce the damage by that total.",
          },
        ],
      },
    ],
  },
  {
    id: "storms-thunder",
    name: "Storm's Thunder",
    traits: [
      {
        id: "storms-thunder-trait",
        name: "Storm's Thunder",
        activation: "reaction",
        usage: {
          type: "limited",
          uses: { type: "proficiency-bonus" },
          recharge: "long-rest",
        },
        effects: [
          {
            type: "text",
            text: "When you take damage from a creature within 60 feet of you, you can deal 1d8 Thunder damage to that creature.",
          },
        ],
      },
    ],
  },
];

export const tieflingLegacies: TieflingLegacy[] = [
  {
    id: "abyssal",
    name: "Abyssal",
    traits: [
      {
        id: "abyssal-legacy",
        name: "Abyssal Legacy",
        effects: [
          {
            type: "resistance",
            damageType: "poison",
          },
          {
            type: "spell",
            spellName: "Poison Spray",
            frequency: { type: "at-will" },
          },
          {
            type: "spell",
            spellName: "Ray of Sickness",
            level: 3,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
          {
            type: "spell",
            spellName: "Hold Person",
            level: 5,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
        ],
        notes: [
          "You always have the level 3 and level 5 spells prepared.",
          "You can also cast them using spell slots you have of the appropriate level.",
          "Use your chosen Fiendish Legacy spellcasting ability for these spells.",
        ],
      },
    ],
  },
  {
    id: "chthonic",
    name: "Chthonic",
    traits: [
      {
        id: "chthonic-legacy",
        name: "Chthonic Legacy",
        effects: [
          {
            type: "resistance",
            damageType: "necrotic",
          },
          {
            type: "spell",
            spellName: "Chill Touch",
            frequency: { type: "at-will" },
          },
          {
            type: "spell",
            spellName: "False Life",
            level: 3,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
          {
            type: "spell",
            spellName: "Ray of Enfeeblement",
            level: 5,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
        ],
        notes: [
          "You always have the level 3 and level 5 spells prepared.",
          "You can also cast them using spell slots you have of the appropriate level.",
          "Use your chosen Fiendish Legacy spellcasting ability for these spells.",
        ],
      },
    ],
  },
  {
    id: "infernal",
    name: "Infernal",
    traits: [
      {
        id: "infernal-legacy",
        name: "Infernal Legacy",
        effects: [
          {
            type: "resistance",
            damageType: "fire",
          },
          {
            type: "spell",
            spellName: "Fire Bolt",
            frequency: { type: "at-will" },
          },
          {
            type: "spell",
            spellName: "Hellish Rebuke",
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
          "You always have the level 3 and level 5 spells prepared.",
          "You can also cast them using spell slots you have of the appropriate level.",
          "Use your chosen Fiendish Legacy spellcasting ability for these spells.",
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