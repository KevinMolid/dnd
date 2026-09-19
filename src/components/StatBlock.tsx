import Avatar from "./Avatar";
import H3 from "./H3";
import H4 from "./H4";

import type {
  MonsterDefinition,
  MonsterSpeed,
  MonsterSkills,
  MonsterSenses,
  MonsterSavingThrows,
  MonsterTextEntry,
} from "../features/monsters/catalog/monsterTypes";

type QuickRow = {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "accent";
};

type PlayerAttack = {
  name: string;
  attackBonus: string;
  damage: string;
  notes?: string;
};

type PlayerSpellcasting = {
  ability?: string;
  saveDc?: number;
  attackBonus?: string;
  slots?: Array<{
    level: number;
    count: number;
  }>;
  highlights?: string[];
};

export type PlayerQuickView = {
  subtitle?: string;
  armorClass: number | string;
  currentHp: number;
  maxHp: number;
  speed?: string | number;
  initiativeBonus?: string;
  passivePerception?: number | string;
  proficiencyBonus?: string;
  conditions?: string[];
  savingThrows?: QuickRow[];
  skills?: QuickRow[];
  attacks?: PlayerAttack[];
  features?: string[];
  spellcasting?: PlayerSpellcasting;
};

type SharedStatBlockProps = {
  name: string;
  img?: string;
  isLocked?: boolean;
  onToggleLock?: () => void;
  onAddToEncounter?: () => void;
};

export type MonsterStatBlockProps = MonsterDefinition &
  SharedStatBlockProps & {
    variant?: "monster";
  };

export type PlayerStatBlockProps = SharedStatBlockProps & {
  variant: "player";
  quickView: PlayerQuickView;
};

export type StatBlockProps = MonsterStatBlockProps | PlayerStatBlockProps;

const getModifier = (stat: number) => {
  const mod = Math.floor((stat - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

const getRowToneClass = (tone?: QuickRow["tone"]) => {
  if (tone === "good") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }

  if (tone === "accent") {
    return "border-red-500/20 bg-red-500/10 text-red-300";
  }

  return "border-white/10 bg-zinc-900/70 text-zinc-200";
};

const formatAbilityLabel = (key: keyof MonsterDefinition["stats"]) =>
  key.toUpperCase();

const HeaderActions = ({
  isLocked = false,
  onToggleLock,
  onAddToEncounter,
}: Pick<
  SharedStatBlockProps,
  "isLocked" | "onToggleLock" | "onAddToEncounter"
>) => {
  return (
    <div className="flex items-center gap-1.5">
      {onAddToEncounter && (
        <button
          type="button"
          onClick={onAddToEncounter}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 transition hover:bg-emerald-500/20"
          title="Add to encounter"
        >
          <i className="fa-solid fa-plus text-xs"></i>
        </button>
      )}

      {onToggleLock && (
        <button
          type="button"
          onClick={onToggleLock}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10"
          title={isLocked ? "Unlock" : "Lock"}
        >
          <i
            className={`fa-solid ${isLocked ? "fa-lock" : "fa-lock-open"} text-xs`}
          ></i>
        </button>
      )}
    </div>
  );
};

const StatPill = ({
  label,
  value,
  subValue,
  accent = false,
  compact = false,
}: {
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  accent?: boolean;
  compact?: boolean;
}) => {
  return (
    <div
      className={`rounded-xl border ${compact ? "px-2.5 py-2" : "p-2.5"} ${
        accent
          ? "border-white/20 bg-black/40"
          : "border-white/10 bg-zinc-900/70"
      }`}
    >
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p
        className={`${compact ? "mt-1 text-sm" : "mt-1.5 text-base"} font-semibold leading-tight text-white`}
      >
        {value}
      </p>
      {subValue ? (
        <p className="mt-1 text-[11px] leading-4 text-zinc-400">{subValue}</p>
      ) : null}
    </div>
  );
};

const Section = ({
  title,
  children,
  accent = false,
  compact = false,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
  compact?: boolean;
}) => {
  return (
    <section
      className={`rounded-xl border border-white/10 bg-zinc-900/60 ${
        compact ? "p-2.5" : "p-3"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <H4
          className={`${accent ? "text-emerald-300" : "text-amber-300"} mb-0 text-sm`}
        >
          {title}
        </H4>
      </div>
      {children}
    </section>
  );
};

const Tag = ({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "danger" | "accent" | "good" | "magic";
}) => {
  const classes =
    tone === "danger"
      ? "border-red-500/20 bg-red-500/10 text-red-300"
      : tone === "accent"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
        : tone === "good"
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          : tone === "magic"
            ? "border-violet-500/20 bg-violet-500/10 text-violet-300"
            : "border-white/10 bg-white/5 text-zinc-300";

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${classes}`}
    >
      {children}
    </span>
  );
};

const Divider = ({ compact = false }: { compact?: boolean }) => (
  <div className={`${compact ? "my-2.5" : "my-3"} h-px bg-white/10`} />
);

const Header = ({
  name,
  subtitle,
  img,
  onAddToEncounter,
  onToggleLock,
  isLocked,
  accent,
}: {
  name: string;
  subtitle?: string;
  img?: string;
  onAddToEncounter?: () => void;
  onToggleLock?: () => void;
  isLocked?: boolean;
  accent: "monster" | "player";
}) => {
  return (
    <div
      className={`bg-gradient-to-r ${
        accent === "player"
          ? "from-emerald-500/10 via-white/5 to-white/5"
          : "from-red-500/10 via-white/5 to-white/5"
      } p-2.5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex items-center gap-2.5">
          <Avatar name={name} src={img} size="lg" />

          <div className="min-w-0">
            <H3 className="mb-0 truncate text-base text-white">{name}</H3>
            {subtitle && (
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <HeaderActions
          isLocked={isLocked}
          onToggleLock={onToggleLock}
          onAddToEncounter={onAddToEncounter}
        />
      </div>
    </div>
  );
};

const EntryList = ({ entries }: { entries: MonsterTextEntry[] }) => {
  return (
    <div className="space-y-2 text-sm leading-5 text-zinc-300">
      {entries.map((entry) => (
        <p key={`${entry.name}-${entry.text}`}>
          <span className="font-semibold text-white">{entry.name}.</span>{" "}
          {entry.text}
        </p>
      ))}
    </div>
  );
};

const formatSignedNumber = (value: number) =>
  value >= 0 ? `+${value}` : `${value}`;

const formatSpeed = (speed: MonsterSpeed) => {
  const parts: string[] = [];

  if (speed.walk !== undefined) {
    parts.push(`${speed.walk} ft.`);
  }

  if (speed.burrow !== undefined) {
    parts.push(`Burrow ${speed.burrow} ft.`);
  }

  if (speed.climb !== undefined) {
    parts.push(`Climb ${speed.climb} ft.`);
  }

  if (speed.fly !== undefined) {
    parts.push(`Fly ${speed.fly} ft.${speed.hover ? " (hover)" : ""}`);
  }

  if (speed.swim !== undefined) {
    parts.push(`Swim ${speed.swim} ft.`);
  }

  if (speed.notes) {
    parts.push(speed.notes);
  }

  return parts.join(", ") || "—";
};

const formatSkills = (skills?: MonsterSkills) => {
  if (!skills) return undefined;

  const entries = Object.entries(skills);

  if (entries.length === 0) return undefined;

  return entries
    .map(([skill, bonus]) => `${skill} ${formatSignedNumber(bonus)}`)
    .join(", ");
};

const formatSavingThrows = (savingThrows?: MonsterSavingThrows) => {
  if (!savingThrows) return undefined;

  const labels = {
    str: "Str",
    dex: "Dex",
    con: "Con",
    int: "Int",
    wis: "Wis",
    cha: "Cha",
  } as const;

  return Object.entries(savingThrows)
    .map(
      ([ability, bonus]) =>
        `${labels[ability as keyof typeof labels]} ${formatSignedNumber(
          bonus as number,
        )}`,
    )
    .join(", ");
};

const formatSenses = (senses?: MonsterSenses) => {
  if (!senses) return undefined;

  const parts: string[] = [];

  if (senses.blindsight !== undefined) {
    parts.push(`Blindsight ${senses.blindsight} ft.`);
  }

  if (senses.darkvision !== undefined) {
    parts.push(`Darkvision ${senses.darkvision} ft.`);
  }

  if (senses.tremorsense !== undefined) {
    parts.push(`Tremorsense ${senses.tremorsense} ft.`);
  }

  if (senses.truesight !== undefined) {
    parts.push(`Truesight ${senses.truesight} ft.`);
  }

  if (senses.passivePerception !== undefined) {
    parts.push(`Passive Perception ${senses.passivePerception}`);
  }

  if (senses.notes) {
    parts.push(senses.notes);
  }

  return parts.join(", ") || undefined;
};

const formatList = (values?: string[]) => {
  if (!values || values.length === 0) return undefined;
  return values.join(", ");
};

const StatBlock = (props: StatBlockProps) => {
  if (props.variant === "player") {
    const {
      name,
      img,
      quickView,
      isLocked = false,
      onToggleLock,
      onAddToEncounter,
    } = props;

    return (
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg">
        <Header
          name={name}
          subtitle={quickView.subtitle}
          img={img}
          onAddToEncounter={onAddToEncounter}
          onToggleLock={onToggleLock}
          isLocked={isLocked}
          accent="player"
        />

        <div className="p-2.5">
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
            <StatPill label="AC" value={quickView.armorClass} compact />
            <StatPill
              label="HP"
              value={`${quickView.currentHp}/${quickView.maxHp}`}
              accent
              compact
            />

            {quickView.speed !== undefined && (
              <StatPill label="Speed" value={quickView.speed} compact />
            )}

            {quickView.initiativeBonus !== undefined && (
              <StatPill
                label="Init"
                value={quickView.initiativeBonus}
                compact
              />
            )}

            {quickView.passivePerception !== undefined && (
              <StatPill
                label="Passive"
                value={quickView.passivePerception}
                compact
              />
            )}

            {quickView.proficiencyBonus !== undefined && (
              <StatPill
                label="Prof"
                value={quickView.proficiencyBonus}
                compact
              />
            )}
          </div>

          {quickView.conditions && quickView.conditions.length > 0 && (
            <>
              <Divider compact />
              <Section title="Conditions" accent compact>
                <div className="flex flex-wrap gap-1.5">
                  {quickView.conditions.map((condition) => (
                    <Tag key={condition} tone="danger">
                      {condition}
                    </Tag>
                  ))}
                </div>
              </Section>
            </>
          )}

          {quickView.attacks && quickView.attacks.length > 0 && (
            <>
              <Divider compact />
              <Section title="Attacks" compact>
                <div className="space-y-2">
                  {quickView.attacks.map((attack) => (
                    <div
                      key={`${attack.name}-${attack.attackBonus}-${attack.damage}`}
                      className="rounded-xl border border-white/10 bg-zinc-900/70 p-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">
                            {attack.name}
                          </p>
                          {attack.notes && (
                            <p className="mt-0.5 text-[10px] leading-4 text-zinc-500">
                              {attack.notes}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-zinc-200">
                            {attack.attackBonus}
                          </p>
                          <p className="mt-0.5 text-[10px] leading-4 text-zinc-400">
                            {attack.damage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {quickView.features && quickView.features.length > 0 && (
            <>
              <Divider compact />
              <Section title="Combat Features" compact>
                <div className="flex flex-wrap gap-1.5">
                  {quickView.features.map((feature) => (
                    <Tag key={feature} tone="accent">
                      {feature}
                    </Tag>
                  ))}
                </div>
              </Section>
            </>
          )}

          {quickView.savingThrows && quickView.savingThrows.length > 0 && (
            <>
              <Divider compact />
              <Section title="Saving Throws" compact>
                <div className="grid grid-cols-2 gap-2">
                  {quickView.savingThrows.map((row) => (
                    <div
                      key={`${row.label}-${row.value}`}
                      className={`rounded-xl border px-2.5 py-2 ${getRowToneClass(
                        row.tone,
                      )}`}
                    >
                      <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {row.label}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold">
                        {row.value}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {quickView.skills && quickView.skills.length > 0 && (
            <>
              <Divider compact />
              <Section title="Skills" compact>
                <div className="grid grid-cols-2 gap-2">
                  {quickView.skills.map((row) => (
                    <div
                      key={`${row.label}-${row.value}`}
                      className={`rounded-xl border px-2.5 py-2 ${getRowToneClass(
                        row.tone,
                      )}`}
                    >
                      <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {row.label}
                      </div>
                      <div className="mt-0.5 text-sm font-semibold">
                        {row.value}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {quickView.spellcasting && (
            <>
              <Divider compact />
              <Section title="Spellcasting" compact>
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    {quickView.spellcasting.ability && (
                      <StatPill
                        label="Ability"
                        value={quickView.spellcasting.ability}
                        compact
                      />
                    )}

                    {quickView.spellcasting.saveDc !== undefined && (
                      <StatPill
                        label="Save DC"
                        value={quickView.spellcasting.saveDc}
                        compact
                      />
                    )}

                    {quickView.spellcasting.attackBonus && (
                      <StatPill
                        label="Spell Atk"
                        value={quickView.spellcasting.attackBonus}
                        compact
                      />
                    )}
                  </div>

                  {quickView.spellcasting.slots &&
                    quickView.spellcasting.slots.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {quickView.spellcasting.slots.map((slot) => (
                          <Tag key={`slot-${slot.level}`} tone="neutral">
                            L{slot.level}: {slot.count}
                          </Tag>
                        ))}
                      </div>
                    )}

                  {quickView.spellcasting.highlights &&
                    quickView.spellcasting.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {quickView.spellcasting.highlights.map((spell) => (
                          <Tag key={spell} tone="magic">
                            {spell}
                          </Tag>
                        ))}
                      </div>
                    )}
                </div>
              </Section>
            </>
          )}
        </div>
      </div>
    );
  }

  const {
    name,
    type,
    subtype,
    size,
    alignment,
    img,

    armorClass,
    armorClassNotes,
    hp,
    hitDice,
    initiative,
    speed,

    stats,
    savingThrows,
    skills,

    damageVulnerabilities,
    damageResistances,
    damageImmunities,
    conditionImmunities,

    senses,
    languages,

    challengeRating,
    xp,
    proficiencyBonus,

    gear,
    habitat,
    treasure,

    traits,
    actions,
    bonusActions,
    reactions,
    legendaryActions,
    lairActions,

    isLocked = false,
    onToggleLock,
    onAddToEncounter,
  } = props;

  const formattedSpeed = formatSpeed(speed);
  const formattedSkills = formatSkills(skills);
  const formattedSavingThrows = formatSavingThrows(savingThrows);
  const formattedSenses = formatSenses(senses);
  const formattedLanguages = formatList(languages);

  const subtitle = [size, subtype ? `${type} (${subtype})` : type, alignment]
    .filter(Boolean)
    .join(" • ");

  const abilityOrder: Array<keyof MonsterDefinition["stats"]> = [
    "str",
    "dex",
    "con",
    "int",
    "wis",
    "cha",
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg">
      <Header
        name={name}
        subtitle={subtitle}
        img={img}
        onAddToEncounter={onAddToEncounter}
        onToggleLock={onToggleLock}
        isLocked={isLocked}
        accent="monster"
      />

      <div className="p-2.5">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <StatPill
            label="AC"
            value={armorClass}
            subValue={armorClassNotes}
            compact
          />
          <StatPill label="HP" value={hp} subValue={hitDice} accent compact />
          <StatPill label="Speed" value={formattedSpeed} compact />
          {challengeRating && (
            <StatPill
              label="CR"
              value={challengeRating}
              subValue={xp !== undefined ? `${xp} XP` : undefined}
              compact
            />
          )}
        </div>

        <Divider compact />

        <Section title="Ability Scores" compact>
          <div className="grid grid-cols-3 gap-2 xl:grid-cols-6">
            {abilityOrder.map((key) => {
              const value = stats[key];

              return (
                <div
                  key={key}
                  className="rounded-xl border border-white/10 bg-zinc-900/70 p-2 text-center"
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {formatAbilityLabel(key)}
                  </p>
                  <p className="mt-1 text-base font-bold leading-tight text-white">
                    {value}
                  </p>
                  <p className="mt-0.5 text-[10px] text-zinc-400">
                    {getModifier(value)}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>

        <Divider compact />

        <Section title="Details" compact>
          <div className="space-y-1.5 text-sm leading-5 text-zinc-300">
            {initiative && (
              <p>
                <span className="font-semibold text-white">Initiative:</span>{" "}
                {formatSignedNumber(initiative.modifier)}
                {initiative.score !== undefined && ` (${initiative.score})`}
              </p>
            )}

            {proficiencyBonus !== undefined && (
              <p>
                <span className="font-semibold text-white">
                  Proficiency Bonus:
                </span>{" "}
                {formatSignedNumber(proficiencyBonus)}
              </p>
            )}

            {formattedSavingThrows && (
              <p>
                <span className="font-semibold text-white">Saving Throws:</span>{" "}
                {formattedSavingThrows}
              </p>
            )}

            {formattedSkills && (
              <p>
                <span className="font-semibold text-white">Skills:</span>{" "}
                {formattedSkills}
              </p>
            )}

            {damageVulnerabilities?.length ? (
              <p>
                <span className="font-semibold text-white">
                  Vulnerabilities:
                </span>{" "}
                {damageVulnerabilities.join(", ")}
              </p>
            ) : null}

            {damageResistances?.length ? (
              <p>
                <span className="font-semibold text-white">Resistances:</span>{" "}
                {damageResistances.join(", ")}
              </p>
            ) : null}

            {damageImmunities?.length ? (
              <p>
                <span className="font-semibold text-white">
                  Damage Immunities:
                </span>{" "}
                {damageImmunities.join(", ")}
              </p>
            ) : null}

            {conditionImmunities?.length ? (
              <p>
                <span className="font-semibold text-white">
                  Condition Immunities:
                </span>{" "}
                {conditionImmunities.join(", ")}
              </p>
            ) : null}

            {formattedSenses && (
              <p>
                <span className="font-semibold text-white">Senses:</span>{" "}
                {formattedSenses}
              </p>
            )}

            {formattedLanguages && (
              <p>
                <span className="font-semibold text-white">Languages:</span>{" "}
                {formattedLanguages}
              </p>
            )}

            {gear?.length ? (
              <p>
                <span className="font-semibold text-white">Gear:</span>{" "}
                {gear.join(", ")}
              </p>
            ) : null}

            {habitat?.length ? (
              <p>
                <span className="font-semibold text-white">Habitat:</span>{" "}
                {habitat.join(", ")}
              </p>
            ) : null}

            {treasure?.length ? (
              <p>
                <span className="font-semibold text-white">Treasure:</span>{" "}
                {treasure.join(", ")}
              </p>
            ) : null}
          </div>
        </Section>

        {traits && traits.length > 0 && (
          <>
            <Divider compact />
            <Section title="Traits" compact>
              <EntryList entries={traits} />
            </Section>
          </>
        )}

        {actions && actions.length > 0 && (
          <>
            <Divider compact />
            <Section title="Actions" compact>
              <EntryList entries={actions} />
            </Section>
          </>
        )}

        {bonusActions && bonusActions.length > 0 && (
          <>
            <Divider compact />
            <Section title="Bonus Actions" compact>
              <EntryList entries={bonusActions} />
            </Section>
          </>
        )}

        {reactions && reactions.length > 0 && (
          <>
            <Divider compact />
            <Section title="Reactions" compact>
              <EntryList entries={reactions} />
            </Section>
          </>
        )}

        {legendaryActions && legendaryActions.length > 0 && (
          <>
            <Divider compact />
            <Section title="Legendary Actions" compact>
              <EntryList entries={legendaryActions} />
            </Section>
          </>
        )}

        {lairActions && lairActions.length > 0 && (
          <>
            <Divider compact />
            <Section title="Lair Actions" compact>
              <EntryList entries={lairActions} />
            </Section>
          </>
        )}
      </div>
    </div>
  );
};

export default StatBlock;
