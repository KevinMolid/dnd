import { useEffect, useMemo, useState } from "react";
import { allItems } from "../../../rulesets/dnd/dnd2024/data/items";
import type { CampaignItemOverride, Item } from "../../../rulesets/dnd/dnd2024/types";
import ItemTooltip from "../../../components/ItemTooltip";

type CreateCampaignItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    baseItemId: string;
    name?: string;
    shortDescription?: string;
    description?: string;
    gmNotes?: string;
    imageUrl?: string;
    overrides?: CampaignItemOverride;
  }) => Promise<void> | void;
};

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const CreateCampaignItemModal = ({
  isOpen,
  onClose,
  onConfirm,
}: CreateCampaignItemModalProps) => {
  const [search, setSearch] = useState("");
  const [selectedBaseItemId, setSelectedBaseItemId] = useState<string>("");
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [gmNotes, setGmNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setSearch("");
    setSelectedBaseItemId("");
    setName("");
    setShortDescription("");
    setDescription("");
    setGmNotes("");
    setImageUrl("");
    setSubmitting(false);
  }, [isOpen]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const sorted = [...allItems].sort((a, b) => a.name.localeCompare(b.name));

    if (!query) {
      return sorted.slice(0, 75);
    }

    return sorted
      .filter((item) => {
        const idMatch = item.id.toLowerCase().includes(query);
        const nameMatch = item.name.toLowerCase().includes(query);
        const categoryMatch = item.category.toLowerCase().includes(query);

        return idMatch || nameMatch || categoryMatch;
      })
      .slice(0, 75);
  }, [search]);

  const selectedBaseItem = useMemo<Item | null>(() => {
    if (!selectedBaseItemId) return null;
    return allItems.find((item) => item.id === selectedBaseItemId) ?? null;
  }, [selectedBaseItemId]);

  const hasCustomContent =
    name.trim() ||
    shortDescription.trim() ||
    description.trim() ||
    gmNotes.trim() ||
    imageUrl.trim();

  const canSubmit = !!selectedBaseItemId && !submitting;

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedBaseItemId) return;

    const trimmedName = name.trim();
    const trimmedShortDescription = shortDescription.trim();
    const trimmedDescription = description.trim();
    const trimmedGmNotes = gmNotes.trim();
    const trimmedImageUrl = imageUrl.trim();

    const overrides: CampaignItemOverride = {};

    if (trimmedName) {
      overrides.name = trimmedName;
    }

    if (trimmedDescription) {
      overrides.description = trimmedDescription;
    }

    try {
      setSubmitting(true);

      await onConfirm({
        baseItemId: selectedBaseItemId,
        ...(trimmedName ? { name: trimmedName } : {}),
        ...(trimmedShortDescription
          ? { shortDescription: trimmedShortDescription }
          : {}),
        ...(trimmedDescription ? { description: trimmedDescription } : {}),
        ...(trimmedGmNotes ? { gmNotes: trimmedGmNotes } : {}),
        ...(trimmedImageUrl ? { imageUrl: trimmedImageUrl } : {}),
        ...(Object.keys(overrides).length > 0 ? { overrides } : {}),
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 text-zinc-100 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Create custom item
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Choose a base item, then customize its name, flavor text, and notes
              for this campaign.
            </p>
          </div>

          <button
            type="button"
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
                Choose base item
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
                  const selected = item.id === selectedBaseItemId;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedBaseItemId(item.id)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-emerald-400/40 bg-emerald-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {item.name}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                              {formatLabel(item.category)}
                            </span>

                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                              {item.id}
                            </span>

                            {item.magical ? (
                              <span className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2 py-1 text-fuchsia-300">
                                Magical
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {selected && (
                          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-emerald-300">
                            Selected
                          </span>
                        )}
                      </div>
                    </button>
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
                <h3 className="text-sm font-semibold text-white">Base item</h3>

                <div className="mt-3">
                  {selectedBaseItem ? (
                    <ItemTooltip item={selectedBaseItem}>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm font-semibold text-white">
                          {selectedBaseItem.name}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                          {formatLabel(selectedBaseItem.category)} ·{" "}
                          {selectedBaseItem.id}
                        </p>

                        {selectedBaseItem.description && (
                          <p className="mt-3 line-clamp-3 text-sm text-zinc-300">
                            {selectedBaseItem.description}
                          </p>
                        )}

                        <p className="mt-3 text-xs text-zinc-500">
                          Hover or tap to inspect full item details.
                        </p>
                      </div>
                    </ItemTooltip>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
                      Select a base item from the left side first.
                    </div>
                  )}
                </div>
              </section>

              <section className="mt-6">
                <h3 className="text-sm font-semibold text-white">
                  Customization
                </h3>

                <div className="mt-3 grid gap-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Custom name
                    </span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={
                        selectedBaseItem
                          ? `${selectedBaseItem.name}`
                          : "Enter custom name..."
                      }
                      className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Short description
                    </span>
                    <input
                      value={shortDescription}
                      onChange={(event) => setShortDescription(event.target.value)}
                      placeholder="A short flavor line shown in inventory/tooltips..."
                      className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Full description
                    </span>
                    <textarea
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      rows={5}
                      placeholder="Describe the custom lore, appearance, history, or special feel of the item..."
                      className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      GM notes
                    </span>
                    <textarea
                      value={gmNotes}
                      onChange={(event) => setGmNotes(event.target.value)}
                      rows={4}
                      placeholder="Private notes for the GM, such as where the item is found or hidden details..."
                      className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Image URL
                    </span>
                    <input
                      value={imageUrl}
                      onChange={(event) => setImageUrl(event.target.value)}
                      placeholder="Optional image URL..."
                      className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40"
                    />
                  </label>
                </div>
              </section>

              <section className="mt-6">
                <h3 className="text-sm font-semibold text-white">Preview</h3>

                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-white">
                      {name.trim() || selectedBaseItem?.name || "Custom item"}
                    </p>

                    <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-violet-300">
                      Campaign Item
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-zinc-400">
                    Based on: {selectedBaseItem?.name ?? "No base item selected"}
                  </p>

                  {shortDescription.trim() && (
                    <p className="mt-3 text-sm text-zinc-300">
                      {shortDescription.trim()}
                    </p>
                  )}

                  {description.trim() && (
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      {description.trim()}
                    </p>
                  )}

                  {!hasCustomContent && (
                    <p className="mt-3 text-sm text-zinc-500">
                      No custom text added yet. This will behave like the base
                      item until you customize it.
                    </p>
                  )}
                </div>
              </section>
            </div>

            <div className="border-t border-white/10 px-6 py-4">
              <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
                <p>
                  <span className="font-semibold text-white">Base item:</span>{" "}
                  {selectedBaseItem?.name ?? "None selected"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-white">Custom name:</span>{" "}
                  {name.trim() || "Uses base item name"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-white">
                    Flavor fields added:
                  </span>{" "}
                  {[
                    shortDescription.trim() ? "short description" : null,
                    description.trim() ? "description" : null,
                    gmNotes.trim() ? "GM notes" : null,
                    imageUrl.trim() ? "image URL" : null,
                  ]
                    .filter(Boolean)
                    .join(", ") || "none"}
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Creating item..." : "Create item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignItemModal;