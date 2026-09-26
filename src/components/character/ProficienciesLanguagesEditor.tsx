const armorProficiencyPresets = [
  { id: "light-armor", label: "Light Armor" },
  { id: "medium-armor", label: "Medium Armor" },
  { id: "heavy-armor", label: "Heavy Armor" },
  { id: "shields", label: "Shields" },
] as const;

const weaponProficiencyPresets = [
  { id: "simple-weapons", label: "Simple Weapons" },
  { id: "martial-weapons", label: "Martial Weapons" },
  { id: "unarmed-strikes", label: "Unarmed Strikes" },
  {
    id: "martial-finesse-or-light",
    label: "Martial Weapons with Finesse or Light",
  },
] as const;

export type ArmorProficiencyPresetId =
  (typeof armorProficiencyPresets)[number]["id"];

export type WeaponProficiencyPresetId =
  (typeof weaponProficiencyPresets)[number]["id"];

export const splitProficiencyText = (value: string) =>
  value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);

export const joinProficiencyText = (values?: string[]) =>
  (values ?? []).join("\n");

const normalizeProficiency = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getSelectedProficiencyPresetIds = <TId extends string>(
  values: string[] | undefined,
  presets: readonly { id: TId; label: string }[],
): TId[] => {
  const normalizedValues = new Set(
    (values ?? []).map((value) => normalizeProficiency(value)),
  );

  return presets
    .filter(
      (preset) =>
        normalizedValues.has(normalizeProficiency(preset.id)) ||
        normalizedValues.has(normalizeProficiency(preset.label)),
    )
    .map((preset) => preset.id);
};

export const getCustomProficiencyValues = <TId extends string>(
  values: string[] | undefined,
  presets: readonly { id: TId; label: string }[],
) => {
  const presetAliases = new Set(
    presets.flatMap((preset) => [
      normalizeProficiency(preset.id),
      normalizeProficiency(preset.label),
    ]),
  );

  return (values ?? []).filter(
    (value) => !presetAliases.has(normalizeProficiency(value)),
  );
};

export const mergePresetAndCustomProficiencies = (
  presetIds: string[],
  customText: string,
) => {
  const seen = new Set<string>();

  return [...presetIds, ...splitProficiencyText(customText)].filter((value) => {
    const key = normalizeProficiency(value);

    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

type Props = {
  armorPresetIds: ArmorProficiencyPresetId[];
  weaponPresetIds: WeaponProficiencyPresetId[];
  armorText: string;
  weaponText: string;
  toolText: string;
  languageText: string;
  onArmorPresetToggle: (id: ArmorProficiencyPresetId) => void;
  onWeaponPresetToggle: (id: WeaponProficiencyPresetId) => void;
  onArmorTextChange: (value: string) => void;
  onWeaponTextChange: (value: string) => void;
  onToolTextChange: (value: string) => void;
  onLanguageTextChange: (value: string) => void;
};

const ProficienciesLanguagesEditor = ({
  armorPresetIds,
  weaponPresetIds,
  armorText,
  weaponText,
  toolText,
  languageText,
  onArmorPresetToggle,
  onWeaponPresetToggle,
  onArmorTextChange,
  onWeaponTextChange,
  onToolTextChange,
  onLanguageTextChange,
}: Props) => (
  <div>
    <p className="mb-3 text-sm text-zinc-500">
      Choose common proficiencies below, and use the text fields for any
      additional or homebrew proficiencies. Separate custom entries with commas
      or new lines.
    </p>

    <div
      className="grid gap-2.5"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
      }}
    >
      <div className="rounded-lg border border-white/10 bg-zinc-900/45 p-2.5">
        <p className="text-sm font-medium text-zinc-200">Armor Proficiencies</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {armorProficiencyPresets.map((preset) => {
            const selected = armorPresetIds.includes(preset.id);

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onArmorPresetToggle(preset.id)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  selected
                    ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-200"
                    : "border-white/10 bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {selected ? "✓ " : ""}
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3">
          <Textarea
            label="Additional armor proficiencies"
            value={armorText}
            onChange={onArmorTextChange}
            rows={3}
          />
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-zinc-900/45 p-2.5">
        <p className="text-sm font-medium text-zinc-200">
          Weapon Proficiencies
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {weaponProficiencyPresets.map((preset) => {
            const selected = weaponPresetIds.includes(preset.id);

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onWeaponPresetToggle(preset.id)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  selected
                    ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-200"
                    : "border-white/10 bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {selected ? "✓ " : ""}
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="mt-3">
          <Textarea
            label="Additional weapon proficiencies"
            value={weaponText}
            onChange={onWeaponTextChange}
            rows={3}
          />
        </div>
      </div>

      <Textarea
        label="Tool Proficiencies"
        value={toolText}
        onChange={onToolTextChange}
      />

      <Textarea
        label="Languages"
        value={languageText}
        onChange={onLanguageTextChange}
      />
    </div>
  </div>
);

const Textarea = ({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) => (
  <label className="block">
    <span className="text-sm text-zinc-300">{label}</span>
    <textarea
      rows={rows}
      value={value}
      spellCheck={false}
      onChange={(event) => onChange(event.target.value)}
      className="workspace-scrollbar mt-1.5 w-full resize-none overflow-y-auto rounded-lg border border-white/10 bg-zinc-950/70 px-2.5 py-2 text-sm text-white outline-none transition focus:border-white/25"
    />
  </label>
);

export { armorProficiencyPresets, weaponProficiencyPresets };

export default ProficienciesLanguagesEditor;
