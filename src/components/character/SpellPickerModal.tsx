import { useMemo, useState } from "react";

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
      // A class without a spell
      // implementation can simply
      // contribute no spells.
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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4">
      <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h2 className="text-xl font-semibold text-white">Add Spell</h2>

            <p className="mt-1 text-sm text-zinc-400">
              Search the spell catalog and add a spell directly to the
              character.
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

        <div className="grid gap-3 border-b border-white/10 p-4 sm:grid-cols-[1fr_170px]">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3">
            <i className="fa-solid fa-magnifying-glass text-zinc-500" />

            <input
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
            className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="all">All levels</option>

            <option value="0">Cantrips</option>

            {Array.from(
              {
                length: 9,
              },
              (_, index) => index + 1,
            ).map((level) => (
              <option key={level} value={level}>
                Level {level}
              </option>
            ))}
          </select>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredSpells.map((spell) => {
              const selected = selectedSpellIds.includes(spell.id);

              return (
                <button
                  key={spell.id}
                  type="button"
                  disabled={selected}
                  onClick={() => {
                    onSelect({
                      spellId: spell.id,

                      name: spell.name,

                      level: spell.level,
                    });

                    onClose();
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10 disabled:cursor-default disabled:opacity-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {spell.name}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-400">
                      <span className="rounded-full border border-white/10 bg-zinc-950 px-2 py-1">
                        {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`}
                      </span>

                      {spell.school ? (
                        <span className="rounded-full border border-white/10 bg-zinc-950 px-2 py-1">
                          {spell.school}
                        </span>
                      ) : null}

                      {spell.castingTime ? (
                        <span className="rounded-full border border-white/10 bg-zinc-950 px-2 py-1">
                          {spell.castingTime}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <span className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-950">
                    {selected ? "Added" : "Add"}
                  </span>
                </button>
              );
            })}

            {filteredSpells.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">
                No spells found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
