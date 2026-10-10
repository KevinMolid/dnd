import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
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
  | "description"
  | "knowledge"
  | "deception"
  | "reactions"
  | "gameplay"
  | "notes";
const normalizeText = (value?: string) => {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
};
const npcMatchesLocation = (npc: CampaignNpc, roomName?: string) => {
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
        <li key={`${item}-${index}`} className="whitespace-pre-wrap">
          {item}
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
        <div className="mt-0.5 truncate text-xs text-zinc-600">
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
  const { selectedEntity, activeLocation, selectEntity } = useWorkspace();
  const [search, setSearch] = useState("");
  const [browserOpen, setBrowserOpen] = useState(false);
  const [headerTarget, setHeaderTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setHeaderTarget(
      document.getElementById(`npc-workspace-header-${module.id}`),
    );
  }, [module.id]);
  const [portraitOpen, setPortraitOpen] = useState(false);
  useEffect(() => {
    if (!portraitOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPortraitOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [portraitOpen]);
  const [activeSection, setActiveSection] = useState<DetailSection | null>(
    null,
  );
  const mode: NpcModuleMode = module.config?.npcMode ?? "follow";
  /*
   \* A Follow module reacts to global workspace
   \* NPC selection.
   \*
   \* A Pinned module ignores it.
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
   \* If Follow receives an NPC from elsewhere,
   \* remember it as this module's most recent NPC.
   \*
   \* This means switching to Pinned immediately
   \* pins what is currently visible.
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
   \* If the stored NPC has been deleted,
   \* clear the invalid reference.
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
  // Render NPC-specific controls directly inside the shared workspace header.
  const headerControls = (npc: CampaignNpc | null) =>
    headerTarget
      ? createPortal(
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setBrowserOpen((current) => !current)}
              title={browserOpen ? "Back to NPC" : "Browse NPCs"}
              aria-label={browserOpen ? "Back to NPC" : "Browse NPCs"}
              className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <i
                className={`fa-solid ${browserOpen ? "fa-arrow-left" : "fa-list"} text-xs`}
              />
            </button>
            <div className="flex shrink-0 items-center rounded-md border border-white/10 bg-black/20 p-0.5">
              <button
                type="button"
                onClick={() => setMode("pinned")}
                title="Pin this NPC"
                aria-label="Pin this NPC"
                aria-pressed={mode === "pinned"}
                className={`flex h-5 w-5 items-center justify-center rounded text-xs ${mode === "pinned" ? "bg-amber-500/15 text-amber-300" : "text-zinc-500 hover:text-zinc-200"}`}
              >
                <i className="fa-solid fa-thumbtack" />
              </button>
              <button
                type="button"
                onClick={() => setMode("follow")}
                title="Follow NPC selections"
                aria-label="Follow NPC selections"
                aria-pressed={mode === "follow"}
                className={`flex h-5 w-5 items-center justify-center rounded text-xs ${mode === "follow" ? "bg-sky-500/15 text-sky-300" : "text-zinc-500 hover:text-zinc-200"}`}
              >
                <i className="fa-solid fa-crosshairs" />
              </button>
            </div>
            {npc ? (
              <button
                type="button"
                onClick={() =>
                  navigate(`/campaigns/${campaignId}/npcs/${npc.id}`)
                }
                title="Open full NPC page"
                aria-label="Open full NPC page"
                className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <i className="fa-solid fa-up-right-from-square text-xs" />
              </button>
            ) : null}
          </div>,
          headerTarget,
        )
      : null;

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
   \* Browser state.
   */
  if (browserOpen || !selectedNpc) {
    const locationIds = new Set(locationNpcs.map((npc) => npc.id));
    const otherNpcs = filteredNpcs.filter((npc) => !locationIds.has(npc.id));
    return (
      <div className="flex h-full min-h-0 flex-col">
        {headerControls(selectedNpc)}
        <div className="workspace-no-drag shrink-0 border-b border-white/10 bg-black/20 p-2">
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600" />
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
                <span className="truncate text-xs font-bold uppercase tracking-[0.14em] text-emerald-300/70">
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
              <div className="border-b border-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-600">
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
  const detailSections: {
    id: DetailSection;
    label: string;
    icon: string;
    visible: boolean;
  }[] = [
    {
      id: "description",
      label: "Description",
      icon: "fa-solid fa-align-left",
      visible: hasText(selectedNpc.publicDescription),
    },
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
        hasText(selectedNpc.role) ||
        hasList(selectedNpc.relationships) ||
        hasList(selectedNpc.clues) ||
        hasList(selectedNpc.itemsLoot),
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
      {headerControls(selectedNpc)}
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
              </div>
              {subtitle ? (
                <div className="mt-0.5 whitespace-normal break-words text-xs leading-5 italic text-zinc-300">
                  {subtitle}
                </div>
              ) : null}
              {selectedNpc.personality?.length ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedNpc.personality.map((trait, index) => (
                    <span
                      key={`${trait}-${index}`}
                      className="rounded-md border border-violet-500/10 bg-violet-500/[0.05] px-1.5 py-1 text-xs text-violet-200"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {/* Most important live-roleplay info */}
        <div className="space-y-2.5 p-3">
          {selectedNpc.voice ? (
            <div className="text-xs leading-5 text-sky-200/85">
              <span className="mr-1.5 font-bold uppercase tracking-wide text-sky-300">
                🗣️ Voice:
              </span>
              <span className="whitespace-pre-wrap">{selectedNpc.voice}</span>
            </div>
          ) : null}
          {selectedNpc.mannerisms?.length ? (
            <div className="text-xs leading-5 text-violet-200/85">
              <span className="mr-1.5 font-bold uppercase tracking-wide text-violet-300">
                🎭 Manners:
              </span>
              <span>{selectedNpc.mannerisms.join(" · ")}</span>
            </div>
          ) : null}
          {selectedNpc.wants ? (
            <div className="text-xs leading-5 text-emerald-200/85">
              <span className="mr-1.5 font-bold uppercase tracking-wide text-emerald-300">
                🎯 Wants:
              </span>
              <span className="whitespace-pre-wrap">{selectedNpc.wants}</span>
            </div>
          ) : null}
          {selectedNpc.fears ? (
            <div className="text-xs leading-5 text-rose-200/85">
              <span className="mr-1.5 font-bold uppercase tracking-wide text-rose-300">
                ⚠ Fears:
              </span>
              <span className="whitespace-pre-wrap">{selectedNpc.fears}</span>
            </div>
          ) : null}
          {selectedNpc.quickReference ? (
            <section className="min-w-0">
              <div className="mb-1 text-xs font-bold uppercase tracking-wide text-violet-300">
                Quick Reference
              </div>
              <div className="whitespace-pre-wrap text-xs leading-5 text-violet-100/90">
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
                    className={`rounded-md border px-2 py-1 text-[10px] font-semibold leading-4 transition ${
                      activeSection === section.id
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-zinc-500 hover:bg-white/[0.07] hover:text-zinc-300"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
              {activeSection ? (
                <div className="mt-2 rounded-lg border border-white/10 bg-black/20 p-3">
                  {activeSection === "description" ? (
                    <div className="whitespace-pre-wrap text-xs leading-5 text-zinc-300">
                      {selectedNpc.publicDescription}
                    </div>
                  ) : null}

                  {activeSection === "knowledge" ? (
                    <div className="space-y-3">
                      {selectedNpc.knows?.length ? (
                        <div>
                          <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-emerald-300/70">
                            Knows
                          </div>
                          <NpcList items={selectedNpc.knows} />
                        </div>
                      ) : null}
                      {selectedNpc.doesntKnow?.length ? (
                        <div>
                          <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-zinc-600">
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
                          <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-amber-300/70">
                            Claims
                          </div>
                          <NpcList items={selectedNpc.claims} />
                        </div>
                      ) : null}
                      {selectedNpc.secretTruth ? (
                        <div>
                          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-rose-300/70">
                            Truth
                          </div>
                          <div className="whitespace-pre-wrap text-xs leading-5 text-zinc-300">
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
                      {selectedNpc.role ? (
                        <div>
                          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-zinc-600">
                            Role
                          </div>
                          <div className="text-xs leading-5 text-zinc-300">
                            {selectedNpc.role}
                          </div>
                        </div>
                      ) : null}
                      {selectedNpc.location ? (
                        <div>
                          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-zinc-600">
                            Location
                          </div>
                          <div className="text-xs text-zinc-300">
                            {selectedNpc.location}
                          </div>
                        </div>
                      ) : null}
                      {selectedNpc.relationships?.length ? (
                        <div>
                          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-zinc-600">
                            Relationships
                          </div>
                          <NpcList items={selectedNpc.relationships} />
                        </div>
                      ) : null}
                      {selectedNpc.clues?.length ? (
                        <div>
                          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-zinc-600">
                            Clues
                          </div>
                          <NpcList items={selectedNpc.clues} />
                        </div>
                      ) : null}
                      {selectedNpc.itemsLoot?.length ? (
                        <div>
                          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-zinc-600">
                            Items / Loot
                          </div>
                          <NpcList items={selectedNpc.itemsLoot} />
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {activeSection === "notes" ? (
                    <div className="whitespace-pre-wrap text-xs leading-5 text-zinc-300">
                      {selectedNpc.notes}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
      {/* Full-screen portrait, mounted outside the workspace/grid clipping. */}
      {portraitOpen && selectedNpc.imageUrl
        ? createPortal(
            <div
              className="workspace-no-drag fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedNpc.name || "NPC"} portrait`}
              onMouseDown={() => setPortraitOpen(false)}
            >
              <button
                type="button"
                onClick={() => setPortraitOpen(false)}
                aria-label="Close portrait"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900/80 text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
              >
                <i className="fa-solid fa-xmark" />
              </button>
              <img
                src={selectedNpc.imageUrl}
                alt={selectedNpc.name || "NPC"}
                onMouseDown={(event) => event.stopPropagation()}
                className="max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] rounded-xl object-contain shadow-2xl"
              />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
