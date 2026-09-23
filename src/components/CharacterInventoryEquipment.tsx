import { useMemo, type ReactNode } from "react";

import {
  equipmentSlotLabels,
  equipmentSlotOrder,
} from "../rulesets/dnd/dnd2024/data/equipmentMetadata";

import {
  getEquipActionsForItem,
  getOccupiedSlotsForEquip,
  isItemEquippable,
} from "../rulesets/dnd/dnd2024/getEquipmentRules";

import { copperToMoneyBreakdown } from "../rulesets/dnd/dnd2024/money";

import { resolveItemFromEquipmentEntry } from "../rulesets/dnd/dnd2024/resolveItem";

import type {
  CampaignItem,
  CharacterEquipmentEntry,
  EquipmentSlotId,
  Money,
  WieldMode,
} from "../rulesets/dnd/dnd2024/types";

import ItemTooltip from "./ItemTooltip";

type Props = {
  equipment: CharacterEquipmentEntry[];
  onChange: (nextEquipment: CharacterEquipmentEntry[]) => void | Promise<void>;
  campaignItemsById?: Record<string, CampaignItem>;
  moneyCp?: number;
  money?: Money;
};

type ResolvedEquipmentRow = {
  entry: CharacterEquipmentEntry;
  resolvedItem: ReturnType<typeof resolveItemFromEquipmentEntry>;
};

type InventoryDisplayRow = {
  key: string;
  entries: CharacterEquipmentEntry[];
  entry: CharacterEquipmentEntry;
  resolvedItem: ReturnType<typeof resolveItemFromEquipmentEntry>;
  totalQuantity: number;
  grouped: boolean;
};

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getEntryDisplayId = (entry: CharacterEquipmentEntry) =>
  entry.source === "campaign" ? entry.campaignItemId : entry.itemId;

const normalizeEntry = (
  entry: CharacterEquipmentEntry,
): CharacterEquipmentEntry => {
  const equippedSlots = entry.equippedSlots ?? [];

  if (equippedSlots.length === 0) {
    const { wieldMode, ...rest } = entry;

    return {
      ...rest,
      equipped: false,
      equippedSlots: [],
    };
  }

  return {
    ...entry,
    equipped: true,
    equippedSlots,
  };
};

const unequipEntry = (
  entry: CharacterEquipmentEntry,
): CharacterEquipmentEntry => {
  const { wieldMode, ...rest } = entry;

  return {
    ...rest,
    equipped: false,
    equippedSlots: [],
  };
};

const normalizeMoney = (money?: Money): Required<Money> => ({
  cp: Math.max(0, Math.floor(money?.cp ?? 0)),
  sp: Math.max(0, Math.floor(money?.sp ?? 0)),
  ep: Math.max(0, Math.floor(money?.ep ?? 0)),
  gp: Math.max(0, Math.floor(money?.gp ?? 0)),
  pp: Math.max(0, Math.floor(money?.pp ?? 0)),
});

const CharacterInventoryEquipment = ({
  equipment,
  onChange,
  campaignItemsById = {},
  moneyCp = 0,
  money: suppliedMoney,
}: Props) => {
  const money = useMemo(() => {
    if (suppliedMoney) {
      return normalizeMoney(suppliedMoney);
    }

    return normalizeMoney(copperToMoneyBreakdown(moneyCp));
  }, [suppliedMoney, moneyCp]);

  const normalizedEquipment = useMemo(
    () => equipment.map(normalizeEntry),
    [equipment],
  );

  const resolvedEquipment = useMemo<ResolvedEquipmentRow[]>(
    () =>
      normalizedEquipment.map((entry) => ({
        entry,
        resolvedItem: resolveItemFromEquipmentEntry(entry, campaignItemsById),
      })),
    [normalizedEquipment, campaignItemsById],
  );

  /*
   * Stackable mundane items are grouped for display only.
   * The stored character inventory is left untouched.
   *
   * Equippable / equipped objects remain individual instances so that
   * Main Hand, Off Hand, armor slots, etc. always refer to a real instance.
   */
  const displayRows = useMemo<InventoryDisplayRow[]>(() => {
    const rows: InventoryDisplayRow[] = [];
    const groupedIndexes = new Map<string, number>();

    for (const { entry, resolvedItem } of resolvedEquipment) {
      const equippedSlots = entry.equippedSlots ?? [];
      const isEquipped = equippedSlots.length > 0;

      /*
       * Equipped items have one canonical visual home: the Equipped panel.
       * They remain in the underlying equipment array; they are only omitted
       * from the backpack/inventory list.
       */
      if (isEquipped) {
        continue;
      }

      const isEquippable = isItemEquippable(resolvedItem);
      const canGroup = Boolean(resolvedItem?.stackable && !isEquippable);

      if (!canGroup) {
        rows.push({
          key: `instance:${entry.instanceId}`,
          entries: [entry],
          entry,
          resolvedItem,
          totalQuantity: Math.max(1, entry.quantity ?? 1),
          grouped: false,
        });
        continue;
      }

      const displayId = getEntryDisplayId(entry);
      const groupKey = `${entry.source}:${displayId}`;
      const existingIndex = groupedIndexes.get(groupKey);

      if (existingIndex === undefined) {
        groupedIndexes.set(groupKey, rows.length);
        rows.push({
          key: `group:${groupKey}`,
          entries: [entry],
          entry,
          resolvedItem,
          totalQuantity: Math.max(1, entry.quantity ?? 1),
          grouped: false,
        });
      } else {
        const existing = rows[existingIndex];
        existing.entries.push(entry);
        existing.totalQuantity += Math.max(1, entry.quantity ?? 1);
        existing.grouped = true;
      }
    }

    return rows;
  }, [resolvedEquipment]);

  const equippedBySlot = useMemo(() => {
    const slotMap: Partial<Record<EquipmentSlotId, CharacterEquipmentEntry>> =
      {};

    for (const entry of normalizedEquipment) {
      for (const slot of entry.equippedSlots ?? []) {
        slotMap[slot] = entry;
      }
    }

    return slotMap;
  }, [normalizedEquipment]);

  const handleUnequip = (instanceId: string) => {
    const next = normalizedEquipment.map((entry) =>
      entry.instanceId === instanceId ? unequipEntry(entry) : entry,
    );

    onChange(next);
  };

  const handleEquip = (
    instanceId: string,
    item: NonNullable<ResolvedEquipmentRow["resolvedItem"]>,
    mode?: WieldMode,
  ) => {
    const slotsToOccupy = getOccupiedSlotsForEquip(item, mode);

    if (slotsToOccupy.length === 0) {
      return;
    }

    const next = normalizedEquipment.map((entry) => ({ ...entry }));

    const targetIndex = next.findIndex(
      (entry) => entry.instanceId === instanceId,
    );

    if (targetIndex < 0) {
      return;
    }

    /*
     * Equipping always represents one physical item.
     *
     * Older/imported inventories can still contain an equippable entry with a
     * quantity greater than 1 (for example 2× Longsword). Split that stack
     * before equipping so one sword can be in Main Hand while the other remains
     * available to equip in Off Hand.
     */
    const targetQuantity = Math.max(1, next[targetIndex].quantity ?? 1);

    if (targetQuantity > 1) {
      const remainder: CharacterEquipmentEntry = {
        ...unequipEntry(next[targetIndex]),
        instanceId: crypto.randomUUID(),
        quantity: targetQuantity - 1,
      };

      next[targetIndex] = {
        ...next[targetIndex],
        quantity: 1,
      };

      next.splice(targetIndex + 1, 0, remainder);
    }

    /*
     * Unequip any other item that currently occupies one of the requested
     * slots. The target itself is skipped so changing its wield mode does not
     * unnecessarily clear it first.
     */
    for (let i = 0; i < next.length; i += 1) {
      const entry = next[i];

      if (entry.instanceId === instanceId) {
        continue;
      }

      const occupied = entry.equippedSlots ?? [];
      const conflicts = occupied.some((slot) => slotsToOccupy.includes(slot));

      if (conflicts) {
        next[i] = unequipEntry(entry);
      }
    }

    const finalTargetIndex = next.findIndex(
      (entry) => entry.instanceId === instanceId,
    );

    if (finalTargetIndex < 0) {
      return;
    }

    next[finalTargetIndex] = {
      ...next[finalTargetIndex],
      quantity: 1,
      equipped: true,
      equippedSlots: slotsToOccupy,
      ...(mode ? { wieldMode: mode } : {}),
    };

    onChange(next);
  };

  /*
   * Quantity changes operate on the real stored equipment entries rather than
   * on the grouped display row.
   *
   * For visually grouped items, decrementing consumes the last underlying
   * stack first. If that stack reaches zero, its equipment entry is removed.
   * Incrementing adds to the first underlying stack.
   */
  const handleAdjustQuantity = (row: InventoryDisplayRow, delta: number) => {
    if (delta === 0 || row.entries.length === 0) {
      return;
    }

    const next = normalizedEquipment.map((entry) => ({
      ...entry,
    }));

    if (delta > 0) {
      const target = row.entries[0];

      const targetIndex = next.findIndex(
        (entry) => entry.instanceId === target.instanceId,
      );

      if (targetIndex < 0) {
        return;
      }

      next[targetIndex] = {
        ...next[targetIndex],
        quantity: Math.max(1, next[targetIndex].quantity ?? 1) + delta,
      };

      void onChange(next);
      return;
    }

    let remainingToRemove = Math.abs(delta);

    /*
     * Work backwards through the underlying entries. This keeps the oldest
     * stack/instance stable while reducing newer duplicate stacks first.
     */
    for (
      let entryIndex = row.entries.length - 1;
      entryIndex >= 0 && remainingToRemove > 0;
      entryIndex -= 1
    ) {
      const sourceEntry = row.entries[entryIndex];

      const targetIndex = next.findIndex(
        (entry) => entry.instanceId === sourceEntry.instanceId,
      );

      if (targetIndex < 0) {
        continue;
      }

      const quantity = Math.max(1, next[targetIndex].quantity ?? 1);

      if (quantity > remainingToRemove) {
        next[targetIndex] = {
          ...next[targetIndex],
          quantity: quantity - remainingToRemove,
        };

        remainingToRemove = 0;
      } else {
        remainingToRemove -= quantity;
        next.splice(targetIndex, 1);
      }
    }

    void onChange(next);
  };

  const handleUseItem = (row: InventoryDisplayRow) => {
    handleAdjustQuantity(row, -1);
  };

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
      {/* =====================================================
          INVENTORY
      ===================================================== */}

      <section className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40">
        {displayRows.length > 0 ? (
          <div className="divide-y divide-white/[0.06]">
            {displayRows.map((row) => (
              <InventoryRow
                key={row.key}
                row={row}
                onEquip={handleEquip}
                onUseItem={handleUseItem}
              />
            ))}
          </div>
        ) : (
          <p className="px-4 py-4 text-xs text-zinc-500">
            No equipment added yet.
          </p>
        )}
      </section>

      {/* =====================================================
          SIDE SUMMARY
      ===================================================== */}

      <div className="space-y-3">
        <section className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">
          <SectionLabel>Money</SectionLabel>
          <MoneySummary money={money} />
        </section>

        <section className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">
          <SectionLabel>Equipped</SectionLabel>

          {equipmentSlotOrder.some((slot) => equippedBySlot[slot]) ? (
            <div className="mt-2 divide-y divide-white/[0.055]">
              {equipmentSlotOrder
                .filter((slot) => equippedBySlot[slot])
                .map((slot) => {
                  const equippedItem = equippedBySlot[slot]!;

                  const resolvedItem = resolveItemFromEquipmentEntry(
                    equippedItem,
                    campaignItemsById,
                  );

                  const displayId = getEntryDisplayId(equippedItem);

                  const itemName =
                    resolvedItem?.name ??
                    equippedItem.name ??
                    (displayId ? formatLabel(displayId) : "Unknown Item");

                  const occupiedSlots = equippedItem.equippedSlots ?? [];
                  const isPrimarySlot = occupiedSlots[0] === slot;

                  /*
                   * Multi-slot equipment should only be rendered once.
                   * The first occupied slot becomes its visual home.
                   */
                  if (!isPrimarySlot) {
                    return null;
                  }

                  const itemContent = (
                    <div className="min-w-0">
                      <p
                        className="truncate text-[11px] font-medium text-zinc-200"
                        title={itemName}
                      >
                        {itemName}
                      </p>

                      {occupiedSlots.length > 1 ? (
                        <p className="mt-1 text-[9px] font-medium text-zinc-500">
                          {equippedItem.wieldMode === "two-handed"
                            ? "Two-Handed"
                            : occupiedSlots
                                .map(
                                  (occupiedSlot) =>
                                    equipmentSlotLabels[occupiedSlot],
                                )
                                .join(" · ")}
                        </p>
                      ) : null}
                    </div>
                  );

                  return (
                    <div
                      key={slot}
                      className="grid min-h-[44px] grid-cols-[112px_minmax(0,1fr)] items-start gap-2 py-2 first:pt-0 last:pb-0"
                    >
                      <span className="whitespace-nowrap pt-1 text-[9px] font-semibold uppercase tracking-[0.07em] text-zinc-500">
                        {equipmentSlotLabels[slot]}
                      </span>

                      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
                        <div className="min-w-0 flex-1">
                          {resolvedItem ? (
                            <ItemTooltip
                              item={resolvedItem}
                              className="min-w-0 max-w-full"
                            >
                              <div className="-ml-1 min-w-0 cursor-pointer rounded px-1 py-0.5 transition hover:bg-white/[0.04]">
                                {itemContent}
                              </div>
                            </ItemTooltip>
                          ) : (
                            itemContent
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUnequip(equippedItem.instanceId)}
                          className="shrink-0 rounded-md border border-rose-500/15 bg-rose-500/[0.05] px-2 py-1 text-[9px] font-semibold text-rose-300/85 transition hover:bg-rose-500/10 hover:text-rose-200"
                        >
                          Unequip
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="mt-2 text-[10px] text-zinc-500">No items equipped.</p>
          )}
        </section>
      </div>
    </div>
  );
};

/* =========================================================
   INVENTORY ROW
========================================================= */

const InventoryRow = ({
  row,
  onEquip,
  onUseItem,
}: {
  row: InventoryDisplayRow;

  onEquip: (
    instanceId: string,
    item: NonNullable<InventoryDisplayRow["resolvedItem"]>,
    mode?: WieldMode,
  ) => void;

  onUseItem: (row: InventoryDisplayRow) => void;
}) => {
  const { entry, resolvedItem, totalQuantity } = row;

  const displayId = getEntryDisplayId(entry);

  const isEquippable = isItemEquippable(resolvedItem);

  const actions = getEquipActionsForItem(resolvedItem);

  const itemName = resolvedItem?.name ?? entry.name ?? formatLabel(displayId);

  const category = resolvedItem?.category
    ? formatLabel(resolvedItem.category)
    : null;

  const normalizedCategory = String(resolvedItem?.category ?? "").toLowerCase();

  const isConsumable =
    normalizedCategory === "consumable" || normalizedCategory === "ammunition";

  const itemContent = (
    <div className="min-w-0">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <p className="truncate text-xs font-semibold text-zinc-100">
          {totalQuantity}× {itemName}
        </p>

        {category ? (
          <span className="text-[9px] font-semibold uppercase tracking-[0.07em] text-zinc-500">
            {category}
          </span>
        ) : null}

        {entry.source === "campaign" ? (
          <span className="text-[9px] font-semibold uppercase tracking-[0.07em] text-violet-300/80">
            Campaign
          </span>
        ) : null}
      </div>

      {resolvedItem?.shortDescription ? (
        <p className="mt-1 line-clamp-1 text-[10px] text-zinc-500">
          {resolvedItem.shortDescription}
        </p>
      ) : null}

      {!resolvedItem ? (
        <p className="mt-1 text-[10px] text-amber-300/80">
          Unknown item data · {displayId}
        </p>
      ) : null}
    </div>
  );

  return (
    <div className="grid min-h-[44px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-1.5 transition hover:bg-white/[0.025]">
      {resolvedItem ? (
        <ItemTooltip item={resolvedItem} className="min-w-0 max-w-full">
          <div className="min-w-0 cursor-pointer">{itemContent}</div>
        </ItemTooltip>
      ) : (
        itemContent
      )}

      <div className="flex shrink-0 items-center justify-end gap-1">
        {isConsumable ? (
          <button
            type="button"
            onClick={() => onUseItem(row)}
            disabled={totalQuantity <= 0}
            title={`Use one ${itemName}`}
            className="rounded-md border border-emerald-500/15 bg-emerald-500/[0.06] px-2 py-1 text-[9px] font-semibold text-emerald-300/90 transition hover:border-emerald-500/25 hover:bg-emerald-500/10 hover:text-emerald-200 disabled:cursor-default disabled:opacity-30"
          >
            Use
          </button>
        ) : null}

        {isEquippable ? (
          <>
            {actions.map((action) => (
              <button
                key={`${entry.instanceId}-${action.label}`}
                type="button"
                onClick={() => {
                  if (resolvedItem) {
                    onEquip(entry.instanceId, resolvedItem, action.mode);
                  }
                }}
                className="rounded-md border border-white/[0.08] bg-black/20 px-2 py-1 text-[9px] font-semibold text-zinc-300 transition hover:border-white/15 hover:text-zinc-200"
              >
                {getCompactActionLabel(action.label)}
              </button>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
};

/* =========================================================
   MONEY
========================================================= */

const MoneySummary = ({ money }: { money: Required<Money> }) => {
  const denominations = [
    { key: "pp" as const, label: "PP", className: "text-cyan-200" },
    { key: "gp" as const, label: "GP", className: "text-yellow-400" },
    { key: "ep" as const, label: "EP", className: "text-sky-300" },
    { key: "sp" as const, label: "SP", className: "text-zinc-300" },
    { key: "cp" as const, label: "CP", className: "text-amber-600" },
  ];

  const nonZero = denominations.filter(({ key }) => money[key] > 0);
  const visible = nonZero.length > 0 ? nonZero : [denominations[1]];

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
      {visible.map(({ key, label, className }, index) => (
        <span key={key} className="inline-flex items-baseline gap-1 text-xs">
          {index > 0 ? <span className="mr-1 text-zinc-700">·</span> : null}
          <strong className="text-zinc-100">{money[key]}</strong>
          <span className={`text-[10px] font-semibold ${className}`}>
            {label}
          </span>
        </span>
      ))}
    </div>
  );
};

/* =========================================================
   HELPERS
========================================================= */

const getCompactActionLabel = (label: string) => {
  const normalized = label.toLowerCase();

  if (normalized.includes("main hand")) return "Main";
  if (normalized.includes("off hand")) return "Off";
  if (normalized.includes("two-handed") || normalized.includes("two handed")) {
    return "2H";
  }
  if (normalized === "equip") return "Equip";

  return label;
};

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
    {children}
  </h2>
);

export default CharacterInventoryEquipment;
