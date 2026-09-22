import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import CreateCampaignItemModal from "../features/campaigns/components/CreateCampaignItemModal";
import { allItems } from "../rulesets/dnd/dnd2024/data/items";
import type {
  CampaignItem,
  CampaignItemOverride,
  Item,
} from "../rulesets/dnd/dnd2024/types";

type ItemSource = "default" | "campaign";

type ItemListEntry = {
  key: string;
  source: ItemSource;
  item: Item;
  campaignItem?: CampaignItem;
};

const readString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const capitalize = (value: string) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;

const humanize = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatCompactValue = (value: unknown) => {
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return humanize(value);
  return "";
};

type CompactItemStat = {
  label: string;
  value: string;
};

const buildCompactItemMeta = (item: Item) => {
  const record = item as unknown as Record<string, unknown>;
  const stats: CompactItemStat[] = [];
  const badges: string[] = [];

  const addStat = (label: string, value: string) => {
    if (!value) return;
    if (stats.some((stat) => stat.label === label && stat.value === value))
      return;
    stats.push({ label, value });
  };

  const addBadge = (value: string) => {
    if (!value || badges.includes(value)) return;
    badges.push(value);
  };

  if (typeof record.weight === "number") {
    addStat("Weight", `${record.weight} lb.`);
  }

  if (record.cost && typeof record.cost === "object") {
    const value = Object.entries(record.cost as Record<string, unknown>)
      .filter(([, amount]) => typeof amount === "number" && amount > 0)
      .map(([currency, amount]) => `${amount} ${currency.toUpperCase()}`)
      .join(", ");

    addStat("Value", value);
  }

  if (record.magical === true) addBadge("Magical");
  if (record.stackable === true) addBadge("Stackable");

  const walk = (value: unknown, path: string[] = []) => {
    if (
      value === undefined ||
      value === null ||
      value === false ||
      value === ""
    ) {
      return;
    }

    const root = path[0] ?? "";

    if (
      [
        "id",
        "name",
        "category",
        "description",
        "shortDescription",
        "imageUrl",
        "weight",
        "cost",
        "magical",
        "stackable",
      ].includes(root)
    ) {
      return;
    }

    if (Array.isArray(value)) {
      if (value.every((entry) => typeof entry === "string")) {
        value.forEach((entry) => addBadge(humanize(entry)));
        return;
      }

      value.forEach((entry) => walk(entry, path));
      return;
    }

    if (typeof value === "object") {
      const object = value as Record<string, unknown>;

      if (
        path[path.length - 1] === "dice" &&
        typeof object.count === "number" &&
        (typeof object.die === "number" || typeof object.die === "string")
      ) {
        addStat(
          humanize(path.slice(0, -1).join(" ")),
          `${object.count}d${object.die}`,
        );
        return;
      }

      Object.entries(object).forEach(([key, child]) =>
        walk(child, [...path, key]),
      );
      return;
    }

    if (typeof value === "boolean") {
      if (value) addBadge(humanize(path[path.length - 1] ?? ""));
      return;
    }

    const rawLabel = path.join(" ");
    let label = humanize(rawLabel);
    let displayValue = formatCompactValue(value);

    if (!displayValue) return;

    if (path[path.length - 1] === "damageType") {
      addBadge(displayValue);
      return;
    }

    if (path[path.length - 1] === "weaponKind") {
      addBadge(displayValue);
      return;
    }

    if (path[path.length - 1] === "mastery") {
      addBadge(displayValue);
      return;
    }

    if (
      path[path.length - 1] === "slots" ||
      path[path.length - 1] === "allowedWieldModes"
    ) {
      addBadge(displayValue);
      return;
    }

    if (root === "attackBonus") label = "Attack";
    if (root === "damageBonus") label = "Damage";
    if (root === "acBonus") label = "AC";

    if (
      ["attackBonus", "damageBonus", "acBonus"].includes(root) &&
      typeof value === "number"
    ) {
      displayValue = `${value >= 0 ? "+" : ""}${value}`;
    }

    addStat(label, displayValue);
  };

  Object.entries(record).forEach(([key, value]) => walk(value, [key]));

  return { stats, badges };
};

const getCategory = (item: Item) => {
  const record = item as unknown as Record<string, unknown>;

  return (
    readString(record.category) ||
    readString(record.type) ||
    readString(record.itemType) ||
    "Other"
  ).replace(/^./, (letter) => letter.toUpperCase());
};

const isMagicalItem = (item: Item) => {
  const record = item as unknown as Record<string, unknown>;

  if (typeof record.magical === "boolean") return record.magical;
  if (typeof record.isMagical === "boolean") return record.isMagical;

  const rarity = readString(record.rarity).toLowerCase();
  return Boolean(rarity && rarity !== "none" && rarity !== "mundane");
};

const getRarity = (item: Item) => {
  const record = item as unknown as Record<string, unknown>;
  return readString(record.rarity);
};

const getShortDescription = (item: Item) => {
  const record = item as unknown as Record<string, unknown>;

  return readString(record.shortDescription) || readString(record.description);
};

const resolveCampaignItem = (
  campaignItem: CampaignItem,
  baseItem: Item,
): Item => {
  const campaignRecord = campaignItem as unknown as Record<string, unknown>;
  const overrides =
    campaignItem.overrides && typeof campaignItem.overrides === "object"
      ? campaignItem.overrides
      : {};

  return {
    ...baseItem,
    ...overrides,
    id: campaignItem.id,
    name:
      readString(campaignRecord.name) ||
      readString((overrides as Record<string, unknown>).name) ||
      baseItem.name,
    description:
      readString(campaignRecord.description) ||
      readString((overrides as Record<string, unknown>).description) ||
      baseItem.description,
    ...(readString(campaignRecord.shortDescription)
      ? { shortDescription: readString(campaignRecord.shortDescription) }
      : {}),
  } as Item;
};

const ItemsPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();

  const [campaignItems, setCampaignItems] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | ItemSource>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [magicFilter, setMagicFilter] = useState<"all" | "magical" | "mundane">(
    "all",
  );
  const [sort, setSort] = useState<"name" | "category">("name");

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ItemListEntry | null>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    if (!campaignId) {
      setCampaignItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");

    const itemsRef = collection(db, "campaigns", campaignId, "items");

    const unsubscribe = onSnapshot(
      query(itemsRef, orderBy("createdAt", "desc")),
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<CampaignItem, "id">),
        }));

        setCampaignItems(next);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load campaign items:", error);
        setCampaignItems([]);
        setLoadError("Failed to load campaign items.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [campaignId]);

  const baseItemsById = useMemo(
    () => new Map(allItems.map((item) => [item.id, item])),
    [],
  );

  const entries = useMemo<ItemListEntry[]>(() => {
    const defaultEntries: ItemListEntry[] = allItems.map((item) => ({
      key: `default:${item.id}`,
      source: "default",
      item,
    }));

    const campaignEntries = campaignItems.flatMap<ItemListEntry>(
      (campaignItem) => {
        if (campaignItem.customItem) {
          return [
            {
              key: `campaign:${campaignItem.id}`,
              source: "campaign" as const,
              item: {
                ...campaignItem.customItem,
                id: campaignItem.id,
                ...(campaignItem.name ? { name: campaignItem.name } : {}),
                ...(campaignItem.description
                  ? { description: campaignItem.description }
                  : {}),
              },
              campaignItem,
            },
          ];
        }

        if (!campaignItem.baseItemId) return [];

        const baseItem = baseItemsById.get(campaignItem.baseItemId);
        if (!baseItem) return [];

        return [
          {
            key: `campaign:${campaignItem.id}`,
            source: "campaign" as const,
            item: resolveCampaignItem(campaignItem, baseItem),
            campaignItem,
          },
        ];
      },
    );

    return [...defaultEntries, ...campaignEntries];
  }, [baseItemsById, campaignItems]);

  const categories = useMemo(
    () =>
      Array.from(new Set(entries.map((entry) => getCategory(entry.item))))
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    [entries],
  );

  const filteredEntries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return entries
      .filter((entry) => {
        if (sourceFilter !== "all" && entry.source !== sourceFilter) {
          return false;
        }

        if (
          categoryFilter !== "all" &&
          getCategory(entry.item) !== categoryFilter
        ) {
          return false;
        }

        if (magicFilter === "magical" && !isMagicalItem(entry.item)) {
          return false;
        }

        if (magicFilter === "mundane" && isMagicalItem(entry.item)) {
          return false;
        }

        if (!normalizedSearch) return true;

        const haystack = [
          entry.item.name,
          entry.item.id,
          getCategory(entry.item),
          getRarity(entry.item),
          getShortDescription(entry.item),
          entry.campaignItem?.gmNotes ?? "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedSearch);
      })
      .sort((a, b) => {
        if (sort === "category") {
          const categoryCompare = getCategory(a.item).localeCompare(
            getCategory(b.item),
          );

          if (categoryCompare !== 0) return categoryCompare;
        }

        return a.item.name.localeCompare(b.item.name);
      });
  }, [categoryFilter, entries, magicFilter, search, sort, sourceFilter]);

  useEffect(() => {
    if (
      selectedKey &&
      filteredEntries.some((entry) => entry.key === selectedKey)
    ) {
      return;
    }

    setSelectedKey(filteredEntries[0]?.key ?? null);
  }, [filteredEntries, selectedKey]);

  const selectedEntry =
    filteredEntries.find((entry) => entry.key === selectedKey) ?? null;

  const handleUpdateCampaignItem = async (payload: {
    baseItemId?: string;
    customItem?: Item;
    name?: string;
    shortDescription?: string;
    description?: string;
    gmNotes?: string;
    imageUrl?: string;
    overrides?: CampaignItemOverride;
  }) => {
    if (!campaignId || !editingEntry?.campaignItem) {
      throw new Error("Missing campaign item.");
    }

    if (!payload.baseItemId && !payload.customItem) {
      throw new Error(
        "An item must have either a base item or custom item data.",
      );
    }

    setCreateError("");
    setCreating(true);

    try {
      const campaignItemRef = doc(
        db,
        "campaigns",
        campaignId,
        "items",
        editingEntry.campaignItem.id,
      );

      await updateDoc(campaignItemRef, {
        baseItemId: payload.baseItemId ?? deleteField(),
        customItem: payload.customItem ?? deleteField(),
        name: payload.name ?? deleteField(),
        shortDescription: payload.shortDescription ?? deleteField(),
        description: payload.description ?? deleteField(),
        gmNotes: payload.gmNotes ?? deleteField(),
        imageUrl: payload.imageUrl ?? deleteField(),
        overrides: payload.overrides ?? deleteField(),
        updatedAt: serverTimestamp(),
      });

      setEditingEntry(null);
    } catch (error: any) {
      console.error("Failed to update custom item:", error);
      setCreateError(error?.message || "Failed to update custom item.");
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleCreateCampaignItem = async (payload: {
    baseItemId?: string;
    customItem?: Item;
    name?: string;
    shortDescription?: string;
    description?: string;
    gmNotes?: string;
    imageUrl?: string;
    overrides?: CampaignItemOverride;
  }) => {
    if (!campaignId || !user?.uid) {
      throw new Error("Missing campaign or user.");
    }

    if (!payload.baseItemId && !payload.customItem) {
      throw new Error(
        "An item must have either a base item or custom item data.",
      );
    }

    setCreateError("");
    setCreating(true);

    try {
      await addDoc(collection(db, "campaigns", campaignId, "items"), {
        campaignId,
        ...(payload.baseItemId ? { baseItemId: payload.baseItemId } : {}),
        ...(payload.customItem ? { customItem: payload.customItem } : {}),
        ...(payload.name ? { name: payload.name } : {}),
        ...(payload.shortDescription
          ? { shortDescription: payload.shortDescription }
          : {}),
        ...(payload.description ? { description: payload.description } : {}),
        ...(payload.gmNotes ? { gmNotes: payload.gmNotes } : {}),
        ...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {}),
        ...(payload.overrides ? { overrides: payload.overrides } : {}),
        createdByUid: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setCreateOpen(false);
    } catch (error: any) {
      console.error("Failed to create custom item:", error);
      setCreateError(error?.message || "Failed to create custom item.");
      throw error;
    } finally {
      setCreating(false);
    }
  };

  if (!campaignId) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">
            Missing campaign.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link
                to={`/campaigns/${campaignId}`}
                className="mb-2 inline-flex text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                ← Back to campaign
              </Link>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                Items
              </h1>

              <p className="mt-1 text-sm text-zinc-400">
                Browse the item catalog and create custom items for this
                campaign.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setCreateError("");
                setCreateOpen(true);
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
            >
              Create item
            </button>
          </div>

          {(loadError || createError) && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {loadError || createError}
            </div>
          )}

          <div className="grid min-h-[680px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 lg:grid-cols-[380px_minmax(0,1fr)]">
            <aside className="border-b border-white/10 lg:border-b-0 lg:border-r">
              <div className="border-b border-white/10 p-3">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search items..."
                  className="h-10 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-500/50"
                />

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <select
                    value={sourceFilter}
                    onChange={(event) =>
                      setSourceFilter(event.target.value as "all" | ItemSource)
                    }
                    className="h-9 rounded-lg border border-white/10 bg-zinc-950 px-2 text-xs text-zinc-200 outline-none"
                  >
                    <option value="all">All sources</option>
                    <option value="default">Default</option>
                    <option value="campaign">Campaign</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                    className="h-9 rounded-lg border border-white/10 bg-zinc-950 px-2 text-xs text-zinc-200 outline-none"
                  >
                    <option value="all">All categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={magicFilter}
                    onChange={(event) =>
                      setMagicFilter(
                        event.target.value as "all" | "magical" | "mundane",
                      )
                    }
                    className="h-9 rounded-lg border border-white/10 bg-zinc-950 px-2 text-xs text-zinc-200 outline-none"
                  >
                    <option value="all">All items</option>
                    <option value="magical">Magical</option>
                    <option value="mundane">Non-magical</option>
                  </select>

                  <select
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value as "name" | "category")
                    }
                    className="h-9 rounded-lg border border-white/10 bg-zinc-950 px-2 text-xs text-zinc-200 outline-none"
                  >
                    <option value="name">Sort: Name</option>
                    <option value="category">Sort: Category</option>
                  </select>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>
                    {filteredEntries.length}{" "}
                    {filteredEntries.length === 1 ? "item" : "items"}
                  </span>
                  {campaignItems.length > 0 && (
                    <span>{campaignItems.length} campaign</span>
                  )}
                </div>
              </div>

              <div className="workspace-scrollbar max-h-[540px] overflow-y-auto lg:max-h-[680px]">
                {loading ? (
                  <div className="p-5 text-center text-sm text-zinc-500">
                    Loading items...
                  </div>
                ) : filteredEntries.length === 0 ? (
                  <div className="p-5 text-center">
                    <p className="text-sm font-medium text-zinc-300">
                      No items found
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Try changing your search or filters.
                    </p>
                  </div>
                ) : (
                  filteredEntries.map((entry) => {
                    const selected = entry.key === selectedKey;
                    const category = getCategory(entry.item);
                    const rarity = getRarity(entry.item);

                    return (
                      <button
                        key={entry.key}
                        type="button"
                        onClick={() => setSelectedKey(entry.key)}
                        className={[
                          "flex w-full items-start gap-3 border-b border-white/5 px-3 py-3 text-left transition",
                          selected
                            ? "bg-emerald-500/10"
                            : "hover:bg-white/[0.04]",
                        ].join(" ")}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={[
                                "truncate text-sm font-semibold",
                                selected ? "text-emerald-200" : "text-zinc-100",
                              ].join(" ")}
                            >
                              {entry.item.name}
                            </span>

                            {entry.source === "campaign" && (
                              <span className="shrink-0 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-300">
                                Campaign
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-zinc-500">
                            <span>{category}</span>

                            {rarity && (
                              <>
                                <span className="text-zinc-700">•</span>
                                <span>{rarity}</span>
                              </>
                            )}

                            {isMagicalItem(entry.item) && (
                              <>
                                <span className="text-zinc-700">•</span>
                                <span>Magical</span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            <main className="min-w-0">
              {selectedEntry ? (
                <ItemDetails
                  entry={selectedEntry}
                  onEdit={
                    selectedEntry.source === "campaign"
                      ? () => {
                          setCreateError("");
                          setEditingEntry(selectedEntry);
                        }
                      : undefined
                  }
                />
              ) : (
                <div className="flex min-h-[500px] items-center justify-center p-8 text-center">
                  <div>
                    <p className="text-sm font-semibold text-zinc-300">
                      Select an item
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Choose an item from the list to inspect it.
                    </p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <CreateCampaignItemModal
        isOpen={createOpen}
        onClose={() => {
          if (!creating) setCreateOpen(false);
        }}
        onConfirm={handleCreateCampaignItem}
      />

      <CreateCampaignItemModal
        isOpen={Boolean(editingEntry)}
        editItem={
          editingEntry?.campaignItem
            ? {
                campaignItem: editingEntry.campaignItem,
                resolvedItem: editingEntry.item,
              }
            : null
        }
        onClose={() => {
          if (!creating) setEditingEntry(null);
        }}
        onConfirm={handleUpdateCampaignItem}
      />
    </>
  );
};

const ItemDetails = ({
  entry,
  onEdit,
}: {
  entry: ItemListEntry;
  onEdit?: () => void;
}) => {
  const itemRecord = entry.item as unknown as Record<string, unknown>;
  const campaignRecord = entry.campaignItem as
    | (CampaignItem & Record<string, unknown>)
    | undefined;

  const category = getCategory(entry.item);
  const rarity = getRarity(entry.item);
  const description = readString(itemRecord.description);
  const shortDescription = readString(itemRecord.shortDescription);
  const imageUrl =
    readString(campaignRecord?.imageUrl) || readString(itemRecord.imageUrl);
  const gmNotes = readString(campaignRecord?.gmNotes);
  const { stats, badges } = buildCompactItemMeta(entry.item);

  return (
    <div className="p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {imageUrl && (
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {entry.item.name}
            </h2>

            {entry.source === "campaign" && (
              <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                Campaign
              </span>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white"
              >
                <i className="fa-solid fa-pen" />
                Edit
              </button>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
            <span>{category}</span>

            {rarity && (
              <>
                <span className="text-zinc-700">•</span>
                <span>{capitalize(rarity)}</span>
              </>
            )}
          </div>

          {(stats.length > 0 || badges.length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {stats.map((stat) => (
                <DetailPill
                  key={`${stat.label}:${stat.value}`}
                  label={stat.label}
                  value={stat.value}
                />
              ))}

              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-300"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {shortDescription && shortDescription !== description && (
        <p className="mt-6 text-sm leading-6 text-zinc-300">
          {shortDescription}
        </p>
      )}

      <div className="mt-6 border-t border-white/10 pt-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
          Description
        </h3>

        {description ? (
          <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
            {description}
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-500">
            No description available.
          </p>
        )}
      </div>

      {entry.source === "campaign" && gmNotes && (
        <div className="mt-6 rounded-2xl border border-amber-500/15 bg-amber-500/[0.06] p-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300/80">
            GM Notes
          </h3>
          <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
            {gmNotes}
          </div>
        </div>
      )}

      {entry.source === "campaign" && entry.campaignItem?.baseItemId && (
        <div className="mt-6 border-t border-white/10 pt-4 text-xs text-zinc-600">
          Based on{" "}
          <span className="font-medium text-zinc-500">
            {entry.campaignItem.baseItemId}
          </span>
        </div>
      )}
    </div>
  );
};

const DetailPill = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
    <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-600">
      {label}
    </span>
    <div className="mt-0.5 text-xs font-semibold text-zinc-300">{value}</div>
  </div>
);

export default ItemsPage;
