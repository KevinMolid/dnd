import type { CharacterSubclass } from "../../../types";

export const circleOfTheStars: CharacterSubclass = {
  id: "circle-of-the-stars",
  name: "Circle of the Stars",
  classId: "druid",
  description:
    "Druids of the Circle of the Stars seek out the secrets hidden in the constellations, harnessing cosmic power through a star map and luminous celestial forms.",

  featuresByLevel: {
    3: [
      {
        id: "star-map",
        name: "Star Map",
        level: 3,
        description:
          "You create a star chart that serves as your Spellcasting Focus and grants you celestial magic.",
        notes: [
          "You've created a star chart as part of your heavenly studies. It is a Tiny object, and you can use it as a Spellcasting Focus for your Druid spells.",
          "You determine its form by rolling on the Star Map table or by choosing one.",
          "While holding the map, you have the Guidance and Guiding Bolt spells prepared.",
          "You can cast Guiding Bolt without expending a spell slot a number of times equal to your Wisdom modifier (minimum of once).",
          "You regain all expended uses when you finish a Long Rest.",
          "If you lose the map, you can perform a 1-hour ceremony to magically create a replacement during a Short or Long Rest. The ceremony destroys the previous map.",
          "Star Map forms: 1) A scroll bearing depictions of constellations, 2) A stone tablet with fine holes drilled through it, 3) An owlbear hide tooled with stellar symbols, 4) A collection of maps bound in an ebony cover, 5) A crystal engraved with starry patterns, 6) A glass disk etched with constellations.",
        ],
        usage: {
          type: "limited",
          uses: {
            type: "ability-modifier",
            ability: "wis",
          },
          recharge: "long-rest",
        },
      },
      {
        id: "starry-form",
        name: "Starry Form",
        level: 3,
        activation: "bonus-action",
        description:
          "You can expend a use of Wild Shape to take on a luminous starry form instead of shape-shifting.",
        notes: [
          "As a Bonus Action, you can expend a use of your Wild Shape feature to take on a starry form rather than shape-shifting.",
          "While in your starry form, you retain your game statistics, but your body becomes luminous, your joints glimmer like stars, and glowing lines connect them as on a star chart.",
          "The form sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet.",
          "The form lasts for 10 minutes.",
          "It ends early if you dismiss it (no action required), have the Incapacitated condition, or use this feature again.",
          "Whenever you assume your starry form, choose one constellation that glimmers on your body: Archer, Chalice, or Dragon.",
          "Archer: When you activate this form and as a Bonus Action on your subsequent turns while it lasts, you can make a ranged spell attack, hurling a luminous arrow at a creature within 60 feet. On a hit, the attack deals Radiant damage equal to 1d8 plus your Wisdom modifier.",
          "Chalice: Whenever you cast a spell using a spell slot that restores Hit Points to a creature or yourself, another creature or yourself within 30 feet can regain Hit Points equal to 1d8 plus your Wisdom modifier.",
          "Dragon: When you make an Intelligence or a Wisdom check or a Constitution saving throw to maintain Concentration, you can treat a roll of 9 or lower on the d20 as a 10.",
        ],
      },
    ],

    6: [
      {
        id: "cosmic-omen",
        name: "Cosmic Omen",
        level: 6,
        description:
          "Your Star Map reveals omens that let you bend fate through weal or woe.",
        notes: [
          "Whenever you finish a Long Rest, you can consult your Star Map for omens and roll a die.",
          "Until you finish your next Long Rest, you gain access to a special Reaction based on whether you rolled an even or odd number.",
          "Weal (Even): Whenever a creature you can see within 30 feet is about to make a D20 Test, you can take a Reaction to roll 1d6 and add the number rolled to the total.",
          "Woe (Odd): Whenever a creature you can see within 30 feet is about to make a D20 Test, you can take a Reaction to roll 1d6 and subtract the number rolled from the total.",
          "You can use this Reaction a number of times equal to your Wisdom modifier (minimum of once).",
          "You regain all expended uses when you finish a Long Rest.",
        ],
        usage: {
          type: "limited",
          uses: {
            type: "ability-modifier",
            ability: "wis",
          },
          recharge: "long-rest",
        },
      },
    ],

    10: [
      {
        id: "twinkling-constellations",
        name: "Twinkling Constellations",
        level: 10,
        description:
          "Your starry constellations intensify, and you can shift between them as the cosmos guide you.",
        notes: [
          "The 1d8 of the Archer and the Chalice improve to 2d8.",
          "While the Dragon constellation is active, you have a Fly Speed of 20 feet and can hover.",
          "At the start of each of your turns while in your Starry Form, you can change which constellation glimmers on your body.",
        ],
      },
    ],

    14: [
      {
        id: "full-of-stars",
        name: "Full of Stars",
        level: 14,
        description:
          "While in your Starry Form, you become partially incorporeal and harder to harm.",
        notes: [
          "While in your Starry Form, you have Resistance to Bludgeoning, Piercing, and Slashing damage.",
        ],
      },
    ],
  },
};