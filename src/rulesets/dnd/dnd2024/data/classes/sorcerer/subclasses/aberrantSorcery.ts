import type { CharacterSubclass } from "../../../../types";

export const aberrantSorcery: CharacterSubclass = {
  id: "aberrant-sorcery",
  name: "Aberrant Sorcery",
  classId: "sorcerer",
  description: "An alien influence has awakened psionic power within you, allowing your magic to reach directly into other minds and warp reality.",
  spellcasting: {
    id: "aberrant-sorcery-spellcasting",
    name: "Psionic Spells",
    sourceType: "subclass",
    sourceId: "aberrant-sorcery",
    castingAbility: "cha",
    spellListId: "sorcerer",
    progressionType: "custom",
    preparationMode: "custom",
    ritualCasting: false,
    fixedSpells: [
      { spellId: "arms-of-hadar", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "calm-emotions", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "detect-thoughts", minCharacterLevel: 3, spellLevel: 2, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "dissonant-whispers", minCharacterLevel: 3, spellLevel: 1, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "mind-sliver", minCharacterLevel: 3, spellLevel: 0, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "hunger-of-hadar", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "sending", minCharacterLevel: 5, spellLevel: 3, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "evards-black-tentacles", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "summon-aberration", minCharacterLevel: 7, spellLevel: 4, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "rarys-telepathic-bond", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
      { spellId: "telekinesis", minCharacterLevel: 9, spellLevel: 5, alwaysPrepared: true, countsAgainstLimit: false },
    ],
    notes: ["These spells are always prepared and do not count against the number of Sorcerer spells you can prepare."],
  },
  featuresByLevel: {
    3: [
      { id: "psionic-spells", name: "Psionic Spells", level: 3, description: "Your aberrant origin ensures that you always have a collection of psionic spells prepared." },
      {
        id: "telepathic-speech", name: "Telepathic Speech", level: 3, activation: "bonus-action",
        description: "You form a temporary telepathic connection with one creature you can see within 30 feet.",
        notes: [
          "You and the creature can communicate telepathically while within a number of miles of each other equal to your Charisma modifier, minimum 1 mile.",
          "To understand each other, you must each mentally use a language the other knows.",
          "The connection lasts for a number of minutes equal to your Sorcerer level and ends early if you use this feature on a different creature.",
        ],
      },
    ],
    6: [
      {
        id: "psionic-sorcery", name: "Psionic Sorcery", level: 6,
        description: "You can cast your Psionic Spells by channeling Sorcery Points directly into them.",
        notes: [
          "When you cast a level 1+ spell from your Psionic Spells feature, you can spend Sorcery Points equal to the spell's level instead of expending a spell slot.",
          "If cast with Sorcery Points, the spell requires no Verbal or Somatic components and no Material components unless they are consumed or have a specified cost.",
        ],
      },
      { id: "psychic-defenses", name: "Psychic Defenses", level: 6, description: "Your altered mind is difficult to assault.", notes: ["You have Resistance to Psychic damage.", "You have Advantage on saving throws to avoid or end the Charmed or Frightened condition."] },
    ],
    14: [{
      id: "revelation-in-flesh", name: "Revelation in Flesh", level: 14, activation: "bonus-action",
      description: "You spend Sorcery Points to manifest aberrant adaptations for 10 minutes.",
      notes: [
        "For each Sorcery Point spent, choose one benefit; you can choose multiple different benefits at once.",
        "Aquatic Adaptation: gain a Swim Speed equal to your Speed and breathe underwater.",
        "Glistening Flight: gain a Fly Speed equal to your Speed and hover.",
        "See the Invisible: see Invisible creatures within 60 feet unless they have Total Cover.",
        "Wormlike Movement: your body and equipment become pliable; you can move through spaces as narrow as 1 inch and spend 5 feet of movement to escape nonmagical restraints or the Grappled condition.",
      ],
    }],
    18: [{
      id: "warping-implosion", name: "Warping Implosion", level: 18, activation: "bonus-action",
      description: "You teleport through a space-warping anomaly and pull nearby creatures toward the point you left.",
      notes: [
        "Teleport to an unoccupied space you can see within 120 feet.",
        "Each creature within 30 feet of the space you left makes a Strength saving throw against your spell save DC.",
        "On a failed save, a creature takes 3d10 Force damage and is pulled straight toward that space, ending as close as possible. On a success, it takes half damage only.",
        "After using this feature, you can't use it again until a Long Rest unless you spend 5 Sorcery Points to restore its use.",
      ],
      usage: { type: "limited", uses: { type: "fixed", value: 1 }, recharge: "long-rest" },
    }],
  },
};
