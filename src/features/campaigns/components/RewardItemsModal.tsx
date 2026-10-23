import { useEffect, useMemo, useState } from "react";
import { allItems, itemsById } from "../../../rulesets/dnd/dnd2024/data/items";
import { moneyBreakdownToCopper } from "../../../rulesets/dnd/dnd2024/money";
import type { CampaignItem } from "../../../rulesets/dnd/dnd2024/types";

type CharacterOption = {
  id: string;
  name: string;
  ownerUid?: string | null;
};

type SelectedRewardItem =
  | {
      source: "base";
      itemId: string;
      quantity: number;
    }
  | {
      source: "campaign";
      campaignItemId: string;
      quantity: number;
    };

type RewardMoney = {
  cp: number;
  sp: number;
  gp: number;
};

type RewardItemsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterOption[];
  campaignItemsById?: Record<string, CampaignItem>;
  onConfirm: (payload: {
    reason?: string;
    characterIds: string[];
    money: {
      cp: number;
      sp: number;
      gp: number;
    };
    items: (
      | { source: "base"; itemId: string; quantity: number }
      | {
          source: "campaign";
          campaignItemId: string;
          quantity: number;
        }
    )[];
  }) => Promise<void>;
};

type SearchableRewardItem =
  | {
      source: "base";
      id: string;
      name: string;
      category: string;
      stackable?: boolean;
      magical?: boolean;
      baseItemId: string;
      shortDescription?: string;
    }
  | {
      source: "campaign";
      id: string;
      name: string;
      category: string;
      stackable?: boolean;
      magical?: boolean;
      baseItemId?: string;
      campaignItemId: string;
      shortDescription?: string;
    };

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const RewardItemsModal = ({
  isOpen,
  onClose,
  characters,
  campaignItemsById = {},
  onConfirm,
}: RewardItemsModalProps) => {
  const [search, setSearch] = useState("");
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
    [],
  );
  const [money, setMoney] = useState<RewardMoney>({
    cp: 0,
    sp: 0,
    gp: 0,
  });
  const [selectedItems, setSelectedItems] = useState<SelectedRewardItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [currencyMode, setCurrencyMode] = useState<"per-character" | "total">(
    "per-character",
  );
  const [submitError, setSubmitError] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setSearch("");
    setSelectedCharacterIds([]);
    setMoney({
      cp: 0,
      sp: 0,
      gp: 0,
    });
    setSelectedItems([]);
    setSubmitting(false);
    setCurrencyMode("per-character");
    setSubmitError("");
    setReason("");
  }, [isOpen]);

  const searchableItems = useMemo<SearchableRewardItem[]>(() => {
    const baseItems: SearchableRewardItem[] = [...allItems].map((item) => ({
      source: "base",
      id: item.id,
      name: item.name,
      category: item.category,
      stackable: item.stackable,
      magical: item.magical,
      baseItemId: item.id,
    }));

    const campaignItems: SearchableRewardItem[] = Object.values(
      campaignItemsById,
    ).flatMap((campaignItem) => {
      const baseItem = campaignItem.baseItemId
        ? itemsById[campaignItem.baseItemId]
        : undefined;

      const resolvedItem = campaignItem.customItem ?? baseItem;
      if (!resolvedItem) return [];

      return [
        {
          source: "campaign" as const,
          id: campaignItem.id,
          campaignItemId: campaignItem.id,
          ...(campaignItem.baseItemId
            ? { baseItemId: campaignItem.baseItemId }
            : {}),
          name: campaignItem.name ?? resolvedItem.name,
          category: resolvedItem.category,
          stackable: resolvedItem.stackable,
          magical: campaignItem.overrides?.magical ?? resolvedItem.magical,
          shortDescription:
            campaignItem.shortDescription ?? resolvedItem.description,
        },
      ];
    });

    return [...campaignItems, ...baseItems].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [campaignItemsById]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return searchableItems.slice(0, 75);
    }

    return searchableItems
      .filter((item) => {
        const idMatch = item.id.toLowerCase().includes(query);
        const nameMatch = item.name.toLowerCase().includes(query);
        const categoryMatch = item.category.toLowerCase().includes(query);
        const baseItemMatch =
          item.baseItemId?.toLowerCase().includes(query) ?? false;

        return idMatch || nameMatch || categoryMatch || baseItemMatch;
      })
      .slice(0, 75);
  }, [search, searchableItems]);

  if (!isOpen) return null;

  const toggleCharacter = (id: string) => {
    setSelectedCharacterIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  };

  const addBaseItem = (itemId: string) => {
    setSelectedItems((current) => {
      const existing = current.find(
        (item) => item.source === "base" && item.itemId === itemId,
      );

      if (existing) {
        return current.map((item) =>
          item.source === "base" && item.itemId === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { source: "base", itemId, quantity: 1 }];
    });
  };

  const addCampaignItem = (campaignItemId: string) => {
    setSelectedItems((current) => {
      const existing = current.find(
        (item) =>
          item.source === "campaign" && item.campaignItemId === campaignItemId,
      );

      if (existing) {
        return current.map((item) =>
          item.source === "campaign" && item.campaignItemId === campaignItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...current,
        {
          source: "campaign",
          campaignItemId,
          quantity: 1,
        },
      ];
    });
  };

  const updateItemQuantity = (
    target:
      | { source: "base"; itemId: string }
      | { source: "campaign"; campaignItemId: string },
    quantity: number,
  ) => {
    const nextQuantity = Math.max(1, Math.floor(quantity) || 1);

    setSelectedItems((current) =>
      current.map((item) => {
        if (
          target.source === "base" &&
          item.source === "base" &&
          item.itemId === target.itemId
        ) {
          return { ...item, quantity: nextQuantity };
        }

        if (
          target.source === "campaign" &&
          item.source === "campaign" &&
          item.campaignItemId === target.campaignItemId
        ) {
          return { ...item, quantity: nextQuantity };
        }

        return item;
      }),
    );
  };

  const removeItem = (
    target:
      | { source: "base"; itemId: string }
      | { source: "campaign"; campaignItemId: string },
  ) => {
    setSelectedItems((current) =>
      current.filter((item) => {
        if (
          target.source === "base" &&
          item.source === "base" &&
          item.itemId === target.itemId
        ) {
          return false;
        }

        if (
          target.source === "campaign" &&
          item.source === "campaign" &&
          item.campaignItemId === target.campaignItemId
        ) {
          return false;
        }

        return true;
      }),
    );
  };

  const updateMoney = (currency: keyof RewardMoney, value: number) => {
    setMoney((current) => ({
      ...current,
      [currency]: Math.max(0, Math.floor(value)),
    }));
  };

  const normalizeMoney = (): RewardMoney => ({
    cp: Math.max(0, Math.floor(money.cp)),
    sp: Math.max(0, Math.floor(money.sp)),
    gp: Math.max(0, Math.floor(money.gp)),
  });

  const handleSubmit = async () => {
    const normalizedMoney = normalizeMoney();

    const normalizedItems = selectedItems
      .map((item) =>
        item.source === "base"
          ? {
              source: "base" as const,
              itemId: item.itemId,
              quantity: Math.max(1, Math.floor(item.quantity) || 1),
            }
          : {
              source: "campaign" as const,
              campaignItemId: item.campaignItemId,
              quantity: Math.max(1, Math.floor(item.quantity) || 1),
            },
      )
      .filter((item) =>
        item.source === "base" ? !!item.itemId : !!item.campaignItemId,
      );

    const rewardMoneyCp = moneyBreakdownToCopper(normalizedMoney);
    const hasMoney = rewardMoneyCp > 0;

    if (
      selectedCharacterIds.length === 0 ||
      (!hasMoney && normalizedItems.length === 0)
    ) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");
      const rewardReason = reason.trim().slice(0, 100);

      if (
        currencyMode === "per-character" ||
        selectedCharacterIds.length === 1 ||
        !hasMoney
      ) {
        await onConfirm({
          reason: rewardReason,
          characterIds: selectedCharacterIds,
          money: normalizedMoney,
          items: normalizedItems,
        });
      } else {
        // Divide the full monetary value in copper pieces, then convert each
        // recipient's share back to GP / SP / CP. This also handles uneven
        // totals: any remainder is assigned one copper at a time in the
        // order the characters were selected, without losing money.
        const count = selectedCharacterIds.length;
        const copperTotal = moneyBreakdownToCopper(normalizedMoney);
        const share = Math.floor(copperTotal / count);
        const remainder = copperTotal % count;
        const toMoney = (copper: number): RewardMoney => ({
          gp: Math.floor(copper / 100),
          sp: Math.floor((copper % 100) / 10),
          cp: copper % 10,
        });
        // Same items go to every selected character, as in Per character mode.
        // A separate call is necessary because the existing onConfirm API only
        // accepts a single common money amount for all recipient IDs.
        for (let index = 0; index < count; index++) {
          const amount = share + (index < remainder ? 1 : 0);
          await onConfirm({
            reason: rewardReason,
            characterIds: [selectedCharacterIds[index]],
            money: toMoney(amount),
            items: normalizedItems,
          });
        }
      }

      setSearch("");
      setSelectedCharacterIds([]);
      setMoney({
        cp: 0,
        sp: 0,
        gp: 0,
      });
      setSelectedItems([]);
      setReason("");
    } catch (error) {
      console.error("Failed to give rewards:", error);
      setSubmitError(
        "Could not complete all rewards. Some characters may already have received theirs. Check inventories before retrying.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const normalizedMoney = normalizeMoney();
  const rewardMoneyCp = moneyBreakdownToCopper(normalizedMoney);
  const hasMoney = rewardMoneyCp > 0;

  const canSubmit =
    selectedCharacterIds.length > 0 &&
    (hasMoney || selectedItems.length > 0) &&
    !submitting;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 sm:p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reward-items-title"
        className="flex h-[min(760px,94dvh)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3">
          <div className="min-w-0">
            <h2
              id="reward-items-title"
              className="text-sm font-bold text-white"
            >
              Reward items
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close rewards"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-50"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-rows-[minmax(180px,1fr)_minmax(220px,1fr)] md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:grid-rows-1">
          {/* Item search and compact results */}
          <section
            className="flex min-h-0 flex-col border-b border-white/[0.08] md:border-b-0 md:border-r"
            aria-label="Find items"
          >
            <div className="shrink-0 px-3 pb-2 pt-3">
              <div className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 focus-within:border-white/25">
                <i className="fa-solid fa-magnifying-glass text-[11px] text-zinc-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search items..."
                  aria-label="Search items"
                  className="min-w-0 flex-1 bg-transparent text-xs text-zinc-100 outline-none placeholder:text-zinc-400"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="text-zinc-400 hover:text-white"
                  >
                    <i className="fa-solid fa-xmark text-[11px]" />
                  </button>
                ) : null}
              </div>
            </div>
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-3">
              {filteredItems.length === 0 ? (
                <p className="rounded-lg border border-dashed border-white/10 px-3 py-6 text-center text-xs text-zinc-400">
                  No matching items
                </p>
              ) : (
                <div className="divide-y divide-white/[0.06] rounded-lg border border-white/[0.07] bg-white/[0.02]">
                  {filteredItems.map((item) => {
                    const existing = selectedItems.find((entry) =>
                      item.source === "base"
                        ? entry.source === "base" && entry.itemId === item.id
                        : entry.source === "campaign" &&
                          entry.campaignItemId === item.campaignItemId,
                    );
                    return (
                      <div
                        key={`${item.source}-${item.id}`}
                        className="flex min-h-12 items-center gap-2 px-2.5 py-2 transition hover:bg-white/[0.035]"
                      >
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-xs font-semibold text-zinc-200"
                            title={item.name}
                          >
                            {item.name}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] text-zinc-400">
                            {formatLabel(item.category)}
                            {item.source === "campaign" ? (
                              <span className="text-violet-400">
                                {" "}
                                · Campaign
                              </span>
                            ) : null}
                            {item.magical ? (
                              <span className="text-amber-400"> · Magic</span>
                            ) : null}
                          </p>
                        </div>
                        {existing ? (
                          <span className="shrink-0 text-[10px] text-emerald-400">
                            ×{existing.quantity}
                          </span>
                        ) : null}
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() =>
                            item.source === "base"
                              ? addBaseItem(item.id)
                              : addCampaignItem(item.campaignItemId)
                          }
                          aria-label={`Add ${item.name}`}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.05] text-zinc-200 transition hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300 disabled:opacity-50"
                        >
                          <i className="fa-solid fa-plus text-[10px]" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Recipients, currency and selected rewards */}
          <section
            className="workspace-scrollbar min-h-0 overflow-y-auto px-3 py-3 md:px-4"
            aria-label="Configure rewards"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-200">Characters</h3>
              <span className="text-[10px] text-zinc-400">
                {selectedCharacterIds.length}/{characters.length} selected
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {characters.map((character) => {
                const selected = selectedCharacterIds.includes(character.id);
                return (
                  <button
                    key={character.id}
                    type="button"
                    disabled={submitting}
                    aria-pressed={selected}
                    onClick={() => toggleCharacter(character.id)}
                    className={`rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition disabled:opacity-50 ${selected ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-200" : "border-white/10 bg-white/[0.035] text-zinc-400 hover:bg-white/[0.08] hover:text-white"}`}
                  >
                    {selected ? (
                      <i className="fa-solid fa-check mr-1.5 text-[9px]" />
                    ) : null}
                    {character.name}
                  </button>
                );
              })}
              {characters.length === 0 ? (
                <p className="text-xs text-zinc-400">No characters available</p>
              ) : null}
            </div>

            <div className="mt-4 border-t border-white/[0.07] pt-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-zinc-200">Currency</h3>
                <div
                  role="group"
                  aria-label="Currency distribution"
                  className="inline-flex rounded-md border border-white/15 bg-black/30 p-0.5"
                >
                  {(["per-character", "total"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      disabled={submitting}
                      aria-pressed={currencyMode === mode}
                      onClick={() => setCurrencyMode(mode)}
                      className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${currencyMode === mode ? "bg-white/[0.14] text-white" : "text-zinc-300 hover:text-white"}`}
                    >
                      {mode === "total" ? "Total" : "Per character"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["gp", "sp", "cp"] as const).map((currency) => (
                  <label
                    key={currency}
                    className="flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-2.5 py-1.5"
                  >
                    <span className="text-[10px] font-bold uppercase text-zinc-400">
                      {currency}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      disabled={submitting}
                      value={money[currency]}
                      onChange={(event) =>
                        updateMoney(currency, Number(event.target.value) || 0)
                      }
                      aria-label={`${currency.toUpperCase()} ${currencyMode === "total" ? "total" : "per character"}`}
                      className="w-full min-w-0 bg-transparent text-right text-xs font-semibold text-zinc-100 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </label>
                ))}
              </div>
              {currencyMode === "total" &&
              selectedCharacterIds.length > 1 &&
              hasMoney ? (
                <p className="mt-1.5 text-[11px] text-zinc-300">
                  Split between {selectedCharacterIds.length} characters; any
                  remaining copper goes to the first selected.
                </p>
              ) : null}
            </div>

            <div className="mt-4 border-t border-white/[0.07] pt-3">
              <label
                htmlFor="reward-reason"
                className="flex items-baseline gap-2 text-xs font-bold text-zinc-200"
              >
                Reason{" "}
                <span className="text-[10px] font-normal text-zinc-400">
                  Optional
                </span>
              </label>
              <input
                id="reward-reason"
                type="text"
                maxLength={100}
                disabled={submitting}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="from a chest in the cabin"
                className="mt-2 h-9 w-full rounded-lg border border-white/10 bg-black/25 px-3 text-xs text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-emerald-400/40 disabled:opacity-50"
              />
            </div>

            <div className="mt-4 border-t border-white/[0.07] pt-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-200">
                  Selected items
                </h3>
                <span className="text-[10px] text-zinc-400">
                  {selectedItems.length} types
                </span>
              </div>
              {selectedItems.length === 0 ? (
                <p className="mt-2 rounded-lg border border-dashed border-white/[0.08] p-3 text-center text-[11px] text-zinc-400">
                  Add items from the list
                </p>
              ) : (
                <div className="mt-2 divide-y divide-white/[0.06] rounded-lg border border-white/[0.07]">
                  {selectedItems.map((entry) => {
                    const campaignItem =
                      entry.source === "campaign"
                        ? campaignItemsById[entry.campaignItemId]
                        : undefined;
                    const baseItem =
                      entry.source === "base"
                        ? itemsById[entry.itemId]
                        : campaignItem?.baseItemId
                          ? itemsById[campaignItem.baseItemId]
                          : undefined;
                    const resolved =
                      entry.source === "campaign"
                        ? (campaignItem?.customItem ?? baseItem)
                        : baseItem;
                    const name =
                      entry.source === "base"
                        ? (resolved?.name ?? entry.itemId)
                        : (campaignItem?.name ??
                          resolved?.name ??
                          entry.campaignItemId);
                    const target =
                      entry.source === "base"
                        ? { source: "base" as const, itemId: entry.itemId }
                        : {
                            source: "campaign" as const,
                            campaignItemId: entry.campaignItemId,
                          };
                    return (
                      <div
                        key={`${entry.source}-${entry.source === "base" ? entry.itemId : entry.campaignItemId}`}
                        className="flex min-h-10 items-center gap-2 px-2.5 py-1.5"
                      >
                        <span
                          className="min-w-0 flex-1 truncate text-[11px] font-medium text-zinc-200"
                          title={name}
                        >
                          {name}
                        </span>
                        <div className="flex shrink-0 items-center overflow-hidden rounded-md border border-white/10">
                          <button
                            type="button"
                            disabled={submitting || entry.quantity <= 1}
                            onClick={() =>
                              updateItemQuantity(target, entry.quantity - 1)
                            }
                            aria-label={`Decrease ${name}`}
                            className="h-7 w-7 text-zinc-400 hover:bg-white/[0.07] disabled:opacity-30"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-xs font-semibold tabular-nums">
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={() =>
                              updateItemQuantity(target, entry.quantity + 1)
                            }
                            aria-label={`Increase ${name}`}
                            className="h-7 w-7 text-zinc-400 hover:bg-white/[0.07] disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => removeItem(target)}
                          aria-label={`Remove ${name}`}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
                        >
                          <i className="fa-solid fa-trash-can text-[10px]" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        {submitError ? (
          <p
            role="alert"
            className="border-t border-red-500/20 px-4 py-2 text-xs text-red-300"
          >
            {submitError}
          </p>
        ) : null}
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.08] px-3 py-2.5 sm:px-4">
          <p className="min-w-0 truncate text-[11px] text-zinc-400">
            {selectedCharacterIds.length} characters · {selectedItems.length}{" "}
            items
            {hasMoney
              ? ` · ${normalizedMoney.gp} GP, ${normalizedMoney.sp} SP, ${normalizedMoney.cp} CP ${currencyMode === "total" ? "total" : "each"}`
              : ""}
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-400 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-bold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {submitting ? "Giving..." : "Give rewards"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RewardItemsModal;
