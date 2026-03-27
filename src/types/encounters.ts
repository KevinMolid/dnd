export type EncounterTemplateMonster = {
  id: string; // unique row id
  monsterId: string; // links to catalog
  quantity: number;
  displayName?: string; // optional rename, like "Goblin Boss"
  notes?: string;
  hpOverride?: number;
};

export type EncounterTemplateDoc = {
  campaignId: string;
  name: string;
  description?: string;
  location?: string;
  tags?: string[];
  monsters: EncounterTemplateMonster[];
  createdByUid: string;
  createdAt: unknown;
  updatedAt: unknown;
};