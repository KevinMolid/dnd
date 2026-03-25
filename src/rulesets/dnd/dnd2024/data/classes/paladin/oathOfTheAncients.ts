import type { CharacterSubclass } from "../../../types";

export const oathOfTheAncients: CharacterSubclass = {
  id: "oath-of-the-ancients",
  name: "Oath of the Ancients",
  classId: "paladin",
  description:
    "Paladins who swear the Oath of the Ancients cherish the light, preserving life, beauty, and joy in the world against the forces of darkness.",

  spellcasting: {
    id: "oath-of-the-ancients-spellcasting",
    name: "Oath of the Ancients Spells",
    sourceType: "subclass",
    sourceId: "oath-of-the-ancients",
    castingAbility: "cha",
    spellListId: "paladin",
    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: false,
    fixedSpells: [
      {
        spellId: "ensnaring-strike",
        minCharacterLevel: 3,
        spellLevel: 1,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "speak-with-animals",
        minCharacterLevel: 3,
        spellLevel: 1,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "misty-step",
        minCharacterLevel: 5,
        spellLevel: 2,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "moonbeam",
        minCharacterLevel: 5,
        spellLevel: 2,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "plant-growth",
        minCharacterLevel: 9,
        spellLevel: 3,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "protection-from-energy",
        minCharacterLevel: 9,
        spellLevel: 3,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "ice-storm",
        minCharacterLevel: 13,
        spellLevel: 4,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "stoneskin",
        minCharacterLevel: 13,
        spellLevel: 4,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "commune-with-nature",
        minCharacterLevel: 17,
        spellLevel: 5,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
      {
        spellId: "tree-stride",
        minCharacterLevel: 17,
        spellLevel: 5,
        alwaysPrepared: true,
        countsAgainstLimit: false,
      },
    ],
    notes: [
      "These spells are always prepared and do not count against the number of spells you can prepare.",
    ],
  },

  featuresByLevel: {
    3: [
      {
        id: "oath-of-the-ancients-tenets",
        name: "Oath of the Ancients",
        level: 3,
        description:
          "You swear the Oath of the Ancients, committing yourself to preserve life, light, and beauty in the world.",
        notes: [
          "Kindle the light of hope.",
          "Shelter life.",
          "Delight in art and laughter.",
        ],
      },
      {
        id: "oath-of-the-ancients-spells",
        name: "Oath of the Ancients Spells",
        level: 3,
        description:
          "The magic of your oath ensures that you always have certain spells prepared.",
        notes: [
          "Paladin Level 3: Ensnaring Strike, Speak with Animals",
          "Paladin Level 5: Misty Step, Moonbeam",
          "Paladin Level 9: Plant Growth, Protection from Energy",
          "Paladin Level 13: Ice Storm, Stoneskin",
          "Paladin Level 17: Commune with Nature, Tree Stride",
        ],
      },
      {
        id: "natures-wrath",
        name: "Nature's Wrath",
        level: 3,
        activation: "action",
        description:
          "You can invoke primal forces to ensnare nearby foes.",
        notes: [
          "As a Magic action, you can expend one use of your Channel Divinity.",
          "Spectral vines appear around nearby creatures.",
          "Each creature of your choice that you can see within 15 feet must succeed on a Strength saving throw or have the Restrained condition for 1 minute.",
          "A Restrained creature repeats the save at the end of each of its turns, ending the effect on a success.",
        ],
      },
    ],

    7: [
      {
        id: "aura-of-warding",
        name: "Aura of Warding",
        level: 7,
        description:
          "Ancient magic shields you and your allies from harmful energies.",
        notes: [
          "You and your allies have Resistance to Necrotic, Psychic, and Radiant damage while in your Aura of Protection.",
        ],
      },
    ],

    15: [
      {
        id: "undying-sentinel",
        name: "Undying Sentinel",
        level: 15,
        description:
          "Your vitality defies death and magical aging.",
        notes: [
          "When you are reduced to 0 Hit Points and not killed outright, you can drop to 1 Hit Point instead.",
          "You regain Hit Points equal to three times your Paladin level.",
          "Once you use this feature, you can't use it again until you finish a Long Rest.",
          "You can’t be aged magically, and you cease visibly aging.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
      },
    ],

    20: [
      {
        id: "elder-champion",
        name: "Elder Champion",
        level: 20,
        activation: "bonus-action",
        description:
          "You embody primal power, enhancing your aura with ancient magic.",
        notes: [
          "As a Bonus Action, you imbue your Aura of Protection with primal power for 1 minute.",
          "Once you use this feature, you can't use it again until you finish a Long Rest.",
          "You can also restore one use by expending a level 5 spell slot (no action required).",
          "Diminish Defiance: Enemies in the aura have Disadvantage on saving throws against your spells and Channel Divinity options.",
          "Regeneration: At the start of each of your turns, you regain 10 Hit Points.",
          "Swift Spells: Whenever you cast a spell with a casting time of an action, you can cast it as a Bonus Action instead.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
      },
    ],
  },
};