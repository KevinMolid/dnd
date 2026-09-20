import type { CharacterSubclass } from "../../../../types";

export const clockworkSorcery: CharacterSubclass = {
  id: "clockwork-sorcery",
  name: "Clockwork Sorcery",
  classId: "sorcerer",
  description: "The cosmic force of order has suffused you with magic, linking your power to Mechanus and the orderly beings that inhabit it.",
  spellcasting: {
    id: "clockwork-sorcery-spellcasting", name: "Clockwork Spells", sourceType: "subclass", sourceId: "clockwork-sorcery",
    castingAbility: "cha", spellListId: "sorcerer", progressionType: "custom", preparationMode: "custom", ritualCasting: false,
    fixedSpells: [
      { spellId: "aid", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "alarm", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "lesser-restoration", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "protection-from-evil-and-good", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "dispel-magic", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "protection-from-energy", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "freedom-of-movement", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "summon-construct", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "greater-restoration", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "wall-of-force", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
    ],
    notes: ["These spells are always prepared and do not count against the number of Sorcerer spells you can prepare."],
  },
  featuresByLevel: {
    3: [
      { id: "clockwork-spells", name: "Clockwork Spells", level: 3, description: "Your connection to cosmic order ensures that you always have certain spells prepared." },
      {
        id: "restore-balance", name: "Restore Balance", level: 3, activation: "reaction",
        description: "You can cancel the influence of Advantage or Disadvantage on a nearby d20 Test.",
        notes: ["When a creature you can see within 60 feet is about to roll a d20 with Advantage or Disadvantage, you can take a Reaction to prevent the roll from being affected by Advantage and Disadvantage.", "You can use this feature a number of times equal to your Charisma modifier, minimum once, and regain all uses on a Long Rest."],
      },
    ],
    6: [{
      id: "bastion-of-law", name: "Bastion of Law", level: 6, activation: "action",
      description: "You spend Sorcery Points to create a protective ward around a creature you can see within 30 feet.",
      notes: ["Spend 1 to 5 Sorcery Points; the ward is represented by that many d8s.", "When the warded creature takes damage, it can expend any number of those dice, roll them, and reduce the damage by the total.", "The ward lasts until you finish a Long Rest or use this feature again."],
    }],
    14: [{
      id: "trance-of-order", name: "Trance of Order", level: 14, activation: "bonus-action",
      description: "You align your consciousness with the calculations of Mechanus for 1 minute.",
      notes: ["Attack rolls against you can't benefit from Advantage.", "Whenever you make a d20 Test, you can treat a roll of 9 or lower on the d20 as a 10.", "After using this feature, you can't use it again until a Long Rest unless you spend 5 Sorcery Points to restore its use."],
      usage: { type: "limited", uses: { type: "fixed", value: 1 }, recharge: "long-rest" },
    }],
    18: [{
      id: "clockwork-cavalcade", name: "Clockwork Cavalcade", level: 18, activation: "action",
      description: "You summon spirits of order into a 30-foot Cube originating from you.",
      notes: ["Choose any combination of the following effects in the Cube: Heal, Repair, and Dispel.", "Heal: distribute up to 100 Hit Points among creatures of your choice in the Cube.", "Repair: damaged objects entirely in the Cube are repaired instantly.", "Dispel: every spell of level 6 or lower ends on creatures and objects of your choice in the Cube.", "After using this feature, you can't use it again until a Long Rest unless you spend 7 Sorcery Points to restore its use."],
      usage: { type: "limited", uses: { type: "fixed", value: 1 }, recharge: "long-rest" },
    }],
  },
};
