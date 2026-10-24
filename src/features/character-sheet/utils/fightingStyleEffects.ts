/** Shared numerical Fighting Style adjustments for character-sheet attack rows. */
export type FightingStyleId = string | null | undefined;
export type AttackForStyle = {
  attackBonus?: number;
  damage?: string;
  isThrown?: boolean;
  isTwoHanded?: boolean;
  isOffHand?: boolean;
  range?: { normal: number; long?: number | null } | null;
  properties?: string[];
};

const has = (properties: readonly string[] | undefined, name: string) =>
  properties?.some((property) => property.toLowerCase() === name) ?? false;

/** Only increase the flat modifier on a standard NdM [+/-] X damage expression. */
export function increaseAttackDamage(damage: string, amount: number): string {
  const match = /^(\s*\d+d\d+)([+-]\d+)?(\s+.*)?$/i.exec(damage);
  if (!match) return damage;
  const next = Number(match[2] ?? 0) + amount;
  return `${match[1]}${next === 0 ? '' : next > 0 ? `+${next}` : String(next)}${match[3] ?? ''}`;
}

export function applyFightingStyleToAttack<T extends AttackForStyle>(
  attack: T,
  fightingStyleId: FightingStyleId,
  options: { otherWeaponEquipped?: boolean } = {},
): T {
  if (!fightingStyleId) return attack;
  const isRanged = Boolean(attack.range) && !attack.isThrown;
  const isMelee = !isRanged;
  const oneHanded = !attack.isTwoHanded && !has(attack.properties, 'two-handed');
  const attackBonus =
    fightingStyleId === 'archery' && isRanged
      ? (attack.attackBonus ?? 0) + 2
      : attack.attackBonus;

  let damage = attack.damage;
  if (damage && fightingStyleId === 'thrown-weapon-fighting' && attack.isThrown) {
    damage = increaseAttackDamage(damage, 2);
  }
  if (
    damage && fightingStyleId === 'dueling' && isMelee && oneHanded &&
    !options.otherWeaponEquipped
  ) {
    damage = increaseAttackDamage(damage, 2);
  }
  return { ...attack, attackBonus, damage };
}

/** Defense only applies while armor (not merely a shield) is worn. */
export function isWearingArmorForDefense<T>(
  equipment: readonly T[],
  resolveItem: (entry: T) => { armor?: unknown; id?: string; name?: string } | null | undefined,
): boolean {
  return equipment.some((entry) => {
    const itemEntry = entry as { equipped?: boolean; equippedSlots?: string[] };
    if (!itemEntry.equipped && !itemEntry.equippedSlots?.length) return false;
    const item = resolveItem(entry);
    const slots = (itemEntry.equippedSlots ?? []).map((slot) => slot.toLowerCase());
    if (slots.includes('shield')) return false;
    if (slots.some((slot) => ['armor', 'body', 'chest'].includes(slot))) return true;
    const name = (item?.name ?? '').toLowerCase();
    if (name.includes('shield')) return false;
    return Boolean(item?.armor);
  });
}
