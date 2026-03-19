import type { CharacterSheetData, LevelUpDecision } from "./types";

export const applyLevelUpDecision = (
  character: CharacterSheetData,
  level: number,
  decision: Partial<LevelUpDecision>,
): CharacterSheetData => {
  const existing = character.choices?.levelUpDecisions ?? {};

  return {
    ...character,
    choices: {
      ...character.choices,
      levelUpDecisions: {
        ...existing,
        [level]: {
          ...existing[level],
          ...decision,
        },
      },
    },
  };
};