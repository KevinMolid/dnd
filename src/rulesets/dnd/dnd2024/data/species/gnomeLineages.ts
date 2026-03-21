import type { GnomeLineage } from "../../types";

export const gnomeLineages: GnomeLineage[] = [
  {
    id: "forest-gnome",
    name: "Forest Gnome",
    traits: [
      {
        id: "forest-gnome-magic",
        name: "Forest Gnome Magic",
        effects: [
          {
            type: "spell",
            spellId: "Minor Illusion",
            frequency: { type: "at-will" },
          },
          {
            type: "spell",
            spellId: "Speak with Animals",
            frequency: {
              type: "limited",
              uses: { type: "proficiency-bonus" },
              recharge: "long-rest",
            },
          },
        ],
        notes: [
          "You always have Speak with Animals prepared.",
          "You can also cast it using spell slots you have of the appropriate level.",
        ],
      },
    ],
  },
  {
    id: "rock-gnome",
    name: "Rock Gnome",
    traits: [
      {
        id: "rock-gnome-magic",
        name: "Rock Gnome Magic",
        effects: [
          {
            type: "spell",
            spellId: "Mending",
            frequency: { type: "at-will" },
          },
          {
            type: "spell",
            spellId: "Prestidigitation",
            frequency: { type: "at-will" },
          },
        ],
      },
      {
        id: "rock-gnome-tinkering",
        name: "Tinker",
        effects: [
          {
            type: "text",
            text: "You can create tiny clockwork devices using Prestidigitation effects.",
          },
        ],
        notes: [
          "Devices last 8 hours.",
          "You can have up to 3 devices at a time.",
          "You can activate a device with a Bonus Action.",
        ],
      },
    ],
  },
];