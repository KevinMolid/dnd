import { itemsById } from "./data/items";
import type {
  AbilityKey,
  CharacterEquipmentEntry,
  WeaponData,
} from "./types";

const getAbilityModifier = (score: number) => Math.floor((score - 10) / 2);

const formatDamageDice = (weapon: WeaponData, twoHanded: boolean) => {
  const damage =
    twoHanded && weapon.versatileDamage ? weapon.versatileDamage : weapon.damage;

  return `${damage.dice.count}d${damage.dice.die} ${damage.damageType}`;
};

const getAttackAbility = (
  weapon: WeaponData,
  abilityScores: Record<AbilityKey, number>,
): AbilityKey => {
  const isRanged =
    weapon.weaponKind === "simple-ranged" ||
    weapon.weaponKind === "martial-ranged";

  if (isRanged) {
    return "dex";
  }

  if (weapon.properties.includes("finesse")) {
    return abilityScores.dex > abilityScores.str ? "dex" : "str";
  }

  return "str";
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

    const ability = getAttackAbility(item.weapon, abilityScores);
    const abilityMod = getAbilityModifier(abilityScores[ability]);
    const proficient = proficientWeaponIds?.includes(entry.itemId) ?? true;

    const isTwoHanded =
      entry.wieldMode === "two-handed" ||
      (entry.equippedSlots?.length ?? 0) >= 2;

    attacks.push({
      instanceId: entry.instanceId,
      itemId: entry.itemId,
      name: item.name,
      ability,
      attackBonus: abilityMod + (proficient ? proficiencyBonus : 0),
      damage: formatDamageDice(item.weapon, isTwoHanded),
      range: item.weapon.range,
      properties: item.weapon.properties,
      mastery: item.weapon.mastery,
    });
  }

  return attacks;
};