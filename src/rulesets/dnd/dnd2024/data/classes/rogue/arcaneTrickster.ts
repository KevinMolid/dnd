import type { CharacterSubclass } from "../../../types";

export const arcaneTrickster: CharacterSubclass = {
  id: "arcane-trickster",
  name: "Arcane Trickster",
  classId: "rogue",
  description:
    "Arcane Tricksters enhance stealth and agility with magic, learning spells to aid in misdirection, infiltration, and trickery.",
  spellcasting: {
    id: "arcane-trickster-spellcasting",
    name: "Arcane Trickster Spellcasting",
    sourceType: "subclass",
    sourceId: "arcane-trickster",
    castingAbility: "int",
    spellListId: "wizard",
    progressionType: "third",
    preparationMode: "prepared",
    ritualCasting: false,
    slotTableId: "third-caster",
    cantrips: {
      knownByLevel: {
        3: 3,
        10: 4,
      },
      fixedKnown: ["mage-hand"],
      chooseAtStart: 2,
      additionalChoicesByLevel: {
        10: 1,
      },
      replacementRules: [
        "Whenever you gain a Rogue level, you can replace one of your cantrips, except Mage Hand, with another Wizard cantrip of your choice.",
      ],
    },
    preparedSpells: {
      preparedByLevel: {
        3: 3,
        4: 4,
        7: 5,
        10: 6,
        13: 7,
        16: 8,
        19: 9,
      },
      chooseAtStart: {
        count: 3,
        spellLevel: 1,
      },
      replacementRules: [
        "Whenever the number of prepared spells increases, choose additional Wizard spells until the number of spells on your list matches the Arcane Trickster Spellcasting table.",
        "The chosen spells must be of a level for which you have spell slots.",
      ],
    },
    recommendedSpells: [
      { spellId: "charm-person", spellLevel: 1 },
      { spellId: "disguise-self", spellLevel: 1 },
      { spellId: "fog-cloud", spellLevel: 1 },
      { spellId: "mind-sliver", spellLevel: 0 },
      { spellId: "minor-illusion", spellLevel: 0 },
    ],
    notes: [
      "You regain all expended spell slots when you finish a Long Rest.",
    ],
  },
  featuresByLevel: {
    3: [
      {
        id: "arcane-trickster-spellcasting",
        name: "Spellcasting",
        level: 3,
        description:
          "You have learned to cast spells, using the Wizard spell list for your Arcane Trickster magic.",
        notes: [
          "You know Mage Hand and two other Wizard cantrips of your choice.",
          "When you reach Rogue level 10, you learn another Wizard cantrip of your choice.",
          "You prepare three level 1 Wizard spells when you gain this feature.",
          "The number of prepared spells increases as shown in the Arcane Trickster Spellcasting table.",
          "You regain all expended spell slots when you finish a Long Rest.",
          "Intelligence is your spellcasting ability for these spells.",
        ],
      },
    ],
    9: [
      {
        id: "magical-ambush",
        name: "Magical Ambush",
        level: 9,
        description:
          "If you are Hidden from a creature when you cast a spell on it, that creature has Disadvantage on any saving throw it makes against the spell on the same turn.",
      },
    ],
    13: [
      {
        id: "versatile-trickster",
        name: "Versatile Trickster",
        level: 13,
        description:
          "You can use your Mage Hand to distract enemies and create an opening for your attacks.",
        notes: [
          "As a Bonus Action, you can direct your Mage Hand to distract a creature within 5 feet of it.",
          "Until the end of the turn, you have Advantage on attack rolls against that creature.",
        ],
      },
    ],
    17: [
      {
        id: "spell-thief",
        name: "Spell Thief",
        level: 17,
        description:
          "You can magically steal the knowledge of a spell from another spellcaster when they try to affect you with it.",
        notes: [
          "When a creature casts a spell on you or includes you in a spell’s effect, you can use your Reaction to try to steal it.",
          "If the attempt succeeds, the spell has no effect on you.",
          "If the spell is of a level you can cast, you know it for a time and can cast it using your spell slots.",
        ],
      },
    ],
  },
};