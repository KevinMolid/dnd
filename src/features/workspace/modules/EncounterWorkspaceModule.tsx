import { useCallback, useEffect, useMemo, useState } from "react";

import Avatar from "../../../components/Avatar";

import {
  useEncounter,
  type EncounterEntry,
  type EncounterPlayerInput,
} from "../../../context/EncounterContext";

import useMonsterLibrary from "../../../hooks/useMonsterLibrary";

import useCampaignPageData, {
  type CampaignCharacter,
} from "../../campaigns/hooks/useCampaignPageData";

import { getCharacterArmorClassFromEquipment } from "../../../rulesets/dnd/dnd2024/getCharacterArmorClassFromEquipment";

import { getCharacterHp } from "../../../rulesets/dnd/dnd2024/getCharacterHp";

import type { CharacterEquipmentEntry } from "../../../rulesets/dnd/dnd2024/types";

import {
  useWorkspace,
  type WorkspaceCharacterEncounterStatus,
  type WorkspaceMonsterEncounterStatus,
} from "../WorkspaceContext";

import type { WorkspaceModuleRenderProps } from "../workspaceTypes";

const sortEncounter = (encounter: EncounterEntry[]) => {
  return [...encounter].sort((a, b) => {
    const aInit = a.initiative === "" ? -999 : a.initiative;

    const bInit = b.initiative === "" ? -999 : b.initiative;

    if (bInit !== aInit) {
      return bInit - aInit;
    }

    if (a.entityKind !== b.entityKind) {
      return a.entityKind === "player" ? -1 : 1;
    }

    return a.displayName.localeCompare(b.displayName);
  });
};

const characterHasAlertFeat = (character: CampaignCharacter) => {
  if (character.originFeatId === "alert") {
    return true;
  }

  const levelUpDecisions = character.choices?.levelUpDecisions ?? {};

  return Object.values(levelUpDecisions).some(
    (decision: any) => decision?.featId === "alert",
  );
};

const getInitiativeBonus = (character: CampaignCharacter) => {
  const dex = character.abilityScores?.dex;

  const dexMod = typeof dex === "number" ? Math.floor((dex - 10) / 2) : 0;

  return dexMod + (characterHasAlertFeat(character) ? 5 : 0);
};

const getArmorClass = (character: CampaignCharacter) => {
  const dex = character.abilityScores?.dex ?? 10;

  const equipment =
    (
      character as {
        equipment?: CharacterEquipmentEntry[];
      }
    ).equipment ?? [];

  try {
    return getCharacterArmorClassFromEquipment({
      dexterityScore: dex,

      equipment,
    });
  } catch {
    return 10;
  }
};

const getLiveHp = (character: CampaignCharacter) => {
  try {
    const hp = getCharacterHp(character as never);

    return {
      currentHp: hp.currentHp,

      maxHp: hp.maxHp,
    };
  } catch {
    return {
      currentHp: character.currentHp ?? 0,

      maxHp: character.maxHp ?? 1,
    };
  }
};

const mapCharacterToEncounterPlayer = (
  character: CampaignCharacter,
): EncounterPlayerInput => {
  const hp = getLiveHp(character);

  return {
    characterId: character.id,

    name: character.name,

    currentHp: hp.currentHp,

    maxHp: hp.maxHp,

    armorClass: getArmorClass(character),

    initiativeBonus: getInitiativeBonus(character),

    level: character.level,

    classId: character.classId,

    speciesId: character.speciesId,
  };
};

export default function EncounterWorkspaceModule({
  campaignId,
}: WorkspaceModuleRenderProps) {
  const {
    encounter,

    currentTurnIndex,

    currentRound,

    addMonsterToEncounter,

    addPlayerToEncounter,

    removeEntityFromEncounter,

    updateEntityHp,

    updateEntityInitiative,

    nextTurn,

    previousTurn,

    resetTurns,

    clearEncounter,

    rollInitiative,
  } = useEncounter();

  const {
    selectedEntity,

    selectedCharacter,

    activeLocation,

    selectEntity,

    clearSelection,

    selectCharacter,

    clearCharacterSelection,
  } = useWorkspace();

  const {
    allMonsters,

    loading: monstersLoading,
  } = useMonsterLibrary(campaignId);

  const {
    campaignCharacters,

    campaignCharactersLoading,

    updateCharacter,
  } = useCampaignPageData(campaignId);

  const [showManagePanel, setShowManagePanel] = useState(false);

  const [manageMode, setManageMode] = useState<"monster" | "player">("monster");

  const [monsterSearch, setMonsterSearch] = useState("");

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const sortedEncounter = useMemo(() => sortEncounter(encounter), [encounter]);

  /*
   * Auto-follow effects only need to rerun when
   * initiative order or the current turn changes.
   *
   * This is what lets manually clicking a combatant
   * remain INSPECTING until the actual turn changes.
   */
  const initiativeOrderKey = useMemo(
    () =>
      sortedEncounter
        .map((entry) => `${entry.id}:${entry.initiative}`)
        .join("|"),
    [sortedEncounter],
  );

  const activeEntity = sortedEncounter[currentTurnIndex];

  const charactersById = useMemo(
    () =>
      new Map(campaignCharacters.map((character) => [character.id, character])),
    [campaignCharacters],
  );

  const filteredMonsters = useMemo(() => {
    const search = monsterSearch.trim().toLowerCase();

    if (!search) {
      return allMonsters;
    }

    return allMonsters.filter((monster) =>
      [monster.name, monster.type, monster.challengeRating]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [allMonsters, monsterSearch]);

  const getCharacterForEntry = useCallback(
    (entry: EncounterEntry) => {
      const id = entry.playerSnapshot?.characterId;

      if (id) {
        return charactersById.get(id);
      }

      return campaignCharacters.find(
        (character) => character.name === entry.entityName,
      );
    },
    [charactersById, campaignCharacters],
  );

  const getCharacterIdForEntry = useCallback(
    (entry: EncounterEntry) => {
      if (entry.entityKind !== "player") {
        return null;
      }

      const snapshotId = entry.playerSnapshot?.characterId;

      if (snapshotId) {
        return snapshotId;
      }

      return getCharacterForEntry(entry)?.id ?? null;
    },
    [getCharacterForEntry],
  );

  const getPlayerEncounterEntry = useCallback(
    (character: CampaignCharacter) => {
      return encounter.find((entry) => {
        if (entry.entityKind !== "player") {
          return false;
        }

        if (entry.playerSnapshot?.characterId === character.id) {
          return true;
        }

        return entry.entityName === character.name;
      });
    },
    [encounter],
  );

  const getEntryAc = (entry: EncounterEntry) => {
    if (entry.entityKind === "monster") {
      return entry.monsterSnapshot?.armorClass ?? "—";
    }

    return entry.playerSnapshot?.armorClass ?? "—";
  };

  const getEntryImage = (entry: EncounterEntry) => {
    if (entry.entityKind === "monster") {
      return entry.monsterSnapshot?.img;
    }

    return getCharacterForEntry(entry)?.imageUrl;
  };

  const getMonsterKeyForEntry = useCallback(
    (entry: EncounterEntry) => {
      if (entry.entityKind !== "monster") {
        return null;
      }

      const snapshot = entry.monsterSnapshot;

      if (snapshot) {
        if (snapshot.source) {
          return `${snapshot.source}:${snapshot.monsterId}`;
        }

        const matchingMonster = allMonsters.find(
          (monster) => monster.id === snapshot.monsterId,
        );

        if (matchingMonster) {
          return `${matchingMonster.source}:${matchingMonster.id}`;
        }
      }

      const matchingByName = allMonsters.find(
        (monster) => monster.name === entry.entityName,
      );

      if (!matchingByName) {
        return null;
      }

      return `${matchingByName.source}:${matchingByName.id}`;
    },
    [allMonsters],
  );

  const selectEncounterMonster = useCallback(
    (
      entry: EncounterEntry,

      encounterStatus: WorkspaceMonsterEncounterStatus = "manual",
    ) => {
      const monsterKey = getMonsterKeyForEntry(entry);

      if (!monsterKey) {
        return;
      }

      selectEntity({
        type: "monster",

        monsterKey,

        encounterEntryId: entry.id,

        encounterStatus,
      });
    },
    [getMonsterKeyForEntry, selectEntity],
  );

  const selectEncounterCharacter = useCallback(
    (
      entry: EncounterEntry,

      encounterStatus: WorkspaceCharacterEncounterStatus = "manual",
    ) => {
      const characterId = getCharacterIdForEntry(entry);

      if (!characterId) {
        return;
      }

      selectCharacter(characterId, {
        encounterEntryId: entry.id,

        encounterStatus,
      });
    },
    [getCharacterIdForEntry, selectCharacter],
  );

  /*
   * MONSTER FOLLOW
   *
   * Monster turn:
   * show ACTIVE monster.
   *
   * Player turn:
   * show next monster UP NEXT.
   */
  useEffect(() => {
    if (sortedEncounter.length === 0) {
      clearSelection();

      return;
    }

    const active = sortedEncounter[currentTurnIndex];

    if (!active) {
      return;
    }

    if (active.entityKind === "monster") {
      selectEncounterMonster(active, "active");

      return;
    }

    let nextMonster: EncounterEntry | null = null;

    for (let offset = 1; offset <= sortedEncounter.length; offset += 1) {
      const index = (currentTurnIndex + offset) % sortedEncounter.length;

      const candidate = sortedEncounter[index];

      if (candidate.entityKind === "monster") {
        nextMonster = candidate;

        break;
      }
    }

    if (nextMonster) {
      selectEncounterMonster(nextMonster, "up-next");
    } else {
      clearSelection();
    }

    // Intentionally not dependent on manual selection state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurnIndex, initiativeOrderKey, allMonsters]);

  /*
   * CHARACTER FOLLOW
   *
   * Player turn:
   * show CURRENT player.
   *
   * Monster turn:
   * show the next player UP NEXT.
   *
   * This runs independently from monster following,
   * so the DM can have both relevant sheets visible.
   */
  useEffect(() => {
    if (sortedEncounter.length === 0) {
      clearCharacterSelection();

      return;
    }

    const active = sortedEncounter[currentTurnIndex];

    if (!active) {
      return;
    }

    if (active.entityKind === "player") {
      selectEncounterCharacter(active, "active");

      return;
    }

    let nextPlayer: EncounterEntry | null = null;

    for (let offset = 1; offset <= sortedEncounter.length; offset += 1) {
      const index = (currentTurnIndex + offset) % sortedEncounter.length;

      const candidate = sortedEncounter[index];

      if (candidate.entityKind === "player") {
        nextPlayer = candidate;

        break;
      }
    }

    if (nextPlayer) {
      selectEncounterCharacter(nextPlayer, "up-next");
    } else {
      clearCharacterSelection();
    }

    /*
     * Do not include selectedCharacter here.
     *
     * Doing so would recreate the old flicker problem:
     * clicking a player manually would cause this effect
     * to immediately replace it with active/up-next.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurnIndex, initiativeOrderKey, campaignCharacters]);

  const updateHp = async (
    entry: EncounterEntry,

    delta: number,
  ) => {
    const nextHp = Math.max(
      0,

      Math.min(
        entry.maxHp,

        entry.currentHp + delta,
      ),
    );

    updateEntityHp(entry.id, nextHp);

    if (entry.entityKind !== "player") {
      return;
    }

    const character = getCharacterForEntry(entry);

    if (!character) {
      return;
    }

    await updateCharacter(character.id, {
      currentHp: nextHp,
    });
  };

  const setHp = async (
    entry: EncounterEntry,

    value: number,
  ) => {
    if (!Number.isFinite(value)) {
      return;
    }

    const nextHp = Math.max(
      0,

      Math.min(entry.maxHp, value),
    );

    updateEntityHp(entry.id, nextHp);

    if (entry.entityKind !== "player") {
      return;
    }

    const character = getCharacterForEntry(entry);

    if (!character) {
      return;
    }

    await updateCharacter(character.id, {
      currentHp: nextHp,
    });
  };

  const togglePlayer = (character: CampaignCharacter) => {
    const existing = getPlayerEncounterEntry(character);

    if (existing) {
      removeEntityFromEncounter(existing.id);

      return;
    }

    addPlayerToEncounter(mapCharacterToEncounterPlayer(character));
  };

  const handleEndEncounter = () => {
    if (encounter.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "End the current encounter? This clears all combatants, initiative and turn progress.",
    );

    if (!confirmed) {
      return;
    }

    clearEncounter();

    clearSelection();

    clearCharacterSelection();

    setShowManagePanel(false);

    setShowMoreMenu(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-zinc-950/20">
      {/* Controls */}

      <div className="workspace-no-drag shrink-0 border-b border-white/10 bg-black/20 p-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-300">
            Round{" "}
            <span className="font-bold text-amber-300">{currentRound}</span>
          </div>

          <div className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-400">
            <span className="text-zinc-500">Turn</span>{" "}
            <span className="font-semibold text-white">
              {activeEntity?.displayName ?? "—"}
            </span>
          </div>

          <button
            type="button"
            onClick={previousTurn}
            disabled={encounter.length === 0}
            title="Previous turn"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 disabled:cursor-default disabled:opacity-30"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          <button
            type="button"
            onClick={nextTurn}
            disabled={encounter.length === 0}
            title="Next turn"
            className="flex h-8 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-3 text-xs font-bold text-white transition hover:bg-emerald-400 disabled:cursor-default disabled:opacity-30"
          >
            Next
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={rollInitiative}
            disabled={encounter.length === 0}
            className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1.5 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/15 disabled:cursor-default disabled:opacity-30"
          >
            <i className="fa-solid fa-dice-d20 mr-1.5" />
            Roll Initiative
          </button>

          <button
            type="button"
            onClick={() => setShowManagePanel((current) => !current)}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
              showManagePanel
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >
            <i
              className={`fa-solid ${
                showManagePanel ? "fa-xmark" : "fa-user-plus"
              } mr-1.5`}
            />

            {showManagePanel ? "Close" : "Manage Combatants"}
          </button>

          {activeLocation ? (
            <div
              title={`${activeLocation.mapTitle} · ${activeLocation.roomName}`}
              className="flex min-w-0 max-w-52 items-center gap-1.5 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.06] px-2 py-1.5"
            >
              <i className="fa-solid fa-location-dot shrink-0 text-[9px] text-emerald-300" />

              <span className="truncate text-[10px] font-medium text-emerald-200">
                {activeLocation.roomName}
              </span>
            </div>
          ) : null}

          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setShowMoreMenu((current) => !current)}
              title="More encounter options"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <i className="fa-solid fa-ellipsis" />
            </button>

            {showMoreMenu ? (
              <div className="absolute right-0 top-10 z-30 w-44 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-1 shadow-2xl">
                <button
                  type="button"
                  onClick={() => {
                    resetTurns();

                    setShowMoreMenu(false);
                  }}
                  disabled={encounter.length === 0}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-zinc-300 transition hover:bg-white/5 disabled:opacity-30"
                >
                  <i className="fa-solid fa-arrow-rotate-left w-4 text-zinc-500" />
                  Reset round
                </button>

                <div className="my-1 h-px bg-white/10" />

                <button
                  type="button"
                  onClick={handleEndEncounter}
                  disabled={encounter.length === 0}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-30"
                >
                  <i className="fa-solid fa-flag-checkered w-4" />
                  End Encounter
                </button>
              </div>
            ) : null}
          </div>

          <div className="text-[10px] uppercase tracking-wider text-zinc-600">
            {encounter.length}{" "}
            {encounter.length === 1 ? "combatant" : "combatants"}
          </div>
        </div>
      </div>

      {/* Manage combatants */}

      {showManagePanel ? (
        <div className="workspace-no-drag shrink-0 border-b border-white/10 bg-zinc-900">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <div>
              <p className="text-xs font-semibold text-white">
                Manage Combatants
              </p>

              <p className="mt-0.5 text-[10px] text-zinc-500">
                Add or remove creatures from the current encounter.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowManagePanel(false)}
              title="Close"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/10 hover:text-white"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <div className="p-3">
            <div className="mb-3 flex rounded-lg border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => setManageMode("monster")}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  manageMode === "monster"
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Monsters
              </button>

              <button
                type="button"
                onClick={() => setManageMode("player")}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  manageMode === "player"
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Players
              </button>
            </div>

            {manageMode === "monster" ? (
              <>
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600" />

                  <input
                    value={monsterSearch}
                    onChange={(event) => setMonsterSearch(event.target.value)}
                    placeholder="Search monsters..."
                    className="w-full rounded-lg border border-white/10 bg-black/30 py-2 pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500/40"
                  />
                </div>

                <div className="workspace-scrollbar mt-2 max-h-52 overflow-y-auto rounded-lg border border-white/10 bg-black/20">
                  {monstersLoading ? (
                    <div className="p-4 text-center text-xs text-zinc-500">
                      Loading monsters...
                    </div>
                  ) : filteredMonsters.length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-500">
                      No monsters found.
                    </div>
                  ) : (
                    filteredMonsters.slice(0, 50).map((monster) => {
                      const count = encounter.filter(
                        (entry) =>
                          entry.entityKind === "monster" &&
                          entry.monsterSnapshot?.monsterId === monster.id,
                      ).length;

                      return (
                        <div
                          key={`${monster.source}:${monster.id}`}
                          className="flex items-center gap-2 border-b border-white/5 p-2 last:border-b-0"
                        >
                          <Avatar
                            name={monster.name}
                            src={monster.img}
                            size="sm"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-xs font-semibold text-white">
                                {monster.name}
                              </span>

                              {monster.source === "campaign" ? (
                                <span className="shrink-0 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase text-emerald-300">
                                  Campaign
                                </span>
                              ) : null}
                            </div>

                            <div className="mt-0.5 truncate text-[10px] text-zinc-500">
                              AC {monster.armorClass} · HP {monster.hp} · CR{" "}
                              {monster.challengeRating}
                            </div>
                          </div>

                          {count > 0 ? (
                            <span className="shrink-0 text-[10px] text-zinc-500">
                              ×{count}
                            </span>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => addMonsterToEncounter(monster)}
                            title={`Add ${monster.name}`}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-300 transition hover:bg-emerald-500/20"
                          >
                            <i className="fa-solid fa-plus" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              <div className="workspace-scrollbar max-h-56 overflow-y-auto rounded-lg border border-white/10 bg-black/20">
                {campaignCharactersLoading ? (
                  <div className="p-4 text-center text-xs text-zinc-500">
                    Loading players...
                  </div>
                ) : campaignCharacters.length === 0 ? (
                  <div className="p-4 text-center text-xs text-zinc-500">
                    No campaign characters found.
                  </div>
                ) : (
                  campaignCharacters.map((character) => {
                    const existing = getPlayerEncounterEntry(character);

                    const added = Boolean(existing);

                    return (
                      <button
                        key={character.id}
                        type="button"
                        onClick={() => togglePlayer(character)}
                        className={`flex w-full items-center gap-2 border-b border-white/5 p-2 text-left transition last:border-b-0 ${
                          added
                            ? "bg-emerald-500/[0.04] hover:bg-rose-500/[0.06]"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <Avatar
                          name={character.name}
                          src={character.imageUrl}
                          size="sm"
                        />

                        <div className="min-w-0 flex-1">
                          <div
                            className={`truncate text-xs font-semibold ${
                              added ? "text-zinc-400" : "text-white"
                            }`}
                          >
                            {character.name}
                          </div>

                          <div className="mt-0.5 text-[10px] text-zinc-600">
                            {added ? "In encounter" : "Not in encounter"}
                          </div>
                        </div>

                        {added ? (
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-[9px] font-medium uppercase tracking-wide text-emerald-400">
                              Added
                            </span>

                            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-xs text-rose-300">
                              <i className="fa-solid fa-minus" />
                            </span>
                          </div>
                        ) : (
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-300">
                            <i className="fa-solid fa-plus" />
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Combatants */}

      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
        {sortedEncounter.length === 0 ? (
          <div className="flex h-full min-h-40 items-center justify-center p-5 text-center">
            <div>
              <i className="fa-solid fa-swords text-3xl text-zinc-700" />

              <p className="mt-3 text-sm font-semibold text-zinc-300">
                No active encounter
              </p>

              {activeLocation ? (
                <p className="mt-1 text-xs text-emerald-300/70">
                  <i className="fa-solid fa-location-dot mr-1" />

                  {activeLocation.roomName}
                </p>
              ) : (
                <p className="mt-1 text-xs text-zinc-600">
                  Add players or monsters to begin.
                </p>
              )}

              <button
                type="button"
                onClick={() => setShowManagePanel(true)}
                className="mt-4 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400"
              >
                <i className="fa-solid fa-user-plus mr-1.5" />
                Manage Combatants
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {sortedEncounter.map((entry) => {
              const isActive = activeEntity?.id === entry.id;

              const monsterKey = getMonsterKeyForEntry(entry);

              const characterId = getCharacterIdForEntry(entry);

              const isMonsterSelected =
                entry.entityKind === "monster" &&
                monsterKey !== null &&
                selectedEntity?.type === "monster" &&
                selectedEntity.encounterEntryId === entry.id;

              const isCharacterSelected =
                entry.entityKind === "player" &&
                characterId !== null &&
                selectedCharacter?.encounterEntryId === entry.id;

              const isSelected = isMonsterSelected || isCharacterSelected;

              const isPlayer = entry.entityKind === "player";

              const hpPercent = Math.max(
                0,

                Math.min(
                  100,

                  (entry.currentHp / Math.max(1, entry.maxHp)) * 100,
                ),
              );

              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    if (entry.entityKind === "monster") {
                      selectEncounterMonster(entry, "manual");

                      return;
                    }

                    selectEncounterCharacter(entry, "manual");
                  }}
                  className={`group relative cursor-pointer px-2 py-2 transition ${
                    isSelected
                      ? isPlayer
                        ? "bg-emerald-500/[0.07] ring-1 ring-inset ring-emerald-400/25"
                        : "bg-sky-500/[0.08] ring-1 ring-inset ring-sky-400/30"
                      : isActive
                        ? "bg-amber-500/[0.08]"
                        : "hover:bg-white/[0.025]"
                  }`}
                >
                  {isActive ? (
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-amber-400" />
                  ) : null}

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={entry.initiative}
                      onChange={(event) => {
                        const value = event.target.value;

                        updateEntityInitiative(
                          entry.id,

                          value === "" ? "" : Number(value),
                        );
                      }}
                      onClick={(event) => event.stopPropagation()}
                      placeholder="—"
                      title="Initiative"
                      className="workspace-no-drag h-9 w-10 shrink-0 rounded-lg border border-white/10 bg-black/30 px-1 text-center text-xs font-bold text-white outline-none focus:border-amber-400/50"
                    />

                    <Avatar
                      name={entry.displayName}
                      src={getEntryImage(entry)}
                      size="sm"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`truncate text-xs font-semibold ${
                            isPlayer ? "text-emerald-300" : "text-amber-200"
                          }`}
                        >
                          {entry.displayName}
                        </span>

                        {isActive ? (
                          <span className="shrink-0 rounded-full bg-amber-400/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-amber-300">
                            Turn
                          </span>
                        ) : null}

                        {isCharacterSelected && !isActive ? (
                          <span className="shrink-0 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-emerald-300">
                            Inspecting
                          </span>
                        ) : null}

                        {isMonsterSelected && !isActive ? (
                          <span className="shrink-0 rounded-full bg-sky-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-sky-300">
                            Inspecting
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-zinc-500">
                        <span>AC {getEntryAc(entry)}</span>

                        <span>
                          HP {entry.currentHp}/{entry.maxHp}
                        </span>
                      </div>
                    </div>

                    <div
                      className="workspace-no-drag flex shrink-0 items-center gap-1"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => updateHp(entry, -1)}
                        title="-1 HP"
                        className="h-7 min-w-7 rounded-md border border-white/10 bg-black/20 px-1 text-xs text-rose-300 transition hover:bg-rose-500/10"
                      >
                        −
                      </button>

                      <input
                        type="number"
                        value={entry.currentHp}
                        onChange={(event) =>
                          setHp(entry, Number(event.target.value))
                        }
                        className="h-7 w-10 rounded-md border border-white/10 bg-black/30 px-1 text-center text-xs font-semibold text-white outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => updateHp(entry, 1)}
                        title="+1 HP"
                        className="h-7 min-w-7 rounded-md border border-white/10 bg-black/20 px-1 text-xs text-emerald-300 transition hover:bg-emerald-500/10"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => removeEntityFromEncounter(entry.id)}
                        title="Remove combatant"
                        className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 opacity-0 transition hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  </div>

                  <div className="ml-[84px] mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        hpPercent <= 25
                          ? "bg-rose-400"
                          : hpPercent <= 60
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                      }`}
                      style={{
                        width: `${hpPercent}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
