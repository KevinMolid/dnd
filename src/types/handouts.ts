import type { Timestamp } from "firebase/firestore";

export type CampaignHandoutDoc = {
  title: string;
  content: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  createdByUid: string;
  createdByName: string;
};