import type { CharacterSpell, LevelNumber } from "../../../types";
import { clericDomainSpellMap } from "./clericDomainSpellMap";
import { getChosenClericDomain, type ClericDomainId } from "./getClericDomainChoice";

export type DerivedGrantedPreparedSpell = CharacterSpell;

export const getClericDomainGrantedSpells = ({
  clericLevel,
  subclassId,
}: {
  clericLevel: LevelNumber;
  subclassId: ClericDomainId | null;
}): DerivedGrantedPreparedSpell[] => {
  if (!subclassId) return [];

  const granted = clericDomainSpellMap[subclassId] ?? [];

  return granted
    .filter((entry) => clericLevel >= entry.minClericLevel)
    .map((entry) => ({
      spellId: entry.spellId,
      level: entry.spellLevel,
      sourceType: "subclass",
      sourceId: subclassId,
      prepared: true,
      alwaysPrepared: true,
      countsAgainstPreparationLimit: false,
    }));
};

export const getClericDomainGrantedSpellsFromChoices = ({
  clericLevel,
  choices,
}: {
  clericLevel: LevelNumber;
  choices?: { subclassId?: string } | null;
}): DerivedGrantedPreparedSpell[] => {
  const subclassId = getChosenClericDomain(choices);
  return getClericDomainGrantedSpells({ clericLevel, subclassId });
};