import { itemsById } from "./data/items";
import { resolveItemFromEquipmentEntry } from "./resolveItem";
import type {
  CampaignItem,
  CharacterEquipmentEntry,
  Item,
} from "./types";

const getAbilityModifier = (score: number) => Math.floor((score - 10) / 2);

const resolveEquipmentItem = (
  entry: CharacterEquipmentEntry,
  campaignItemsById: Record<string, CampaignItem>,
): Item | null => {
  if (entry.source === "campaign") {
    return resolveItemFromEquipmentEntry(entry, campaignItemsById);
  }

  return itemsById[entry.itemId] ?? null;
};

export const getCharacterArmorClassFromEquipment = ({
  dexterityScore,
  constitutionScore,
  classId,
  equipment,
  campaignItemsById = {},
}: {
  dexterityScore: number;
  constitutionScore?: number;
  classId?: string | null;
  equipment: CharacterEquipmentEntry[];
  campaignItemsById?: Record<string, CampaignItem>;
}): number => {
  const dexMod = getAbilityModifier(dexterityScore);
  const conMod = getAbilityModifier(constitutionScore ?? 10);

  const equippedItems = equipment.filter(
    (entry) => (entry.equippedSlots?.length ?? 0) > 0,
  );

  const armorEntry = equippedItems.find((entry) => {
    const item = resolveEquipmentItem(entry, campaignItemsById);
    return !!item?.armor;
  });

  const shieldEntries = equippedItems.filter((entry) => {
    const item = resolveEquipmentItem(entry, campaignItemsById);
    return !!item?.shield;
  });

  const isBarbarian = classId === "barbarian";
  const isUnarmored = !armorEntry;

  let ac = 10 + dexMod;

  if (isBarbarian && isUnarmored) {
    ac = 10 + dexMod + conMod;
  } else if (armorEntry) {
    const armorItem = resolveEquipmentItem(armorEntry, campaignItemsById);
    const armor = armorItem?.armor;

    if (armor) {
      const dexContribution =
        armor.dexCap === undefined || armor.dexCap === null
          ? dexMod
          : Math.min(dexMod, armor.dexCap);

      ac = armor.baseAc + dexContribution;
    }

    ac += armorItem?.acBonus ?? 0;
    ac += armorEntry.acBonus ?? 0;
  }

  for (const shieldEntry of shieldEntries) {
    const shieldItem = resolveEquipmentItem(
      shieldEntry,
      campaignItemsById,
    );
    const shield = shieldItem?.shield;

    if (shield) {
      ac += shield.acBonus;
    }

    ac += shieldItem?.acBonus ?? 0;
    ac += shieldEntry.acBonus ?? 0;
  }

  return ac;
};
