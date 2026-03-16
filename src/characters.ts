import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";

export type CharacterData = {
  campaignId: string | null;

  name: string;
  level: number;

  classId: string;
  speciesId: string;
  backgroundId: string;
  originFeatId: string | null;

  abilityScores: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };

  alignment: string;
  notes: string;
};

export const createCharacter = async (data: CharacterData) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be logged in to create a character.");
  }

  if (!data.name.trim()) {
    throw new Error("Character name is required.");
  }

  const docRef = await addDoc(collection(db, "characters"), {
    ownerUid: user.uid,
    campaignId: data.campaignId,

    name: data.name.trim(),
    level: data.level,

    classId: data.classId,
    speciesId: data.speciesId,
    backgroundId: data.backgroundId,
    originFeatId: data.originFeatId,

    abilityScores: data.abilityScores,

    alignment: data.alignment.trim(),
    notes: data.notes.trim(),

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};