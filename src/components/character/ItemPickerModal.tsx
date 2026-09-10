import { useMemo, useState } from "react";

import { allItems } from "../../rulesets/dnd/dnd2024/data/items";

type ItemPickerModalProps = {
  isOpen: boolean;

  onClose: () => void;

  onSelect: (itemId: string) => void;
};

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function ItemPickerModal({
  isOpen,
  onClose,
  onSelect,
}: ItemPickerModalProps) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const items = [...allItems];

    if (!query) {
      return items.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 100);
    }

    return items
      .filter((item) =>
        [item.name, item.id, item.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 100);
  }, [search]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h2 className="text-xl font-semibold text-white">Add Item</h2>

            <p className="mt-1 text-sm text-zinc-400">
              Search the D&amp;D item catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="border-b border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3">
            <i className="fa-solid fa-magnifying-glass text-zinc-500" />

            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search longsword, armor, adventuring gear..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.id);

                  onClose();
                }}
                className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.name}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-zinc-950 px-2 py-1 text-xs text-zinc-400">
                      {formatLabel(item.category)}
                    </span>

                    <span className="rounded-full border border-white/10 bg-zinc-950 px-2 py-1 text-xs text-zinc-500">
                      {item.id}
                    </span>

                    {item.magical ? (
                      <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-1 text-xs text-violet-300">
                        Magical
                      </span>
                    ) : null}
                  </div>
                </div>

                <span className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-950">
                  Add
                </span>
              </button>
            ))}

            {filteredItems.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">
                No items found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
