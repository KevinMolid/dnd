type CharacterProfilePanelProps = {
  age?: string | number | null;
  height?: string | null;
  weight?: string | null;
  eyes?: string | null;
  skin?: string | null;
  hair?: string | null;
  alignment?: string | null;

  appearance?: string | null;
  connections?: string | null;
  backstory?: string | null;

  personalityTraits?: string | null;
  ideals?: string | null;
  bonds?: string | null;
  flaws?: string | null;
};

const CharacterProfilePanel = ({
  age,
  height,
  weight,
  eyes,
  skin,
  hair,
  alignment,
  appearance,
  connections,
  backstory,
  personalityTraits,
  ideals,
  bonds,
  flaws,
}: CharacterProfilePanelProps) => {
  const hasPersonality =
    Boolean(personalityTraits) ||
    Boolean(ideals) ||
    Boolean(bonds) ||
    Boolean(flaws);

  return (
    <div className="divide-y divide-white/[0.07]">
      <section className="px-4 py-4">
        <SectionLabel>Character Details</SectionLabel>

        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
          <Detail label="Age" value={age} />
          <Detail label="Height" value={height} />
          <Detail label="Weight" value={weight} />
          <Detail label="Alignment" value={alignment} />

          <Detail label="Eyes" value={eyes} />
          <Detail label="Skin" value={skin} />
          <Detail label="Hair" value={hair} />
        </div>
      </section>

      <ProfileTextSection
        title="Appearance"
        value={appearance}
        emptyText="No appearance description."
      />

      <ProfileTextSection
        title="Connections"
        value={connections}
        emptyText="No connections recorded."
      />

      <ProfileTextSection
        title="Backstory"
        value={backstory}
        emptyText="No backstory recorded."
      />

      {hasPersonality ? (
        <section className="px-4 py-4">
          <SectionLabel>Personality</SectionLabel>

          <div className="mt-4 grid gap-x-6 gap-y-5 md:grid-cols-2">
            <PersonalityField label="Traits" value={personalityTraits} />
            <PersonalityField label="Ideals" value={ideals} />
            <PersonalityField label="Bonds" value={bonds} />
            <PersonalityField label="Flaws" value={flaws} />
          </div>
        </section>
      ) : null}
    </div>
  );
};

const Detail = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="min-w-0">
    <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-zinc-500">
      {label}
    </p>

    <p className="mt-1.5 truncate text-sm font-medium text-zinc-100">
      {value === undefined || value === null || value === "" ? "—" : value}
    </p>
  </div>
);

const ProfileTextSection = ({
  title,
  value,
  emptyText,
}: {
  title: string;
  value?: string | null;
  emptyText: string;
}) => (
  <section className="px-4 py-4">
    <SectionLabel>{title}</SectionLabel>

    {value ? (
      <p className="mt-2.5 whitespace-pre-wrap text-xs leading-6 text-zinc-200">
        {value}
      </p>
    ) : (
      <p className="mt-2.5 text-[11px] text-zinc-500">{emptyText}</p>
    )}
  </section>
);

const PersonalityField = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div>
    <p className="text-[11px] font-semibold text-zinc-400">{label}</p>

    <p className="mt-1.5 whitespace-pre-wrap text-xs leading-6 text-zinc-200">
      {value || "—"}
    </p>
  </div>
);

const SectionLabel = ({ children }: { children: string }) => (
  <h2 className="text-[10px] font-semibold uppercase tracking-[0.13em] text-zinc-400">
    {children}
  </h2>
);

export default CharacterProfilePanel;
