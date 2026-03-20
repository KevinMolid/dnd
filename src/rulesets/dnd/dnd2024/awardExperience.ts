import {
  doc,
  runTransaction,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import { awardXpToCharacter } from "./xpProgression";
import type { CharacterSheetData } from "./types";

export type AwardExperienceResult = {
  characterId: string;
  oldXp: number;
  newXp: number;
  oldLevel: number;
  newLevel: number;
  leveledUp: boolean;
};

export const awardExperienceToCharacter = async (
  db: Firestore,
  characterId: string,
  amount: number,
): Promise<AwardExperienceResult> => {
  if (!characterId) {
    throw new Error("Missing character ID.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Experience amount must be a positive number.");
  }

  const characterRef = doc(db, "characters", characterId);

  return runTransaction(db, async (transaction) => {
    const snap = await transaction.get(characterRef);

    if (!snap.exists()) {
      throw new Error("Character not found.");
    }

    const character = snap.data() as CharacterSheetData;
    const result = awardXpToCharacter(character, amount);

    transaction.update(characterRef, {
      xp: result.updatedCharacter.xp ?? result.newXp,
      level: result.updatedCharacter.level,
      pendingLevelUp: result.updatedCharacter.pendingLevelUp ?? null,
      updatedAt: serverTimestamp(),
    });

    return {
      characterId,
      oldXp: result.oldXp,
      newXp: result.newXp,
      oldLevel: result.oldLevel,
      newLevel: result.newLevel,
      leveledUp: result.leveledUp,
    };
  });
};

export const awardExperienceToMultipleCharacters = async (
  db: Firestore,
  characterIds: string[],
  amount: number,
): Promise<AwardExperienceResult[]> => {
  const uniqueIds = [...new Set(characterIds)].filter(Boolean);

  if (uniqueIds.length === 0) {
    return [];
  }

  const results: AwardExperienceResult[] = [];

  for (const characterId of uniqueIds) {
    const result = await awardExperienceToCharacter(db, characterId, amount);
    results.push(result);
  }

  return results;
};