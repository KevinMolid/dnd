import type { TraitGroup } from "../types";
import SourceBadge from "./SourceBadge";
import TraitCard from "./TraitCard";

type TraitGroupSectionProps = {
  group: TraitGroup;
  isOpen: boolean;
  onToggle: () => void;
};

const TraitGroupSection = ({
  group,
  isOpen,
  onToggle,
}: TraitGroupSectionProps) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/60">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-white/5"
      >
        <div className="flex min-w-0 items-center gap-3">
          <SourceBadge groupKey={group.key} />

          <div className="min-w-0">
            <p className="text-base font-semibold text-white">{group.title}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {group.subtitle ??
                `${group.traits.length} trait${group.traits.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
          {isOpen ? "Hide" : "Show"}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-white/10 px-4 py-4">
          <div className="space-y-3">
            {group.traits.map((trait) => (
              <TraitCard key={trait.id} trait={trait} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TraitGroupSection;