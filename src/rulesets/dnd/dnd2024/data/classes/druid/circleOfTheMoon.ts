import type { CharacterSubclass } from "../../../types";

export const circleOfTheMoon: CharacterSubclass = {
  id: "circle-of-the-moon",
  name: "Circle of the Moon",
  classId: "druid",
  description:
    "Druids of the Circle of the Moon draw on lunar magic to transform themselves, taking on animal forms to guard the wilds and roam beneath the moon.",

  spellcasting: {
    id: "circle-of-the-moon-spellcasting",
    name: "Circle of the Moon Spells",
    sourceType: "subclass",
    sourceId: "circle-of-the-moon",
    castingAbility: "wis",
    spellListId: "druid",
    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: true,
    fixedSpells: [
      {
        spellId: "cure-wounds",
        minCharacterLevel: 3,
        spellLevel: 1,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "moonbeam",
        minCharacterLevel: 3,
        spellLevel: 2,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "starry-wisp",
        minCharacterLevel: 3,
        spellLevel: 0,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "conjure-animals",
        minCharacterLevel: 5,
        spellLevel: 3,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "fount-of-moonlight",
        minCharacterLevel: 7,
        spellLevel: 4,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "mass-cure-wounds",
        minCharacterLevel: 9,
        spellLevel: 5,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
    ],
    notes: [
      "These spells are always prepared and do not count against the number of spells you can prepare.",
      "You can cast the spells from this feature while you're in a Wild Shape form.",
    ],
  },

  featuresByLevel: {
    3: [
      {
        id: "circle-forms",
        name: "Circle Forms",
        level: 3,
        description:
          "You can channel lunar magic when you assume a Wild Shape form, granting your forms greater resilience and supernatural adaptability.",
        notes: [
          "Challenge Rating. The maximum Challenge Rating for the form equals your Druid level divided by 3 (round down).",
          "Armor Class. Until you leave the form, your AC equals 13 plus your Wisdom modifier if that total is higher than the Beast's AC.",
          "Temporary Hit Points. You gain a number of Temporary Hit Points equal to three times your Druid level.",
        ],
      },
      {
        id: "circle-of-the-moon-spells",
        name: "Circle of the Moon Spells",
        level: 3,
        description:
          "The magic of your circle ensures that you always have certain spells prepared, and you can cast them while in Wild Shape.",
        notes: [
          "Level 3: Cure Wounds, Moonbeam, Starry Wisp",
          "Level 5: Conjure Animals",
          "Level 7: Fount of Moonlight",
          "Level 9: Mass Cure Wounds",
          "You always have these spells prepared.",
          "These spells don't count against the number of spells you can prepare.",
          "You can cast the spells from this feature while you're in a Wild Shape form.",
        ],
      },
    ],

    6: [
      {
        id: "improved-circle-forms",
        name: "Improved Circle Forms",
        level: 6,
        description:
          "Your Wild Shape forms are empowered by moonlight, letting your attacks blaze with lunar radiance and your body resist hostile magic.",
        notes: [
          "Lunar Radiance. Each of your attacks in a Wild Shape form can deal its normal damage type or Radiant damage. You make this choice each time you hit with those attacks.",
          "Increased Toughness. You can add your Wisdom modifier to your Constitution saving throws.",
        ],
      },
    ],

    10: [
      {
        id: "moonlight-step",
        name: "Moonlight Step",
        level: 10,
        activation: "bonus-action",
        description:
          "You magically transport yourself in a burst of moonlight, gaining a sudden surge of accuracy.",
        notes: [
          "As a Bonus Action, you teleport up to 30 feet to an unoccupied space you can see.",
          "You have Advantage on the next attack roll you make before the end of this turn.",
          "You can use this feature a number of times equal to your Wisdom modifier (minimum of once).",
          "You regain all expended uses when you finish a Long Rest.",
          "You can also regain uses by expending a level 2+ spell slot for each use you want to restore (no action required).",
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

    14: [
      {
        id: "lunar-form",
        name: "Lunar Form",
        level: 14,
        description:
          "The power of the moon suffuses you, heightening your lunar strikes and allowing your moonlight to carry others with you.",
        notes: [
          "Improved Lunar Radiance. Once per turn, you can deal an extra 2d10 Radiant damage to a target you hit with a Wild Shape form's attack.",
          "Shared Moonlight. Whenever you use your Moonlight Step, you can also teleport one willing creature.",
          "That creature must be within 10 feet of you, and you teleport it to an unoccupied space you can see within 10 feet of your destination space.",
        ],
      },
    ],
  },
};