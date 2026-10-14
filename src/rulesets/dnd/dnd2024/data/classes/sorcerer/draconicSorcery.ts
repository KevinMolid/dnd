import type { CharacterSubclass } from "../../../../types";

export const draconicSorcery: CharacterSubclass = {
  id: "draconic-sorcery",
  name: "Draconic Sorcery",
  classId: "sorcerer",
  description: "Your innate magic carries the power of dragons, whether inherited, bestowed, or absorbed from a source steeped in draconic power.",
  spellcasting: {
    id: "draconic-sorcery-spellcasting", name: "Draconic Spells", sourceType: "subclass", sourceId: "draconic-sorcery",
    castingAbility: "cha", spellListId: "sorcerer", progressionType: "custom", preparationMode: "custom", ritualCasting: false,
    fixedSpells: [
      { spellId: "alter-self", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "chromatic-orb", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "command", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "dragons-breath", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "fear", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "fly", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "arcane-eye", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "charm-monster", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "legend-lore", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "summon-dragon", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
    ],
    notes: ["These spells are always prepared and do not count against the number of Sorcerer spells you can prepare."],
  },
  featuresByLevel: {
    3: [
      {
        id: "draconic-resilience", name: "Draconic Resilience", level: 3,
        description: "Draconic magic manifests physically, toughening your body.",
        notes: ["Your Hit Point maximum increases by 3 and increases by 1 whenever you gain another Sorcerer level.", "Parts of you are covered by dragon-like scales.", "While you aren't wearing armor, your base Armor Class equals 10 + your Dexterity modifier + your Charisma modifier."],
      },
      { id: "draconic-spells", name: "Draconic Spells", level: 3, description: "Your draconic origin ensures that you always have certain spells prepared." },
    ],
    6: [{
      id: "elemental-affinity", name: "Elemental Affinity", level: 6,
      description: "Choose Acid, Cold, Fire, Lightning, or Poison as the damage type associated with your draconic magic.",
      notes: ["You have Resistance to the chosen damage type.", "When you cast a spell that deals that damage type, add your Charisma modifier to one damage roll of the spell."],
    }],
    14: [{
      id: "dragon-wings", name: "Dragon Wings", level: 14, activation: "bonus-action",
      description: "You manifest draconic wings for 1 hour or until you dismiss them.",
      notes: ["You gain a Fly Speed of 60 feet for the duration.", "After using this feature, you can't use it again until a Long Rest unless you spend 3 Sorcery Points to restore its use."],
      usage: { type: "limited", uses: { type: "fixed", value: 1 }, recharge: "long-rest" },
    }],
    18: [{
      id: "dragon-companion", name: "Dragon Companion", level: 18,
      description: "Your bond with draconic magic lets you call forth a dragon with unusual ease.",
      notes: ["You can cast Summon Dragon without a Material component.", "You can cast it once without a spell slot and regain that use when you finish a Long Rest.", "When you start casting the spell, you can modify it so it doesn't require Concentration; if you do, its duration becomes 1 minute for that casting."],
      usage: { type: "limited", uses: { type: "fixed", value: 1 }, recharge: "long-rest" },
    }],
  },
};
