import { useMemo, useState } from "react";

import CharacterInventoryEquipment from "../components/CharacterInventoryEquipment";
import CharacterInventoryEditorModal from "../components/character/CharacterInventoryEditorModal";

import CharacterFeaturesEditorModal from "../components/character/CharacterFeaturesEditorModal";

import OverviewDashboard from "../features/character-sheet/components/OverviewDashboard";

import CharacterSheetWorkspace from "../features/character-sheet/components/CharacterSheetWorkspace";

import CharacterSheetHeader from "../features/character-sheet/components/CharacterSheetHeader";

import CharacterBreadcrumbs from "../features/character-sheet/components/CharacterBreadcrumbs";

import CharacterQuickStats from "../features/character-sheet/components/CharacterQuickStats";

import CharacterProfilePanel from "../features/character-sheet/components/CharacterProfilePanel";

import PlayerNotesPanel from "../features/character-sheet/components/PlayerNotesPanel";

import CustomFeatureTooltip from "../features/character-sheet/components/CustomFeatureTooltip";

import { collectFeatureActions } from "../features/character-sheet/utils/featureActionHelpers";

import { calculateArmorClass } from "../rulesets/dnd/dnd2024/armorClass";

import type {
  CharacterSheetTab,
  DeathSaves,
} from "../features/character-sheet/types";

import type { ShortRestResult } from "../features/character-sheet/types";

import { resolveItemFromEquipmentEntry } from "../rulesets/dnd/dnd2024/resolveItem";

import type {
  AbilityKey,
  CharacterEquipmentEntry,
  Money,
  Trait,
} from "../rulesets/dnd/dnd2024/types";

import { spells } from "../rulesets/dnd/dnd2024/data/spells";

import { getTraitCatalogEntries } from "../rulesets/dnd/dnd2024/data/traits/traitCatalog";

import { getXpProgressWithinLevel } from "../rulesets/dnd/dnd2024/xpProgression";

import {
  createEmptyCustomSkills,
  createEmptySpellSlots,
  customSkillDefinitions,
} from "../types/customCharacter";

import type {
  CustomCharacter,
  CustomProficiencyLevel,
  CustomTrait,
} from "../types/customCharacter";

type CustomCharacterSheetProps = {
  characterId?: string;

  character: CustomCharacter;

  backTo: string;

  backLabel: string;

  campaignItemsById: Record<string, any>;

  handleSetPlayerNotes: (notes: string) => Promise<void>;

  handleSetCurrentHp: (currentHp: number) => Promise<void>;

  handleSetConditions: (conditions: string[]) => Promise<void>;

  handleSetDefenses: (defenses: string[]) => Promise<void>;

  handleEquipmentChange: (
    equipment: CharacterEquipmentEntry[],
  ) => void | Promise<void>;

  handleSetInventory: (
    equipment: CharacterEquipmentEntry[],
    money: Money,
  ) => Promise<void>;

  handleSetHeroicInspiration: (value: boolean) => Promise<void>;

  handleSetDeathSaves: (value: DeathSaves) => Promise<void>;

  handleSetSpellSlotRemaining: (
    level: number,
    remaining: number,
  ) => Promise<void>;

  handleAddSpell: (spell: {
    spellId: string;
    name: string;
    level: number;
  }) => Promise<void>;

  handleRemoveSpell: (spellId: string) => Promise<void>;

  handleSetFeatures: (
    catalogTraitIds: string[],
    customTraits: CustomTrait[],
  ) => Promise<void>;

  handleShortRest: (hitDiceToSpend: number) => Promise<ShortRestResult>;

  handleLongRest: () => Promise<void>;
};

type RenderedFeature = Trait & {
  source?: string;
};

type FeatureGroup = {
  source: string;
  traits: RenderedFeature[];
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

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const proficiencyDisplayLabels: Record<string, string> = {
  "light-armor": "Light Armor",
  "medium-armor": "Medium Armor",
  "heavy-armor": "Heavy Armor",
  shields: "Shields",
  "simple-weapons": "Simple Weapons",
  "martial-weapons": "Martial Weapons",
  "unarmed-strikes": "Unarmed Strikes",
  "martial-finesse-or-light": "Martial Weapons with Finesse or Light",
};

const formatCustomProficiency = (value: string) =>
  proficiencyDisplayLabels[normalize(value)] ?? value;

const getWeaponProperties = (item: any) => {
  const raw = item?.weapon?.properties ?? [];

  return Array.isArray(raw) ? raw.map((property) => String(property)) : [];
};

const getWeaponAttackAbility = ({
  item,
  abilityScores,
}: {
  item: any;

  abilityScores: Record<AbilityKey, number>;
}): AbilityKey => {
  const properties = getWeaponProperties(item).map(normalize);

  const weapon = item?.weapon as any;

  const weaponKind = normalize(String(weapon?.weaponKind ?? ""));

  const hasRangedProperty =
    weaponKind.endsWith("-ranged") ||
    properties.includes("ammunition") ||
    properties.includes("ranged");

  if (hasRangedProperty) {
    return "dex";
  }

  if (properties.includes("finesse")) {
    return getModifier(abilityScores.dex) > getModifier(abilityScores.str)
      ? "dex"
      : "str";
  }

  return "str";
};

const isCustomWeaponProficient = ({
  item,
  proficiencies,
}: {
  item: any;

  proficiencies: string[];
}) => {
  if (proficiencies.length === 0) {
    return false;
  }

  const normalizedProficiencies = new Set(proficiencies.map(normalize));

  if (
    normalizedProficiencies.has("all-weapons") ||
    normalizedProficiencies.has("weapons") ||
    normalizedProficiencies.has("all")
  ) {
    return true;
  }

  const exactCandidates = [
    item?.id,
    item?.baseItemId,
    item?.name,
    item?.weapon?.id,
    item?.weapon?.name,
  ]
    .filter(Boolean)
    .map((value) => normalize(String(value)));

  if (
    exactCandidates.some((candidate) => normalizedProficiencies.has(candidate))
  ) {
    return true;
  }

  const weapon = item?.weapon as any;
  const weaponKind = normalize(String(weapon?.weaponKind ?? ""));
  const properties = getWeaponProperties(item).map(normalize);

  if (
    weaponKind.startsWith("simple-") &&
    (normalizedProficiencies.has("simple-weapons") ||
      normalizedProficiencies.has("simple-weapon"))
  ) {
    return true;
  }

  if (
    weaponKind.startsWith("martial-") &&
    (normalizedProficiencies.has("martial-weapons") ||
      normalizedProficiencies.has("martial-weapon"))
  ) {
    return true;
  }

  if (
    weaponKind.startsWith("martial-") &&
    normalizedProficiencies.has("martial-finesse-or-light") &&
    (properties.includes("finesse") || properties.includes("light"))
  ) {
    return true;
  }

  return false;
};

const getWeaponRange = (item: any) => {
  const range = item?.weapon?.range as
    | {
        normal?: number;
        long?: number | null;
      }
    | undefined;

  if (!range || typeof range.normal !== "number") {
    return null;
  }

  return {
    normal: range.normal,

    long: typeof range.long === "number" ? range.long : null,
  };
};

const CustomCharacterSheet = ({
  characterId,
  character,
  backTo,
  campaignItemsById,
  handleSetPlayerNotes,
  handleEquipmentChange,
  handleSetInventory,
  handleSetCurrentHp,
  handleSetConditions,
  handleSetDefenses,
  handleSetHeroicInspiration,
  handleSetDeathSaves,
  handleSetSpellSlotRemaining,
  handleAddSpell,
  handleRemoveSpell,
  handleSetFeatures,
  handleShortRest,
  handleLongRest,
}: CustomCharacterSheetProps) => {
  const [activeTab, setActiveTab] = useState<CharacterSheetTab>("inventory");

  const [featuresEditorOpen, setFeaturesEditorOpen] = useState(false);

  const [inventoryEditorOpen, setInventoryEditorOpen] = useState(false);

  const [openFeatureGroups, setOpenFeatureGroups] = useState<
    Record<string, boolean>
  >({});

  const stats = character.customStats ?? {};

  const abilityScores: Record<AbilityKey, number> = {
    ...defaultAbilityScores,

    ...(character.abilityScores ?? {}),
  };

  const level = character.level ?? 1;

  const xp = character.xp ?? 0;

  const xpProgress = getXpProgressWithinLevel(xp);

  const armorClassResult = calculateArmorClass({
    abilityScores,
    className: character.className ?? "",
    equipment: character.equipment ?? [],
    resolveItem: (entry) =>
      resolveItemFromEquipmentEntry(entry, campaignItemsById),
    mode: stats.armorClassMode ?? "automatic",
    manualArmorClass: stats.manualArmorClass ?? stats.armorClass ?? 10,
    extraModifier: stats.armorClassBonus ?? 0,
  });

  const armorClass = armorClassResult.value;

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

    spellSlots: createEmptySpellSlots(),

    spells: [],

    ...(character.customSpellcasting ?? {}),
  };

  const spellcastingAbilityModifier = spellcasting.ability
    ? getModifier(abilityScores[spellcasting.ability])
    : null;

  const spellSaveDc =
    spellcastingAbilityModifier !== null
      ? 8 + proficiencyBonus + spellcastingAbilityModifier
      : undefined;

  const spellAttackBonus =
    spellcastingAbilityModifier !== null
      ? proficiencyBonus + spellcastingAbilityModifier
      : undefined;

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

  const customHitDieSize = customHitDie
    ? Number(customHitDie.replace(/^d/i, "")) || undefined
    : undefined;

  const constitutionModifier = getModifier(abilityScores.con);

  /* =========================================================
       ATTACKS
    ========================================================= */

  const unarmedStrengthModifier = getModifier(abilityScores.str);

  const unarmedSaveDc = 8 + proficiencyBonus + unarmedStrengthModifier;

  const unarmedAttack = {
    id: "unarmed-strike",

    name: "Unarmed Strike",

    attackBonus: unarmedStrengthModifier + proficiencyBonus,

    damage: `${Math.max(0, 1 + unarmedStrengthModifier)} bludgeoning`,

    properties: [`Grapple DC ${unarmedSaveDc}`, `Shove DC ${unarmedSaveDc}`],

    ability: "str" as AbilityKey,

    isOffHand: false,

    isTwoHanded: false,

    isThrown: false,

    range: null,
  };

  const weaponAttacks = (character.equipment ?? [])
    .filter((entry) => entry.equipped || (entry.equippedSlots?.length ?? 0) > 0)
    .map((entry) => {
      const item = resolveItemFromEquipmentEntry(entry, campaignItemsById);

      if (!item?.weapon) {
        return null;
      }

      const damage = item.weapon.damage;

      const ability = getWeaponAttackAbility({
        item,

        abilityScores,
      });

      const abilityModifier = getModifier(abilityScores[ability]);

      const proficient = isCustomWeaponProficient({
        item,

        proficiencies: customProficiencies?.weapons ?? [],
      });

      const attackBonus = abilityModifier + (proficient ? proficiencyBonus : 0);

      const damageText =
        abilityModifier === 0
          ? `${damage.dice.count}d${damage.dice.die} ${damage.damageType}`
          : `${damage.dice.count}d${damage.dice.die}${
              abilityModifier > 0 ? "+" : ""
            }${abilityModifier} ${damage.damageType}`;

      const properties = getWeaponProperties(item);

      const normalizedProperties = properties.map(normalize);

      const equippedSlots = entry.equippedSlots ?? [];

      const wieldMode = entry.wieldMode;

      const isTwoHanded =
        wieldMode === "two-handed" ||
        (equippedSlots.includes("main-hand") &&
          equippedSlots.includes("off-hand"));

      const isOffHand =
        !isTwoHanded &&
        (wieldMode === "off-hand" || equippedSlots.includes("off-hand"));

      const isThrown = normalizedProperties.includes("thrown");

      return {
        id: entry.instanceId,

        name: item.name ?? entry.name ?? "Weapon",

        attackBonus,

        damage: damageText,

        properties,

        ability,

        isOffHand,

        isTwoHanded,

        isThrown,

        range: getWeaponRange(item),
      };
    })
    .filter((attack): attack is NonNullable<typeof attack> => Boolean(attack));

  const customAttacks = [unarmedAttack, ...weaponAttacks];

  /* =========================================================
       SPELLS
    ========================================================= */

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

  /* =========================================================
       FEATURES
    ========================================================= */

  /*
   * Library features are stored on the character as catalog IDs rather
   * than copied Trait objects. Resolve those IDs against the central
   * catalog every time the sheet renders.
   *
   * This means corrections to the rules data automatically appear on
   * every character that uses the feature.
   */
  const catalogFeatureEntries = useMemo(
    () => getTraitCatalogEntries(character.catalogTraitIds),
    [character.catalogTraitIds],
  );

  /*
   * Keep the catalog metadata together with the trait for rendering.
   *
   * sourceName gives us useful groups such as:
   *
   *   Druid
   *   Elf
   *   Elf — Drow
   *   Goliath — Stone's Endurance
   *   Tiefling — Infernal
   *   Tough
   *
   * without copying that metadata into the Trait itself.
   */
  const catalogFeatures = useMemo<RenderedFeature[]>(
    () =>
      catalogFeatureEntries.map((entry) => ({
        ...entry.trait,
        source: entry.sourceName,
      })),
    [catalogFeatureEntries],
  );

  /*
   * Custom traits remain embedded directly on the character.
   */
  const customFeatures = useMemo<RenderedFeature[]>(
    () =>
      (character.customTraits ?? []).map((trait) => ({
        ...trait,
        source: trait.source?.trim() || "Custom",
      })),
    [character.customTraits],
  );

  /*
   * One combined feature collection is now used by both:
   *
   *   - the Features tab
   *   - Overview actions
   *   - Overview bonus actions
   *   - Overview reactions
   */
  const allFeatures = useMemo<RenderedFeature[]>(
    () => [...catalogFeatures, ...customFeatures],
    [catalogFeatures, customFeatures],
  );

  /* =========================================================
       PLAY ACTIONS
    ========================================================= */

  const playableFeatures = useMemo(
    () =>
      allFeatures.map((trait) => ({
        id: trait.id,
        name: trait.name,
        description: trait.description,
        source: trait.source,
        notes: trait.notes,
        activation: trait.activation ?? "passive",
        actions: trait.actions ?? [],
      })),
    [allFeatures],
  );

  const collectedFeatureActions = useMemo(
    () => collectFeatureActions(playableFeatures),
    [playableFeatures],
  );

  const featureActions = collectedFeatureActions.actions;

  const featureBonusActions = collectedFeatureActions.bonusActions;

  const featureReactions = collectedFeatureActions.reactions;

  /* =========================================================
       FEATURE GROUPS
    ========================================================= */

  const featureGroups = useMemo<FeatureGroup[]>(() => {
    const groups = new Map<string, RenderedFeature[]>();

    for (const trait of allFeatures) {
      const source = trait.source?.trim() || "Custom";

      const current = groups.get(source) ?? [];

      current.push(trait);

      groups.set(source, current);
    }

    return Array.from(groups.entries()).map(([source, traits]) => ({
      source,

      traits,
    }));
  }, [allFeatures]);

  const isFeatureGroupOpen = (source: string) =>
    openFeatureGroups[source] ?? true;

  const toggleFeatureGroup = (source: string) => {
    setOpenFeatureGroups((current) => ({
      ...current,

      [source]: !(current[source] ?? true),
    }));
  };

  const renderFeaturesTab = () => (
    <div className="space-y-2">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setFeaturesEditorOpen(true)}
          className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold text-zinc-300 transition hover:bg-white/[0.1] hover:text-white"
        >
          Edit Features
        </button>
      </div>

      {featureGroups.length > 0 ? (
        <div className="grid gap-2 lg:grid-cols-2 lg:items-start">
          {featureGroups.map((group) => {
            const open = isFeatureGroupOpen(group.source);

            return (
              <section
                key={group.source}
                className="overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900/30"
              >
                <button
                  type="button"
                  onClick={() => toggleFeatureGroup(group.source)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition hover:bg-white/[0.035]"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`text-[9px] text-zinc-500 transition-transform ${
                        open ? "rotate-90" : ""
                      }`}
                    >
                      ▶
                    </span>

                    <span className="truncate text-[10px] font-bold uppercase tracking-[0.11em] text-zinc-300">
                      {group.source}
                    </span>

                    <span className="shrink-0 text-[8px] uppercase tracking-[0.08em] text-zinc-600">
                      · Features
                    </span>
                  </div>

                  <span className="text-[8px] font-medium text-zinc-600">
                    {group.traits.length}
                  </span>
                </button>

                {open ? (
                  <div className="border-t border-white/[0.06]">
                    {group.traits.map((trait) => (
                      <CustomFeatureTooltip
                        key={`${group.source}:${trait.id}`}
                        trait={trait}
                      >
                        <div className="group cursor-pointer border-b border-white/[0.045] px-3 py-3 last:border-b-0 transition hover:bg-white/[0.04]">
                          <div className="text-[13px] font-semibold leading-5 text-zinc-100 transition group-hover:text-white">
                            {trait.name}
                          </div>

                          {trait.description ? (
                            <div
                              className="mt-1.5 overflow-hidden text-xs leading-[1.55] text-zinc-400"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {trait.description}
                            </div>
                          ) : (
                            <div className="mt-1.5 text-xs italic text-zinc-600">
                              No description.
                            </div>
                          )}
                        </div>
                      </CustomFeatureTooltip>
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      ) : (
        <p className="p-3 text-xs text-zinc-600">No features added.</p>
      )}
    </div>
  );

  /* =========================================================
       OTHER DETAIL TABS
    ========================================================= */

  const renderInventoryTab = () => (
    <div className="space-y-2">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setInventoryEditorOpen(true)}
          className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-semibold text-zinc-300 transition hover:bg-white/[0.1] hover:text-white"
        >
          Edit Inventory
        </button>
      </div>

      <CharacterInventoryEquipment
        equipment={character.equipment ?? []}
        onChange={handleEquipmentChange}
        campaignItemsById={campaignItemsById}
        money={money}
      />
    </div>
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
      value={character.playerNotes}
      onSave={handleSetPlayerNotes}
    />
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-5 lg:px-6">
        <CharacterBreadcrumbs
          characterId={characterId}
          characterName={character.name}
          campaignId={character.campaignId}
          fallbackTo={backTo}
        />

        <CharacterSheetHeader
          characterId={characterId}
          name={character.name}
          imageUrl={character.imageUrl}
          level={level}
          speciesName={character.speciesName}
          className={character.className}
          backgroundName={character.backgroundName}
          currentHp={currentHp}
          maxHp={maxHp}
          rest={{
            hitDieSize: customHitDieSize,
            hitDiceRemaining: stats.hitDiceRemaining ?? level,
            hitDiceMax: level,
            constitutionModifier,
            onShortRest: handleShortRest,
            onLongRest: handleLongRest,
          }}
        />

        <CharacterQuickStats
          currentHp={currentHp}
          maxHp={maxHp}
          onCurrentHpChange={handleSetCurrentHp}
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
          onConditionsChange={handleSetConditions}
          defenses={character.defenses ?? []}
          onDefensesChange={handleSetDefenses}
          heroicInspiration={character.heroicInspiration ?? false}
          onHeroicInspirationChange={handleSetHeroicInspiration}
          deathSaves={{
            successes: character.deathSaves?.successes ?? 0,

            failures: character.deathSaves?.failures ?? 0,
          }}
          onDeathSavesChange={handleSetDeathSaves}
          hitDiceLabel={hitDiceLabel}
          progress={{
            level: xpProgress.level,
            xp,
            nextLevelXp: xpProgress.nextLevelXp,
            progressPercent: xpProgress.progressPercent,
          }}
          languages={customProficiencies?.languages ?? []}
          armorProficiencies={(customProficiencies?.armor ?? []).map(
            formatCustomProficiency,
          )}
          weaponProficiencies={(customProficiencies?.weapons ?? []).map(
            formatCustomProficiency,
          )}
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
                      saveDc: spellSaveDc,
                      attackBonus: spellAttackBonus,
                      slots: customSpellSlots,
                    }
                  : undefined
              }
              onSpellSlotChange={handleSetSpellSlotRemaining}
              onAddSpell={spellcasting.enabled ? handleAddSpell : undefined}
              onRemoveSpell={
                spellcasting.enabled ? handleRemoveSpell : undefined
              }
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

      <CharacterInventoryEditorModal
        open={inventoryEditorOpen}
        equipment={character.equipment ?? []}
        money={money}
        campaignItemsById={campaignItemsById}
        onClose={() => setInventoryEditorOpen(false)}
        onSave={handleSetInventory}
      />

      <CharacterFeaturesEditorModal
        open={featuresEditorOpen}
        catalogTraitIds={character.catalogTraitIds ?? []}
        customTraits={character.customTraits ?? []}
        onClose={() => setFeaturesEditorOpen(false)}
        onSave={handleSetFeatures}
      />
    </div>
  );
};

export default CustomCharacterSheet;
