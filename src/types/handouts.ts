import type { Timestamp } from "firebase/firestore";

export type CampaignHandoutDoc = {
  title: string;
  content: string;
  imageUrl?: string | null;
  imagePath?: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  createdByUid: string;
  createdByName: string;
};