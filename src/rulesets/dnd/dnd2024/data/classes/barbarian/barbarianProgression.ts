import type { LevelNumber } from "../../../types";

export const barbarianRagesByLevel: Record<LevelNumber, number> = {
  1: 2,
  2: 2,
  3: 3,
  4: 3,
  5: 3,
  6: 4,
  7: 4,
  8: 4,
  9: 4,
  10: 4,
  11: 4,
  12: 5,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
  17: 6,
  18: 6,
  19: 6,
  20: 6,
};

export const barbarianRageDamageByLevel: Record<LevelNumber, number> = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 2,
  6: 2,
  7: 2,
  8: 2,
  9: 3,
  10: 3,
  11: 3,
  12: 3,
  13: 3,
  14: 3,
  15: 3,
  16: 4,
  17: 4,
  18: 4,
  19: 4,
  20: 4,
};

export const barbarianWeaponMasteriesKnownByLevel: Record<LevelNumber, number> =
  {
    1: 2,
    2: 2,
    3: 2,
    4: 3,
    5: 3,
    6: 3,
    7: 3,
    8: 3,
    9: 3,
    10: 4,
    11: 4,
    12: 4,
    13: 4,
    14: 4,
    15: 4,
    16: 4,
    17: 4,
    18: 4,
    19: 4,
    20: 4,
  };

export const getBarbarianRages = (level: LevelNumber): number =>
  barbarianRagesByLevel[level] ?? 0;

export const getBarbarianRageDamage = (level: LevelNumber): number =>
  barbarianRageDamageByLevel[level] ?? 0;

export const getBarbarianWeaponMasteriesKnown = (
  level: LevelNumber,
): number => barbarianWeaponMasteriesKnownByLevel[level] ?? 0;