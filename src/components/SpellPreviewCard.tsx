import type { Spell } from "../rulesets/dnd/dnd2024/types";

export type SpellPreviewData = Partial<Spell> & {
  id?: string;
  name: string;
  level?: number;
  school?: string;
};

const formatSpellLevel = (level?: number) => {
  if (level === 0) return "Cantrip";
  if (typeof level !== "number") return "Spell";
  return `Level ${level}`;
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;

  return (
    <div className="flex gap-2 text-sm leading-5">
      <span className="min-w-[96px] font-semibold text-zinc-300">{label}</span>
      <span className="text-zinc-400">{value}</span>
    </div>
  );
};

const TextSection = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;

  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <p className="text-sm leading-6 text-zinc-300">{value}</p>
    </div>
  );
};

export default function SpellPreviewCard({
  spell,
  emptyText = "Hover, focus, or tap a spell to preview its details here.",
  heightClass = "h-[360px]",
}: {
  spell: SpellPreviewData | null;
  emptyText?: string;
  heightClass?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-zinc-900/70 ${heightClass} overflow-hidden`}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Spell Preview
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {spell ? (
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">
                    {spell.name}
                  </h3>

                  {spell.ritual && (
                    <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-sky-300">
                      Ritual
                    </span>
                  )}

                  {spell.concentration && (
                    <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-fuchsia-300">
                      Concentration
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-zinc-400">
                  {formatSpellLevel(spell.level)}
                  {spell.school ? ` · ${spell.school}` : ""}
                </p>

                {spell.classes && spell.classes.length > 0 && (
                  <p className="mt-2 text-sm text-zinc-400">
                    <span className="font-medium text-zinc-300">Classes:</span>{" "}
                    {spell.classes.join(", ")}
                  </p>
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
                <TextSection
                  label="End Conditions"
                  value={spell.endConditions}
                />
                <TextSection label="Higher Level" value={spell.higherLevel} />
              </div>

              {spell.options && spell.options.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Options
                  </div>

                  <div className="space-y-2">
                    {spell.options.map((option) => (
                      <div
                        key={option.name}
                        className="rounded-xl border border-white/10 bg-zinc-950/60 p-3"
                      >
                        <p className="text-sm font-medium text-white">
                          {option.name}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                          {option.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full min-h-[220px] items-center justify-center">
              <div className="max-w-md text-center">
                <p className="text-sm font-medium text-white">
                  No spell selected
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {emptyText}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
