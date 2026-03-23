import { itemsById } from "./data/items";
import type { EquipmentSlotId, WieldMode } from "./types";

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

  if (allowedModes.length > 0) {
    if (mode === "two-handed") {
      return ["main-hand", "off-hand"];
    }

    if (mode === "main-hand") {
      return ["main-hand"];
    }

    if (mode === "off-hand") {
      return ["off-hand"];
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

  if (allowedModes.length > 0) {
    return allowedModes.map((mode) => ({
      mode,
      label:
        mode === "main-hand"
          ? "Equip Main Hand"
          : mode === "off-hand"
            ? "Equip Off Hand"
            : "Equip Two-Handed",
    }));
  }

  return [{ label: "Equip" }];
};