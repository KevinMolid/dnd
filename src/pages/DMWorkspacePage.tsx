import { useEffect, useMemo, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";

import ReactGridLayout, {
  useContainerWidth,
  type Layout,
  type LayoutItem,
} from "react-grid-layout";

import { db } from "../firebase";

import logo from "/images/Lorebound.png";

import { MODULE_REGISTRY } from "../features/workspace/moduleRegistry";

import type {
  WorkspaceModule,
  WorkspaceModuleType,
} from "../features/workspace/workspaceTypes";

import type { CampaignDoc } from "../types/campaign";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { usePageTitle } from "../hooks/usePageTitle";

type SavedWorkspace = {
  modules: WorkspaceModule[];

  layout: LayoutItem[];
};

const DEFAULT_MODULES: WorkspaceModule[] = [
  {
    id: "default-map",
    type: "map",
    title: "Map",
  },

  {
    id: "default-encounter",
    type: "encounter",
    title: "Encounter",
  },

  {
    id: "default-monster",
    type: "monster",
    title: "Monster Stat Block",
  },

  {
    id: "default-notes",
    type: "notes",
    title: "DM Notes",
  },
];

/*
 * 24-column workspace.
 *
 * These defaults are intentionally only a starting point.
 * The workspace is designed to be manually resized by the DM.
 */
const DEFAULT_LAYOUT: LayoutItem[] = [
  {
    i: "default-map",
    x: 0,
    y: 0,
    w: 14,
    h: 20,
    minW: 6,
    minH: 6,
  },

  {
    i: "default-encounter",
    x: 14,
    y: 0,
    w: 10,
    h: 10,
    minW: 6,
    minH: 5,
  },

  {
    i: "default-notes",
    x: 14,
    y: 10,
    w: 6,
    h: 10,
    minW: 4,
    minH: 4,
  },

  {
    i: "default-monster",
    x: 20,
    y: 10,
    w: 4,
    h: 10,
    minW: 4,
    minH: 5,
  },
];

const createModuleId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `module-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const getStorageKey = (campaignId: string) => `rphub-workspace-${campaignId}`;

function loadWorkspace(campaignId: string): SavedWorkspace | null {
  try {
    const raw = localStorage.getItem(getStorageKey(campaignId));

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as SavedWorkspace;

    if (!Array.isArray(parsed.modules) || !Array.isArray(parsed.layout)) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load workspace", error);

    return null;
  }
}

function saveWorkspace(campaignId: string, workspace: SavedWorkspace) {
  try {
    localStorage.setItem(
      getStorageKey(campaignId),

      JSON.stringify(workspace),
    );
  } catch (error) {
    console.error("Failed to save workspace", error);
  }
}

type WorkspaceModuleCardProps = {
  module: WorkspaceModule;

  campaignId: string;

  editing: boolean;

  onRemove: (id: string) => void;

  onUpdate: (moduleId: string, changes: Partial<WorkspaceModule>) => void;
};

function WorkspaceModuleCard({
  module,
  campaignId,
  editing,
  onRemove,
  onUpdate,
}: WorkspaceModuleCardProps) {
  const definition = MODULE_REGISTRY[module.type];

  const ModuleComponent = definition.component;

  const showHeader = definition.showHeader !== false;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
      {showHeader ? (
        <div
          className={`workspace-drag-handle flex h-9 shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.025] px-2.5 ${
            editing ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <div className="flex min-w-0 items-center gap-2">
            <i
              className={`${definition.icon} shrink-0 text-xs text-emerald-400`}
            />

            <span className="truncate text-xs font-semibold text-zinc-100">
              {module.title}
            </span>
          </div>

          {editing ? (
            <button
              type="button"
              title="Remove module"
              aria-label={`Remove ${module.title}`}
              onClick={() => onRemove(module.id)}
              className="workspace-no-drag flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-hidden">
        <ModuleComponent
          module={module}
          campaignId={campaignId}
          editing={editing}
          updateModule={onUpdate}
          removeModule={onRemove}
        />
      </div>
    </div>
  );
}

export default function DMWorkspacePage() {
  const { campaignId } = useParams<{
    campaignId: string;
  }>();

  const { width, containerRef, mounted } = useContainerWidth();

  const [campaignName, setCampaignName] = useState<string>("Campaign");

  usePageTitle(campaignName, "Workspace");

  const [modules, setModules] = useState<WorkspaceModule[]>(DEFAULT_MODULES);

  const [layout, setLayout] = useState<LayoutItem[]>(DEFAULT_LAYOUT);

  const [editing, setEditing] = useState(false);

  const [showModulePicker, setShowModulePicker] = useState(false);

  const [hasLoaded, setHasLoaded] = useState(false);

  /*
   * Only fetch the one piece of campaign data this
   * shell actually needs: the campaign name.
   *
   * We deliberately do not use useCampaignPageData()
   * here because that hook subscribes to characters,
   * users, members, journal entries, etc.
   */
  useEffect(() => {
    if (!campaignId) {
      return;
    }

    let cancelled = false;

    const loadCampaignName = async () => {
      try {
        const snapshot = await getDoc(doc(db, "campaigns", campaignId));

        if (cancelled || !snapshot.exists()) {
          return;
        }

        const data = snapshot.data() as CampaignDoc;

        const name = data.name?.trim();

        if (name) {
          setCampaignName(name);
        }
      } catch (error) {
        console.error("Failed to load workspace campaign name:", error);
      }
    };

    loadCampaignName();

    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId) {
      return;
    }

    const saved = loadWorkspace(campaignId);

    if (saved) {
      setModules(saved.modules);

      setLayout(saved.layout);
    }

    setHasLoaded(true);
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId || !hasLoaded) {
      return;
    }

    saveWorkspace(campaignId, {
      modules,
      layout,
    });
  }, [campaignId, modules, layout, hasLoaded]);

  function handleLayoutChange(nextLayout: Layout) {
    setLayout([...nextLayout]);
  }

  function handleUpdateModule(
    moduleId: string,
    changes: Partial<WorkspaceModule>,
  ) {
    setModules((current) =>
      current.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              ...changes,
            }
          : module,
      ),
    );
  }

  function handleAddModule(type: WorkspaceModuleType) {
    const definition = MODULE_REGISTRY[type];

    const id = createModuleId();

    const module: WorkspaceModule = {
      id,

      type,

      title: definition.title,

      config: {},
    };

    const layoutItem: LayoutItem = {
      i: id,

      x: 0,

      y: Infinity,

      w: definition.defaultW,

      h: definition.defaultH,

      minW: definition.minW,

      minH: definition.minH,
    };

    setModules((current) => [...current, module]);

    setLayout((current) => [...current, layoutItem]);

    setShowModulePicker(false);
  }

  function handleRemoveModule(id: string) {
    setModules((current) => current.filter((module) => module.id !== id));

    setLayout((current) => current.filter((item) => item.i !== id));
  }

  function handleResetWorkspace() {
    const confirmed = window.confirm(
      "Reset this workspace to the default layout?",
    );

    if (!confirmed) {
      return;
    }

    setModules(DEFAULT_MODULES);

    setLayout(DEFAULT_LAYOUT);

    setShowModulePicker(false);
  }

  const renderedModules = useMemo(
    () =>
      modules.map((module) => (
        <div key={module.id}>
          <WorkspaceModuleCard
            module={module}
            campaignId={campaignId ?? ""}
            editing={editing}
            onRemove={handleRemoveModule}
            onUpdate={handleUpdateModule}
          />
        </div>
      )),

    [modules, campaignId, editing],
  );

  if (!campaignId) {
    return (
      <div className="p-4 text-sm text-rose-400">No campaign selected.</div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* =====================================================
          COMPACT WORKSPACE SHELL
      ===================================================== */}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl">
        <div className="flex h-10 min-w-0 items-center justify-between gap-3 px-2">
          {/* Navigation / breadcrumbs */}

          <div className="flex min-w-0 items-center gap-2">
            <Link
              to="/"
              title="Lorebound home"
              aria-label="Lorebound home"
              className="flex shrink-0 items-center gap-1.5 rounded-md transition hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <img
                src={logo}
                alt=""
                className="h-7 w-7 shrink-0 object-contain"
              />

              <span
                className="hidden text-sm font-semibold text-zinc-100 sm:block"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                }}
              >
                Lorebound
              </span>
            </Link>

            <i
              className="fa-solid fa-chevron-right shrink-0 text-[8px] text-zinc-700"
              aria-hidden="true"
            />

            <Link
              to={`/campaigns/${campaignId}`}
              title={`Open ${campaignName}`}
              className="min-w-0 truncate text-xs font-semibold text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {campaignName}
            </Link>

            <i
              className="fa-solid fa-chevron-right shrink-0 text-[8px] text-zinc-700"
              aria-hidden="true"
            />

            <span
              aria-current="page"
              className="shrink-0 text-xs font-medium text-zinc-500"
            >
              Workspace
            </span>

            {editing ? (
              <span className="hidden shrink-0 rounded border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-300 sm:inline">
                Editing
              </span>
            ) : null}
          </div>

          {/* Workspace controls */}

          <div className="flex shrink-0 items-center gap-1.5">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowModulePicker(true)}
                  className="flex h-7 items-center rounded-md bg-emerald-500 px-2.5 text-[11px] font-semibold text-white transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50"
                >
                  <i className="fa-solid fa-plus mr-1.5 text-[9px]" />

                  <span className="hidden sm:inline">Module</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetWorkspace}
                  className="flex h-7 items-center rounded-md border border-white/10 bg-white/5 px-2.5 text-[11px] text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <i className="fa-solid fa-arrow-rotate-left mr-1.5 text-[9px]" />

                  <span className="hidden sm:inline">Reset</span>
                </button>
              </>
            ) : null}

            <button
              type="button"
              onClick={() => setEditing((current) => !current)}
              className={`flex h-7 items-center rounded-md px-2.5 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 ${
                editing
                  ? "bg-emerald-500 text-white hover:bg-emerald-400 focus-visible:ring-emerald-300/50"
                  : "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white focus-visible:ring-white/30"
              }`}
            >
              <i
                className={`fa-solid ${
                  editing ? "fa-check" : "fa-pen"
                } mr-1.5 text-[9px]`}
              />

              {editing ? "Done" : "Edit layout"}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          GRID
      ===================================================== */}

      <main className="p-2">
        <div
          ref={containerRef as React.Ref<HTMLDivElement>}
          className={editing ? "rounded-lg bg-white/[0.015]" : ""}
        >
          {mounted && hasLoaded ? (
            <ReactGridLayout
              layout={layout}
              width={width}
              onLayoutChange={handleLayoutChange}
              gridConfig={{
                cols: 24,

                rowHeight: 28,

                margin: [8, 8],

                containerPadding: [0, 0],
              }}
              dragConfig={{
                enabled: editing,

                handle: ".workspace-drag-handle",

                cancel: ".workspace-no-drag",

                bounded: false,
              }}
              resizeConfig={{
                enabled: editing,

                handles: ["se"],
              }}
            >
              {renderedModules}
            </ReactGridLayout>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center text-xs text-zinc-500">
              Loading workspace...
            </div>
          )}
        </div>
      </main>

      {/* =====================================================
          MODULE PICKER
      ===================================================== */}

      {showModulePicker ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm"
          onMouseDown={() => setShowModulePicker(false)}
        >
          <div
            className="max-h-[calc(100vh-24px)] w-full max-w-xl overflow-y-auto rounded-xl border border-white/10 bg-zinc-900 p-4 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white">Add module</h2>

                <p className="mt-0.5 text-xs text-zinc-500">
                  Add another tool to the workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModulePicker(false)}
                aria-label="Close module picker"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {Object.values(MODULE_REGISTRY).map((definition) => (
                <button
                  key={definition.type}
                  type="button"
                  onClick={() => handleAddModule(definition.type)}
                  className="group flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-3 text-left transition hover:border-emerald-500/30 hover:bg-emerald-500/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/5 text-zinc-400 transition group-hover:bg-emerald-500/10 group-hover:text-emerald-300">
                    <i className={`${definition.icon} text-sm`} />
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">
                      {definition.title}
                    </div>

                    <div className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-zinc-500">
                      {definition.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
