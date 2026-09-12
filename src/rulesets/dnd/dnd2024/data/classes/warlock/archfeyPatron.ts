import type { CharacterSubclass } from "../../../types";

export const archfeyPatron: CharacterSubclass = {
  id: "archfey-patron",
  name: "Archfey Patron",
  classId: "warlock",
  description:
    "Your pact draws on the power of the Feywild and an inscrutable Archfey patron.",
  spellcasting: {
    id: "archfey-patron-spellcasting",
    name: "Archfey Spells",
    sourceType: "subclass",
    sourceId: "archfey-patron",
    castingAbility: "cha",
    spellListId: "warlock",
    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: false,
    fixedSpells: [
      { spellId: "calm-emotions", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "faerie-fire", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "misty-step", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "phantasmal-force", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "sleep", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "blink", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "plant-growth", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "dominate-beast", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "greater-invisibility", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "dominate-person", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "seeming", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
    ],
    notes: ["These spells are always prepared and do not count against the number of Warlock spells you can prepare."],
  },
  featuresByLevel: {
    3: [
      {
        id: "archfey-spells",
        name: "Archfey Spells",
        level: 3,
        description: "The magic of your patron ensures that you always have certain spells prepared.",
      },
      {
        id: "steps-of-the-fey",
        name: "Steps of the Fey",
        level: 3,
        description: "Your patron grants you the ability to move between the boundaries of the planes.",
        notes: [
          "You can cast Misty Step without expending a spell slot a number of times equal to your Charisma modifier, minimum once.",
          "You regain all expended uses when you finish a Long Rest.",
          "Refreshing Step: immediately after you teleport, you or one creature you can see within 10 feet gains 1d10 Temporary Hit Points.",
          "Taunting Step: creatures within 5 feet of the space you left must succeed on a Wisdom saving throw against your spell save DC or have Disadvantage on attack rolls against creatures other than you until the start of your next turn.",
        ],
      },
    ],
    6: [
      {
        id: "misty-escape",
        name: "Misty Escape",
        level: 6,
        activation: "reaction",
        description: "You can cast Misty Step as a Reaction in response to taking damage.",
        notes: [
          "Disappearing Step: you have the Invisible condition until the start of your next turn or until immediately after you make an attack roll, deal damage, or cast a spell.",
          "Dreadful Step: creatures within 5 feet of the space you left or appear in must make a Wisdom saving throw; on a failed save, a creature takes 2d10 Psychic damage.",
        ],
      },
    ],
    10: [
      {
        id: "beguiling-defenses",
        name: "Beguiling Defenses",
        level: 10,
        description: "Your patron teaches you how to guard your mind and body.",
        notes: [
          "You are immune to the Charmed condition.",
          "Immediately after a creature you can see hits you with an attack roll, you can take a Reaction to reduce the damage by half, rounded down, and force the attacker to make a Wisdom saving throw against your spell save DC.",
          "On a failed save, the attacker takes Psychic damage equal to the damage you took.",
          "Once you use this Reaction, you can't use it again until you finish a Long Rest unless you expend a Pact Magic spell slot to restore its use.",
        ],
      },
    ],
    14: [
      {
        id: "bewitching-magic",
        name: "Bewitching Magic",
        level: 14,
        description: "Immediately after you cast an Enchantment or Illusion spell using an action and a spell slot, you can cast Misty Step as part of the same action without expending a spell slot.",
      },
    ],
  },
};
