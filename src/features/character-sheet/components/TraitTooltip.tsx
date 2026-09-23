import { type ReactNode, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import type { Trait } from "../../../rulesets/dnd/dnd2024/types";

import { formatLabel } from "../utils/characterSheetHelpers";

import { formatUsage, getEffectLabel } from "../utils/traitHelpers";

type TraitTooltipProps = {
  trait: Trait;
  children: ReactNode;
};

const HIDE_DELAY_MS = 140;
const DESKTOP_MEDIA_QUERY = "(min-width: 640px)";

const TraitTooltip = ({ trait, children }: TraitTooltipProps) => {
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
    if (!isDesktop) return;

    clearHideTimer();
    setOpen(true);
  };

  const scheduleHide = () => {
    if (!isDesktop) return;

    clearHideTimer();

    if (pinned) return;

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

    if (!isDesktop) {
      setPinned(true);
      setOpen(true);
      return;
    }

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

  useEffect(() => {
    if (!open || isDesktop) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, isDesktop]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!open || !isDesktop) return;

      const target = event.target as Node | null;
      if (!target) return;

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

  const usageLabel = formatUsage(trait.usage);

  const tooltip = open
    ? createPortal(
        <div
          ref={tooltipRef}
          className="
            workspace-scrollbar
            fixed inset-0 z-[120]
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
          aria-label={!isDesktop ? `${trait.name} details` : undefined}
          onMouseEnter={isDesktop ? showTooltip : undefined}
          onMouseLeave={isDesktop ? scheduleHide : undefined}
        >
          <div className="mx-auto min-h-full w-full max-w-2xl p-4 sm:min-h-0 sm:max-w-none sm:p-3.5">
            <div className="space-y-4 sm:space-y-3">
              <div className="border-b border-white/10 pb-4 sm:pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white sm:text-base">
                      {trait.name}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                      {typeof trait.level === "number" ? (
                        <span>Level {trait.level}</span>
                      ) : null}

                      {typeof trait.minLevel === "number" &&
                      typeof trait.level !== "number" ? (
                        <span>Minimum level {trait.minLevel}</span>
                      ) : null}

                      {trait.activation ? (
                        <span>• {formatLabel(trait.activation)}</span>
                      ) : null}

                      {usageLabel ? (
                        <span className="font-medium text-emerald-400/80">
                          • {usageLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {(!isDesktop || pinned) && (
                    <button
                      type="button"
                      title="Close"
                      aria-label={`Close ${trait.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        closeTooltip();
                      }}
                      className="
                        flex h-9 w-9 shrink-0 items-center justify-center
                        rounded-lg border border-white/10 bg-white/[0.05]
                        text-sm text-zinc-300 transition
                        hover:border-white/20 hover:bg-white/10 hover:text-white
                        sm:h-7 sm:w-7 sm:rounded-md sm:text-xs
                      "
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  )}
                </div>
              </div>

              {trait.description ? (
                <TooltipSection title="Description">
                  <p className="whitespace-pre-wrap text-xs leading-5 text-slate-200">
                    {trait.description}
                  </p>
                </TooltipSection>
              ) : null}

              {trait.effects && trait.effects.length > 0 ? (
                <TooltipSection title="Effects">
                  <div className="space-y-2">
                    {trait.effects.map((effect, index) => (
                      <div
                        key={`${trait.id}-effect-${index}`}
                        className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs leading-5 text-slate-300"
                      >
                        {getEffectLabel(effect)}
                      </div>
                    ))}
                  </div>
                </TooltipSection>
              ) : null}

              {trait.choices && trait.choices.length > 0 ? (
                <TooltipSection title="Choice">
                  <p className="text-xs leading-5 text-slate-400">
                    This feature includes a character-build choice. The finished
                    character sheet does not display all available options here.
                  </p>
                </TooltipSection>
              ) : null}

              {trait.notes && trait.notes.length > 0 ? (
                <TooltipSection title="Notes">
                  <ul className="space-y-2 text-xs leading-5 text-slate-400">
                    {trait.notes.map((note, index) => (
                      <li
                        key={`${trait.id}-note-${index}`}
                        className="flex items-start gap-2"
                      >
                        <span className="shrink-0 text-zinc-600">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </TooltipSection>
              ) : null}

              {!trait.description &&
              (!trait.effects || trait.effects.length === 0) &&
              (!trait.notes || trait.notes.length === 0) ? (
                <p className="text-xs text-zinc-500">
                  No additional rules text is available.
                </p>
              ) : null}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div
      ref={wrapperRef}
      className="block"
      onMouseEnter={isDesktop ? showTooltip : undefined}
      onMouseLeave={isDesktop ? scheduleHide : undefined}
      onFocus={isDesktop ? showTooltip : undefined}
      onBlur={isDesktop ? scheduleHide : undefined}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={handleTriggerClick}
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

      {tooltip}
    </div>
  );
};

const TooltipSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="space-y-1">
    <h4 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
      {title}
    </h4>

    {children}
  </section>
);

export default TraitTooltip;
