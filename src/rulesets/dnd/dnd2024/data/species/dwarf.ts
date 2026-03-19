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
      effects: [
        {
          type: "hp-max-bonus",
          amount: {
            type: "fixed",
            value: 1,
          },
        },
      ],
      notes: [
        "Your Hit Point maximum increases by 1 now and increases by 1 again whenever you gain a level.",
      ],
    },
    {
      id: "stonecunning",
      name: "Stonecunning",
      activation: "bonus-action",
      usage: {
        type: "limited",
        uses: { type: "proficiency-bonus" },
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
        "You gain Tremorsense with a range of 60 feet for 10 minutes.",
        "You must be on a stone surface or touching a stone surface to use this trait.",
        "The stone can be natural or worked.",
      ],
    },
  ],
};