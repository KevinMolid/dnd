import type { CharacterSubclass } from "../../../types";

export const circleOfTheSea: CharacterSubclass = {
  id: "circle-of-the-sea",
  name: "Circle of the Sea",
  classId: "druid",
  description:
    "Druids of the Circle of the Sea draw on the tempestuous forces of oceans and storms, embodying tides, currents, and the fury of nature.",

  spellcasting: {
    id: "circle-of-the-sea-spellcasting",
    name: "Circle of the Sea Spells",
    sourceType: "subclass",
    sourceId: "circle-of-the-sea",
    castingAbility: "wis",
    spellListId: "druid",
    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: true,
    fixedSpells: [
      {
        spellId: "fog-cloud",
        minCharacterLevel: 3,
        spellLevel: 1,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "gust-of-wind",
        minCharacterLevel: 3,
        spellLevel: 2,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "ray-of-frost",
        minCharacterLevel: 3,
        spellLevel: 0,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "shatter",
        minCharacterLevel: 3,
        spellLevel: 2,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "thunderwave",
        minCharacterLevel: 3,
        spellLevel: 1,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "lightning-bolt",
        minCharacterLevel: 5,
        spellLevel: 3,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "water-breathing",
        minCharacterLevel: 5,
        spellLevel: 3,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "control-water",
        minCharacterLevel: 7,
        spellLevel: 4,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "ice-storm",
        minCharacterLevel: 7,
        spellLevel: 4,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "conjure-elemental",
        minCharacterLevel: 9,
        spellLevel: 5,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "hold-monster",
        minCharacterLevel: 9,
        spellLevel: 5,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
    ],
    notes: [
      "These spells are always prepared and do not count against the number of spells you can prepare.",
    ],
  },

  featuresByLevel: {
    3: [
      {
        id: "circle-of-the-sea-spells",
        name: "Circle of the Sea Spells",
        level: 3,
        description:
          "The magic of your circle ensures that you always have certain spells prepared.",
        notes: [
          "Level 3: Fog Cloud, Gust of Wind, Ray of Frost, Shatter, Thunderwave",
          "Level 5: Lightning Bolt, Water Breathing",
          "Level 7: Control Water, Ice Storm",
          "Level 9: Conjure Elemental, Hold Monster",
        ],
      },
      {
        id: "wrath-of-the-sea",
        name: "Wrath of the Sea",
        level: 3,
        activation: "bonus-action",
        description:
          "You can expend a use of your Wild Shape to manifest an oceanic emanation that lashes out at your foes.",
        notes: [
          "As a Bonus Action, expend one use of your Wild Shape to create a 5-foot Emanation of ocean spray around you for 10 minutes.",
          "It ends early if you dismiss it (no action required), manifest it again, or become Incapacitated.",
          "When you manifest it and as a Bonus Action on subsequent turns, choose a creature you can see in the Emanation.",
          "The target must make a Constitution saving throw against your spell save DC.",
          "On a failure, it takes Cold damage equal to a number of d6 equal to your Wisdom modifier (minimum 1d6).",
          "If the creature is Large or smaller, it is pushed up to 15 feet away from you.",
        ],
      },
    ],

    6: [
      {
        id: "aquatic-affinity",
        name: "Aquatic Affinity",
        level: 6,
        description:
          "Your connection to the sea enhances your mobility and the reach of your oceanic power.",
        notes: [
          "The size of the Emanation created by your Wrath of the Sea increases to 10 feet.",
          "You gain a Swim Speed equal to your Speed.",
        ],
      },
    ],

    10: [
      {
        id: "stormborn",
        name: "Stormborn",
        level: 10,
        description:
          "Your bond with storms grants you flight and resistance to elemental forces.",
        notes: [
          "While Wrath of the Sea is active, you gain a Fly Speed equal to your Speed.",
          "You have Resistance to Cold, Lightning, and Thunder damage.",
        ],
      },
    ],

    14: [
      {
        id: "oceanic-gift",
        name: "Oceanic Gift",
        level: 14,
        description:
          "You can extend your oceanic power to allies, sharing the protection and force of the sea.",
        notes: [
          "Instead of manifesting Wrath of the Sea around yourself, you can manifest it around one willing creature within 60 feet.",
          "That creature gains all the benefits of the Emanation.",
          "It uses your spell save DC and Wisdom modifier.",
          "You can manifest the Emanation around both yourself and the other creature if you expend two uses of Wild Shape instead of one.",
        ],
      },
    ],
  },
};