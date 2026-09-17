import { useEffect, useMemo, useRef, useState } from "react";

import { getAvailableSpells } from "../../rulesets/dnd/dnd2024/getAvailableSpells";
import type { Spell } from "../../rulesets/dnd/dnd2024/types";
import type { CustomSpellEntry } from "../../types/customCharacter";

import SpellDetails from "../SpellDetails";

type SpellPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedSpellIds?: string[];
  onSelect: (spell: CustomSpellEntry) => void | Promise<void>;
  onRemove?: (spellId: string) => void | Promise<void>;
};

type CatalogSpell = Partial<Spell> & {
  id: string;
  name: string;
  level: number;
  school?: string;
  castingTime?: string;
  range?: string;
  duration?: string;
  description?: string;
  higherLevel?: string;
  benefits?: string;
  components?: string;
  concentration?: boolean;
  ritual?: boolean;
};

const classSpellSources = [
  "bard",
  "cleric",
  "druid",
  "paladin",
  "ranger",
  "sorcerer",
  "warlock",
  "wizard",
];

const buildSpellCatalog = (): CatalogSpell[] => {
  const byId = new Map<string, CatalogSpell>();

  for (const classId of classSpellSources) {
    try {
      const spells = getAvailableSpells(
        {
          ownerUid: "",
          campaignId: null,
          name: "",
          level: 20,
          classId,
          speciesId: "",
          backgroundId: "",
          abilityScores: {
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10,
          },
        } as any,
        {
          maxLevel: 9,
          includeCantrips: true,
        } as any,
      ) as any[];

      for (const spell of spells) {
        if (!spell?.id || !spell?.name) continue;

        /*
         * Keep the full spell object. The old picker threw away description,
         * components, ritual/concentration and other useful rules data.
         */
        byId.set(spell.id, {
          ...spell,
          id: spell.id,
          name: spell.name,
          level: Number(spell.level) || 0,
        });
      }
    } catch {
      // A class without a spell implementation can contribute no spells.
    }
  }

  return Array.from(byId.values()).sort(
    (a, b) => a.level - b.level || a.name.localeCompare(b.name),
  );
};

const spellCatalog = buildSpellCatalog();

export default function SpellPickerModal({
  isOpen,
  onClose,
  selectedSpellIds = [],
  onSelect,
  onRemove,
}: SpellPickerModalProps) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | number>("all");
  const [addedFilter, setAddedFilter] = useState<"all" | "available" | "added">(
    "all",
  );
  const [expandedSpellId, setExpandedSpellId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<CatalogSpell | null>(null);
  const [busySpellId, setBusySpellId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setSearch("");
    setLevelFilter("all");
    setAddedFilter("all");
    setExpandedSpellId(null);
    setConfirmRemove(null);

    requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [isOpen]);

  const selectedIds = useMemo(
    () => new Set(selectedSpellIds),
    [selectedSpellIds],
  );

  const filteredSpells = useMemo(() => {
    const query = search.trim().toLowerCase();

    return spellCatalog
      .filter((spell) => {
        const selected = selectedIds.has(spell.id);

        if (levelFilter !== "all" && spell.level !== levelFilter) return false;
        if (addedFilter === "available" && selected) return false;
        if (addedFilter === "added" && !selected) return false;

        if (!query) return true;

        return [
          spell.name,
          spell.id,
          spell.school,
          spell.castingTime,
          spell.range,
          spell.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .slice(0, 150);
  }, [addedFilter, levelFilter, search, selectedIds]);

  const handleAdd = async (spell: CatalogSpell) => {
    if (selectedIds.has(spell.id) || busySpellId) return;

    setBusySpellId(spell.id);

    try {
      await onSelect({
        spellId: spell.id,
        name: spell.name,
        level: spell.level,
      });
    } finally {
      setBusySpellId(null);
    }
  };

  const handleConfirmedRemove = async () => {
    const spell = confirmRemove;
    if (!spell || !onRemove || busySpellId) return;

    setBusySpellId(spell.id);

    try {
      await onRemove(spell.id);
      setConfirmRemove(null);
    } finally {
      setBusySpellId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-[2px] sm:p-4">
        <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-zinc-950 p-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">
                  Add Spells
                </h2>
              </div>
              <p className="text-xs text-zinc-500">
                Search, inspect, add, or remove spells from this character.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid gap-2 border-b border-white/10 bg-black/20 p-3 md:grid-cols-[minmax(0,1fr)_150px_150px]">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 focus-within:border-white/20">
              <i className="fa-solid fa-magnifying-glass text-zinc-600" />
              <input
                ref={searchInputRef}
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Fireball, Cure Wounds..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </div>

            <select
              value={levelFilter}
              onChange={(event) => {
                const value = event.target.value;
                setLevelFilter(value === "all" ? "all" : Number(value));
              }}
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
            >
              <option value="all">All levels</option>
              <option value="0">Cantrips</option>
              {Array.from({ length: 9 }, (_, index) => index + 1).map(
                (level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ),
              )}
            </select>

            <select
              value={addedFilter}
              onChange={(event) =>
                setAddedFilter(
                  event.target.value as "all" | "available" | "added",
                )
              }
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-white/20"
            >
              <option value="all">All spells</option>
              <option value="available">Not added</option>
              <option value="added">Added</option>
            </select>
          </div>

          <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
            <div className="space-y-2">
              {filteredSpells.map((spell) => {
                const selected = selectedIds.has(spell.id);
                const expanded = expandedSpellId === spell.id;
                const busy = busySpellId === spell.id;

                return (
                  <article
                    key={spell.id}
                    className={`overflow-hidden rounded-lg border transition ${
                      expanded
                        ? "border-white/15 bg-white/[0.04]"
                        : "border-white/[0.08] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-stretch">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSpellId(expanded ? null : spell.id)
                        }
                        aria-expanded={expanded}
                        className="min-w-0 flex-1 p-3 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <i
                            className={`fa-solid fa-chevron-right text-[9px] text-zinc-500 transition-transform ${
                              expanded ? "rotate-90" : ""
                            }`}
                          />
                          <p className="truncate text-sm font-semibold text-zinc-100">
                            {spell.name}
                          </p>

                          {spell.concentration ? (
                            <span className="rounded border border-fuchsia-500/30 bg-fuchsia-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-fuchsia-300">
                              Concentration
                            </span>
                          ) : null}

                          {spell.ritual ? (
                            <span className="rounded border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-sky-300">
                              Ritual
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 pl-[17px] text-[10px] text-zinc-500">
                          <span className="font-medium text-zinc-400">
                            {spell.level === 0
                              ? "Cantrip"
                              : `Level ${spell.level}`}
                          </span>
                          {spell.school ? <span>{spell.school}</span> : null}
                          {spell.castingTime ? (
                            <span>{spell.castingTime}</span>
                          ) : null}
                          {spell.range ? <span>{spell.range}</span> : null}
                        </div>
                      </button>

                      <div className="flex shrink-0 items-center gap-2 border-l border-white/[0.06] px-3">
                        {selected ? (
                          <>
                            <span className="hidden text-[10px] font-semibold text-zinc-500 sm:inline">
                              <i className="fa-solid fa-check mr-1 text-zinc-400" />
                              Added
                            </span>

                            {onRemove ? (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => setConfirmRemove(spell)}
                                className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-400 transition hover:border-red-900/50 hover:bg-red-950/25 hover:text-red-300 disabled:opacity-40"
                              >
                                Remove
                              </button>
                            ) : null}
                          </>
                        ) : (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void handleAdd(spell)}
                            className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:opacity-40"
                          >
                            <i className="fa-solid fa-plus mr-1.5 text-[9px]" />
                            Add
                          </button>
                        )}
                      </div>
                    </div>

                    {expanded ? (
                      <div className="border-t border-white/[0.08] bg-black/20 px-4 py-4">
                        <SpellDetails spell={spell} />
                      </div>
                    ) : null}
                  </article>
                );
              })}

              {filteredSpells.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-zinc-600">
                  No spells found.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {confirmRemove ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl">
            <div className="border-b border-white/10 bg-white/[0.025] px-4 py-3">
              <h3 className="text-sm font-semibold text-white">
                Remove {confirmRemove.name}?
              </h3>
            </div>

            <div className="p-4">
              <p className="text-xs leading-5 text-zinc-400">
                Remove {confirmRemove.name} from this character&apos;s spell
                list?
              </p>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmRemove(null)}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={busySpellId === confirmRemove.id}
                  onClick={() => void handleConfirmedRemove()}
                  className="rounded-lg border border-red-700/60 bg-red-950/60 px-3 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-900/70 disabled:opacity-40"
                >
                  Remove Spell
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
