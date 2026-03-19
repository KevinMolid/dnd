import type { CharacterClass } from "../../types";

export const rogue: CharacterClass = {
  id: "rogue",
  name: "Rogue",
  hitDie: 8,
  primaryAbilities: ["dex"],
  savingThrowProficiencies: ["dex", "int"],
  armorTraining: ["light-armor"],
  weaponProficiencies: ["simple-weapons", "martial-finesse-or-light"],
  toolProficiencies: ["thieves-tools"],
  skillChoice: {
    choose: 4,
    options: [
      "acrobatics",
      "athletics",
      "deception",
      "insight",
      "intimidation",
      "investigation",
      "perception",
      "persuasion",
      "sleight-of-hand",
      "stealth",
    ],
  },
  featuresByLevel: {
    1: [
      { id: "expertise", name: "Expertise", level: 1 },
      { id: "sneak-attack", name: "Sneak Attack", level: 1 },
      { id: "thieves-cant", name: "Thieves’ Cant", level: 1 },
      { id: "weapon-mastery", name: "Weapon Mastery", level: 1 },
    ],
    2: [{ id: "cunning-action", name: "Cunning Action", level: 2 }],
    3: [
      { id: "rogue-subclass", name: "Rogue Subclass", level: 3 },
      { id: "steady-aim", name: "Steady Aim", level: 3 },
    ],
    4: [
      {
        id: "ability-score-improvement",
        name: "Ability Score Improvement",
        level: 4,
      },
    ],
    5: [
      { id: "cunning-strike", name: "Cunning Strike", level: 5 },
      { id: "uncanny-dodge", name: "Uncanny Dodge", level: 5 },
    ],
    6: [{ id: "expertise-2", name: "Expertise", level: 6 }],
    7: [
      { id: "evasion", name: "Evasion", level: 7 },
      { id: "reliable-talent", name: "Reliable Talent", level: 7 },
    ],
    8: [
      {
        id: "ability-score-improvement-2",
        name: "Ability Score Improvement",
        level: 8,
      },
    ],
    9: [{ id: "subclass-feature-9", name: "Subclass Feature", level: 9 }],
    10: [
      {
        id: "ability-score-improvement-3",
        name: "Ability Score Improvement",
        level: 10,
      },
    ],
    11: [
      {
        id: "improved-cunning-strike",
        name: "Improved Cunning Strike",
        level: 11,
      },
    ],
    12: [
      {
        id: "ability-score-improvement-4",
        name: "Ability Score Improvement",
        level: 12,
      },
    ],
    13: [{ id: "subclass-feature-13", name: "Subclass Feature", level: 13 }],
    14: [{ id: "devious-strikes", name: "Devious Strikes", level: 14 }],
    15: [{ id: "slippery-mind", name: "Slippery Mind", level: 15 }],
    16: [
      {
        id: "ability-score-improvement-5",
        name: "Ability Score Improvement",
        level: 16,
      },
    ],
    17: [{ id: "subclass-feature-17", name: "Subclass Feature", level: 17 }],
    18: [{ id: "elusive", name: "Elusive", level: 18 }],
    19: [{ id: "epic-boon", name: "Epic Boon", level: 19 }],
    20: [{ id: "stroke-of-luck", name: "Stroke of Luck", level: 20 }],
  },
};