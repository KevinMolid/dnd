import type { Species } from "../../types";

export const aasimar: Species = {
  id: "aasimar",
  name: "Aasimar",
  size: "Medium",
  speed: 30,
  languages: ["common", "celestial"],
  traits: [
    { id: "darkvision", name: "Darkvision" },
    { id: "celestial-resistance", name: "Celestial Resistance" },
    { id: "healing-hands", name: "Healing Hands" },
    { id: "light-bearer", name: "Light Bearer" },
    { id: "celestial-revelation", name: "Celestial Revelation" },
  ],
};