import type { Trait } from "../../../rulesets/dnd/dnd2024/types";

import TraitTooltip from "./TraitTooltip";

import { formatLabel } from "../utils/characterSheetHelpers";

import { formatUsage, getEffectLabel } from "../utils/traitHelpers";

type TraitCardProps = {
  trait: Trait;
};

const TraitCard = ({ trait }: TraitCardProps) => {
  const usageLabel = formatUsage(trait.usage);

  const activationLabel = trait.activation
    ? formatLabel(trait.activation)
    : null;

  const effectLabels = trait.effects?.map(getEffectLabel).filter(Boolean) ?? [];

  const metadata = [activationLabel, usageLabel, ...effectLabels]
    .filter(Boolean)
    .slice(0, 3) as string[];

  return (
    <TraitTooltip trait={trait}>
      <div className="group cursor-pointer border-b border-white/[0.045] px-3.5 py-3 last:border-b-0 transition hover:bg-white/[0.04]">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-sm font-semibold text-zinc-100 transition group-hover:text-white">
            {trait.name}
          </span>

          {typeof trait.level === "number" ? (
            <span className="shrink-0 text-xs font-medium text-zinc-500">
              L{trait.level}
            </span>
          ) : typeof trait.minLevel === "number" ? (
            <span className="shrink-0 text-xs font-medium text-zinc-500">
              L{trait.minLevel}+
            </span>
          ) : null}
        </div>

        {metadata.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-medium text-zinc-500">
            {metadata.map((label, index) => (
              <span
                key={`${label}-${index}`}
                className="flex items-center gap-1.5"
              >
                {index > 0 ? <span className="text-zinc-700">·</span> : null}
                <span>{label}</span>
              </span>
            ))}
          </div>
        ) : null}

        {trait.description ? (
          <p
            title={trait.description}
            className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-5 text-zinc-400 transition group-hover:text-zinc-300"
          >
            {trait.description}
          </p>
        ) : metadata.length === 0 ? (
          <p className="mt-1.5 text-sm text-zinc-500">View details</p>
        ) : null}
      </div>
    </TraitTooltip>
  );
};

export default TraitCard;
