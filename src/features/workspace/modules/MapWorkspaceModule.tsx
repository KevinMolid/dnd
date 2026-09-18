import { useEffect, useMemo, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import MapCanvas, {
  type MapCanvasHandle,
} from "../../../components/maps/MapCanvas";

import { useEncounter } from "../../../context/EncounterContext";

import useMonsterLibrary from "../../../hooks/useMonsterLibrary";

import { updateCampaignMap } from "../../maps/mapService";

import { useCampaignMaps } from "../../maps/useCampaignMaps";

import type {
  CampaignMapRoom,
  EnvironmentEffect,
  MapMonster,
} from "../../maps/types";

import type { MonsterDefinition } from "../../../data/monsterCatalog";

import { useWorkspace } from "../WorkspaceContext";

import type { WorkspaceModuleRenderProps } from "../workspaceTypes";

import useCampaignPageData from "../../campaigns/hooks/useCampaignPageData";

import {
  getActiveCampaignCharacters,
  mapCharacterToEncounterPlayer,
} from "../../../utils/encounterPlayers";

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

const renderRichDescriptionHtml = (html: string) => {
  if (typeof DOMParser === "undefined") {
    return html;
  }

  const doc = new DOMParser().parseFromString(html, "text/html");

  doc
    .querySelectorAll<HTMLElement>('[data-note-accordion="true"]')
    .forEach((accordion) => {
      const details = doc.createElement("details");
      details.className =
        "group my-2 overflow-hidden rounded-lg border border-white/10 bg-black/20";

      if (accordion.getAttribute("data-open") !== "false") {
        details.setAttribute("open", "");
      }

      const summary = doc.createElement("summary");
      summary.className =
        "flex cursor-pointer list-none items-center gap-2 border-b border-white/[0.06] bg-white/[0.025] px-2.5 py-2 text-xs font-semibold text-zinc-200 [&::-webkit-details-marker]:hidden";
      summary.innerHTML = `<span class="text-[9px] text-zinc-500 transition-transform group-open:rotate-90">▶</span><span>${accordion.getAttribute("data-title") || "Section"}</span>`;

      const content = doc.createElement("div");
      content.className = "px-3 py-2";
      const sourceContent = accordion.querySelector(
        '[data-note-accordion-content="true"]',
      );
      content.innerHTML = sourceContent?.innerHTML ?? accordion.innerHTML;

      details.append(summary, content);
      accordion.replaceWith(details);
    });

  return doc.body.innerHTML;
};

const RichDescription = ({
  html,
  legacyParagraphs,
}: {
  html?: string;
  legacyParagraphs?: string[];
}) => {
  const renderedHtml = useMemo(
    () => (html?.trim() ? renderRichDescriptionHtml(html) : ""),
    [html],
  );

  if (renderedHtml) {
    return (
      <div
        className="rich-text-content text-xs leading-5 text-zinc-300 [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-white/15 [&_blockquote]:pl-3 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h3]:mb-1.5 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-zinc-100 [&_em]:italic [&_u]:underline [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    );
  }

  return renderParagraphs(legacyParagraphs);
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

const getEnvironmentLevelName = (effect: EnvironmentEffect, value: number) => {
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
    const nextIndex = Math.min(currentIndex + maxChange, targetIndex);

    return levels[nextIndex].value;
  }

  if (targetIndex < currentIndex) {
    const nextIndex = Math.max(currentIndex - maxChange, targetIndex);

    return levels[nextIndex].value;
  }

  return levels[currentIndex].value;
};

export default function MapWorkspaceModule({
  module,
  campaignId,
  editing,
  updateModule,
  removeModule,
}: WorkspaceModuleRenderProps) {
  const navigate = useNavigate();

  const mapCanvasRef = useRef<MapCanvasHandle | null>(null);

  const { maps, loading } = useCampaignMaps(campaignId);

  const { campaignCharacters } = useCampaignPageData(campaignId);

  const activeCharacters = useMemo(
    () => getActiveCampaignCharacters(campaignCharacters),
    [campaignCharacters],
  );

  const { allMonsters } = useMonsterLibrary(campaignId);

  const {
    loadEncounterTemplate,
    createNewEncounter,
    addMonsterToEncounter,
    addPlayerToEncounter,
  } = useEncounter();

  const {selectEntity, setActiveLocation } = useWorkspace();

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

  useEffect(() => {
    if (!selectedMap || (selectedMap.rooms?.length ?? 0) > 0) {
      return;
    }

    setActiveLocation({
      mapId: selectedMap.id,
      mapTitle: selectedMap.title,
      roomId: -1,
      roomName: selectedMap.title,
    });
  }, [selectedMap, setActiveLocation]);

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
    if (mapMonster.monsterKey) {
      const exactMatch = allMonsters.find(
        (monster) =>
          `${monster.source}:${monster.id}` === mapMonster.monsterKey,
      );

      if (exactMatch) {
        return exactMatch;
      }
    }

    return monstersByName.get(normalizeMonsterName(mapMonster.name)) ?? null;
  };

  const getResolvedPopulation = (mapMonsters?: MapMonster[]) => {
    return (mapMonsters ?? [])
      .map((mapMonster) => {
        const monster = getLinkedMonster(mapMonster);

        if (!monster) {
          return null;
        }

        return {
          mapMonster,

          monster: monster as MonsterDefinition,

          quantity: Math.max(1, mapMonster.count ?? 1),
        };
      })
      .filter(
        (
          value,
        ): value is {
          mapMonster: MapMonster;

          monster: MonsterDefinition;

          quantity: number;
        } => value !== null,
      );
  };

  useEffect(() => {
    if (!selectedMap || allMonsters.length === 0) {
      return;
    }

    let changed = false;

    const upgradeMonsters = (entries?: MapMonster[]) =>
      (entries ?? []).map((mapMonster) => {
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

    const upgradedOverviewMonsters = upgradeMonsters(selectedMap.monsters);

    const upgradedRooms = selectedMap.rooms.map((room) => ({
      ...room,
      monsters: upgradeMonsters(room.monsters),
    }));

    if (!changed) {
      return;
    }

    updateCampaignMap(campaignId, selectedMap.id, {
      rooms: upgradedRooms,
      monsters: upgradedOverviewMonsters,
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

    if (nextMap && (nextMap.rooms?.length ?? 0) === 0) {
      setActiveLocation({
        mapId: nextMap.id,
        mapTitle: nextMap.title,
        roomId: -1,
        roomName: nextMap.title,
      });
    }

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

    setActiveLocation({
      mapId: selectedMap.id,
      mapTitle: selectedMap.title,
      roomId: room.id,
      roomName: room.name,
    });

    /*
     * Do not change detailsExpanded here.
     *
     * If the information panel is open, keep it open
     * and simply show the newly selected area's data.
     */

    setEncounterStartedMessage(null);
  };

  const showOverview = () => {
    if (!selectedMap) {
      return;
    }

    if (selectedRoomId !== null) {
      updateModule(module.id, {
        config: {
          ...module.config,
          selectedRoomId: null,
        },
      });
    }

    setActiveLocation({
      mapId: selectedMap.id,
      mapTitle: selectedMap.title,
      roomId: -1,
      roomName: selectedMap.title,
    });

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
        Math.min(levels.length - 1, currentIndex + direction),
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
    if (!selectedMap) {
      return;
    }

    if (selectedRoom?.encounterTemplate) {
      loadEncounterTemplate(selectedRoom.encounterTemplate);

      activeCharacters.forEach((character) => {
        addPlayerToEncounter(mapCharacterToEncounterPlayer(character));
      });

      setActiveLocation({
        mapId: selectedMap.id,
        mapTitle: selectedMap.title,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
      });

      setEncounterStartedMessage(
        `Planned encounter loaded with ${
          activeCharacters.length
        } active player${activeCharacters.length === 1 ? "" : "s"}.`,
      );

      return;
    }

    const sourceMonsters = selectedRoom
      ? (selectedRoom.monsters ?? [])
      : (selectedMap.monsters ?? []);

    const population = getResolvedPopulation(sourceMonsters);

    if (population.length === 0) {
      setEncounterStartedMessage(
        selectedRoom
          ? "No linked monsters are available for this area."
          : "No linked monsters are available for this map.",
      );

      return;
    }

    createNewEncounter();

    activeCharacters.forEach((character) => {
      addPlayerToEncounter(mapCharacterToEncounterPlayer(character));
    });

    let totalMonsters = 0;

    population.forEach(({ monster, quantity }) => {
      for (let index = 0; index < quantity; index += 1) {
        addMonsterToEncounter(monster);
        totalMonsters += 1;
      }
    });

    if (selectedRoom) {
      setActiveLocation({
        mapId: selectedMap.id,
        mapTitle: selectedMap.title,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
      });
    } else {
      setActiveLocation({
        mapId: selectedMap.id,
        mapTitle: selectedMap.title,
        roomId: -1,
        roomName: selectedMap.title,
      });
    }

    const locationName = selectedRoom?.name ?? selectedMap.title;

    setEncounterStartedMessage(
      `${activeCharacters.length} player${
        activeCharacters.length === 1 ? "" : "s"
      } and ${totalMonsters} creature${
        totalMonsters === 1 ? "" : "s"
      } loaded from ${locationName}.`,
    );
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950/20 text-sm text-zinc-400">
        <div className="text-center">
          <i className="fa-solid fa-map mb-3 text-2xl text-emerald-400/40" />

          <div className="font-medium">Loading maps...</div>
        </div>
      </div>
    );
  }

  if (maps.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950/20 p-5 text-center">
        <div>
          <i className="fa-solid fa-map text-3xl text-zinc-600" />

          <p className="mt-3 text-sm font-semibold text-zinc-200">
            No campaign maps
          </p>

          <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-500">
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

  const currentPopulation = getResolvedPopulation(
    selectedRoom ? selectedRoom.monsters : selectedMap.monsters,
  );

  const currentMonsterCount = currentPopulation.reduce(
    (total, entry) => total + entry.quantity,
    0,
  );

  const canStartRoomEncounter =
    Boolean(selectedRoom?.encounterTemplate) || currentMonsterCount > 0;

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-zinc-950/20">
      {/* Integrated module header */}

      <div
        className={`workspace-drag-handle relative flex h-10 shrink-0 items-center gap-2 border-b border-white/10 bg-white/[0.025] px-2.5 ${
          editing ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <i className="fa-solid fa-map shrink-0 text-[11px] text-emerald-400" />

        {/* Map title / selector */}

        <div className="relative min-w-0 flex-[1.15]">
          <select
            value={selectedMap.id}
            onChange={(event) => selectMap(event.target.value)}
            title="Select map"
            aria-label="Select map"
            className="workspace-no-drag h-8 w-full min-w-0 appearance-none truncate border-0 bg-transparent py-0.5 pr-7 text-xs font-semibold text-zinc-100 outline-none transition hover:text-white"
          >
            {maps.map((map) => (
              <option
                key={map.id}
                value={map.id}
                className="bg-zinc-900 text-zinc-100"
              >
                {map.title}
              </option>
            ))}
          </select>

          <i className="fa-solid fa-chevron-down pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500" />
        </div>

        {roomStates.length > 0 ? (
          <>
            <div className="h-5 w-px shrink-0 bg-white/10" />

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
                aria-label="Select map area"
                className="workspace-no-drag h-8 w-full min-w-0 appearance-none truncate rounded-md border border-white/10 bg-white/5 py-0.5 pl-2.5 pr-7 text-xs font-semibold text-zinc-200 outline-none transition hover:bg-white/10 hover:text-white focus:border-emerald-500/40"
              >
                <option value="" className="bg-zinc-900">
                  Overview
                </option>

                {roomStates
                  .slice()
                  .sort((a, b) => a.id - b.id)
                  .map((room) => (
                    <option
                      key={room.id}
                      value={room.id}
                      className="bg-zinc-900"
                    >
                      {room.id}. {room.name}
                    </option>
                  ))}
              </select>

              <i className="fa-solid fa-chevron-down pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500" />
            </div>
          </>
        ) : null}

        {/* Environment */}

        {activeEffect ? (
          <button
            type="button"
            onClick={() => setEnvironmentOpen((current) => !current)}
            title={`${activeEffect.name} controls`}
            aria-label={`${activeEffect.name} controls`}
            className={`workspace-no-drag flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2 transition ${
              environmentOpen
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <i className="fa-solid fa-cloud text-[10px]" />

            <span className="hidden max-w-28 truncate text-[10px] font-semibold xl:inline">
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
          aria-label="Open full map viewer"
          className="workspace-no-drag flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-up-right-from-square text-[11px]" />
        </button>

        {/* Remove module */}

        {editing ? (
          <>
            <div className="h-5 w-px shrink-0 bg-white/10" />

            <button
              type="button"
              onClick={() => removeModule(module.id)}
              title="Remove module"
              aria-label="Remove map module"
              className="workspace-no-drag flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <i className="fa-solid fa-xmark text-xs" />
            </button>
          </>
        ) : null}

        {/* Environment popup */}

        {environmentOpen && activeEffect ? (
          <div className="workspace-no-drag absolute right-2 top-9 z-50 flex max-h-[min(520px,75vh)] w-[min(390px,calc(100%-16px))] flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
            <div className="shrink-0 border-b border-white/10 p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                  <i className="fa-solid fa-cloud" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300/80">
                    Environment
                  </div>

                  <div className="truncate text-sm font-bold text-white">
                    {activeEffect.name}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEnvironmentOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white"
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
                    <div className="truncate text-[11px] text-zinc-400">
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
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10 disabled:opacity-25"
                        >
                          −
                        </button>

                        <div className="min-w-7 text-center text-sm font-bold text-white">
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
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10 disabled:opacity-25"
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
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/10 disabled:opacity-40"
                >
                  <i className="fa-solid fa-shuffle mr-1.5" />
                  Randomize
                </button>
              </div>

              <p className="mt-2 text-[10px] leading-4 text-zinc-500">
                Roll moves each area at most {activeEffect.maxChangePerRoll}{" "}
                level
                {activeEffect.maxChangePerRoll === 1 ? "" : "s"} toward its
                rolled target. Randomize sets the rolled target directly.
              </p>

              {environmentError ? (
                <div className="mt-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-2 text-[11px] text-rose-300">
                  {environmentError}
                </div>
              ) : null}
            </div>

            <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
              <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
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
                            ? "border-emerald-500/25 bg-emerald-500/[0.07]"
                            : "border-white/5 bg-black/10"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => selectRoom(room.id)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="truncate text-xs font-semibold text-zinc-200">
                            {room.id}. {room.name}
                          </div>

                          <div className="mt-0.5 truncate text-[10px] font-medium text-emerald-300/80">
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
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-xs text-zinc-300 hover:bg-white/10 disabled:opacity-20"
                        >
                          −
                        </button>

                        <div className="w-5 shrink-0 text-center text-xs font-bold text-zinc-200">
                          {currentValue}
                        </div>

                        <button
                          type="button"
                          disabled={
                            currentIndex >= levels.length - 1 ||
                            isEnvironmentSaving
                          }
                          onClick={() => changeRoomEnvironmentLevel(room.id, 1)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-xs text-zinc-300 hover:bg-white/10 disabled:opacity-20"
                        >
                          +
                        </button>
                      </div>
                    );
                  })}
              </div>

              {lastRollResults.length > 0 ? (
                <div className="mt-4 border-t border-white/10 pt-3">
                  <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
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
                            <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-zinc-200">
                              {result.roomId}. {result.roomName}
                            </span>

                            <span className="shrink-0 text-[10px] font-bold text-emerald-300">
                              d{activeEffect.diceSides}: {result.roll}
                            </span>
                          </div>

                          <div className="mt-1 text-[10px] text-zinc-400">
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
                            <div className="mt-0.5 text-[9px] text-zinc-500">
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

      {/* Map / information view */}
      <div className="workspace-no-drag relative min-h-0 flex-1 overflow-hidden bg-zinc-950">
        {!detailsExpanded ? (
          <>
            <MapCanvas
              ref={mapCanvasRef}
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
              className="h-full w-full"
            />

            <button
              type="button"
              onClick={() => setDetailsExpanded(true)}
              className="absolute inset-x-0 bottom-0 flex h-9 items-center gap-2 border-t border-white/10 bg-zinc-950/95 px-2.5 text-left backdrop-blur transition hover:bg-zinc-900/95"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center text-emerald-300">
                <i className="fa-solid fa-thumbtack text-[10px]" />
              </div>

              <div className="min-w-0 flex-1 truncate text-xs font-bold text-zinc-100">
                {selectedRoom
                  ? `${selectedRoom.id}. ${selectedRoom.name}`
                  : selectedMap.title}
              </div>

              {selectedRoomEnvironmentName ? (
                <span className="shrink-0 rounded border border-sky-500/20 bg-sky-500/[0.08] px-1.5 py-0.5 text-[9px] font-semibold text-sky-300">
                  {selectedRoomEnvironmentName}
                </span>
              ) : null}

              <i className="fa-solid fa-chevron-up shrink-0 text-[9px] text-zinc-500" />
            </button>
          </>
        ) : (
          <div className="flex h-full min-h-0 flex-col bg-zinc-950">
            <div className="flex h-9 shrink-0 items-center border-b border-white/10">
              <button
                type="button"
                onClick={() => setDetailsExpanded(false)}
                className="group flex h-full min-w-0 flex-1 items-center gap-2 px-2.5 text-left transition hover:bg-white/[0.025]"
                aria-label="Collapse area information"
                title="Collapse area information"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-emerald-300">
                  <i className="fa-solid fa-thumbtack text-[10px]" />
                </div>

                <div className="min-w-0 flex-1 truncate text-xs font-bold text-zinc-100">
                  {selectedRoom
                    ? `${selectedRoom.id}. ${selectedRoom.name}`
                    : selectedMap.title}
                </div>

                {selectedRoomEnvironmentName ? (
                  <span className="shrink-0 rounded border border-sky-500/20 bg-sky-500/[0.08] px-1.5 py-0.5 text-[9px] font-semibold text-sky-300">
                    {selectedRoomEnvironmentName}
                  </span>
                ) : null}

                <i className="fa-solid fa-chevron-down shrink-0 text-[9px] text-zinc-500" />
              </button>

              {canStartRoomEncounter ? (
                <button
                  type="button"
                  onClick={startRoomEncounter}
                  className="mr-2 inline-flex shrink-0 items-center gap-1 rounded border border-rose-500/20 bg-rose-500/[0.08] px-1.5 py-0.5 text-[9px] font-semibold text-rose-200 transition hover:bg-rose-500/[0.14]"
                >
                  <i className="fa-solid fa-play text-[8px]" />
                  Start Encounter
                </button>
              ) : null}
            </div>

            <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
            {selectedRoom ? (
              <div className="space-y-4">

                {encounterStartedMessage ? (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-2 text-xs text-emerald-300">
                    <i className="fa-solid fa-check mr-1.5" />

                    {encounterStartedMessage}
                  </div>
                ) : null}

                {selectedRoom.descriptionHtml?.trim() ||
                selectedRoom.description?.length ? (
                  <section>
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                      Description
                    </div>

                    <RichDescription
                      html={selectedRoom.descriptionHtml}
                      legacyParagraphs={selectedRoom.description}
                    />
                  </section>
                ) : null}

                {selectedRoom.monsters?.length ? (
                  <section>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        Creatures
                      </div>

                      <div className="text-[10px] text-zinc-500">
                        Click to inspect
                      </div>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-1.5">
                      {selectedRoom.monsters.map((monster, index) => {
                        const linkedMonster = getLinkedMonster(monster);

                        if (!linkedMonster) {
                          return (
                            <div
                              key={`${monster.name}-${index}`}
                              className="rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2"
                            >
                              <div className="flex items-center gap-2">
                                <div className="min-w-0 flex-1 text-xs font-semibold text-zinc-300">
                                  {monster.count ? `${monster.count}× ` : ""}

                                  {monster.name}
                                </div>

                                <i className="fa-solid fa-link-slash shrink-0 text-[10px] text-zinc-600" />
                              </div>

                              {monster.notes ? (
                                <div className="mt-1 text-[11px] leading-4 text-zinc-400">
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
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/30">
                              {linkedMonster.img ? (
                                <img
                                  src={linkedMonster.img}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <i className="fa-solid fa-dragon text-xs text-amber-300/50" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs font-semibold text-amber-200">
                                {monster.count ? `${monster.count}× ` : ""}

                                {monster.name}
                              </div>

                              <div className="mt-0.5 text-[10px] text-zinc-500">
                                CR {linkedMonster.challengeRating} · AC{" "}
                                {linkedMonster.armorClass} · HP{" "}
                                {linkedMonster.hp}
                              </div>

                              {monster.disposition ? (
                                <div className="mt-0.5 text-[10px] font-medium capitalize text-zinc-400">
                                  {monster.disposition}
                                </div>
                              ) : null}

                              {monster.notes ? (
                                <div className="mt-1 text-[11px] leading-4 text-zinc-400">
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
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                      Developments
                    </div>

                    {renderParagraphs(selectedRoom.developments)}
                  </section>
                ) : null}

                {selectedRoom.captives?.length ? (
                  <section>
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                      Captives
                    </div>

                    {renderParagraphs(selectedRoom.captives)}
                  </section>
                ) : null}

                {selectedRoom.treasure?.length ? (
                  <section>
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                      Treasure
                    </div>

                    <ul className="space-y-1 text-xs leading-5 text-zinc-300">
                      {selectedRoom.treasure.map((treasure, index) => (
                        <li
                          key={treasure.itemKey ?? `${treasure.name}-${index}`}
                          className="flex gap-2"
                        >
                          <span className="text-amber-400">•</span>

                          <span>
                            {(treasure.count ?? 1) > 1
                              ? `${treasure.count}× `
                              : ""}
                            {treasure.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {selectedRoom.experience ? (
                  <section>
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                      Experience
                    </div>

                    <p className="text-xs leading-5 text-zinc-300">
                      {selectedRoom.experience}
                    </p>
                  </section>
                ) : null}

                {selectedRoom.notes?.length ? (
                  <section>
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-violet-300/80">
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


                {selectedRoom.exits?.length ? (
                  <section>
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
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
                            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-200 transition hover:bg-white/10 hover:text-white"
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
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300/80">
                    Map Overview
                  </div>

                  <div className="flex items-center gap-2">
                    <h3 className="mt-0.5 text-base font-bold text-white">
                      {selectedMap.title}
                    </h3>

                  </div>
                </div>

                {selectedMap.descriptionHtml?.trim() ||
                mapDescription.length ? (
                  <section>
                    <RichDescription
                      html={selectedMap.descriptionHtml}
                      legacyParagraphs={mapDescription}
                    />
                  </section>
                ) : (
                  <p className="text-xs text-zinc-500">
                    No general description has been added to this map.
                  </p>
                )}

                {selectedMap.monsters?.length ? (
                  <section>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        Creatures
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Click to inspect
                      </div>
                    </div>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-1.5">
                      {selectedMap.monsters.map((monster, index) => {
                        const linkedMonster = getLinkedMonster(monster);

                        if (!linkedMonster) {
                          return (
                            <div
                              key={`${monster.name}-${index}`}
                              className="rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2"
                            >
                              <div className="flex items-center gap-2">
                                <div className="min-w-0 flex-1 text-xs font-semibold text-zinc-300">
                                  {monster.count ? `${monster.count}× ` : ""}
                                  {monster.name}
                                </div>
                                <i className="fa-solid fa-link-slash shrink-0 text-[10px] text-zinc-600" />
                              </div>

                              {monster.notes ? (
                                <div className="mt-1 text-[11px] leading-4 text-zinc-400">
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
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/30">
                              {linkedMonster.img ? (
                                <img
                                  src={linkedMonster.img}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <i className="fa-solid fa-dragon text-xs text-amber-300/50" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs font-semibold text-amber-200">
                                {monster.count ? `${monster.count}× ` : ""}
                                {monster.name}
                              </div>
                              <div className="mt-0.5 text-[10px] text-zinc-500">
                                CR {linkedMonster.challengeRating} · AC{" "}
                                {linkedMonster.armorClass} · HP{" "}
                                {linkedMonster.hp}
                              </div>

                              {monster.disposition ? (
                                <div className="mt-0.5 text-[10px] font-medium capitalize text-zinc-400">
                                  {monster.disposition}
                                </div>
                              ) : null}

                              {monster.notes ? (
                                <div className="mt-1 text-[11px] leading-4 text-zinc-400">
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


                {roomStates.length ? (
                  <section>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
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
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-zinc-200">
                                {room.id}
                              </span>

                              <div className="min-w-0 flex-1">
                                <div className="truncate text-xs font-semibold text-zinc-200">
                                  {room.name}
                                </div>

                                {environmentName ? (
                                  <div className="truncate text-[10px] font-medium text-emerald-300/80">
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
          </div>
        )}
      </div>

    </div>
  );
}
