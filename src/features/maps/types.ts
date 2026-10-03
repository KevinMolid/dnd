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

export type MapNpcPlacement = {
  npcId: string;
  notes?: string;
  hidden?: boolean;
};

export type MapEncounterEntry = {
  id: string;
  name: string;
  description?: string;
};

export type MapMusicCue = {
  id: string;
  name: string;
  spotifyUrl: string;

  /**
   * Reserved for the Spotify playback integration.
   * We can populate this from spotifyUrl when playback is added.
   */
  spotifyUri?: string;
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
  linkedMapId?: string | null;
  descriptionHtml?: string;
  musicCues?: MapMusicCue[];

  /* Legacy description fields kept for migration. */
  readAloud?: string;
  description?: string[];
  developments?: string[];
  captives?: string[];
  notes?: string[];

  treasure?: MapTreasure[];
  monsters?: MapMonster[];
  npcPlacements?: MapNpcPlacement[];
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

  /**
   * Sibling order. Maps with the same parentMapId are ordered together.
   * Missing values on legacy documents are treated as a top-level map.
   */
  order: number;
  parentMapId?: string | null;

  createdByUid: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  environmentEffects?: EnvironmentEffect[];

  descriptionHtml?: string;
  musicCues?: MapMusicCue[];

  /* Legacy overview fields kept for migration. */
  generalDescription?: string[];
  readAloud?: string;

  monsters?: MapMonster[];
  npcPlacements?: MapNpcPlacement[];
  treasure?: MapTreasure[];
  clues?: MapEncounterEntry[];
  phenomena?: MapEncounterEntry[];
  events?: MapEncounterEntry[];
  encounterWeights?: Partial<EncounterCategoryWeights>;
};

export type CampaignMap = CampaignMapDoc & { id: string };
