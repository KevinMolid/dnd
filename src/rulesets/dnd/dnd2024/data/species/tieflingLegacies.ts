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