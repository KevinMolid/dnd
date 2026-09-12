import type { CharacterSubclass } from "../../../types";

export const gloomStalker: CharacterSubclass = {
  id: "gloom-stalker",
  name: "Gloom Stalker",
  classId: "ranger",

  description:
    "Gloom Stalkers thrive in darkness, ambushing enemies with supernatural speed and drawing on shadow magic to evade detection.",

  spellcasting: {
    id: "gloom-stalker-spellcasting",
    name: "Gloom Stalker Spells",

    sourceType: "subclass",
    sourceId: "gloom-stalker",

    castingAbility: "wis",
    spellListId: "ranger",

    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: false,

    fixedSpells: [
      {
        spellId: "disguise-self",
        minCharacterLevel: 3,
        spellLevel: 1,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "rope-trick",
        minCharacterLevel: 5,
        spellLevel: 2,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "fear",
        minCharacterLevel: 9,
        spellLevel: 3,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "greater-invisibility",
        minCharacterLevel: 13,
        spellLevel: 4,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "seeming",
        minCharacterLevel: 17,
        spellLevel: 5,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
    ],

    notes: [
      "These spells are always prepared and do not count against the number of Ranger spells you can prepare.",
    ],
  },

  featuresByLevel: {
    3: [
      {
        id: "dread-ambusher",
        name: "Dread Ambusher",
        level: 3,
        description:
          "You master the art of creating fearsome ambushes.",
        notes: [
          "Ambusher's Leap: At the start of your first turn of each combat, your Speed increases by 10 feet until the end of that turn.",
          "Dreadful Strike: When you attack a creature and hit it with a weapon, you can deal an extra 2d6 Psychic damage.",
          "You can use Dreadful Strike only once per turn.",
          "You can use Dreadful Strike a number of times equal to your Wisdom modifier, minimum once.",
          "You regain all expended uses when you finish a Long Rest.",
          "Initiative Bonus: When you roll Initiative, you can add your Wisdom modifier to the roll.",
        ],
      },

      {
        id: "gloom-stalker-spells",
        name: "Gloom Stalker Spells",
        level: 3,
        description:
          "You always have certain Gloom Stalker spells prepared.",
        notes: [
          "Ranger Level 3: Disguise Self",
          "Ranger Level 5: Rope Trick",
          "Ranger Level 9: Fear",
          "Ranger Level 13: Greater Invisibility",
          "Ranger Level 17: Seeming",
        ],
      },

      {
        id: "umbral-sight",
        name: "Umbral Sight",
        level: 3,
        description:
          "You gain Darkvision with a range of 60 feet.",
        notes: [
          "If you already have Darkvision when you gain this feature, its range increases by 60 feet.",
          "While entirely in Darkness, you have the Invisible condition to any creature that relies on Darkvision to see you in that Darkness.",
        ],
      },
    ],

    7: [
      {
        id: "iron-mind",
        name: "Iron Mind",
        level: 7,
        description:
          "You gain proficiency in Wisdom saving throws.",
        notes: [
          "If you already have proficiency in Wisdom saving throws, you instead gain proficiency in Intelligence or Charisma saving throws, your choice.",
        ],
      },
    ],

    11: [
      {
        id: "stalkers-flurry",
        name: "Stalker's Flurry",
        level: 11,
        description:
          "The Psychic damage of your Dreadful Strike becomes 2d8.",
        notes: [
          "Whenever you use Dreadful Strike, you can also choose one additional effect.",
          "Sudden Strike: Make another attack with the same weapon against a different creature within 5 feet of the original target and within the weapon's range.",
          "Mass Fear: The target and each creature within 10 feet of it must make a Wisdom saving throw against your spell save DC. On a failed save, the creature has the Frightened condition until the start of your next turn.",
        ],
      },
    ],

    15: [
      {
        id: "shadowy-dodge",
        name: "Shadowy Dodge",
        level: 15,
        activation: "reaction",
        description:
          "When a creature makes an attack roll against you, you can take a Reaction to impose Disadvantage on that roll.",
        notes: [
          "Whether the attack hits or misses, you can then teleport up to 30 feet to an unoccupied space you can see.",
        ],
      },
    ],
  },
};