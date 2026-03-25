import type { Feat } from "../types";

export const feats: Feat[] = [
  { id: "alert", name: "Alert", category: "origin", traits: [] },
  { id: "crafter", name: "Crafter", category: "origin", traits: [] },
  { id: "healer", name: "Healer", category: "origin", traits: [] },
  { id: "lucky", name: "Lucky", category: "origin", traits: [] },
  {
    id: "magic-initiate",
    name: "Magic Initiate",
    category: "origin",
    traits: [],
    grant: {
      type: "magic-initiate",
      spellListOptions: ["cleric", "druid", "wizard"],
    },
  },
  { id: "musician", name: "Musician", category: "origin", traits: [] },
  { id: "savage-attacker", name: "Savage Attacker", category: "origin", traits: [] },
  {
    id: "skilled",
    name: "Skilled",
    category: "origin",
    traits: [],
    grant: {
      type: "skilled",
      chooseSkills: 3,
    },
  },
  { id: "tavern-brawler", name: "Tavern Brawler", category: "origin", traits: [] },
  { id: "tough", name: "Tough", category: "origin", traits: [] },
];