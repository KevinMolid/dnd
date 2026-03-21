import type { LevelNumber, SpellLevel } from "../../../types";

export const paladinPreparedSpellsByLevel: Record<LevelNumber, number> = {
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

export const paladinChannelDivinityUsesByLevel: Record<LevelNumber, number> = {
  1: 0,
  2: 0,
  3: 2,
  4: 2,
  5: 2,
  6: 2,
  7: 2,
  8: 2,
  9: 2,
  10: 2,
  11: 3,
  12: 3,
  13: 3,
  14: 3,
  15: 3,
  16: 3,
  17: 3,
  18: 3,
  19: 3,
  20: 3,
};

export const paladinWeaponMasteryChoicesByLevel: Record<LevelNumber, number> = {
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

export const paladinSpellSlotsByLevel: Record<
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

export const getPaladinPreparedSpellCount = (level: LevelNumber): number =>
  paladinPreparedSpellsByLevel[level] ?? 0;

export const getPaladinSpellSlots = (
  level: LevelNumber,
): Partial<Record<SpellLevel, number>> => paladinSpellSlotsByLevel[level] ?? {};

export const getPaladinChannelDivinityUses = (level: LevelNumber): number =>
  paladinChannelDivinityUsesByLevel[level] ?? 0;

export const getPaladinWeaponMasteryChoiceCount = (level: LevelNumber): number =>
  paladinWeaponMasteryChoicesByLevel[level] ?? 0;