import type { CharacterSheetData, CharacterSpell } from "../../../types";

// Run on every derivation, not just on creation. No mutation of saved selections.
export const mergeArtificerFixedSpells = (
  character: CharacterSheetData,
  spells: CharacterSpell[],
): CharacterSpell[] => {
  if (character.classId !== "artificer" || character.level < 1) return spells;
  const withoutPreviousGrant = spells.filter(s => !(s.sourceType === "class" && s.sourceId === "artificer-tinkers-magic" && s.spellId === "mending"));
  return [...withoutPreviousGrant, {
    spellId: "mending", level: 0, sourceType: "class", sourceId: "artificer-tinkers-magic",
    known: true, prepared: true, alwaysPrepared: true,
    countsAgainstPreparationLimit: false, countsAgainstKnownLimit: false,
  }];
};
