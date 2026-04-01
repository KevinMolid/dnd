import { itemsById } from "./data/items";
import type {
  AbilityKey,
  CharacterEquipmentEntry,
  WeaponData,
} from "./types";

const getAbilityModifier = (score: number) => Math.floor((score - 10) / 2);

const formatSignedModifier = (value: number) => {
  if (value === 0) return "";
  return value > 0 ? ` + ${value}` : ` - ${Math.abs(value)}`;
};

const getSelectedDamageData = (weapon: WeaponData, twoHanded: boolean) => {
  return twoHanded && weapon.versatileDamage ? weapon.versatileDamage : weapon.damage;
};

const formatDamageString = ({
  weapon,
  twoHanded,
  damageModifier,
}: {
  weapon: WeaponData;
  twoHanded: boolean;
  damageModifier: number;
}) => {
  const damage = getSelectedDamageData(weapon, twoHanded);

  return `${damage.dice.count}d${damage.dice.die}${formatSignedModifier(
    damageModifier,
  )} ${damage.damageType}`;
};

const isRangedWeapon = (weapon: WeaponData) =>
  weapon.weaponKind === "simple-ranged" ||
  weapon.weaponKind === "martial-ranged";

const hasProperty = (weapon: WeaponData, property: string) =>
  weapon.properties.includes(property as (typeof weapon.properties)[number]);

const getAttackAbility = ({
  weapon,
  abilityScores,
}: {
  weapon: WeaponData;
  abilityScores: Record<AbilityKey, number>;
}): AbilityKey => {
  const ranged = isRangedWeapon(weapon);

  if (ranged) {
    return "dex";
  }

  if (hasProperty(weapon, "finesse")) {
    return abilityScores.dex > abilityScores.str ? "dex" : "str";
  }

  // Thrown melee weapons still use STR by default.
  return "str";
};

const getThrownAttackAbility = ({
  weapon,
  abilityScores,
}: {
  weapon: WeaponData;
  abilityScores: Record<AbilityKey, number>;
}): AbilityKey => {
  // Thrown uses the same ability as the melee attack unless a special rule says otherwise.
  if (hasProperty(weapon, "finesse")) {
    return abilityScores.dex > abilityScores.str ? "dex" : "str";
  }

  return "str";
};

const getAttackModes = ({
  entry,
  weapon,
}: {
  entry: CharacterEquipmentEntry;
  weapon: WeaponData;
}) => {
  const isTwoHandedEquipped =
    entry.wieldMode === "two-handed" ||
    (entry.equippedSlots?.length ?? 0) >= 2;

  const modes: Array<{
    key: "melee" | "thrown";
    labelSuffix?: string;
    twoHanded: boolean;
  }> = [
    {
      key: "melee",
      labelSuffix:
        weapon.versatileDamage && isTwoHandedEquipped ? "(Two-Handed)" : undefined,
      twoHanded: isTwoHandedEquipped,
    },
  ];

  if (hasProperty(weapon, "thrown") && weapon.range) {
    modes.push({
      key: "thrown",
      labelSuffix: "(Thrown)",
      twoHanded: false,
    });
  }

  return modes;
};

export type EquippedWeaponAttack = {
  instanceId: string;
  itemId: string;
  name: string;
  ability: AbilityKey;
  attackBonus: number;
  damage: string;
  range?: WeaponData["range"];
  properties: WeaponData["properties"];
  mastery?: WeaponData["mastery"];
  isOffHand?: boolean;
  isThrown?: boolean;
  isTwoHanded?: boolean;
};

export const getEquippedWeaponAttacks = ({
  equipment,
  abilityScores,
  proficientWeaponIds,
  proficiencyBonus,
}: {
  equipment: CharacterEquipmentEntry[];
  abilityScores: Record<AbilityKey, number>;
  proficientWeaponIds?: string[];
  proficiencyBonus: number;
}): EquippedWeaponAttack[] => {
  const attacks: EquippedWeaponAttack[] = [];

  for (const entry of equipment) {
    if ((entry.equippedSlots?.length ?? 0) === 0) continue;

    const item = itemsById[entry.itemId];
    if (!item?.weapon) continue;

    const weapon = item.weapon;
    const proficient = proficientWeaponIds?.includes(entry.itemId) ?? true;

    const isOffHand =
      entry.wieldMode === "off-hand" && hasProperty(weapon, "light");

    // Assumed per-item magic / custom bonuses stored on the equipment entry.
    const magicAttackBonus = entry.attackBonus ?? 0;
    const magicDamageBonus = entry.damageBonus ?? 0;

    const modes = getAttackModes({ entry, weapon });

    for (const mode of modes) {
      const ability =
        mode.key === "thrown"
          ? getThrownAttackAbility({ weapon, abilityScores })
          : getAttackAbility({ weapon, abilityScores });

      const abilityMod = getAbilityModifier(abilityScores[ability]);

      const attackBonus =
        abilityMod +
        (proficient ? proficiencyBonus : 0) +
        magicAttackBonus;

      // Off-hand bonus attacks do not add ability mod to damage by default.
      // If you later add a flag like entry.addAbilityModToOffHandDamage, you can plug it in here.
      const includeAbilityModInDamage = !isOffHand;

      const damageModifier =
        (includeAbilityModInDamage ? abilityMod : 0) + magicDamageBonus;

            const isThrownAttack = mode.key === "thrown";
      const isRangedAttack = isRangedWeapon(weapon);

      attacks.push({
        instanceId:
          mode.key === "thrown"
            ? `${entry.instanceId}-thrown`
            : `${entry.instanceId}-melee`,
        itemId: entry.itemId,
        name: item.name,
        ability,
        attackBonus,
        damage: formatDamageString({
          weapon,
          twoHanded: mode.twoHanded,
          damageModifier,
        }),
        range:
          weapon.range && (isThrownAttack || isRangedAttack)
            ? weapon.range
            : undefined,
        properties: weapon.properties,
        mastery: weapon.mastery,
        isOffHand,
        isThrown: isThrownAttack,
        isTwoHanded: mode.twoHanded,
      });
    }
  }

  return attacks;
};