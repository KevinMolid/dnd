import type { AbilityKey } from "./types";

export type TwoWeaponAttackProfile = {
  id: string;
  itemId?: string;
  name: string;
  attackBonus?: number;
  damage?: string;
  ability?: AbilityKey;
  properties?: string[];
  mastery?: string | null;
  isThrown?: boolean;
  isTwoHanded?: boolean;
  isOffHand?: boolean;
};

export type GeneratedCombatAction = {
  id: string;
  name: string;
  description?: string;
  source?: string;
  value?: string;
};

export type TwoWeaponRulesNotice = {
  title: string;
  description: string;
};

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const hasProperty = (attack: TwoWeaponAttackProfile, property: string) =>
  (attack.properties ?? []).some(
    (candidate) => normalize(candidate) === normalize(property),
  );

const isMeleeOneHanded = (attack: TwoWeaponAttackProfile) =>
  !attack.isThrown &&
  !attack.isTwoHanded &&
  !hasProperty(attack, "two-handed");

const formatSigned = (value: number) =>
  value === 0 ? "" : value > 0 ? `+${value}` : `${value}`;

/*
 * Removes a positive ability modifier from an already formatted weapon-damage
 * string while preserving magic/item bonuses.
 *
 * Example:
 *   "1d6+6 slashing", ability +5 -> "1d6+1 slashing"
 *
 * A negative ability modifier is intentionally retained because the Light and
 * Dual Wielder rules say it is still applied when negative.
 */
const withoutPositiveAbilityModifier = (
  damage: string | undefined,
  abilityModifier: number,
) => {
  if (!damage || abilityModifier <= 0) {
    return damage;
  }

  const match = damage.match(/^(\d+d\d+)(?:\s*([+-])\s*(\d+))?\s+(.+)$/i);

  if (!match) {
    return damage;
  }

  const [, dice, sign, rawModifier, damageType] = match;
  const currentModifier =
    rawModifier == null
      ? 0
      : Number(rawModifier) * (sign === "-" ? -1 : 1);

  const adjustedModifier = currentModifier - abilityModifier;

  return `${dice}${formatSigned(adjustedModifier)} ${damageType}`;
};

const formatAttackValue = (
  attack: TwoWeaponAttackProfile,
  damage: string | undefined,
) => {
  const toHit =
    typeof attack.attackBonus === "number"
      ? `${attack.attackBonus >= 0 ? "+" : ""}${attack.attackBonus}`
      : "—";

  return damage ? `${toHit} · ${damage}` : toHit;
};

const featureSet = (featureNames: string[]) =>
  new Set(featureNames.map(normalize));

const hasNamedFeature = (features: Set<string>, candidates: string[]) =>
  candidates.some((candidate) => features.has(normalize(candidate)));

export const getTwoWeaponCombatActions = ({
  attacks,
  abilityScores,
  featureNames,
  masteredWeaponIds = [],
}: {
  attacks: TwoWeaponAttackProfile[];
  abilityScores: Record<AbilityKey, number>;
  featureNames: string[];
  masteredWeaponIds?: string[];
}): {
  actions: GeneratedCombatAction[];
  bonusActions: GeneratedCombatAction[];
  notice?: TwoWeaponRulesNotice;
} => {
  const actions: GeneratedCombatAction[] = [];
  const bonusActions: GeneratedCombatAction[] = [];
  let notice: TwoWeaponRulesNotice | undefined;

  const features = featureSet(featureNames);

  const hasTwoWeaponFighting = hasNamedFeature(features, [
    "Two-Weapon Fighting",
    "Two Weapon Fighting",
  ]);

  const hasDualWielder = hasNamedFeature(features, [
    "Dual Wielder",
  ]);

  const hasWeaponMasteryFeature = hasNamedFeature(features, [
    "Weapon Mastery",
  ]);

  const mastered = new Set(masteredWeaponIds.map(normalize));

  const meleeWeapons = attacks.filter(isMeleeOneHanded);
  const lightWeapons = meleeWeapons.filter((attack) =>
    hasProperty(attack, "light"),
  );

  if (meleeWeapons.length >= 2) {
    const heldNames = meleeWeapons
      .slice(0, 2)
      .map((attack) => attack.name)
      .join(" and ");

    if (lightWeapons.length === 0) {
      notice = {
        title: "Two weapons equipped",
        description: `You can use either ${heldNames} for an ordinary attack and apply its full attack and damage modifiers. Neither held weapon has the Light property, so wielding both does not by itself grant an extra attack.${
          hasDualWielder
            ? " Dual Wielder still requires you to attack with a Light weapon to trigger its extra Bonus Action attack."
            : ""
        }`,
      };
    } else if (lightWeapons.length === 1) {
      notice = {
        title: "Two weapons equipped",
        description: `You can use either ${heldNames} for an ordinary attack and apply its full attack and damage modifiers. ${
          hasDualWielder
            ? "Because you have Dual Wielder, attacking with the Light weapon can qualify you for the feat's extra Bonus Action attack with the other eligible one-handed melee weapon."
            : "Only one held weapon is Light, so the normal Light-property extra attack is not available with this pair; that extra attack requires a different Light weapon."
        }`,
      };
    } else {
      notice = {
        title: "Two Light weapons equipped",
        description: `You can use either ${heldNames} for an ordinary attack and apply its full attack and damage modifiers. Attacking with one Light weapon can qualify you for one extra attack with the other. ${
          hasTwoWeaponFighting
            ? "Two-Weapon Fighting lets that extra attack add your ability modifier to damage."
            : "The Light extra attack does not add a positive ability modifier to damage."
        }`,
      };
    }
  }

  if (lightWeapons.length < 1 || meleeWeapons.length < 2) {
    return { actions, bonusActions, notice };
  }

  const trigger =
    lightWeapons.find((attack) => !attack.isOffHand) ?? lightWeapons[0];

  const lightTarget =
    lightWeapons.find(
      (attack) => attack.id !== trigger.id && attack.isOffHand,
    ) ??
    lightWeapons.find((attack) => attack.id !== trigger.id);

  const getAbilityModifier = (attack: TwoWeaponAttackProfile) => {
    if (!attack.ability) {
      return 0;
    }

    return Math.floor((abilityScores[attack.ability] - 10) / 2);
  };

  const getExtraAttackDamage = (attack: TwoWeaponAttackProfile) =>
    hasTwoWeaponFighting
      ? attack.damage
      : withoutPositiveAbilityModifier(
          attack.damage,
          getAbilityModifier(attack),
        );

  const masteryIsUnlocked = (attack: TwoWeaponAttackProfile) => {
    if (normalize(String(attack.mastery ?? "")) !== "nick") {
      return false;
    }

    /*
     * Guided characters provide their actual selected weapon-masteries.
     * Custom characters currently have no dedicated mastery-choice field, so a
     * manually-added Weapon Mastery feature acts as their explicit opt-in.
     */
    if (mastered.size > 0) {
      return Boolean(attack.itemId && mastered.has(normalize(attack.itemId)));
    }

    return hasWeaponMasteryFeature;
  };

  if (lightTarget) {
    const damage = getExtraAttackDamage(lightTarget);
    const usesNick = masteryIsUnlocked(lightTarget);

    const lightAction: GeneratedCombatAction = {
      id: `light-extra-attack-${trigger.id}-${lightTarget.id}`,
      name: usesNick ? `Nick: ${lightTarget.name}` : `Light: ${lightTarget.name}`,
      source: usesNick ? "Nick / Light" : "Light",
      value: formatAttackValue(lightTarget, damage),
      description: usesNick
        ? `After attacking with ${trigger.name} using the Attack action, make the Light property's extra attack with ${lightTarget.name} as part of that Attack action. This extra attack can be made only once per turn.${
            hasTwoWeaponFighting
              ? " Two-Weapon Fighting adds your ability modifier to its damage."
              : " Your positive ability modifier is not added to this extra attack's damage."
          }`
        : `After attacking with ${trigger.name} using the Attack action, you can make one extra attack with the different Light weapon ${lightTarget.name} as a Bonus Action.${
            hasTwoWeaponFighting
              ? " Two-Weapon Fighting adds your ability modifier to its damage."
              : " Your positive ability modifier is not added to this extra attack's damage."
          }`,
    };

    if (usesNick) {
      actions.push(lightAction);
    } else {
      bonusActions.push(lightAction);
    }
  }

  if (hasDualWielder) {
    const dualWielderTarget =
      meleeWeapons.find(
        (attack) => attack.id !== trigger.id && attack.isOffHand,
      ) ??
      meleeWeapons.find((attack) => attack.id !== trigger.id);

    if (dualWielderTarget) {
      const damage = getExtraAttackDamage(dualWielderTarget);

      bonusActions.push({
        id: `dual-wielder-extra-attack-${trigger.id}-${dualWielderTarget.id}`,
        name: `Dual Wielder: ${dualWielderTarget.name}`,
        source: "Dual Wielder",
        value: formatAttackValue(dualWielderTarget, damage),
        description: `After attacking with the Light weapon ${trigger.name} using the Attack action, you can make one extra attack as a Bonus Action with the different one-handed melee weapon ${dualWielderTarget.name}.${
          hasTwoWeaponFighting
            ? " Two-Weapon Fighting adds your ability modifier to its damage."
            : " Your positive ability modifier is not added to this extra attack's damage."
        }`,
      });
    }
  }

  return { actions, bonusActions, notice };
};
