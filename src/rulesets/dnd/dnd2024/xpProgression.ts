import type { CharacterSheetData, PendingLevelUp } from "./types";

export const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000,
};

export type XpAwardResult = {
  oldXp: number;
  newXp: number;
  oldLevel: number;
  newLevel: number;
  leveledUp: boolean;
};

export const getXpForLevel = (level: number): number => {
  const normalizedLevel = Math.max(1, Math.min(20, Math.floor(level)));
  return XP_THRESHOLDS[normalizedLevel] ?? 0;
};

export const getLevelFromXp = (xp: number): number => {
  const safeXp = Math.max(0, Math.floor(xp));
  let level = 1;

  for (let currentLevel = 1; currentLevel <= 20; currentLevel += 1) {
    if (safeXp >= getXpForLevel(currentLevel)) {
      level = currentLevel;
    }
  }

  return level;
};

export const getNextLevelXp = (level: number): number | null => {
  if (level >= 20) return null;
  return getXpForLevel(level + 1);
};

export const getXpProgressWithinLevel = (
  xp: number,
): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number | null;
  progressXp: number;
  neededXp: number;
  progressPercent: number;
} => {
  const safeXp = Math.max(0, Math.floor(xp));
  const level = getLevelFromXp(safeXp);
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getNextLevelXp(level);

  if (nextLevelXp === null) {
    return {
      level,
      currentLevelXp,
      nextLevelXp: null,
      progressXp: 0,
      neededXp: 0,
      progressPercent: 100,
    };
  }

  const xpSpanThisLevel = nextLevelXp - currentLevelXp;
  const progressXp = safeXp - currentLevelXp;
  const neededXp = nextLevelXp - safeXp;

  const progressPercent =
    xpSpanThisLevel > 0
      ? Math.max(0, Math.min(100, (progressXp / xpSpanThisLevel) * 100))
      : 0;

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    progressXp,
    neededXp,
    progressPercent,
  };
};

export const awardXp = (
  currentXp: number,
  amount: number,
): XpAwardResult => {
  const oldXp = Math.max(0, Math.floor(currentXp));
  const gainedXp = Math.max(0, Math.floor(amount));
  const newXp = oldXp + gainedXp;

  const oldLevel = getLevelFromXp(oldXp);
  const newLevel = getLevelFromXp(newXp);

  return {
    oldXp,
    newXp,
    oldLevel,
    newLevel,
    leveledUp: newLevel > oldLevel,
  };
};

export const buildPendingLevelUp = (
  oldLevel: number,
  newLevel: number,
): PendingLevelUp | null => {
  if (newLevel <= oldLevel) return null;

  return {
    fromLevel: oldLevel,
    toLevel: newLevel,
  };
};

export const awardXpToCharacter = (
  character: CharacterSheetData,
  amount: number,
): XpAwardResult & {
  updatedCharacter: CharacterSheetData;
} => {
  const currentXp = character.xp ?? 0;
  const result = awardXp(currentXp, amount);
  const pendingLevelUp = buildPendingLevelUp(result.oldLevel, result.newLevel);

  return {
    ...result,
    updatedCharacter: {
      ...character,
      xp: result.newXp,
      level: result.newLevel,
      pendingLevelUp: pendingLevelUp ?? character.pendingLevelUp ?? null,
    },
  };
};

export const clearPendingLevelUp = (
  character: CharacterSheetData,
): CharacterSheetData => {
  return {
    ...character,
    pendingLevelUp: null,
  };
};

export const completePendingLevelUp = (
  character: CharacterSheetData,
): CharacterSheetData => {
  const pending = character.pendingLevelUp;
  if (!pending) return character;

  const completedLevels = [];
  for (let level = pending.fromLevel + 1; level <= pending.toLevel; level += 1) {
    completedLevels.push({
      level,
    });
  }

  return {
    ...character,
    pendingLevelUp: null,
    levelUpHistory: [...(character.levelUpHistory ?? []), ...completedLevels],
  };
};