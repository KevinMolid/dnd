import type { ElfLineage } from "../../types";

export const elfLineages: ElfLineage[] = [
  {
    id: "drow",
    name: "Drow",

    traits: [
      {
        id: "drow-darkvision",
        name: "Superior Darkvision",
        description:
          "Your Darkvision has a range of 120 feet.",
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
        description:
          "You know the Dancing Lights cantrip. Starting at level 3, you always have Faerie Fire prepared, and starting at level 5, you always have Darkness prepared. You can cast each of those leveled spells once without expending a spell slot, regaining the ability to do so when you finish a Long Rest. You can also cast them using any spell slots you have of the appropriate level.",
        effects: [
          {
            type: "spell",
            spellId: "dancing-lights",
            frequency: {
              type: "at-will",
            },
          },
          {
            type: "spell",
            spellId: "faerie-fire",
            level: 3,
            frequency: {
              type: "limited",
              uses: {
                type: "fixed",
                value: 1,
              },
              recharge: "long-rest",
            },
          },
          {
            type: "spell",
            spellId: "darkness",
            level: 5,
            frequency: {
              type: "limited",
              uses: {
                type: "fixed",
                value: 1,
              },
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
        description:
          "You know the Prestidigitation cantrip. Whenever you finish a Long Rest, you can replace it with a different cantrip from the Wizard spell list.",
        effects: [
          {
            type: "spell",
            spellId: "prestidigitation",
            frequency: {
              type: "at-will",
            },
          },
        ],
        notes: [
          "You can replace this cantrip with another Wizard cantrip when you finish a Long Rest.",
        ],
      },

      {
        id: "high-elf-magic",
        name: "High Elf Magic",
        description:
          "Starting at level 3, you always have Detect Magic prepared, and starting at level 5, you always have Misty Step prepared. You can cast each of those spells once without expending a spell slot, regaining the ability to do so when you finish a Long Rest. You can also cast them using any spell slots you have of the appropriate level.",
        effects: [
          {
            type: "spell",
            spellId: "detect-magic",
            level: 3,
            frequency: {
              type: "limited",
              uses: {
                type: "fixed",
                value: 1,
              },
              recharge: "long-rest",
            },
          },
          {
            type: "spell",
            spellId: "misty-step",
            level: 5,
            frequency: {
              type: "limited",
              uses: {
                type: "fixed",
                value: 1,
              },
              recharge: "long-rest",
            },
          },
        ],
        notes: [
          "You always have these spells prepared once you reach the required level.",
          "You can cast them with spell slots if you have them.",
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
        description:
          "Your Speed increases to 35 feet.",
        notes: [
          "Your speed increases to 35 feet.",
        ],
      },

      {
        id: "wood-elf-magic",
        name: "Wood Elf Magic",
        description:
          "You know the Druidcraft cantrip. Starting at level 3, you always have Longstrider prepared, and starting at level 5, you always have Pass without Trace prepared. You can cast each of those leveled spells once without expending a spell slot, regaining the ability to do so when you finish a Long Rest. You can also cast them using any spell slots you have of the appropriate level.",
        effects: [
          {
            type: "spell",
            spellId: "druidcraft",
            frequency: {
              type: "at-will",
            },
          },
          {
            type: "spell",
            spellId: "longstrider",
            level: 3,
            frequency: {
              type: "limited",
              uses: {
                type: "fixed",
                value: 1,
              },
              recharge: "long-rest",
            },
          },
          {
            type: "spell",
            spellId: "pass-without-trace",
            level: 5,
            frequency: {
              type: "limited",
              uses: {
                type: "fixed",
                value: 1,
              },
              recharge: "long-rest",
            },
          },
        ],
        notes: [
          "You always have these spells prepared once you reach the required level.",
          "You can cast them with spell slots if you have them.",
        ],
      },
    ],
  },
];