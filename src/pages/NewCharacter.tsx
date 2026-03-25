import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCharacter } from "../characters";
import { backgrounds, classes, species } from "../rulesets/dnd/dnd2024/data";
import { buildDerivedCharacterData } from "../rulesets/dnd/dnd2024/buildDerivedCharacterData";
import { getSpeciesChoices } from "../rulesets/dnd/dnd2024/getSpeciesChoices";
import { getSpeciesGrantedFeatIds } from "../rulesets/dnd/dnd2024/getSpeciesGrantedFeatIds";
import { getAvailableSpells } from "../rulesets/dnd/dnd2024/getAvailableSpells";
import {
  getBackgroundById,
  getClassById,
  getFeatById,
} from "../rulesets/dnd/dnd2024/helpers";
import type {
  AbilityKey,
  CharacterSheetData,
  LanguageId,
  Money,
  SkillId,
  SpellId,
  SpellSelection,
  ToolId,
  Trait,
  TraitChoice,
  TraitEffect,
  WeaponMasteryChoiceId,
  SpellListId,
  OriginFeatId,
} from "../rulesets/dnd/dnd2024/types";

import { resolveEquipmentGrants } from "../rulesets/dnd/dnd2024/resolveEquipmentGrant";
import { splitResolvedEquipmentIntoEntries } from "../rulesets/dnd/splitEquipmentIntoEntries";
import type { EquipmentGrant } from "../rulesets/dnd/dnd2024/types";

import { getAllCharacterTraits } from "../rulesets/dnd/dnd2024/getAllCharacterTraits";

import SpellPreviewCard, {
  type SpellPreviewData,
} from "../components/SpellPreviewCard";

import { dragonbornAncestries } from "../rulesets/dnd/dnd2024/data/species/dragonbornAncestries";

type CharacterCreationStep =
  | "details"
  | "class"
  | "species"
  | "background"
  | "review";

const creationSteps: CharacterCreationStep[] = [
  "details",
  "class",
  "species",
  "background",
  "review",
];

const stepLabels: Record<CharacterCreationStep, string> = {
  details: "Details",
  class: "Class",
  species: "Species",
  background: "Background",
  review: "Review",
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

const languageOptions: LanguageId[] = [
  "common",
  "draconic",
  "dwarvish",
  "elvish",
  "giant",
  "gnomish",
  "goblin",
  "halfling",
  "orc",
  "primordial",
  "sylvan",
  "infernal",
  "celestial",
  "abyssal",
  "undercommon",
];

const rogueWeaponMasteryOptions: WeaponMasteryChoiceId[] = [
  "dagger",
  "dart",
  "light-crossbow",
  "rapier",
  "scimitar",
  "shortbow",
  "shortsword",
  "sling",
];

const bardInstrumentOptions: ToolId[] = [
  "bagpipes",
  "drum",
  "dulcimer",
  "flute",
  "horn",
  "lute",
  "lyre",
  "pan-flute",
  "shawm",
  "viol",
];

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const arraysEqual = <T,>(a: T[], b: T[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const spellSelectionsEqual = (a: SpellSelection[], b: SpellSelection[]) =>
  a.length === b.length &&
  a.every(
    (value, index) =>
      value.spellId === b[index]?.spellId && value.level === b[index]?.level,
  );

const speciesTraitChoicesEqual = (
  a: Record<string, string | string[]>,
  b: Record<string, string | string[]>,
) => {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  return bKeys.every((key) => {
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === "string" || typeof bValue === "string") {
      return aValue === bValue;
    }

    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      return arraysEqual(aValue, bValue);
    }

    return false;
  });
};

const formatTraitEffect = (effect: TraitEffect): string => {
  switch (effect.type) {
    case "resource":
      return `Resource: ${effect.resourceId}`;

    case "resource-die":
      return `${effect.resourceId} uses ${effect.die}`;

    case "sense":
      return `${formatLabel(effect.sense)} ${effect.range} ft.`;

    case "resistance":
      return `Resistance to ${formatLabel(effect.damageType)} damage`;

    case "advantage-on-saving-throws-against":
      return `Advantage on saves against ${effect.conditions
        .map((condition) => formatLabel(condition))
        .join(", ")}`;

    case "advantage-on-saving-throws":
      return `Advantage on ${effect.abilities
        .map((ability) => formatLabel(ability))
        .join(", ")} saving throws`;

    case "spell":
      return effect.level
        ? `${effect.spellId} (available from level ${effect.level})`
        : effect.spellId;

    case "speed-bonus":
      return effect.speedType === "walk"
        ? "Movement speed bonus"
        : `${formatLabel(effect.speedType)} speed`;

    case "light":
      return `Bright light ${effect.bright} ft., dim light ${effect.dim} ft.`;

    case "hp-max-bonus":
      return "Bonus to maximum Hit Points";

    case "healing":
      return "Healing effect";

    case "aoe-damage":
      return "Area damage effect";

    case "transformation":
      return "Transformation effect";

    case "condition":
      return `Applies ${formatLabel(effect.condition)}`;

    case "choice-ref":
      return `Choice reference: ${effect.choiceId}`;

    case "text":
      return effect.text;

    default:
      return "Special effect";
  }
};

const getTraitSummaryLines = (trait: Trait): string[] => {
  const lines: string[] = [];

  if (trait.description) {
    lines.push(trait.description);
  }

  if (trait.effects?.length) {
    lines.push(...trait.effects.map((effect) => formatTraitEffect(effect)));
  }

  if (trait.notes?.length) {
    lines.push(...trait.notes);
  }

  return lines;
};

const NewCharacter = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] =
    useState<CharacterCreationStep>("details");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [classId, setClassId] = useState("");
  const [backgroundId, setBackgroundId] = useState("");
  const [alignment, setAlignment] = useState("");
  const [notes, setNotes] = useState("");
  const [abilityScores, setAbilityScores] = useState(defaultAbilityScores);

  const [classSkillChoices, setClassSkillChoices] = useState<SkillId[]>([]);
  const [classToolChoices, setClassToolChoices] = useState<ToolId[]>([]);
  const [classCantripChoices, setClassCantripChoices] = useState<SpellId[]>([]);
  const [classSpellChoices, setClassSpellChoices] = useState<SpellSelection[]>(
    [],
  );

  const [classCantripPreviewSpell, setClassCantripPreviewSpell] =
    useState<SpellPreviewData | null>(null);

  const [classSpellPreviewSpell, setClassSpellPreviewSpell] =
    useState<SpellPreviewData | null>(null);

  const [
    humanMagicInitiateCantripPreviewSpell,
    setHumanMagicInitiateCantripPreviewSpell,
  ] = useState<SpellPreviewData | null>(null);

  const [
    humanMagicInitiateSpellPreviewSpell,
    setHumanMagicInitiateSpellPreviewSpell,
  ] = useState<SpellPreviewData | null>(null);

  const [
    backgroundMagicInitiateCantripPreviewSpell,
    setBackgroundMagicInitiateCantripPreviewSpell,
  ] = useState<SpellPreviewData | null>(null);

  const [
    backgroundMagicInitiateSpellPreviewSpell,
    setBackgroundMagicInitiateSpellPreviewSpell,
  ] = useState<SpellPreviewData | null>(null);

  // Species state
  const [speciesId, setSpeciesId] = useState("");
  const [speciesSizeChoice, setSpeciesSizeChoice] = useState<
    "Small" | "Medium" | ""
  >("");
  const [speciesTraitChoices, setSpeciesTraitChoices] = useState<
    Record<string, string | string[]>
  >({});

  const [humanFeatCantripChoices, setHumanFeatCantripChoices] = useState<
    SpellId[]
  >([]);

  const [humanFeatSpellChoices, setHumanFeatSpellChoices] = useState<
    SpellSelection[]
  >([]);

  const [humanFeatSkillChoices, setHumanFeatSkillChoices] = useState<SkillId[]>(
    [],
  );

  const [humanFeatSpellListId, setHumanFeatSpellListId] = useState<
    Extract<SpellListId, "cleric" | "druid" | "wizard"> | ""
  >("");

  // Background state
  const [backgroundBonusPlus2, setBackgroundBonusPlus2] =
    useState<AbilityKey>("str");
  const [backgroundBonusPlus1, setBackgroundBonusPlus1] =
    useState<AbilityKey>("dex");

  const [backgroundToolChoice, setBackgroundToolChoice] = useState<ToolId | "">(
    "",
  );

  const [classEquipmentOptionId, setClassEquipmentOptionId] = useState("");
  const [backgroundEquipmentOptionId, setBackgroundEquipmentOptionId] =
    useState("");

  // Class specific states
  const [barbarianWeaponMasteryChoices, setBarbarianWeaponMasteryChoices] =
    useState<WeaponMasteryChoiceId[]>([]);

  const [bardStartingInstrument, setBardStartingInstrument] = useState<
    ToolId | ""
  >("");

  const [clericDivineOrder, setClericDivineOrder] = useState<
    "protector" | "thaumaturge" | ""
  >("");

  const [fighterFightingStyle, setFighterFightingStyle] = useState<
    | "archery"
    | "blind-fighting"
    | "defense"
    | "dueling"
    | "great-weapon-fighting"
    | "interception"
    | "protection"
    | "superior-technique"
    | "thrown-weapon-fighting"
    | "two-weapon-fighting"
    | "unarmed-fighting"
    | ""
  >("");

  const [fighterWeaponMasteryChoices, setFighterWeaponMasteryChoices] =
    useState<WeaponMasteryChoiceId[]>([]);

  const [rogueExpertiseChoices, setRogueExpertiseChoices] = useState<
    Array<SkillId | "thieves-tools">
  >([]);
  const [rogueBonusLanguage, setRogueBonusLanguage] =
    useState<LanguageId>("common");
  const [rogueWeaponMasteryChoices, setRogueWeaponMasteryChoices] = useState<
    WeaponMasteryChoiceId[]
  >([]);

  const [backgroundFeatCantripChoices, setBackgroundFeatCantripChoices] =
    useState<SpellId[]>([]);
  const [backgroundFeatSpellChoices, setBackgroundFeatSpellChoices] = useState<
    SpellSelection[]
  >([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentStepIndex = creationSteps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === creationSteps.length - 1;

  const needsBardStartingInstrument =
    classId === "bard" &&
    classEquipmentOptionId === "bard-starting-equipment-a";

  const goToNextStep = () => {
    setError("");
    const nextStep = creationSteps[currentStepIndex + 1];
    if (nextStep) setCurrentStep(nextStep);
  };

  const goToPreviousStep = () => {
    setError("");
    const previousStep = creationSteps[currentStepIndex - 1];
    if (previousStep) setCurrentStep(previousStep);
  };

  const speciesDef = useMemo(
    () => species.find((s) => s.id === speciesId),
    [speciesId],
  );
  const speciesSizeOptions = speciesDef?.sizeOptions ?? [];

  const classDef = useMemo(() => getClassById(classId), [classId]);
  const backgroundDef = useMemo(
    () => getBackgroundById(backgroundId),
    [backgroundId],
  );

  const classToolOptions = classDef?.toolProficiencyChoice?.options ?? [];
  const classToolChoiceCount = classDef?.toolProficiencyChoice?.choose ?? 0;

  const classSpellcasting = classDef?.spellcasting;

  const classStartingCantripChoiceCount =
    classSpellcasting?.cantrips?.chooseAtStart ?? 0;

  const effectiveClassStartingCantripChoiceCount =
    classId === "cleric" && clericDivineOrder === "thaumaturge"
      ? classStartingCantripChoiceCount + 1
      : classStartingCantripChoiceCount;

  const classStartingSpellChoiceConfig =
    classSpellcasting?.preparedSpells?.chooseAtStart ??
    classSpellcasting?.learnedSpells?.chooseAtStart;

  const classStartingSpellChoiceCount =
    classStartingSpellChoiceConfig?.count ?? 0;

  const classStartingSpellLevel =
    classStartingSpellChoiceConfig?.spellLevel ?? 1;

  const backgroundFeatGrant = backgroundDef?.featGrant;
  const backgroundFeatSpellListId =
    backgroundFeatGrant?.type === "magic-initiate"
      ? backgroundFeatGrant.spellListId
      : undefined;

  const hasBackgroundMagicInitiate =
    backgroundFeatGrant?.type === "magic-initiate" &&
    !!backgroundFeatSpellListId;

  const backgroundToolRules = backgroundDef?.toolProficiencyOptions;

  const backgroundToolOptions =
    backgroundToolRules?.type === "choice" ? backgroundToolRules.options : [];

  const grantedTool =
    backgroundToolRules?.type === "fixed"
      ? backgroundToolRules.tool
      : backgroundToolChoice || null;

  const speciesChoices = useMemo<TraitChoice[]>(() => {
    if (!speciesId) return [];
    return getSpeciesChoices(speciesId);
  }, [speciesId]);

  const selectedClassEquipmentOption = useMemo(
    () =>
      classDef?.startingEquipment?.options.find(
        (option) => option.id === classEquipmentOptionId,
      ) ?? null,
    [classDef, classEquipmentOptionId],
  );

  const selectedBackgroundEquipmentOption = useMemo(
    () =>
      backgroundDef?.equipment?.options.find(
        (option) => option.id === backgroundEquipmentOptionId,
      ) ?? null,
    [backgroundDef, backgroundEquipmentOptionId],
  );

  const isBarbarian = classId === "barbarian";
  const isCleric = classId === "cleric";
  const isFighter = classId === "fighter";
  const isRogue = classId === "rogue";

  const selectedDragonbornAncestryId =
    speciesId === "dragonborn" &&
    typeof speciesTraitChoices["draconic-ancestry"] === "string"
      ? speciesTraitChoices["draconic-ancestry"]
      : null;

  const selectedDragonbornAncestry = selectedDragonbornAncestryId
    ? dragonbornAncestries[
        selectedDragonbornAncestryId as keyof typeof dragonbornAncestries
      ]
    : null;

  const backgroundGrantedFeatId = backgroundDef?.originFeatId ?? null;

  const humanOriginFeatId: OriginFeatId | null =
    speciesId === "human" &&
    typeof speciesTraitChoices["human-origin-feat-choice"] === "string"
      ? (speciesTraitChoices["human-origin-feat-choice"] as OriginFeatId)
      : null;

  const effectiveOriginFeatId = humanOriginFeatId ?? backgroundGrantedFeatId;

  const humanOriginFeatDef = useMemo(
    () => (humanOriginFeatId ? getFeatById(humanOriginFeatId) : null),
    [humanOriginFeatId],
  );

  const humanFeatGrant = humanOriginFeatDef?.grant;

  const hasHumanMagicInitiate =
    humanFeatGrant?.type === "magic-initiate" && !!humanFeatSpellListId;

  const humanSkilledChoiceCount =
    humanFeatGrant?.type === "skilled" ? humanFeatGrant.chooseSkills : 0;

  const backgroundGrantedFeatName = useMemo(() => {
    if (!backgroundGrantedFeatId) return null;

    const featName =
      getFeatById(backgroundGrantedFeatId)?.name ?? backgroundGrantedFeatId;

    if (backgroundFeatGrant?.type === "magic-initiate") {
      return `${featName} (${formatLabel(backgroundFeatGrant.spellListId)})`;
    }

    return featName;
  }, [backgroundFeatGrant, backgroundGrantedFeatId]);

  const availableClassCantrips = useMemo(() => {
    if (!classSpellcasting || !classId) return [];

    return getAvailableSpells(
      {
        ownerUid: "",
        campaignId: null,
        name: "",
        level: 1,
        classId,
        speciesId: speciesId || "human",
        backgroundId: backgroundId || "acolyte",
        originFeatId: effectiveOriginFeatId,
        abilityScores,
      } as CharacterSheetData,
      {
        spellListId: classSpellcasting.spellListId,
        maxLevel: 0,
        includeCantrips: true,
      },
    ).filter((spell) => spell.level === 0);
  }, [
    abilityScores,
    effectiveOriginFeatId,
    backgroundId,
    classId,
    classSpellcasting,
    speciesId,
  ]);

  const availableClassStartingSpells = useMemo(() => {
    if (!classSpellcasting || !classId) return [];

    return getAvailableSpells(
      {
        ownerUid: "",
        campaignId: null,
        name: "",
        level: 1,
        classId,
        speciesId: speciesId || "human",
        backgroundId: backgroundId || "acolyte",
        originFeatId: effectiveOriginFeatId,
        abilityScores,
      } as CharacterSheetData,
      {
        spellListId: classSpellcasting.spellListId,
        maxLevel: classStartingSpellLevel,
        includeCantrips: false,
      },
    ).filter((spell) => spell.level === classStartingSpellLevel);
  }, [
    abilityScores,
    effectiveOriginFeatId,
    backgroundId,
    classId,
    classSpellcasting,
    classStartingSpellLevel,
    speciesId,
  ]);

  const backgroundMagicInitiateCantrips = useMemo(() => {
    if (!hasBackgroundMagicInitiate || !backgroundFeatSpellListId) {
      return [];
    }

    return getAvailableSpells(
      {
        ownerUid: "",
        campaignId: null,
        name: "",
        level: 1,
        classId,
        speciesId,
        backgroundId,
        originFeatId: effectiveOriginFeatId,
        abilityScores,
      } as CharacterSheetData,
      {
        spellListId: backgroundFeatSpellListId,
        maxLevel: 0,
        includeCantrips: true,
      },
    );
  }, [
    abilityScores,
    backgroundFeatSpellListId,
    effectiveOriginFeatId,
    backgroundId,
    classId,
    hasBackgroundMagicInitiate,
    speciesId,
  ]);

  const backgroundMagicInitiateLevelOneSpells = useMemo(() => {
    if (
      !hasBackgroundMagicInitiate ||
      !backgroundFeatSpellListId ||
      !backgroundId
    ) {
      return [];
    }

    return getAvailableSpells(
      {
        ownerUid: "",
        campaignId: null,
        name: "",
        level: 1,
        classId,
        speciesId,
        backgroundId,
        originFeatId: effectiveOriginFeatId,
        abilityScores,
      } as CharacterSheetData,
      {
        spellListId: backgroundFeatSpellListId,
        maxLevel: 1,
        includeCantrips: false,
      },
    ).filter((spell) => spell.level === 1);
  }, [
    abilityScores,
    backgroundFeatSpellListId,
    effectiveOriginFeatId,
    backgroundId,
    classId,
    hasBackgroundMagicInitiate,
    speciesId,
  ]);

  const humanMagicInitiateCantrips = useMemo(() => {
    if (
      !hasHumanMagicInitiate ||
      !humanFeatSpellListId ||
      speciesId !== "human"
    ) {
      return [];
    }

    return getAvailableSpells(
      {
        ownerUid: "",
        campaignId: null,
        name: "",
        level: 1,
        classId,
        speciesId,
        backgroundId,
        originFeatId: effectiveOriginFeatId,
        abilityScores,
        choices: {
          speciesTraitChoices,
          ...(humanFeatSpellListId ? { humanFeatSpellListId } : {}),
        },
      } as CharacterSheetData,
      {
        spellListId: humanFeatSpellListId,
        maxLevel: 0,
        includeCantrips: true,
      },
    ).filter((spell) => spell.level === 0);
  }, [
    abilityScores,
    backgroundId,
    classId,
    effectiveOriginFeatId,
    hasHumanMagicInitiate,
    humanFeatSpellListId,
    speciesId,
    speciesTraitChoices,
  ]);

  const humanMagicInitiateLevelOneSpells = useMemo(() => {
    if (
      !hasHumanMagicInitiate ||
      !humanFeatSpellListId ||
      speciesId !== "human"
    ) {
      return [];
    }

    return getAvailableSpells(
      {
        ownerUid: "",
        campaignId: null,
        name: "",
        level: 1,
        classId,
        speciesId,
        backgroundId,
        originFeatId: effectiveOriginFeatId,
        abilityScores,
        choices: {
          speciesTraitChoices,
          ...(humanFeatSpellListId ? { humanFeatSpellListId } : {}),
        },
      } as CharacterSheetData,
      {
        spellListId: humanFeatSpellListId,
        maxLevel: 1,
        includeCantrips: false,
      },
    ).filter((spell) => spell.level === 1);
  }, [
    abilityScores,
    backgroundId,
    classId,
    effectiveOriginFeatId,
    hasHumanMagicInitiate,
    humanFeatSpellListId,
    speciesId,
    speciesTraitChoices,
  ]);

  const speciesGrantedFeatIds = useMemo(() => {
    if (!speciesId) return [];
    return getSpeciesGrantedFeatIds(speciesId, { speciesTraitChoices });
  }, [speciesId, speciesTraitChoices]);

  const speciesGrantedFeatNames = useMemo(
    () =>
      speciesGrantedFeatIds.map(
        (featId) => getFeatById(featId)?.name ?? featId,
      ),
    [speciesGrantedFeatIds],
  );

  const activeAllTraits = useMemo(() => {
    if (!classId || !speciesId || !backgroundId) return [];

    return getAllCharacterTraits({
      classId,
      speciesId,
      backgroundId,
      originFeatId: effectiveOriginFeatId,
      level: 1,
      choices: {
        classSkillChoices,
        ...(classToolChoices.length > 0 ? { classToolChoices } : {}),
        ...(classCantripChoices.length > 0 ? { classCantripChoices } : {}),
        ...(classSpellChoices.length > 0 ? { classSpellChoices } : {}),
        ...(classSpellChoices.length > 0
          ? {
              preparedSpellIdsBySource: {
                [`class:${classId}`]: classSpellChoices.map(
                  (spell) => spell.spellId,
                ),
              },
            }
          : {}),
        backgroundAbilityBonuses: {
          plus2: backgroundBonusPlus2,
          plus1: backgroundBonusPlus1,
        },
        ...(backgroundToolChoice ? { backgroundToolChoice } : {}),
        ...(backgroundFeatSpellListId ? { backgroundFeatSpellListId } : {}),
        ...(backgroundFeatCantripChoices.length > 0
          ? { backgroundFeatCantripChoices }
          : {}),
        ...(backgroundFeatSpellChoices.length > 0
          ? { backgroundFeatSpellChoices }
          : {}),
        ...(speciesSizeChoice ? { speciesSizeChoice } : {}),
        speciesTraitChoices,
        ...(isRogue
          ? {
              rogueExpertiseChoices,
              rogueBonusLanguage,
              rogueWeaponMasteryChoices,
            }
          : {}),
        ...(isCleric && clericDivineOrder ? { clericDivineOrder } : {}),
        ...(isFighter && fighterFightingStyle ? { fighterFightingStyle } : {}),
        ...(isFighter && fighterWeaponMasteryChoices.length > 0
          ? { fighterWeaponMasteryChoices }
          : {}),
      },
    });
  }, [
    backgroundBonusPlus1,
    backgroundBonusPlus2,
    backgroundId,
    backgroundToolChoice,
    classCantripChoices,
    classId,
    classSkillChoices,
    classSpellChoices,
    classToolChoices,
    effectiveOriginFeatId,
    backgroundFeatCantripChoices,
    backgroundFeatSpellChoices,
    backgroundFeatSpellListId,
    isRogue,
    rogueBonusLanguage,
    rogueExpertiseChoices,
    rogueWeaponMasteryChoices,
    speciesId,
    speciesTraitChoices,
  ]);

  const resolvedStartingEquipment = useMemo(() => {
    const grants: EquipmentGrant[] = [
      ...(selectedClassEquipmentOption?.grants ?? []),
      ...(selectedBackgroundEquipmentOption?.grants ?? []),
    ];

    return resolveEquipmentGrants(grants, {
      resolveChoice: (grant) => {
        const itemOptions = grant.options.filter(
          (option): option is Extract<EquipmentGrant, { type: "item" }> =>
            option.type === "item",
        );

        if (itemOptions.length === 0) {
          return [];
        }

        if (
          backgroundToolRules?.type === "choice" &&
          backgroundToolChoice &&
          itemOptions.some((option) => option.id === backgroundToolChoice)
        ) {
          return itemOptions.filter(
            (option) => option.id === backgroundToolChoice,
          );
        }

        if (
          needsBardStartingInstrument &&
          bardStartingInstrument &&
          itemOptions.some((option) => option.id === bardStartingInstrument)
        ) {
          return itemOptions.filter(
            (option) => option.id === bardStartingInstrument,
          );
        }

        return itemOptions.slice(0, grant.choose);
      },
    });
  }, [
    backgroundToolChoice,
    backgroundToolRules,
    selectedBackgroundEquipmentOption,
    selectedClassEquipmentOption,
    needsBardStartingInstrument,
    bardStartingInstrument,
  ]);

  const normalizedStartingEquipment = useMemo(
    () => splitResolvedEquipmentIntoEntries(resolvedStartingEquipment.items),
    [resolvedStartingEquipment.items],
  );

  const startingMoney = useMemo<Money>(() => {
    return {
      cp: resolvedStartingEquipment.currency.cp ?? 0,
      sp: resolvedStartingEquipment.currency.sp ?? 0,
      ep: resolvedStartingEquipment.currency.ep ?? 0,
      gp: resolvedStartingEquipment.currency.gp ?? 0,
      pp: resolvedStartingEquipment.currency.pp ?? 0,
    };
  }, [resolvedStartingEquipment.currency]);

  const grantedSkills = backgroundDef?.skillProficiencies ?? [];
  const abilityOptions = backgroundDef?.abilityOptions ?? [];

  const classSkillOptions = classDef?.skillChoice.options ?? [];
  const classSkillChoiceCount = classDef?.skillChoice.choose ?? 0;

  const classWeaponMasteryOptions = classDef?.weaponMasteryOptions ?? [];
  const barbarianWeaponMasteryChoiceCount = isBarbarian ? 2 : 0;
  const fighterWeaponMasteryChoiceCount = isFighter ? 3 : 0;
  const fighterFightingStyleOptions = [
    "archery",
    "blind-fighting",
    "defense",
    "dueling",
    "great-weapon-fighting",
    "interception",
    "protection",
    "superior-technique",
    "thrown-weapon-fighting",
    "two-weapon-fighting",
    "unarmed-fighting",
  ] as const;

  const rogueExpertiseOptions = useMemo(() => {
    if (!isRogue) return [] as Array<SkillId | "thieves-tools">;

    const all = new Set<SkillId | "thieves-tools">([
      ...grantedSkills,
      ...classSkillChoices,
      "thieves-tools",
    ]);

    return Array.from(all);
  }, [classSkillChoices, grantedSkills, isRogue]);

  const validateCurrentStep = () => {
    switch (currentStep) {
      case "details":
        if (!name.trim()) {
          return "Character name is required.";
        }
        return "";

      case "class":
        if (!classId) {
          return "Please choose a class.";
        }

        if (!classDef) {
          return "Please choose a valid class.";
        }

        if (classSkillChoices.length !== classSkillChoiceCount) {
          return `Please choose ${classSkillChoiceCount} class skill${
            classSkillChoiceCount === 1 ? "" : "s"
          }.`;
        }

        if (
          classDef.startingEquipment?.options?.length &&
          !selectedClassEquipmentOption
        ) {
          return "Please choose a class starting equipment option.";
        }

        if (classToolChoiceCount > 0) {
          if (classToolChoices.length !== classToolChoiceCount) {
            return `Please choose ${classToolChoiceCount} tool proficiency${
              classToolChoiceCount === 1 ? "" : "ies"
            }.`;
          }

          if (needsBardStartingInstrument) {
            if (!bardStartingInstrument) {
              return "Please choose a starting musical instrument.";
            }

            if (!bardInstrumentOptions.includes(bardStartingInstrument)) {
              return "Please choose a valid starting musical instrument.";
            }
          }

          const validTools = classToolChoices.every((tool) =>
            classToolOptions.includes(tool),
          );

          if (!validTools) {
            return "Please choose valid tool proficiencies.";
          }

          if (new Set(classToolChoices).size !== classToolChoiceCount) {
            return "Tool choices must be different.";
          }
        }

        if (effectiveClassStartingCantripChoiceCount > 0) {
          if (
            classCantripChoices.length !==
            effectiveClassStartingCantripChoiceCount
          ) {
            return `Please choose ${effectiveClassStartingCantripChoiceCount} class cantrip${
              effectiveClassStartingCantripChoiceCount === 1 ? "" : "s"
            }.`;
          }

          const validCantrips = classCantripChoices.every((spellId) =>
            availableClassCantrips.some((spell) => spell.id === spellId),
          );

          if (!validCantrips) {
            return "Please choose valid class cantrips.";
          }

          if (
            new Set(classCantripChoices).size !==
            effectiveClassStartingCantripChoiceCount
          ) {
            return "Class cantrip choices must be different.";
          }
        }

        if (classStartingSpellChoiceCount > 0) {
          if (classSpellChoices.length !== classStartingSpellChoiceCount) {
            return `Please choose ${classStartingSpellChoiceCount} class spell${
              classStartingSpellChoiceCount === 1 ? "" : "s"
            }.`;
          }

          const validSpells = classSpellChoices.every(
            (selection) =>
              selection.level === classStartingSpellLevel &&
              availableClassStartingSpells.some(
                (spell) => spell.id === selection.spellId,
              ),
          );

          if (!validSpells) {
            return "Please choose valid class spells.";
          }

          if (
            new Set(classSpellChoices.map((spell) => spell.spellId)).size !==
            classStartingSpellChoiceCount
          ) {
            return "Class spell choices must be different.";
          }
        }

        if (isBarbarian) {
          if (
            barbarianWeaponMasteryChoices.length !==
            barbarianWeaponMasteryChoiceCount
          ) {
            return `Barbarian must choose ${barbarianWeaponMasteryChoiceCount} weapon mastery options.`;
          }

          if (
            new Set(barbarianWeaponMasteryChoices).size !==
            barbarianWeaponMasteryChoiceCount
          ) {
            return "Barbarian weapon mastery choices must be different.";
          }

          if (
            barbarianWeaponMasteryChoices.some(
              (choice) => !classWeaponMasteryOptions.includes(choice),
            )
          ) {
            return "One or more Barbarian weapon mastery choices are invalid.";
          }
        }

        if (isCleric && !clericDivineOrder) {
          return "Please choose a Divine Order.";
        }

        if (isFighter) {
          if (!fighterFightingStyle) {
            return "Please choose a Fighting Style.";
          }

          if (
            !fighterFightingStyleOptions.includes(
              fighterFightingStyle as (typeof fighterFightingStyleOptions)[number],
            )
          ) {
            return "Please choose a valid Fighting Style.";
          }

          if (
            fighterWeaponMasteryChoices.length !==
            fighterWeaponMasteryChoiceCount
          ) {
            return `Fighter must choose ${fighterWeaponMasteryChoiceCount} weapon mastery options.`;
          }

          if (
            new Set(fighterWeaponMasteryChoices).size !==
            fighterWeaponMasteryChoiceCount
          ) {
            return "Fighter weapon mastery choices must be different.";
          }

          if (
            fighterWeaponMasteryChoices.some(
              (choice) => !classWeaponMasteryOptions.includes(choice),
            )
          ) {
            return "One or more Fighter weapon mastery choices are invalid.";
          }
        }

        if (isRogue) {
          if (rogueExpertiseChoices.length !== 2) {
            return "Rogue must choose 2 Expertise options.";
          }

          if (
            rogueExpertiseChoices.some(
              (choice) => !rogueExpertiseOptions.includes(choice),
            )
          ) {
            return "One or more Rogue Expertise choices are invalid.";
          }

          if (!languageOptions.includes(rogueBonusLanguage)) {
            return "Please choose a valid Rogue bonus language.";
          }

          if (rogueWeaponMasteryChoices.length !== 2) {
            return "Rogue must choose 2 weapon mastery options.";
          }

          if (new Set(rogueWeaponMasteryChoices).size !== 2) {
            return "Rogue weapon mastery choices must be different.";
          }
        }

        return "";

      case "species":
        if (!speciesId) {
          return "Please choose a species.";
        }

        if (
          speciesSizeOptions.length > 0 &&
          (speciesSizeChoice === "" ||
            !speciesSizeOptions.includes(speciesSizeChoice))
        ) {
          return "Please choose a valid species size.";
        }

        for (const choice of speciesChoices) {
          const value = speciesTraitChoices[choice.id];

          if (choice.choose === 1) {
            if (typeof value !== "string") {
              return `Please choose ${choice.name}.`;
            }

            const isValid = choice.options.some(
              (option) => option.id === value,
            );

            if (!isValid) {
              return `Please choose a valid option for ${choice.name}.`;
            }
          } else {
            if (!Array.isArray(value) || value.length !== choice.choose) {
              return `Please choose ${choice.choose} option${
                choice.choose === 1 ? "" : "s"
              } for ${choice.name}.`;
            }

            const allValid = value.every((selectedId) =>
              choice.options.some((option) => option.id === selectedId),
            );

            if (!allValid) {
              return `Please choose valid options for ${choice.name}.`;
            }
          }
        }

        if (humanFeatGrant?.type === "magic-initiate") {
          if (!humanFeatSpellListId) {
            return "Please choose a spell list for Human Magic Initiate.";
          }

          if (humanFeatCantripChoices.length !== 2) {
            return "Please choose 2 cantrips for Human Magic Initiate.";
          }

          const validCantrips = humanFeatCantripChoices.every((spellId) =>
            humanMagicInitiateCantrips.some((spell) => spell.id === spellId),
          );

          if (!validCantrips) {
            return "Please choose valid Human Magic Initiate cantrips.";
          }

          if (new Set(humanFeatCantripChoices).size !== 2) {
            return "Human Magic Initiate cantrip choices must be different.";
          }

          if (humanFeatSpellChoices.length !== 1) {
            return "Please choose 1 level 1 spell for Human Magic Initiate.";
          }

          const chosenSpell = humanFeatSpellChoices[0];

          const validSpell =
            chosenSpell?.level === 1 &&
            humanMagicInitiateLevelOneSpells.some(
              (spell) => spell.id === chosenSpell.spellId,
            );

          if (!validSpell) {
            return "Please choose a valid Human Magic Initiate level 1 spell.";
          }
        }

        if (humanFeatGrant?.type === "skilled") {
          if (humanFeatSkillChoices.length !== humanSkilledChoiceCount) {
            return `Please choose ${humanSkilledChoiceCount} skills for Skilled.`;
          }

          if (new Set(humanFeatSkillChoices).size !== humanSkilledChoiceCount) {
            return "Skilled choices must be different.";
          }
        }

        return "";

      case "background":
        if (!backgroundId) {
          return "Please choose a background.";
        }

        if (!backgroundDef) {
          return "Please choose a valid background.";
        }

        if (!abilityOptions.includes(backgroundBonusPlus2)) {
          return "Please choose a valid +2 background ability bonus.";
        }

        if (!abilityOptions.includes(backgroundBonusPlus1)) {
          return "Please choose a valid +1 background ability bonus.";
        }

        if (backgroundBonusPlus2 === backgroundBonusPlus1) {
          return "Your +2 and +1 background bonuses must be different abilities.";
        }

        if (
          backgroundDef.equipment?.options?.length &&
          !selectedBackgroundEquipmentOption
        ) {
          return "Please choose a background equipment option.";
        }

        if (backgroundToolRules?.type === "choice") {
          if (!backgroundToolChoice) {
            return "Please choose a background tool proficiency.";
          }

          if (!backgroundToolRules.options.includes(backgroundToolChoice)) {
            return "Please choose a valid background tool proficiency.";
          }
        }

        if (hasBackgroundMagicInitiate) {
          if (backgroundFeatCantripChoices.length !== 2) {
            return "Please choose 2 cantrips for Magic Initiate.";
          }

          const validCantrips = backgroundFeatCantripChoices.every((spellId) =>
            backgroundMagicInitiateCantrips.some(
              (spell) => spell.id === spellId,
            ),
          );

          if (!validCantrips) {
            return "Please choose valid Magic Initiate cantrips.";
          }

          if (new Set(backgroundFeatCantripChoices).size !== 2) {
            return "Magic Initiate cantrip choices must be different.";
          }

          if (backgroundFeatSpellChoices.length !== 1) {
            return "Please choose 1 level 1 spell for Magic Initiate.";
          }

          const chosenSpell = backgroundFeatSpellChoices[0];

          const validSpell =
            chosenSpell?.level === 1 &&
            backgroundMagicInitiateLevelOneSpells.some(
              (spell) => spell.id === chosenSpell.spellId,
            );

          if (!validSpell) {
            return "Please choose a valid Magic Initiate level 1 spell.";
          }
        }

        return "";

      case "review":
        if (!classId) {
          return "Please choose a class.";
        }

        if (!speciesId) {
          return "Please choose a species.";
        }

        if (!backgroundId) {
          return "Please choose a background.";
        }

        return "";

      default:
        return "";
    }
  };

  const handleNextStep = () => {
    const stepError = validateCurrentStep();
    if (stepError) {
      setError(stepError);
      return;
    }

    setError("");
    goToNextStep();
  };

  useEffect(() => {
    if (speciesSizeOptions.length === 0) {
      setSpeciesSizeChoice("");
      return;
    }

    setSpeciesSizeChoice((prev) =>
      prev !== "" && speciesSizeOptions.includes(prev)
        ? prev
        : speciesSizeOptions[0],
    );
  }, [speciesSizeOptions]);

  useEffect(() => {
    if (humanFeatGrant?.type !== "magic-initiate") {
      setHumanFeatSpellListId((prev) => (prev === "" ? prev : ""));
      setHumanFeatCantripChoices((prev) => (prev.length === 0 ? prev : []));
      setHumanFeatSpellChoices((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    setHumanFeatSpellListId((prev) => {
      if (prev && humanFeatGrant.spellListOptions.includes(prev)) {
        return prev;
      }
      return humanFeatGrant.spellListOptions[0] ?? "";
    });
  }, [humanFeatGrant]);

  useEffect(() => {
    if (!hasHumanMagicInitiate) {
      setHumanFeatCantripChoices((prev) => (prev.length === 0 ? prev : []));
      setHumanFeatSpellChoices((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    setHumanFeatCantripChoices((prev) => {
      const next = prev
        .filter((spellId) =>
          humanMagicInitiateCantrips.some((spell) => spell.id === spellId),
        )
        .slice(0, 2);

      return arraysEqual(prev, next) ? prev : next;
    });

    setHumanFeatSpellChoices((prev) => {
      const next = prev
        .filter((selection) =>
          humanMagicInitiateLevelOneSpells.some(
            (spell) => spell.id === selection.spellId && selection.level === 1,
          ),
        )
        .slice(0, 1);

      return spellSelectionsEqual(prev, next) ? prev : next;
    });
  }, [
    hasHumanMagicInitiate,
    humanMagicInitiateCantrips,
    humanMagicInitiateLevelOneSpells,
  ]);

  useEffect(() => {
    if (humanFeatGrant?.type !== "skilled") {
      setHumanFeatSkillChoices((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    setHumanFeatSkillChoices((prev) => prev.slice(0, humanSkilledChoiceCount));
  }, [humanFeatGrant, humanSkilledChoiceCount]);

  useEffect(() => {
    const options = classDef?.skillChoice.options ?? [];

    setClassSkillChoices((prev) => {
      const next = prev
        .filter((skill) => options.includes(skill))
        .slice(0, classSkillChoiceCount);

      return arraysEqual(prev, next) ? prev : next;
    });
  }, [classDef, classSkillChoiceCount]);

  useEffect(() => {
    if (!needsBardStartingInstrument) {
      setBardStartingInstrument((prev) => (prev === "" ? prev : ""));
      return;
    }

    setBardStartingInstrument((prev) =>
      prev && bardInstrumentOptions.includes(prev)
        ? prev
        : bardInstrumentOptions[0],
    );
  }, [needsBardStartingInstrument]);

  useEffect(() => {
    if (!isCleric) {
      setClericDivineOrder((prev) => (prev === "" ? prev : ""));
      return;
    }

    setClericDivineOrder((prev) =>
      prev === "protector" || prev === "thaumaturge" ? prev : "protector",
    );
  }, [isCleric]);

  useEffect(() => {
    if (!isFighter) {
      setFighterFightingStyle((prev) => (prev === "" ? prev : ""));
      setFighterWeaponMasteryChoices((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    setFighterFightingStyle((prev) =>
      fighterFightingStyleOptions.includes(
        prev as (typeof fighterFightingStyleOptions)[number],
      )
        ? prev
        : "defense",
    );

    setFighterWeaponMasteryChoices((prev) => {
      const next = prev
        .filter((choice) => classWeaponMasteryOptions.includes(choice))
        .slice(0, fighterWeaponMasteryChoiceCount);

      return arraysEqual(prev, next) ? prev : next;
    });
  }, [isFighter, classWeaponMasteryOptions, fighterWeaponMasteryChoiceCount]);

  useEffect(() => {
    setClassCantripChoices((prev) => {
      const next = prev
        .filter((spellId) =>
          availableClassCantrips.some((spell) => spell.id === spellId),
        )
        .slice(0, effectiveClassStartingCantripChoiceCount);

      return arraysEqual(prev, next) ? prev : next;
    });

    setClassSpellChoices((prev) => {
      const next = prev
        .filter((selection) =>
          availableClassStartingSpells.some(
            (spell) =>
              spell.id === selection.spellId &&
              selection.level === classStartingSpellLevel,
          ),
        )
        .slice(0, classStartingSpellChoiceCount);

      return spellSelectionsEqual(prev, next) ? prev : next;
    });
  }, [
    availableClassCantrips,
    availableClassStartingSpells,
    effectiveClassStartingCantripChoiceCount,
    classStartingSpellChoiceCount,
    classStartingSpellLevel,
  ]);

  useEffect(() => {
    const options = backgroundDef?.abilityOptions ?? [];

    if (!backgroundDef || options.length === 0) {
      if (backgroundBonusPlus2 !== "str") {
        setBackgroundBonusPlus2("str");
      }
      if (backgroundBonusPlus1 !== "dex") {
        setBackgroundBonusPlus1("dex");
      }
      return;
    }

    const nextPlus2 = options.includes(backgroundBonusPlus2)
      ? backgroundBonusPlus2
      : options[0];

    const nextPlus1 =
      options.includes(backgroundBonusPlus1) &&
      backgroundBonusPlus1 !== nextPlus2
        ? backgroundBonusPlus1
        : (options.find((option) => option !== nextPlus2) ?? options[0]);

    if (nextPlus2 !== backgroundBonusPlus2) {
      setBackgroundBonusPlus2(nextPlus2);
    }

    if (nextPlus1 !== backgroundBonusPlus1) {
      setBackgroundBonusPlus1(nextPlus1);
    }
  }, [backgroundDef, backgroundBonusPlus1, backgroundBonusPlus2]);

  useEffect(() => {
    if (!backgroundToolRules || backgroundToolRules.type === "fixed") {
      setBackgroundToolChoice((prev) => (prev === "" ? prev : ""));
      return;
    }

    setBackgroundToolChoice((prev) => {
      if (prev && backgroundToolRules.options.includes(prev)) {
        return prev;
      }

      const next = backgroundToolRules.options[0] ?? "";
      return prev === next ? prev : next;
    });
  }, [backgroundToolRules]);

  useEffect(() => {
    const options = classDef?.startingEquipment?.options ?? [];

    if (options.length === 0) {
      setClassEquipmentOptionId((prev) => (prev === "" ? prev : ""));
      return;
    }

    setClassEquipmentOptionId((prev) => {
      const next = options.some((option) => option.id === prev)
        ? prev
        : options[0].id;

      return prev === next ? prev : next;
    });
  }, [classDef]);

  useEffect(() => {
    const options = backgroundDef?.equipment?.options ?? [];

    if (options.length === 0) {
      setBackgroundEquipmentOptionId((prev) => (prev === "" ? prev : ""));
      return;
    }

    setBackgroundEquipmentOptionId((prev) => {
      const next = options.some((option) => option.id === prev)
        ? prev
        : options[0].id;

      return prev === next ? prev : next;
    });
  }, [backgroundDef]);

  useEffect(() => {
    if (!hasBackgroundMagicInitiate) {
      setBackgroundFeatCantripChoices((prev) =>
        prev.length === 0 ? prev : [],
      );
      setBackgroundFeatSpellChoices((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    setBackgroundFeatCantripChoices((prev) => {
      const next = prev
        .filter((spellId) =>
          backgroundMagicInitiateCantrips.some((spell) => spell.id === spellId),
        )
        .slice(0, 2);

      return arraysEqual(prev, next) ? prev : next;
    });

    setBackgroundFeatSpellChoices((prev) => {
      const next = prev
        .filter((selection) =>
          backgroundMagicInitiateLevelOneSpells.some(
            (spell) => spell.id === selection.spellId && selection.level === 1,
          ),
        )
        .slice(0, 1);

      return spellSelectionsEqual(prev, next) ? prev : next;
    });
  }, [
    backgroundMagicInitiateCantrips,
    backgroundMagicInitiateLevelOneSpells,
    hasBackgroundMagicInitiate,
  ]);

  useEffect(() => {
    if (!isBarbarian) {
      setBarbarianWeaponMasteryChoices((prev) =>
        prev.length === 0 ? prev : [],
      );
      return;
    }

    setBarbarianWeaponMasteryChoices((prev) => {
      const next = prev
        .filter((choice) => classWeaponMasteryOptions.includes(choice))
        .slice(0, barbarianWeaponMasteryChoiceCount);

      return arraysEqual(prev, next) ? prev : next;
    });
  }, [
    isBarbarian,
    classWeaponMasteryOptions,
    barbarianWeaponMasteryChoiceCount,
  ]);

  useEffect(() => {
    if (!isRogue) {
      setRogueExpertiseChoices((prev) => (prev.length === 0 ? prev : []));
      setRogueWeaponMasteryChoices((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    setRogueExpertiseChoices((prev) => {
      const next = prev
        .filter((choice) => rogueExpertiseOptions.includes(choice))
        .slice(0, 2);

      return arraysEqual(prev, next) ? prev : next;
    });

    setRogueWeaponMasteryChoices((prev) => {
      const next = prev
        .filter((choice) => rogueWeaponMasteryOptions.includes(choice))
        .slice(0, 2);

      return arraysEqual(prev, next) ? prev : next;
    });
  }, [isRogue, rogueExpertiseOptions]);

  useEffect(() => {
    setSpeciesTraitChoices((prev) => {
      const next: Record<string, string | string[]> = {};

      for (const choice of speciesChoices) {
        const previousValue = prev[choice.id];

        if (typeof previousValue === "string") {
          const isStillValid = choice.options.some(
            (option) => option.id === previousValue,
          );

          if (isStillValid) {
            next[choice.id] = previousValue;
            continue;
          }
        }

        if (Array.isArray(previousValue)) {
          const validValues = previousValue.filter((value) =>
            choice.options.some((option) => option.id === value),
          );

          if (validValues.length > 0) {
            next[choice.id] = validValues.slice(0, choice.choose);
            continue;
          }
        }

        if (choice.choose === 1 && choice.options.length > 0) {
          next[choice.id] = choice.options[0].id;
        } else {
          next[choice.id] = [];
        }
      }

      return speciesTraitChoicesEqual(prev, next) ? prev : next;
    });
  }, [speciesChoices]);

  const handleAbilityChange = (key: AbilityKey, value: string) => {
    const parsed = Number(value);

    setAbilityScores((prev) => ({
      ...prev,
      [key]: Number.isNaN(parsed) ? 0 : parsed,
    }));
  };

  const toggleClassSkill = (skill: SkillId) => {
    setClassSkillChoices((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((item) => item !== skill);
      }

      if (prev.length >= classSkillChoiceCount) {
        return prev;
      }

      return [...prev, skill];
    });
  };

  const toggleHumanFeatCantrip = (spellId: SpellId) => {
    setHumanFeatCantripChoices((prev) => {
      if (prev.includes(spellId)) {
        return prev.filter((id) => id !== spellId);
      }

      if (prev.length >= 2) {
        return prev;
      }

      return [...prev, spellId];
    });
  };

  const toggleHumanFeatSpellChoice = (spellId: SpellId) => {
    setHumanFeatSpellChoices((prev) => {
      const isSelected = prev.some((spell) => spell.spellId === spellId);

      if (isSelected) {
        return [];
      }

      return [{ spellId, level: 1 }];
    });
  };

  const toggleHumanFeatSkillChoice = (skill: SkillId) => {
    setHumanFeatSkillChoices((prev) => {
      if (prev.includes(skill)) {
        return prev.filter((id) => id !== skill);
      }

      if (prev.length >= humanSkilledChoiceCount) {
        return prev;
      }

      return [...prev, skill];
    });
  };

  const toggleClassCantripChoice = (spellId: SpellId) => {
    setClassCantripChoices((prev) => {
      if (prev.includes(spellId)) {
        return prev.filter((id) => id !== spellId);
      }

      if (prev.length >= effectiveClassStartingCantripChoiceCount) {
        return prev;
      }

      return [...prev, spellId];
    });
  };

  const toggleClassSpellChoice = (spellId: SpellId, level: number) => {
    setClassSpellChoices((prev) => {
      const exists = prev.some((spell) => spell.spellId === spellId);

      if (exists) {
        return prev.filter((spell) => spell.spellId !== spellId);
      }

      if (prev.length >= classStartingSpellChoiceCount) {
        return prev;
      }

      return [
        ...prev,
        {
          spellId,
          level: level as SpellSelection["level"],
        },
      ];
    });
  };

  const toggleBackgroundFeatCantrip = (spellId: SpellId) => {
    setBackgroundFeatCantripChoices((prev) => {
      if (prev.includes(spellId)) {
        return prev.filter((id) => id !== spellId);
      }

      if (prev.length >= 2) {
        return prev;
      }

      return [...prev, spellId];
    });
  };

  const toggleBackgroundFeatSpellChoice = (spellId: SpellId) => {
    setBackgroundFeatSpellChoices((prev) => {
      const isSelected = prev.some((spell) => spell.spellId === spellId);

      if (isSelected) {
        return [];
      }

      return [{ spellId, level: 1 }];
    });
  };

  const toggleRogueExpertise = (choice: SkillId | "thieves-tools") => {
    setRogueExpertiseChoices((prev) => {
      if (prev.includes(choice)) {
        return prev.filter((item) => item !== choice);
      }

      if (prev.length >= 2) {
        return prev;
      }

      return [...prev, choice];
    });
  };

  const toggleBarbarianWeaponMastery = (choice: WeaponMasteryChoiceId) => {
    setBarbarianWeaponMasteryChoices((prev) => {
      if (prev.includes(choice)) {
        return prev.filter((item) => item !== choice);
      }

      if (prev.length >= barbarianWeaponMasteryChoiceCount) {
        return prev;
      }

      return [...prev, choice];
    });
  };

  const toggleFighterWeaponMastery = (choice: WeaponMasteryChoiceId) => {
    setFighterWeaponMasteryChoices((prev) => {
      if (prev.includes(choice)) {
        return prev.filter((item) => item !== choice);
      }

      if (prev.length >= fighterWeaponMasteryChoiceCount) {
        return prev;
      }

      return [...prev, choice];
    });
  };

  const toggleRogueWeaponMastery = (choice: WeaponMasteryChoiceId) => {
    setRogueWeaponMasteryChoices((prev) => {
      if (prev.includes(choice)) {
        return prev.filter((item) => item !== choice);
      }

      if (prev.length >= 2) {
        return prev;
      }

      return [...prev, choice];
    });
  };

  const setSpeciesChoiceValue = (choiceId: string, value: string) => {
    setSpeciesTraitChoices((prev) => ({
      ...prev,
      [choiceId]: value,
    }));
  };

  const validateForm = () => {
    if (!name.trim()) {
      return "Character name is required.";
    }

    if (!classId) {
      return "Please choose a class.";
    }

    if (!speciesId) {
      return "Please choose a species.";
    }

    if (
      speciesSizeOptions.length > 0 &&
      (speciesSizeChoice === "" ||
        !speciesSizeOptions.includes(speciesSizeChoice))
    ) {
      return "Please choose a valid species size.";
    }

    if (!backgroundId) {
      return "Please choose a background.";
    }

    if (!classDef) {
      return "Please choose a valid class.";
    }

    if (!backgroundDef) {
      return "Please choose a valid background.";
    }

    if (classSkillChoices.length !== classSkillChoiceCount) {
      return `Please choose ${classSkillChoiceCount} class skill${
        classSkillChoiceCount === 1 ? "" : "s"
      }.`;
    }

    if (classToolChoiceCount > 0) {
      if (classToolChoices.length !== classToolChoiceCount) {
        return `Please choose ${classToolChoiceCount} tool proficiency${
          classToolChoiceCount === 1 ? "" : "ies"
        }.`;
      }

      const validTools = classToolChoices.every((tool) =>
        classToolOptions.includes(tool),
      );

      if (!validTools) {
        return "Please choose valid tool proficiencies.";
      }

      if (new Set(classToolChoices).size !== classToolChoiceCount) {
        return "Tool choices must be different.";
      }
    }

    if (
      classDef.startingEquipment?.options?.length &&
      !selectedClassEquipmentOption
    ) {
      return "Please choose a class starting equipment option.";
    }

    if (needsBardStartingInstrument) {
      if (!bardStartingInstrument) {
        return "Please choose a starting musical instrument.";
      }

      if (!bardInstrumentOptions.includes(bardStartingInstrument)) {
        return "Please choose a valid starting musical instrument.";
      }
    }

    if (isCleric && !clericDivineOrder) {
      return "Please choose a Divine Order.";
    }

    if (isFighter) {
      if (!fighterFightingStyle) {
        return "Please choose a Fighting Style.";
      }

      if (
        !fighterFightingStyleOptions.includes(
          fighterFightingStyle as (typeof fighterFightingStyleOptions)[number],
        )
      ) {
        return "Please choose a valid Fighting Style.";
      }

      if (
        fighterWeaponMasteryChoices.length !== fighterWeaponMasteryChoiceCount
      ) {
        return `Fighter must choose ${fighterWeaponMasteryChoiceCount} weapon mastery options.`;
      }

      if (
        new Set(fighterWeaponMasteryChoices).size !==
        fighterWeaponMasteryChoiceCount
      ) {
        return "Fighter weapon mastery choices must be different.";
      }

      if (
        fighterWeaponMasteryChoices.some(
          (choice) => !classWeaponMasteryOptions.includes(choice),
        )
      ) {
        return "One or more Fighter weapon mastery choices are invalid.";
      }
    }

    if (effectiveClassStartingCantripChoiceCount > 0) {
      if (
        classCantripChoices.length !== effectiveClassStartingCantripChoiceCount
      ) {
        return `Please choose ${effectiveClassStartingCantripChoiceCount} class cantrip${
          effectiveClassStartingCantripChoiceCount === 1 ? "" : "s"
        }.`;
      }

      const validCantrips = classCantripChoices.every((spellId) =>
        availableClassCantrips.some((spell) => spell.id === spellId),
      );

      if (!validCantrips) {
        return "Please choose valid class cantrips.";
      }

      if (
        new Set(classCantripChoices).size !==
        effectiveClassStartingCantripChoiceCount
      ) {
        return "Class cantrip choices must be different.";
      }
    }

    if (classStartingSpellChoiceCount > 0) {
      if (classSpellChoices.length !== classStartingSpellChoiceCount) {
        return `Please choose ${classStartingSpellChoiceCount} class spell${
          classStartingSpellChoiceCount === 1 ? "" : "s"
        }.`;
      }

      const validSpells = classSpellChoices.every(
        (selection) =>
          selection.level === classStartingSpellLevel &&
          availableClassStartingSpells.some(
            (spell) => spell.id === selection.spellId,
          ),
      );

      if (!validSpells) {
        return "Please choose valid class spells.";
      }

      if (
        new Set(classSpellChoices.map((spell) => spell.spellId)).size !==
        classStartingSpellChoiceCount
      ) {
        return "Class spell choices must be different.";
      }
    }

    if (!abilityOptions.includes(backgroundBonusPlus2)) {
      return "Please choose a valid +2 background ability bonus.";
    }

    if (!abilityOptions.includes(backgroundBonusPlus1)) {
      return "Please choose a valid +1 background ability bonus.";
    }

    if (backgroundBonusPlus2 === backgroundBonusPlus1) {
      return "Your +2 and +1 background bonuses must be different abilities.";
    }

    if (
      backgroundDef.equipment?.options?.length &&
      !selectedBackgroundEquipmentOption
    ) {
      return "Please choose a background equipment option.";
    }

    if (backgroundToolRules?.type === "choice") {
      if (!backgroundToolChoice) {
        return "Please choose a background tool proficiency.";
      }

      if (!backgroundToolRules.options.includes(backgroundToolChoice)) {
        return "Please choose a valid background tool proficiency.";
      }
    }

    for (const choice of speciesChoices) {
      const value = speciesTraitChoices[choice.id];

      if (choice.choose === 1) {
        if (typeof value !== "string") {
          return `Please choose ${choice.name}.`;
        }

        const isValid = choice.options.some((option) => option.id === value);

        if (!isValid) {
          return `Please choose a valid option for ${choice.name}.`;
        }
      } else {
        if (!Array.isArray(value) || value.length !== choice.choose) {
          return `Please choose ${choice.choose} option${
            choice.choose === 1 ? "" : "s"
          } for ${choice.name}.`;
        }

        const allValid = value.every((selectedId) =>
          choice.options.some((option) => option.id === selectedId),
        );

        if (!allValid) {
          return `Please choose valid options for ${choice.name}.`;
        }
      }
    }

    if (hasBackgroundMagicInitiate) {
      if (backgroundFeatCantripChoices.length !== 2) {
        return "Please choose 2 cantrips for Magic Initiate.";
      }

      const validCantrips = backgroundFeatCantripChoices.every((spellId) =>
        backgroundMagicInitiateCantrips.some((spell) => spell.id === spellId),
      );

      if (!validCantrips) {
        return "Please choose valid Magic Initiate cantrips.";
      }

      if (new Set(backgroundFeatCantripChoices).size !== 2) {
        return "Magic Initiate cantrip choices must be different.";
      }

      if (backgroundFeatSpellChoices.length !== 1) {
        return "Please choose 1 level 1 spell for Magic Initiate.";
      }

      const chosenSpell = backgroundFeatSpellChoices[0];

      const validSpell =
        chosenSpell?.level === 1 &&
        backgroundMagicInitiateLevelOneSpells.some(
          (spell) => spell.id === chosenSpell.spellId,
        );

      if (!validSpell) {
        return "Please choose a valid Magic Initiate level 1 spell.";
      }
    }

    if (isBarbarian) {
      if (
        barbarianWeaponMasteryChoices.length !==
        barbarianWeaponMasteryChoiceCount
      ) {
        return `Barbarian must choose ${barbarianWeaponMasteryChoiceCount} weapon mastery options.`;
      }

      if (
        new Set(barbarianWeaponMasteryChoices).size !==
        barbarianWeaponMasteryChoiceCount
      ) {
        return "Barbarian weapon mastery choices must be different.";
      }

      if (
        barbarianWeaponMasteryChoices.some(
          (choice) => !classWeaponMasteryOptions.includes(choice),
        )
      ) {
        return "One or more Barbarian weapon mastery choices are invalid.";
      }
    }

    if (isRogue) {
      if (rogueExpertiseChoices.length !== 2) {
        return "Rogue must choose 2 Expertise options.";
      }

      if (
        rogueExpertiseChoices.some(
          (choice) => !rogueExpertiseOptions.includes(choice),
        )
      ) {
        return "One or more Rogue Expertise choices are invalid.";
      }

      if (!languageOptions.includes(rogueBonusLanguage)) {
        return "Please choose a valid Rogue bonus language.";
      }

      if (rogueWeaponMasteryChoices.length !== 2) {
        return "Rogue must choose 2 weapon mastery options.";
      }

      if (new Set(rogueWeaponMasteryChoices).size !== 2) {
        return "Rogue weapon mastery choices must be different.";
      }
    }

    return "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const preparedSpellIdsBySource =
        classSpellChoices.length > 0
          ? {
              [`class:${classId}`]: classSpellChoices.map(
                (spell) => spell.spellId,
              ),
            }
          : undefined;

      const baseCharacter: CharacterSheetData = {
        ownerUid: "",
        campaignId: null,
        name: name.trim(),
        level: 1,
        classId,
        speciesId,
        backgroundId,
        originFeatId: effectiveOriginFeatId,
        abilityScores,
        alignment: alignment.trim(),
        notes: notes.trim(),
        choices: {
          classSkillChoices,
          ...(classToolChoices.length > 0 ? { classToolChoices } : {}),
          ...(classCantripChoices.length > 0 ? { classCantripChoices } : {}),
          ...(classSpellChoices.length > 0 ? { classSpellChoices } : {}),
          ...(preparedSpellIdsBySource ? { preparedSpellIdsBySource } : {}),
          backgroundAbilityBonuses: {
            plus2: backgroundBonusPlus2,
            plus1: backgroundBonusPlus1,
          },
          ...(backgroundToolChoice ? { backgroundToolChoice } : {}),
          ...(backgroundFeatSpellListId ? { backgroundFeatSpellListId } : {}),
          ...(backgroundFeatCantripChoices.length > 0
            ? { backgroundFeatCantripChoices }
            : {}),
          ...(backgroundFeatSpellChoices.length > 0
            ? { backgroundFeatSpellChoices }
            : {}),
          ...(speciesSizeChoice ? { speciesSizeChoice } : {}),
          speciesTraitChoices,
          ...(humanFeatSpellListId ? { humanFeatSpellListId } : {}),
          ...(humanFeatCantripChoices.length > 0
            ? { humanFeatCantripChoices }
            : {}),
          ...(humanFeatSpellChoices.length > 0
            ? { humanFeatSpellChoices }
            : {}),
          ...(humanFeatSkillChoices.length > 0
            ? { humanFeatSkillChoices }
            : {}),
          ...(isRogue
            ? {
                rogueExpertiseChoices,
                rogueBonusLanguage,
                rogueWeaponMasteryChoices,
              }
            : {}),
          ...(isCleric && clericDivineOrder ? { clericDivineOrder } : {}),
        },
        equipment: normalizedStartingEquipment,
        money: startingMoney,
      };

      const derived = buildDerivedCharacterData(baseCharacter);

      await createCharacter({
        campaignId: null,
        name: name.trim(),
        ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),
        level: 1,
        classId,
        speciesId,
        backgroundId,
        originFeatId: effectiveOriginFeatId,
        abilityScores,
        alignment: alignment.trim(),
        notes: notes.trim(),
        choices: {
          classSkillChoices,
          ...(classToolChoices.length > 0 ? { classToolChoices } : {}),
          ...(classCantripChoices.length > 0 ? { classCantripChoices } : {}),
          ...(classSpellChoices.length > 0 ? { classSpellChoices } : {}),
          ...(preparedSpellIdsBySource ? { preparedSpellIdsBySource } : {}),
          backgroundAbilityBonuses: {
            plus2: backgroundBonusPlus2,
            plus1: backgroundBonusPlus1,
          },
          ...(backgroundToolChoice ? { backgroundToolChoice } : {}),
          ...(backgroundFeatSpellListId ? { backgroundFeatSpellListId } : {}),
          ...(backgroundFeatCantripChoices.length > 0
            ? { backgroundFeatCantripChoices }
            : {}),
          ...(backgroundFeatSpellChoices.length > 0
            ? { backgroundFeatSpellChoices }
            : {}),
          speciesTraitChoices,
          ...(humanFeatSpellListId ? { humanFeatSpellListId } : {}),
          ...(humanFeatCantripChoices.length > 0
            ? { humanFeatCantripChoices }
            : {}),
          ...(humanFeatSpellChoices.length > 0
            ? { humanFeatSpellChoices }
            : {}),
          ...(humanFeatSkillChoices.length > 0
            ? { humanFeatSkillChoices }
            : {}),
          ...(speciesSizeChoice ? { speciesSizeChoice } : {}),
          ...(isRogue
            ? {
                rogueExpertiseChoices,
                rogueBonusLanguage,
                rogueWeaponMasteryChoices,
              }
            : {}),
          ...(isCleric && clericDivineOrder ? { clericDivineOrder } : {}),
          ...(isFighter && fighterFightingStyle
            ? { fighterFightingStyle }
            : {}),
          ...(isFighter && fighterWeaponMasteryChoices.length > 0
            ? { fighterWeaponMasteryChoices }
            : {}),
        },
        derived,
        equipment: normalizedStartingEquipment,
        money: startingMoney,
      });

      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Failed to create character.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Character Creator
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Create New Character
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Build a new D&amp;D 2024 character and save it to your account.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {creationSteps.map((step, index) => {
            const isActive = step === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <button
                key={step}
                type="button"
                onClick={() => {
                  setError("");
                  setCurrentStep(step);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-zinc-950"
                    : isCompleted
                      ? "bg-white/10 text-white hover:bg-white/15"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                {index + 1}. {stepLabels[step]}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6 lg:col-span-2">
            {currentStep === "details" && (
              <>
                <h2 className="mb-5 text-xl font-semibold text-white">
                  Character Details
                </h2>

                <div className="mb-6 rounded-3xl border border-white/10 bg-zinc-900/40 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => setShowImageUrlInput((prev) => !prev)}
                      className="group h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/10"
                      aria-label="Toggle character image URL input"
                      title="Change portrait"
                    >
                      {imageUrl.trim() ? (
                        <img
                          src={imageUrl.trim()}
                          alt="Character avatar preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-500 transition group-hover:text-zinc-300">
                          {name.trim().charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-zinc-200"
                        >
                          Character name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Elaris, Brom, Kael..."
                          className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400"
                          required
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        {imageUrl.trim() && (
                          <button
                            type="button"
                            onClick={() => {
                              setImageUrl("");
                              setShowImageUrlInput(false);
                            }}
                            className="text-xs font-medium text-zinc-500 transition hover:text-red-300"
                          >
                            Remove image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {showImageUrlInput && (
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <label className="block mb-1 text-sm font-medium text-zinc-200">
                        Character image URL
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/character.jpg"
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
                      />
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <label
                      htmlFor="alignment"
                      className="text-sm font-medium text-zinc-200"
                    >
                      Alignment
                    </label>
                    <input
                      id="alignment"
                      type="text"
                      value={alignment}
                      onChange={(e) => setAlignment(e.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Base Ability Scores
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {(Object.keys(abilityLabels) as AbilityKey[]).map((key) => (
                      <div key={key} className="space-y-2">
                        <label
                          htmlFor={key}
                          className="text-sm font-medium text-zinc-200"
                        >
                          {abilityLabels[key]}
                        </label>
                        <input
                          id={key}
                          type="number"
                          inputMode="numeric"
                          value={abilityScores[key]}
                          onChange={(e) =>
                            handleAbilityChange(key, e.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <label
                    htmlFor="notes"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Appearance, personality, backstory, goals..."
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400"
                  />
                </div>
              </>
            )}

            {currentStep === "class" && (
              <>
                <h2 className="mb-5 text-xl font-semibold text-white">Class</h2>

                <div className="space-y-2">
                  <label
                    htmlFor="classId"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Class
                  </label>
                  <select
                    id="classId"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                  >
                    <option value="">Select class</option>
                    {classes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Class Skill Choices
                  </h3>

                  <p className="mb-4 text-sm text-zinc-400">
                    Choose {classSkillChoiceCount} skill
                    {classSkillChoiceCount === 1 ? "" : "s"} from your class.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {classSkillOptions.map((skill) => {
                      const isSelected = classSkillChoices.includes(skill);

                      return (
                        <label
                          key={skill}
                          className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                            isSelected
                              ? "border-white/25 bg-white/10"
                              : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleClassSkill(skill)}
                            className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                          />
                          <span className="text-sm text-white">
                            {formatLabel(skill)}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <p className="mt-3 text-xs text-zinc-500">
                    Selected: {classSkillChoices.length} /{" "}
                    {classSkillChoiceCount}
                  </p>
                </div>

                {isCleric && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Divine Order
                    </h3>

                    <p className="mb-4 text-sm text-zinc-400">
                      Choose your sacred role.
                    </p>

                    <div className="space-y-3">
                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                          clericDivineOrder === "protector"
                            ? "border-white/25 bg-white/10"
                            : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cleric-divine-order"
                          value="protector"
                          checked={clericDivineOrder === "protector"}
                          onChange={() => setClericDivineOrder("protector")}
                          className="mt-1 h-4 w-4 border-white/20 bg-zinc-900"
                        />
                        <div>
                          <p className="text-sm font-medium text-white">
                            Protector
                          </p>
                          <p className="mt-1 text-xs leading-5 text-zinc-400">
                            Gain proficiency with Martial weapons and training
                            with Heavy armor.
                          </p>
                        </div>
                      </label>

                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                          clericDivineOrder === "thaumaturge"
                            ? "border-white/25 bg-white/10"
                            : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cleric-divine-order"
                          value="thaumaturge"
                          checked={clericDivineOrder === "thaumaturge"}
                          onChange={() => setClericDivineOrder("thaumaturge")}
                          className="mt-1 h-4 w-4 border-white/20 bg-zinc-900"
                        />
                        <div>
                          <p className="text-sm font-medium text-white">
                            Thaumaturge
                          </p>
                          <p className="mt-1 text-xs leading-5 text-zinc-400">
                            Learn one extra Cleric cantrip and gain a bonus to
                            Intelligence (Arcana or Religion) checks equal to
                            your Wisdom modifier, minimum +1.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {isFighter && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Fighting Style
                    </h3>

                    <p className="mb-4 text-sm text-zinc-400">
                      Choose 1 Fighting Style.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {fighterFightingStyleOptions.map((style) => {
                        const isSelected = fighterFightingStyle === style;

                        return (
                          <label
                            key={style}
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                              isSelected
                                ? "border-white/25 bg-white/10"
                                : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                            }`}
                          >
                            <input
                              type="radio"
                              name="fighter-fighting-style"
                              checked={isSelected}
                              onChange={() => setFighterFightingStyle(style)}
                              className="h-4 w-4 border-white/20 bg-zinc-900"
                            />
                            <span className="text-sm text-white">
                              {formatLabel(style)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isFighter && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Fighter Weapon Mastery
                    </h3>

                    <p className="mb-4 text-sm text-zinc-400">
                      Choose {fighterWeaponMasteryChoiceCount} weapons for
                      Weapon Mastery.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {classWeaponMasteryOptions.map((choice) => {
                        const isSelected =
                          fighterWeaponMasteryChoices.includes(choice);

                        return (
                          <label
                            key={choice}
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                              isSelected
                                ? "border-white/25 bg-white/10"
                                : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                toggleFighterWeaponMastery(choice)
                              }
                              className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                            />
                            <span className="text-sm text-white">
                              {formatLabel(choice)}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <p className="mt-3 text-xs text-zinc-500">
                      Selected: {fighterWeaponMasteryChoices.length} /{" "}
                      {fighterWeaponMasteryChoiceCount}
                    </p>
                  </div>
                )}

                {classDef?.startingEquipment?.options?.length ? (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Class Starting Equipment
                    </h3>

                    <div className="space-y-3">
                      {classDef.startingEquipment.options.map((option) => {
                        const isSelected = classEquipmentOptionId === option.id;

                        return (
                          <label
                            key={option.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                              isSelected
                                ? "border-white/25 bg-white/10"
                                : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                            }`}
                          >
                            <input
                              type="radio"
                              name="class-equipment"
                              checked={isSelected}
                              onChange={() =>
                                setClassEquipmentOptionId(option.id)
                              }
                              className="mt-1 h-4 w-4 border-white/20 bg-zinc-900"
                            />
                            <div>
                              <p className="text-sm font-medium text-white">
                                {option.label}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {needsBardStartingInstrument && (
                  <div className="mt-6">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Starting Musical Instrument
                    </h3>

                    <div className="space-y-2">
                      <label
                        htmlFor="bardStartingInstrument"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Choose instrument
                      </label>
                      <select
                        id="bardStartingInstrument"
                        value={bardStartingInstrument}
                        onChange={(e) =>
                          setBardStartingInstrument(e.target.value as ToolId)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                      >
                        {bardInstrumentOptions.map((tool) => (
                          <option key={tool} value={tool}>
                            {formatLabel(tool)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {classToolChoiceCount > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Tool Proficiencies
                    </h3>

                    <p className="mb-4 text-sm text-zinc-400">
                      Choose {classToolChoiceCount} musical instrument
                      {classToolChoiceCount === 1 ? "" : "s"}.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {classToolOptions.map((tool) => {
                        const isSelected = classToolChoices.includes(tool);

                        return (
                          <label
                            key={tool}
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                              isSelected
                                ? "border-white/25 bg-white/10"
                                : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                setClassToolChoices((prev) => {
                                  if (prev.includes(tool)) {
                                    return prev.filter((t) => t !== tool);
                                  }

                                  if (prev.length >= classToolChoiceCount) {
                                    return prev;
                                  }

                                  return [...prev, tool];
                                });
                              }}
                              className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                            />
                            <span className="text-sm text-white">
                              {formatLabel(tool)}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <p className="mt-3 text-xs text-zinc-500">
                      Selected: {classToolChoices.length} /{" "}
                      {classToolChoiceCount}
                    </p>
                  </div>
                )}

                {effectiveClassStartingCantripChoiceCount > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Class Cantrips
                    </h3>

                    <p className="mb-4 text-sm text-zinc-400">
                      Choose {effectiveClassStartingCantripChoiceCount} cantrip
                      {effectiveClassStartingCantripChoiceCount === 1
                        ? ""
                        : "s"}
                      .
                    </p>

                    <div className="mb-4">
                      <SpellPreviewCard spell={classCantripPreviewSpell} />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {availableClassCantrips.map((spell) => {
                        const isSelected = classCantripChoices.includes(
                          spell.id,
                        );

                        return (
                          <label
                            key={spell.id}
                            onMouseEnter={() =>
                              setClassCantripPreviewSpell(spell)
                            }
                            onFocus={() => setClassCantripPreviewSpell(spell)}
                            onClick={() => setClassCantripPreviewSpell(spell)}
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                              isSelected
                                ? "border-white/25 bg-white/10"
                                : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                toggleClassCantripChoice(spell.id)
                              }
                              className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                            />
                            <span className="text-sm text-white">
                              {spell.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {classStartingSpellChoiceCount > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Class Spells
                    </h3>

                    <p className="mb-4 text-sm text-zinc-400">
                      Choose {classStartingSpellChoiceCount} level{" "}
                      {classStartingSpellLevel} spell
                      {classStartingSpellChoiceCount === 1 ? "" : "s"}.
                    </p>

                    <div className="mb-4">
                      <SpellPreviewCard spell={classSpellPreviewSpell} />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {availableClassStartingSpells.map((spell) => {
                        const isSelected = classSpellChoices.some(
                          (entry) => entry.spellId === spell.id,
                        );

                        return (
                          <label
                            key={spell.id}
                            onMouseEnter={() =>
                              setClassSpellPreviewSpell(spell)
                            }
                            onFocus={() => setClassSpellPreviewSpell(spell)}
                            onClick={() => setClassSpellPreviewSpell(spell)}
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                              isSelected
                                ? "border-white/25 bg-white/10"
                                : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                toggleClassSpellChoice(spell.id, spell.level)
                              }
                              className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                            />
                            <span className="text-sm text-white">
                              {spell.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isBarbarian && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Barbarian Weapon Mastery
                    </h3>

                    <p className="mb-4 text-sm text-zinc-400">
                      Choose {barbarianWeaponMasteryChoiceCount} weapons for
                      Weapon Mastery.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {classWeaponMasteryOptions.map((choice) => {
                        const isSelected =
                          barbarianWeaponMasteryChoices.includes(choice);

                        return (
                          <label
                            key={choice}
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                              isSelected
                                ? "border-white/25 bg-white/10"
                                : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                toggleBarbarianWeaponMastery(choice)
                              }
                              className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                            />
                            <span className="text-sm text-white">
                              {formatLabel(choice)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isRogue && (
                  <>
                    <div className="mt-8">
                      <h3 className="mb-4 text-lg font-semibold text-white">
                        Rogue Expertise
                      </h3>

                      <p className="mb-4 text-sm text-zinc-400">
                        Choose 2 proficiencies to gain Expertise.
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {rogueExpertiseOptions.map((choice) => {
                          const isSelected =
                            rogueExpertiseChoices.includes(choice);

                          return (
                            <label
                              key={choice}
                              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                                isSelected
                                  ? "border-white/25 bg-white/10"
                                  : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleRogueExpertise(choice)}
                                className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                              />
                              <span className="text-sm text-white">
                                {choice === "thieves-tools"
                                  ? "Thieves' Tools"
                                  : formatLabel(choice)}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="rogueBonusLanguage"
                          className="text-sm font-medium text-zinc-200"
                        >
                          Thieves&apos; Cant bonus language
                        </label>
                        <select
                          id="rogueBonusLanguage"
                          value={rogueBonusLanguage}
                          onChange={(e) =>
                            setRogueBonusLanguage(e.target.value as LanguageId)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                        >
                          {languageOptions.map((language) => (
                            <option key={language} value={language}>
                              {formatLabel(language)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="mb-4 text-lg font-semibold text-white">
                        Rogue Weapon Mastery
                      </h3>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {rogueWeaponMasteryOptions.map((choice) => {
                          const isSelected =
                            rogueWeaponMasteryChoices.includes(choice);

                          return (
                            <label
                              key={choice}
                              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                                isSelected
                                  ? "border-white/25 bg-white/10"
                                  : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleRogueWeaponMastery(choice)
                                }
                                className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                              />
                              <span className="text-sm text-white">
                                {formatLabel(choice)}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {currentStep === "species" && (
              <>
                <h2 className="mb-5 text-xl font-semibold text-white">
                  Species
                </h2>

                <div className="space-y-2">
                  <label
                    htmlFor="speciesId"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Species
                  </label>
                  <select
                    id="speciesId"
                    value={speciesId}
                    onChange={(e) => setSpeciesId(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                  >
                    <option value="">Select species</option>
                    {species.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {speciesSizeOptions.length > 0 && (
                  <div className="mt-8 space-y-2">
                    <label
                      htmlFor="speciesSizeChoice"
                      className="text-sm font-medium text-zinc-200"
                    >
                      Species Size
                    </label>
                    <select
                      id="speciesSizeChoice"
                      value={speciesSizeChoice}
                      onChange={(e) =>
                        setSpeciesSizeChoice(
                          e.target.value as "Small" | "Medium",
                        )
                      }
                      className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                    >
                      {speciesSizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {speciesChoices.length > 0 && (
                  <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-300">
                      Species Choices
                    </h3>

                    <div className="space-y-4">
                      {speciesChoices.map((choice) => {
                        const selectedValue = speciesTraitChoices[choice.id];

                        return (
                          <div key={choice.id} className="space-y-2">
                            <label
                              htmlFor={choice.id}
                              className="text-sm font-medium text-zinc-200"
                            >
                              {choice.name}
                            </label>

                            {choice.choose === 1 ? (
                              <select
                                id={choice.id}
                                value={
                                  typeof selectedValue === "string"
                                    ? selectedValue
                                    : ""
                                }
                                onChange={(e) =>
                                  setSpeciesChoiceValue(
                                    choice.id,
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                              >
                                {choice.options.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="grid gap-3 sm:grid-cols-2">
                                {choice.options.map((option) => {
                                  const values = Array.isArray(selectedValue)
                                    ? selectedValue
                                    : [];
                                  const isSelected = values.includes(option.id);

                                  return (
                                    <label
                                      key={option.id}
                                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                                        isSelected
                                          ? "border-white/25 bg-white/10"
                                          : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {
                                          setSpeciesTraitChoices((prev) => {
                                            const current = Array.isArray(
                                              prev[choice.id],
                                            )
                                              ? (prev[choice.id] as string[])
                                              : [];

                                            if (current.includes(option.id)) {
                                              return {
                                                ...prev,
                                                [choice.id]: current.filter(
                                                  (item) => item !== option.id,
                                                ),
                                              };
                                            }

                                            if (
                                              current.length >= choice.choose
                                            ) {
                                              return prev;
                                            }

                                            return {
                                              ...prev,
                                              [choice.id]: [
                                                ...current,
                                                option.id,
                                              ],
                                            };
                                          });
                                        }}
                                        className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                                      />
                                      <span className="text-sm text-white">
                                        {option.name}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {humanFeatGrant?.type === "magic-initiate" && (
                  <div className="mt-8 space-y-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="humanFeatSpellListId"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Human Magic Initiate Spell List
                      </label>
                      <select
                        id="humanFeatSpellListId"
                        value={humanFeatSpellListId}
                        onChange={(e) =>
                          setHumanFeatSpellListId(
                            e.target.value as Extract<
                              SpellListId,
                              "cleric" | "druid" | "wizard"
                            >,
                          )
                        }
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                      >
                        {humanFeatGrant.spellListOptions.map((listId) => (
                          <option key={listId} value={listId}>
                            {formatLabel(listId)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-white">
                        Human Magic Initiate Cantrips
                      </h3>

                      <div className="mb-4">
                        <SpellPreviewCard
                          spell={humanMagicInitiateCantripPreviewSpell}
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {humanMagicInitiateCantrips.map((spell) => {
                          const isSelected = humanFeatCantripChoices.includes(
                            spell.id,
                          );

                          return (
                            <label
                              key={spell.id}
                              onMouseEnter={() =>
                                setHumanMagicInitiateCantripPreviewSpell(spell)
                              }
                              onFocus={() =>
                                setHumanMagicInitiateCantripPreviewSpell(spell)
                              }
                              onClick={() =>
                                setHumanMagicInitiateCantripPreviewSpell(spell)
                              }
                              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                                isSelected
                                  ? "border-white/25 bg-white/10"
                                  : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleHumanFeatCantrip(spell.id)
                                }
                                className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                              />
                              <span className="text-sm text-white">
                                {spell.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-white">
                        Human Magic Initiate Level 1 Spell
                      </h3>

                      <p className="mb-4 text-sm text-zinc-400">
                        Choose 1 level 1 spell.
                      </p>

                      <div className="mb-4">
                        <SpellPreviewCard
                          spell={humanMagicInitiateSpellPreviewSpell}
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {humanMagicInitiateLevelOneSpells.map((spell) => {
                          const isSelected = humanFeatSpellChoices.some(
                            (entry) => entry.spellId === spell.id,
                          );

                          return (
                            <label
                              key={spell.id}
                              onMouseEnter={() =>
                                setHumanMagicInitiateSpellPreviewSpell(spell)
                              }
                              onFocus={() =>
                                setHumanMagicInitiateSpellPreviewSpell(spell)
                              }
                              onClick={() =>
                                setHumanMagicInitiateSpellPreviewSpell(spell)
                              }
                              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                                isSelected
                                  ? "border-white/25 bg-white/10"
                                  : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleHumanFeatSpellChoice(spell.id)
                                }
                                className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                              />
                              <span className="text-sm text-white">
                                {spell.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {humanFeatGrant?.type === "skilled" && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Skilled
                    </h3>

                    <p className="mb-4 text-sm text-zinc-400">
                      Choose {humanSkilledChoiceCount} skills.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "acrobatics",
                        "animal-handling",
                        "arcana",
                        "athletics",
                        "deception",
                        "history",
                        "insight",
                        "intimidation",
                        "investigation",
                        "medicine",
                        "nature",
                        "perception",
                        "performance",
                        "persuasion",
                        "religion",
                        "sleight-of-hand",
                        "stealth",
                        "survival",
                      ].map((skill) => {
                        const typedSkill = skill as SkillId;
                        const isSelected =
                          humanFeatSkillChoices.includes(typedSkill);

                        return (
                          <label
                            key={skill}
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                              isSelected
                                ? "border-white/25 bg-white/10"
                                : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                toggleHumanFeatSkillChoice(typedSkill)
                              }
                              className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                            />
                            <span className="text-sm text-white">
                              {formatLabel(skill)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {currentStep === "background" && (
              <>
                <h2 className="mb-5 text-xl font-semibold text-white">
                  Background
                </h2>

                <div className="space-y-2">
                  <label
                    htmlFor="backgroundId"
                    className="text-sm font-medium text-zinc-200"
                  >
                    Background
                  </label>
                  <select
                    id="backgroundId"
                    value={backgroundId}
                    onChange={(e) => setBackgroundId(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                  >
                    <option value="">Select background</option>
                    {backgrounds.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Background Ability Bonuses
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="backgroundBonusPlus2"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Background bonus +2
                      </label>
                      <select
                        id="backgroundBonusPlus2"
                        value={backgroundBonusPlus2}
                        onChange={(e) =>
                          setBackgroundBonusPlus2(e.target.value as AbilityKey)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                      >
                        {abilityOptions.map((ability) => (
                          <option key={ability} value={ability}>
                            {abilityLabels[ability]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="backgroundBonusPlus1"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Background bonus +1
                      </label>
                      <select
                        id="backgroundBonusPlus1"
                        value={backgroundBonusPlus1}
                        onChange={(e) =>
                          setBackgroundBonusPlus1(e.target.value as AbilityKey)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                      >
                        {abilityOptions.map((ability) => (
                          <option
                            key={ability}
                            value={ability}
                            disabled={ability === backgroundBonusPlus2}
                          >
                            {abilityLabels[ability]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {backgroundToolRules?.type === "choice" && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Background Tool Proficiency
                    </h3>

                    <div className="space-y-2">
                      <label
                        htmlFor="backgroundToolChoice"
                        className="text-sm font-medium text-zinc-200"
                      >
                        Choose tool proficiency
                      </label>
                      <select
                        id="backgroundToolChoice"
                        value={backgroundToolChoice}
                        onChange={(e) =>
                          setBackgroundToolChoice(e.target.value as ToolId)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                      >
                        {backgroundToolOptions.map((tool) => (
                          <option key={tool} value={tool}>
                            {formatLabel(tool)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {hasBackgroundMagicInitiate && (
                  <div className="mt-8 space-y-6">
                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-white">
                        Magic Initiate Cantrips
                      </h3>

                      <div className="mb-4">
                        <SpellPreviewCard
                          spell={backgroundMagicInitiateCantripPreviewSpell}
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {backgroundMagicInitiateCantrips.map((spell) => {
                          const isSelected =
                            backgroundFeatCantripChoices.includes(spell.id);

                          return (
                            <label
                              key={spell.id}
                              onMouseEnter={() =>
                                setBackgroundMagicInitiateCantripPreviewSpell(
                                  spell,
                                )
                              }
                              onFocus={() =>
                                setBackgroundMagicInitiateCantripPreviewSpell(
                                  spell,
                                )
                              }
                              onClick={() =>
                                setBackgroundMagicInitiateCantripPreviewSpell(
                                  spell,
                                )
                              }
                              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                                isSelected
                                  ? "border-white/25 bg-white/10"
                                  : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleBackgroundFeatCantrip(spell.id)
                                }
                                className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                              />
                              <span className="text-sm text-white">
                                {spell.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-lg font-semibold text-white">
                        Magic Initiate Level 1 Spell
                      </h3>

                      <p className="mb-4 text-sm text-zinc-400">
                        Choose 1 level 1 spell.
                      </p>

                      <div className="mb-4">
                        <SpellPreviewCard
                          spell={backgroundMagicInitiateSpellPreviewSpell}
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {backgroundMagicInitiateLevelOneSpells.map((spell) => {
                          const isSelected = backgroundFeatSpellChoices.some(
                            (entry) => entry.spellId === spell.id,
                          );

                          return (
                            <label
                              key={spell.id}
                              onMouseEnter={() =>
                                setBackgroundMagicInitiateSpellPreviewSpell(
                                  spell,
                                )
                              }
                              onFocus={() =>
                                setBackgroundMagicInitiateSpellPreviewSpell(
                                  spell,
                                )
                              }
                              onClick={() =>
                                setBackgroundMagicInitiateSpellPreviewSpell(
                                  spell,
                                )
                              }
                              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                                isSelected
                                  ? "border-white/25 bg-white/10"
                                  : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleBackgroundFeatSpellChoice(spell.id)
                                }
                                className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                              />
                              <span className="text-sm text-white">
                                {spell.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {backgroundDef?.equipment?.options?.length ? (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      Background Equipment
                    </h3>

                    <div className="space-y-3">
                      {backgroundDef.equipment.options.map((option) => {
                        const isSelected =
                          backgroundEquipmentOptionId === option.id;

                        return (
                          <label
                            key={option.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                              isSelected
                                ? "border-white/25 bg-white/10"
                                : "border-white/10 bg-zinc-900/70 hover:bg-zinc-900"
                            }`}
                          >
                            <input
                              type="radio"
                              name="background-equipment"
                              checked={isSelected}
                              onChange={() =>
                                setBackgroundEquipmentOptionId(option.id)
                              }
                              className="mt-1 h-4 w-4 border-white/20 bg-zinc-900"
                            />
                            <div>
                              <p className="text-sm font-medium text-white">
                                {option.label}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </>
            )}

            {currentStep === "review" && (
              <>
                <h2 className="mb-5 text-xl font-semibold text-white">
                  Review
                </h2>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Character
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-zinc-200">
                      <p>
                        <span className="text-zinc-500">Name:</span>{" "}
                        {name || "—"}
                      </p>
                      <p>
                        <span className="text-zinc-500">Class:</span>{" "}
                        {classDef?.name ?? "—"}
                      </p>
                      <p>
                        <span className="text-zinc-500">Species:</span>{" "}
                        {speciesId ? formatLabel(speciesId) : "—"}
                      </p>
                      <p>
                        <span className="text-zinc-500">Background:</span>{" "}
                        {backgroundDef?.name ?? "—"}
                      </p>
                      <p>
                        <span className="text-zinc-500">Alignment:</span>{" "}
                        {alignment || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Ability Scores
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-zinc-200 sm:grid-cols-3">
                      {(Object.keys(abilityLabels) as AbilityKey[]).map(
                        (key) => (
                          <div
                            key={key}
                            className="rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2"
                          >
                            {abilityLabels[key]}: {abilityScores[key]}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={isFirstStep ? () => navigate(-1) : goToPreviousStep}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {isFirstStep ? "Cancel" : "Back"}
              </button>

              {!isLastStep ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Creating character..." : "Create character"}
                </button>
              )}
            </div>
          </section>

          {/* Character summary left panel */}
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
            <h2 className="mb-5 text-xl font-semibold text-white">
              Character Summary
            </h2>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Active traits & features
              </p>

              <div className="mt-3 space-y-3">
                {activeAllTraits.length > 0 ? (
                  activeAllTraits.map((trait) => {
                    const lines = getTraitSummaryLines(trait);

                    return (
                      <div
                        key={trait.id}
                        className="rounded-2xl border border-white/10 bg-zinc-900/70 p-3"
                      >
                        <p className="text-sm font-medium text-white">
                          {trait.name}
                        </p>

                        {lines.length > 0 ? (
                          <ul className="mt-2 space-y-1">
                            {lines.map((line, index) => (
                              <li
                                key={`${trait.id}-${index}`}
                                className="text-xs leading-5 text-zinc-400"
                              >
                                • {line}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-xs leading-5 text-zinc-500">
                            No additional details yet.
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-zinc-400">
                    No active traits found.
                  </p>
                )}
              </div>
            </div>

            {isFighter && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Fighting Style
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  {fighterFightingStyle
                    ? formatLabel(fighterFightingStyle)
                    : "None selected"}
                </p>
              </div>
            )}

            {isFighter && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Fighter Weapon Mastery
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {fighterWeaponMasteryChoices.length > 0 ? (
                    fighterWeaponMasteryChoices.map((choice) => (
                      <span
                        key={choice}
                        className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                      >
                        {formatLabel(choice)}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400">None selected</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 space-y-5">
              {(speciesSizeOptions.length > 0 || speciesChoices.length > 0) && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Species choices
                  </p>

                  <div className="mt-2 space-y-2">
                    {speciesChoices.map((choice) => {
                      const selectedValue = speciesTraitChoices[choice.id];

                      return (
                        <div key={choice.id}>
                          <p className="text-xs text-zinc-500">{choice.name}</p>
                          <p className="text-sm text-zinc-200">
                            {typeof selectedValue === "string"
                              ? (choice.options.find(
                                  (option) => option.id === selectedValue,
                                )?.name ?? "None selected")
                              : Array.isArray(selectedValue)
                                ? selectedValue
                                    .map(
                                      (value) =>
                                        choice.options.find(
                                          (option) => option.id === value,
                                        )?.name ?? value,
                                    )
                                    .join(", ")
                                : "None selected"}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {speciesId === "dragonborn" && selectedDragonbornAncestry && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-zinc-500">
                        Breath Weapon Damage Type
                      </p>
                      <p className="text-sm text-zinc-200">
                        {formatLabel(selectedDragonbornAncestry.damageType)}
                      </p>

                      <p className="text-xs text-zinc-500">Damage Resistance</p>
                      <p className="text-sm text-zinc-200">
                        {formatLabel(selectedDragonbornAncestry.damageType)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Background feat
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  {backgroundId
                    ? (backgroundGrantedFeatName ?? "None")
                    : "No background selected"}
                </p>
              </div>

              {hasBackgroundMagicInitiate && (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Magic Initiate Cantrips
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {backgroundFeatCantripChoices.length > 0 ? (
                        backgroundFeatCantripChoices.map((spellId) => {
                          const spell = backgroundMagicInitiateCantrips.find(
                            (entry) => entry.id === spellId,
                          );

                          return (
                            <span
                              key={spellId}
                              className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                            >
                              {spell?.name ?? spellId}
                            </span>
                          );
                        })
                      ) : (
                        <p className="text-sm text-zinc-400">None selected</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Magic Initiate Spell
                    </p>
                    <p className="mt-2 text-sm text-zinc-200">
                      {backgroundFeatSpellChoices[0]
                        ? (backgroundMagicInitiateLevelOneSpells.find(
                            (spell) =>
                              spell.id ===
                              backgroundFeatSpellChoices[0].spellId,
                          )?.name ?? backgroundFeatSpellChoices[0].spellId)
                        : "None selected"}
                    </p>
                  </div>
                </>
              )}

              {speciesSizeChoice && (
                <p>
                  <span className="text-zinc-500">Size:</span>{" "}
                  {speciesSizeChoice}
                </p>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Species feat
                </p>

                {!speciesId ? (
                  <p className="mt-2 text-sm text-zinc-400">
                    No species selected
                  </p>
                ) : speciesGrantedFeatNames.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {speciesGrantedFeatNames.map((featName) => (
                      <span
                        key={featName}
                        className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                      >
                        {featName}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-zinc-400">None</p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Background skills
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {!backgroundId ? (
                    <p className="text-sm text-zinc-400">
                      No background selected
                    </p>
                  ) : grantedSkills.length > 0 ? (
                    grantedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                      >
                        {formatLabel(skill)}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400">None</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Class skills
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {!classId ? (
                    <p className="text-sm text-zinc-400">No class selected</p>
                  ) : classSkillChoices.length > 0 ? (
                    classSkillChoices.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                      >
                        {formatLabel(skill)}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400">None selected</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Tool proficiency
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  {!backgroundId
                    ? "No background selected"
                    : grantedTool
                      ? formatLabel(grantedTool)
                      : "None"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Background ability bonuses
                </p>
                {backgroundId ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                      +2 {abilityLabels[backgroundBonusPlus2]}
                    </span>
                    <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                      +1 {abilityLabels[backgroundBonusPlus1]}
                    </span>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-zinc-400">
                    No background selected
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Starting equipment
                </p>

                <div className="mt-2 space-y-2">
                  {normalizedStartingEquipment.length > 0 ? (
                    normalizedStartingEquipment.map((item) => (
                      <div
                        key={item.instanceId}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900 px-3 py-2"
                      >
                        <span className="text-sm text-zinc-200">
                          {item.name}
                        </span>
                        <span className="text-xs text-zinc-400">
                          x{item.quantity}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400">
                      {!classId && !backgroundId
                        ? "Select class and background to see equipment"
                        : "No equipment selected"}
                    </p>
                  )}
                </div>

                {startingMoney.cp ||
                startingMoney.sp ||
                startingMoney.ep ||
                startingMoney.gp ||
                startingMoney.pp ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["cp", "sp", "ep", "gp", "pp"] as const).map(
                      (currency) =>
                        startingMoney[currency] ? (
                          <span
                            key={currency}
                            className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                          >
                            {startingMoney[currency]} {currency.toUpperCase()}
                          </span>
                        ) : null,
                    )}
                  </div>
                ) : null}
              </div>

              {isRogue && (
                <>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Rogue Expertise
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {rogueExpertiseChoices.length > 0 ? (
                        rogueExpertiseChoices.map((choice) => (
                          <span
                            key={choice}
                            className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                          >
                            {choice === "thieves-tools"
                              ? "Thieves' Tools"
                              : formatLabel(choice)}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-400">None selected</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Thieves&apos; Cant bonus language
                    </p>
                    <p className="mt-2 text-sm text-zinc-200">
                      {formatLabel(rogueBonusLanguage)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Rogue Weapon Mastery
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {rogueWeaponMasteryChoices.length > 0 ? (
                        rogueWeaponMasteryChoices.map((choice) => (
                          <span
                            key={choice}
                            className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                          >
                            {formatLabel(choice)}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-400">None selected</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
              <p className="text-sm font-medium text-white">
                Step {currentStepIndex + 1} of {creationSteps.length}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {stepLabels[currentStep]}
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default NewCharacter;
