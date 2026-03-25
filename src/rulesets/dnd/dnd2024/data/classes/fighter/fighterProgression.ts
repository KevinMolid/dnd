import type { LevelNumber } from "../../../types";

export const fighterSecondWindUsesByLevel: Record<LevelNumber, number> = {
  1: 2,
  2: 2,
  3: 2,
  4: 3,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
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

export const fighterWeaponMasteriesKnownByLevel: Record<LevelNumber, number> = {
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
  16: 6,
  17: 6,
  18: 6,
  19: 6,
  20: 6,
};

export const getFighterSecondWindUses = (level: LevelNumber): number =>
  fighterSecondWindUsesByLevel[level] ?? 0;

export const getFighterWeaponMasteriesKnown = (
  level: LevelNumber,
): number => fighterWeaponMasteriesKnownByLevel[level] ?? 0;