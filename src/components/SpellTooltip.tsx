import { type ReactNode, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import type { Spell } from "../rulesets/dnd/dnd2024/types";

type SpellTooltipData = Partial<Spell> & {
  name: string;
  level?: number;
  school?: string;
  spellId?: string;
  id?: string;
};

type SpellTooltipProps = {
  spell: SpellTooltipData;
  children: ReactNode;
  className?: string;
};

type SectionProps = {
  label: string;
  value?: string;
};

const HIDE_DELAY_MS = 140;

const InfoRow = ({ label, value }: SectionProps) => {
  if (!value) {
    return null;
  }

  return (
    <div className="grid grid-cols-[88px_1fr] gap-2 text-xs leading-5">
      <span className="font-semibold text-slate-200">{label}</span>

      <span className="min-w-0 text-slate-300">{value}</span>
    </div>
  );
};

const TextSection = ({ label, value }: SectionProps) => {
  if (!value) {
    return null;
  }

  return (
    <div className="space-y-1">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </div>

      <p className="whitespace-pre-wrap text-xs leading-5 text-slate-200">
        {value}
      </p>
    </div>
  );
};

const formatSpellLevel = (level?: number) => {
  if (level === 0) {
    return "Cantrip";
  }

  if (typeof level !== "number") {
    return "Spell";
  }

  return `Level ${level}`;
};

export default function SpellTooltip({
  spell,
  children,
  className = "",
}: SpellTooltipProps) {
  const [open, setOpen] = useState(false);

  const [pinned, setPinned] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);

      hideTimerRef.current = undefined;
    }
  };

  const showTooltip = () => {
    clearHideTimer();

    setOpen(true);
  };

  const scheduleHide = () => {
    clearHideTimer();

    if (pinned) {
      return;
    }

    hideTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, HIDE_DELAY_MS);
  };

  const closeTooltip = () => {
    clearHideTimer();

    setPinned(false);

    setOpen(false);
  };

  const togglePinned = () => {
    clearHideTimer();

    setPinned((current) => {
      const next = !current;

      setOpen(next);

      return next;
    });
  };

  useEffect(() => {
    return () => {
      clearHideTimer();
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!open) {
        return;
      }

      const target = event.target as Node | null;

      if (!target) {
        return;
      }

      const insideTrigger = wrapperRef.current?.contains(target);

      const insideTooltip = tooltipRef.current?.contains(target);

      if (!insideTrigger && !insideTooltip) {
        closeTooltip();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeTooltip();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    document.addEventListener("touchstart", handlePointerDown);

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);

      document.removeEventListener("touchstart", handlePointerDown);

      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const tooltipContent = open
    ? createPortal(
        <div
          ref={tooltipRef}
          className="
              workspace-scrollbar
              fixed bottom-3 left-3 right-3 z-[100]
              max-h-[55vh]
              overflow-y-auto
              rounded-2xl
              border border-white/10
              bg-zinc-900/95
              p-3.5
              text-left
              shadow-2xl
              backdrop-blur
              sm:bottom-4
              sm:left-auto
              sm:right-4
              sm:w-[330px]
            "
          role="tooltip"
          onMouseEnter={showTooltip}
          onMouseLeave={scheduleHide}
        >
          <div className="space-y-3">
            <div className="border-b border-white/10 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-base font-bold text-white">
                      {spell.name}
                    </h3>

                    {spell.ritual && (
                      <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-[10px] font-medium text-sky-300">
                        Ritual
                      </span>
                    )}

                    {spell.concentration && (
                      <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-2 py-0.5 text-[10px] font-medium text-fuchsia-300">
                        Concentration
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    {formatSpellLevel(spell.level)}

                    {spell.school ? ` • ${spell.school}` : ""}
                  </div>
                </div>

                {pinned && (
                  <button
                    type="button"
                    title="Unpin spell"
                    aria-label={`Unpin ${spell.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      closeTooltip();
                    }}
                    className="shrink-0 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1.5 text-[10px] text-amber-300 transition hover:border-amber-400/35 hover:bg-amber-500/15 hover:text-amber-200"
                  >
                    <i className="fa-solid fa-thumbtack" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <InfoRow label="Casting Time" value={spell.castingTime} />

              <InfoRow label="Range" value={spell.range} />

              <InfoRow label="Components" value={spell.components} />

              <InfoRow label="Duration" value={spell.duration} />
            </div>

            <div className="space-y-3">
              <TextSection label="Description" value={spell.description} />

              <TextSection label="Effects" value={spell.effects} />

              <TextSection label="Details" value={spell.details} />

              <TextSection label="Control" value={spell.control} />

              <TextSection label="Interaction" value={spell.interaction} />

              <TextSection label="Penalties" value={spell.penalties} />

              <TextSection label="Benefits" value={spell.benefits} />

              <TextSection label="Conditions" value={spell.conditions} />

              <TextSection label="Behavior" value={spell.behavior} />

              <TextSection label="Duration Rule" value={spell.durationRule} />

              <TextSection label="Saving Throws" value={spell.savingThrows} />

              <TextSection label="Special" value={spell.special} />

              <TextSection label="Triggers" value={spell.triggers} />

              <TextSection label="Detection" value={spell.detection} />

              <TextSection label="Limitations" value={spell.limitations} />

              <TextSection label="End Conditions" value={spell.endConditions} />

              <TextSection label="Higher Level" value={spell.higherLevel} />
            </div>

            {spell.options && spell.options.length > 0 && (
              <div className="space-y-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Options
                </div>

                <div className="space-y-2">
                  {spell.options.map((option) => (
                    <div
                      key={option.name}
                      className="rounded-xl border border-white/10 bg-white/5 p-2.5"
                    >
                      <div className="text-xs font-semibold text-white">
                        {option.name}
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        {option.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div
      ref={wrapperRef}
      className={`inline-flex ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={scheduleHide}
      onFocus={showTooltip}
      onBlur={scheduleHide}
    >
      <div
        onClick={togglePinned}
        className="inline-flex items-center text-left"
        aria-expanded={open}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            togglePinned();
          }

          if (event.key === "Escape") {
            closeTooltip();
          }
        }}
      >
        {children}
      </div>

      {tooltipContent}
    </div>
  );
}
