import type { LevelNumber, SpellLevel } from "../../../types";

export const clericPreparedSpellsByLevel: Record<LevelNumber, number> = {
  1: 4,
  2: 5,
  3: 6,
  4: 7,
  5: 9,
  6: 10,
  7: 11,
  8: 12,
  9: 14,
  10: 15,
  11: 16,
  12: 16,
  13: 17,
  14: 17,
  15: 18,
  16: 18,
  17: 19,
  18: 20,
  19: 21,
  20: 22,
};

export const clericCantripsKnownByLevel: Record<LevelNumber, number> = {
  1: 3,
  2: 3,
  3: 3,
  4: 4,
  5: 4,
  6: 4,
  7: 4,
  8: 4,
  9: 4,
  10: 5,
  11: 5,
  12: 5,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
  17: 5,
  18: 5,
  19: 5,
  20: 5,
};

export const clericChannelDivinityUsesByLevel: Record<LevelNumber, number> = {
  1: 0,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 3,
  10: 3,
  11: 3,
  12: 3,
  13: 3,
  14: 3,
  15: 3,
  16: 3,
  17: 3,
  18: 4,
  19: 4,
  20: 4,
};

export const clericSpellSlotsByLevel: Record<
  LevelNumber,
  Partial<Record<SpellLevel, number>>
> = {
  1: { 1: 2 },
  2: { 1: 3 },
  3: { 1: 4, 2: 2 },
  4: { 1: 4, 2: 3 },
  5: { 1: 4, 2: 3, 3: 2 },
  6: { 1: 4, 2: 3, 3: 3 },
  7: { 1: 4, 2: 3, 3: 3, 4: 1 },
  8: { 1: 4, 2: 3, 3: 3, 4: 2 },
  9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
  13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
  15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
  17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
  18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
  19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
  20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
};

export const getClericPreparedSpellCount = (level: LevelNumber): number =>
  clericPreparedSpellsByLevel[level] ?? 0;

export const getClericCantripsKnown = (level: LevelNumber): number =>
  clericCantripsKnownByLevel[level] ?? 0;

export const getClericChannelDivinityUses = (level: LevelNumber): number =>
  clericChannelDivinityUsesByLevel[level] ?? 0;

export const getClericSpellSlots = (
  level: LevelNumber,
): Partial<Record<SpellLevel, number>> => clericSpellSlotsByLevel[level] ?? {};