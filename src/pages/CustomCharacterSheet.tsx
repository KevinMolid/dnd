import { useState } from "react";
import { Link } from "react-router-dom";

import CharacterInventoryEquipment from "../components/CharacterInventoryEquipment";
import StatCard from "../features/character-sheet/components/StatCard";
import SectionCard from "../features/character-sheet/components/SectionCard";
import CharacterSheetTabs from "../features/character-sheet/components/CharacterSheetTabs";

import type { CharacterSheetTab } from "../features/character-sheet/types";
import type { AbilityKey } from "../types/character";

type CustomTrait = {
  id: string;
  name: string;
  source?: string;
  description?: string;
};

type CustomCharacter = {
  id?: string;
  name: string;
  imageUrl?: string;
  buildMode: "custom";

  level?: number;
  className?: string;
  speciesName?: string;
  backgroundName?: string;

  alignment?: string;
  notes?: string;

  abilityScores?: Record<AbilityKey, number>;

  customStats?: {
    armorClass?: number;
    currentHp?: number;
    maxHp?: number;
    speed?: number;
    proficiencyBonus?: number;
  };

  customTraits?: CustomTrait[];

  equipment?: any[];
  moneyCp?: number;
};

type CustomCharacterSheetProps = {
  characterId?: string;
  character: CustomCharacter;
  backTo: string;
  backLabel: string;
  campaignItemsById: Record<string, any>;
  handleEquipmentChange: (equipment: any[]) => void | Promise<void>;
};

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

const formatModifier = (value: number) => {
  if (value > 0) return `+${value}`;
  return String(value);
};

const CustomCharacterSheet = ({
  character,
  backTo,
  backLabel,
  campaignItemsById,
  handleEquipmentChange,
}: CustomCharacterSheetProps) => {
  const [activeTab, setActiveTab] = useState<CharacterSheetTab>("overview");

  const stats = character.customStats ?? {};
  const abilityScores = character.abilityScores ?? {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  };

  const level = character.level ?? 1;
  const armorClass = stats.armorClass ?? 10;
  const currentHp = stats.currentHp ?? 0;
  const maxHp = stats.maxHp ?? 0;
  const speed = stats.speed ?? 30;
  const proficiencyBonus = stats.proficiencyBonus ?? 2;

  const dexModifier = getModifier(abilityScores.dex ?? 10);
  const wisModifier = getModifier(abilityScores.wis ?? 10);
  const passivePerception = 10 + wisModifier;

  const traits = character.customTraits ?? [];

  const renderOverviewTab = () => (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <SectionCard title="Character">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Class
              </p>
              <p className="mt-1 text-sm text-zinc-200">
                {character.className || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Species / Race
              </p>
              <p className="mt-1 text-sm text-zinc-200">
                {character.speciesName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Background
              </p>
              <p className="mt-1 text-sm text-zinc-200">
                {character.backgroundName || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Alignment
              </p>
              <p className="mt-1 text-sm text-zinc-200">
                {character.alignment || "—"}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Ability Scores">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {abilityKeys.map((key) => {
              const score = abilityScores[key] ?? 10;
              const modifier = getModifier(score);

              return (
                <div
                  key={key}
                  className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {abilityLabels[key]}
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-2xl font-bold text-white">{score}</p>
                    <p className="text-sm text-zinc-400">
                      {formatModifier(modifier)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <div className="space-y-6">
        <SectionCard title="Summary">
          <div className="space-y-3 text-sm text-zinc-300">
            <p>
              <span className="text-zinc-500">Name:</span> {character.name}
            </p>
            <p>
              <span className="text-zinc-500">Level:</span> {level}
            </p>
            <p>
              <span className="text-zinc-500">Type:</span> Custom Character
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );

  const renderCombatTab = () => (
    <div className="space-y-6">
      <SectionCard title="Combat">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Armor Class
            </p>
            <p className="mt-2 text-2xl font-bold text-white">{armorClass}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Hit Points
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              {currentHp}/{maxHp}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Speed
            </p>
            <p className="mt-2 text-2xl font-bold text-white">{speed} ft</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Initiative
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              {formatModifier(dexModifier)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Proficiency
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              {formatModifier(proficiencyBonus)}
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      <SectionCard
        title="Custom Traits"
        right={
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
            {traits.length} total
          </div>
        }
      >
        {traits.length > 0 ? (
          <div className="space-y-3">
            {traits.map((trait) => (
              <div
                key={trait.id}
                className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <p className="font-medium text-white">{trait.name}</p>

                  {trait.source && (
                    <span className="rounded-full border border-white/10 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-400">
                      {trait.source}
                    </span>
                  )}
                </div>

                {trait.description && (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                    {trait.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No custom traits added.</p>
        )}
      </SectionCard>
    </div>
  );

  const renderInventoryTab = () => (
    <div className="space-y-6">
      <CharacterInventoryEquipment
        equipment={character.equipment ?? []}
        onChange={handleEquipmentChange}
        campaignItemsById={campaignItemsById}
        moneyCp={character.moneyCp ?? 0}
      />
    </div>
  );

  const renderSpellsTab = () => (
    <SectionCard title="Spells">
      <p className="text-sm text-zinc-500">
        Custom character spell support has not been added yet. For now, add
        spells as custom traits or notes.
      </p>
    </SectionCard>
  );

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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <Link to={backTo} className="text-zinc-400 hover:text-white">
            ← {backLabel}
          </Link>
        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
              {character.imageUrl ? (
                <img
                  src={character.imageUrl}
                  alt={character.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-zinc-500">
                  {character.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Custom Character
              </p>

              <h1 className="break-words text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {character.name}
              </h1>

              <p className="mt-2 text-sm text-zinc-400">
                Level {level} {character.speciesName || "Custom Species"}{" "}
                {character.className || "Custom Class"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="HP"
            value={`${currentHp}/${maxHp}`}
            subValue="Current / Max"
          />
          <StatCard label="AC" value={armorClass} />
          <StatCard label="Initiative" value={formatModifier(dexModifier)} />
          <StatCard label="Speed" value={`${speed} ft`} />
          <StatCard
            label="Prof Bonus"
            value={formatModifier(proficiencyBonus)}
          />
          <StatCard label="Passive Perception" value={passivePerception} />
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {abilityKeys.map((key) => {
            const score = abilityScores[key] ?? 10;
            const modifier = getModifier(score);

            return (
              <div
                key={key}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"
              >
                <p className="text-xs font-semibold text-zinc-500">
                  {abilityShortLabels[key]}
                </p>
                <p className="mt-1 text-xl font-bold text-white">{score}</p>
                <p className="text-xs text-zinc-400">
                  {formatModifier(modifier)}
                </p>
              </div>
            );
          })}
        </div>

        <CharacterSheetTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "combat" && renderCombatTab()}
        {activeTab === "features" && renderFeaturesTab()}
        {activeTab === "inventory" && renderInventoryTab()}
        {activeTab === "spells" && renderSpellsTab()}
        {activeTab === "notes" && renderNotesTab()}
      </div>
    </div>
  );
};

export default CustomCharacterSheet;
