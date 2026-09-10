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

  /*
   * Optional for Guided characters.
   * Lets us show a small "Score 18 · Base 16" line later
   * without changing the main presentation.
   */
  baseAbilityScores?: Partial<AbilityScores>;
};

const abilities: Array<{
  id: AbilityKey;
  label: string;
}> = [
  {
    id: "str",
    label: "STR",
  },
  {
    id: "dex",
    label: "DEX",
  },
  {
    id: "con",
    label: "CON",
  },
  {
    id: "int",
    label: "INT",
  },
  {
    id: "wis",
    label: "WIS",
  },
  {
    id: "cha",
    label: "CHA",
  },
];

const formatModifier = (value: number) =>
  value >= 0 ? `+${value}` : `${value}`;

const getModifier = (score: number) => Math.floor((score - 10) / 2);

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

  baseAbilityScores,
}: CharacterQuickStatsProps) => {
  return (
    <div className="mb-4 grid gap-3 lg:grid-cols-2">
      {/* CORE STATS */}

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Core Stats
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <CoreStat label="HP" value={`${currentHp}/${maxHp}`} emphasis="hp" />

          <CoreStat label="AC" value={armorClass} />

          <CoreStat
            label="Initiative"
            value={formatModifier(initiative)}
            subValue={initiativeSubValue}
            emphasis="initiative"
          />

          <CoreStat label="Speed" value={`${speed} ft`} />

          <CoreStat
            label="Proficiency"
            value={formatModifier(proficiencyBonus)}
          />

          <CoreStat label="Passive Perception" value={passivePerception} />
        </div>
      </section>

      {/* ABILITIES */}

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Abilities
          </h2>

          <span className="text-[9px] text-zinc-600">Modifier / Score</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {abilities.map((ability) => {
            const score = abilityScores[ability.id] ?? 10;

            const modifier = getModifier(score);

            const baseScore = baseAbilityScores?.[ability.id];

            const hasDifferentBase =
              typeof baseScore === "number" && baseScore !== score;

            return (
              <div
                key={ability.id}
                className="flex min-h-[66px] flex-col items-center justify-center rounded-xl bg-zinc-900/60 px-2 py-2 text-center"
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                  {ability.label}
                </p>

                <p className="mt-0.5 text-xl font-bold leading-none text-white">
                  {formatModifier(modifier)}
                </p>

                <p className="mt-1 text-[9px] text-zinc-500">Score {score}</p>

                {hasDifferentBase ? (
                  <p className="text-[8px] text-zinc-700">Base {baseScore}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

type CoreStatProps = {
  label: string;

  value: string | number;

  subValue?: string;

  emphasis?: "hp" | "initiative";
};

const CoreStat = ({ label, value, subValue, emphasis }: CoreStatProps) => {
  const emphasisClass =
    emphasis === "hp"
      ? "bg-rose-500/[0.055] border-rose-500/10"
      : emphasis === "initiative"
        ? "bg-amber-500/[0.045] border-amber-500/10"
        : "bg-zinc-900/60 border-transparent";

  return (
    <div
      className={`flex min-h-[66px] flex-col items-center justify-center rounded-xl border px-2 py-2 text-center ${emphasisClass}`}
    >
      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
        {label}
      </p>

      <p className="mt-0.5 text-lg font-bold leading-none text-white">
        {value}
      </p>

      {subValue ? (
        <p
          className="mt-1 max-w-full truncate text-[8px] text-zinc-600"
          title={subValue}
        >
          {subValue}
        </p>
      ) : null}
    </div>
  );
};

export default CharacterQuickStats;
