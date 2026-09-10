import type { AbilityKey } from "../../../rulesets/dnd/dnd2024/types";

import { classesById } from "../../../rulesets/dnd/dnd2024/helpers";

import type { CharacterDoc, CharacterSheetDerived } from "../types";

import SectionCard from "../components/SectionCard";

import { abilityLabels } from "../utils/characterSheetConstants";

import {
  formatLabel,
  formatModifier,
  getAbilityModifier,
} from "../utils/characterSheetHelpers";

type OverviewTabProps = {
  character: CharacterDoc;
  derived: CharacterSheetDerived;
};

type ExtendedCharacterDoc = CharacterDoc & {
  age?: string;
  height?: string;
  weight?: string;
  eyes?: string;
  skin?: string;
  hair?: string;
};

type ExtendedDerived = CharacterSheetDerived & {
  armorProficiencies?: string[];
  weaponProficiencies?: string[];
};

const abilityKeys: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];

const OverviewTab = ({ character, derived }: OverviewTabProps) => {
  const extendedCharacter = character as ExtendedCharacterDoc;

  const extendedDerived = derived as ExtendedDerived;

  const classDefinition = character.classId
    ? classesById[character.classId]
    : undefined;

  const savingThrowProficiencies =
    (
      classDefinition as
        | {
            savingThrows?: AbilityKey[];
          }
        | undefined
    )?.savingThrows ?? [];

  const armorProficiencies = extendedDerived.armorProficiencies ?? [];

  const weaponProficiencies = extendedDerived.weaponProficiencies ?? [];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <div className="space-y-4">
        <SectionCard title="Character">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Info label="Class" value={derived.className} />

            <Info label="Species / Race" value={derived.speciesName} />

            <Info label="Background" value={derived.backgroundName} />

            <Info label="Alignment" value={character.alignment} />
          </div>
        </SectionCard>

        <SectionCard title="Physical Characteristics">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
            <Info label="Age" value={extendedCharacter.age} />

            <Info label="Height" value={extendedCharacter.height} />

            <Info label="Weight" value={extendedCharacter.weight} />

            <Info label="Eyes" value={extendedCharacter.eyes} />

            <Info label="Skin" value={extendedCharacter.skin} />

            <Info label="Hair" value={extendedCharacter.hair} />
          </div>
        </SectionCard>

        <SectionCard title="Saving Throws">
          <div className="grid gap-1.5 sm:grid-cols-3">
            {abilityKeys.map((ability) => {
              const proficient = savingThrowProficiencies.includes(ability);

              const modifier = getAbilityModifier(
                derived.finalAbilityScores[ability],
              );

              const total =
                modifier + (proficient ? derived.proficiencyBonus : 0);

              return (
                <div
                  key={ability}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2"
                >
                  <div>
                    <p className="text-xs text-white">
                      {abilityLabels[ability]}
                    </p>

                    <p className="text-[9px] text-zinc-600">
                      {proficient ? "Proficient" : "Not proficient"}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-zinc-200">
                    {formatModifier(total)}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Skills">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {derived.skillRows.map((skill) => (
              <div
                key={skill.id}
                className="flex min-w-0 items-center justify-between rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    <p className="truncate text-xs font-medium text-white">
                      {skill.name}
                    </p>

                    <span className="rounded-full border border-white/10 bg-zinc-800 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.12em] text-zinc-500">
                      {abilityLabels[skill.ability]}
                    </span>

                    {skill.proficient ? (
                      <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.12em] text-emerald-300">
                        Prof
                      </span>
                    ) : null}

                    {skill.expertise ? (
                      <span className="rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.12em] text-blue-300">
                        Exp
                      </span>
                    ) : null}
                  </div>
                </div>

                <p className="ml-3 shrink-0 text-xs font-semibold text-zinc-200">
                  {formatModifier(skill.total)}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="space-y-4">
        <SectionCard title="Progression">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>XP</span>

            <span>
              {derived.xp} / {derived.xpProgress.nextLevelXp ?? "MAX"}
            </span>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-blue-400"
              style={{
                width: `${derived.xpProgress.progressPercent}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between gap-3 text-[9px] text-zinc-600">
            <span>Level {derived.xpProgress.level}</span>

            <span className="text-right">
              {derived.xpProgress.nextLevelXp === null
                ? "Max level"
                : `${derived.xpProgress.progressXp}/${derived.xpProgress.neededXp} XP`}
            </span>
          </div>

          {character.pendingLevelUp ? (
            <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
              Level up available: {character.pendingLevelUp.fromLevel} →{" "}
              {character.pendingLevelUp.toLevel}
            </div>
          ) : null}
        </SectionCard>

        {derived.dragonbornAncestryName && derived.dragonbornDamageType ? (
          <SectionCard title="Dragonborn Traits">
            <div className="space-y-2 text-xs">
              <Info
                label="Draconic Ancestry"
                value={derived.dragonbornAncestryName}
              />

              <Info
                label="Resistance"
                value={`${formatLabel(derived.dragonbornDamageType)} damage`}
              />

              <Info
                label="Breath Weapon"
                value={`${derived.dragonbornBreathWeaponDamage} ${formatLabel(
                  derived.dragonbornDamageType,
                )} · DC ${derived.dragonbornBreathWeaponDc}`}
              />
            </div>
          </SectionCard>
        ) : null}

        <SectionCard title="Languages">
          <TagList items={derived.languages} />
        </SectionCard>

        <SectionCard title="Armor Proficiencies">
          <TagList items={armorProficiencies} />
        </SectionCard>

        <SectionCard title="Weapon Proficiencies">
          <TagList items={weaponProficiencies} />
        </SectionCard>

        <SectionCard title="Tool Proficiencies">
          <TagList items={derived.toolProficiencies.map(formatLabel)} />
        </SectionCard>
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
      {label}
    </p>

    <p className="mt-1 text-xs text-zinc-300">{value || "—"}</p>
  </div>
);

const TagList = ({ items }: { items: string[] }) =>
  items.length > 0 ? (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-full border border-white/10 bg-zinc-900 px-2 py-1 text-[10px] text-zinc-300"
        >
          {item}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-xs text-zinc-600">None</p>
  );

export default OverviewTab;
