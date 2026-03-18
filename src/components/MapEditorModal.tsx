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

type EditableRoom = {
  id: number;
  name: string;
  markers: { x: number; y: number }[];
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
        return { name: line, count: 1 };
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

const roomToEditable = (room: CampaignMapRoom): EditableRoom => ({
  id: room.id,
  name: room.name,
  markers: room.markers ?? [],
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
  const [order, setOrder] = useState(String(map.order ?? 0));
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
    setOrder(String(map.order ?? 0));
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
    map.rooms.forEach((room) => roomMap.set(room.id, room));
    return roomMap;
  }, [map.rooms]);

  const updateSelectedRoom = (updates: Partial<EditableRoom>) => {
    if (selectedRoomId === null) return;

    setRooms((prev) =>
      prev.map((room) =>
        room.id === selectedRoomId ? { ...room, ...updates } : room,
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
    if (!selectedRoom) return;

    const confirmed = window.confirm(
      `Delete room ${selectedRoom.id} - ${selectedRoom.name}?`,
    );

    if (!confirmed) return;

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

  const removeMarker = (markerIndex: number) => {
    if (!selectedRoom) return;

    updateSelectedRoom({
      markers: selectedRoom.markers.filter((_, index) => index !== markerIndex),
    });
  };

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedRoom) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Number(
      (((event.clientX - rect.left) / rect.width) * 100).toFixed(2),
    );
    const y = Number(
      (((event.clientY - rect.top) / rect.height) * 100).toFixed(2),
    );

    updateSelectedRoom({
      markers: [...selectedRoom.markers, { x, y }],
    });
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
        order: Number(order) || 0,
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

    if (!confirmed) return;

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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 md:px-6">
          <div>
            <h2 className="text-xl font-bold">Edit map</h2>
            <p className="text-sm text-white/55">
              Update map info, rooms, markers, and notes.
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
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>

        {error && (
          <div className="border-b border-red-500/15 bg-red-500/10 px-4 py-3 text-sm text-red-300 md:px-6">
            {error}
          </div>
        )}

        <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)_420px]">
          <aside className="min-h-0 overflow-auto border-b border-white/10 bg-zinc-950 p-4 xl:border-b-0 xl:border-r">
            <div className="space-y-5">
              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/65">
                  Map settings
                </h3>

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

                  <div>
                    <label className={labelClass}>Order</label>
                    <input
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      className={inputClass}
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-white/65">
                    Rooms
                  </h3>

                  <button
                    type="button"
                    onClick={addRoom}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    Add room
                  </button>
                </div>

                <div className="space-y-2">
                  {rooms.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-white/55">
                      No rooms yet.
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
                            {room.markers.length} marker
                            {room.markers.length === 1 ? "" : "s"}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </section>
            </div>
          </aside>

          <section className="min-h-0 overflow-auto border-b border-white/10 bg-zinc-900 p-4 xl:border-b-0 xl:border-r">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-white/65">
                  Marker editor
                </h3>
                <p className="mt-1 text-sm text-white/55">
                  Select a room, then click the image to add markers.
                </p>
              </div>

              {imageUrl ? (
                <div
                  className="relative inline-block w-full overflow-hidden rounded-2xl border border-white/10 bg-black"
                  onClick={handleMapClick}
                >
                  <img
                    src={imageUrl}
                    alt={title}
                    className="block w-full select-none"
                    draggable={false}
                  />

                  {rooms.flatMap((room) =>
                    room.markers.map((marker, markerIndex) => {
                      const isSelected = room.id === selectedRoomId;

                      return (
                        <button
                          key={`${room.id}-${markerIndex}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoomId(room.id);
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-xs font-bold shadow-lg ${
                            isSelected
                              ? "h-9 w-9 border-white bg-red-500 text-white"
                              : "h-8 w-8 border-red-500 bg-stone-100 text-red-600"
                          }`}
                          style={{
                            left: `${marker.x}%`,
                            top: `${marker.y}%`,
                          }}
                          title={`${room.id}. ${room.name}`}
                        >
                          {room.id}
                        </button>
                      );
                    }),
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/55">
                  Add an image URL to start placing markers.
                </div>
              )}
            </div>
          </section>

          <aside className="min-h-0 overflow-auto bg-zinc-950 p-4">
            {!selectedRoom ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-white/55">
                Select a room to edit it.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">
                      Room {selectedRoom.id}
                    </h3>
                    <p className="text-sm text-white/55">
                      Edit content and connections.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={deleteSelectedRoom}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                  >
                    Delete room
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Room ID</label>
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
                    <label className={labelClass}>Room name</label>
                    <input
                      value={selectedRoom.name}
                      onChange={(e) =>
                        updateSelectedRoom({ name: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Read aloud</label>
                  <textarea
                    value={selectedRoom.readAloud}
                    onChange={(e) =>
                      updateSelectedRoom({ readAloud: e.target.value })
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
                      updateSelectedRoom({ descriptionText: e.target.value })
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
                      updateSelectedRoom({ developmentsText: e.target.value })
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
                      updateSelectedRoom({ captivesText: e.target.value })
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
                      updateSelectedRoom({ treasureText: e.target.value })
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
                      updateSelectedRoom({ monstersText: e.target.value })
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
                      updateSelectedRoom({ notesText: e.target.value })
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
                      updateSelectedRoom({ exitsText: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Experience</label>
                  <textarea
                    value={selectedRoom.experience}
                    onChange={(e) =>
                      updateSelectedRoom({ experience: e.target.value })
                    }
                    className={textAreaClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Markers</label>

                  {selectedRoom.markers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-white/55">
                      No markers yet. Click the map image to add one.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedRoom.markers.map((marker, index) => (
                        <div
                          key={`${marker.x}-${marker.y}-${index}`}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                        >
                          <span className="text-white/80">
                            Marker {index + 1}: x {marker.x}, y {marker.y}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeMarker(index)}
                            className="rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
