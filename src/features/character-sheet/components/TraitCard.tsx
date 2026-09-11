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

  const summary = getTraitSummary({
    usageLabel,

    activationLabel,

    effectLabels,

    description: trait.description,
  });

  return (
    <TraitTooltip trait={trait}>
      <div className="group grid min-h-[38px] cursor-pointer grid-cols-[minmax(0,1fr)_minmax(90px,45%)] items-center gap-3 border-b border-white/[0.045] px-3 py-1.5 last:border-b-0 transition hover:bg-white/[0.035]">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[10px] font-semibold text-zinc-200 transition group-hover:text-white">
              {trait.name}
            </span>

            {typeof trait.level === "number" ? (
              <span className="shrink-0 text-[7px] font-medium text-zinc-600">
                L{trait.level}
              </span>
            ) : typeof trait.minLevel === "number" ? (
              <span className="shrink-0 text-[7px] font-medium text-zinc-600">
                L{trait.minLevel}+
              </span>
            ) : null}
          </div>
        </div>

        <div className="min-w-0 text-right">
          {summary ? (
            <span
              title={summary}
              className="block truncate text-[8px] font-medium text-zinc-500"
            >
              {summary}
            </span>
          ) : (
            <span className="text-[8px] text-zinc-700">Details</span>
          )}
        </div>
      </div>
    </TraitTooltip>
  );
};

const getTraitSummary = ({
  usageLabel,

  activationLabel,

  effectLabels,

  description,
}: {
  usageLabel: string | null | undefined;

  activationLabel: string | null;

  effectLabels: string[];

  description?: string;
}) => {
  /*
   * Prioritize mechanically useful information.
   *
   * Usage is generally more important during play
   * than prose description.
   */

  const parts: string[] = [];

  if (activationLabel) {
    parts.push(activationLabel);
  }

  if (usageLabel) {
    parts.push(usageLabel);
  }

  if (effectLabels.length > 0) {
    parts.push(effectLabels[0]);
  }

  if (parts.length > 0) {
    return parts.slice(0, 2).join(" · ");
  }

  if (description) {
    return getShortDescription(description);
  }

  return null;
};

const getShortDescription = (value: string) => {
  const cleaned = value.replace(/\s+/g, " ").trim();

  const firstSentenceEnd = cleaned.indexOf(".");

  const firstSentence =
    firstSentenceEnd >= 0 ? cleaned.slice(0, firstSentenceEnd + 1) : cleaned;

  if (firstSentence.length <= 70) {
    return firstSentence;
  }

  return `${firstSentence.slice(0, 67)}…`;
};

export default TraitCard;
