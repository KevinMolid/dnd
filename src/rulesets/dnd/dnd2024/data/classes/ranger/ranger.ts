import type { CharacterClass } from "../../../types";

export const ranger: CharacterClass = {
  id: "ranger",
  name: "Ranger",

  hitDie: 10,

  primaryAbilities: ["dex", "wis"],

  savingThrowProficiencies: ["str", "dex"],

  armorTraining: [
    "light-armor",
    "medium-armor",
    "shields",
  ],

  weaponProficiencies: [
    "simple-weapons",
    "martial-weapons",
  ],

  skillChoice: {
    choose: 3,
    options: [
      "animal-handling",
      "athletics",
      "insight",
      "investigation",
      "nature",
      "perception",
      "stealth",
      "survival",
    ],
  },

  startingEquipment: {
    choose: 1,
    options: [
      {
        id: "ranger-starting-equipment-a",
        label:
          "Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Druidic Focus, Explorer’s Pack, and 7 GP",
        grants: [
          { type: "item", id: "studded-leather", quantity: 1 },
          { type: "item", id: "scimitar", quantity: 1 },
          { type: "item", id: "shortsword", quantity: 1 },
          { type: "item", id: "longbow", quantity: 1 },
          { type: "item", id: "arrow", quantity: 20 },
          { type: "item", id: "quiver", quantity: 1 },
          { type: "item", id: "druidic-focus", quantity: 1 },
          { type: "item", id: "explorers-pack", quantity: 1 },
          { type: "currency", amount: 7, currency: "gp" },
        ],
      },
      {
        id: "ranger-starting-equipment-b",
        label: "150 GP",
        grants: [
          { type: "currency", amount: 150, currency: "gp" },
        ],
      },
    ],
  },

  spellcasting: {
    id: "ranger-spellcasting",
    name: "Ranger Spellcasting",

    sourceType: "class",
    sourceId: "ranger",

    castingAbility: "wis",
    spellListId: "ranger",

    progressionType: "half",
    preparationMode: "custom",

    ritualCasting: false,
    slotTableId: "half-caster",

    preparedSpells: {
      preparedByLevel: {
        1: 2,
        2: 3,
        3: 4,
        4: 5,
        5: 6,
        7: 7,
        9: 9,
        11: 10,
        13: 11,
        15: 12,
        17: 14,
        19: 15,
      },

      chooseAtStart: {
        count: 2,
        spellLevel: 1,
      },

      replacementRules: [
        "Whenever you finish a Long Rest, you can replace one spell on your list with another Ranger spell for which you have spell slots.",
        "Whenever the number of prepared spells increases, choose additional Ranger spells until the number of spells on your list matches the Ranger Features table.",
        "The chosen spells must be of a level for which you have spell slots.",
        "If another Ranger feature gives you spells that you always have prepared, those spells don’t count against the number of spells you can prepare with this feature, but those spells otherwise count as Ranger spells for you.",
      ],
    },

    recommendedSpells: [
      {
        spellId: "cure-wounds",
        spellLevel: 1,
      },
      {
        spellId: "ensnaring-strike",
        spellLevel: 1,
      },
    ],

    notes: [
      "Wisdom is your spellcasting ability for Ranger spells.",
      "You regain all expended spell slots when you finish a Long Rest.",
      "You can use a Druidic Focus as a Spellcasting Focus for your Ranger spells.",
    ],
  },

  subclasses: [
    {
      id: "beast-master",
      name: "Beast Master",
      description:
        "A Ranger who forms a mystical bond with a primal beast and fights alongside it.",
    },
    {
      id: "fey-wanderer",
      name: "Fey Wanderer",
      description:
        "A Ranger touched by Fey magic who combines martial skill with supernatural charm and psychic power.",
    },
    {
      id: "gloom-stalker",
      name: "Gloom Stalker",
      description:
        "A Ranger who masters darkness, ambush, and supernatural stealth.",
    },
    {
      id: "hunter",
      name: "Hunter",
      description:
        "A Ranger specialized in hunting dangerous prey and adapting to different enemies.",
    },
  ],

  featuresByLevel: {
    1: [
      {
        id: "spellcasting",
        name: "Spellcasting",
        level: 1,
        description:
          "You have learned to channel the magical essence of nature to cast spells.",
        notes: [
          "You prepare two level 1 Ranger spells when you gain this feature.",
          "Cure Wounds and Ensnaring Strike are recommended.",
          "Wisdom is your spellcasting ability for Ranger spells.",
          "You can use a Druidic Focus as a Spellcasting Focus.",
          "You regain all expended spell slots when you finish a Long Rest.",
        ],
      },

      {
        id: "favored-enemy",
        name: "Favored Enemy",
        level: 1,
        description:
          "You always have the Hunter's Mark spell prepared.",
        notes: [
          "Hunter's Mark does not count against the number of Ranger spells you can prepare.",
          "You can cast Hunter's Mark twice without expending a spell slot.",
          "You regain all expended uses when you finish a Long Rest.",
          "The number of free uses increases as you gain Ranger levels.",
        ],
        usage: {
          type: "limited",
          uses: {
            type: "fixed",
            value: 2,
          },
          recharge: "long-rest",
        },
      },

      {
        id: "weapon-mastery",
        name: "Weapon Mastery",
        level: 1,
        description:
          "Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have proficiency.",
        notes: [
          "Whenever you finish a Long Rest, you can change the kinds of weapons you chose.",
        ],
      },
    ],

    2: [
      {
        id: "deft-explorer",
        name: "Deft Explorer",
        level: 2,
        description:
          "Your travels grant you expertise and additional languages.",
        notes: [
          "Expertise: Choose one of your skill proficiencies with which you lack Expertise. You gain Expertise in that skill.",
          "Languages: You know two languages of your choice.",
        ],
      },

      {
        id: "fighting-style",
        name: "Fighting Style",
        level: 2,
        description:
          "You gain a Fighting Style feat of your choice.",
        notes: [
          "Instead of choosing a Fighting Style feat, you can choose Druidic Warrior.",
          "Druidic Warrior lets you learn two Druid cantrips of your choice.",
          "Guidance and Starry Wisp are recommended.",
          "The chosen cantrips count as Ranger spells for you.",
          "Wisdom is your spellcasting ability for them.",
          "Whenever you gain a Ranger level, you can replace one of these cantrips with another Druid cantrip.",
        ],
      },
    ],

    3: [
      {
        id: "ranger-subclass",
        name: "Ranger Subclass",
        level: 3,
        description:
          "You gain a Ranger subclass of your choice.",
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
        id: "extra-attack",
        name: "Extra Attack",
        level: 5,
        description:
          "You can attack twice instead of once whenever you take the Attack action on your turn.",
      },

      {
        id: "favored-enemy-improvement-5",
        name: "Favored Enemy Improvement",
        level: 5,
        description:
          "You can now cast Hunter's Mark three times without expending a spell slot.",
      },
    ],

    6: [
      {
        id: "roving",
        name: "Roving",
        level: 6,
        description:
          "Your movement becomes faster and more versatile.",
        notes: [
          "Your Speed increases by 10 feet while you aren't wearing Heavy armor.",
          "You gain a Climb Speed equal to your Speed.",
          "You gain a Swim Speed equal to your Speed.",
        ],
      },
    ],

    7: [
      {
        id: "subclass-feature-7",
        name: "Subclass Feature",
        level: 7,
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
        id: "expertise",
        name: "Expertise",
        level: 9,
        description:
          "Choose two of your skill proficiencies with which you lack Expertise. You gain Expertise in those skills.",
      },

      {
        id: "favored-enemy-improvement-9",
        name: "Favored Enemy Improvement",
        level: 9,
        description:
          "You can now cast Hunter's Mark four times without expending a spell slot.",
      },
    ],

    10: [
      {
        id: "tireless",
        name: "Tireless",
        level: 10,
        description:
          "Primal forces fuel you on your journeys.",
        notes: [
          "Temporary Hit Points: As a Magic action, you can give yourself Temporary Hit Points equal to 1d8 plus your Wisdom modifier, minimum 1.",
          "You can use this action a number of times equal to your Wisdom modifier, minimum once.",
          "You regain all expended uses when you finish a Long Rest.",
          "Decrease Exhaustion: Whenever you finish a Short Rest or Long Rest, your Exhaustion level decreases by 1.",
        ],
      },
    ],

    11: [
      {
        id: "subclass-feature-11",
        name: "Subclass Feature",
        level: 11,
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
        id: "relentless-hunter",
        name: "Relentless Hunter",
        level: 13,
        description:
          "Taking damage can't break your Concentration on Hunter's Mark.",
      },

      {
        id: "favored-enemy-improvement-13",
        name: "Favored Enemy Improvement",
        level: 13,
        description:
          "You can now cast Hunter's Mark five times without expending a spell slot.",
      },
    ],

    14: [
      {
        id: "natures-veil",
        name: "Nature's Veil",
        level: 14,
        activation: "bonus-action",
        description:
          "You invoke spirits of nature to magically hide yourself.",
        notes: [
          "As a Bonus Action, you can give yourself the Invisible condition until the end of your next turn.",
          "You can use this feature a number of times equal to your Wisdom modifier, minimum once.",
          "You regain all expended uses when you finish a Long Rest.",
        ],
      },
    ],

    15: [
      {
        id: "subclass-feature-15",
        name: "Subclass Feature",
        level: 15,
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
        id: "precise-hunter",
        name: "Precise Hunter",
        level: 17,
        description:
          "You have Advantage on attack rolls against the creature currently marked by your Hunter's Mark.",
      },

      {
        id: "favored-enemy-improvement-17",
        name: "Favored Enemy Improvement",
        level: 17,
        description:
          "You can now cast Hunter's Mark six times without expending a spell slot.",
      },
    ],

    18: [
      {
        id: "feral-senses",
        name: "Feral Senses",
        level: 18,
        description:
          "Your connection to the forces of nature grants you Blindsight with a range of 30 feet.",
      },
    ],

    19: [
      {
        id: "epic-boon",
        name: "Epic Boon",
        level: 19,
        description:
          "You gain an Epic Boon feat or another feat of your choice for which you qualify.",
        notes: [
          "Boon of Dimensional Travel is recommended.",
        ],
      },
    ],

    20: [
      {
        id: "foe-slayer",
        name: "Foe Slayer",
        level: 20,
        description:
          "The damage die of your Hunter's Mark is a d10 rather than a d6.",
      },
    ],
  },
};