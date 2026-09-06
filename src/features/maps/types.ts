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

  /*
   * The polygon boundary of the area.
   * These points are stored as percentages from 0–100.
   */
  markers: MapPoint[];

  /*
   * Optional custom position for the numbered area pin.
   * If omitted, the UI can calculate the center of the polygon.
   */
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

  /*
   * Current environment level for each effect.
   *
   * Example:
   * {
   *   fog: 2,
   *   corruption: 1
   * }
   */
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

  /*
   * Defines the environment systems available on this map.
   */
  environmentEffects?: EnvironmentEffect[];
};

export type CampaignMap = CampaignMapDoc & {
  id: string;
};
