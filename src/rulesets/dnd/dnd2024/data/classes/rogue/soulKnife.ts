import type { CharacterSubclass } from "../../../types";

export const soulknife: CharacterSubclass = {
  id: "soulknife",
  name: "Soulknife",
  classId: "rogue",
  description:
    "A Soulknife strikes with the mind, channeling psionic power into blades of psychic energy and uncanny talents that cut through both physical and mental defenses.",

  featuresByLevel: {
    3: [
      {
        id: "psionic-power",
        name: "Psionic Power",
        level: 3,
        description:
          "You harbor a wellspring of psionic energy represented by Psionic Energy Dice, which fuel various powers of your Soulknife features.",
        notes: [
          "Your psionic power is represented by your Psionic Energy Dice.",
          "Soulknife Energy Dice — Rogue Level 3: d6, 4 dice.",
          "Soulknife Energy Dice — Rogue Level 5: d8, 6 dice.",
          "Soulknife Energy Dice — Rogue Level 9: d8, 8 dice.",
          "Soulknife Energy Dice — Rogue Level 11: d10, 8 dice.",
          "Soulknife Energy Dice — Rogue Level 13: d10, 10 dice.",
          "Soulknife Energy Dice — Rogue Level 17: d12, 12 dice.",
          "Any features in this subclass that use a Psionic Energy Die use only the dice from this subclass.",
          "Some powers expend a Psionic Energy Die as specified in the power’s description, and you can’t use a power if it requires a die when your Psionic Energy Dice are all expended.",
          "You regain one expended Psionic Energy Die when you finish a Short Rest, and you regain all of them when you finish a Long Rest.",
          "Psi-Bolstered Knack: If you fail an ability check using a skill or tool with which you have proficiency, you can roll one Psionic Energy Die and add the number rolled to the check, potentially turning the failure into success. The die is expended only if the roll then succeeds.",
          "Psychic Whispers: As a Magic action, choose one or more creatures you can see, up to a number of creatures equal to your Proficiency Bonus, and roll one Psionic Energy Die. For a number of hours equal to the number rolled, the chosen creatures can speak telepathically with you, and you can speak telepathically with them. To send or receive a message, you and the other creature must be within 1 mile of each other. A creature can end the telepathic connection at any time (no action required). The first time you use this power after each Long Rest, you don’t expend the Psionic Energy Die. All other times, you expend the die.",
        ],
      },
      {
        id: "psychic-blades",
        name: "Psychic Blades",
        level: 3,
        description:
          "You can manifest shimmering blades of psychic energy to strike your foes.",
        notes: [
          "Whenever you take the Attack action or make an Opportunity Attack, you can manifest a Psychic Blade in your free hand and make the attack with that blade.",
          "Weapon Category: Simple Melee.",
          "On a hit, the blade deals 1d6 Psychic damage plus the ability modifier used for the attack roll.",
          "Properties: Finesse, Thrown (range 60/120 feet).",
          "Mastery: Vex. You can use this property, and it doesn’t count against the number of properties you can use with Weapon Mastery.",
          "The blade vanishes immediately after it hits or misses its target, and it leaves no mark if it deals damage.",
          "After you attack with the blade on your turn, you can make a melee or ranged attack with a second psychic blade as a Bonus Action on the same turn if your other hand is free to create it.",
          "The damage die of this bonus attack is 1d4 instead of 1d6.",
        ],
      },
    ],

    9: [
      {
        id: "soul-blades",
        name: "Soul Blades",
        level: 9,
        description:
          "You can now use additional psionic powers through your Psychic Blades.",
        notes: [
          "Homing Strikes: If you make an attack roll with your Psychic Blade and miss the target, you can roll one Psionic Energy Die and add the number rolled to the attack roll. If this causes the attack to hit, the die is expended.",
          "Psychic Teleportation: As a Bonus Action, you can manifest a Psychic Blade, expend one Psionic Energy Die and roll it, and throw the blade at an unoccupied space you can see up to a number of feet away equal to 10 times the number rolled. You then teleport to that space, and the blade vanishes.",
        ],
      },
    ],

    13: [
      {
        id: "psychic-veil",
        name: "Psychic Veil",
        level: 13,
        activation: "action",
        description:
          "You can weave a veil of psychic static to mask yourself from sight.",
        notes: [
          "As a Magic action, you gain the Invisible condition for 1 hour or until you dismiss the effect (no action required).",
          "This invisibility ends early immediately after you deal damage to a creature or you force a creature to make a saving throw.",
          "Once you use this feature, you can’t do so again until you finish a Long Rest unless you expend one Psionic Energy Die (no action required) to restore your use of it.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
      },
    ],

    17: [
      {
        id: "rend-mind",
        name: "Rend Mind",
        level: 17,
        description:
          "You can sweep your Psychic Blades through a creature’s mind, stunning it with psionic force.",
        notes: [
          "When you use your Psychic Blades to deal Sneak Attack damage to a creature, you can force that target to make a Wisdom saving throw.",
          "The DC equals 8 plus your Dexterity modifier plus your Proficiency Bonus.",
          "If the save fails, the target has the Stunned condition for 1 minute.",
          "The Stunned target repeats the save at the end of each of its turns, ending the effect on itself on a success.",
          "Once you use this feature, you can’t do so again until you finish a Long Rest unless you expend three Psionic Energy Dice (no action required) to restore your use of it.",
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