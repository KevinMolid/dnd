import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { ShortRestResult } from "../types";

export type CharacterRestConfig = {
  hitDieSize?: number;
  hitDiceRemaining?: number;
  hitDiceMax?: number;
  constitutionModifier?: number;
  onShortRest: (hitDiceToSpend: number) => Promise<ShortRestResult>;
  onLongRest: () => Promise<void>;
};

type CharacterRestButtonsProps = CharacterRestConfig & {
  currentHp: number;
  maxHp: number;
};

type OpenRest = "short" | "long" | null;

const CharacterRestButtons = ({
  currentHp,
  maxHp,
  hitDieSize,
  hitDiceRemaining = 0,
  hitDiceMax = 0,
  constitutionModifier = 0,
  onShortRest,
  onLongRest,
}: CharacterRestButtonsProps) => {
  const [openRest, setOpenRest] = useState<OpenRest>(null);
  const [diceToSpend, setDiceToSpend] = useState(hitDiceRemaining > 0 ? 1 : 0);
  const [busy, setBusy] = useState<OpenRest>(null);
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

  useEffect(() => {
    setDiceToSpend((current) => {
      if (safeRemaining <= 0) return 0;
      return Math.max(1, Math.min(safeRemaining, current || 1));
    });
  }, [safeRemaining]);

  const close = () => {
    if (busy) return;
    setOpenRest(null);
    setConfirmLongRest(false);
  };

  const changeDiceToSpend = (delta: number) => {
    setDiceToSpend((current) =>
      Math.max(0, Math.min(safeRemaining, current + delta)),
    );
  };

  const takeShortRest = async () => {
    if (busy) return;

    setBusy("short");

    try {
      const result = await onShortRest(normalizedDiceToSpend);

      setLastShortRest(result);
      setDiceToSpend(result.hitDiceRemaining > 0 ? 1 : 0);
    } finally {
      setBusy(null);
    }
  };

  const takeLongRest = async () => {
    if (busy) return;

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
      setOpenRest(null);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setOpenRest("short");
            setConfirmLongRest(false);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.09] px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-400/40 hover:bg-emerald-500/[0.15]"
        >
          <i className="fa-solid fa-mug-hot text-[11px]" />
          Short Rest
        </button>

        <button
          type="button"
          onClick={() => {
            setOpenRest("long");
            setConfirmLongRest(false);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-400/25 bg-indigo-400/[0.09] px-3 py-2 text-xs font-semibold text-indigo-200 transition hover:border-indigo-300/40 hover:bg-indigo-400/[0.15]"
        >
          <i className="fa-solid fa-moon text-[11px]" />
          Long Rest
        </button>
      </div>

      {openRest
        ? createPortal(
            <div
              className="fixed inset-0 z-[145] flex items-end justify-end bg-black/20 p-4"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  close();
                }
              }}
            >
              <div className="w-[360px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur">
                <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {openRest === "short" ? "Short Rest" : "Long Rest"}
                    </p>

                    <p className="mt-0.5 text-[11px] text-zinc-500">
                      {openRest === "short"
                        ? "Spend Hit Dice to recover Hit Points."
                        : "Recover character resources."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close rest controls"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-base text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    ×
                  </button>
                </div>

                {openRest === "short" ? (
                  <section className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-zinc-400">
                        HP
                      </span>

                      <span className="text-sm font-bold text-white">
                        {currentHp}/{maxHp}
                      </span>
                    </div>

                    {hitDieSize && safeMax > 0 ? (
                      <>
                        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-black/20 p-3">
                          <div>
                            <p className="text-xs font-semibold text-zinc-200">
                              Hit Dice
                            </p>

                            <p className="mt-1 text-[11px] text-zinc-500">
                              {safeRemaining}/{safeMax} d{hitDieSize} · CON{" "}
                              {constitutionModifier >= 0 ? "+" : ""}
                              {constitutionModifier} per die
                            </p>
                          </div>

                          <div className="flex h-9 items-center overflow-hidden rounded-md border border-white/[0.1] bg-black/30">
                            <button
                              type="button"
                              disabled={
                                Boolean(busy) || normalizedDiceToSpend <= 0
                              }
                              onClick={() => changeDiceToSpend(-1)}
                              className="flex h-full w-9 items-center justify-center text-base font-semibold text-zinc-400 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-30"
                            >
                              −
                            </button>

                            <span className="min-w-[42px] border-x border-white/[0.07] px-2 text-center text-sm font-bold tabular-nums text-white">
                              {normalizedDiceToSpend}
                            </span>

                            <button
                              type="button"
                              disabled={
                                Boolean(busy) ||
                                normalizedDiceToSpend >= safeRemaining
                              }
                              onClick={() => changeDiceToSpend(1)}
                              className="flex h-full w-9 items-center justify-center text-base font-semibold text-zinc-400 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-30"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={Boolean(busy)}
                          onClick={() => void takeShortRest()}
                          className="mt-3 w-full rounded-lg border border-emerald-500/25 bg-emerald-500/[0.1] px-3 py-2.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/[0.16] disabled:cursor-wait disabled:opacity-50"
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
                      <div className="mt-3 rounded-lg border border-white/[0.07] bg-black/20 p-3 text-xs text-zinc-500">
                        No Hit Die information is configured for this character.
                      </div>
                    )}

                    {lastShortRest ? (
                      <div className="mt-3 rounded-lg border border-emerald-500/15 bg-emerald-500/[0.05] p-3">
                        <p className="text-xs font-semibold text-emerald-300">
                          Short Rest complete
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-zinc-400">
                          Recovered {lastShortRest.actualHealing} HP ·{" "}
                          {lastShortRest.hitDiceRemaining} Hit Dice remaining
                        </p>
                      </div>
                    ) : null}
                  </section>
                ) : (
                  <section className="p-4">
                    <div className="space-y-2 text-xs leading-5 text-zinc-300">
                      <RestEffect>Restore Hit Points to maximum</RestEffect>
                      <RestEffect>Restore all Hit Dice</RestEffect>
                      <RestEffect>Restore all spell slots</RestEffect>
                      <RestEffect>
                        Clear death save successes and failures
                      </RestEffect>
                    </div>

                    <p className="mt-3 text-[11px] leading-5 text-zinc-500">
                      Conditions and Heroic Inspiration are not changed
                      automatically.
                    </p>

                    {confirmLongRest ? (
                      <div className="mt-4 rounded-lg border border-indigo-400/20 bg-indigo-400/[0.06] p-3">
                        <p className="text-xs font-semibold text-indigo-200">
                          Complete a Long Rest?
                        </p>

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            disabled={Boolean(busy)}
                            onClick={() => setConfirmLongRest(false)}
                            className="flex-1 rounded-md border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08]"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            disabled={Boolean(busy)}
                            onClick={() => void takeLongRest()}
                            className="flex-1 rounded-md border border-indigo-400/25 bg-indigo-400/[0.12] px-3 py-2 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-400/[0.18] disabled:cursor-wait disabled:opacity-50"
                          >
                            {busy === "long" ? "Resting…" : "Confirm"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={Boolean(busy)}
                        onClick={() => void takeLongRest()}
                        className="mt-4 w-full rounded-lg border border-indigo-400/25 bg-indigo-400/[0.1] px-3 py-2.5 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-400/[0.16]"
                      >
                        Take Long Rest
                      </button>
                    )}
                  </section>
                )}
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
    <span className="text-emerald-400">✓</span>
    <span>{children}</span>
  </div>
);

export default CharacterRestButtons;
