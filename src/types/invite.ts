export type CampaignInviteRole = "player";

export type CampaignInviteDoc = {
  campaignId: string;
  campaignName: string;
  role: CampaignInviteRole;
  createdByUid: string;
  createdByName?: string;
  createdAt: unknown;
  expiresAt: unknown | null;
  maxUses: number | null;
  useCount: number;
  revoked: boolean;
  updatedAt: unknown;
};