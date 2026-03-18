import type { EncounterTemplate } from "../../context/EncounterContext";

export type MapMarker = {
  x: number;
  y: number;
};

export type MapMonster = {
  name: string;
  count?: number;
  notes?: string;
};

export type CampaignMapRoom = {
  id: number;
  name: string;
  markers: { x: number; y: number }[];
  readAloud?: string;
  description?: string[];
  developments?: string[];
  captives?: string[];
  treasure?: string[];
  monsters?: { name: string; count?: number; notes?: string }[];
  notes?: string[];
  exits?: number[];
  encounterTemplate?: EncounterTemplate | null;
  experience?: string;
};

export type CampaignMapDoc = {
  title: string;
  imageUrl: string;
  rooms: CampaignMapRoom[];
  order: number;
  createdByUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type CampaignMap = CampaignMapDoc & {
  id: string;
};