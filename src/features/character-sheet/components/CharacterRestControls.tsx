import { useState } from "react";

import { createPortal } from "react-dom";

import type { ShortRestResult } from "../types";

type CharacterRestControlsProps = {
  currentHp: number;
  maxHp: number;

  hitDieSize?: number;
  hitDiceRemaining?: number;
  hitDiceMax?: number;

  constitutionModifier?: number;

  onShortRest: (hitDiceToSpend: number) => Promise<ShortRestResult>;

  onLongRest: () => Promise<void>;
};

const CharacterRestControls = ({
  currentHp,
  maxHp,

  hitDieSize,
  hitDiceRemaining = 0,
  hitDiceMax = 0,

  constitutionModifier = 0,

  onShortRest,
  onLongRest,
}: CharacterRestControlsProps) => {
  const [open, setOpen] = useState(false);

  const [diceToSpend, setDiceToSpend] = useState(hitDiceRemaining > 0 ? 1 : 0);

  const [busy, setBusy] = useState<"short" | "long" | null>(null);

  const [confirmLongRest, setConfirmLongRest] = useState(false);

  const [lastShortRest, setLastShortRest] = useState<ShortRestResult | null>(
    null,
  );

  const safeRemaining = Math.max(0, hitDiceRemaining);

  const safeMax = Math.max(0, hitDiceMax);

  const normalizedDiceToSpend = Math.max(
    0,
    Math.min(safeRemaining, diceToSpend),
  );

  const changeDiceToSpend = (delta: number) => {
    setDiceToSpend((current) =>
      Math.max(0, Math.min(safeRemaining, current + delta)),
    );
  };

  const handleShortRest = async () => {
    if (busy || normalizedDiceToSpend < 0) {
      return;
    }

    setBusy("short");

    try {
      const result = await onShortRest(normalizedDiceToSpend);

      setLastShortRest(result);

      setDiceToSpend(result.hitDiceRemaining > 0 ? 1 : 0);
    } finally {
      setBusy(null);
    }
  };

  const handleLongRest = async () => {
    if (busy) {
      return;
    }

    if (!confirmLongRest) {
      setConfirmLongRest(true);

      return;
    }

    setBusy("long");

    try {
      await onLongRest();

      setLastShortRest(null);

      setDiceToSpend(safeMax > 0 ? 1 : 0);

      setConfirmLongRest(false);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);

          setConfirmLongRest(false);
        }}
        className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.08em] text-zinc-500 transition hover:border-white/15 hover:bg-white/[0.07] hover:text-zinc-200"
      >
        Rest
      </button>

      {open
        ? createPortal(
            <div className="fixed bottom-4 right-4 z-[145] w-[340px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur">
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-3 py-2.5">
                <div>
                  <p className="text-[10px] font-semibold text-white">Rest</p>

                  <p className="mt-0.5 text-[8px] text-zinc-600">
                    Recover character resources
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);

                    setConfirmLongRest(false);
                  }}
                  aria-label="Close rest controls"
                  title="Close"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-sm text-zinc-500 transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="workspace-scrollbar max-h-[70vh] overflow-y-auto">
                {/* SHORT REST */}

                <section className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
                        Short Rest
                      </p>

                      <p className="mt-1 text-[8px] leading-4 text-zinc-600">
                        Spend Hit Dice to recover Hit Points.
                      </p>
                    </div>

                    <span className="shrink-0 text-[8px] font-semibold text-zinc-400">
                      HP {currentHp}/{maxHp}
                    </span>
                  </div>

                  {hitDieSize && safeMax > 0 ? (
                    <>
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-black/20 px-2.5 py-2">
                        <div>
                          <p className="text-[8px] font-semibold text-zinc-300">
                            Hit Dice
                          </p>

                          <p className="mt-0.5 text-[7px] text-zinc-600">
                            {safeRemaining}/{safeMax} d{hitDieSize}
                            {" · "}
                            CON {constitutionModifier >= 0 ? "+" : ""}
                            {constitutionModifier}
                            {" per die"}
                          </p>
                        </div>

                        <div className="flex h-7 items-center overflow-hidden rounded-md border border-white/[0.08] bg-black/25">
                          <button
                            type="button"
                            disabled={
                              busy !== null || normalizedDiceToSpend <= 0
                            }
                            onClick={() => changeDiceToSpend(-1)}
                            className="flex h-full w-7 items-center justify-center text-sm font-semibold text-zinc-500 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-default disabled:opacity-30"
                          >
                            −
                          </button>

                          <span className="min-w-[34px] border-x border-white/[0.06] px-2 text-center text-[9px] font-bold tabular-nums text-white">
                            {normalizedDiceToSpend}
                          </span>

                          <button
                            type="button"
                            disabled={
                              busy !== null ||
                              normalizedDiceToSpend >= safeRemaining
                            }
                            onClick={() => changeDiceToSpend(1)}
                            className="flex h-full w-7 items-center justify-center text-sm font-semibold text-zinc-500 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-default disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => void handleShortRest()}
                        disabled={busy !== null}
                        className="mt-2 w-full rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-2 text-[9px] font-semibold text-emerald-200 transition hover:bg-emerald-500/[0.13] disabled:cursor-wait disabled:opacity-50"
                      >
                        {busy === "short"
                          ? "Resting…"
                          : normalizedDiceToSpend > 0
                            ? `Take Short Rest · Spend ${normalizedDiceToSpend} Hit ${
                                normalizedDiceToSpend === 1 ? "Die" : "Dice"
                              }`
                            : "Take Short Rest"}
                      </button>
                    </>
                  ) : (
                    <div className="mt-3 rounded-lg border border-white/[0.06] bg-black/20 px-2.5 py-2 text-[8px] text-zinc-600">
                      No Hit Die information is configured for this character.
                    </div>
                  )}

                  {lastShortRest ? (
                    <div className="mt-2 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.05] p-2.5">
                      <p className="text-[8px] font-semibold text-emerald-300">
                        Short Rest complete
                      </p>

                      {lastShortRest.diceSpent > 0 ? (
                        <>
                          <p className="mt-1 text-[8px] leading-4 text-zinc-400">
                            Rolled {lastShortRest.rolls.join(" + ")}
                            {lastShortRest.constitutionModifier !== 0
                              ? ` ${
                                  lastShortRest.constitutionModifier > 0
                                    ? "+"
                                    : "−"
                                } ${Math.abs(
                                  lastShortRest.constitutionModifier,
                                )} CON per die`
                              : ""}
                            .
                          </p>

                          <p className="mt-1 text-[8px] font-medium text-zinc-300">
                            Recovered {lastShortRest.actualHealing} HP ·{" "}
                            {lastShortRest.hitDiceRemaining} Hit Dice remaining
                          </p>
                        </>
                      ) : (
                        <p className="mt-1 text-[8px] text-zinc-500">
                          No Hit Dice were spent.
                        </p>
                      )}
                    </div>
                  ) : null}
                </section>

                {/* LONG REST */}

                <section className="border-t border-white/[0.07] p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
                    Long Rest
                  </p>

                  <div className="mt-2 space-y-1 text-[8px] leading-4 text-zinc-500">
                    <RestEffect>Restore Hit Points to maximum</RestEffect>

                    <RestEffect>Restore all Hit Dice</RestEffect>

                    <RestEffect>Restore all spell slots</RestEffect>

                    <RestEffect>
                      Clear death save successes and failures
                    </RestEffect>
                  </div>

                  <p className="mt-2 text-[7px] leading-4 text-zinc-700">
                    Conditions and Heroic Inspiration are not changed
                    automatically.
                  </p>

                  {confirmLongRest ? (
                    <div className="mt-3 rounded-lg border border-amber-500/15 bg-amber-500/[0.05] p-2.5">
                      <p className="text-[8px] font-medium text-amber-200">
                        Complete a Long Rest?
                      </p>

                      <p className="mt-1 text-[7px] leading-4 text-zinc-600">
                        This immediately restores the resources listed above.
                      </p>

                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          disabled={busy !== null}
                          onClick={() => setConfirmLongRest(false)}
                          className="flex-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1.5 text-[8px] font-semibold text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          disabled={busy !== null}
                          onClick={() => void handleLongRest()}
                          className="flex-1 rounded-md border border-amber-500/20 bg-amber-500/[0.1] px-2 py-1.5 text-[8px] font-semibold text-amber-200 transition hover:bg-amber-500/[0.16] disabled:cursor-wait disabled:opacity-50"
                        >
                          {busy === "long" ? "Resting…" : "Confirm"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() => void handleLongRest()}
                      className="mt-3 w-full rounded-lg border border-amber-500/15 bg-amber-500/[0.06] px-3 py-2 text-[9px] font-semibold text-amber-200/90 transition hover:bg-amber-500/[0.11] disabled:cursor-wait disabled:opacity-50"
                    >
                      Take Long Rest
                    </button>
                  )}
                </section>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

const RestEffect = ({ children }: { children: string }) => (
  <div className="flex gap-2">
    <span className="text-emerald-500/60">✓</span>

    <span>{children}</span>
  </div>
);

export default CharacterRestControls;
