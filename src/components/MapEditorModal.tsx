import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import RichTextEditor from "../features/richText/RichTextEditor";
import useMonsterLibrary from "../hooks/useMonsterLibrary";
import { allItems, itemsById } from "../rulesets/dnd/dnd2024/data/items";
import type { CampaignItem } from "../rulesets/dnd/dnd2024/types";
import {
  deleteCampaignMap,
  updateCampaignMap,
} from "../features/maps/mapService";

import { DEFAULT_ENCOUNTER_WEIGHTS } from "../features/maps/types";

import type {
  CampaignMap,
  CampaignMapRoom,
  EncounterCategoryWeights,
  EncounterDisposition,
  EnvironmentEffect,
  EnvironmentLevel,
  MapEncounterEntry,
  MapMonster,
  MapTreasure,
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
  editorId: string;
  sourceIndex: number | null;
  id: number;
  name: string;
  markers: MapPoint[];
  pin?: MapPoint;
  descriptionHtml: string;
  treasure: MapTreasure[];
  monsters: MapMonster[];
  clues: MapEncounterEntry[];
  phenomena: MapEncounterEntry[];
  events: MapEncounterEntry[];
  encounterWeights: EncounterCategoryWeights;
  exitsText: string;
  experience: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const paragraphsToHtml = (values?: string[]) =>
  (values ?? [])
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => `<p>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`)
    .join("");

const accordionToHtml = (title: string, content: string) => {
  const trimmed = content.trim();

  if (!trimmed) {
    return "";
  }

  return `<div data-note-accordion="true" data-title="${escapeHtml(
    title,
  )}" data-open="true"><div data-note-accordion-content="true">${trimmed}</div></div>`;
};

const legacyRoomDescriptionToHtml = (room: CampaignMapRoom) => {
  if (room.descriptionHtml?.trim()) {
    return room.descriptionHtml;
  }

  return [
    paragraphsToHtml(room.description),
    accordionToHtml(
      "Read aloud",
      room.readAloud?.trim()
        ? `<p>${escapeHtml(room.readAloud).replace(/\n/g, "<br>")}</p>`
        : "",
    ),
    accordionToHtml("Developments", paragraphsToHtml(room.developments)),
    accordionToHtml("Captives", paragraphsToHtml(room.captives)),
    accordionToHtml("Notes", paragraphsToHtml(room.notes)),
  ]
    .filter(Boolean)
    .join("");
};

const legacyOverviewDescriptionToHtml = (map: CampaignMap) => {
  if (map.descriptionHtml?.trim()) {
    return map.descriptionHtml;
  }

  return [
    paragraphsToHtml(map.generalDescription),
    accordionToHtml(
      "Read aloud",
      map.readAloud?.trim()
        ? `<p>${escapeHtml(map.readAloud).replace(/\n/g, "<br>")}</p>`
        : "",
    ),
  ]
    .filter(Boolean)
    .join("");
};

const parseExits = (value: string) =>
  value
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((num) => Number.isFinite(num));

type PickerOption = { key: string; name: string; source: string };

const normalizeLegacyTreasure = (
  treasure?: MapTreasure[] | string[],
): MapTreasure[] =>
  (treasure ?? []).map((entry) =>
    typeof entry === "string"
      ? { name: entry, count: 1 }
      : { ...entry, count: Math.max(1, entry.count ?? 1) },
  );

const QuantityInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <input
    type="number"
    min={1}
    value={value}
    onChange={(event) =>
      onChange(Math.max(1, Math.floor(Number(event.target.value) || 1)))
    }
    className="w-16 rounded-lg border border-white/10 bg-black/25 px-2 py-1.5 text-center text-sm text-white outline-none focus:border-emerald-500/40"
  />
);

const EntityPicker = ({
  label,
  options,
  onPick,
}: {
  label: string;
  options: PickerOption[];
  onPick: (option: PickerOption) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return options
      .filter(
        (option) =>
          !q || `${option.name} ${option.source}`.toLowerCase().includes(q),
      )
      .slice(0, 80);
  }, [options, search]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={compactButtonClass}
      >
        <i className="fa-solid fa-plus" />
        {label.replace(/^Add /, "")}
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-[340px] max-w-[70vw] rounded-xl border border-white/10 bg-zinc-950 p-2 shadow-2xl">
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}...`}
            className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/40"
          />
          <div className="workspace-scrollbar mt-2 max-h-72 overflow-y-auto">
            {filtered.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  onPick(option);
                  setSearch("");
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-white/[0.06]"
              >
                <span className="truncate text-sm font-medium text-white">
                  {option.name}
                </span>
                <span className="shrink-0 text-xs text-zinc-500">
                  {option.source}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const TreasureEditor = ({
  value,
  onChange,
  itemOptions,
  title,
}: {
  value: MapTreasure[];
  onChange: (value: MapTreasure[]) => void;
  itemOptions: PickerOption[];
  title: string;
}) => {
  const add = (option: PickerOption) => {
    const existing = value.find((entry) => entry.itemKey === option.key);
    if (existing)
      onChange(
        value.map((entry) =>
          entry.itemKey === option.key
            ? { ...entry, count: (entry.count ?? 1) + 1 }
            : entry,
        ),
      );
    else
      onChange([
        ...value,
        { itemKey: option.key, name: option.name, count: 1 },
      ]);
  };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-white/85">{title}</label>
        <EntityPicker label="Add item" options={itemOptions} onPick={add} />
      </div>
      <div className="space-y-2">
        {value.map((entry, index) => (
          <div
            key={entry.itemKey ?? `legacy-${index}`}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {entry.name}
              </p>
              <p className="text-xs text-zinc-500">
                {entry.itemKey?.startsWith("campaign:")
                  ? "Campaign item"
                  : entry.itemKey
                    ? "Official item"
                    : "Legacy entry"}
              </p>
            </div>
            <QuantityInput
              value={entry.count ?? 1}
              onChange={(count) =>
                onChange(
                  value.map((v, i) => (i === index ? { ...v, count } : v)),
                )
              }
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              className="h-8 w-8 rounded-lg text-zinc-500 hover:bg-red-500/10 hover:text-red-300"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreatureEditor = ({
  value,
  onChange,
  monsterOptions,
  title,
}: {
  value: MapMonster[];
  onChange: (value: MapMonster[]) => void;
  monsterOptions: PickerOption[];
  title: string;
}) => {
  const add = (option: PickerOption) => {
    const existing = value.find((entry) => entry.monsterKey === option.key);
    if (existing)
      onChange(
        value.map((entry) =>
          entry.monsterKey === option.key
            ? { ...entry, count: (entry.count ?? 1) + 1 }
            : entry,
        ),
      );
    else
      onChange([
        ...value,
        {
          monsterKey: option.key,
          name: option.name,
          count: 1,
          disposition: "hostile",
        },
      ]);
  };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-white/85">{title}</label>
        <EntityPicker
          label="Add creature"
          options={monsterOptions}
          onPick={add}
        />
      </div>
      <div className="space-y-2">
        {value.map((entry, index) => (
          <div
            key={entry.monsterKey ?? `legacy-${index}`}
            className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5"
          >
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {entry.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {entry.monsterKey?.startsWith("campaign:")
                    ? "Campaign creature"
                    : entry.monsterKey
                      ? "Official creature"
                      : "Legacy entry"}
                </p>
              </div>
              <QuantityInput
                value={entry.count ?? 1}
                onChange={(count) =>
                  onChange(
                    value.map((v, i) => (i === index ? { ...v, count } : v)),
                  )
                }
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="h-8 w-8 rounded-lg text-zinc-500 hover:bg-red-500/10 hover:text-red-300"
              >
                ×
              </button>
            </div>
            <select
              value={entry.disposition ?? "hostile"}
              onChange={(e) =>
                onChange(
                  value.map((v, i) =>
                    i === index
                      ? {
                          ...v,
                          disposition: e.target.value as EncounterDisposition,
                        }
                      : v,
                  ),
                )
              }
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/40"
            >
              <option value="friendly">Friendly</option>
              <option value="neutral">Neutral</option>
              <option value="wary">Wary</option>
              <option value="hostile">Hostile</option>
            </select>

            <textarea
              value={entry.notes ?? ""}
              onChange={(e) =>
                onChange(
                  value.map((v, i) =>
                    i === index ? { ...v, notes: e.target.value } : v,
                  ),
                )
              }
              placeholder="Notes for this creature in this location..."
              rows={2}
              className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/40"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const createEncounterEntryId = () =>
  `enc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeWeights = (
  value?: Partial<EncounterCategoryWeights>,
): EncounterCategoryWeights => ({
  ...DEFAULT_ENCOUNTER_WEIGHTS,
  ...(value ?? {}),
});

const EncounterEntryEditor = ({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: MapEncounterEntry[];
  onChange: (value: MapEncounterEntry[]) => void;
}) => {
  const singular = title.endsWith("s") ? title.slice(0, -1) : title;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <label className="text-sm font-medium text-white/85">{title}</label>
          <p className="mt-0.5 text-xs text-white/40">{description}</p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...value,
              {
                id: createEncounterEntryId(),
                name: "",
                description: "",
              },
            ])
          }
          className={compactButtonClass}
        >
          <i className="fa-solid fa-plus" />
          Add
        </button>
      </div>

      <div className="space-y-2">
        {value.map((entry, index) => (
          <div
            key={entry.id}
            className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5"
          >
            <div className="flex gap-2">
              <input
                value={entry.name}
                onChange={(e) =>
                  onChange(
                    value.map((candidate, i) =>
                      i === index
                        ? { ...candidate, name: e.target.value }
                        : candidate,
                    ),
                  )
                }
                placeholder={`${singular} name...`}
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm font-semibold text-white outline-none focus:border-emerald-500/40"
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="h-9 w-9 rounded-lg text-zinc-500 hover:bg-red-500/10 hover:text-red-300"
              >
                ×
              </button>
            </div>
            <textarea
              value={entry.description ?? ""}
              onChange={(e) =>
                onChange(
                  value.map((candidate, i) =>
                    i === index
                      ? { ...candidate, description: e.target.value }
                      : candidate,
                  ),
                )
              }
              rows={2}
              placeholder="What happens / what does the party notice?"
              className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/40"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const CollapsibleSection = ({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => (
  <details
    open={defaultOpen}
    className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
  >
    <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.04] [&::-webkit-details-marker]:hidden">
      <i className="fa-solid fa-chevron-right text-[10px] text-zinc-500 transition-transform group-open:rotate-90" />
      <span className="min-w-0 flex-1">{title}</span>
      {typeof count === "number" ? (
        <span className="min-w-6 rounded-md bg-white/[0.10] px-2 py-0.5 text-center text-xs font-semibold text-zinc-300">
          {count}
        </span>
      ) : null}
    </summary>
    <div className="border-t border-white/[0.08] p-3">{children}</div>
  </details>
);

const EncounterWeightsEditor = ({
  value,
  onChange,
}: {
  value: EncounterCategoryWeights;
  onChange: (value: EncounterCategoryWeights) => void;
}) => (
  <details className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
    <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.04] [&::-webkit-details-marker]:hidden">
      <i className="fa-solid fa-chevron-right text-[10px] text-zinc-500 transition-transform group-open:rotate-90" />
      <span>Encounter settings</span>
    </summary>
    <div className="grid grid-cols-2 gap-2 border-t border-white/10 p-3">
      {(
        [
          ["creature", "Creature"],
          ["phenomenon", "Phenomenon"],
          ["event", "Event"],
          ["clue", "Clue"],
        ] as const
      ).map(([key, label]) => (
        <label key={key}>
          <span className="mb-1 block text-xs text-white/50">{label}</span>
          <input
            type="number"
            min={0}
            value={value[key]}
            onChange={(e) =>
              onChange({
                ...value,
                [key]: Math.max(0, Number(e.target.value) || 0),
              })
            }
            className="w-full rounded-lg border border-white/10 bg-zinc-900 px-2.5 py-2 text-sm text-white outline-none"
          />
        </label>
      ))}
      <p className="col-span-2 text-xs leading-4 text-white/40">
        Relative weights. Empty categories are ignored automatically.
      </p>
    </div>
  </details>
);

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

const createEditorRoomId = () =>
  `room-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const normalizeRoomsForEditing = (
  sourceRooms: CampaignMapRoom[],
): EditableRoom[] => {
  const sorted = sourceRooms
    .map((room, sourceIndex) => ({ room, sourceIndex }))
    .sort((a, b) => {
      if (a.room.id !== b.room.id) {
        return a.room.id - b.room.id;
      }

      return a.sourceIndex - b.sourceIndex;
    });

  /*
   * Old maps may contain duplicate or otherwise broken numeric IDs.
   * Keep every room and all of its content, but give the editor a clean
   * sequential display order immediately.
   *
   * Exits are remapped by old ID. If an old ID was duplicated, an exit
   * could never distinguish between those rooms in the stored data, so it
   * is mapped to the first matching room rather than discarded.
   */
  const firstNewIdByOldId = new Map<number, number>();

  sorted.forEach(({ room }, index) => {
    if (!firstNewIdByOldId.has(room.id)) {
      firstNewIdByOldId.set(room.id, index + 1);
    }
  });

  return sorted.map(({ room, sourceIndex }, index) => ({
    editorId: `existing-${sourceIndex}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`,
    sourceIndex,
    id: index + 1,
    name: room.name,
    markers: room.markers ?? [],
    pin: room.pin,
    descriptionHtml: legacyRoomDescriptionToHtml(room),
    treasure: normalizeLegacyTreasure(room.treasure),
    monsters: room.monsters ?? [],
    clues: room.clues ?? [],
    phenomena: room.phenomena ?? [],
    events: room.events ?? [],
    encounterWeights: normalizeWeights(room.encounterWeights),
    exitsText: (room.exits ?? [])
      .map((exitId) => firstNewIdByOldId.get(exitId))
      .filter((exitId): exitId is number => exitId !== undefined)
      .join(", "),
    experience: room.experience ?? "",
  }));
};

const renumberRooms = (rooms: EditableRoom[]): EditableRoom[] => {
  const oldToNew = new Map<number, number>();

  rooms.forEach((room, index) => {
    oldToNew.set(room.id, index + 1);
  });

  return rooms.map((room, index) => ({
    ...room,
    id: index + 1,
    exitsText: parseExits(room.exitsText)
      .map((exitId) => oldToNew.get(exitId))
      .filter((exitId): exitId is number => exitId !== undefined)
      .join(", "),
  }));
};

const editableToRoom = (
  editable: EditableRoom,
  original?: CampaignMapRoom,
): CampaignMapRoom => {
  const room: CampaignMapRoom = {
    id: editable.id,
    name: editable.name.trim() || `Room ${editable.id}`,
    markers: editable.markers,
    descriptionHtml: editable.descriptionHtml,
    treasure: editable.treasure,
    monsters: editable.monsters,
    clues: editable.clues.filter((entry) => entry.name.trim()),
    phenomena: editable.phenomena.filter((entry) => entry.name.trim()),
    events: editable.events.filter((entry) => entry.name.trim()),
    encounterWeights: editable.encounterWeights,
    exits: parseExits(editable.exitsText),
    encounterTemplate: original?.encounterTemplate ?? null,
  };

  if (editable.pin) {
    room.pin = editable.pin;
  }

  if (original?.environment) {
    room.environment = original.environment;
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

const buttonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-zinc-200 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

const compactButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.08] px-3 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-40";

const dangerButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.08] px-3 py-2 text-sm font-semibold text-red-300 transition hover:border-red-500/30 hover:bg-red-500/[0.14] disabled:cursor-not-allowed disabled:opacity-40";

const compactDangerButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.08] px-2.5 py-1.5 text-xs font-semibold text-red-300 transition hover:border-red-500/30 hover:bg-red-500/[0.14] disabled:cursor-not-allowed disabled:opacity-40";

const MapEditorModal = ({
  campaignId,
  map,
  onClose,
  initialSelectedRoomId = null,
}: Props) => {
  const { allMonsters } = useMonsterLibrary(campaignId);

  const [campaignItemsById, setCampaignItemsById] = useState<
    Record<string, CampaignItem>
  >({});

  useEffect(() => {
    if (!campaignId) {
      setCampaignItemsById({});
      return;
    }

    return onSnapshot(
      collection(db, "campaigns", campaignId, "items"),
      (snapshot) => {
        setCampaignItemsById(
          Object.fromEntries(
            snapshot.docs.map((docSnap) => [
              docSnap.id,
              {
                id: docSnap.id,
                ...(docSnap.data() as Omit<CampaignItem, "id">),
              },
            ]),
          ) as Record<string, CampaignItem>,
        );
      },
      (loadError) => console.error("Failed to load campaign items:", loadError),
    );
  }, [campaignId]);

  const itemOptions = useMemo(() => {
    const campaign = Object.values(campaignItemsById).flatMap((item) => {
      const base = itemsById[item.baseItemId];
      if (!base) return [];
      return [
        {
          key: `campaign:${item.id}`,
          name: item.name ?? item.overrides?.name ?? base.name,
          source: "Campaign",
        },
      ];
    });
    const defaults = allItems.map((item) => ({
      key: `default:${item.id}`,
      name: item.name,
      source: "Official",
    }));
    return [...campaign, ...defaults].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [campaignItemsById]);

  const monsterOptions = useMemo(
    () =>
      allMonsters
        .map((monster) => ({
          key: `${monster.source}:${monster.id}`,
          name: monster.name,
          source: monster.source === "campaign" ? "Campaign" : "Official",
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [allMonsters],
  );

  const [title, setTitle] = useState(map.title);

  const [imageUrl, setImageUrl] = useState(map.imageUrl);

  const [overviewDescriptionHtml, setOverviewDescriptionHtml] = useState(
    legacyOverviewDescriptionToHtml(map),
  );

  const [overviewMonsters, setOverviewMonsters] = useState<MapMonster[]>(
    map.monsters ?? [],
  );

  const [overviewTreasure, setOverviewTreasure] = useState<MapTreasure[]>(
    normalizeLegacyTreasure(map.treasure),
  );

  const [overviewClues, setOverviewClues] = useState<MapEncounterEntry[]>(
    map.clues ?? [],
  );

  const [overviewPhenomena, setOverviewPhenomena] = useState<
    MapEncounterEntry[]
  >(map.phenomena ?? []);

  const [overviewEvents, setOverviewEvents] = useState<MapEncounterEntry[]>(
    map.events ?? [],
  );

  const [overviewEncounterWeights, setOverviewEncounterWeights] =
    useState<EncounterCategoryWeights>(normalizeWeights(map.encounterWeights));

  const [environmentEffects, setEnvironmentEffects] = useState<
    EnvironmentEffect[]
  >(map.environmentEffects ?? []);

  const [rooms, setRooms] = useState<EditableRoom[]>(() =>
    normalizeRoomsForEditing(map.rooms),
  );

  const [selectedRoomEditorId, setSelectedRoomEditorId] = useState<
    string | null
  >(null);

  const [draggedRoomEditorId, setDraggedRoomEditorId] = useState<string | null>(
    null,
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
    setOverviewDescriptionHtml(legacyOverviewDescriptionToHtml(map));
    setOverviewMonsters(map.monsters ?? []);
    setOverviewTreasure(normalizeLegacyTreasure(map.treasure));
    setOverviewClues(map.clues ?? []);
    setOverviewPhenomena(map.phenomena ?? []);
    setOverviewEvents(map.events ?? []);
    setOverviewEncounterWeights(normalizeWeights(map.encounterWeights));

    setEnvironmentEffects(map.environmentEffects ?? []);
    setExpandedEffectIds(new Set());

    const nextRooms = normalizeRoomsForEditing(map.rooms);

    setRooms(nextRooms);

    setSelectedRoomEditorId(
      initialSelectedRoomId !== null
        ? nextRooms.find((room) => room.id === initialSelectedRoomId)
            ?.editorId ?? null
        : null,
    );

    setError(null);
  }, [map, initialSelectedRoomId]);

  const selectedRoom = useMemo(
    () =>
      rooms.find((room) => room.editorId === selectedRoomEditorId) ?? null,
    [rooms, selectedRoomEditorId],
  );

  const updateSelectedRoom = (updates: Partial<EditableRoom>) => {
    if (selectedRoomEditorId === null) {
      return;
    }

    setRooms((prev) =>
      prev.map((room) =>
        room.editorId === selectedRoomEditorId
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
    const nextId = rooms.length + 1;

    const newRoom: EditableRoom = {
      editorId: createEditorRoomId(),
      sourceIndex: null,
      id: nextId,
      name: `Room ${nextId}`,
      markers: [],
      pin: undefined,
      descriptionHtml: "",
      treasure: [],
      monsters: [],
      clues: [],
      phenomena: [],
      events: [],
      encounterWeights: { ...DEFAULT_ENCOUNTER_WEIGHTS },
      exitsText: "",
      experience: "",
    };

    setRooms((prev) => [...prev, newRoom]);
    setSelectedRoomEditorId(newRoom.editorId);
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
        .filter((room) => room.editorId !== selectedRoom.editorId)
        .map((room) => ({
          ...room,
          exitsText: parseExits(room.exitsText)
            .filter((exitId) => exitId !== selectedRoom.id)
            .join(", "),
        }));

      const renumbered = renumberRooms(remaining);
      setSelectedRoomEditorId(renumbered[0]?.editorId ?? null);
      return renumbered;
    });
  };

  const moveRoom = (draggedEditorId: string, targetEditorId: string) => {
    if (draggedEditorId === targetEditorId) {
      return;
    }

    setRooms((prev) => {
      const fromIndex = prev.findIndex(
        (room) => room.editorId === draggedEditorId,
      );
      const toIndex = prev.findIndex((room) => room.editorId === targetEditorId);

      if (fromIndex < 0 || toIndex < 0) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      return renumberRooms(next);
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
    roomEditorId: string,
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
          room.editorId === roomEditorId
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
          const original =
            room.sourceIndex !== null ? map.rooms[room.sourceIndex] : undefined;

          const normalized = editableToRoom(room, original);

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

        descriptionHtml: overviewDescriptionHtml,

        // Clear legacy overview prose after it has been migrated.
        generalDescription: [],
        readAloud: "",

        monsters: overviewMonsters,

        treasure: overviewTreasure,

        clues: overviewClues.filter((entry) => entry.name.trim()),
        phenomena: overviewPhenomena.filter((entry) => entry.name.trim()),
        events: overviewEvents.filter((entry) => entry.name.trim()),
        encounterWeights: overviewEncounterWeights,
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
        {/* Compact header */}
        <div className="flex items-center justify-end gap-2 border-b border-white/10 px-4 py-2 md:px-6">
          <button
            type="button"
            onClick={handleDeleteMap}
            disabled={isDeletingMap || isSaving}
            className={dangerButtonClass}
          >
            {isDeletingMap ? "Deleting..." : "Delete map"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeletingMap || isSaving}
            className={buttonClass}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isDeletingMap}
            className={primaryButtonClass}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="border-b border-red-500/15 bg-red-500/10 px-4 py-3 text-sm text-red-300 md:px-6">
            {error}
          </div>
        )}

        {/* Main layout */}
        <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[240px_minmax(0,1fr)_500px]">
          {/* Left sidebar */}
          <aside className="workspace-scrollbar min-h-0 overflow-auto border-b border-white/10 bg-zinc-950 p-3 xl:border-b-0 xl:border-r">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-white/50">
                Areas
              </h3>

              <button
                type="button"
                onClick={addRoom}
                className={compactButtonClass}
              >
                <i className="fa-solid fa-plus" />
                Add area
              </button>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setSelectedRoomEditorId(null)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                  selectedRoomEditorId === null
                    ? "border-white/25 bg-white/10"
                    : "border-white/10 bg-white/[0.035] hover:bg-white/[0.07]"
                }`}
              >
                <div className="truncate text-sm font-semibold text-white">
                  Overview
                </div>
              </button>

              {rooms.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-3 text-sm text-white/50">
                  No areas yet.
                </div>
              ) : (
                rooms.map((room) => {
                  const isSelected =
                    selectedRoomEditorId === room.editorId;
                  const isDragging =
                    draggedRoomEditorId === room.editorId;

                  return (
                    <button
                      key={room.editorId}
                      type="button"
                      draggable
                      onClick={() => setSelectedRoomEditorId(room.editorId)}
                      onDragStart={(event) => {
                        setDraggedRoomEditorId(room.editorId);
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData(
                          "text/plain",
                          room.editorId,
                        );
                      }}
                      onDragEnd={() => setDraggedRoomEditorId(null)}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(event) => {
                        event.preventDefault();

                        const draggedId =
                          event.dataTransfer.getData("text/plain") ||
                          draggedRoomEditorId;

                        if (draggedId) {
                          moveRoom(draggedId, room.editorId);
                        }

                        setDraggedRoomEditorId(null);
                      }}
                      className={`group flex w-full items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left transition ${
                        isSelected
                          ? "border-white/25 bg-white/10"
                          : "border-white/10 bg-white/[0.035] hover:bg-white/[0.07]"
                      } ${isDragging ? "opacity-40" : ""}`}
                    >
                      <i className="fa-solid fa-grip-vertical shrink-0 cursor-grab text-xs text-zinc-600 transition group-hover:text-zinc-400" />
                      <div className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                        {room.id}. {room.name}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Map */}
          <section className="workspace-scrollbar min-h-0 overflow-auto border-b border-white/10 bg-zinc-900 xl:border-b-0 xl:border-r">
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

                    const isSelected = room.editorId === selectedRoomEditorId;

                    const polygonPoints = room.markers
                      .map((point) => `${point.x},${point.y}`)
                      .join(" ");

                    return (
                      <polygon
                        key={room.editorId}
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

                  const isSelected = room.editorId === selectedRoomEditorId;

                  return (
                    <button
                      key={`label-${room.editorId}`}
                      type="button"
                      onPointerDown={(event) =>
                        handlePinPointerDown(event, room.editorId)
                      }
                      onClick={(event) => {
                        event.stopPropagation();

                        setSelectedRoomEditorId(room.editorId);
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
          <aside className="workspace-scrollbar min-h-0 overflow-auto bg-zinc-950 p-4">
            {!selectedRoom ? (
              <div className="space-y-3">
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-2">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-label="Map title"
                    placeholder="Map title"
                    className="min-w-0 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-lg font-bold text-white outline-none transition focus:border-white/20"
                  />

                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    aria-label="Image URL"
                    placeholder="Image URL"
                    className="min-w-0 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-lg font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-white/20"
                  />
                </div>

                <div>
                  <label className={labelClass}>Description</label>

                  <RichTextEditor
                    value={overviewDescriptionHtml}
                    onChange={setOverviewDescriptionHtml}
                    placeholder="Describe the map, add read-aloud text, notes, or organised accordion sections..."
                    minHeightClassName="min-h-[220px]"
                  />
                </div>

                <CollapsibleSection
                  title="Environment effects"
                  count={environmentEffects.length}
                >
                  <div className="mb-3 flex justify-end">
                    <button
                      type="button"
                      onClick={addEnvironmentEffect}
                      className={compactButtonClass}
                    >
                      <i className="fa-solid fa-plus" />
                      Add effect
                    </button>
                  </div>

                  {environmentEffects.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.025] p-3 text-sm text-white/50">
                      No environment effects yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {environmentEffects.map((effect) => {
                        const isExpanded = expandedEffectIds.has(effect.id);

                        return (
                          <div
                            key={effect.id}
                            className="overflow-hidden rounded-xl border border-white/10 bg-black/15"
                          >
                            <button
                              type="button"
                              onClick={() => toggleEnvironmentEffect(effect.id)}
                              className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.04]"
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

                            {isExpanded ? (
                              <div className="border-t border-white/[0.08] p-3">
                                <div className="mb-3 flex items-start gap-2">
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
                                    className="mt-7 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/[0.08] text-xs text-red-300 transition hover:border-red-500/30 hover:bg-red-500/[0.14]"
                                  >
                                    <i className="fa-solid fa-trash" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className={labelClass}>Die sides</label>
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

                                <div className="mt-3">
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
                                      className={compactButtonClass}
                                    >
                                      <i className="fa-solid fa-plus" />
                                      Level
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
                                                    range?.max ??
                                                    effect.diceSides
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
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CollapsibleSection>

                <CollapsibleSection
                  title="Treasure"
                  count={overviewTreasure.length}
                >
                  <TreasureEditor
                    value={overviewTreasure}
                    onChange={setOverviewTreasure}
                    itemOptions={itemOptions}
                    title="Treasure"
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Creatures"
                  count={overviewMonsters.length}
                >
                  <CreatureEditor
                    value={overviewMonsters}
                    onChange={setOverviewMonsters}
                    monsterOptions={monsterOptions}
                    title="Creatures"
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Phenomena"
                  count={overviewPhenomena.length}
                >
                  <EncounterEntryEditor
                    title="Phenomena"
                    description="Atmospheric or supernatural occurrences."
                    value={overviewPhenomena}
                    onChange={setOverviewPhenomena}
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Events"
                  count={overviewEvents.length}
                >
                  <EncounterEntryEditor
                    title="Events"
                    description="Things that happen around or to the party."
                    value={overviewEvents}
                    onChange={setOverviewEvents}
                  />
                </CollapsibleSection>

                <CollapsibleSection title="Clues" count={overviewClues.length}>
                  <EncounterEntryEditor
                    title="Clues"
                    description="Discoveries that reveal information or point somewhere."
                    value={overviewClues}
                    onChange={setOverviewClues}
                  />
                </CollapsibleSection>

                <EncounterWeightsEditor
                  value={overviewEncounterWeights}
                  onChange={setOverviewEncounterWeights}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    value={selectedRoom.name}
                    onChange={(e) =>
                      updateSelectedRoom({
                        name: e.target.value,
                      })
                    }
                    aria-label="Area name"
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-lg font-bold text-white outline-none transition focus:border-white/20"
                  />

                  <button
                    type="button"
                    onClick={deleteSelectedRoom}
                    className={compactDangerButtonClass}
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>

                <CollapsibleSection title="Map area">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-white/80">
                          Boundary
                        </span>
                        <span className="text-xs text-white/45">
                          {selectedRoom.markers.length} point
                          {selectedRoom.markers.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      {selectedRoom.markers.length < 3 ? (
                        <div className="mt-1 text-xs text-yellow-300/80">
                          Add at least {3 - selectedRoom.markers.length} more
                          point
                          {3 - selectedRoom.markers.length === 1 ? "" : "s"}.
                        </div>
                      ) : null}

                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={selectedRoom.markers.length === 0}
                          onClick={undoLastAreaPoint}
                          className={compactButtonClass}
                        >
                          <i className="fa-solid fa-rotate-left" />
                          Undo point
                        </button>

                        <button
                          type="button"
                          disabled={selectedRoom.markers.length === 0}
                          onClick={clearArea}
                          className={compactDangerButtonClass}
                        >
                          <i className="fa-solid fa-trash" />
                          Clear area
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-white/[0.08] pt-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-white/80">
                          Pin
                        </span>
                        <span className="truncate text-xs text-white/45">
                          {selectedRoom.pin
                            ? `x ${selectedRoom.pin.x}, y ${selectedRoom.pin.y}`
                            : "Automatic center"}
                        </span>
                      </div>

                      <div className="mt-2">
                        <button
                          type="button"
                          disabled={!selectedRoom.pin}
                          onClick={resetPin}
                          className={compactButtonClass}
                        >
                          <i className="fa-solid fa-location-dot" />
                          Reset pin
                        </button>
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Description" defaultOpen>
                  <RichTextEditor
                    value={selectedRoom.descriptionHtml}
                    onChange={(descriptionHtml) =>
                      updateSelectedRoom({
                        descriptionHtml,
                      })
                    }
                    placeholder="Describe the area, add read-aloud text, developments, captives, notes, or organised accordion sections..."
                    minHeightClassName="min-h-[220px]"
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Treasure"
                  count={selectedRoom.treasure.length}
                >
                  <TreasureEditor
                    value={selectedRoom.treasure}
                    onChange={(treasure) => updateSelectedRoom({ treasure })}
                    itemOptions={itemOptions}
                    title="Treasure"
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Creatures"
                  count={selectedRoom.monsters.length}
                >
                  <CreatureEditor
                    value={selectedRoom.monsters}
                    onChange={(monsters) => updateSelectedRoom({ monsters })}
                    monsterOptions={monsterOptions}
                    title="Creatures"
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Phenomena"
                  count={selectedRoom.phenomena.length}
                >
                  <EncounterEntryEditor
                    title="Phenomena"
                    description="Atmospheric or supernatural occurrences."
                    value={selectedRoom.phenomena}
                    onChange={(phenomena) => updateSelectedRoom({ phenomena })}
                  />
                </CollapsibleSection>

                <CollapsibleSection
                  title="Events"
                  count={selectedRoom.events.length}
                >
                  <EncounterEntryEditor
                    title="Events"
                    description="Things that happen around or to the party."
                    value={selectedRoom.events}
                    onChange={(events) => updateSelectedRoom({ events })}
                  />
                </CollapsibleSection>

                <CollapsibleSection title="Clues" count={selectedRoom.clues.length}>
                  <EncounterEntryEditor
                    title="Clues"
                    description="Discoveries that reveal information or point somewhere."
                    value={selectedRoom.clues}
                    onChange={(clues) => updateSelectedRoom({ clues })}
                  />
                </CollapsibleSection>

                <EncounterWeightsEditor
                  value={selectedRoom.encounterWeights}
                  onChange={(encounterWeights) =>
                    updateSelectedRoom({ encounterWeights })
                  }
                />

                <CollapsibleSection title="Connections & experience">
                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>
                        Exits (comma separated area IDs)
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
                </CollapsibleSection>
              </div>
            )}
          </aside>
        </div>
        </div>
      </div>
  );
};

export default MapEditorModal;
