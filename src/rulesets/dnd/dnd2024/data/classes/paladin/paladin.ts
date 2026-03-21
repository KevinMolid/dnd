import type { CharacterClass } from "../../../types";

export const paladin: CharacterClass = {
  id: "paladin",
  name: "Paladin",
  hitDie: 10,
  primaryAbilities: ["str", "cha"],
  savingThrowProficiencies: ["wis", "cha"],
  armorTraining: ["light-armor", "medium-armor", "heavy-armor", "shields"],
  weaponProficiencies: ["simple-weapons", "martial-weapons"],
  skillChoice: {
    choose: 2,
    options: [
      "athletics",
      "insight",
      "intimidation",
      "medicine",
      "persuasion",
      "religion",
    ],
  },
  startingEquipment: {
    choose: 1,
    options: [
      {
        id: "paladin-starting-equipment-a",
        label:
          "Chain Mail, Shield, Longsword, 6 Javelins, Holy Symbol, Priest’s Pack, and 9 GP",
        grants: [
          { type: "item", id: "chain-mail", quantity: 1 },
          { type: "item", id: "shield", quantity: 1 },
          { type: "item", id: "longsword", quantity: 1 },
          { type: "item", id: "javelin", quantity: 6 },
          { type: "item", id: "holy-symbol", quantity: 1 },
          { type: "item", id: "priests-pack", quantity: 1 },
          { type: "currency", amount: 9, currency: "gp" },
        ],
      },
      {
        id: "paladin-starting-equipment-b",
        label: "150 GP",
        grants: [{ type: "currency", amount: 150, currency: "gp" }],
      },
    ],
  },
  spellcasting: {
    id: "paladin-spellcasting",
    name: "Paladin Spellcasting",
    sourceType: "class",
    sourceId: "paladin",
    castingAbility: "cha",
    spellListId: "paladin",
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
        "Whenever you finish a Long Rest, you can replace one spell on your list with another Paladin spell for which you have spell slots.",
        "Whenever the number of prepared spells increases, choose additional Paladin spells until the number of spells on your list matches the Paladin Spellcasting table.",
        "The chosen spells must be of a level for which you have spell slots.",
        "If another Paladin feature gives you spells that you always have prepared, those spells don’t count against the number of spells you can prepare with this feature, but those spells otherwise count as Paladin spells for you.",
      ],
    },
    recommendedSpells: [
      { spellId: "heroism", spellLevel: 1 },
      { spellId: "searing-smite", spellLevel: 1 },
    ],
    notes: [
      "You regain all expended spell slots when you finish a Long Rest.",
      "You can use a Holy Symbol as a Spellcasting Focus for your Paladin spells.",
    ],
  },
  subclasses: [
    {
      id: "oath-of-devotion",
      name: "Oath of Devotion",
      description:
        "A Paladin devoted to honesty, courage, compassion, honor, and duty, serving as a shining beacon of virtue.",
    },
    {
      id: "oath-of-glory",
      name: "Oath of Glory",
      description:
        "A Paladin who seeks heroic deeds and legendary destiny through discipline, athleticism, and inspiring valor.",
    },
    {
      id: "oath-of-the-ancients",
      name: "Oath of the Ancients",
      description:
        "A Paladin who fights to preserve life, beauty, and hope, drawing power from the light that sustains the world.",
    },
    {
      id: "oath-of-vengeance",
      name: "Oath of Vengeance",
      description:
        "A relentless Paladin who hunts down those guilty of grievous evil and delivers justice without hesitation.",
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: "lay-on-hands",
        name: "Lay On Hands",
        level: 1,
        description:
          "Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you finish a Long Rest.",
        notes: [
          "The pool contains a total number of Hit Points equal to five times your Paladin level.",
          "As a Bonus Action, you can touch a creature, which could be yourself, and restore Hit Points from the pool up to the amount remaining.",
          "You can also expend 5 Hit Points from the pool to remove the Poisoned condition from the creature instead of restoring Hit Points.",
        ],
      },
      {
        id: "spellcasting",
        name: "Spellcasting",
        level: 1,
        description:
          "You have learned to cast spells through prayer and meditation, drawing from the Paladin spell list.",
        notes: [
          "You prepare two level 1 Paladin spells when you gain this feature.",
          "The number of prepared spells increases as shown in the Paladin Spellcasting table.",
          "Charisma is your spellcasting ability for Paladin spells.",
          "You can use a Holy Symbol as a Spellcasting Focus.",
          "You regain all expended spell slots when you finish a Long Rest.",
        ],
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
        id: "fighting-style",
        name: "Fighting Style",
        level: 2,
        description:
          "You gain a Fighting Style feat of your choice.",
        notes: [
          "Instead of choosing a Fighting Style feat, you can choose Blessed Warrior.",
          "Blessed Warrior lets you learn two Cleric cantrips of your choice.",
          "The recommended cantrips are Guidance and Sacred Flame.",
          "These cantrips count as Paladin spells for you, and Charisma is your spellcasting ability for them.",
        ],
      },
      {
        id: "paladins-smite",
        name: "Paladin’s Smite",
        level: 2,
        description:
          "You always have the Divine Smite spell prepared.",
        notes: [
          "You can also cast Divine Smite once without expending a spell slot.",
          "Once you cast it this way, you must finish a Long Rest before you can do so again.",
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
        id: "channel-divinity",
        name: "Channel Divinity",
        level: 3,
        description:
          "You can channel divine energy directly from the Outer Planes to fuel magical effects.",
        notes: [
          "You start with one Channel Divinity effect: Divine Sense.",
          "Other Paladin features can give you additional Channel Divinity effect options.",
          "Each time you use this class’s Channel Divinity, you choose which effect from this class to create.",
          "You can use this class’s Channel Divinity twice.",
          "You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest.",
          "You gain one additional use when you reach Paladin level 11.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 2 },
          recharge: "short-rest",
        },
      },
      {
        id: "divine-sense",
        name: "Divine Sense",
        level: 3,
        activation: "bonus-action",
        description:
          "As a Bonus Action, you open your awareness to detect Celestials, Fiends, and Undead.",
        notes: [
          "For the next 10 minutes, or until you have the Incapacitated condition, you know the location of any Celestial, Fiend, or Undead within 60 feet of yourself, and you know its creature type.",
          "Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the Hallow spell.",
          "If a Channel Divinity effect requires a saving throw, the DC equals the spell save DC from this class’s Spellcasting feature.",
        ],
      },
      {
        id: "paladin-subclass",
        name: "Paladin Subclass",
        level: 3,
        description:
          "You gain a Paladin subclass of your choice. A subclass is a specialization that grants you features at certain Paladin levels.",
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
        id: "faithful-steed",
        name: "Faithful Steed",
        level: 5,
        description:
          "You always have the Find Steed spell prepared.",
        notes: [
          "You can also cast Find Steed once without expending a spell slot.",
          "Once you cast it this way, you regain the ability to do so when you finish a Long Rest.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
      },
    ],
    6: [
      {
        id: "aura-of-protection",
        name: "Aura of Protection",
        level: 6,
        description:
          "You radiate a protective, unseeable aura in a 10-foot Emanation that originates from you.",
        notes: [
          "The aura is inactive while you have the Incapacitated condition.",
          "You and your allies in the aura gain a bonus to saving throws equal to your Charisma modifier, minimum +1.",
          "If another Paladin is present, a creature can benefit from only one Aura of Protection at a time and chooses which aura applies while within both.",
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
        id: "abjure-foes",
        name: "Abjure Foes",
        level: 9,
        description:
          "As a Magic action, you can expend one use of your Channel Divinity to overwhelm foes with awe.",
        notes: [
          "As you present your Holy Symbol or weapon, choose a number of creatures equal to your Charisma modifier, minimum one creature, that you can see within 60 feet of yourself.",
          "Each target must succeed on a Wisdom saving throw or have the Frightened condition for 1 minute or until it takes any damage.",
          "While Frightened in this way, a target can do only one of the following on its turn: move, take an action, or take a Bonus Action.",
        ],
      },
    ],
    10: [
      {
        id: "aura-of-courage",
        name: "Aura of Courage",
        level: 10,
        description:
          "You and your allies have Immunity to the Frightened condition while in your Aura of Protection.",
        notes: [
          "If a Frightened ally enters the aura, that condition has no effect on that ally while there.",
        ],
      },
    ],
    11: [
      {
        id: "radiant-strikes",
        name: "Radiant Strikes",
        level: 11,
        description:
          "Your strikes now carry supernatural power.",
        notes: [
          "When you hit a target with an attack roll using a Melee weapon or an Unarmed Strike, the target takes an extra 1d8 Radiant damage.",
        ],
      },
      {
        id: "channel-divinity-improvement",
        name: "Channel Divinity Improvement",
        level: 11,
        description:
          "You gain one additional use of your Channel Divinity.",
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
    13: [],
    14: [
      {
        id: "restoring-touch",
        name: "Restoring Touch",
        level: 14,
        description:
          "When you use Lay On Hands on a creature, you can also remove certain conditions from it.",
        notes: [
          "You can remove one or more of the following conditions: Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned.",
          "You must expend 5 Hit Points from the Lay On Hands pool for each condition removed.",
          "Those points don’t also restore Hit Points to the creature.",
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
    17: [],
    18: [
      {
        id: "aura-expansion",
        name: "Aura Expansion",
        level: 18,
        description:
          "Your Aura of Protection is now a 30-foot Emanation.",
      },
    ],
    19: [
      {
        id: "epic-boon",
        name: "Epic Boon",
        level: 19,
        description:
          "You gain an Epic Boon feat or another feat of your choice for which you qualify.",
        notes: ["Boon of Truesight is recommended."],
      },
    ],
    20: [
      {
        id: "subclass-feature-20",
        name: "Subclass Feature",
        level: 20,
      },
    ],
  },
};