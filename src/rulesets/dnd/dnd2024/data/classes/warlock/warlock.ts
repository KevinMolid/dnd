import type { CharacterClass } from "../../../types";

export const warlock: CharacterClass = {
  id: "warlock",
  name: "Warlock",
  hitDie: 8,
  primaryAbilities: ["cha"],
  savingThrowProficiencies: ["wis", "cha"],
  armorTraining: ["light-armor"],
  weaponProficiencies: ["simple-weapons"],
  skillChoice: {
    choose: 2,
    options: [
      "arcana",
      "deception",
      "history",
      "intimidation",
      "investigation",
      "nature",
      "religion",
    ],
  },
  startingEquipment: {
    choose: 1,
    options: [
      {
        id: "warlock-starting-equipment-a",
        label:
          "Leather Armor, Sickle, 2 Daggers, Arcane Focus (orb), Book (occult lore), Scholar’s Pack, and 15 GP",
        grants: [
          { type: "item", id: "leather-armor", quantity: 1 },
          { type: "item", id: "sickle", quantity: 1 },
          { type: "item", id: "dagger", quantity: 2 },
          { type: "item", id: "arcane-focus-orb", quantity: 1 },
          { type: "item", id: "book-occult-lore", quantity: 1 },
          { type: "item", id: "scholars-pack", quantity: 1 },
          { type: "currency", amount: 15, currency: "gp" },
        ],
      },
      {
        id: "warlock-starting-equipment-b",
        label: "100 GP",
        grants: [{ type: "currency", amount: 100, currency: "gp" }],
      },
    ],
  },
  spellcasting: {
    id: "warlock-pact-magic",
    name: "Pact Magic",
    sourceType: "class",
    sourceId: "warlock",
    castingAbility: "cha",
    spellListId: "warlock",
    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: false,
    customSlotTable: {
      1: { 1: 1 },
      2: { 1: 2 },
      3: { 2: 2 },
      4: { 2: 2 },
      5: { 3: 2 },
      6: { 3: 2 },
      7: { 4: 2 },
      8: { 4: 2 },
      9: { 5: 2 },
      10: { 5: 2 },
      11: { 5: 3 },
      12: { 5: 3 },
      13: { 5: 3 },
      14: { 5: 3 },
      15: { 5: 3 },
      16: { 5: 3 },
      17: { 5: 4 },
      18: { 5: 4 },
      19: { 5: 4 },
      20: { 5: 4 },
    },
    cantrips: {
      knownByLevel: {
        1: 2,
        4: 3,
        10: 4,
      },
      chooseAtStart: 2,
      replacementRules: [
        "Whenever you gain a Warlock level, you can replace one Warlock cantrip you know with another Warlock cantrip.",
        "You learn an additional Warlock cantrip at Warlock levels 4 and 10.",
      ],
    },
    preparedSpells: {
      preparedByLevel: {
        1: 2,
        2: 3,
        3: 4,
        4: 5,
        5: 6,
        6: 7,
        7: 8,
        8: 9,
        9: 10,
        10: 10,
        11: 11,
        12: 11,
        13: 12,
        14: 12,
        15: 13,
        16: 13,
        17: 14,
        18: 14,
        19: 15,
        20: 15,
      },
      chooseAtStart: {
        count: 2,
        spellLevel: 1,
      },
      replacementRules: [
        "Whenever you gain a Warlock level, you can replace one spell on your list with another Warlock spell of an eligible level.",
        "Whenever the number of prepared spells increases, choose additional Warlock spells until your list matches the Warlock Features table.",
        "A Pact Magic spell must be no higher than the Slot Level shown for your Warlock level.",
        "Spells that another Warlock feature says are always prepared do not count against this limit.",
      ],
    },
    notes: [
      "You regain all expended Pact Magic spell slots when you finish a Short or Long Rest.",
      "All your Pact Magic spell slots are the same level, as shown in the Warlock Features table.",
      "Charisma is your spellcasting ability for Warlock spells.",
      "You can use an Arcane Focus as a Spellcasting Focus for your Warlock spells.",
    ],
  },
  subclasses: [
    {
      id: "archfey-patron",
      name: "Archfey Patron",
      description:
        "A Warlock whose pact draws on the unpredictable magic of a powerful Fey patron.",
    },
    {
      id: "celestial-patron",
      name: "Celestial Patron",
      description:
        "A Warlock whose pact draws on the Upper Planes and the radiant power of a celestial being.",
    },
    {
      id: "fiend-patron",
      name: "Fiend Patron",
      description:
        "A Warlock whose pact is bound to a powerful entity of the Lower Planes.",
    },
    {
      id: "great-old-one-patron",
      name: "Great Old One Patron",
      description:
        "A Warlock touched by an unknowable entity from beyond ordinary mortal understanding.",
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: "eldritch-invocations",
        name: "Eldritch Invocations",
        level: 1,
        description:
          "You have unearthed Eldritch Invocations, pieces of forbidden knowledge that imbue you with magical abilities or other lessons.",
        notes: [
          "You gain one invocation of your choice at level 1.",
          "Some invocations have prerequisites.",
          "Whenever you gain a Warlock level, you can replace one invocation with another for which you qualify, unless the invocation is a prerequisite for another invocation you have.",
          "You gain additional invocations as shown in the Warlock Features table.",
        ],
      },
      {
        id: "pact-magic",
        name: "Pact Magic",
        level: 1,
        description:
          "Through occult ceremony, you have formed a pact with a mysterious entity and gained the ability to cast Warlock spells.",
        notes: [
          "You know two Warlock cantrips of your choice. Eldritch Blast and Prestidigitation are recommended.",
          "You prepare two level 1 Warlock spells. Charm Person and Hex are recommended.",
          "Charisma is your spellcasting ability for Warlock spells.",
          "You can use an Arcane Focus as a Spellcasting Focus.",
          "You regain all expended Pact Magic spell slots when you finish a Short or Long Rest.",
        ],
      },
    ],
    2: [
      {
        id: "magical-cunning",
        name: "Magical Cunning",
        level: 2,
        description:
          "You can perform an esoteric rite for 1 minute to recover expended Pact Magic spell slots.",
        notes: [
          "At the end of the rite, regain expended Pact Magic spell slots up to a number equal to half your maximum, rounded up.",
          "Once you use this feature, you can't use it again until you finish a Long Rest.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
      },
    ],
    3: [
      {
        id: "warlock-subclass",
        name: "Warlock Subclass",
        level: 3,
        description:
          "You gain a Warlock subclass of your choice: Archfey Patron, Celestial Patron, Fiend Patron, or Great Old One Patron.",
      },
    ],
    4: [
      {
        id: "ability-score-improvement",
        name: "Ability Score Improvement",
        level: 4,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    5: [],
    6: [{ id: "subclass-feature-6", name: "Subclass Feature", level: 6 }],
    7: [],
    8: [
      {
        id: "ability-score-improvement-2",
        name: "Ability Score Improvement",
        level: 8,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    9: [
      {
        id: "contact-patron",
        name: "Contact Patron",
        level: 9,
        description: "You can communicate directly with your patron.",
        notes: [
          "You always have Contact Other Plane prepared.",
          "You can cast Contact Other Plane once without expending a spell slot to contact your patron, and you automatically succeed on the spell's saving throw.",
          "Once you cast it this way, you can't do so again until you finish a Long Rest.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
      },
    ],
    10: [{ id: "subclass-feature-10", name: "Subclass Feature", level: 10 }],
    11: [
      {
        id: "mystic-arcanum-6",
        name: "Mystic Arcanum (Level 6 Spell)",
        level: 11,
        description:
          "Choose one level 6 Warlock spell as your Mystic Arcanum. You can cast it once without expending a spell slot and regain that use when you finish a Long Rest.",
      },
    ],
    12: [
      {
        id: "ability-score-improvement-3",
        name: "Ability Score Improvement",
        level: 12,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    13: [
      {
        id: "mystic-arcanum-7",
        name: "Mystic Arcanum (Level 7 Spell)",
        level: 13,
        description:
          "Choose one level 7 Warlock spell as an additional Mystic Arcanum. You can cast it once without expending a spell slot and regain that use when you finish a Long Rest.",
      },
    ],
    14: [{ id: "subclass-feature-14", name: "Subclass Feature", level: 14 }],
    15: [
      {
        id: "mystic-arcanum-8",
        name: "Mystic Arcanum (Level 8 Spell)",
        level: 15,
        description:
          "Choose one level 8 Warlock spell as an additional Mystic Arcanum. You can cast it once without expending a spell slot and regain that use when you finish a Long Rest.",
      },
    ],
    16: [
      {
        id: "ability-score-improvement-4",
        name: "Ability Score Improvement",
        level: 16,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    17: [
      {
        id: "mystic-arcanum-9",
        name: "Mystic Arcanum (Level 9 Spell)",
        level: 17,
        description:
          "Choose one level 9 Warlock spell as an additional Mystic Arcanum. You can cast it once without expending a spell slot and regain that use when you finish a Long Rest.",
      },
    ],
    18: [],
    19: [
      {
        id: "epic-boon",
        name: "Epic Boon",
        level: 19,
        description:
          "You gain an Epic Boon feat or another feat of your choice for which you qualify.",
        notes: ["Boon of Fate is recommended."],
      },
    ],
    20: [
      {
        id: "eldritch-master",
        name: "Eldritch Master",
        level: 20,
        description:
          "When you use Magical Cunning, you regain all expended Pact Magic spell slots instead of only half your maximum.",
      },
    ],
  },
};
