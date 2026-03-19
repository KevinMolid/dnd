import type { Species } from "../../types";

export const goliath: Species = {
  id: "goliath",
  name: "Goliath",
  size: "Medium",
  speed: 35,
  languages: ["common", "giant"],
  traits: [
    {
      id: "giant-ancestry",
      name: "Giant Ancestry",
      description:
        "Choose one supernatural giant ancestry benefit. You can use the chosen benefit a number of times equal to your Proficiency Bonus per Long Rest.",
      choices: [
        {
          id: "giant-ancestry-choice",
          name: "Giant Ancestry",
          choose: 1,
          options: [
            { id: "clouds-jaunt", name: "Cloud's Jaunt" },
            { id: "fires-burn", name: "Fire's Burn" },
            { id: "frosts-chill", name: "Frost's Chill" },
            { id: "hills-tumble", name: "Hill's Tumble" },
            { id: "stones-endurance", name: "Stone's Endurance" },
            { id: "storms-thunder", name: "Storm's Thunder" },
          ],
        },
      ],
    },
    {
      id: "large-form",
      name: "Large Form",
      minLevel: 5,
      activation: "bonus-action",
      usage: {
        type: "limited",
        uses: { type: "fixed", value: 1 },
        recharge: "long-rest",
      },
      notes: [
        "If you are in a big enough space, you can change your size to Large for 10 minutes.",
        "During that time, you have Advantage on Strength checks.",
        "Your Speed increases by 10 feet.",
      ],
    },
    {
      id: "powerful-build",
      name: "Powerful Build",
      effects: [
        {
          type: "advantage-on-saving-throws-against",
          conditions: ["grappled"],
        },
      ],
      notes: [
        "You have Advantage on any saving throw you make to end the Grappled condition.",
        "You also count as one size larger when determining your carrying capacity.",
      ],
    },
  ],
};