import type { CharacterClass } from "../../../types";

export const sorcerer: CharacterClass = {
  id: "sorcerer",
  name: "Sorcerer",
  hitDie: 6,
  primaryAbilities: ["cha"],
  savingThrowProficiencies: ["con", "cha"],
  armorTraining: [],
  weaponProficiencies: ["simple-weapons"],
  skillChoice: {
    choose: 2,
    options: ["arcana", "deception", "insight", "intimidation", "persuasion", "religion"],
  },
  startingEquipment: {
    choose: 1,
    options: [
      {
        id: "sorcerer-starting-equipment-a",
        label: "Spear, 2 Daggers, Arcane Focus (crystal), Dungeoneer’s Pack, and 28 GP",
        grants: [
          { type: "item", id: "spear", quantity: 1 },
          { type: "item", id: "dagger", quantity: 2 },
          { type: "item", id: "arcane-focus-crystal", quantity: 1 },
          { type: "item", id: "dungeoneers-pack", quantity: 1 },
          { type: "currency", amount: 28, currency: "gp" },
        ],
      },
      {
        id: "sorcerer-starting-equipment-b",
        label: "50 GP",
        grants: [{ type: "currency", amount: 50, currency: "gp" }],
      },
    ],
  },
  spellcasting: {
    id: "sorcerer-spellcasting",
    name: "Sorcerer Spellcasting",
    sourceType: "class",
    sourceId: "sorcerer",
    castingAbility: "cha",
    spellListId: "sorcerer",
    progressionType: "full",
    preparationMode: "custom",
    ritualCasting: false,
    slotTableId: "full-caster",
    preparedSpells: {
      preparedByLevel: {
        1: 2, 2: 4, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15,
        11: 16, 12: 16, 13: 17, 14: 17, 15: 18, 16: 18, 17: 19, 18: 20, 19: 21, 20: 22,
      },
      chooseAtStart: { count: 2, spellLevel: 1 },
      replacementRules: [
        "Whenever you gain a Sorcerer level, you can replace one spell on your list with another Sorcerer spell for which you have spell slots.",
        "Whenever the number of prepared spells increases, choose additional Sorcerer spells until your list matches the Sorcerer Features table.",
        "The chosen spells must be of a level for which you have spell slots.",
        "Spells that another Sorcerer feature always prepares do not count against this limit.",
      ],
    },
    recommendedSpells: [
      { spellId: "burning-hands", spellLevel: 1 },
      { spellId: "detect-magic", spellLevel: 1 },
    ],
    notes: [
      "You know four Sorcerer cantrips at level 1; Light, Prestidigitation, Shocking Grasp, and Sorcerous Burst are recommended.",
      "Charisma is your spellcasting ability for Sorcerer spells.",
      "You can use an Arcane Focus as a Spellcasting Focus for your Sorcerer spells.",
      "You regain all expended spell slots when you finish a Long Rest.",
    ],
  },
  subclasses: [
    { id: "aberrant-sorcery", name: "Aberrant Sorcery", description: "Psionic magic born from an alien influence, granting telepathy and reality-warping powers." },
    { id: "clockwork-sorcery", name: "Clockwork Sorcery", description: "Magic infused with the cosmic order of Mechanus, used to suppress chaos and restore balance." },
    { id: "draconic-sorcery", name: "Draconic Sorcery", description: "Innate magic tied to dragons, granting draconic resilience, elemental power, and eventually wings." },
    { id: "wild-magic-sorcery", name: "Wild Magic Sorcery", description: "Unpredictable magic born from chaos, capable of producing powerful and strange magical surges." },
  ],
  featuresByLevel: {
    1: [
      {
        id: "spellcasting", name: "Spellcasting", level: 1,
        description: "Drawing from your innate magic, you can cast Sorcerer spells.",
        notes: [
          "You know four Sorcerer cantrips of your choice.",
          "You prepare two level 1 Sorcerer spells when you gain this feature.",
          "Charisma is your spellcasting ability for Sorcerer spells.",
          "You can use an Arcane Focus as a Spellcasting Focus.",
        ],
      },
      {
        id: "innate-sorcery", name: "Innate Sorcery", level: 1, activation: "bonus-action",
        description: "You unleash the magic simmering within you for 1 minute.",
        notes: [
          "Your Sorcerer spell save DC increases by 1.",
          "You have Advantage on attack rolls of Sorcerer spells you cast.",
          "You can use this feature twice and regain all expended uses when you finish a Long Rest.",
        ],
        usage: { type: "limited", uses: { type: "fixed", value: 2 }, recharge: "long-rest" },
      },
    ],
    2: [
      {
        id: "font-of-magic", name: "Font of Magic", level: 2,
        description: "You draw on a wellspring of magic represented by Sorcery Points.",
        notes: [
          "You have 2 Sorcery Points at level 2 and gain more as shown in the Sorcerer Features table.",
          "You regain all expended Sorcery Points when you finish a Long Rest.",
          "You can expend a spell slot to gain Sorcery Points equal to the slot's level, with no action required.",
          "As a Bonus Action, you can transform unexpended Sorcery Points into one spell slot.",
          "Creating a level 1/2/3/4/5 slot costs 2/3/5/6/7 Sorcery Points respectively; you can't create slots above level 5.",
          "A created spell slot vanishes when you finish a Long Rest.",
        ],
      },
      {
        id: "metamagic", name: "Metamagic", level: 2,
        description: "You can alter your spells to suit your needs by spending Sorcery Points.",
        notes: [
          "Choose two Metamagic options at level 2.",
          "Unless an option says otherwise, you can use only one Metamagic option on a spell when you cast it.",
          "Whenever you gain a Sorcerer level, you can replace one Metamagic option you know with another.",
          "You gain two more Metamagic options at Sorcerer level 10 and two more at level 17.",
        ],
      },
    ],
    3: [{ id: "sorcerer-subclass", name: "Sorcerer Subclass", level: 3, description: "You gain a Sorcerer subclass of your choice." }],
    4: [{ id: "ability-score-improvement", name: "Ability Score Improvement", level: 4, description: "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify." }],
    5: [{
      id: "sorcerous-restoration", name: "Sorcerous Restoration", level: 5,
      description: "When you finish a Short Rest, you can regain expended Sorcery Points.",
      notes: ["You regain a number of Sorcery Points equal to half your Sorcerer level, rounded down.", "Once you use this feature, you can't do so again until you finish a Long Rest."],
      usage: { type: "limited", uses: { type: "fixed", value: 1 }, recharge: "long-rest" },
    }],
    6: [{ id: "subclass-feature-6", name: "Subclass Feature", level: 6 }],
    7: [{
      id: "sorcery-incarnate", name: "Sorcery Incarnate", level: 7, activation: "bonus-action",
      description: "Your innate magic is easier to unleash and more flexible while active.",
      notes: [
        "If you have no uses of Innate Sorcery left, you can spend 2 Sorcery Points when you take the Bonus Action to activate it.",
        "While Innate Sorcery is active, you can use up to two Metamagic options on each spell you cast.",
      ],
    }],
    8: [{ id: "ability-score-improvement-2", name: "Ability Score Improvement", level: 8, description: "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify." }],
    9: [],
    10: [{ id: "metamagic-10", name: "Metamagic", level: 10, description: "You gain two additional Metamagic options." }],
    11: [],
    12: [{ id: "ability-score-improvement-3", name: "Ability Score Improvement", level: 12, description: "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify." }],
    13: [],
    14: [{ id: "subclass-feature-14", name: "Subclass Feature", level: 14 }],
    15: [],
    16: [{ id: "ability-score-improvement-4", name: "Ability Score Improvement", level: 16, description: "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify." }],
    17: [{ id: "metamagic-17", name: "Metamagic", level: 17, description: "You gain two additional Metamagic options." }],
    18: [{ id: "subclass-feature-18", name: "Subclass Feature", level: 18 }],
    19: [{ id: "epic-boon", name: "Epic Boon", level: 19, description: "You gain an Epic Boon feat or another feat of your choice for which you qualify.", notes: ["Boon of Dimensional Travel is recommended."] }],
    20: [{
      id: "arcane-apotheosis", name: "Arcane Apotheosis", level: 20,
      description: "While your Innate Sorcery feature is active, your mastery of Metamagic reaches its peak.",
      notes: ["While Innate Sorcery is active, you can use one Metamagic option on each of your turns without spending Sorcery Points on it."],
    }],
  },
};
