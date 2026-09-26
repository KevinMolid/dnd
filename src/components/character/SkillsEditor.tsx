import type { AbilityKey } from "../../rulesets/dnd/dnd2024/types";
import {
  customSkillDefinitions,
  type CustomProficiencyLevel,
  type CustomSkillId,
} from "../../types/customCharacter";

const abilityShortLabels: Record<AbilityKey, string> = {
  str: "STR",
  dex: "DEX",
  con: "CON",
  int: "INT",
  wis: "WIS",
  cha: "CHA",
};

const getModifier = (score: number) => Math.floor((score - 10) / 2);

const formatModifier = (value: number) =>
  value >= 0 ? `+${value}` : `${value}`;

type Props = {
  abilityScores: Record<AbilityKey, number>;
  skillProficiencies: Record<CustomSkillId, CustomProficiencyLevel>;
  proficiencyBonus: number;
  onSkillProficiencyChange: (
    skillId: CustomSkillId,
    nextLevel: Exclude<CustomProficiencyLevel, "none">,
  ) => void;
};

const SkillsEditor = ({
  abilityScores,
  skillProficiencies,
  proficiencyBonus,
  onSkillProficiencyChange,
}: Props) => {
  const getSkillBonus = (
    ability: AbilityKey,
    proficiency: CustomProficiencyLevel,
  ) => {
    let bonus = getModifier(abilityScores[ability]);

    if (proficiency === "proficient") bonus += proficiencyBonus;
    if (proficiency === "expertise") bonus += proficiencyBonus * 2;

    return bonus;
  };

  return (
    <div>
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
        }}
      >
        {customSkillDefinitions.map((skill) => {
          const proficiency = skillProficiencies[skill.id] ?? "none";

          return (
            <div
              key={skill.id}
              className="flex min-h-10 min-w-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-zinc-900/70 px-2.5 py-1.5"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-zinc-100">
                  {skill.name}
                </div>
                <div className="text-[9px] uppercase tracking-wide text-zinc-600">
                  {abilityShortLabels[skill.ability]}
                </div>
              </div>

              <strong className="w-8 shrink-0 text-right text-xs text-white">
                {formatModifier(getSkillBonus(skill.ability, proficiency))}
              </strong>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onSkillProficiencyChange(skill.id, "proficient")
                  }
                  title="Proficient"
                  aria-label={`${skill.name}: Proficient`}
                  aria-pressed={proficiency === "proficient"}
                  className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                    proficiency === "proficient"
                      ? "border-emerald-400 bg-emerald-400"
                      : "border-zinc-600 bg-transparent hover:border-emerald-400/70"
                  }`}
                >
                  {proficiency === "proficient" ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                  ) : null}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onSkillProficiencyChange(skill.id, "expertise")
                  }
                  title="Expertise"
                  aria-label={`${skill.name}: Expertise`}
                  aria-pressed={proficiency === "expertise"}
                  className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                    proficiency === "expertise"
                      ? "border-emerald-400 bg-emerald-400/15"
                      : "border-zinc-600 bg-transparent hover:border-emerald-400/70"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      proficiency === "expertise"
                        ? "bg-emerald-400"
                        : "bg-transparent"
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex items-center gap-4 text-[9px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Proficiency
        </span>

        <span className="flex items-center gap-1.5">
          <span className="flex h-3 w-3 items-center justify-center rounded-full border border-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Expertise
        </span>
      </div>
    </div>
  );
};

export default SkillsEditor;
