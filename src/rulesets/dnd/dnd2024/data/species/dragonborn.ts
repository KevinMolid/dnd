import type { Species } from "../../types";

export const dragonborn: Species = {
  id: "dragonborn",
  name: "Dragonborn",
  size: "Medium",
  speed: 30,
  languages: ["common", "draconic"],
  traits: [
    { id: "draconic-ancestry", name: "Draconic Ancestry" },
    { id: "breath-weapon", name: "Breath Weapon" },
    { id: "damage-resistance", name: "Damage Resistance" },
    { id: "darkvision", name: "Darkvision" },
    { id: "draconic-flight", name: "Draconic Flight" },
  ],
};