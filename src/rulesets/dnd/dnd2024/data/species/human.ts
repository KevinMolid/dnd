import type { Species } from "../../types";

export const human: Species = {
  id: "human",
  name: "Human",
  sizeOptions: ["Medium", "Small"],
  speed: 30,
  languages: ["common"],
  traits: [
    {
      id: "resourceful",
      name: "Resourceful",
      notes: [
        "You gain Heroic Inspiration whenever you finish a Long Rest.",
      ],
    },
    {
      id: "skillful",
      name: "Skillful",
      notes: ["You gain proficiency in one skill of your choice."],
      choices: [
        {
          id: "human-skill-choice",
          name: "Skillful — Choose One Skill",
          choose: 1,
          options: [
            { id: "acrobatics", name: "Acrobatics" },
            { id: "animal-handling", name: "Animal Handling" },
            { id: "arcana", name: "Arcana" },
            { id: "athletics", name: "Athletics" },
            { id: "deception", name: "Deception" },
            { id: "history", name: "History" },
            { id: "insight", name: "Insight" },
            { id: "intimidation", name: "Intimidation" },
            { id: "investigation", name: "Investigation" },
            { id: "medicine", name: "Medicine" },
            { id: "nature", name: "Nature" },
            { id: "perception", name: "Perception" },
            { id: "performance", name: "Performance" },
            { id: "persuasion", name: "Persuasion" },
            { id: "religion", name: "Religion" },
            { id: "sleight-of-hand", name: "Sleight of Hand" },
            { id: "stealth", name: "Stealth" },
            { id: "survival", name: "Survival" },
          ],
        },
      ],
    },
    {
      id: "versatile",
      name: "Versatile",
      notes: ["You gain an Origin feat of your choice."],
      choices: [
        {
          id: "human-origin-feat-choice",
          name: "Versatile — Choose One Origin Feat",
          choose: 1,
          options: [
            { id: "alert", name: "Alert" },
            { id: "crafter", name: "Crafter" },
            { id: "healer", name: "Healer" },
            { id: "lucky", name: "Lucky" },
            { id: "magic-initiate", name: "Magic Initiate" },
            { id: "musician", name: "Musician" },
            { id: "savage-attacker", name: "Savage Attacker" },
            { id: "skilled", name: "Skilled" },
            { id: "tavern-brawler", name: "Tavern Brawler" },
            { id: "tough", name: "Tough" },
          ],
        },
      ],
    },
  ],
};