import type { CharacterSubclass } from "../../../types";

export const feyWanderer: CharacterSubclass = {
  id: "fey-wanderer",
  name: "Fey Wanderer",
  classId: "ranger",

  description:
    "Fey Wanderers carry Fey magic into the mortal world, blending martial prowess with supernatural charm and psychic power.",

  spellcasting: {
    id: "fey-wanderer-spellcasting",
    name: "Fey Wanderer Spells",

    sourceType: "subclass",
    sourceId: "fey-wanderer",

    castingAbility: "wis",
    spellListId: "ranger",

    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: false,

    fixedSpells: [
      {
        spellId: "charm-person",
        minCharacterLevel: 3,
        spellLevel: 1,
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
        spellId: "summon-fey",
        minCharacterLevel: 9,
        spellLevel: 3,
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
        spellId: "mislead",
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
        id: "dreadful-strikes",
        name: "Dreadful Strikes",
        level: 3,
        description:
          "You augment your weapon strikes with mind-scarring magic drawn from the murky hollows of the Feywild.",
        notes: [
          "When you hit a creature with a weapon, you can deal an extra 1d4 Psychic damage to it.",
          "You can deal this extra damage only once per turn.",
          "The extra damage increases to 1d6 when you reach Ranger level 11.",
        ],
      },

      {
        id: "fey-wanderer-spells",
        name: "Fey Wanderer Spells",
        level: 3,
        description:
          "You always have certain Fey Wanderer spells prepared.",
        notes: [
          "Ranger Level 3: Charm Person",
          "Ranger Level 5: Misty Step",
          "Ranger Level 9: Summon Fey",
          "Ranger Level 13: Dimension Door",
          "Ranger Level 17: Mislead",
        ],
      },

      {
        id: "otherworldly-glamour",
        name: "Otherworldly Glamour",
        level: 3,
        description:
          "Your Fey gift enhances your presence.",
        notes: [
          "Whenever you make a Charisma check, you gain a bonus equal to your Wisdom modifier, minimum +1.",
          "You gain proficiency in Deception, Performance, or Persuasion.",
        ],
      },
    ],

    7: [
      {
        id: "beguiling-twist",
        name: "Beguiling Twist",
        level: 7,
        activation: "reaction",
        description:
          "The magic of the Feywild guards your mind.",
        notes: [
          "You have Advantage on saving throws to avoid or end the Charmed or Frightened condition.",
          "When you or a creature you can see within 120 feet succeeds on a save to avoid or end Charmed or Frightened, you can use a Reaction to force another creature you can see within 120 feet to make a Wisdom saving throw against your spell save DC.",
          "On a failed save, it is Charmed or Frightened, your choice, for 1 minute.",
          "The target repeats the save at the end of each of its turns.",
        ],
      },
    ],

    11: [
      {
        id: "fey-reinforcements",
        name: "Fey Reinforcements",
        level: 11,
        description:
          "You can cast Summon Fey without a Material component.",
        notes: [
          "You can also cast it once without a spell slot.",
          "You regain the ability to cast it this way when you finish a Long Rest.",
          "Whenever you cast Summon Fey, you can make it not require Concentration. If you do so, its duration becomes 1 minute for that casting.",
        ],
      },
    ],

    15: [
      {
        id: "misty-wanderer",
        name: "Misty Wanderer",
        level: 15,
        description:
          "Your mastery of Fey magic enhances Misty Step.",
        notes: [
          "You can cast Misty Step without expending a spell slot.",
          "You can do so a number of times equal to your Wisdom modifier, minimum once.",
          "You regain all expended uses when you finish a Long Rest.",
          "Whenever you cast Misty Step, you can bring one willing creature you can see within 5 feet of yourself.",
          "That creature teleports to an unoccupied space of your choice within 5 feet of your destination.",
        ],
      },
    ],
  },
};