import type { AbilityKey } from "../../../rulesets/dnd/dnd2024/types";
import type { CharacterDoc, CharacterSheetDerived } from "../types";
import SectionCard from "../components/SectionCard";
import {
  abilityLabels,
} from "../utils/characterSheetConstants";
import {
  formatLabel,
  formatModifier,
  getAbilityModifier,
} from "../utils/characterSheetHelpers";

type OverviewTabProps = {
  character: CharacterDoc;
  derived: CharacterSheetDerived;
};

const OverviewTab = ({ character, derived }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <SectionCard title="Ability Scores">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(Object.keys(derived.finalAbilityScores) as AbilityKey[]).map(
                (key) => {
                  const score = derived.finalAbilityScores[key];
                  const mod = getAbilityModifier(score);
                  const baseScore = character.abilityScores[key];
                  const bonus = score - baseScore;

                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-white/10 bg-zinc-900/70 p-3 sm:rounded-2xl sm:p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {abilityLabels[key]}
                      </p>
                      <div className="mt-3 flex items-end justify-between">
                        <p className="text-xl font-bold text-white sm:text-3xl">
                          {score}
                        </p>
                        <p className="text-sm font-semibold text-zinc-300 sm:text-lg">
                          {formatModifier(mod)}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">
                        Base {baseScore}
                        {bonus > 0 ? ` • +${bonus} background` : ""}
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          </SectionCard>

          <SectionCard title="Skills">
            <div className="grid gap-2">
              {derived.skillRows.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-white">{skill.name}</p>
                      <span className="rounded-full border border-white/10 bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                        {abilityLabels[skill.ability]}
                      </span>
                      {skill.proficient && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                          Proficient
                        </span>
                      )}
                      {skill.expertise && (
                        <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-blue-300">
                          Expertise
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="ml-4 text-sm font-semibold text-zinc-200">
                    {formatModifier(skill.total)}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">

          {derived.dragonbornAncestryName && derived.dragonbornDamageType && (
            <SectionCard title="Dragonborn Traits">
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Draconic Ancestry
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {derived.dragonbornAncestryName}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Damage Resistance
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {formatLabel(derived.dragonbornDamageType)} damage
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Breath Weapon
                  </dt>
                  <dd className="mt-1 space-y-1 text-sm text-zinc-200">
                    <p>
                      {derived.dragonbornBreathWeaponDamage}{" "}
                      {formatLabel(derived.dragonbornDamageType)} damage
                    </p>
                    <p className="text-zinc-400">
                      Save DC {derived.dragonbornBreathWeaponDc} Dexterity
                    </p>
                    <p className="text-zinc-400">
                      15-foot Cone or 30-foot Line (5 feet wide)
                    </p>
                    <p className="text-zinc-400">
                      Uses: {derived.proficiencyBonus} per Long Rest
                    </p>
                  </dd>
                </div>
              </dl>
            </SectionCard>
          )}

          <SectionCard title="Progression">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>XP</span>
                  <span>
                    {derived.xp} / {derived.xpProgress.nextLevelXp ?? "MAX"}
                  </span>
                </div>

                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full bg-blue-400"
                    style={{
                      width: `${derived.xpProgress.progressPercent}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-zinc-500">
                  <span>Level {derived.xpProgress.level}</span>
                  <span>
                    {derived.xpProgress.nextLevelXp === null
                      ? "Max level reached"
                      : `${derived.xpProgress.progressXp}/${derived.xpProgress.neededXp} XP this level`}
                  </span>
                </div>
              </div>

              {character.pendingLevelUp && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300">
                  Level up available! ({character.pendingLevelUp.fromLevel} →{" "}
                  {character.pendingLevelUp.toLevel})
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Tools">
            {derived.toolProficiencies.length > 0 ? (
              <div className="grid gap-3">
                {derived.toolProficiencies.map((tool) => {
                  const expertiseApplies = derived.expertise.includes(
                    tool as any,
                  );

                  return (
                    <div
                      key={tool}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-white">
                            {formatLabel(tool)}
                          </p>
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                            Proficient
                          </span>
                          {expertiseApplies && (
                            <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-blue-300">
                              Expertise
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-zinc-300">
                          +PB
                          {expertiseApplies
                            ? ` + doubled proficiency (${formatModifier(
                                derived.proficiencyBonus * 2,
                              )})`
                            : ` (${formatModifier(derived.proficiencyBonus)})`}
                        </p>
                      </div>

                      <p className="mt-2 text-xs text-zinc-500">
                        Tool checks use a relevant ability chosen by the DM or
                        situation, plus your proficiency bonus if proficient.
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No tool proficiencies yet.</p>
            )}
          </SectionCard>

          <SectionCard title="Languages">
            {derived.languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {derived.languages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                  >
                    {formatLabel(language)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No languages recorded.</p>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;