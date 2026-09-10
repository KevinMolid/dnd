import type { ReactNode } from "react";

import SpellTooltip from "../../../components/SpellTooltip";

import type { Spell } from "../../../rulesets/dnd/dnd2024/types";

/* =========================================================
   TYPES
========================================================= */

type OverviewSkill = {
  id: string;

  name: string;

  ability: string;

  bonus: number;

  proficient?: boolean;

  expertise?: boolean;
};

type OverviewAttack = {
  id: string;

  name: string;

  attackBonus?: number;

  damage?: string;

  detail?: string;
};

type OverviewSpell = Partial<Spell> & {
  id?: string;

  spellId?: string;

  name: string;

  level?: number;

  school?: string;
};

type OverviewFeature = {
  id: string;

  name: string;

  source?: string;

  description?: string;

  resourceLabel?: string;
};

type OverviewAction = {
  id: string;

  name: string;

  description?: string;
};

type OverviewProgress = {
  level: number;

  xp: number;

  nextLevelXp: number | null;

  progressPercent: number;

  xpRemaining?: number;
};

type OverviewSense = {
  id: string;

  label: string;

  value: string | number;
};

type OverviewDefense = {
  id: string;

  label: string;

  value: string;
};

type OverviewSpellSlot = {
  level: number;

  remaining: number;

  max: number;
};

type OverviewDeathSaves = {
  successes: number;

  failures: number;
};

type OverviewDashboardProps = {
  skills: OverviewSkill[];

  attacks?: OverviewAttack[];

  spells?: OverviewSpell[];

  conditions?: string[];

  features?: OverviewFeature[];

  actions?: OverviewAction[];

  bonusActions?: OverviewAction[];

  moneyLabel?: string;

  progress?: OverviewProgress | null;

  heroicInspiration?: boolean;

  deathSaves?: OverviewDeathSaves;

  hitDiceLabel?: string;

  spellSlots?: OverviewSpellSlot[];

  senses?: OverviewSense[];

  defenses?: OverviewDefense[];
};

/* =========================================================
   HELPERS
========================================================= */

const formatModifier = (value: number) =>
  value >= 0 ? `+${value}` : `${value}`;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const OverviewDashboard = ({
  skills,

  attacks = [],

  spells = [],

  conditions = [],

  features = [],

  actions = [],

  bonusActions = [],

  moneyLabel,

  progress,

  heroicInspiration,

  deathSaves,

  hitDiceLabel,

  spellSlots = [],

  senses = [],

  defenses = [],
}: OverviewDashboardProps) => {
  const visibleAttacks = attacks.slice(0, 5);

  const visibleSpells = spells.slice(0, 10);

  const visibleFeatures = features.slice(0, 8);

  const visibleActions = actions.slice(0, 12);

  const visibleBonusActions = bonusActions.slice(0, 8);

  const visibleSpellSlots = spellSlots.filter((slot) => slot.max > 0);

  const hasStatusResources =
    conditions.length > 0 ||
    heroicInspiration !== undefined ||
    Boolean(deathSaves) ||
    Boolean(hitDiceLabel) ||
    Boolean(moneyLabel) ||
    Boolean(progress);

  const hasSensesOrDefenses = senses.length > 0 || defenses.length > 0;

  return (
    <div className="space-y-3">
      {/* =====================================================
          PRIMARY PLAY ROW
          ATTACKS + QUICK SPELLS
      ===================================================== */}

      <div className="grid items-stretch gap-3 lg:grid-cols-2">
        {/* ATTACKS */}

        <CompactSection title="Attacks" className="h-full">
          {visibleAttacks.length > 0 ? (
            <div className="divide-y divide-white/[0.06]">
              {visibleAttacks.map((attack) => (
                <div
                  key={attack.id}
                  className="grid min-h-[42px] grid-cols-[minmax(0,1fr)_48px_minmax(92px,auto)] items-center gap-3 py-2 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">
                      {attack.name}
                    </p>

                    {attack.detail ? (
                      <p className="mt-0.5 truncate text-[9px] text-zinc-500">
                        {attack.detail}
                      </p>
                    ) : null}
                  </div>

                  <div className="text-right">
                    <MetaLabel>Hit</MetaLabel>

                    <p className="mt-0.5 text-sm font-bold text-white">
                      {typeof attack.attackBonus === "number"
                        ? formatModifier(attack.attackBonus)
                        : "—"}
                    </p>
                  </div>

                  <div className="text-right">
                    <MetaLabel>Damage</MetaLabel>

                    <p className="mt-0.5 whitespace-nowrap text-xs font-semibold text-zinc-200">
                      {attack.damage || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyText>No attacks available.</EmptyText>
          )}
        </CompactSection>

        {/* QUICK SPELLS */}

        <CompactSection
          title="Quick Spells"
          className="h-full"
          right={
            visibleSpellSlots.length > 0 ? (
              <SpellSlotSummary slots={visibleSpellSlots} />
            ) : undefined
          }
        >
          {visibleSpells.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {visibleSpells.map((spell, index) => (
                <SpellTooltip
                  key={spell.spellId ?? spell.id ?? `${spell.name}-${index}`}
                  spell={spell}
                >
                  <div className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.07] bg-zinc-900/60 px-2.5 py-1.5 transition hover:border-white/15 hover:bg-zinc-800/80">
                    <span className="whitespace-nowrap text-[11px] font-semibold text-white">
                      {spell.name}
                    </span>

                    <SpellLevelPill level={spell.level} />

                    {spell.concentration ? (
                      <span
                        title="Concentration"
                        className="text-[8px] font-bold uppercase text-fuchsia-400"
                      >
                        C
                      </span>
                    ) : null}

                    {spell.ritual ? (
                      <span
                        title="Ritual"
                        className="text-[8px] font-bold uppercase text-sky-400"
                      >
                        R
                      </span>
                    ) : null}
                  </div>
                </SpellTooltip>
              ))}
            </div>
          ) : (
            <EmptyText>No spells available.</EmptyText>
          )}
        </CompactSection>
      </div>

      {/* =====================================================
          SECONDARY PLAY ROW
          ACTIONS + BONUS ACTIONS + STATUS
      ===================================================== */}

      <div className="grid items-stretch gap-3 lg:grid-cols-3">
        {/* ACTIONS */}

        <CompactSection title="Actions" className="h-full">
          {visibleActions.length > 0 ? (
            <ActionGrid actions={visibleActions} />
          ) : (
            <EmptyText>No actions available.</EmptyText>
          )}
        </CompactSection>

        {/* BONUS ACTIONS */}

        <CompactSection title="Bonus Actions" className="h-full">
          {visibleBonusActions.length > 0 ? (
            <ActionGrid actions={visibleBonusActions} />
          ) : (
            <EmptyText>No bonus actions available.</EmptyText>
          )}
        </CompactSection>

        {/* STATUS + RESOURCES */}

        <CompactSection title="Status & Resources" className="h-full">
          {hasStatusResources ? (
            <div className="space-y-2.5">
              {/* CONDITIONS */}

              <StatusBlock label="Conditions">
                {conditions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {conditions.map((condition) => (
                      <span
                        key={condition}
                        className="rounded-md border border-rose-500/20 bg-rose-500/[0.08] px-2 py-0.5 text-[9px] font-medium text-rose-300"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-zinc-500">None</span>
                )}
              </StatusBlock>

              {/* INSPIRATION */}

              {heroicInspiration !== undefined ? (
                <StatusBlock label="Heroic Inspiration">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border text-[8px] ${
                        heroicInspiration
                          ? "border-amber-400/40 bg-amber-400/15 text-amber-300"
                          : "border-white/15 text-zinc-600"
                      }`}
                    >
                      {heroicInspiration ? "●" : ""}
                    </span>

                    <span
                      className={`text-[10px] font-medium ${
                        heroicInspiration ? "text-amber-300" : "text-zinc-500"
                      }`}
                    >
                      {heroicInspiration ? "Available" : "Not available"}
                    </span>
                  </div>
                </StatusBlock>
              ) : null}

              {/* DEATH SAVES */}

              {deathSaves ? (
                <StatusBlock label="Death Saves">
                  <DeathSaveTracker
                    successes={deathSaves.successes}
                    failures={deathSaves.failures}
                  />
                </StatusBlock>
              ) : null}

              {/* HIT DICE */}

              {hitDiceLabel ? (
                <StatusBlock label="Hit Dice">
                  <span className="text-[11px] font-semibold text-zinc-200">
                    {hitDiceLabel}
                  </span>
                </StatusBlock>
              ) : null}

              {/* MONEY */}

              {moneyLabel ? (
                <StatusBlock label="Money">
                  <span className="text-[11px] font-semibold text-zinc-200">
                    {moneyLabel}
                  </span>
                </StatusBlock>
              ) : null}

              {/* XP */}

              {progress ? (
                <StatusBlock label="Experience">
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-zinc-200">
                        {progress.xp}
                        {progress.nextLevelXp !== null
                          ? ` / ${progress.nextLevelXp}`
                          : ""}
                      </span>

                      <span className="text-[8px] text-zinc-600">
                        Level {progress.level}
                      </span>
                    </div>

                    {progress.nextLevelXp !== null ? (
                      <>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-zinc-400"
                            style={{
                              width: `${clamp(
                                progress.progressPercent,
                                0,
                                100,
                              )}%`,
                            }}
                          />
                        </div>

                        {typeof progress.xpRemaining === "number" ? (
                          <p className="mt-1 text-[8px] text-zinc-600">
                            {progress.xpRemaining} XP to level{" "}
                            {progress.level + 1}
                          </p>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </StatusBlock>
              ) : null}
            </div>
          ) : (
            <EmptyText>No active status or resources.</EmptyText>
          )}
        </CompactSection>
      </div>

      {/* =====================================================
          REFERENCE ROW
          KEY FEATURES + SKILLS
      ===================================================== */}

      <div className="grid items-stretch gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(330px,1fr)]">
        {/* FEATURES */}

        <CompactSection title="Key Features" className="h-full">
          {visibleFeatures.length > 0 ? (
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleFeatures.map((feature) => (
                <div
                  key={feature.id}
                  title={feature.description || undefined}
                  className="rounded-lg bg-zinc-900/55 px-2.5 py-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-white">
                        {feature.name}
                      </p>

                      {feature.source ? (
                        <p className="mt-0.5 truncate text-[8px] uppercase tracking-[0.08em] text-zinc-600">
                          {feature.source}
                        </p>
                      ) : null}
                    </div>

                    {feature.resourceLabel ? (
                      <span className="shrink-0 text-[10px] font-bold text-zinc-300">
                        {feature.resourceLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyText>No key features available.</EmptyText>
          )}
        </CompactSection>

        {/* SKILLS */}

        <CompactSection title="Skills" className="h-full">
          <div className="grid grid-cols-2 gap-x-3">
            {skills.map((skill) => (
              <SkillRow key={skill.id} skill={skill} />
            ))}
          </div>
        </CompactSection>
      </div>

      {/* =====================================================
          SENSES + DEFENSES
      ===================================================== */}

      {hasSensesOrDefenses ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900/45 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Senses & Defenses
            </span>

            {senses.map((sense) => (
              <InlineStat
                key={sense.id}
                label={sense.label}
                value={sense.value}
              />
            ))}

            {defenses.map((defense) => (
              <InlineStat
                key={defense.id}
                label={defense.label}
                value={defense.value}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* =========================================================
   SPELLS
========================================================= */

const SpellLevelPill = ({ level }: { level?: number }) => {
  const label =
    level === 0 ? "CANTRIP" : typeof level === "number" ? `L${level}` : "SPELL";

  return (
    <span className="rounded-full border border-white/10 bg-black/20 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.06em] text-zinc-500">
      {label}
    </span>
  );
};

const SpellSlotSummary = ({ slots }: { slots: OverviewSpellSlot[] }) => (
  <div className="flex flex-wrap justify-end gap-1">
    {slots.map((slot) => (
      <span
        key={slot.level}
        title={`Level ${slot.level} spell slots`}
        className="inline-flex items-center gap-1 rounded-md border border-white/[0.07] bg-black/20 px-1.5 py-0.5 text-[8px]"
      >
        <span className="font-semibold text-zinc-500">L{slot.level}</span>

        <span className="font-bold text-zinc-200">
          {slot.remaining}/{slot.max}
        </span>
      </span>
    ))}
  </div>
);

/* =========================================================
   DEATH SAVES
========================================================= */

const DeathSaveTracker = ({
  successes,
  failures,
}: {
  successes: number;

  failures: number;
}) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
    <DeathSaveRow label="Success" value={successes} type="success" />

    <DeathSaveRow label="Fail" value={failures} type="failure" />
  </div>
);

const DeathSaveRow = ({
  label,
  value,
  type,
}: {
  label: string;

  value: number;

  type: "success" | "failure";
}) => {
  const safeValue = clamp(value, 0, 3);

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[8px] text-zinc-500">{label}</span>

      <div className="flex gap-1">
        {[0, 1, 2].map((index) => {
          const active = index < safeValue;

          const activeClass =
            type === "success"
              ? "border-emerald-400/50 bg-emerald-400/20"
              : "border-rose-400/50 bg-rose-400/20";

          return (
            <span
              key={index}
              className={`h-2.5 w-2.5 rounded-full border ${
                active ? activeClass : "border-white/15 bg-transparent"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================
   SKILLS
========================================================= */

const SkillRow = ({ skill }: { skill: OverviewSkill }) => (
  <div className="flex min-h-[25px] min-w-0 items-center gap-1.5 border-b border-white/[0.035] px-0.5 py-1 last:border-b-0">
    <div
      className="flex w-3.5 shrink-0 justify-center"
      title={
        skill.expertise
          ? "Expertise"
          : skill.proficient
            ? "Proficient"
            : "Not proficient"
      }
    >
      {skill.expertise ? (
        <span className="text-[8px] font-bold tracking-[-2px] text-emerald-400">
          ●●
        </span>
      ) : skill.proficient ? (
        <span className="text-[8px] text-emerald-400">●</span>
      ) : (
        <span className="text-[8px] text-zinc-700">○</span>
      )}
    </div>

    <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-zinc-300">
      {skill.name}
    </span>

    <span className="w-7 shrink-0 text-right text-[11px] font-bold text-white">
      {formatModifier(skill.bonus)}
    </span>
  </div>
);

/* =========================================================
   ACTIONS
========================================================= */

const ActionGrid = ({ actions }: { actions: OverviewAction[] }) => (
  <div className="grid grid-cols-2 gap-1.5">
    {actions.map((action) => (
      <div
        key={action.id}
        title={action.description || undefined}
        className="rounded-lg bg-zinc-900/55 px-2.5 py-2"
      >
        <p className="truncate text-[11px] font-semibold text-zinc-200">
          {action.name}
        </p>
      </div>
    ))}
  </div>
);

/* =========================================================
   STATUS HELPERS
========================================================= */

const StatusBlock = ({
  label,
  children,
}: {
  label: string;

  children: ReactNode;
}) => (
  <div className="grid grid-cols-[100px_1fr] items-start gap-3 border-b border-white/[0.06] pb-2.5 last:border-b-0 last:pb-0">
    <MetaLabel>{label}</MetaLabel>

    <div className="min-w-0">{children}</div>
  </div>
);

/* =========================================================
   GENERIC UI
========================================================= */

const CompactSection = ({
  title,
  children,
  className = "",
  right,
}: {
  title: string;

  children: ReactNode;

  className?: string;

  right?: ReactNode;
}) => (
  <section
    className={`rounded-xl border border-white/10 bg-zinc-900/45 p-3.5 ${className}`}
  >
    <div className="mb-3 flex min-h-[20px] items-center justify-between gap-3">
      <h2 className="text-base font-semibold leading-5 text-white">{title}</h2>

      {right ? <div className="min-w-0">{right}</div> : null}
    </div>

    {children}
  </section>
);

const MetaLabel = ({ children }: { children: ReactNode }) => (
  <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
    {children}
  </p>
);

const InlineStat = ({
  label,
  value,
}: {
  label: string;

  value: string | number;
}) => (
  <div className="flex items-baseline gap-1.5 text-[10px]">
    <span className="text-zinc-500">{label}</span>

    <span className="font-semibold text-zinc-200">{value}</span>
  </div>
);

const EmptyText = ({ children }: { children: ReactNode }) => (
  <p className="text-[10px] leading-4 text-zinc-600">{children}</p>
);

export default OverviewDashboard;
