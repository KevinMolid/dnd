import type { CharacterSheetData, CharacterSpell } from "../../../types";
import { getCircleOfTheLandGrantedSpells } from "./getCircleOfTheLandGrantedSpells";

const getSpellKey = (spell: CharacterSpell): string =>
  `${spell.spellId}:${spell.sourceType}:${spell.sourceId}`;

export const mergeCircleOfTheLandDerivedSpells = (
  character: CharacterSheetData,
  existingSpells: CharacterSpell[],
): CharacterSpell[] => {
  const { grantedCantrips, grantedPreparedSpells } =
    getCircleOfTheLandGrantedSpells(character);

  const extraSpells: CharacterSpell[] = [
    ...grantedCantrips.map((spell) => ({
      spellId: spell.spellId,
      level: spell.level,
      sourceType: spell.sourceType,
      sourceId: spell.sourceId,
      prepared: true,
      alwaysPrepared: true,
      known: true,
      countsAgainstPreparationLimit: false,
    })),
    ...grantedPreparedSpells.map((spell) => ({
      spellId: spell.spellId,
      level: spell.level,
      sourceType: spell.sourceType,
      sourceId: spell.sourceId,
      prepared: true,
      alwaysPrepared: true,
      known: true,
      countsAgainstPreparationLimit: false,
    })),
  ];

  const merged = new Map<string, CharacterSpell>();

  for (const spell of existingSpells) {
    merged.set(getSpellKey(spell), spell);
  }

  for (const spell of extraSpells) {
    const key = getSpellKey(spell);
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, spell);
      continue;
    }

    merged.set(key, {
      ...existing,
      ...spell,
      prepared: Boolean(existing.prepared || spell.prepared),
      alwaysPrepared: Boolean(existing.alwaysPrepared || spell.alwaysPrepared),
      known: Boolean(existing.known || spell.known),
      countsAgainstPreparationLimit:
        existing.countsAgainstPreparationLimit ??
        spell.countsAgainstPreparationLimit,
    });
  }

  return Array.from(merged.values()).sort(
    (a, b) =>
      (a.level ?? 0) - (b.level ?? 0) ||
      a.spellId.localeCompare(b.spellId),
  );
};