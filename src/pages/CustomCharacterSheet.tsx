import { useMemo, useState } from "react";

import { Link } from "react-router-dom";

import CharacterInventoryEquipment from "../components/CharacterInventoryEquipment";

import OverviewDashboard from "../features/character-sheet/components/OverviewDashboard";

import { resolveItemFromEquipmentEntry } from "../rulesets/dnd/dnd2024/resolveItem";

import SpellTooltip from "../components/SpellTooltip";

import CharacterSheetHeader from "../features/character-sheet/components/CharacterSheetHeader";

import CharacterQuickStats from "../features/character-sheet/components/CharacterQuickStats";

import SectionCard from "../features/character-sheet/components/SectionCard";

import CharacterSheetTabs from "../features/character-sheet/components/CharacterSheetTabs";

import type { CharacterSheetTab } from "../features/character-sheet/types";

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

const formatModifier = (value: number) =>
  value >= 0 ? `+${value}` : `${value}`;

const getProficiencyMultiplier = (level: CustomProficiencyLevel) =>
  level === "expertise" ? 2 : level === "proficient" ? 1 : 0;

const CustomCharacterSheet = ({
  characterId,
  character,
  backTo,
  backLabel,
  campaignItemsById,
  handleEquipmentChange,
}: CustomCharacterSheetProps) => {
  const [activeTab, setActiveTab] = useState<CharacterSheetTab>("overview");

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

    ability: null,

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

  const renderOverviewTab = () => {
    const customAttacks = (character.equipment ?? [])
      .filter(
        (entry) => entry.equipped || (entry.equippedSlots?.length ?? 0) > 0,
      )
      .map((entry) => {
        const item = resolveItemFromEquipmentEntry(entry, campaignItemsById);

        if (!item?.weapon) {
          return null;
        }

        const damage = item.weapon.damage;

        const damageLabel = `${damage.dice.count}d${damage.dice.die} ${damage.damageType}`;

        return {
          id: entry.instanceId,

          name: item.name ?? entry.name ?? "Weapon",

          /*
           * Custom mode currently doesn't store a
           * manual total weapon attack bonus.
           *
           * Do not guess it here. Once custom
           * attacks become editable, this can be
           * supplied properly.
           */
          attackBonus: undefined,

          damage: damageLabel,

          detail: item.weapon.properties
            ?.map((property) =>
              property
                .split("-")
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" "),
            )
            .join(" · "),
        };
      })
      .filter((attack): attack is NonNullable<typeof attack> =>
        Boolean(attack),
      );

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
        (a, b) =>
          (a.level ?? 0) - (b.level ?? 0) || a.name.localeCompare(b.name),
      );

    const conditions =
      (
        character as CustomCharacter & {
          conditions?: string[];
        }
      ).conditions ?? [];

    const moneyParts: string[] = [];

    if ((money.pp ?? 0) > 0) {
      moneyParts.push(`${money.pp} PP`);
    }

    if ((money.gp ?? 0) > 0) {
      moneyParts.push(`${money.gp} GP`);
    }

    if ((money.ep ?? 0) > 0) {
      moneyParts.push(`${money.ep} EP`);
    }

    if ((money.sp ?? 0) > 0) {
      moneyParts.push(`${money.sp} SP`);
    }

    if ((money.cp ?? 0) > 0 || moneyParts.length === 0) {
      moneyParts.push(`${money.cp ?? 0} CP`);
    }

    return (
      <OverviewDashboard
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
        attacks={customAttacks}
        spells={spellcasting.enabled ? quickSpells : []}
        conditions={conditions}
        features={(character.customTraits ?? []).map((trait) => ({
          id: trait.id,

          name: trait.name,

          source: trait.source,

          description: trait.description,
        }))}
        moneyLabel={moneyParts.join(" · ")}
      />
    );
  };

  const renderCombatTab = () => (
    <SectionCard title="Combat">
      <div className="grid gap-2 sm:grid-cols-5">
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
        <div className="grid gap-2 sm:grid-cols-2">
          {character.customTraits.map((trait) => (
            <div
              key={trait.id}
              className="rounded-xl border border-white/10 bg-zinc-900/60 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <strong className="text-sm text-white">{trait.name}</strong>

                {trait.source ? (
                  <span className="shrink-0 text-[10px] text-zinc-600">
                    {trait.source}
                  </span>
                ) : null}
              </div>

              {trait.description ? (
                <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-zinc-400">
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

  const renderSpellsTab = () => {
    if (!spellcasting.enabled) {
      return (
        <SectionCard title="Spells">
          <p className="text-xs text-zinc-600">
            This character does not currently have spellcasting.
          </p>
        </SectionCard>
      );
    }

    return (
      <div className="space-y-4">
        <SectionCard title="Spellcasting">
          <div className="grid gap-2 sm:grid-cols-3">
            <CombatStat
              label="Spellcasting Ability"
              value={
                spellcasting.ability ? abilityLabels[spellcasting.ability] : "—"
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
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-9">
            {Array.from(
              {
                length: 9,
              },

              (_, index) => index + 1,
            ).map((spellLevel) => {
              const slot = spellcasting.spellSlots[String(spellLevel)];

              return (
                <div
                  key={spellLevel}
                  className="rounded-lg bg-zinc-900/60 px-2 py-2 text-center"
                >
                  <p className="text-[9px] text-zinc-600">L{spellLevel}</p>

                  <p className="mt-1 text-xs font-semibold text-white">
                    {slot?.remaining ?? 0}/{slot?.max ?? 0}
                  </p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((spellLevel) => {
          const levelSpells = spellcasting.spells
            .filter((spell) => spell.level === spellLevel)
            .sort((a, b) => a.name.localeCompare(b.name));

          if (levelSpells.length === 0) {
            return null;
          }

          return (
            <SectionCard
              key={spellLevel}
              title={
                spellLevel === 0 ? "Cantrips" : `Level ${spellLevel} Spells`
              }
            >
              <div className="flex flex-wrap gap-2">
                {levelSpells.map((savedSpell) => {
                  const resolvedSpell = spellsById[savedSpell.spellId];

                  const tooltipSpell = resolvedSpell ?? {
                    id: savedSpell.spellId,

                    spellId: savedSpell.spellId,

                    name: savedSpell.name,

                    level: savedSpell.level,
                  };

                  return (
                    <SpellTooltip key={savedSpell.spellId} spell={tooltipSpell}>
                      <div className="min-w-[150px] rounded-xl border border-white/10 bg-zinc-900/60 px-3 py-2.5 transition hover:bg-zinc-900">
                        <p className="text-xs font-medium text-white">
                          {tooltipSpell.name}
                        </p>

                        {resolvedSpell?.school ? (
                          <p className="mt-1 text-[10px] text-zinc-600">
                            {resolvedSpell.school}
                          </p>
                        ) : null}
                      </div>
                    </SpellTooltip>
                  );
                })}
              </div>
            </SectionCard>
          );
        })}
      </div>
    );
  };

  const renderNotesTab = () => (
    <div className="space-y-4">
      <SectionCard title="Character Details">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
          <Info label="Age" value={character.age} />

          <Info label="Height" value={character.height} />

          <Info label="Weight" value={character.weight} />

          <Info label="Eyes" value={character.eyes} />

          <Info label="Skin" value={character.skin} />

          <Info label="Hair" value={character.hair} />
        </div>

        {character.alignment ? (
          <div className="mt-3 border-t border-white/10 pt-3">
            <Info label="Alignment" value={character.alignment} />
          </div>
        ) : null}
      </SectionCard>

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
          abilityScores={abilityScores}
          savingThrowProficiencies={savingThrows}
          languages={customProficiencies?.languages ?? []}
          armorProficiencies={customProficiencies?.armor ?? []}
          weaponProficiencies={customProficiencies?.weapons ?? []}
          toolProficiencies={customProficiencies?.tools ?? []}
        />

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

const Info = ({
  label,
  value,
}: {
  label: string;

  value?: string;
}) => (
  <div>
    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
      {label}
    </p>

    <p className="mt-0.5 text-xs text-zinc-300">{value || "—"}</p>
  </div>
);

const CombatStat = ({
  label,
  value,
}: {
  label: string;

  value: string | number;
}) => (
  <div className="rounded-xl bg-zinc-900/60 px-3 py-2.5">
    <p className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">
      {label}
    </p>

    <p className="mt-1 text-lg font-bold text-white">{value}</p>
  </div>
);

const LongText = ({ value }: { value?: string }) =>
  value ? (
    <p className="whitespace-pre-wrap text-xs leading-5 text-zinc-300">
      {value}
    </p>
  ) : (
    <p className="text-xs text-zinc-600">Nothing entered.</p>
  );

export default CustomCharacterSheet;
