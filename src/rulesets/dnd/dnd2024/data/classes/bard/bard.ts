import type { CharacterClass } from "../../../types";

export const bard: CharacterClass = {
  id: "bard",
  name: "Bard",
  hitDie: 8,
  primaryAbilities: ["cha"],
  savingThrowProficiencies: ["dex", "cha"],
  armorTraining: ["light-armor"],
  weaponProficiencies: ["simple-weapons"],

  toolProficiencies: [],
  toolProficiencyChoice: {
  choose: 3,
  options: [
    "lute",
    "lyre",
    "flute",
    "drum",
    "viol",
    "horn",
    "pan-flute",
    "bagpipes",
    "dulcimer",
    "shawm",
  ],
},
    
  skillChoice: {
    choose: 3,
    options: [
      "acrobatics",
      "animal-handling",
      "arcana",
      "athletics",
      "deception",
      "history",
      "insight",
      "intimidation",
      "investigation",
      "medicine",
      "nature",
      "perception",
      "performance",
      "persuasion",
      "religion",
      "sleight-of-hand",
      "stealth",
      "survival",
    ],
  },

startingEquipment: {
  choose: 1,
  options: [
    {
      id: "bard-starting-equipment-a",
      label:
        "Leather Armor, 2 Daggers, Musical Instrument of your choice, Entertainer’s Pack, and 19 GP",
      grants: [
        { type: "item", id: "leather-armor", quantity: 1 },
        { type: "item", id: "dagger", quantity: 2 },
        {
          type: "choice",
          choose: 1,
          options: [
            { type: "item", id: "bagpipes", quantity: 1 },
            { type: "item", id: "drum", quantity: 1 },
            { type: "item", id: "dulcimer", quantity: 1 },
            { type: "item", id: "flute", quantity: 1 },
            { type: "item", id: "horn", quantity: 1 },
            { type: "item", id: "lute", quantity: 1 },
            { type: "item", id: "lyre", quantity: 1 },
            { type: "item", id: "pan-flute", quantity: 1 },
            { type: "item", id: "shawm", quantity: 1 },
            { type: "item", id: "viol", quantity: 1 },
          ],
        },
        { type: "item", id: "entertainers-pack", quantity: 1 },
        { type: "currency", amount: 19, currency: "gp" },
      ],
    },
    {
      id: "bard-starting-equipment-b",
      label: "90 GP",
      grants: [{ type: "currency", amount: 90, currency: "gp" }],
    },
  ],
},

  spellcasting: {
    id: "bard-spellcasting",
    name: "Bard Spellcasting",
    sourceType: "class",
    sourceId: "bard",
    castingAbility: "cha",
    spellListId: "bard",
    progressionType: "full",
    preparationMode: "custom",
    ritualCasting: true,
    slotTableId: "full-caster",

    cantrips: {
      knownByLevel: {
        1: 2,
        2: 2,
        3: 2,
        4: 3,
        5: 3,
        6: 3,
        7: 3,
        8: 3,
        9: 3,
        10: 4,
        11: 4,
        12: 4,
        13: 4,
        14: 4,
        15: 4,
        16: 4,
        17: 4,
        18: 4,
        19: 4,
        20: 4,
      },
      chooseAtStart: 2,
      additionalChoicesByLevel: {
        4: 1,
        10: 1,
      },
      replacementRules: [
        "Whenever you gain a Bard level, you can replace one of your cantrips with another cantrip of your choice from the Bard spell list.",
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
        14: 17,
        15: 18,
        16: 18,
        17: 19,
        18: 20,
        19: 21,
        20: 22,
      },
      chooseAtStart: {
        count: 4,
        spellLevel: 1,
      },
      replacementRules: [
        "Whenever the number of prepared spells increases, choose additional Bard spells until the number of spells on your list matches the Bard Features table.",
        "The chosen spells must be of a level for which you have spell slots.",
        "Whenever you gain a Bard level, you can replace one spell on your list with another Bard spell for which you have spell slots.",
        "If another Bard feature gives you spells that you always have prepared, those spells don’t count against the number of spells you can prepare with this feature, but those spells otherwise count as Bard spells for you.",
      ],
    },

    recommendedSpells: [
      { spellId: "charm-person", spellLevel: 1 },
      { spellId: "color-spray", spellLevel: 1 },
      { spellId: "dissonant-whispers", spellLevel: 1 },
      { spellId: "healing-word", spellLevel: 1 },
    ],

    notes: [
      "You know two cantrips of your choice from the Bard spell list.",
      "Dancing Lights and Vicious Mockery are recommended.",
      "You prepare four level 1 Bard spells when you gain this feature.",
      "Charm Person, Color Spray, Dissonant Whispers, and Healing Word are recommended.",
      "The number of prepared spells increases as shown in the Bard Features table.",
      "Whenever you gain a Bard level, you can replace one spell on your list with another Bard spell for which you have spell slots.",
      "You regain all expended spell slots when you finish a Long Rest.",
      "Charisma is your spellcasting ability for your Bard spells.",
      "You can use a Musical Instrument as a Spellcasting Focus for your Bard spells.",
    ],
  },

  subclasses: [
    {
      id: "college-of-dance",
      name: "College of Dance",
      description:
        "Bards of the College of Dance weave rhythm and movement into magical performance.",
    },
    {
      id: "college-of-glamour",
      name: "College of Glamour",
      description:
        "Bards of the College of Glamour channel beguiling beauty and fey-like majesty.",
    },
    {
      id: "college-of-lore",
      name: "College of Lore",
      description:
        "Bards of the College of Lore pursue knowledge, stories, and magical secrets.",
    },
    {
      id: "college-of-valor",
      name: "College of Valor",
      description:
        "Bards of the College of Valor inspire heroism and fight beside their allies.",
    },
  ],

  featuresByLevel: {
    1: [
      {
        id: "bardic-inspiration",
        name: "Bardic Inspiration",
        level: 1,
        activation: "bonus-action",
        description:
          "You can inspire others through words, music, or dance, granting a Bardic Inspiration die.",
        notes: [
          "As a Bonus Action, you can inspire another creature within 60 feet of yourself who can see or hear you.",
          "That creature gains one of your Bardic Inspiration dice.",
          "A creature can have only one Bardic Inspiration die at a time.",
          "Once within the next hour when the creature fails a D20 Test, it can roll the Bardic Inspiration die and add the number rolled to the d20, potentially turning the failure into a success.",
          "The Bardic Inspiration die is expended when it’s rolled.",
          "You can confer a Bardic Inspiration die a number of times equal to your Charisma modifier (minimum once).",
          "You regain all expended uses when you finish a Long Rest.",
          "The Bardic Inspiration die changes as you gain Bard levels: d6 at level 1, d8 at level 5, d10 at level 10, and d12 at level 15.",
        ],
        usage: {
          type: "limited",
          uses: { type: "ability-modifier", ability: "cha" },
          recharge: "long-rest",
        },
      },
      {
        id: "spellcasting",
        name: "Spellcasting",
        level: 1,
        description:
          "You have learned to cast spells through your bardic arts.",
        notes: [
          "You know two cantrips of your choice from the Bard spell list.",
          "Dancing Lights and Vicious Mockery are recommended.",
          "You prepare four level 1 Bard spells when you gain this feature.",
          "Charm Person, Color Spray, Dissonant Whispers, and Healing Word are recommended.",
          "The number of prepared spells increases as shown in the Bard Features table.",
          "Whenever you gain a Bard level, you can replace one spell on your list with another Bard spell for which you have spell slots.",
          "You regain all expended spell slots when you finish a Long Rest.",
          "Charisma is your spellcasting ability for your Bard spells.",
          "You can use a Musical Instrument as a Spellcasting Focus for your Bard spells.",
        ],
      },
    ],

    2: [
      {
        id: "expertise",
        name: "Expertise",
        level: 2,
        description:
          "You gain Expertise in two of your skill proficiencies of your choice.",
        notes: [
          "At Bard level 9, you gain Expertise in two more of your skill proficiencies of your choice.",
          "Performance and Persuasion are recommended if you have proficiency in them.",
        ],
      },
      {
        id: "jack-of-all-trades",
        name: "Jack of All Trades",
        level: 2,
        description:
          "You can add half your Proficiency Bonus (round down) to any ability check you make that uses a skill proficiency you lack and that doesn’t otherwise use your Proficiency Bonus.",
      },
    ],

    3: [
      {
        id: "bard-subclass",
        name: "Bard Subclass",
        level: 3,
        description:
          "You gain a Bard subclass of your choice. A subclass is a specialization that grants you features at certain Bard levels.",
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
        id: "font-of-inspiration",
        name: "Font of Inspiration",
        level: 5,
        description:
          "Your Bardic Inspiration becomes easier to restore and channel.",
        notes: [
          "You now regain all your expended uses of Bardic Inspiration when you finish a Short Rest or Long Rest.",
          "In addition, you can expend a spell slot, with no action required, to regain one expended use of Bardic Inspiration.",
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

    7: [
      {
        id: "countercharm",
        name: "Countercharm",
        level: 7,
        description:
          "You can use musical notes or words of power to disrupt mind-influencing effects.",
        notes: [
          "If you or a creature within 30 feet of you fails a saving throw against an effect that applies the Charmed or Frightened condition, you can take a Reaction to cause the save to be rerolled.",
          "The new roll has Advantage.",
        ],
        activation: "reaction",
      },
    ],

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
        id: "expertise-2",
        name: "Expertise",
        level: 9,
        description:
          "You gain Expertise in two more of your skill proficiencies of your choice.",
      },
    ],

    10: [
      {
        id: "magical-secrets",
        name: "Magical Secrets",
        level: 10,
        description:
          "You’ve learned secrets from various magical traditions.",
        notes: [
          "Whenever you reach a Bard level, including this level, and the Prepared Spells number in the Bard Features table increases, you can choose any of your new prepared spells from the Bard, Cleric, Druid, and Wizard spell lists.",
          "The chosen spells count as Bard spells for you.",
          "Whenever you replace a spell prepared for this class, you can replace it with a spell from the Bard, Cleric, Druid, or Wizard spell lists.",
        ],
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
        id: "superior-inspiration",
        name: "Superior Inspiration",
        level: 18,
        description:
          "Your inspiration wells up automatically when battle begins.",
        notes: [
          "When you roll Initiative, you regain expended uses of Bardic Inspiration until you have two if you have fewer than that.",
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
        id: "words-of-creation",
        name: "Words of Creation",
        level: 20,
        description:
          "You have mastered two of the Words of Creation: the words of life and death.",
        notes: [
          "You always have the Power Word Heal and Power Word Kill spells prepared.",
          "When you cast either spell, you can target a second creature with it if that creature is within 10 feet of the first target.",
        ],
      },
    ],
  },
};