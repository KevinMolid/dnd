import type { MonsterDefinition } from "../monsterTypes";

/**
 * Complete SRD 5.2.1 Construct catalog.
 *
 * Source: System Reference Document 5.2.1 / 2024 Basic Rules.
 * Licensed under CC BY 4.0.
 */
export const constructs: MonsterDefinition[] = [
  {
    id: "animated-armor",
    name: "Animated Armor",
    type: "Construct",
    size: "Medium",
    alignment: "Unaligned",
    armorClass: 18,
    hp: 33,
    hitDice: "6d8 + 6",
    initiative: { modifier: 2, score: 12 },
    speed: { walk: 25 },
    stats: { str: 14, dex: 11, con: 13, int: 1, wis: 3, cha: 1 },
    damageImmunities: ["Poison", "Psychic"],
    conditionImmunities: [
      "Charmed",
      "Deafened",
      "Exhaustion",
      "Frightened",
      "Paralyzed",
      "Petrified",
      "Poisoned",
    ],
    senses: { blindsight: 60, passivePerception: 6 },
    languages: [],
    challengeRating: "1",
    xp: 200,
    proficiencyBonus: 2,
    actions: [
      {
        name: "Multiattack",
        text: "The armor makes two Slam attacks.",
      },
      {
        name: "Slam",
        text: "Melee Attack Roll: +4, reach 5 ft. Hit: 5 (1d6 + 2) Bludgeoning damage.",
      },
    ],
  },

  {
    id: "animated-flying-sword",
    name: "Animated Flying Sword",
    type: "Construct",
    size: "Small",
    alignment: "Unaligned",
    armorClass: 17,
    hp: 14,
    hitDice: "4d6",
    initiative: { modifier: 4, score: 14 },
    speed: { walk: 5, fly: 50, hover: true },
    stats: { str: 12, dex: 15, con: 11, int: 1, wis: 5, cha: 1 },
    savingThrows: { dex: 4 },
    damageImmunities: ["Poison", "Psychic"],
    conditionImmunities: [
      "Charmed",
      "Deafened",
      "Exhaustion",
      "Frightened",
      "Paralyzed",
      "Petrified",
      "Poisoned",
    ],
    senses: { blindsight: 60, passivePerception: 7 },
    languages: [],
    challengeRating: "1/4",
    xp: 50,
    proficiencyBonus: 2,
    actions: [
      {
        name: "Slash",
        text: "Melee Attack Roll: +4, reach 5 ft. Hit: 6 (1d8 + 2) Slashing damage.",
      },
    ],
  },

  {
    id: "animated-rug-of-smothering",
    name: "Animated Rug of Smothering",
    type: "Construct",
    size: "Large",
    alignment: "Unaligned",
    armorClass: 12,
    hp: 27,
    hitDice: "5d10",
    initiative: { modifier: 4, score: 14 },
    speed: { walk: 10 },
    stats: { str: 17, dex: 14, con: 10, int: 1, wis: 3, cha: 1 },
    damageImmunities: ["Poison", "Psychic"],
    conditionImmunities: [
      "Charmed",
      "Deafened",
      "Exhaustion",
      "Frightened",
      "Paralyzed",
      "Petrified",
      "Poisoned",
    ],
    senses: { blindsight: 60, passivePerception: 6 },
    languages: [],
    challengeRating: "2",
    xp: 450,
    proficiencyBonus: 2,
    actions: [
      {
        name: "Smother",
        text:
          "Melee Attack Roll: +5, reach 5 ft. Hit: 10 (2d6 + 3) Bludgeoning damage. Instead of dealing damage to a Medium or smaller target, the rug can Grapple it (escape DC 13). While grappled this way, the target is Blinded, Restrained, and suffocating, and takes 10 (2d6 + 3) Bludgeoning damage at the start of each of its turns. The rug can smother only one creature at a time. While it is smothering a creature, damage dealt to the rug is halved (round down), and the grappled creature takes the same amount of damage.",
      },
    ],
  },

  {
    id: "clay-golem",
    name: "Clay Golem",
    type: "Construct",
    size: "Large",
    alignment: "Unaligned",
    armorClass: 14,
    hp: 123,
    hitDice: "13d10 + 52",
    initiative: { modifier: 3, score: 13 },
    speed: { walk: 30 },
    stats: { str: 20, dex: 9, con: 18, int: 3, wis: 8, cha: 1 },
    damageResistances: ["Bludgeoning", "Piercing", "Slashing"],
    damageImmunities: ["Acid", "Poison", "Psychic"],
    conditionImmunities: [
      "Charmed",
      "Exhaustion",
      "Frightened",
      "Paralyzed",
      "Petrified",
      "Poisoned",
    ],
    senses: { darkvision: 60, passivePerception: 9 },
    languages: ["Common", "One other language"],
    challengeRating: "9",
    xp: 5000,
    proficiencyBonus: 4,
    traits: [
      {
        name: "Acid Absorption",
        text:
          "Whenever the golem would take Acid damage, it takes no damage and instead regains Hit Points equal to the Acid damage.",
      },
      {
        name: "Berserk",
        text:
          "Whenever the golem starts its turn Bloodied, roll 1d6. On a 6, it goes berserk and attacks the nearest creature it can see, or an object if no creature is close enough. It remains berserk until destroyed or no longer Bloodied.",
      },
      {
        name: "Immutable Form",
        text: "The golem can't shape-shift.",
      },
      {
        name: "Magic Resistance",
        text:
          "The golem has Advantage on saving throws against spells and other magical effects.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        text:
          "The golem makes two Slam attacks, or three Slam attacks if it used Hasten this turn.",
      },
      {
        name: "Slam",
        text:
          "Melee Attack Roll: +9, reach 5 ft. Hit: 10 (1d10 + 5) Bludgeoning damage plus 6 (1d12) Acid damage. The target's Hit Point maximum decreases by an amount equal to the Acid damage taken.",
      },
    ],
    bonusActions: [
      {
        name: "Hasten (Recharge 5–6)",
        text: "The golem takes the Dash and Disengage actions.",
      },
    ],
  },

  {
    id: "flesh-golem",
    name: "Flesh Golem",
    type: "Construct",
    size: "Medium",
    alignment: "Neutral",
    armorClass: 9,
    hp: 127,
    hitDice: "15d8 + 60",
    initiative: { modifier: -1, score: 9 },
    speed: { walk: 30 },
    stats: { str: 19, dex: 9, con: 18, int: 6, wis: 10, cha: 5 },
    damageImmunities: ["Lightning", "Poison"],
    conditionImmunities: [
      "Charmed",
      "Exhaustion",
      "Frightened",
      "Paralyzed",
      "Petrified",
      "Poisoned",
    ],
    senses: { darkvision: 60, passivePerception: 10 },
    languages: [
      "Understands Common plus one other language but can't speak",
    ],
    challengeRating: "5",
    xp: 1800,
    proficiencyBonus: 3,
    traits: [
      {
        name: "Aversion to Fire",
        text:
          "After taking Fire damage, the golem has Disadvantage on attack rolls and ability checks until the end of its next turn.",
      },
      {
        name: "Berserk",
        text:
          "Whenever the golem starts its turn Bloodied, roll 1d6. On a 6, it goes berserk and attacks the nearest creature it can see, or an object if no creature is close enough. It remains berserk until destroyed or no longer Bloodied. Its creator can temporarily calm it with an action and a successful DC 15 Charisma (Persuasion) check while within 60 feet and audible to the golem.",
      },
      {
        name: "Immutable Form",
        text: "The golem can't shape-shift.",
      },
      {
        name: "Lightning Absorption",
        text:
          "Whenever the golem is subjected to Lightning damage, it regains Hit Points equal to the Lightning damage dealt.",
      },
      {
        name: "Magic Resistance",
        text:
          "The golem has Advantage on saving throws against spells and other magical effects.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        text: "The golem makes two Slam attacks.",
      },
      {
        name: "Slam",
        text:
          "Melee Attack Roll: +7, reach 5 ft. Hit: 13 (2d8 + 4) Bludgeoning damage plus 4 (1d8) Lightning damage.",
      },
    ],
  },

  {
    id: "homunculus",
    name: "Homunculus",
    type: "Construct",
    size: "Tiny",
    alignment: "Neutral",
    armorClass: 13,
    hp: 4,
    hitDice: "1d4 + 2",
    initiative: { modifier: 2, score: 12 },
    speed: { walk: 20, fly: 40 },
    stats: { str: 4, dex: 15, con: 14, int: 10, wis: 10, cha: 7 },
    savingThrows: { wis: 2, cha: 0 },
    damageImmunities: ["Poison"],
    conditionImmunities: ["Charmed", "Poisoned"],
    senses: { darkvision: 60, passivePerception: 10 },
    languages: [
      "Understands Common plus one other language but can't speak",
    ],
    challengeRating: "0",
    xp: 10,
    proficiencyBonus: 2,
    traits: [
      {
        name: "Telepathic Bond",
        text:
          "While the homunculus and its master are on the same plane of existence, they can communicate telepathically with each other.",
      },
    ],
    actions: [
      {
        name: "Bite",
        text:
          "Melee Attack Roll: +4, reach 5 ft. Hit: 1 Piercing damage. Constitution Saving Throw: DC 12. Failure: Poisoned until the end of the homunculus's next turn. Failure by 5 or more: Poisoned for 1 minute; while Poisoned this way, the target is Unconscious, ending early if it takes damage.",
      },
    ],
  },

  {
    id: "iron-golem",
    name: "Iron Golem",
    type: "Construct",
    size: "Large",
    alignment: "Unaligned",
    armorClass: 20,
    hp: 252,
    hitDice: "24d10 + 120",
    initiative: { modifier: 9, score: 19 },
    speed: { walk: 30 },
    stats: { str: 24, dex: 9, con: 20, int: 3, wis: 11, cha: 1 },
    damageImmunities: ["Fire", "Poison", "Psychic"],
    conditionImmunities: [
      "Charmed",
      "Exhaustion",
      "Frightened",
      "Paralyzed",
      "Petrified",
      "Poisoned",
    ],
    senses: { darkvision: 120, passivePerception: 10 },
    languages: [
      "Understands Common plus two other languages but can't speak",
    ],
    challengeRating: "16",
    xp: 15000,
    proficiencyBonus: 5,
    traits: [
      {
        name: "Fire Absorption",
        text:
          "Whenever the golem is subjected to Fire damage, it regains Hit Points equal to the Fire damage dealt.",
      },
      {
        name: "Immutable Form",
        text: "The golem can't shape-shift.",
      },
      {
        name: "Magic Resistance",
        text:
          "The golem has Advantage on saving throws against spells and other magical effects.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        text:
          "The golem makes two attacks, using Bladed Arm or Fiery Bolt in any combination.",
      },
      {
        name: "Bladed Arm",
        text:
          "Melee Attack Roll: +12, reach 10 ft. Hit: 20 (3d8 + 7) Slashing damage plus 10 (3d6) Fire damage.",
      },
      {
        name: "Fiery Bolt",
        text:
          "Ranged Attack Roll: +10, range 120 ft. Hit: 36 (8d8) Fire damage.",
      },
      {
        name: "Poison Breath (Recharge 6)",
        text:
          "Constitution Saving Throw: DC 18, each creature in a 60-foot Cone. Failure: 55 (10d10) Poison damage. Success: Half damage.",
      },
    ],
  },

  {
    id: "shield-guardian",
    name: "Shield Guardian",
    type: "Construct",
    size: "Large",
    alignment: "Unaligned",
    armorClass: 17,
    hp: 142,
    hitDice: "15d10 + 60",
    initiative: { modifier: -1, score: 9 },
    speed: { walk: 30 },
    stats: { str: 18, dex: 8, con: 18, int: 7, wis: 10, cha: 3 },
    damageImmunities: ["Poison"],
    conditionImmunities: [
      "Charmed",
      "Exhaustion",
      "Frightened",
      "Paralyzed",
      "Petrified",
      "Poisoned",
    ],
    senses: { blindsight: 10, darkvision: 60, passivePerception: 10 },
    languages: ["Understands commands given in any language but can't speak"],
    challengeRating: "7",
    xp: 2900,
    proficiencyBonus: 3,
    traits: [
      {
        name: "Bound",
        text:
          "The guardian is magically bound to an amulet. While both are on the same plane, the wearer can telepathically call the guardian, and the guardian knows the amulet's direction and distance. While within 60 feet of the wearer, half the damage the wearer takes (round up) is transferred to the guardian.",
      },
      {
        name: "Regeneration",
        text:
          "The guardian regains 10 Hit Points at the start of each of its turns if it has at least 1 Hit Point.",
      },
      {
        name: "Spell Storing",
        text:
          "A spellcaster wearing the guardian's amulet can store one level 4 or lower spell in the guardian by casting it on the guardian from within 5 feet. The guardian can later cast the stored spell without components, using the original caster's spellcasting ability and chosen parameters. Storing or casting another spell removes the previous stored spell.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        text: "The guardian makes two Fist attacks.",
      },
      {
        name: "Fist",
        text:
          "Melee Attack Roll: +7, reach 10 ft. Hit: 11 (2d6 + 4) Bludgeoning damage plus 7 (2d6) Force damage.",
      },
    ],
    reactions: [
      {
        name: "Protection",
        text:
          "Trigger: An attack hits the guardian's amulet wearer while the wearer is within 5 feet. Response: The wearer gains +5 AC against the triggering attack, possibly causing it to miss, and keeps that bonus until the start of the guardian's next turn.",
      },
    ],
  },

  {
    id: "stone-golem",
    name: "Stone Golem",
    type: "Construct",
    size: "Large",
    alignment: "Unaligned",
    armorClass: 18,
    hp: 220,
    hitDice: "21d10 + 105",
    initiative: { modifier: 3, score: 13 },
    speed: { walk: 30 },
    stats: { str: 22, dex: 9, con: 20, int: 3, wis: 11, cha: 1 },
    damageImmunities: ["Poison", "Psychic"],
    conditionImmunities: [
      "Charmed",
      "Exhaustion",
      "Frightened",
      "Paralyzed",
      "Petrified",
      "Poisoned",
    ],
    senses: { darkvision: 120, passivePerception: 10 },
    languages: [
      "Understands Common plus two other languages but can't speak",
    ],
    challengeRating: "10",
    xp: 5900,
    proficiencyBonus: 4,
    traits: [
      {
        name: "Immutable Form",
        text: "The golem can't shape-shift.",
      },
      {
        name: "Magic Resistance",
        text:
          "The golem has Advantage on saving throws against spells and other magical effects.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        text:
          "The golem makes two attacks, using Slam or Force Bolt in any combination.",
      },
      {
        name: "Slam",
        text:
          "Melee Attack Roll: +10, reach 5 ft. Hit: 15 (2d8 + 6) Bludgeoning damage plus 9 (2d8) Force damage.",
      },
      {
        name: "Force Bolt",
        text:
          "Ranged Attack Roll: +9, range 120 ft. Hit: 22 (4d10) Force damage.",
      },
    ],
    bonusActions: [
      {
        name: "Slow (Recharge 5–6)",
        text:
          "The golem casts Slow without spell components, using Constitution as its spellcasting ability (spell save DC 17).",
      },
    ],
  },
];
