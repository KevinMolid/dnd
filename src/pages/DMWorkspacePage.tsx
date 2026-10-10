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

type WorkspaceTab = {
  id: string;

  name: string;

  modules: WorkspaceModule[];

  layout: LayoutItem[];
};

type SavedWorkspace = {
  activeTabId: string;

  tabs: WorkspaceTab[];
};

type LegacySavedWorkspace = {
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

const createWorkspaceTabId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `workspace-tab-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createDefaultWorkspaceTab = (): WorkspaceTab => ({
  id: "default",

  name: "Main",

  modules: DEFAULT_MODULES.map((module) => ({
    ...module,

    config: module.config ? { ...module.config } : module.config,
  })),

  layout: DEFAULT_LAYOUT.map((item) => ({ ...item })),
});

const duplicateWorkspaceTab = (tab: WorkspaceTab): WorkspaceTab => {
  const idMap = new Map<string, string>();

  const modules = tab.modules.map((module) => {
    const nextId = createModuleId();

    idMap.set(module.id, nextId);

    return {
      ...module,

      id: nextId,

      config: module.config ? { ...module.config } : module.config,
    };
  });

  return {
    id: createWorkspaceTabId(),

    name: `${tab.name} copy`,

    modules,

    layout: tab.layout.map((item) => ({
      ...item,

      i: idMap.get(item.i) ?? item.i,
    })),
  };
};

const getStorageKey = (campaignId: string) => `rphub-workspace-${campaignId}`;

function loadWorkspace(campaignId: string): SavedWorkspace | null {
  try {
    const raw = localStorage.getItem(getStorageKey(campaignId));

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as SavedWorkspace | LegacySavedWorkspace;

    if (
      "tabs" in parsed &&
      Array.isArray(parsed.tabs) &&
      parsed.tabs.length > 0
    ) {
      const validTabs = parsed.tabs.filter(
        (tab) =>
          tab &&
          typeof tab.id === "string" &&
          typeof tab.name === "string" &&
          Array.isArray(tab.modules) &&
          Array.isArray(tab.layout),
      );

      if (validTabs.length === 0) {
        return null;
      }

      const requestedActiveId =
        typeof parsed.activeTabId === "string" ? parsed.activeTabId : "";

      return {
        activeTabId: validTabs.some((tab) => tab.id === requestedActiveId)
          ? requestedActiveId
          : validTabs[0].id,

        tabs: validTabs,
      };
    }

    if (
      "modules" in parsed &&
      "layout" in parsed &&
      Array.isArray(parsed.modules) &&
      Array.isArray(parsed.layout)
    ) {
      const migratedTab: WorkspaceTab = {
        id: "default",

        name: "Main",

        modules: parsed.modules,

        layout: parsed.layout,
      };

      return {
        activeTabId: migratedTab.id,

        tabs: [migratedTab],
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to load workspace", error);

    return null;
  }
}

function saveWorkspace(campaignId: string, workspace: SavedWorkspace) {
  try {
    const browserWorkspace: SavedWorkspace = {
      ...workspace,

      tabs: workspace.tabs.map((tab) => ({
        ...tab,

        modules: tab.modules.map((module) =>
          module.type === "notes"
            ? {
                ...module,

                config: {
                  ...module.config,

                  noteContent: undefined,
                },
              }
            : module,
        ),
      })),
    };

    localStorage.setItem(
      getStorageKey(campaignId),

      JSON.stringify(browserWorkspace),
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
  const isNpcModule = module.type === "npc";

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
              {isNpcModule ? "NPC" : module.title}
            </span>
          </div>

          {isNpcModule ? (
            <div
              id={`npc-workspace-header-${module.id}`}
              className="workspace-no-drag ml-auto flex min-w-0 items-center gap-1"
            />
          ) : null}

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

  const [tabs, setTabs] = useState<WorkspaceTab[]>(() => [
    createDefaultWorkspaceTab(),
  ]);

  const [activeTabId, setActiveTabId] = useState("default");

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

    setHasLoaded(false);

    const saved = loadWorkspace(campaignId);

    if (saved) {
      setTabs(saved.tabs);

      setActiveTabId(saved.activeTabId);
    } else {
      const defaultTab = createDefaultWorkspaceTab();

      setTabs([defaultTab]);

      setActiveTabId(defaultTab.id);
    }

    setHasLoaded(true);
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId || !hasLoaded) {
      return;
    }

    saveWorkspace(campaignId, {
      activeTabId,

      tabs,
    });
  }, [campaignId, activeTabId, tabs, hasLoaded]);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0] ?? null,

    [tabs, activeTabId],
  );

  const modules = activeTab?.modules ?? [];

  const layout = activeTab?.layout ?? [];

  function updateActiveTab(updater: (tab: WorkspaceTab) => WorkspaceTab) {
    setTabs((current) =>
      current.map((tab) => (tab.id === activeTabId ? updater(tab) : tab)),
    );
  }

  function handleLayoutChange(nextLayout: Layout) {
    updateActiveTab((tab) => ({
      ...tab,

      layout: [...nextLayout],
    }));
  }

  function handleUpdateModule(
    moduleId: string,

    changes: Partial<WorkspaceModule>,
  ) {
    updateActiveTab((tab) => ({
      ...tab,

      modules: tab.modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,

              ...changes,
            }
          : module,
      ),
    }));
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

    updateActiveTab((tab) => ({
      ...tab,

      modules: [...tab.modules, module],

      layout: [...tab.layout, layoutItem],
    }));

    setShowModulePicker(false);
  }

  function handleRemoveModule(id: string) {
    updateActiveTab((tab) => ({
      ...tab,

      modules: tab.modules.filter((module) => module.id !== id),

      layout: tab.layout.filter((item) => item.i !== id),
    }));
  }

  function handleResetWorkspace() {
    if (!activeTab) return;

    const confirmed = window.confirm(
      `Reset "${activeTab.name}" to the default layout?`,
    );

    if (!confirmed) return;

    const defaultTab = createDefaultWorkspaceTab();

    updateActiveTab((tab) => ({
      ...tab,

      modules: defaultTab.modules,

      layout: defaultTab.layout,
    }));

    setShowModulePicker(false);
  }

  function handleAddTab() {
    const newTab: WorkspaceTab = {
      id: createWorkspaceTabId(),

      name: `Tab ${tabs.length + 1}`,

      modules: [],

      layout: [],
    };

    setTabs((current) => [...current, newTab]);

    setActiveTabId(newTab.id);

    setShowModulePicker(false);
  }

  function handleRenameTab(tab: WorkspaceTab) {
    const nextName = window.prompt("Tab name", tab.name)?.trim();

    if (!nextName || nextName === tab.name) return;

    setTabs((current) =>
      current.map((candidate) =>
        candidate.id === tab.id ? { ...candidate, name: nextName } : candidate,
      ),
    );
  }

  function handleDuplicateTab(tab: WorkspaceTab) {
    const duplicate = duplicateWorkspaceTab(tab);

    setTabs((current) => [...current, duplicate]);

    setActiveTabId(duplicate.id);
  }

  function handleDeleteTab(tab: WorkspaceTab) {
    if (tabs.length <= 1) {
      window.alert("The workspace must have at least one tab.");

      return;
    }

    const confirmed = window.confirm(`Delete workspace tab "${tab.name}"?`);

    if (!confirmed) return;

    setTabs((current) => {
      const index = current.findIndex((candidate) => candidate.id === tab.id);

      const nextTabs = current.filter((candidate) => candidate.id !== tab.id);

      if (activeTabId === tab.id) {
        const nextActive =
          nextTabs[Math.min(index, nextTabs.length - 1)] ?? nextTabs[0];

        if (nextActive) {
          setActiveTabId(nextActive.id);
        }
      }

      return nextTabs;
    });
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

  const tabControls = (
    <div className="workspace-scrollbar flex min-w-0 items-center gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <div
            key={tab.id}
            className={`group flex h-7 shrink-0 items-center rounded-md border transition ${
              isActive
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-transparent text-zinc-500 hover:border-white/10 hover:bg-white/[0.04] hover:text-zinc-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className="h-full max-w-40 truncate px-2.5 text-[11px] font-semibold 2xl:max-w-56"
              title={tab.name}
            >
              {tab.name}
            </button>

            {editing && isActive ? (
              <div className="flex items-center border-l border-white/10 pr-1">
                <button
                  type="button"
                  onClick={() => handleRenameTab(tab)}
                  title="Rename tab"
                  aria-label={`Rename ${tab.name}`}
                  className="flex h-6 w-6 items-center justify-center rounded text-[9px] text-zinc-500 transition hover:bg-white/10 hover:text-white"
                >
                  <i className="fa-solid fa-pen" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDuplicateTab(tab)}
                  title="Duplicate tab"
                  aria-label={`Duplicate ${tab.name}`}
                  className="flex h-6 w-6 items-center justify-center rounded text-[9px] text-zinc-500 transition hover:bg-white/10 hover:text-white"
                >
                  <i className="fa-regular fa-copy" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteTab(tab)}
                  title="Delete tab"
                  aria-label={`Delete ${tab.name}`}
                  className="flex h-6 w-6 items-center justify-center rounded text-[9px] text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ) : null}
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleAddTab}
        title="Add workspace tab"
        aria-label="Add workspace tab"
        className="flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-dashed border-white/10 px-2.5 text-[11px] font-semibold text-zinc-500 transition hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-300"
      >
        <i className="fa-solid fa-plus text-[9px]" />

        <span className="hidden 2xl:inline">Tab</span>
      </button>
    </div>
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

          <div className="flex min-w-0 shrink-0 items-center gap-1.5">
            <div className="hidden min-w-0 max-w-[48vw] xl:block">
              {tabControls}
            </div>

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

      <div className="sticky top-10 z-30 border-b border-white/10 bg-zinc-950/95 px-2 py-1 xl:hidden">
        {tabControls}
      </div>

      {/* =====================================================



          GRID



      ===================================================== */}

      <main className="p-2">
        <div
          ref={containerRef as React.Ref<HTMLDivElement>}
          className={editing ? "rounded-lg bg-white/[0.015]" : ""}
        >
          {mounted && hasLoaded && activeTab ? (
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
