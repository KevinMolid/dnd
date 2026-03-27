import { ManeuverId } from "./data/classes/fighter/maneuvers";

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

export type RestType = "short-rest" | "long-rest" | "short-or-long-rest";

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
      type: "per-rest";
      rest: "short" | "long";
      uses: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    }
  | {
      type: "limited";
      uses: ScalingValue;
      recharge: RestType;
    };

export type ResourceDie = "d4" | "d6" | "d8" | "d10" | "d12";

export type TraitEffect =
  | {
      type: "resource";
      resourceId: string;
      amount: ScalingValue;
    }
  | {
      type: "resource-die";
      resourceId: string;
      die: ResourceDie;
    }
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
      type: "advantage-on-saving-throws";
      abilities: AbilityKey[];
    }
  | {
      type: "hp-max-bonus";
      amount: ScalingValue;
    }
  | {
      type: "spell";
      spellId: SpellId;
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
    }
  | {
      type: "item-grant";
      itemId: string;
      quantity?: number;
    }
  | {
      type: "tool-proficiency";
      tool: ToolId;
    }
  | {
      type: "language-grant";
      language: LanguageId;
    }
  | {
      type: "skill-proficiency";
      skill: SkillId;
    }
    | {
      type: "armor-training";
      armor: ArmorTrainingId;
    }
  | {
      type: "weapon-proficiency";
      weapon: WeaponProficiencyId;
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

// Species

export type DragonbornAncestryId =
  | "black"
  | "blue"
  | "brass"
  | "bronze"
  | "copper"
  | "gold"
  | "green"
  | "red"
  | "silver"
  | "white";

export type ElfLineageId = "drow" | "high-elf" | "wood-elf";

export type ElfLineage = {
  id: ElfLineageId;
  name: string;
  traits: Trait[];
};

export type GnomeLineageId = "forest-gnome" | "rock-gnome";

export type GnomeLineage = {
  id: GnomeLineageId;
  name: string;
  traits: Trait[];
};

export type TieflingLegacyId = "abyssal" | "chthonic" | "infernal";

export type TieflingLegacy = {
  id: TieflingLegacyId;
  name: string;
  traits: Trait[];
};

export type GoliathAncestryId =
  | "clouds-jaunt"
  | "fires-burn"
  | "frosts-chill"
  | "hills-tumble"
  | "stones-endurance"
  | "storms-thunder";

export type GoliathAncestry = {
  id: GoliathAncestryId;
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

export type MusicalInstrumentToolId =
  | "bagpipes"
  | "drum"
  | "dulcimer"
  | "flute"
  | "horn"
  | "lute"
  | "lyre"
  | "pan-flute"
  | "shawm"
  | "viol";

export type ArtisanToolId =
  | "alchemists-supplies"
  | "brewers-supplies"
  | "calligraphers-supplies"
  | "carpenters-tools"
  | "cartographers-tools"
  | "cobblers-tools"
  | "cooks-utensils"
  | "glassblowers-tools"
  | "jewelers-tools"
  | "leatherworkers-tools"
  | "masons-tools"
  | "painters-supplies"
  | "potters-tools"
  | "smiths-tools"
  | "tinkers-tools"
  | "weavers-tools"
  | "woodcarvers-tools";

export type OtherToolId =
  | "disguise-kit"
  | "forgery-kit"
  | "herbalism-kit"
  | "navigator-tools"
  | "poisoners-kit"
  | "thieves-tools"
  | "gaming-set"
  | "vehicles-land"
  | "vehicles-water";

export type ToolId = MusicalInstrumentToolId | ArtisanToolId | OtherToolId;

export type ToolChoiceGroup =
  | "artisan-tools"
  | "gaming-set"
  | "musical-instrument";

export type BackgroundToolProficiency =
  | {
      type: "fixed";
      tool: ToolId;
    }
  | {
      type: "choice";
      choose: 1;
      options: ToolId[];
      optionGroup?: ToolChoiceGroup;
    };

export type BackgroundFeatGrant =
  | {
      type: "fixed";
      featId: OriginFeatId;
    }
  | {
      type: "magic-initiate";
      featId: "magic-initiate";
      spellListId: Extract<SpellListId, "cleric" | "druid" | "wizard">;
    };

export type BackgroundEquipmentOption = {
  id: string;
  label: string;
  grants: EquipmentGrant[];
};

export type BackgroundEquipment = {
  choose: 1;
  options: [BackgroundEquipmentOption, BackgroundEquipmentOption];
};

export type Background = RulesOption & {
  abilityOptions: AbilityKey[];
  skillProficiencies: [SkillId, SkillId];

  toolProficiency?: ToolId;
  originFeatId?: OriginFeatId;
  equipmentGold?: number;

  toolProficiencyOptions?: BackgroundToolProficiency;
  featGrant?: BackgroundFeatGrant;
  equipment?: BackgroundEquipment;
};

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
  | "undercommon"
  | "deep-speech"
  | "thieves-cant";

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
  | "club"
  | "dagger"
  | "dart"
  | "handaxe"
  | "javelin"
  | "light-crossbow"
  | "mace"
  | "quarterstaff"
  | "rapier"
  | "scimitar"
  | "shortbow"
  | "shortsword"
  | "sickle"
  | "sling"
  | "spear"
  | "battleaxe"
  | "flail"
  | "glaive"
  | "greataxe"
  | "greatclub"
  | "greatsword"
  | "halberd"
  | "lance"
  | "light-hammer"
  | "longbow"
  | "longsword"
  | "maul"
  | "morningstar"
  | "pike"
  | "trident"
  | "war-pick"
  | "warhammer"
  | "whip"
  | "heavy-crossbow"
  | "hand-crossbow";

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

export type SpeciesChoiceOption = RulesOption & {
  description?: string;
};

export type SpeciesChoice = {
  id: string;
  name: string;
  choose: 1;
  options: SpeciesChoiceOption[];
};

export type Species = RulesOption & {
  size?: "Small" | "Medium";
  sizeOptions?: Array<"Small" | "Medium">;
  speed: number;
  languages: LanguageId[];
  traits: Trait[];
  choices?: SpeciesChoice[];
};

export type FeatGrant =
  | {
      type: "magic-initiate";
      spellListOptions: Extract<SpellListId, "cleric" | "druid" | "wizard">[];
    }
  | {
      type: "skilled";
      chooseSkills: number;
    };

export type Feat = RulesOption & {
  category: "origin" | "general" | "epic";
  traits: Trait[];
  grant?: FeatGrant;
};

export type Spell = {
  id: string;
  name: string;
  level: number;
  school: string;
  concentration?: boolean;
  ritual?: boolean;

  castingTime?: string;
  range?: string;
  components?: string;
  duration?: string;
  durationRule?: string;
  classes?: string[];

  description?: string;
  higherLevel?: string;
  cantripUpgrade?: string;

  savingThrows?: string;

  details?: string;
  effects?: string;
  control?: string;
  endConditions?: string;
  limitations?: string;
  benefits?: string;
  detection?: string;
  special?: string;
  triggers?: string;
  interaction?: string;
  conditions?: string;
  behavior?: string;
  penalties?: string;

  options?: {
    name: string;
    text: string;
  }[];

  statBlock?: any;
};

export type SpellId = string;

export type SpellLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type SpellListId =
  | "wizard"
  | "cleric"
  | "druid"
  | "bard"
  | "sorcerer"
  | "warlock"
  | "paladin"
  | "ranger";

export type SpellcastingProgressionType =
  | "full"
  | "half"
  | "third"
  | "pact"
  | "custom";

export type SpellPreparationMode =
  | "prepared"
  | "known"
  | "spellbook"
  | "custom";

export type SpellcastingSourceType =
  | "class"
  | "subclass"
  | "species"
  | "background"
  | "feat";

export type SpellSlotTable = Partial<
  Record<LevelNumber, Partial<Record<Exclude<SpellLevel, 0>, number>>>
>;

export type CantripProgression = {
  knownByLevel: LevelValueTable<number>;
  fixedKnown?: SpellId[];
  chooseAtStart?: number;
  additionalChoicesByLevel?: LevelValueTable<number>;
  replacementRules?: string[];
};

export type LearnedSpellProgression = {
  knownByLevel: LevelValueTable<number>;
  chooseAtStart?: {
    count: number;
    spellLevel: Exclude<SpellLevel, 0>;
  };
  replacementRules?: string[];
};

export type PreparedSpellProgression = {
  preparedByLevel: LevelValueTable<number>;
  chooseAtStart?: {
    count: number;
    spellLevel: Exclude<SpellLevel, 0>;
  };
  replacementRules?: string[];
};

export type SpellbookProgression = {
  startingSpellbookCount: number;
  startingSpellLevel: Exclude<SpellLevel, 0>;
  spellsAddedPerLevel?: number;
  preparationCountFormula?:
    | "casting-ability-mod-plus-level"
    | "casting-ability-mod-plus-half-level"
    | "custom";
  replacementRules?: string[];
};

export type SpellGrantRule = {
  spellId: SpellId;
  minCharacterLevel?: number;
  spellLevel?: SpellLevel;
  alwaysPrepared?: boolean;
  countsAgainstLimit?: boolean;
  note?: string;
};

export type SpellcastingRules = {
  id: string;
  name: string;
  sourceType: SpellcastingSourceType;
  sourceId: string;

  castingAbility: AbilityKey;
  spellListId: SpellListId;

  progressionType: SpellcastingProgressionType;
  preparationMode: SpellPreparationMode;

  ritualCasting?: boolean;

  slotTableId?: SpellSlotTableId;
  customSlotTable?: SpellSlotTable;

  cantrips?: CantripProgression;

  learnedSpells?: LearnedSpellProgression;
  preparedSpells?: PreparedSpellProgression;
  spellbook?: SpellbookProgression;

  fixedSpells?: SpellGrantRule[];
  recommendedSpells?: SpellGrantRule[];

  notes?: string[];
};

export type SpellSlotTableId =
  | "full-caster"
  | "half-caster"
  | "third-caster"
  | "pact-magic"
  | "arcane-trickster"
  | "eldritch-knight";

export type CharacterClassId =
  | "barbarian"
  | "bard"
  | "cleric"
  | "druid"
  | "fighter"
  | "monk"
  | "paladin"
  | "ranger"
  | "rogue"
  | "sorcerer"
  | "warlock"
  | "wizard";

  export type CharacterSubclassId =
  // Barbarian
  | "berserker"
  | "wild-heart"
  | "world-tree"
  | "zealot"

  // Bard
  | "college-of-dance"
  | "college-of-glamour"
  | "college-of-lore"
  | "college-of-valor"

  // Cleric
  | "life-domain"
  | "light-domain"
  | "trickery-domain"
  | "war-domain"

  // Druid
  | "circle-of-the-land"
  | "circle-of-the-moon"
  | "circle-of-the-sea"
  | "circle-of-the-stars"

  // Fighter
  | "battle-master"
  | "champion"
  | "eldritch-knight"
  | "psi-warrior"

  // Monk
  | "warrior-of-mercy"
  | "warrior-of-shadow"
  | "warrior-of-the-elements"
  | "warrior-of-the-open-hand"

  // Paladin
  | "oath-of-devotion"
  | "oath-of-glory"
  | "oath-of-the-ancients"
  | "oath-of-vengeance"

  // Ranger
  | "beast-master"
  | "fey-wanderer"
  | "gloom-stalker"
  | "hunter"

  // Rogue
  | "arcane-trickster"
  | "assassin"
  | "soulknife"
  | "thief"

  // Sorcerer
  | "aberrant-sorcery"
  | "clockwork-sorcery"
  | "draconic-sorcery"
  | "wild-magic-sorcery"

  // Warlock
  | "archfey-patron"
  | "celestial-patron"
  | "fiend-patron"
  | "great-old-one-patron"

  // Wizard
  | "abjurer"
  | "diviner"
  | "evoker"
  | "illusionist";


export type FightingStyleId =
  | "archery"
  | "blind-fighting"
  | "defense"
  | "dueling"
  | "great-weapon-fighting"
  | "interception"
  | "protection"
  | "two-weapon-fighting"
  | "blessed-warrior"
  | "druidic-warrior"
  | "thrown-weapon-fighting"
  | "superior-technique"
  | "unarmed-fighting";

export type LevelNumber =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

export type LevelValueTable<T> = Partial<Record<LevelNumber, T>>;

export type ChoiceSource =
  | "skill-proficiencies"
  | "tool-proficiencies"
  | "languages"
  | "weapon-mastery"
  | "fighting-style"
  | "cantrips"
  | "spells"
  | "invocations"
  | "maneuvers"
  | "expertise"
  | "feat"
  | "equipment"
  | "subclass"
  | "class-feature"
  | "other";

export type ChoiceDefinition<TOption extends string = string> = {
  id: string;
  level: number;
  name: string;
  choose: number;
  source: ChoiceSource;
  options?: TOption[];
  optionGroup?: ToolChoiceGroup;
  description?: string;
  restrictions?: string[];
};

export type ChoiceMapByLevel<TOption extends string = string> = Partial<
  Record<number, ChoiceDefinition<TOption>[]>
>;

export type Currency = "cp" | "sp" | "ep" | "gp" | "pp";

export type Money = Partial<Record<Currency, number>>;

export type ItemCategory =
  | "weapon"
  | "armor"
  | "shield"
  | "tool"
  | "gear"
  | "container"
  | "ammunition"
  | "clothing"
  | "consumable"
  | "holy-symbol"
  | "misc";

export type DamageDie = {
  count: number;
  die: 1 | 4 | 6 | 8 | 10 | 12;
};

export type WeaponProperty =
  | "ammunition"
  | "finesse"
  | "heavy"
  | "light"
  | "loading"
  | "range"
  | "reach"
  | "thrown"
  | "two-handed"
  | "versatile";

export type ArmorCategory = "light" | "medium" | "heavy";

export type WeaponRange = {
  normal: number;
  long?: number;
};

export type WeaponKind =
  | "simple-melee"
  | "simple-ranged"
  | "martial-melee"
  | "martial-ranged";

export type WeaponData = {
  weaponKind: WeaponKind;
  damage: {
    dice: DamageDie;
    damageType: DamageType;
  };
  versatileDamage?: {
    dice: DamageDie;
    damageType: DamageType;
  };
  properties: WeaponProperty[];
  range?: WeaponRange;
  mastery?: string;
};

export type EquippedWeaponAttack = {
  instanceId: string;
  itemId: string;
  name: string;
  ability: AbilityKey;
  attackBonus: number;
  damage: string;
  range?: WeaponData["range"];
  properties: WeaponData["properties"];
  mastery?: WeaponData["mastery"];
  isOffHand?: boolean;
  isThrown?: boolean;
  isTwoHanded?: boolean;
};

export type ArmorData = {
  armorCategory: ArmorCategory;
  baseAc: number;
  dexCap?: number | null;
  stealthDisadvantage?: boolean;
  strengthRequirement?: number;
};

export type ShieldData = {
  acBonus: number;
};

export type EquippableConfig = {
  slots: EquipmentSlotId[];
  allowedWieldModes?: WieldMode[];
};

export type Item = {
  id: string;
  name: string;
  category: ItemCategory;
  stackable?: boolean;

  weight?: number;
  cost?: Partial<Record<Currency, number>>;

  equippable?: EquippableConfig;

  weapon?: WeaponData;
  armor?: ArmorData;
  shield?: ShieldData;
};

export type EquipmentSlotId =
  | "head"
  | "neck"
  | "body"
  | "cloak"
  | "hands"
  | "waist"
  | "feet"
  | "ring-left"
  | "ring-right"
  | "main-hand"
  | "off-hand";

export type WieldMode = "main-hand" | "off-hand" | "two-handed";

export type CharacterEquipmentEntry = {
  instanceId: string;
  itemId: string;
  name: string;
  quantity: number;
  equipped?: boolean;
  equippedSlots?: EquipmentSlotId[];
  wieldMode?: WieldMode;
  attackBonus?: number;
  damageBonus?: number;
};

export type EquipmentItemGrant = {
  type: "item";
  id: string;
  quantity?: number;
};

export type EquipmentCurrencyGrant = {
  type: "currency";
  amount: number;
  currency: Currency;
};

export type EquipmentChoiceGrant = {
  type: "choice";
  choose: number;
  options: EquipmentGrant[];
};

export type EquipmentGrant =
  | EquipmentItemGrant
  | EquipmentCurrencyGrant
  | EquipmentChoiceGrant;

export type StartingEquipmentOption = {
  id: string;
  label: string;
  grants: EquipmentGrant[];
};

export type StartingEquipment = {
  choose: 1;
  options: StartingEquipmentOption[];
};

export type CharacterSubclass = RulesOption & {
  classId: CharacterClassId;
  description?: string;
  featuresByLevel: Partial<Record<number, Trait[]>>;
  spellcasting?: SpellcastingRules;
};

export type CharacterSubclassOption = {
  id: string;
  name: string;
  description?: string;
};

export type CharacterClass = RulesOption & {
  hitDie: number;
  primaryAbilities?: AbilityKey[];
  savingThrowProficiencies: [AbilityKey, AbilityKey];
  armorTraining: ArmorTrainingId[];
  weaponProficiencies: WeaponProficiencyId[];
  toolProficiencies?: ToolId[];
  toolProficiencyChoice?: {
    choose: number;
    options: ToolId[];
  };
  skillChoice: {
    choose: number;
    options: SkillId[];
  };
  featuresByLevel: Partial<Record<number, Trait[]>>;
  spellcasting?: SpellcastingRules;
  startingEquipment?: StartingEquipment;
  subclasses?: CharacterSubclassOption[];
  weaponMasteryOptions?: WeaponMasteryChoiceId[];
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
  sourceType: "class" | "species" | "background" | "feat" | "subclass";
  sourceId: string;
  level?: number;
};

export type CharacterSpell = {
  spellId: SpellId;
  level?: SpellLevel;
  school?: string;

  sourceType: SpellcastingSourceType;
  sourceId: string;

  prepared?: boolean;
  alwaysPrepared?: boolean;
  known?: boolean;
  inSpellbook?: boolean;
  countsAgainstPreparationLimit?: boolean;
  countsAgainstKnownLimit?: boolean;

  usage?: {
    type: "at-will" | "limited";
    recharge?: "short-rest" | "long-rest" | "short-or-long-rest";
    max?: number;
  };
};

export type RogueCunningStrikeOptionId =
  | "poison"
  | "trip"
  | "withdraw"
  | "daze"
  | "knock-out"
  | "obscure";

export type RogueCunningStrikeOption = {
  id: RogueCunningStrikeOptionId;
  name: string;
  level: number;
  costDice: number;
  description: string;
  savingThrow?: AbilityKey;
  requires?: ToolId[];
};

export type SpellReplacement = {
  removeSpellId?: SpellId;
  addSpellId?: SpellId;
  level?: SpellLevel;
};

export type CantripReplacement = {
  removeSpellId?: SpellId;
  addSpellId?: SpellId;
};

export type LevelUpDecision = {
  subclassId?: string;
  featId?: string;
  fightingStyleId?: FightingStyleId;
  asi?: {
    plus2?: AbilityKey;
    plus1a?: AbilityKey;
    plus1b?: AbilityKey;
  };
  expertise?: Array<SkillId | "thieves-tools">;
  language?: LanguageId;
  weaponMastery?: WeaponMasteryChoiceId[];

  cantripChoices?: SpellId[];
  spellChoices?: SpellSelection[];
  spellbookChoices?: SpellSelection[];

  cantripReplacements?: CantripReplacement[];
  spellReplacements?: SpellReplacement[];

  // Barbarian
  primalKnowledgeSkill?: SkillId;

  // Cleric
  clericDivineOrder?: "protector" | "thaumaturge";

  // Druid
  circleOfTheLandType?: "arid" | "polar" | "temperate" | "tropical";
  primalOrder?: "magician" | "warden";
  elementalFuryOption?: "potent-spellcasting" | "primal-strike";
};

export type LevelUpDecisionsByLevel = Record<number, LevelUpDecision>;

export type SpellSelection = {
  spellId: SpellId;
  level: SpellLevel;
};

export type SpellSelectionsBySource = Record<string, SpellSelection[]>;

export type CharacterChoices = {
  toolChoices?: ToolId[];
  languageChoices?: LanguageId[];
  fighterManeuvers?: ManeuverId[];

  // Species
  speciesTraitChoices?: Record<string, string | string[]>;
  fiendishLegacySpellcastingAbility?: Ability;

  dragonbornAncestry?: DragonbornAncestryId;

  humanFeatSpellListId?: Extract<SpellListId, "cleric" | "druid" | "wizard">;
  humanFeatCantripChoices?: SpellId[];
  humanFeatSpellChoices?: SpellSelection[];
  humanFeatSkillChoices?: SkillId[];

  // Background
  backgroundAbilityBonuses?: BackgroundAbilityBonuses;
  backgroundToolChoice?: ToolId;
  backgroundFeatSpellListId?: Extract<SpellListId, "cleric" | "druid" | "wizard">;
  backgroundFeatCantripChoices?: SpellId[];
  backgroundFeatSpellChoices?: SpellSelection[];

  // Class
  classSkillChoices?: SkillId[];
  classCantripChoices?: SpellId[];
  classSpellChoices?: SpellSelection[];

  subclassId?: string;
  subclassCantripChoices?: SpellId[];
  subclassSpellChoices?: SpellSelection[];

  barbarianWeaponMasteryChoices?: WeaponMasteryChoiceId[];
  clericDivineOrder?: "protector" | "thaumaturge";
  fighterFightingStyle?: FightingStyleId;
  fighterWeaponMasteryChoices?: WeaponMasteryChoiceId[];
  rogueExpertiseChoices?: Array<SkillId | "thieves-tools">;
  rogueBonusLanguage?: LanguageId;
  rogueWeaponMasteryChoices?: WeaponMasteryChoiceId[];

  preparedSpellIdsBySource?: Record<string, SpellId[]>;
  spellbookChoices?: SpellSelection[];

  levelUpDecisions?: LevelUpDecisionsByLevel;
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
  spellcasting?: DerivedSpellcastingData;

  expertise: Array<SkillId | "thieves-tools">;
  weaponMasteries: WeaponMasteryChoiceId[];
  resistances?: string[],
};

export type DerivedSpellcastingData = {
  castingAbility: AbilityKey;
  spellListId: SpellListId;
  preparationMode: SpellPreparationMode;
  progressionType: SpellcastingProgressionType;

  spellSaveDc?: number;
  spellAttackBonus?: number;

  cantripsKnown?: number;
  spellsKnown?: number;
  spellsPrepared?: number;

  availableSlots?: Partial<Record<Exclude<SpellLevel, 0>, number>>;
};

export type PendingLevelUp = {
  fromLevel: number;
  toLevel: number;
  createdAt?: unknown;
};

export type LevelUpHistoryEntry = {
  level: number;
  completedAt?: unknown;
};

export type CharacterSheetData = {
  ownerUid: string | null
  createdByUid: string | null
  campaignId: string | null;
  campaignStatus?: "inactive" | "active"

  name: string;
  imageUrl?: string;
  xp?: number;
  level: number;

  classId: CharacterClassId | string;
  subclassId?: CharacterSubclass;
  speciesId: string;
  backgroundId: string;
  originFeatId: OriginFeatId | null;

  abilityScores: AbilityScores;

  alignment?: string;
  notes?: string;

  choices?: CharacterChoices;
  derived?: DerivedCharacterData;

  pendingLevelUp?: PendingLevelUp | null;
  levelUpHistory?: LevelUpHistoryEntry[];

  equipment?: CharacterEquipmentEntry[];

  money?: Money;

  createdAt?: unknown;
  updatedAt?: unknown;
};