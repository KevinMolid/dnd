import type { CharacterSubclass } from "../../../types";

export const fiendPatron: CharacterSubclass = {
  id: "fiend-patron",
  name: "Fiend Patron",
  classId: "warlock",
  description: "Your pact draws on the Lower Planes and the destructive power of a mighty Fiend.",
  spellcasting: {
    id: "fiend-patron-spellcasting",
    name: "Fiend Spells",
    sourceType: "subclass",
    sourceId: "fiend-patron",
    castingAbility: "cha",
    spellListId: "warlock",
    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: false,
    fixedSpells: [
      { spellId: "burning-hands", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "command", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "scorching-ray", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "suggestion", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "fireball", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "stinking-cloud", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "fire-shield", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "wall-of-fire", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "geas", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "insect-plague", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
    ],
    notes: ["These spells are always prepared and do not count against the number of Warlock spells you can prepare."],
  },
  featuresByLevel: {
    3: [
      {
        id: "dark-ones-blessing",
        name: "Dark One's Blessing",
        level: 3,
        description: "When you reduce an enemy to 0 Hit Points, you gain Temporary Hit Points.",
        notes: [
          "The Temporary Hit Points equal your Charisma modifier plus your Warlock level, minimum 1.",
          "You also gain this benefit if someone else reduces an enemy within 10 feet of you to 0 Hit Points.",
        ],
      },
      { id: "fiend-spells", name: "Fiend Spells", level: 3, description: "The magic of your patron ensures that you always have certain spells prepared." },
    ],
    6: [
      {
        id: "dark-ones-own-luck",
        name: "Dark One's Own Luck",
        level: 6,
        description: "You can call on your fiendish patron to alter fate in your favor.",
        notes: [
          "When you make an ability check or saving throw, add 1d10 after seeing the roll but before any effects occur.",
          "You can use this feature a number of times equal to your Charisma modifier, minimum once, but no more than once per roll.",
          "You regain all expended uses when you finish a Long Rest.",
        ],
      },
    ],
    10: [
      {
        id: "fiendish-resilience",
        name: "Fiendish Resilience",
        level: 10,
        description: "Choose one damage type other than Force whenever you finish a Short or Long Rest.",
        notes: ["You have Resistance to the chosen damage type until you choose a different one with this feature."],
      },
    ],
    14: [
      {
        id: "hurl-through-hell",
        name: "Hurl Through Hell",
        level: 14,
        description: "Once per turn when you hit a creature with an attack roll, you can transport it through the Lower Planes.",
        notes: [
          "The target must succeed on a Charisma saving throw against your spell save DC or disappear and hurtle through a nightmare landscape.",
          "If the target isn't a Fiend, it takes 8d10 Psychic damage.",
          "The target has the Incapacitated condition until the end of your next turn, when it returns to its previous space or the nearest unoccupied space.",
          "Once you use this feature, you can't use it again until you finish a Long Rest unless you expend a Pact Magic spell slot to restore its use.",
        ],
      },
    ],
  },
};
