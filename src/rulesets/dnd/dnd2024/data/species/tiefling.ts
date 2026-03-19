import type { Species } from "../../types";

export const tiefling: Species = {
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
};