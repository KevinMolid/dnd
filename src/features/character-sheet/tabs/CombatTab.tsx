import type { CharacterDoc, CharacterSheetDerived } from "../types";
import SectionCard from "../components/SectionCard";
import AttackModePill from "../components/AttackModePill";
import { abilityLabels } from "../utils/characterSheetConstants";
import { formatLabel, formatModifier } from "../utils/characterSheetHelpers";

import type { AbilityKey } from "../../../rulesets/dnd/dnd2024/types";

type CombatTabProps = {
  character: CharacterDoc;
  derived: CharacterSheetDerived;
};

const CombatTab = ({ derived }: CombatTabProps) => {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="space-y-6 xl:col-span-2">
        <SectionCard title="Combat">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4 self-start">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Equipped Attacks
                </p>

                {derived.equippedWeaponAttacks.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {derived.equippedWeaponAttacks.map((attack) => (
                      <div
                        key={attack.instanceId}
                        className="rounded-xl border border-white/10 bg-zinc-950/60 p-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-white">{attack.name}</p>

                              {attack.isOffHand && (
                                <AttackModePill tone="offhand">Off-Hand</AttackModePill>
                              )}

                              {attack.isThrown && (
                                <AttackModePill tone="thrown">Thrown</AttackModePill>
                              )}

                              {attack.isTwoHanded && (
                                <AttackModePill tone="twohanded">
                                  Two-Handed
                                </AttackModePill>
                              )}
                            </div>

                            <p className="mt-1 text-xs text-zinc-500">
                              {attack.properties.map(formatLabel).join(" • ")}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-semibold text-zinc-200">
                              {formatModifier(attack.attackBonus)} to hit
                            </p>
                            <p className="mt-1 text-xs text-zinc-400">{attack.damage}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-400">
                          <span className="rounded-full border border-white/10 bg-zinc-900 px-2.5 py-1">
                            Uses {abilityLabels[attack.ability as AbilityKey]}
                          </span>

                          {attack.mastery && (
                            <span className="rounded-full border border-white/10 bg-zinc-900 px-2.5 py-1">
                              Mastery: {formatLabel(attack.mastery)}
                            </span>
                          )}

                          {attack.range && (
                            <span className="rounded-full border border-white/10 bg-zinc-900 px-2.5 py-1">
                              Range {attack.range.normal}
                              {attack.range.long ? ` / ${attack.range.long}` : ""} ft
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-zinc-500">
                    No weapons are currently equipped.
                  </p>
                )}
              </div>

              {derived.dragonbornAncestryName && derived.dragonbornDamageType && (
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Breath Weapon
                  </p>

                  <div className="mt-3 space-y-2 text-sm text-zinc-300">
                    <div className="flex items-center justify-between">
                      <span>Damage</span>
                      <span className="font-semibold">
                        {derived.dragonbornBreathWeaponDamage}{" "}
                        {formatLabel(derived.dragonbornDamageType)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Save DC</span>
                      <span className="font-semibold">
                        {derived.dragonbornBreathWeaponDc}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Area</span>
                      <span className="font-semibold">15 ft cone or 30x5 ft Line</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Uses</span>
                      <span className="font-semibold">
                        {derived.proficiencyBonus} / Long Rest
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {derived.resistances.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm font-semibold text-zinc-200">Resistances</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {derived.resistances.map((resistance) => (
                      <span
                        key={resistance}
                        className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300"
                      >
                        {formatLabel(resistance)} Resistance
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 self-start">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Combat Features
                </p>

                {derived.combatFeatures.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {derived.combatFeatures.map((feature) => (
                      <div
                        key={feature.id}
                        className="rounded-xl border border-white/10 bg-zinc-950/60 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-medium text-white">{feature.name}</p>

                          {feature.value && (
                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                              {feature.value}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm leading-6 text-zinc-300">
                          {feature.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Saving Throws">
          <div className="grid gap-3 sm:grid-cols-2">
            {derived.saveRows.map((save) => (
              <div
                key={save.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-white">{save.name}</p>
                  {save.proficient && (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                      Proficient
                    </span>
                  )}
                </div>

                <p className="ml-4 text-sm font-semibold text-zinc-200">
                  {formatModifier(save.total)}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="space-y-6">
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

        <SectionCard title="Combat Snapshot">
          <div className="grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                HP
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {derived.currentHp} / {derived.maxHp}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Armor Class
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {derived.armorClass}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Passive Perception
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {derived.passivePerception}
              </p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default CombatTab;