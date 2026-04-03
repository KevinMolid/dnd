import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import CharacterInventoryEquipment from "../components/CharacterInventoryEquipment";
import SpellTooltip from "../components/SpellTooltip";

import { useCharacterSheetData } from "../features/character-sheet/hooks/useCharacterSheetData";
import type {
  CharacterSheetTab,
  TraitGroupKey,
} from "../features/character-sheet/types";

import StatCard from "../features/character-sheet/components/StatCard";
import SectionCard from "../features/character-sheet/components/SectionCard";
import CharacterSheetHeader from "../features/character-sheet/components/CharacterSheetHeader";
import CharacterSheetTabs from "../features/character-sheet/components/CharacterSheetTabs";
import TraitGroupSection from "../features/character-sheet/components/TraitGroupSection";

import OverviewTab from "../features/character-sheet/tabs/OverviewTab";
import CombatTab from "../features/character-sheet/tabs/CombatTab";

import {
  abilityFullLabels,
} from "../features/character-sheet/utils/characterSheetConstants";
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
    | { from?: string; label?: string }
    | undefined;

  const backTo = navigationState?.from ?? "/";
  const backLabel = navigationState?.label ?? "Back to home";

  const toggleTraitGroup = (key: TraitGroupKey) => {
    setOpenTraitGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-zinc-400">Loading character...</p>
        </div>
      </div>
    );
  }

  if (error || !character || !derived) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-7xl">
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

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      {derived.pendingSteps.length > 0 && (
        <SectionCard title="Level Up">
          <div className="space-y-3">
            {derived.pendingSteps.map((step) => (
              <div
                key={step.id}
                className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-white">{step.title}</p>
                    <p className="text-xs text-zinc-500">Level {step.level}</p>
                    {step.description && (
                      <p className="mt-2 text-sm text-zinc-400">
                        {step.description}
                      </p>
                    )}
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
                        className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
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
                        className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
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
                        className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
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
                        className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
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
                        className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
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
              className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Complete Level Up
            </button>
          </div>
        </SectionCard>
      )}

      <SectionCard
        title="Features & Traits"
        right={
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
            {derived.traitGroups.reduce(
              (total, group) => total + group.traits.length,
              0,
            )}{" "}
            total
          </div>
        }
      >
        {derived.traitGroups.length > 0 ? (
          <div className="space-y-3">
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
          <p className="text-sm text-zinc-500">No traits found yet.</p>
        )}
      </SectionCard>
    </div>
  );

  const renderInventoryTab = () => {
    const moneyCp = derived.moneyCp ?? character.moneyCp ?? 0;

    return (
      <div className="space-y-6">
        <CharacterInventoryEquipment
          equipment={character.equipment ?? []}
          onChange={handleEquipmentChange}
          campaignItemsById={campaignItemsById}
          moneyCp={moneyCp}
        />
      </div>
    );
  };

  const renderNotesTab = () => (
    <div className="space-y-6">
      <SectionCard title="Notes">
        {character.notes ? (
          <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
            {character.notes}
          </p>
        ) : (
          <p className="text-sm text-zinc-500">No notes yet.</p>
        )}
      </SectionCard>
    </div>
  );

  const hasAnySpells =
    derived.groupedSpells.length > 0 ||
    derived.groupedTieflingLegacySpells.length > 0;

  const showSpellcastingPanel = !!derived.activeSpellcasting;

  const renderSpellsTab = () => (
    <SectionCard title="Spells">
      {showSpellcastingPanel || hasAnySpells ? (
        <div className="space-y-4">
          {showSpellcastingPanel && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Spellcasting Ability
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {derived.spellcastingAbility
                    ? abilityFullLabels[derived.spellcastingAbility]
                    : "—"}
                </p>
                {derived.spellcastingAbilityMod !== null && (
                  <p className="mt-1 text-sm text-zinc-400">
                    Mod {formatModifier(derived.spellcastingAbilityMod)}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Spell Save DC
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {derived.spellSaveDc ?? "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Spell Attack Bonus
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {derived.spellAttackBonus !== null
                    ? formatModifier(derived.spellAttackBonus)
                    : "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Spellcasting Source
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {derived.subclassName ?? derived.className}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
            <p className="text-sm font-semibold text-zinc-200">Spell Slots</p>

            {Object.keys(derived.spellSlots).length > 0 ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(derived.spellSlots).map(
                  ([slotLevel, count]) => (
                    <div
                      key={slotLevel}
                      className="rounded-xl border border-white/10 bg-zinc-950/60 p-3"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        Level {slotLevel}
                      </p>
                      <p className="mt-2 text-xl font-bold text-white">
                        {count}
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">
                        slot{count === 1 ? "" : "s"}
                      </p>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-zinc-500">
                No spell slots available yet.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/10 bg-zinc-800 px-3 py-1 text-zinc-300">
                Cantrips: {derived.selectedCantripCount}
                {derived.cantripsKnown > 0 ? ` / ${derived.cantripsKnown}` : ""}
              </span>

              {derived.spellsPrepared > 0 && (
                <span
                  className={`rounded-full px-3 py-1 ${
                    derived.missingSpellListCount > 0
                      ? "border border-amber-500/20 bg-amber-500/10 text-amber-300"
                      : "border border-white/10 bg-zinc-800 text-zinc-300"
                  }`}
                >
                  Spell list: {derived.selectedLeveledSpellCount} /{" "}
                  {derived.spellsPrepared}
                </span>
              )}

              {derived.spellsKnown > 0 && (
                <span className="rounded-full border border-white/10 bg-zinc-800 px-3 py-1 text-zinc-300">
                  Spells known: {derived.spellsKnown}
                </span>
              )}
            </div>

            {derived.missingSpellListCount > 0 && (
              <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-300">
                This character is missing {derived.missingSpellListCount} spell
                {derived.missingSpellListCount === 1 ? "" : "s"} on its spell
                list.
              </div>
            )}
          </div>

          {(derived.tieflingLegacyName ||
            derived.tieflingLegacyCastingAbility) && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
                    {derived.tieflingLegacyName ?? "Fiendish Legacy"}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    Innate species spellcasting
                  </p>
                </div>

                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs text-red-300">
                  {derived.tieflingLegacySpells.length} spell
                  {derived.tieflingLegacySpells.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Spellcasting Ability
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {derived.tieflingLegacyCastingAbility
                      ? abilityFullLabels[derived.tieflingLegacyCastingAbility]
                      : "—"}
                  </p>
                  {derived.tieflingLegacyCastingMod !== null && (
                    <p className="mt-1 text-sm text-zinc-400">
                      Mod {formatModifier(derived.tieflingLegacyCastingMod)}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Spell Save DC
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {derived.tieflingLegacySpellSaveDc ?? "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Spell Attack Bonus
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {derived.tieflingLegacySpellAttackBonus !== null
                      ? formatModifier(derived.tieflingLegacySpellAttackBonus)
                      : "—"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Spellcasting Source
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {derived.tieflingLegacyName ?? "Fiendish Legacy"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {derived.groupedTieflingLegacySpells.map((group) => (
                  <div
                    key={`tiefling-${group.level}`}
                    className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">
                        {group.title}
                      </h3>

                      <span className="rounded-full border border-white/10 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                        {group.spells.length} spell
                        {group.spells.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {group.spells.map((spell) => {
                        const usageLabel = formatSpellUsage(spell.usage);

                        return (
                          <div
                            key={`tiefling-${spell.spellId}`}
                            className="min-w-0"
                          >
                            <SpellTooltip spell={spell}>
                              <div className="min-w-0 rounded-xl border border-white/10 bg-zinc-900/70 p-3 sm:rounded-2xl sm:p-4">
                                <div className="flex min-w-0 items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="break-words font-medium text-white">
                                      {spell.name}
                                    </p>
                                    {spell.school && (
                                      <p className="mt-1 text-sm text-zinc-500">
                                        {spell.school}
                                      </p>
                                    )}
                                  </div>

                                  {usageLabel && (
                                    <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300 sm:px-3 sm:text-xs">
                                      {usageLabel}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </SpellTooltip>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {derived.groupedSpells.length > 0 ? (
            <div className="space-y-4">
              {derived.groupedSpells.map((group) => (
                <div
                  key={group.level}
                  className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">
                      {group.title}
                    </h3>

                    <span className="rounded-full border border-white/10 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                      {group.spells.length} spell
                      {group.spells.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.spells.map((spell) => {
                      const usageLabel = formatSpellUsage(spell.usage);

                      return (
                        <div key={spell.spellId}>
                          <SpellTooltip spell={spell}>
                            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                              <div>
                                <p className="font-medium text-white">
                                  {spell.name}
                                </p>
                                {spell.school && (
                                  <p className="mt-1 text-sm text-zinc-500">
                                    {spell.school}
                                  </p>
                                )}
                              </div>

                              {usageLabel && (
                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                                  {usageLabel}
                                </span>
                              )}
                            </div>
                          </SpellTooltip>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No spells known yet.</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">
          This character does not currently have spellcasting.
        </p>
      )}
    </SectionCard>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <div className="mb-6">
            <Link to={backTo} className="text-zinc-400 hover:text-white">
              ← {backLabel}
            </Link>
          </div>
        </div>

        <CharacterSheetHeader
          characterId={characterId}
          character={character}
          derived={derived}
        />

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="HP"
            value={`${derived.currentHp}/${derived.maxHp}`}
            subValue="Current / Max"
          />
          <StatCard label="AC" value={derived.armorClass} />
          <StatCard
            label="Initiative"
            value={formatModifier(derived.initiativeBonus)}
            subValue={derived.initiativeBreakdown}
          />
          <StatCard label="Speed" value={`${derived.speed} ft`} />
          <StatCard
            label="Prof Bonus"
            value={formatModifier(derived.proficiencyBonus)}
          />
          <StatCard
            label="Passive Perception"
            value={derived.passivePerception}
          />
        </div>

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

export default CharacterSheet;