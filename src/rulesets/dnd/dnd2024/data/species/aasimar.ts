import type { Species } from "../../types";

export const aasimar: Species = {
  id: "aasimar",
  name: "Aasimar",
  size: "Medium",
  speed: 30,
  languages: ["common", "celestial"],

  traits: [
    {
      id: "darkvision",
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
      id: "celestial-resistance",
      name: "Celestial Resistance",
      description:
        "You have Resistance to Necrotic damage and Radiant damage.",
      effects: [
        {
          type: "resistance",
          damageType: "necrotic",
        },
        {
          type: "resistance",
          damageType: "radiant",
        },
      ],
    },

    {
      id: "healing-hands",
      name: "Healing Hands",
      description:
        "As a Magic action, you touch a creature and roll a number of d4s equal to your Proficiency Bonus. The creature regains a number of Hit Points equal to the total rolled. Once you use this trait, you can't use it again until you finish a Long Rest.",
      activation: "action",
      usage: {
        type: "limited",
        uses: {
          type: "fixed",
          value: 1,
        },
        recharge: "long-rest",
      },
    },

    {
      id: "light-bearer",
      name: "Light Bearer",
      description:
        "You know the Light cantrip. Charisma is your spellcasting ability for it.",
      effects: [
        {
          type: "spell",
          spellId: "light",
          frequency: {
            type: "at-will",
          },
        },
      ],
    },

    {
      id: "celestial-revelation",
      name: "Celestial Revelation",
      minLevel: 3,
      description:
        "When you reach character level 3, you can transform as a Bonus Action. Choose one of the Celestial Revelation options: Heavenly Wings, Inner Radiance, or Necrotic Shroud. The transformation lasts for 1 minute or until you end it as a Bonus Action. Once on each of your turns before the transformation ends, you can deal extra damage to one target when you deal damage to it with an attack or spell. The extra damage equals your Proficiency Bonus. Once you transform, you can't do so again until you finish a Long Rest.",
      activation: "bonus-action",
      usage: {
        type: "limited",
        uses: {
          type: "fixed",
          value: 1,
        },
        recharge: "long-rest",
      },
      effects: [
        {
          type: "transformation",
          activation: "bonus-action",
          duration: {
            amount: 1,
            unit: "minute",
          },
          frequency: {
            type: "limited",
            uses: {
              type: "fixed",
              value: 1,
            },
            recharge: "long-rest",
          },
        },
      ],
      notes: [
        "Heavenly Wings: You gain a Fly Speed equal to your Speed for the duration. The extra damage from Celestial Revelation is Radiant.",
        "Inner Radiance: You shed Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. At the end of each of your turns, creatures within 10 feet of you take Radiant damage equal to your Proficiency Bonus. The extra damage from Celestial Revelation is Radiant.",
        "Necrotic Shroud: When you transform, creatures within 10 feet of you must make a Charisma saving throw. On a failed save, a creature has the Frightened condition until the end of your next turn. The extra damage from Celestial Revelation is Necrotic.",
      ],
    },
  ],
};