import { type ReactNode, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import type { Trait } from "../../../rulesets/dnd/dnd2024/types";

import { formatLabel } from "../utils/characterSheetHelpers";

import { formatUsage, getEffectLabel } from "../utils/traitHelpers";

type TraitTooltipProps = {
  trait: Trait;

  children: ReactNode;
};

const TraitTooltip = ({
  trait,

  children,
}: TraitTooltipProps) => {
  const [open, setOpen] = useState(false);

  const [pinned, setPinned] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!pinned) {
        return;
      }

      if (wrapperRef.current?.contains(event.target as Node)) {
        return;
      }

      setPinned(false);

      setOpen(false);
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [pinned]);

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (!pinned) {
      setOpen(false);
    }
  };

  const handleClick = () => {
    setPinned((current) => {
      const next = !current;

      setOpen(next);

      return next;
    });
  };

  const usageLabel = formatUsage(trait.usage);

  const tooltip = open
    ? createPortal(
        <div
          role="tooltip"
          className="fixed bottom-4 right-4 z-[120] w-[330px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur"
        >
          <div className="border-b border-white/[0.07] px-3 py-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[12px] font-bold text-white">
                  {trait.name}
                </h3>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] text-zinc-500">
                  {typeof trait.level === "number" ? (
                    <span>Level {trait.level}</span>
                  ) : null}

                  {typeof trait.minLevel === "number" &&
                  typeof trait.level !== "number" ? (
                    <span>Minimum level {trait.minLevel}</span>
                  ) : null}

                  {trait.activation ? (
                    <span>{formatLabel(trait.activation)}</span>
                  ) : null}

                  {usageLabel ? (
                    <span className="font-medium text-emerald-400/80">
                      {usageLabel}
                    </span>
                  ) : null}
                </div>
              </div>

              {pinned ? (
                <span className="shrink-0 text-[7px] font-semibold uppercase tracking-[0.08em] text-zinc-600">
                  Pinned
                </span>
              ) : null}
            </div>
          </div>

          <div className="workspace-scrollbar max-h-[360px] overflow-y-auto p-3">
            <div className="space-y-3">
              {trait.description ? (
                <TooltipSection title="Description">
                  <p className="text-[10px] leading-5 text-zinc-300">
                    {trait.description}
                  </p>
                </TooltipSection>
              ) : null}

              {trait.effects && trait.effects.length > 0 ? (
                <TooltipSection title="Effects">
                  <div className="space-y-1">
                    {trait.effects.map((effect, index) => (
                      <div
                        key={`${trait.id}-effect-${index}`}
                        className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1.5 text-[9px] text-zinc-300"
                      >
                        {getEffectLabel(effect)}
                      </div>
                    ))}
                  </div>
                </TooltipSection>
              ) : null}

              {trait.choices && trait.choices.length > 0 ? (
                <TooltipSection title="Choice">
                  <p className="text-[9px] leading-4 text-zinc-500">
                    This feature includes a character-build choice. The finished
                    character sheet does not display all available options here.
                  </p>
                </TooltipSection>
              ) : null}

              {trait.notes && trait.notes.length > 0 ? (
                <TooltipSection title="Notes">
                  <ul className="space-y-1 text-[9px] leading-4 text-zinc-400">
                    {trait.notes.map((note, index) => (
                      <li key={`${trait.id}-note-${index}`}>• {note}</li>
                    ))}
                  </ul>
                </TooltipSection>
              ) : null}

              {!trait.description &&
              (!trait.effects || trait.effects.length === 0) &&
              (!trait.notes || trait.notes.length === 0) ? (
                <p className="text-[9px] text-zinc-600">
                  No additional rules text is available.
                </p>
              ) : null}
            </div>
          </div>

          <div className="border-t border-white/[0.06] px-3 py-1.5">
            <p className="text-[7px] text-zinc-700">
              {pinned
                ? "Click the feature again or click elsewhere to close."
                : "Click the feature to keep this open."}
            </p>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div
      ref={wrapperRef}
      className="block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={() => {
        if (!pinned) {
          setOpen(false);
        }
      }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={handleClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            handleClick();
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
  <section>
    <h4 className="mb-1.5 text-[7px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
      {title}
    </h4>

    {children}
  </section>
);

export default TraitTooltip;
