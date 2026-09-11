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

const getRulesItemId = (entry: CharacterEquipmentEntry) =>
  entry.source === "campaign" ? entry.baseItemId : entry.itemId;

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

      const rulesItemId = getRulesItemId(entry);
      const isEquippable = isItemEquippable(rulesItemId);
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
    rulesItemId: string,
    mode?: WieldMode,
  ) => {
    const slotsToOccupy = getOccupiedSlotsForEquip(rulesItemId, mode);

    if (slotsToOccupy.length === 0) {
      return;
    }

    const next = normalizedEquipment.map((entry) => ({ ...entry }));

    for (let i = 0; i < next.length; i += 1) {
      const entry = next[i];
      const occupied = entry.equippedSlots ?? [];
      const conflicts = occupied.some((slot) => slotsToOccupy.includes(slot));

      if (conflicts) {
        next[i] = unequipEntry(entry);
      }
    }

    const targetIndex = next.findIndex(
      (entry) => entry.instanceId === instanceId,
    );

    if (targetIndex < 0) {
      return;
    }

    next[targetIndex] = {
      ...next[targetIndex],
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
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_250px]">
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
                onAdjustQuantity={handleAdjustQuantity}
                onUseItem={handleUseItem}
              />
            ))}
          </div>
        ) : (
          <p className="px-4 py-4 text-[10px] text-zinc-600">
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

          <div className="mt-2 divide-y divide-white/[0.055]">
            {equipmentSlotOrder.map((slot) => {
              const equippedItem = equippedBySlot[slot];

              const resolvedItem = equippedItem
                ? resolveItemFromEquipmentEntry(equippedItem, campaignItemsById)
                : null;

              const displayId = equippedItem
                ? getEntryDisplayId(equippedItem)
                : undefined;

              const itemName = equippedItem
                ? (resolvedItem?.name ??
                  equippedItem.name ??
                  (displayId ? formatLabel(displayId) : "Unknown Item"))
                : "—";

              const occupiedSlots = equippedItem?.equippedSlots ?? [];
              const isPrimarySlot = !!equippedItem && occupiedSlots[0] === slot;

              const itemContent = (
                <div className="min-w-0">
                  <p
                    className={`truncate text-[9px] font-medium ${
                      equippedItem ? "text-zinc-200" : "text-zinc-700"
                    }`}
                    title={equippedItem ? itemName : undefined}
                  >
                    {itemName}
                  </p>

                  {equippedItem && occupiedSlots.length > 1 && isPrimarySlot ? (
                    <p className="mt-0.5 text-[7px] text-zinc-600">
                      {occupiedSlots
                        .map(
                          (occupiedSlot) => equipmentSlotLabels[occupiedSlot],
                        )
                        .join(" · ")}
                    </p>
                  ) : null}
                </div>
              );

              return (
                <div
                  key={slot}
                  className="grid min-h-[34px] grid-cols-[74px_minmax(0,1fr)_auto] items-center gap-2 py-1.5 first:pt-0 last:pb-0"
                >
                  <span className="text-[7px] font-semibold uppercase tracking-[0.09em] text-zinc-600">
                    {equipmentSlotLabels[slot]}
                  </span>

                  {equippedItem && resolvedItem ? (
                    <ItemTooltip
                      item={resolvedItem}
                      className="min-w-0 max-w-full"
                    >
                      <div className="min-w-0 cursor-pointer rounded px-1 py-0.5 -ml-1 transition hover:bg-white/[0.04]">
                        {itemContent}
                      </div>
                    </ItemTooltip>
                  ) : (
                    itemContent
                  )}

                  {equippedItem && isPrimarySlot ? (
                    <button
                      type="button"
                      onClick={() => handleUnequip(equippedItem.instanceId)}
                      className="rounded-md border border-rose-500/15 bg-rose-500/[0.05] px-1.5 py-0.5 text-[7px] font-semibold text-rose-300/75 transition hover:bg-rose-500/10 hover:text-rose-200"
                    >
                      Unequip
                    </button>
                  ) : (
                    <span />
                  )}
                </div>
              );
            })}
          </div>
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
  onAdjustQuantity,
  onUseItem,
}: {
  row: InventoryDisplayRow;

  onEquip: (instanceId: string, rulesItemId: string, mode?: WieldMode) => void;

  onAdjustQuantity: (row: InventoryDisplayRow, delta: number) => void;

  onUseItem: (row: InventoryDisplayRow) => void;
}) => {
  const { entry, resolvedItem, totalQuantity } = row;

  const rulesItemId = getRulesItemId(entry);

  const displayId = getEntryDisplayId(entry);

  const isEquippable = isItemEquippable(rulesItemId);

  const actions = getEquipActionsForItem(rulesItemId);

  const itemName = resolvedItem?.name ?? entry.name ?? formatLabel(displayId);

  const category = resolvedItem?.category
    ? formatLabel(resolvedItem.category)
    : null;

  const normalizedCategory = String(resolvedItem?.category ?? "").toLowerCase();

  const isConsumable =
    normalizedCategory === "consumable" || normalizedCategory === "ammunition";

  /*
   * Weapons, armor and other equippable objects remain individual instances.
   * Quantity controls belong to backpack-style inventory rows.
   */
  const canAdjustQuantity = !isEquippable;

  const itemContent = (
    <div className="min-w-0">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <p className="truncate text-[10px] font-semibold text-zinc-100">
          {totalQuantity}× {itemName}
        </p>

        {category ? (
          <span className="text-[7px] font-semibold uppercase tracking-[0.08em] text-zinc-600">
            {category}
          </span>
        ) : null}

        {entry.source === "campaign" ? (
          <span className="text-[7px] font-semibold uppercase tracking-[0.08em] text-violet-400/70">
            Campaign
          </span>
        ) : null}
      </div>

      {resolvedItem?.shortDescription ? (
        <p className="mt-0.5 line-clamp-1 text-[8px] text-zinc-600">
          {resolvedItem.shortDescription}
        </p>
      ) : null}

      {!resolvedItem ? (
        <p className="mt-0.5 text-[8px] text-amber-400/70">
          Unknown item data · {displayId}
        </p>
      ) : null}
    </div>
  );

  return (
    <div className="grid min-h-[38px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-1.5 transition hover:bg-white/[0.025]">
      {resolvedItem ? (
        <ItemTooltip item={resolvedItem} className="min-w-0 max-w-full">
          <div className="min-w-0 cursor-pointer">{itemContent}</div>
        </ItemTooltip>
      ) : (
        itemContent
      )}

      <div className="flex shrink-0 items-center justify-end gap-1">
        {isConsumable && canAdjustQuantity ? (
          <button
            type="button"
            onClick={() => onUseItem(row)}
            disabled={totalQuantity <= 0}
            title={`Use one ${itemName}`}
            className="rounded-md border border-emerald-500/15 bg-emerald-500/[0.06] px-1.5 py-0.5 text-[7px] font-semibold text-emerald-300/80 transition hover:border-emerald-500/25 hover:bg-emerald-500/10 hover:text-emerald-200 disabled:cursor-default disabled:opacity-30"
          >
            Use
          </button>
        ) : null}

        {canAdjustQuantity ? (
          <QuantityControl
            quantity={totalQuantity}
            onDecrease={() => onAdjustQuantity(row, -1)}
            onIncrease={() => onAdjustQuantity(row, 1)}
          />
        ) : null}

        {isEquippable ? (
          <>
            {actions.map((action) => (
              <button
                key={`${entry.instanceId}-${action.label}`}
                type="button"
                onClick={() =>
                  onEquip(entry.instanceId, rulesItemId, action.mode)
                }
                className="rounded-md border border-white/[0.08] bg-black/20 px-1.5 py-0.5 text-[7px] font-semibold text-zinc-400 transition hover:border-white/15 hover:text-zinc-200"
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

const QuantityControl = ({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) => (
  <div
    className="flex h-5 items-center overflow-hidden rounded-md border border-white/[0.08] bg-black/20"
    aria-label="Item quantity controls"
  >
    <button
      type="button"
      onClick={onDecrease}
      title={quantity <= 1 ? "Remove item" : "Decrease quantity"}
      aria-label={quantity <= 1 ? "Remove item" : "Decrease quantity"}
      className="flex h-full w-5 items-center justify-center text-[10px] font-semibold text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
    >
      −
    </button>

    <span className="min-w-[24px] border-x border-white/[0.06] px-1 text-center text-[7px] font-semibold tabular-nums text-zinc-400">
      {quantity}
    </span>

    <button
      type="button"
      onClick={onIncrease}
      title="Increase quantity"
      aria-label="Increase quantity"
      className="flex h-full w-5 items-center justify-center text-[10px] font-semibold text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
    >
      +
    </button>
  </div>
);

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
        <span
          key={key}
          className="inline-flex items-baseline gap-1 text-[10px]"
        >
          {index > 0 ? <span className="mr-1 text-zinc-700">·</span> : null}
          <strong className="text-zinc-100">{money[key]}</strong>
          <span className={`text-[8px] font-semibold ${className}`}>
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
  <h2 className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
    {children}
  </h2>
);

export default CharacterInventoryEquipment;
