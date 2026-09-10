import type {
  AbilityKey,
  CharacterEquipmentEntry,
  Money,
} from "../rulesets/dnd/dnd2024/types";

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
};

export type CustomProficiencies = {
  savingThrows: AbilityKey[];

  skills: Record<
    CustomSkillId,
    CustomProficiencyLevel
  >;

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

  /**
   * Stored manually because Custom mode should
   * not assume the normal D&D formula.
   */
  spellSaveDc: number;

  spellAttackBonus: number;

  spellSlots: Record<string, CustomSpellSlot>;

  spells: CustomSpellEntry[];
};

export type CustomCharacter = {
  id?: string;

  name: string;
  imageUrl?: string;

  buildMode: "custom";

  level?: number;

  className?: string;
  speciesName?: string;
  backgroundName?: string;
  alignment?: string;

  /*
   * Official character-sheet physical details.
   *
   * Strings are intentional. Values such as
   * 6' 2", 180 lb, Unknown, etc. should all work.
   */
  age?: string;
  height?: string;
  weight?: string;
  eyes?: string;
  skin?: string;
  hair?: string;

  abilityScores?: Record<
    AbilityKey,
    number
  >;

  customStats?: {
    armorClass?: number;

    currentHp?: number;
    maxHp?: number;

    speed?: number;

    proficiencyBonus?: number;
  };

  customProficiencies?: CustomProficiencies;

  customTraits?: CustomTrait[];

  customSpellcasting?: CustomSpellcasting;

  characterAppearance?: string;

  alliesAndOrganizations?: string;

  characterBackstory?: string;

  /**
   * Legacy field for previously-created
   * custom characters.
   */
  notes?: string;

  equipment?: CharacterEquipmentEntry[];

  money?: Money;
};

export const customSkillDefinitions: Array<{
  id: CustomSkillId;
  name: string;
  ability: AbilityKey;
}> = [
  {
    id: "acrobatics",
    name: "Acrobatics",
    ability: "dex",
  },
  {
    id: "animal-handling",
    name: "Animal Handling",
    ability: "wis",
  },
  {
    id: "arcana",
    name: "Arcana",
    ability: "int",
  },
  {
    id: "athletics",
    name: "Athletics",
    ability: "str",
  },
  {
    id: "deception",
    name: "Deception",
    ability: "cha",
  },
  {
    id: "history",
    name: "History",
    ability: "int",
  },
  {
    id: "insight",
    name: "Insight",
    ability: "wis",
  },
  {
    id: "intimidation",
    name: "Intimidation",
    ability: "cha",
  },
  {
    id: "investigation",
    name: "Investigation",
    ability: "int",
  },
  {
    id: "medicine",
    name: "Medicine",
    ability: "wis",
  },
  {
    id: "nature",
    name: "Nature",
    ability: "int",
  },
  {
    id: "perception",
    name: "Perception",
    ability: "wis",
  },
  {
    id: "performance",
    name: "Performance",
    ability: "cha",
  },
  {
    id: "persuasion",
    name: "Persuasion",
    ability: "cha",
  },
  {
    id: "religion",
    name: "Religion",
    ability: "int",
  },
  {
    id: "sleight-of-hand",
    name: "Sleight of Hand",
    ability: "dex",
  },
  {
    id: "stealth",
    name: "Stealth",
    ability: "dex",
  },
  {
    id: "survival",
    name: "Survival",
    ability: "wis",
  },
];

export const createEmptyCustomSkills =
  (): Record<
    CustomSkillId,
    CustomProficiencyLevel
  > => ({
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
  const result: Record<
    string,
    CustomSpellSlot
  > = {};

  for (let level = 1; level <= 9; level += 1) {
    result[String(level)] = {
      max: 0,
      remaining: 0,
    };
  }

  return result;
};