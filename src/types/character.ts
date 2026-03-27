export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export type AbilityScores = Record<AbilityKey, number>;

export type CharacterChoiceMap = {
  classSkillChoices?: string[];
  backgroundLanguages?: string[];
  classFeatureChoices?: Record<string, string | string[]>;
  subclassId?: string | null;
  featChoices?: string[];
  spellChoices?: Record<string, string[]>;
};

export type CharacterFeature = {
  id: string;
  name: string;
  sourceType: "class" | "species" | "background" | "subclass" | "feat";
  sourceId: string;
  level?: number;
};

export type CharacterSpell = {
  id: string;
  name: string;
  source: "class" | "species" | "feat" | "subclass";
  prepared?: boolean;
  alwaysPrepared?: boolean;
};

export type CharacterItem = {
  id: string;
  quantity: number;
  equipped?: boolean;
};

export type CharacterEquipmentItem = {
  instanceId: string;
  itemId: string;
  name: string;
  quantity: number;
  equipped: boolean;
  equippedSlots: string[];
  wieldMode?: string;
};

export type CharacterDoc = {
  ownerUid: string;
  campaignId: string | null;

  name: string;
  level: number;

  classId: string;
  speciesId: string;
  backgroundId: string;
  originFeatId: string | null;
  subclassId?: string | null;

  abilityScores: AbilityScores;

  alignment?: string;
  notes?: string;

  choices: CharacterChoiceMap;

  derived?: {
    proficiencyBonus: number;
    maxHp?: number;
    currentHp?: number;
    armorClass?: number;
    initiativeBonus?: number;
    speed?: number;
    passivePerception?: number;

    skillProficiencies: string[];
    toolProficiencies: string[];
    savingThrowProficiencies: string[];
    languages: string[];

    features: CharacterFeature[];
    spells: CharacterSpell[];
  };

  equipment?: CharacterItem[];

  createdAt?: unknown;
  updatedAt?: unknown;
};