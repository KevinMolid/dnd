import type { LevelNumber, SpellLevel } from "../../../types";

export const warlockPreparedSpellsByLevel: Record<LevelNumber, number> = {
  1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 10,
  11: 11, 12: 11, 13: 12, 14: 12, 15: 13, 16: 13, 17: 14, 18: 14, 19: 15, 20: 15,
};

export const warlockCantripsByLevel: Record<LevelNumber, number> = {
  1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 4,
  11: 4, 12: 4, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4,
};

export const warlockInvocationsByLevel: Record<LevelNumber, number> = {
  1: 1, 2: 3, 3: 3, 4: 3, 5: 5, 6: 5, 7: 6, 8: 6, 9: 7, 10: 7,
  11: 7, 12: 8, 13: 8, 14: 8, 15: 9, 16: 9, 17: 9, 18: 10, 19: 10, 20: 10,
};

export const warlockPactMagicSlotsByLevel: Record<LevelNumber, number> = {
  1: 1, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2,
  11: 3, 12: 3, 13: 3, 14: 3, 15: 3, 16: 3, 17: 4, 18: 4, 19: 4, 20: 4,
};

export const warlockPactMagicSlotLevelByLevel: Record<LevelNumber, Exclude<SpellLevel, 0>> = {
  1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5,
  11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5,
};

export const getWarlockPreparedSpellCount = (level: LevelNumber): number => warlockPreparedSpellsByLevel[level] ?? 0;
export const getWarlockCantripCount = (level: LevelNumber): number => warlockCantripsByLevel[level] ?? 0;
export const getWarlockInvocationCount = (level: LevelNumber): number => warlockInvocationsByLevel[level] ?? 0;
export const getWarlockPactMagicSlots = (level: LevelNumber): number => warlockPactMagicSlotsByLevel[level] ?? 0;
export const getWarlockPactMagicSlotLevel = (level: LevelNumber): Exclude<SpellLevel, 0> => warlockPactMagicSlotLevelByLevel[level] ?? 1;
