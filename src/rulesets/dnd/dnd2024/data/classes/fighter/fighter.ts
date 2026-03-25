import type { CharacterClass } from "../../../types";

export const fighter: CharacterClass = {
  id: "fighter",
  name: "Fighter",
  hitDie: 10,
  primaryAbilities: ["str", "dex"],
  savingThrowProficiencies: ["str", "con"],
  armorTraining: ["light-armor", "medium-armor", "heavy-armor", "shields"],
  weaponProficiencies: ["simple-weapons", "martial-weapons"],
  toolProficiencies: [],
  skillChoice: {
    choose: 2,
    options: [
      "acrobatics",
      "animal-handling",
      "athletics",
      "history",
      "insight",
      "intimidation",
      "perception",
      "persuasion",
      "survival",
    ],
  },
  startingEquipment: {
    choose: 1,
    options: [
      {
        id: "fighter-starting-equipment-a",
        label:
          "Chain Mail, Greatsword, Flail, 8 Javelins, Dungeoneer’s Pack, and 4 GP",
        grants: [
          { type: "item", id: "chain-mail", quantity: 1 },
          { type: "item", id: "greatsword", quantity: 1 },
          { type: "item", id: "flail", quantity: 1 },
          { type: "item", id: "javelin", quantity: 8 },
          { type: "item", id: "dungeoneers-pack", quantity: 1 },
          { type: "currency", amount: 4, currency: "gp" },
        ],
      },
      {
        id: "fighter-starting-equipment-b",
        label:
          "Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Dungeoneer’s Pack, and 11 GP",
        grants: [
          { type: "item", id: "studded-leather-armor", quantity: 1 },
          { type: "item", id: "scimitar", quantity: 1 },
          { type: "item", id: "shortsword", quantity: 1 },
          { type: "item", id: "longbow", quantity: 1 },
          { type: "item", id: "arrow", quantity: 20 },
          { type: "item", id: "quiver", quantity: 1 },
          { type: "item", id: "dungeoneers-pack", quantity: 1 },
          { type: "currency", amount: 11, currency: "gp" },
        ],
      },
      {
        id: "fighter-starting-equipment-c",
        label: "155 GP",
        grants: [{ type: "currency", amount: 155, currency: "gp" }],
      },
    ],
  },
  subclasses: [
    {
      id: "battle-master",
      name: "Battle Master",
      description:
        "Battle Masters use martial techniques and tactical skill to dominate the battlefield.",
    },
    {
      id: "champion",
      name: "Champion",
      description:
        "Champions focus on raw physical excellence, discipline, and relentless combat skill.",
    },
    {
      id: "eldritch-knight",
      name: "Eldritch Knight",
      description:
        "Eldritch Knights blend martial prowess with arcane magic.",
    },
    {
      id: "psi-warrior",
      name: "Psi Warrior",
      description:
        "Psi Warriors awaken psionic power to enhance their battlefield abilities.",
    },
  ],
  weaponMasteryOptions: [
    "club",
    "dagger",
    "dart",
    "handaxe",
    "javelin",
    "light-crossbow",
    "mace",
    "quarterstaff",
    "rapier",
    "scimitar",
    "shortbow",
    "shortsword",
    "sickle",
    "sling",
    "spear",
    "battleaxe",
    "flail",
    "glaive",
    "greataxe",
    "greatclub",
    "greatsword",
    "halberd",
    "lance",
    "light-hammer",
    "longbow",
    "longsword",
    "maul",
    "morningstar",
    "pike",
    "trident",
    "war-pick",
    "warhammer",
    "whip",
    "heavy-crossbow",
    "hand-crossbow",
  ],
  featuresByLevel: {
    1: [
      {
        id: "fighting-style",
        name: "Fighting Style",
        level: 1,
        description:
          "You have honed your martial prowess and gain a Fighting Style feat of your choice.",
        notes: [
          "Defense is recommended.",
          "Whenever you gain a Fighter level, you can replace the feat you chose with a different Fighting Style feat.",
        ],
      },
      {
        id: "second-wind",
        name: "Second Wind",
        level: 1,
        activation: "bonus-action",
        description:
          "You have a limited well of physical and mental stamina that you can draw on.",
        notes: [
          "As a Bonus Action, you can regain Hit Points equal to 1d10 plus your Fighter level.",
          "You can use this feature twice at level 1.",
          "You regain one expended use when you finish a Short Rest.",
          "You regain all expended uses when you finish a Long Rest.",
          "You gain more uses at higher Fighter levels, as shown in the Fighter Features table.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 2 },
          recharge: "short-rest",
        },
      },
      {
        id: "weapon-mastery",
        name: "Weapon Mastery",
        level: 1,
        description:
          "Your training with weapons allows you to use the mastery properties of three kinds of Simple or Martial weapons of your choice.",
        notes: [
          "You choose three kinds of Simple or Martial weapons for Weapon Mastery at level 1.",
          "Whenever you finish a Long Rest, you can practice weapon drills and change one of those weapon choices.",
          "You gain the ability to use the mastery properties of more kinds of weapons at higher Fighter levels, as shown in the Weapon Mastery column of the Fighter Features table.",
        ],
      },
    ],
    2: [
      {
        id: "action-surge",
        name: "Action Surge",
        level: 2,
        description:
          "You can push yourself beyond your normal limits for a moment.",
        notes: [
          "On your turn, you can take one additional action, except the Magic action.",
          "Once you use this feature, you can’t do so again until you finish a Short or Long Rest.",
          "Starting at level 17, you can use it twice before a rest but only once on a turn.",
        ],
        usage: {
          type: "per-rest",
          rest: "short",
          uses: 1,
        },
      },
      {
        id: "tactical-mind",
        name: "Tactical Mind",
        level: 2,
        description:
          "You have a mind for tactics in and off the battlefield.",
        notes: [
          "When you fail an ability check, you can expend a use of your Second Wind to push yourself toward success.",
          "Rather than regaining Hit Points, you roll 1d10 and add the number rolled to the ability check, potentially turning it into a success.",
          "If the check still fails, this use of Second Wind isn’t expended.",
        ],
      },
    ],
    3: [
      {
        id: "fighter-subclass",
        name: "Fighter Subclass",
        level: 3,
        description:
          "You gain a Fighter subclass of your choice. A subclass is a specialization that grants you features at certain Fighter levels.",
      },
    ],
    4: [
      {
        id: "ability-score-improvement",
        name: "Ability Score Improvement",
        level: 4,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    5: [
      {
        id: "extra-attack",
        name: "Extra Attack",
        level: 5,
        description:
          "You can attack twice instead of once whenever you take the Attack action on your turn.",
      },
      {
        id: "tactical-shift",
        name: "Tactical Shift",
        level: 5,
        description:
          "Whenever you activate your Second Wind with a Bonus Action, you can move up to half your Speed without provoking Opportunity Attacks.",
      },
    ],
    6: [
      {
        id: "ability-score-improvement-2",
        name: "Ability Score Improvement",
        level: 6,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    7: [
      {
        id: "subclass-feature-7",
        name: "Subclass Feature",
        level: 7,
      },
    ],
    8: [
      {
        id: "ability-score-improvement-3",
        name: "Ability Score Improvement",
        level: 8,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    9: [
      {
        id: "indomitable",
        name: "Indomitable",
        level: 9,
        description:
          "If you fail a saving throw, you can reroll it with a bonus equal to your Fighter level.",
        notes: [
          "You must use the new roll.",
          "You can’t use this feature again until you finish a Long Rest.",
          "You can use this feature twice before a Long Rest starting at level 13 and three times before a Long Rest starting at level 17.",
        ],
        usage: {
          type: "per-rest",
          rest: "long",
          uses: 1,
        },
      },
      {
        id: "tactical-master",
        name: "Tactical Master",
        level: 9,
        description:
          "When you attack with a weapon whose mastery property you can use, you can replace that property with the Push, Sap, or Slow property for that attack.",
      },
    ],
    10: [
      {
        id: "subclass-feature-10",
        name: "Subclass Feature",
        level: 10,
      },
    ],
    11: [
      {
        id: "two-extra-attacks",
        name: "Two Extra Attacks",
        level: 11,
        description:
          "You can attack three times instead of once whenever you take the Attack action on your turn.",
      },
    ],
    12: [
      {
        id: "ability-score-improvement-4",
        name: "Ability Score Improvement",
        level: 12,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    13: [
      {
        id: "indomitable-2",
        name: "Indomitable",
        level: 13,
        description:
          "You can use Indomitable twice before you finish a Long Rest.",
        usage: {
          type: "per-rest",
          rest: "long",
          uses: 2,
        },
      },
      {
        id: "studied-attacks",
        name: "Studied Attacks",
        level: 13,
        description:
          "You study your opponents and learn from each attack you make.",
        notes: [
          "If you make an attack roll against a creature and miss, you have Advantage on your next attack roll against that creature before the end of your next turn.",
        ],
      },
    ],
    14: [
      {
        id: "ability-score-improvement-5",
        name: "Ability Score Improvement",
        level: 14,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    15: [
      {
        id: "subclass-feature-15",
        name: "Subclass Feature",
        level: 15,
      },
    ],
    16: [
      {
        id: "ability-score-improvement-6",
        name: "Ability Score Improvement",
        level: 16,
        description:
          "You gain the Ability Score Improvement feat or another feat of your choice for which you qualify.",
      },
    ],
    17: [
      {
        id: "action-surge-2",
        name: "Action Surge",
        level: 17,
        description:
          "You can use Action Surge twice before a Short or Long Rest, but only once on a turn.",
        usage: {
          type: "per-rest",
          rest: "short",
          uses: 2,
        },
      },
      {
        id: "indomitable-3",
        name: "Indomitable",
        level: 17,
        description:
          "You can use Indomitable three times before you finish a Long Rest.",
        usage: {
          type: "per-rest",
          rest: "long",
          uses: 3,
        },
      },
    ],
    18: [
      {
        id: "subclass-feature-18",
        name: "Subclass Feature",
        level: 18,
      },
    ],
    19: [
      {
        id: "epic-boon",
        name: "Epic Boon",
        level: 19,
        description:
          "You gain an Epic Boon feat or another feat of your choice for which you qualify.",
        notes: ["Boon of Combat Prowess is recommended."],
      },
    ],
    20: [
      {
        id: "three-extra-attacks",
        name: "Three Extra Attacks",
        level: 20,
        description:
          "You can attack four times instead of once whenever you take the Attack action on your turn.",
      },
    ],
  },
};