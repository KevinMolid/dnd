import type { Feat } from "../types";

export const feats: Feat[] = [
  {
    id: "alert",
    name: "Alert",
    category: "origin",
    traits: [
      {
        id: "alert",
        name: "Alert",
        description:
          "You gain a +5 bonus to Initiative. You can swap your Initiative with the Initiative of one willing ally at the start of combat.",
      },
    ],
  },
  {
    id: "crafter",
    name: "Crafter",
    category: "origin",
    traits: [
      {
        id: "crafter",
        name: "Crafter",
        description:
          "You gain proficiency with three different Artisan’s Tools of your choice. Whenever you buy a nonmagical item, you receive a 20 percent discount on it.",
      },
    ],
  },
  {
    id: "healer",
    name: "Healer",
    category: "origin",
    traits: [
      {
        id: "healer",
        name: "Healer",
        description:
          "When you use a Healer’s Kit to stabilize a creature, that creature also regains 1 Hit Point. As an action, you can expend one use of a Healer’s Kit to tend to a creature and restore 1d6 plus 4 Hit Points, plus additional healing equal to the creature’s number of Hit Dice. A creature can benefit from this healing only once per Long Rest.",
      },
    ],
  },
  {
    id: "lucky",
    name: "Lucky",
    category: "origin",
    traits: [
      {
        id: "lucky",
        name: "Lucky",
        description:
          "You have Luck Points equal to your Proficiency Bonus. When you roll a d20 for a D20 Test, you can spend 1 Luck Point to give yourself Advantage on the roll. You regain all expended Luck Points when you finish a Long Rest.",
      },
    ],
  },
  {
    id: "magic-initiate",
    name: "Magic Initiate",
    category: "origin",
    traits: [
      {
        id: "magic-initiate",
        name: "Magic Initiate",
        description:
          "You learn two cantrips and one 1st-level spell from the chosen spell list. You can cast the 1st-level spell once per Long Rest without a spell slot, and you can also cast it using any spell slots you have.",
      },
    ],
    grant: {
      type: "magic-initiate",
      spellListOptions: ["cleric", "druid", "wizard"],
    },
  },
  {
    id: "musician",
    name: "Musician",
    category: "origin",
    traits: [
      {
        id: "musician",
        name: "Musician",
        description:
          "You gain proficiency with three Musical Instruments of your choice. When you finish a Short or Long Rest, you can play a song and grant Heroic Inspiration to allies who hear the performance.",
      },
    ],
  },
  {
    id: "savage-attacker",
    name: "Savage Attacker",
    category: "origin",
    traits: [
      {
        id: "savage-attacker",
        name: "Savage Attacker",
        description:
          "Once per turn when you hit a target with a weapon, you can reroll the weapon’s damage dice and use either roll.",
      },
    ],
  },
  {
    id: "skilled",
    name: "Skilled",
    category: "origin",
    traits: [
      {
        id: "skilled",
        name: "Skilled",
        description:
          "You gain proficiency in any combination of three skills or tools of your choice.",
      },
    ],
    grant: {
      type: "skilled",
      chooseSkills: 3,
    },
  },
  {
    id: "tavern-brawler",
    name: "Tavern Brawler",
    category: "origin",
    traits: [
      {
        id: "tavern-brawler",
        name: "Tavern Brawler",
        description:
          "Your unarmed strikes and improvised weapons are especially effective in a fight. After you hit with an unarmed strike or improvised weapon, you can deal extra damage and pressure foes at close range.",
      },
    ],
  },
  {
    id: "tough",
    name: "Tough",
    category: "origin",
    traits: [
      {
        id: "tough",
        name: "Tough",
        description:
          "Your Hit Point maximum increases by an amount equal to twice your character level when you gain this feat. Whenever you gain a level thereafter, your Hit Point maximum increases by an additional 2 Hit Points.",
      },
    ],
  },
];