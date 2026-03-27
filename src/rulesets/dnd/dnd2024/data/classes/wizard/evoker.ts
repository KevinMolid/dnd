import type { CharacterSubclass } from "../../../types";

export const evoker: CharacterSubclass = {
  id: "evoker",
  name: "Evoker",
  classId: "wizard",
  description:
    "Evokers specialize in elemental magic, shaping destructive spells into precise and overwhelming force.",

  featuresByLevel: {
    3: [
      {
        id: "evocation-savant",
        name: "Evocation Savant",
        level: 3,
        description:
          "Your studies focus on the Evocation school, letting you expand your spellbook with explosive elemental magic.",
        notes: [
          "Choose two Wizard spells from the Evocation school, each of which must be no higher than level 2, and add them to your spellbook for free.",
          "Whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Evocation school to your spellbook for free.",
          "The chosen spell must be of a level for which you have spell slots.",
        ],
      },
      {
        id: "potent-cantrip",
        name: "Potent Cantrip",
        level: 3,
        description:
          "Your damaging cantrips affect even creatures that avoid the brunt of the effect.",
        notes: [
          "When you cast a cantrip at a creature and you miss with the attack roll against it or the target succeeds on a saving throw against the cantrip, the target still takes half the cantrip’s damage, if any.",
          "The target suffers no additional effect from the cantrip on a miss or successful save unless the spell says otherwise.",
        ],
      },
    ],
    6: [
      {
        id: "sculpt-spells",
        name: "Sculpt Spells",
        level: 6,
        description:
          "You can create pockets of relative safety within the effects of your evocation spells.",
        notes: [
          "When you cast an Evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 plus the spell’s level.",
          "The chosen creatures automatically succeed on their saving throws against the spell.",
          "If a chosen creature would normally take half damage on a successful save against the spell, it instead takes no damage.",
        ],
      },
    ],
    10: [
      {
        id: "empowered-evocation",
        name: "Empowered Evocation",
        level: 10,
        description:
          "Your mastery of evocation lets you pour extra force into your damaging spells.",
        notes: [
          "Whenever you cast a Wizard spell from the Evocation school, you can add your Intelligence modifier to one damage roll of that spell.",
        ],
      },
    ],
    14: [
      {
        id: "overchannel",
        name: "Overchannel",
        level: 14,
        description:
          "You can maximize the power of your lesser spells, though repeated use comes at a terrible cost.",
        notes: [
          "When you cast a Wizard spell with a spell slot of levels 1–5 that deals damage, you can deal maximum damage with that spell on the turn you cast it.",
          "The first time you do so, you suffer no adverse effect.",
          "If you use this feature again before you finish a Long Rest, you take 2d12 Necrotic damage for each level of the spell slot immediately after you cast it.",
          "This damage ignores Resistance and Immunity.",
          "Each time you use this feature again before finishing a Long Rest, the Necrotic damage per spell level increases by 1d12.",
        ],
      },
    ],
  },
};