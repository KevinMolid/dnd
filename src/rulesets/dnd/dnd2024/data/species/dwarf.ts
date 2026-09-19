import type { Species } from "../../types";

export const dwarf: Species = {
  id: "dwarf",

  name: "Dwarf",

  size: "Medium",

  speed: 30,

  languages: ["common", "dwarvish"],

  traits: [
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
      id: "dwarven-resilience",
      name: "Dwarven Resilience",
      description:
        "You have Resistance to Poison damage. You also have Advantage on saving throws you make to avoid or end the Poisoned condition.",
      effects: [
        {
          type: "resistance",
          damageType: "poison",
        },
        {
          type: "advantage-on-saving-throws-against",
          conditions: ["poisoned"],
        },
      ],
    },

    {
      id: "dwarven-toughness",
      name: "Dwarven Toughness",
      description:
        "Your Hit Point maximum increases by 1, and it increases by 1 again whenever you gain a level.",
      effects: [
        {
          type: "hp-max-bonus",
          amount: {
            type: "fixed",
            value: 1,
          },
        },
      ],
    },

    {
      id: "stonecunning",
      name: "Stonecunning",
      description:
        "As a Bonus Action, you gain Tremorsense with a range of 60 feet for 10 minutes. You must be on a stone surface or touching a stone surface to use this trait. The stone can be natural or worked. You can use this Bonus Action a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.",
      activation: "bonus-action",
      usage: {
        type: "limited",
        uses: {
          type: "proficiency-bonus",
        },
        recharge: "long-rest",
      },
      effects: [
        {
          type: "sense",
          sense: "tremorsense",
          range: 60,
        },
      ],
      notes: [
        "The Tremorsense lasts for 10 minutes.",
        "You must be on a stone surface or touching a stone surface.",
        "The stone can be natural or worked.",
      ],
    },
  ],
};