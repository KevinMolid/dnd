import type { CharacterSubclass } from "../../../types";

export const oathOfDevotion: CharacterSubclass = {
  id: "oath-of-devotion",
  name: "Oath of Devotion",
  classId: "paladin",
  description:
    "Paladins who swear the Oath of Devotion uphold honesty, courage, compassion, honor, and duty, striving to embody the highest ideals of justice and order.",

  spellcasting: {
    id: "oath-of-devotion-spellcasting",
    name: "Oath of Devotion Spells",
    sourceType: "subclass",
    sourceId: "oath-of-devotion",
    castingAbility: "cha",
    spellListId: "paladin",
    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: false,
    fixedSpells: [
      {
        spellId: "protection-from-evil-and-good",
        minCharacterLevel: 3,
        spellLevel: 1,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "shield-of-faith",
        minCharacterLevel: 3,
        spellLevel: 1,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "aid",
        minCharacterLevel: 5,
        spellLevel: 2,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "zone-of-truth",
        minCharacterLevel: 5,
        spellLevel: 2,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "beacon-of-hope",
        minCharacterLevel: 9,
        spellLevel: 3,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "dispel-magic",
        minCharacterLevel: 9,
        spellLevel: 3,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "freedom-of-movement",
        minCharacterLevel: 13,
        spellLevel: 4,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "guardian-of-faith",
        minCharacterLevel: 13,
        spellLevel: 4,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "commune",
        minCharacterLevel: 17,
        spellLevel: 5,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "flame-strike",
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
        id: "oath-of-devotion-tenets",
        name: "Oath of Devotion",
        level: 3,
        description:
          "You swear the Oath of Devotion, binding yourself to the ideals of justice and order.",
        notes: [
          "The tenets of the oath are Honesty, Courage, Compassion, Honor, and Duty.",
          "Let your word be your promise.",
          "Protect the weak and never fear to act.",
          "Let your honorable deeds be an example.",
        ],
      },
      {
        id: "oath-of-devotion-spells",
        name: "Oath of Devotion Spells",
        level: 3,
        description:
          "The magic of your oath ensures that you always have certain spells prepared.",
        notes: [
          "These spells are always prepared and do not count against the number of spells you can prepare.",
          "Paladin Level 3: Protection from Evil and Good, Shield of Faith",
          "Paladin Level 5: Aid, Zone of Truth",
          "Paladin Level 9: Beacon of Hope, Dispel Magic",
          "Paladin Level 13: Freedom of Movement, Guardian of Faith",
          "Paladin Level 17: Commune, Flame Strike",
        ],
      },
      {
        id: "sacred-weapon",
        name: "Sacred Weapon",
        level: 3,
        activation: "bonus-action",
        description:
          "When you take the Attack action, you can expend one use of your Channel Divinity to imbue one Melee weapon you are holding with positive energy.",
        notes: [
          "The effect lasts for 10 minutes or until you use this feature again.",
          "You add your Charisma modifier to attack rolls you make with that weapon, minimum bonus of +1.",
          "Each time you hit with it, you can cause it to deal Radiant damage instead of its normal damage type.",
          "The weapon emits Bright Light in a 20-foot radius and Dim Light for 20 feet beyond that.",
          "You can end this effect early with no action required.",
          "This effect also ends if you are not carrying the weapon.",
        ],
      },
    ],
    7: [
      {
        id: "aura-of-devotion",
        name: "Aura of Devotion",
        level: 7,
        description:
          "You and your allies have Immunity to the Charmed condition while in your Aura of Protection.",
        notes: [
          "If a Charmed ally enters your Aura of Protection, that condition has no effect on that ally while there.",
        ],
      },
    ],
    15: [
      {
        id: "smite-of-protection",
        name: "Smite of Protection",
        level: 15,
        description: "Your magical smite now radiates protective energy.",
        notes: [
          "Whenever you cast Divine Smite, you and your allies have Half Cover while in your Aura of Protection.",
          "The aura has this benefit until the start of your next turn.",
        ],
      },
    ],
    20: [
      {
        id: "holy-nimbus",
        name: "Holy Nimbus",
        level: 20,
        activation: "bonus-action",
        description:
          "You can imbue your Aura of Protection with holy power for 10 minutes.",
        notes: [
          "Once you use this feature, you can’t use it again until you finish a Long Rest.",
          "You can also restore one use of it by expending a level 5 spell slot, no action required.",
          "For the duration, you have Advantage on any saving throw you are forced to make by a Fiend or an Undead.",
          "Whenever an enemy starts its turn in the aura, that creature takes Radiant damage equal to your Charisma modifier plus your Proficiency Bonus.",
          "The aura is filled with Bright Light that is sunlight.",
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