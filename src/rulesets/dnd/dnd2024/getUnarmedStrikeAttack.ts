import type { AbilityKey, CharacterEquipmentEntry, Trait } from "./types";

type AbilityScores = Record<AbilityKey, number>;

type ResolvedEquipmentItem = {
  id?: string;
  name?: string;
  category?: string;
  type?: string;
  armor?: unknown;
};

type UnarmedStrikeInput = {
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  level: number;
  traits: readonly Pick<Trait, "id">[];
  equipment: readonly CharacterEquipmentEntry[];
  resolveItem: (entry: CharacterEquipmentEntry) => ResolvedEquipmentItem | null | undefined;
};

const modifier = (score: number) => Math.floor((score - 10) / 2);
const normalize = (value: unknown) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Detect equipment that prevents Monk Martial Arts from applying. */
export function isWearingArmorOrShield(
  equipment: readonly CharacterEquipmentEntry[],
  resolveItem: UnarmedStrikeInput["resolveItem"],
): boolean {
  return equipment.some((entry) => {
    if (!entry.equipped && !(entry.equippedSlots?.length)) return false;
    const item = resolveItem(entry);
    const slots = (entry.equippedSlots ?? []).map(normalize);
    if (slots.some((slot) => ["armor", "body", "chest", "shield"].includes(slot))) return true;
    const parts = [item?.id, item?.name, item?.category, item?.type,
      entry.itemId, entry.name].map(normalize);
    if (parts.some((part) => part === "shield" || part.endsWith("-shield") ||
      ["light-armor", "medium-armor", "heavy-armor", "armor", "armour"].includes(part))) return true;
    // Resolved armor (but not an item named merely 'armor' in a miscellaneous field).
    return Boolean(item?.armor);
  });
}

/** A feature-based Unarmed Strike profile shared by guided and custom character sheets. */
export function getUnarmedStrikeAttack({
  abilityScores, proficiencyBonus, level, traits, equipment, resolveItem,
}: UnarmedStrikeInput) {
  const ids = new Set(traits.map((trait) => trait.id));
  const martialArts = ids.has("martial-arts") && !isWearingArmorOrShield(equipment, resolveItem);
  const strengthModifier = modifier(abilityScores.str);
  const dexterityModifier = modifier(abilityScores.dex);
  const ability: AbilityKey = martialArts && dexterityModifier > strengthModifier ? "dex" : "str";
  const chosenModifier = ability === "dex" ? dexterityModifier : strengthModifier;
  const saveDc = 8 + proficiencyBonus + chosenModifier;
  const die = level >= 17 ? 12 : level >= 11 ? 10 : level >= 5 ? 8 : 6;
  const damage = martialArts
    ? `1d${die}${chosenModifier >= 0 ? "+" : ""}${chosenModifier} bludgeoning`
    : `${Math.max(0, 1 + strengthModifier)} bludgeoning`;
  const properties = [`Grapple DC ${saveDc}`, `Shove DC ${saveDc}`];
  if (martialArts && ids.has("empowered-strikes")) properties.push("Can deal Force damage instead");
  return {
    id: "unarmed-strike", name: "Unarmed Strike",
    attackBonus: proficiencyBonus + chosenModifier, damage,
    properties, ability, isOffHand: false, isThrown: false,
    isTwoHanded: false, mastery: undefined, range: null,
  };
}
