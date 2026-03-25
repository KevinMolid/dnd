import type { CharacterSubclass } from "../../../types";

export const trickeryDomain: CharacterSubclass = {
  id: "trickery-domain",
  name: "Trickery Domain",
  classId: "cleric",
  description:
    "The Trickery Domain offers magic of deception, illusion, and stealth. Clerics of this domain are disruptive forces who use subterfuge, mischief, and cunning to challenge authority and confound their enemies.",

  featuresByLevel: {
    3: [
      {
        id: "blessing-of-the-trickster",
        name: "Blessing of the Trickster",
        level: 3,
        activation: "action",
        description:
          "As a Magic action, you can choose yourself or a willing creature within 30 feet of yourself to have Advantage on Dexterity (Stealth) checks.",
        notes: [
          "This blessing lasts until you finish a Long Rest or you use this feature again.",
        ],
      },
      {
        id: "invoke-duplicity",
        name: "Invoke Duplicity",
        level: 3,
        activation: "bonus-action",
        description:
          "As a Bonus Action, you can expend one use of your Channel Divinity to create a perfect visual illusion of yourself in an unoccupied space you can see within 30 feet of yourself.",
        notes: [
          "The illusion is intangible and doesn't occupy its space.",
          "It lasts for 1 minute.",
          "It ends early if you dismiss it (no action required) or have the Incapacitated condition.",
          "The illusion is animated and mimics your expressions and gestures.",
          "Cast Spells: You can cast spells as though you were in the illusion's space, but you must use your own senses.",
          "Distract: When both you and your illusion are within 5 feet of a creature that can see the illusion, you have Advantage on attack rolls against that target.",
          "Move: As a Bonus Action, you can move the illusion up to 30 feet to an unoccupied space you can see that is within 120 feet of yourself.",
        ],
      },
      {
        id: "trickery-domain-spells",
        name: "Trickery Domain Spells",
        level: 3,
        description:
          "Your connection to this divine domain ensures you always have certain spells prepared when you reach specific Cleric levels.",
        notes: [
          "Level 3: Charm Person, Disguise Self, Invisibility, Pass without Trace",
          "Level 5: Hypnotic Pattern, Nondetection",
          "Level 7: Confusion, Dimension Door",
          "Level 9: Dominate Person, Modify Memory",
          "These spells are always prepared and don’t count against the number of spells you can prepare.",
        ],
      },
    ],
    6: [
      {
        id: "tricksters-transposition",
        name: "Trickster’s Transposition",
        level: 6,
        description:
          "Whenever you take the Bonus Action to create or move the illusion of your Invoke Duplicity, you can teleport, swapping places with the illusion.",
      },
    ],
    17: [
      {
        id: "improved-duplicity",
        name: "Improved Duplicity",
        level: 17,
        description:
          "The illusion of your Invoke Duplicity has grown more powerful.",
        notes: [
          "Shared Distraction: When you and your allies make attack rolls against a creature within 5 feet of the illusion, the attack rolls have Advantage.",
          "Healing Illusion: When the illusion ends, you or a creature of your choice within 5 feet of it regains a number of Hit Points equal to your Cleric level.",
        ],
      },
    ],
  },
};