import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEncounter } from "../context/EncounterContext";
import type { MapHandout } from "../data/handouts/types";
import { itemList, type ItemData } from "../data/items";
import type { PlayerCharacter } from "../data/players";

type MapViewerProps = {
  map: MapHandout | null;
  onClose: () => void;
  players: PlayerCharacter[];
  onGiveItemToPlayer: (itemId: string, playerName: string) => void;
  onGiveItemToParty: (itemId: string) => void;
};

type TreasureRecipient = "party" | string;

type LinkedTreasureEntry = {
  key: string;
  text: string;
  item: ItemData;
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

const MapViewer = ({
  map,
  onClose,
  players,
  onGiveItemToPlayer,
  onGiveItemToParty,
}: MapViewerProps) => {
  const navigate = useNavigate();
  const { loadEncounterTemplate } = useEncounter();

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isTreasureModalOpen, setIsTreasureModalOpen] = useState(false);
  const [treasureAssignments, setTreasureAssignments] = useState<
    Record<string, TreasureRecipient>
  >({});

  useEffect(() => {
    if (!map) return;
    setZoom(1);
    setSelectedRoomId(map.rooms?.[0]?.id ?? null);
    setIsTreasureModalOpen(false);
    setTreasureAssignments({});
  }, [map]);

  const selectedRoom = useMemo(() => {
    if (!map?.rooms?.length || selectedRoomId === null) return null;
    return map.rooms.find((room) => room.id === selectedRoomId) ?? null;
  }, [map, selectedRoomId]);

  const linkedTreasureItems = useMemo<LinkedTreasureEntry[]>(() => {
    if (!selectedRoom?.treasure?.length) return [];

    return selectedRoom.treasure.flatMap((treasureText, index) => {
      const item = findLinkedItem(treasureText);
      if (!item) return [];

      return [
        {
          key: `${selectedRoom.id}-${index}-${item.id}`,
          text: treasureText,
          item,
        },
      ];
    });
  }, [selectedRoom]);

  const openTreasureModal = () => {
    const nextAssignments: Record<string, TreasureRecipient> = {};

    linkedTreasureItems.forEach((entry) => {
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
    linkedTreasureItems.forEach((entry) => {
      const recipient = treasureAssignments[entry.key] ?? "party";

      if (recipient === "party") {
        onGiveItemToParty(entry.item.id);
      } else {
        onGiveItemToPlayer(entry.item.id, recipient);
      }
    });

    setIsTreasureModalOpen(false);
  };

  const openRoomEncounter = () => {
    if (!selectedRoom?.encounterTemplate) return;

    loadEncounterTemplate(selectedRoom.encounterTemplate);
    onClose();
    navigate("/kamp");
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 4));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
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

  if (!map) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 p-4 md:p-6">
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-zinc-950 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <div className="text-lg font-semibold">{map.title}</div>
            <div className="text-sm text-white/60">
              Click a numbered room marker to show its details.
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
              Reset
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
          <div className="min-h-0 overflow-auto bg-zinc-900 p-4">
            <div
              className="inline-block origin-top-left"
              style={{ transform: `scale(${zoom})` }}
            >
              <div className="relative inline-block">
                <img
                  src={map.src}
                  alt={map.title}
                  className="block max-w-none select-none rounded"
                  draggable={false}
                />

                {map.rooms?.flatMap((room) => {
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

          <aside className="min-h-0 overflow-auto border-t border-white/10 bg-zinc-950 p-4 lg:border-l lg:border-t-0">
            {!map.rooms || map.rooms.length === 0 ? (
              <div className="space-y-3">
                <div className="text-lg font-semibold">No room data yet</div>
                <p className="text-sm text-white/70">
                  This map does not yet have interactive room markers and notes.
                </p>
              </div>
            ) : !selectedRoom ? (
              <div className="space-y-3">
                <div className="text-lg font-semibold">Select a room</div>
                <p className="text-sm text-white/70">
                  Click one of the numbered markers on the map to view room
                  information.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-wide text-white/50">
                    Område {selectedRoom.id}
                  </div>
                  <h3 className="text-xl font-bold">{selectedRoom.name}</h3>
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

                <section className="space-y-2 text-sm leading-6 text-white/75">
                  {selectedRoom.description}
                </section>

                {selectedRoom.captives && (
                  <section className="space-y-2">
                    <div className="text-sm font-semibold text-white/90">
                      Fanger
                    </div>
                    <div className="space-y-2 text-sm leading-6 text-white/75">
                      {selectedRoom.captives}
                    </div>
                  </section>
                )}

                {selectedRoom.monsters && selectedRoom.monsters.length > 0 && (
                  <section className="space-y-2">
                    <div className="text-sm font-semibold text-white/90">
                      Monstre
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

                {selectedRoom.developments && (
                  <section className="space-y-2">
                    <div className="text-sm font-semibold text-white/90">
                      Utvikling
                    </div>
                    <div className="space-y-2 text-sm leading-6 text-white/75">
                      {selectedRoom.developments}
                    </div>
                  </section>
                )}

                {selectedRoom.treasure && selectedRoom.treasure.length > 0 && (
                  <section className="space-y-2">
                    <div className="text-sm font-semibold text-white/90">
                      Skatter
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

                    {linkedTreasureItems.length > 0 && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={openTreasureModal}
                          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
                        >
                          Fordel skatter
                        </button>
                      </div>
                    )}
                  </section>
                )}

                {selectedRoom.experience && (
                  <section className="space-y-2">
                    <div className="text-sm font-semibold text-white/90">
                      Tildel Erfaringspoeng
                    </div>
                    <p className="text-sm leading-6 text-white/75">
                      {selectedRoom.experience}
                    </p>
                  </section>
                )}

                {selectedRoom.notes && selectedRoom.notes.length > 0 && (
                  <section className="space-y-2">
                    <div className="text-sm font-semibold text-white/90">
                      DM-Notater
                    </div>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-white/75">
                      {selectedRoom.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {selectedRoom.encounterTemplate && (
                  <section className="space-y-2">
                    <div className="text-sm font-semibold text-white/90">
                      Kamp
                    </div>
                    <button
                      type="button"
                      onClick={openRoomEncounter}
                      className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                    >
                      Åpne kamp for dette rommet
                    </button>
                  </section>
                )}

                {selectedRoom.exits && selectedRoom.exits.length > 0 && (
                  <section className="space-y-2">
                    <div className="text-sm font-semibold text-white/90">
                      Tilkoblede områder
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
                          Område {exitRoomId}
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
                <h3 className="text-xl font-bold">Fordel skatter</h3>
                <p className="text-sm text-white/60">
                  Velg hvem som skal motta hver gjenstand fra{" "}
                  {selectedRoom.name}.
                </p>
              </div>

              <button
                type="button"
                onClick={closeTreasureModal}
                className="rounded bg-red-500 px-3 py-1 text-sm hover:bg-red-600"
              >
                Lukk
              </button>
            </div>

            <div className="space-y-3">
              {linkedTreasureItems.map((entry) => (
                <div
                  key={entry.key}
                  className="rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <div className="mb-2">
                    <div className="font-semibold text-white">{entry.text}</div>
                    <div className="text-xs text-white/55">
                      {entry.item.name}
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
                Avbryt
              </button>

              <button
                type="button"
                onClick={giveTreasure}
                className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Gi skatter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapViewer;
