import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import useNpcLibrary from "../../../hooks/useNpcLibrary";

import { useWorkspace } from "../WorkspaceContext";

import type {
  NpcModuleMode,
  WorkspaceModuleRenderProps,
} from "../workspaceTypes";

type CampaignNpc = {
  id: string;

  campaignId?: string;

  name?: string;

  species?: string;

  occupation?: string;

  role?: string;

  imageUrl?: string;

  imageCropX?: number;

  imageCropY?: number;

  publicDescription?: string;

  personality?: string[];

  voice?: string;

  mannerisms?: string[];

  wants?: string;

  fears?: string;

  knows?: string[];

  doesntKnow?: string[];

  claims?: string[];

  secretTruth?: string;

  reactions?: string[];

  location?: string;

  relationships?: string[];

  clues?: string[];

  statBlock?: string;

  itemsLoot?: string[];

  quickReference?: string;

  notes?: string;
};

type DetailSection =
  | "knowledge"
  | "deception"
  | "reactions"
  | "gameplay"
  | "stats"
  | "notes";

const normalizeText = (value?: string) => {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
};

const npcMatchesLocation = (
  npc: CampaignNpc,

  roomName?: string,
) => {
  if (!npc.location || !roomName) {
    return false;
  }

  const npcLocation = normalizeText(npc.location);

  const activeRoom = normalizeText(roomName);

  if (!npcLocation || !activeRoom) {
    return false;
  }

  return (
    npcLocation === activeRoom ||
    npcLocation.includes(activeRoom) ||
    activeRoom.includes(npcLocation)
  );
};

const hasText = (value?: string) => {
  return Boolean(value?.trim());
};

const hasList = (value?: string[]) => {
  return Boolean(value && value.length > 0);
};

const NpcList = ({ items }: { items?: string[] }) => {
  if (!items?.length) {
    return null;
  }

  return (
    <ul className="space-y-1.5 text-xs leading-5 text-zinc-300">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-2">
          <span className="shrink-0 text-emerald-400">•</span>

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

const NpcRow = ({
  npc,
  currentLocation,
  onClick,
}: {
  npc: CampaignNpc;

  currentLocation?: string;

  onClick: () => void;
}) => {
  const isAtLocation = npcMatchesLocation(npc, currentLocation);

  const subtitle = [npc.species, npc.occupation].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-2.5 border-b border-white/5 p-2.5 text-left transition last:border-b-0 ${
        isAtLocation
          ? "bg-emerald-500/[0.035] hover:bg-emerald-500/[0.07]"
          : "hover:bg-white/[0.035]"
      }`}
    >
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
        {npc.imageUrl ? (
          <img
            src={npc.imageUrl}
            alt=""
            className="h-full w-full object-cover"
            style={{
              objectPosition: `${npc.imageCropX ?? 50}% ${npc.imageCropY ?? 50}%`,
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-600">
            <i className="fa-solid fa-user text-xs" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-xs font-semibold text-zinc-200 group-hover:text-white">
            {npc.name || "Unnamed NPC"}
          </span>

          {isAtLocation ? (
            <i
              title="Current location"
              className="fa-solid fa-location-dot shrink-0 text-[8px] text-emerald-400"
            />
          ) : null}
        </div>

        <div className="mt-0.5 truncate text-[9px] text-zinc-600">
          {subtitle || npc.role || "NPC"}
        </div>
      </div>

      <i className="fa-solid fa-chevron-right shrink-0 text-[8px] text-zinc-700 transition group-hover:text-zinc-400" />
    </button>
  );
};

export default function NpcWorkspaceModule({
  module,
  campaignId,
  updateModule,
}: WorkspaceModuleRenderProps) {
  const navigate = useNavigate();

  const { npcs, loading } = useNpcLibrary(campaignId);

  const {
    selectedEntity,

    activeLocation,

    selectEntity,
  } = useWorkspace();

  const [search, setSearch] = useState("");

  const [browserOpen, setBrowserOpen] = useState(false);

  const [portraitOpen, setPortraitOpen] = useState(false);

  const [activeSection, setActiveSection] = useState<DetailSection | null>(
    null,
  );

  const mode: NpcModuleMode = module.config?.npcMode ?? "follow";

  /*
   * A Follow module reacts to global workspace
   * NPC selection.
   *
   * A Pinned module ignores it.
   */
  const followedNpcId =
    selectedEntity?.type === "npc" ? selectedEntity.npcId : undefined;

  const selectedNpcId =
    mode === "follow"
      ? (followedNpcId ?? module.config?.selectedNpcId)
      : module.config?.selectedNpcId;

  const selectedNpc = useMemo(
    () =>
      (npcs as CampaignNpc[]).find((npc) => npc.id === selectedNpcId) ?? null,
    [npcs, selectedNpcId],
  );

  /*
   * If Follow receives an NPC from elsewhere,
   * remember it as this module's most recent NPC.
   *
   * This means switching to Pinned immediately
   * pins what is currently visible.
   */
  useEffect(() => {
    if (mode !== "follow" || !followedNpcId) {
      return;
    }

    if (module.config?.selectedNpcId === followedNpcId) {
      return;
    }

    updateModule(module.id, {
      config: {
        ...module.config,

        selectedNpcId: followedNpcId,
      },
    });
  }, [mode, followedNpcId, module.id, module.config, updateModule]);

  /*
   * If the stored NPC has been deleted,
   * clear the invalid reference.
   */
  useEffect(() => {
    const storedId = module.config?.selectedNpcId;

    if (!storedId || loading) {
      return;
    }

    const exists = (npcs as CampaignNpc[]).some((npc) => npc.id === storedId);

    if (exists) {
      return;
    }

    updateModule(module.id, {
      config: {
        ...module.config,

        selectedNpcId: undefined,
      },
    });
  }, [npcs, loading, module.id, module.config, updateModule]);

  const locationNpcs = useMemo(() => {
    if (!activeLocation) {
      return [];
    }

    return (npcs as CampaignNpc[])
      .filter((npc) => npcMatchesLocation(npc, activeLocation.roomName))
      .sort((a, b) =>
        (a.name ?? "").localeCompare(b.name ?? "", undefined, {
          sensitivity: "base",
        }),
      );
  }, [npcs, activeLocation]);

  const filteredNpcs = useMemo(() => {
    const query = normalizeText(search);

    return (npcs as CampaignNpc[])
      .filter((npc) => {
        if (!query) {
          return true;
        }

        return [npc.name, npc.species, npc.occupation, npc.role, npc.location]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => {
        const aAtLocation = npcMatchesLocation(a, activeLocation?.roomName);

        const bAtLocation = npcMatchesLocation(b, activeLocation?.roomName);

        if (aAtLocation !== bAtLocation) {
          return aAtLocation ? -1 : 1;
        }

        return (a.name ?? "").localeCompare(b.name ?? "", undefined, {
          sensitivity: "base",
        });
      });
  }, [npcs, search, activeLocation]);

  const inspectNpc = (npc: CampaignNpc) => {
    updateModule(module.id, {
      config: {
        ...module.config,

        selectedNpcId: npc.id,
      },
    });

    selectEntity({
      type: "npc",

      npcId: npc.id,
    });

    setBrowserOpen(false);

    setActiveSection(null);
  };

  const setMode = (nextMode: NpcModuleMode) => {
    updateModule(module.id, {
      config: {
        ...module.config,

        npcMode: nextMode,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-zinc-500">
        Loading NPCs...
      </div>
    );
  }

  if ((npcs as CampaignNpc[]).length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-5 text-center">
        <div>
          <i className="fa-solid fa-user text-3xl text-zinc-700" />

          <p className="mt-3 text-sm font-semibold text-zinc-300">
            No NPCs yet
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Create campaign NPCs first.
          </p>

          <button
            type="button"
            onClick={() => navigate(`/campaigns/${campaignId}/npcs`)}
            className="mt-4 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            Open NPCs
          </button>
        </div>
      </div>
    );
  }

  /*
   * Browser state.
   */
  if (browserOpen || !selectedNpc) {
    const locationIds = new Set(locationNpcs.map((npc) => npc.id));

    const otherNpcs = filteredNpcs.filter((npc) => !locationIds.has(npc.id));

    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="workspace-no-drag shrink-0 border-b border-white/10 bg-black/20 p-2">
          <div className="flex items-center gap-2">
            {selectedNpc ? (
              <button
                type="button"
                onClick={() => setBrowserOpen(false)}
                title="Back to NPC"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
              >
                <i className="fa-solid fa-arrow-left text-[10px]" />
              </button>
            ) : null}

            <div className="relative min-w-0 flex-1">
              <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-zinc-600" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search NPCs..."
                className="h-8 w-full rounded-lg border border-white/10 bg-black/30 py-1.5 pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500/30"
              />
            </div>
          </div>
        </div>

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
          {activeLocation && !search.trim() && locationNpcs.length > 0 ? (
            <section>
              <div className="flex items-center gap-1.5 border-b border-white/5 bg-emerald-500/[0.03] px-3 py-2">
                <i className="fa-solid fa-location-dot text-[8px] text-emerald-400" />

                <span className="truncate text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300/70">
                  Current location · {activeLocation.roomName}
                </span>
              </div>

              {locationNpcs.map((npc) => (
                <NpcRow
                  key={npc.id}
                  npc={npc}
                  currentLocation={activeLocation.roomName}
                  onClick={() => inspectNpc(npc)}
                />
              ))}
            </section>
          ) : null}

          <section>
            {!search.trim() && activeLocation && locationNpcs.length > 0 ? (
              <div className="border-b border-white/5 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                Other NPCs
              </div>
            ) : null}

            {otherNpcs.length === 0 ? (
              <div className="p-5 text-center text-xs text-zinc-600">
                No matching NPCs.
              </div>
            ) : (
              otherNpcs.map((npc) => (
                <NpcRow
                  key={npc.id}
                  npc={npc}
                  currentLocation={activeLocation?.roomName}
                  onClick={() => inspectNpc(npc)}
                />
              ))
            )}
          </section>
        </div>
      </div>
    );
  }

  const subtitle = [selectedNpc.species, selectedNpc.occupation]
    .filter(Boolean)
    .join(" · ");

  const isAtCurrentLocation = npcMatchesLocation(
    selectedNpc,
    activeLocation?.roomName,
  );

  const detailSections: {
    id: DetailSection;

    label: string;

    icon: string;

    visible: boolean;
  }[] = [
    {
      id: "knowledge",

      label: "Knowledge",

      icon: "fa-solid fa-brain",

      visible: hasList(selectedNpc.knows) || hasList(selectedNpc.doesntKnow),
    },

    {
      id: "deception",

      label: "Deception",

      icon: "fa-solid fa-masks-theater",

      visible: hasList(selectedNpc.claims) || hasText(selectedNpc.secretTruth),
    },

    {
      id: "reactions",

      label: "Reactions",

      icon: "fa-solid fa-bolt",

      visible: hasList(selectedNpc.reactions),
    },

    {
      id: "gameplay",

      label: "Gameplay",

      icon: "fa-solid fa-gamepad",

      visible:
        hasText(selectedNpc.location) ||
        hasList(selectedNpc.relationships) ||
        hasList(selectedNpc.clues) ||
        hasList(selectedNpc.itemsLoot),
    },

    {
      id: "stats",

      label: "Stats",

      icon: "fa-solid fa-shield-halved",

      visible: hasText(selectedNpc.statBlock),
    },

    {
      id: "notes",

      label: "Notes",

      icon: "fa-solid fa-note-sticky",

      visible: hasText(selectedNpc.notes),
    },
  ];

  const visibleSections = detailSections.filter((section) => section.visible);

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* Toolbar */}

      <div className="workspace-no-drag flex h-10 shrink-0 items-center gap-1.5 border-b border-white/10 bg-black/20 px-2">
        <button
          type="button"
          onClick={() => setBrowserOpen(true)}
          title="Browse NPCs"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-list text-[9px]" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-zinc-200">
            {selectedNpc.name || "Unnamed NPC"}
          </div>
        </div>

        {/* Small set-and-forget mode control */}

        <div className="flex shrink-0 rounded-lg border border-white/10 bg-black/20 p-0.5">
          <button
            type="button"
            onClick={() => setMode("pinned")}
            title="Pin this NPC"
            className={`flex h-6 w-6 items-center justify-center rounded-md text-[9px] transition ${
              mode === "pinned"
                ? "bg-amber-500/15 text-amber-300"
                : "text-zinc-600 hover:text-zinc-300"
            }`}
          >
            <i className="fa-solid fa-thumbtack" />
          </button>

          <button
            type="button"
            onClick={() => setMode("follow")}
            title="Follow NPC selections"
            className={`flex h-6 w-6 items-center justify-center rounded-md text-[9px] transition ${
              mode === "follow"
                ? "bg-sky-500/15 text-sky-300"
                : "text-zinc-600 hover:text-zinc-300"
            }`}
          >
            <i className="fa-solid fa-crosshairs" />
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(`/campaigns/${campaignId}/npcs/${selectedNpc.id}`)
          }
          title="Open full NPC page"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-up-right-from-square text-[9px]" />
        </button>
      </div>

      {/* NPC content */}

      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
        {/* Identity */}

        <div className="border-b border-white/10 p-3">
          <div className="flex items-start gap-3">
            <button
              type="button"
              disabled={!selectedNpc.imageUrl}
              onClick={() => setPortraitOpen(true)}
              title={selectedNpc.imageUrl ? "Enlarge portrait" : undefined}
              className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30 disabled:cursor-default"
            >
              {selectedNpc.imageUrl ? (
                <img
                  src={selectedNpc.imageUrl}
                  alt={selectedNpc.name || "NPC"}
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: `${selectedNpc.imageCropX ?? 50}% ${selectedNpc.imageCropY ?? 50}%`,
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-700">
                  <i className="fa-solid fa-user text-xl" />
                </div>
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="truncate text-base font-bold text-white">
                  {selectedNpc.name || "Unnamed NPC"}
                </h2>

                {mode === "follow" ? (
                  <span className="rounded-full border border-sky-500/15 bg-sky-500/[0.07] px-1.5 py-0.5 text-[8px] font-semibold uppercase text-sky-300">
                    Follow
                  </span>
                ) : (
                  <span className="rounded-full border border-amber-500/15 bg-amber-500/[0.07] px-1.5 py-0.5 text-[8px] font-semibold uppercase text-amber-300">
                    Pinned
                  </span>
                )}
              </div>

              {subtitle ? (
                <div className="mt-0.5 truncate text-[10px] italic text-zinc-500">
                  {subtitle}
                </div>
              ) : null}

              {selectedNpc.location ? (
                <div
                  className={`mt-2 flex items-center gap-1.5 text-[10px] ${
                    isAtCurrentLocation ? "text-emerald-300" : "text-zinc-500"
                  }`}
                >
                  <i className="fa-solid fa-location-dot text-[8px]" />

                  <span className="truncate">{selectedNpc.location}</span>

                  {isAtCurrentLocation ? (
                    <span className="shrink-0 text-[8px] font-bold uppercase tracking-wide">
                      Current
                    </span>
                  ) : null}
                </div>
              ) : null}

              {selectedNpc.role ? (
                <div className="mt-2 text-[10px] leading-4 text-zinc-400">
                  <span className="font-semibold text-zinc-300">Role:</span>{" "}
                  {selectedNpc.role}
                </div>
              ) : null}
            </div>
          </div>

          {selectedNpc.publicDescription ? (
            <p className="mt-3 whitespace-pre-wrap text-[11px] leading-5 text-zinc-400">
              {selectedNpc.publicDescription}
            </p>
          ) : null}
        </div>

        {/* Most important live-roleplay info */}

        <div className="space-y-3 p-3">
          {selectedNpc.personality?.length ? (
            <section>
              <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-violet-300/70">
                🎭 Play
              </div>

              <div className="flex flex-wrap gap-1">
                {selectedNpc.personality.map((trait, index) => (
                  <span
                    key={`${trait}-${index}`}
                    className="rounded-md border border-violet-500/10 bg-violet-500/[0.05] px-1.5 py-1 text-[10px] text-violet-200"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {selectedNpc.voice || selectedNpc.mannerisms?.length ? (
            <section className="grid gap-2 sm:grid-cols-2">
              {selectedNpc.voice ? (
                <div className="rounded-lg border border-white/5 bg-white/[0.025] p-2.5">
                  <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-zinc-600">
                    Voice
                  </div>

                  <div className="whitespace-pre-wrap text-[10px] leading-4 text-zinc-300">
                    {selectedNpc.voice}
                  </div>
                </div>
              ) : null}

              {selectedNpc.mannerisms?.length ? (
                <div className="rounded-lg border border-white/5 bg-white/[0.025] p-2.5">
                  <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-zinc-600">
                    Mannerisms
                  </div>

                  <div className="text-[10px] leading-4 text-zinc-300">
                    {selectedNpc.mannerisms.join(" · ")}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {selectedNpc.wants || selectedNpc.fears ? (
            <section className="grid grid-cols-2 gap-2">
              {selectedNpc.wants ? (
                <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.04] p-2.5">
                  <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-emerald-300/60">
                    🎯 Wants
                  </div>

                  <div className="whitespace-pre-wrap text-[10px] leading-4 text-zinc-300">
                    {selectedNpc.wants}
                  </div>
                </div>
              ) : null}

              {selectedNpc.fears ? (
                <div className="rounded-lg border border-rose-500/10 bg-rose-500/[0.035] p-2.5">
                  <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-rose-300/60">
                    ⚠ Fears
                  </div>

                  <div className="whitespace-pre-wrap text-[10px] leading-4 text-zinc-300">
                    {selectedNpc.fears}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}

          {selectedNpc.secretTruth ? (
            <section className="rounded-lg border border-amber-500/15 bg-amber-500/[0.05] p-2.5">
              <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-amber-300">
                🔒 Secret / Truth
              </div>

              <div className="whitespace-pre-wrap text-[10px] leading-4 text-zinc-200">
                {selectedNpc.secretTruth}
              </div>
            </section>
          ) : null}

          {selectedNpc.quickReference ? (
            <section className="rounded-lg border border-violet-500/15 bg-violet-500/[0.05] p-2.5">
              <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-violet-300">
                Quick Reference
              </div>

              <div className="whitespace-pre-wrap text-[10px] leading-4 text-zinc-200">
                {selectedNpc.quickReference}
              </div>
            </section>
          ) : null}

          {/* Expandable secondary sections */}

          {visibleSections.length > 0 ? (
            <section>
              <div className="flex flex-wrap gap-1.5">
                {visibleSections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() =>
                      setActiveSection((current) =>
                        current === section.id ? null : section.id,
                      )
                    }
                    className={`rounded-md border px-2 py-1.5 text-[9px] font-semibold transition ${
                      activeSection === section.id
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-zinc-500 hover:bg-white/[0.07] hover:text-zinc-300"
                    }`}
                  >
                    <i className={`${section.icon} mr-1`} />

                    {section.label}
                  </button>
                ))}
              </div>

              {activeSection ? (
                <div className="mt-2 rounded-lg border border-white/10 bg-black/20 p-3">
                  {activeSection === "knowledge" ? (
                    <div className="space-y-3">
                      {selectedNpc.knows?.length ? (
                        <div>
                          <div className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-emerald-300/70">
                            Knows
                          </div>

                          <NpcList items={selectedNpc.knows} />
                        </div>
                      ) : null}

                      {selectedNpc.doesntKnow?.length ? (
                        <div>
                          <div className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-zinc-600">
                            Doesn't Know
                          </div>

                          <NpcList items={selectedNpc.doesntKnow} />
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {activeSection === "deception" ? (
                    <div className="space-y-3">
                      {selectedNpc.claims?.length ? (
                        <div>
                          <div className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-amber-300/70">
                            Claims
                          </div>

                          <NpcList items={selectedNpc.claims} />
                        </div>
                      ) : null}

                      {selectedNpc.secretTruth ? (
                        <div>
                          <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-rose-300/70">
                            Truth
                          </div>

                          <div className="whitespace-pre-wrap text-[10px] leading-4 text-zinc-300">
                            {selectedNpc.secretTruth}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {activeSection === "reactions" ? (
                    <NpcList items={selectedNpc.reactions} />
                  ) : null}

                  {activeSection === "gameplay" ? (
                    <div className="space-y-3">
                      {selectedNpc.location ? (
                        <div>
                          <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-zinc-600">
                            Location
                          </div>

                          <div className="text-[10px] text-zinc-300">
                            {selectedNpc.location}
                          </div>
                        </div>
                      ) : null}

                      {selectedNpc.relationships?.length ? (
                        <div>
                          <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-zinc-600">
                            Relationships
                          </div>

                          <NpcList items={selectedNpc.relationships} />
                        </div>
                      ) : null}

                      {selectedNpc.clues?.length ? (
                        <div>
                          <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-zinc-600">
                            Clues
                          </div>

                          <NpcList items={selectedNpc.clues} />
                        </div>
                      ) : null}

                      {selectedNpc.itemsLoot?.length ? (
                        <div>
                          <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-zinc-600">
                            Items / Loot
                          </div>

                          <NpcList items={selectedNpc.itemsLoot} />
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {activeSection === "stats" ? (
                    <div className="whitespace-pre-wrap font-mono text-[10px] leading-5 text-zinc-300">
                      {selectedNpc.statBlock}
                    </div>
                  ) : null}

                  {activeSection === "notes" ? (
                    <div className="whitespace-pre-wrap text-[10px] leading-5 text-zinc-300">
                      {selectedNpc.notes}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>

      {/* Portrait lightbox */}

      {portraitOpen && selectedNpc.imageUrl ? (
        <div
          className="workspace-no-drag absolute inset-0 z-50 flex items-center justify-center bg-black/85 p-3"
          onMouseDown={() => setPortraitOpen(false)}
        >
          <button
            type="button"
            onClick={() => setPortraitOpen(false)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-zinc-300 hover:text-white"
          >
            <i className="fa-solid fa-xmark" />
          </button>

          <img
            src={selectedNpc.imageUrl}
            alt={selectedNpc.name || "NPC"}
            onMouseDown={(event) => event.stopPropagation()}
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </div>
  );
}
