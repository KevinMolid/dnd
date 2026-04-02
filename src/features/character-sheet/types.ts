import type {
  AbilityKey,
  SkillId,
  LanguageId,
  Money,
  WeaponMasteryChoiceId,
  Trait,
  CampaignItem,
} from "../../rulesets/dnd/dnd2024/types";
import type { CharacterSheetData } from "../../rulesets/dnd/dnd2024/types";
import type { CharacterEquipmentEntry } from "../../rulesets/dnd/dnd2024/types";

export type CharacterDoc = CharacterSheetData & {
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
  equipment?: CharacterEquipmentEntry[];
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
  | "overview"
  | "combat"
  | "features"
  | "inventory"
  | "spells"
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
  setError: React.Dispatch<React.SetStateAction<string>>;
  handleEquipmentChange: (
    nextEquipment: CharacterEquipmentEntry[],
  ) => Promise<void>;
  handleApplyDecision: (level: number, decision: ApplyDecisionInput) => void;
  handleCompleteLevelUp: () => void;
};