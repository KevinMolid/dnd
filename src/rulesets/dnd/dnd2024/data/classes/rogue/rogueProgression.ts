import type { LevelValueTable } from "../../../types";

export const rogueSneakAttackDiceByLevel: LevelValueTable<number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 4,
  8: 4,
  9: 5,
  10: 5,
  11: 6,
  12: 6,
  13: 7,
  14: 7,
  15: 8,
  16: 8,
  17: 9,
  18: 9,
  19: 10,
  20: 10,
};

export const rogueExpertiseChoicesByLevel: LevelValueTable<number> = {
  1: 2,
  6: 2,
};

export const rogueWeaponMasteryChoicesByLevel: LevelValueTable<number> = {
  1: 2,
};

export const rogueCunningStrikeMaxEffectsByLevel: LevelValueTable<number> = {
  5: 1,
  6: 1,
  7: 1,
  8: 1,
  9: 1,
  10: 1,
  11: 2,
  12: 2,
  13: 2,
  14: 2,
  15: 2,
  16: 2,
  17: 2,
  18: 2,
  19: 2,
  20: 2,
};

export const getRogueSneakAttackDice = (level: number): number => {
  return rogueSneakAttackDiceByLevel[level as keyof typeof rogueSneakAttackDiceByLevel] ?? 0;
};

export const getRogueExpertiseChoiceCount = (level: number): number => {
  if (level >= 6) return 2;
  if (level >= 1) return 2;
  return 0;
};

export const getRogueTotalExpertiseChoices = (level: number): number => {
  if (level >= 6) return 4;
  if (level >= 1) return 2;
  return 0;
};

export const getRogueWeaponMasteryChoiceCount = (level: number): number => {
  if (level >= 1) return 2;
  return 0;
};

export const getRogueCunningStrikeMaxEffects = (level: number): number => {
  if (level >= 11) return 2;
  if (level >= 5) return 1;
  return 0;
};