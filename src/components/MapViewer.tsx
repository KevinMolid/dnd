import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEncounter } from "../context/EncounterContext";
import { itemList, type ItemData } from "../data/items";
import type { Money, PlayerCharacter } from "../data/players";
import { updateCampaignMap } from "../features/maps/mapService";
import type {
  CampaignMap,
  CampaignMapRoom,
  EnvironmentEffect,
} from "../features/maps/types";

type MapViewerProps = {
  campaignId: string;
  map: CampaignMap | null;
  onClose: () => void;
  players: PlayerCharacter[];
  onGiveItemToPlayer: (itemId: string, playerName: string) => void;
  onGiveItemToParty: (itemId: string) => void;
  onGiveMoneyToPlayer: (playerName: string, money: Partial<Money>) => void;
  onGiveMoneyToParty: (money: Partial<Money>) => void;
};

type TreasureRecipient = "party" | string;

type LinkedTreasureEntry =
  | {
      key: string;
      text: string;
      type: "item";
      item: ItemData;
    }
  | {
      key: string;
      text: string;
      type: "money";
      money: Partial<Money>;
      moneyLabel: string;
    };

type ExtendedCampaignMap = CampaignMap & {
  description?: string[];
  overview?: string[];
  generalDescription?: string[];
  readAloud?: string;
  overviewTitle?: string;
};

type EnvironmentRollResult = {
  roomId: number;
  roomName: string;
  roll: number;
  previousLevel: number;
  targetLevel: number;
  nextLevel: number;
};

const normalizeItemText = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/^(en|et|ei|a|an|the)\s+/i, "")
    .replace(/[–—-]/g, " ")
    .replace(/[^\p{L}\p{N}\s+]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
};

const findLinkedItem = (treasureText: string): ItemData | null => {
  const normalizedTreasure = normalizeItemText(treasureText);

  return (
    itemList.find((item) => {
      const normalizedName = normalizeItemText(item.name);

      return (
        normalizedTreasure === normalizedName ||
        normalizedTreasure.includes(normalizedName) ||
        normalizedName.includes(normalizedTreasure)
      );
    }) ?? null
  );
};

const parseMoneyText = (text: string): Partial<Money> | null => {
  const match = text.trim().match(/^(\d+)\s*(gp|sp|cp)$/i);

  if (!match) return null;

  const amount = Number(match[1]);
  const currency = match[2].toLowerCase() as "gp" | "sp" | "cp";

  return {
    gp: currency === "gp" ? amount : 0,
    sp: currency === "sp" ? amount : 0,
    cp: currency === "cp" ? amount : 0,
  };
};

const getMoneyLabel = (money: Partial<Money>) => {
  if ((money.gp ?? 0) > 0) {
    return `${money.gp} gp`;
  }

  if ((money.sp ?? 0) > 0) {
    return `${money.sp} sp`;
  }

  if ((money.cp ?? 0) > 0) {
    return `${money.cp} cp`;
  }

  return "0 gp";
};

const TreasureLink = ({ text, item }: { text: string; item: ItemData }) => {
  return (
    <span className="group relative inline-block font-semibold text-white">
      <span className="hover:cursor-pointer">{text}</span>

      <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 hidden w-80 rounded-lg border border-white/10 bg-zinc-900 p-3 text-left shadow-2xl group-hover:block">
        <span className="mb-1 block text-sm font-bold text-white">
          {item.name}
        </span>

        <span className="mb-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded bg-white/10 px-2 py-1 text-white/80">
            {item.category}
          </span>

          {item.subtype && (
            <span className="rounded bg-white/10 px-2 py-1 text-white/80">
              {item.subtype}
            </span>
          )}

          {item.rarity && (
            <span className="rounded bg-yellow-500/15 px-2 py-1 text-yellow-300">
              {item.rarity}
            </span>
          )}

          {item.requiresAttunement && (
            <span className="rounded bg-blue-500/15 px-2 py-1 text-blue-300">
              Attunement
            </span>
          )}
        </span>

        <span className="block whitespace-pre-line text-xs leading-5 text-white/75">
          {item.description}
        </span>
      </span>
    </span>
  );
};

const renderParagraphs = (
  paragraphs?: string[],
  className = "space-y-2 text-sm leading-6 text-white/75",
) => {
  if (!paragraphs || paragraphs.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={`${paragraph}-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
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

const MapViewer = ({
  campaignId,
  map,
  onClose,
  players,
  onGiveItemToPlayer,
  onGiveItemToParty,
  onGiveMoneyToPlayer,
  onGiveMoneyToParty,
}: MapViewerProps) => {
  const navigate = useNavigate();
  const { loadEncounterTemplate } = useEncounter();

  const mapData = map as ExtendedCampaignMap | null;

  const [roomStates, setRoomStates] = useState<CampaignMapRoom[]>(
    map?.rooms ?? [],
  );

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const [hoveredRoomId, setHoveredRoomId] = useState<number | null>(null);

  const [activeEffectId, setActiveEffectId] = useState<string | null>(
    map?.environmentEffects?.[0]?.id ?? null,
  );

  const [isEnvironmentSaving, setIsEnvironmentSaving] = useState(false);

  const [environmentError, setEnvironmentError] = useState<string | null>(null);

  const [lastRollResults, setLastRollResults] = useState<
    EnvironmentRollResult[]
  >([]);

  const [zoom, setZoom] = useState(1);

  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [isTreasureModalOpen, setIsTreasureModalOpen] = useState(false);

  const [treasureAssignments, setTreasureAssignments] = useState<
    Record<string, TreasureRecipient>
  >({});

  const viewportRef = useRef<HTMLDivElement | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);

  const environmentEffects = mapData?.environmentEffects ?? [];

  const activeEffect = useMemo(() => {
    if (!activeEffectId || environmentEffects.length === 0) {
      return null;
    }

    return (
      environmentEffects.find((effect) => effect.id === activeEffectId) ?? null
    );
  }, [environmentEffects, activeEffectId]);

  const overviewParagraphs =
    mapData?.generalDescription ??
    mapData?.overview ??
    mapData?.description ??
    [];

  const fitMapToViewport = () => {
    const viewport = viewportRef.current;
    const image = imageRef.current;

    if (!viewport || !image) return;

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    if (!naturalWidth || !naturalHeight) {
      return;
    }

    const availableWidth = viewport.clientWidth - 32;

    if (availableWidth <= 0) return;

    const nextZoom = availableWidth / naturalWidth;

    setZoom(Math.max(0.2, Math.min(4, nextZoom)));
  };

  useEffect(() => {
    if (!map) return;

    setRoomStates(map.rooms ?? []);
    setSelectedRoomId(null);
    setHoveredRoomId(null);

    setActiveEffectId(map.environmentEffects?.[0]?.id ?? null);

    setLastRollResults([]);
    setEnvironmentError(null);
    setIsTreasureModalOpen(false);
    setTreasureAssignments({});

    const timer = window.setTimeout(() => {
      fitMapToViewport();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const handleResize = () => {
      fitMapToViewport();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  const selectedRoom = useMemo(() => {
    if (!roomStates.length || selectedRoomId === null) {
      return null;
    }

    return roomStates.find((room) => room.id === selectedRoomId) ?? null;
  }, [roomStates, selectedRoomId]);

  const linkedTreasureEntries = useMemo<LinkedTreasureEntry[]>(() => {
    if (!selectedRoom?.treasure?.length) {
      return [];
    }

    return selectedRoom.treasure.flatMap<LinkedTreasureEntry>(
      (treasureText, index): LinkedTreasureEntry[] => {
        const item = findLinkedItem(treasureText);

        if (item) {
          return [
            {
              key: `${selectedRoom.id}-${index}-item-${item.id}`,
              text: treasureText,
              type: "item",
              item,
            },
          ];
        }

        const money = parseMoneyText(treasureText);

        if (money) {
          return [
            {
              key: `${selectedRoom.id}-${index}-money-${treasureText}`,
              text: treasureText,
              type: "money",
              money,
              moneyLabel: getMoneyLabel(money),
            },
          ];
        }

        return [];
      },
    );
  }, [selectedRoom]);

  const handleImageLoad = () => {
    const image = imageRef.current;

    if (!image) return;

    setImageSize({
      width: image.naturalWidth,
      height: image.naturalHeight,
    });

    fitMapToViewport();
  };

  const getSvgPoints = (
    markers: {
      x: number;
      y: number;
    }[],
  ) => {
    if (!imageSize) return "";

    return markers
      .map((point) => {
        const x = (point.x / 100) * imageSize.width;

        const y = (point.y / 100) * imageSize.height;

        return `${x},${y}`;
      })
      .join(" ");
  };

  const selectRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
    setIsTreasureModalOpen(false);
  };

  /*
   * ENVIRONMENT
   */

  const saveEnvironmentRooms = async (
    nextRooms: CampaignMapRoom[],
    previousRooms: CampaignMapRoom[],
  ) => {
    if (!map) return;

    setRoomStates(nextRooms);

    try {
      setIsEnvironmentSaving(true);
      setEnvironmentError(null);

      await updateCampaignMap(campaignId, map.id, {
        rooms: nextRooms,
      });
    } catch (err) {
      console.error("Failed to save environment:", err);

      setRoomStates(previousRooms);

      setEnvironmentError("Failed to save environment changes.");

      throw err;
    } finally {
      setIsEnvironmentSaving(false);
    }
  };

  const getRoomEnvironmentLevel = (
    room: CampaignMapRoom,
    effect: EnvironmentEffect,
  ) => {
    return room.environment?.[effect.id] ?? getDefaultEnvironmentLevel(effect);
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

    try {
      await saveEnvironmentRooms(nextRooms, previousRooms);

      setLastRollResults([]);
    } catch {
      // Error already handled.
    }
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

      /*
       * Randomize deliberately ignores
       * maxChangePerRoll.
       */
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

    try {
      await saveEnvironmentRooms(nextRooms, previousRooms);

      setLastRollResults(results);
    } catch {
      setLastRollResults([]);
    }
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

    try {
      await saveEnvironmentRooms(nextRooms, previousRooms);

      setLastRollResults(results);
    } catch {
      setLastRollResults([]);
    }
  };

  /*
   * TREASURE
   */

  const openTreasureModal = () => {
    const nextAssignments: Record<string, TreasureRecipient> = {};

    linkedTreasureEntries.forEach((entry) => {
      nextAssignments[entry.key] = treasureAssignments[entry.key] ?? "party";
    });

    setTreasureAssignments(nextAssignments);

    setIsTreasureModalOpen(true);
  };

  const closeTreasureModal = () => {
    setIsTreasureModalOpen(false);
  };

  const setTreasureRecipient = (key: string, recipient: TreasureRecipient) => {
    setTreasureAssignments((prev) => ({
      ...prev,
      [key]: recipient,
    }));
  };

  const giveTreasure = () => {
    linkedTreasureEntries.forEach((entry) => {
      const recipient = treasureAssignments[entry.key] ?? "party";

      if (entry.type === "item") {
        if (recipient === "party") {
          onGiveItemToParty(entry.item.id);
        } else {
          onGiveItemToPlayer(entry.item.id, recipient);
        }

        return;
      }

      if (recipient === "party") {
        onGiveMoneyToParty(entry.money);
      } else {
        onGiveMoneyToPlayer(recipient, entry.money);
      }
    });

    setIsTreasureModalOpen(false);
  };

  const openRoomEncounter = () => {
    if (!selectedRoom?.encounterTemplate) {
      return;
    }

    loadEncounterTemplate(selectedRoom.encounterTemplate);

    onClose();

    navigate(`/campaigns/${campaignId}/encounter`);
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 4));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.2));
  };

  const resetZoom = () => {
    fitMapToViewport();
  };

  useEffect(() => {
    if (!map) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isTreasureModalOpen) {
          closeTreasureModal();
        } else {
          onClose();
        }
      }

      if (e.key === "+" || e.key === "=") {
        zoomIn();
      }

      if (e.key === "-") {
        zoomOut();
      }

      if (e.key === "0") {
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [map, onClose, isTreasureModalOpen]);

  if (!mapData) return null;

  const selectedPolygonPoints =
    selectedRoom &&
    selectedRoom.markers &&
    selectedRoom.markers.length >= 3 &&
    imageSize
      ? getSvgPoints(selectedRoom.markers)
      : null;

  return (
    <div className="h-dvh w-full overflow-hidden bg-zinc-950 text-white">
      {" "}
      <div className="flex h-full flex-col overflow-hidden bg-zinc-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <div className="text-lg font-semibold">{mapData.title}</div>

            <div className="text-sm text-white/60">
              Click an area on the map to view its details.
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={zoomOut}
              className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
            >
              -
            </button>

            <button
              type="button"
              onClick={resetZoom}
              className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
            >
              Fit
            </button>

            <button
              type="button"
              onClick={zoomIn}
              className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
            >
              +
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white transition hover:bg-white/10"
            >
              <i className="fa-solid fa-arrow-left mr-2" />
              Maps
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_600px]">
          {/* Map */}
          <div
            ref={viewportRef}
            className="min-h-0 overflow-auto bg-zinc-900 p-4"
          >
            <div className="min-h-full min-w-full">
              <div
                className="relative mx-auto"
                style={{
                  width: imageSize ? `${imageSize.width * zoom}px` : "100%",
                }}
              >
                <img
                  ref={imageRef}
                  src={mapData.imageUrl}
                  alt={mapData.title}
                  className="block h-auto w-full select-none rounded"
                  draggable={false}
                  onLoad={handleImageLoad}
                />

                {/* Interactive polygons */}
                {imageSize && (
                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
                  >
                    {roomStates.map((room) => {
                      if (!room.markers || room.markers.length < 3) {
                        return null;
                      }

                      const isSelected = selectedRoomId === room.id;

                      const isHovered = hoveredRoomId === room.id;

                      const points = getSvgPoints(room.markers);

                      return (
                        <polygon
                          key={room.id}
                          points={points}
                          onClick={() => selectRoom(room.id)}
                          onMouseEnter={() => setHoveredRoomId(room.id)}
                          onMouseLeave={() => setHoveredRoomId(null)}
                          className="cursor-pointer"
                          fill={
                            isSelected
                              ? "transparent"
                              : isHovered
                                ? "rgba(255,255,255,0.10)"
                                : "rgba(255,255,255,0.015)"
                          }
                          stroke={
                            isSelected
                              ? "transparent"
                              : isHovered
                                ? "rgba(255,255,255,0.75)"
                                : "rgba(255,255,255,0.10)"
                          }
                          strokeWidth={isHovered ? 3 : 1.5}
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })}
                  </svg>
                )}

                {/* Spotlight */}
                {selectedPolygonPoints && imageSize && (
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
                  >
                    <defs>
                      <mask
                        id="selected-area-spotlight-mask"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width={imageSize.width}
                        height={imageSize.height}
                      >
                        <rect
                          x="0"
                          y="0"
                          width={imageSize.width}
                          height={imageSize.height}
                          fill="white"
                        />

                        <polygon points={selectedPolygonPoints} fill="black" />
                      </mask>
                    </defs>

                    <rect
                      x="0"
                      y="0"
                      width={imageSize.width}
                      height={imageSize.height}
                      fill="rgba(0,0,0,0.3)"
                      mask="url(#selected-area-spotlight-mask)"
                    />

                    <polygon
                      points={selectedPolygonPoints}
                      fill="transparent"
                      stroke="rgba(255,255,255,0.95)"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}

                {/* Area pins */}
                {roomStates.map((room) => {
                  if (!room.markers || room.markers.length < 3) {
                    return null;
                  }

                  const defaultPin = {
                    x:
                      room.markers.reduce(
                        (total, point) => total + point.x,
                        0,
                      ) / room.markers.length,

                    y:
                      room.markers.reduce(
                        (total, point) => total + point.y,
                        0,
                      ) / room.markers.length,
                  };

                  const pinPosition = room.pin ?? defaultPin;

                  const isSelected = selectedRoomId === room.id;

                  const activeLevel = activeEffect
                    ? getRoomEnvironmentLevel(room, activeEffect)
                    : null;

                  const activeLevelName =
                    activeEffect && activeLevel !== null
                      ? getEnvironmentLevelName(activeEffect, activeLevel)
                      : null;

                  return (
                    <div key={`area-pin-${room.id}`}>
                      <button
                        type="button"
                        onClick={() => selectRoom(room.id)}
                        onMouseEnter={() => setHoveredRoomId(room.id)}
                        onMouseLeave={() => setHoveredRoomId(null)}
                        className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs font-bold shadow-lg transition ${
                          isSelected
                            ? "h-9 w-9 border-white bg-white text-zinc-950"
                            : "h-8 w-8 border-white/60 bg-zinc-950/80 text-white hover:border-white hover:bg-zinc-800"
                        }`}
                        style={{
                          left: `${pinPosition.x}%`,
                          top: `${pinPosition.y}%`,
                        }}
                        title={`${room.id}. ${room.name}${
                          activeLevelName ? ` — ${activeLevelName}` : ""
                        }`}
                      >
                        {room.id}
                      </button>

                      {activeEffect && activeLevelName && (
                        <div
                          className="pointer-events-none absolute z-10 -translate-x-1/2 translate-y-4 whitespace-nowrap rounded-full border border-white/10 bg-zinc-950/90 px-2 py-0.5 text-[10px] font-medium text-white/80 shadow"
                          style={{
                            left: `${pinPosition.x}%`,
                            top: `${pinPosition.y}%`,
                          }}
                        >
                          {activeLevelName}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Information panel */}
          <aside className="min-h-0 overflow-auto border-t border-white/10 bg-zinc-950 p-4 lg:border-l lg:border-t-0">
            <div className="space-y-5">
              {/* Environment controls */}
              {environmentEffects.length > 0 && (
                <section className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/70">
                        Environment
                      </div>

                      <h3 className="mt-1 text-lg font-bold text-white">
                        {activeEffect?.name ?? "Environment"}
                      </h3>
                    </div>

                    {activeEffect && (
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={randomizeEnvironmentForAllAreas}
                          disabled={
                            isEnvironmentSaving || roomStates.length === 0
                          }
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Randomize all areas without applying the maximum level change"
                        >
                          <i className="fa-solid fa-shuffle" /> Randomize
                        </button>

                        <button
                          type="button"
                          onClick={rollEnvironmentForAllAreas}
                          disabled={
                            isEnvironmentSaving || roomStates.length === 0
                          }
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <i className="fa-solid fa-dice-d20" />{" "}
                          {isEnvironmentSaving
                            ? "Saving..."
                            : `Roll d${activeEffect.diceSides}`}
                        </button>
                      </div>
                    )}
                  </div>

                  {environmentEffects.length > 1 && (
                    <div className="mb-4">
                      <label className="mb-1 block text-xs font-medium text-white/55">
                        Effect
                      </label>

                      <select
                        value={activeEffectId ?? ""}
                        onChange={(e) => {
                          setActiveEffectId(e.target.value || null);

                          setLastRollResults([]);
                        }}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                      >
                        {environmentEffects.map((effect) => (
                          <option key={effect.id} value={effect.id}>
                            {effect.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {environmentError && (
                    <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                      {environmentError}
                    </div>
                  )}

                  {activeEffect && (
                    <>
                      <div className="mb-4 text-xs leading-5 text-white/50">
                        <strong className="font-semibold text-white/70">
                          Randomize
                        </strong>{" "}
                        sets every area directly to its rolled target level.{" "}
                        <strong className="font-semibold text-white/70">
                          Roll d{activeEffect.diceSides}
                        </strong>{" "}
                        evolves the current environment, allowing each area to
                        move at most {activeEffect.maxChangePerRoll} level
                        {activeEffect.maxChangePerRoll === 1 ? "" : "s"} toward
                        its rolled target.
                      </div>

                      <div className="space-y-2">
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

                            const canDecrease = currentIndex > 0;

                            const canIncrease =
                              currentIndex < levels.length - 1;

                            return (
                              <div
                                key={room.id}
                                className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                                  selectedRoomId === room.id
                                    ? "border-white/20 bg-white/10"
                                    : "border-white/10 bg-black/10"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => selectRoom(room.id)}
                                  className="min-w-0 flex-1 text-left"
                                >
                                  <div className="truncate text-sm font-semibold text-white">
                                    {room.id}. {room.name}
                                  </div>

                                  <div className="mt-0.5 text-xs text-white/50">
                                    {getEnvironmentLevelName(
                                      activeEffect,
                                      currentValue,
                                    )}
                                  </div>
                                </button>

                                <button
                                  type="button"
                                  disabled={!canDecrease || isEnvironmentSaving}
                                  onClick={() =>
                                    changeRoomEnvironmentLevel(room.id, -1)
                                  }
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                                  title="Decrease one level"
                                >
                                  −
                                </button>

                                <div className="min-w-8 text-center text-sm font-bold text-white">
                                  {currentValue}
                                </div>

                                <button
                                  type="button"
                                  disabled={!canIncrease || isEnvironmentSaving}
                                  onClick={() =>
                                    changeRoomEnvironmentLevel(room.id, 1)
                                  }
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                                  title="Increase one level"
                                >
                                  +
                                </button>
                              </div>
                            );
                          })}
                      </div>

                      {lastRollResults.length > 0 && (
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
                            Last roll
                          </div>

                          <div className="space-y-2">
                            {lastRollResults.map((result) => {
                              const changed =
                                result.previousLevel !== result.nextLevel;

                              return (
                                <div
                                  key={result.roomId}
                                  className="rounded-lg bg-black/20 px-3 py-2 text-xs"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="font-semibold text-white/80">
                                      {result.roomId}. {result.roomName}
                                    </span>

                                    <span className="font-bold text-emerald-300">
                                      d{activeEffect.diceSides}: {result.roll}
                                    </span>
                                  </div>

                                  <div className="mt-1 text-white/50">
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

                                  {result.targetLevel !== result.nextLevel && (
                                    <div className="mt-0.5 text-white/35">
                                      Rolled target:{" "}
                                      {getEnvironmentLevelName(
                                        activeEffect,
                                        result.targetLevel,
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}

              {/* Overview / selected area */}
              {selectedRoom === null ? (
                <div className="space-y-5">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-white/50">
                      Overview
                    </div>

                    <h3 className="text-xl font-bold">
                      {mapData.overviewTitle ?? mapData.title}
                    </h3>
                  </div>

                  {mapData.readAloud && (
                    <section className="space-y-2">
                      <div className="text-sm font-semibold text-yellow-300">
                        Read aloud
                      </div>

                      <p className="rounded-lg border border-yellow-400/20 bg-yellow-400/10 p-3 text-sm leading-6 text-yellow-50">
                        {mapData.readAloud}
                      </p>
                    </section>
                  )}

                  {overviewParagraphs.length > 0 ? (
                    <section>{renderParagraphs(overviewParagraphs)}</section>
                  ) : (
                    <p className="text-sm text-white/70">
                      This map does not yet have a general description.
                    </p>
                  )}

                  <section className="space-y-3">
                    <div className="text-sm font-semibold text-white/90">
                      Areas
                    </div>

                    {roomStates.length === 0 ? (
                      <p className="text-sm text-white/70">No areas yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {roomStates
                          .slice()
                          .sort((a, b) => a.id - b.id)
                          .map((room) => (
                            <button
                              key={room.id}
                              type="button"
                              onClick={() => selectRoom(room.id)}
                              className="flex w-full items-start justify-between rounded-lg border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10"
                            >
                              <div>
                                <div className="font-medium text-white">
                                  {room.id}. {room.name}
                                </div>

                                <div className="mt-1 text-sm text-white/55">
                                  {room.monsters?.length
                                    ? `${room.monsters.length} monster entr${
                                        room.monsters.length === 1 ? "y" : "ies"
                                      }`
                                    : "No monsters listed"}
                                </div>
                              </div>

                              <span className="rounded bg-white/10 px-2 py-1 text-xs text-white/70">
                                Open
                              </span>
                            </button>
                          ))}
                      </div>
                    )}
                  </section>
                </div>
              ) : roomStates.length === 0 ? (
                <div className="space-y-3">
                  <div className="text-lg font-semibold">No area data yet</div>

                  <p className="text-sm text-white/70">
                    This map does not yet have interactive areas and notes.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-white/50">
                        Area {selectedRoom.id}
                      </div>

                      <h3 className="text-xl font-bold">{selectedRoom.name}</h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoomId(null);
                        setIsTreasureModalOpen(false);
                      }}
                      className="rounded bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
                    >
                      Overview
                    </button>
                  </div>

                  {activeEffect && (
                    <section className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3">
                      <div className="text-xs uppercase tracking-wide text-emerald-300/60">
                        {activeEffect.name}
                      </div>

                      <div className="mt-1 text-sm font-semibold text-white">
                        {getEnvironmentLevelName(
                          activeEffect,
                          getRoomEnvironmentLevel(selectedRoom, activeEffect),
                        )}
                      </div>
                    </section>
                  )}

                  {selectedRoom.readAloud && (
                    <section className="space-y-2">
                      <div className="text-sm font-semibold text-yellow-300">
                        Read aloud
                      </div>

                      <p className="rounded-lg border border-yellow-400/20 bg-yellow-400/10 p-3 text-sm leading-6 text-yellow-50">
                        {selectedRoom.readAloud}
                      </p>
                    </section>
                  )}

                  {selectedRoom.description &&
                    selectedRoom.description.length > 0 && (
                      <section>
                        {renderParagraphs(selectedRoom.description)}
                      </section>
                    )}

                  {selectedRoom.captives &&
                    selectedRoom.captives.length > 0 && (
                      <section className="space-y-2">
                        <div className="text-sm font-semibold text-white/90">
                          Captives
                        </div>

                        {renderParagraphs(selectedRoom.captives)}
                      </section>
                    )}

                  {selectedRoom.monsters &&
                    selectedRoom.monsters.length > 0 && (
                      <section className="space-y-2">
                        <div className="text-sm font-semibold text-white/90">
                          Monsters
                        </div>

                        <div className="space-y-2">
                          {selectedRoom.monsters.map((monster, index) => (
                            <div
                              key={`${monster.name}-${index}`}
                              className="rounded-lg border border-white/10 bg-white/5 p-3"
                            >
                              <div className="font-medium">
                                {monster.count ? `${monster.count}x ` : ""}
                                {monster.name}
                              </div>

                              {monster.notes && (
                                <div className="mt-1 text-sm text-white/65">
                                  {monster.notes}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                  {selectedRoom.developments &&
                    selectedRoom.developments.length > 0 && (
                      <section className="space-y-2">
                        <div className="text-sm font-semibold text-white/90">
                          Developments
                        </div>

                        {renderParagraphs(selectedRoom.developments)}
                      </section>
                    )}

                  {selectedRoom.treasure &&
                    selectedRoom.treasure.length > 0 && (
                      <section className="space-y-2">
                        <div className="text-sm font-semibold text-white/90">
                          Treasure
                        </div>

                        <ul className="list-disc space-y-1 pl-5 text-sm text-white/75">
                          {selectedRoom.treasure.map((treasureText, index) => {
                            const linkedItem = findLinkedItem(treasureText);

                            return (
                              <li key={`${treasureText}-${index}`}>
                                {linkedItem ? (
                                  <TreasureLink
                                    text={treasureText}
                                    item={linkedItem}
                                  />
                                ) : (
                                  treasureText
                                )}
                              </li>
                            );
                          })}
                        </ul>

                        {linkedTreasureEntries.length > 0 && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={openTreasureModal}
                              className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
                            >
                              Distribute treasure
                            </button>
                          </div>
                        )}
                      </section>
                    )}

                  {selectedRoom.experience && (
                    <section className="space-y-2">
                      <div className="text-sm font-semibold text-white/90">
                        Award Experience
                      </div>

                      <p className="text-sm leading-6 text-white/75">
                        {selectedRoom.experience}
                      </p>
                    </section>
                  )}

                  {selectedRoom.notes && selectedRoom.notes.length > 0 && (
                    <section className="space-y-2">
                      <div className="text-sm font-semibold text-white/90">
                        DM Notes
                      </div>

                      <ul className="list-disc space-y-1 pl-5 text-sm text-white/75">
                        {selectedRoom.notes.map((note, index) => (
                          <li key={`${note}-${index}`}>{note}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {selectedRoom.encounterTemplate && (
                    <section className="space-y-2">
                      <div className="text-sm font-semibold text-white/90">
                        Encounter
                      </div>

                      <button
                        type="button"
                        onClick={openRoomEncounter}
                        className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                      >
                        Open encounter for this area
                      </button>
                    </section>
                  )}

                  {selectedRoom.exits && selectedRoom.exits.length > 0 && (
                    <section className="space-y-2">
                      <div className="text-sm font-semibold text-white/90">
                        Connected Areas
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedRoom.exits.map((exitRoomId) => (
                          <button
                            key={exitRoomId}
                            type="button"
                            onClick={() => selectRoom(exitRoomId)}
                            className="rounded bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
                          >
                            Area {exitRoomId}
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
      {/* Treasure modal */}
      {isTreasureModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-zinc-950 p-5 text-white shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Distribute Treasure</h3>

                <p className="text-sm text-white/60">
                  Choose who should receive each item from {selectedRoom.name}.
                </p>
              </div>

              <button
                type="button"
                onClick={closeTreasureModal}
                className="rounded bg-red-500 px-3 py-1 text-sm hover:bg-red-600"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {linkedTreasureEntries.map((entry) => (
                <div
                  key={entry.key}
                  className="rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <div className="mb-2">
                    <div className="font-semibold text-white">{entry.text}</div>

                    <div className="text-xs text-white/55">
                      {entry.type === "item"
                        ? entry.item.name
                        : entry.moneyLabel}
                    </div>
                  </div>

                  <select
                    value={treasureAssignments[entry.key] ?? "party"}
                    onChange={(e) =>
                      setTreasureRecipient(entry.key, e.target.value)
                    }
                    className="w-full rounded border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="party">Party</option>

                    {players.map((player) => (
                      <option key={player.name} value={player.name}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeTreasureModal}
                className="rounded bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={giveTreasure}
                className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Give Treasure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewer;
