import { type ReactNode, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import type { ConditionDefinition } from "../../../rulesets/dnd/dnd2024/data/conditions";

type ConditionTooltipProps = {
  condition: ConditionDefinition;
  children: ReactNode;
};

const HIDE_DELAY_MS = 140;
const DESKTOP_MEDIA_QUERY = "(min-width: 640px)";

const ConditionTooltip = ({ condition, children }: ConditionTooltipProps) => {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(DESKTOP_MEDIA_QUERY).matches
      : true,
  );

  const wrapperRef = useRef<HTMLSpanElement | null>(null);
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

  const tooltip = open
    ? createPortal(
        <div
          ref={tooltipRef}
          className="
            workspace-scrollbar
            fixed inset-0 z-[160]
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
          aria-label={
            !isDesktop ? `${condition.name} condition details` : undefined
          }
          onMouseEnter={isDesktop ? showTooltip : undefined}
          onMouseLeave={isDesktop ? scheduleHide : undefined}
        >
          <div className="mx-auto min-h-full w-full max-w-2xl p-4 sm:min-h-0 sm:max-w-none sm:p-3.5">
            <div className="space-y-4 sm:space-y-3">
              <div className="border-b border-white/10 pb-4 sm:pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white sm:text-base">
                      {condition.name}
                    </h3>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-rose-300/70">
                      Condition
                    </p>
                  </div>

                  {(!isDesktop || pinned) && (
                    <button
                      type="button"
                      title="Close"
                      aria-label={`Close ${condition.name}`}
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

              <div className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Description
                </div>

                <p className="whitespace-pre-wrap text-xs leading-5 text-slate-200">
                  {condition.description}
                </p>
              </div>

              {condition.notes?.length ? (
                <div className="space-y-2">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Notes
                  </div>

                  <ul className="space-y-2">
                    {condition.notes.map((note, index) => (
                      <li
                        key={`${condition.id}-note-${index}`}
                        className="flex items-start gap-2 text-xs leading-5 text-slate-400"
                      >
                        <span className="shrink-0 text-zinc-600">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <span
        ref={wrapperRef}
        className="inline-flex"
        onMouseEnter={isDesktop ? showTooltip : undefined}
        onMouseLeave={isDesktop ? scheduleHide : undefined}
        onFocus={isDesktop ? showTooltip : undefined}
        onBlur={isDesktop ? scheduleHide : undefined}
      >
        <span
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onClick={(event) => {
            event.stopPropagation();
            handleTriggerClick();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              handleTriggerClick();
            }

            if (event.key === "Escape") {
              closeTooltip();
            }
          }}
        >
          {children}
        </span>
      </span>

      {tooltip}
    </>
  );
};

export default ConditionTooltip;
