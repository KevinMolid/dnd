import type { Background, RulesOption } from "./types";

export const classes: RulesOption[] = [
  { id: "barbarian", name: "Barbarian" },
  { id: "bard", name: "Bard" },
  { id: "cleric", name: "Cleric" },
  { id: "druid", name: "Druid" },
  { id: "fighter", name: "Fighter" },
  { id: "monk", name: "Monk" },
  { id: "paladin", name: "Paladin" },
  { id: "ranger", name: "Ranger" },
  { id: "rogue", name: "Rogue" },
  { id: "sorcerer", name: "Sorcerer" },
  { id: "warlock", name: "Warlock" },
  { id: "wizard", name: "Wizard" },
];

export const species: RulesOption[] = [
  { id: "dragonborn", name: "Dragonborn" },
  { id: "dwarf", name: "Dwarf" },
  { id: "elf", name: "Elf" },
  { id: "gnome", name: "Gnome" },
  { id: "goliath", name: "Goliath" },
  { id: "halfling", name: "Halfling" },
  { id: "human", name: "Human" },
  { id: "orc", name: "Orc" },
  { id: "tiefling", name: "Tiefling" },
];

export const originFeats: RulesOption[] = [
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
    id: "artisan",
    name: "Artisan",
    abilityOptions: ["str", "dex", "int"],
    skillProficiencies: ["investigation", "persuasion"],
    toolProficiency: "smiths-tools",
    originFeatId: "crafter",
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
  {
    id: "sage",
    name: "Sage",
    abilityOptions: ["con", "int", "wis"],
    skillProficiencies: ["arcana", "history"],
    toolProficiency: "calligraphers-supplies",
    originFeatId: "magic-initiate",
    equipmentGold: 50,
  },
  {
    id: "soldier",
    name: "Soldier",
    abilityOptions: ["str", "dex", "con"],
    skillProficiencies: ["athletics", "intimidation"],
    toolProficiency: "vehicles-land",
    originFeatId: "savage-attacker",
    equipmentGold: 50,
  },
];