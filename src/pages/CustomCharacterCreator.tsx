import { FormEvent, useEffect, useMemo, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { doc, serverTimestamp, writeBatch } from "firebase/firestore";

import { createCharacter } from "../characters";
import { db } from "../firebase";

import ItemPickerModal from "../components/character/ItemPickerModal";

import SpellPickerModal from "../components/character/SpellPickerModal";
import CharacterFeaturesEditor from "../components/character/CharacterFeaturesEditor";

import { defaultCharacterPortraits } from "../data/defaultCharacterPortraits";

import { itemsById } from "../rulesets/dnd/dnd2024/data/items";
import { calculateArmorClass } from "../rulesets/dnd/dnd2024/armorClass";
import type { ArmorClassMode } from "../rulesets/dnd/dnd2024/armorClass";
import { resolveItemFromEquipmentEntry } from "../rulesets/dnd/dnd2024/resolveItem";

import type {
  AbilityKey,
  CharacterEquipmentEntry,
  Money,
} from "../rulesets/dnd/dnd2024/types";

import {
  createEmptyCustomSkills,
  createEmptySpellSlots,
  customSkillDefinitions,
} from "../types/customCharacter";

import type {
  CustomCharacter,
  CustomProficiencyLevel,
  CustomSpellEntry,
  CustomSpellcasting,
  CustomTrait,
} from "../types/customCharacter";

type CustomCharacterCreatorProps = {
  onBackToModeSelect?: () => void;

  mode?: "create" | "edit";

  characterId?: string;

  initialCharacter?: CustomCharacter;
};

type EditorTab = "mechanics" | "details";

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

const getRandomDefaultPortraitUrl = () => {
  if (defaultCharacterPortraits.length === 0) {
    return "";
  }

  return defaultCharacterPortraits[
    Math.floor(Math.random() * defaultCharacterPortraits.length)
  ].url;
};

const getModifier = (score: number) => Math.floor((score - 10) / 2);

const formatModifier = (value: number) =>
  value >= 0 ? `+${value}` : `${value}`;

const formatItemCategory = (value?: string) => {
  if (!value) {
    return "Item";
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const splitTextList = (value: string) =>
  value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);

const joinTextList = (values?: string[]) => (values ?? []).join("\n");

const normalizeProficiency = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const armorProficiencyPresets = [
  { id: "light-armor", label: "Light Armor" },
  { id: "medium-armor", label: "Medium Armor" },
  { id: "heavy-armor", label: "Heavy Armor" },
  { id: "shields", label: "Shields" },
] as const;

const weaponProficiencyPresets = [
  { id: "simple-weapons", label: "Simple Weapons" },
  { id: "martial-weapons", label: "Martial Weapons" },
  { id: "unarmed-strikes", label: "Unarmed Strikes" },
  {
    id: "martial-finesse-or-light",
    label: "Martial Weapons with Finesse or Light",
  },
] as const;

type ArmorProficiencyPresetId = (typeof armorProficiencyPresets)[number]["id"];

type WeaponProficiencyPresetId =
  (typeof weaponProficiencyPresets)[number]["id"];

const getSelectedPresetIds = <TId extends string>(
  values: string[] | undefined,
  presets: readonly { id: TId; label: string }[],
): TId[] => {
  const normalizedValues = new Set(
    (values ?? []).map((value) => normalizeProficiency(value)),
  );

  return presets
    .filter(
      (preset) =>
        normalizedValues.has(normalizeProficiency(preset.id)) ||
        normalizedValues.has(normalizeProficiency(preset.label)),
    )
    .map((preset) => preset.id);
};

const getCustomProficiencyValues = <TId extends string>(
  values: string[] | undefined,
  presets: readonly { id: TId; label: string }[],
) => {
  const presetAliases = new Set(
    presets.flatMap((preset) => [
      normalizeProficiency(preset.id),
      normalizeProficiency(preset.label),
    ]),
  );

  return (values ?? []).filter(
    (value) => !presetAliases.has(normalizeProficiency(value)),
  );
};

const mergePresetAndCustomProficiencies = (
  presetIds: string[],
  customText: string,
) => {
  const seen = new Set<string>();

  return [...presetIds, ...splitTextList(customText)].filter((value) => {
    const key = normalizeProficiency(value);

    if (!key || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const createEquipmentInstanceId = (
  baseId: string,
  equipment: CharacterEquipmentEntry[],
) => {
  const usedIds = new Set(equipment.map((entry) => entry.instanceId));

  let number = 1;

  while (usedIds.has(`${baseId}__${number}`)) {
    number += 1;
  }

  return `${baseId}__${number}`;
};

const CustomCharacterCreator = ({
  onBackToModeSelect,

  mode = "create",

  characterId,

  initialCharacter,
}: CustomCharacterCreatorProps) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const isEditing = mode === "edit";

  const [activeEditorTab, setActiveEditorTab] =
    useState<EditorTab>("mechanics");

  const campaignIdFromQuery = searchParams.get("campaignId");

  const campaignMode = searchParams.get("campaignMode");

  const isCampaignUnassignedCreate =
    !isEditing && Boolean(campaignIdFromQuery) && campaignMode === "unassigned";

  const initialStats = initialCharacter?.customStats ?? {};

  const initialProficiencies = initialCharacter?.customProficiencies;

  const [name, setName] = useState(initialCharacter?.name ?? "");

  const [imageUrl, setImageUrl] = useState(() => {
    if (isEditing) {
      return initialCharacter?.imageUrl ?? "";
    }

    return getRandomDefaultPortraitUrl();
  });

  const [showPortraitPicker, setShowPortraitPicker] = useState(false);

  const [showImageUrlInput, setShowImageUrlInput] = useState(false);

  const [customClassName, setCustomClassName] = useState(
    initialCharacter?.className ?? "",
  );

  const [customSpeciesName, setCustomSpeciesName] = useState(
    initialCharacter?.speciesName ?? "",
  );

  const [customBackgroundName, setCustomBackgroundName] = useState(
    initialCharacter?.backgroundName ?? "",
  );

  const [customLevel, setCustomLevel] = useState(initialCharacter?.level ?? 1);

  const [alignment, setAlignment] = useState(initialCharacter?.alignment ?? "");

  const [age, setAge] = useState(initialCharacter?.age ?? "");
  const [height, setHeight] = useState(initialCharacter?.height ?? "");
  const [weight, setWeight] = useState(initialCharacter?.weight ?? "");
  const [eyes, setEyes] = useState(initialCharacter?.eyes ?? "");
  const [skin, setSkin] = useState(initialCharacter?.skin ?? "");
  const [hair, setHair] = useState(initialCharacter?.hair ?? "");

  const [characterAppearance, setCharacterAppearance] = useState(
    initialCharacter?.characterAppearance ?? "",
  );

  const [alliesAndOrganizations, setAlliesAndOrganizations] = useState(
    initialCharacter?.alliesAndOrganizations ?? "",
  );

  const [characterBackstory, setCharacterBackstory] = useState(
    initialCharacter?.characterBackstory ?? initialCharacter?.notes ?? "",
  );

  const [personalityTraits, setPersonalityTraits] = useState(
    initialCharacter?.personalityTraits ?? "",
  );

  const [ideals, setIdeals] = useState(initialCharacter?.ideals ?? "");

  const [bonds, setBonds] = useState(initialCharacter?.bonds ?? "");

  const [flaws, setFlaws] = useState(initialCharacter?.flaws ?? "");

  const [abilityScores, setAbilityScores] = useState<
    Record<AbilityKey, number>
  >({
    ...defaultAbilityScores,

    ...(initialCharacter?.abilityScores ?? {}),
  });

  const [abilityScoreInputs, setAbilityScoreInputs] = useState<
    Record<AbilityKey, string>
  >(() => {
    const initialScores = {
      ...defaultAbilityScores,
      ...(initialCharacter?.abilityScores ?? {}),
    };

    return Object.fromEntries(
      abilityKeys.map((key) => [key, String(initialScores[key])]),
    ) as Record<AbilityKey, string>;
  });

  const [armorClassMode, setArmorClassMode] = useState<ArmorClassMode>(
    initialStats.armorClassMode ?? "automatic",
  );

  const [manualArmorClass, setManualArmorClass] = useState(
    initialStats.manualArmorClass ?? initialStats.armorClass ?? 10,
  );

  const [armorClassBonus, setArmorClassBonus] = useState(
    initialStats.armorClassBonus ?? 0,
  );

  const [customMaxHp, setCustomMaxHp] = useState(initialStats.maxHp ?? 10);

  const [customHitDie, setCustomHitDie] = useState(initialStats.hitDie ?? "d8");

  const [customSpeed, setCustomSpeed] = useState(initialStats.speed ?? 30);

  const [customProficiencyBonus, setCustomProficiencyBonus] = useState(
    initialStats.proficiencyBonus ?? 2,
  );

  const [savingThrowProficiencies, setSavingThrowProficiencies] = useState<
    AbilityKey[]
  >(initialProficiencies?.savingThrows ?? []);

  const [skillProficiencies, setSkillProficiencies] = useState(() => ({
    ...createEmptyCustomSkills(),

    ...(initialProficiencies?.skills ?? {}),
  }));

  const [armorProficiencyPresetIds, setArmorProficiencyPresetIds] = useState<
    ArmorProficiencyPresetId[]
  >(() =>
    getSelectedPresetIds(initialProficiencies?.armor, armorProficiencyPresets),
  );

  const [weaponProficiencyPresetIds, setWeaponProficiencyPresetIds] = useState<
    WeaponProficiencyPresetId[]
  >(() =>
    getSelectedPresetIds(
      initialProficiencies?.weapons,
      weaponProficiencyPresets,
    ),
  );

  const [armorProficienciesText, setArmorProficienciesText] = useState(() =>
    joinTextList(
      getCustomProficiencyValues(
        initialProficiencies?.armor,
        armorProficiencyPresets,
      ),
    ),
  );

  const [weaponProficienciesText, setWeaponProficienciesText] = useState(() =>
    joinTextList(
      getCustomProficiencyValues(
        initialProficiencies?.weapons,
        weaponProficiencyPresets,
      ),
    ),
  );

  const [toolProficienciesText, setToolProficienciesText] = useState(
    joinTextList(initialProficiencies?.tools),
  );

  const [languagesText, setLanguagesText] = useState(
    joinTextList(initialProficiencies?.languages),
  );

  const [catalogTraitIds, setCatalogTraitIds] = useState<string[]>(
    initialCharacter?.catalogTraitIds ?? [],
  );

  const [customTraits, setCustomTraits] = useState<CustomTrait[]>(
    initialCharacter?.customTraits ?? [],
  );

  const [equipment, setEquipment] = useState<CharacterEquipmentEntry[]>(
    initialCharacter?.equipment ?? [],
  );

  const [itemPickerOpen, setItemPickerOpen] = useState(false);

  const [spellPickerOpen, setSpellPickerOpen] = useState(false);

  const [customSpellcasting, setCustomSpellcasting] =
    useState<CustomSpellcasting>(() => ({
      enabled: false,

      ability: null,

      spellSlots: createEmptySpellSlots(),

      spells: [],

      ...(initialCharacter?.customSpellcasting ?? {}),
    }));

  const [money, setMoney] = useState<Money>({
    ...defaultMoney,

    ...(initialCharacter?.money ?? {}),
  });

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (error === "Character name is required." && name.trim()) {
      setError("");
    }
  }, [error, name]);

  const visibleTraits = useMemo(
    () =>
      customTraits.filter(
        (trait) =>
          trait.name.trim() ||
          trait.source?.trim() ||
          trait.description?.trim(),
      ),

    [customTraits],
  );

  const dexModifier = getModifier(abilityScores.dex);

  const wisModifier = getModifier(abilityScores.wis);

  const perceptionLevel = skillProficiencies.perception;

  const perceptionBonus =
    wisModifier +
    (perceptionLevel === "expertise"
      ? customProficiencyBonus * 2
      : perceptionLevel === "proficient"
        ? customProficiencyBonus
        : 0);

  const passivePerception = 10 + perceptionBonus;

  const armorClassResult = useMemo(
    () =>
      calculateArmorClass({
        abilityScores,
        className: customClassName,
        equipment,
        resolveItem: (entry) => resolveItemFromEquipmentEntry(entry, {}),
        mode: armorClassMode,
        manualArmorClass,
        extraModifier: armorClassBonus,
      }),
    [
      abilityScores,
      customClassName,
      equipment,
      armorClassMode,
      manualArmorClass,
      armorClassBonus,
    ],
  );

  const resolvedArmorClass = armorClassResult.value;

  const handleAbilityChange = (key: AbilityKey, value: string) => {
    setAbilityScoreInputs((current) => ({
      ...current,
      [key]: value,
    }));

    if (value.trim() === "") {
      return;
    }

    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      return;
    }

    setAbilityScores((current) => ({
      ...current,
      [key]: parsed,
    }));
  };

  const handleAbilityBlur = (key: AbilityKey) => {
    if (abilityScoreInputs[key].trim() !== "") {
      return;
    }

    setAbilityScoreInputs((current) => ({
      ...current,
      [key]: String(abilityScores[key]),
    }));
  };

  const toggleSavingThrow = (ability: AbilityKey) => {
    setSavingThrowProficiencies((current) =>
      current.includes(ability)
        ? current.filter((entry) => entry !== ability)
        : [...current, ability],
    );
  };

  const toggleArmorProficiencyPreset = (
    proficiency: ArmorProficiencyPresetId,
  ) => {
    setArmorProficiencyPresetIds((current) =>
      current.includes(proficiency)
        ? current.filter((entry) => entry !== proficiency)
        : [...current, proficiency],
    );
  };

  const toggleWeaponProficiencyPreset = (
    proficiency: WeaponProficiencyPresetId,
  ) => {
    setWeaponProficiencyPresetIds((current) =>
      current.includes(proficiency)
        ? current.filter((entry) => entry !== proficiency)
        : [...current, proficiency],
    );
  };

  const getSkillBonus = (
    ability: AbilityKey,
    proficiency: CustomProficiencyLevel,
  ) => {
    let bonus = getModifier(abilityScores[ability]);

    if (proficiency === "proficient") {
      bonus += customProficiencyBonus;
    }

    if (proficiency === "expertise") {
      bonus += customProficiencyBonus * 2;
    }

    return bonus;
  };

  const toggleSkillProficiency = (
    skillId: (typeof customSkillDefinitions)[number]["id"],
    nextLevel: Exclude<CustomProficiencyLevel, "none">,
  ) => {
    setSkillProficiencies((current) => ({
      ...current,
      [skillId]: current[skillId] === nextLevel ? "none" : nextLevel,
    }));
  };

  const addCatalogItem = (itemId: string, quantity = 1) => {
    const item = itemsById[itemId];

    if (!item) {
      return;
    }

    const safeQuantity = Math.max(1, Math.floor(quantity) || 1);

    setEquipment((current) => {
      const existing = current.find(
        (entry) =>
          (entry.source === "base" || entry.source === undefined) &&
          entry.itemId === itemId &&
          !entry.equipped &&
          (entry.equippedSlots?.length ?? 0) === 0,
      );

      if (existing) {
        return current.map((entry) =>
          entry.instanceId === existing.instanceId
            ? {
                ...entry,
                quantity: entry.quantity + safeQuantity,
              }
            : entry,
        );
      }

      return [
        ...current,
        {
          instanceId: createEquipmentInstanceId(itemId, current),
          source: "base",
          itemId,
          name: item.name,
          quantity: safeQuantity,
          equipped: false,
          equippedSlots: [],
        },
      ];
    });
  };

  const updateEquipmentQuantity = (
    instanceId: string,

    quantity: number,
  ) => {
    setEquipment((current) =>
      current.map((entry) =>
        entry.instanceId === instanceId
          ? {
              ...entry,

              quantity: Math.max(
                1,

                Math.floor(quantity) || 1,
              ),
            }
          : entry,
      ),
    );
  };

  const removeEquipment = (instanceId: string) => {
    setEquipment((current) =>
      current.filter((entry) => entry.instanceId !== instanceId),
    );
  };

  const addSpell = (spell: CustomSpellEntry) => {
    setCustomSpellcasting((current) => {
      if (current.spells.some((entry) => entry.spellId === spell.spellId)) {
        return current;
      }

      return {
        ...current,

        spells: [...current.spells, spell],
      };
    });
  };

  const removeSpell = (spellId: string) => {
    setCustomSpellcasting((current) => ({
      ...current,

      spells: current.spells.filter((spell) => spell.spellId !== spellId),
    }));
  };

  const updateSpellSlot = (
    level: number,

    max: number,
  ) => {
    const safeMax = Math.max(
      0,

      Math.floor(max) || 0,
    );

    setCustomSpellcasting((current) => {
      const previous = current.spellSlots[String(level)];

      return {
        ...current,

        spellSlots: {
          ...current.spellSlots,

          [String(level)]: {
            max: safeMax,

            remaining: isEditing
              ? Math.min(
                  safeMax,

                  previous?.remaining ?? safeMax,
                )
              : safeMax,
          },
        },
      };
    });
  };

  const validateForm = () => {
    if (!name.trim()) {
      return "Character name is required.";
    }

    if (customLevel < 1) {
      return "Level must be at least 1.";
    }

    if (customMaxHp < 0) {
      return "Maximum HP cannot be negative.";
    }

    if (!["d4", "d6", "d8", "d10", "d12"].includes(customHitDie)) {
      return "Please choose a valid Hit Die.";
    }

    if (visibleTraits.some((trait) => !trait.name.trim())) {
      return "Every trait must have a name.";
    }

    return "";
  };

  /*
   * Current HP and remaining Hit Dice are live-state values.
   *
   * Creation:
   * - Current HP starts at Max HP.
   * - Hit Dice start fully restored at the character's level.
   *
   * Editing:
   * - Preserve the character's current HP, but clamp it to the new Max HP.
   * - Preserve spent Hit Dice, but clamp remaining dice to the new level.
   */
  const getSavedCurrentHp = () => {
    if (!isEditing) {
      return customMaxHp;
    }

    const previousCurrentHp =
      initialStats.currentHp ?? initialStats.maxHp ?? customMaxHp;

    return Math.max(0, Math.min(customMaxHp, previousCurrentHp));
  };

  const getSavedHitDiceRemaining = () => {
    if (!isEditing) {
      return Math.max(0, customLevel);
    }

    const previousRemaining = initialStats.hitDiceRemaining ?? customLevel;

    return Math.max(0, Math.min(customLevel, previousRemaining));
  };

  const buildCustomCharacterPayload = () => ({
    buildMode: "custom",

    name: name.trim(),

    /*
     * Important:
     * empty string means a previously saved
     * portrait can actually be removed.
     */
    imageUrl: imageUrl.trim(),

    level: customLevel,

    className: customClassName.trim(),

    speciesName: customSpeciesName.trim(),

    backgroundName: customBackgroundName.trim(),

    alignment: alignment.trim(),

    age: age.trim(),
    height: height.trim(),
    weight: weight.trim(),
    eyes: eyes.trim(),
    skin: skin.trim(),
    hair: hair.trim(),

    abilityScores,

    customStats: {
      armorClass: resolvedArmorClass,
      armorClassMode,
      manualArmorClass,
      armorClassBonus,

      currentHp: getSavedCurrentHp(),

      maxHp: customMaxHp,

      hitDie: customHitDie,

      hitDiceRemaining: getSavedHitDiceRemaining(),

      speed: customSpeed,

      proficiencyBonus: customProficiencyBonus,
    },

    customProficiencies: {
      savingThrows: savingThrowProficiencies,

      skills: skillProficiencies,

      armor: mergePresetAndCustomProficiencies(
        armorProficiencyPresetIds,
        armorProficienciesText,
      ),

      weapons: mergePresetAndCustomProficiencies(
        weaponProficiencyPresetIds,
        weaponProficienciesText,
      ),

      tools: splitTextList(toolProficienciesText),

      languages: splitTextList(languagesText),
    },

    catalogTraitIds,

    customTraits: visibleTraits.map((trait) => ({
      id: trait.id,

      name: trait.name.trim(),

      source: trait.source?.trim() ?? "",

      description: trait.description?.trim() ?? "",

      activation: trait.activation ?? "passive",

      actions: (trait.actions ?? [])
        .filter((action) => action.name.trim())
        .map((action) => ({
          id: action.id,

          name: action.name.trim(),

          activation: action.activation,

          description: action.description?.trim() ?? "",
        })),
    })),

    customSpellcasting,

    characterAppearance: characterAppearance.trim(),

    alliesAndOrganizations: alliesAndOrganizations.trim(),

    characterBackstory: characterBackstory.trim(),

    personalityTraits: personalityTraits.trim(),

    ideals: ideals.trim(),

    bonds: bonds.trim(),

    flaws: flaws.trim(),

    equipment,

    money,

    /*
     * Retain choices because other generic
     * character code expects the field.
     */
    choices: {},
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      return;
    }

    try {
      setSubmitting(true);

      const payload = buildCustomCharacterPayload();

      if (isEditing) {
        if (!characterId) {
          throw new Error("Missing character ID.");
        }

        /*
         * We deliberately update only character
         * sheet fields here.
         *
         * ownerUid, campaignId, campaignStatus,
         * XP, etc. are preserved.
         */
        const batch = writeBatch(db);

        batch.update(doc(db, "characters", characterId), {
          ...payload,
          updatedAt: serverTimestamp(),
        } as any);

        if (initialCharacter?.campaignId) {
          batch.update(
            doc(
              db,
              "campaigns",
              initialCharacter.campaignId,
              "party",
              characterId,
            ),
            {
              name: payload.name,
              imageUrl: payload.imageUrl ?? null,
              level: payload.level,
              className: payload.className ?? null,
              speciesName: payload.speciesName ?? null,
              race: payload.speciesName ?? null,
              currentHp: payload.customStats?.currentHp ?? 0,
              maxHp: payload.customStats?.maxHp ?? 1,
              armorClass: payload.customStats?.armorClass ?? null,
              speed: payload.customStats?.speed ?? null,
              updatedAt: serverTimestamp(),
            },
          );
        }

        await batch.commit();

        navigate(`/characters/${characterId}`);

        return;
      }

      await createCharacter({
        ownerUid: isCampaignUnassignedCreate ? null : undefined,

        createdByUid: undefined,

        campaignId: campaignIdFromQuery ?? null,

        campaignStatus: "inactive",

        ...payload,
      } as any);

      navigate(
        campaignIdFromQuery
          ? `/campaigns/${campaignIdFromQuery}/characters`
          : "/",
      );
    } catch (err: any) {
      console.error(
        isEditing
          ? "Failed to update custom character:"
          : "Failed to create custom character:",

        err,
      );

      setError(
        err?.message ||
          (isEditing
            ? "Failed to update character."
            : "Failed to create character."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditing && characterId) {
      navigate(`/characters/${characterId}`);

      return;
    }

    onBackToModeSelect?.();
  };

  return (
    <>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-5 lg:px-6">
          <button
            type="button"
            onClick={handleCancel}
            className="mb-2 text-xs text-zinc-400 hover:text-white"
          >
            ← {isEditing ? "Back to character" : "Change character type"}
          </button>

          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {isEditing ? "Character Editor" : "Quick Character Creator"}
          </p>

          <h1 className="text-xl font-bold text-white">
            {isEditing ? "Edit Character" : "Create Character"}
          </h1>

          <p className="mt-1 text-xs text-zinc-500">
            {isEditing
              ? "Update the manually entered character sheet."
              : "Enter an existing character sheet directly."}
          </p>

          <div className="mt-4 flex items-center gap-1 border-b border-white/10">
            <button
              type="button"
              onClick={() => setActiveEditorTab("mechanics")}
              className={`relative px-3 py-2 text-xs font-semibold transition ${
                activeEditorTab === "mechanics"
                  ? "text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Mechanics
              {activeEditorTab === "mechanics" ? (
                <span className="absolute inset-x-2 -bottom-px h-px bg-white" />
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setActiveEditorTab("details")}
              className={`relative px-3 py-2 text-xs font-semibold transition ${
                activeEditorTab === "details"
                  ? "text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Character Details
              {activeEditorTab === "details" ? (
                <span className="absolute inset-x-2 -bottom-px h-px bg-white" />
              ) : null}
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                event.target instanceof HTMLInputElement
              ) {
                event.preventDefault();
              }
            }}
            className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]"
          >
            <div className="min-w-0">
              {activeEditorTab === "mechanics" ? (
                <div className="space-y-3">
                  {/* CHARACTER */}

                  <Card title="Character">
                    <div className="mb-3 flex gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          setShowPortraitPicker((current) => !current)
                        }
                        className="group h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 transition hover:border-white/20"
                        title="Change portrait"
                      >
                        {imageUrl.trim() ? (
                          <img
                            src={imageUrl.trim()}
                            alt="Character portrait"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-2xl font-semibold text-zinc-400">
                            {name.trim().charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                      </button>

                      <div className="flex-1">
                        <TextInput
                          label="Character Name"
                          value={name}
                          onChange={setName}
                          maxLength={60}
                        />
                      </div>
                    </div>

                    {showPortraitPicker ? (
                      <div className="mb-3 border-t border-white/10 pt-5">
                        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                          {defaultCharacterPortraits.map((portrait) => (
                            <button
                              key={portrait.id}
                              type="button"
                              onClick={() => {
                                setImageUrl(portrait.url);

                                setShowImageUrlInput(false);
                              }}
                              className="overflow-hidden rounded-lg border border-white/10 transition hover:border-white/30"
                            >
                              <img
                                src={portrait.url}
                                alt={portrait.label}
                                className="aspect-square w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2.5">
                          <button
                            type="button"
                            onClick={() =>
                              setShowImageUrlInput((current) => !current)
                            }
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10"
                          >
                            Use image URL
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setImageUrl(getRandomDefaultPortraitUrl())
                            }
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10"
                          >
                            Random portrait
                          </button>

                          {imageUrl.trim() ? (
                            <button
                              type="button"
                              onClick={() => {
                                setImageUrl("");

                                setShowImageUrlInput(false);
                              }}
                              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/15"
                            >
                              Remove portrait
                            </button>
                          ) : null}
                        </div>

                        {showImageUrlInput ? (
                          <input
                            type="url"
                            value={imageUrl}
                            onChange={(event) =>
                              setImageUrl(event.target.value)
                            }
                            placeholder="https://..."
                            className="mt-3 w-full rounded-lg border border-white/10 bg-zinc-950 p-2.5 outline-none"
                          />
                        ) : null}
                      </div>
                    ) : null}

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <TextInput
                        label="Class"
                        value={customClassName}
                        onChange={setCustomClassName}
                        maxLength={50}
                      />

                      <NumberInput
                        label="Level"
                        value={customLevel}
                        min={1}
                        onChange={setCustomLevel}
                      />

                      <TextInput
                        label="Species / Race"
                        value={customSpeciesName}
                        onChange={setCustomSpeciesName}
                        maxLength={50}
                      />

                      <TextInput
                        label="Background"
                        value={customBackgroundName}
                        onChange={setCustomBackgroundName}
                        maxLength={50}
                      />

                      <TextInput
                        label="Alignment"
                        value={alignment}
                        onChange={setAlignment}
                        maxLength={30}
                      />
                    </div>
                  </Card>

                  {/* ABILITIES */}

                  <Card title="Ability Scores">
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-6">
                      {abilityKeys.map((key) => (
                        <div
                          key={key}
                          className="rounded-lg border border-white/10 bg-zinc-900 p-2.5 text-center"
                        >
                          <label className="text-xs font-bold text-zinc-500">
                            {abilityShortLabels[key]}
                          </label>

                          <input
                            type="number"
                            value={abilityScoreInputs[key]}
                            onChange={(event) =>
                              handleAbilityChange(key, event.target.value)
                            }
                            onBlur={() => handleAbilityBlur(key)}
                            className="mt-2 w-full rounded-lg bg-zinc-950 p-2 text-center text-xl font-bold"
                          />

                          <p className="mt-1 text-xs text-zinc-400">
                            {formatModifier(getModifier(abilityScores[key]))}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* COMBAT */}

                  <Card title="Combat">
                    <div className="mb-3 rounded-lg border border-white/10 bg-zinc-900/55 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            Armor Class
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            Calculate AC automatically, or use a manual
                            override.
                          </p>
                        </div>

                        <div
                          className="inline-flex rounded-lg border border-white/10 bg-black/25 p-1"
                          role="group"
                          aria-label="Armor Class calculation mode"
                        >
                          {(["automatic", "manual"] as const).map(
                            (modeOption) => {
                              const selected = armorClassMode === modeOption;

                              return (
                                <button
                                  key={modeOption}
                                  type="button"
                                  aria-pressed={selected}
                                  onClick={() => setArmorClassMode(modeOption)}
                                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                    selected
                                      ? "bg-white text-zinc-950"
                                      : "text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                                  }`}
                                >
                                  {modeOption === "automatic"
                                    ? "Automatic"
                                    : "Manual"}
                                </button>
                              );
                            },
                          )}
                        </div>
                      </div>

                      {armorClassMode === "automatic" ? (
                        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px]">
                          <div className="rounded-lg border border-white/[0.08] bg-black/20 p-3">
                            <div className="flex items-end gap-3">
                              <span className="text-3xl font-bold leading-none text-white">
                                {resolvedArmorClass}
                              </span>
                              <span className="pb-0.5 text-sm font-medium text-zinc-300">
                                {armorClassResult.formulaLabel}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                              {armorClassResult.breakdown.map((line) => (
                                <span
                                  key={line.id}
                                  className="text-xs text-zinc-400"
                                  title={line.detail}
                                >
                                  {line.label}{" "}
                                  <span className="font-semibold text-zinc-200">
                                    {line.value >= 0 ? "+" : ""}
                                    {line.value}
                                  </span>
                                </span>
                              ))}
                            </div>
                          </div>

                          <NumberInput
                            label="Additional modifier"
                            value={armorClassBonus}
                            onChange={setArmorClassBonus}
                          />
                        </div>
                      ) : (
                        <div className="mt-3 max-w-[180px]">
                          <NumberInput
                            label="Manual AC"
                            value={manualArmorClass}
                            min={0}
                            onChange={setManualArmorClass}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-4">
                      <NumberInput
                        label="Max HP"
                        value={customMaxHp}
                        min={0}
                        onChange={setCustomMaxHp}
                      />

                      <label className="block">
                        <span className="text-sm text-zinc-300">Hit Die</span>
                        <select
                          value={customHitDie}
                          onChange={(event) =>
                            setCustomHitDie(event.target.value)
                          }
                          className="mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-900 p-2.5 text-white outline-none focus:border-white/25"
                        >
                          <option value="d4">d4</option>
                          <option value="d6">d6</option>
                          <option value="d8">d8</option>
                          <option value="d10">d10</option>
                          <option value="d12">d12</option>
                        </select>
                      </label>

                      <NumberInput
                        label="Speed"
                        value={customSpeed}
                        min={0}
                        onChange={setCustomSpeed}
                      />
                      <NumberInput
                        label="Prof. Bonus"
                        value={customProficiencyBonus}
                        onChange={setCustomProficiencyBonus}
                      />
                    </div>

                    <p className="mt-3 text-xs leading-5 text-zinc-500">
                      New characters start at full HP with one Hit Die per
                      level. When editing, current HP and spent Hit Dice are
                      preserved.
                    </p>
                  </Card>

                  {/* SAVES */}

                  <Card title="Saving Throws">
                    <div className="grid gap-2 sm:grid-cols-3">
                      {abilityKeys.map((ability) => {
                        const proficient =
                          savingThrowProficiencies.includes(ability);

                        const bonus =
                          getModifier(abilityScores[ability]) +
                          (proficient ? customProficiencyBonus : 0);

                        return (
                          <label
                            key={ability}
                            className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900 p-2.5"
                          >
                            <span>
                              <input
                                type="checkbox"
                                checked={proficient}
                                onChange={() => toggleSavingThrow(ability)}
                                className="mr-3"
                              />

                              {abilityLabels[ability]}
                            </span>

                            <strong>{formatModifier(bonus)}</strong>
                          </label>
                        );
                      })}
                    </div>
                  </Card>

                  {/* SKILLS */}

                  <Card title="Skills">
                    <div className="grid gap-1.5 md:grid-cols-2">
                      {customSkillDefinitions.map((skill) => {
                        const proficiency = skillProficiencies[skill.id];

                        return (
                          <div
                            key={skill.id}
                            className="flex min-h-10 items-center gap-2 rounded-lg border border-white/[0.08] bg-zinc-900/70 px-2.5 py-1.5"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-xs font-medium text-zinc-100">
                                {skill.name}
                              </div>
                              <div className="text-[9px] uppercase tracking-wide text-zinc-600">
                                {abilityShortLabels[skill.ability]}
                              </div>
                            </div>

                            <strong className="w-8 shrink-0 text-right text-xs text-white">
                              {formatModifier(
                                getSkillBonus(skill.ability, proficiency),
                              )}
                            </strong>

                            <div className="flex shrink-0 items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleSkillProficiency(skill.id, "proficient")
                                }
                                title="Proficient"
                                aria-label={`${skill.name}: Proficient`}
                                className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                                  proficiency === "proficient"
                                    ? "border-emerald-400 bg-emerald-400"
                                    : "border-zinc-600 bg-transparent hover:border-emerald-400/70"
                                }`}
                              >
                                {proficiency === "proficient" ? (
                                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                                ) : null}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleSkillProficiency(skill.id, "expertise")
                                }
                                title="Expertise"
                                aria-label={`${skill.name}: Expertise`}
                                className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                                  proficiency === "expertise"
                                    ? "border-emerald-400 bg-emerald-400/15"
                                    : "border-zinc-600 bg-transparent hover:border-emerald-400/70"
                                }`}
                              >
                                <span
                                  className={`h-2 w-2 rounded-full ${
                                    proficiency === "expertise"
                                      ? "bg-emerald-400"
                                      : "bg-transparent"
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-[9px] text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        Proficiency
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="flex h-3 w-3 items-center justify-center rounded-full border border-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        Expertise
                      </span>
                    </div>
                  </Card>

                  {/* PROFICIENCIES */}

                  <Card title="Other Proficiencies & Languages">
                    <p className="mb-3 text-sm text-zinc-500">
                      Choose common proficiencies below, and use the text fields
                      for any additional or homebrew proficiencies. Separate
                      custom entries with commas or new lines.
                    </p>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <div className="rounded-lg border border-white/10 bg-zinc-900/45 p-2.5">
                        <p className="text-sm font-medium text-zinc-200">
                          Armor Proficiencies
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {armorProficiencyPresets.map((preset) => {
                            const selected = armorProficiencyPresetIds.includes(
                              preset.id,
                            );

                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() =>
                                  toggleArmorProficiencyPreset(preset.id)
                                }
                                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                  selected
                                    ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-200"
                                    : "border-white/10 bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white"
                                }`}
                              >
                                {selected ? "✓ " : ""}
                                {preset.label}
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-3">
                          <Textarea
                            label="Additional armor proficiencies"
                            value={armorProficienciesText}
                            onChange={setArmorProficienciesText}
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="rounded-lg border border-white/10 bg-zinc-900/45 p-2.5">
                        <p className="text-sm font-medium text-zinc-200">
                          Weapon Proficiencies
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {weaponProficiencyPresets.map((preset) => {
                            const selected =
                              weaponProficiencyPresetIds.includes(preset.id);

                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() =>
                                  toggleWeaponProficiencyPreset(preset.id)
                                }
                                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                  selected
                                    ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-200"
                                    : "border-white/10 bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white"
                                }`}
                              >
                                {selected ? "✓ " : ""}
                                {preset.label}
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-3">
                          <Textarea
                            label="Additional weapon proficiencies"
                            value={weaponProficienciesText}
                            onChange={setWeaponProficienciesText}
                            rows={3}
                          />
                        </div>
                      </div>

                      <Textarea
                        label="Tool Proficiencies"
                        value={toolProficienciesText}
                        onChange={setToolProficienciesText}
                      />

                      <Textarea
                        label="Languages"
                        value={languagesText}
                        onChange={setLanguagesText}
                      />
                    </div>
                  </Card>

                  {/* EQUIPMENT */}

                  <Card title="Equipment">
                    <div className="mb-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setItemPickerOpen(true)}
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950"
                      >
                        + Add Item
                      </button>
                    </div>

                    {equipment.length === 0 ? (
                      <p className="text-sm text-zinc-500">
                        No equipment added.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {equipment.map((entry) => (
                          <div
                            key={entry.instanceId}
                            className="grid gap-2.5 rounded-lg border border-white/10 bg-zinc-900 p-2.5 sm:grid-cols-[1fr_100px_auto]"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">
                                {entry.name}
                              </p>

                              <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.08em] text-zinc-500">
                                {formatItemCategory(
                                  itemsById[
                                    entry.itemId ?? entry.baseItemId ?? ""
                                  ]?.category,
                                )}
                              </p>
                            </div>

                            <input
                              type="number"
                              min={1}
                              value={entry.quantity}
                              onChange={(event) =>
                                updateEquipmentQuantity(
                                  entry.instanceId,

                                  Number(event.target.value),
                                )
                              }
                              className="rounded-lg border border-white/10 bg-zinc-950 p-2"
                            />

                            <button
                              type="button"
                              onClick={() => removeEquipment(entry.instanceId)}
                              className="rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/[0.12] hover:text-rose-200"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* SPELLS */}

                  <Card title="Spellcasting">
                    <label className="mb-3 flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={customSpellcasting.enabled}
                        onChange={(event) =>
                          setCustomSpellcasting((current) => ({
                            ...current,

                            enabled: event.target.checked,
                          }))
                        }
                      />

                      <span className="font-medium text-white">
                        This character uses spells
                      </span>
                    </label>

                    {customSpellcasting.enabled ? (
                      <div className="space-y-3">
                        <div className="max-w-sm">
                          <label className="block">
                            <span className="text-sm text-zinc-300">
                              Spellcasting Ability
                            </span>

                            <select
                              value={customSpellcasting.ability ?? ""}
                              onChange={(event) =>
                                setCustomSpellcasting((current) => ({
                                  ...current,

                                  ability: event.target.value
                                    ? (event.target.value as AbilityKey)
                                    : null,
                                }))
                              }
                              className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-900 p-2.5"
                            >
                              <option value="">None</option>

                              {abilityKeys.map((ability) => (
                                <option key={ability} value={ability}>
                                  {abilityLabels[ability]}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <div>
                          <h3 className="mb-3 font-semibold text-white">
                            Spell Slots
                          </h3>

                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
                            {Array.from(
                              {
                                length: 9,
                              },

                              (_, index) => index + 1,
                            ).map((level) => (
                              <NumberInput
                                key={level}
                                label={`${level}`}
                                value={
                                  customSpellcasting.spellSlots[String(level)]
                                    ?.max ?? 0
                                }
                                min={0}
                                onChange={(value) =>
                                  updateSpellSlot(
                                    level,

                                    value,
                                  )
                                }
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-semibold text-white">Spells</h3>

                            <button
                              type="button"
                              onClick={() => setSpellPickerOpen(true)}
                              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950"
                            >
                              + Add Spell
                            </button>
                          </div>

                          {customSpellcasting.spells.length === 0 ? (
                            <p className="text-sm text-zinc-500">
                              No spells added.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {[...customSpellcasting.spells]
                                .sort(
                                  (a, b) =>
                                    a.level - b.level ||
                                    a.name.localeCompare(b.name),
                                )
                                .map((spell) => (
                                  <div
                                    key={spell.spellId}
                                    className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900 p-2.5"
                                  >
                                    <div>
                                      <p className="font-medium text-white">
                                        {spell.name}
                                      </p>

                                      <p className="text-xs text-zinc-500">
                                        {spell.level === 0
                                          ? "Cantrip"
                                          : `Level ${spell.level}`}
                                      </p>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => removeSpell(spell.spellId)}
                                      className="rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/[0.12] hover:text-rose-200"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </Card>

                  {/* MONEY */}

                  <Card title="Currency">
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                      {(["cp", "sp", "ep", "gp", "pp"] as const).map(
                        (currency) => (
                          <NumberInput
                            key={currency}
                            label={currency.toUpperCase()}
                            value={money[currency] ?? 0}
                            min={0}
                            onChange={(value) =>
                              setMoney((current) => ({
                                ...current,

                                [currency]: Math.max(
                                  0,

                                  value,
                                ),
                              }))
                            }
                          />
                        ),
                      )}
                    </div>
                  </Card>

                  {/* FEATURES */}

                  <Card title="Features & Traits">
                    <CharacterFeaturesEditor
                      catalogTraitIds={catalogTraitIds}
                      customTraits={customTraits}
                      onCatalogTraitIdsChange={setCatalogTraitIds}
                      onCustomTraitsChange={setCustomTraits}
                    />
                  </Card>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* DETAILS */}

                  <Card title="Character Details">
                    <div className="space-y-3">
                      <div>
                        <p className="mb-3 text-sm font-medium text-zinc-300">
                          Physical Details
                        </p>

                        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                          <TextInput
                            label="Age"
                            value={age}
                            onChange={setAge}
                            maxLength={30}
                          />

                          <TextInput
                            label="Height"
                            value={height}
                            onChange={setHeight}
                            maxLength={30}
                          />

                          <TextInput
                            label="Weight"
                            value={weight}
                            onChange={setWeight}
                            maxLength={30}
                          />

                          <TextInput
                            label="Eyes"
                            value={eyes}
                            onChange={setEyes}
                            maxLength={50}
                          />

                          <TextInput
                            label="Skin"
                            value={skin}
                            onChange={setSkin}
                            maxLength={50}
                          />

                          <TextInput
                            label="Hair"
                            value={hair}
                            onChange={setHair}
                            maxLength={50}
                          />
                        </div>
                      </div>

                      <Textarea
                        label="Character Appearance"
                        value={characterAppearance}
                        onChange={setCharacterAppearance}
                        rows={4}
                      />

                      <Textarea
                        label="Allies & Organizations"
                        value={alliesAndOrganizations}
                        onChange={setAlliesAndOrganizations}
                        rows={4}
                      />

                      <Textarea
                        label="Character Backstory"
                        value={characterBackstory}
                        onChange={setCharacterBackstory}
                        rows={7}
                      />

                      <div className="grid gap-2.5 sm:grid-cols-2">
                        <Textarea
                          label="Personality Traits"
                          value={personalityTraits}
                          onChange={setPersonalityTraits}
                          rows={4}
                        />

                        <Textarea
                          label="Ideals"
                          value={ideals}
                          onChange={setIdeals}
                          rows={4}
                        />

                        <Textarea
                          label="Bonds"
                          value={bonds}
                          onChange={setBonds}
                          rows={4}
                        />

                        <Textarea
                          label="Flaws"
                          value={flaws}
                          onChange={setFlaws}
                          rows={4}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* SIDEBAR */}

            <aside className="h-fit rounded-xl border border-white/10 bg-zinc-900/35 p-3 lg:sticky lg:top-4">
              <h2 className="text-sm font-semibold text-white">Summary</h2>

              <p className="mt-3 text-sm font-bold">
                {name || "Unnamed Character"}
              </p>

              <p className="mt-0.5 text-[11px] text-zinc-500">
                Level {customLevel} {customSpeciesName} {customClassName}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <MiniStat
                  label="HP"
                  value={`${getSavedCurrentHp()}/${customMaxHp}`}
                />

                <MiniStat label="AC" value={resolvedArmorClass} />

                <MiniStat
                  label="Initiative"
                  value={formatModifier(dexModifier)}
                />

                <MiniStat
                  label="Passive Perception"
                  value={passivePerception}
                />
              </div>

              {error ? (
                <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="mt-3 w-full rounded-lg bg-white p-2.5 font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
              >
                {submitting
                  ? isEditing
                    ? "Saving..."
                    : "Creating..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Character"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
            </aside>
          </form>
        </div>
      </div>

      <ItemPickerModal
        isOpen={itemPickerOpen}
        onClose={() => setItemPickerOpen(false)}
        onSelect={addCatalogItem}
      />

      <SpellPickerModal
        isOpen={spellPickerOpen}
        onClose={() => setSpellPickerOpen(false)}
        selectedSpellIds={customSpellcasting.spells.map(
          (spell) => spell.spellId,
        )}
        onSelect={addSpell}
      />
    </>
  );
};

const Card = ({
  title,
  children,
}: {
  title: string;

  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-3">
    <h2 className="mb-3 text-sm font-semibold text-white">{title}</h2>

    {children}
  </section>
);

const TextInput = ({
  label,
  value,
  onChange,
  maxLength,
}: {
  label: string;

  value: string;

  onChange: (value: string) => void;

  maxLength?: number;
}) => (
  <label className="block">
    <span className="text-sm text-zinc-300">{label}</span>

    <input
      value={value}
      maxLength={maxLength}
      onChange={(event) => onChange(event.target.value)}
      className="mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-950/70 px-2.5 py-2 text-sm text-white outline-none transition focus:border-white/25"
    />
  </label>
);

const NumberInput = ({
  label,
  value,
  onChange,
  min,
}: {
  label: string;

  value: number;

  onChange: (value: number) => void;

  min?: number;
}) => {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  return (
    <label className="block">
      <span className="text-sm text-zinc-300">{label}</span>

      <input
        type="number"
        min={min}
        value={inputValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          setInputValue(nextValue);

          if (nextValue === "" || nextValue === "-") {
            return;
          }

          const parsed = Number(nextValue);

          if (!Number.isNaN(parsed)) {
            onChange(parsed);
          }
        }}
        onBlur={() => {
          if (inputValue === "" || inputValue === "-") {
            setInputValue(String(value));
          }
        }}
        className="mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-950/70 px-2.5 py-2 text-sm text-white outline-none transition focus:border-white/25"
      />
    </label>
  );
};

const Textarea = ({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;

  value: string;

  onChange: (value: string) => void;

  rows?: number;
}) => (
  <label className="block">
    <span className="text-sm text-zinc-300">{label}</span>

    <textarea
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="workspace-scrollbar mt-1.5 w-full resize-none overflow-y-auto rounded-lg border border-white/10 bg-zinc-950/70 px-2.5 py-2 text-sm text-white outline-none transition focus:border-white/25"
    />
  </label>
);

const MiniStat = ({
  label,
  value,
}: {
  label: string;

  value: string | number;
}) => (
  <div className="rounded-lg border border-white/10 bg-black/20 p-2.5">
    <p className="text-[10px] text-zinc-500">{label}</p>

    <p className="mt-0.5 text-sm font-semibold text-white">{value}</p>
  </div>
);

export default CustomCharacterCreator;
