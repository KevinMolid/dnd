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