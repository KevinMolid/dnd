import type { GnomeLineage } from "../../types";

export const gnomeLineages: GnomeLineage[] = [
  {
    id: "forest-gnome",
    name: "Forest Gnome",

    traits: [
      {
        id: "forest-gnome-magic",
        name: "Forest Gnome Magic",
        description:
          "You know the Minor Illusion cantrip. You also always have Speak with Animals prepared. You can cast Speak with Animals without expending a spell slot a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. You can also cast the spell using any spell slots you have of the appropriate level.",
        effects: [
          {
            type: "spell",
            spellId: "minor-illusion",
            frequency: {
              type: "at-will",
            },
          },
          {
            type: "spell",
            spellId: "speak-with-animals",
            frequency: {
              type: "limited",
              uses: {
                type: "proficiency-bonus",
              },
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
        description:
          "You know the Mending and Prestidigitation cantrips.",
        effects: [
          {
            type: "spell",
            spellId: "mending",
            frequency: {
              type: "at-will",
            },
          },
          {
            type: "spell",
            spellId: "prestidigitation",
            frequency: {
              type: "at-will",
            },
          },
        ],
      },

      {
        id: "rock-gnome-tinkering",
        name: "Tinker",
        description:
          "You can use Prestidigitation to create a Tiny clockwork device. The device lasts for 8 hours, and you can have up to three such devices in existence at a time. When you create a device, choose which Prestidigitation effect it produces. A creature can activate the device with a Bonus Action to produce that effect.",
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