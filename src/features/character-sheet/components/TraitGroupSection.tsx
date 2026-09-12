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
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.045]"
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`text-[10px] text-zinc-400 transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>

          <span className="truncate text-xs font-bold uppercase tracking-[0.09em] text-zinc-200">
            {group.title}
          </span>

          <span className="shrink-0 text-[10px] uppercase tracking-[0.07em] text-zinc-500">
            · {groupLabels[group.key]}
          </span>
        </div>

        <span className="shrink-0 text-[10px] font-medium text-zinc-500">
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
