import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import useMonsterLibrary from "../../../hooks/useMonsterLibrary";

import { useWorkspace } from "../WorkspaceContext";

import type {
  MonsterModuleMode,
  WorkspaceModuleRenderProps,
} from "../workspaceTypes";

import type { MonsterTextEntry } from "../../monsters/catalog/monsterTypes";

type WorkspaceMonster = {
  id: string;

  source: "default" | "campaign";

  name: string;

  type?: string;

  description: string;

  img?: string;

  armorClass: number;

  armorClassNotes?: string;

  hp: number;

  speed: number | string;

  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };

  skills?: string;

  senses?: string;

  language?: string;

  challengeRating: string;

  xp: number;

  traits?: MonsterTextEntry[];

  actions?: MonsterTextEntry[];

  bonusActions?: MonsterTextEntry[];

  reactions?: MonsterTextEntry[];
};

const ABILITIES = [
  ["STR", "str"],
  ["DEX", "dex"],
  ["CON", "con"],
  ["INT", "int"],
  ["WIS", "wis"],
  ["CHA", "cha"],
] as const;

const getAbilityModifier = (score: number) => {
  return Math.floor((score - 10) / 2);
};

const formatModifier = (modifier: number) => {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

const formatSpeed = (speed: number | string) => {
  if (typeof speed === "number") {
    return `${speed} ft`;
  }

  return speed;
};

const MonsterTextSection = ({
  title,
  entries,
}: {
  title: string;

  entries?: MonsterTextEntry[];
}) => {
  if (!entries?.length) {
    return null;
  }

  return (
    <section className="border-t border-white/10 px-3 py-3">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
        {title}
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <p
            key={`${entry.name}-${index}`}
            className="text-xs leading-5 text-zinc-300"
          >
            <span className="font-semibold italic text-zinc-100">
              {entry.name}.
            </span>{" "}
            {entry.text}
          </p>
        ))}
      </div>
    </section>
  );
};

export default function MonsterWorkspaceModule({
  module,

  campaignId,

  editing,

  updateModule,

  removeModule,
}: WorkspaceModuleRenderProps) {
  const navigate = useNavigate();

  const { allMonsters, loading, error } = useMonsterLibrary(campaignId);

  const { selectedEntity, selectEntity } = useWorkspace();

  const [search, setSearch] = useState("");

  const [showSelector, setShowSelector] = useState(false);

  const [portraitOpen, setPortraitOpen] = useState(false);

  const mode: MonsterModuleMode = module.config?.monsterMode ?? "pinned";

  /*
   * Persisted monster.
   *
   * This is the reason pinned monsters survive refresh:
   * module.config is the authoritative persisted state.
   */
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

  /*
   * Workspace-followed monster.
   */
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
   * Follow prefers the live workspace selection.
   * If there isn't one, keep showing the last
   * persisted monster.
   */
  const displayedMonster = (
    mode === "follow" ? (followedMonster ?? pinnedMonster) : pinnedMonster
  ) as WorkspaceMonster | null;

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
        text: "Pinned",

        className: "border-amber-500/15 bg-amber-500/[0.07] text-amber-300",
      };
    }

    if (followStatus === "active") {
      return {
        text: "Current Turn",

        className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      };
    }

    if (followStatus === "up-next") {
      return {
        text: "Up Next",

        className: "border-sky-500/20 bg-sky-500/10 text-sky-300",
      };
    }

    if (followStatus === "manual") {
      return {
        text: "Focus",

        className: "border-violet-500/20 bg-violet-500/10 text-violet-300",
      };
    }

    return {
      text: "Follow",

      className: "border-sky-500/15 bg-sky-500/[0.07] text-sky-300",
    };
  };

  const statusBadge = getStatusBadge();

  /*
   * Follow -> Pin freezes exactly the monster
   * currently visible.
   */
  const setMode = (nextMode: MonsterModuleMode) => {
    if (nextMode === "pinned") {
      updateModule(module.id, {
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
      config: {
        ...module.config,

        monsterMode: "follow",

        /*
         * Keep last visible monster as fallback,
         * matching Character behavior.
         */
        selectedMonsterKey:
          displayedMonsterKey ?? module.config?.selectedMonsterKey,
      },
    });

    setShowSelector(false);
  };

  /*
   * Browser selection:
   *
   * pinned -> replace pinned monster
   * follow -> set manual Workspace focus and keep follow
   */
  const selectMonster = (monsterKey: string) => {
    if (mode === "pinned") {
      updateModule(module.id, {
        config: {
          ...module.config,

          monsterMode: "pinned",

          selectedMonsterKey: monsterKey,
        },
      });
    } else {
      updateModule(module.id, {
        config: {
          ...module.config,

          monsterMode: "follow",

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
      <div className="flex h-full items-center justify-center text-xs text-zinc-500">
        Loading monsters...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-sm text-rose-400">{error}</div>;
  }

  /*
   * =========================================================
   * MONSTER BROWSER
   * =========================================================
   */

  if (showSelector) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {/* Integrated header */}

        <div
          className={`workspace-drag-handle flex h-9 shrink-0 items-center gap-1.5 border-b border-white/10 bg-white/[0.025] px-2.5 ${
            editing ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <i className="fa-solid fa-dragon shrink-0 text-xs text-emerald-400" />

          <div className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-100">
            Choose Monster
          </div>

          {displayedMonster ? (
            <button
              type="button"
              onClick={() => setShowSelector(false)}
              title="Back to monster"
              aria-label="Back to monster"
              className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <i className="fa-solid fa-arrow-left text-[10px]" />
            </button>
          ) : null}

          <div className="workspace-no-drag flex shrink-0 rounded-md border border-white/10 bg-black/20 p-0.5">
            <button
              type="button"
              onClick={() => setMode("pinned")}
              disabled={!displayedMonster}
              title="Pin current monster"
              aria-label="Pin current monster"
              className={`flex h-6 w-6 items-center justify-center rounded text-[9px] transition disabled:opacity-25 ${
                mode === "pinned"
                  ? "bg-amber-500/15 text-amber-300"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <i className="fa-solid fa-thumbtack" />
            </button>

            <button
              type="button"
              onClick={() => setMode("follow")}
              title="Follow monster selections and encounter turns"
              aria-label="Follow monster selections and encounter turns"
              className={`flex h-6 w-6 items-center justify-center rounded text-[9px] transition ${
                mode === "follow"
                  ? "bg-sky-500/15 text-sky-300"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <i className="fa-solid fa-crosshairs" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/campaigns/${campaignId}/monsters`)}
            title="Open monster library"
            aria-label="Open monster library"
            className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-up-right-from-square text-[10px]" />
          </button>

          {editing ? (
            <button
              type="button"
              onClick={() => removeModule(module.id)}
              title="Remove module"
              aria-label="Remove monster module"
              className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <i className="fa-solid fa-xmark text-[10px]" />
            </button>
          ) : null}
        </div>

        {/* Search */}

        <div className="workspace-no-drag shrink-0 p-2">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500" />

            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search monsters..."
              aria-label="Search monsters"
              className="h-8 w-full rounded-lg border border-white/10 bg-black/30 py-1.5 pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-500 focus:border-emerald-500/30"
            />
          </div>
        </div>

        {/* List */}

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-white/5">
          {filteredMonsters.length === 0 ? (
            <div className="p-5 text-center text-xs text-zinc-500">
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
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
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

                    <div className="mt-0.5 truncate text-[9px] text-zinc-500">
                      {monster.description}
                    </div>

                    <div className="mt-0.5 truncate text-[9px] text-zinc-600">
                      CR {monster.challengeRating} · AC {monster.armorClass} ·
                      HP {monster.hp}
                    </div>
                  </div>

                  <i className="fa-solid fa-chevron-right shrink-0 text-[8px] text-zinc-600 transition group-hover:text-zinc-300" />
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * NO MONSTER
   * =========================================================
   */

  if (!displayedMonster) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {/* Integrated header */}

        <div
          className={`workspace-drag-handle flex h-9 shrink-0 items-center gap-1.5 border-b border-white/10 bg-white/[0.025] px-2.5 ${
            editing ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <i className="fa-solid fa-dragon shrink-0 text-xs text-emerald-400" />

          <div className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-100">
            Monster
          </div>

          <button
            type="button"
            onClick={() => setShowSelector(true)}
            title="Browse monsters"
            aria-label="Browse monsters"
            className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-list text-[10px]" />
          </button>

          <div className="workspace-no-drag flex shrink-0 rounded-md border border-white/10 bg-black/20 p-0.5">
            <button
              type="button"
              disabled
              title="Pin monster"
              className="flex h-6 w-6 items-center justify-center rounded text-[9px] text-zinc-600 opacity-25"
            >
              <i className="fa-solid fa-thumbtack" />
            </button>

            <button
              type="button"
              onClick={() => setMode("follow")}
              title="Follow monster selections and encounter turns"
              className={`flex h-6 w-6 items-center justify-center rounded text-[9px] transition ${
                mode === "follow"
                  ? "bg-sky-500/15 text-sky-300"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <i className="fa-solid fa-crosshairs" />
            </button>
          </div>

          {editing ? (
            <button
              type="button"
              onClick={() => removeModule(module.id)}
              title="Remove module"
              className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <i className="fa-solid fa-xmark text-[10px]" />
            </button>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center p-5 text-center">
          <div>
            <i
              className={`fa-solid ${
                mode === "follow"
                  ? "fa-crosshairs text-sky-400/20"
                  : "fa-dragon text-emerald-400/20"
              } text-3xl`}
            />

            <p className="mt-3 text-sm font-semibold text-zinc-300">
              {mode === "follow" ? "Waiting for monster" : "No monster pinned"}
            </p>

            {mode === "follow" ? (
              <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-500">
                The active monster, next monster, or a manually focused monster
                will appear here.
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => setShowSelector(true)}
              className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              Choose Monster
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * MONSTER SHEET
   * =========================================================
   */

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* Integrated module header */}

      <div
        className={`workspace-drag-handle flex h-9 shrink-0 items-center gap-1.5 border-b border-white/10 bg-white/[0.025] px-2.5 ${
          editing ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <i className="fa-solid fa-dragon shrink-0 text-xs text-emerald-400" />

        <button
          type="button"
          onClick={() => setShowSelector(true)}
          title="Browse monsters"
          className="workspace-no-drag min-w-0 flex-1 truncate text-left text-xs font-semibold text-zinc-100 transition hover:text-white"
        >
          {displayedMonster.name}
        </button>

        <button
          type="button"
          onClick={() => setShowSelector(true)}
          title="Browse monsters"
          aria-label="Browse monsters"
          className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-list text-[10px]" />
        </button>

        {/* Pin / Follow */}

        <div className="workspace-no-drag flex shrink-0 rounded-md border border-white/10 bg-black/20 p-0.5">
          <button
            type="button"
            onClick={() => setMode("pinned")}
            title="Pin this monster"
            aria-label="Pin this monster"
            className={`flex h-6 w-6 items-center justify-center rounded text-[9px] transition ${
              mode === "pinned"
                ? "bg-amber-500/15 text-amber-300"
                : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            <i className="fa-solid fa-thumbtack" />
          </button>

          <button
            type="button"
            onClick={() => setMode("follow")}
            title="Follow monster selections and encounter turns"
            aria-label="Follow monster selections and encounter turns"
            className={`flex h-6 w-6 items-center justify-center rounded text-[9px] transition ${
              mode === "follow"
                ? "bg-sky-500/15 text-sky-300"
                : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            <i className="fa-solid fa-crosshairs" />
          </button>
        </div>

        {/* Full library */}

        <button
          type="button"
          onClick={() => navigate(`/campaigns/${campaignId}/monsters`)}
          title="Open monster library"
          aria-label="Open monster library"
          className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-up-right-from-square text-[10px]" />
        </button>

        {editing ? (
          <button
            type="button"
            onClick={() => removeModule(module.id)}
            title="Remove module"
            aria-label="Remove monster module"
            className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <i className="fa-solid fa-xmark text-[10px]" />
          </button>
        ) : null}
      </div>

      {/* Scrollable content */}

      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
        {/* Identity */}

        <section className="border-b border-white/10 p-3">
          <div className="flex items-start gap-3">
            <button
              type="button"
              disabled={!displayedMonster.img}
              onClick={() => setPortraitOpen(true)}
              className="shrink-0 disabled:cursor-default"
              aria-label={`Open image for ${displayedMonster.name}`}
            >
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/30">
                {displayedMonster.img ? (
                  <img
                    src={displayedMonster.img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <i className="fa-solid fa-dragon text-lg text-zinc-600" />
                )}
              </div>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="truncate text-base font-bold text-white">
                  {displayedMonster.name}
                </h2>

                <span
                  className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${statusBadge.className}`}
                >
                  {statusBadge.text}
                </span>
              </div>

              <div className="mt-0.5 text-[10px] italic leading-4 text-zinc-400">
                {displayedMonster.description}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="text-[9px] text-zinc-500">
                  CR {displayedMonster.challengeRating}
                </span>

                <span className="text-[9px] text-zinc-600">·</span>

                <span className="text-[9px] text-zinc-500">
                  {displayedMonster.xp.toLocaleString()} XP
                </span>

                {displayedMonster.source === "campaign" ? (
                  <>
                    <span className="text-[9px] text-zinc-600">·</span>

                    <span className="text-[9px] font-medium text-emerald-400">
                      Campaign
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* Core stats */}

        <section className="border-b border-white/10 p-3">
          <div className="grid grid-cols-3 gap-2">
            {/* AC */}

            <div className="rounded-lg border border-sky-500/10 bg-sky-500/[0.04] p-2">
              <div className="text-[9px] font-bold uppercase text-sky-300/70">
                AC
              </div>

              <div className="mt-0.5 text-sm font-bold text-white">
                {displayedMonster.armorClass}
              </div>

              {displayedMonster.armorClassNotes ? (
                <div className="mt-0.5 truncate text-[8px] text-zinc-500">
                  {displayedMonster.armorClassNotes}
                </div>
              ) : null}
            </div>

            {/* HP */}

            <div className="rounded-lg border border-rose-500/10 bg-rose-500/[0.04] p-2">
              <div className="text-[9px] font-bold uppercase text-rose-300/70">
                HP
              </div>

              <div className="mt-0.5 text-sm font-bold text-white">
                {displayedMonster.hp}
              </div>
            </div>

            {/* Speed */}

            <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.04] p-2">
              <div className="text-[9px] font-bold uppercase text-emerald-300/70">
                Speed
              </div>

              <div
                className="mt-0.5 truncate text-sm font-bold text-white"
                title={formatSpeed(displayedMonster.speed)}
              >
                {formatSpeed(displayedMonster.speed)}
              </div>
            </div>
          </div>
        </section>

        {/* Ability scores */}

        <section className="border-b border-white/10 p-3">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
            Ability Scores
          </div>

          <div className="grid grid-cols-6 gap-1">
            {ABILITIES.map(([label, key]) => {
              const score = displayedMonster.stats[key];

              const modifier = getAbilityModifier(score);

              return (
                <div
                  key={key}
                  title={`${label}: ${score} (${formatModifier(modifier)})`}
                  className="rounded-lg border border-white/5 bg-white/[0.025] px-1 py-2 text-center"
                >
                  <div className="text-[9px] font-bold uppercase text-zinc-500">
                    {label}
                  </div>

                  <div className="mt-0.5 text-base font-bold leading-none text-white">
                    {formatModifier(modifier)}
                  </div>

                  <div className="mt-1 text-[9px] font-medium leading-none text-zinc-500">
                    {score}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Details */}

        {displayedMonster.skills ||
        displayedMonster.senses ||
        displayedMonster.language ? (
          <section className="border-b border-white/10 px-3 py-3">
            <div className="space-y-1.5 text-xs leading-5 text-zinc-300">
              {displayedMonster.skills ? (
                <p>
                  <span className="font-semibold text-zinc-100">Skills</span>{" "}
                  {displayedMonster.skills}
                </p>
              ) : null}

              {displayedMonster.senses ? (
                <p>
                  <span className="font-semibold text-zinc-100">Senses</span>{" "}
                  {displayedMonster.senses}
                </p>
              ) : null}

              {displayedMonster.language ? (
                <p>
                  <span className="font-semibold text-zinc-100">Languages</span>{" "}
                  {displayedMonster.language}
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        <MonsterTextSection title="Traits" entries={displayedMonster.traits} />

        <MonsterTextSection
          title="Actions"
          entries={displayedMonster.actions}
        />

        <MonsterTextSection
          title="Bonus Actions"
          entries={displayedMonster.bonusActions}
        />

        <MonsterTextSection
          title="Reactions"
          entries={displayedMonster.reactions}
        />
      </div>

      {/* Image viewer */}

      {portraitOpen && displayedMonster.img ? (
        <div
          className="workspace-no-drag absolute inset-0 z-50 flex items-center justify-center bg-black/85 p-3"
          onMouseDown={() => setPortraitOpen(false)}
        >
          <button
            type="button"
            onClick={() => setPortraitOpen(false)}
            aria-label="Close monster image"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-zinc-300 hover:text-white"
          >
            <i className="fa-solid fa-xmark" />
          </button>

          <img
            src={displayedMonster.img}
            alt={displayedMonster.name}
            onMouseDown={(event) => event.stopPropagation()}
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </div>
  );
}
