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
const DESKTOP_MEDIA_QUERY = "(min-width: 640px)";

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
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(DESKTOP_MEDIA_QUERY).matches
      : true,
  );

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
    if (!isDesktop) {
      return;
    }

    clearHideTimer();
    setOpen(true);
  };

  const scheduleHide = () => {
    if (!isDesktop) {
      return;
    }

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

  const handleTriggerClick = () => {
    clearHideTimer();

    /*
     * Mobile:
     * A tap immediately opens the full-screen spell view.
     * There is no separate hover/preview state.
     */
    if (!isDesktop) {
      setPinned(true);
      setOpen(true);
      return;
    }

    /*
     * Desktop:
     * Keep the existing hover-preview / click-to-pin behaviour.
     */
    setPinned((current) => {
      const next = !current;
      setOpen(next);
      return next;
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);

      /*
       * Close an existing tooltip when crossing between
       * the mobile and desktop layouts.
       */
      clearHideTimer();
      setPinned(false);
      setOpen(false);
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      clearHideTimer();
    };
  }, []);

  /*
   * The mobile spell view is effectively a modal.
   * Prevent the character sheet behind it from scrolling.
   */
  useEffect(() => {
    if (!open || isDesktop) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, isDesktop]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!open || !isDesktop) {
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
  }, [open, isDesktop]);

  const tooltipContent = open
    ? createPortal(
        <div
          ref={tooltipRef}
          className="
            workspace-scrollbar
            fixed inset-0 z-[100]
            overflow-y-auto
            bg-zinc-950
            text-left

            sm:inset-auto
            sm:bottom-4
            sm:right-4
            sm:max-h-[55vh]
            sm:w-[330px]
            sm:rounded-2xl
            sm:border
            sm:border-white/10
            sm:bg-zinc-900/95
            sm:shadow-2xl
            sm:backdrop-blur
          "
          role={isDesktop ? "tooltip" : "dialog"}
          aria-modal={!isDesktop ? true : undefined}
          aria-label={!isDesktop ? `${spell.name} spell details` : undefined}
          onMouseEnter={isDesktop ? showTooltip : undefined}
          onMouseLeave={isDesktop ? scheduleHide : undefined}
        >
          <div className="mx-auto min-h-full w-full max-w-2xl p-4 sm:min-h-0 sm:max-w-none sm:p-3.5">
            <div className="space-y-4 sm:space-y-3">
              <div className="border-b border-white/10 pb-4 sm:pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-lg font-bold text-white sm:text-base">
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

                  {(!isDesktop || pinned) && (
                    <button
                      type="button"
                      title="Close spell"
                      aria-label={`Close ${spell.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        closeTooltip();
                      }}
                      className="
      flex h-9 w-9 shrink-0 items-center justify-center
      rounded-lg border border-white/10 bg-white/[0.05]
      text-sm text-zinc-300 transition
      hover:border-white/20 hover:bg-white/10 hover:text-white

      sm:h-7 sm:w-7
      sm:rounded-md
      sm:text-xs
    "
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 sm:space-y-1.5">
                <InfoRow label="Casting Time" value={spell.castingTime} />

                <InfoRow label="Range" value={spell.range} />

                <InfoRow label="Components" value={spell.components} />

                <InfoRow label="Duration" value={spell.duration} />
              </div>

              <div className="space-y-4 sm:space-y-3">
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

                <TextSection
                  label="End Conditions"
                  value={spell.endConditions}
                />

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
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div
      ref={wrapperRef}
      className={`inline-flex ${className}`}
      onMouseEnter={isDesktop ? showTooltip : undefined}
      onMouseLeave={isDesktop ? scheduleHide : undefined}
      onFocus={isDesktop ? showTooltip : undefined}
      onBlur={isDesktop ? scheduleHide : undefined}
    >
      <div
        onClick={handleTriggerClick}
        className="inline-flex items-center text-left"
        aria-expanded={open}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleTriggerClick();
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
