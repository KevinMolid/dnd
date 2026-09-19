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
        "Choose one supernatural benefit from your giant ancestry: Cloud's Jaunt, Fire's Burn, Frost's Chill, Hill's Tumble, Stone's Endurance, or Storm's Thunder. You can use the chosen benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.",
      choices: [
        {
          id: "giant-ancestry-choice",
          name: "Giant Ancestry",
          choose: 1,
          options: [
            {
              id: "clouds-jaunt",
              name: "Cloud's Jaunt",
            },
            {
              id: "fires-burn",
              name: "Fire's Burn",
            },
            {
              id: "frosts-chill",
              name: "Frost's Chill",
            },
            {
              id: "hills-tumble",
              name: "Hill's Tumble",
            },
            {
              id: "stones-endurance",
              name: "Stone's Endurance",
            },
            {
              id: "storms-thunder",
              name: "Storm's Thunder",
            },
          ],
        },
      ],
    },

    {
      id: "large-form",
      name: "Large Form",
      minLevel: 5,
      description:
        "Starting at level 5, you can use a Bonus Action to become Large for 10 minutes, provided there is enough room for you to grow. While Large, you have Advantage on Strength checks, and your Speed increases by 10 feet. Once you use this trait, you can't use it again until you finish a Long Rest.",
      activation: "bonus-action",
      usage: {
        type: "limited",
        uses: {
          type: "fixed",
          value: 1,
        },
        recharge: "long-rest",
      },
      notes: [
        "You must have enough room to become Large.",
        "The transformation lasts for 10 minutes.",
        "You have Advantage on Strength checks while Large.",
        "Your Speed increases by 10 feet while Large.",
      ],
    },

    {
      id: "powerful-build",
      name: "Powerful Build",
      description:
        "You have Advantage on saving throws you make to end the Grappled condition. You also count as one size larger when determining your carrying capacity.",
      effects: [
        {
          type: "advantage-on-saving-throws-against",
          conditions: ["grappled"],
        },
      ],
      notes: [
        "You count as one size larger when determining your carrying capacity.",
      ],
    },
  ],
};