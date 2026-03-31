import { useMemo, useState } from "react";
import { itemsById, items } from "../../../rulesets/dnd/dnd2024/data/items";

type CharacterOption = {
  id: string;
  name: string;
  ownerUid?: string | null;
};

type SelectedRewardItem = {
  itemId: string;
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
  onConfirm: (payload: {
  characterIds: string[];
  money: {
    cp: number;
    sp: number;
    ep: number;
    gp: number;
    pp: number;
  };
  items: { itemId: string; quantity: number }[];
}) => Promise<void>;
};

const RewardItemsModal = ({
  isOpen,
  onClose,
  characters,
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

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

    if (!query) {
      return sorted.slice(0, 50);
    }

    return sorted
      .filter((item) => {
        const idMatch = item.id.toLowerCase().includes(query);
        const nameMatch = item.name.toLowerCase().includes(query);
        const categoryMatch = item.category.toLowerCase().includes(query);

        return idMatch || nameMatch || categoryMatch;
      })
      .slice(0, 50);
  }, [search]);

  if (!isOpen) return null;

  const toggleCharacter = (id: string) => {
    setSelectedCharacterIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  };

  const addItem = (itemId: string) => {
    setSelectedItems((current) => {
      const existing = current.find((item) => item.itemId === itemId);

      if (existing) {
        return current.map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { itemId, quantity: 1 }];
    });
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    const nextQuantity = Math.max(1, Math.floor(quantity) || 1);

    setSelectedItems((current) =>
      current.map((item) =>
        item.itemId === itemId ? { ...item, quantity: nextQuantity } : item,
      ),
    );
  };

  const removeItem = (itemId: string) => {
    setSelectedItems((current) =>
      current.filter((item) => item.itemId !== itemId),
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
      .map((item) => ({
        itemId: item.itemId,
        quantity: Math.max(1, Math.floor(item.quantity) || 1),
      }))
      .filter((item) => !!item.itemId);

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
              Search for items, choose quantities, and reward currency and items
              to players in this campaign.
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
                  placeholder="Search by name, id, or category..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="grid gap-3">
                {filteredItems.map((item) => {
                  const alreadySelected = selectedItems.find(
                    (entry) => entry.itemId === item.id,
                  );

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {item.name}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            {item.category}
                          </span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            {item.id}
                          </span>
                          {item.stackable ? (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-emerald-300">
                              Stackable
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => addItem(item.id)}
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
                    const item = itemsById[entry.itemId];

                    return (
                      <div
                        key={entry.itemId}
                        className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-[1fr_110px_auto]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {item?.name ?? entry.itemId}
                          </p>
                          <p className="mt-1 text-xs text-zinc-400">
                            {item?.category ?? "unknown"} · {entry.itemId}
                          </p>
                        </div>

                        <input
                          type="number"
                          min={1}
                          value={entry.quantity}
                          onChange={(event) =>
                            updateItemQuantity(
                              entry.itemId,
                              Number(event.target.value),
                            )
                          }
                          className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-white outline-none transition focus:border-emerald-400/40"
                        />

                        <button
                          type="button"
                          onClick={() => removeItem(entry.itemId)}
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