import type {
  LevelNumber,
  Spell,
  SpellId,
  SpellLevel,
  SpellListId,
  SpellSlotTable,
  SpellcastingRules,
} from "../../types";
import { spells } from "./spells";
import { spellSlotTables } from "../../spellSlotTables";

export const spellsById: Record<SpellId, Spell> = Object.fromEntries(
  spells.map((spell) => [spell.id, spell]),
) as Record<SpellId, Spell>;

export const getSpellById = (spellId: SpellId): Spell | undefined => {
  return spellsById[spellId];
};

export const getSpellsForList = (spellListId: SpellListId): Spell[] => {
  return spells.filter((spell) => spell.classes.includes(spellListId));
};

export const getSpellsForListAndLevel = (
  spellListId: SpellListId,
  level: SpellLevel,
): Spell[] => {
  return spells.filter(
    (spell) => spell.classes.includes(spellListId) && spell.level === level,
  );
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

  const base = rules.cantrips.knownByLevel[level] ?? 0;
  return base;
};

export const getPreparedSpellCountForLevel = (
  rules: Pick<SpellcastingRules, "preparedSpells">,
  level: LevelNumber,
): number => {
  if (!rules.preparedSpells) return 0;
  return rules.preparedSpells.preparedByLevel[level] ?? 0;
};

export const getKnownSpellCountForLevel = (
  rules: Pick<SpellcastingRules, "learnedSpells">,
  level: LevelNumber,
): number => {
  if (!rules.learnedSpells) return 0;
  return rules.learnedSpells.knownByLevel[level] ?? 0;
};

export const getAvailableSpellsForRules = (
  rules: Pick<SpellcastingRules, "spellListId" | "slotTableId" | "customSlotTable">,
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
  rules: Pick<SpellcastingRules, "spellListId" | "slotTableId" | "customSlotTable">,
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
  const spell = getSpellById(spellId);
  if (!spell) return false;
  return spell.classes.includes(spellListId);
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