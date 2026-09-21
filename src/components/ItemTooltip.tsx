import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { createPortal } from "react-dom";

import { itemsById } from "../rulesets/dnd/dnd2024/data/items";

import type { Item } from "../rulesets/dnd/dnd2024/types";

import type { ResolvedItem } from "../rulesets/dnd/dnd2024/resolveItem";

type TooltipItem = Item | ResolvedItem;

type ItemTooltipProps = {
  item: TooltipItem;

  children: ReactNode;

  className?: string;
};

const HIDE_DELAY_MS = 140;

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const isResolvedCampaignItem = (
  item: TooltipItem,
): item is ResolvedItem & {
  source: "campaign";
} => {
  return "source" in item && item.source === "campaign";
};

const formatCost = (cost?: Item["cost"]) => {
  if (!cost) {
    return null;
  }

  const order: Array<keyof NonNullable<Item["cost"]>> = [
    "cp",
    "sp",
    "ep",
    "gp",
    "pp",
  ];

  const parts = order
    .map((currency) => {
      const value = cost[currency];

      if (!value) {
        return null;
      }

      return `${value} ${currency.toUpperCase()}`;
    })
    .filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : null;
};

const formatDamage = (item: TooltipItem) => {
  if (!item.weapon) {
    return null;
  }

  const damage = item.weapon.damage;

  const versatile = item.weapon.versatileDamage
    ? ` (${item.weapon.versatileDamage.dice.count}d${item.weapon.versatileDamage.dice.die} versatile)`
    : "";

  return `${damage.dice.count}d${damage.dice.die} ${formatLabel(
    damage.damageType,
  )}${versatile}`;
};

const formatRange = (item: TooltipItem) => {
  if (!item.weapon?.range) {
    return null;
  }

  return `${item.weapon.range.normal}${
    item.weapon.range.long ? ` / ${item.weapon.range.long}` : ""
  } ft`;
};

const formatAc = (item: TooltipItem) => {
  if (item.armor) {
    const dexText =
      item.armor.dexCap === 0
        ? "No Dex bonus"
        : typeof item.armor.dexCap === "number"
          ? `Dex max +${item.armor.dexCap}`
          : "Full Dex";

    return `AC ${item.armor.baseAc} • ${dexText}`;
  }

  if (item.shield) {
    return `AC +${item.shield.acBonus}`;
  }

  return null;
};

const ItemTooltip = ({ item, children, className = "" }: ItemTooltipProps) => {
  const [open, setOpen] = useState(false);

  const [pinned, setPinned] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);

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

      const insideTrigger = rootRef.current?.contains(target);

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

  const costLabel = useMemo(() => formatCost(item.cost), [item.cost]);

  const damageLabel = useMemo(() => formatDamage(item), [item]);

  const rangeLabel = useMemo(() => formatRange(item), [item]);

  const acLabel = useMemo(() => formatAc(item), [item]);

  const contents = item.contents ?? [];

  const baseItem =
    isResolvedCampaignItem(item) && item.baseItemId
      ? itemsById[item.baseItemId]
      : null;

  const hasAnyDetails =
    !!item.description ||
    ("shortDescription" in item && !!item.shortDescription) ||
    ("gmNotes" in item && !!item.gmNotes) ||
    !!item.weight ||
    !!costLabel ||
    !!damageLabel ||
    !!rangeLabel ||
    !!acLabel ||
    !!item.weapon ||
    !!item.armor ||
    !!item.shield ||
    contents.length > 0 ||
    isResolvedCampaignItem(item);

  if (!hasAnyDetails) {
    return <div className={`inline-flex ${className}`}>{children}</div>;
  }

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
              bg-zinc-950/95
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
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h4 className="text-sm font-semibold text-white">
                    {item.name}
                  </h4>

                  {isResolvedCampaignItem(item) && (
                    <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-violet-300">
                      Campaign Item
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                  {formatLabel(item.category)}
                </p>

                {isResolvedCampaignItem(item) && baseItem && (
                  <p className="mt-1.5 text-[10px] text-zinc-500">
                    Based on: {baseItem.name}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {item.weapon?.mastery && (
                  <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-violet-300">
                    {formatLabel(item.weapon.mastery)}
                  </span>
                )}

                {pinned && (
                  <span
                    title="Pinned"
                    className="rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-1 text-[9px] text-amber-300"
                  >
                    <i className="fa-solid fa-thumbtack" />
                  </span>
                )}
              </div>
            </div>

            {"shortDescription" in item && item.shortDescription && (
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-2.5">
                <p className="text-xs leading-5 text-violet-100">
                  {item.shortDescription}
                </p>
              </div>
            )}

            {item.description && (
              <p className="whitespace-pre-wrap text-xs leading-5 text-zinc-300">
                {item.description}
              </p>
            )}

            {"gmNotes" in item && item.gmNotes && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5">
                <p className="text-[9px] uppercase tracking-[0.14em] text-amber-400">
                  GM Notes
                </p>

                <p className="mt-1.5 whitespace-pre-wrap text-xs leading-5 text-amber-100">
                  {item.gmNotes}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {costLabel && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-zinc-300">
                  Cost: {costLabel}
                </span>
              )}

              {typeof item.weight === "number" && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-zinc-300">
                  {item.weight} lb.
                </span>
              )}

              {item.magical && (
                <span className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2 py-1 text-[10px] text-fuchsia-300">
                  Magical
                </span>
              )}

              {typeof item.attackBonus === "number" &&
                item.attackBonus !== 0 && (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300">
                    Attack {item.attackBonus > 0 ? "+" : ""}
                    {item.attackBonus}
                  </span>
                )}

              {typeof item.damageBonus === "number" &&
                item.damageBonus !== 0 && (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-300">
                    Damage {item.damageBonus > 0 ? "+" : ""}
                    {item.damageBonus}
                  </span>
                )}

              {typeof item.acBonus === "number" && item.acBonus !== 0 && (
                <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-1 text-[10px] text-sky-300">
                  AC {item.acBonus > 0 ? "+" : ""}
                  {item.acBonus}
                </span>
              )}

              {item.weapon && (
                <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-1 text-[10px] text-sky-300">
                  {formatLabel(item.weapon.weaponKind)}
                </span>
              )}

              {item.weapon?.properties?.map((property) => (
                <span
                  key={property}
                  className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-zinc-300"
                >
                  {formatLabel(property)}
                </span>
              ))}
            </div>

            {(damageLabel || rangeLabel || acLabel) && (
              <div className="grid gap-2 sm:grid-cols-2">
                {damageLabel && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-500">
                      Damage
                    </p>

                    <p className="mt-1 text-xs font-medium text-white">
                      {damageLabel}
                    </p>
                  </div>
                )}

                {rangeLabel && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-500">
                      Range
                    </p>

                    <p className="mt-1 text-xs font-medium text-white">
                      {rangeLabel}
                    </p>
                  </div>
                )}

                {acLabel && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 sm:col-span-2">
                    <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-500">
                      Defense
                    </p>

                    <p className="mt-1 text-xs font-medium text-white">
                      {acLabel}
                    </p>
                  </div>
                )}
              </div>
            )}

            {contents.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                <p className="mb-2 text-[9px] uppercase tracking-[0.14em] text-zinc-500">
                  Contents
                </p>

                <div className="space-y-1">
                  {contents.map((entry, index) => {
                    const resolvedItem = entry.itemId
                      ? itemsById[entry.itemId]
                      : null;

                    return (
                      <div
                        key={`${entry.itemId ?? entry.name}-${index}`}
                        className="text-xs leading-5 text-zinc-300"
                      >
                        <span className="font-medium text-white">
                          {entry.quantity} × {resolvedItem?.name ?? entry.name}
                        </span>

                        {entry.notes ? (
                          <span className="text-zinc-500">
                            {" "}
                            • {entry.notes}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-white/10 pt-2 text-[9px] text-zinc-600">
              Click the item to {pinned ? "unpin" : "pin"} this card.
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div
      ref={rootRef}
      className={`inline-flex ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={scheduleHide}
      onFocus={showTooltip}
      onBlur={scheduleHide}
    >
      <div
        onClick={togglePinned}
        className="inline-flex items-center text-left"
        role="button"
        tabIndex={0}
        aria-expanded={open}
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
};

export default ItemTooltip;
