import type { ElfLineage } from "../../types";

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