import type { CharacterSubclass } from "../../../types";

export const pathOfTheBerserker: CharacterSubclass = {
  id: "path-of-the-berserker",
  name: "Path of the Berserker",
  classId: "barbarian",
  description:
    "Barbarians who walk the Path of the Berserker channel their rage into violent fury, thriving in the chaos of battle as their rage empowers them.",

  featuresByLevel: {
    3: [
      {
        id: "frenzy",
        name: "Frenzy",
        level: 3,
        description:
          "Your Reckless Attacks become even more devastating while your Rage is active.",
        notes: [
          "If you use Reckless Attack while your Rage is active, you deal extra damage to the first target you hit on your turn with a Strength-based attack.",
          "To determine the extra damage, roll a number of d6s equal to your Rage Damage bonus and add them together.",
          "The damage has the same type as the weapon or Unarmed Strike used for the attack.",
        ],
      },
    ],

    6: [
      {
        id: "mindless-rage",
        name: "Mindless Rage",
        level: 6,
        description:
          "Your rage shields your mind from manipulation and fear.",
        notes: [
          "You have Immunity to the Charmed and Frightened conditions while your Rage is active.",
          "If you're Charmed or Frightened when you enter your Rage, the condition ends on you.",
        ],
      },
    ],

    10: [
      {
        id: "retaliation",
        name: "Retaliation",
        level: 10,
        description:
          "You can immediately strike back when enemies harm you.",
        notes: [
          "When you take damage from a creature that is within 5 feet of you, you can take a Reaction to make one melee attack against that creature.",
          "You can use a weapon or an Unarmed Strike for this attack.",
        ],
      },
    ],

    14: [
      {
        id: "intimidating-presence",
        name: "Intimidating Presence",
        level: 14,
        activation: "bonus-action",
        description:
          "You can unleash a terrifying aura fueled by your primal rage.",
        notes: [
          "As a Bonus Action, each creature of your choice in a 30-foot Emanation originating from you must make a Wisdom saving throw.",
          "The DC equals 8 plus your Strength modifier plus your Proficiency Bonus.",
          "On a failed save, a creature has the Frightened condition for 1 minute.",
          "At the end of each of the Frightened creature’s turns, it repeats the save, ending the effect on itself on a success.",
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
  },
};