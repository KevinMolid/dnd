import type { CharacterSubclass } from "../../../../types";

export const wildMagicSorcery: CharacterSubclass = {
  id: "wild-magic-sorcery",
  name: "Wild Magic Sorcery",
  classId: "sorcerer",
  description: "Your innate magic comes from the forces of chaos, producing unpredictable surges that can bend probability and reality around you.",
  featuresByLevel: {
    3: [
      {
        id: "wild-magic-surge", name: "Wild Magic Surge", level: 3,
        description: "Your spellcasting can trigger unpredictable surges of untamed magic.",
        notes: ["Once per turn, immediately after you cast a Sorcerer spell with a spell slot, you can roll 1d20.", "If you roll a 20, roll on the Wild Magic Surge table to create a magical effect.", "If the resulting effect is a spell, it is too wild to be affected by your Metamagic."],
      },
      {
        id: "tides-of-chaos", name: "Tides of Chaos", level: 3,
        description: "You manipulate chaos to gain Advantage on one d20 Test before you roll it.",
        notes: ["Once used, you must cast a Sorcerer spell with a spell slot or finish a Long Rest before you can use this feature again.", "If you cast a Sorcerer spell with a spell slot before finishing a Long Rest, you automatically roll on the Wild Magic Surge table and then regain the use of Tides of Chaos."],
        usage: { type: "limited", uses: { type: "fixed", value: 1 }, recharge: "long-rest" },
      },
    ],
    6: [{
      id: "bend-luck", name: "Bend Luck", level: 6, activation: "reaction",
      description: "You spend 1 Sorcery Point to alter another creature's d20 Test.",
      notes: ["When another creature you can see rolls the d20 for a d20 Test, roll 1d4 and apply the result as a bonus or penalty of your choice to that creature's roll."],
    }],
    14: [{
      id: "controlled-chaos", name: "Controlled Chaos", level: 14,
      description: "You gain greater control over your Wild Magic Surges.",
      notes: ["Whenever you roll on the Wild Magic Surge table, you can roll twice and use either result."],
    }],
    18: [{
      id: "tamed-surge", name: "Tamed Surge", level: 18,
      description: "Immediately after you cast a Sorcerer spell with a spell slot, you can choose a Wild Magic Surge effect instead of rolling for it.",
      notes: ["You can choose any effect except the table's final row; if the chosen effect involves a roll, you must still make that roll.", "Once you use this feature, you can't do so again until you finish a Long Rest."],
      usage: { type: "limited", uses: { type: "fixed", value: 1 }, recharge: "long-rest" },
    }],
  },
};
