import { useEffect, useMemo, useState } from "react";
import {
  deleteCampaignMap,
  updateCampaignMap,
} from "../features/maps/mapService";
import type {
  CampaignMap,
  CampaignMapRoom,
  EnvironmentEffect,
  EnvironmentLevel,
} from "../features/maps/types";

type Props = {
  campaignId: string;
  map: CampaignMap;
  onClose: () => void;
  initialSelectedRoomId?: number | null;
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

  if (original?.environment) {
    room.environment = original.environment;
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

const createEffectId = (name: string, existingIds: string[]) => {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "effect";

  if (!existingIds.includes(base)) {
    return base;
  }

  let suffix = 2;

  while (existingIds.includes(`${base}-${suffix}`)) {
    suffix += 1;
  }

  return `${base}-${suffix}`;
};

const createDefaultEffect = (existingIds: string[]): EnvironmentEffect => ({
  id: createEffectId("Environment", existingIds),
  name: "Environment",

  levels: [
    {
      value: 0,
      name: "Level 0",
    },
    {
      value: 1,
      name: "Level 1",
    },
  ],

  diceSides: 8,

  rollRanges: [
    {
      min: 1,
      max: 4,
      targetLevel: 0,
    },
    {
      min: 5,
      max: 8,
      targetLevel: 1,
    },
  ],

  maxChangePerRoll: 1,
});

const inputClass =
  "w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-white/20";

const textAreaClass =
  "min-h-[110px] w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-white/20";

const labelClass = "mb-2 block text-sm font-medium text-white/85";

const MapEditorModal = ({
  campaignId,
  map,
  onClose,
  initialSelectedRoomId = null,
}: Props) => {
  const [title, setTitle] = useState(map.title);

  const [imageUrl, setImageUrl] = useState(map.imageUrl);

  const [overviewDescriptionText, setOverviewDescriptionText] = useState(
    toMultilineText(map.generalDescription),
  );

  const [overviewReadAloud, setOverviewReadAloud] = useState(
    map.readAloud ?? "",
  );

  const [environmentEffects, setEnvironmentEffects] = useState<
    EnvironmentEffect[]
  >(map.environmentEffects ?? []);

  const [rooms, setRooms] = useState<EditableRoom[]>(
    map.rooms.map(roomToEditable).sort((a, b) => a.id - b.id),
  );

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(
    initialSelectedRoomId,
  );

  const [expandedEffectIds, setExpandedEffectIds] = useState<Set<string>>(
    new Set(),
  );

  const [isSaving, setIsSaving] = useState(false);

  const [isDeletingMap, setIsDeletingMap] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(map.title);
    setImageUrl(map.imageUrl);
    setOverviewDescriptionText(toMultilineText(map.generalDescription));
    setOverviewReadAloud(map.readAloud ?? "");

    setEnvironmentEffects(map.environmentEffects ?? []);
    setExpandedEffectIds(new Set());

    const nextRooms = map.rooms.map(roomToEditable).sort((a, b) => a.id - b.id);

    setRooms(nextRooms);

    setSelectedRoomId(
      initialSelectedRoomId !== null &&
        nextRooms.some((room) => room.id === initialSelectedRoomId)
        ? initialSelectedRoomId
        : null,
    );

    setError(null);
  }, [map, initialSelectedRoomId]);

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

  /*
   * ENVIRONMENT EFFECTS
   */

  const addEnvironmentEffect = () => {
    setEnvironmentEffects((prev) => {
      const newEffect = createDefaultEffect(prev.map((effect) => effect.id));

      setExpandedEffectIds((expanded) => {
        const next = new Set(expanded);
        next.add(newEffect.id);
        return next;
      });

      return [...prev, newEffect];
    });
  };

  const toggleEnvironmentEffect = (effectId: string) => {
    setExpandedEffectIds((prev) => {
      const next = new Set(prev);

      if (next.has(effectId)) {
        next.delete(effectId);
      } else {
        next.add(effectId);
      }

      return next;
    });
  };

  const updateEnvironmentEffect = (
    effectId: string,
    updates: Partial<EnvironmentEffect>,
  ) => {
    setEnvironmentEffects((prev) =>
      prev.map((effect) =>
        effect.id === effectId
          ? {
              ...effect,
              ...updates,
            }
          : effect,
      ),
    );
  };

  const renameEnvironmentEffect = (effectId: string, name: string) => {
    /*
     * The ID deliberately stays unchanged.
     *
     * Area environment state will eventually use:
     *
     * environment: {
     *   [effect.id]: level
     * }
     *
     * Renaming the effect should therefore not
     * invalidate existing room data.
     */
    updateEnvironmentEffect(effectId, {
      name,
    });
  };

  const deleteEnvironmentEffect = (effectId: string) => {
    setEnvironmentEffects((prev) =>
      prev.filter((effect) => effect.id !== effectId),
    );

    setExpandedEffectIds((prev) => {
      const next = new Set(prev);
      next.delete(effectId);
      return next;
    });
  };

  const addEnvironmentLevel = (effectId: string) => {
    setEnvironmentEffects((prev) =>
      prev.map((effect) => {
        if (effect.id !== effectId) {
          return effect;
        }

        const nextValue =
          effect.levels.length > 0
            ? Math.max(...effect.levels.map((level) => level.value)) + 1
            : 0;

        return {
          ...effect,

          levels: [
            ...effect.levels,
            {
              value: nextValue,
              name: `Level ${nextValue}`,
            },
          ],

          rollRanges: [
            ...effect.rollRanges,
            {
              min: effect.diceSides,
              max: effect.diceSides,
              targetLevel: nextValue,
            },
          ],
        };
      }),
    );
  };

  const updateEnvironmentLevel = (
    effectId: string,
    levelValue: number,
    updates: Partial<EnvironmentLevel>,
  ) => {
    setEnvironmentEffects((prev) =>
      prev.map((effect) => {
        if (effect.id !== effectId) {
          return effect;
        }

        return {
          ...effect,

          levels: effect.levels.map((level) =>
            level.value === levelValue
              ? {
                  ...level,
                  ...updates,
                }
              : level,
          ),
        };
      }),
    );
  };

  const removeEnvironmentLevel = (effectId: string, levelValue: number) => {
    setEnvironmentEffects((prev) =>
      prev.map((effect) => {
        if (effect.id !== effectId || effect.levels.length <= 1) {
          return effect;
        }

        const oldLevels = effect.levels.filter(
          (level) => level.value !== levelValue,
        );

        const oldToNew = new Map<number, number>();

        oldLevels.forEach((level, index) => {
          oldToNew.set(level.value, index);
        });

        const remainingLevels = oldLevels.map((level, index) => ({
          ...level,
          value: index,
        }));

        const remainingRanges = effect.rollRanges
          .filter((range) => range.targetLevel !== levelValue)
          .map((range) => ({
            ...range,

            targetLevel: oldToNew.get(range.targetLevel) ?? 0,
          }));

        return {
          ...effect,
          levels: remainingLevels,
          rollRanges: remainingRanges,
        };
      }),
    );
  };

  const updateRollRange = (
    effectId: string,
    targetLevel: number,
    updates: {
      min?: number;
      max?: number;
    },
  ) => {
    setEnvironmentEffects((prev) =>
      prev.map((effect) => {
        if (effect.id !== effectId) {
          return effect;
        }

        const existingRange = effect.rollRanges.find(
          (range) => range.targetLevel === targetLevel,
        );

        const nextRange = {
          min: existingRange?.min ?? 1,

          max: existingRange?.max ?? effect.diceSides,

          targetLevel,

          ...updates,
        };

        return {
          ...effect,

          rollRanges: [
            ...effect.rollRanges.filter(
              (range) => range.targetLevel !== targetLevel,
            ),

            nextRange,
          ].sort((a, b) => a.targetLevel - b.targetLevel),
        };
      }),
    );
  };

  /*
   * AREAS
   */

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

  /*
   * SAVE / DELETE
   */

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const validEffectIds = new Set(
        environmentEffects.map((effect) => effect.id),
      );

      const normalizedRooms: CampaignMapRoom[] = rooms
        .map((room) => {
          const normalized = editableToRoom(
            room,
            originalRoomById.get(room.id),
          );

          /*
           * Preserve environment values belonging
           * to active effects, but remove stale
           * values when an effect has been deleted.
           */
          if (normalized.environment) {
            const cleanedEnvironment = Object.fromEntries(
              Object.entries(normalized.environment).filter(([effectId]) =>
                validEffectIds.has(effectId),
              ),
            );

            if (Object.keys(cleanedEnvironment).length > 0) {
              normalized.environment = cleanedEnvironment;
            } else {
              delete normalized.environment;
            }
          }

          return normalized;
        })
        .sort((a, b) => a.id - b.id);

      await updateCampaignMap(campaignId, map.id, {
        title: title.trim() || "Untitled map",

        imageUrl: imageUrl.trim(),

        rooms: normalizedRooms,

        environmentEffects,

        generalDescription: parseStringLines(overviewDescriptionText),

        readAloud: overviewReadAloud.trim(),
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
              Update map info, environment effects, areas, pins, and notes.
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
              {/* Map settings */}
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

              {/* Environment effects */}
              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-white/65">
                      Environment effects
                    </h3>

                    <p className="mt-1 text-xs text-white/45">
                      Define systems that can change independently in each map
                      area.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addEnvironmentEffect}
                    className="shrink-0 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
                  >
                    <i className="fa-solid fa-plus" /> Add effect
                  </button>
                </div>

                {environmentEffects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-white/55">
                    No environment effects yet. Add one when this map needs a
                    dynamic system such as fog, corruption, weather, or danger.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {environmentEffects.map((effect) => {
                      const isExpanded = expandedEffectIds.has(effect.id);

                      return (
                        <div
                          key={effect.id}
                          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                        >
                          <button
                            type="button"
                            onClick={() => toggleEnvironmentEffect(effect.id)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/5"
                          >
                            <span className="truncate text-sm font-semibold text-white">
                              {effect.name || "Untitled environment"}
                            </span>

                            <i
                              className={`fa-solid fa-chevron-down shrink-0 text-xs text-white/40 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="border-t border-white/10 p-4">
                              <div className="mb-4 flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <label className={labelClass}>
                                    Effect name
                                  </label>

                                  <input
                                    value={effect.name}
                                    onChange={(e) =>
                                      renameEnvironmentEffect(
                                        effect.id,
                                        e.target.value,
                                      )
                                    }
                                    className={inputClass}
                                    placeholder="Fog"
                                  />

                                  <div className="mt-1 text-xs text-white/40">
                                    ID: {effect.id}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteEnvironmentEffect(effect.id)
                                  }
                                  className="mt-7 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                                  title="Delete environment effect"
                                >
                                  <i className="fa-solid fa-trash" />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className={labelClass}>
                                    Die sides
                                  </label>

                                  <input
                                    type="number"
                                    min={2}
                                    value={effect.diceSides}
                                    onChange={(e) =>
                                      updateEnvironmentEffect(effect.id, {
                                        diceSides: Math.max(
                                          2,
                                          Number(e.target.value) || 2,
                                        ),
                                      })
                                    }
                                    className={inputClass}
                                  />
                                </div>

                                <div>
                                  <label className={labelClass}>
                                    Max change / roll
                                  </label>

                                  <input
                                    type="number"
                                    min={0}
                                    value={effect.maxChangePerRoll}
                                    onChange={(e) =>
                                      updateEnvironmentEffect(effect.id, {
                                        maxChangePerRoll: Math.max(
                                          0,
                                          Number(e.target.value) || 0,
                                        ),
                                      })
                                    }
                                    className={inputClass}
                                  />
                                </div>
                              </div>

                              <div className="mt-4">
                                <div className="mb-2 flex items-center justify-between gap-2">
                                  <div>
                                    <div className="text-sm font-medium text-white/85">
                                      Levels and roll ranges
                                    </div>

                                    <div className="text-xs text-white/45">
                                      Each level gets a target range on the d
                                      {effect.diceSides}.
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      addEnvironmentLevel(effect.id)
                                    }
                                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
                                  >
                                    <i className="fa-solid fa-plus" /> Level
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  {effect.levels
                                    .slice()
                                    .sort((a, b) => a.value - b.value)
                                    .map((level) => {
                                      const range = effect.rollRanges.find(
                                        (item) =>
                                          item.targetLevel === level.value,
                                      );

                                      return (
                                        <div
                                          key={level.value}
                                          className="rounded-xl border border-white/10 bg-zinc-950/50 p-3"
                                        >
                                          <div className="mb-2 flex items-center justify-between gap-2">
                                            <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
                                              Level {level.value}
                                            </div>

                                            <button
                                              type="button"
                                              disabled={
                                                effect.levels.length <= 1
                                              }
                                              onClick={() =>
                                                removeEnvironmentLevel(
                                                  effect.id,
                                                  level.value,
                                                )
                                              }
                                              className="rounded-md px-2 py-1 text-xs text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                              Remove
                                            </button>
                                          </div>

                                          <input
                                            value={level.name}
                                            onChange={(e) =>
                                              updateEnvironmentLevel(
                                                effect.id,
                                                level.value,
                                                {
                                                  name: e.target.value,
                                                },
                                              )
                                            }
                                            className={inputClass}
                                            placeholder={`Level ${level.value}`}
                                          />

                                          <div className="mt-2 grid grid-cols-2 gap-2">
                                            <div>
                                              <label className="mb-1 block text-xs text-white/50">
                                                Roll min
                                              </label>

                                              <input
                                                type="number"
                                                min={1}
                                                max={effect.diceSides}
                                                value={range?.min ?? 1}
                                                onChange={(e) =>
                                                  updateRollRange(
                                                    effect.id,
                                                    level.value,
                                                    {
                                                      min: Math.max(
                                                        1,
                                                        Math.min(
                                                          effect.diceSides,
                                                          Number(
                                                            e.target.value,
                                                          ) || 1,
                                                        ),
                                                      ),
                                                    },
                                                  )
                                                }
                                                className={inputClass}
                                              />
                                            </div>

                                            <div>
                                              <label className="mb-1 block text-xs text-white/50">
                                                Roll max
                                              </label>

                                              <input
                                                type="number"
                                                min={1}
                                                max={effect.diceSides}
                                                value={
                                                  range?.max ?? effect.diceSides
                                                }
                                                onChange={(e) =>
                                                  updateRollRange(
                                                    effect.id,
                                                    level.value,
                                                    {
                                                      max: Math.max(
                                                        1,
                                                        Math.min(
                                                          effect.diceSides,
                                                          Number(
                                                            e.target.value,
                                                          ) || 1,
                                                        ),
                                                      ),
                                                    },
                                                  )
                                                }
                                                className={inputClass}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Areas */}
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
                  <button
                    type="button"
                    onClick={() => setSelectedRoomId(null)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      selectedRoomId === null
                        ? "border-white/25 bg-white/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-sm font-semibold text-white">
                      Overview
                    </div>

                    <div className="mt-1 text-xs text-white/55">
                      General map description and read-aloud text
                    </div>
                  </button>

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
                className={`relative w-full bg-black ${
                  selectedRoom ? "cursor-crosshair" : "cursor-default"
                }`}
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
              <div className="space-y-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
                    Overview
                  </div>

                  <h3 className="mt-1 text-lg font-bold text-white">
                    General map information
                  </h3>

                  <p className="mt-1 text-sm text-white/55">
                    Edit information shown when no specific area is selected.
                    While Overview is selected, clicking the map will not add
                    polygon points.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Read aloud</label>

                  <textarea
                    value={overviewReadAloud}
                    onChange={(e) => setOverviewReadAloud(e.target.value)}
                    className={textAreaClass}
                    placeholder="Optional text to read when introducing the map..."
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    General description (one paragraph per line)
                  </label>

                  <textarea
                    value={overviewDescriptionText}
                    onChange={(e) => setOverviewDescriptionText(e.target.value)}
                    className={textAreaClass}
                    placeholder="General notes or description for the whole map..."
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/60">
                  Select an area from the left sidebar or click one of its
                  numbered pins on the map to edit that area. Select Overview
                  again to return here.
                </div>
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
