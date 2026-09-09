import { useMemo, useState } from "react";

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
  const { allMonsters, loading, error } = useMonsterLibrary(campaignId);

  const { selectedEntity } = useWorkspace();

  const [search, setSearch] = useState("");

  const [showSelector, setShowSelector] = useState(false);

  const [showModeMenu, setShowModeMenu] = useState(false);

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

  const displayedMonster = mode === "follow" ? followedMonster : pinnedMonster;

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
    selectedEntity?.type === "monster"
      ? selectedEntity.encounterStatus
      : undefined;

  const followStatusLabel =
    followStatus === "active"
      ? "ACTIVE"
      : followStatus === "up-next"
        ? "UP NEXT"
        : followStatus === "manual"
          ? "INSPECTING"
          : "FOLLOWING";

  const followStatusClass =
    followStatus === "active"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
      : followStatus === "up-next"
        ? "border-sky-500/20 bg-sky-500/10 text-sky-300"
        : followStatus === "manual"
          ? "border-violet-500/20 bg-violet-500/10 text-violet-300"
          : "border-white/10 bg-white/5 text-zinc-400";

  const setMode = (nextMode: MonsterModuleMode) => {
    updateModule(module.id, {
      /*
       * Keep the module title generic.
       *
       * The actual monster is already obvious
       * inside the stat block.
       */
      title: "Monster Stat Block",

      config: {
        ...module.config,

        monsterMode: nextMode,
      },
    });

    setShowModeMenu(false);

    if (nextMode === "follow") {
      setShowSelector(false);
    } else if (!module.config?.selectedMonsterKey) {
      setShowSelector(true);
    }
  };

  const selectMonster = (monsterKey: string) => {
    updateModule(module.id, {
      title: "Monster Stat Block",

      config: {
        ...module.config,

        monsterMode: "pinned",

        selectedMonsterKey: monsterKey,
      },
    });

    setShowSelector(false);

    setSearch("");
  };

  const clearPinnedMonster = () => {
    updateModule(module.id, {
      title: "Monster Stat Block",

      config: {
        ...module.config,

        monsterMode: "pinned",

        selectedMonsterKey: undefined,
      },
    });

    setSearch("");

    setShowSelector(true);
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

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Compact toolbar */}

      <div className="workspace-no-drag relative flex h-9 shrink-0 items-center gap-2 border-b border-white/10 bg-black/20 px-2">
        {/* Follow status */}

        {mode === "follow" ? (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {followedMonster ? (
              <>
                <span
                  className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] ${followStatusClass}`}
                >
                  {followStatusLabel}
                </span>

                <span className="truncate text-[10px] font-medium text-zinc-400">
                  {followedMonster.name}
                </span>
              </>
            ) : (
              <span className="truncate text-[10px] text-zinc-500">
                Waiting for encounter monster
              </span>
            )}
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <span className="truncate text-[10px] text-zinc-500">
              {pinnedMonster
                ? `Pinned · ${pinnedMonster.name}`
                : "No monster pinned"}
            </span>
          </div>
        )}

        {/* Pinned controls */}

        {mode === "pinned" && pinnedMonster ? (
          <button
            type="button"
            onClick={clearPinnedMonster}
            title="Clear pinned monster"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        ) : null}

        {mode === "pinned" ? (
          <button
            type="button"
            onClick={() => setShowSelector((current) => !current)}
            title="Choose monster"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        ) : null}

        {/* Mode button */}

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowModeMenu((current) => !current)}
            title={mode === "follow" ? "Following encounter" : "Pinned monster"}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${
              mode === "follow"
                ? "border-sky-500/20 bg-sky-500/10 text-sky-300 hover:bg-sky-500/15"
                : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <i
              className={`fa-solid ${
                mode === "follow" ? "fa-crosshairs" : "fa-thumbtack"
              }`}
            />
          </button>

          {showModeMenu ? (
            <div className="absolute right-0 top-9 z-40 w-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 p-1 shadow-2xl">
              <div className="px-3 pb-1 pt-2">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                  Stat Block Mode
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMode("follow")}
                className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition ${
                  mode === "follow" ? "bg-sky-500/10" : "hover:bg-white/5"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                    mode === "follow"
                      ? "bg-sky-500/15 text-sky-300"
                      : "bg-white/5 text-zinc-500"
                  }`}
                >
                  <i className="fa-solid fa-crosshairs text-[10px]" />
                </div>

                <div className="min-w-0">
                  <div
                    className={`text-xs font-semibold ${
                      mode === "follow" ? "text-sky-300" : "text-white"
                    }`}
                  >
                    Follow Encounter
                  </div>

                  <div className="mt-0.5 text-[10px] leading-4 text-zinc-500">
                    Automatically show the active or next monster.
                  </div>
                </div>

                {mode === "follow" ? (
                  <i className="fa-solid fa-check ml-auto mt-1 text-[10px] text-sky-300" />
                ) : null}
              </button>

              <button
                type="button"
                onClick={() => setMode("pinned")}
                className={`mt-1 flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition ${
                  mode === "pinned" ? "bg-white/5" : "hover:bg-white/5"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                    mode === "pinned"
                      ? "bg-white/10 text-white"
                      : "bg-white/5 text-zinc-500"
                  }`}
                >
                  <i className="fa-solid fa-thumbtack text-[10px]" />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white">
                    Pin Monster
                  </div>

                  <div className="mt-0.5 text-[10px] leading-4 text-zinc-500">
                    Always keep one chosen monster visible.
                  </div>
                </div>

                {mode === "pinned" ? (
                  <i className="fa-solid fa-check ml-auto mt-1 text-[10px] text-zinc-300" />
                ) : null}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Monster selector */}

      {mode === "pinned" && showSelector ? (
        <div className="workspace-no-drag flex min-h-0 flex-1 flex-col p-3">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600" />

            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search monsters..."
              className="w-full rounded-xl border border-white/10 bg-black/30 py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500/40"
            />
          </div>

          <div className="workspace-scrollbar mt-2 min-h-0 flex-1 overflow-y-auto rounded-xl border border-white/10 bg-black/20">
            {filteredMonsters.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500">
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
                    className="flex w-full items-center gap-2 border-b border-white/5 p-2 text-left transition last:border-b-0 hover:bg-white/5"
                  >
                    {monster.img ? (
                      <img
                        src={monster.img}
                        alt=""
                        className="h-9 w-11 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-zinc-600">
                        <i className="fa-solid fa-dragon" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-semibold text-white">
                          {monster.name}
                        </span>

                        {monster.source === "campaign" ? (
                          <span className="shrink-0 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase text-emerald-300">
                            Campaign
                          </span>
                        ) : null}
                      </div>

                      <div className="truncate text-[10px] text-zinc-500">
                        CR {monster.challengeRating} · AC {monster.armorClass} ·
                        HP {monster.hp}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : displayedMonster ? (
        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
          <MonsterStatBlock monster={displayedMonster} compact />
        </div>
      ) : mode === "follow" ? (
        <div className="flex min-h-0 flex-1 items-center justify-center p-5 text-center">
          <div>
            <i className="fa-solid fa-crosshairs text-3xl text-sky-400/20" />

            <p className="mt-3 text-sm font-semibold text-zinc-300">
              Waiting for combat
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-600">
              The active monster, or the next monster after a player's turn,
              will appear here automatically.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center p-5 text-center">
          <div>
            <i className="fa-solid fa-dragon text-3xl text-rose-300/20" />

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
