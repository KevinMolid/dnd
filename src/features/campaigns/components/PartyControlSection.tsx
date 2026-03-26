import { useState } from "react";
import { Link } from "react-router-dom";

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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="w-full">
          <div className="flex w-full justify-between">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Active party
            </h2>

            {isGm && (
              <button
                onClick={onOpenAwardXpModal}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
              >
                Award XP
              </button>
            )}
          </div>

          <p className="mt-1 text-sm text-zinc-400">
            Live overview and quick controls for active characters only.
          </p>
        </div>
      </div>

      <div className="space-y-3">
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
                currentUserId === character.ownerUid);

            return (
              <div
                key={character.id}
                className="rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-4 transition hover:border-white/15"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex items-center gap-3">
                    <Avatar
                      name={character.name}
                      src={character.imageUrl}
                      size="lg"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white sm:text-base">
                          {character.name}
                        </p>

                        {character.levelUpAvailable &&
                          currentUserId === character.ownerUid && (
                            <button
                              onClick={() => onOpenLevelUp(character)}
                              className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-300 transition hover:bg-amber-400/15"
                            >
                              Level up
                            </button>
                          )}
                      </div>

                      <p className="mt-1 truncate text-xs text-zinc-500">
                        {character.ownerUid
                          ? `Played by ${
                              character.ownerName ||
                              character.ownerEmail ||
                              "Unknown player"
                            }`
                          : "Unassigned character"}
                      </p>

                      <p className="mt-1 truncate text-xs text-zinc-400">
                        {[character.race, character.className]
                          .filter(Boolean)
                          .join(" • ")}
                        {character.level ? ` • Lv ${character.level}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:items-end">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`rounded-full border px-2.5 py-1 ${
                          hpPercent <= 25
                            ? "border-red-500/20 bg-red-500/10 text-red-300"
                            : hpPercent <= 50
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                        }`}
                      >
                        HP {hp}/{maxHp}
                      </span>

                      <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-blue-300">
                        XP {character.xp ?? 0}
                      </span>

                      {xpData.nextLevelXp !== null ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-zinc-400">
                          {xpData.neededXp} to next
                        </span>
                      ) : (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-zinc-400">
                          Max level
                        </span>
                      )}
                    </div>

                    <div className="h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${
                          hpPercent <= 25
                            ? "bg-red-400"
                            : hpPercent <= 50
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                        }`}
                        style={{ width: `${hpPercent}%` }}
                      />
                    </div>

                    {xpData.nextLevelXp !== null && (
                      <div className="h-0.5 w-full max-w-[220px] overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-blue-400 transition-all"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, xpData.progressPercent ?? 0),
                            )}%`,
                          }}
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {(character.conditions ?? []).length > 0 ? (
                        (character.conditions ?? []).map((condition) => (
                          <span
                            key={condition}
                            className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-300"
                          >
                            {condition}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-500">
                          No conditions
                        </span>
                      )}

                      {isGm && (
                        <button
                          onClick={() =>
                            setExpandedCharacterId((prev) =>
                              prev === character.id ? null : character.id,
                            )
                          }
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                        >
                          {isExpanded ? "Close" : "Manage"}
                        </button>
                      )}

                      {canOpenCharacter && (
                        <Link
                          to={`/characters/${character.id}`}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                        >
                          Open
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {isGm && isExpanded && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="grid gap-3 lg:grid-cols-3">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs font-medium text-zinc-400">
                          Adjust HP
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() =>
                              setHpAdjustments((prev) => ({
                                ...prev,
                                [character.id]: (prev[character.id] ?? 0) - 1,
                              }))
                            }
                            className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-sm text-white transition hover:bg-white/10"
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
                            className="h-9 w-20 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none"
                          />

                          <button
                            onClick={() =>
                              setHpAdjustments((prev) => ({
                                ...prev,
                                [character.id]: (prev[character.id] ?? 0) + 1,
                              }))
                            }
                            className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-sm text-white transition hover:bg-white/10"
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
                            className="ml-auto rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs font-medium text-zinc-400">
                          Award XP
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <input
                            type="number"
                            value={pendingXpDelta}
                            onChange={(e) =>
                              setXpAdjustments((prev) => ({
                                ...prev,
                                [character.id]: Number(e.target.value) || 0,
                              }))
                            }
                            className="h-9 w-24 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none"
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
                            className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      <div className="relative rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-xs font-medium text-zinc-400">
                          Conditions
                        </p>

                        <button
                          onClick={() =>
                            setOpenConditionMenuId((prev) =>
                              prev === character.id ? null : character.id,
                            )
                          }
                          className="mt-3 inline-flex h-9 items-center rounded-lg border border-white/10 bg-zinc-950 px-3 text-xs text-white transition hover:bg-white/10"
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
