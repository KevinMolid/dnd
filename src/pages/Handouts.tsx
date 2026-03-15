import { useEffect, useMemo, useState } from "react";
import Container from "../components/Container";
import H1 from "../components/H1";
import H2 from "../components/H2";
import H4 from "../components/H4";
import MapViewer from "../components/MapViewer";

import { maps } from "../data/handouts/maps";
import { drawings, letters } from "../data/handouts/images";
import type { HandoutImage, MapHandout } from "../data/handouts/types";
import { itemList } from "../data/items";

const Handouts = () => {
  const [selectedMap, setSelectedMap] = useState<MapHandout | null>(null);
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
  };

  const closeMap = () => {
    setSelectedMap(null);
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
    const hasOpenViewer = !!selectedImage;
    if (!hasOpenViewer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeImage();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

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

      <MapViewer map={selectedMap} onClose={closeMap} />

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
