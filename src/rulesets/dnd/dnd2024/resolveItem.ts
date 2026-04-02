import { itemsById } from "./data/items";
import type { CampaignItem, CharacterEquipmentEntry, Item } from "./types";

export type ResolvedItem = Item & {
  source: "base" | "campaign";
  baseItemId: string;
  campaignItemId?: string;
  shortDescription?: string;
  gmNotes?: string;
  imageUrl?: string;
};

export const resolveCampaignItem = (
  campaignItem: CampaignItem,
): ResolvedItem | null => {
  const baseItem = itemsById[campaignItem.baseItemId];

  if (!baseItem) {
    return null;
  }

  const overrides = campaignItem.overrides ?? {};

  return {
    ...baseItem,
    ...overrides,
    id: campaignItem.id,
    source: "campaign",
    campaignItemId: campaignItem.id,
    baseItemId: campaignItem.baseItemId,
    name: campaignItem.name ?? overrides.name ?? baseItem.name,
    description:
      campaignItem.description ?? overrides.description ?? baseItem.description,
    shortDescription: campaignItem.shortDescription,
    gmNotes: campaignItem.gmNotes,
    imageUrl: campaignItem.imageUrl,
  };
};

export const resolveBaseItem = (itemId: string): ResolvedItem | null => {
  const baseItem = itemsById[itemId];

  if (!baseItem) {
    return null;
  }

  return {
    ...baseItem,
    source: "base",
    baseItemId: baseItem.id,
  };
};

export const resolveItemFromEquipmentEntry = (
  entry: CharacterEquipmentEntry,
  campaignItemsById: Record<string, CampaignItem>,
): ResolvedItem | null => {
  if (entry.source === "campaign") {
    const campaignItem = campaignItemsById[entry.campaignItemId];
    if (!campaignItem) {
      return null;
    }

    return resolveCampaignItem(campaignItem);
  }

  return resolveBaseItem(entry.itemId);
};