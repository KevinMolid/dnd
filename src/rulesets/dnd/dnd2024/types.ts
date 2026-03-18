export type Ability =
  | "str"
  | "dex"
  | "con"
  | "int"
  | "wis"
  | "cha";

// Backward-compatible alias used throughout the app
export type AbilityKey = Ability;

export type DamageType =
  | "acid"
  | "bludgeoning"
  | "cold"
  | "fire"
  | "force"
  | "lightning"
  | "necrotic"
  | "piercing"
  | "poison"
  | "psychic"
  | "radiant"
  | "slashing"
  | "thunder";

export type Condition =
  | "blinded"
  | "charmed"
  | "deafened"
  | "frightened"
  | "grappled"
  | "incapacitated"
  | "invisible"
  | "paralyzed"
  | "petrified"
  | "poisoned"
  | "prone"
  | "restrained"
  | "stunned"
  | "unconscious";

export type SenseType =
  | "darkvision"
  | "tremorsense"
  | "blindsight"
  | "truesight";

export type RestType = "short-rest" | "long-rest";

export type ActionType =
  | "action"
  | "bonus-action"
  | "reaction"
  | "attack-replacement"
  | "magic-action"
  | "no-action"
  | "passive";

export type DurationUnit = "round" | "minute" | "hour";

export type ScalingValue =
  | { type: "fixed"; value: number }
  | { type: "proficiency-bonus" }
  | { type: "level-based"; levels: Record<number, number> }
  | { type: "ability-modifier"; ability: AbilityKey }
  | {
      type: "formula";
      parts: Array<
        | { type: "fixed"; value: number }
        | { type: "proficiency-bonus" }
        | { type: "ability-modifier"; ability: AbilityKey }
      >;
    };

export type Usage =
  | { type: "at-will" }
  | {
      type: "limited";
      uses: ScalingValue;
      recharge: RestType;
    };

export type TraitEffect =
  | {
      type: "sense";
      sense: SenseType;
      range: number;
    }
  | {
      type: "resistance";
      damageType: DamageType;
    }
  | {
      type: "advantage-on-saving-throws-against";
      conditions: Condition[];
    }
  | {
      type: "hp-max-bonus";
      amount: ScalingValue;
    }
  | {
      type: "spell";
      spellName: string;
      level?: number;
      school?: string;
      castWith?: AbilityKey;
      frequency?: Usage;
    }
  | {
      type: "healing";
      amount: ScalingValue;
      target: "self" | "creature";
      activation: ActionType;
    }
  | {
      type: "transformation";
      activation: ActionType;
      duration: {
        amount: number;
        unit: DurationUnit;
      };
      frequency: Usage;
    }
  | {
      type: "speed-bonus";
      speedType: "fly" | "walk" | "swim" | "climb";
      equals: "speed";
      minimumLevel?: number;
      duration?: {
        amount: number;
        unit: DurationUnit;
      };
      activation?: ActionType;
      frequency?: Usage;
    }
  | {
      type: "aoe-damage";
      activation: ActionType;
      area:
        | { shape: "cone"; size: number }
        | { shape: "line"; length: number; width: number };
      save: {
        ability: AbilityKey;
        dc: ScalingValue;
      };
      damage: {
        amount: ScalingValue;
        damageType?: DamageType;
        damageTypeFrom?: string;
      };
      halfOnSuccess?: boolean;
      minimumLevel?: number;
      frequency?: Usage;
    }
  | {
      type: "condition";
      condition: Condition;
      save?: {
        ability: AbilityKey;
        dc: ScalingValue;
      };
      duration?: {
        amount: number;
        unit: DurationUnit;
      };
    }
  | {
      type: "light";
      bright: number;
      dim: number;
      duration?: {
        amount: number;
        unit: DurationUnit;
      };
    }
  | {
      type: "choice-ref";
      choiceId: string;
    }
  | {
      type: "text";
      text: string;
    };

export type TraitOption = {
  id: string;
  name: string;
  description?: string;
  effects?: TraitEffect[];
};

export type TraitChoice = {
  id: string;
  name: string;
  choose: number;
  options: TraitOption[];
};

export type Trait = {
  id: string;
  name: string;
  description?: string;
  minLevel?: number;
  level?: number;
  activation?: ActionType;
  usage?: Usage;
  effects?: TraitEffect[];
  choices?: TraitChoice[];
  notes?: string[];
};

export type ElfLineageId = "drow" | "high-elf" | "wood-elf";

export type ElfLineage = {
  id: ElfLineageId;
  name: string;
  traits: Trait[];
};

// Backward-compatible alias so older code using FeatureGrant still works
export type FeatureGrant = Trait;

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

export type Background = RulesOption & {
  abilityOptions: AbilityKey[];
  skillProficiencies: [SkillId, SkillId];
  toolProficiency: ToolId;
  originFeatId: OriginFeatId;
  equipmentGold: number;
};

export type Species = RulesOption & {
  size?: "Small" | "Medium";
  sizeOptions?: Array<"Small" | "Medium">;
  speed: number;
  languages: LanguageId[];
  traits: Trait[];
};

export type Feat = RulesOption & {
  category: "origin" | "general" | "epic";
  traits: Trait[];
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
  featuresByLevel: Record<number, Trait[]>;
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

  speciesTraitChoices?: Record<string, string | string[]>;
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