import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { CampaignInviteDoc, CampaignInviteRole } from "../types/invite";

const TOKEN_LENGTH = 24;
const TOKEN_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

const generateInviteToken = (length = TOKEN_LENGTH) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  let token = "";

  for (let i = 0; i < length; i++) {
    token += TOKEN_ALPHABET[bytes[i] % TOKEN_ALPHABET.length];
  }

  return token;
};

const createUniqueInviteToken = async () => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const token = generateInviteToken();
    const inviteRef = doc(db, "campaignInvites", token);
    const existing = await getDoc(inviteRef);

    if (!existing.exists()) {
      return token;
    }
  }

  throw new Error("Failed to generate a unique invite token.");
};

type CreateInviteParams = {
  campaignId: string;
  campaignName: string;
  createdByUid: string;
  createdByName?: string;
  role?: CampaignInviteRole;
  expiresAt?: Date | null;
  maxUses?: number | null;
};

export const createInvite = async ({
  campaignId,
  campaignName,
  createdByUid,
  createdByName,
  role = "player",
  expiresAt = null,
  maxUses = null,
}: CreateInviteParams) => {
  const token = await createUniqueInviteToken();
  const inviteRef = doc(db, "campaignInvites", token);

  const inviteDoc: CampaignInviteDoc = {
    campaignId,
    campaignName,
    role,
    createdByUid,
    createdByName: createdByName ?? "",
    createdAt: serverTimestamp(),
    expiresAt: expiresAt ?? null,
    maxUses: maxUses ?? null,
    useCount: 0,
    revoked: false,
    updatedAt: serverTimestamp(),
  };

  await setDoc(inviteRef, inviteDoc);

  return {
    token,
    url: `${window.location.origin}/invite/${token}`,
  };
};