import type { Trait } from "../../../rulesets/dnd/dnd2024/types";

export type CombatFeatureItem = {
  id: string;
  name: string;
  summary: string;
  value?: string | null;
};

type CombatFeatureContext = {
  level: number;
  rogueSneakAttack?: string | null;
};

type CombatFeatureDefinition = {
  include: boolean;
  minLevel?: number;
  summary: string;
};

const normalizeKey = (value: string | undefined | null) =>
  (value ?? "").trim().toLowerCase();

const COMBAT_FEATURES_BY_KEY: Record<string, CombatFeatureDefinition> = {
  rage: {
    include: true,
    summary:
      "Bonus action to enter Rage. While raging, you gain Rage Damage, Advantage on Strength checks and saves, and resistance to Bludgeoning, Piercing, and Slashing damage.",
  },
  "danger-sense": {
    include: true,
    minLevel: 2,
    summary:
      "You have Advantage on Dexterity saving throws against visible effects, unless you have the Incapacitated condition.",
  },
  "reckless-attack": {
    include: true,
    minLevel: 2,
    summary:
      "On your first attack of your turn, you can gain Advantage on Strength-based attack rolls, but attack rolls against you have Advantage until your next turn.",
  },
  "frenzied-attack": {
    include: true,
    summary:
      "While raging, you can make an extra attack as a Bonus Action.",
  },
  "savage-attacker": {
    include: true,
    summary:
      "Once per turn when you hit with a weapon, you can reroll the weapon’s damage dice and use either roll.",
  },
  "great-weapon-master": {
    include: true,
    summary:
      "When you score a critical hit or reduce a creature to 0 HP with a melee weapon, you can make one attack as a Bonus Action.",
  },
  sharpshooter: {
    include: true,
    summary:
      "Your ranged attacks ignore half and three-quarters cover, and firing in melee doesn’t impose Disadvantage.",
  },
  "defensive-duelist": {
    include: true,
    summary:
      "When hit by a melee attack while wielding a finesse weapon, you can use your Reaction to add your proficiency bonus to your AC against that attack.",
  },
  "mage-slayer": {
    include: true,
    summary:
      "You excel at fighting spellcasters, disrupting Concentration and resisting spells cast near you.",
  },
  charger: {
    include: true,
    summary:
      "After moving at least 10 feet in a straight line, you gain a combat payoff such as extra damage or a shove boost, depending on the attack used.",
  },
  sentinel: {
    include: true,
    summary:
      "You punish enemy movement, including reducing targets to 0 speed with opportunity attacks.",
  },
  "polearm-master": {
    include: true,
    summary:
      "You gain a Bonus Action butt-end attack and can make opportunity attacks when enemies enter your reach.",
  },
  "draconic-flight": {
    include: true,
    minLevel: 5,
    summary:
      "Bonus action to gain a fly speed equal to your speed for 10 minutes. Usable once per Long Rest.",
  },

  "draconic-ancestry": {
    include: false,
    summary: "",
  },
  "breath-weapon": {
    include: false,
    summary: "",
  },
  "damage-resistance": {
    include: false,
    summary: "",
  },
  "unarmored-defense": {
    include: false,
    summary: "",
  },
  "weapon-mastery": {
    include: false,
    summary: "",
  },
};

const getCombatConfigForTrait = (trait: Trait) => {
  const idKey = normalizeKey(trait.id);
  const nameKey = normalizeKey(trait.name).replace(/\s+/g, "-");

  return COMBAT_FEATURES_BY_KEY[idKey] ?? COMBAT_FEATURES_BY_KEY[nameKey] ?? null;
};

export const getCombatFeatures = (
  traits: Trait[],
  context: CombatFeatureContext,
): CombatFeatureItem[] => {
  const seen = new Set<string>();

  const traitFeatures = traits.flatMap((trait) => {
    const config = getCombatConfigForTrait(trait);

    if (!config) return [];
    if (!config.include) return [];
    if (config.minLevel && context.level < config.minLevel) return [];

    const dedupeKey = normalizeKey(trait.name) || normalizeKey(trait.id);
    if (seen.has(dedupeKey)) return [];

    seen.add(dedupeKey);

    return [
      {
        id: trait.id,
        name: trait.name,
        summary: config.summary,
        value: null,
      },
    ];
  });

  const rogueFeature =
    context.rogueSneakAttack && !seen.has("sneak-attack")
      ? [
          {
            id: "sneak-attack",
            name: "Sneak Attack",
            summary:
              "Once per turn, you can deal extra damage to one creature you hit with an attack roll if you have Advantage on the roll and the attack uses a Finesse or a Ranged weapon.",
            value: context.rogueSneakAttack,
          },
        ]
      : [];

  return [...rogueFeature, ...traitFeatures];
};