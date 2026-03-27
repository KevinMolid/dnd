import { useMemo, useState } from "react";
import Avatar from "./Avatar";
import H3 from "./H3";
import {
  monsters,
  monsterTypes,
  type MonsterDefinition,
} from "../data/monsterCatalog";

export type EncounterTemplateDraftMonster = {
  id: string;
  monsterId: string;
  quantity: number;
  customName?: string;
};

export type EncounterTemplateDraft = {
  name: string;
  monsters: EncounterTemplateDraftMonster[];
};

type Props = {
  initialValue?: EncounterTemplateDraft;
  onSave: (template: EncounterTemplateDraft) => void;
  onCancel?: () => void;
};

const makeRowId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const emptyDraft: EncounterTemplateDraft = {
  name: "",
  monsters: [],
};

const EncounterTemplateBuilder = ({
  initialValue,
  onSave,
  onCancel,
}: Props) => {
  const [draft, setDraft] = useState<EncounterTemplateDraft>(
    initialValue ?? emptyDraft,
  );
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());

  const monstersById = useMemo(
    () =>
      Object.fromEntries(
        monsters.map((monster) => [monster.id, monster]),
      ) as Record<string, MonsterDefinition>,
    [],
  );

  const filteredMonsters = useMemo(() => {
    const query = search.trim().toLowerCase();
    const hasSearch = query.length > 0;
    const hasTypeFilter = selectedTypes.size > 0;

    return [...monsters]
      .filter((monster) => {
        const matchesSearch = hasSearch
          ? monster.name.toLowerCase().includes(query)
          : true;

        const matchesType = hasTypeFilter
          ? selectedTypes.has(monster.type)
          : true;

        return matchesSearch && matchesType;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [search, selectedTypes]);

  const totalXp = useMemo(() => {
    return draft.monsters.reduce((sum, row) => {
      const monster = monstersById[row.monsterId];
      if (!monster) return sum;
      return sum + monster.xp * row.quantity;
    }, 0);
  }, [draft.monsters, monstersById]);

  const totalCount = useMemo(() => {
    return draft.monsters.reduce((sum, row) => sum + row.quantity, 0);
  }, [draft.monsters]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const addMonster = (monsterId: string) => {
    setDraft((prev) => {
      const existing = prev.monsters.find(
        (row) => row.monsterId === monsterId && !row.customName,
      );

      if (existing) {
        return {
          ...prev,
          monsters: prev.monsters.map((row) =>
            row.id === existing.id
              ? { ...row, quantity: row.quantity + 1 }
              : row,
          ),
        };
      }

      return {
        ...prev,
        monsters: [
          ...prev.monsters,
          {
            id: makeRowId(),
            monsterId,
            quantity: 1,
            customName: "",
          },
        ],
      };
    });
  };

  const updateRow = (
    rowId: string,
    updates: Partial<EncounterTemplateDraftMonster>,
  ) => {
    setDraft((prev) => ({
      ...prev,
      monsters: prev.monsters.map((row) =>
        row.id === rowId ? { ...row, ...updates } : row,
      ),
    }));
  };

  const removeRow = (rowId: string) => {
    setDraft((prev) => ({
      ...prev,
      monsters: prev.monsters.filter((row) => row.id !== rowId),
    }));
  };

  const handleSave = () => {
    const trimmedName = draft.name.trim();
    if (!trimmedName) return;
    if (draft.monsters.length === 0) return;

    onSave({
      name: trimmedName,
      monsters: draft.monsters.map((row) => ({
        id: row.id,
        monsterId: row.monsterId,
        quantity: Math.max(1, row.quantity),
        customName: row.customName?.trim() || undefined,
      })),
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
        <div className="mb-4">
          <H3 className="mb-2">Monster Library</H3>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search monsters..."
              className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none transition focus:border-yellow-600"
            />

            <div className="flex flex-wrap gap-2">
              {monsterTypes.map((type) => {
                const active = selectedTypes.has(type);

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-yellow-700 bg-yellow-500/10 text-yellow-300"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
          {filteredMonsters.length === 0 ? (
            <p className="text-sm text-zinc-500">No monsters found.</p>
          ) : (
            filteredMonsters.map((monster) => (
              <div
                key={monster.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <div className="min-w-0 flex items-center gap-3">
                  <Avatar name={monster.name} src={monster.img} size="sm" />

                  <div className="min-w-0">
                    <div className="truncate font-medium text-white">
                      {monster.name}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {monster.type} • CR {monster.challengeRating} •{" "}
                      {monster.xp} XP
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addMonster(monster.id)}
                  className="shrink-0 rounded-xl border border-emerald-700 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/15"
                >
                  Add
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
        <div className="mb-4 flex flex-col gap-3">
          <H3 className="mb-0">Encounter Template</H3>

          <input
            type="text"
            value={draft.name}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Template name..."
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none transition focus:border-yellow-600"
          />

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-zinc-300">
              Monsters: {totalCount}
            </span>
            <span className="rounded-full border border-blue-700 bg-blue-500/10 px-2.5 py-1 text-blue-300">
              Total XP: {totalXp}
            </span>
          </div>
        </div>

        {draft.monsters.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-zinc-500">
            Add monsters from the library to build this encounter.
          </div>
        ) : (
          <div className="space-y-3">
            {draft.monsters.map((row) => {
              const monster = monstersById[row.monsterId];
              if (!monster) return null;

              return (
                <div
                  key={row.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <Avatar name={monster.name} src={monster.img} size="sm" />

                    <div className="min-w-0">
                      <div className="truncate font-medium text-white">
                        {monster.name}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {monster.type} • CR {monster.challengeRating} •{" "}
                        {monster.xp} XP each
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-[110px_minmax(0,1fr)_auto]">
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={row.quantity}
                        onChange={(e) =>
                          updateRow(row.id, {
                            quantity: Math.max(1, Number(e.target.value) || 1),
                          })
                        }
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">
                        Custom name
                      </label>
                      <input
                        type="text"
                        value={row.customName ?? ""}
                        onChange={(e) =>
                          updateRow(row.id, { customName: e.target.value })
                        }
                        placeholder="Optional, e.g. Klarg"
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white outline-none"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="rounded-xl border border-red-700 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/15"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-zinc-500">
                    Row XP: {monster.xp * row.quantity}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={!draft.name.trim() || draft.monsters.length === 0}
            className="rounded-xl border border-green-700 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Template
          </button>
        </div>
      </section>
    </div>
  );
};

export default EncounterTemplateBuilder;
