import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { CharacterSheetData } from "./rulesets/dnd/dnd2024/types";

type CampaignCharacterStatus = "inactive" | "active";

type CreateCharacterInput = Omit<
  CharacterSheetData,
  "ownerUid" | "createdByUid" | "createdAt" | "updatedAt"
> & {
  ownerUid?: string | null;
  createdByUid?: string | null;
  campaignStatus?: CampaignCharacterStatus;
};

export const createCharacter = async (data: CreateCharacterInput) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be logged in to create a character.");
  }

  if (!data.name.trim()) {
    throw new Error("Character name is required.");
  }

  const docRef = await addDoc(collection(db, "characters"), {
    ...data,
    ownerUid: data.ownerUid !== undefined ? data.ownerUid : user.uid,
    createdByUid:
      data.createdByUid !== undefined ? data.createdByUid : user.uid,
    campaignId: data.campaignId ?? null,
    campaignStatus: data.campaignStatus ?? "inactive",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};