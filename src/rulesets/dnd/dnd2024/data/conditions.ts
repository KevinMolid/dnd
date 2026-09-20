export type ConditionDefinition = {
  id: string;
  name: string;
  description: string;
  notes?: string[];
};

export const conditions = [
  {
    id: "blinded",
    name: "Blinded",
    description:
      "You can't see. You automatically fail any ability check that requires sight. Attack rolls against you have Advantage, and your attack rolls have Disadvantage.",
  },
  {
    id: "charmed",
    name: "Charmed",
    description:
      "You can't attack the charmer or target the charmer with damaging abilities or magical effects. The charmer also has Advantage on ability checks to interact socially with you.",
  },
  {
    id: "deafened",
    name: "Deafened",
    description:
      "You can't hear. You automatically fail any ability check that requires hearing.",
  },
  {
    id: "frightened",
    name: "Frightened",
    description:
      "You have Disadvantage on ability checks and attack rolls while the source of your fear is within line of sight. You also can't willingly move closer to the source of your fear.",
  },
  {
    id: "grappled",
    name: "Grappled",
    description:
      "Your Speed is 0 and can't increase. Attacks against you have Advantage if the attacker is within 5 feet of you. Your attacks have Disadvantage against targets other than the grappler.",
    notes: [
      "The condition ends if the grappler is Incapacitated.",
      "It also ends if an effect moves you outside the grapple's reach without using your Speed.",
    ],
  },
  {
    id: "incapacitated",
    name: "Incapacitated",
    description:
      "You can't take actions, Bonus Actions, or Reactions. You can't maintain Concentration, and you can't speak.",
    notes: [
      "If you are Incapacitated when you roll Initiative, you have Disadvantage on the roll.",
    ],
  },
  {
    id: "invisible",
    name: "Invisible",
    description:
      "You aren't affected by effects that require the target to be seen unless the effect's creator can somehow see you. Attacks against you have Disadvantage, and your attacks have Advantage.",
    notes: [
      "If a creature can somehow see you, you don't gain the attack-related benefits against that creature.",
    ],
  },
  {
    id: "paralyzed",
    name: "Paralyzed",
    description:
      "You are Incapacitated and your Speed is 0. You automatically fail Strength and Dexterity saving throws. Attacks against you have Advantage.",
    notes: [
      "Any attack that hits you from within 5 feet is a Critical Hit.",
    ],
  },
  {
    id: "petrified",
    name: "Petrified",
    description:
      "You are transformed into a solid, inanimate substance along with nonmagical objects you are wearing and carrying. Your weight increases greatly, and you stop aging.",
    notes: [
      "You are Incapacitated, your Speed is 0, and you can't speak.",
      "Attacks against you have Advantage.",
      "You automatically fail Strength and Dexterity saving throws.",
      "You have Resistance to all damage.",
      "You have Immunity to the Poisoned condition.",
    ],
  },
  {
    id: "poisoned",
    name: "Poisoned",
    description:
      "You have Disadvantage on attack rolls and ability checks.",
  },
  {
    id: "prone",
    name: "Prone",
    description:
      "Your only movement options are to crawl or spend movement equal to half your Speed to stand up. Your attacks have Disadvantage.",
    notes: [
      "Attacks against you have Advantage if the attacker is within 5 feet of you; otherwise those attacks have Disadvantage.",
    ],
  },
  {
    id: "restrained",
    name: "Restrained",
    description:
      "Your Speed is 0 and can't increase. Attacks against you have Advantage, while your attacks have Disadvantage. You also have Disadvantage on Dexterity saving throws.",
  },
  {
    id: "stunned",
    name: "Stunned",
    description:
      "You are Incapacitated. You automatically fail Strength and Dexterity saving throws, and attacks against you have Advantage.",
  },
  {
    id: "unconscious",
    name: "Unconscious",
    description:
      "You are Incapacitated and Prone, and you drop whatever you're holding. Your Speed is 0. You automatically fail Strength and Dexterity saving throws, and attacks against you have Advantage.",
    notes: [
      "Any attack that hits you from within 5 feet is a Critical Hit.",
      "You are unaware of your surroundings.",
    ],
  },
  {
    id: "exhaustion",
    name: "Exhaustion",
    description:
      "Exhaustion is measured in levels. Each level worsens your d20 Tests and reduces your Speed. Reaching level 6 causes death.",
    notes: [
      "Your current character data stores Exhaustion only as present or absent; it does not yet track the exhaustion level.",
    ],
  },
] as const satisfies readonly ConditionDefinition[];

export type ConditionName = (typeof conditions)[number]["name"];

const conditionByName = new Map<string, ConditionDefinition>(
  conditions.map((condition) => [condition.name.toLowerCase(), condition]),
);

export const getConditionDefinition = (
  condition: string,
): ConditionDefinition | undefined =>
  conditionByName.get(condition.trim().toLowerCase());
