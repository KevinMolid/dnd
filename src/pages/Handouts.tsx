import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Container";
import H1 from "../components/H1";
import H2 from "../components/H2";
import H4 from "../components/H4";

import { useEncounter } from "../context/EncounterContext";

import { maps } from "../data/handouts/maps";
import { drawings, letters } from "../data/handouts/images";
import type { HandoutImage, MapHandout } from "../data/handouts/types";
import { itemList } from "../data/items";

const Handouts = () => {
  const navigate = useNavigate();
  const { loadEncounterTemplate } = useEncounter();

  const [selectedMap, setSelectedMap] = useState<MapHandout | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<HandoutImage | null>(null);
  const [zoom, setZoom] = useState(1);

  const [openSections, setOpenSections] = useState({
    maps: true,
    items: true,
    drawings: true,
    letters: true,
  });

  const [openItemCategories, setOpenItemCategories] = useState<
    Record<string, boolean>
  >({
    Armor: true,
    Weapon: false,
    Potion: true,
    "Wondrous Item": true,
    Ring: true,
    Scroll: true,
    Staff: true,
    Wand: true,
  });

  const selectedRoom = useMemo(() => {
    if (!selectedMap?.rooms?.length || selectedRoomId === null) return null;
    return selectedMap.rooms.find((room) => room.id === selectedRoomId) ?? null;
  }, [selectedMap, selectedRoomId]);

  const itemsByCategory = useMemo(() => {
    return itemList.reduce<Record<string, typeof itemList>>((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleItemCategory = (category: string) => {
    setOpenItemCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const openMap = (map: MapHandout) => {
    setSelectedMap(map);
    setZoom(1);
    setSelectedRoomId(map.rooms?.[0]?.id ?? null);
  };

  const closeMap = () => {
    setSelectedMap(null);
    setSelectedRoomId(null);
    setZoom(1);
  };

  const openRoomEncounter = () => {
    if (!selectedRoom?.encounterTemplate) return;

    loadEncounterTemplate(selectedRoom.encounterTemplate);
    closeMap();
    navigate("/kamp");
  };

  const openImage = (image: HandoutImage) => {
    setSelectedImage(image);
    setZoom(1);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setZoom(1);
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
    const handleKeyDown = (e: KeyboardEvent) => {
      const hasOpenViewer = selectedMap || selectedImage;
      if (!hasOpenViewer) return;

      if (e.key === "Escape") {
        if (selectedMap) closeMap();
        if (selectedImage) closeImage();
      }

      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMap, selectedImage]);

  return (
    <Container>
      <H1>Handouts</H1>

      <section className="mb-6">
        <button
          type="button"
          onClick={() => toggleSection("maps")}
          className="mb-3 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left hover:bg-white/10"
        >
          <H2>Maps</H2>
          <span className="text-sm text-white/70">
            {openSections.maps ? "Hide" : "Show"}
          </span>
        </button>

        {openSections.maps && (
          <div className="flex gap-2 flex-wrap">
            {maps.map((map) => (
              <div key={map.title}>
                <H4>{map.title}</H4>
                <button
                  type="button"
                  onClick={() => openMap(map)}
                  className="block cursor-pointer"
                >
                  <img
                    className="w-40 aspect-square object-cover rounded hover:opacity-90 transition"
                    src={map.src}
                    alt={map.title}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-6">
        <button
          type="button"
          onClick={() => toggleSection("items")}
          className="mb-3 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left hover:bg-white/10"
        >
          <H2>Items</H2>
          <span className="text-sm text-white/70">
            {openSections.items ? "Hide" : "Show"}
          </span>
        </button>

        {openSections.items && (
          <div className="space-y-4">
            {Object.entries(itemsByCategory).map(([category, items]) => {
              const isOpen = openItemCategories[category] ?? false;

              return (
                <div
                  key={category}
                  className="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <button
                    type="button"
                    onClick={() => toggleItemCategory(category)}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-white/5"
                  >
                    <div className="text-lg font-semibold">
                      {category}{" "}
                      <span className="text-sm font-normal text-white/50">
                        ({items.length})
                      </span>
                    </div>
                    <span className="text-sm text-white/70">
                      {isOpen ? "Hide" : "Show"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg border border-white/10 bg-white/5 p-4"
                        >
                          <div className="mb-1 text-lg font-semibold">
                            {item.name}
                          </div>

                          <div className="mb-2 flex flex-wrap gap-2 text-xs">
                            <span className="rounded bg-white/10 px-2 py-1">
                              {item.category}
                            </span>

                            {item.subtype && (
                              <span className="rounded bg-white/10 px-2 py-1">
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
                          </div>

                          <p className="whitespace-pre-line text-sm leading-6 text-white/75">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-6">
        <button
          type="button"
          onClick={() => toggleSection("drawings")}
          className="mb-3 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left hover:bg-white/10"
        >
          <H2>Drawings</H2>
          <span className="text-sm text-white/70">
            {openSections.drawings ? "Hide" : "Show"}
          </span>
        </button>

        {openSections.drawings && (
          <div className="flex gap-2 flex-wrap">
            {drawings.map((drawing) => (
              <button
                key={drawing.title}
                type="button"
                onClick={() => openImage(drawing)}
                className="block cursor-pointer"
              >
                <img
                  className="w-40 rounded hover:opacity-90 transition"
                  src={drawing.src}
                  alt={drawing.title}
                />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="mb-6">
        <button
          type="button"
          onClick={() => toggleSection("letters")}
          className="mb-3 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left hover:bg-white/10"
        >
          <H2>Letters</H2>
          <span className="text-sm text-white/70">
            {openSections.letters ? "Hide" : "Show"}
          </span>
        </button>

        {openSections.letters && (
          <div className="flex gap-2 flex-wrap">
            {letters.map((letter) => (
              <button
                key={letter.title}
                type="button"
                onClick={() => openImage(letter)}
                className="block cursor-pointer"
              >
                <img
                  className="w-40 rounded hover:opacity-90 transition"
                  src={letter.src}
                  alt={letter.title}
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedMap && (
        <div className="fixed inset-0 z-50 bg-black/80 p-4 md:p-6">
          <div className="flex h-full flex-col overflow-hidden rounded-xl bg-zinc-950 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <div className="text-lg font-semibold">{selectedMap.title}</div>
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
                  onClick={closeMap}
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
                      src={selectedMap.src}
                      alt={selectedMap.title}
                      className="block max-w-none select-none rounded"
                      draggable={false}
                    />

                    {selectedMap.rooms?.flatMap((room) => {
                      const isSelected = selectedRoomId === room.id;

                      return room.markers.map((marker, markerIndex) => (
                        <button
                          key={`${room.id}-${markerIndex}`}
                          type="button"
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-xs font-bold shadow-lg transition
                            ${
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
                {!selectedMap.rooms || selectedMap.rooms.length === 0 ? (
                  <div className="space-y-3">
                    <div className="text-lg font-semibold">
                      No room data yet
                    </div>
                    <p className="text-sm text-white/70">
                      This map does not yet have interactive room markers and
                      notes.
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

                    {selectedRoom.monsters &&
                      selectedRoom.monsters.length > 0 && (
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

                    {selectedRoom.treasure &&
                      selectedRoom.treasure.length > 0 && (
                        <section className="space-y-2">
                          <div className="text-sm font-semibold text-white/90">
                            Skatter
                          </div>
                          <ul className="list-disc space-y-1 pl-5 text-sm text-white/75">
                            {selectedRoom.treasure.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
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
                              onClick={() => setSelectedRoomId(exitRoomId)}
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
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/80"
          onClick={closeImage}
        >
          <div className="flex items-center justify-between bg-black/50 p-4 text-white">
            <div className="font-semibold">{selectedImage.title}</div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  zoomOut();
                }}
                className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
              >
                -
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetZoom();
                }}
                className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  zoomIn();
                }}
                className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
              >
                +
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeImage();
                }}
                className="rounded bg-red-500 px-3 py-1 hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>

          <div
            className="flex flex-1 items-start justify-center overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              e.preventDefault();

              if (e.deltaY < 0) {
                setZoom((prev) => Math.min(prev + 0.1, 4));
              } else {
                setZoom((prev) => Math.max(prev - 0.1, 0.5));
              }
            }}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="h-auto max-w-none select-none"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
              }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default Handouts;
