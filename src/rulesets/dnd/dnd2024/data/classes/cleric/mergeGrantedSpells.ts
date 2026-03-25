import type { CharacterSpell } from "../../../types";

const getSpellMergeKey = (spell: CharacterSpell): string =>
  `${spell.sourceType}:${spell.sourceId}:${spell.spellId}`;

export const mergeGrantedPreparedSpells = (
  baseSpells: CharacterSpell[],
  grantedSpells: CharacterSpell[],
): CharacterSpell[] => {
  const merged = new Map<string, CharacterSpell>();

  for (const spell of baseSpells) {
    merged.set(getSpellMergeKey(spell), spell);
  }

  for (const spell of grantedSpells) {
    const key = getSpellMergeKey(spell);
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
      countsAgainstPreparationLimit:
        existing.countsAgainstPreparationLimit &&
        spell.countsAgainstPreparationLimit,
    });
  }

  return Array.from(merged.values());
};