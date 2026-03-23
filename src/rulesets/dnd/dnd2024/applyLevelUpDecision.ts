import type { CharacterSheetData, LevelUpDecision } from "./types";

export const applyLevelUpDecision = (
  character: CharacterSheetData,
  level: number,
  decision: Partial<LevelUpDecision>,
): CharacterSheetData => {
  const existingChoices = character.choices ?? {};
  const existingLevelUpDecisions = existingChoices.levelUpDecisions ?? {};
  const existingLevelDecision = existingLevelUpDecisions[level] ?? {};

  const mergedLevelDecision: LevelUpDecision = {
    ...existingLevelDecision,
    ...decision,
  };

  return {
    ...character,
    choices: {
      ...existingChoices,
      ...(mergedLevelDecision.subclassId
        ? { subclassId: mergedLevelDecision.subclassId }
        : {}),
      levelUpDecisions: {
        ...existingLevelUpDecisions,
        [level]: mergedLevelDecision,
      },
    },
  };
};