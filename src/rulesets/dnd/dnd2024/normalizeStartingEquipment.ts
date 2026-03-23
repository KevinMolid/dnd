import type { CharacterEquipmentEntry } from "./types";

type RawResolvedItem = {
  id: string;
  name: string;
  quantity: number;
};

export const normalizeStartingEquipment = (
  items: RawResolvedItem[],
): CharacterEquipmentEntry[] => {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    equipped: false,
    equippedSlots: [],
    wieldMode: undefined,
  }));
};