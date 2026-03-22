import { getBackgroundById, getClassById } from "./helpers";
import { getSpellsForList } from "./data/spells/helpers";
import type {
  CharacterSheetData,
  Spell,
  SpellId,
  SpellLevel,
  SpellListId,
} from "./types";

type AvailableSpellsOptions = {
  spellListId?: SpellListId;
  maxLevel?: SpellLevel;
  includeCantrips?: boolean;
  excludeSpellIds?: SpellId[];
};

export const getSpellsForSpellList = (
  spellListId: SpellListId,
  options: Omit<AvailableSpellsOptions, "spellListId"> = {},
): Spell[] => {
  const {
    maxLevel,
    includeCantrips = true,
    excludeSpellIds = [],
  } = options;

  return getSpellsForList(spellListId).filter((spell) => {
    if (!includeCantrips && spell.level === 0) return false;
    if (typeof maxLevel === "number" && spell.level > maxLevel) return false;
    if (excludeSpellIds.includes(spell.id)) return false;

    return true;
  });
};

const getBackgroundSpellLists = (character: CharacterSheetData): SpellListId[] => {
  const background = getBackgroundById(character.backgroundId);
  if (!background?.featGrant) return [];

  if (background.featGrant.type === "magic-initiate") {
    const chosenList =
      character.choices?.backgroundFeatSpellListId ??
      background.featGrant.spellListId;

    return [chosenList];
  }

  return [];
};

const getCharacterSpellLists = (character: CharacterSheetData): SpellListId[] => {
  const spellLists = new Set<SpellListId>();

  const classDef = getClassById(character.classId);
  if (classDef?.spellcasting?.spellListId) {
    spellLists.add(classDef.spellcasting.spellListId);
  }

  const backgroundSpellLists = getBackgroundSpellLists(character);
  for (const spellListId of backgroundSpellLists) {
    spellLists.add(spellListId);
  }

  return Array.from(spellLists);
};

export const getAvailableSpells = (
  character: CharacterSheetData,
  options: AvailableSpellsOptions = {},
): Spell[] => {
  const {
    spellListId,
    maxLevel,
    includeCantrips = true,
    excludeSpellIds = [],
  } = options;

  const spellLists = spellListId
    ? [spellListId]
    : getCharacterSpellLists(character);

  const seen = new Set<SpellId>();
  const result: Spell[] = [];

  for (const listId of spellLists) {
    const spells = getSpellsForSpellList(listId, {
      maxLevel,
      includeCantrips,
      excludeSpellIds,
    });

    for (const spell of spells) {
      if (seen.has(spell.id)) continue;
      seen.add(spell.id);
      result.push(spell);
    }
  }

  return result.sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return a.name.localeCompare(b.name);
  });
};