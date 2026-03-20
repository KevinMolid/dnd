import type { CharacterChoices } from "./types";

export const getChosenSubclassId = (
  choices: CharacterChoices | undefined,
): string | undefined => {
  if (choices?.subclassId) return choices.subclassId;

  const decisions = choices?.levelUpDecisions;
  if (!decisions) return undefined;

  const levels = Object.keys(decisions)
    .map(Number)
    .sort((a, b) => b - a);

  for (const level of levels) {
    const subclassId = decisions[level]?.subclassId;
    if (subclassId) return subclassId;
  }

  return undefined;
};