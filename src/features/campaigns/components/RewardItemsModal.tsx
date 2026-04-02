import { useEffect, useMemo, useState } from "react";
import { allItems, itemsById } from "../../../rulesets/dnd/dnd2024/data/items";
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
      baseItemId: string;
      quantity: number;
    };

type RewardMoney = {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
};

type RewardItemsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterOption[];
  campaignItemsById?: Record<string, CampaignItem>;
  onConfirm: (payload: {
    characterIds: string[];
    money: {
      cp: number;
      sp: number;
      ep: number;
      gp: number;
      pp: number;
    };
    items: (
      | { source: "base"; itemId: string; quantity: number }
      | {
          source: "campaign";
          campaignItemId: string;
          baseItemId: string;
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
      baseItemId: string;
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
  const [money, setMoney] = useState<{
    cp: string;
    sp: string;
    ep: string;
    gp: string;
    pp: string;
  }>({
    cp: "0",
    sp: "0",
    ep: "0",
    gp: "0",
    pp: "0",
  });
  const [selectedItems, setSelectedItems] = useState<SelectedRewardItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setSearch("");
    setSelectedCharacterIds([]);
    setMoney({
      cp: "0",
      sp: "0",
      ep: "0",
      gp: "0",
      pp: "0",
    });
    setSelectedItems([]);
    setSubmitting(false);
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
      const baseItem = itemsById[campaignItem.baseItemId];
      if (!baseItem) return [];

      return [
        {
          source: "campaign" as const,
          id: campaignItem.id,
          campaignItemId: campaignItem.id,
          baseItemId: campaignItem.baseItemId,
          name: campaignItem.name ?? baseItem.name,
          category: baseItem.category,
          stackable: baseItem.stackable,
          magical: campaignItem.overrides?.magical ?? baseItem.magical,
          shortDescription: campaignItem.shortDescription,
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
        const baseItemMatch = item.baseItemId.toLowerCase().includes(query);

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

  const addCampaignItem = (campaignItemId: string, baseItemId: string) => {
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
          baseItemId,
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

  const updateMoney = (currency: keyof RewardMoney, value: string) => {
    setMoney((current) => ({
      ...current,
      [currency]: value,
    }));
  };

  const normalizeMoney = (): RewardMoney => ({
    cp: Math.max(0, Math.floor(Number(money.cp) || 0)),
    sp: Math.max(0, Math.floor(Number(money.sp) || 0)),
    ep: Math.max(0, Math.floor(Number(money.ep) || 0)),
    gp: Math.max(0, Math.floor(Number(money.gp) || 0)),
    pp: Math.max(0, Math.floor(Number(money.pp) || 0)),
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
              baseItemId: item.baseItemId,
              quantity: Math.max(1, Math.floor(item.quantity) || 1),
            },
      )
      .filter((item) =>
        item.source === "base" ? !!item.itemId : !!item.campaignItemId,
      );

    const hasMoney = Object.values(normalizedMoney).some((amount) => amount > 0);

    if (
      selectedCharacterIds.length === 0 ||
      (!hasMoney && normalizedItems.length === 0)
    ) {
      return;
    }

    try {
      setSubmitting(true);

      await onConfirm({
        characterIds: selectedCharacterIds,
        money: normalizedMoney,
        items: normalizedItems,
      });

      setSearch("");
      setSelectedCharacterIds([]);
      setMoney({
        cp: "0",
        sp: "0",
        ep: "0",
        gp: "0",
        pp: "0",
      });
      setSelectedItems([]);
    } finally {
      setSubmitting(false);
    }
  };

  const normalizedMoney = normalizeMoney();
  const hasMoney = Object.values(normalizedMoney).some((amount) => amount > 0);

  const canSubmit =
    selectedCharacterIds.length > 0 &&
    (hasMoney || selectedItems.length > 0) &&
    !submitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 text-zinc-100 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">Reward items</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Search for base items or campaign items, choose quantities, and
              reward currency and items to players in this campaign.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex min-h-0 flex-col border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
            <div className="border-b border-white/10 px-6 py-4">
              <label className="block text-sm font-semibold text-white">
                Search items
              </label>

              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3">
                <span className="text-sm text-zinc-500">⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, id, category, or base item..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="grid gap-3">
                {filteredItems.map((item) => {
                  const alreadySelected = selectedItems.find((entry) =>
                    item.source === "base"
                      ? entry.source === "base" && entry.itemId === item.id
                      : entry.source === "campaign" &&
                        entry.campaignItemId === item.campaignItemId,
                  );

                  return (
                    <div
                      key={`${item.source}-${item.id}`}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {item.name}
                        </p>

                        {item.shortDescription && (
                          <p className="mt-1 text-sm text-zinc-400">
                            {item.shortDescription}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            {formatLabel(item.category)}
                          </span>

                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            {item.id}
                          </span>

                          {item.source === "campaign" && (
                            <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-violet-300">
                              Campaign Item
                            </span>
                          )}

                          {item.source === "campaign" && (
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                              Base: {item.baseItemId}
                            </span>
                          )}

                          {item.stackable ? (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                              Stackable
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          item.source === "base"
                            ? addBaseItem(item.id)
                            : addCampaignItem(item.campaignItemId, item.baseItemId)
                        }
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        <span className="text-sm leading-none">+</span>
                        {alreadySelected ? "Add more" : "Add"}
                      </button>
                    </div>
                  );
                })}

                {filteredItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-zinc-400">
                    No items matched your search.
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <section>
                <h3 className="text-sm font-semibold text-white">Players</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {characters.map((character) => {
                    const selected = selectedCharacterIds.includes(
                      character.id,
                    );

                    return (
                      <button
                        key={character.id}
                        type="button"
                        onClick={() => toggleCharacter(character.id)}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          selected
                            ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                            : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
                        }`}
                      >
                        {character.name}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="mt-6">
                <h3 className="text-sm font-semibold text-white">
                  Currency to add to each selected character
                </h3>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      CP
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={money.cp}
                      onChange={(event) => updateMoney("cp", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      SP
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={money.sp}
                      onChange={(event) => updateMoney("sp", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      EP
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={money.ep}
                      onChange={(event) => updateMoney("ep", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      GP
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={money.gp}
                      onChange={(event) => updateMoney("gp", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40"
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      PP
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={money.pp}
                      onChange={(event) => updateMoney("pp", event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40"
                    />
                  </label>
                </div>
              </section>

              <section className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">
                    Selected items
                  </h3>
                  <span className="text-xs text-zinc-500">
                    {selectedItems.length} selected
                  </span>
                </div>

                <div className="mt-3 space-y-3">
                  {selectedItems.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
                      No items selected yet.
                    </div>
                  ) : null}

                  {selectedItems.map((entry) => {
                    const baseItem =
                      entry.source === "base"
                        ? itemsById[entry.itemId]
                        : itemsById[entry.baseItemId];

                    const campaignItem =
                      entry.source === "campaign"
                        ? campaignItemsById[entry.campaignItemId]
                        : null;

                    const itemName =
                      entry.source === "base"
                        ? (baseItem?.name ?? entry.itemId)
                        : ((campaignItem?.name ?? baseItem?.name) ?? entry.campaignItemId);

                    const category =
                      entry.source === "base"
                        ? (baseItem?.category ?? "unknown")
                        : (baseItem?.category ?? "unknown");

                    const rowKey =
                      entry.source === "base"
                        ? `base-${entry.itemId}`
                        : `campaign-${entry.campaignItemId}`;

                    return (
                      <div
                        key={rowKey}
                        className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[1fr_110px_auto]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {itemName}
                          </p>

                          <p className="mt-1 text-xs text-zinc-400">
                            {formatLabel(category)} ·{" "}
                            {entry.source === "base"
                              ? entry.itemId
                              : entry.campaignItemId}
                          </p>

                          {entry.source === "campaign" && (
                            <p className="mt-1 text-xs text-violet-300">
                              Campaign item · Base: {entry.baseItemId}
                            </p>
                          )}
                        </div>

                        <input
                          type="number"
                          min={1}
                          value={entry.quantity}
                          onChange={(event) =>
                            updateItemQuantity(
                              entry.source === "base"
                                ? {
                                    source: "base",
                                    itemId: entry.itemId,
                                  }
                                : {
                                    source: "campaign",
                                    campaignItemId: entry.campaignItemId,
                                  },
                              Number(event.target.value),
                            )
                          }
                          className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-white outline-none transition focus:border-emerald-400/40"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              entry.source === "base"
                                ? {
                                    source: "base",
                                    itemId: entry.itemId,
                                  }
                                : {
                                    source: "campaign",
                                    campaignItemId: entry.campaignItemId,
                                  },
                            )
                          }
                          className="inline-flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-3 text-sm text-red-200 transition hover:bg-red-500/20"
                        >
                          <span className="text-sm leading-none">✕</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="border-t border-white/10 px-6 py-4">
              <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
                <p>
                  <span className="font-semibold text-white">Players:</span>{" "}
                  {selectedCharacterIds.length}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-white">Money each:</span>{" "}
                  {normalizedMoney.cp} CP, {normalizedMoney.sp} SP,{" "}
                  {normalizedMoney.ep} EP, {normalizedMoney.gp} GP,{" "}
                  {normalizedMoney.pp} PP
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-white">Item types:</span>{" "}
                  {selectedItems.length}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Giving rewards..." : "Give rewards"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardItemsModal;