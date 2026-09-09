import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type {
  MonsterDefinition,
  MonsterTextEntry,
} from "../../data/monsterCatalog";

export type MonsterSource = "default" | "campaign";

export type MonsterListItem = MonsterDefinition & {
  source: MonsterSource;
  basedOnMonsterId?: string;
};

const abilityModifier = (score: number) => {
  const modifier = Math.floor((score - 10) / 2);

  return modifier >= 0 ? `+${modifier}` : String(modifier);
};

const StatBlockSection = ({
  title,
  entries,
  compact = false,
}: {
  title: string;
  entries?: MonsterTextEntry[];
  compact?: boolean;
}) => {
  if (!entries?.length) {
    return null;
  }

  return (
    <div className={compact ? "mt-3" : "mt-6"}>
      <h3
        className={`border-b border-rose-900/40 pb-1 font-bold uppercase text-rose-300 ${
          compact ? "text-xs tracking-[0.14em]" : "text-sm tracking-[0.18em]"
        }`}
      >
        {title}
      </h3>

      <div className={compact ? "mt-2 space-y-2" : "mt-3 space-y-3"}>
        {entries.map((entry, index) => (
          <p
            key={`${entry.name}-${index}`}
            className={
              compact
                ? "text-sm leading-5 text-zinc-300"
                : "text-sm leading-6 text-zinc-300"
            }
          >
            <span className="font-semibold italic text-white">
              {entry.name}.
            </span>{" "}
            {entry.text}
          </p>
        ))}
      </div>
    </div>
  );
};

function SourceBadge({
  source,
  compact = false,
}: {
  source: MonsterSource;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border font-semibold ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      } ${
        source === "campaign"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-white/10 bg-white/5 text-zinc-300"
      }`}
    >
      {source === "campaign" ? "Campaign" : "Default"}
    </span>
  );
}

function MonsterImageModal({
  monster,
  onClose,
}: {
  monster: MonsterListItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!monster.img) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="relative flex max-h-[94vh] max-w-[94vw] flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-zinc-900 px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate font-serif text-xl font-bold text-rose-200">
              {monster.name}
            </h2>

            <p className="truncate text-xs text-zinc-500">
              {monster.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close image"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center bg-black">
          <img
            src={monster.img}
            alt={monster.name}
            className="max-h-[85vh] max-w-[92vw] object-contain"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function MonsterStatBlock({
  monster,
  compact = false,
}: {
  monster: MonsterListItem;
  compact?: boolean;
}) {
  const [imageOpen, setImageOpen] = useState(false);

  const abilities = [
    ["STR", monster.stats.str],
    ["DEX", monster.stats.dex],
    ["CON", monster.stats.con],
    ["INT", monster.stats.int],
    ["WIS", monster.stats.wis],
    ["CHA", monster.stats.cha],
  ] as const;

  const dividerClass = compact
    ? "my-2 h-px bg-rose-900/40"
    : "my-4 h-px bg-rose-900/40";

  return (
    <>
      <div
        className={
          compact
            ? "bg-[#171311]"
            : "overflow-hidden rounded-3xl border border-rose-900/30 bg-[#171311] shadow-2xl"
        }
      >
        {!compact && monster.img ? (
          <button
            type="button"
            onClick={() => setImageOpen(true)}
            className="block aspect-[2/1] w-full overflow-hidden border-b border-white/10 bg-black/30"
            title="View larger image"
          >
            <img
              src={monster.img}
              alt={monster.name}
              className="h-full w-full object-cover transition duration-200 hover:scale-[1.01]"
            />
          </button>
        ) : null}

        <div className={compact ? "p-3" : "p-5 sm:p-6"}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  className={`min-w-0 font-serif font-bold text-rose-200 ${
                    compact ? "text-lg" : "text-3xl"
                  }`}
                >
                  {monster.name}
                </h2>

                {compact && monster.source === "campaign" ? (
                  <SourceBadge source={monster.source} compact />
                ) : null}
              </div>

              <p
                className={`italic text-zinc-400 ${
                  compact ? "mt-0.5 text-xs leading-4" : "mt-1 text-sm"
                }`}
              >
                {monster.description}
              </p>
            </div>

            {compact && monster.img ? (
              <button
                type="button"
                onClick={() => setImageOpen(true)}
                title={`View ${monster.name} image`}
                className="workspace-no-drag group h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30 transition hover:border-rose-300/50"
              >
                <img
                  src={monster.img}
                  alt={monster.name}
                  className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                />
              </button>
            ) : !compact ? (
              <SourceBadge source={monster.source} />
            ) : null}
          </div>

          <div className={dividerClass} />

          {compact ? (
            <div className="grid grid-cols-3 gap-1">
              <div className="min-w-0 rounded-lg border border-white/10 bg-black/20 px-1.5 py-1">
                <div className="text-[9px] font-bold uppercase tracking-wide text-rose-300">
                  AC
                </div>

                <div className="text-sm font-semibold text-white">
                  {monster.armorClass}
                </div>

                {monster.armorClassNotes ? (
                  <div
                    className="truncate text-[9px] text-zinc-500"
                    title={monster.armorClassNotes}
                  >
                    {monster.armorClassNotes}
                  </div>
                ) : null}
              </div>

              <div className="min-w-0 rounded-lg border border-white/10 bg-black/20 px-1.5 py-1">
                <div className="text-[9px] font-bold uppercase tracking-wide text-rose-300">
                  HP
                </div>

                <div className="text-sm font-semibold text-white">
                  {monster.hp}
                </div>
              </div>

              <div className="min-w-0 rounded-lg border border-white/10 bg-black/20 px-1.5 py-1">
                <div className="text-[9px] font-bold uppercase tracking-wide text-rose-300">
                  Speed
                </div>

                <div
                  className="truncate text-xs font-semibold text-white"
                  title={
                    typeof monster.speed === "number"
                      ? `${monster.speed} ft.`
                      : monster.speed
                  }
                >
                  {typeof monster.speed === "number"
                    ? `${monster.speed} ft.`
                    : monster.speed}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-sm text-zinc-300">
              <p>
                <span className="font-semibold text-rose-300">Armor Class</span>{" "}
                {monster.armorClass}
                {monster.armorClassNotes ? ` (${monster.armorClassNotes})` : ""}
              </p>

              <p>
                <span className="font-semibold text-rose-300">Hit Points</span>{" "}
                {monster.hp}
              </p>

              <p>
                <span className="font-semibold text-rose-300">Speed</span>{" "}
                {typeof monster.speed === "number"
                  ? `${monster.speed} ft.`
                  : monster.speed}
              </p>
            </div>
          )}

          <div className={dividerClass} />

          <div
            className={
              compact
                ? "grid grid-cols-3 gap-1"
                : "grid grid-cols-3 gap-2 sm:grid-cols-6"
            }
          >
            {abilities.map(([label, score]) => (
              <div
                key={label}
                className={`min-w-0 border border-white/10 bg-black/20 text-center ${
                  compact ? "rounded-lg px-1 py-1" : "rounded-xl p-2"
                }`}
              >
                <div
                  className={`font-bold text-rose-300 ${
                    compact ? "text-[9px]" : "text-xs"
                  }`}
                >
                  {label}
                </div>

                <div
                  className={`whitespace-nowrap font-semibold text-white ${
                    compact ? "mt-0.5 text-[11px]" : "mt-1 text-sm"
                  }`}
                >
                  {score}{" "}
                  <span className="text-zinc-400">
                    ({abilityModifier(score)})
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={dividerClass} />

          <div
            className={
              compact
                ? "space-y-0.5 break-words text-xs leading-5 text-zinc-300"
                : "space-y-1 text-sm text-zinc-300"
            }
          >
            {monster.skills ? (
              <p>
                <span className="font-semibold text-rose-300">Skills</span>{" "}
                {monster.skills}
              </p>
            ) : null}

            {monster.senses ? (
              <p>
                <span className="font-semibold text-rose-300">Senses</span>{" "}
                {monster.senses}
              </p>
            ) : null}

            {monster.language ? (
              <p>
                <span className="font-semibold text-rose-300">Languages</span>{" "}
                {monster.language}
              </p>
            ) : null}

            <p>
              <span className="font-semibold text-rose-300">Challenge</span>{" "}
              {monster.challengeRating} ({monster.xp.toLocaleString()} XP)
            </p>
          </div>

          <StatBlockSection
            title="Traits"
            entries={monster.traits}
            compact={compact}
          />

          <StatBlockSection
            title="Actions"
            entries={monster.actions}
            compact={compact}
          />

          <StatBlockSection
            title="Bonus Actions"
            entries={monster.bonusActions}
            compact={compact}
          />

          <StatBlockSection
            title="Reactions"
            entries={monster.reactions}
            compact={compact}
          />
        </div>
      </div>

      {imageOpen ? (
        <MonsterImageModal
          monster={monster}
          onClose={() => setImageOpen(false)}
        />
      ) : null}
    </>
  );
}
