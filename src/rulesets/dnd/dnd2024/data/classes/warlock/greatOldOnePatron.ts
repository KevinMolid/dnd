import type { CharacterSubclass } from "../../../types";

export const greatOldOnePatron: CharacterSubclass = {
  id: "great-old-one-patron",
  name: "Great Old One Patron",
  classId: "warlock",
  description: "Your pact links you to an unknowable entity whose alien secrets twist thought, perception, and psychic magic.",
  spellcasting: {
    id: "great-old-one-patron-spellcasting",
    name: "Great Old One Spells",
    sourceType: "subclass",
    sourceId: "great-old-one-patron",
    castingAbility: "cha",
    spellListId: "warlock",
    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: false,
    fixedSpells: [
      { spellId: "detect-thoughts", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "dissonant-whispers", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "phantasmal-force", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "tashas-hideous-laughter", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "clairvoyance", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "hunger-of-hadar", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "confusion", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "summon-aberration", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "modify-memory", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "telekinesis", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
    ],
    notes: ["These spells are always prepared and do not count against the number of Warlock spells you can prepare."],
  },
  featuresByLevel: {
    3: [
      {
        id: "awakened-mind",
        name: "Awakened Mind",
        level: 3,
        activation: "bonus-action",
        description: "You can form a telepathic connection between your mind and the mind of another creature.",
        notes: [
          "As a Bonus Action, choose one creature you can see within 30 feet.",
          "You and the chosen creature can communicate telepathically while within a number of miles equal to your Charisma modifier, minimum 1 mile.",
          "To understand each other, you each must mentally use a language the other knows.",
          "The connection lasts for a number of minutes equal to your Warlock level and ends early if you connect to a different creature.",
        ],
      },
      { id: "great-old-one-spells", name: "Great Old One Spells", level: 3, description: "The magic of your patron ensures that you always have certain spells prepared." },
      {
        id: "psychic-spells",
        name: "Psychic Spells",
        level: 3,
        description: "Your patron alters the nature of your damaging magic.",
        notes: [
          "When you cast a Warlock spell that deals damage, you can change its damage type to Psychic.",
          "When you cast a Warlock spell that is an Enchantment or Illusion, you can do so without Verbal or Somatic components.",
        ],
      },
    ],
    6: [
      {
        id: "clairvoyant-combatant",
        name: "Clairvoyant Combatant",
        level: 6,
        description: "When you form a telepathic bond with a creature using Awakened Mind, you can force it to make a Wisdom saving throw against your spell save DC.",
        notes: [
          "On a failed save, the creature has Disadvantage on attack rolls against you, and you have Advantage on attack rolls against it for the duration of the bond.",
          "Once you use this feature, you can't use it again until you finish a Short or Long Rest unless you expend a Pact Magic spell slot to restore its use.",
        ],
      },
    ],
    10: [
      {
        id: "eldritch-hex",
        name: "Eldritch Hex",
        level: 10,
        description: "Your alien patron grants you a powerful curse.",
        notes: [
          "You always have the Hex spell prepared.",
          "When you cast Hex and choose an ability, the target also has Disadvantage on saving throws of the chosen ability for the duration of the spell.",
        ],
      },
      {
        id: "thought-shield",
        name: "Thought Shield",
        level: 10,
        description: "Your thoughts can't be read by telepathy or other means unless you allow it.",
        notes: [
          "You have Resistance to Psychic damage.",
          "Whenever a creature deals Psychic damage to you, that creature takes the same amount of damage that you take.",
        ],
      },
    ],
    14: [
      {
        id: "create-thrall",
        name: "Create Thrall",
        level: 14,
        description: "You can enhance Summon Aberration with your patron's alien power.",
        notes: [
          "When you cast Summon Aberration, you can modify it so that it doesn't require Concentration; if you do, the duration becomes 1 minute.",
          "The Aberration gains Temporary Hit Points equal to your Warlock level plus your Charisma modifier.",
          "The first time each turn it hits a creature under the effect of your Hex, it deals extra Psychic damage equal to the bonus damage of that spell.",
        ],
      },
    ],
  },
};
