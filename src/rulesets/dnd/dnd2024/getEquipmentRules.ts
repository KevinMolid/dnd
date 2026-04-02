import { itemsById } from "./data/items";
import type { EquipmentSlotId, WieldMode } from "./types";

const getHandSlotsForItem = (
  itemId: string,
): {
  main: EquipmentSlotId;
  off: EquipmentSlotId;
  twoHanded: EquipmentSlotId[];
} => {
  const item = itemsById[itemId];
  const slotProfile = item?.equippable?.slotProfile ?? "default";

  if (slotProfile === "ranged-weapon") {
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

export const isItemEquippable = (itemId: string): boolean => {
  return !!itemsById[itemId]?.equippable;
};

export const getOccupiedSlotsForEquip = (
  itemId: string,
  mode?: WieldMode,
): EquipmentSlotId[] => {
  const item = itemsById[itemId];
  const equippable = item?.equippable;

  if (!equippable) return [];

  const allowedModes = equippable.allowedWieldModes ?? [];
  const handSlots = getHandSlotsForItem(itemId);

  if (allowedModes.length > 0) {
    if (mode === "two-handed") {
      return handSlots.twoHanded;
    }

    if (mode === "main-hand") {
      return [handSlots.main];
    }

    if (mode === "off-hand") {
      return [handSlots.off];
    }
  }

  return equippable.slots;
};

export const getEquipActionsForItem = (
  itemId: string,
): Array<{ label: string; mode?: WieldMode }> => {
  const item = itemsById[itemId];
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