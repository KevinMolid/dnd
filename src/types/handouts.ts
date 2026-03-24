import type { Timestamp } from "firebase/firestore";

export type HandoutVisibility = "hidden" | "allPlayers" | "selectedPlayers";

export type CampaignHandoutDoc = {
  title: string;
  content: string;
  imageUrl?: string | null;

  visibility: HandoutVisibility;
  visibleToPlayerUids?: string[];

  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  createdByUid: string;
  createdByName: string;
};