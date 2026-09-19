import type { Species } from "../../types";

export const dragonborn = {
  id: "dragonborn",

  name: "Dragonborn",

  size: "Medium",

  speed: 30,

  languages: ["common", "draconic"],

  choices: [
    {
      id: "draconic-ancestry",
      name: "Draconic Ancestry",
      choose: 1,
      options: [
        {
          id: "black",
          name: "Black",
          description:
            "Your draconic ancestry is Black. Your Breath Weapon deals Acid damage, and you have Resistance to Acid damage.",
        },
        {
          id: "blue",
          name: "Blue",
          description:
            "Your draconic ancestry is Blue. Your Breath Weapon deals Lightning damage, and you have Resistance to Lightning damage.",
        },
        {
          id: "brass",
          name: "Brass",
          description:
            "Your draconic ancestry is Brass. Your Breath Weapon deals Fire damage, and you have Resistance to Fire damage.",
        },
        {
          id: "bronze",
          name: "Bronze",
          description:
            "Your draconic ancestry is Bronze. Your Breath Weapon deals Lightning damage, and you have Resistance to Lightning damage.",
        },
        {
          id: "copper",
          name: "Copper",
          description:
            "Your draconic ancestry is Copper. Your Breath Weapon deals Acid damage, and you have Resistance to Acid damage.",
        },
        {
          id: "gold",
          name: "Gold",
          description:
            "Your draconic ancestry is Gold. Your Breath Weapon deals Fire damage, and you have Resistance to Fire damage.",
        },
        {
          id: "green",
          name: "Green",
          description:
            "Your draconic ancestry is Green. Your Breath Weapon deals Poison damage, and you have Resistance to Poison damage.",
        },
        {
          id: "red",
          name: "Red",
          description:
            "Your draconic ancestry is Red. Your Breath Weapon deals Fire damage, and you have Resistance to Fire damage.",
        },
        {
          id: "silver",
          name: "Silver",
          description:
            "Your draconic ancestry is Silver. Your Breath Weapon deals Cold damage, and you have Resistance to Cold damage.",
        },
        {
          id: "white",
          name: "White",
          description:
            "Your draconic ancestry is White. Your Breath Weapon deals Cold damage, and you have Resistance to Cold damage.",
        },
      ],
    },
  ],

  traits: [
    {
      id: "draconic-ancestry",
      name: "Draconic Ancestry",
      description:
        "Your lineage stems from a dragon progenitor. Choose Black, Blue, Brass, Bronze, Copper, Gold, Green, Red, Silver, or White. Your choice determines the damage type of your Breath Weapon and Damage Resistance traits.",
      effects: [
        {
          type: "choice-ref",
          choiceId: "draconic-ancestry",
        },
      ],
    },

    {
      id: "breath-weapon",
      name: "Breath Weapon",
      description:
        "When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in either a 15-foot Cone or a 30-foot Line that is 5 feet wide. Each creature in that area must make a Dexterity saving throw against a DC equal to 8 + your Constitution modifier + your Proficiency Bonus. On a failed save, a creature takes 1d10 damage of the type determined by your Draconic Ancestry, or half as much damage on a successful save. The damage increases to 2d10 at level 5, 3d10 at level 11, and 4d10 at level 17. You can use this trait a number of times equal to your Proficiency Bonus, regaining all expended uses when you finish a Long Rest.",
      usage: {
        type: "limited",
        uses: {
          type: "proficiency-bonus",
        },
        recharge: "long-rest",
      },
      notes: [
        "Replace one attack in the Attack action.",
        "Area: 15-foot Cone or 30-foot Line that is 5 feet wide.",
        "Save: Dexterity, DC 8 + Constitution modifier + Proficiency Bonus.",
        "Damage type is determined by your Draconic Ancestry.",
        "Damage: 1d10 at level 1, 2d10 at level 5, 3d10 at level 11, 4d10 at level 17.",
      ],
    },

    {
      id: "damage-resistance",
      name: "Damage Resistance",
      description:
        "You have Resistance to the damage type determined by your Draconic Ancestry: Acid, Lightning, Fire, Poison, or Cold.",
      effects: [
        {
          type: "text",
          text: "Gain Resistance to Acid, Lightning, Fire, Poison, or Cold damage based on your Draconic Ancestry.",
        },
      ],
    },

    {
      id: "darkvision",
      name: "Darkvision",
      description:
        "You have Darkvision with a range of 60 feet.",
      effects: [
        {
          type: "sense",
          sense: "darkvision",
          range: 60,
        },
      ],
    },

    {
      id: "draconic-flight",
      name: "Draconic Flight",
      minLevel: 5,
      activation: "bonus-action",
      description:
        "Starting at level 5, you can use a Bonus Action to sprout spectral wings that last for 10 minutes. During that time, you have a Fly Speed equal to your Speed. The wings disappear early if you retract them or have the Incapacitated condition. Once you use this trait, you can't use it again until you finish a Long Rest.",
      usage: {
        type: "limited",
        uses: {
          type: "fixed",
          value: 1,
        },
        recharge: "long-rest",
      },
      effects: [
        {
          type: "speed-bonus",
          speedType: "fly",
          equals: "speed",
          minimumLevel: 5,
          duration: {
            amount: 10,
            unit: "minute",
          },
          activation: "bonus-action",
          frequency: {
            type: "per-rest",
            rest: "long",
            uses: 1,
          },
        },
        {
          type: "condition",
          condition: "incapacitated",
        },
      ],
      notes: [
        "Available starting at level 5.",
        "Duration: 10 minutes.",
        "Ends early if you retract the wings or become Incapacitated.",
        "Fly Speed equals your Speed.",
      ],
    },
  ],
} satisfies Species;

export const dragonbornAncestryDamageType: Record<string, string> = {
  black: "acid",
  blue: "lightning",
  brass: "fire",
  bronze: "lightning",
  copper: "acid",
  gold: "fire",
  green: "poison",
  red: "fire",
  silver: "cold",
  white: "cold",
};