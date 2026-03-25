import type { CharacterSubclass } from "../../../types";

export const pathOfTheZealot: CharacterSubclass = {
  id: "path-of-the-zealot",
  name: "Path of the Zealot",
  classId: "barbarian",
  description:
    "Barbarians who follow the Path of the Zealot are infused with divine power, experiencing their Rage as an ecstatic union with a god or pantheon.",

  featuresByLevel: {
    3: [
      {
        id: "divine-fury",
        name: "Divine Fury",
        level: 3,
        description:
          "You can channel divine power into your strikes while your Rage is active.",
        notes: [
          "On each of your turns while your Rage is active, the first creature you hit with a weapon or an Unarmed Strike takes extra damage.",
          "The extra damage equals 1d6 plus half your Barbarian level (round down).",
          "The extra damage is Necrotic or Radiant; you choose the type each time you deal the damage.",
        ],
      },
      {
        id: "warrior-of-the-gods",
        name: "Warrior of the Gods",
        level: 3,
        activation: "bonus-action",
        description:
          "A divine entity helps ensure you can continue the fight by granting you a pool of healing dice.",
        notes: [
          "You have a pool of four d12s that you can spend to heal yourself.",
          "As a Bonus Action, you can expend dice from the pool, roll them, and regain a number of Hit Points equal to the roll's total.",
          "Your pool regains all expended dice when you finish a Long Rest.",
          "The pool’s maximum number of dice increases by one when you reach Barbarian levels 6 (5 dice), 12 (6 dice), and 17 (7 dice).",
        ],
        usage: {
          type: "limited",
          uses: {
            type: "level-based",
            levels: {
              3: 4,
              6: 5,
              12: 6,
              17: 7,
            },
          },
          recharge: "long-rest",
        },
      },
    ],

    6: [
      {
        id: "fanatical-focus",
        name: "Fanatical Focus",
        level: 6,
        description:
          "Your fervor lets you push through failed saving throws while raging.",
        notes: [
          "Once per active Rage, if you fail a saving throw, you can reroll it with a bonus equal to your Rage Damage bonus.",
          "You must use the new roll.",
        ],
      },
    ],

    10: [
      {
        id: "zealous-presence",
        name: "Zealous Presence",
        level: 10,
        activation: "bonus-action",
        description:
          "You unleash a divine battle cry that bolsters your allies.",
        notes: [
          "As a Bonus Action, up to ten other creatures of your choice within 60 feet of you gain Advantage on attack rolls and saving throws until the start of your next turn.",
          "Once you use this feature, you can’t use it again until you finish a Long Rest.",
          "You can also restore your use of it by expending a use of your Rage (no action required).",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
      },
    ],

    14: [
      {
        id: "rage-of-the-gods",
        name: "Rage of the Gods",
        level: 14,
        description:
          "When you Rage, you can assume the form of a divine warrior and gain celestial resilience.",
        notes: [
          "When you activate your Rage, you can assume the form of a divine warrior.",
          "This form lasts for 1 minute or until you drop to 0 Hit Points.",
          "Once you use this feature, you can’t do so again until you finish a Long Rest.",
          "Flight. You have a Fly Speed equal to your Speed and can hover.",
          "Resistance. You have Resistance to Necrotic, Psychic, and Radiant damage.",
          "Revivification. When a creature within 30 feet of you would drop to 0 Hit Points, you can take a Reaction to expend a use of your Rage to instead change the target’s Hit Points to a number equal to your Barbarian level.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
      },
    ],
  },
};