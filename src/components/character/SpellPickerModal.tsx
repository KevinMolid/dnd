import { useEffect, useMemo, useRef, useState } from "react";

import { getAvailableSpells } from "../../rulesets/dnd/dnd2024/getAvailableSpells";

import type { CustomSpellEntry } from "../../types/customCharacter";

type SpellPickerModalProps = {
  isOpen: boolean;

  onClose: () => void;

  selectedSpellIds?: string[];

  onSelect: (spell: CustomSpellEntry) => void;
};

type CatalogSpell = {
  id: string;

  name: string;

  level: number;

  school?: string;

  castingTime?: string;

  range?: string;

  duration?: string;
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
        if (!spell?.id || !spell?.name) {
          continue;
        }

        byId.set(spell.id, {
          id: spell.id,

          name: spell.name,

          level: Number(spell.level) || 0,

          school: spell.school,

          castingTime: spell.castingTime,

          range: spell.range,

          duration: spell.duration,
        });
      }
    } catch {
      // A class without a spell implementation can simply contribute no spells.
    }
  }

  return Array.from(byId.values()).sort((a, b) => {
    if (a.level !== b.level) {
      return a.level - b.level;
    }

    return a.name.localeCompare(b.name);
  });
};

const spellCatalog = buildSpellCatalog();

export default function SpellPickerModal({
  isOpen,
  onClose,
  selectedSpellIds = [],
  onSelect,
}: SpellPickerModalProps) {
  const [search, setSearch] = useState("");

  const [levelFilter, setLevelFilter] = useState<"all" | number>("all");

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

  const filteredSpells = useMemo(() => {
    const query = search.trim().toLowerCase();

    return spellCatalog
      .filter((spell) => {
        if (levelFilter !== "all" && spell.level !== levelFilter) {
          return false;
        }

        if (!query) {
          return true;
        }

        return [
          spell.name,
          spell.id,
          spell.school,
          spell.castingTime,
          spell.range,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .slice(0, 150);
  }, [levelFilter, search]);

  const handleSelectSpell = (spell: CatalogSpell) => {
    onSelect({
      spellId: spell.id,
      name: spell.name,
      level: spell.level,
    });

    setSearch("");

    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4">
      <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-4">
          <div>
            <h2 className="text-base font-semibold text-white">Add Spell</h2>

            <p className="mt-1 text-xs text-zinc-400">
              Search the spell catalog and add spells directly to the character.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="grid gap-2 border-b border-white/10 p-3 sm:grid-cols-[1fr_150px]">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-950 px-3 py-2">
            <i className="fa-solid fa-magnifying-glass text-zinc-500" />

            <input
              ref={searchInputRef}
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Fireball, Cure Wounds..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            />
          </div>

          <select
            value={levelFilter}
            onChange={(event) => {
              const value = event.target.value;

              setLevelFilter(value === "all" ? "all" : Number(value));
            }}
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="all">All levels</option>

            <option value="0">Cantrips</option>

            {Array.from({ length: 9 }, (_, index) => index + 1).map((level) => (
              <option key={level} value={level}>
                Level {level}
              </option>
            ))}
          </select>
        </div>

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
          <div className="space-y-1.5">
            {filteredSpells.map((spell) => {
              const selected = selectedSpellIds.includes(spell.id);

              return (
                <button
                  key={spell.id}
                  type="button"
                  disabled={selected}
                  onClick={() => handleSelectSpell(spell)}
                  className="flex w-full items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left transition hover:bg-white/[0.08] disabled:cursor-default disabled:opacity-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {spell.name}
                    </p>

                    <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] text-zinc-400">
                      <span className="rounded-md border border-white/10 bg-zinc-950 px-2 py-1">
                        {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`}
                      </span>

                      {spell.school ? (
                        <span className="rounded-md border border-white/10 bg-zinc-950 px-2 py-1">
                          {spell.school}
                        </span>
                      ) : null}

                      {spell.castingTime ? (
                        <span className="rounded-md border border-white/10 bg-zinc-950 px-2 py-1">
                          {spell.castingTime}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <span className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950">
                    {selected ? "Added" : "Add"}
                  </span>
                </button>
              );
            })}

            {filteredSpells.length === 0 && (
              <div className="rounded-lg border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">
                No spells found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
