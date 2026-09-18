import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { useNavigate } from "react-router-dom";

import { useEncounter } from "../context/EncounterContext";

import { allItems } from "../rulesets/dnd/dnd2024/data/items";

import type { Item } from "../rulesets/dnd/dnd2024/types";

import type { Money, PlayerCharacter } from "../data/players";

import type {
  CampaignMap,
  CampaignMapRoom,
  EnvironmentEffect,
  MapTreasure,
} from "../features/maps/types";

import MapCanvas, { type MapCanvasHandle } from "./maps/MapCanvas";

import RichTextContent from "../features/richText/RichTextContent";

type MapViewerProps = {
  campaignId: string;

  map: CampaignMap | null;

  onClose: () => void;

  onEdit?: (roomId: number | null) => void;

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

      item: Item;
    }
  | {
      key: string;

      text: string;

      type: "money";

      money: Partial<Money>;

      moneyLabel: string;
    };

type ExtendedCampaignMap = CampaignMap & {
  descriptionHtml?: string;

  description?: string[];

  overview?: string[];

  generalDescription?: string[];

  readAloud?: string;

  overviewTitle?: string;
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

const formatItemCategory = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getTreasureSearchVariants = (value: string) => {
  const normalized = normalizeItemText(value);
  const variants = new Set<string>([normalized]);

  const leadingBonus = normalized.match(/^\+(\d+)\s+(.+)$/);

  if (leadingBonus) {
    variants.add(`${leadingBonus[2]} +${leadingBonus[1]}`);
  }

  const trailingBonus = normalized.match(/^(.+)\s+\+(\d+)$/);

  if (trailingBonus) {
    variants.add(`+${trailingBonus[2]} ${trailingBonus[1]}`);
  }

  return [...variants];
};

const findLinkedItem = (treasureText: string): Item | null => {
  const treasureVariants = getTreasureSearchVariants(treasureText);

  return (
    allItems.find((item) => {
      const itemVariants = getTreasureSearchVariants(item.name);

      return treasureVariants.some((treasureVariant) =>
        itemVariants.some(
          (itemVariant) =>
            treasureVariant === itemVariant ||
            treasureVariant.includes(itemVariant) ||
            itemVariant.includes(treasureVariant),
        ),
      );
    }) ?? null
  );
};

const parseMoneyText = (text: string): Partial<Money> | null => {
  const match = text.trim().match(/^(\d+)\s*(gp|sp|cp)$/i);

  if (!match) {
    return null;
  }

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

const TreasureLink = ({
  text,
  item,
}: {
  text: string;
  item: Item;
}) => {
  return (
    <span className="group relative inline-block font-semibold text-white">
      <span className="hover:cursor-pointer">{text}</span>

      <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 hidden w-80 rounded-lg border border-white/10 bg-zinc-900 p-3 text-left shadow-2xl group-hover:block">
        <span className="mb-1 block text-sm font-bold text-white">
          {item.name}
        </span>

        <span className="mb-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded bg-white/10 px-2 py-1 text-white/80">
            {formatItemCategory(item.category)}
          </span>

          {item.magical ? (
            <span className="rounded bg-violet-500/15 px-2 py-1 text-violet-300">
              Magical
            </span>
          ) : null}

          {item.stackable ? (
            <span className="rounded bg-emerald-500/10 px-2 py-1 text-emerald-300/80">
              Stackable
            </span>
          ) : null}
        </span>

        <span className="block whitespace-pre-line text-xs leading-5 text-white/75">
          {item.description ?? "No description available."}
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

const RichDescription = ({
  html,
  legacyParagraphs,
}: {
  html?: string;
  legacyParagraphs?: string[];
}) => {
  if (html?.trim()) {
    return (
      <div className="text-sm text-white/75">
        <RichTextContent value={html} />
      </div>
    );
  }

  return renderParagraphs(legacyParagraphs);
};

const getDefaultEnvironmentLevel = (effect: EnvironmentEffect) => {
  const levels = [...effect.levels].sort((a, b) => a.value - b.value);

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

const MapViewer = ({
  campaignId,
  map,
  onClose,
  onEdit,
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

  const [sidebarWidth, setSidebarWidth] = useState(420);

  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  const [isTreasureModalOpen, setIsTreasureModalOpen] = useState(false);

  const [treasureAssignments, setTreasureAssignments] = useState<
    Record<string, TreasureRecipient>
  >({});

  const mapCanvasRef = useRef<MapCanvasHandle | null>(null);

  const viewerRef = useRef<HTMLDivElement | null>(null);

  const [viewerHeight, setViewerHeight] = useState<number | null>(null);

  const activeEffect = mapData?.environmentEffects?.[0] ?? null;

  const overviewParagraphs =
    mapData?.generalDescription ??
    mapData?.overview ??
    mapData?.description ??
    [];

  const fitMapToViewport = () => {
    mapCanvasRef.current?.fitToViewport();
  };

  const handleSidebarResizeStart = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    setIsResizingSidebar(true);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const viewportWidth = window.innerWidth;

      const nextWidth = viewportWidth - moveEvent.clientX;

      const minWidth = 360;

      const maxWidth = Math.min(
        620,

        viewportWidth * 0.65,
      );

      setSidebarWidth(
        Math.max(
          minWidth,

          Math.min(maxWidth, nextWidth),
        ),
      );
    };

    const handlePointerUp = () => {
      setIsResizingSidebar(false);

      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerup", handlePointerUp);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          fitMapToViewport();
        });
      });
    };

    window.addEventListener("pointermove", handlePointerMove);

    window.addEventListener("pointerup", handlePointerUp);
  };

  useEffect(() => {
    if (!map) {
      return;
    }

    setRoomStates(map.rooms ?? []);

    /*
     * Preserve the currently selected area when
     * Firestore updates the map.
     */
    setSelectedRoomId((currentRoomId) => {
      if (currentRoomId === null) {
        return null;
      }

      const roomStillExists = map.rooms?.some(
        (room) => room.id === currentRoomId,
      );

      return roomStillExists ? currentRoomId : null;
    });

    setHoveredRoomId(null);


    setIsTreasureModalOpen(false);

    setTreasureAssignments({});

    const timer = window.setTimeout(() => {
      fitMapToViewport();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    const updateViewerHeight = () => {
      const viewer = viewerRef.current;

      if (!viewer) {
        return;
      }

      const top = viewer.getBoundingClientRect().top;
      const availableHeight = Math.max(420, window.innerHeight - top - 16);

      setViewerHeight(availableHeight);

      window.requestAnimationFrame(() => {
        mapCanvasRef.current?.fitToViewport();
      });
    };

    updateViewerHeight();

    window.addEventListener("resize", updateViewerHeight);

    return () => {
      window.removeEventListener("resize", updateViewerHeight);
    };
  }, []);

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
      (treasure: MapTreasure, index): LinkedTreasureEntry[] => {
        const quantity = Math.max(1, treasure.count ?? 1);
        const displayText =
          quantity > 1 ? `${quantity}× ${treasure.name}` : treasure.name;

        const item = findLinkedItem(treasure.name);

        if (item) {
          return Array.from({ length: quantity }, (_, quantityIndex) => ({
            key: `${selectedRoom.id}-${index}-${quantityIndex}-item-${item.id}`,
            text: displayText,
            type: "item" as const,
            item,
          }));
        }

        const money = parseMoneyText(treasure.name);

        if (money) {
          const multipliedMoney: Partial<Money> = {
            gp: (money.gp ?? 0) * quantity,
            sp: (money.sp ?? 0) * quantity,
            cp: (money.cp ?? 0) * quantity,
          };

          return [
            {
              key: `${selectedRoom.id}-${index}-money-${treasure.name}`,
              text: displayText,
              type: "money" as const,
              money: multipliedMoney,
              moneyLabel: getMoneyLabel(multipliedMoney),
            },
          ];
        }

        return [];
      },
    );
  }, [selectedRoom]);

  const selectRoom = (roomId: number) => {
    setSelectedRoomId(roomId);

    setIsTreasureModalOpen(false);
  };

  const showOverview = () => {
    setSelectedRoomId(null);

    setIsTreasureModalOpen(false);
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

  const setTreasureRecipient = (
    key: string,

    recipient: TreasureRecipient,
  ) => {
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

  useEffect(() => {
    if (!map) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isTreasureModalOpen) {
          closeTreasureModal();
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [map, onClose, isTreasureModalOpen]);

  if (!mapData) {
    return null;
  }

  return (
    <div
      ref={viewerRef}
      className="w-full overflow-hidden bg-zinc-950 text-white"
      style={{
        height: viewerHeight ? `${viewerHeight}px` : "calc(100dvh - 1rem)",
      }}
    >
      <div className="flex h-full flex-col overflow-hidden bg-zinc-950">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-3 py-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            <i className="fa-solid fa-arrow-left text-[10px]" />
            Maps
          </button>

          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(selectedRoomId)}
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <i className="fa-solid fa-pen text-[10px]" />
              Edit
            </button>
          ) : null}
        </div>

        <div
          className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row"
          style={
            {
              "--sidebar-width": `${sidebarWidth}px`,
            } as CSSProperties
          }
        >
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {roomStates.length > 0 ? (
              <div className="workspace-scrollbar shrink-0 overflow-x-auto border-b border-white/[0.06] px-3 py-2">
                <div className="flex min-w-max items-center gap-1.5">
                  <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                    Areas
                  </span>

                  {roomStates
                    .slice()
                    .sort((a, b) => a.id - b.id)
                    .map((room) => {
                      const selected = selectedRoomId === room.id;

                      return (
                        <button
                          key={room.id}
                          type="button"
                          onClick={() => selectRoom(room.id)}
                          onMouseEnter={() => setHoveredRoomId(room.id)}
                          onMouseLeave={() => setHoveredRoomId(null)}
                          className={`shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-medium transition ${
                            selected
                              ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-100"
                              : "border-white/[0.08] bg-white/[0.035] text-zinc-400 hover:border-white/15 hover:bg-white/[0.07] hover:text-zinc-200"
                          }`}
                        >
                          {room.id}. {room.name}
                        </button>
                      );
                    })}
                </div>
              </div>
            ) : null}

            <div className="flex min-h-0 flex-1">
              <MapCanvas
                ref={mapCanvasRef}
                map={mapData}
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

                  const level = getRoomEnvironmentLevel(room, activeEffect);

                  return getEnvironmentLevelName(activeEffect, level);
                }}
                className="min-h-[420px] flex-1 lg:h-full lg:min-h-0"
              />
            </div>
          </div>

          <div
            onPointerDown={handleSidebarResizeStart}
            className={`group relative hidden w-2 shrink-0 cursor-col-resize touch-none items-center justify-center border-l border-r border-white/5 bg-zinc-950 transition lg:flex ${
              isResizingSidebar ? "bg-white/10" : "hover:bg-white/5"
            }`}
            title="Drag to resize map and information"
          >
            <div className="h-12 w-1 rounded-full bg-white/15 transition group-hover:bg-white/35" />
          </div>

          {/* Information panel */}

          <aside className="workspace-scrollbar min-h-0 w-full shrink-0 overflow-y-auto border-t border-white/10 bg-zinc-950 p-4 lg:w-[var(--sidebar-width)] lg:border-t-0">
            <div className="space-y-5">
              {/* Overview / selected area */}

              {selectedRoom === null ? (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold">
                      {mapData.overviewTitle ?? mapData.title}
                    </h3>
                  </div>

                  {mapData.readAloud && (
                    <section className="space-y-2">
                      <div className="text-sm font-semibold text-yellow-300">
                        Read aloud
                      </div>

                      <p className="whitespace-pre-wrap rounded-lg border border-yellow-400/20 bg-yellow-400/10 p-3 text-sm leading-6 text-yellow-50">
                        {mapData.readAloud}
                      </p>
                    </section>
                  )}

                  {mapData.descriptionHtml?.trim() ||
                  overviewParagraphs.length > 0 ? (
                    <section>
                      <RichDescription
                        html={mapData.descriptionHtml}
                        legacyParagraphs={overviewParagraphs}
                      />
                    </section>
                  ) : (
                    <p className="text-sm text-white/70">
                      This map does not yet have a general description.
                    </p>
                  )}

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
                  <div>
                    <h3 className="text-xl font-bold">
                      {selectedRoom.id}. {selectedRoom.name}
                    </h3>
                  </div>


                  {selectedRoom.readAloud && (
                    <section className="space-y-2">
                      <div className="text-sm font-semibold text-yellow-300">
                        Read aloud
                      </div>

                      <p className="whitespace-pre-wrap rounded-lg border border-yellow-400/20 bg-yellow-400/10 p-3 text-sm leading-6 text-yellow-50">
                        {selectedRoom.readAloud}
                      </p>
                    </section>
                  )}

                  {(selectedRoom.descriptionHtml?.trim() ||
                    selectedRoom.description?.length) && (
                    <section>
                      <RichDescription
                        html={selectedRoom.descriptionHtml}
                        legacyParagraphs={selectedRoom.description}
                      />
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
                          Creatures
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
                          {selectedRoom.treasure.map((treasure, index) => {
                            const linkedItem = findLinkedItem(treasure.name);

                            const quantity = Math.max(1, treasure.count ?? 1);

                            const displayText =
                              quantity > 1
                                ? `${quantity}× ${treasure.name}`
                                : treasure.name;

                            return (
                              <li
                                key={
                                  treasure.itemKey ??
                                  `${treasure.name}-${index}`
                                }
                              >
                                {linkedItem ? (
                                  <TreasureLink
                                    text={displayText}
                                    item={linkedItem}
                                  />
                                ) : (
                                  displayText
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
