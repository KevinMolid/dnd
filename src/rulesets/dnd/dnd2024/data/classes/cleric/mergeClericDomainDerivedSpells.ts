import type { CharacterSheetData, CharacterSpell, LevelNumber } from "../../../types";
import { getClericDomainGrantedSpellsFromChoices } from "./getClericDomainGrantedSpells";

const getSpellKey = (spell: CharacterSpell): string =>
  `${spell.sourceType}:${spell.sourceId}:${spell.spellId}:${spell.level ?? "x"}`;

export const mergeClericDomainDerivedSpells = (
  character: CharacterSheetData,
  existingSpells: CharacterSpell[],
): CharacterSpell[] => {
  if (character.classId !== "cleric") {
    return existingSpells;
  }

  const grantedSpells = getClericDomainGrantedSpellsFromChoices({
    clericLevel: character.level as LevelNumber,
    choices: character.choices,
  });

  if (grantedSpells.length === 0) {
    return existingSpells;
  }

  const merged = new Map<string, CharacterSpell>();

  for (const spell of existingSpells) {
    merged.set(getSpellKey(spell), spell);
  }

  for (const spell of grantedSpells) {
    const key = getSpellKey(spell);
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, spell);
      continue;
    }

    merged.set(key, {
      ...existing,
      ...spell,
      prepared: existing.prepared || spell.prepared,
      alwaysPrepared: existing.alwaysPrepared || spell.alwaysPrepared,
      known: existing.known || spell.known,
      inSpellbook: existing.inSpellbook || spell.inSpellbook,
      countsAgainstPreparationLimit:
        (existing.countsAgainstPreparationLimit ?? true) &&
        (spell.countsAgainstPreparationLimit ?? true),
      countsAgainstKnownLimit:
        (existing.countsAgainstKnownLimit ?? true) &&
        (spell.countsAgainstKnownLimit ?? true),
    });
  }

  return Array.from(merged.values());
};