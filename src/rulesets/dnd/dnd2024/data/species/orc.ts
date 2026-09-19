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
      description:
        "As a Bonus Action, you can take the Dash action. When you do so, you gain Temporary Hit Points equal to your Proficiency Bonus. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Short Rest.",
      activation: "bonus-action",
      usage: {
        type: "limited",
        uses: {
          type: "proficiency-bonus",
        },
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
      description:
        "You have Darkvision with a range of 120 feet.",
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
      description:
        "When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once you use this trait, you can't use it again until you finish a Long Rest.",
      usage: {
        type: "limited",
        uses: {
          type: "fixed",
          value: 1,
        },
        recharge: "long-rest",
      },
      notes: [
        "When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead.",
      ],
    },
  ],
};