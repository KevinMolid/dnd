import { useEffect, useMemo, useState } from "react";
import {
  deleteCampaignMap,
  updateCampaignMap,
} from "../features/maps/mapService";
import type { CampaignMap, CampaignMapRoom } from "../features/maps/types";

type Props = {
  campaignId: string;
  map: CampaignMap;
  onClose: () => void;
};

type MapPoint = {
  x: number;
  y: number;
};

type EditableRoom = {
  id: number;
  name: string;
  markers: MapPoint[];
  pin?: MapPoint;
  readAloud: string;
  descriptionText: string;
  developmentsText: string;
  captivesText: string;
  treasureText: string;
  monstersText: string;
  notesText: string;
  exitsText: string;
  experience: string;
};

const toMultilineText = (value?: string[]) => (value ?? []).join("\n");

const parseStringLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const parseExits = (value: string) =>
  value
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((num) => Number.isFinite(num));

const parseMonsters = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.+?)\s*\|\s*(\d+)(?:\s*\|\s*(.+))?$/);

      if (!match) {
        return {
          name: line,
          count: 1,
        };
      }

      const monster: {
        name: string;
        count?: number;
        notes?: string;
      } = {
        name: match[1].trim(),
        count: Number(match[2]),
      };

      const notes = match[3]?.trim();

      if (notes) {
        monster.notes = notes;
      }

      return monster;
    });

const getDefaultPinPosition = (markers: MapPoint[]): MapPoint => {
  if (markers.length === 0) {
    return {
      x: 50,
      y: 50,
    };
  }

  return {
    x: markers.reduce((sum, point) => sum + point.x, 0) / markers.length,

    y: markers.reduce((sum, point) => sum + point.y, 0) / markers.length,
  };
};

const roomToEditable = (room: CampaignMapRoom): EditableRoom => ({
  id: room.id,
  name: room.name,
  markers: room.markers ?? [],
  pin: room.pin,
  readAloud: room.readAloud ?? "",
  descriptionText: toMultilineText(room.description),
  developmentsText: toMultilineText(room.developments),
  captivesText: toMultilineText(room.captives),
  treasureText: toMultilineText(room.treasure),
  monstersText: (room.monsters ?? [])
    .map((monster) =>
      [monster.name, monster.count ?? 1, monster.notes ?? ""]
        .filter((part) => part !== "")
        .join(" | "),
    )
    .join("\n"),
  notesText: toMultilineText(room.notes),
  exitsText: (room.exits ?? []).join(", "),
  experience: room.experience ?? "",
});

const editableToRoom = (
  editable: EditableRoom,
  original?: CampaignMapRoom,
): CampaignMapRoom => {
  const room: CampaignMapRoom = {
    id: editable.id,
    name: editable.name.trim() || `Room ${editable.id}`,
    markers: editable.markers,
    description: parseStringLines(editable.descriptionText),
    developments: parseStringLines(editable.developmentsText),
    captives: parseStringLines(editable.captivesText),
    treasure: parseStringLines(editable.treasureText),
    monsters: parseMonsters(editable.monstersText),
    notes: parseStringLines(editable.notesText),
    exits: parseExits(editable.exitsText),
    encounterTemplate: original?.encounterTemplate ?? null,
  };

  if (editable.pin) {
    room.pin = editable.pin;
  }

  const readAloud = editable.readAloud.trim();

  if (readAloud) {
    room.readAloud = readAloud;
  }

  const experience = editable.experience.trim();

  if (experience) {
    room.experience = experience;
  }

  return room;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-white/20";

const textAreaClass =
  "min-h-[110px] w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-white/20";

const labelClass = "mb-2 block text-sm font-medium text-white/85";

const MapEditorModal = ({ campaignId, map, onClose }: Props) => {
  const [title, setTitle] = useState(map.title);

  const [imageUrl, setImageUrl] = useState(map.imageUrl);

  const [rooms, setRooms] = useState<EditableRoom[]>(
    map.rooms.map(roomToEditable).sort((a, b) => a.id - b.id),
  );

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(
    map.rooms[0]?.id ?? null,
  );

  const [isSaving, setIsSaving] = useState(false);

  const [isDeletingMap, setIsDeletingMap] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(map.title);
    setImageUrl(map.imageUrl);

    const nextRooms = map.rooms.map(roomToEditable).sort((a, b) => a.id - b.id);

    setRooms(nextRooms);

    setSelectedRoomId(nextRooms[0]?.id ?? null);

    setError(null);
  }, [map]);

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) ?? null,
    [rooms, selectedRoomId],
  );

  const originalRoomById = useMemo(() => {
    const roomMap = new Map<number, CampaignMapRoom>();

    map.rooms.forEach((room) => {
      roomMap.set(room.id, room);
    });

    return roomMap;
  }, [map.rooms]);

  const updateSelectedRoom = (updates: Partial<EditableRoom>) => {
    if (selectedRoomId === null) {
      return;
    }

    setRooms((prev) =>
      prev.map((room) =>
        room.id === selectedRoomId
          ? {
              ...room,
              ...updates,
            }
          : room,
      ),
    );
  };

  const addRoom = () => {
    const nextId =
      rooms.length > 0 ? Math.max(...rooms.map((room) => room.id)) + 1 : 1;

    const newRoom: EditableRoom = {
      id: nextId,
      name: `Room ${nextId}`,
      markers: [],
      pin: undefined,
      readAloud: "",
      descriptionText: "",
      developmentsText: "",
      captivesText: "",
      treasureText: "",
      monstersText: "",
      notesText: "",
      exitsText: "",
      experience: "",
    };

    setRooms((prev) => [...prev, newRoom].sort((a, b) => a.id - b.id));

    setSelectedRoomId(nextId);
  };

  const deleteSelectedRoom = () => {
    if (!selectedRoom) {
      return;
    }

    const confirmed = window.confirm(
      `Delete room ${selectedRoom.id} - ${selectedRoom.name}?`,
    );

    if (!confirmed) {
      return;
    }

    setRooms((prev) => {
      const remaining = prev
        .filter((room) => room.id !== selectedRoom.id)
        .map((room) => {
          const exits = parseExits(room.exitsText).filter(
            (exitId) => exitId !== selectedRoom.id,
          );

          return {
            ...room,
            exitsText: exits.join(", "),
          };
        })
        .sort((a, b) => a.id - b.id);

      setSelectedRoomId(remaining[0]?.id ?? null);

      return remaining;
    });
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedRoom) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const x = Number(
      (((event.clientX - rect.left) / rect.width) * 100).toFixed(2),
    );

    const y = Number(
      (((event.clientY - rect.top) / rect.height) * 100).toFixed(2),
    );

    updateSelectedRoom({
      markers: [
        ...selectedRoom.markers,
        {
          x,
          y,
        },
      ],
    });
  };

  const undoLastAreaPoint = () => {
    if (!selectedRoom) {
      return;
    }

    updateSelectedRoom({
      markers: selectedRoom.markers.slice(0, -1),
    });
  };

  const clearArea = () => {
    if (!selectedRoom) {
      return;
    }

    updateSelectedRoom({
      markers: [],
      pin: undefined,
    });
  };

  const resetPin = () => {
    if (!selectedRoom) {
      return;
    }

    updateSelectedRoom({
      pin: undefined,
    });
  };

  const handlePinPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    roomId: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const mapElement = event.currentTarget.parentElement;

    if (!mapElement) {
      return;
    }

    const rect = mapElement.getBoundingClientRect();

    const updatePinFromPointer = (clientX: number, clientY: number) => {
      const x = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100),
      );

      const y = Math.max(
        0,
        Math.min(100, ((clientY - rect.top) / rect.height) * 100),
      );

      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId
            ? {
                ...room,
                pin: {
                  x: Number(x.toFixed(2)),
                  y: Number(y.toFixed(2)),
                },
              }
            : room,
        ),
      );
    };

    updatePinFromPointer(event.clientX, event.clientY);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      updatePinFromPointer(moveEvent.clientX, moveEvent.clientY);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);

    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const normalizedRooms: CampaignMapRoom[] = rooms
        .map((room) => editableToRoom(room, originalRoomById.get(room.id)))
        .sort((a, b) => a.id - b.id);

      await updateCampaignMap(campaignId, map.id, {
        title: title.trim() || "Untitled map",
        imageUrl: imageUrl.trim(),
        rooms: normalizedRooms,
      });

      onClose();
    } catch (err) {
      console.error("Failed to save map:", err);

      setError("Failed to save map.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMap = async () => {
    const confirmed = window.confirm(
      `Delete map "${map.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeletingMap(true);

      setError(null);

      await deleteCampaignMap(campaignId, map.id);

      onClose();
    } catch (err) {
      console.error("Failed to delete map:", err);

      setError("Failed to delete map.");
    } finally {
      setIsDeletingMap(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 p-4 md:p-6">
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 md:px-6">
          <div>
            <h2 className="text-xl font-bold">Edit map</h2>

            <p className="text-sm text-white/55">
              Update map info, areas, pins, and notes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDeleteMap}
              disabled={isDeletingMap || isSaving}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
            >
              {isDeletingMap ? "Deleting..." : "Delete map"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isDeletingMap || isSaving}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isDeletingMap}
              className="shrink-0 rounded-xl bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="border-b border-red-500/15 bg-red-500/10 px-4 py-3 text-sm text-red-300 md:px-6">
            {error}
          </div>
        )}

        {/* Main layout */}
        <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)_420px]">
          {/* Left sidebar */}
          <aside className="min-h-0 overflow-auto border-b border-white/10 bg-zinc-950 p-4 xl:border-b-0 xl:border-r">
            <div className="space-y-5">
              <section>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Title</label>

                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Image URL</label>

                    <input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-white/65">
                    Areas
                  </h3>

                  <button
                    type="button"
                    onClick={addRoom}
                    className="shrink-0 rounded-xl bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600"
                  >
                    <i className="fa-solid fa-plus" /> Add area
                  </button>
                </div>

                <div className="space-y-2">
                  {rooms.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-white/55">
                      No areas yet.
                    </div>
                  ) : (
                    rooms.map((room) => {
                      const isSelected = selectedRoomId === room.id;

                      return (
                        <button
                          key={room.id}
                          type="button"
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`w-full rounded-2xl border p-3 text-left transition ${
                            isSelected
                              ? "border-white/25 bg-white/10"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="text-sm font-semibold text-white">
                            {room.id}. {room.name}
                          </div>

                          <div className="mt-1 text-xs text-white/55">
                            {room.markers.length} boundary point
                            {room.markers.length === 1 ? "" : "s"}
                            {room.pin ? " • custom pin" : ""}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </section>
            </div>
          </aside>

          {/* Map */}
          <section className="min-h-0 overflow-auto border-b border-white/10 bg-zinc-900 xl:border-b-0 xl:border-r">
            {imageUrl ? (
              <div
                className="relative w-full cursor-crosshair bg-black"
                onClick={handleMapClick}
              >
                <img
                  src={imageUrl}
                  alt={title}
                  className="block h-auto w-full select-none"
                  draggable={false}
                />

                {/* Area polygons */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {rooms.map((room) => {
                    if (room.markers.length < 3) {
                      return null;
                    }

                    const isSelected = room.id === selectedRoomId;

                    const polygonPoints = room.markers
                      .map((point) => `${point.x},${point.y}`)
                      .join(" ");

                    return (
                      <polygon
                        key={room.id}
                        points={polygonPoints}
                        fill={
                          isSelected
                            ? "rgba(239, 68, 68, 0.28)"
                            : "rgba(255, 255, 255, 0.06)"
                        }
                        stroke={
                          isSelected
                            ? "rgb(239, 68, 68)"
                            : "rgba(255, 255, 255, 0.35)"
                        }
                        strokeWidth={isSelected ? 0.6 : 0.3}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}

                  {/* Selected area's unfinished outline */}
                  {selectedRoom && selectedRoom.markers.length >= 2 && (
                    <polyline
                      points={selectedRoom.markers
                        .map((point) => `${point.x},${point.y}`)
                        .join(" ")}
                      fill="none"
                      stroke="rgb(239, 68, 68)"
                      strokeWidth="0.5"
                      strokeDasharray="1.5 1"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}

                  {/* Selected area's vertices */}
                  {selectedRoom?.markers.map((point, index) => (
                    <g key={index}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="1"
                        fill="white"
                        stroke="rgb(239, 68, 68)"
                        strokeWidth="0.45"
                        vectorEffect="non-scaling-stroke"
                      />

                      <text
                        x={point.x}
                        y={point.y - 1.8}
                        textAnchor="middle"
                        fontSize="2"
                        fill="white"
                        stroke="black"
                        strokeWidth="0.25"
                        paintOrder="stroke"
                      >
                        {index + 1}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Area pins */}
                {rooms.map((room) => {
                  if (room.markers.length < 3) {
                    return null;
                  }

                  const defaultPin = getDefaultPinPosition(room.markers);

                  const pinPosition = room.pin ?? defaultPin;

                  const isSelected = room.id === selectedRoomId;

                  return (
                    <button
                      key={`label-${room.id}`}
                      type="button"
                      onPointerDown={(event) =>
                        handlePinPointerDown(event, room.id)
                      }
                      onClick={(event) => {
                        event.stopPropagation();

                        setSelectedRoomId(room.id);
                      }}
                      className={`absolute z-20 flex -translate-x-1/2 -translate-y-1/2 touch-none select-none items-center justify-center rounded-full border text-xs font-bold shadow-lg transition ${
                        isSelected
                          ? "h-9 w-9 cursor-grab border-white bg-red-500 text-white active:cursor-grabbing"
                          : "h-8 w-8 cursor-grab border-white/70 bg-zinc-950/80 text-white hover:bg-zinc-800 active:cursor-grabbing"
                      }`}
                      style={{
                        left: `${pinPosition.x}%`,
                        top: `${pinPosition.y}%`,
                      }}
                      title={`${room.id}. ${room.name} — drag to move pin`}
                    >
                      {room.id}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="m-4 rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/55">
                Add an image URL to start drawing areas.
              </div>
            )}
          </section>

          {/* Right sidebar */}
          <aside className="min-h-0 overflow-auto bg-zinc-950 p-4">
            {!selectedRoom ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-white/55">
                Select an area to edit it.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">
                      Area {selectedRoom.id}
                    </h3>

                    <p className="text-sm text-white/55">
                      Edit content, connections, boundary, and pin position.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={deleteSelectedRoom}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                  >
                    Delete area
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Area ID</label>

                    <input
                      type="number"
                      value={selectedRoom.id}
                      onChange={(e) =>
                        updateSelectedRoom({
                          id: Number(e.target.value) || selectedRoom.id,
                        })
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Area name</label>

                    <input
                      value={selectedRoom.name}
                      onChange={(e) =>
                        updateSelectedRoom({
                          name: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Map area */}
                <div>
                  <label className={labelClass}>Map area</label>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm leading-6 text-white/60">
                      Click around the boundary of this area on the map. At
                      least three points are required.
                    </p>

                    <div className="mt-3 text-sm font-medium text-white/85">
                      {selectedRoom.markers.length} boundary point
                      {selectedRoom.markers.length === 1 ? "" : "s"}
                    </div>

                    {selectedRoom.markers.length < 3 && (
                      <div className="mt-2 text-xs text-yellow-300/80">
                        Add at least {3 - selectedRoom.markers.length} more
                        point
                        {3 - selectedRoom.markers.length === 1 ? "" : "s"} to
                        create the area.
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={selectedRoom.markers.length === 0}
                        onClick={undoLastAreaPoint}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <i className="fa-solid fa-rotate-left" /> Undo point
                      </button>

                      <button
                        type="button"
                        disabled={selectedRoom.markers.length === 0}
                        onClick={clearArea}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <i className="fa-solid fa-trash" /> Clear area
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pin position */}
                <div>
                  <label className={labelClass}>Area pin</label>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm leading-6 text-white/60">
                      Drag the numbered pin directly on the map to move it.
                    </p>

                    <div className="mt-3 text-xs text-white/55">
                      {selectedRoom.pin
                        ? `Custom position: x ${selectedRoom.pin.x}, y ${selectedRoom.pin.y}`
                        : "Using automatic center position."}
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        disabled={!selectedRoom.pin}
                        onClick={resetPin}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <i className="fa-solid fa-location-dot" /> Reset pin to
                        center
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Read aloud</label>

                  <textarea
                    value={selectedRoom.readAloud}
                    onChange={(e) =>
                      updateSelectedRoom({
                        readAloud: e.target.value,
                      })
                    }
                    className={textAreaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Description (one paragraph per line)
                  </label>

                  <textarea
                    value={selectedRoom.descriptionText}
                    onChange={(e) =>
                      updateSelectedRoom({
                        descriptionText: e.target.value,
                      })
                    }
                    className={textAreaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Developments (one line per entry)
                  </label>

                  <textarea
                    value={selectedRoom.developmentsText}
                    onChange={(e) =>
                      updateSelectedRoom({
                        developmentsText: e.target.value,
                      })
                    }
                    className={textAreaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Captives (one line per entry)
                  </label>

                  <textarea
                    value={selectedRoom.captivesText}
                    onChange={(e) =>
                      updateSelectedRoom({
                        captivesText: e.target.value,
                      })
                    }
                    className={textAreaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Treasure (one line per entry)
                  </label>

                  <textarea
                    value={selectedRoom.treasureText}
                    onChange={(e) =>
                      updateSelectedRoom({
                        treasureText: e.target.value,
                      })
                    }
                    className={textAreaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Monsters (format: Name | Count | Notes)
                  </label>

                  <textarea
                    value={selectedRoom.monstersText}
                    onChange={(e) =>
                      updateSelectedRoom({
                        monstersText: e.target.value,
                      })
                    }
                    className={textAreaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Notes (one line per entry)
                  </label>

                  <textarea
                    value={selectedRoom.notesText}
                    onChange={(e) =>
                      updateSelectedRoom({
                        notesText: e.target.value,
                      })
                    }
                    className={textAreaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Exits (comma separated room ids)
                  </label>

                  <input
                    value={selectedRoom.exitsText}
                    onChange={(e) =>
                      updateSelectedRoom({
                        exitsText: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Experience</label>

                  <textarea
                    value={selectedRoom.experience}
                    onChange={(e) =>
                      updateSelectedRoom({
                        experience: e.target.value,
                      })
                    }
                    className={textAreaClass}
                  />
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MapEditorModal;
