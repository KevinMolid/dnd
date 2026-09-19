import type {
  AbilityKey,
  CharacterEquipmentEntry,
  Money,
} from "../rulesets/dnd/dnd2024/types";

import type {
  FeatureAction,
  FeatureActivation,
} from "./featureActions";

export type CustomProficiencyLevel =
  | "none"
  | "proficient"
  | "expertise";

export type CustomSkillId =
  | "acrobatics"
  | "animal-handling"
  | "arcana"
  | "athletics"
  | "deception"
  | "history"
  | "insight"
  | "intimidation"
  | "investigation"
  | "medicine"
  | "nature"
  | "perception"
  | "performance"
  | "persuasion"
  | "religion"
  | "sleight-of-hand"
  | "stealth"
  | "survival";

export type CustomTrait = {
  id: string;
  name: string;
  source?: string;
  description?: string;
  activation?: FeatureActivation;
  actions?: FeatureAction[];
};

export type CustomProficiencies = {
  savingThrows: AbilityKey[];
  skills: Record<CustomSkillId, CustomProficiencyLevel>;
  armor: string[];
  weapons: string[];
  tools: string[];
  languages: string[];
};

export type CustomSpellEntry = {
  spellId: string;
  name: string;
  level: number;
};

export type CustomSpellSlot = {
  max: number;
  remaining: number;
};

export type CustomSpellcasting = {
  enabled: boolean;
  ability: AbilityKey | null;
  spellSlots: Record<string, CustomSpellSlot>;
  spells: CustomSpellEntry[];
};

export type CustomArmorClassMode = "automatic" | "manual";

export type CustomCharacterStats = {
  /**
   * Cached/display AC. Automatic AC is recalculated from the live character
   * whenever the sheet is rendered; this value keeps older consumers working.
   */
  armorClass?: number;

  armorClassMode?: CustomArmorClassMode;
  manualArmorClass?: number;

  /**
   * Flat modifier applied after the normal armor/unarmored calculation.
   * Use this for custom features or effects not represented by equipped items.
   */
  armorClassBonus?: number;

  currentHp?: number;
  maxHp?: number;
  speed?: number;
  proficiencyBonus?: number;
  hitDie?: string;
  hitDiceRemaining?: number;
};

export type CustomCharacter = {
  id?: string;
  campaignId?: string | null;
  name: string;
  imageUrl?: string;
  buildMode: "custom";
  level?: number;
  className?: string;
  speciesName?: string;
  backgroundName?: string;
  alignment?: string;
  age?: string;
  height?: string;
  weight?: string;
  eyes?: string;
  skin?: string;
  hair?: string;
  abilityScores?: Record<AbilityKey, number>;
  customStats?: CustomCharacterStats;
  customProficiencies?: CustomProficiencies;
  customTraits?: CustomTrait[];
  customSpellcasting?: CustomSpellcasting;
  characterAppearance?: string;
  alliesAndOrganizations?: string;
  characterBackstory?: string;
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  playerNotes?: string;
  notes?: string;
  equipment?: CharacterEquipmentEntry[];
  money?: Money;
  heroicInspiration?: boolean;
  deathSaves?: {
    successes: number;
    failures: number;
  };
  conditions?: string[];
  defenses?: string[];
  xp?: number;
};

export const customSkillDefinitions: Array<{
  id: CustomSkillId;
  name: string;
  ability: AbilityKey;
}> = [
  { id: "acrobatics", name: "Acrobatics", ability: "dex" },
  { id: "animal-handling", name: "Animal Handling", ability: "wis" },
  { id: "arcana", name: "Arcana", ability: "int" },
  { id: "athletics", name: "Athletics", ability: "str" },
  { id: "deception", name: "Deception", ability: "cha" },
  { id: "history", name: "History", ability: "int" },
  { id: "insight", name: "Insight", ability: "wis" },
  { id: "intimidation", name: "Intimidation", ability: "cha" },
  { id: "investigation", name: "Investigation", ability: "int" },
  { id: "medicine", name: "Medicine", ability: "wis" },
  { id: "nature", name: "Nature", ability: "int" },
  { id: "perception", name: "Perception", ability: "wis" },
  { id: "performance", name: "Performance", ability: "cha" },
  { id: "persuasion", name: "Persuasion", ability: "cha" },
  { id: "religion", name: "Religion", ability: "int" },
  { id: "sleight-of-hand", name: "Sleight of Hand", ability: "dex" },
  { id: "stealth", name: "Stealth", ability: "dex" },
  { id: "survival", name: "Survival", ability: "wis" },
];

export const createEmptyCustomSkills =
  (): Record<CustomSkillId, CustomProficiencyLevel> => ({
    acrobatics: "none",
    "animal-handling": "none",
    arcana: "none",
    athletics: "none",
    deception: "none",
    history: "none",
    insight: "none",
    intimidation: "none",
    investigation: "none",
    medicine: "none",
    nature: "none",
    perception: "none",
    performance: "none",
    persuasion: "none",
    religion: "none",
    "sleight-of-hand": "none",
    stealth: "none",
    survival: "none",
  });

export const createEmptySpellSlots = () => {
  const result: Record<string, CustomSpellSlot> = {};

  for (let level = 1; level <= 9; level += 1) {
    result[String(level)] = {
      max: 0,
      remaining: 0,
    };
  }

  return result;
};
