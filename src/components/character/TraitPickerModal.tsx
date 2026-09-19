import { useMemo, useState } from "react";

import {
  filterTraitCatalog,
  getTraitCatalogLevels,
  getTraitCatalogSources,
  traitSourceLabels,
} from "../../rulesets/dnd/dnd2024/data/traits/traitCatalogHelpers";
import type {
  TraitCatalogEntry,
  TraitCatalogSourceType,
} from "../../rulesets/dnd/dnd2024/data/traits/traitCatalogTypes";

type TraitPickerModalProps = {
  open: boolean;
  selectedCatalogIds: readonly string[];
  onAdd: (catalogId: string) => void;
  onRemove?: (catalogId: string) => void;
  onClose: () => void;
};

const sourceTypes: Array<TraitCatalogSourceType | "all"> = [
  "all",
  "class",
  "subclass",
  "species",
  "background",
  "feat",
];

const TraitPickerModal = ({
  open,
  selectedCatalogIds,
  onAdd,
  onRemove,
  onClose,
}: TraitPickerModalProps) => {
  const [query, setQuery] = useState("");
  const [sourceType, setSourceType] = useState<TraitCatalogSourceType | "all">(
    "all",
  );
  const [sourceId, setSourceId] = useState("all");
  const [level, setLevel] = useState<number | "all">("all");

  const selected = useMemo(
    () => new Set(selectedCatalogIds),
    [selectedCatalogIds],
  );

  const sources = useMemo(
    () => getTraitCatalogSources(sourceType),
    [sourceType],
  );

  const levels = useMemo(() => getTraitCatalogLevels(), []);

  const filteredEntries = useMemo(
    () =>
      filterTraitCatalog({
        query,
        sourceType,
        sourceId,
        level,
      }).sort((a, b) => {
        const sourceCompare = a.sourceName.localeCompare(b.sourceName);
        if (sourceCompare !== 0) return sourceCompare;
        if ((a.level ?? 0) !== (b.level ?? 0)) {
          return (a.level ?? 0) - (b.level ?? 0);
        }
        return a.trait.name.localeCompare(b.trait.name);
      }),
    [level, query, sourceId, sourceType],
  );

  if (!open) return null;

  const clearFilters = () => {
    setQuery("");
    setSourceType("all");
    setSourceId("all");
    setLevel("all");
  };

  const hasFilters =
    query.trim().length > 0 ||
    sourceType !== "all" ||
    sourceId !== "all" ||
    level !== "all";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[min(820px,calc(100vh-32px))] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Add Feature or Trait
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Search the rules library and add existing features without copying
              them.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Close trait library"
          >
            ×
          </button>
        </div>

        <div className="border-b border-white/[0.07] p-3">
          <div className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_150px_180px_110px_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search traits, descriptions, effects..."
              className="h-9 rounded-lg border border-white/10 bg-black/20 px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/20"
            />

            <select
              value={sourceType}
              onChange={(event) => {
                setSourceType(
                  event.target.value as TraitCatalogSourceType | "all",
                );
                setSourceId("all");
              }}
              className="h-9 rounded-lg border border-white/10 bg-zinc-900 px-2.5 text-xs text-zinc-200 outline-none"
            >
              {sourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All sources" : traitSourceLabels[type]}
                </option>
              ))}
            </select>

            <select
              value={sourceId}
              onChange={(event) => setSourceId(event.target.value)}
              className="h-9 rounded-lg border border-white/10 bg-zinc-900 px-2.5 text-xs text-zinc-200 outline-none"
            >
              <option value="all">
                All {sourceType === "all" ? "entries" : "sources"}
              </option>
              {sources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>

            <select
              value={level}
              onChange={(event) =>
                setLevel(
                  event.target.value === "all"
                    ? "all"
                    : Number(event.target.value),
                )
              }
              className="h-9 rounded-lg border border-white/10 bg-zinc-900 px-2.5 text-xs text-zinc-200 outline-none"
            >
              <option value="all">All levels</option>
              {levels.map((value) => (
                <option key={value} value={value}>
                  Level {value}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="h-9 rounded-lg border border-white/10 px-3 text-xs font-medium text-zinc-400 transition enabled:hover:bg-white/[0.05] enabled:hover:text-white disabled:opacity-30"
            >
              Clear
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-600">
            <span>{filteredEntries.length} traits</span>
            <span>{selected.size} added</span>
          </div>
        </div>

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
          {filteredEntries.length > 0 ? (
            <div className="divide-y divide-white/[0.05]">
              {filteredEntries.map((entry) => (
                <TraitLibraryRow
                  key={entry.catalogId}
                  entry={entry}
                  selected={selected.has(entry.catalogId)}
                  onAdd={onAdd}
                  onRemove={onRemove}
                />
              ))}
            </div>
          ) : (
            <div className="grid min-h-52 place-items-center p-8 text-center">
              <div>
                <p className="text-sm font-medium text-zinc-300">
                  No traits found
                </p>
                <p className="mt-1 text-xs text-zinc-600">
                  Try another search or clear some filters.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TraitLibraryRow = ({
  entry,
  selected,
  onAdd,
  onRemove,
}: {
  entry: TraitCatalogEntry;
  selected: boolean;
  onAdd: (catalogId: string) => void;
  onRemove?: (catalogId: string) => void;
}) => {
  const level = entry.level;

  return (
    <div className="flex gap-4 px-4 py-3 transition hover:bg-white/[0.025]">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-100">
            {entry.trait.name}
          </h3>
          <SourceBadge type={entry.sourceType} />
          {typeof level === "number" ? (
            <span className="text-[10px] font-medium text-zinc-600">
              L{level}
            </span>
          ) : null}
        </div>

        <div className="mt-1 flex flex-wrap gap-x-2 text-[11px] text-zinc-500">
          <span>{entry.sourceName}</span>
          {entry.className && entry.sourceType === "subclass" ? (
            <span>• {entry.className}</span>
          ) : null}
        </div>

        {entry.trait.description ? (
          <p className="mt-2 line-clamp-3 whitespace-pre-line text-xs leading-5 text-zinc-400">
            {entry.trait.description}
          </p>
        ) : null}
      </div>

      <div className="shrink-0 self-center">
        {selected ? (
          <button
            type="button"
            onClick={() => onRemove?.(entry.catalogId)}
            disabled={!onRemove}
            className="h-8 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-300 disabled:cursor-default"
          >
            Added
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAdd(entry.catalogId)}
            className="h-8 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};

const SourceBadge = ({ type }: { type: TraitCatalogSourceType }) => {
  const meta: Record<
    TraitCatalogSourceType,
    { label: string; className: string }
  > = {
    species: {
      label: "SP",
      className: "border-sky-500/20 bg-sky-500/10 text-sky-300",
    },
    class: {
      label: "CL",
      className: "border-violet-500/20 bg-violet-500/10 text-violet-300",
    },
    subclass: {
      label: "SC",
      className: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300",
    },
    background: {
      label: "BG",
      className: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    },
    feat: {
      label: "FT",
      className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    },
  };

  return (
    <span
      className={`rounded border px-1.5 py-0.5 text-[9px] font-bold ${meta[type].className}`}
    >
      {meta[type].label}
    </span>
  );
};

export default TraitPickerModal;
