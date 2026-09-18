import type { EncounterTemplate } from "../../context/EncounterContext";

export type MapPoint = { x: number; y: number };
export type MapMarker = MapPoint;

export type EncounterDisposition =
  | "friendly"
  | "neutral"
  | "wary"
  | "hostile";

export type RandomEncounterType =
  | "creature"
  | "phenomenon"
  | "event"
  | "clue";

export type MapMonster = {
  monsterKey?: string;
  name: string;
  count?: number;
  disposition?: EncounterDisposition;
  notes?: string;
};

export type MapTreasure = {
  itemKey?: string;
  name: string;
  count?: number;
};

export type MapEncounterEntry = {
  id: string;
  name: string;
  description?: string;
};

export type EncounterCategoryWeights = {
  creature: number;
  phenomenon: number;
  event: number;
  clue: number;
};

export const DEFAULT_ENCOUNTER_WEIGHTS: EncounterCategoryWeights = {
  creature: 45,
  phenomenon: 25,
  event: 15,
  clue: 15,
};

export type EnvironmentLevel = { value: number; name: string };

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

  /*
   * Rich-text description stored as TipTap HTML.
   *
   * New maps and areas should use this field for descriptive prose,
   * read-aloud text, developments, captives, notes, and other
   * free-form information. Accordion sections can be used to organise
   * the content when needed.
   */
  descriptionHtml?: string;

  /*
   * Legacy description fields.
   *
   * Keep these temporarily so existing maps can be migrated into
   * descriptionHtml without losing content.
   */
  readAloud?: string;
  description?: string[];
  developments?: string[];
  captives?: string[];
  notes?: string[];

  treasure?: MapTreasure[];
  monsters?: MapMonster[];
  clues?: MapEncounterEntry[];
  phenomena?: MapEncounterEntry[];
  events?: MapEncounterEntry[];
  encounterWeights?: Partial<EncounterCategoryWeights>;
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

  /*
   * Rich-text description for the map overview.
   */
  descriptionHtml?: string;

  /*
   * Legacy overview fields. Kept temporarily for migration.
   */
  generalDescription?: string[];
  readAloud?: string;

  monsters?: MapMonster[];
  treasure?: MapTreasure[];
  clues?: MapEncounterEntry[];
  phenomena?: MapEncounterEntry[];
  events?: MapEncounterEntry[];
  encounterWeights?: Partial<EncounterCategoryWeights>;
};

export type CampaignMap = CampaignMapDoc & { id: string };