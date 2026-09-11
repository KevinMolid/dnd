import type { TraitGroup } from "../types";

import TraitCard from "./TraitCard";

type TraitGroupSectionProps = {
  group: TraitGroup;

  isOpen: boolean;

  onToggle: () => void;
};

const groupLabels: Record<TraitGroup["key"], string> = {
  species: "Species",

  class: "Class",

  subclass: "Subclass",

  background: "Background",

  feats: "Feats",

  other: "Other",
};

const TraitGroupSection = ({
  group,

  isOpen,

  onToggle,
}: TraitGroupSectionProps) => {
  return (
    <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900/30">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition hover:bg-white/[0.035]"
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`text-[9px] text-zinc-500 transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>

          <span className="truncate text-[10px] font-bold uppercase tracking-[0.11em] text-zinc-300">
            {group.title}
          </span>

          <span className="shrink-0 text-[8px] uppercase tracking-[0.08em] text-zinc-600">
            · {groupLabels[group.key]}
          </span>
        </div>

        <span className="shrink-0 text-[8px] font-medium text-zinc-600">
          {group.traits.length}
        </span>
      </button>

      {isOpen ? (
        <div className="border-t border-white/[0.06]">
          {group.traits.map((trait) => (
            <TraitCard key={trait.id} trait={trait} />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default TraitGroupSection;
