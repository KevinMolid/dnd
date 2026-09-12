import type { LevelNumber, SpellLevel } from "../../../types";

export const rangerPreparedSpellsByLevel: Record<LevelNumber, number> = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 6,
  7: 7,
  8: 7,
  9: 9,
  10: 9,
  11: 10,
  12: 10,
  13: 11,
  14: 11,
  15: 12,
  16: 12,
  17: 14,
  18: 14,
  19: 15,
  20: 15,
};

export const rangerFavoredEnemyUsesByLevel: Record<LevelNumber, number> = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,

  5: 3,
  6: 3,
  7: 3,
  8: 3,

  9: 4,
  10: 4,
  11: 4,
  12: 4,

  13: 5,
  14: 5,
  15: 5,
  16: 5,

  17: 6,
  18: 6,
  19: 6,
  20: 6,
};

export const rangerWeaponMasteryChoicesByLevel: Record<LevelNumber, number> = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 2,
  6: 2,
  7: 2,
  8: 2,
  9: 2,
  10: 2,
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

export const rangerSpellSlotsByLevel: Record<
  LevelNumber,
  Partial<Record<SpellLevel, number>>
> = {
  1: { 1: 2 },
  2: { 1: 2 },
  3: { 1: 3 },
  4: { 1: 3 },

  5: { 1: 4, 2: 2 },
  6: { 1: 4, 2: 2 },
  7: { 1: 4, 2: 3 },
  8: { 1: 4, 2: 3 },

  9: { 1: 4, 2: 3, 3: 2 },
  10: { 1: 4, 2: 3, 3: 2 },
  11: { 1: 4, 2: 3, 3: 3 },
  12: { 1: 4, 2: 3, 3: 3 },

  13: { 1: 4, 2: 3, 3: 3, 4: 1 },
  14: { 1: 4, 2: 3, 3: 3, 4: 1 },
  15: { 1: 4, 2: 3, 3: 3, 4: 2 },
  16: { 1: 4, 2: 3, 3: 3, 4: 2 },

  17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
};

export const getRangerPreparedSpellCount = (
  level: LevelNumber,
): number => rangerPreparedSpellsByLevel[level] ?? 0;

export const getRangerSpellSlots = (
  level: LevelNumber,
): Partial<Record<SpellLevel, number>> =>
  rangerSpellSlotsByLevel[level] ?? {};

export const getRangerFavoredEnemyUses = (
  level: LevelNumber,
): number => rangerFavoredEnemyUsesByLevel[level] ?? 0;

export const getRangerWeaponMasteryChoiceCount = (
  level: LevelNumber,
): number => rangerWeaponMasteryChoicesByLevel[level] ?? 0;