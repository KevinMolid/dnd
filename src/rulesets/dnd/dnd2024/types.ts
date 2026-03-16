export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export type SkillId =
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

export type ToolId =
  | "alchemists-supplies"
  | "brewers-supplies"
  | "calligraphers-supplies"
  | "carpenters-tools"
  | "cartographers-tools"
  | "cooks-utensils"
  | "disguise-kit"
  | "forgery-kit"
  | "gamers-set"
  | "herbalism-kit"
  | "leatherworkers-tools"
  | "masons-tools"
  | "musical-instrument"
  | "navigators-tools"
  | "painters-supplies"
  | "potters-tools"
  | "smiths-tools"
  | "thieves-tools"
  | "tinkers-tools"
  | "weavers-tools"
  | "woodcarvers-tools"
  | "vehicles-land"
  | "vehicles-water";

export type LanguageId =
  | "common"
  | "draconic"
  | "dwarvish"
  | "elvish"
  | "giant"
  | "gnomish"
  | "goblin"
  | "halfling"
  | "orc"
  | "primordial"
  | "sylvan"
  | "infernal"
  | "celestial"
  | "abyssal"
  | "undercommon";

export type ArmorTrainingId =
  | "light-armor"
  | "medium-armor"
  | "heavy-armor"
  | "shields";

export type WeaponProficiencyId =
  | "simple-weapons"
  | "martial-weapons"
  | "unarmed-strikes"
  | "martial-finesse-or-light";

export type WeaponMasteryChoiceId =
  | "dagger"
  | "dart"
  | "light-crossbow"
  | "rapier"
  | "scimitar"
  | "shortbow"
  | "shortsword"
  | "sling";

export type OriginFeatId =
  | "alert"
  | "crafter"
  | "healer"
  | "lucky"
  | "magic-initiate"
  | "musician"
  | "savage-attacker"
  | "skilled"
  | "tavern-brawler"
  | "tough";

export type RulesOption = {
  id: string;
  name: string;
};

export type FeatureGrant = {
  id: string;
  name: string;
  level?: number;
  description?: string;
};

export type Background = {
  id: string;
  name: string;
  abilityOptions: AbilityKey[];
  skillProficiencies: [SkillId, SkillId];
  toolProficiency: ToolId;
  originFeatId: OriginFeatId;
  equipmentGold: number;
};

export type Species = RulesOption & {
  size?: "Small" | "Medium";
  speed: number;
  languages: LanguageId[];
  traits: FeatureGrant[];
};

export type Feat = RulesOption & {
  category: "origin" | "general" | "epic";
  traits: FeatureGrant[];
};

export type SpellcastingType = "full" | "half" | "third" | "pact";
export type SpellPreparationType = "prepared" | "known";

export type ClassSpellcasting = {
  ability: AbilityKey;
  type: SpellcastingType;
  preparation: SpellPreparationType;
};

export type CharacterClass = RulesOption & {
  hitDie: number;
  primaryAbilities?: AbilityKey[];
  savingThrowProficiencies: [AbilityKey, AbilityKey];
  armorTraining: ArmorTrainingId[];
  weaponProficiencies: WeaponProficiencyId[];
  toolProficiencies?: ToolId[];
  skillChoice: {
    choose: number;
    options: SkillId[];
  };
  featuresByLevel: Record<number, FeatureGrant[]>;
  spellcasting?: ClassSpellcasting;
};

export type AbilityScores = Record<AbilityKey, number>;

export type BackgroundAbilityBonuses = {
  plus2: AbilityKey;
  plus1: AbilityKey;
};

export type DerivedStats = {
  proficiencyBonus: number;
  maxHp?: number;
  currentHp?: number;
  armorClass?: number;
  initiativeBonus?: number;
  speed?: number;
  passivePerception?: number;
};

export type CharacterFeature = {
  id: string;
  name: string;
  sourceType: "class" | "species" | "background" | "feat";
  sourceId: string;
  level?: number;
};

export type CharacterSpell = {
  id: string;
  name: string;
  source: "class" | "species" | "feat";
  prepared?: boolean;
  alwaysPrepared?: boolean;
};

export type CharacterChoices = {
  classSkillChoices?: SkillId[];
  toolChoices?: ToolId[];
  languageChoices?: LanguageId[];
  backgroundAbilityBonuses?: BackgroundAbilityBonuses;

  rogueExpertiseChoices?: Array<SkillId | "thieves-tools">;
  rogueBonusLanguage?: LanguageId;
  rogueWeaponMasteryChoices?: WeaponMasteryChoiceId[];
};

export type DerivedCharacterData = {
  stats: DerivedStats;
  skillProficiencies: SkillId[];
  toolProficiencies: ToolId[];
  savingThrowProficiencies: AbilityKey[];
  armorTraining: ArmorTrainingId[];
  weaponProficiencies: WeaponProficiencyId[];
  languages: LanguageId[];
  features: CharacterFeature[];
  spells: CharacterSpell[];

  expertise: Array<SkillId | "thieves-tools">;
  weaponMasteries: WeaponMasteryChoiceId[];
};

export type CharacterSheetData = {
  ownerUid: string;
  campaignId: string | null;

  name: string;
  level: number;

  classId: string;
  speciesId: string;
  backgroundId: string;
  originFeatId: OriginFeatId | null;

  abilityScores: AbilityScores;

  alignment?: string;
  notes?: string;

  choices?: CharacterChoices;
  derived?: DerivedCharacterData;

  equipment?: {
    id: string;
    name: string;
    quantity: number;
    equipped?: boolean;
  }[];

  createdAt?: unknown;
  updatedAt?: unknown;
};