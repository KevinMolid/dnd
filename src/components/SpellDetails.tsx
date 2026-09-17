import type { Spell } from "../rulesets/dnd/dnd2024/types";

type SpellLike = Partial<Spell> & {
  id?: string;
  spellId?: string;
  name: string;
  level?: number;
  description?: string;
  higherLevel?: string;
  benefits?: string;
  school?: string;
  castingTime?: string;
  range?: string;
  components?: string;
  duration?: string;
  concentration?: boolean;
  ritual?: boolean;
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-2 text-xs">
      <span className="font-semibold text-zinc-300">{label}</span>
      <span className="text-zinc-300">{String(value)}</span>
    </div>
  );
};

const TextSection = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => {
  if (!value?.trim()) {
    return null;
  }

  return (
    <div>
      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>
      <p className="whitespace-pre-line text-xs leading-5 text-zinc-200">
        {value}
      </p>
    </div>
  );
};

export default function SpellDetails({ spell }: { spell: SpellLike }) {
  const raw = spell as any;

  const components =
    typeof spell.components === "string"
      ? spell.components
      : Array.isArray(raw.components)
        ? raw.components.join(", ")
        : undefined;

  const description =
    spell.description ?? raw.rulesText ?? raw.text ?? raw.effect ?? undefined;

  const benefits =
    spell.benefits ?? raw.benefit ?? raw.effectsDescription ?? undefined;

  const higherLevel =
    spell.higherLevel ?? raw.higherLevels ?? raw.atHigherLevels ?? undefined;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <DetailRow label="Casting Time" value={spell.castingTime} />
        <DetailRow label="Range" value={spell.range} />
        <DetailRow label="Components" value={components} />
        <DetailRow label="Duration" value={spell.duration} />
      </div>

      <TextSection label="Description" value={description} />
      <TextSection label="Benefits" value={benefits} />
      <TextSection label="At Higher Levels" value={higherLevel} />
    </div>
  );
}
