import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import MapCanvas from "../../../components/maps/MapCanvas";

import { useEncounter } from "../../../context/EncounterContext";

import useMonsterLibrary from "../../../hooks/useMonsterLibrary";

import { updateCampaignMap } from "../../maps/mapService";

import { useCampaignMaps } from "../../maps/useCampaignMaps";

import type {
  CampaignMapRoom,
  EnvironmentEffect,
  MapMonster,
} from "../../maps/types";

import { useWorkspace } from "../WorkspaceContext";

import type { WorkspaceModuleRenderProps } from "../workspaceTypes";

type EnvironmentRollResult = {
  roomId: number;

  roomName: string;

  roll: number;

  previousLevel: number;

  targetLevel: number;

  nextLevel: number;
};

const renderParagraphs = (paragraphs?: string[]) => {
  if (!paragraphs || paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 text-xs leading-5 text-zinc-300">
      {paragraphs.map((paragraph, index) => (
        <p key={`${paragraph}-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
};

const getRoomSummary = (room: CampaignMapRoom) => {
  const parts: string[] = [];

  if (room.monsters?.length) {
    const monsterCount = room.monsters.reduce(
      (total, monster) => total + Math.max(1, monster.count ?? 1),
      0,
    );

    parts.push(
      `${monsterCount} ${monsterCount === 1 ? "monster" : "monsters"}`,
    );
  }

  if (room.treasure?.length) {
    parts.push(`${room.treasure.length} treasure`);
  }

  if (room.encounterTemplate) {
    parts.push("encounter");
  }

  return parts.join(" · ");
};

const normalizeMonsterName = (value: string) => {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
};

const getSortedLevels = (effect: EnvironmentEffect) => {
  return [...effect.levels].sort((a, b) => a.value - b.value);
};

const getDefaultEnvironmentLevel = (effect: EnvironmentEffect) => {
  const levels = getSortedLevels(effect);

  return levels[0]?.value ?? 0;
};

const getEnvironmentLevelName = (
  effect: EnvironmentEffect,

  value: number,
) => {
  return (
    effect.levels.find((level) => level.value === value)?.name ??
    `Level ${value}`
  );
};

const getRoomEnvironmentLevel = (
  room: CampaignMapRoom,

  effect: EnvironmentEffect,
) => {
  return room.environment?.[effect.id] ?? getDefaultEnvironmentLevel(effect);
};

const moveTowardsTarget = (
  effect: EnvironmentEffect,

  currentValue: number,

  targetValue: number,
) => {
  const levels = getSortedLevels(effect);

  if (levels.length === 0) {
    return currentValue;
  }

  let currentIndex = levels.findIndex((level) => level.value === currentValue);

  let targetIndex = levels.findIndex((level) => level.value === targetValue);

  if (currentIndex < 0) {
    currentIndex = 0;
  }

  if (targetIndex < 0) {
    targetIndex = currentIndex;
  }

  const maxChange = Math.max(0, effect.maxChangePerRoll);

  if (targetIndex > currentIndex) {
    const nextIndex = Math.min(
      currentIndex + maxChange,

      targetIndex,
    );

    return levels[nextIndex].value;
  }

  if (targetIndex < currentIndex) {
    const nextIndex = Math.max(
      currentIndex - maxChange,

      targetIndex,
    );

    return levels[nextIndex].value;
  }

  return levels[currentIndex].value;
};

export default function MapWorkspaceModule({
  module,
  campaignId,
  updateModule,
}: WorkspaceModuleRenderProps) {
  const navigate = useNavigate();

  const { maps, loading } = useCampaignMaps(campaignId);

  const { allMonsters } = useMonsterLibrary(campaignId);

  const { loadEncounterTemplate } = useEncounter();

  const {
    activeLocation,

    selectEntity,

    setActiveLocation,
  } = useWorkspace();

  const [hoveredRoomId, setHoveredRoomId] = useState<number | null>(null);

  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const [environmentOpen, setEnvironmentOpen] = useState(false);

  const [roomStates, setRoomStates] = useState<CampaignMapRoom[]>([]);

  const [isEnvironmentSaving, setIsEnvironmentSaving] = useState(false);

  const [environmentError, setEnvironmentError] = useState<string | null>(null);

  const [lastRollResults, setLastRollResults] = useState<
    EnvironmentRollResult[]
  >([]);

  const [encounterStartedMessage, setEncounterStartedMessage] = useState<
    string | null
  >(null);

  const selectedMap = useMemo(() => {
    if (maps.length === 0) {
      return null;
    }

    const configuredMapId = module.config?.mapId;

    if (configuredMapId) {
      const match = maps.find((map) => map.id === configuredMapId);

      if (match) {
        return match;
      }
    }

    return maps[0];
  }, [maps, module.config?.mapId]);

  useEffect(() => {
    if (!selectedMap) {
      setRoomStates([]);

      return;
    }

    setRoomStates(selectedMap.rooms ?? []);
  }, [selectedMap]);

  const selectedRoomId = module.config?.selectedRoomId ?? null;

  const selectedRoom = useMemo(() => {
    if (selectedRoomId === null) {
      return null;
    }

    return roomStates.find((room) => room.id === selectedRoomId) ?? null;
  }, [roomStates, selectedRoomId]);

  const environmentEffects = selectedMap?.environmentEffects ?? [];

  const activeEffect = useMemo(() => {
    if (environmentEffects.length === 0) {
      return null;
    }

    const configuredId = module.config?.mapEnvironmentEffectId;

    if (configuredId) {
      const configured = environmentEffects.find(
        (effect) => effect.id === configuredId,
      );

      if (configured) {
        return configured;
      }
    }

    return environmentEffects[0] ?? null;
  }, [environmentEffects, module.config?.mapEnvironmentEffectId]);

  useEffect(() => {
    if (!activeEffect) {
      return;
    }

    if (module.config?.mapEnvironmentEffectId === activeEffect.id) {
      return;
    }

    updateModule(module.id, {
      config: {
        ...module.config,

        mapEnvironmentEffectId: activeEffect.id,
      },
    });
  }, [activeEffect, module.id, module.config, updateModule]);

  const selectedRoomEnvironmentLevel =
    selectedRoom && activeEffect
      ? getRoomEnvironmentLevel(selectedRoom, activeEffect)
      : null;

  const selectedRoomEnvironmentName =
    activeEffect && selectedRoomEnvironmentLevel !== null
      ? getEnvironmentLevelName(activeEffect, selectedRoomEnvironmentLevel)
      : null;

  const monstersByName = useMemo(() => {
    const monsterMap = new Map<string, (typeof allMonsters)[number]>();

    /*
     * Prefer campaign-specific monsters when
     * two monsters share the same visible name.
     */
    const sorted = [...allMonsters].sort((a, b) => {
      if (a.source === "campaign" && b.source !== "campaign") {
        return -1;
      }

      if (b.source === "campaign" && a.source !== "campaign") {
        return 1;
      }

      return 0;
    });

    sorted.forEach((monster) => {
      const key = normalizeMonsterName(monster.name);

      if (!monsterMap.has(key)) {
        monsterMap.set(key, monster);
      }
    });

    return monsterMap;
  }, [allMonsters]);

  const getLinkedMonster = (mapMonster: MapMonster) => {
    /*
     * Prefer the stable reference.
     */
    if (mapMonster.monsterKey) {
      const exactMatch = allMonsters.find(
        (monster) =>
          `${monster.source}:${monster.id}` === mapMonster.monsterKey,
      );

      if (exactMatch) {
        return exactMatch;
      }
    }

    /*
     * Backward compatibility for older maps.
     */
    return monstersByName.get(normalizeMonsterName(mapMonster.name)) ?? null;
  };

  /*
   * Backfill stable monster keys onto older map
   * entries when the name can be resolved.
   */
  useEffect(() => {
    if (!selectedMap || allMonsters.length === 0) {
      return;
    }

    let changed = false;

    const upgradedRooms = selectedMap.rooms.map((room) => {
      if (!room.monsters?.length) {
        return room;
      }

      const upgradedMonsters = room.monsters.map((mapMonster) => {
        if (mapMonster.monsterKey) {
          return mapMonster;
        }

        const linkedMonster = monstersByName.get(
          normalizeMonsterName(mapMonster.name),
        );

        if (!linkedMonster) {
          return mapMonster;
        }

        changed = true;

        return {
          ...mapMonster,

          monsterKey: `${linkedMonster.source}:${linkedMonster.id}`,
        };
      });

      return {
        ...room,

        monsters: upgradedMonsters,
      };
    });

    if (!changed) {
      return;
    }

    updateCampaignMap(campaignId, selectedMap.id, {
      rooms: upgradedRooms,
    }).catch((error) => {
      console.error("Failed to upgrade map monster references:", error);
    });
  }, [selectedMap, allMonsters, monstersByName, campaignId]);

  useEffect(() => {
    if (loading || maps.length === 0) {
      return;
    }

    const currentMapId = module.config?.mapId;

    const currentMapExists = currentMapId
      ? maps.some((map) => map.id === currentMapId)
      : false;

    if (currentMapExists) {
      return;
    }

    updateModule(module.id, {
      config: {
        ...module.config,

        mapId: maps[0].id,

        selectedRoomId: null,

        mapEnvironmentEffectId: maps[0].environmentEffects?.[0]?.id,
      },
    });
  }, [loading, maps, module.id, module.config, updateModule]);

  useEffect(() => {
    if (!selectedMap || selectedRoomId === null) {
      return;
    }

    const roomStillExists = roomStates.some(
      (room) => room.id === selectedRoomId,
    );

    if (roomStillExists) {
      return;
    }

    updateModule(module.id, {
      config: {
        ...module.config,

        selectedRoomId: null,
      },
    });

    setDetailsExpanded(false);
  }, [
    selectedMap,
    selectedRoomId,
    roomStates,
    module.id,
    module.config,
    updateModule,
  ]);

  const selectMap = (mapId: string) => {
    const nextMap = maps.find((map) => map.id === mapId);

    updateModule(module.id, {
      config: {
        ...module.config,

        mapId,

        selectedRoomId: null,

        mapEnvironmentEffectId: nextMap?.environmentEffects?.[0]?.id,
      },
    });

    /*
     * Deliberately do NOT clear activeLocation.
     *
     * Viewing another map does not necessarily
     * mean the party physically moved.
     */

    setHoveredRoomId(null);

    setDetailsExpanded(false);

    setEnvironmentOpen(false);

    setLastRollResults([]);

    setEnvironmentError(null);

    setEncounterStartedMessage(null);
  };

  const selectRoom = (roomId: number) => {
    if (!selectedMap) {
      return;
    }

    const room = roomStates.find((candidate) => candidate.id === roomId);

    if (!room) {
      return;
    }

    updateModule(module.id, {
      config: {
        ...module.config,

        selectedRoomId: roomId,
      },
    });

    /*
     * Explicit room selection means:
     * this is now the party's active location.
     */
    setActiveLocation({
      mapId: selectedMap.id,

      mapTitle: selectedMap.title,

      roomId: room.id,

      roomName: room.name,
    });

    setDetailsExpanded(false);

    setEncounterStartedMessage(null);
  };

  const showOverview = () => {
    if (selectedRoomId !== null) {
      updateModule(module.id, {
        config: {
          ...module.config,

          selectedRoomId: null,
        },
      });
    }

    /*
     * Deliberately do NOT clear activeLocation.
     *
     * Overview is a viewing state,
     * not a declaration that the party moved.
     */

    setDetailsExpanded(false);

    setEncounterStartedMessage(null);
  };

  const saveEnvironmentRooms = async (
    nextRooms: CampaignMapRoom[],

    previousRooms: CampaignMapRoom[],
  ) => {
    if (!selectedMap) {
      return;
    }

    setRoomStates(nextRooms);

    try {
      setIsEnvironmentSaving(true);

      setEnvironmentError(null);

      await updateCampaignMap(campaignId, selectedMap.id, {
        rooms: nextRooms,
      });
    } catch (error) {
      console.error("Failed to save environment:", error);

      setRoomStates(previousRooms);

      setEnvironmentError("Failed to save environment changes.");
    } finally {
      setIsEnvironmentSaving(false);
    }
  };

  const changeRoomEnvironmentLevel = async (
    roomId: number,

    direction: -1 | 1,
  ) => {
    if (!activeEffect || isEnvironmentSaving) {
      return;
    }

    const levels = getSortedLevels(activeEffect);

    if (levels.length === 0) {
      return;
    }

    const previousRooms = roomStates;

    const nextRooms = roomStates.map((room) => {
      if (room.id !== roomId) {
        return room;
      }

      const current = getRoomEnvironmentLevel(room, activeEffect);

      let currentIndex = levels.findIndex((level) => level.value === current);

      if (currentIndex < 0) {
        currentIndex = 0;
      }

      const nextIndex = Math.max(
        0,

        Math.min(
          levels.length - 1,

          currentIndex + direction,
        ),
      );

      const nextValue = levels[nextIndex].value;

      return {
        ...room,

        environment: {
          ...(room.environment ?? {}),

          [activeEffect.id]: nextValue,
        },
      };
    });

    await saveEnvironmentRooms(nextRooms, previousRooms);

    setLastRollResults([]);
  };

  const randomizeEnvironmentForAllAreas = async () => {
    if (!activeEffect || isEnvironmentSaving) {
      return;
    }

    const previousRooms = roomStates;

    const results: EnvironmentRollResult[] = [];

    const nextRooms = roomStates.map((room) => {
      const currentLevel = getRoomEnvironmentLevel(room, activeEffect);

      const roll = Math.floor(Math.random() * activeEffect.diceSides) + 1;

      const matchingRange = activeEffect.rollRanges.find(
        (range) => roll >= range.min && roll <= range.max,
      );

      const targetLevel = matchingRange?.targetLevel ?? currentLevel;

      const nextLevel = targetLevel;

      results.push({
        roomId: room.id,

        roomName: room.name,

        roll,

        previousLevel: currentLevel,

        targetLevel,

        nextLevel,
      });

      return {
        ...room,

        environment: {
          ...(room.environment ?? {}),

          [activeEffect.id]: nextLevel,
        },
      };
    });

    await saveEnvironmentRooms(nextRooms, previousRooms);

    setLastRollResults(results);
  };

  const rollEnvironmentForAllAreas = async () => {
    if (!activeEffect || isEnvironmentSaving) {
      return;
    }

    const previousRooms = roomStates;

    const results: EnvironmentRollResult[] = [];

    const nextRooms = roomStates.map((room) => {
      const currentLevel = getRoomEnvironmentLevel(room, activeEffect);

      const roll = Math.floor(Math.random() * activeEffect.diceSides) + 1;

      const matchingRange = activeEffect.rollRanges.find(
        (range) => roll >= range.min && roll <= range.max,
      );

      const targetLevel = matchingRange?.targetLevel ?? currentLevel;

      const nextLevel = moveTowardsTarget(
        activeEffect,
        currentLevel,
        targetLevel,
      );

      results.push({
        roomId: room.id,

        roomName: room.name,

        roll,

        previousLevel: currentLevel,

        targetLevel,

        nextLevel,
      });

      return {
        ...room,

        environment: {
          ...(room.environment ?? {}),

          [activeEffect.id]: nextLevel,
        },
      };
    });

    await saveEnvironmentRooms(nextRooms, previousRooms);

    setLastRollResults(results);
  };

  const selectEnvironmentEffect = (effectId: string) => {
    updateModule(module.id, {
      config: {
        ...module.config,

        mapEnvironmentEffectId: effectId,
      },
    });

    setLastRollResults([]);

    setEnvironmentError(null);
  };

  const inspectMonster = (mapMonster: MapMonster) => {
    const monster = getLinkedMonster(mapMonster);

    if (!monster) {
      return;
    }

    selectEntity({
      type: "monster",

      monsterKey: `${monster.source}:${monster.id}`,

      encounterStatus: "manual",
    });
  };

  const startRoomEncounter = () => {
    if (!selectedRoom?.encounterTemplate) {
      return;
    }

    loadEncounterTemplate(selectedRoom.encounterTemplate);

    if (selectedMap) {
      setActiveLocation({
        mapId: selectedMap.id,

        mapTitle: selectedMap.title,

        roomId: selectedRoom.id,

        roomName: selectedRoom.name,
      });
    }

    setEncounterStartedMessage(`Encounter loaded from ${selectedRoom.name}.`);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950/20 text-sm text-zinc-500">
        <div className="text-center">
          <i className="fa-solid fa-map mb-3 text-2xl text-emerald-400/30" />

          <div>Loading maps...</div>
        </div>
      </div>
    );
  }

  if (maps.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950/20 p-5 text-center">
        <div>
          <i className="fa-solid fa-map text-3xl text-zinc-700" />

          <p className="mt-3 text-sm font-semibold text-zinc-300">
            No campaign maps
          </p>

          <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-600">
            Create a map from the campaign Maps page and it will become
            available here automatically.
          </p>
        </div>
      </div>
    );
  }

  if (!selectedMap) {
    return null;
  }

  const mapDescription = selectedMap.generalDescription ?? [];

  const roomSummary = selectedRoom ? getRoomSummary(selectedRoom) : "";

  const isCurrentWorkspaceLocation =
    selectedRoom !== null &&
    activeLocation?.mapId === selectedMap.id &&
    activeLocation?.roomId === selectedRoom.id;

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-zinc-950/20">
      {/* Toolbar */}

      <div className="workspace-no-drag relative flex h-10 shrink-0 items-center gap-2 border-b border-white/10 bg-black/20 px-2">
        {/* Map selector */}

        <div className="relative min-w-0 flex-1">
          <i className="fa-solid fa-map pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400" />

          <select
            value={selectedMap.id}
            onChange={(event) => selectMap(event.target.value)}
            title="Select map"
            className="h-7 w-full min-w-0 appearance-none truncate rounded-lg border border-white/10 bg-white/5 py-1 pl-7 pr-7 text-xs font-semibold text-zinc-200 outline-none transition hover:bg-white/10 focus:border-emerald-500/30"
          >
            {maps.map((map) => (
              <option key={map.id} value={map.id} className="bg-zinc-900">
                {map.title}
              </option>
            ))}
          </select>

          <i className="fa-solid fa-chevron-down pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] text-zinc-600" />
        </div>

        {/* Area selector */}

        <div className="relative min-w-0 flex-1">
          <select
            value={selectedRoomId ?? ""}
            onChange={(event) => {
              const value = event.target.value;

              if (value === "") {
                showOverview();

                return;
              }

              selectRoom(Number(value));
            }}
            title="Select area"
            className="h-7 w-full min-w-0 appearance-none truncate rounded-lg border border-white/10 bg-white/5 py-1 pl-2.5 pr-7 text-xs text-zinc-400 outline-none transition hover:bg-white/10 focus:border-emerald-500/30"
          >
            <option value="" className="bg-zinc-900">
              Overview
            </option>

            {roomStates
              .slice()
              .sort((a, b) => a.id - b.id)
              .map((room) => (
                <option key={room.id} value={room.id} className="bg-zinc-900">
                  {room.id}. {room.name}
                </option>
              ))}
          </select>

          <i className="fa-solid fa-chevron-down pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] text-zinc-600" />
        </div>

        {/* Environment */}

        {activeEffect ? (
          <button
            type="button"
            onClick={() => setEnvironmentOpen((current) => !current)}
            title={`${activeEffect.name} controls`}
            className={`flex h-7 shrink-0 items-center gap-1.5 rounded-lg border px-2 transition ${
              environmentOpen
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <i className="fa-solid fa-cloud text-[10px]" />

            <span className="hidden max-w-24 truncate text-[9px] font-semibold xl:inline">
              {selectedRoomEnvironmentName ?? activeEffect.name}
            </span>
          </button>
        ) : null}

        {/* Open full viewer */}

        <button
          type="button"
          onClick={() =>
            navigate(`/campaigns/${campaignId}/maps/${selectedMap.id}`)
          }
          title="Open full map viewer"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-up-right-from-square text-[10px]" />
        </button>

        {/* Overview */}

        <button
          type="button"
          onClick={showOverview}
          disabled={selectedRoomId === null}
          title="Map overview"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:cursor-default disabled:opacity-25"
        >
          <i className="fa-solid fa-house text-[10px]" />
        </button>

        {/* Environment popup */}

        {environmentOpen && activeEffect ? (
          <div className="absolute right-2 top-9 z-50 flex max-h-[min(520px,75vh)] w-[min(390px,calc(100%-16px))] flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
            <div className="shrink-0 border-b border-white/10 p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                  <i className="fa-solid fa-cloud" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-400/70">
                    Environment
                  </div>

                  <div className="truncate text-sm font-bold text-white">
                    {activeEffect.name}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEnvironmentOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/10 hover:text-white"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              {environmentEffects.length > 1 ? (
                <select
                  value={activeEffect.id}
                  onChange={(event) =>
                    selectEnvironmentEffect(event.target.value)
                  }
                  className="mt-3 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none"
                >
                  {environmentEffects.map((effect) => (
                    <option
                      key={effect.id}
                      value={effect.id}
                      className="bg-zinc-900"
                    >
                      {effect.name}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>

            <div className="shrink-0 border-b border-white/10 p-3">
              {selectedRoom && selectedRoomEnvironmentLevel !== null ? (
                <div className="mb-3 flex items-center gap-3 rounded-lg border border-white/5 bg-black/20 p-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[10px] text-zinc-500">
                      {selectedRoom.id}. {selectedRoom.name}
                    </div>

                    <div className="mt-0.5 truncate text-xs font-semibold text-emerald-300">
                      {selectedRoomEnvironmentName}
                    </div>
                  </div>

                  {(() => {
                    const levels = getSortedLevels(activeEffect);

                    const currentIndex = levels.findIndex(
                      (level) => level.value === selectedRoomEnvironmentLevel,
                    );

                    return (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={currentIndex <= 0 || isEnvironmentSaving}
                          onClick={() =>
                            changeRoomEnvironmentLevel(selectedRoom.id, -1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 disabled:opacity-25"
                        >
                          −
                        </button>

                        <div className="min-w-7 text-center text-xs font-bold text-white">
                          {selectedRoomEnvironmentLevel}
                        </div>

                        <button
                          type="button"
                          disabled={
                            currentIndex < 0 ||
                            currentIndex >= levels.length - 1 ||
                            isEnvironmentSaving
                          }
                          onClick={() =>
                            changeRoomEnvironmentLevel(selectedRoom.id, 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 disabled:opacity-25"
                        >
                          +
                        </button>
                      </div>
                    );
                  })()}
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={rollEnvironmentForAllAreas}
                  disabled={isEnvironmentSaving || roomStates.length === 0}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-40"
                >
                  <i className="fa-solid fa-dice-d20 mr-1.5" />

                  {isEnvironmentSaving
                    ? "Saving..."
                    : `Roll d${activeEffect.diceSides}`}
                </button>

                <button
                  type="button"
                  onClick={randomizeEnvironmentForAllAreas}
                  disabled={isEnvironmentSaving || roomStates.length === 0}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 disabled:opacity-40"
                >
                  <i className="fa-solid fa-shuffle mr-1.5" />
                  Randomize
                </button>
              </div>

              <p className="mt-2 text-[9px] leading-4 text-zinc-600">
                Roll moves each area at most {activeEffect.maxChangePerRoll}{" "}
                level
                {activeEffect.maxChangePerRoll === 1 ? "" : "s"} toward its
                rolled target. Randomize sets the rolled target directly.
              </p>

              {environmentError ? (
                <div className="mt-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-2 text-[10px] text-rose-300">
                  {environmentError}
                </div>
              ) : null}
            </div>

            <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
              <div className="mb-2 px-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                Areas
              </div>

              <div className="space-y-1">
                {roomStates
                  .slice()
                  .sort((a, b) => a.id - b.id)
                  .map((room) => {
                    const levels = getSortedLevels(activeEffect);

                    const currentValue = getRoomEnvironmentLevel(
                      room,
                      activeEffect,
                    );

                    let currentIndex = levels.findIndex(
                      (level) => level.value === currentValue,
                    );

                    if (currentIndex < 0) {
                      currentIndex = 0;
                    }

                    return (
                      <div
                        key={room.id}
                        className={`flex items-center gap-2 rounded-lg border p-2 ${
                          selectedRoomId === room.id
                            ? "border-emerald-500/20 bg-emerald-500/[0.06]"
                            : "border-white/5 bg-black/10"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => selectRoom(room.id)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="truncate text-[10px] font-semibold text-zinc-300">
                            {room.id}. {room.name}
                          </div>

                          <div className="mt-0.5 truncate text-[9px] text-emerald-300/70">
                            {getEnvironmentLevelName(
                              activeEffect,
                              currentValue,
                            )}
                          </div>
                        </button>

                        <button
                          type="button"
                          disabled={currentIndex <= 0 || isEnvironmentSaving}
                          onClick={() =>
                            changeRoomEnvironmentLevel(room.id, -1)
                          }
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[10px] text-zinc-400 hover:bg-white/10 disabled:opacity-20"
                        >
                          −
                        </button>

                        <div className="w-5 shrink-0 text-center text-[10px] font-bold text-zinc-300">
                          {currentValue}
                        </div>

                        <button
                          type="button"
                          disabled={
                            currentIndex >= levels.length - 1 ||
                            isEnvironmentSaving
                          }
                          onClick={() => changeRoomEnvironmentLevel(room.id, 1)}
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[10px] text-zinc-400 hover:bg-white/10 disabled:opacity-20"
                        >
                          +
                        </button>
                      </div>
                    );
                  })}
              </div>

              {lastRollResults.length > 0 ? (
                <div className="mt-4 border-t border-white/10 pt-3">
                  <div className="mb-2 px-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                    Last Roll
                  </div>

                  <div className="space-y-1">
                    {lastRollResults.map((result) => {
                      const changed = result.previousLevel !== result.nextLevel;

                      return (
                        <button
                          key={result.roomId}
                          type="button"
                          onClick={() => selectRoom(result.roomId)}
                          className="w-full rounded-lg border border-white/5 bg-black/10 px-2.5 py-2 text-left transition hover:bg-white/5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-zinc-300">
                              {result.roomId}. {result.roomName}
                            </span>

                            <span className="shrink-0 text-[9px] font-bold text-emerald-300">
                              d{activeEffect.diceSides}: {result.roll}
                            </span>
                          </div>

                          <div className="mt-1 text-[9px] text-zinc-500">
                            {getEnvironmentLevelName(
                              activeEffect,
                              result.previousLevel,
                            )}
                            {" → "}
                            {getEnvironmentLevelName(
                              activeEffect,
                              result.nextLevel,
                            )}

                            {!changed && " (no change)"}
                          </div>

                          {result.targetLevel !== result.nextLevel ? (
                            <div className="mt-0.5 text-[8px] text-zinc-700">
                              Target:{" "}
                              {getEnvironmentLevelName(
                                activeEffect,
                                result.targetLevel,
                              )}
                            </div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Map */}

      <div className="min-h-0 flex-1">
        <MapCanvas
          map={selectedMap}
          rooms={roomStates}
          selectedRoomId={selectedRoomId}
          hoveredRoomId={hoveredRoomId}
          onSelectRoom={selectRoom}
          onShowOverview={showOverview}
          onHoverRoom={setHoveredRoomId}
          getRoomEnvironmentLabel={(room) => {
            if (!activeEffect) {
              return null;
            }

            return getEnvironmentLevelName(
              activeEffect,

              getRoomEnvironmentLevel(room, activeEffect),
            );
          }}
          className="h-full p-2"
        />
      </div>

      {/* Details */}

      <div className="workspace-no-drag shrink-0 border-t border-white/10 bg-zinc-950">
        <button
          type="button"
          onClick={() => setDetailsExpanded((current) => !current)}
          className="flex h-10 w-full items-center gap-2 px-3 text-left transition hover:bg-white/[0.03]"
        >
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
              selectedRoom
                ? "bg-emerald-500/10 text-emerald-300"
                : "bg-white/5 text-zinc-500"
            }`}
          >
            <i
              className={`fa-solid ${
                selectedRoom ? "fa-location-dot" : "fa-map"
              } text-[10px]`}
            />
          </div>

          <div className="min-w-0 flex-1">
            {selectedRoom ? (
              <>
                <div className="flex min-w-0 items-center gap-2">
                  <div className="truncate text-xs font-semibold text-zinc-200">
                    {selectedRoom.id}. {selectedRoom.name}
                  </div>

                  {isCurrentWorkspaceLocation ? (
                    <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-emerald-300">
                      Current
                    </span>
                  ) : null}

                  {selectedRoomEnvironmentName ? (
                    <span className="shrink-0 rounded-full border border-sky-500/15 bg-sky-500/[0.07] px-1.5 py-0.5 text-[8px] font-semibold text-sky-300">
                      {selectedRoomEnvironmentName}
                    </span>
                  ) : null}
                </div>

                {roomSummary ? (
                  <div className="truncate text-[9px] text-zinc-600">
                    {roomSummary}
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <div className="truncate text-xs font-semibold text-zinc-300">
                  {selectedMap.title}
                </div>

                <div className="truncate text-[9px] text-zinc-600">
                  Overview · {roomStates.length}{" "}
                  {roomStates.length === 1 ? "area" : "areas"}
                </div>
              </>
            )}
          </div>

          <span className="shrink-0 text-[9px] uppercase tracking-wider text-zinc-600">
            Details
          </span>

          <i
            className={`fa-solid fa-chevron-up shrink-0 text-[9px] text-zinc-600 transition-transform ${
              detailsExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {detailsExpanded ? (
          <div className="workspace-scrollbar max-h-64 overflow-y-auto border-t border-white/5 bg-black/20 p-3">
            {selectedRoom ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-400/70">
                      Area {selectedRoom.id}
                    </div>

                    {isCurrentWorkspaceLocation ? (
                      <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase text-emerald-300">
                        Active location
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-0.5 text-sm font-bold text-white">
                    {selectedRoom.name}
                  </h3>
                </div>

                {activeEffect && selectedRoomEnvironmentName ? (
                  <button
                    type="button"
                    onClick={() => setEnvironmentOpen(true)}
                    className="flex w-full items-center gap-3 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.05] p-2.5 text-left transition hover:bg-emerald-500/[0.09]"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-300">
                      <i className="fa-solid fa-cloud text-[10px]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] uppercase tracking-wide text-emerald-300/60">
                        {activeEffect.name}
                      </div>

                      <div className="truncate text-xs font-semibold text-white">
                        {selectedRoomEnvironmentName}
                      </div>
                    </div>

                    <i className="fa-solid fa-sliders text-[9px] text-zinc-600" />
                  </button>
                ) : null}

                {encounterStartedMessage ? (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-2 text-[11px] text-emerald-300">
                    <i className="fa-solid fa-check mr-1.5" />

                    {encounterStartedMessage}
                  </div>
                ) : null}

                {selectedRoom.readAloud ? (
                  <section>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                      Read aloud
                    </div>

                    <div className="whitespace-pre-wrap rounded-lg border border-amber-400/15 bg-amber-400/[0.06] p-2.5 text-xs leading-5 text-amber-50/90">
                      {selectedRoom.readAloud}
                    </div>
                  </section>
                ) : null}

                {selectedRoom.description?.length ? (
                  <section>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      Description
                    </div>

                    {renderParagraphs(selectedRoom.description)}
                  </section>
                ) : null}

                {selectedRoom.monsters?.length ? (
                  <section>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                        Monsters
                      </div>

                      <div className="text-[9px] text-zinc-700">
                        Click to inspect
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {selectedRoom.monsters.map((monster, index) => {
                        const linkedMonster = getLinkedMonster(monster);

                        if (!linkedMonster) {
                          return (
                            <div
                              key={`${monster.name}-${index}`}
                              className="rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2"
                            >
                              <div className="flex items-center gap-2">
                                <div className="min-w-0 flex-1 text-xs font-semibold text-zinc-400">
                                  {monster.count ? `${monster.count}× ` : ""}

                                  {monster.name}
                                </div>

                                <i className="fa-solid fa-link-slash shrink-0 text-[9px] text-zinc-700" />
                              </div>

                              {monster.notes ? (
                                <div className="mt-1 text-[10px] leading-4 text-zinc-500">
                                  {monster.notes}
                                </div>
                              ) : null}
                            </div>
                          );
                        }

                        return (
                          <button
                            key={`${monster.name}-${index}`}
                            type="button"
                            onClick={() => inspectMonster(monster)}
                            title={`Inspect ${linkedMonster.name}`}
                            className="group flex w-full items-start gap-2 rounded-lg border border-amber-500/10 bg-amber-500/[0.035] px-2.5 py-2 text-left transition hover:border-amber-500/25 hover:bg-amber-500/[0.08]"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/30">
                              {linkedMonster.img ? (
                                <img
                                  src={linkedMonster.img}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <i className="fa-solid fa-dragon text-[10px] text-amber-300/50" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs font-semibold text-amber-200">
                                {monster.count ? `${monster.count}× ` : ""}

                                {monster.name}
                              </div>

                              <div className="mt-0.5 text-[9px] text-zinc-600">
                                CR {linkedMonster.challengeRating} · AC{" "}
                                {linkedMonster.armorClass} · HP{" "}
                                {linkedMonster.hp}
                              </div>

                              {monster.notes ? (
                                <div className="mt-1 text-[10px] leading-4 text-zinc-500">
                                  {monster.notes}
                                </div>
                              ) : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {selectedRoom.developments?.length ? (
                  <section>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      Developments
                    </div>

                    {renderParagraphs(selectedRoom.developments)}
                  </section>
                ) : null}

                {selectedRoom.captives?.length ? (
                  <section>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      Captives
                    </div>

                    {renderParagraphs(selectedRoom.captives)}
                  </section>
                ) : null}

                {selectedRoom.treasure?.length ? (
                  <section>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      Treasure
                    </div>

                    <ul className="space-y-1 text-xs leading-5 text-zinc-300">
                      {selectedRoom.treasure.map((treasure, index) => (
                        <li key={`${treasure}-${index}`} className="flex gap-2">
                          <span className="text-amber-400">•</span>

                          <span>{treasure}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {selectedRoom.experience ? (
                  <section>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      Experience
                    </div>

                    <p className="text-xs leading-5 text-zinc-300">
                      {selectedRoom.experience}
                    </p>
                  </section>
                ) : null}

                {selectedRoom.notes?.length ? (
                  <section>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-violet-300/70">
                      DM Notes
                    </div>

                    <ul className="space-y-1 text-xs leading-5 text-zinc-300">
                      {selectedRoom.notes.map((note, index) => (
                        <li key={`${note}-${index}`} className="flex gap-2">
                          <span className="text-violet-400">•</span>

                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {selectedRoom.encounterTemplate ? (
                  <section className="rounded-xl border border-rose-500/15 bg-rose-500/[0.045] p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300">
                        <i className="fa-solid fa-swords text-xs" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white">
                          Area Encounter
                        </div>

                        <div className="mt-0.5 text-[10px] leading-4 text-zinc-500">
                          Load this encounter directly into the workspace
                          tracker.
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={startRoomEncounter}
                      className="mt-3 w-full rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
                    >
                      <i className="fa-solid fa-play mr-1.5" />
                      Start Encounter
                    </button>
                  </section>
                ) : null}

                {selectedRoom.exits?.length ? (
                  <section>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      Connected Areas
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {selectedRoom.exits.map((exitRoomId) => {
                        const exitRoom = roomStates.find(
                          (room) => room.id === exitRoomId,
                        );

                        return (
                          <button
                            key={exitRoomId}
                            type="button"
                            onClick={() => selectRoom(exitRoomId)}
                            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-zinc-300 transition hover:bg-white/10 hover:text-white"
                          >
                            {exitRoomId}

                            {exitRoom ? `. ${exitRoom.name}` : ""}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-400/70">
                    Map Overview
                  </div>

                  <h3 className="mt-0.5 text-sm font-bold text-white">
                    {selectedMap.title}
                  </h3>
                </div>

                {selectedMap.readAloud ? (
                  <section>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                      Read aloud
                    </div>

                    <div className="whitespace-pre-wrap rounded-lg border border-amber-400/15 bg-amber-400/[0.06] p-2.5 text-xs leading-5 text-amber-50/90">
                      {selectedMap.readAloud}
                    </div>
                  </section>
                ) : null}

                {mapDescription.length ? (
                  <section>{renderParagraphs(mapDescription)}</section>
                ) : (
                  <p className="text-xs text-zinc-600">
                    No general description has been added to this map.
                  </p>
                )}

                {roomStates.length ? (
                  <section>
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      Areas
                    </div>

                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {roomStates
                        .slice()
                        .sort((a, b) => a.id - b.id)
                        .map((room) => {
                          const environmentName = activeEffect
                            ? getEnvironmentLevelName(
                                activeEffect,

                                getRoomEnvironmentLevel(room, activeEffect),
                              )
                            : null;

                          return (
                            <button
                              key={room.id}
                              type="button"
                              onClick={() => selectRoom(room.id)}
                              className="flex min-w-0 items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2 text-left transition hover:bg-white/[0.07]"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] font-bold text-zinc-300">
                                {room.id}
                              </span>

                              <div className="min-w-0 flex-1">
                                <div className="truncate text-[11px] font-medium text-zinc-300">
                                  {room.name}
                                </div>

                                {environmentName ? (
                                  <div className="truncate text-[8px] text-emerald-300/60">
                                    {environmentName}
                                  </div>
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </section>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
