import { useState } from "react";
import { Link } from "react-router-dom";

import Avatar from "../components/Avatar";

import CharacterInventoryEquipment from "../components/CharacterInventoryEquipment";

import StatCard from "../features/character-sheet/components/StatCard";

import SectionCard from "../features/character-sheet/components/SectionCard";

import CharacterSheetTabs from "../features/character-sheet/components/CharacterSheetTabs";

import type { CharacterSheetTab } from "../features/character-sheet/types";

import type { AbilityKey, Money } from "../rulesets/dnd/dnd2024/types";

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

const defaultAbilityScores = {
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

const formatModifier = (value: number) =>
  value >= 0 ? `+${value}` : `${value}`;

const getProficiencyMultiplier = (level: CustomProficiencyLevel) =>
  level === "expertise" ? 2 : level === "proficient" ? 1 : 0;

export default function CustomCharacterSheet({
  characterId,
  character,
  backTo,
  backLabel,
  campaignItemsById,
  handleEquipmentChange,
}: CustomCharacterSheetProps) {
  const [activeTab, setActiveTab] = useState<CharacterSheetTab>("overview");

  const stats = character.customStats ?? {};

  const abilityScores = {
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

  const money = {
    ...defaultMoney,

    ...(character.money ?? {}),
  };

  const spellcasting = {
    enabled: false,

    ability: null,

    spellSaveDc: 10,

    spellAttackBonus: 0,

    spellSlots: createEmptySpellSlots(),

    spells: [],

    ...(character.customSpellcasting ?? {}),
  };

  const getSkillBonus = (
    ability: AbilityKey,
    proficiency: CustomProficiencyLevel,
  ) =>
    getModifier(abilityScores[ability]) +
    proficiencyBonus * getProficiencyMultiplier(proficiency);

  const renderOverviewTab = () => (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <SectionCard title="Character">
          <div className="grid gap-4 sm:grid-cols-2">
            <Info label="Class" value={character.className} />

            <Info label="Species / Race" value={character.speciesName} />

            <Info label="Background" value={character.backgroundName} />

            <Info label="Alignment" value={character.alignment} />
          </div>
        </SectionCard>

        <SectionCard title="Saving Throws">
          <div className="grid gap-2 sm:grid-cols-3">
            {abilityKeys.map((ability) => {
              const proficient = savingThrows.includes(ability);

              const bonus =
                getModifier(abilityScores[ability]) +
                (proficient ? proficiencyBonus : 0);

              return (
                <div
                  key={ability}
                  className="flex justify-between rounded-xl border border-white/10 bg-zinc-900 p-3"
                >
                  <div>
                    <p className="text-sm text-white">
                      {abilityLabels[ability]}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {proficient ? "Proficient" : "Not proficient"}
                    </p>
                  </div>

                  <strong>{formatModifier(bonus)}</strong>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Skills">
          <div className="grid gap-2 sm:grid-cols-2">
            {customSkillDefinitions.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900 p-3"
              >
                <div>
                  <p className="text-sm text-white">{skill.name}</p>

                  <p className="text-xs text-zinc-500">
                    {abilityShortLabels[skill.ability]}

                    {skills[skill.id] !== "none" &&
                      ` · ${
                        skills[skill.id] === "expertise"
                          ? "Expertise"
                          : "Proficient"
                      }`}
                  </p>
                </div>

                <strong>
                  {formatModifier(
                    getSkillBonus(skill.ability, skills[skill.id]),
                  )}
                </strong>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="space-y-6">
        <SectionCard title="Languages">
          <TagList items={customProficiencies?.languages ?? []} />
        </SectionCard>

        <SectionCard title="Armor Proficiencies">
          <TagList items={customProficiencies?.armor ?? []} />
        </SectionCard>

        <SectionCard title="Weapon Proficiencies">
          <TagList items={customProficiencies?.weapons ?? []} />
        </SectionCard>

        <SectionCard title="Tool Proficiencies">
          <TagList items={customProficiencies?.tools ?? []} />
        </SectionCard>

        <SectionCard title="Currency">
          <div className="flex flex-wrap gap-2">
            {(["cp", "sp", "ep", "gp", "pp"] as const).map((currency) => (
              <span
                key={currency}
                className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs"
              >
                {money[currency] ?? 0} {currency.toUpperCase()}
              </span>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );

  const renderCombatTab = () => (
    <SectionCard title="Combat">
      <div className="grid gap-4 sm:grid-cols-5">
        <CombatStat label="Armor Class" value={armorClass} />

        <CombatStat label="Hit Points" value={`${currentHp}/${maxHp}`} />

        <CombatStat label="Speed" value={`${speed} ft`} />

        <CombatStat label="Initiative" value={formatModifier(dexModifier)} />

        <CombatStat
          label="Proficiency"
          value={formatModifier(proficiencyBonus)}
        />
      </div>
    </SectionCard>
  );

  const renderFeaturesTab = () => (
    <SectionCard title="Features & Traits">
      {character.customTraits?.length ? (
        <div className="space-y-3">
          {character.customTraits.map((trait) => (
            <div
              key={trait.id}
              className="rounded-xl border border-white/10 bg-zinc-900 p-4"
            >
              <div className="flex justify-between gap-3">
                <strong>{trait.name}</strong>

                {trait.source ? (
                  <span className="text-xs text-zinc-500">{trait.source}</span>
                ) : null}
              </div>

              {trait.description ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                  {trait.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">No features added.</p>
      )}
    </SectionCard>
  );

  const renderInventoryTab = () => (
    <CharacterInventoryEquipment
      equipment={character.equipment ?? []}
      onChange={handleEquipmentChange}
      campaignItemsById={campaignItemsById}
      moneyCp={money.cp ?? 0}
    />
  );

  const renderSpellsTab = () => {
    if (!spellcasting.enabled) {
      return (
        <SectionCard title="Spells">
          <p className="text-sm text-zinc-500">
            This character does not have spellcasting enabled.
          </p>
        </SectionCard>
      );
    }

    return (
      <div className="space-y-6">
        <SectionCard title="Spellcasting">
          <div className="grid gap-4 sm:grid-cols-3">
            <CombatStat
              label="Spellcasting Ability"
              value={
                spellcasting.ability
                  ? abilityShortLabels[spellcasting.ability]
                  : "—"
              }
            />

            <CombatStat
              label="Spell Save DC"
              value={spellcasting.spellSaveDc}
            />

            <CombatStat
              label="Spell Attack Bonus"
              value={formatModifier(spellcasting.spellAttackBonus)}
            />
          </div>
        </SectionCard>

        <SectionCard title="Spell Slots">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
            {Array.from(
              {
                length: 9,
              },

              (_, index) => index + 1,
            ).map((level) => {
              const slot = spellcasting.spellSlots[String(level)];

              return (
                <div
                  key={level}
                  className="rounded-xl border border-white/10 bg-zinc-900 p-3 text-center"
                >
                  <p className="text-xs text-zinc-500">Level {level}</p>

                  <p className="mt-1 font-bold text-white">
                    {slot?.remaining ?? 0}/{slot?.max ?? 0}
                  </p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((spellLevel) => {
          const spells = spellcasting.spells
            .filter((spell) => spell.level === spellLevel)
            .sort((a, b) => a.name.localeCompare(b.name));

          if (spells.length === 0) {
            return null;
          }

          return (
            <SectionCard
              key={spellLevel}
              title={
                spellLevel === 0 ? "Cantrips" : `Level ${spellLevel} Spells`
              }
            >
              <div className="grid gap-2 sm:grid-cols-2">
                {spells.map((spell) => (
                  <div
                    key={spell.spellId}
                    className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3"
                  >
                    <p className="font-medium text-white">{spell.name}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          );
        })}
      </div>
    );
  };

  const renderNotesTab = () => (
    <div className="space-y-6">
      <SectionCard title="Character Appearance">
        <LongText value={character.characterAppearance} />
      </SectionCard>

      <SectionCard title="Allies & Organizations">
        <LongText value={character.alliesAndOrganizations} />
      </SectionCard>

      <SectionCard title="Character Backstory">
        <LongText value={character.characterBackstory || character.notes} />
      </SectionCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={backTo}
            className="text-zinc-400 transition hover:text-white"
          >
            ← {backLabel}
          </Link>

          {characterId ? (
            <Link
              to={`/characters/${characterId}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
            >
              <i className="fa-solid fa-pen-to-square" />
              Edit Character
            </Link>
          ) : null}
        </div>

        <div className="my-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-5">
            <Avatar
              src={character.imageUrl}
              name={character.name}
              className="h-24 w-24 rounded-2xl"
            />

            <div>
              <h1 className="text-3xl font-bold">{character.name}</h1>

              <p className="mt-2 text-zinc-400">
                Level {level} {character.speciesName} {character.className}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-6">
          <StatCard label="HP" value={`${currentHp}/${maxHp}`} />

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
          {abilityKeys.map((ability) => (
            <div
              key={ability}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
            >
              <p className="text-xs text-zinc-500">
                {abilityShortLabels[ability]}
              </p>

              <p className="text-xl font-bold">{abilityScores[ability]}</p>

              <p className="text-xs text-zinc-400">
                {formatModifier(getModifier(abilityScores[ability]))}
              </p>
            </div>
          ))}
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
}

const Info = ({
  label,
  value,
}: {
  label: string;

  value?: string;
}) => (
  <div>
    <p className="text-xs font-semibold uppercase text-zinc-500">{label}</p>

    <p className="mt-1 text-sm text-zinc-200">{value || "—"}</p>
  </div>
);

const CombatStat = ({
  label,
  value,
}: {
  label: string;

  value: string | number;
}) => (
  <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
    <p className="text-xs uppercase text-zinc-500">{label}</p>

    <p className="mt-2 text-2xl font-bold">{value}</p>
  </div>
);

const TagList = ({ items }: { items: string[] }) =>
  items.length ? (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs"
        >
          {item}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-sm text-zinc-500">None</p>
  );

const LongText = ({ value }: { value?: string }) =>
  value ? (
    <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
      {value}
    </p>
  ) : (
    <p className="text-sm text-zinc-500">Nothing entered.</p>
  );
