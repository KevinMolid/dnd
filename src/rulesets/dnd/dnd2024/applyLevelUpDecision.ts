import type { CharacterSheetData, LevelUpDecision } from "./types";

export const applyLevelUpDecision = (
  character: CharacterSheetData,
  level: number,
  decision: Partial<LevelUpDecision>,
): CharacterSheetData => {
  const existingChoices = character.choices ?? {};
  const existingLevelUpDecisions = existingChoices.levelUpDecisions ?? {};
  const existingLevelDecision = existingLevelUpDecisions[level] ?? {};

  return {
    ...character,
    choices: {
      ...existingChoices,
      levelUpDecisions: {
        ...existingLevelUpDecisions,
        [level]: {
          ...existingLevelDecision,
          ...decision,
        },
      },
    },
  };
};