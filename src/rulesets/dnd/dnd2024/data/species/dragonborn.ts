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
        "Your lineage stems from a dragon progenitor. Choose the kind of dragon from the Draconic Ancestors table. Your choice affects your Breath Weapon and Damage Resistance traits as well as your appearance.",
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
        "When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in either a 15-foot Cone or a 30-foot Line that is 5 feet wide (choose the shape each time). Each creature in that area must make a Dexterity saving throw (DC 8 plus your Constitution modifier and Proficiency Bonus). On a failed save, a creature takes 1d10 damage of the type determined by your Draconic Ancestry trait. On a successful save, a creature takes half as much damage. This damage increases when you reach character levels 5 (2d10), 11 (3d10), and 17 (4d10). You can use this Breath Weapon a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.",
      notes: [
        "Replace one attack in the Attack action.",
        "Area: 15-foot Cone or 30-foot Line that is 5 feet wide.",
        "Save: Dexterity, DC 8 + Constitution modifier + Proficiency Bonus.",
        "Damage type is determined by your Draconic Ancestry.",
        "Damage: 1d10 at level 1, 2d10 at level 5, 3d10 at level 11, 4d10 at level 17.",
        "Uses per Long Rest: equal to your Proficiency Bonus.",
      ],
    },
    {
      id: "damage-resistance",
      name: "Damage Resistance",
      description:
        "You have Resistance to the damage type determined by your Draconic Ancestry trait.",
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
      description: "You have Darkvision with a range of 60 feet.",
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
      description:
        "When you reach character level 5, you can channel draconic magic to give yourself temporary flight. As a Bonus Action, you sprout spectral wings on your back that last for 10 minutes or until you retract the wings (no action required) or have the Incapacitated condition. During that time, you have a Fly Speed equal to your Speed. Your wings appear to be made of the same energy as your Breath Weapon. Once you use this trait, you can't use it again until you finish a Long Rest.",
      effects: [
        {
          type: "speed-bonus",
          speedType: "fly",
          equals: "speed",
          minimumLevel: 5,
          duration: { amount: 10, unit: "minute" },
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
        "Activate as a Bonus Action.",
        "Duration: 10 minutes.",
        "Ends early if you retract the wings or become Incapacitated.",
        "Fly Speed equals your Speed.",
        "Uses: once per Long Rest.",
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