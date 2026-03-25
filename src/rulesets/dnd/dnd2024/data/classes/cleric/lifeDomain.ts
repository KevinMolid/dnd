import type { CharacterSubclass } from "../../../types";

export const lifeDomain: CharacterSubclass = {
  id: "life-domain",
  name: "Life Domain",
  classId: "cleric",
  description:
    "The Life Domain focuses on the positive energy that helps sustain all life in the multiverse. Clerics of this domain are masters of healing, using that life force to cure many hurts.",

  featuresByLevel: {
    3: [
      {
        id: "life-domain-disciple-of-life",
        name: "Disciple of Life",
        level: 3,
        description:
          "Your healing spells become more effective, allowing you to restore additional Hit Points when you cast a healing spell with a spell slot.",
        notes: [
          "When a spell you cast with a spell slot restores Hit Points to a creature, that creature regains additional Hit Points on the turn you cast the spell.",
          "The additional Hit Points equal 2 plus the spell slot’s level.",
        ],
      },
      {
        id: "life-domain-spells",
        name: "Life Domain Spells",
        level: 3,
        description:
          "Your connection to this divine domain ensures you always have certain spells prepared when you reach specific Cleric levels.",
        notes: [
          "Level 3: Aid, Bless, Cure Wounds, Lesser Restoration",
          "Level 5: Mass Healing Word, Revivify",
          "Level 7: Aura of Life, Death Ward",
          "Level 9: Greater Restoration, Mass Cure Wounds",
          "These spells are always prepared and don’t count against the number of spells you can prepare.",
        ],
      },
      {
        id: "preserve-life",
        name: "Preserve Life",
        level: 3,
        activation: "action",
        description:
          "As a Magic action, you present your Holy Symbol and expend a use of your Channel Divinity to evoke healing energy.",
        notes: [
          "Choose Bloodied creatures within 30 feet of yourself, which can include you.",
          "Divide a number of Hit Points equal to five times your Cleric level among those creatures.",
          "This feature can restore a creature to no more than half its Hit Point maximum.",
        ],
      },
    ],
    6: [
      {
        id: "blessed-healer",
        name: "Blessed Healer",
        level: 6,
        description:
          "The healing spells you cast on others heal you as well.",
        notes: [
          "Immediately after you cast a spell with a spell slot that restores Hit Points to one or more creatures other than yourself, you regain Hit Points equal to 2 plus the spell slot’s level.",
        ],
      },
    ],
    17: [
      {
        id: "supreme-healing",
        name: "Supreme Healing",
        level: 17,
        description:
          "Your healing magic restores the greatest amount possible instead of relying on chance.",
        notes: [
          "When you would normally roll one or more dice to restore Hit Points to a creature with a spell or Channel Divinity, don’t roll those dice for the healing.",
          "Instead, use the highest number possible for each die.",
          "For example, instead of restoring 2d6 Hit Points to a creature with a spell, you restore 12.",
        ],
      },
    ],
  },
};