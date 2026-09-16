import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Avatar from "../../../components/Avatar";
import { getXpProgressWithinLevel } from "../../../rulesets/dnd/dnd2024/xpProgression";

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

  return (
    <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="w-full">
          <div className="flex w-full justify-between">
            <h2 className="text-base font-semibold text-white">
              Party overview
            </h2>

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
            const hp = character.currentHp ?? 0;
            const maxHp = Math.max(1, character.maxHp ?? 1);
            const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
            const xpData = getXpProgressWithinLevel(character.xp ?? 0);
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

            const xpProgressLabel =
              xpData.nextLevelXp !== null
                ? `XP ${Math.max(
                    0,
                    (character.xp ?? 0) - xpData.currentLevelXp,
                  )}/${xpData.nextLevelXp - xpData.currentLevelXp}`
                : "XP Max level";

            return (
              <div
                key={character.id}
                className="rounded-lg border border-white/[0.08] bg-black/15 px-3 py-2 transition hover:border-white/15 hover:bg-white/[0.025]"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex items-center gap-3">
                    <Avatar
                      name={character.name}
                      src={character.imageUrl}
                      className="h-10 w-10 shrink-0 rounded-lg"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-xs font-semibold text-white">
                          {character.name}
                        </p>

                        {character.levelUpAvailable &&
                          currentUserId === character.ownerUid && (
                            <button
                              onClick={() => onOpenLevelUp(character)}
                              className="rounded-md border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-300 transition hover:bg-amber-400/15"
                            >
                              Level up
                            </button>
                          )}
                      </div>

                      <p className="mt-0.5 truncate text-[10px] text-zinc-500">
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

                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span
                        className={`rounded-full border px-2 py-0.5 ${
                          hpPercent <= 25
                            ? "border-red-500/20 bg-red-500/10 text-red-300"
                            : hpPercent <= 50
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                        }`}
                      >
                        <i className="fa-solid fa-heart"></i> {hp}/{maxHp}
                      </span>

                      <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-blue-300">
                        {xpProgressLabel}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {(character.conditions ?? []).length > 0 ? (
                        (character.conditions ?? []).map((condition) => (
                          <span
                            key={condition}
                            className="rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-300"
                          >
                            {condition}
                          </span>
                        ))
                      ) : (
                        <></>
                      )}

                      {isGm && (
                        <button
                          onClick={() =>
                            setExpandedCharacterId((prev) =>
                              prev === character.id ? null : character.id,
                            )
                          }
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
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
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
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
                          <button
                            onClick={() =>
                              setHpAdjustments((prev) => ({
                                ...prev,
                                [character.id]: (prev[character.id] ?? 0) - 1,
                              }))
                            }
                            className="h-8 w-8 rounded-md border border-white/[0.08] bg-black/20 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                          >
                            −
                          </button>

                          <input
                            type="number"
                            value={pendingHpDelta}
                            onChange={(e) =>
                              setHpAdjustments((prev) => ({
                                ...prev,
                                [character.id]: Number(e.target.value) || 0,
                              }))
                            }
                            className="h-8 w-16 rounded-md border border-white/[0.08] bg-black/25 px-2 text-xs font-semibold text-white outline-none focus:border-white/20"
                          />

                          <button
                            onClick={() =>
                              setHpAdjustments((prev) => ({
                                ...prev,
                                [character.id]: (prev[character.id] ?? 0) + 1,
                              }))
                            }
                            className="h-8 w-8 rounded-md border border-white/[0.08] bg-black/20 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                          >
                            +
                          </button>

                          <button
                            onClick={async () => {
                              const nextHp = Math.max(
                                0,
                                Math.min(maxHp, hp + pendingHpDelta),
                              );

                              await onUpdateCharacter(character.id, {
                                currentHp: nextHp,
                              });

                              setHpAdjustments((prev) => ({
                                ...prev,
                                [character.id]: 0,
                              }));
                            }}
                            className="ml-auto rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.1] hover:text-white"
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
                          <input
                            type="number"
                            value={pendingXpDelta}
                            onChange={(e) =>
                              setXpAdjustments((prev) => ({
                                ...prev,
                                [character.id]: Number(e.target.value) || 0,
                              }))
                            }
                            className="h-8 w-20 rounded-md border border-white/[0.08] bg-black/25 px-2 text-xs font-semibold text-white outline-none focus:border-white/20"
                            placeholder="0"
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
                            className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.1] hover:text-white"
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      <div className="relative rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                          Conditions
                        </p>

                        <button
                          onClick={() =>
                            setOpenConditionMenuId((prev) =>
                              prev === character.id ? null : character.id,
                            )
                          }
                          className="mt-2 inline-flex h-8 items-center rounded-md border border-white/[0.08] bg-black/25 px-2.5 text-[10px] font-semibold text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                        >
                          Edit conditions
                        </button>

                        {openConditionMenuId === character.id && (
                          <div className="absolute left-3 right-3 top-[76px] z-20 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-zinc-950 p-2 shadow-2xl">
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
    </section>
  );
};

export default PartyControlSection;
