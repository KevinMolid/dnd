import type { CharacterClass } from "../../../types";

export const cleric: CharacterClass = {
  id: "cleric",
  name: "Cleric",
  hitDie: 8,
  primaryAbilities: ["wis"],
  savingThrowProficiencies: ["wis", "cha"],
  armorTraining: ["light-armor", "medium-armor", "shields"],
  weaponProficiencies: ["simple-weapons"],
  toolProficiencies: [],
  skillChoice: {
    choose: 2,
    options: ["history", "insight", "medicine", "persuasion", "religion"],
  },
  startingEquipment: {
    choose: 1,
    options: [
      {
        id: "cleric-starting-equipment-a",
        label:
          "Chain Shirt, Shield, Mace, Holy Symbol, Priest’s Pack, and 7 GP",
        grants: [
          { type: "item", id: "chain-shirt", quantity: 1 },
          { type: "item", id: "shield", quantity: 1 },
          { type: "item", id: "mace", quantity: 1 },
          { type: "item", id: "holy-symbol", quantity: 1 },
          { type: "item", id: "priests-pack", quantity: 1 },
          { type: "currency", amount: 7, currency: "gp" },
        ],
      },
      {
        id: "cleric-starting-equipment-b",
        label: "110 GP",
        grants: [{ type: "currency", amount: 110, currency: "gp" }],
      },
    ],
  },
  spellcasting: {
    id: "cleric-spellcasting",
    name: "Cleric Spellcasting",
    sourceType: "class",
    sourceId: "cleric",
    castingAbility: "wis",
    spellListId: "cleric",
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
        "Whenever you gain a Cleric level, you can replace one of your cantrips with another Cleric cantrip.",
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
        "Whenever you finish a Long Rest, you can change your list of prepared spells, replacing any of the spells there with other Cleric spells for which you have spell slots.",
        "Whenever the number of prepared spells increases, choose additional Cleric spells until the number of spells on your list matches the Cleric Features table.",
        "The chosen spells must be of a level for which you have spell slots.",
        "If another Cleric feature gives you spells that you always have prepared, those spells don’t count against the number of spells you can prepare with this feature, but those spells otherwise count as Cleric spells for you.",
      ],
    },

    recommendedSpells: [
      { spellId: "bless", spellLevel: 1 },
      { spellId: "cure-wounds", spellLevel: 1 },
      { spellId: "guiding-bolt", spellLevel: 1 },
      { spellId: "shield-of-faith", spellLevel: 1 },
    ],

    notes: [
      "You know three cantrips of your choice from the Cleric spell list when you gain this feature.",
      "Guidance, Sacred Flame, and Thaumaturgy are recommended.",
      "You prepare four level 1 Cleric spells when you gain this feature.",
      "Bless, Cure Wounds, Guiding Bolt, and Shield of Faith are recommended.",
      "The number of prepared spells increases as shown in the Cleric Features table.",
      "Whenever you gain a Cleric level, you can replace one of your cantrips with another Cleric cantrip.",
      "You learn one additional Cleric cantrip at Cleric levels 4 and 10.",
      "You regain all expended spell slots when you finish a Long Rest.",
      "Wisdom is your spellcasting ability for your Cleric spells.",
      "You can use a Holy Symbol as a Spellcasting Focus for your Cleric spells.",
    ],
  },

  subclasses: [
    {
      id: "life-domain",
      name: "Life Domain",
      description:
        "Clerics of the Life Domain focus on healing, vitality, and the sustaining power of the divine.",
    },
    {
      id: "light-domain",
      name: "Light Domain",
      description:
        "Clerics of the Light Domain wield radiant power, revelation, and cleansing fire.",
    },
    {
      id: "trickery-domain",
      name: "Trickery Domain",
      description:
        "Clerics of the Trickery Domain embody deception, stealth, misdirection, and clever magic.",
    },
    {
      id: "war-domain",
      name: "War Domain",
      description:
        "Clerics of the War Domain channel divine might into battle, discipline, and martial prowess.",
    },
  ],

  featuresByLevel: {
    1: [
      {
        id: "spellcasting",
        name: "Spellcasting",
        level: 1,
        description:
          "You have learned to cast Cleric spells through prayer and meditation.",
        notes: [
          "You know three cantrips of your choice from the Cleric spell list.",
          "Guidance, Sacred Flame, and Thaumaturgy are recommended.",
          "You prepare four level 1 Cleric spells when you gain this feature.",
          "Bless, Cure Wounds, Guiding Bolt, and Shield of Faith are recommended.",
          "The number of prepared spells increases as shown in the Cleric Features table.",
          "Whenever you finish a Long Rest, you can change your prepared spells.",
          "Wisdom is your spellcasting ability for your Cleric spells.",
          "You can use a Holy Symbol as a Spellcasting Focus.",
          "You regain all expended spell slots when you finish a Long Rest.",
        ],
      },
      {
        id: "divine-order",
        name: "Divine Order",
        level: 1,
        description:
          "You dedicate yourself to one of the following sacred roles of your choice: Protector or Thaumaturge.",
        notes: [
          "Protector: Trained for battle, you gain proficiency with Martial weapons and training in Heavy armor.",
          "Thaumaturge: You know one extra cantrip from the Cleric spell list. In addition, your mystical connection to the divine gives you a bonus to your Intelligence (Arcana or Religion) checks equal to your Wisdom modifier (minimum +1).",
        ],
      },
    ],

    2: [
      {
        id: "channel-divinity",
        name: "Channel Divinity",
        level: 2,
        description:
          "You can channel divine energy directly from the Outer Planes to fuel magical effects.",
        notes: [
          "You start with two Channel Divinity effects: Divine Spark and Turn Undead.",
          "Each time you use this class’s Channel Divinity, choose which effect from this class to create.",
          "You gain additional effect options at higher Cleric levels.",
          "You can use this class’s Channel Divinity twice at level 2.",
          "You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.",
          "You gain additional uses when you reach certain Cleric levels, as shown in the Channel Divinity column of the Cleric Features table.",
          "If a Channel Divinity effect requires a saving throw, the DC equals the spell save DC from this class’s Spellcasting feature.",
          "Divine Spark: As a Magic action, you point your Holy Symbol at another creature you can see within 30 feet and focus divine energy at it. Roll 1d8 and add your Wisdom modifier. You either restore Hit Points equal to that total or force the creature to make a Constitution saving throw, taking Necrotic or Radiant damage equal to that total on a failed save, or half as much on a successful one.",
          "You roll an additional d8 when you reach Cleric levels 7 (2d8), 13 (3d8), and 18 (4d8).",
          "Turn Undead: As a Magic action, you present your Holy Symbol and censure Undead creatures. Each Undead of your choice within 30 feet of you must make a Wisdom saving throw. On a failed save, it has the Frightened and Incapacitated conditions for 1 minute. For that duration, it tries to move as far away from you as it can on its turns. This effect ends early on the creature if it takes any damage, if you have the Incapacitated condition, or if you die.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 2 },
          recharge: "short-rest",
        },
      },
    ],

    3: [
      {
        id: "cleric-subclass",
        name: "Cleric Subclass",
        level: 3,
        description:
          "You gain a Cleric subclass of your choice. A subclass is a specialization that grants you features at certain Cleric levels.",
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
        id: "sear-undead",
        name: "Sear Undead",
        level: 5,
        description:
          "Whenever you use Turn Undead, divine power scorches the undead you rebuke.",
        notes: [
          "Whenever you use Turn Undead, you can roll a number of d8s equal to your Wisdom modifier (minimum of 1d8) and add the rolls together.",
          "Each Undead that fails its saving throw against that use of Turn Undead takes Radiant damage equal to the roll’s total.",
          "This damage doesn’t end the turn effect.",
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
        id: "blessed-strikes",
        name: "Blessed Strikes",
        level: 7,
        description:
          "Divine power infuses you in battle. Choose Divine Strike or Potent Spellcasting.",
        notes: [
          "Divine Strike: Once on each of your turns when you hit a creature with an attack roll using a weapon, you can cause the target to take an extra 1d8 Necrotic or Radiant damage (your choice).",
          "Potent Spellcasting: Add your Wisdom modifier to the damage you deal with any Cleric cantrip.",
        ],
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

    9: [],

    10: [
      {
        id: "divine-intervention",
        name: "Divine Intervention",
        level: 10,
        description:
          "You can call on your deity or pantheon to intervene on your behalf.",
        notes: [
          "As a Magic action, choose any Cleric spell of level 5 or lower that doesn’t require a Reaction to cast.",
          "As part of the same action, you cast that spell without expending a spell slot or needing Material components.",
          "You can’t use this feature again until you finish a Long Rest.",
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
        id: "improved-blessed-strikes",
        name: "Improved Blessed Strikes",
        level: 14,
        description:
          "The option you chose for Blessed Strikes grows more powerful.",
        notes: [
          "Divine Strike: The extra damage of your Divine Strike increases to 2d8.",
          "Potent Spellcasting: When you cast a Cleric cantrip and deal damage to a creature with it, you can give vitality to yourself or another creature within 60 feet of yourself, granting a number of Temporary Hit Points equal to twice your Wisdom modifier.",
        ],
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

    17: [
      {
        id: "subclass-feature-17",
        name: "Subclass Feature",
        level: 17,
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
        id: "greater-divine-intervention",
        name: "Greater Divine Intervention",
        level: 20,
        description:
          "You can call on even more powerful divine intervention.",
        notes: [
          "When you use your Divine Intervention feature, you can choose Wish when you select a spell.",
          "If you do so, you can’t use Divine Intervention again until you finish 2d4 Long Rests.",
        ],
      },
    ],
  },
};