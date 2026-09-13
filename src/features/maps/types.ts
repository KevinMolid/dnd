import type { EncounterTemplate } from "../../context/EncounterContext";

export type MapPoint = {
  x: number;
  y: number;
};

export type MapMarker = MapPoint;

export type MapMonster = {
  name: string;
  count?: number;
  notes?: string;
  monsterKey?: string;
};

export type EnvironmentLevel = {
  value: number;
  name: string;
};

export type EnvironmentRollRange = {
  min: number;
  max: number;
  targetLevel: number;
};

export type EnvironmentEffect = {
  id: string;
  name: string;
  levels: EnvironmentLevel[];
  diceSides: number;
  rollRanges: EnvironmentRollRange[];
  maxChangePerRoll: number;
};

export type CampaignMapRoom = {
  id: number;
  name: string;
  markers: MapPoint[];
  pin?: MapPoint;
  readAloud?: string;
  description?: string[];
  developments?: string[];
  captives?: string[];
  treasure?: string[];
  monsters?: MapMonster[];
  notes?: string[];
  exits?: number[];
  encounterTemplate?: EncounterTemplate | null;
  experience?: string;
  environment?: Record<string, number>;
};

export type CampaignMapDoc = {
  title: string;
  imageUrl: string;
  rooms: CampaignMapRoom[];
  order: number;
  createdByUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  environmentEffects?: EnvironmentEffect[];
  generalDescription?: string[];
  readAloud?: string;

  /*
   * Optional monster population for the map overview itself.
   * This allows simple battle maps to function as a complete
   * encounter location without creating a dummy area.
   */
  monsters?: MapMonster[];
};

export type CampaignMap = CampaignMapDoc & {
  id: string;
};
