import type { AbilityKey } from "../../../rulesets/dnd/dnd2024/types";

type AbilityScores = Record<AbilityKey, number>;

type CharacterQuickStatsProps = {
  currentHp: number;
  maxHp: number;

  armorClass: number;

  initiative: number;
  initiativeSubValue?: string;

  speed: number;
  proficiencyBonus: number;
  passivePerception: number;

  abilityScores: AbilityScores;

  savingThrowProficiencies?: AbilityKey[];

  languages?: string[];
  armorProficiencies?: string[];
  weaponProficiencies?: string[];
  toolProficiencies?: string[];
};

const abilities: Array<{
  id: AbilityKey;
  label: string;
}> = [
  { id: "str", label: "STR" },
  { id: "dex", label: "DEX" },
  { id: "con", label: "CON" },
  { id: "int", label: "INT" },
  { id: "wis", label: "WIS" },
  { id: "cha", label: "CHA" },
];

const formatModifier = (value: number) =>
  value >= 0 ? `+${value}` : `${value}`;

const getModifier = (score: number) => Math.floor((score - 10) / 2);

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const CharacterQuickStats = ({
  currentHp,
  maxHp,

  armorClass,

  initiative,
  initiativeSubValue,

  speed,
  proficiencyBonus,
  passivePerception,

  abilityScores,

  savingThrowProficiencies = [],

  languages = [],
  armorProficiencies = [],
  weaponProficiencies = [],
  toolProficiencies = [],
}: CharacterQuickStatsProps) => {
  return (
    <div className="mb-3 grid gap-2 xl:grid-cols-[0.9fr_1.25fr_0.95fr]">
      {/* CORE */}

      <section className="rounded-xl border border-white/10 bg-white/[0.035] p-2.5">
        <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Core
        </h2>

        <div className="grid grid-cols-3 gap-1">
          <CoreStat label="HP" value={`${currentHp}/${maxHp}`} emphasis="hp" />

          <CoreStat label="AC" value={armorClass} />

          <CoreStat
            label="Initiative"
            value={formatModifier(initiative)}
            title={initiativeSubValue}
            emphasis="initiative"
          />

          <CoreStat label="Speed" value={`${speed} ft`} />

          <CoreStat
            label="Prof Bonus"
            value={formatModifier(proficiencyBonus)}
          />

          <CoreStat label="Passive Perception" value={passivePerception} />
        </div>
      </section>

      {/* ABILITIES + SAVES */}

      <section className="rounded-xl border border-white/10 bg-white/[0.035] p-2.5">
        <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Abilities & Saves
        </h2>

        <div className="grid grid-cols-3 gap-1">
          {abilities.map((ability) => {
            const score = abilityScores[ability.id] ?? 10;

            const modifier = getModifier(score);

            const proficient = savingThrowProficiencies.includes(ability.id);

            const saveModifier = modifier + (proficient ? proficiencyBonus : 0);

            return (
              <div
                key={ability.id}
                className="min-h-[58px] rounded-lg bg-black/20 px-2.5 py-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-300">
                    {ability.label}
                  </span>

                  <span className="text-xl font-bold leading-none text-white">
                    {formatModifier(modifier)}
                  </span>
                </div>

                <div className="mt-1.5 flex items-end justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1">
                    <span className="text-[9px] font-medium text-zinc-400">
                      Save
                    </span>

                    <span
                      className={`text-[10px] font-semibold ${
                        proficient ? "text-emerald-300" : "text-zinc-300"
                      }`}
                    >
                      {formatModifier(saveModifier)}
                    </span>

                    {proficient ? (
                      <span className="text-[7px] font-bold uppercase tracking-[0.08em] text-emerald-500">
                        Prof
                      </span>
                    ) : null}
                  </div>

                  <span className="shrink-0 text-[8px] text-zinc-600">
                    Score {score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PROFICIENCIES */}

      <section className="rounded-xl border border-white/10 bg-white/[0.035] p-2.5">
        <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Proficiencies
        </h2>

        <div className="divide-y divide-white/[0.05]">
          <ProficiencyRow label="Languages" values={languages} />

          <ProficiencyRow label="Armor" values={armorProficiencies} />

          <ProficiencyRow label="Weapons" values={weaponProficiencies} />

          <ProficiencyRow label="Tools" values={toolProficiencies} />
        </div>
      </section>
    </div>
  );
};

type CoreStatProps = {
  label: string;

  value: string | number;

  title?: string;

  emphasis?: "hp" | "initiative";
};

const CoreStat = ({ label, value, title, emphasis }: CoreStatProps) => {
  const backgroundClass =
    emphasis === "hp"
      ? "bg-rose-500/[0.055]"
      : emphasis === "initiative"
        ? "bg-amber-500/[0.045]"
        : "bg-black/20";

  const labelClass =
    emphasis === "hp"
      ? "text-rose-300/80"
      : emphasis === "initiative"
        ? "text-amber-300/75"
        : "text-zinc-400";

  return (
    <div
      title={title}
      className={`flex min-h-[58px] flex-col justify-center rounded-lg px-2.5 py-2 ${backgroundClass}`}
    >
      <span
        className={`text-[9px] font-bold uppercase tracking-[0.11em] ${labelClass}`}
      >
        {label}
      </span>

      <span className="mt-1 text-lg font-bold leading-none text-white">
        {value}
      </span>
    </div>
  );
};

const ProficiencyRow = ({
  label,
  values,
}: {
  label: string;

  values: string[];
}) => {
  const formattedValues = values.filter(Boolean).map(formatLabel);

  return (
    <div className="grid grid-cols-[72px_1fr] items-start gap-2 py-2 first:pt-0 last:pb-0">
      <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
        {label}
      </span>

      <span
        className={`min-w-0 text-[10px] leading-4 ${
          formattedValues.length ? "text-zinc-200" : "text-zinc-700"
        }`}
      >
        {formattedValues.length ? formattedValues.join(" · ") : "—"}
      </span>
    </div>
  );
};

export default CharacterQuickStats;
