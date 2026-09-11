import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import CharacterInventoryEquipment from "../components/CharacterInventoryEquipment";

import OverviewDashboard from "../features/character-sheet/components/OverviewDashboard";

import CharacterSheetWorkspace from "../features/character-sheet/components/CharacterSheetWorkspace";

import CharacterSheetHeader from "../features/character-sheet/components/CharacterSheetHeader";

import CharacterQuickStats from "../features/character-sheet/components/CharacterQuickStats";

import SectionCard from "../features/character-sheet/components/SectionCard";

import CharacterProfilePanel from "../features/character-sheet/components/CharacterProfilePanel";

import PlayerNotesPanel from "../features/character-sheet/components/PlayerNotesPanel";

import type {
  CharacterSheetTab,
  DeathSaves,
} from "../features/character-sheet/types";

import { resolveItemFromEquipmentEntry } from "../rulesets/dnd/dnd2024/resolveItem";

import type { AbilityKey, Money } from "../rulesets/dnd/dnd2024/types";

import { spells } from "../rulesets/dnd/dnd2024/data/spells";

import {
  createEmptyCustomSkills,
  createEmptySpellSlots,
  customSkillDefinitions,
} from "../types/customCharacter";

import type {
  CustomCharacter,
  CustomProficiencyLevel,
} from "../types/customCharacter";

type CustomCharacterSheetProps = {
  characterId?: string;

  character: CustomCharacter;

  backTo: string;

  backLabel: string;

  campaignItemsById: Record<string, any>;

  handleEquipmentChange: (equipment: any[]) => void | Promise<void>;

  handleSetHeroicInspiration: (value: boolean) => Promise<void>;

  handleSetDeathSaves: (value: DeathSaves) => Promise<void>;

  handleSetSpellSlotRemaining: (
    level: number,
    remaining: number,
  ) => Promise<void>;
};

const abilityLabels: Record<AbilityKey, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

const defaultAbilityScores: Record<AbilityKey, number> = {
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
};

const defaultMoney: Money = {
  cp: 0,
  sp: 0,
  ep: 0,
  gp: 0,
  pp: 0,
};

const getModifier = (score: number) => Math.floor((score - 10) / 2);

const getProficiencyMultiplier = (level: CustomProficiencyLevel) =>
  level === "expertise" ? 2 : level === "proficient" ? 1 : 0;

const CustomCharacterSheet = ({
  characterId,
  character,
  backTo,
  backLabel,
  campaignItemsById,
  handleEquipmentChange,
  handleSetHeroicInspiration,
  handleSetDeathSaves,
  handleSetSpellSlotRemaining,
}: CustomCharacterSheetProps) => {
  const [activeTab, setActiveTab] = useState<CharacterSheetTab>("inventory");

  const stats = character.customStats ?? {};

  const abilityScores: Record<AbilityKey, number> = {
    ...defaultAbilityScores,
    ...(character.abilityScores ?? {}),
  };

  const level = character.level ?? 1;

  const armorClass = stats.armorClass ?? 10;

  const currentHp = stats.currentHp ?? 0;

  const maxHp = stats.maxHp ?? 0;

  const speed = stats.speed ?? 30;

  const proficiencyBonus = stats.proficiencyBonus ?? 2;

  const customProficiencies = character.customProficiencies;

  const skills = {
    ...createEmptyCustomSkills(),

    ...(customProficiencies?.skills ?? {}),
  };

  const savingThrows = customProficiencies?.savingThrows ?? [];

  const dexModifier = getModifier(abilityScores.dex);

  const perceptionBonus =
    getModifier(abilityScores.wis) +
    proficiencyBonus * getProficiencyMultiplier(skills.perception);

  const passivePerception = 10 + perceptionBonus;

  const money: Money = {
    ...defaultMoney,
    ...(character.money ?? {}),
  };

  const spellcasting = {
    enabled: false,

    ability: null as AbilityKey | null,

    spellSaveDc: 10,

    spellAttackBonus: 0,

    spellSlots: createEmptySpellSlots(),

    spells: [],

    ...(character.customSpellcasting ?? {}),
  };

  const spellsById = useMemo(
    () => Object.fromEntries(spells.map((spell) => [spell.id, spell])),
    [],
  );

  const getSkillBonus = (
    ability: AbilityKey,

    proficiency: CustomProficiencyLevel,
  ) =>
    getModifier(abilityScores[ability]) +
    proficiencyBonus * getProficiencyMultiplier(proficiency);

  const customHitDie = stats.hitDie?.trim();

  const hitDiceLabel = customHitDie
    ? `${stats.hitDiceRemaining ?? level}/${level} ${
        customHitDie.startsWith("d") ? customHitDie : `d${customHitDie}`
      }`
    : undefined;

  const customAttacks = (character.equipment ?? [])
    .filter((entry) => entry.equipped || (entry.equippedSlots?.length ?? 0) > 0)
    .map((entry) => {
      const item = resolveItemFromEquipmentEntry(entry, campaignItemsById);

      if (!item?.weapon) {
        return null;
      }

      const damage = item.weapon.damage;

      return {
        id: entry.instanceId,

        name: item.name ?? entry.name ?? "Weapon",

        attackBonus: undefined,

        damage: `${damage.dice.count}d${damage.dice.die} ${damage.damageType}`,

        properties: item.weapon.properties ?? [],
      };
    })
    .filter((attack): attack is NonNullable<typeof attack> => Boolean(attack));

  const quickSpells = spellcasting.spells
    .map((savedSpell) => {
      const resolved = spellsById[savedSpell.spellId];

      return (
        resolved ?? {
          id: savedSpell.spellId,

          spellId: savedSpell.spellId,

          name: savedSpell.name,

          level: savedSpell.level,
        }
      );
    })
    .sort(
      (a, b) => (a.level ?? 0) - (b.level ?? 0) || a.name.localeCompare(b.name),
    );

  const customSpellSlots = Object.entries(spellcasting.spellSlots)
    .filter(([, slot]) => slot.max > 0)
    .map(([spellLevel, slot]) => ({
      level: Number(spellLevel),

      max: slot.max,

      remaining: Math.max(0, Math.min(slot.max, slot.remaining)),
    }));

  const features = (character.customTraits ?? []).map((trait) => ({
    id: trait.id,

    name: trait.name,

    description: trait.description,
  }));

  const featureActions = features
    .filter((feature) => {
      const text = feature.description?.toLowerCase() ?? "";

      return text.includes("as an action") || text.includes("take an action");
    })
    .map((feature) => ({
      id: `action-${feature.id}`,

      name: feature.name,

      description: feature.description,
    }));

  const featureBonusActions = features
    .filter((feature) =>
      feature.description?.toLowerCase().includes("bonus action"),
    )
    .map((feature) => ({
      id: `bonus-${feature.id}`,

      name: feature.name,

      description: feature.description,
    }));

  const featureReactions = features
    .filter((feature) =>
      feature.description?.toLowerCase().includes("reaction"),
    )
    .map((feature) => ({
      id: `reaction-${feature.id}`,

      name: feature.name,

      description: feature.description,
    }));

  const renderFeaturesTab = () => (
    <SectionCard title="Features & Traits">
      {character.customTraits?.length ? (
        <div className="grid gap-1.5 sm:grid-cols-2">
          {character.customTraits.map((trait) => (
            <div
              key={trait.id}
              className="rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2"
            >
              <div className="flex items-start justify-between gap-3">
                <strong className="text-[10px] text-white">{trait.name}</strong>

                {trait.source ? (
                  <span className="shrink-0 text-[7px] uppercase tracking-[0.08em] text-zinc-600">
                    {trait.source}
                  </span>
                ) : null}
              </div>

              {trait.description ? (
                <p className="mt-1 line-clamp-2 text-[8px] leading-4 text-zinc-500">
                  {trait.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-zinc-600">No features added.</p>
      )}
    </SectionCard>
  );

  const renderInventoryTab = () => (
    <CharacterInventoryEquipment
      equipment={character.equipment ?? []}
      onChange={handleEquipmentChange}
      campaignItemsById={campaignItemsById}
      money={money}
    />
  );

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
      characterId={characterId}
      initialValue={character.playerNotes}
    />
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-5 lg:px-6">
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
          level={level}
          speciesName={character.speciesName}
          className={character.className}
          backgroundName={character.backgroundName}
        />

        <CharacterQuickStats
          currentHp={currentHp}
          maxHp={maxHp}
          armorClass={armorClass}
          initiative={dexModifier}
          speed={speed}
          proficiencyBonus={proficiencyBonus}
          passivePerception={passivePerception}
          passiveInsight={10 + getSkillBonus("wis", skills.insight)}
          passiveInvestigation={10 + getSkillBonus("int", skills.investigation)}
          abilityScores={abilityScores}
          savingThrowProficiencies={savingThrows}
          skills={customSkillDefinitions.map((skill) => {
            const proficiency = skills[skill.id];

            return {
              id: skill.id,

              name: skill.name,

              ability: skill.ability.toUpperCase(),

              bonus: getSkillBonus(skill.ability, proficiency),

              proficient:
                proficiency === "proficient" || proficiency === "expertise",

              expertise: proficiency === "expertise",
            };
          })}
          conditions={character.conditions ?? []}
          heroicInspiration={character.heroicInspiration ?? false}
          onHeroicInspirationChange={handleSetHeroicInspiration}
          deathSaves={{
            successes: character.deathSaves?.successes ?? 0,

            failures: character.deathSaves?.failures ?? 0,
          }}
          onDeathSavesChange={handleSetDeathSaves}
          hitDiceLabel={hitDiceLabel}
          languages={customProficiencies?.languages ?? []}
          armorProficiencies={customProficiencies?.armor ?? []}
          weaponProficiencies={customProficiencies?.weapons ?? []}
          toolProficiencies={customProficiencies?.tools ?? []}
        />

        <CharacterSheetWorkspace
          activeTab={activeTab}
          onTabChange={setActiveTab}
          playPanel={
            <OverviewDashboard
              attacks={customAttacks}
              spells={spellcasting.enabled ? quickSpells : []}
              spellcasting={
                spellcasting.enabled
                  ? {
                      abilityLabel: spellcasting.ability
                        ? abilityLabels[spellcasting.ability]
                        : undefined,

                      saveDc: spellcasting.spellSaveDc,

                      attackBonus: spellcasting.spellAttackBonus,

                      slots: customSpellSlots,
                    }
                  : undefined
              }
              onSpellSlotChange={handleSetSpellSlotRemaining}
              actions={featureActions}
              bonusActions={featureBonusActions}
              reactions={featureReactions}
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

export default CustomCharacterSheet;
