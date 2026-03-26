import type { CharacterClass } from "../../../types";

export const wizard: CharacterClass = {
  id: "wizard",
  name: "Wizard",
  hitDie: 6,
  primaryAbilities: ["int"],
  savingThrowProficiencies: ["int", "wis"],
  skillChoice: {
    choose: 2,
    options: [
      "arcana",
      "history",
      "insight",
      "investigation",
      "medicine",
      "nature",
      "religion",
    ],
  },
  weaponProficiencies: ["simple-weapons"],
  armorTraining: [],
  startingEquipment: {
    choose: 1,
    options: [
      {
        id: "wizard-starting-equipment-a",
        label:
          "2 Daggers, Arcane Focus (Quarterstaff), Robe, Spellbook, Scholar’s Pack, and 5 GP",
        grants: [
          { type: "item", id: "dagger", quantity: 2 },
          { type: "item", id: "quarterstaff", quantity: 1 },
          { type: "item", id: "robe", quantity: 1 },
          { type: "item", id: "spellbook", quantity: 1 },
          { type: "item", id: "scholars-pack", quantity: 1 },
          { type: "currency", amount: 5, currency: "gp" },
        ],
      },
      {
        id: "wizard-starting-equipment-b",
        label: "55 GP",
        grants: [{ type: "currency", amount: 55, currency: "gp" }],
      },
    ],
  },

  spellcasting: {
    id: "wizard-spellcasting",
    name: "Wizard Spellcasting",
    sourceType: "class",
    sourceId: "wizard",
    castingAbility: "int",
    spellListId: "wizard",
    progressionType: "full",
    preparationMode: "custom",
    ritualCasting: true,
    slotTableId: "full-caster",

    cantrips: {
      knownByLevel: {
        1: 3,
        2: 3,
        3: 3,
        4: 4,
        5: 4,
        6: 4,
        7: 4,
        8: 4,
        9: 4,
        10: 5,
        11: 5,
        12: 5,
        13: 5,
        14: 5,
        15: 5,
        16: 5,
        17: 5,
        18: 5,
        19: 5,
        20: 5,
      },
      chooseAtStart: 3,
      additionalChoicesByLevel: {
        4: 1,
        10: 1,
      },
      replacementRules: [
        "Whenever you finish a Long Rest, you can replace one of your Wizard cantrips from this feature with another Wizard cantrip of your choice.",
      ],
    },

    preparedSpells: {
      preparedByLevel: {
        1: 4,
        2: 5,
        3: 6,
        4: 7,
        5: 9,
        6: 10,
        7: 11,
        8: 12,
        9: 14,
        10: 15,
        11: 16,
        12: 16,
        13: 17,
        14: 18,
        15: 19,
        16: 21,
        17: 22,
        18: 23,
        19: 24,
        20: 25,
      },
      chooseAtStart: {
        count: 4,
        spellLevel: 1,
      },
      replacementRules: [
        "At level 1, your spellbook starts with six level 1 Wizard spells of your choice.",
        "Whenever you gain a Wizard level after 1, add two Wizard spells of your choice to your spellbook. Each must be of a level for which you have spell slots.",
        "Whenever the number of prepared spells increases, choose additional Wizard spells until the number of spells on your list matches the Wizard Features table.",
        "The chosen spells must be chosen from your spellbook and must be of a level for which you have spell slots.",
        "Whenever you finish a Long Rest, you can change your list of prepared spells, replacing any of the spells with spells from your spellbook.",
        "If another Wizard feature gives you spells that you always have prepared, those spells don’t count against the number of spells you can prepare with this feature, but those spells otherwise count as Wizard spells for you.",
      ],
    },

    recommendedSpells: [
      { spellId: "detect-magic", spellLevel: 1 },
      { spellId: "feather-fall", spellLevel: 1 },
      { spellId: "mage-armor", spellLevel: 1 },
      { spellId: "magic-missile", spellLevel: 1 },
      { spellId: "sleep", spellLevel: 1 },
      { spellId: "thunderwave", spellLevel: 1 },
    ],

    notes: [
      "You know three Wizard cantrips of your choice.",
      "Light, Mage Hand, and Ray of Frost are recommended.",
      "Your spellbook starts with six level 1 Wizard spells of your choice.",
      "Detect Magic, Feather Fall, Mage Armor, Magic Missile, Sleep, and Thunderwave are recommended.",
      "You prepare four level 1 Wizard spells when you gain this feature.",
      "The number of prepared spells increases as shown in the Wizard Features table.",
      "Whenever you finish a Long Rest, you can change your prepared spells from your spellbook.",
      "Intelligence is your spellcasting ability for your Wizard spells.",
      "You can use an Arcane Focus or your spellbook as a Spellcasting Focus for your Wizard spells.",
      "You regain all expended spell slots when you finish a Long Rest.",
      "You can cast a spell as a Ritual if that spell has the Ritual tag and the spell is in your spellbook; you needn’t have the spell prepared, but you must read from the book to cast it in this way.",
    ],
  },

  subclasses: [
    {
      id: "abjurer",
      name: "Abjurer",
      description:
        "Abjurers specialize in protective magic, wards, and the denial of hostile magic.",
    },
    {
      id: "diviner",
      name: "Diviner",
      description:
        "Diviners study foresight, omens, and magic that reveals hidden truths.",
    },
    {
      id: "evoker",
      name: "Evoker",
      description:
        "Evokers wield destructive elemental power and shape raw magical force.",
    },
    {
      id: "illusionist",
      name: "Illusionist",
      description:
        "Illusionists bend perception, crafting convincing images and deceptive magic.",
    },
  ],

  featuresByLevel: {
    1: [
      {
        id: "spellcasting",
        name: "Spellcasting",
        level: 1,
        description:
          "As a student of arcane magic, you have learned to cast spells from a spellbook.",
        notes: [
          "You know three Wizard cantrips of your choice.",
          "Light, Mage Hand, and Ray of Frost are recommended.",
          "Your spellbook starts with six level 1 Wizard spells of your choice.",
          "Detect Magic, Feather Fall, Mage Armor, Magic Missile, Sleep, and Thunderwave are recommended.",
          "You prepare four level 1 Wizard spells from your spellbook when you gain this feature.",
          "Whenever you gain a Wizard level after 1, add two Wizard spells of your choice to your spellbook.",
          "Whenever you finish a Long Rest, you can change your prepared spells from your spellbook.",
          "Intelligence is your spellcasting ability for your Wizard spells.",
          "You can use an Arcane Focus or your spellbook as a Spellcasting Focus for your Wizard spells.",
          "You regain all expended spell slots when you finish a Long Rest.",
        ],
      },
      {
        id: "ritual-adept",
        name: "Ritual Adept",
        level: 1,
        description:
          "You can cast Wizard rituals directly from your spellbook.",
        notes: [
          "You can cast any spell as a Ritual if that spell has the Ritual tag and the spell is in your spellbook.",
          "You needn’t have the spell prepared, but you must read from the book to cast it this way.",
        ],
      },
      {
        id: "arcane-recovery",
        name: "Arcane Recovery",
        level: 1,
        description:
          "You can regain some of your magical energy by studying your spellbook.",
        notes: [
          "When you finish a Short Rest, you can choose expended spell slots to recover.",
          "The spell slots can have a combined level equal to no more than half your Wizard level (round up).",
          "None of the recovered slots can be level 6 or higher.",
          "For example, if you’re a level 4 Wizard, you can recover either one level 2 spell slot or two level 1 spell slots.",
          "Once you use this feature, you can’t do so again until you finish a Long Rest.",
        ],
      },
    ],

    2: [
      {
        id: "scholar",
        name: "Scholar",
        level: 2,
        description:
          "While studying magic, you also specialized in another field of study.",
        notes: [
          "Choose one of the following skills in which you have proficiency: Arcana, History, Investigation, Medicine, Nature, or Religion.",
          "You gain Expertise in the chosen skill.",
        ],
      },
    ],

    3: [
      {
        id: "wizard-subclass",
        name: "Wizard Subclass",
        level: 3,
        description:
          "You gain a Wizard subclass of your choice: Abjurer, Diviner, Evoker, or Illusionist.",
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

    5: [
      {
        id: "memorize-spell",
        name: "Memorize Spell",
        level: 5,
        description:
          "You can quickly adjust part of your prepared magic during a Short Rest.",
        notes: [
          "Whenever you finish a Short Rest, you can study your spellbook and replace one of the level 1+ Wizard spells you have prepared for your Spellcasting feature with another level 1+ spell from the book.",
        ],
      },
    ],

    6: [
      {
        id: "subclass-feature-6",
        name: "Subclass Feature",
        level: 6,
      },
    ],

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

    9: [],

    10: [
      {
        id: "subclass-feature-10",
        name: "Subclass Feature",
        level: 10,
      },
    ],

    11: [],

    12: [
      {
        id: "ability-score-improvement-3",
        name: "Ability Score Improvement",
        level: 12,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],

    13: [],

    14: [
      {
        id: "subclass-feature-14",
        name: "Subclass Feature",
        level: 14,
      },
    ],

    15: [],

    16: [
      {
        id: "ability-score-improvement-4",
        name: "Ability Score Improvement",
        level: 16,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],

    17: [],

    18: [
      {
        id: "spell-mastery",
        name: "Spell Mastery",
        level: 18,
        description:
          "You have achieved such mastery over certain spells that you can cast them at will.",
        notes: [
          "Choose a level 1 spell and a level 2 spell in your spellbook that have a casting time of an action.",
          "You always have those spells prepared.",
          "You can cast them at their lowest level without expending a spell slot.",
          "To cast either spell at a higher level, you must expend a spell slot.",
        ],
      },
    ],

    19: [
      {
        id: "epic-boon",
        name: "Epic Boon",
        level: 19,
        description:
          "You gain an Epic Boon feat or another feat of your choice for which you qualify.",
        notes: ["Boon of Spell Recall is recommended."],
      },
    ],

    20: [
      {
        id: "signature-spells",
        name: "Signature Spells",
        level: 20,
        description:
          "You designate two powerful spells in your spellbook as your signature spells.",
        notes: [
          "Choose two level 3 spells in your spellbook as your signature spells.",
          "You always have these spells prepared.",
          "You can cast each of them once at level 3 without expending a spell slot.",
          "When you do so, you can’t cast that spell in this way again until you finish a Short or Long Rest.",
          "To cast either spell at a higher level, you must expend a spell slot.",
        ],
      },
    ],
  },
};