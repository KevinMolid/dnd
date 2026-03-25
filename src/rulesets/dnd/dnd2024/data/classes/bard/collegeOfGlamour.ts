import type { CharacterSubclass } from "../../../types";

export const collegeOfGlamour: CharacterSubclass = {
  id: "college-of-glamour",
  name: "College of Glamour",
  classId: "bard",
  description:
    "Bards of the College of Glamour wield beguiling Fey magic, cloaking themselves in otherworldly majesty and stirring awe, longing, and fear through their performances.",

  spellcasting: {
    id: "college-of-glamour-spellcasting",
    name: "Beguiling Magic",
    sourceType: "subclass",
    sourceId: "college-of-glamour",
    castingAbility: "cha",
    spellListId: "bard",
    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: true,
    fixedSpells: [
      {
        spellId: "charm-person",
        minCharacterLevel: 3,
        spellLevel: 1,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "mirror-image",
        minCharacterLevel: 3,
        spellLevel: 2,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "command",
        minCharacterLevel: 6,
        spellLevel: 1,
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
        id: "beguiling-magic",
        name: "Beguiling Magic",
        level: 3,
        description:
          "Your Fey magic always keeps certain spells at hand and lets your enchantments and illusions unsettle your foes.",
        notes: [
          "You always have the Charm Person and Mirror Image spells prepared.",
          "These spells don't count against the number of spells you can prepare.",
          "Immediately after you cast an Enchantment or Illusion spell using a spell slot, you can cause a creature you can see within 60 feet of yourself to make a Wisdom saving throw against your spell save DC.",
          "On a failed save, the target has the Charmed or Frightened condition (your choice) for 1 minute.",
          "The target repeats the save at the end of each of its turns, ending the effect on itself on a success.",
          "Once you use this benefit, you can't use it again until you finish a Long Rest.",
          "You can also restore your use of it by expending one use of your Bardic Inspiration (no action required).",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
      },
      {
        id: "mantle-of-inspiration",
        name: "Mantle of Inspiration",
        level: 3,
        activation: "bonus-action",
        description:
          "You can weave fey magic into a song or dance to fill others with vigor and movement.",
        notes: [
          "As a Bonus Action, you can expend a use of your Bardic Inspiration, rolling a Bardic Inspiration die.",
          "Choose a number of other creatures within 60 feet of yourself, up to a number equal to your Charisma modifier (minimum of one creature).",
          "Each chosen creature gains a number of Temporary Hit Points equal to two times the number rolled on the Bardic Inspiration die.",
          "Each chosen creature can then use its Reaction to move up to its Speed without provoking Opportunity Attacks.",
        ],
      },
    ],

    6: [
      {
        id: "mantle-of-majesty",
        name: "Mantle of Majesty",
        level: 6,
        activation: "bonus-action",
        description:
          "You assume an unearthly appearance and command the will of others with irresistible grandeur.",
        notes: [
          "You always have the Command spell prepared.",
          "It doesn't count against the number of spells you can prepare.",
          "As a Bonus Action, you cast Command without expending a spell slot, and you take on an unearthly appearance for 1 minute or until your Concentration ends.",
          "During this time, you can cast Command as a Bonus Action without expending a spell slot.",
          "Any creature Charmed by you automatically fails its saving throw against the Command you cast with this feature.",
          "Once you use this feature, you can't use it again until you finish a Long Rest.",
          "You can also restore your use of it by expending a level 3+ spell slot (no action required).",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
      },
    ],

    14: [
      {
        id: "unbreakable-majesty",
        name: "Unbreakable Majesty",
        level: 14,
        activation: "bonus-action",
        description:
          "You can assume a magically majestic presence that causes attackers to falter in awe.",
        notes: [
          "As a Bonus Action, you can assume a magically majestic presence for 1 minute or until you have the Incapacitated condition.",
          "For the duration, whenever any creature hits you with an attack roll for the first time on a turn, the attacker must succeed on a Charisma saving throw against your spell save DC.",
          "On a failed save, the attack misses instead, as the creature recoils from your majesty.",
          "Once you assume this majestic presence, you can't do so again until you finish a Short or Long Rest.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "short-or-long-rest",
        },
      },
    ],
  },
};