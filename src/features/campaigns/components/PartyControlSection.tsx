import { useEffect, useRef, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import Avatar from "../../../components/Avatar";

import NumberStepper from "../../../components/NumberStepper";

import {
  ALL_CONDITIONS,
  type CampaignCharacter,
} from "../hooks/useCampaignPageData";

type PartyControlSectionProps = {
  characters: CampaignCharacter[];

  isGm: boolean;

  currentUserId?: string | null;

  onOpenLevelUp: (character: CampaignCharacter) => void;

  onOpenAwardXpModal: () => void;

  onUpdateCharacter: (
    id: string,

    updates: Record<string, unknown>,
  ) => Promise<void>;

  onUpdateCharacterXp: (
    character: CampaignCharacter,

    nextXp: number,
  ) => Promise<void>;

  onToggleCondition: (
    character: CampaignCharacter,

    condition: string,
  ) => Promise<void>;

  onClearConditions: (character: CampaignCharacter) => Promise<void>;
};

type PartyCharacter = CampaignCharacter & {
  buildMode?: string;

  customStats?: {
    currentHp?: number;

    maxHp?: number;
  };
};

const isCustomCharacter = (character: PartyCharacter) =>
  character.buildMode === "custom";

const getLiveHp = (character: PartyCharacter) => {
  if (isCustomCharacter(character)) {
    const maxHp = character.customStats?.maxHp ?? character.maxHp ?? 0;

    const currentHp =
      character.customStats?.currentHp ?? character.currentHp ?? maxHp;

    return {
      currentHp: Math.max(0, currentHp),

      maxHp: Math.max(1, maxHp),
    };
  }

  return {
    currentHp: character.currentHp ?? 0,

    maxHp: Math.max(1, character.maxHp ?? 1),
  };
};

const PartyControlSection = ({
  characters,

  isGm,

  currentUserId,

  onOpenLevelUp,

  onOpenAwardXpModal,

  onUpdateCharacter,

  onUpdateCharacterXp,

  onToggleCondition,

  onClearConditions,
}: PartyControlSectionProps) => {
  const location = useLocation();

  const [expandedCharacterId, setExpandedCharacterId] = useState<string | null>(
    null,
  );

  const [hpAdjustments, setHpAdjustments] = useState<Record<string, number>>(
    {},
  );

  const [xpAdjustments, setXpAdjustments] = useState<Record<string, number>>(
    {},
  );

  const [openConditionMenuId, setOpenConditionMenuId] = useState<string | null>(
    null,
  );

  const conditionMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openConditionMenuId) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        conditionMenuRef.current &&
        !conditionMenuRef.current.contains(target)
      ) {
        setOpenConditionMenuId(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openConditionMenuId]);

  const [portraitCharacter, setPortraitCharacter] =
    useState<CampaignCharacter | null>(null);

  return (
    <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="w-full">
          <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-xs text-zinc-500" />

              <h2 className="text-base font-semibold text-white">
                Party overview
              </h2>
            </div>

            {isGm && (
              <button
                onClick={onOpenAwardXpModal}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
              >
                Award XP
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        {characters.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
            <p className="text-sm text-zinc-300">
              No active characters in the party yet.
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Characters can exist in the campaign without being active.
            </p>
          </div>
        ) : (
          characters.map((character) => {
            const liveHp = getLiveHp(character);

            const hp = liveHp.currentHp;

            const maxHp = liveHp.maxHp;

            const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));

            const isExpanded = expandedCharacterId === character.id;

            const pendingHpDelta = hpAdjustments[character.id] ?? 0;

            const pendingXpDelta = xpAdjustments[character.id] ?? 0;

            const canOpenCharacter =
              isGm ||
              (character.ownerUid !== null &&
                currentUserId === character.ownerUid) ||
              (character.ownerUid === null &&
                character.claimMode === "assigned" &&
                currentUserId === character.claimableByUid);

            return (
              <div
                key={character.id}
                className="rounded-lg border border-white/[0.08] bg-black/15 px-3 py-2 transition hover:border-white/15 hover:bg-white/[0.025]"
              >
                <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex items-center gap-3">
                    {character.imageUrl ? (
                      <button
                        type="button"
                        onClick={() => setPortraitCharacter(character)}
                        aria-label={`Enlarge portrait for ${character.name}`}
                        title="Enlarge portrait"
                        className="group shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                      >
                        <Avatar
                          name={character.name}
                          src={character.imageUrl}
                          className="h-10 w-10 rounded-lg transition group-hover:brightness-110"
                        />
                      </button>
                    ) : (
                      <Avatar
                        name={character.name}
                        src={character.imageUrl}
                        className="h-10 w-10 shrink-0 rounded-lg"
                      />
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">
                          {character.name}
                        </p>

                        {character.ownerUid ? (
                          <span className="rounded-md border border-sky-500/20 bg-sky-500/[0.07] px-1.5 py-0.5 text-[10px] font-medium text-sky-300">
                            {character.ownerUid === currentUserId
                              ? "Yours"
                              : character.ownerName ||
                                character.ownerEmail ||
                                "Assigned player"}
                          </span>
                        ) : (
                          <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                            Unassigned
                          </span>
                        )}

                        {character.levelUpAvailable &&
                          currentUserId === character.ownerUid && (
                            <button
                              onClick={() => onOpenLevelUp(character)}
                              className="rounded-md border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 transition hover:bg-amber-400/15"
                            >
                              Level up
                            </button>
                          )}
                      </div>

                      <p className="mt-0.5 truncate text-xs text-zinc-400">
                        {[
                          character.level ? `Level ${character.level}` : null,

                          character.race,

                          character.className,
                        ]

                          .filter(Boolean)

                          .join(" ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center md:justify-end">
                    <div className="w-full min-w-0 md:w-[120px] md:shrink-0">
                      <div>
                        <div className="w-full min-w-0">
                          <div className="mb-1 flex items-center justify-between gap-2 text-[10px] leading-none">
                            <span
                              className={`font-semibold ${
                                hpPercent <= 25
                                  ? "text-red-300"
                                  : hpPercent <= 50
                                    ? "text-amber-300"
                                    : "text-emerald-300"
                              }`}
                            >
                              HP
                            </span>

                            <span className="tabular-nums text-zinc-400">
                              {hp}/{maxHp}
                            </span>
                          </div>

                          <div className="h-1 overflow-hidden rounded-full bg-white/[0.08]">
                            <div
                              className={`h-full rounded-full transition-[width] ${
                                hpPercent <= 25
                                  ? "bg-red-500"
                                  : hpPercent <= 50
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                              }`}
                              style={{ width: `${hpPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {(character.conditions ?? []).length > 0 ? (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {(character.conditions ?? []).map((condition) => (
                            <span
                              key={condition}
                              className="rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] leading-4 text-amber-300"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex w-full shrink-0 items-center justify-end gap-2 border-t border-white/[0.06] pt-2 md:w-auto md:border-t-0 md:pt-0">
                      {isGm && (
                        <button
                          onClick={() =>
                            setExpandedCharacterId((prev) =>
                              prev === character.id ? null : character.id,
                            )
                          }
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          {isExpanded ? "Close" : "Manage"}
                        </button>
                      )}

                      {canOpenCharacter && (
                        <Link
                          to={`/characters/${character.id}`}
                          state={{
                            from: `${location.pathname}${location.search}`,

                            label: "Back to campaign",
                          }}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          Open
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {isGm && isExpanded && (
                  <div className="mt-2 border-t border-white/[0.06] pt-2.5">
                    <div className="grid gap-2 md:grid-cols-3">
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                          Adjust HP
                        </p>

                        <div className="mt-2 flex items-center gap-1.5">
                          <NumberStepper
                            value={pendingHpDelta}
                            min={-maxHp}
                            max={maxHp}
                            onChange={(value) =>
                              setHpAdjustments((prev) => ({
                                ...prev,

                                [character.id]: value,
                              }))
                            }
                            ariaLabel={`${character.name} HP adjustment`}
                            size="compact"
                          />

                          <button
                            onClick={async () => {
                              const nextHp = Math.max(
                                0,

                                Math.min(maxHp, hp + pendingHpDelta),
                              );

                              if (isCustomCharacter(character)) {
                                await onUpdateCharacter(character.id, {
                                  customStats: {
                                    ...(character.customStats ?? {}),

                                    currentHp: nextHp,
                                  },
                                });
                              } else {
                                await onUpdateCharacter(character.id, {
                                  currentHp: nextHp,
                                });
                              }

                              setHpAdjustments((prev) => ({
                                ...prev,

                                [character.id]: 0,
                              }));
                            }}
                            className="ml-auto rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.1] hover:text-white"
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                          Award XP
                        </p>

                        <div className="mt-2 flex items-center gap-1.5">
                          <NumberStepper
                            value={pendingXpDelta}
                            min={-(character.xp ?? 0)}
                            onChange={(value) =>
                              setXpAdjustments((prev) => ({
                                ...prev,

                                [character.id]: value,
                              }))
                            }
                            ariaLabel={`${character.name} XP adjustment`}
                            size="compact"
                          />

                          <button
                            onClick={async () => {
                              await onUpdateCharacterXp(
                                character,

                                (character.xp ?? 0) + pendingXpDelta,
                              );

                              setXpAdjustments((prev) => ({
                                ...prev,

                                [character.id]: 0,
                              }));
                            }}
                            className="ml-auto rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.1] hover:text-white"
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      <div
                        ref={
                          openConditionMenuId === character.id
                            ? conditionMenuRef
                            : undefined
                        }
                        className="relative rounded-xl border border-white/10 bg-white/5 p-3"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                          Conditions
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() =>
                              setOpenConditionMenuId((prev) =>
                                prev === character.id ? null : character.id,
                              )
                            }
                            className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
                          >
                            Edit
                          </button>

                          {(character.conditions ?? []).length > 0 ? (
                            <button
                              type="button"
                              onClick={async () => {
                                setOpenConditionMenuId(null);

                                await onClearConditions(character);
                              }}
                              className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-zinc-400 transition hover:border-rose-400/20 hover:bg-rose-500/10 hover:text-rose-300"
                            >
                              Clear
                            </button>
                          ) : null}
                        </div>

                        {openConditionMenuId === character.id && (
                          <div className="workspace-scrollbar absolute left-3 right-3 top-[76px] z-20 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-zinc-950 p-2 shadow-2xl">
                            <div className="grid gap-1">
                              {ALL_CONDITIONS.map((condition) => {
                                const active = (
                                  character.conditions ?? []
                                ).includes(condition);

                                return (
                                  <button
                                    key={condition}
                                    onClick={() =>
                                      onToggleCondition(character, condition)
                                    }
                                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                                      active
                                        ? "bg-amber-500/10 text-amber-300"
                                        : "text-zinc-300 hover:bg-white/5"
                                    }`}
                                  >
                                    <span>{condition}</span>

                                    <span className="text-[10px]">
                                      {active ? "Selected" : ""}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {portraitCharacter?.imageUrl ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${portraitCharacter.name} portrait`}
          onMouseDown={() => setPortraitCharacter(null)}
        >
          <button
            type="button"
            onClick={() => setPortraitCharacter(null)}
            aria-label="Close portrait"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
          >
            <i className="fa-solid fa-xmark" />
          </button>

          <img
            src={portraitCharacter.imageUrl}
            alt={portraitCharacter.name}
            onMouseDown={(event) => event.stopPropagation()}
            className="max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] rounded-xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </section>
  );
};

export default PartyControlSection;
