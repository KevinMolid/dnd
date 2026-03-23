import { itemsById } from "./dnd2024/data/items";
import type { CharacterEquipmentEntry } from "./dnd2024/types";

type RawResolvedItem = {
  id: string;
  name: string;
  quantity: number;
};

const makeInstanceId = (itemId: string, index: number) =>
  `${itemId}__${index + 1}`;

export const splitResolvedEquipmentIntoEntries = (
  items: RawResolvedItem[],
): CharacterEquipmentEntry[] => {
  const result: CharacterEquipmentEntry[] = [];

  for (const item of items) {
    const itemDef = itemsById[item.id];
    const isEquippable = !!itemDef?.equippable;
    const isStackable = !!itemDef?.stackable;

    if (isEquippable || !isStackable) {
      for (let i = 0; i < item.quantity; i += 1) {
        result.push({
          instanceId: makeInstanceId(item.id, i),
          itemId: item.id,
          name: item.name,
          quantity: 1,
          equipped: false,
          equippedSlots: [],
        });
      }
      continue;
    }

    result.push({
      instanceId: makeInstanceId(item.id, 0),
      itemId: item.id,
      name: item.name,
      quantity: item.quantity,
      equipped: false,
      equippedSlots: [],
    });
  }

  return result;
};