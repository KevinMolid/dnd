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
      notes: [
        "You don't need to sleep, and magic can't put you to sleep.",
        "You can finish a Long Rest in 4 hours if you spend them in a trancelike meditation.",
      ],
    },
    {
      id: "elven-lineage",
      name: "Elven Lineage",
      description:
        "Choose a lineage that grants you supernatural abilities and spells.",
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