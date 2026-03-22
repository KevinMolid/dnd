import { itemsById } from "./data/items";
import type {
  Currency,
  EquipmentChoiceGrant,
  EquipmentCurrencyGrant,
  EquipmentGrant,
  EquipmentItemGrant,
} from "./types";

export type ResolvedEquipmentItem = {
  id: string;
  name: string;
  quantity: number;
  equipped?: boolean;
};

export type ResolvedCurrency = Partial<Record<Currency, number>>;

export type EquipmentChoiceResolver = (
  grant: EquipmentChoiceGrant,
  path: string,
) => EquipmentGrant[] | null | undefined;

export type ResolveEquipmentGrantsOptions = {
  resolveChoice?: EquipmentChoiceResolver;
};

const addItem = (
  items: Map<string, ResolvedEquipmentItem>,
  grant: EquipmentItemGrant,
) => {
  const existing = items.get(grant.id);
  const quantity = grant.quantity ?? 1;
  const itemName = itemsById[grant.id]?.name ?? grant.id;

  if (existing) {
    existing.quantity += quantity;
    return;
  }

  items.set(grant.id, {
    id: grant.id,
    name: itemName,
    quantity,
  });
};

const addCurrency = (
  currency: ResolvedCurrency,
  grant: EquipmentCurrencyGrant,
) => {
  currency[grant.currency] = (currency[grant.currency] ?? 0) + grant.amount;
};

const walkGrant = (
  grant: EquipmentGrant,
  items: Map<string, ResolvedEquipmentItem>,
  currency: ResolvedCurrency,
  options: ResolveEquipmentGrantsOptions,
  path: string,
) => {
  switch (grant.type) {
    case "item":
      addItem(items, grant);
      return;

    case "currency":
      addCurrency(currency, grant);
      return;

    case "choice": {
      const selectedGrants = options.resolveChoice?.(grant, path);

      if (!selectedGrants || selectedGrants.length === 0) {
        return;
      }

      for (let index = 0; index < selectedGrants.length; index += 1) {
        walkGrant(
          selectedGrants[index],
          items,
          currency,
          options,
          `${path}.choice[${index}]`,
        );
      }

      return;
    }

    default:
      return;
  }
};

export const resolveEquipmentGrants = (
  grants: EquipmentGrant[],
  options: ResolveEquipmentGrantsOptions = {},
): {
  items: ResolvedEquipmentItem[];
  currency: ResolvedCurrency;
} => {
  const itemMap = new Map<string, ResolvedEquipmentItem>();
  const currency: ResolvedCurrency = {};

  for (let index = 0; index < grants.length; index += 1) {
    walkGrant(
      grants[index],
      itemMap,
      currency,
      options,
      `grants[${index}]`,
    );
  }

  const items = Array.from(itemMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return { items, currency };
};