export type CampaignRole = "gm" | "co-gm" | "player";

export type CampaignSystem = "dnd2024" | "dnd5e" | "pathfinder2e" | "custom";

export type CampaignDoc = {
  name: string;
  system: CampaignSystem;
  systemLabel?: string;
  description?: string;
  visibility: "private" | "public";
  ownerUid: string;
  createdByUid: string;
  createdByName?: string;
  createdAt: unknown;
  updatedAt: unknown;
  archived?: boolean;
};

export type CampaignMemberDoc = {
  uid: string;
  displayName?: string;
  email?: string;
  role: CampaignRole;
  joinedAt: unknown;
};