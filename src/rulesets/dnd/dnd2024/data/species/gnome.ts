import type { Species } from "../../types";

export const gnome: Species = {
  id: "gnome",
  name: "Gnome",
  size: "Small",
  speed: 30,
  languages: ["common", "gnomish"],
  traits: [
    {
      id: "gnome-darkvision",
      name: "Darkvision",
      effects: [
        {
          type: "sense",
          sense: "darkvision",
          range: 60,
        },
      ],
    },
    {
      id: "gnomish-cunning",
      name: "Gnomish Cunning",
      effects: [
        {
          type: "advantage-on-saving-throws",
          abilities: ["int", "wis", "cha"],
        },
      ],
    },
    {
      id: "gnomish-lineage",
      name: "Gnomish Lineage",
      choices: [
        {
          id: "gnomish-lineage-choice",
          name: "Gnome Lineage",
          choose: 1,
          options: [
            { id: "forest-gnome", name: "Forest Gnome" },
            { id: "rock-gnome", name: "Rock Gnome" },
          ],
        },
      ],
    },
  ],
};