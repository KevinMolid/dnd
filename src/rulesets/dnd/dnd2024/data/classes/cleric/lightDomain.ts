import type { CharacterSubclass } from "../../../types";

export const lightDomain: CharacterSubclass = {
  id: "light-domain",
  name: "Light Domain",
  classId: "cleric",
  description:
    "The Light Domain emphasizes the divine power to bring about blazing fire and revelation. Clerics of this domain wield radiant power to banish darkness and pierce deception.",

  featuresByLevel: {
    3: [
      {
        id: "light-domain-spells",
        name: "Light Domain Spells",
        level: 3,
        description:
          "Your connection to this divine domain ensures you always have certain spells prepared when you reach specific Cleric levels.",
        notes: [
          "Level 3: Burning Hands, Faerie Fire, Scorching Ray, See Invisibility",
          "Level 5: Daylight, Fireball",
          "Level 7: Arcane Eye, Wall of Fire",
          "Level 9: Flame Strike, Scrying",
          "These spells are always prepared and don’t count against the number of spells you can prepare.",
        ],
      },
      {
        id: "radiance-of-the-dawn",
        name: "Radiance of the Dawn",
        level: 3,
        activation: "action",
        description:
          "As a Magic action, you present your Holy Symbol and expend a use of your Channel Divinity to emit a flash of light in a 30-foot Emanation originating from yourself.",
        notes: [
          "Any magical Darkness in that area is dispelled.",
          "Each creature of your choice in that area must make a Constitution saving throw.",
          "A creature takes Radiant damage equal to 2d10 plus your Cleric level on a failed save, or half as much damage on a successful one.",
        ],
      },
      {
        id: "warding-flare",
        name: "Warding Flare",
        level: 3,
        description:
          "When a creature that you can see within 30 feet of yourself makes an attack roll, you can take a Reaction to impose Disadvantage on the attack roll by causing light to flare before it hits or misses.",
        notes: [
          "You can use this feature a number of times equal to your Wisdom modifier.",
          "You regain all expended uses when you finish a Long Rest.",
          "Minimum of once.",
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

    6: [
      {
        id: "improved-warding-flare",
        name: "Improved Warding Flare",
        level: 6,
        description:
          "Your Warding Flare becomes more powerful and restores more quickly.",
        notes: [
          "You regain all expended uses of your Warding Flare when you finish a Short or Long Rest.",
          "Whenever you use Warding Flare, you can give the target of the triggering attack Temporary Hit Points equal to 2d6 plus your Wisdom modifier.",
        ],
      },
    ],

    17: [
      {
        id: "corona-of-light",
        name: "Corona of Light",
        level: 17,
        activation: "action",
        description:
          "As a Magic action, you can cause yourself to emit an aura of sunlight that lasts for 1 minute or until you dismiss it (no action required).",
        notes: [
          "You emit Bright Light in a 60-foot radius and Dim Light for an additional 30 feet.",
          "Enemies in the Bright Light have Disadvantage on saving throws against your Radiance of the Dawn and any spell that deals Fire or Radiant damage.",
          "You can use this feature a number of times equal to your Wisdom modifier.",
          "You regain all expended uses when you finish a Long Rest.",
          "Minimum of once.",
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
  },
};