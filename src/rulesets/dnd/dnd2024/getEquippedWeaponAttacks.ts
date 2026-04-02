import { itemsById } from "./data/items";
import type {
  AbilityKey,
  CharacterEquipmentEntry,
  EquipmentSlotId,
  WeaponData,
} from "./types";

const WEAPON_EQUIP_SLOTS: EquipmentSlotId[] = [
  "main-hand",
  "off-hand",
  "ranged-main-hand",
  "ranged-off-hand",
];

const getAbilityModifier = (score: number) => Math.floor((score - 10) / 2);

const formatSignedModifier = (value: number) => {
  if (value === 0) return "";
  return value > 0 ? ` + ${value}` : ` - ${Math.abs(value)}`;
};

const getSelectedDamageData = (weapon: WeaponData, twoHanded: boolean) => {
  return twoHanded && weapon.versatileDamage
    ? weapon.versatileDamage
    : weapon.damage;
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

const getRulesItemIdFromEquipmentEntry = (entry: CharacterEquipmentEntry) =>
  entry.source === "campaign" ? entry.baseItemId : entry.itemId;

const getDisplayItemIdFromEquipmentEntry = (entry: CharacterEquipmentEntry) =>
  entry.source === "campaign" ? entry.campaignItemId : entry.itemId;

const getDisplayNameFromEquipmentEntry = (entry: CharacterEquipmentEntry) =>
  entry.name;

const isWeaponEquipped = (entry: CharacterEquipmentEntry) => {
  const equippedSlots = entry.equippedSlots ?? [];
  return equippedSlots.some((slot) => WEAPON_EQUIP_SLOTS.includes(slot));
};

const isOffHandEquipped = (entry: CharacterEquipmentEntry) => {
  const equippedSlots = entry.equippedSlots ?? [];

  return (
    entry.wieldMode === "off-hand" ||
    equippedSlots.includes("off-hand") ||
    equippedSlots.includes("ranged-off-hand")
  );
};

const isTwoHandedEquipped = (entry: CharacterEquipmentEntry) => {
  const equippedSlots = entry.equippedSlots ?? [];

  return (
    entry.wieldMode === "two-handed" ||
    (equippedSlots.includes("main-hand") &&
      equippedSlots.includes("off-hand")) ||
    (equippedSlots.includes("ranged-main-hand") &&
      equippedSlots.includes("ranged-off-hand"))
  );
};

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

  return "str";
};

const getThrownAttackAbility = ({
  weapon,
  abilityScores,
}: {
  weapon: WeaponData;
  abilityScores: Record<AbilityKey, number>;
}): AbilityKey => {
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
  const twoHanded = isTwoHandedEquipped(entry);

  const modes: Array<{
    key: "melee" | "thrown";
    labelSuffix?: string;
    twoHanded: boolean;
  }> = [
    {
      key: "melee",
      labelSuffix:
        weapon.versatileDamage && twoHanded ? "(Two-Handed)" : undefined,
      twoHanded,
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
    if (!isWeaponEquipped(entry)) continue;

    const rulesItemId = getRulesItemIdFromEquipmentEntry(entry);
    const displayItemId = getDisplayItemIdFromEquipmentEntry(entry);

    const item = itemsById[rulesItemId];
    if (!item?.weapon) continue;

    const weapon = item.weapon;
    const proficient = proficientWeaponIds?.includes(rulesItemId) ?? true;

    const isOffHand =
      isOffHandEquipped(entry) &&
      (hasProperty(weapon, "light") || entry.wieldMode === "off-hand");

    const magicAttackBonus =
      (item.attackBonus ?? 0) + (entry.attackBonus ?? 0);
    const magicDamageBonus =
      (item.damageBonus ?? 0) + (entry.damageBonus ?? 0);

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
        itemId: displayItemId,
        name: getDisplayNameFromEquipmentEntry(entry) || item.name,
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