import { useMemo } from "react";
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
  WieldMode,
} from "../rulesets/dnd/dnd2024/types";

import ItemTooltip from "./ItemTooltip";

type Props = {
  equipment: CharacterEquipmentEntry[];
  onChange: (nextEquipment: CharacterEquipmentEntry[]) => void;
  campaignItemsById?: Record<string, CampaignItem>;
  moneyCp?: number;
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

const CharacterInventoryEquipment = ({
  equipment,
  onChange,
  campaignItemsById = {},
  moneyCp = 0,
}: Props) => {
  const money = useMemo(() => copperToMoneyBreakdown(moneyCp), [moneyCp]);

  const normalizedEquipment = useMemo(
    () => equipment.map(normalizeEntry),
    [equipment],
  );

  const resolvedEquipment = useMemo(
    () =>
      normalizedEquipment.map((entry) => ({
        entry,
        resolvedItem: resolveItemFromEquipmentEntry(entry, campaignItemsById),
      })),
    [normalizedEquipment, campaignItemsById],
  );

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
    if (slotsToOccupy.length === 0) return;

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
    if (targetIndex < 0) return;

    next[targetIndex] = {
      ...next[targetIndex],
      equipped: true,
      equippedSlots: slotsToOccupy,
      ...(mode ? { wieldMode: mode } : {}),
    };

    onChange(next);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
          <h2 className="mb-5 text-xl font-semibold text-white sm:text-2xl">
            Inventory
          </h2>

          {resolvedEquipment.length > 0 ? (
            <div className="space-y-3">
              {resolvedEquipment.map(({ entry, resolvedItem }) => {
                const rulesItemId = getRulesItemId(entry);
                const displayId = getEntryDisplayId(entry);

                const isEquippable = isItemEquippable(rulesItemId);
                const actions = getEquipActionsForItem(rulesItemId);
                const itemName =
                  resolvedItem?.name ?? entry.name ?? formatLabel(displayId);
                const equippedSlots = entry.equippedSlots ?? [];
                const isEquipped = equippedSlots.length > 0;

                return (
                  <div
                    key={entry.instanceId}
                    className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        {resolvedItem ? (
                          <ItemTooltip item={resolvedItem}>
                            <div className="min-w-0 cursor-pointer rounded-xl transition hover:bg-white/5">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-white">
                                  {itemName}
                                </p>

                                <span className="rounded-full border border-white/10 bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                                  x{entry.quantity}
                                </span>

                                {resolvedItem.category && (
                                  <span className="rounded-full border border-white/10 bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                                    {formatLabel(resolvedItem.category)}
                                  </span>
                                )}

                                {entry.source === "campaign" && (
                                  <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-violet-300">
                                    Campaign Item
                                  </span>
                                )}

                                {isEquipped && (
                                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                                    Equipped
                                  </span>
                                )}
                              </div>

                              {resolvedItem.shortDescription && (
                                <p className="mt-2 text-sm text-zinc-400">
                                  {resolvedItem.shortDescription}
                                </p>
                              )}

                              {isEquipped && (
                                <p className="mt-2 text-sm text-zinc-400">
                                  {equippedSlots
                                    .map((slot) => equipmentSlotLabels[slot])
                                    .join(" • ")}
                                </p>
                              )}
                            </div>
                          </ItemTooltip>
                        ) : (
                          <>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-white">
                                {itemName}
                              </p>

                              <span className="rounded-full border border-white/10 bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                                x{entry.quantity}
                              </span>

                              {entry.source === "campaign" && (
                                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-violet-300">
                                  Campaign Item
                                </span>
                              )}

                              {isEquipped && (
                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                                  Equipped
                                </span>
                              )}
                            </div>

                            <p className="mt-2 text-sm text-amber-300">
                              Item data could not be resolved.
                            </p>

                            {isEquipped && (
                              <p className="mt-2 text-sm text-zinc-400">
                                {equippedSlots
                                  .map((slot) => equipmentSlotLabels[slot])
                                  .join(" • ")}
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {isEquippable ? (
                          <>
                            {actions.map((action) => {
                              const selectedSlots = getOccupiedSlotsForEquip(
                                rulesItemId,
                                action.mode,
                              );

                              const isSelected =
                                selectedSlots.length > 0 &&
                                selectedSlots.length === equippedSlots.length &&
                                selectedSlots.every((slot) =>
                                  equippedSlots.includes(slot),
                                );

                              return (
                                <button
                                  key={`${entry.instanceId}-${action.label}`}
                                  type="button"
                                  onClick={() =>
                                    handleEquip(
                                      entry.instanceId,
                                      rulesItemId,
                                      action.mode,
                                    )
                                  }
                                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                                    isSelected
                                      ? "bg-emerald-500 text-black"
                                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                                  }`}
                                >
                                  {action.label}
                                </button>
                              );
                            })}

                            {isEquipped && (
                              <button
                                type="button"
                                onClick={() => handleUnequip(entry.instanceId)}
                                className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                              >
                                Unequip
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No equipment added yet.</p>
          )}
        </section>
      </div>

      <div className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
          <h2 className="mb-5 text-xl font-semibold text-white sm:text-2xl">
            Money
          </h2>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
            <div className="flex flex-wrap items-end gap-3 text-sm font-semibold text-white">
              <span className="inline-flex items-center gap-1">
                <span>{money.gp}</span>
                <span className="text-yellow-400">GP</span>
              </span>

              <span className="inline-flex items-center gap-1">
                <span>{money.sp}</span>
                <span className="text-zinc-300">SP</span>
              </span>

              <span className="inline-flex items-center gap-1">
                <span>{money.cp}</span>
                <span className="text-amber-600">CP</span>
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
          <h2 className="mb-5 text-xl font-semibold text-white sm:text-2xl">
            Equipped Slots
          </h2>

          <div className="grid gap-3">
            {equipmentSlotOrder.map((slot) => {
              const equippedItem = equippedBySlot[slot];
              const resolvedItem = equippedItem
                ? resolveItemFromEquipmentEntry(equippedItem, campaignItemsById)
                : null;
              const displayId = equippedItem
                ? getEntryDisplayId(equippedItem)
                : undefined;

              return (
                <div
                  key={slot}
                  className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {equipmentSlotLabels[slot]}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    {equippedItem
                      ? (resolvedItem?.name ??
                        equippedItem.name ??
                        (displayId ? formatLabel(displayId) : "Unknown Item"))
                      : "Empty"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CharacterInventoryEquipment;