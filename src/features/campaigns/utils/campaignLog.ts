import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";

export type CampaignLogEntryType =
  | "xp_awarded"
  | "level_up"
  | "inspiration_gained"
  | "inspiration_used"
  | "item_received"
  | "gold_received"
  | "character_activated"
  | "character_deactivated"
  | "enemy_defeated"
  | "character_died"
  | "milestone";

export type CampaignLogEntry = {
  type: CampaignLogEntryType;
  createdAt: ReturnType<typeof serverTimestamp>;
  createdByUid: string | null;
  characterId: string | null;
  characterName: string | null;
  payload: Record<string, unknown>;
};

export type AddLogEntryInput = {
  campaignId: string;
  type: CampaignLogEntryType;
  createdByUid?: string | null;
  characterId?: string | null;
  characterName?: string | null;
  payload?: Record<string, unknown>;
};

export const addLogEntry = async ({
  campaignId,
  type,
  createdByUid = null,
  characterId = null,
  characterName = null,
  payload = {},
}: AddLogEntryInput) => {
  if (!campaignId) {
    throw new Error("Missing campaignId when creating log entry.");
  }

  const entry: CampaignLogEntry = {
    type,
    createdAt: serverTimestamp(),
    createdByUid,
    characterId,
    characterName,
    payload,
  };

  await addDoc(collection(db, "campaigns", campaignId, "logEntries"), entry);
};