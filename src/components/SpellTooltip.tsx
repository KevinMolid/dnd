import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
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

type TooltipPosition = {
  top: number;
  left: number;
  placement: "top" | "bottom";
  ready: boolean;
};

const VIEWPORT_PADDING = 12;
const GAP = 10;

const InfoRow = ({ label, value }: SectionProps) => {
  if (!value) return null;

  return (
    <div className="flex gap-2 text-sm leading-5">
      <span className="min-w-[96px] font-semibold text-slate-200">{label}</span>
      <span className="text-slate-300">{value}</span>
    </div>
  );
};

const TextSection = ({ label, value }: SectionProps) => {
  if (!value) return null;

  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <p className="text-sm leading-5 text-slate-200">{value}</p>
    </div>
  );
};

const formatSpellLevel = (level?: number) => {
  if (level === 0) return "Cantrip";
  if (typeof level !== "number") return "Spell";
  return `Level ${level}`;
};

export default function SpellTooltip({
  spell,
  children,
  className = "",
}: SpellTooltipProps) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    placement: "bottom",
    ready: false,
  });

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setPinned(false);
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updatePosition = () => {
    const trigger = wrapperRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceBelow =
      viewportHeight - triggerRect.bottom - GAP - VIEWPORT_PADDING;
    const spaceAbove = triggerRect.top - GAP - VIEWPORT_PADDING;

    const shouldPlaceAbove =
      spaceBelow < tooltipRect.height && spaceAbove > spaceBelow;

    let top = shouldPlaceAbove
      ? triggerRect.top - tooltipRect.height - GAP
      : triggerRect.bottom + GAP;

    top = Math.max(
      VIEWPORT_PADDING,
      Math.min(top, viewportHeight - tooltipRect.height - VIEWPORT_PADDING),
    );

    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    let left = triggerCenter - tooltipRect.width / 2;

    left = Math.max(
      VIEWPORT_PADDING,
      Math.min(left, viewportWidth - tooltipRect.width - VIEWPORT_PADDING),
    );

    setPosition({
      top,
      left,
      placement: shouldPlaceAbove ? "top" : "bottom",
      ready: true,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;

    updatePosition();

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  const showTooltip = () => setOpen(true);
  const hideTooltip = () => {
    if (!pinned) {
      setOpen(false);
      setPosition((prev) => ({ ...prev, ready: false }));
    }
  };

  const togglePinned = () => {
    setPinned((prev) => {
      const next = !prev;
      setOpen(next);
      if (!next) {
        setPosition((old) => ({ ...old, ready: false }));
      }
      return next;
    });
  };

  const tooltipContent = open
    ? createPortal(
        <div
          ref={tooltipRef}
          className={`fixed z-[100] w-[360px] max-w-[calc(100vw-24px)] rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl backdrop-blur transition-opacity ${
            position.ready ? "opacity-100" : "opacity-0"
          }`}
          style={{
            top: position.top,
            left: position.left,
            maxHeight: "min(80vh, 700px)",
            overflowY: "auto",
          }}
          role="tooltip"
        >
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-white">{spell.name}</h3>

                {spell.ritual && (
                  <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-xs font-medium text-sky-300">
                    Ritual
                  </span>
                )}

                {spell.concentration && (
                  <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-2 py-0.5 text-xs font-medium text-fuchsia-300">
                    Concentration
                  </span>
                )}
              </div>

              <div className="mt-1 text-sm text-slate-400">
                {formatSpellLevel(spell.level)}
                {spell.school ? ` • ${spell.school}` : ""}
              </div>

              {spell.classes && spell.classes.length > 0 && (
                <div className="mt-2 text-sm text-slate-300">
                  <span className="font-semibold text-slate-200">Classes:</span>{" "}
                  {spell.classes.join(", ")}
                </div>
              )}
            </div>

            <div className="space-y-2">
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
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Options
                </div>

                <div className="space-y-2">
                  {spell.options.map((option) => (
                    <div
                      key={option.name}
                      className="rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="text-sm font-semibold text-white">
                        {option.name}
                      </div>
                      <p className="mt-1 text-sm leading-5 text-slate-300">
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
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <button
        type="button"
        onClick={togglePinned}
        className="inline-flex items-center text-left"
        aria-expanded={open}
      >
        {children}
      </button>

      {tooltipContent}
    </div>
  );
}
