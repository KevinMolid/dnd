import type {
  LevelNumber,
  Spell,
  SpellId,
  SpellLevel,
  SpellListId,
  SpellSlotTable,
  SpellcastingRules,
} from "../../types";
import { spellSlotTables } from "../../spellSlotTables";
import { spells } from "./spells";
import { paladinSpellList } from "./paladinSpellList";
import { clericSpellList } from "./clericSpellList";
import { druidSpellList } from "./druidSpellList";
import { wizardSpellList } from "./wizardSpellList";

export {
  getAvailableSpells,
  getSpellsForSpellList,
} from "../../getAvailableSpells";

export const spellsById: Record<SpellId, Spell> = Object.fromEntries(
  spells.map((spell) => [spell.id, spell]),
) as Record<SpellId, Spell>;

export const spellListsById: Record<SpellListId, SpellId[]> = {
  bard: [],
  cleric: clericSpellList,
  druid: druidSpellList,
  paladin: paladinSpellList,
  ranger: [],
  sorcerer: [],
  warlock: [],
  wizard: wizardSpellList,
};

export const getSpellById = (spellId: SpellId): Spell | undefined => {
  return spellsById[spellId];
};

export const getSpellIdsForList = (spellListId: SpellListId): SpellId[] => {
  return spellListsById[spellListId] ?? [];
};

export const getSpellsForList = (spellListId: SpellListId): Spell[] => {
  return getSpellIdsForList(spellListId)
    .map((spellId) => getSpellById(spellId))
    .filter((spell): spell is Spell => Boolean(spell));
};

export const getSpellsForListAndLevel = (
  spellListId: SpellListId,
  level: SpellLevel,
): Spell[] => {
  return getSpellsForList(spellListId).filter((spell) => spell.level === level);
};

export const getCantripsForList = (spellListId: SpellListId): Spell[] => {
  return getSpellsForListAndLevel(spellListId, 0);
};

export const getSpellSlotTable = (
  rules: Pick<SpellcastingRules, "slotTableId" | "customSlotTable">,
): SpellSlotTable => {
  if (rules.customSlotTable) return rules.customSlotTable;
  if (rules.slotTableId) return spellSlotTables[rules.slotTableId] ?? {};
  return {};
};

export const getSpellSlotsForLevel = (
  rules: Pick<SpellcastingRules, "slotTableId" | "customSlotTable">,
  level: LevelNumber,
): Partial<Record<Exclude<SpellLevel, 0>, number>> => {
  const table = getSpellSlotTable(rules);
  return table[level] ?? {};
};

export const getHighestSpellLevelForCharacterLevel = (
  rules: Pick<SpellcastingRules, "slotTableId" | "customSlotTable">,
  level: LevelNumber,
): Exclude<SpellLevel, 0> | null => {
  const slots = getSpellSlotsForLevel(rules, level);

  const spellLevels = Object.keys(slots)
    .map(Number)
    .filter((n): n is Exclude<SpellLevel, 0> => n >= 1 && n <= 9)
    .sort((a, b) => b - a);

  return spellLevels[0] ?? null;
};

export const getCantripsKnownForLevel = (
  rules: Pick<SpellcastingRules, "cantrips">,
  level: LevelNumber,
): number => {
  if (!rules.cantrips) return 0;

  const matchingLevels = Object.keys(rules.cantrips.knownByLevel)
    .map(Number)
    .filter((definedLevel) => definedLevel <= level)
    .sort((a, b) => b - a);

  if (matchingLevels.length === 0) return 0;

  return rules.cantrips.knownByLevel[matchingLevels[0] as LevelNumber] ?? 0;
};

export const getPreparedSpellCountForLevel = (
  rules: Pick<SpellcastingRules, "preparedSpells">,
  level: LevelNumber,
): number => {
  if (!rules.preparedSpells) return 0;

  const matchingLevels = Object.keys(rules.preparedSpells.preparedByLevel)
    .map(Number)
    .filter((definedLevel) => definedLevel <= level)
    .sort((a, b) => b - a);

  if (matchingLevels.length === 0) return 0;

  return (
    rules.preparedSpells.preparedByLevel[
      matchingLevels[0] as LevelNumber
    ] ?? 0
  );
};

export const getKnownSpellCountForLevel = (
  rules: Pick<SpellcastingRules, "learnedSpells">,
  level: LevelNumber,
): number => {
  if (!rules.learnedSpells) return 0;

  const matchingLevels = Object.keys(rules.learnedSpells.knownByLevel)
    .map(Number)
    .filter((definedLevel) => definedLevel <= level)
    .sort((a, b) => b - a);

  if (matchingLevels.length === 0) return 0;

  return rules.learnedSpells.knownByLevel[matchingLevels[0] as LevelNumber] ?? 0;
};

export const getAvailableSpellsForRules = (
  rules: Pick<
    SpellcastingRules,
    "spellListId" | "slotTableId" | "customSlotTable"
  >,
  level: LevelNumber,
): Spell[] => {
  const highestSpellLevel = getHighestSpellLevelForCharacterLevel(rules, level);

  return getSpellsForList(rules.spellListId).filter((spell) => {
    if (spell.level === 0) return true;
    if (highestSpellLevel === null) return false;
    return spell.level <= highestSpellLevel;
  });
};

export const getAvailableCantripsForRules = (
  rules: Pick<SpellcastingRules, "spellListId">,
): Spell[] => {
  return getCantripsForList(rules.spellListId);
};

export const getAvailableLeveledSpellsForRules = (
  rules: Pick<
    SpellcastingRules,
    "spellListId" | "slotTableId" | "customSlotTable"
  >,
  level: LevelNumber,
): Spell[] => {
  const highestSpellLevel = getHighestSpellLevelForCharacterLevel(rules, level);

  if (highestSpellLevel === null) return [];

  return getSpellsForList(rules.spellListId).filter(
    (spell) => spell.level >= 1 && spell.level <= highestSpellLevel,
  );
};

export const isSpellOnList = (
  spellId: SpellId,
  spellListId: SpellListId,
): boolean => {
  return getSpellIdsForList(spellListId).includes(spellId);
};

export const isSpellOfLevel = (
  spellId: SpellId,
  level: SpellLevel,
): boolean => {
  const spell = getSpellById(spellId);
  if (!spell) return false;
  return spell.level === level;
};

export const areSpellIdsValid = (spellIds: SpellId[]): boolean => {
  return spellIds.every((spellId) => Boolean(getSpellById(spellId)));
};

export const getSpellName = (spellId: SpellId): string => {
  return getSpellById(spellId)?.name ?? spellId;
};

export const canPrepareSpells = (
  rules: Pick<SpellcastingRules, "preparationMode"> | null | undefined,
): boolean => {
  return (
    rules?.preparationMode === "prepared" ||
    rules?.preparationMode === "custom"
  );
};

export const getPreparedSpellSourceKey = (
  rules:
    | Pick<SpellcastingRules, "sourceType" | "sourceId">
    | null
    | undefined,
): string | null => {
  if (!rules) return null;
  return `${rules.sourceType}:${rules.sourceId}`;
};

export const getPreparedSpellIdsForSource = (
  preparedSpellIdsBySource: Record<string, SpellId[]> | undefined,
  sourceKey: string | null,
): SpellId[] => {
  if (!sourceKey) return [];
  return preparedSpellIdsBySource?.[sourceKey] ?? [];
};