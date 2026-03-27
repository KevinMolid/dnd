import type { Timestamp } from "firebase/firestore";

export type EncounterTemplateMonster = {
  id: string;
  monsterId: string;
  quantity: number;
  customName?: string;
};

export type EncounterTemplate = {
  id: string;
  name: string;
  monsters: EncounterTemplateMonster[];
  createdAt: number;
  updatedAt: number;
};

export type EncounterTemplateMonsterRow = {
  id: string;
  monsterId: string;
  quantity: number;
  customName?: string;
};

export type CampaignEncounterTemplateDoc = {
  name: string;
  monsters: EncounterTemplateMonsterRow[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdByUid: string;
  updatedByUid: string;
};