import type { AbilityKey, SkillId } from "../../../rulesets/dnd/dnd2024/types";
import type { CharacterSheetTab } from "../types";

export const abilityValues: AbilityKey[] = [
  "str",
  "dex",
  "con",
  "int",
  "wis",
  "cha",
];

export const sheetTabs: CharacterSheetTab[] = [
  "overview",
  "combat",
  "features",
  "inventory",
  "spells",
  "notes",
];

export const sheetTabLabels: Record<CharacterSheetTab, string> = {
  overview: "Overview",
  combat: "Combat",
  features: "Features",
  inventory: "Inventory",
  spells: "Spells",
  notes: "Notes",
};

export const abilityLabels: Record<AbilityKey, string> = {
  str: "STR",
  dex: "DEX",
  con: "CON",
  int: "INT",
  wis: "WIS",
  cha: "CHA",
};

export const abilityFullLabels: Record<AbilityKey, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

export const skillAbilityMap: Record<SkillId, AbilityKey> = {
  acrobatics: "dex",
  "animal-handling": "wis",
  arcana: "int",
  athletics: "str",
  deception: "cha",
  history: "int",
  insight: "wis",
  intimidation: "cha",
  investigation: "int",
  medicine: "wis",
  nature: "int",
  perception: "wis",
  performance: "cha",
  persuasion: "cha",
  religion: "int",
  "sleight-of-hand": "dex",
  stealth: "dex",
  survival: "wis",
};

export const allSkills: SkillId[] = [
  "acrobatics",
  "animal-handling",
  "arcana",
  "athletics",
  "deception",
  "history",
  "insight",
  "intimidation",
  "investigation",
  "medicine",
  "nature",
  "perception",
  "performance",
  "persuasion",
  "religion",
  "sleight-of-hand",
  "stealth",
  "survival",
];