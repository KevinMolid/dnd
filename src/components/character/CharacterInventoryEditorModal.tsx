import { useEffect, useMemo, useState } from "react";

import ItemPickerModal from "./ItemPickerModal";

import { itemsById } from "../../rulesets/dnd/dnd2024/data/items";
import { resolveItemFromEquipmentEntry } from "../../rulesets/dnd/dnd2024/resolveItem";

import type {
  CampaignItem,
  CharacterEquipmentEntry,
  Money,
} from "../../rulesets/dnd/dnd2024/types";

type Props = {
  open: boolean;
  equipment: CharacterEquipmentEntry[];
  money: Money;
  campaignItemsById?: Record<string, CampaignItem>;
  onClose: () => void;
  onSave: (
    equipment: CharacterEquipmentEntry[],
    money: Money,
  ) => void | Promise<void>;
};

const defaultMoney: Required<Money> = {
  cp: 0,
  sp: 0,
  ep: 0,
  gp: 0,
  pp: 0,
};

const denominations = [
  { key: "pp" as const, label: "PP" },
  { key: "gp" as const, label: "GP" },
  { key: "ep" as const, label: "EP" },
  { key: "sp" as const, label: "SP" },
  { key: "cp" as const, label: "CP" },
];

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const createEquipmentInstanceId = (
  baseId: string,
  equipment: CharacterEquipmentEntry[],
) => {
  const usedIds = new Set(equipment.map((entry) => entry.instanceId));

  let number = 1;

  while (usedIds.has(`${baseId}__${number}`)) {
    number += 1;
  }

  return `${baseId}__${number}`;
};

const normalizeMoney = (money?: Money): Required<Money> => ({
  cp: Math.max(0, Math.floor(money?.cp ?? 0)),
  sp: Math.max(0, Math.floor(money?.sp ?? 0)),
  ep: Math.max(0, Math.floor(money?.ep ?? 0)),
  gp: Math.max(0, Math.floor(money?.gp ?? 0)),
  pp: Math.max(0, Math.floor(money?.pp ?? 0)),
});

const CharacterInventoryEditorModal = ({
  open,
  equipment,
  money,
  campaignItemsById = {},
  onClose,
  onSave,
}: Props) => {
  const [draftEquipment, setDraftEquipment] = useState<
    CharacterEquipmentEntry[]
  >([]);

  const [draftMoney, setDraftMoney] = useState<Required<Money>>(defaultMoney);

  const [itemPickerOpen, setItemPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraftEquipment(
      equipment.map((entry) => ({
        ...entry,
        equippedSlots: [...(entry.equippedSlots ?? [])],
      })),
    );

    setDraftMoney(normalizeMoney(money));
    setItemPickerOpen(false);
    setSaving(false);
  }, [open, equipment, money]);

  const rows = useMemo(
    () =>
      draftEquipment.map((entry) => {
        const resolvedItem = resolveItemFromEquipmentEntry(
          entry,
          campaignItemsById,
        );

        const displayId =
          entry.source === "campaign" ? entry.campaignItemId : entry.itemId;

        return {
          entry,
          resolvedItem,
          name:
            resolvedItem?.name ??
            entry.name ??
            (displayId ? formatLabel(displayId) : "Unknown Item"),
          category: resolvedItem?.category
            ? formatLabel(String(resolvedItem.category))
            : "Item",
        };
      }),
    [draftEquipment, campaignItemsById],
  );

  if (!open) {
    return null;
  }

  const addCatalogItem = (itemId: string, quantity = 1) => {
    const item = itemsById[itemId];

    if (!item) {
      return;
    }

    const safeQuantity = Math.max(1, Math.floor(quantity) || 1);

    setDraftEquipment((current) => {
      const existing = current.find(
        (entry) =>
          (entry.source === "base" || entry.source === undefined) &&
          entry.itemId === itemId &&
          !entry.equipped &&
          (entry.equippedSlots?.length ?? 0) === 0,
      );

      if (existing) {
        return current.map((entry) =>
          entry.instanceId === existing.instanceId
            ? {
                ...entry,
                quantity: Math.max(1, entry.quantity ?? 1) + safeQuantity,
              }
            : entry,
        );
      }

      return [
        ...current,
        {
          instanceId: createEquipmentInstanceId(itemId, current),
          source: "base",
          itemId,
          name: item.name,
          quantity: safeQuantity,
          equipped: false,
          equippedSlots: [],
        },
      ];
    });
  };

  const updateQuantity = (instanceId: string, quantity: number) => {
    const safeQuantity = Math.max(1, Math.floor(quantity) || 1);

    setDraftEquipment((current) =>
      current.map((entry) =>
        entry.instanceId === instanceId
          ? {
              ...entry,
              quantity: safeQuantity,
            }
          : entry,
      ),
    );
  };

  const removeItem = (instanceId: string) => {
    setDraftEquipment((current) =>
      current.filter((entry) => entry.instanceId !== instanceId),
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await onSave(
        draftEquipment.map((entry) => ({
          ...entry,
          quantity: Math.max(1, Math.floor(entry.quantity ?? 1)),
        })),
        normalizeMoney(draftMoney),
      );

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !saving) {
            onClose();
          }
        }}
      >
        <section className="flex max-h-[min(760px,calc(100vh-24px))] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl">
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.08] px-4 py-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Character Inventory
              </p>

              <h2 className="mt-0.5 text-base font-semibold text-white">
                Edit Inventory
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              aria-label="Close inventory editor"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-zinc-500 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
            >
              ×
            </button>
          </header>

          <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <section>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-200">
                      Equipment
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setItemPickerOpen(true)}
                    className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold text-zinc-300 transition hover:bg-white/[0.1] hover:text-white"
                  >
                    + Add Item
                  </button>
                </div>

                {rows.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900/30">
                    <div className="divide-y divide-white/[0.055]">
                      {rows.map(({ entry, resolvedItem, name, category }) => (
                        <div
                          key={entry.instanceId}
                          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                              <p className="truncate text-xs font-semibold text-zinc-100">
                                {name}
                              </p>

                              <span className="text-[9px] font-semibold uppercase tracking-[0.07em] text-zinc-500">
                                {category}
                              </span>

                              {entry.source === "campaign" ? (
                                <span className="text-[9px] font-semibold uppercase tracking-[0.07em] text-violet-300/80">
                                  Campaign
                                </span>
                              ) : null}

                              {(entry.equippedSlots?.length ?? 0) > 0 ? (
                                <span className="text-[9px] font-semibold uppercase tracking-[0.07em] text-emerald-300/80">
                                  Equipped
                                </span>
                              ) : null}
                            </div>

                            {resolvedItem?.shortDescription ? (
                              <p className="mt-1 line-clamp-1 text-[10px] text-zinc-500">
                                {resolvedItem.shortDescription}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex shrink-0 items-center gap-1.5">
                            <label className="flex h-8 items-center overflow-hidden rounded-md border border-white/[0.08] bg-black/20">
                              <span className="border-r border-white/[0.06] px-2 text-[9px] font-semibold uppercase tracking-[0.06em] text-zinc-600">
                                Qty
                              </span>

                              <input
                                type="number"
                                min={1}
                                value={Math.max(1, entry.quantity ?? 1)}
                                onChange={(event) =>
                                  updateQuantity(
                                    entry.instanceId,
                                    Number(event.target.value),
                                  )
                                }
                                className="h-full w-14 bg-transparent px-2 text-center text-[10px] font-semibold text-zinc-200 outline-none"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => removeItem(entry.instanceId)}
                              className="rounded-md border border-rose-500/15 bg-rose-500/[0.05] px-2 py-1.5 text-[9px] font-semibold text-rose-300/85 transition hover:bg-rose-500/10 hover:text-rose-200"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/[0.08] bg-zinc-900/20 px-4 py-6 text-center text-xs text-zinc-600">
                    No equipment added.
                  </div>
                )}
              </section>

              <section>
                <div className="mb-2">
                  <h3 className="text-xs font-semibold text-zinc-200">Money</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/[0.08] bg-zinc-900/30 p-3 sm:grid-cols-5">
                  {denominations.map(({ key, label }) => (
                    <label key={key} className="block">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                        {label}
                      </span>

                      <input
                        type="number"
                        min={0}
                        value={draftMoney[key]}
                        onChange={(event) => {
                          const value = Math.max(
                            0,
                            Math.floor(Number(event.target.value) || 0),
                          );

                          setDraftMoney((current) => ({
                            ...current,
                            [key]: value,
                          }));
                        }}
                        className="mt-1 w-full rounded-lg border border-white/[0.08] bg-zinc-950/70 px-2.5 py-2 text-sm font-semibold tabular-nums text-zinc-100 outline-none transition focus:border-white/20"
                      />
                    </label>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-white/[0.08] px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-semibold text-zinc-400 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </footer>
        </section>
      </div>

      <ItemPickerModal
        isOpen={itemPickerOpen}
        onClose={() => setItemPickerOpen(false)}
        onSelect={addCatalogItem}
      />
    </>
  );
};

export default CharacterInventoryEditorModal;
