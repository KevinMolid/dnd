import { useState } from "react";

import { Link, useLocation, useParams } from "react-router-dom";

import CustomCharacterSheet from "./CustomCharacterSheet";

import CharacterInventoryEquipment from "../components/CharacterInventoryEquipment";

import { classesById } from "../rulesets/dnd/dnd2024/helpers";

import type { AbilityKey } from "../rulesets/dnd/dnd2024/types";

import { useCharacterSheetData } from "../features/character-sheet/hooks/useCharacterSheetData";

import type {
  CharacterSheetTab,
  TraitGroupKey,
} from "../features/character-sheet/types";

import SectionCard from "../features/character-sheet/components/SectionCard";

import CharacterSheetHeader from "../features/character-sheet/components/CharacterSheetHeader";

import CharacterBreadcrumbs from "../features/character-sheet/components/CharacterBreadcrumbs";

import CharacterQuickStats from "../features/character-sheet/components/CharacterQuickStats";

import CharacterSheetWorkspace from "../features/character-sheet/components/CharacterSheetWorkspace";

import OverviewDashboard from "../features/character-sheet/components/OverviewDashboard";

import TraitGroupSection from "../features/character-sheet/components/TraitGroupSection";

import CharacterProfilePanel from "../features/character-sheet/components/CharacterProfilePanel";

import { collectFeatureActions } from "../features/character-sheet/utils/featureActionHelpers";

import PlayerNotesPanel from "../features/character-sheet/components/PlayerNotesPanel";

import { abilityFullLabels } from "../features/character-sheet/utils/characterSheetConstants";

import { formatLabel } from "../features/character-sheet/utils/characterSheetHelpers";

const CharacterSheet = () => {
  const { characterId } = useParams();

  const location = useLocation();

  const [activeTab, setActiveTab] = useState<CharacterSheetTab>("inventory");

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
    handleSetHeroicInspiration,
    handleSetDeathSaves,
    handleSetCurrentHp,
    handleSetConditions,
    handleSetDefenses,
    handleSetSpellSlotRemaining,
    handleSetPlayerNotes,

    handleApplyDecision,
    handleCompleteLevelUp,

    handleShortRest,
    handleLongRest,
  } = useCharacterSheetData(characterId);

  const navigationState = location.state as
    | {
        from?: string;
        label?: string;
      }
    | undefined;

  const backTo =
    navigationState?.from ??
    (character?.campaignId
      ? `/campaigns/${character.campaignId}/characters`
      : "/");

  const backLabel =
    navigationState?.label ??
    (character?.campaignId ? "Back to campaign" : "Back to home");

  const toggleTraitGroup = (key: TraitGroupKey) => {
    setOpenTraitGroups((current) => ({
      ...current,
      [key]: !current[key],
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

  if (error || !character) {
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

  if (character.buildMode === "custom") {
    return (
      <CustomCharacterSheet
        characterId={characterId}
        character={character as any}
        backTo={backTo}
        backLabel={backLabel}
        campaignItemsById={campaignItemsById}
        handleEquipmentChange={handleEquipmentChange}
        handleSetCurrentHp={handleSetCurrentHp}
        handleSetConditions={handleSetConditions}
        handleSetDefenses={handleSetDefenses}
        handleSetHeroicInspiration={handleSetHeroicInspiration}
        handleSetDeathSaves={handleSetDeathSaves}
        handleSetSpellSlotRemaining={handleSetSpellSlotRemaining}
        handleSetPlayerNotes={handleSetPlayerNotes}
        handleShortRest={handleShortRest}
        handleLongRest={handleLongRest}
      />
    );
  }

  if (!derived) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            Could not derive character data.
          </div>
        </div>
      </div>
    );
  }

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

  const insight = derived.skillRows.find((skill) => skill.id === "insight");

  const investigation = derived.skillRows.find(
    (skill) => skill.id === "investigation",
  );

  const hitDie = classDefinition?.hitDie ?? classDefinition?.hitDice;

  const hitDieText =
    typeof hitDie === "number"
      ? `d${hitDie}`
      : typeof hitDie === "string"
        ? hitDie.startsWith("d")
          ? hitDie
          : `d${hitDie}`
        : undefined;

  const hitDiceLabel = hitDieText
    ? `${character.hitDiceRemaining ?? character.level}/${character.level} ${hitDieText}`
    : undefined;

  const guidedSpellSlots = Object.entries(derived.spellSlots)
    .map(([spellLevel, slotCount]) => {
      const level = Number(spellLevel);

      const max = Number(slotCount);

      const storedRemaining = character.spellSlotsRemaining?.[spellLevel];

      const remaining =
        typeof storedRemaining === "number"
          ? Math.max(0, Math.min(max, storedRemaining))
          : max;

      return {
        level,
        max,
        remaining,
      };
    })
    .filter((slot) => slot.max > 0);

  const weaponAttacks = derived.equippedWeaponAttacks.map((attack) => ({
    id: attack.instanceId,

    name: attack.name,

    attackBonus: attack.attackBonus,

    damage: attack.damage,

    isOffHand: attack.isOffHand,

    isThrown: attack.isThrown,

    isTwoHanded: attack.isTwoHanded,

    properties: attack.properties,

    ability: attack.ability as AbilityKey,

    mastery: attack.mastery,

    range: attack.range
      ? {
          normal: attack.range.normal,

          long: attack.range.long,
        }
      : null,
  }));

  /*
   * D&D 2024 characters can always make an Unarmed Strike.
   *
   * Base damage is 1 + Strength modifier bludgeoning damage.
   * The attack roll uses Strength + Proficiency Bonus.
   *
   * Grapple and Shove use the same Unarmed Strike but force a
   * Strength or Dexterity saving throw against:
   * 8 + Strength modifier + Proficiency Bonus.
   */
  const unarmedStrengthModifier = Math.floor(
    (derived.finalAbilityScores.str - 10) / 2,
  );

  const unarmedSaveDc = 8 + derived.proficiencyBonus + unarmedStrengthModifier;

  const unarmedAttack = {
    id: "unarmed-strike",

    name: "Unarmed Strike",

    attackBonus: derived.genericAttackBonuses.unarmed,

    damage: `${Math.max(0, 1 + unarmedStrengthModifier)} bludgeoning`,

    isOffHand: false,

    isThrown: false,

    isTwoHanded: false,

    properties: [`Grapple DC ${unarmedSaveDc}`, `Shove DC ${unarmedSaveDc}`],

    ability: "str" as AbilityKey,

    mastery: undefined,

    range: null,
  };

  const specialAttacks =
    derived.dragonbornAncestryName && derived.dragonbornDamageType
      ? [
          {
            id: "dragonborn-breath-weapon",

            name: "Breath Weapon",

            saveDc: derived.dragonbornBreathWeaponDc ?? undefined,

            damage: `${derived.dragonbornBreathWeaponDamage ?? "—"} ${formatLabel(
              derived.dragonbornDamageType,
            )}`,

            isSpecial: true,

            rangeLabel: "15 ft cone / 30 × 5 ft line",

            usageLabel: `${derived.proficiencyBonus} / Long Rest`,
          },
        ]
      : [];

  const attacks = [unarmedAttack, ...weaponAttacks, ...specialAttacks];

  const derivedDefenses = derived.resistances.map(
    (resistance) => `${formatLabel(resistance)} Resistance`,
  );

  const manualDefenses = character.defenses ?? [];

  const defenses = Array.from(new Set([...derivedDefenses, ...manualDefenses]));

  const combinedSpells = [
    ...derived.groupedTieflingLegacySpells.flatMap((group) => group.spells),

    ...derived.groupedSpells.flatMap((group) => group.spells),
  ];

  const seenSpellIds = new Set<string>();

  const quickSpells = combinedSpells.filter((spell) => {
    const id = spell.spellId ?? spell.id ?? spell.name;

    if (seenSpellIds.has(id)) {
      return false;
    }

    seenSpellIds.add(id);

    return true;
  });

  /*
   * Play-panel actions are now entirely metadata-driven.
   *
   * A trait may have:
   * - one primary activation via trait.activation
   * - zero or more secondary playable actions via trait.actions
   *
   * Rules prose is never parsed to decide where something belongs.
   */
  const features = derived.traitGroups.flatMap((group) =>
    group.traits.map((trait) => ({
      id: trait.id ?? `${group.key}-${trait.name}`,

      name: trait.name ?? "Feature",

      description: trait.description,

      activation: trait.activation,

      actions: trait.actions ?? [],
    })),
  );

  const collectedFeatureActions = collectFeatureActions(features);

  const specialAttackNames = new Set(
    specialAttacks.map((attack) => attack.name.toLowerCase()),
  );

  const characterActions = collectedFeatureActions.actions.filter(
    (action) => !specialAttackNames.has(action.name.toLowerCase()),
  );

  const characterBonusActions = collectedFeatureActions.bonusActions;

  const characterReactions = collectedFeatureActions.reactions;

  const activatedFeatureNames = new Set(
    [...characterActions, ...characterBonusActions, ...characterReactions].map(
      (item) => item.name.toLowerCase(),
    ),
  );

  const combatOptions = derived.combatFeatures
    .filter((feature) => !activatedFeatureNames.has(feature.name.toLowerCase()))
    .map((feature) => ({
      id: `combat-option-${feature.id}`,

      name: feature.name,

      description: feature.summary,

      value: feature.value ?? undefined,
    }));

  const renderFeaturesTab = () => (
    <div className="space-y-3">
      {derived.pendingSteps.length > 0 ? (
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
                    {step.type === "subclass-choice" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyDecision(step.level, {
                            subclassId: "assassin",
                          })
                        }
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black"
                      >
                        Choose
                      </button>
                    ) : null}

                    {step.type === "feat-choice" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyDecision(step.level, {
                            featId: "alert",
                          })
                        }
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black"
                      >
                        Choose
                      </button>
                    ) : null}

                    {step.type === "expertise-choice" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyDecision(step.level, {
                            expertise: ["stealth", "perception"],
                          })
                        }
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black"
                      >
                        Choose
                      </button>
                    ) : null}

                    {step.type === "language-choice" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyDecision(step.level, {
                            language: "elvish",
                          })
                        }
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black"
                      >
                        Choose
                      </button>
                    ) : null}

                    {step.type === "weapon-mastery-choice" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyDecision(step.level, {
                            weaponMastery: ["dagger", "shortsword"],
                          })
                        }
                        className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black"
                      >
                        Choose
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleCompleteLevelUp}
              className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black"
            >
              Complete Level Up
            </button>
          </div>
        </SectionCard>
      ) : null}

      {derived.traitGroups.length > 0 ? (
        <div className="grid gap-2 lg:grid-cols-2 lg:items-start">
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
        <p className="p-3 text-xs text-zinc-600">No traits found.</p>
      )}
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

  const renderCharacterTab = () => (
    <CharacterProfilePanel
      age={character.age}
      height={character.height}
      weight={character.weight}
      eyes={character.eyes}
      skin={character.skin}
      hair={character.hair}
      alignment={character.alignment}
      appearance={character.characterAppearance}
      connections={character.alliesAndOrganizations}
      backstory={character.characterBackstory ?? character.notes}
      personalityTraits={character.personalityTraits}
      ideals={character.ideals}
      bonds={character.bonds}
      flaws={character.flaws}
    />
  );

  const renderNotesTab = () => (
    <PlayerNotesPanel
      value={character.playerNotes}
      onSave={handleSetPlayerNotes}
    />
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-5 lg:px-6">
        <CharacterBreadcrumbs
          characterName={character.name}
          campaignId={character.campaignId}
          fallbackTo={backTo}
        />

        <CharacterSheetHeader
          characterId={characterId}
          name={character.name}
          imageUrl={character.imageUrl}
          level={character.level}
          speciesName={derived.speciesName}
          className={derived.className}
          subclassName={derived.subclassName}
          backgroundName={derived.backgroundName}
          currentHp={derived.currentHp}
          maxHp={derived.maxHp}
          rest={{
            hitDieSize:
              typeof classDefinition?.hitDie === "number"
                ? classDefinition.hitDie
                : Number(classDefinition?.hitDie) || undefined,
            hitDiceRemaining: character.hitDiceRemaining ?? character.level,
            hitDiceMax: character.level,
            constitutionModifier: Math.floor(
              (derived.finalAbilityScores.con - 10) / 2,
            ),
            onShortRest: handleShortRest,
            onLongRest: handleLongRest,
          }}
        />

        <CharacterQuickStats
          currentHp={derived.currentHp}
          maxHp={derived.maxHp}
          onCurrentHpChange={handleSetCurrentHp}
          armorClass={derived.armorClass}
          initiative={derived.initiativeBonus}
          initiativeSubValue={derived.initiativeBreakdown}
          speed={derived.speed}
          proficiencyBonus={derived.proficiencyBonus}
          passivePerception={derived.passivePerception}
          passiveInsight={insight ? 10 + insight.total : undefined}
          passiveInvestigation={
            investigation ? 10 + investigation.total : undefined
          }
          abilityScores={derived.finalAbilityScores}
          savingThrowProficiencies={savingThrowProficiencies}
          skills={derived.skillRows.map((skill) => ({
            id: skill.id,

            name: skill.name,

            ability: skill.ability.toUpperCase(),

            bonus: skill.total,

            proficient: skill.proficient,

            expertise: skill.expertise,
          }))}
          conditions={character.conditions ?? []}
          onConditionsChange={handleSetConditions}
          defenses={defenses}
          lockedDefenses={derivedDefenses}
          onDefensesChange={handleSetDefenses}
          heroicInspiration={character.heroicInspiration ?? false}
          onHeroicInspirationChange={handleSetHeroicInspiration}
          deathSaves={{
            successes:
              character.deathSaves?.successes ??
              character.deathSaveSuccesses ??
              0,

            failures:
              character.deathSaves?.failures ??
              character.deathSaveFailures ??
              0,
          }}
          onDeathSavesChange={handleSetDeathSaves}
          hitDiceLabel={hitDiceLabel}
          progress={{
            level: derived.xpProgress.level,

            xp: derived.xp,

            nextLevelXp: derived.xpProgress.nextLevelXp,

            progressPercent: derived.xpProgress.progressPercent,
          }}
          languages={derived.languages}
          armorProficiencies={armorProficiencies}
          weaponProficiencies={weaponProficiencies}
          toolProficiencies={derived.toolProficiencies}
        />

        <CharacterSheetWorkspace
          activeTab={activeTab}
          onTabChange={setActiveTab}
          playPanel={
            <OverviewDashboard
              attacks={attacks}
              spells={quickSpells}
              spellcasting={{
                abilityLabel: derived.spellcastingAbility
                  ? abilityFullLabels[derived.spellcastingAbility]
                  : undefined,

                saveDc: derived.spellSaveDc,

                attackBonus: derived.spellAttackBonus,

                slots: guidedSpellSlots,
              }}
              onSpellSlotChange={handleSetSpellSlotRemaining}
              actions={characterActions}
              bonusActions={characterBonusActions}
              reactions={characterReactions}
              combatOptions={combatOptions}
            />
          }
        >
          {activeTab === "inventory" ? renderInventoryTab() : null}

          {activeTab === "features" ? renderFeaturesTab() : null}

          {activeTab === "character" ? renderCharacterTab() : null}

          {activeTab === "notes" ? renderNotesTab() : null}
        </CharacterSheetWorkspace>
      </div>
    </div>
  );
};

export default CharacterSheet;
