import type { Trait } from "../../../rulesets/dnd/dnd2024/types";
import TraitPill from "./TraitPill";
import { formatLabel } from "../utils/characterSheetHelpers";
import { formatUsage, getEffectLabel } from "../utils/traitHelpers";

type TraitCardProps = {
  trait: Trait;
};

const TraitCard = ({ trait }: TraitCardProps) => {
  const usageLabel = formatUsage(trait.usage);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold text-white">{trait.name}</p>

              {typeof trait.level === "number" && (
                <TraitPill>Level {trait.level}</TraitPill>
              )}

              {typeof trait.minLevel === "number" &&
                typeof trait.level !== "number" && (
                  <TraitPill>Min Level {trait.minLevel}</TraitPill>
                )}

              {trait.activation && (
                <TraitPill>{formatLabel(trait.activation)}</TraitPill>
              )}

              {usageLabel && <TraitPill tone="accent">{usageLabel}</TraitPill>}
            </div>

            {trait.description && (
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {trait.description}
              </p>
            )}
          </div>
        </div>

        {trait.effects && trait.effects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {trait.effects.map((effect, index) => (
              <TraitPill key={`${trait.id}-effect-${index}`}>
                {getEffectLabel(effect)}
              </TraitPill>
            ))}
          </div>
        )}

        {trait.choices && trait.choices.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Choices
            </p>

            <div className="space-y-3">
              {trait.choices.map((choice) => (
                <div key={choice.id}>
                  <p className="text-sm font-medium text-zinc-200">
                    {choice.name} • Choose {choice.choose}
                  </p>

                  {choice.options?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {choice.options.map((option) => (
                        <TraitPill key={option.id}>{option.name}</TraitPill>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {trait.notes && trait.notes.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Notes
            </p>

            <ul className="space-y-1 text-sm text-zinc-400">
              {trait.notes.map((note, index) => (
                <li key={`${trait.id}-note-${index}`}>• {note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraitCard;