import type { Species } from "../../types";

export const elf: Species = {
  id: "elf",

  name: "Elf",

  size: "Medium",

  speed: 30,

  languages: ["common", "elvish"],

  traits: [
    {
      id: "darkvision",
      name: "Darkvision",
      description:
        "You have Darkvision with a range of 60 feet.",
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
      description:
        "You have Advantage on saving throws you make to avoid or end the Charmed condition.",
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
      description:
        "You have proficiency in one of the following skills of your choice: Insight, Perception, or Survival.",
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
      description:
        "You don't need to sleep, and magic can't put you to sleep. You can finish a Long Rest in 4 hours if you spend those hours in a trancelike meditation, during which you retain consciousness.",
      notes: [
        "You don't need to sleep, and magic can't put you to sleep.",
        "You can finish a Long Rest in 4 hours if you spend them in a trancelike meditation.",
      ],
    },

    {
      id: "elven-lineage",
      name: "Elven Lineage",
      description:
        "Choose a lineage that represents your elven heritage: Drow, High Elf, or Wood Elf. Your lineage grants additional supernatural abilities and spells as you gain levels.",
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
};