import type { Species } from "../../types";

export const orc: Species = {
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
};