import type { CharacterSubclass } from "../../../types";

export const oathOfVengeance: CharacterSubclass = {
  id: "oath-of-vengeance",
  name: "Oath of Vengeance",
  classId: "paladin",
  description:
    "Paladins who swear the Oath of Vengeance are devoted to punishing grievous evil and pursuing justice without mercy.",

  spellcasting: {
    id: "oath-of-vengeance-spellcasting",
    name: "Oath of Vengeance Spells",
    sourceType: "subclass",
    sourceId: "oath-of-vengeance",
    castingAbility: "cha",
    spellListId: "paladin",
    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: false,
    fixedSpells: [
      {
        spellId: "bane",
        minCharacterLevel: 3,
        spellLevel: 1,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "hunters-mark",
        minCharacterLevel: 3,
        spellLevel: 1,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "hold-person",
        minCharacterLevel: 5,
        spellLevel: 2,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "misty-step",
        minCharacterLevel: 5,
        spellLevel: 2,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "haste",
        minCharacterLevel: 9,
        spellLevel: 3,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "protection-from-energy",
        minCharacterLevel: 9,
        spellLevel: 3,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "banishment",
        minCharacterLevel: 13,
        spellLevel: 4,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "dimension-door",
        minCharacterLevel: 13,
        spellLevel: 4,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "hold-monster",
        minCharacterLevel: 17,
        spellLevel: 5,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "scrying",
        minCharacterLevel: 17,
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
        id: "oath-of-vengeance-tenets",
        name: "Oath of Vengeance",
        level: 3,
        description:
          "You swear the Oath of Vengeance, dedicating yourself to punishing those who commit grievous evil.",
        notes: [
          "Show the wicked no mercy.",
          "Fight injustice and its causes.",
          "Aid those harmed by injustice.",
        ],
      },
      {
        id: "oath-of-vengeance-spells",
        name: "Oath of Vengeance Spells",
        level: 3,
        description:
          "The magic of your oath ensures that you always have certain spells prepared.",
        notes: [
          "These spells are always prepared and do not count against the number of spells you can prepare.",
          "Paladin Level 3: Bane, Hunter's Mark",
          "Paladin Level 5: Hold Person, Misty Step",
          "Paladin Level 9: Haste, Protection from Energy",
          "Paladin Level 13: Banishment, Dimension Door",
          "Paladin Level 17: Hold Monster, Scrying",
        ],
      },
      {
        id: "vow-of-enmity",
        name: "Vow of Enmity",
        level: 3,
        description:
          "When you take the Attack action, you can expend one use of your Channel Divinity to utter a vow of enmity against a creature you can see within 30 feet of yourself.",
        notes: [
          "You have Advantage on attack rolls against the creature for 1 minute or until you use this feature again.",
          "If the creature drops to 0 Hit Points before the vow ends, you can transfer the vow to a different creature within 30 feet of yourself, no action required.",
        ],
      },
    ],

    7: [
      {
        id: "relentless-avenger",
        name: "Relentless Avenger",
        level: 7,
        description:
          "Your supernatural focus helps you close off a foe's retreat.",
        notes: [
          "When you hit a creature with an Opportunity Attack, you can reduce the creature's Speed to 0 until the end of the current turn.",
          "You can then move up to half your Speed as part of the same Reaction.",
          "This movement doesn't provoke Opportunity Attacks.",
        ],
      },
    ],

    15: [
      {
        id: "soul-of-vengeance",
        name: "Soul of Vengeance",
        level: 15,
        description:
          "Immediately after a creature under the effect of your Vow of Enmity hits or misses with an attack roll, you can take a Reaction to make a melee attack against that creature if it's within range.",
        notes: [],
      },
    ],

    20: [
      {
        id: "avenging-angel",
        name: "Avenging Angel",
        level: 20,
        activation: "bonus-action",
        description:
          "You manifest spectral wings and a terrifying presence for 10 minutes.",
        notes: [
          "Once you use this feature, you can't use it again until you finish a Long Rest.",
          "You can also restore one use of it by expending a level 5 spell slot, no action required.",
          "Flight. You have a Fly Speed of 60 feet and can hover.",
          "Frightful Aura. Whenever an enemy starts its turn in your Aura of Protection, that creature must succeed on a Wisdom saving throw or have the Frightened condition for 1 minute or until it takes any damage.",
          "Attack rolls against the Frightened creature have Advantage.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
      },
    ],
  },
};