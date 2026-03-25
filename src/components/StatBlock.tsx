import Avatar from "./Avatar";
import H3 from "./H3";
import H4 from "./H4";

type Stats = {
  Str: number;
  Dex: number;
  Con: number;
  Int: number;
  Wis: number;
  Cha: number;
};

export type MonsterType =
  | "Aberration"
  | "Beast"
  | "Celestial"
  | "Construct"
  | "Dragon"
  | "Elemental"
  | "Fey"
  | "Fiend"
  | "Giant"
  | "Humanoid"
  | "Monstrosity"
  | "Ooze"
  | "Plant"
  | "Undead";

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

type MonsterStatBlockProps = SharedStatBlockProps & {
  variant?: "monster";
  type: MonsterType;
  description?: string;
  armorClass: number | string;
  armorClassNotes?: string;
  HP: number;
  speed: string | number;
  stats: Stats;
  skills?: string;
  senses?: string;
  language?: string;
  challengeRating?: string;
  xp?: number | string;
  traits?: React.ReactNode;
  actions?: React.ReactNode;
  bonusActions?: React.ReactNode;
  reactions?: React.ReactNode;
};

type PlayerStatBlockProps = SharedStatBlockProps & {
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
    description,
    img,
    armorClass,
    armorClassNotes,
    HP,
    speed,
    stats,
    skills,
    senses,
    language,
    challengeRating,
    xp,
    traits,
    actions,
    bonusActions,
    reactions,
    isLocked = false,
    onToggleLock,
    onAddToEncounter,
  } = props;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg">
      <Header
        name={name}
        subtitle={`${type}${description ? ` • ${description}` : ""}`}
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
          <StatPill label="HP" value={HP} accent compact />
          <StatPill label="Speed" value={speed} compact />
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
            {Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className="rounded-xl border border-white/10 bg-zinc-900/70 p-2 text-center"
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {key}
                </p>
                <p className="mt-1 text-base font-bold leading-tight text-white">
                  {value}
                </p>
                <p className="mt-0.5 text-[10px] text-zinc-400">
                  {getModifier(value)}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {(skills || senses || language) && (
          <>
            <Divider compact />
            <Section title="Details" compact>
              <div className="space-y-1.5 text-sm leading-5 text-zinc-300">
                {skills && (
                  <p>
                    <span className="font-semibold text-white">Skills:</span>{" "}
                    {skills}
                  </p>
                )}

                {senses && (
                  <p>
                    <span className="font-semibold text-white">Senses:</span>{" "}
                    {senses}
                  </p>
                )}

                {language && (
                  <p>
                    <span className="font-semibold text-white">Languages:</span>{" "}
                    {language}
                  </p>
                )}
              </div>
            </Section>
          </>
        )}

        {traits && (
          <>
            <Divider compact />
            <Section title="Traits" compact>
              <div className="space-y-1 text-sm leading-5 text-zinc-300">
                {traits}
              </div>
            </Section>
          </>
        )}

        {actions && (
          <>
            <Divider compact />
            <Section title="Actions" compact>
              <div className="space-y-1 text-sm leading-5 text-zinc-300">
                {actions}
              </div>
            </Section>
          </>
        )}

        {bonusActions && (
          <>
            <Divider compact />
            <Section title="Bonus Actions" compact>
              <div className="space-y-1 text-sm leading-5 text-zinc-300">
                {bonusActions}
              </div>
            </Section>
          </>
        )}

        {reactions && (
          <>
            <Divider compact />
            <Section title="Reactions" compact>
              <div className="space-y-1 text-sm leading-5 text-zinc-300">
                {reactions}
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
};

export default StatBlock;
