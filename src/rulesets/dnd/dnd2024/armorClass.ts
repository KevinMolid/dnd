import type {
  AbilityKey,
  CharacterEquipmentEntry,
  Item,
} from "./types";

export type ArmorClassMode = "automatic" | "manual";

export type ArmorClassBreakdownLine = {
  id: string;
  label: string;
  value: number;
  detail?: string;
};

export type ArmorClassResult = {
  value: number;
  mode: ArmorClassMode;
  formulaLabel: string;
  breakdown: ArmorClassBreakdownLine[];
};

type CalculateArmorClassArgs = {
  abilityScores?: Partial<Record<AbilityKey, number>>;
  className?: string;
  equipment?: CharacterEquipmentEntry[];
  resolveItem: (entry: CharacterEquipmentEntry) => Item | null | undefined;

  mode?: ArmorClassMode;
  manualArmorClass?: number;
  extraModifier?: number;
};

const getModifier = (score: number) => Math.floor((score - 10) / 2);

const isEquipped = (entry: CharacterEquipmentEntry) =>
  Boolean(entry.equipped) || (entry.equippedSlots?.length ?? 0) > 0;

const normalizeClassName = (value?: string) =>
  (value ?? "").trim().toLowerCase();

export const calculateArmorClass = ({
  abilityScores,
  className,
  equipment = [],
  resolveItem,
  mode = "automatic",
  manualArmorClass,
  extraModifier = 0,
}: CalculateArmorClassArgs): ArmorClassResult => {
  if (mode === "manual") {
    const value = Math.max(0, Math.floor(manualArmorClass ?? 10));

    return {
      value,
      mode,
      formulaLabel: "Manual override",
      breakdown: [
        {
          id: "manual",
          label: "Manual AC",
          value,
        },
      ],
    };
  }

  const dexModifier = getModifier(abilityScores?.dex ?? 10);
  const conModifier = getModifier(abilityScores?.con ?? 10);
  const wisModifier = getModifier(abilityScores?.wis ?? 10);

  const equippedItems = equipment
    .filter(isEquipped)
    .map((entry) => ({
      entry,
      item: resolveItem(entry),
    }))
    .filter(
      (value): value is { entry: CharacterEquipmentEntry; item: Item } =>
        Boolean(value.item),
    );

  const equippedArmor =
    equippedItems.find(({ item }) => Boolean(item.armor)) ?? null;

  const equippedShield =
    equippedItems.find(({ item }) => Boolean(item.shield)) ?? null;

  const classId = normalizeClassName(className);
  const breakdown: ArmorClassBreakdownLine[] = [];

  let value = 10;
  let formulaLabel = "Unarmored";

  if (equippedArmor?.item.armor) {
    const armor = equippedArmor.item.armor;
    const dexContribution =
      armor.armorCategory === "heavy"
        ? 0
        : typeof armor.dexCap === "number"
          ? Math.min(dexModifier, armor.dexCap)
          : dexModifier;

    value = armor.baseAc + dexContribution;
    formulaLabel = equippedArmor.item.name;

    breakdown.push({
      id: "armor",
      label: equippedArmor.item.name,
      value: armor.baseAc,
      detail: `${armor.armorCategory[0].toUpperCase()}${armor.armorCategory.slice(1)} armor`,
    });

    if (armor.armorCategory !== "heavy") {
      breakdown.push({
        id: "dexterity",
        label:
          typeof armor.dexCap === "number"
            ? `Dexterity (max +${armor.dexCap})`
            : "Dexterity",
        value: dexContribution,
      });
    }
  } else if (classId === "barbarian") {
    value = 10 + dexModifier + conModifier;
    formulaLabel = "Unarmored Defense";

    breakdown.push(
      { id: "base", label: "Base", value: 10 },
      { id: "dexterity", label: "Dexterity", value: dexModifier },
      { id: "constitution", label: "Constitution", value: conModifier },
    );
  } else if (classId === "monk" && !equippedShield) {
    value = 10 + dexModifier + wisModifier;
    formulaLabel = "Unarmored Defense";

    breakdown.push(
      { id: "base", label: "Base", value: 10 },
      { id: "dexterity", label: "Dexterity", value: dexModifier },
      { id: "wisdom", label: "Wisdom", value: wisModifier },
    );
  } else {
    value = 10 + dexModifier;

    breakdown.push(
      { id: "base", label: "Base", value: 10 },
      { id: "dexterity", label: "Dexterity", value: dexModifier },
    );
  }

  for (const { entry, item } of equippedItems) {
    let bonus = 0;

    if (item.shield) {
      bonus += item.shield.acBonus;
    }

    if (typeof item.acBonus === "number") {
      bonus += item.acBonus;
    }

    /*
     * CharacterEquipmentEntry can carry a per-instance AC adjustment.
     * Do not add it twice when resolveItem already folded the same value
     * into item.acBonus.
     */
    const entryBonus =
      typeof entry.acBonus === "number" &&
      entry.acBonus !== item.acBonus
        ? entry.acBonus
        : 0;

    bonus += entryBonus;

    if (bonus !== 0) {
      value += bonus;

      breakdown.push({
        id: `item-${entry.instanceId}`,
        label: item.name,
        value: bonus,
        detail: item.shield ? "Shield" : "Equipment bonus",
      });
    }
  }

  const normalizedExtraModifier = Math.trunc(extraModifier || 0);

  if (normalizedExtraModifier !== 0) {
    value += normalizedExtraModifier;

    breakdown.push({
      id: "extra-modifier",
      label: "Extra modifier",
      value: normalizedExtraModifier,
      detail: "Features, spells, homebrew, or other bonuses",
    });
  }

  return {
    value,
    mode,
    formulaLabel,
    breakdown,
  };
};

export const formatArmorClassBreakdown = (result: ArmorClassResult) =>
  result.breakdown
    .map((line) => `${line.label}: ${line.value >= 0 ? "+" : ""}${line.value}`)
    .join("\n");
