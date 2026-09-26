import NumberStepper from "../NumberStepper";

import type { AbilityKey } from "../../rulesets/dnd/dnd2024/types";

const abilityLabels: Record<AbilityKey, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

const abilityShortLabels: Record<AbilityKey, string> = {
  str: "STR",
  dex: "DEX",
  con: "CON",
  int: "INT",
  wis: "WIS",
  cha: "CHA",
};

const abilityKeys: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];

const getModifier = (score: number) => Math.floor((score - 10) / 2);

const formatModifier = (value: number) =>
  value >= 0 ? `+${value}` : `${value}`;

type Props = {
  abilityScores: Record<AbilityKey, number>;
  savingThrowProficiencies: AbilityKey[];
  proficiencyBonus: number;
  onAbilityScoreChange: (ability: AbilityKey, value: number) => void;
  onSavingThrowToggle: (ability: AbilityKey) => void;
};

const AbilityScoresSavingThrowsEditor = ({
  abilityScores,
  savingThrowProficiencies,
  proficiencyBonus,
  onAbilityScoreChange,
  onSavingThrowToggle,
}: Props) => (
  <div className="@container">
    <div className="grid grid-cols-2 gap-2.5 @min-[480px]:grid-cols-3 @min-[720px]:grid-cols-6">
      {abilityKeys.map((ability) => {
        const proficient = savingThrowProficiencies.includes(ability);
        const modifier = getModifier(abilityScores[ability]);
        const saveBonus = modifier + (proficient ? proficiencyBonus : 0);

        return (
          <div
            key={ability}
            className="w-full min-w-0 rounded-lg border border-white/10 bg-zinc-900 p-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-zinc-500">
                {abilityShortLabels[ability]}
              </span>

              <span className="text-xs font-semibold text-zinc-300">
                {formatModifier(modifier)}
              </span>
            </div>

            <div className="mt-2 min-w-0">
              <NumberStepper
                value={abilityScores[ability]}
                min={1}
                max={30}
                onChange={(value) => onAbilityScoreChange(ability, value)}
                ariaLabel={`${abilityLabels[ability]} score`}
                size="default"
                width="full"
              />
            </div>

            <label className="mt-2.5 flex cursor-pointer items-center justify-between gap-2 border-t border-white/[0.08] pt-2.5">
              <span className="flex min-w-0 items-center gap-2">
                <input
                  type="checkbox"
                  checked={proficient}
                  onChange={() => onSavingThrowToggle(ability)}
                  className="shrink-0"
                />

                <span className="truncate text-xs text-zinc-400">Save</span>
              </span>

              <strong className="shrink-0 text-xs text-white">
                {formatModifier(saveBonus)}
              </strong>
            </label>
          </div>
        );
      })}
    </div>
  </div>
);

export default AbilityScoresSavingThrowsEditor;
