import { itemsById } from "./data/items";
import type { CharacterEquipmentEntry } from "./types";

const getAbilityModifier = (score: number) => Math.floor((score - 10) / 2);

export const getCharacterArmorClassFromEquipment = ({
  dexterityScore,
  equipment,
}: {
  dexterityScore: number;
  equipment: CharacterEquipmentEntry[];
}): number => {
  const dexMod = getAbilityModifier(dexterityScore);

  const equippedItems = equipment.filter(
    (entry) => (entry.equippedSlots?.length ?? 0) > 0,
  );

  const armorEntry = equippedItems.find((entry) => {
    const item = itemsById[entry.itemId];
    return !!item?.armor;
  });

  const shieldEntries = equippedItems.filter((entry) => {
    const item = itemsById[entry.itemId];
    return !!item?.shield;
  });

  let ac = 10 + dexMod;

  if (armorEntry) {
    const armor = itemsById[armorEntry.itemId]?.armor;
    if (armor) {
      const dexContribution =
        armor.dexCap === undefined || armor.dexCap === null
          ? dexMod
          : Math.min(dexMod, armor.dexCap);

      ac = armor.baseAc + dexContribution;
    }
  }

  for (const shieldEntry of shieldEntries) {
    const shield = itemsById[shieldEntry.itemId]?.shield;
    if (shield) {
      ac += shield.acBonus;
    }
  }

  return ac;
};