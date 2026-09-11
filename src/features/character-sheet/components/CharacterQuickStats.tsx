import { type ReactNode, useEffect, useState } from "react";

import { createPortal } from "react-dom";

import type { AbilityKey } from "../../../rulesets/dnd/dnd2024/types";

type AbilityScores = Record<AbilityKey, number>;

export type CharacterQuickSkill = {
  id: string;
  name: string;
  ability: string;
  bonus: number;
  proficient?: boolean;
  expertise?: boolean;
};

export type DeathSaves = {
  successes: number;
  failures: number;
};

type CharacterProgress = {
  level: number;
  xp: number;
  nextLevelXp: number | null;
  progressPercent: number;
};

type CharacterQuickStatsProps = {
  currentHp: number;
  maxHp: number;
  onCurrentHpChange?: (currentHp: number) => void | Promise<void>;
  armorClass: number;
  initiative: number;
  initiativeSubValue?: string;
  speed: number;
  proficiencyBonus: number;
  passivePerception: number;
  passiveInsight?: number;
  passiveInvestigation?: number;
  abilityScores: AbilityScores;
  savingThrowProficiencies?: AbilityKey[];
  skills?: CharacterQuickSkill[];
  conditions?: string[];
  onConditionsChange?: (conditions: string[]) => void | Promise<void>;
  defenses?: string[];
  heroicInspiration?: boolean;
  onHeroicInspirationChange?: (value: boolean) => void | Promise<void>;
  deathSaves?: DeathSaves;
  onDeathSavesChange?: (value: DeathSaves) => void | Promise<void>;
  hitDiceLabel?: string;
  progress?: CharacterProgress | null;
  languages?: string[];
  armorProficiencies?: string[];
  weaponProficiencies?: string[];
  toolProficiencies?: string[];
};

const abilities: Array<{ id: AbilityKey; label: string }> = [
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

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.max(minimum, Math.min(maximum, value));

const CharacterQuickStats = ({
  currentHp,
  maxHp,
  onCurrentHpChange,
  armorClass,
  initiative,
  initiativeSubValue,
  speed,
  proficiencyBonus,
  passivePerception,
  passiveInsight,
  passiveInvestigation,
  abilityScores,
  savingThrowProficiencies = [],
  skills = [],
  conditions = [],
  onConditionsChange,
  defenses = [],
  heroicInspiration = false,
  onHeroicInspirationChange,
  deathSaves = { successes: 0, failures: 0 },
  onDeathSavesChange,
  hitDiceLabel,
  progress,
  languages = [],
  armorProficiencies = [],
  weaponProficiencies = [],
  toolProficiencies = [],
}: CharacterQuickStatsProps) => {
  const nextLevel =
    progress?.nextLevelXp !== null ? (progress?.level ?? 0) + 1 : null;

  const safeMaxHp = Math.max(1, maxHp);
  const hpPercent = clamp((currentHp / safeMaxHp) * 100, 0, 100);

  return (
    <div className="mb-3">
      <div className="grid gap-2 xl:grid-cols-[250px_minmax(430px,1fr)_360px] xl:grid-rows-[auto_auto]">
        <section className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">
          <SectionLabel>Abilities & Saving Throws</SectionLabel>

          <div className="mt-2 divide-y divide-white/[0.045]">
            {abilities.map((ability) => {
              const score = abilityScores[ability.id] ?? 10;
              const modifier = getModifier(score);
              const proficient = savingThrowProficiencies.includes(ability.id);
              const save = modifier + (proficient ? proficiencyBonus : 0);

              return (
                <div
                  key={ability.id}
                  className="grid min-h-[32px] grid-cols-[38px_48px_minmax(0,1fr)] items-center gap-2 py-1.5"
                >
                  <span className="text-[10px] font-bold tracking-[0.08em] text-zinc-300">
                    {ability.label}
                  </span>

                  <span className="text-right text-lg font-bold leading-none text-white">
                    {formatModifier(modifier)}
                  </span>

                  <div className="flex min-w-0 items-center justify-end gap-1.5">
                    <span
                      title={`Ability score ${score}`}
                      className="text-[8px] text-zinc-600"
                    >
                      {score}
                    </span>

                    <span className="text-[8px] font-medium text-zinc-500">
                      Save
                    </span>

                    <span
                      className={`text-[10px] font-semibold ${
                        proficient ? "text-emerald-300" : "text-zinc-300"
                      }`}
                    >
                      {formatModifier(save)}
                    </span>

                    {proficient ? (
                      <span className="text-[7px] font-bold uppercase tracking-[0.08em] text-emerald-500">
                        Prof
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">
          <SectionLabel>Skills</SectionLabel>

          <div className="mt-2 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            {skills.map((skill) => (
              <SkillRow key={skill.id} skill={skill} />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-zinc-900/40 p-3 xl:row-span-2">
          <SectionLabel>Live State</SectionLabel>

          <div className="mt-2 grid grid-cols-6 gap-1">
            <HpStat
              currentHp={currentHp}
              maxHp={maxHp}
              hitDiceLabel={hitDiceLabel}
              tone={getHpTone(hpPercent, currentHp)}
              onChange={onCurrentHpChange}
            />

            <CoreStat
              label="AC"
              value={armorClass}
              tone="ac"
              className="col-span-2"
            />

            <CoreStat
              label="Initiative"
              value={formatModifier(initiative)}
              title={initiativeSubValue}
              tone="initiative"
              className="col-span-2"
            />

            <CoreStat
              label="Speed"
              value={`${speed} ft`}
              className="col-span-3"
            />

            <InteractiveCoreStat
              label="Inspiration"
              value={heroicInspiration ? "●" : "○"}
              subValue={heroicInspiration ? "Ready" : "None"}
              active={heroicInspiration}
              className="col-span-3"
              onClick={() => onHeroicInspirationChange?.(!heroicInspiration)}
              disabled={!onHeroicInspirationChange}
            />
          </div>

          <ConditionsControl
            conditions={conditions}
            onChange={onConditionsChange}
          />

          <StateRow label="Defenses">
            {defenses.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {defenses.map((defense) => (
                  <StatePill key={defense} tone="defense">
                    {defense}
                  </StatePill>
                ))}
              </div>
            ) : (
              <EmptyValue />
            )}
          </StateRow>

          <div className="mt-2 border-t border-white/[0.06] pt-2">
            <div className="flex items-center justify-between gap-3">
              <SmallLabel>Death Saves</SmallLabel>

              <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
                <DeathSaveRow
                  label="Success"
                  value={deathSaves.successes}
                  type="success"
                  onChange={(successes) =>
                    onDeathSavesChange?.({
                      ...deathSaves,
                      successes,
                    })
                  }
                  disabled={!onDeathSavesChange}
                />

                <DeathSaveRow
                  label="Failure"
                  value={deathSaves.failures}
                  type="failure"
                  onChange={(failures) =>
                    onDeathSavesChange?.({
                      ...deathSaves,
                      failures,
                    })
                  }
                  disabled={!onDeathSavesChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 border-t border-white/[0.06] pt-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <SmallLabel>Senses</SmallLabel>

              <SenseValue label="Perception" value={passivePerception} />

              {typeof passiveInsight === "number" ? (
                <SenseValue label="Insight" value={passiveInsight} />
              ) : null}

              {typeof passiveInvestigation === "number" ? (
                <SenseValue
                  label="Investigation"
                  value={passiveInvestigation}
                />
              ) : null}
            </div>
          </div>

          {progress ? (
            <div className="mt-2 border-t border-white/[0.06] pt-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[7px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                  {nextLevel ? `XP to Level ${nextLevel}` : "XP"}
                </span>

                <span className="text-[8px] font-semibold text-zinc-300">
                  {progress.xp}
                  {progress.nextLevelXp !== null
                    ? ` / ${progress.nextLevelXp}`
                    : ""}
                </span>
              </div>

              {progress.nextLevelXp !== null ? (
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-zinc-400 transition-[width]"
                    style={{
                      width: `${clamp(progress.progressPercent, 0, 100)}%`,
                    }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="rounded-xl border border-white/[0.08] bg-zinc-900/35 p-3 xl:col-span-2">
          <div className="grid gap-3 md:grid-cols-[110px_minmax(0,1fr)]">
            <div>
              <SectionLabel>Proficiencies</SectionLabel>
            </div>

            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              <ProficiencyRow label="Languages" values={languages} />
              <ProficiencyRow label="Armor" values={armorProficiencies} />
              <ProficiencyRow label="Weapons" values={weaponProficiencies} />
              <ProficiencyRow label="Tools" values={toolProficiencies} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const SkillRow = ({ skill }: { skill: CharacterQuickSkill }) => (
  <div className="flex min-h-[23px] min-w-0 items-center gap-1.5 border-b border-white/[0.035] py-0.5">
    <span
      title={
        skill.expertise
          ? "Expertise"
          : skill.proficient
            ? "Proficient"
            : "Not proficient"
      }
      className={`w-3 shrink-0 text-center text-[7px] ${
        skill.proficient || skill.expertise
          ? "text-emerald-400"
          : "text-zinc-700"
      }`}
    >
      {skill.expertise ? "●●" : skill.proficient ? "●" : "○"}
    </span>

    <span className="min-w-0 flex-1 truncate text-[9px] font-medium text-zinc-300">
      {skill.name}
    </span>

    <span className="text-[7px] font-semibold uppercase text-zinc-600">
      {skill.ability}
    </span>

    <span className="w-6 shrink-0 text-right text-[10px] font-bold text-white">
      {formatModifier(skill.bonus)}
    </span>
  </div>
);

type CoreTone =
  | "neutral"
  | "healthy"
  | "warning"
  | "danger"
  | "critical"
  | "ac"
  | "initiative";

const getHpTone = (percentage: number, currentHp: number): CoreTone => {
  if (currentHp <= 0) return "critical";
  if (percentage <= 25) return "danger";
  if (percentage <= 50) return "warning";
  return "healthy";
};

const coreToneClasses: Record<
  CoreTone,
  { background: string; border: string; label: string }
> = {
  neutral: {
    background: "bg-black/20",
    border: "border-transparent",
    label: "text-zinc-400",
  },
  healthy: {
    background: "bg-emerald-500/[0.055]",
    border: "border-emerald-500/10",
    label: "text-emerald-300/80",
  },
  warning: {
    background: "bg-amber-500/[0.075]",
    border: "border-amber-500/15",
    label: "text-amber-300/90",
  },
  danger: {
    background: "bg-rose-500/[0.085]",
    border: "border-rose-500/20",
    label: "text-rose-300",
  },
  critical: {
    background: "bg-red-500/[0.14]",
    border: "border-red-500/30",
    label: "text-red-300",
  },
  ac: {
    background: "bg-sky-500/[0.055]",
    border: "border-sky-500/10",
    label: "text-sky-300/80",
  },
  initiative: {
    background: "bg-amber-500/[0.045]",
    border: "border-amber-500/10",
    label: "text-amber-300/80",
  },
};

const CoreStat = ({
  label,
  value,
  subValue,
  title,
  tone = "neutral",
  className = "",
}: {
  label: string;
  value: string | number;
  subValue?: string;
  title?: string;
  tone?: CoreTone;
  className?: string;
}) => {
  const classes = coreToneClasses[tone];

  return (
    <div
      title={title}
      className={`flex min-h-[52px] flex-col justify-center rounded-lg border px-2 py-1.5 ${classes.background} ${classes.border} ${className}`}
    >
      <span
        className={`text-[7px] font-bold uppercase tracking-[0.08em] ${classes.label}`}
      >
        {label}
      </span>

      <span className="mt-1 text-base font-bold leading-none text-white">
        {value}
      </span>

      {subValue ? (
        <span className="mt-1 text-[7px] font-medium text-zinc-500">
          {subValue}
        </span>
      ) : null}
    </div>
  );
};

const HpStat = ({
  currentHp,
  maxHp,
  hitDiceLabel,
  tone,
  onChange,
}: {
  currentHp: number;
  maxHp: number;
  hitDiceLabel?: string;
  tone: CoreTone;
  onChange?: (value: number) => void | Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(String(currentHp));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(String(currentHp));
  }, [currentHp]);

  const clampHp = (value: number) =>
    Math.max(0, Math.min(maxHp, Math.floor(value)));

  const setHp = async (value: number) => {
    if (!onChange) return;

    const normalized = clampHp(value);
    setDraft(String(normalized));
    setSaving(true);

    try {
      await onChange(normalized);
    } finally {
      setSaving(false);
    }
  };

  const adjustHp = (amount: number) => {
    void setHp(currentHp + amount);
  };

  const submitDraft = () => {
    const parsed = Number(draft);

    if (Number.isNaN(parsed)) {
      setDraft(String(currentHp));
      return;
    }

    void setHp(parsed);
  };

  const classes = coreToneClasses[tone];

  return (
    <div className="col-span-2">
      <button
        type="button"
        disabled={!onChange}
        onClick={() => setOpen(true)}
        className={`flex min-h-[52px] w-full flex-col justify-center rounded-lg border px-2 py-1.5 text-left transition ${classes.background} ${classes.border} ${
          onChange ? "cursor-pointer hover:brightness-110" : "cursor-default"
        }`}
      >
        <span
          className={`text-[7px] font-bold uppercase tracking-[0.08em] ${classes.label}`}
        >
          HP
        </span>

        <span className="mt-1 text-base font-bold leading-none text-white">
          {currentHp}/{maxHp}
        </span>

        {hitDiceLabel ? (
          <span className="mt-1 text-[7px] font-medium text-zinc-500">
            HD {hitDiceLabel}
          </span>
        ) : null}
      </button>

      {open
        ? createPortal(
            <div className="fixed bottom-4 right-4 z-[140] w-[280px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur">
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-3 py-2.5">
                <div>
                  <p className="text-[10px] font-semibold text-white">
                    Hit Points
                  </p>

                  <p className="mt-0.5 text-[8px] text-zinc-600">
                    Current / Max
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <p className="text-lg font-bold text-white">
                    {currentHp}
                    <span className="text-zinc-600">/{maxHp}</span>
                  </p>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close hit point controls"
                    title="Close"
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-sm text-zinc-500 transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="space-y-3 p-3">
                <div className="grid grid-cols-4 gap-1.5">
                  <HpAdjustButton
                    label="−5"
                    onClick={() => adjustHp(-5)}
                    disabled={saving}
                  />

                  <HpAdjustButton
                    label="−1"
                    onClick={() => adjustHp(-1)}
                    disabled={saving}
                  />

                  <HpAdjustButton
                    label="+1"
                    onClick={() => adjustHp(1)}
                    disabled={saving}
                  />

                  <HpAdjustButton
                    label="+5"
                    onClick={() => adjustHp(5)}
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="text-[7px] font-semibold uppercase tracking-[0.1em] text-zinc-600">
                    Set Current HP
                  </label>

                  <div className="mt-1.5 flex gap-2">
                    <input
                      type="number"
                      min={0}
                      max={maxHp}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          submitDraft();
                        }
                      }}
                      className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-black/30 px-2.5 py-2 text-sm font-semibold text-white outline-none focus:border-white/20"
                    />

                    <button
                      type="button"
                      onClick={submitDraft}
                      disabled={saving}
                      className="rounded-lg bg-white px-3 py-2 text-[9px] font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Set
                    </button>
                  </div>
                </div>

                <div className="flex justify-between border-t border-white/[0.06] pt-2 text-[7px] text-zinc-600">
                  <span>Minimum 0</span>
                  <span>Maximum {maxHp}</span>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};

const HpAdjustButton = ({
  label,
  onClick,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="rounded-lg border border-white/[0.08] bg-white/[0.035] py-2 text-[10px] font-bold text-zinc-300 transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
  >
    {label}
  </button>
);

const InteractiveCoreStat = ({
  label,
  value,
  subValue,
  active,
  onClick,
  disabled = false,
  className = "",
}: {
  label: string;
  value: string | number;
  subValue?: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    aria-pressed={active}
    title={
      active
        ? "Click to remove Heroic Inspiration"
        : "Click to grant Heroic Inspiration"
    }
    className={`flex min-h-[52px] flex-col justify-center rounded-lg border px-2 py-1.5 text-left transition ${
      active
        ? "border-sky-500/20 bg-sky-500/[0.08] hover:bg-sky-500/[0.12]"
        : "border-transparent bg-black/20 hover:border-white/10 hover:bg-white/[0.04]"
    } ${disabled ? "cursor-default" : "cursor-pointer"} ${className}`}
  >
    <span
      className={`text-[7px] font-bold uppercase tracking-[0.08em] ${
        active ? "text-sky-300" : "text-zinc-400"
      }`}
    >
      {label}
    </span>

    <span
      className={`mt-1 text-base font-bold leading-none ${
        active ? "text-sky-200" : "text-white"
      }`}
    >
      {value}
    </span>

    {subValue ? (
      <span className="mt-1 text-[7px] font-medium text-zinc-500">
        {subValue}
      </span>
    ) : null}
  </button>
);

const ALL_CONDITIONS = [
  "Blinded",
  "Charmed",
  "Deafened",
  "Frightened",
  "Grappled",
  "Incapacitated",
  "Invisible",
  "Paralyzed",
  "Petrified",
  "Poisoned",
  "Prone",
  "Restrained",
  "Stunned",
  "Unconscious",
  "Exhaustion",
] as const;

const ConditionsControl = ({
  conditions,
  onChange,
}: {
  conditions: string[];
  onChange?: (conditions: string[]) => void | Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleCondition = async (condition: string) => {
    if (!onChange || saving) {
      return;
    }

    const active = conditions.includes(condition);

    const next = active
      ? conditions.filter((value) => value !== condition)
      : [...conditions, condition];

    setSaving(true);

    try {
      await onChange(next);
    } finally {
      setSaving(false);
    }
  };

  const clearConditions = async () => {
    if (!onChange || saving || conditions.length === 0) {
      return;
    }

    setSaving(true);

    try {
      await onChange([]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mt-2 grid grid-cols-[70px_minmax(0,1fr)_auto] items-center gap-2 border-t border-white/[0.06] pt-2">
        <SmallLabel>Conditions</SmallLabel>

        <div className="min-w-0">
          {conditions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {conditions.map((condition) => (
                <StatePill key={condition} tone="danger">
                  {condition}
                </StatePill>
              ))}
            </div>
          ) : (
            <EmptyValue />
          )}
        </div>

        <button
          type="button"
          disabled={!onChange}
          onClick={() => setOpen(true)}
          className={`rounded-md border px-1.5 py-0.5 text-[7px] font-semibold transition ${
            onChange
              ? "border-white/[0.08] bg-white/[0.03] text-zinc-500 hover:border-white/15 hover:bg-white/[0.07] hover:text-zinc-200"
              : "cursor-default border-transparent text-zinc-700"
          }`}
        >
          Edit
        </button>
      </div>

      {open
        ? createPortal(
            <div className="fixed bottom-4 right-4 z-[140] w-[320px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur">
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-3 py-2.5">
                <div>
                  <p className="text-[10px] font-semibold text-white">
                    Conditions
                  </p>

                  <p className="mt-0.5 text-[8px] text-zinc-600">
                    {conditions.length === 0
                      ? "No active conditions"
                      : `${conditions.length} active`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close condition controls"
                  title="Close"
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-sm text-zinc-500 transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-2 gap-1.5">
                  {ALL_CONDITIONS.map((condition) => {
                    const active = conditions.includes(condition);

                    return (
                      <button
                        key={condition}
                        type="button"
                        disabled={!onChange || saving}
                        onClick={() => void toggleCondition(condition)}
                        className={`flex min-h-[32px] items-center justify-between rounded-md border px-2 py-1.5 text-left text-[9px] font-medium transition ${
                          active
                            ? "border-rose-500/25 bg-rose-500/10 text-rose-300"
                            : "border-white/[0.06] bg-white/[0.025] text-zinc-500 hover:border-white/10 hover:bg-white/[0.055] hover:text-zinc-300"
                        } ${saving ? "cursor-wait opacity-60" : ""}`}
                      >
                        <span>{condition}</span>

                        <span
                          className={`h-2 w-2 rounded-full border ${
                            active
                              ? "border-rose-300/60 bg-rose-400/50"
                              : "border-white/15 bg-transparent"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2">
                  <span className="text-[7px] text-zinc-600">
                    Changes save immediately
                  </span>

                  <button
                    type="button"
                    disabled={!onChange || saving || conditions.length === 0}
                    onClick={() => void clearConditions()}
                    className="rounded-md border border-rose-500/15 bg-rose-500/[0.05] px-2 py-1 text-[8px] font-semibold text-rose-300/75 transition hover:bg-rose-500/10 disabled:cursor-default disabled:opacity-30"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

const StateRow = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="mt-2 grid grid-cols-[70px_minmax(0,1fr)] items-center gap-2 border-t border-white/[0.06] pt-2">
    <SmallLabel>{label}</SmallLabel>
    <div className="min-w-0">{children}</div>
  </div>
);

const StatePill = ({
  tone,
  children,
}: {
  tone: "danger" | "defense";
  children: ReactNode;
}) => {
  const classes =
    tone === "danger"
      ? "border-rose-500/20 bg-rose-500/[0.09] text-rose-300"
      : "border-orange-500/20 bg-orange-500/[0.09] text-orange-300";

  return (
    <span
      className={`inline-flex rounded-md border px-1.5 py-0.5 text-[8px] font-medium ${classes}`}
    >
      {children}
    </span>
  );
};

const DeathSaveRow = ({
  label,
  value,
  type,
  onChange,
  disabled = false,
}: {
  label: string;
  value: number;
  type: "success" | "failure";
  onChange: (value: number) => void;
  disabled?: boolean;
}) => {
  const amount = clamp(value, 0, 3);

  const handleCircleClick = (index: number) => {
    if (disabled) return;

    const requested = index + 1;
    const next = requested === amount ? amount - 1 : requested;

    onChange(clamp(next, 0, 3));
  };

  return (
    <div className="flex items-center gap-1">
      <span
        className={`text-[7px] uppercase tracking-[0.06em] ${
          amount > 0
            ? type === "success"
              ? "text-emerald-400"
              : "text-rose-400"
            : "text-zinc-600"
        }`}
      >
        {label}
      </span>

      {[0, 1, 2].map((index) => {
        const active = index < amount;

        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => handleCircleClick(index)}
            aria-label={`${label} death save ${index + 1}`}
            aria-pressed={active}
            className={`h-2.5 w-2.5 rounded-full border transition ${
              disabled ? "cursor-default" : "cursor-pointer hover:scale-110"
            } ${
              active
                ? type === "success"
                  ? "border-emerald-400/70 bg-emerald-400/40"
                  : "border-rose-400/70 bg-rose-400/40"
                : "border-white/20 bg-transparent hover:border-white/40"
            }`}
          />
        );
      })}
    </div>
  );
};

const SenseValue = ({ label, value }: { label: string; value: number }) => (
  <span className="text-[8px] text-zinc-500">
    {label} <strong className="font-semibold text-zinc-300">{value}</strong>
  </span>
);

const ProficiencyRow = ({
  label,
  values,
}: {
  label: string;
  values: string[];
}) => {
  const formatted = values.filter(Boolean).map(formatLabel);

  return (
    <div className="grid min-w-0 grid-cols-[72px_minmax(0,1fr)] items-start gap-2">
      <span className="text-[7px] font-semibold uppercase tracking-[0.09em] text-zinc-600">
        {label}
      </span>

      <span
        title={formatted.length ? formatted.join(" · ") : undefined}
        className="min-w-0 text-[9px] font-medium leading-4 text-zinc-300"
      >
        {formatted.length ? formatted.join(" · ") : "—"}
      </span>
    </div>
  );
};

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <h2 className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
    {children}
  </h2>
);

const SmallLabel = ({ children }: { children: ReactNode }) => (
  <span className="text-[7px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
    {children}
  </span>
);

const EmptyValue = () => <span className="text-[8px] text-zinc-600">None</span>;

export default CharacterQuickStats;
