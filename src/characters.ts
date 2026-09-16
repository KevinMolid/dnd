import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { CharacterSheetData } from "./rulesets/dnd/dnd2024/types";
import {
  buildPublicCampaignCharacter,
  type CharacterClaimMode,
  type CampaignCharacterStatus,
} from "./features/campaigns/utils/characterPublic";

type CreateCharacterInput = Omit<
  CharacterSheetData,
  "ownerUid" | "createdByUid" | "createdAt" | "updatedAt"
> & {
  ownerUid?: string | null;
  createdByUid?: string | null;
  campaignStatus?: CampaignCharacterStatus;
  claimMode?: CharacterClaimMode;
  claimableByUid?: string | null;
};

export const createCharacter = async (data: CreateCharacterInput) => {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be logged in to create a character.");
  if (!data.name.trim()) throw new Error("Character name is required.");

  const characterRef = doc(collection(db, "characters"));
  const ownerUid = data.ownerUid !== undefined ? data.ownerUid : user.uid;
  const createdByUid =
    data.createdByUid !== undefined ? data.createdByUid : user.uid;
  const campaignId = data.campaignId ?? null;
  const campaignStatus = data.campaignStatus ?? "inactive";

  // GM-prepared, unowned campaign characters are private/locked by default.
  const claimMode: CharacterClaimMode = ownerUid
    ? "locked"
    : data.claimMode ?? "locked";
  const claimableByUid =
    claimMode === "assigned" ? data.claimableByUid ?? null : null;

  const characterData = {
    ...data,
    ownerUid,
    createdByUid,
    campaignId,
    campaignStatus,
    claimMode,
    claimableByUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const batch = writeBatch(db);
  batch.set(characterRef, characterData);

  if (campaignId) {
    const partyRef = doc(db, "campaigns", campaignId, "party", characterRef.id);
    batch.set(partyRef, {
      ...buildPublicCampaignCharacter(characterRef.id, {
        ...characterData,
        campaignId,
      }),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
  return characterRef.id;
};
