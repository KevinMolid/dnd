import type { TieflingLegacy } from "../../types";

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
            spellId: "poison-spray",
            frequency: { type: "at-will" },
          },
          {
            type: "spell",
            spellId: "ray-of-sickness",
            level: 3,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
          {
            type: "spell",
            spellId: "hold-person",
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
            spellId: "chill-touch",
            frequency: { type: "at-will" },
          },
          {
            type: "spell",
            spellId: "false-life",
            level: 3,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
          {
            type: "spell",
            spellId: "ray-of-enfeeblement",
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
            spellId: "fire-bolt",
            frequency: { type: "at-will" },
          },
          {
            type: "spell",
            spellId: "hellish-rebuke",
            level: 3,
            frequency: {
              type: "limited",
              uses: { type: "fixed", value: 1 },
              recharge: "long-rest",
            },
          },
          {
            type: "spell",
            spellId: "darkness",
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