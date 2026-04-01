import { useEffect, useMemo, useRef, useState } from "react";
import type { Item } from "../rulesets/dnd/dnd2024/types";
import { itemsById } from "../rulesets/dnd/dnd2024/data/items";

type ItemTooltipProps = {
  item: Item;
  children: React.ReactNode;
  className?: string;
};

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatCost = (cost?: Item["cost"]) => {
  if (!cost) return null;

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
      if (!value) return null;
      return `${value} ${currency.toUpperCase()}`;
    })
    .filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : null;
};

const formatDamage = (item: Item) => {
  if (!item.weapon) return null;

  const damage = item.weapon.damage;
  const versatile = item.weapon.versatileDamage
    ? ` (${item.weapon.versatileDamage.dice.count}d${item.weapon.versatileDamage.dice.die} versatile)`
    : "";

  return `${damage.dice.count}d${damage.dice.die} ${formatLabel(
    damage.damageType,
  )}${versatile}`;
};

const formatRange = (item: Item) => {
  if (!item.weapon?.range) return null;

  return `${item.weapon.range.normal}${
    item.weapon.range.long ? ` / ${item.weapon.range.long}` : ""
  } ft`;
};

const formatAc = (item: Item) => {
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
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current) return;

      const target = event.target as Node | null;
      if (target && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open]);

  const costLabel = useMemo(() => formatCost(item.cost), [item.cost]);
  const damageLabel = useMemo(() => formatDamage(item), [item]);
  const rangeLabel = useMemo(() => formatRange(item), [item]);
  const acLabel = useMemo(() => formatAc(item), [item]);

  const contents = item.contents ?? [];

  const hasAnyDetails =
    !!item.description ||
    !!item.weight ||
    !!costLabel ||
    !!damageLabel ||
    !!rangeLabel ||
    !!acLabel ||
    !!item.weapon ||
    !!item.armor ||
    !!item.shield ||
    contents.length > 0;

  return (
    <div
      ref={rootRef}
      className={`group relative inline-block ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((prev) => !prev);
          }

          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        {children}
      </div>

      {open && hasAnyDetails && (
        <div className="absolute left-1/2 top-full z-50 mt-3 w-[min(92vw,24rem)] -translate-x-1/2 rounded-2xl border border-white/10 bg-zinc-950/95 p-4 text-left shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-white">{item.name}</h4>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                {formatLabel(item.category)}
              </p>
            </div>

            {item.weapon?.mastery && (
              <span className="shrink-0 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-violet-300">
                {formatLabel(item.weapon.mastery)}
              </span>
            )}
          </div>

          {item.description && (
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {item.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {costLabel && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                Cost: {costLabel}
              </span>
            )}

            {typeof item.weight === "number" && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                Weight: {item.weight} lb.
              </span>
            )}

            {item.weapon && (
              <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs text-sky-300">
                {formatLabel(item.weapon.weaponKind)}
              </span>
            )}

            {item.weapon?.properties?.map((property) => (
              <span
                key={property}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300"
              >
                {formatLabel(property)}
              </span>
            ))}
          </div>

          {(damageLabel || rangeLabel || acLabel) && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {damageLabel && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    Damage
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {damageLabel}
                  </p>
                </div>
              )}

              {rangeLabel && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    Range
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {rangeLabel}
                  </p>
                </div>
              )}

              {acLabel && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:col-span-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                    Defense
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {acLabel}
                  </p>
                </div>
              )}
            </div>
          )}

          {contents.length > 0 && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                Contents
              </p>

              <div className="space-y-1.5">
                {contents.map((entry, index) => {
                  const resolvedItem = entry.itemId ? itemsById[entry.itemId] : null;

                  return (
                    <div
                      key={`${entry.itemId ?? entry.name}-${index}`}
                      className="text-sm text-zinc-300"
                    >
                      <span className="font-medium text-white">
                        {entry.quantity} × {resolvedItem?.name ?? entry.name}
                      </span>
                      {entry.notes ? (
                        <span className="text-zinc-500"> • {entry.notes}</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemTooltip;