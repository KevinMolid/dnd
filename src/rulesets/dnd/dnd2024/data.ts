import type {
  Background,
  CharacterClass,
  Feat,
  Species,
} from "./types";

export const classes: CharacterClass[] = [
  {
    id: "fighter",
    name: "Fighter",
    hitDie: 10,
    primaryAbilities: ["str", "dex"],
    savingThrowProficiencies: ["str", "con"],
    armorTraining: ["light-armor", "medium-armor", "heavy-armor", "shields"],
    weaponProficiencies: ["simple-weapons", "martial-weapons"],
    skillChoice: {
      choose: 2,
      options: [
        "acrobatics",
        "animal-handling",
        "athletics",
        "history",
        "insight",
        "intimidation",
        "perception",
        "survival",
      ],
    },
    featuresByLevel: {
      1: [
        { id: "fighting-style", name: "Fighting Style", level: 1 },
        { id: "second-wind", name: "Second Wind", level: 1 },
      ],
    },
  },
];

export const species: Species[] = [
  {
    id: "human",
    name: "Human",
    size: "Medium",
    speed: 30,
    languages: ["common"],
    traits: [{ id: "resourceful", name: "Resourceful" }],
  },
  {
    id: "elf",
    name: "Elf",
    size: "Medium",
    speed: 30,
    languages: ["common", "elvish"],
    traits: [{ id: "darkvision", name: "Darkvision" }],
  },
];

export const originFeats: Feat[] = [
  { id: "alert", name: "Alert", category: "origin", traits: [] },
  { id: "crafter", name: "Crafter", category: "origin", traits: [] },
  { id: "healer", name: "Healer", category: "origin", traits: [] },
  { id: "lucky", name: "Lucky", category: "origin", traits: [] },
  { id: "magic-initiate", name: "Magic Initiate", category: "origin", traits: [] },
  { id: "musician", name: "Musician", category: "origin", traits: [] },
  { id: "savage-attacker", name: "Savage Attacker", category: "origin", traits: [] },
  { id: "skilled", name: "Skilled", category: "origin", traits: [] },
  { id: "tavern-brawler", name: "Tavern Brawler", category: "origin", traits: [] },
  { id: "tough", name: "Tough", category: "origin", traits: [] },
];

export const backgrounds: Background[] = [
  {
    id: "acolyte",
    name: "Acolyte",
    abilityOptions: ["int", "wis", "cha"],
    skillProficiencies: ["insight", "religion"],
    toolProficiency: "calligraphers-supplies",
    originFeatId: "magic-initiate",
    equipmentGold: 50,
  },
  {
    id: "criminal",
    name: "Criminal",
    abilityOptions: ["dex", "con", "int"],
    skillProficiencies: ["sleight-of-hand", "stealth"],
    toolProficiency: "thieves-tools",
    originFeatId: "alert",
    equipmentGold: 50,
  },
];