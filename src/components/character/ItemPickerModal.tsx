import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { allItems } from "../../rulesets/dnd/dnd2024/data/items";

type ItemPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (itemId: string, quantity: number) => void;
};

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const ItemPickerModal = ({
  isOpen,
  onClose,
  onSelect,
}: ItemPickerModalProps) => {
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSearch("");

    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const sorted = [...allItems].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      }),
    );

    if (!query) {
      return sorted.slice(0, 75);
    }

    return sorted
      .filter((item) =>
        [item.name, item.id, item.category, item.description ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 75);
  }, [search]);

  if (!isOpen) {
    return null;
  }

  const getQuantity = (itemId: string) => quantities[itemId] ?? 1;

  const setQuantity = (itemId: string, value: number) => {
    const normalized = Math.max(1, Math.floor(value) || 1);

    setQuantities((current) => ({
      ...current,
      [itemId]: normalized,
    }));
  };

  const addItem = (itemId: string) => {
    const quantity = getQuantity(itemId);

    onSelect(itemId, quantity);

    setQuantities((current) => {
      if (!(itemId in current)) {
        return current;
      }

      const next = { ...current };
      delete next[itemId];

      return next;
    });

    /*
     * Keep the picker open for rapid equipment entry.
     * Clear the old query and return keyboard focus to search.
     */
    setSearch("");

    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || filteredItems.length !== 1) {
      return;
    }

    event.preventDefault();

    addItem(filteredItems[0].id);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Add Equipment</h2>

            <p className="mt-1 text-sm text-zinc-400">
              Add as many items as you need. The window stays open after each
              addition.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close item picker"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="border-b border-white/10 p-4 sm:px-6">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-600" />

            <input
              ref={searchInputRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search equipment..."
              className="w-full rounded-xl border border-white/10 bg-zinc-900 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/25"
            />
          </div>

          <p className="mt-2 text-xs text-zinc-500">
            Search is cleared and focused automatically after adding an item.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:px-6">
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-sm text-zinc-400">No matching items.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => {
                const quantity = getQuantity(item.id);

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-zinc-900/70 p-3 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-white">{item.name}</p>

                        {item.stackable ? (
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                            Stackable
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1 text-xs text-zinc-500">
                        {formatLabel(item.category)}
                      </p>

                      {item.description ? (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-400">
                          {item.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <div className="flex items-center overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, quantity - 1)}
                          disabled={quantity <= 1}
                          className="h-10 w-9 text-zinc-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          −
                        </button>

                        <input
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={(event) =>
                            setQuantity(item.id, Number(event.target.value))
                          }
                          className="h-10 w-16 border-x border-white/10 bg-transparent px-1 text-center text-sm font-semibold text-white outline-none"
                          aria-label={`${item.name} quantity`}
                        />

                        <button
                          type="button"
                          onClick={() => setQuantity(item.id, quantity + 1)}
                          className="h-10 w-9 text-zinc-400 transition hover:bg-white/5 hover:text-white"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => addItem(item.id)}
                        className="h-10 rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                      >
                        Add {quantity > 1 ? `×${quantity}` : ""}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-white/10 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemPickerModal;
