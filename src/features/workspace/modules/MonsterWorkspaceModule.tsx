import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import MonsterStatBlock from "../../../components/monsters/MonsterStatBlock";

import useMonsterLibrary from "../../../hooks/useMonsterLibrary";

import { useWorkspace } from "../WorkspaceContext";

import type {
  MonsterModuleMode,
  WorkspaceModuleRenderProps,
} from "../workspaceTypes";

export default function MonsterWorkspaceModule({
  module,
  campaignId,
  updateModule,
}: WorkspaceModuleRenderProps) {
  const navigate = useNavigate();

  const { allMonsters, loading, error } = useMonsterLibrary(campaignId);

  const { selectedEntity, selectEntity } = useWorkspace();

  const [search, setSearch] = useState("");

  const [showSelector, setShowSelector] = useState(false);

  const mode: MonsterModuleMode = module.config?.monsterMode ?? "pinned";

  const pinnedMonster = useMemo(() => {
    const key = module.config?.selectedMonsterKey;

    if (!key) {
      return null;
    }

    return (
      allMonsters.find(
        (monster) => `${monster.source}:${monster.id}` === key,
      ) ?? null
    );
  }, [allMonsters, module.config?.selectedMonsterKey]);

  const followedMonster = useMemo(() => {
    if (selectedEntity?.type !== "monster") {
      return null;
    }

    return (
      allMonsters.find(
        (monster) =>
          `${monster.source}:${monster.id}` === selectedEntity.monsterKey,
      ) ?? null
    );
  }, [allMonsters, selectedEntity]);

  /*
   * Follow prefers the workspace selection.
   *
   * If there temporarily isn't one, retain the
   * last monster the module knew about rather
   * than unnecessarily blanking the module.
   */
  const displayedMonster =
    mode === "follow" ? (followedMonster ?? pinnedMonster) : pinnedMonster;

  const displayedMonsterKey = displayedMonster
    ? `${displayedMonster.source}:${displayedMonster.id}`
    : undefined;

  const filteredMonsters = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return allMonsters;
    }

    return allMonsters.filter((monster) =>
      [monster.name, monster.type, monster.description, monster.challengeRating]
        .join(" ")
        .toLowerCase()
        .includes(value),
    );
  }, [allMonsters, search]);

  const followStatus =
    mode === "follow" && selectedEntity?.type === "monster"
      ? selectedEntity.encounterStatus
      : undefined;

  const getStatusBadge = () => {
    if (mode === "pinned") {
      return {
        text: "PINNED",
        className: "border-amber-500/20 bg-amber-500/10 text-amber-300",
      };
    }

    if (followStatus === "active") {
      return {
        text: "CURRENT TURN",
        className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      };
    }

    if (followStatus === "up-next") {
      return {
        text: "UP NEXT",

        className: "border-sky-500/20 bg-sky-500/10 text-sky-300",
      };
    }

    if (followStatus === "manual") {
      return {
        text: "INSPECTING",

        className: "border-violet-500/20 bg-violet-500/10 text-violet-300",
      };
    }

    return {
      text: "FOLLOW",

      className: "border-sky-500/15 bg-sky-500/[0.07] text-sky-300",
    };
  };

  const statusBadge = getStatusBadge();

  /*
   * IMPORTANT:
   *
   * Follow -> Pin must freeze the monster that is
   * currently visible.
   *
   * It must NOT merely switch mode and then discover
   * that no pinnedMonster exists.
   */
  const setMode = (nextMode: MonsterModuleMode) => {
    if (nextMode === "pinned") {
      updateModule(module.id, {
        title: "Monster Stat Block",

        config: {
          ...module.config,

          monsterMode: "pinned",

          selectedMonsterKey:
            displayedMonsterKey ?? module.config?.selectedMonsterKey,
        },
      });

      setShowSelector(false);

      return;
    }

    updateModule(module.id, {
      title: "Monster Stat Block",

      config: {
        ...module.config,

        monsterMode: "follow",
      },
    });

    setShowSelector(false);
  };

  /*
   * Browser selection behaves differently based
   * on the current mode.
   *
   * Pinned:
   * replace the pinned monster.
   *
   * Follow:
   * create a manual workspace selection and remain
   * in Follow mode, matching Character behavior.
   */
  const selectMonster = (monsterKey: string) => {
    if (mode === "pinned") {
      updateModule(module.id, {
        title: "Monster Stat Block",

        config: {
          ...module.config,

          monsterMode: "pinned",

          selectedMonsterKey: monsterKey,
        },
      });
    } else {
      updateModule(module.id, {
        title: "Monster Stat Block",

        config: {
          ...module.config,

          selectedMonsterKey: monsterKey,
        },
      });

      selectEntity({
        type: "monster",

        monsterKey,

        encounterStatus: "manual",
      });
    }

    setShowSelector(false);

    setSearch("");
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-500">
        Loading monsters...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-sm text-rose-400">{error}</div>;
  }

  /*
   * Selector/browser.
   *
   * The toolbar intentionally remains visually
   * consistent with the Character module.
   */
  if (showSelector) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="workspace-no-drag flex h-10 shrink-0 items-center gap-1.5 border-b border-white/10 bg-black/20 px-2">
          <button
            type="button"
            onClick={() => setShowSelector(false)}
            title="Back to monster"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-arrow-left text-[9px]" />
          </button>

          <div className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-200">
            Choose Monster
          </div>

          <div className="flex shrink-0 rounded-lg border border-white/10 bg-black/20 p-0.5">
            <button
              type="button"
              onClick={() => setMode("pinned")}
              title="Pin current monster"
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
              title="Follow monster selections and encounter turns"
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
            onClick={() => navigate(`/campaigns/${campaignId}/monsters`)}
            title="Open monster library"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-up-right-from-square text-[9px]" />
          </button>
        </div>

        <div className="workspace-no-drag shrink-0 p-2">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-zinc-600" />

            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search monsters..."
              className="h-8 w-full rounded-lg border border-white/10 bg-black/30 py-1.5 pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500/30"
            />
          </div>
        </div>

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-white/5">
          {filteredMonsters.length === 0 ? (
            <div className="p-5 text-center text-xs text-zinc-600">
              No monsters found.
            </div>
          ) : (
            filteredMonsters.map((monster) => {
              const key = `${monster.source}:${monster.id}`;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectMonster(key)}
                  className="group flex w-full items-center gap-2.5 border-b border-white/5 p-2.5 text-left transition last:border-b-0 hover:bg-white/[0.035]"
                >
                  <div className="h-9 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                    {monster.img ? (
                      <img
                        src={monster.img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-600">
                        <i className="fa-solid fa-dragon text-xs" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-xs font-semibold text-zinc-200 group-hover:text-white">
                        {monster.name}
                      </span>

                      {monster.source === "campaign" ? (
                        <span className="shrink-0 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase text-emerald-300">
                          Campaign
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-0.5 truncate text-[9px] text-zinc-600">
                      CR {monster.challengeRating} · AC {monster.armorClass} ·
                      HP {monster.hp}
                    </div>
                  </div>

                  <i className="fa-solid fa-chevron-right shrink-0 text-[8px] text-zinc-700 transition group-hover:text-zinc-400" />
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Standardized toolbar */}

      <div className="workspace-no-drag flex h-10 shrink-0 items-center gap-1.5 border-b border-white/10 bg-black/20 px-2">
        <button
          type="button"
          onClick={() => setShowSelector(true)}
          title="Browse monsters"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-list text-[9px]" />
        </button>

        <div className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-200">
          {displayedMonster?.name ?? "Monster"}
        </div>

        {/* Same Pin / Follow control as Character */}

        <div className="flex shrink-0 rounded-lg border border-white/10 bg-black/20 p-0.5">
          <button
            type="button"
            onClick={() => setMode("pinned")}
            disabled={!displayedMonster}
            title="Pin this monster"
            className={`flex h-6 w-6 items-center justify-center rounded-md text-[9px] transition disabled:opacity-25 ${
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
            title="Follow monster selections and encounter turns"
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
          onClick={() => navigate(`/campaigns/${campaignId}/monsters`)}
          title="Open monster library"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-up-right-from-square text-[9px]" />
        </button>
      </div>

      {displayedMonster ? (
        <>
          {/* Compact state strip */}

          <div className="workspace-no-drag flex h-9 shrink-0 items-center gap-2 border-b border-white/10 bg-black/10 px-3">
            <span
              className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] ${statusBadge.className}`}
            >
              {statusBadge.text}
            </span>

            <span className="min-w-0 flex-1 truncate text-[10px] text-zinc-500">
              {displayedMonster.name}
            </span>
          </div>

          <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
            <MonsterStatBlock monster={displayedMonster} compact />
          </div>
        </>
      ) : mode === "follow" ? (
        <div className="flex min-h-0 flex-1 items-center justify-center p-5 text-center">
          <div>
            <i className="fa-solid fa-crosshairs text-3xl text-sky-400/20" />

            <p className="mt-3 text-sm font-semibold text-zinc-300">
              Waiting for monster
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-600">
              The active monster, next monster, or a manually inspected monster
              will appear here.
            </p>

            <button
              type="button"
              onClick={() => setShowSelector(true)}
              className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              Browse Monsters
            </button>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center p-5 text-center">
          <div>
            <i className="fa-solid fa-dragon text-3xl text-amber-300/20" />

            <p className="mt-3 text-sm font-semibold text-zinc-300">
              No monster pinned
            </p>

            <button
              type="button"
              onClick={() => setShowSelector(true)}
              className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              Choose Monster
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
