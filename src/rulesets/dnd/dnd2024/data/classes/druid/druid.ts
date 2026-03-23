import type { CharacterClass } from "../../../types";

export const druid: CharacterClass = {
  id: "druid",
  name: "Druid",
  hitDie: 8,
  primaryAbilities: ["wis"],
  savingThrowProficiencies: ["int", "wis"],
  armorTraining: ["light-armor", "shields"],
  weaponProficiencies: ["simple-weapons"],
  toolProficiencies: ["herbalism-kit"],
  skillChoice: {
    choose: 2,
    options: [
      "arcana",
      "animal-handling",
      "insight",
      "medicine",
      "nature",
      "perception",
      "religion",
      "survival",
    ],
  },
  startingEquipment: {
    choose: 1,
    options: [
      {
        id: "druid-starting-equipment-a",
        label:
          "Leather Armor, Shield, Sickle, Druidic Focus (Quarterstaff), Explorer’s Pack, Herbalism Kit, and 9 GP",
        grants: [
          { type: "item", id: "leather-armor", quantity: 1 },
          { type: "item", id: "shield", quantity: 1 },
          { type: "item", id: "sickle", quantity: 1 },
          { type: "item", id: "quarterstaff", quantity: 1 },
          { type: "item", id: "explorers-pack", quantity: 1 },
          { type: "item", id: "herbalism-kit", quantity: 1 },
          { type: "currency", amount: 9, currency: "gp" },
        ],
      },
      {
        id: "druid-starting-equipment-b",
        label: "50 GP",
        grants: [{ type: "currency", amount: 50, currency: "gp" }],
      },
    ],
  },
  spellcasting: {
    id: "druid-spellcasting",
    name: "Druid Spellcasting",
    sourceType: "class",
    sourceId: "druid",
    castingAbility: "wis",
    spellListId: "druid",
    progressionType: "full",
    preparationMode: "custom",
    ritualCasting: true,
    slotTableId: "full-caster",
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
        "Whenever you finish a Long Rest, you can change your list of prepared spells, replacing any of the spells with other Druid spells for which you have spell slots.",
        "Whenever the number of prepared spells increases, choose additional Druid spells until the number of spells on your list matches the Druid Spellcasting table.",
        "The chosen spells must be of a level for which you have spell slots.",
        "If another Druid feature gives you spells that you always have prepared, those spells don’t count against the number of spells you can prepare with this feature, but those spells otherwise count as Druid spells for you.",
      ],
    },
    recommendedSpells: [
      { spellId: "animal-friendship", spellLevel: 1 },
      { spellId: "cure-wounds", spellLevel: 1 },
      { spellId: "faerie-fire", spellLevel: 1 },
      { spellId: "thunderwave", spellLevel: 1 },
    ],
    notes: [
      "You know two cantrips of your choice from the Druid spell list when you gain this feature.",
      "Whenever you gain a Druid level, you can replace one of your cantrips with another Druid cantrip.",
      "You learn one additional Druid cantrip at Druid levels 4 and 10.",
      "You regain all expended spell slots when you finish a Long Rest.",
      "Wisdom is your spellcasting ability for your Druid spells.",
      "You can use a Druidic Focus as a Spellcasting Focus for your Druid spells.",
    ],
  },
  subclasses: [
    {
      id: "circle-of-the-land",
      name: "Circle of the Land",
      description:
        "Druids of the Circle of the Land draw power from the natural world and the terrain they protect.",
    },
    {
      id: "circle-of-the-moon",
      name: "Circle of the Moon",
      description:
        "Druids of the Circle of the Moon focus on transformation and the primal power of beast forms.",
    },
    {
      id: "circle-of-the-sea",
      name: "Circle of the Sea",
      description:
        "Druids of the Circle of the Sea embody the power, motion, and mystery of the ocean.",
    },
    {
      id: "circle-of-the-stars",
      name: "Circle of the Stars",
      description:
        "Druids of the Circle of the Stars study the constellations and wield cosmic nature magic.",
    },
  ],
  featuresByLevel: {
    1: [
      {
        id: "spellcasting",
        name: "Spellcasting",
        level: 1,
        description:
          "You have learned to cast spells through studying the mystical forces of nature.",
        notes: [
          "You know two cantrips of your choice from the Druid spell list.",
          "Druidcraft and Produce Flame are recommended.",
          "You prepare four level 1 Druid spells when you gain this feature.",
          "Animal Friendship, Cure Wounds, Faerie Fire, and Thunderwave are recommended.",
          "The number of prepared spells increases as shown in the Druid Features table.",
          "Whenever you finish a Long Rest, you can change your prepared spells.",
          "Wisdom is your spellcasting ability for your Druid spells.",
          "You can use a Druidic Focus as a Spellcasting Focus.",
          "You regain all expended spell slots when you finish a Long Rest.",
        ],
      },
      {
        id: "druidic",
        name: "Druidic",
        level: 1,
        description:
          "You know Druidic, the secret language of Druids, and your connection to nature grants you a special bond with animals.",
        notes: [
          "You always have the Speak with Animals spell prepared.",
          "You can use Druidic to leave hidden messages.",
          "You and others who know Druidic automatically spot such messages.",
          "Others spot the message’s presence with a successful DC 15 Intelligence (Investigation) check but can’t decipher it without magic.",
        ],
      },
      {
        id: "primal-order",
        name: "Primal Order",
        level: 1,
        description:
          "You dedicate yourself to one of the sacred roles of your choice: Magician or Warden.",
        notes: [
          "Magician: You know one extra cantrip from the Druid spell list. In addition, your mystical connection to nature gives you a bonus to your Intelligence (Arcana or Nature) checks equal to your Wisdom modifier, minimum +1.",
          "Warden: Trained for battle, you gain proficiency with Martial weapons and training with Medium armor.",
        ],
      },
    ],
    2: [
      {
        id: "wild-shape",
        name: "Wild Shape",
        level: 2,
        activation: "bonus-action",
        description:
          "The power of nature allows you to assume the form of an animal.",
        notes: [
          "As a Bonus Action, you shape-shift into a Beast form that you have learned for this feature.",
          "You stay in that form for a number of hours equal to half your Druid level, or until you use Wild Shape again, have the Incapacitated condition, or die.",
          "You can also leave the form early as a Bonus Action.",
          "You can use Wild Shape twice at level 2.",
          "You regain one expended use when you finish a Short Rest, and all expended uses when you finish a Long Rest.",
          "You know four Beast forms at level 2, chosen from Beast stat blocks with a maximum CR of 1/4 and no Fly Speed.",
          "The Rat, Riding Horse, Spider, and Wolf are recommended.",
          "Whenever you finish a Long Rest, you can replace one of your known forms with another eligible form.",
          "While in a form, you retain your personality, memories, and ability to speak.",
          "When you assume a Wild Shape form, you gain Temporary Hit Points equal to your Druid level.",
          "Your game statistics are replaced by the Beast’s stat block, but you retain your creature type, Hit Points, Hit Point Dice, Intelligence, Wisdom, and Charisma scores, class features, languages, and feats.",
          "You also retain your skill and saving throw proficiencies and use your Proficiency Bonus, in addition to any proficiencies of the creature.",
          "If a skill or saving throw modifier in the Beast’s stat block is higher than yours, use that one instead.",
          "You can’t cast spells while in Wild Shape, but shape-shifting doesn’t break Concentration or otherwise interfere with a spell you’ve already cast.",
          "You choose whether your equipment falls in your space, merges into your new form, or is worn by it.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 2 },
          recharge: "short-rest",
        },
      },
      {
        id: "wild-companion",
        name: "Wild Companion",
        level: 2,
        description:
          "You can summon a nature spirit that assumes an animal form to aid you.",
        notes: [
          "As a Magic action, you can expend a spell slot or a use of Wild Shape to cast the Find Familiar spell without Material components.",
          "When you cast the spell this way, the familiar is Fey and disappears when you finish a Long Rest.",
        ],
      },
    ],
    3: [
      {
        id: "druid-subclass",
        name: "Druid Subclass",
        level: 3,
        description:
          "You gain a Druid subclass of your choice. A subclass is a specialization that grants you features at certain Druid levels.",
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
        id: "wild-resurgence",
        name: "Wild Resurgence",
        level: 5,
        description:
          "You can channel spell power and primal vitality through your Wild Shape.",
        notes: [
          "Once on each of your turns, if you have no uses of Wild Shape left, you can give yourself one use by expending a spell slot, with no action required.",
          "In addition, you can expend one use of Wild Shape, with no action required, to give yourself a level 1 spell slot.",
          "After gaining a spell slot this way, you can’t do so again until you finish a Long Rest.",
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
        id: "elemental-fury",
        name: "Elemental Fury",
        level: 7,
        description:
          "The might of the elements flows through you. Choose Potent Spellcasting or Primal Strike.",
        notes: [
          "Potent Spellcasting: Add your Wisdom modifier to the damage you deal with any Druid cantrip.",
          "Primal Strike: Once on each of your turns when you hit a creature with an attack roll using a weapon or a Beast form’s attack in Wild Shape, you can cause the target to take an extra 1d8 Cold, Fire, Lightning, or Thunder damage.",
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
    15: [
      {
        id: "improved-elemental-fury",
        name: "Improved Elemental Fury",
        level: 15,
        description:
          "The option you chose for Elemental Fury grows more powerful.",
        notes: [
          "Potent Spellcasting: When you cast a Druid cantrip with a range of 10 feet or greater, the spell’s range increases by 300 feet.",
          "Primal Strike: The extra damage of your Primal Strike increases to 2d8.",
        ],
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
        id: "beast-spells",
        name: "Beast Spells",
        level: 18,
        description:
          "While using Wild Shape, you can cast spells in Beast form.",
        notes: [
          "You can cast spells in Beast form except for any spell that has a Material component with a cost specified or that consumes its Material component.",
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
        notes: ["Boon of Dimensional Travel is recommended."],
      },
    ],
    20: [
      {
        id: "archdruid",
        name: "Archdruid",
        level: 20,
        description:
          "The vitality of nature constantly blooms within you, granting you exceptional mastery over Wild Shape.",
        notes: [
          "Evergreen Wild Shape: Whenever you roll Initiative and have no uses of Wild Shape left, you regain one expended use of it.",
          "Nature Magician: You can convert uses of Wild Shape into spell slots, no action required.",
          "Choose a number of your unexpended uses of Wild Shape and convert them into a single spell slot, with each use contributing 2 spell levels.",
          "For example, if you convert two uses of Wild Shape, you produce a level 4 spell slot.",
          "Once you use Nature Magician, you can’t do so again until you finish a Long Rest.",
          "Longevity: The primal magic that you wield causes you to age more slowly. For every ten years that pass, your body ages only one year.",
        ],
      },
    ],
  },
};