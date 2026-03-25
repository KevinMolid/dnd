import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEncounter } from "../context/EncounterContext";
import { itemList, type ItemData } from "../data/items";
import type { Money, PlayerCharacter } from "../data/players";
import type { CampaignMap } from "../features/maps/types";

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
  if ((money.gp ?? 0) > 0) return `${money.gp} gp`;
  if ((money.sp ?? 0) > 0) return `${money.sp} sp`;
  if ((money.cp ?? 0) > 0) return `${money.cp} cp`;
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
  if (!paragraphs || paragraphs.length === 0) return null;

  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={`${paragraph}-${index}`}>{paragraph}</p>
      ))}
    </div>
  );
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

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isTreasureModalOpen, setIsTreasureModalOpen] = useState(false);
  const [treasureAssignments, setTreasureAssignments] = useState<
    Record<string, TreasureRecipient>
  >({});

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

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

    if (!naturalWidth || !naturalHeight) return;

    const viewportWidth = viewport.clientWidth - 16;
    const viewportHeight = viewport.clientHeight - 16;

    if (viewportWidth <= 0 || viewportHeight <= 0) return;

    const widthScale = viewportWidth / naturalWidth;
    const heightScale = viewportHeight / naturalHeight;
    const nextZoom = Math.max(
      0.2,
      Math.min(4, Number(Math.min(widthScale, heightScale).toFixed(3))),
    );

    setZoom(nextZoom);
  };

  useEffect(() => {
    if (!map) return;

    setSelectedRoomId(null);
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
    return () => window.removeEventListener("resize", handleResize);
  }, [map]);

  const selectedRoom = useMemo(() => {
    if (!map?.rooms?.length || selectedRoomId === null) return null;
    return map.rooms.find((room) => room.id === selectedRoomId) ?? null;
  }, [map, selectedRoomId]);

  const linkedTreasureEntries = useMemo<LinkedTreasureEntry[]>(() => {
    if (!selectedRoom?.treasure?.length) return [];

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
    if (!selectedRoom?.encounterTemplate) return;

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

      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [map, onClose, isTreasureModalOpen]);

  if (!mapData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 p-4 md:p-6">
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-zinc-950 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <div className="text-lg font-semibold">{mapData.title}</div>
            <div className="text-sm text-white/60">
              Start on the overview, or click a numbered room marker to view its
              details.
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
              className="rounded bg-red-500 px-3 py-1 hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_600px]">
          <div
            ref={viewportRef}
            className="min-h-0 overflow-auto bg-zinc-900 p-4"
          >
            <div className="flex min-h-full items-center justify-center">
              <div
                className="inline-block origin-center"
                style={{ transform: `scale(${zoom})` }}
              >
                <div className="relative inline-block">
                  <img
                    ref={imageRef}
                    src={mapData.imageUrl}
                    alt={mapData.title}
                    className="block max-w-none select-none rounded"
                    draggable={false}
                    onLoad={fitMapToViewport}
                  />

                  {mapData.rooms?.flatMap((room) => {
                    const isSelected = selectedRoomId === room.id;

                    return room.markers.map((marker, markerIndex) => (
                      <button
                        key={`${room.id}-${markerIndex}`}
                        type="button"
                        onClick={() => {
                          setSelectedRoomId(room.id);
                          setIsTreasureModalOpen(false);
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-xs font-bold shadow-lg transition ${
                          isSelected
                            ? "h-9 w-9 border-white bg-red-500 text-white"
                            : "h-8 w-8 border-red-500 bg-stone-100 text-red-600 hover:bg-white"
                        }`}
                        style={{
                          left: `${marker.x}%`,
                          top: `${marker.y}%`,
                        }}
                        title={`${room.id}. ${room.name}`}
                      >
                        {room.id}
                      </button>
                    ));
                  })}
                </div>
              </div>
            </div>
          </div>

          <aside className="min-h-0 overflow-auto border-t border-white/10 bg-zinc-950 p-4 lg:border-l lg:border-t-0">
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
                    Rooms
                  </div>

                  {!mapData.rooms || mapData.rooms.length === 0 ? (
                    <p className="text-sm text-white/70">No rooms yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {mapData.rooms
                        .slice()
                        .sort((a, b) => a.id - b.id)
                        .map((room) => (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => {
                              setSelectedRoomId(room.id);
                              setIsTreasureModalOpen(false);
                            }}
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
            ) : !mapData.rooms || mapData.rooms.length === 0 ? (
              <div className="space-y-3">
                <div className="text-lg font-semibold">No room data yet</div>
                <p className="text-sm text-white/70">
                  This map does not yet have interactive room markers and notes.
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

                {selectedRoom.captives && selectedRoom.captives.length > 0 && (
                  <section className="space-y-2">
                    <div className="text-sm font-semibold text-white/90">
                      Captives
                    </div>
                    {renderParagraphs(selectedRoom.captives)}
                  </section>
                )}

                {selectedRoom.monsters && selectedRoom.monsters.length > 0 && (
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

                {selectedRoom.treasure && selectedRoom.treasure.length > 0 && (
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
                      Open encounter for this room
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
                          onClick={() => {
                            setSelectedRoomId(exitRoomId);
                            setIsTreasureModalOpen(false);
                          }}
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
          </aside>
        </div>
      </div>

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
