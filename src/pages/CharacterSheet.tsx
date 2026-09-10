import { useState } from "react";

import { Link, useLocation, useParams } from "react-router-dom";

import CustomCharacterSheet from "./CustomCharacterSheet";

import CharacterInventoryEquipment from "../components/CharacterInventoryEquipment";

import SpellTooltip from "../components/SpellTooltip";

import { classesById } from "../rulesets/dnd/dnd2024/helpers";

import type { AbilityKey } from "../rulesets/dnd/dnd2024/types";

import { useCharacterSheetData } from "../features/character-sheet/hooks/useCharacterSheetData";

import type {
  CharacterSheetTab,
  TraitGroupKey,
} from "../features/character-sheet/types";

import SectionCard from "../features/character-sheet/components/SectionCard";

import CharacterSheetHeader from "../features/character-sheet/components/CharacterSheetHeader";

import CharacterQuickStats from "../features/character-sheet/components/CharacterQuickStats";

import CharacterSheetTabs from "../features/character-sheet/components/CharacterSheetTabs";

import TraitGroupSection from "../features/character-sheet/components/TraitGroupSection";

import OverviewTab from "../features/character-sheet/tabs/OverviewTab";

import CombatTab from "../features/character-sheet/tabs/CombatTab";

import { abilityFullLabels } from "../features/character-sheet/utils/characterSheetConstants";

import {
  formatModifier,
  formatSpellUsage,
} from "../features/character-sheet/utils/characterSheetHelpers";

const CharacterSheet = () => {
  const { characterId } = useParams();

  const location = useLocation();

  const [activeTab, setActiveTab] = useState<CharacterSheetTab>("overview");

  const [openTraitGroups, setOpenTraitGroups] = useState<
    Record<TraitGroupKey, boolean>
  >({
    species: true,
    class: true,
    subclass: true,
    background: true,
    feats: true,
    other: false,
  });

  const {
    character,
    derived,
    loading,
    error,
    campaignItemsById,
    handleEquipmentChange,
    handleApplyDecision,
    handleCompleteLevelUp,
  } = useCharacterSheetData(characterId);

  const navigationState = location.state as
    | {
        from?: string;
        label?: string;
      }
    | undefined;

  const backTo = navigationState?.from ?? "/";

  const backLabel = navigationState?.label ?? "Back to home";

  const toggleTraitGroup = (key: TraitGroupKey) => {
    setOpenTraitGroups((current) => ({
      ...current,

      [key]: !current[key],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-zinc-400">Loading character...</p>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            {error || "Something went wrong."}
          </div>

          <Link
            to="/"
            className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  if (character.buildMode === "custom") {
    return (
      <CustomCharacterSheet
        characterId={characterId}
        character={character as any}
        backTo={backTo}
        backLabel={backLabel}
        campaignItemsById={campaignItemsById}
        handleEquipmentChange={handleEquipmentChange}
      />
    );
  }

  if (!derived) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            Could not derive character data.
          </div>
        </div>
      </div>
    );
  }

  /*
   * Pull the guided character's persistent
   * proficiencies from its class definition.
   *
   * The defensive alternatives let this keep
   * working while your class schema evolves.
   */
  const classDefinition = classesById[character.classId] as any;

  const savingThrowProficiencies: AbilityKey[] =
    classDefinition?.savingThrows ??
    classDefinition?.savingThrowProficiencies ??
    [];

  const armorProficiencies: string[] =
    classDefinition?.armorProficiencies ??
    classDefinition?.armorTraining ??
    classDefinition?.proficiencies?.armor ??
    [];

  const weaponProficiencies: string[] =
    classDefinition?.weaponProficiencies ??
    classDefinition?.weaponTraining ??
    classDefinition?.proficiencies?.weapons ??
    [];

  const renderFeaturesTab = () => (
    <div className="space-y-4">
      {derived.pendingSteps.length > 0 && (
        <SectionCard title="Level Up">
          <div className="space-y-3">
            {derived.pendingSteps.map((step) => (
              <div
                key={step.id}
                className="rounded-xl border border-white/10 bg-zinc-900/60 p-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {step.title}
                    </p>

                    <p className="text-[10px] text-zinc-500">
                      Level {step.level}
                    </p>

                    {step.description ? (
                      <p className="mt-2 text-xs leading-5 text-zinc-400">
                        {step.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {step.type === "subclass-choice" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyDecision(step.level, {
                            subclassId: "assassin",
                          })
                        }
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
                      >
                        Choose
                      </button>
                    )}

                    {step.type === "feat-choice" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyDecision(step.level, {
                            featId: "alert",
                          })
                        }
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
                      >
                        Choose
                      </button>
                    )}

                    {step.type === "expertise-choice" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyDecision(step.level, {
                            expertise: ["stealth", "perception"],
                          })
                        }
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
                      >
                        Choose
                      </button>
                    )}

                    {step.type === "language-choice" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyDecision(step.level, {
                            language: "elvish",
                          })
                        }
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
                      >
                        Choose
                      </button>
                    )}

                    {step.type === "weapon-mastery-choice" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyDecision(step.level, {
                            weaponMastery: ["dagger", "shortsword"],
                          })
                        }
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-zinc-200"
                      >
                        Choose
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleCompleteLevelUp}
              className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Complete Level Up
            </button>
          </div>
        </SectionCard>
      )}

      <SectionCard
        title="Features & Traits"
        right={
          <div className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-zinc-500">
            {derived.traitGroups.reduce(
              (total, group) => total + group.traits.length,
              0,
            )}{" "}
            total
          </div>
        }
      >
        {derived.traitGroups.length > 0 ? (
          <div className="space-y-2">
            {derived.traitGroups.map((group) => (
              <TraitGroupSection
                key={group.key}
                group={group}
                isOpen={openTraitGroups[group.key]}
                onToggle={() => toggleTraitGroup(group.key)}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-600">No traits found yet.</p>
        )}
      </SectionCard>
    </div>
  );

  const renderInventoryTab = () => {
    const moneyCp = derived.moneyCp ?? character.moneyCp ?? 0;

    return (
      <CharacterInventoryEquipment
        equipment={character.equipment ?? []}
        onChange={handleEquipmentChange}
        campaignItemsById={campaignItemsById}
        moneyCp={moneyCp}
      />
    );
  };

  const renderNotesTab = () => (
    <div className="space-y-4">
      <SectionCard title="Notes">
        {character.notes ? (
          <p className="whitespace-pre-wrap text-xs leading-5 text-zinc-300">
            {character.notes}
          </p>
        ) : (
          <p className="text-xs text-zinc-600">No notes yet.</p>
        )}
      </SectionCard>
    </div>
  );

  const hasAnySpells =
    derived.groupedSpells.length > 0 ||
    derived.groupedTieflingLegacySpells.length > 0;

  const showSpellcastingPanel = Boolean(derived.activeSpellcasting);

  const renderSpellsTab = () => (
    <SectionCard title="Spells">
      {showSpellcastingPanel || hasAnySpells ? (
        <div className="space-y-4">
          {showSpellcastingPanel ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <SpellStat
                label="Ability"
                value={
                  derived.spellcastingAbility
                    ? abilityFullLabels[derived.spellcastingAbility]
                    : "—"
                }
                subValue={
                  derived.spellcastingAbilityMod !== null
                    ? `Mod ${formatModifier(derived.spellcastingAbilityMod)}`
                    : undefined
                }
              />

              <SpellStat label="Save DC" value={derived.spellSaveDc ?? "—"} />

              <SpellStat
                label="Attack"
                value={
                  derived.spellAttackBonus !== null
                    ? formatModifier(derived.spellAttackBonus)
                    : "—"
                }
              />

              <SpellStat
                label="Source"
                value={derived.subclassName ?? derived.className}
              />
            </div>
          ) : null}

          <div className="rounded-xl bg-zinc-900/60 p-3">
            <p className="text-xs font-semibold text-zinc-300">Spell Slots</p>

            {Object.keys(derived.spellSlots).length > 0 ? (
              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:grid-cols-5 lg:grid-cols-9">
                {Object.entries(derived.spellSlots).map(
                  ([slotLevel, count]) => (
                    <div
                      key={slotLevel}
                      className="rounded-lg bg-black/20 px-2 py-2 text-center"
                    >
                      <p className="text-[9px] text-zinc-600">L{slotLevel}</p>

                      <p className="mt-1 text-sm font-bold text-white">
                        {count}
                      </p>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="mt-2 text-xs text-zinc-600">
                No spell slots available.
              </p>
            )}
          </div>

          {derived.groupedTieflingLegacySpells.length > 0 ? (
            <div className="space-y-3">
              {derived.groupedTieflingLegacySpells.map((group) => (
                <SpellGroup
                  key={`tiefling-${group.level}`}
                  title={group.title}
                  spells={group.spells}
                />
              ))}
            </div>
          ) : null}

          {derived.groupedSpells.length > 0 ? (
            <div className="space-y-3">
              {derived.groupedSpells.map((group) => (
                <SpellGroup
                  key={group.level}
                  title={group.title}
                  spells={group.spells}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-xs text-zinc-600">
          This character does not currently have spellcasting.
        </p>
      )}
    </SectionCard>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-5 lg:px-6">
        <div className="mb-4">
          <Link
            to={backTo}
            className="text-xs text-zinc-400 transition hover:text-white"
          >
            ← {backLabel}
          </Link>
        </div>

        <CharacterSheetHeader
          characterId={characterId}
          name={character.name}
          imageUrl={character.imageUrl}
          level={character.level}
          speciesName={derived.speciesName}
          className={derived.className}
          subclassName={derived.subclassName}
          backgroundName={derived.backgroundName}
        />

        <CharacterQuickStats
          currentHp={derived.currentHp}
          maxHp={derived.maxHp}
          armorClass={derived.armorClass}
          initiative={derived.initiativeBonus}
          initiativeSubValue={derived.initiativeBreakdown}
          speed={derived.speed}
          proficiencyBonus={derived.proficiencyBonus}
          passivePerception={derived.passivePerception}
          abilityScores={derived.finalAbilityScores}
          savingThrowProficiencies={savingThrowProficiencies}
          languages={derived.languages}
          armorProficiencies={armorProficiencies}
          weaponProficiencies={weaponProficiencies}
          toolProficiencies={derived.toolProficiencies}
        />

        <CharacterSheetTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "overview" && (
          <OverviewTab character={character} derived={derived} />
        )}

        {activeTab === "combat" && (
          <CombatTab character={character} derived={derived} />
        )}

        {activeTab === "features" && renderFeaturesTab()}

        {activeTab === "inventory" && renderInventoryTab()}

        {activeTab === "spells" && renderSpellsTab()}

        {activeTab === "notes" && renderNotesTab()}
      </div>
    </div>
  );
};

const SpellStat = ({
  label,
  value,
  subValue,
}: {
  label: string;

  value: string | number;

  subValue?: string;
}) => (
  <div className="rounded-xl bg-zinc-900/60 px-3 py-2.5">
    <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">
      {label}
    </p>

    <p className="mt-1 text-sm font-semibold text-white">{value}</p>

    {subValue ? (
      <p className="mt-1 text-[9px] text-zinc-600">{subValue}</p>
    ) : null}
  </div>
);

const SpellGroup = ({
  title,
  spells,
}: {
  title: string;

  spells: any[];
}) => (
  <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-3">
    <div className="mb-2 flex items-center justify-between gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
        {title}
      </h3>

      <span className="text-[9px] text-zinc-600">
        {spells.length} spell
        {spells.length === 1 ? "" : "s"}
      </span>
    </div>

    <div className="flex flex-wrap gap-2">
      {spells.map((spell) => {
        const usageLabel = formatSpellUsage(spell.usage);

        return (
          <SpellTooltip key={spell.spellId} spell={spell}>
            <div className="min-w-[145px] rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2.5 transition hover:bg-zinc-900">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-white">
                    {spell.name}
                  </p>

                  {spell.school ? (
                    <p className="mt-1 text-[9px] text-zinc-600">
                      {spell.school}
                    </p>
                  ) : null}
                </div>

                {usageLabel ? (
                  <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] text-emerald-300">
                    {usageLabel}
                  </span>
                ) : null}
              </div>
            </div>
          </SpellTooltip>
        );
      })}
    </div>
  </div>
);

export default CharacterSheet;
