import { itemsById } from "./data/items";
import type {
  CharacterEquipmentEntry,
  EquippableConfig,
  EquipmentSlotId,
  Item,
  WieldMode,
} from "./types";

const getHandSlotsForEquippable = (
  equippable: EquippableConfig,
): {
  main: EquipmentSlotId;
  off: EquipmentSlotId;
  twoHanded: EquipmentSlotId[];
} => {
  if (equippable.slotProfile === "ranged-weapon") {
    return {
      main: "ranged-main-hand",
      off: "ranged-off-hand",
      twoHanded: ["ranged-main-hand", "ranged-off-hand"],
    };
  }

  return {
    main: "main-hand",
    off: "off-hand",
    twoHanded: ["main-hand", "off-hand"],
  };
};

export const isItemEquippable = (item: Pick<Item, "equippable"> | null | undefined): boolean => {
  return Boolean(item?.equippable);
};

export const getOccupiedSlotsForEquip = (
  item: Pick<Item, "equippable"> | null | undefined,
  mode?: WieldMode,
): EquipmentSlotId[] => {
  const equippable = item?.equippable;

  if (!equippable) return [];

  const allowedModes = equippable.allowedWieldModes ?? [];
  const handSlots = getHandSlotsForEquippable(equippable);

  if (allowedModes.length > 0) {
    if (!mode || !allowedModes.includes(mode)) return [];

    if (mode === "two-handed") return handSlots.twoHanded;
    if (mode === "main-hand") return [handSlots.main];
    if (mode === "off-hand") return [handSlots.off];
  }

  return equippable.slots;
};

export const getEquipActionsForItem = (
  item: Pick<Item, "equippable"> | null | undefined,
): Array<{ label: string; mode?: WieldMode }> => {
  const equippable = item?.equippable;

  if (!equippable) return [];

  const allowedModes = equippable.allowedWieldModes ?? [];
  const isRangedProfile = equippable.slotProfile === "ranged-weapon";

  if (allowedModes.length > 0) {
    return allowedModes.map((mode) => ({
      mode,
      label:
        mode === "main-hand"
          ? isRangedProfile
            ? "Equip Ranged Main Hand"
            : "Equip Main Hand"
          : mode === "off-hand"
            ? isRangedProfile
              ? "Equip Ranged Off Hand"
              : "Equip Off Hand"
            : isRangedProfile
              ? "Equip Ranged Two-Handed"
              : "Equip Two-Handed",
    }));
  }

  return [{ label: "Equip" }];
};

/**
 * Migrates old saved "body" slots without making "body" visible as a new slot.
 * Armor becomes "armor"; clothing becomes "clothing".
 *
 * Campaign entries that reference a base rules item can still be normalized
 * here without needing campaign item data. Fully custom campaign items should
 * already be saved using current slot IDs.
 */
export const normalizeLegacyBodySlot = (
  entry: CharacterEquipmentEntry,
): CharacterEquipmentEntry => {
  if (!entry.equippedSlots?.includes("body")) {
    return entry;
  }

  const itemId = entry.source === "campaign" ? entry.baseItemId : entry.itemId;
  const item = itemId ? itemsById[itemId] : undefined;

  const replacement: EquipmentSlotId =
    item?.category === "clothing" ? "clothing" : "armor";

  return {
    ...entry,
    equippedSlots: entry.equippedSlots.map((slot) =>
      slot === "body" ? replacement : slot,
    ),
  };
};
