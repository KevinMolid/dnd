import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../../../context/AuthContext";

import { useEncounter } from "../../../context/EncounterContext";

import useMonsterLibrary from "../../../hooks/useMonsterLibrary";

import {
  createCampaignRandomTable,
  deleteCampaignRandomTable,
  updateCampaignRandomTable,
} from "../../randomTables/randomTableService";

import { rollWeightedEncounterEntry } from "../../randomTables/randomTableEngine";

import useCampaignRandomTables from "../../randomTables/useCampaignRandomTables";

import type {
  CampaignRandomTable,
  RandomEncounterEntry,
  RandomEncounterEntryType,
  RandomEncounterMonster,
  RolledRandomEncounter,
} from "../../randomTables/types";

import { useWorkspace } from "../WorkspaceContext";

import type { WorkspaceModuleRenderProps } from "../workspaceTypes";

const makeId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const normalizeText = (value?: string) =>
  (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");

const tableMatchesLocation = (
  table: CampaignRandomTable,

  location?: string,
) => {
  if (!location || !table.locationNames?.length) {
    return false;
  }

  const normalizedLocation = normalizeText(location);

  return table.locationNames.some((tableLocation) => {
    const normalizedTableLocation = normalizeText(tableLocation);

    return (
      normalizedTableLocation === normalizedLocation ||
      normalizedTableLocation.includes(normalizedLocation) ||
      normalizedLocation.includes(normalizedTableLocation)
    );
  });
};

const getDefaultEntry = (): RandomEncounterEntry => ({
  id: makeId(),

  name: "New Encounter",

  weight: 1,

  type: "combat",

  description: "",

  monsters: [],
});

const getDefaultMonsterRow = (): RandomEncounterMonster => ({
  id: makeId(),

  monsterKey: "",

  quantityExpression: "1",
});

type TableDraft = {
  name: string;

  description: string;

  locationText: string;

  entries: RandomEncounterEntry[];
};

const emptyDraft = (): TableDraft => ({
  name: "New Encounter Table",

  description: "",

  locationText: "",

  entries: [getDefaultEntry()],
});

const tableToDraft = (table: CampaignRandomTable): TableDraft => ({
  name: table.name,

  description: table.description ?? "",

  locationText: (table.locationNames ?? []).join(", "),

  entries: table.entries.map((entry) => ({
    ...entry,

    monsters: (entry.monsters ?? []).map((monster) => ({
      ...monster,
    })),
  })),
});

const getEntryTypeLabel = (type: RandomEncounterEntryType) => {
  return type === "combat" ? "Combat" : "Event";
};

export default function RandomEncounterWorkspaceModule({
  module,

  campaignId,

  updateModule,
}: WorkspaceModuleRenderProps) {
  const { user } = useAuth();

  const {
    tables,

    loading,

    error,
  } = useCampaignRandomTables(campaignId);

  const {
    allMonsters,

    loading: monstersLoading,
  } = useMonsterLibrary(campaignId);

  const {
    encounter,

    clearEncounter,

    addMonsterToEncounter,
  } = useEncounter();

  const { activeLocation } = useWorkspace();

  const [rolledEncounter, setRolledEncounter] =
    useState<RolledRandomEncounter | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);

  const [editingTableId, setEditingTableId] = useState<string | null>(null);

  const [draft, setDraft] = useState<TableDraft>(emptyDraft());

  const [saving, setSaving] = useState(false);

  const [editorError, setEditorError] = useState<string | null>(null);

  const orderedTables = useMemo(() => {
    return [...tables].sort((a, b) => {
      const aMatches = tableMatchesLocation(a, activeLocation?.roomName);

      const bMatches = tableMatchesLocation(b, activeLocation?.roomName);

      if (aMatches !== bMatches) {
        return aMatches ? -1 : 1;
      }

      return a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      });
    });
  }, [tables, activeLocation]);

  const selectedTable = useMemo(() => {
    const configuredId = module.config?.randomEncounterTableId;

    if (configuredId) {
      const found = tables.find((table) => table.id === configuredId);

      if (found) {
        return found;
      }
    }

    return orderedTables[0] ?? null;
  }, [module.config?.randomEncounterTableId, tables, orderedTables]);

  /*
   * Keep a valid table persisted in the module.
   */
  useEffect(() => {
    if (loading || !selectedTable) {
      return;
    }

    if (module.config?.randomEncounterTableId === selectedTable.id) {
      return;
    }

    updateModule(module.id, {
      config: {
        ...module.config,

        randomEncounterTableId: selectedTable.id,
      },
    });
  }, [loading, selectedTable, module.id, module.config, updateModule]);

  /*
   * If changing tables, previous result is no
   * longer relevant.
   */
  const selectTable = (tableId: string) => {
    updateModule(module.id, {
      config: {
        ...module.config,

        randomEncounterTableId: tableId,
      },
    });

    setRolledEncounter(null);
  };

  const rollEncounter = () => {
    if (!selectedTable) {
      return;
    }

    const result = rollWeightedEncounterEntry(selectedTable.entries);

    setRolledEncounter(result);
  };

  const getMonsterByKey = (monsterKey: string) => {
    return (
      allMonsters.find(
        (monster) => `${monster.source}:${monster.id}` === monsterKey,
      ) ?? null
    );
  };

  const startEncounter = () => {
    if (!rolledEncounter || rolledEncounter.entryType !== "combat") {
      return;
    }

    const hasCreatures = rolledEncounter.monsters.some(
      (monster) =>
        monster.quantity > 0 && Boolean(getMonsterByKey(monster.monsterKey)),
    );

    if (!hasCreatures) {
      return;
    }

    if (encounter.length > 0) {
      const confirmed = window.confirm(
        "Replace the current encounter with this random encounter?",
      );

      if (!confirmed) {
        return;
      }
    }

    /*
     * React processes these state updates in order.
     *
     * First clear the old encounter, then append
     * each generated monster.
     */
    clearEncounter();

    rolledEncounter.monsters.forEach((rolledMonster) => {
      const monster = getMonsterByKey(rolledMonster.monsterKey);

      if (!monster) {
        return;
      }

      for (let i = 0; i < rolledMonster.quantity; i += 1) {
        addMonsterToEncounter(monster);
      }
    });
  };

  const openNewTable = () => {
    setEditingTableId(null);

    setDraft(emptyDraft());

    setEditorError(null);

    setEditorOpen(true);
  };

  const openEditTable = () => {
    if (!selectedTable) {
      return;
    }

    setEditingTableId(selectedTable.id);

    setDraft(tableToDraft(selectedTable));

    setEditorError(null);

    setEditorOpen(true);
  };

  const updateEntry = (
    entryId: string,

    changes: Partial<RandomEncounterEntry>,
  ) => {
    setDraft((current) => ({
      ...current,

      entries: current.entries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,

              ...changes,
            }
          : entry,
      ),
    }));
  };

  const addEntry = () => {
    setDraft((current) => ({
      ...current,

      entries: [...current.entries, getDefaultEntry()],
    }));
  };

  const removeEntry = (entryId: string) => {
    setDraft((current) => ({
      ...current,

      entries: current.entries.filter((entry) => entry.id !== entryId),
    }));
  };

  const addMonsterRow = (entryId: string) => {
    setDraft((current) => ({
      ...current,

      entries: current.entries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,

              monsters: [...(entry.monsters ?? []), getDefaultMonsterRow()],
            }
          : entry,
      ),
    }));
  };

  const updateMonsterRow = (
    entryId: string,

    monsterRowId: string,

    changes: Partial<RandomEncounterMonster>,
  ) => {
    setDraft((current) => ({
      ...current,

      entries: current.entries.map((entry) => {
        if (entry.id !== entryId) {
          return entry;
        }

        return {
          ...entry,

          monsters: (entry.monsters ?? []).map((monster) =>
            monster.id === monsterRowId
              ? {
                  ...monster,

                  ...changes,
                }
              : monster,
          ),
        };
      }),
    }));
  };

  const removeMonsterRow = (
    entryId: string,

    monsterRowId: string,
  ) => {
    setDraft((current) => ({
      ...current,

      entries: current.entries.map((entry) => {
        if (entry.id !== entryId) {
          return entry;
        }

        return {
          ...entry,

          monsters: (entry.monsters ?? []).filter(
            (monster) => monster.id !== monsterRowId,
          ),
        };
      }),
    }));
  };

  const saveTable = async () => {
    if (!user) {
      setEditorError("You must be logged in.");

      return;
    }

    const name = draft.name.trim();

    if (!name) {
      setEditorError("The table needs a name.");

      return;
    }

    if (draft.entries.length === 0) {
      setEditorError("Add at least one encounter result.");

      return;
    }

    for (const entry of draft.entries) {
      if (!entry.name.trim()) {
        setEditorError("Every result needs a name.");

        return;
      }

      if (
        entry.type === "combat" &&
        (entry.monsters ?? []).some((monster) => !monster.monsterKey)
      ) {
        setEditorError(`Choose a monster for every row in "${entry.name}".`);

        return;
      }
    }

    const locationNames = draft.locationText
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const entries = draft.entries.map((entry) => ({
      ...entry,

      name: entry.name.trim(),

      description: entry.description?.trim() || "",

      weight: Math.max(1, Math.floor(entry.weight || 1)),

      monsters:
        entry.type === "combat"
          ? (entry.monsters ?? []).map((monster) => ({
              ...monster,

              quantityExpression: monster.quantityExpression.trim() || "1",

              displayName: monster.displayName?.trim() || undefined,
            }))
          : [],
    }));

    try {
      setSaving(true);

      setEditorError(null);

      if (editingTableId) {
        await updateCampaignRandomTable(
          campaignId,

          editingTableId,

          user.uid,

          {
            name,

            description: draft.description.trim(),

            locationNames,

            entries,
          },
        );
      } else {
        const id = await createCampaignRandomTable({
          campaignId,

          userId: user.uid,

          data: {
            name,

            description: draft.description.trim(),

            kind: "encounter",

            locationNames,

            entries,
          },
        });

        updateModule(module.id, {
          config: {
            ...module.config,

            randomEncounterTableId: id,
          },
        });
      }

      setRolledEncounter(null);

      setEditorOpen(false);
    } catch (saveError) {
      console.error(saveError);

      setEditorError("Failed to save the encounter table.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTable = async () => {
    if (!selectedTable) {
      return;
    }

    const confirmed = window.confirm(`Delete "${selectedTable.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteCampaignRandomTable(
        campaignId,

        selectedTable.id,
      );

      updateModule(module.id, {
        config: {
          ...module.config,

          randomEncounterTableId: undefined,
        },
      });

      setRolledEncounter(null);
    } catch (deleteError) {
      console.error(deleteError);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-zinc-500">
        Loading encounter tables...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-xs text-rose-300">
        {error}
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-zinc-950/20">
      {/* Toolbar */}

      <div className="workspace-no-drag shrink-0 border-b border-white/10 bg-black/20 p-2">
        <div className="flex items-center gap-2">
          {tables.length > 0 ? (
            <div className="relative min-w-0 flex-1">
              <select
                value={selectedTable?.id ?? ""}
                onChange={(event) => selectTable(event.target.value)}
                className="h-8 w-full appearance-none truncate rounded-lg border border-white/10 bg-white/5 px-3 pr-8 text-xs font-semibold text-zinc-200 outline-none hover:bg-white/10"
              >
                {orderedTables.map((table) => (
                  <option
                    key={table.id}
                    value={table.id}
                    className="bg-zinc-900"
                  >
                    {tableMatchesLocation(table, activeLocation?.roomName)
                      ? "📍 "
                      : ""}

                    {table.name}
                  </option>
                ))}
              </select>

              <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-zinc-600" />
            </div>
          ) : (
            <div className="min-w-0 flex-1 truncate text-xs text-zinc-500">
              No encounter tables
            </div>
          )}

          <button
            type="button"
            onClick={openNewTable}
            title="Create encounter table"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-plus text-[10px]" />
          </button>

          <button
            type="button"
            onClick={openEditTable}
            disabled={!selectedTable}
            title="Edit table"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:opacity-25"
          >
            <i className="fa-solid fa-pen text-[9px]" />
          </button>
        </div>

        {activeLocation ? (
          <div className="mt-2 flex items-center gap-1.5 truncate text-[9px] text-emerald-300/70">
            <i className="fa-solid fa-location-dot" />

            <span className="truncate">{activeLocation.roomName}</span>

            {selectedTable &&
            tableMatchesLocation(selectedTable, activeLocation.roomName) ? (
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase text-emerald-300">
                Matching table
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Empty */}

      {!selectedTable ? (
        <div className="flex min-h-0 flex-1 items-center justify-center p-5 text-center">
          <div>
            <i className="fa-solid fa-dice-d20 text-3xl text-violet-400/25" />

            <p className="mt-3 text-sm font-semibold text-zinc-300">
              No random encounters
            </p>

            <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-600">
              Create your first campaign-specific encounter table.
            </p>

            <button
              type="button"
              onClick={openNewTable}
              className="mt-4 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-500"
            >
              <i className="fa-solid fa-plus mr-1.5" />
              Create Table
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Table info */}

          <div className="shrink-0 border-b border-white/10 p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                <i className="fa-solid fa-dice-d20" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-white">
                  {selectedTable.name}
                </div>

                <div className="mt-0.5 text-[9px] text-zinc-600">
                  {selectedTable.entries.length} possible result
                  {selectedTable.entries.length === 1 ? "" : "s"}
                </div>
              </div>

              <button
                type="button"
                onClick={deleteTable}
                title="Delete table"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-rose-500/10 hover:text-rose-300"
              >
                <i className="fa-solid fa-trash text-[9px]" />
              </button>
            </div>

            {selectedTable.description ? (
              <p className="mt-2 text-[10px] leading-4 text-zinc-500">
                {selectedTable.description}
              </p>
            ) : null}

            <button
              type="button"
              onClick={rollEncounter}
              disabled={selectedTable.entries.length === 0}
              className="mt-3 w-full rounded-lg bg-violet-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-violet-500 disabled:opacity-30"
            >
              <i className="fa-solid fa-dice-d20 mr-2" />

              {rolledEncounter ? "Reroll Encounter" : "Roll Encounter"}
            </button>
          </div>

          {/* Result */}

          <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
            {!rolledEncounter ? (
              <div className="flex min-h-full items-center justify-center p-5 text-center">
                <div>
                  <i className="fa-solid fa-dice text-2xl text-zinc-800" />

                  <p className="mt-2 text-xs text-zinc-600">
                    Roll the table when you need an encounter.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="flex items-start gap-2">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        rolledEncounter.entryType === "combat"
                          ? "bg-rose-500/10 text-rose-300"
                          : "bg-sky-500/10 text-sky-300"
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          rolledEncounter.entryType === "combat"
                            ? "fa-swords"
                            : "fa-eye"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[8px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                        {getEntryTypeLabel(rolledEncounter.entryType)}
                        {" · "}
                        Roll {rolledEncounter.weightedRoll}/
                        {rolledEncounter.totalWeight}
                      </div>

                      <h3 className="mt-0.5 text-sm font-bold text-white">
                        {rolledEncounter.entryName}
                      </h3>
                    </div>
                  </div>

                  {rolledEncounter.description ? (
                    <div className="mt-3 whitespace-pre-wrap text-xs leading-5 text-zinc-300">
                      {rolledEncounter.description}
                    </div>
                  ) : null}

                  {rolledEncounter.entryType === "combat" &&
                  rolledEncounter.monsters.length > 0 ? (
                    <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
                      {rolledEncounter.monsters.map((rolledMonster, index) => {
                        const monster = getMonsterByKey(
                          rolledMonster.monsterKey,
                        );

                        return (
                          <div
                            key={`${rolledMonster.monsterKey}-${index}`}
                            className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.025] p-2"
                          >
                            <div className="h-8 w-10 shrink-0 overflow-hidden rounded-md bg-black/30">
                              {monster?.img ? (
                                <img
                                  src={monster.img}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-zinc-700">
                                  <i className="fa-solid fa-dragon text-[9px]" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs font-semibold text-amber-200">
                                {rolledMonster.quantity}×{" "}
                                {rolledMonster.displayName ||
                                  monster?.name ||
                                  "Unknown Monster"}
                              </div>

                              <div className="mt-0.5 text-[9px] text-zinc-600">
                                Rolled {rolledMonster.quantityExpression}
                                {rolledMonster.rolls.length > 0
                                  ? ` → [${rolledMonster.rolls.join(", ")}]`
                                  : ""}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                {rolledEncounter.entryType === "combat" ? (
                  <button
                    type="button"
                    onClick={startEncounter}
                    disabled={
                      monstersLoading || rolledEncounter.monsters.length === 0
                    }
                    className="mt-3 w-full rounded-lg bg-rose-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-rose-500 disabled:opacity-30"
                  >
                    <i className="fa-solid fa-play mr-2" />
                    Start Encounter
                  </button>
                ) : (
                  <div className="mt-3 rounded-lg border border-sky-500/10 bg-sky-500/[0.04] px-3 py-2 text-center text-[10px] text-sky-300">
                    No combat to start — this is an event result.
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Editor */}

      {editorOpen ? (
        <div className="workspace-no-drag absolute inset-0 z-50 flex flex-col bg-zinc-950">
          {/* Editor header */}

          <div className="flex h-11 shrink-0 items-center gap-2 border-b border-white/10 bg-zinc-900 px-3">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white">
                {editingTableId
                  ? "Edit Encounter Table"
                  : "New Encounter Table"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditorOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/10 hover:text-white"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          {/* Editor content */}

          <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-zinc-600">
                  Table Name
                </label>

                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,

                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-violet-500/40"
                />
              </div>

              <div>
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-zinc-600">
                  Description
                </label>

                <textarea
                  value={draft.description}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,

                      description: event.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-violet-500/40"
                />
              </div>

              <div>
                <label className="mb-1 block text-[9px] font-bold uppercase tracking-wide text-zinc-600">
                  Locations
                </label>

                <input
                  value={draft.locationText}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,

                      locationText: event.target.value,
                    }))
                  }
                  placeholder="Forest, Black Tower, Village"
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white outline-none focus:border-violet-500/40"
                />

                <p className="mt-1 text-[9px] text-zinc-700">
                  Separate multiple locations with commas.
                </p>
              </div>

              {/* Entries */}

              <div className="border-t border-white/10 pt-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                    Results
                  </div>

                  <button
                    type="button"
                    onClick={addEntry}
                    className="rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[9px] font-semibold text-violet-300 hover:bg-violet-500/15"
                  >
                    <i className="fa-solid fa-plus mr-1" />
                    Result
                  </button>
                </div>

                <div className="space-y-3">
                  {draft.entries.map((entry, entryIndex) => (
                    <section
                      key={entry.id}
                      className="rounded-xl border border-white/10 bg-white/[0.025] p-3"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-500/10 text-[9px] font-bold text-violet-300">
                          {entryIndex + 1}
                        </span>

                        <input
                          value={entry.name}
                          onChange={(event) =>
                            updateEntry(
                              entry.id,

                              {
                                name: event.target.value,
                              },
                            )
                          }
                          className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-xs font-semibold text-white outline-none"
                        />

                        <button
                          type="button"
                          onClick={() => removeEntry(entry.id)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-700 hover:bg-rose-500/10 hover:text-rose-300"
                        >
                          <i className="fa-solid fa-trash text-[9px]" />
                        </button>
                      </div>

                      <div className="grid grid-cols-[1fr_90px] gap-2">
                        <div>
                          <label className="mb-1 block text-[8px] uppercase text-zinc-700">
                            Type
                          </label>

                          <select
                            value={entry.type}
                            onChange={(event) =>
                              updateEntry(
                                entry.id,

                                {
                                  type: event.target
                                    .value as RandomEncounterEntryType,
                                },
                              )
                            }
                            className="w-full rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-[10px] text-zinc-300 outline-none"
                          >
                            <option value="combat" className="bg-zinc-900">
                              Combat
                            </option>

                            <option value="event" className="bg-zinc-900">
                              Event
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-1 block text-[8px] uppercase text-zinc-700">
                            Weight
                          </label>

                          <input
                            type="number"
                            min={1}
                            value={entry.weight}
                            onChange={(event) =>
                              updateEntry(
                                entry.id,

                                {
                                  weight: Math.max(
                                    1,

                                    Number(event.target.value) || 1,
                                  ),
                                },
                              )
                            }
                            className="w-full rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-[10px] text-white outline-none"
                          />
                        </div>
                      </div>

                      <textarea
                        value={entry.description ?? ""}
                        onChange={(event) =>
                          updateEntry(
                            entry.id,

                            {
                              description: event.target.value,
                            },
                          )
                        }
                        placeholder="Description, read-aloud text or DM notes..."
                        rows={2}
                        className="mt-2 w-full resize-none rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-[10px] text-zinc-300 outline-none placeholder:text-zinc-700"
                      />

                      {entry.type === "combat" ? (
                        <div className="mt-3 border-t border-white/5 pt-2">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-[8px] font-bold uppercase tracking-wide text-zinc-700">
                              Monsters
                            </div>

                            <button
                              type="button"
                              onClick={() => addMonsterRow(entry.id)}
                              className="text-[9px] font-semibold text-amber-300 hover:text-amber-200"
                            >
                              + Monster
                            </button>
                          </div>

                          {(entry.monsters ?? []).length === 0 ? (
                            <div className="rounded-lg border border-dashed border-white/10 p-3 text-center text-[9px] text-zinc-700">
                              No monsters yet.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {(entry.monsters ?? []).map((monsterRow) => (
                                <div
                                  key={monsterRow.id}
                                  className="flex items-end gap-1.5 rounded-lg border border-white/5 bg-black/20 p-2"
                                >
                                  <div className="min-w-0 flex-1">
                                    <label className="mb-1 block text-[8px] text-zinc-700">
                                      Monster
                                    </label>

                                    <select
                                      value={monsterRow.monsterKey}
                                      onChange={(event) =>
                                        updateMonsterRow(
                                          entry.id,

                                          monsterRow.id,

                                          {
                                            monsterKey: event.target.value,
                                          },
                                        )
                                      }
                                      className="h-8 w-full rounded-md border border-white/10 bg-zinc-900 px-2 text-[10px] text-zinc-300 outline-none"
                                    >
                                      <option value="">Choose...</option>

                                      {allMonsters.map((monster) => {
                                        const key = `${monster.source}:${monster.id}`;

                                        return (
                                          <option
                                            key={key}
                                            value={key}
                                            className="bg-zinc-900"
                                          >
                                            {monster.source === "campaign"
                                              ? "★ "
                                              : ""}

                                            {monster.name}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>

                                  <div className="w-20 shrink-0">
                                    <label className="mb-1 block text-[8px] text-zinc-700">
                                      Quantity
                                    </label>

                                    <input
                                      value={monsterRow.quantityExpression}
                                      onChange={(event) =>
                                        updateMonsterRow(
                                          entry.id,

                                          monsterRow.id,

                                          {
                                            quantityExpression:
                                              event.target.value,
                                          },
                                        )
                                      }
                                      placeholder="1d4"
                                      className="h-8 w-full rounded-md border border-white/10 bg-black/30 px-2 text-[10px] text-white outline-none"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeMonsterRow(
                                        entry.id,

                                        monsterRow.id,
                                      )
                                    }
                                    title="Remove monster"
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-700 hover:bg-rose-500/10 hover:text-rose-300"
                                  >
                                    <i className="fa-solid fa-xmark text-[9px]" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Editor footer */}

          <div className="shrink-0 border-t border-white/10 bg-zinc-900 p-3">
            {editorError ? (
              <div className="mb-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[10px] text-rose-300">
                {editorError}
              </div>
            ) : null}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-400 hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveTable}
                disabled={saving}
                className="flex-1 rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-violet-500 disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save Table"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
