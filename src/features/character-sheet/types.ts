import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  CharacterSpell,
  SpellId,
} from "../../rulesets/dnd/dnd2024/types";

import type {
  AbilityKey,
  SkillId,
  LanguageId,
  Money,
  WeaponMasteryChoiceId,
  Trait,
  CampaignItem,
  CharacterEquipmentEntry,
  CharacterSheetData,
} from "../../rulesets/dnd/dnd2024/types";

import type {
  FeatureAction,
  FeatureActivation,
} from "../../types/featureActions";

export type CharacterBuildMode =
  | "guided-dnd-2024"
  | "custom";

export type DeathSaves = {
  successes: number;
  failures: number;
};

export type ShortRestResult = {
  diceSpent: number;
  dieSize: number;
  rolls: number[];
  constitutionModifier: number;
  rolledHealing: number;
  actualHealing: number;
  currentHp: number;
  hitDiceRemaining: number;
};

export type CustomCharacterTrait = {
  id: string;
  name: string;
  source?: string;
  description?: string;
  activation?: FeatureActivation;
  actions?: FeatureAction[];
};

export type CustomCharacterStats = {
  armorClass?: number;
  currentHp?: number;
  maxHp?: number;
  speed?: number;
  proficiencyBonus?: number;
  hitDie?: string;
  hitDiceRemaining?: number;
};

export type CustomSpellSlotState = {
  max: number;
  remaining: number;
};

export type CustomSpellcastingState = {
  enabled?: boolean;
  ability?: AbilityKey | null;
  spellSaveDc?: number;
  spellAttackBonus?: number;
  spellSlots?: Record<string, CustomSpellSlotState>;
  spells?: Array<{
    spellId: string;
    name: string;
    level: number;
  }>;
};

export type CharacterDoc = CharacterSheetData & {
  buildMode?: CharacterBuildMode;

  className?: string;
  speciesName?: string;
  backgroundName?: string;

  catalogTraitIds?: string[];
  customStats?: CustomCharacterStats;
  customTraits?: CustomCharacterTrait[];
  customSpellcasting?: CustomSpellcastingState;

  maxHp?: number;
  currentHp?: number;
  armorClass?: number;
  speed?: number;
  proficiencyBonus?: number;
  initiativeBonus?: number;

  skillProficiencies?: string[];
  toolProficiencies?: string[];
  savingThrowProficiencies?: string[];
  languages?: string[];

  subclassId?: string | null;

  money?: Money;
  moneyCp?: any;
  equipment?: CharacterEquipmentEntry[];

  conditions?: string[];
  defenses?: string[];

  heroicInspiration?: boolean;

  deathSaves?: DeathSaves;
  deathSaveSuccesses?: number;
  deathSaveFailures?: number;

  hitDiceRemaining?: number;

  spellSlotsRemaining?: Record<string, number>;
  spellOverrides?: {
  added: CharacterSpell[];
  removedSpellIds: SpellId[];
};

  age?: string | number;
  height?: string;
  weight?: string;
  eyes?: string;
  skin?: string;
  hair?: string;
  alignment?: string;

  characterAppearance?: string;
  alliesAndOrganizations?: string;
  characterBackstory?: string;

  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;

  playerNotes?: string;
  notes?: string;
};

export type TraitGroupKey =
  | "species"
  | "class"
  | "subclass"
  | "background"
  | "feats"
  | "other";

export type TraitGroup = {
  key: TraitGroupKey;
  title: string;
  subtitle?: string;
  traits: Trait[];
};

export type CharacterSheetTab =
  | "features"
  | "inventory"
  | "character"
  | "notes";

export type ApplyDecisionInput =
  | { subclassId: string }
  | { featId: string }
  | { expertise: Array<SkillId | "thieves-tools"> }
  | { language: LanguageId }
  | { weaponMastery: WeaponMasteryChoiceId[] };

export type CharacterSheetDerived = {
  className: string;
  speciesName: string;
  backgroundName: string;
  featName: string | null;
  subclassName: string | null;
  proficiencyBonus: number;
  initiativeBonus: number;
  initiativeBreakdown: string;
  passivePerception: number;
  armorClass: number;
  speed: number;
  currentHp: number;
  maxHp: number;

  finalAbilityScores: Record<AbilityKey, number>;

  skillRows: Array<{
    id: SkillId;
    name: string;
    ability: AbilityKey;
    proficient: boolean;
    expertise: boolean;
    total: number;
  }>;

  saveRows: Array<{
    id: AbilityKey;
    name: string;
    proficient: boolean;
    total: number;
  }>;

  skillProficiencies: SkillId[];
  savingThrowProficiencies: AbilityKey[];
  toolProficiencies: string[];
  languages: string[];
  resistances: string[];
  expertise: Array<SkillId | "thieves-tools">;

  equippedWeaponAttacks: any[];

  genericAttackBonuses: {
    strengthWeapon: number;
    finesseOrRanged: number;
    unarmed: number;
  };

  combatFeatures: Array<{
    id: string;
    name: string;
    summary: string;
    value?: string | null;
  }>;

  rogueSneakAttack: string | null;

  xp: number;

  xpProgress: {
    level: number;
    currentLevelXp: number;
    nextLevelXp: number | null;
    progressXp: number;
    neededXp: number;
    progressPercent: number;
  };

  pendingSteps: any[];
  traitGroups: TraitGroup[];

  activeSpellcasting: any;
  spellcastingAbility: AbilityKey | null;
  spellcastingAbilityMod: number | null;
  spellSaveDc: number | null;
  spellAttackBonus: number | null;
  spellSlots: Record<string, number>;

  cantripsKnown: number;
  spellsKnown: number;
  spellsPrepared: number;
  missingSpellListCount: number;
  spells: any[];

  groupedSpells: Array<{
    level: number;
    title: string;
    spells: any[];
  }>;

  selectedCantripCount: number;
  selectedLeveledSpellCount: number;

  tieflingLegacyName: string | null;
  tieflingLegacyCastingAbility: AbilityKey | null;
  tieflingLegacyCastingMod: number | null;
  tieflingLegacySpellSaveDc: number | null;
  tieflingLegacySpellAttackBonus: number | null;
  tieflingLegacySpells: any[];

  groupedTieflingLegacySpells: Array<{
    level: number;
    title: string;
    spells: any[];
  }>;

  money: Money;
  moneyCp: any;

  dragonbornAncestryId: string | null;
  dragonbornAncestryName: string | null;
  dragonbornDamageType: string | null;
  dragonbornBreathWeaponDc: number | null;
  dragonbornBreathWeaponDamage: string | null;
};

export type CharacterSheetDataHookResult = {
  character: CharacterDoc | null;
  loading: boolean;
  error: string;

  campaignItemsById: Record<string, CampaignItem>;

  derived: CharacterSheetDerived | null;

  setError: Dispatch<SetStateAction<string>>;

  handleShortRest: (
    hitDiceToSpend: number,
  ) => Promise<ShortRestResult>;

  handleLongRest: () => Promise<void>;

  handleSetDefenses: (
    defenses: string[],
  ) => Promise<void>;

  handleEquipmentChange: (
    nextEquipment: CharacterEquipmentEntry[],
  ) => Promise<void>;

  handleSetPlayerNotes: (
    notes: string,
  ) => Promise<void>;

  handleSetCurrentHp: (
    currentHp: number,
  ) => Promise<void>;

  handleSetConditions: (
    conditions: string[],
  ) => Promise<void>;

  handleSetHeroicInspiration: (
    value: boolean,
  ) => Promise<void>;

  handleSetDeathSaves: (
    nextDeathSaves: DeathSaves,
  ) => Promise<void>;

  handleSetSpellSlotRemaining: (
    level: number,
    remaining: number,
  ) => Promise<void>;

  handleAddSpell: (spell: {
  spellId: string;
  name: string;
  level: number;
}) => Promise<void>;

handleRemoveSpell: (
  spellId: string,
) => Promise<void>;

  handleApplyDecision: (
    level: number,
    decision: ApplyDecisionInput,
  ) => void;

  handleCompleteLevelUp: () => void;
};
