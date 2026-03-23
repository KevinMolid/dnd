import type { EquipmentSlotId } from "../types";

export const equipmentSlotOrder: EquipmentSlotId[] = [
  "head",
  "neck",
  "body",
  "cloak",
  "hands",
  "waist",
  "feet",
  "ring-left",
  "ring-right",
  "main-hand",
  "off-hand",
];

export const equipmentSlotLabels: Record<EquipmentSlotId, string> = {
  head: "Head",
  neck: "Neck",
  body: "Body",
  cloak: "Cloak",
  hands: "Hands",
  waist: "Waist",
  feet: "Feet",
  "ring-left": "Ring (Left)",
  "ring-right": "Ring (Right)",
  "main-hand": "Main Hand",
  "off-hand": "Off Hand",
};