import NumberStepper from "../NumberStepper";

import type { ArmorClassMode } from "../../rulesets/dnd/dnd2024/armorClass";

type ArmorClassBreakdownLine = {
  id: string;
  label: string;
  value: number;
  detail?: string;
};

type Props = {
  armorClassMode: ArmorClassMode;
  manualArmorClass: number;
  armorClassBonus: number;
  maxHp: number;
  hitDie: string;
  speed: number;
  proficiencyBonus: number;
  resolvedArmorClass: number;
  armorClassFormulaLabel?: string;
  armorClassBreakdown?: ArmorClassBreakdownLine[];
  onArmorClassModeChange: (mode: ArmorClassMode) => void;
  onManualArmorClassChange: (value: number) => void;
  onArmorClassBonusChange: (value: number) => void;
  onMaxHpChange: (value: number) => void;
  onHitDieChange: (value: string) => void;
  onSpeedChange: (value: number) => void;
  onProficiencyBonusChange: (value: number) => void;
};

const CombatStatsEditor = ({
  armorClassMode,
  manualArmorClass,
  armorClassBonus,
  maxHp,
  hitDie,
  speed,
  proficiencyBonus,
  resolvedArmorClass,
  armorClassFormulaLabel,
  armorClassBreakdown = [],
  onArmorClassModeChange,
  onManualArmorClassChange,
  onArmorClassBonusChange,
  onMaxHpChange,
  onHitDieChange,
  onSpeedChange,
  onProficiencyBonusChange,
}: Props) => (
  <div>
    <div className="mb-3 rounded-lg border border-white/10 bg-zinc-900/55 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Armor Class</p>
          <p className="mt-0.5 text-xs text-zinc-500">
            Calculate AC automatically, or use a manual override.
          </p>
        </div>

        <div
          className="inline-flex rounded-lg border border-white/10 bg-black/25 p-1"
          role="group"
          aria-label="Armor Class calculation mode"
        >
          {(["automatic", "manual"] as const).map((modeOption) => {
            const selected = armorClassMode === modeOption;

            return (
              <button
                key={modeOption}
                type="button"
                aria-pressed={selected}
                onClick={() => onArmorClassModeChange(modeOption)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  selected
                    ? "bg-white text-zinc-950"
                    : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {modeOption === "automatic" ? "Automatic" : "Manual"}
              </button>
            );
          })}
        </div>
      </div>

      {armorClassMode === "automatic" ? (
        <div
          className="mt-3 grid gap-3"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(150px, 100%), 1fr))",
          }}
        >
          <div className="min-w-0 rounded-lg border border-white/[0.08] bg-black/20 p-3 [grid-column:span_3]">
            <div className="flex flex-wrap items-end gap-3">
              <span className="text-3xl font-bold leading-none text-white">
                {resolvedArmorClass}
              </span>

              {armorClassFormulaLabel ? (
                <span className="pb-0.5 text-sm font-medium text-zinc-300">
                  {armorClassFormulaLabel}
                </span>
              ) : null}
            </div>

            {armorClassBreakdown.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {armorClassBreakdown.map((line) => (
                  <span
                    key={line.id}
                    className="text-xs text-zinc-400"
                    title={line.detail}
                  >
                    {line.label}{" "}
                    <span className="font-semibold text-zinc-200">
                      {line.value >= 0 ? "+" : ""}
                      {line.value}
                    </span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-zinc-500">
                Current calculated Armor Class
              </p>
            )}
          </div>

          <NumberField
            label="Additional modifier"
            value={armorClassBonus}
            onChange={onArmorClassBonusChange}
          />
        </div>
      ) : (
        <div className="mt-3 max-w-[180px]">
          <NumberField
            label="Manual AC"
            value={manualArmorClass}
            min={0}
            onChange={onManualArmorClassChange}
          />
        </div>
      )}
    </div>

    <div
      className="grid gap-2.5"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 100%), 1fr))",
      }}
    >
      <NumberField
        label="Max HP"
        value={maxHp}
        min={0}
        onChange={onMaxHpChange}
      />

      <label className="block">
        <span className="text-sm text-zinc-300">Hit Die</span>
        <select
          value={hitDie}
          onChange={(event) => onHitDieChange(event.target.value)}
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-900 p-2.5 text-white outline-none focus:border-white/25"
        >
          <option value="d4">d4</option>
          <option value="d6">d6</option>
          <option value="d8">d8</option>
          <option value="d10">d10</option>
          <option value="d12">d12</option>
        </select>
      </label>

      <NumberField
        label="Speed"
        value={speed}
        min={0}
        onChange={onSpeedChange}
      />

      <NumberField
        label="Prof. Bonus"
        value={proficiencyBonus}
        min={0}
        onChange={onProficiencyBonusChange}
      />
    </div>

    <p className="mt-3 text-xs leading-5 text-zinc-500">
      Current HP and spent Hit Dice are live-state values and are preserved when
      these character stats are edited.
    </p>
  </div>
);

const NumberField = ({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
}) => (
  <label className="block">
    <span className="text-sm text-zinc-300">{label}</span>
    <div className="mt-1.5">
      <NumberStepper
        value={value}
        min={min}
        onChange={onChange}
        ariaLabel={label}
        size="default"
        width="full"
      />
    </div>
  </label>
);

export default CombatStatsEditor;
