import { useEffect, useMemo, useState } from "react";
import Container from "../components/Container";
import H1 from "../components/H1";
import H2 from "../components/H2";
import H4 from "../components/H4";

import Description from "../components/Description";

// Maps
import map1 from "/Maps/CragmawHideout.jpg";
import map2 from "/Maps/Phandalin.jpg";
import map3 from "/Maps/CragmawCastle.jpg";
import map4 from "/Maps/RedbrandHideout.jpg";
import map5 from "/Maps/Thundertree.jpg";
import map6 from "/Maps/WaveEchoCave.jpg";

import drawing1 from "/Drawing1.png";
import drawing2 from "/Drawing2.png";
import drawing3 from "/Drawing3.png";
import drawing4 from "/Drawing4.png";
import drawing5 from "/Drawing5.png";

import letter1 from "/Letter1.png";
import letter2 from "/Letter2.png";

type RoomMonster = {
  name: string;
  count?: number;
  notes?: string;
};

type RoomData = {
  id: number;
  name: string;
  x: number; // percentage from left
  y: number; // percentage from top
  readAloud?: string;
  description: React.ReactNode;
  monsters?: RoomMonster[];
  treasure?: string[];
  notes?: string[];
  exits?: number[];
};

type HandoutImage = {
  title: string;
  src: string;
};

type MapHandout = HandoutImage & {
  rooms?: RoomData[];
};

const redbrandHideoutRooms: RoomData[] = [
  {
    id: 1,
    name: "Kjeller",
    x: 82,
    y: 79,
    description: <></>,
    exits: [2, 3, 8],
  },
  {
    id: 2,
    name: "Barracks",
    x: 58,
    y: 69,
    description: <></>,
    exits: [2, 3],
  },
  {
    id: 3,
    name: "Barracks",
    x: 88,
    y: 54,
    description: <></>,
    exits: [2, 3],
  },
  {
    id: 4,
    name: "Barracks",
    x: 62,
    y: 45,
    description: <></>,
    exits: [2, 3],
  },
  {
    id: 5,
    name: "Barracks",
    x: 72,
    y: 31,
    description: <></>,
    exits: [2, 3],
  },
  {
    id: 6,
    name: "Barracks",
    x: 60,
    y: 21,
    description: <></>,
    exits: [2, 3],
  },
  {
    id: 7,
    name: "Barracks",
    x: 42,
    y: 21,
    description: <></>,
    exits: [2, 3],
  },
  {
    id: 8,
    name: "Barracks",
    x: 32,
    y: 59,
    description: <></>,
    exits: [2, 3],
  },
  {
    id: 9,
    name: "Barracks",
    x: 15,
    y: 83,
    description: <></>,
    exits: [2, 3],
  },
  {
    id: 10,
    name: "Barracks",
    x: 15,
    y: 50,
    description: <></>,
    exits: [2, 3],
  },
  {
    id: 11,
    name: "Barracks",
    x: 15,
    y: 26,
    description: <></>,
    exits: [2, 3],
  },
  {
    id: 12,
    name: "Barracks",
    x: 25,
    y: 21,
    description: <></>,
    exits: [2, 3],
  },
];

const waveEchoRooms: RoomData[] = [
  {
    id: 1,
    name: "Huleinngangen",
    x: 23,
    y: 76,
    description: (
      <>
        <p className="mb-4">
          Enten karakterene følger Gundrens kart eller får veibeskrivelse til
          Wave Echo Cave fra en annen kilde, vil deres første tilnærming føre
          dem til en smal tunnel med inngang skjult i foten av Sword Mountains.
        </p>
        <Description>
          <p className="mb-2">
            Inngangstunnelen leder inn i en stor grotte, støttet av en naturlig
            steinsøyle og med tre stalagmitter som reiser seg fra gulvet. I den
            vestlige delen av hulen, bak steinsøylen, ligger tre soveposer og en
            haug med vanlige forsyninger — sekker med mel, poser med salt,
            tønner med saltet kjøtt, lanterner, flasker med lampeolje, hakker,
            spader og annet utstyr. Blant forsyningene ser dere kroppen til en
            dverggruvearbeider, død i minst en uke.
          </p>
          <p>
            Den nordøstlige delen av grotten har rast sammen og danner en grop
            som er omtrent tre meter bred og seks meter dyp. Et solid hampetau
            er bundet fast rundt en stalagmitt i nærheten og henger ned langs
            siden av gropen. På bunnen av gropen fører en grovt uthugget tunnel
            videre mot nordvest og øst.
          </p>
        </Description>
        <p className="mb-2">
          Dette var leirplassen til Rockseeker-brødrene. Den døde dvergen er
          Tharden, Gundrens bror, som ble drept av Den svarte edderkoppen.
          Gundrens andre bror, Nundro, var også her og er nå fange hos Den
          svarte edderkoppen i område 20.
        </p>
        <p className="mb-2">
          Dvergenes forsyninger kan være nyttige, men de er ikke spesielt
          verdifulle.
        </p>
        <p className="mb-2">
          <strong>Åpen grop.</strong> Å klatre opp eller ned veggen i gropen
          uten tau krever en vellykket Styrke (Athletics)-sjekk, DC 15. En
          karakter som mislykkes med sjekken med 5 eller mer, faller ned og tar
          1d6 knusningsskade per 3 meter fall, og lander liggende nederst i
          gropen. Tunnelen på bunnen av gropen leder mot nordvest til område 2
          og mot øst til område 3.
        </p>
      </>
    ),
    treasure: [
      "Tharden bærer et par Boots of Striding and Springing. I sin hast med å utforske resten av Wave Echo Cave overså Nezznar dem.",
    ],
    exits: [2, 3],
  },
  {
    id: 2,
    name: "Gruvetunneler",
    x: 25,
    y: 60,
    description: (
      <>
        <p className="mb-4">
          Dette nettverket av ganger er en gammel del av det opprinnelige
          gruveområdet i Wave Echo Cave.
        </p>

        <Description>
          Området består av en rekke kryssende tunneler. Taket her er bare rundt
          to meter høyt, og flere av gangene ender i delvis uthugde bergvegger.
        </Description>

        <p>
          Blindgangene er steder hvor gruvearbeiderne ga opp utgravingen og
          bestemte seg for å lete videre andre steder. I en av disse lurer en
          okergelé (ochre jelly). Når gruppen kommer inn i denne delen av
          gruven, begynner gelen å snike seg etter dem og venter instinktivt på
          en mulighet til å angripe et enslig mål.
        </p>
      </>
    ),
    monsters: [{ name: "Ochre jelly", count: 1 }],
    exits: [1, 3, 6, 9, 10],
  },
  {
    id: 3,
    name: "Storeroom",
    x: 50,
    y: 76,
    description:
      "Broken crates, torn sacks, and ruined mining supplies are scattered here. Most useful contents were taken long ago.",
    treasure: ["Possibly a few salvageable tools or minor supplies"],
    exits: [2],
  },
  {
    id: 4,
    name: "Old Guard Room",
    x: 42,
    y: 84,
    readAloud:
      "Dusty pallets, broken stools, and old weapon racks fill this chamber. Though most of the room is in disrepair, there are signs of recent occupation.",
    description:
      "This room appears to have once housed guards or workers. The old furniture is decayed, but tracks and disturbed dust suggest that creatures have used the area recently.",
    monsters: [
      {
        name: "Ghoul",
        count: 3,
        notes: "They attack living creatures immediately.",
      },
    ],
    notes: [
      "This room works well as an early tension-building encounter.",
      "You can describe claw marks, old bones, or the smell of decay before combat begins.",
    ],
    exits: [2, 5],
  },
  {
    id: 5,
    name: "Collapsed Chamber",
    x: 61,
    y: 82,
    description:
      "A portion of the ceiling has fallen here, leaving a heap of broken stone and debris. Movement through parts of the room is difficult.",
    notes: ["Good place for a hazard, tracks, or environmental storytelling."],
    exits: [4, 6],
  },
  {
    id: 6,
    name: "Temple Ruins",
    x: 50,
    y: 62,
    description:
      "Ancient stonework and cracked decorative features suggest this was once a place of significance within the mine.",
    notes: ["Good place for lore, inscriptions, or magical residue."],
    exits: [5, 7],
  },
  {
    id: 7,
    name: "The Forge of Spells",
    x: 65,
    y: 62,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [6],
  },
  {
    id: 8,
    name: "The Forge of Spells",
    x: 74,
    y: 68,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [3, 13],
  },
  {
    id: 9,
    name: "The Forge of Spells",
    x: 53,
    y: 50,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [7, 11, 12],
  },
  {
    id: 10,
    name: "The Forge of Spells",
    x: 16,
    y: 30,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [2, 11, 18],
  },
  {
    id: 11,
    name: "The Forge of Spells",
    x: 34,
    y: 31,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [10, 12, 18],
  },
  {
    id: 12,
    name: "The Forge of Spells",
    x: 63,
    y: 35,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 13,
    name: "The Forge of Spells",
    x: 82,
    y: 51,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 14,
    name: "The Forge of Spells",
    x: 89,
    y: 54,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 15,
    name: "The Forge of Spells",
    x: 87,
    y: 43,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 16,
    name: "The Forge of Spells",
    x: 77,
    y: 18,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 17,
    name: "The Forge of Spells",
    x: 49,
    y: 10,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 18,
    name: "The Forge of Spells",
    x: 36,
    y: 21,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 19,
    name: "The Forge of Spells",
    x: 13,
    y: 13,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 20,
    name: "The Forge of Spells",
    x: 23,
    y: 9,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
];

const maps: MapHandout[] = [
  { title: "Cragmaw Hideout", src: map1, rooms: [] },
  { title: "Phandalin", src: map2, rooms: [] },
  { title: "Cragmaw Castle", src: map3, rooms: [] },
  { title: "Redbrand Hideout", src: map4, rooms: redbrandHideoutRooms },
  { title: "Thundertree", src: map5, rooms: [] },
  { title: "Wave Echo Cave", src: map6, rooms: waveEchoRooms },
];

const drawings: HandoutImage[] = [
  { title: "Drawing 1", src: drawing1 },
  { title: "Drawing 2", src: drawing2 },
  { title: "Drawing 3", src: drawing3 },
  { title: "Drawing 4", src: drawing4 },
  { title: "Drawing 5", src: drawing5 },
];

const letters: HandoutImage[] = [
  { title: "Letter 1", src: letter1 },
  { title: "Letter 2", src: letter2 },
];

const Handouts = () => {
  const [selectedMap, setSelectedMap] = useState<MapHandout | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const [selectedImage, setSelectedImage] = useState<HandoutImage | null>(null);

  const [zoom, setZoom] = useState(1);

  const selectedRoom = useMemo(() => {
    if (!selectedMap?.rooms?.length || selectedRoomId === null) return null;
    return selectedMap.rooms.find((room) => room.id === selectedRoomId) ?? null;
  }, [selectedMap, selectedRoomId]);

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

      <H2>Maps</H2>
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

      <H2>Items</H2>

      <H2>Drawings</H2>
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

      <H2>Letters</H2>
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

                    {selectedMap.rooms?.map((room) => {
                      const isSelected = selectedRoomId === room.id;

                      return (
                        <button
                          key={room.id}
                          type="button"
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-xs font-bold shadow-lg transition
                            ${
                              isSelected
                                ? "h-9 w-9 border-white bg-red-500 text-white"
                                : "h-8 w-8 border-red-500 bg-stone-100 text-red-600 hover:bg-white"
                            }`}
                          style={{
                            left: `${room.x}%`,
                            top: `${room.y}%`,
                          }}
                          title={`${room.id}. ${room.name}`}
                        >
                          {room.id}
                        </button>
                      );
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

                    <section className="space-y-2">
                      <p className="text-sm leading-6 text-white/75">
                        {selectedRoom.description}
                      </p>
                    </section>

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
