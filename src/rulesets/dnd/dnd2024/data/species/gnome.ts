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
      description:
        "You have Darkvision with a range of 60 feet.",
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
      description:
        "You have Advantage on Intelligence, Wisdom, and Charisma saving throws.",
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
      description:
        "Choose a lineage that represents your gnomish heritage: Forest Gnome or Rock Gnome. Your lineage grants you additional magical abilities.",
      choices: [
        {
          id: "gnomish-lineage-choice",
          name: "Gnome Lineage",
          choose: 1,
          options: [
            {
              id: "forest-gnome",
              name: "Forest Gnome",
            },
            {
              id: "rock-gnome",
              name: "Rock Gnome",
            },
          ],
        },
      ],
    },
  ],
};