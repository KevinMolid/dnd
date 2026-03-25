import type { CharacterSubclass } from "../../../types";

export const thief: CharacterSubclass = {
  id: "thief",
  name: "Thief",
  classId: "rogue",
  description:
    "A Thief is the classic adventurer: burglar, treasure hunter, and explorer, using agility, stealth, and clever hands to reach hidden places and make the most of magical loot.",

  featuresByLevel: {
    3: [
      {
        id: "fast-hands",
        name: "Fast Hands",
        level: 3,
        activation: "bonus-action",
        description:
          "You can use your Bonus Action for deft manipulation, quick theft, or activating certain magic items.",
        notes: [
          "As a Bonus Action, you can do one of the following.",
          "Sleight of Hand. Make a Dexterity (Sleight of Hand) check to pick a lock or disarm a trap with Thieves' Tools or to pick a pocket.",
          "Use an Object. Take the Utilize action, or take the Magic action to use a magic item that requires that action.",
        ],
      },
      {
        id: "second-story-work",
        name: "Second-Story Work",
        level: 3,
        description:
          "You’ve trained to get into especially hard-to-reach places.",
        notes: [
          "Climber. You gain a Climb Speed equal to your Speed.",
          "Jumper. You can determine your jump distance using your Dexterity rather than your Strength.",
        ],
      },
    ],

    9: [
      {
        id: "supreme-sneak",
        name: "Supreme Sneak",
        level: 9,
        description:
          "Your stealth and ambush techniques improve, granting you a special Cunning Strike option.",
        notes: [
          "Stealth Attack (Cost: 1d6). If you have the Hide action’s Invisible condition, this attack doesn’t end that condition on you if you end the turn behind Three-Quarters Cover or Total Cover.",
        ],
      },
    ],

    13: [
      {
        id: "use-magic-device",
        name: "Use Magic Device",
        level: 13,
        description:
          "You’ve learned how to maximize use of magic items.",
        notes: [
          "Attunement. You can attune to up to four magic items at once.",
          "Charges. Whenever you use a magic item property that expends charges, roll 1d6. On a roll of 6, you use the property without expending the charges.",
          "Scrolls. You can use any Spell Scroll, using Intelligence as your spellcasting ability for the spell.",
          "If the spell is a cantrip or a level 1 spell, you cast it reliably.",
          "If the scroll contains a higher-level spell, you must first succeed on an Intelligence (Arcana) check (DC 10 plus the spell’s level).",
          "On a successful check, you cast the spell from the scroll.",
          "On a failed check, the scroll disintegrates.",
        ],
      },
    ],

    17: [
      {
        id: "thiefs-reflexes",
        name: "Thief’s Reflexes",
        level: 17,
        description:
          "You are adept at laying ambushes and quickly escaping danger.",
        notes: [
          "You can take two turns during the first round of any combat.",
          "You take your first turn at your normal Initiative and your second turn at your Initiative minus 10.",
        ],
      },
    ],
  },
};