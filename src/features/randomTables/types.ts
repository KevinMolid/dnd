export type RandomTableKind =
  | "encounter";

export type RandomEncounterEntryType =
  | "combat"
  | "event";

export type RandomEncounterMonster = {
  id: string;

  /**
   * Examples:
   *
   * default:dire-wolf
   * campaign:abc123
   */
  monsterKey: string;

  /**
   * Examples:
   *
   * 1
   * 2
   * 1d4
   * 1d3+1
   */
  quantityExpression: string;

  /**
   * Optional name to use conceptually in the table.
   * The Encounter tracker still gets the actual
   * monster definition.
   */
  displayName?: string;
};

export type RandomEncounterEntry = {
  id: string;

  name: string;

  /**
   * Relative chance compared to other entries.
   *
   * Example:
   * weight 4 is twice as likely as weight 2.
   */
  weight: number;

  type: RandomEncounterEntryType;

  description?: string;

  monsters?: RandomEncounterMonster[];
};

export type CampaignRandomTableDoc = {
  name: string;

  description?: string;

  kind: RandomTableKind;

  /**
   * Optional room/location names.
   *
   * For now these intentionally use text rather than
   * map IDs so the engine isn't tightly coupled to
   * a particular map.
   */
  locationNames?: string[];

  entries: RandomEncounterEntry[];

  createdByUid: string;

  updatedByUid: string;

  createdAt?: unknown;

  updatedAt?: unknown;
};

export type CampaignRandomTable =
  CampaignRandomTableDoc & {
    id: string;
  };

export type DiceRollResult = {
  expression: string;

  total: number;

  rolls: number[];

  modifier: number;
};

export type RolledEncounterMonster = {
  monsterKey: string;

  displayName?: string;

  quantityExpression: string;

  quantity: number;

  rolls: number[];
};

export type RolledRandomEncounter = {
  entryId: string;

  entryName: string;

  entryType: RandomEncounterEntryType;

  description?: string;

  /**
   * Position inside the total weighted range.
   */
  weightedRoll: number;

  totalWeight: number;

  monsters: RolledEncounterMonster[];
};