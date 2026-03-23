import type { CharacterSheetData, SpellId, SpellLevel } from "../../../types";
import {
  circleOfTheLandSpellMap,
  type CircleOfTheLandGrantedSpell,
} from "./circleOfTheLandSpellMap";
import { getCircleOfTheLandChosenLandType } from "./getCircleOfTheLandChoice";

export type DerivedGrantedPreparedSpell = {
  spellId: SpellId;
  level: SpellLevel;
  alwaysPrepared: true;
  countsAgainstPreparationLimit: false;
  sourceType: "subclass";
  sourceId: "circle-of-the-land";
};

export type DerivedGrantedCantrip = {
  spellId: SpellId;
  level: 0;
  alwaysPrepared: true;
  countsAgainstPreparationLimit: false;
  sourceType: "subclass";
  sourceId: "circle-of-the-land";
};

export type CircleOfTheLandGrantedSpellResult = {
  grantedCantrips: DerivedGrantedCantrip[];
  grantedPreparedSpells: DerivedGrantedPreparedSpell[];
};

const isUnlockedForLevel = (
  entry: CircleOfTheLandGrantedSpell,
  level: number,
): boolean => level >= entry.minCharacterLevel;

const getChosenSubclassId = (character: CharacterSheetData): string | null => {
  return character.choices?.levelUpDecisions?.[3]?.subclassId ?? null;
};

export const getCircleOfTheLandGrantedSpells = (
  character: CharacterSheetData,
): CircleOfTheLandGrantedSpellResult => {
  if (character.classId !== "druid") {
    return { grantedCantrips: [], grantedPreparedSpells: [] };
  }

  const subclassId = getChosenSubclassId(character);
  if (subclassId !== "circle-of-the-land") {
    return { grantedCantrips: [], grantedPreparedSpells: [] };
  }

  const chosenLandType = getCircleOfTheLandChosenLandType(character);
  if (!chosenLandType) {
    return { grantedCantrips: [], grantedPreparedSpells: [] };
  }

  const unlocked = circleOfTheLandSpellMap[chosenLandType].filter((entry) =>
    isUnlockedForLevel(entry, character.level),
  );

  const grantedCantrips: DerivedGrantedCantrip[] = unlocked
    .filter((entry) => entry.spellLevel === 0)
    .map((entry) => ({
      spellId: entry.spellId,
      level: 0 as const,
      alwaysPrepared: true,
      countsAgainstPreparationLimit: false,
      sourceType: "subclass" as const,
      sourceId: "circle-of-the-land" as const,
    }));

  const grantedPreparedSpells: DerivedGrantedPreparedSpell[] = unlocked
    .filter((entry) => entry.spellLevel >= 1)
    .map((entry) => ({
      spellId: entry.spellId,
      level: entry.spellLevel as SpellLevel,
      alwaysPrepared: true,
      countsAgainstPreparationLimit: false,
      sourceType: "subclass" as const,
      sourceId: "circle-of-the-land" as const,
    }));

  return {
    grantedCantrips,
    grantedPreparedSpells,
  };
};