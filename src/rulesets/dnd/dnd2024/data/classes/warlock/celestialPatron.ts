import type { CharacterSubclass } from "../../../types";

export const celestialPatron: CharacterSubclass = {
  id: "celestial-patron",
  name: "Celestial Patron",
  classId: "warlock",
  description: "Your pact draws on the Upper Planes and the radiant power of a celestial patron.",
  spellcasting: {
    id: "celestial-patron-spellcasting",
    name: "Celestial Spells",
    sourceType: "subclass",
    sourceId: "celestial-patron",
    castingAbility: "cha",
    spellListId: "warlock",
    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: false,
    fixedSpells: [
      { spellId: "aid", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "cure-wounds", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "guiding-bolt", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "lesser-restoration", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "light", minCharacterLevel: 3, spellLevel: 0, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "sacred-flame", minCharacterLevel: 3, spellLevel: 0, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "daylight", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "revivify", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "guardian-of-faith", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "wall-of-fire", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "greater-restoration", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "summon-celestial", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
    ],
    notes: ["These spells are always prepared and do not count against the number of Warlock spells you can prepare."],
  },
  featuresByLevel: {
    3: [
      { id: "celestial-spells", name: "Celestial Spells", level: 3, description: "The magic of your patron ensures that you always have certain spells prepared." },
      {
        id: "healing-light",
        name: "Healing Light",
        level: 3,
        activation: "bonus-action",
        description: "You channel celestial energy to heal wounds.",
        notes: [
          "You have a pool of d6s equal to 1 plus your Warlock level.",
          "As a Bonus Action, heal yourself or one creature you can see within 60 feet by expending dice from the pool.",
          "The maximum number of dice you can spend at once equals your Charisma modifier, minimum one.",
          "Restore Hit Points equal to the total rolled, and regain all expended dice when you finish a Long Rest.",
        ],
      },
    ],
    6: [
      {
        id: "radiant-soul",
        name: "Radiant Soul",
        level: 6,
        description: "Your link to your patron allows you to serve as a conduit for radiant energy.",
        notes: [
          "You have Resistance to Radiant damage.",
          "Once per turn, when a spell you cast deals Radiant or Fire damage, add your Charisma modifier to that spell's damage against one target.",
        ],
      },
    ],
    10: [
      {
        id: "celestial-resilience",
        name: "Celestial Resilience",
        level: 10,
        description: "You gain Temporary Hit Points whenever you use Magical Cunning or finish a Short or Long Rest.",
        notes: [
          "You gain Temporary Hit Points equal to your Warlock level plus your Charisma modifier.",
          "Choose up to five creatures you can see; they each gain Temporary Hit Points equal to half your Warlock level plus your Charisma modifier.",
        ],
      },
    ],
    14: [
      {
        id: "searing-vengeance",
        name: "Searing Vengeance",
        level: 14,
        description: "When you or an ally within 60 feet is about to make a Death Saving Throw, you can unleash radiant energy.",
        notes: [
          "The creature regains Hit Points equal to half its Hit Point maximum and can end the Prone condition on itself.",
          "Each creature of your choice within 30 feet takes Radiant damage equal to 2d8 plus your Charisma modifier and is Blinded until the end of the current turn.",
          "Once you use this feature, you can't use it again until you finish a Long Rest.",
        ],
        usage: { type: "limited", uses: { type: "fixed", value: 1 }, recharge: "long-rest" },
      },
    ],
  },
};
