import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

import {
  backgroundsById,
  classesById,
  featsById,
  getSubclassById,
  speciesById,
} from "../../../rulesets/dnd/dnd2024/helpers";

import {
  getXpProgressWithinLevel,
  completePendingLevelUp,
} from "../../../rulesets/dnd/dnd2024/xpProgression";

import { getPendingLevelUpSteps } from "../../../rulesets/dnd/dnd2024/getPendingLevelUpSteps";
import { applyLevelUpDecision } from "../../../rulesets/dnd/dnd2024/applyLevelUpDecision";

import type {
  AbilityKey,
  SkillId,
  LevelNumber,
  CharacterSpell,
  SpellId,
  CampaignItem,
} from "../../../rulesets/dnd/dnd2024/types";

import {
  getSpellById,
  getSpellSlotsForLevel,
  getCantripsKnownForLevel,
  getPreparedSpellCountForLevel,
  getKnownSpellCountForLevel,
} from "../../../rulesets/dnd/dnd2024/data/spells/helpers";

import { getCharacterHp } from "../../../rulesets/dnd/dnd2024/getCharacterHp";
import { getAllCharacterTraits } from "../../../rulesets/dnd/dnd2024/getAllCharacterTraits";
import { getSpeciesTraits } from "../../../rulesets/dnd/dnd2024/getSpeciesTraits";
import { getSpeciesGrantedFeatIds } from "../../../rulesets/dnd/dnd2024/getSpeciesGrantedFeatIds";
import { getCharacterArmorClassFromEquipment } from "../../../rulesets/dnd/dnd2024/getCharacterArmorClassFromEquipment";
import { getEquippedWeaponAttacks } from "../../../rulesets/dnd/dnd2024/getEquippedWeaponAttacks";
import { itemsById } from "../../../rulesets/dnd/dnd2024/data/items";
import { dragonbornAncestries } from "../../../rulesets/dnd/dnd2024/data/species/dragonbornAncestries";

import type { CharacterEquipmentEntry } from "../../../rulesets/dnd/dnd2024/types";

import type {
  ApplyDecisionInput,
  CharacterDoc,
  CharacterSheetDataHookResult,
  CharacterSheetDerived,
  TraitGroup,
} from "../types";

import {
  abilityLabels,
  abilityFullLabels,
  allSkills,
  skillAbilityMap,
} from "../utils/characterSheetConstants";

import {
  applyBackgroundBonuses,
  collectSpellSelections,
  formatLabel,
  getAbilityModifier,
  getDragonbornBreathWeaponDice,
  getMagicInitiateCastingAbility,
  getOrdinalSuffix,
  getRulesItemIdFromEquipmentEntry,
  getSneakAttackDice,
  getTieflingLegacyCastingAbility,
  unique,
} from "../utils/characterSheetHelpers";

import {
  dedupeTraits,
  getTraitGrantedSpells,
  getTraitResistances,
} from "../utils/traitHelpers";

export const useCharacterSheetData = (
  characterId?: string,
): CharacterSheetDataHookResult => {
  const [character, setCharacter] = useState<CharacterDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [campaignItemsById, setCampaignItemsById] = useState<
    Record<string, CampaignItem>
  >({});

  useEffect(() => {
    const loadCharacter = async () => {
      if (!characterId) {
        setError("Missing character ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const snap = await getDoc(doc(db, "characters", characterId));

        if (!snap.exists()) {
          setError("Character not found.");
          setCharacter(null);
          setCampaignItemsById({});
          setLoading(false);
          return;
        }

        const data = snap.data() as CharacterDoc;
        setCharacter(data);

        if (data.campaignId) {
          const campaignItemsSnap = await getDocs(
            collection(db, "campaigns", data.campaignId, "items"),
          );

          const nextCampaignItemsById = Object.fromEntries(
            campaignItemsSnap.docs.map((docSnap) => {
              const campaignItem = {
                id: docSnap.id,
                ...docSnap.data(),
              } as CampaignItem;

              return [campaignItem.id, campaignItem];
            }),
          ) as Record<string, CampaignItem>;

          setCampaignItemsById(nextCampaignItemsById);
        } else {
          setCampaignItemsById({});
        }
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load character.");
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [characterId]);

  const handleEquipmentChange = async (
    nextEquipment: CharacterEquipmentEntry[],
  ) => {
    if (!character || !characterId) return;

    const previousEquipment = character.equipment ?? [];

    setCharacter({
      ...character,
      equipment: nextEquipment,
    });

    try {
      await updateDoc(doc(db, "characters", characterId), {
        equipment: nextEquipment,
      });
    } catch (err) {
      console.error(err);
      setCharacter({
        ...character,
        equipment: previousEquipment,
      });
      setError("Failed to update equipment.");
    }
  };

  const handleApplyDecision = (
    level: number,
    decision: ApplyDecisionInput,
  ) => {
    if (!character) return;

    const updated = applyLevelUpDecision(character as any, level, decision);
    setCharacter(updated as CharacterDoc);
  };

  const handleCompleteLevelUp = () => {
    if (!character) return;

    const updated = completePendingLevelUp(character as any);
    setCharacter(updated as CharacterDoc);
  };

  const derived = useMemo<CharacterSheetDerived | null>(() => {
    if (!character) return null;

    const background = backgroundsById[character.backgroundId];
    const classDef = classesById[character.classId];

    const finalAbilityScores = applyBackgroundBonuses(
      character.abilityScores,
      character.choices?.backgroundAbilityBonuses,
      background?.abilityOptions ?? [],
    );

    const proficiencyBonus =
      character.derived?.stats?.proficiencyBonus ??
      character.proficiencyBonus ??
      2 + Math.floor((character.level - 1) / 4);

    const strMod = getAbilityModifier(finalAbilityScores.str);
    const dexMod = getAbilityModifier(finalAbilityScores.dex);
    const wisMod = getAbilityModifier(finalAbilityScores.wis);
    const conMod = getAbilityModifier(finalAbilityScores.con);

    const dragonbornAncestryId =
      character.speciesId === "dragonborn" &&
      typeof character.choices?.speciesTraitChoices?.["draconic-ancestry"] ===
        "string"
        ? character.choices.speciesTraitChoices["draconic-ancestry"]
        : null;

    const dragonbornAncestry = dragonbornAncestryId
      ? dragonbornAncestries[
          dragonbornAncestryId as keyof typeof dragonbornAncestries
        ]
      : null;

    const dragonbornBreathWeaponDc = dragonbornAncestry
      ? 8 + proficiencyBonus + conMod
      : null;

    const dragonbornBreathWeaponDamage = dragonbornAncestry
      ? getDragonbornBreathWeaponDice(character.level)
      : null;

    const fallbackSkillProficiencies = unique<SkillId>([
      ...(background?.skillProficiencies ?? []),
      ...(character.choices?.classSkillChoices ?? []),
    ]);

    const skillProficiencies = unique<SkillId>([
      ...(character.derived?.skillProficiencies ?? []),
      ...((character.skillProficiencies as SkillId[] | undefined) ?? []),
      ...fallbackSkillProficiencies,
    ]);

    const expertise = unique<SkillId | "thieves-tools">([
      ...((character.derived?.expertise ?? []) as Array<
        SkillId | "thieves-tools"
      >),
      ...(character.choices?.rogueExpertiseChoices ?? []),
    ]);

    const savingThrowProficiencies = unique<AbilityKey>([
      ...(character.derived?.savingThrowProficiencies ?? []),
      ...((character.savingThrowProficiencies as AbilityKey[] | undefined) ??
        []),
      ...(classDef?.savingThrowProficiencies ?? []),
    ]);

    const skillRows = allSkills.map((skill) => {
      const ability = skillAbilityMap[skill];
      const baseMod = getAbilityModifier(finalAbilityScores[ability]);
      const proficient = skillProficiencies.includes(skill);
      const expertiseApplies = expertise.includes(skill);

      const total =
        baseMod +
        (proficient ? proficiencyBonus : 0) +
        (expertiseApplies ? proficiencyBonus : 0);

      return {
        id: skill,
        name: formatLabel(skill),
        ability,
        proficient,
        expertise: expertiseApplies,
        total,
      };
    });

    const saveRows = (Object.keys(abilityLabels) as AbilityKey[]).map(
      (ability) => {
        const baseMod = getAbilityModifier(finalAbilityScores[ability]);
        const proficient = savingThrowProficiencies.includes(ability);
        const total = baseMod + (proficient ? proficiencyBonus : 0);

        return {
          id: ability,
          name: abilityFullLabels[ability],
          proficient,
          total,
        };
      },
    );

    const hpData = getCharacterHp(character as any);
    const equipment = character.equipment ?? [];

    const equippedArmorClass = getCharacterArmorClassFromEquipment({
      dexterityScore: finalAbilityScores.dex,
      constitutionScore: finalAbilityScores.con,
      classId: character.classId,
      equipment,
    });

    const weaponProficiencies =
      character.derived?.weaponProficiencies ??
      classDef?.weaponProficiencies ??
      [];

    const equippedWeaponAttacks = getEquippedWeaponAttacks({
      equipment,
      abilityScores: finalAbilityScores,
      proficiencyBonus,
      proficientWeaponIds: equipment
        .map(getRulesItemIdFromEquipmentEntry)
        .filter((itemId) => {
          const item = itemsById[itemId];
          if (!item?.weapon) return false;

          const kind = item.weapon.weaponKind;

          if (kind.startsWith("simple")) {
            return weaponProficiencies.includes("simple-weapons");
          }

          if (kind.startsWith("martial")) {
            return weaponProficiencies.includes("martial-weapons");
          }

          return false;
        }),
    }).filter(
      (attack): attack is NonNullable<typeof attack> => attack !== null,
    );

    const genericAttackBonuses = {
      strengthWeapon: strMod + proficiencyBonus,
      finesseOrRanged: dexMod + proficiencyBonus,
      unarmed: strMod + proficiencyBonus,
    };

    const rogueSneakAttack =
      character.classId === "rogue"
        ? getSneakAttackDice(character.level)
        : null;

    const xp = character.xp ?? 0;
    const xpProgress = getXpProgressWithinLevel(xp);
    const pendingSteps = getPendingLevelUpSteps(character as any);

    const levelUpDecisions = character.choices?.levelUpDecisions ?? {};

    const speciesTraits = dedupeTraits(
      getSpeciesTraits(character.speciesId, character.choices),
    );

    const speciesTraitResistances = getTraitResistances(speciesTraits);

    const speciesGrantedSpells = getTraitGrantedSpells(
      speciesTraits,
      character.level,
    ).map((spell) => {
      const spellData = getSpellById(spell.spellId);

      return {
        ...spell,
        ...spellData,
        level: spellData?.level ?? spell.level,
        school: spellData?.school,
        name: spellData?.name ?? spell.spellId,
      };
    });

    const tieflingSpeciesSpells =
      character.speciesId === "tiefling" ? speciesGrantedSpells : [];

    const selectedTieflingLegacyId =
      character.speciesId === "tiefling"
        ? character.choices?.speciesTraitChoices?.["fiendish-legacy-choice"]
        : null;

    const selectedTieflingLegacyTraitId =
      typeof selectedTieflingLegacyId === "string"
        ? `${selectedTieflingLegacyId}-legacy`
        : null;

    const tieflingLegacySpells =
      character.speciesId === "tiefling"
        ? tieflingSpeciesSpells.filter(
            (spell) =>
              spell.spellId === "thaumaturgy" ||
              spell.sourceId === selectedTieflingLegacyTraitId,
          )
        : [];

    const tieflingLegacyCastingAbility =
      character.speciesId === "tiefling"
        ? getTieflingLegacyCastingAbility(character)
        : null;

    const tieflingLegacyTrait =
      character.speciesId === "tiefling" &&
      typeof selectedTieflingLegacyId === "string"
        ? (speciesTraits.find(
            (trait) => trait.id === `${selectedTieflingLegacyId}-legacy`,
          ) ?? null)
        : null;

    const tieflingLegacyCastingMod =
      tieflingLegacyCastingAbility !== null
        ? getAbilityModifier(finalAbilityScores[tieflingLegacyCastingAbility])
        : null;

    const tieflingLegacySpellSaveDc =
      tieflingLegacyCastingMod !== null
        ? 8 + proficiencyBonus + tieflingLegacyCastingMod
        : null;

    const tieflingLegacySpellAttackBonus =
      tieflingLegacyCastingMod !== null
        ? proficiencyBonus + tieflingLegacyCastingMod
        : null;

    const groupedTieflingLegacySpells = tieflingLegacySpells
      .reduce<
        Array<{
          level: number;
          title: string;
          spells: typeof tieflingLegacySpells;
        }>
      >((groups, spell) => {
        const spellLevel = spell.level ?? 0;

        let group = groups.find((entry) => entry.level === spellLevel);

        if (!group) {
          group = {
            level: spellLevel,
            title:
              spellLevel === 0
                ? "Cantrips"
                : `${spellLevel}${getOrdinalSuffix(spellLevel)}-Level Spells`,
            spells: [],
          };
          groups.push(group);
        }

        group.spells.push(spell);
        return groups;
      }, [])
      .sort((a, b) => a.level - b.level)
      .map((group) => ({
        ...group,
        spells: [...group.spells].sort((a, b) => a.name.localeCompare(b.name)),
      }));

    const classTraits = dedupeTraits(
      Array.from({ length: character.level }, (_, index) => index + 1).flatMap(
        (level) => classDef?.featuresByLevel[level] ?? [],
      ),
    );

    const selectedSubclassId =
      character.subclassId ??
      character.choices?.subclassId ??
      Object.values(levelUpDecisions).find(
        (decision: any) => typeof decision?.subclassId === "string",
      )?.subclassId ??
      null;

    const subclassDef = selectedSubclassId
      ? getSubclassById(selectedSubclassId)
      : null;

    const subclassTraits = dedupeTraits(
      subclassDef
        ? Array.from(
            { length: character.level },
            (_, index) => index + 1,
          ).flatMap((level) => subclassDef.featuresByLevel[level] ?? [])
        : [],
    );

    const classOrSubclassSpellcasting =
      subclassDef?.spellcasting ?? classDef?.spellcasting ?? null;

    const backgroundFeatSpellListId =
      character.choices?.backgroundFeatSpellListId;

    const backgroundFeatCantripChoices =
      character.choices?.backgroundFeatCantripChoices ?? [];

    const backgroundFeatSpellChoices =
      character.choices?.backgroundFeatSpellChoices ?? [];

    const hasBackgroundMagicInitiate =
      character.originFeatId === "magic-initiate" &&
      !!backgroundFeatSpellListId &&
      (backgroundFeatCantripChoices.length > 0 ||
        backgroundFeatSpellChoices.length > 0);

    const magicInitiateSpellcasting = hasBackgroundMagicInitiate
      ? {
          id: "background-magic-initiate",
          name: `Magic Initiate (${formatLabel(backgroundFeatSpellListId!)})`,
          sourceType: "feat" as const,
          sourceId: "magic-initiate",
          castingAbility: getMagicInitiateCastingAbility(
            backgroundFeatSpellListId,
          ),
          spellListId: backgroundFeatSpellListId,
          preparationMode: "known" as const,
          progressionType: "custom" as const,
        }
      : null;

    const activeSpellcasting =
      classOrSubclassSpellcasting ?? magicInitiateSpellcasting;

    const spellcastingAbility = activeSpellcasting?.castingAbility ?? null;

    const spellcastingAbilityMod = spellcastingAbility
      ? getAbilityModifier(finalAbilityScores[spellcastingAbility])
      : null;

    const spellSaveDc =
      spellcastingAbilityMod !== null
        ? 8 + proficiencyBonus + spellcastingAbilityMod
        : null;

    const spellAttackBonus =
      spellcastingAbilityMod !== null
        ? proficiencyBonus + spellcastingAbilityMod
        : null;

    const spellSlots = classOrSubclassSpellcasting
      ? getSpellSlotsForLevel(
          classOrSubclassSpellcasting,
          character.level as LevelNumber,
        )
      : {};

    const cantripsKnownCapacity = classOrSubclassSpellcasting
      ? getCantripsKnownForLevel(
          classOrSubclassSpellcasting,
          character.level as LevelNumber,
        )
      : hasBackgroundMagicInitiate
        ? 2
        : 0;

    const spellListCapacity = classOrSubclassSpellcasting?.preparedSpells
      ? getPreparedSpellCountForLevel(
          classOrSubclassSpellcasting,
          character.level as LevelNumber,
        )
      : 0;

    const knownSpellCapacity = classOrSubclassSpellcasting?.learnedSpells
      ? getKnownSpellCountForLevel(
          classOrSubclassSpellcasting,
          character.level as LevelNumber,
        )
      : hasBackgroundMagicInitiate
        ? 1
        : 0;

    const collectedSpellChoices = collectSpellSelections(
      character,
      character.level,
    );

    const fixedCantripIds =
      classOrSubclassSpellcasting?.cantrips?.fixedKnown ?? [];

    const allKnownCantripIds = unique<SpellId>([
      ...fixedCantripIds,
      ...collectedSpellChoices.cantripIds,
    ]);

    const selectedCantripCount =
      allKnownCantripIds.length + backgroundFeatCantripChoices.length;

    const selectedLeveledSpellCount =
      collectedSpellChoices.spellSelections.length +
      backgroundFeatSpellChoices.length;

    const missingSpellListCount =
      activeSpellcasting?.preparationMode === "custom" && spellListCapacity > 0
        ? Math.max(0, spellListCapacity - selectedLeveledSpellCount)
        : 0;

    const sourceType =
      activeSpellcasting?.sourceType ??
      (hasBackgroundMagicInitiate ? ("feat" as const) : ("subclass" as const));

    const sourceId =
      activeSpellcasting?.sourceId ??
      (hasBackgroundMagicInitiate
        ? "magic-initiate"
        : (selectedSubclassId ?? character.classId));

    const derivedKnownSpells: CharacterSpell[] = [
      ...((character.derived?.spells as CharacterSpell[] | undefined) ?? []),
      ...allKnownCantripIds.map((spellId) => ({
        spellId,
        level: 0 as const,
        sourceType,
        sourceId,
        known: true,
        prepared: false,
        countsAgainstKnownLimit: true,
        countsAgainstPreparationLimit: false,
      })),
      ...collectedSpellChoices.spellSelections.map((selection) => ({
        spellId: selection.spellId,
        level: selection.level as any,
        sourceType,
        sourceId,
        known: true,
        prepared: false,
        countsAgainstKnownLimit: true,
        countsAgainstPreparationLimit: true,
      })),
      ...backgroundFeatCantripChoices.map((spellId) => ({
        spellId,
        level: 0 as const,
        sourceType: "feat" as const,
        sourceId: "magic-initiate",
        known: true,
        prepared: false,
        countsAgainstKnownLimit: false,
        countsAgainstPreparationLimit: false,
        usage: {
          type: "at-will" as const,
        },
      })),
      ...backgroundFeatSpellChoices.map((selection) => ({
        spellId: selection.spellId,
        level: selection.level,
        sourceType: "feat" as const,
        sourceId: "magic-initiate",
        known: true,
        prepared: false,
        countsAgainstKnownLimit: false,
        countsAgainstPreparationLimit: false,
        usage: {
          type: "limited" as const,
          recharge: "long-rest" as const,
          max: 1,
        },
      })),
    ];

    const nonSpeciesDerivedKnownSpells = derivedKnownSpells.filter(
      (spell) => spell.sourceType !== "species",
    );

    const spells = unique(
      nonSpeciesDerivedKnownSpells.map((spell) => spell.spellId),
    )
      .map((spellId) =>
        derivedKnownSpells.find((spell) => spell.spellId === spellId),
      )
      .filter((spell): spell is NonNullable<typeof spell> => Boolean(spell))
      .map((spell) => {
        const spellData = getSpellById(spell.spellId);

        return {
          ...spell,
          ...spellData,
          level: spellData?.level ?? spell.level,
          school: spellData?.school,
          name: spellData?.name ?? spell.spellId,
        };
      })
      .sort((a, b) => {
        const levelDiff = (a.level ?? 0) - (b.level ?? 0);
        if (levelDiff !== 0) return levelDiff;
        return a.name.localeCompare(b.name);
      });

    const groupedSpells = spells
      .reduce<
        Array<{
          level: number;
          title: string;
          spells: typeof spells;
        }>
      >((groups, spell) => {
        const spellLevel = spell.level ?? 0;

        let group = groups.find((entry) => entry.level === spellLevel);

        if (!group) {
          group = {
            level: spellLevel,
            title:
              spellLevel === 0
                ? "Cantrips"
                : `${spellLevel}${getOrdinalSuffix(spellLevel)}-Level Spells`,
            spells: [],
          };
          groups.push(group);
        }

        group.spells.push(spell);
        return groups;
      }, [])
      .sort((a, b) => a.level - b.level)
      .map((group) => ({
        ...group,
        spells: [...group.spells].sort((a, b) => a.name.localeCompare(b.name)),
      }));

    const backgroundTraits = dedupeTraits(
      background?.originFeatId
        ? (featsById[background.originFeatId]?.traits ?? [])
        : [],
    );

    const originFeatTraits = dedupeTraits(
      character.originFeatId
        ? (featsById[character.originFeatId]?.traits ?? [])
        : [],
    );

    const speciesGrantedFeatTraits = dedupeTraits(
      getSpeciesGrantedFeatIds(character.speciesId, character.choices).flatMap(
        (featId) => featsById[featId]?.traits ?? [],
      ),
    );

    const levelUpFeatTraits = dedupeTraits(
      Object.values(levelUpDecisions).flatMap((decision: any) =>
        decision?.featId ? (featsById[decision.featId]?.traits ?? []) : [],
      ),
    );

    const featTraits = dedupeTraits([
      ...originFeatTraits,
      ...speciesGrantedFeatTraits,
      ...levelUpFeatTraits,
    ]);

    const allTraits = getAllCharacterTraits(character as any);

    const groupedTraitCandidates: TraitGroup[] = [
      {
        key: "species",
        title: `${speciesById[character.speciesId]?.name ?? "Species"} Traits`,
        subtitle: "Ancestry, senses, resistances, innate gifts",
        traits: speciesTraits,
      },
      {
        key: "class",
        title: `${classDef?.name ?? "Class"} Features`,
        subtitle: "Features gained from your class levels",
        traits: classTraits,
      },
      {
        key: "subclass",
        title: `${subclassDef?.name ?? "Subclass"} Features`,
        subtitle: "Specialized features from your subclass",
        traits: subclassTraits,
      },
      {
        key: "background",
        title: `${background?.name ?? "Background"} Traits`,
        subtitle: "Background benefits and granted origin feature",
        traits: backgroundTraits,
      },
      {
        key: "feats",
        title: "Feats & Special Training",
        subtitle: "Origin feat, species-granted feats, and level-up feats",
        traits: featTraits,
      },
    ];

    const groupedTraits: TraitGroup[] = groupedTraitCandidates
      .filter((group) => group.traits.length > 0)
      .map((group) => ({
        ...group,
        traits: dedupeTraits(group.traits),
      }));

    const groupedTraitIds = new Set(
      groupedTraits.flatMap((group) => group.traits.map((trait) => trait.id)),
    );

    const otherTraits = allTraits.filter(
      (trait) => !groupedTraitIds.has(trait.id),
    );

    if (otherTraits.length > 0) {
      groupedTraits.push({
        key: "other",
        title: "Other Traits",
        subtitle: "Rules content not yet assigned to a source group",
        traits: dedupeTraits(otherTraits),
      });
    }

    return {
      className: classDef?.name ?? character.classId,
      speciesName:
        speciesById[character.speciesId]?.name ?? character.speciesId,
      backgroundName: background?.name ?? character.backgroundId,
      featName: character.originFeatId
        ? character.originFeatId === "magic-initiate" &&
          backgroundFeatSpellListId
          ? `${featsById[character.originFeatId]?.name ?? character.originFeatId} (${formatLabel(backgroundFeatSpellListId)})`
          : (featsById[character.originFeatId]?.name ?? character.originFeatId)
        : null,
      subclassName: subclassDef?.name ?? null,
      proficiencyBonus,
      initiativeBonus: dexMod,
      passivePerception:
        character.derived?.stats?.passivePerception ?? 10 + wisMod,
      armorClass: equippedArmorClass,
      speed: character.derived?.stats?.speed ?? character.speed ?? 30,
      currentHp: hpData.currentHp,
      maxHp: hpData.maxHp,
      finalAbilityScores,
      skillRows,
      saveRows,
      skillProficiencies,
      savingThrowProficiencies,
      toolProficiencies:
        character.derived?.toolProficiencies ??
        character.toolProficiencies ??
        (background?.toolProficiency ? [background.toolProficiency] : []),
      languages:
        character.derived?.languages ??
        character.languages ??
        speciesById[character.speciesId]?.languages ??
        [],
      resistances: speciesTraitResistances,
      expertise,
      equippedWeaponAttacks,
      genericAttackBonuses,
      rogueSneakAttack,
      xp,
      xpProgress,
      pendingSteps,
      traitGroups: groupedTraits,
      activeSpellcasting,
      spellcastingAbility,
      spellcastingAbilityMod,
      spellSaveDc,
      spellAttackBonus,
      spellSlots,
      cantripsKnown: cantripsKnownCapacity,
      spellsKnown: knownSpellCapacity,
      spellsPrepared: spellListCapacity,
      missingSpellListCount,
      spells,
      groupedSpells,
      selectedCantripCount,
      selectedLeveledSpellCount,
      tieflingLegacyName:
        character.speciesId === "tiefling"
          ? (tieflingLegacyTrait?.name ?? null)
          : null,
      tieflingLegacyCastingAbility,
      tieflingLegacyCastingMod,
      tieflingLegacySpellSaveDc,
      tieflingLegacySpellAttackBonus,
      tieflingLegacySpells,
      groupedTieflingLegacySpells,
      money: {
        cp: character.money?.cp ?? 0,
        sp: character.money?.sp ?? 0,
        ep: character.money?.ep ?? 0,
        gp: character.money?.gp ?? 0,
        pp: character.money?.pp ?? 0,
      },
      dragonbornAncestryId,
      dragonbornAncestryName: dragonbornAncestry?.name ?? null,
      dragonbornDamageType: dragonbornAncestry?.damageType ?? null,
      dragonbornBreathWeaponDc,
      dragonbornBreathWeaponDamage,
    };
  }, [character]);

  return {
    character,
    loading,
    error,
    campaignItemsById,
    derived,
    setError,
    handleEquipmentChange,
    handleApplyDecision,
    handleCompleteLevelUp,
  };
};