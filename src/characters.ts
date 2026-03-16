import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { CharacterSheetData } from "./rulesets/dnd/dnd2024/types";

export const createCharacter = async (
  data: Omit<CharacterSheetData, "ownerUid" | "createdAt" | "updatedAt">,
) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be logged in to create a character.");
  }

  if (!data.name.trim()) {
    throw new Error("Character name is required.");
  }

  const docRef = await addDoc(collection(db, "characters"), {
    ...data,
    ownerUid: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};