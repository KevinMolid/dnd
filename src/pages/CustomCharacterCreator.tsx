import { FormEvent, useMemo, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { doc, updateDoc } from "firebase/firestore";

import { createCharacter } from "../characters";
import { db } from "../firebase";

import ItemPickerModal from "../components/character/ItemPickerModal";

import SpellPickerModal from "../components/character/SpellPickerModal";

import { defaultCharacterPortraits } from "../data/defaultCharacterPortraits";

import { itemsById } from "../rulesets/dnd/dnd2024/data/items";

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

import {
  featureActionActivationOptions,
  featureActivationOptions,
} from "../types/featureActions";

import type {
  FeatureActionActivation,
  FeatureActivation,
} from "../types/featureActions";

type CustomCharacterCreatorProps = {
  onBackToModeSelect?: () => void;

  mode?: "create" | "edit";

  characterId?: string;

  initialCharacter?: CustomCharacter;
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

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
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

const splitTextList = (value: string) =>
  value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);

const joinTextList = (values?: string[]) => (values ?? []).join("\n");

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

  const [customArmorClass, setCustomArmorClass] = useState(
    initialStats.armorClass ?? 10,
  );

  const [customMaxHp, setCustomMaxHp] = useState(initialStats.maxHp ?? 10);

  const [customCurrentHp, setCustomCurrentHp] = useState(
    initialStats.currentHp ?? initialStats.maxHp ?? 10,
  );

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

  const [armorProficienciesText, setArmorProficienciesText] = useState(
    joinTextList(initialProficiencies?.armor),
  );

  const [weaponProficienciesText, setWeaponProficienciesText] = useState(
    joinTextList(initialProficiencies?.weapons),
  );

  const [toolProficienciesText, setToolProficienciesText] = useState(
    joinTextList(initialProficiencies?.tools),
  );

  const [languagesText, setLanguagesText] = useState(
    joinTextList(initialProficiencies?.languages),
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

      spellSaveDc: 10,

      spellAttackBonus: 0,

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

  const handleAbilityChange = (key: AbilityKey, value: string) => {
    const parsed = Number(value);

    setAbilityScores((current) => ({
      ...current,

      [key]: Number.isNaN(parsed) ? 0 : parsed,
    }));
  };

  const toggleSavingThrow = (ability: AbilityKey) => {
    setSavingThrowProficiencies((current) =>
      current.includes(ability)
        ? current.filter((entry) => entry !== ability)
        : [...current, ability],
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

  const addCustomTrait = () => {
    setCustomTraits((current) => [
      ...current,

      {
        id: makeId(),

        name: "",

        source: "",

        description: "",

        activation: "passive",

        actions: [],
      },
    ]);
  };

  const updateCustomTrait = (
    id: string,

    updates: Partial<CustomTrait>,
  ) => {
    setCustomTraits((current) =>
      current.map((trait) =>
        trait.id === id
          ? {
              ...trait,
              ...updates,
            }
          : trait,
      ),
    );
  };

  const removeCustomTrait = (id: string) => {
    setCustomTraits((current) => current.filter((trait) => trait.id !== id));
  };

  const addCustomTraitAction = (traitId: string) => {
    setCustomTraits((current) =>
      current.map((trait) =>
        trait.id === traitId
          ? {
              ...trait,

              actions: [
                ...(trait.actions ?? []),

                {
                  id: makeId(),

                  name: "",

                  activation: "bonus-action",

                  description: "",
                },
              ],
            }
          : trait,
      ),
    );
  };

  const updateCustomTraitAction = (
    traitId: string,

    actionId: string,

    updates: {
      name?: string;

      activation?: FeatureActionActivation;

      description?: string;
    },
  ) => {
    setCustomTraits((current) =>
      current.map((trait) =>
        trait.id === traitId
          ? {
              ...trait,

              actions: (trait.actions ?? []).map((action) =>
                action.id === actionId
                  ? {
                      ...action,
                      ...updates,
                    }
                  : action,
              ),
            }
          : trait,
      ),
    );
  };

  const removeCustomTraitAction = (
    traitId: string,

    actionId: string,
  ) => {
    setCustomTraits((current) =>
      current.map((trait) =>
        trait.id === traitId
          ? {
              ...trait,

              actions: (trait.actions ?? []).filter(
                (action) => action.id !== actionId,
              ),
            }
          : trait,
      ),
    );
  };

  const addCatalogItem = (itemId: string, quantity = 1) => {
    const item = itemsById[itemId];

    if (!item) {
      return;
    }

    const safeQuantity = Math.max(1, Math.floor(quantity) || 1);

    setEquipment((current) => {
      /*
       * Stackable items are stored as one inventory entry.
       * This makes quantities such as 20 arrows practical.
       */
      if (item.stackable) {
        const existing = current.find(
          (entry) =>
            (entry.source === "base" || entry.source === undefined) &&
            entry.itemId === itemId &&
            !entry.equipped,
        );

        if (existing) {
          return current.map((entry) =>
            entry === existing
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
      }

      /*
       * Preserve the existing behavior for non-stackable equipment:
       * multiple copies get distinct instance IDs so they can later be
       * equipped and managed independently.
       */
      const next = [...current];

      for (let index = 0; index < safeQuantity; index += 1) {
        next.push({
          instanceId: createEquipmentInstanceId(itemId, next),

          source: "base",

          itemId,

          name: item.name,

          quantity: 1,

          equipped: false,

          equippedSlots: [],
        });
      }

      return next;
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

    if (customCurrentHp < 0) {
      return "Current HP cannot be negative.";
    }

    if (customMaxHp < 0) {
      return "Maximum HP cannot be negative.";
    }

    if (visibleTraits.some((trait) => !trait.name.trim())) {
      return "Every trait must have a name.";
    }

    return "";
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
      armorClass: customArmorClass,

      currentHp: customCurrentHp,

      maxHp: customMaxHp,

      speed: customSpeed,

      proficiencyBonus: customProficiencyBonus,
    },

    customProficiencies: {
      savingThrows: savingThrowProficiencies,

      skills: skillProficiencies,

      armor: splitTextList(armorProficienciesText),

      weapons: splitTextList(weaponProficienciesText),

      tools: splitTextList(toolProficienciesText),

      languages: splitTextList(languagesText),
    },

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
        await updateDoc(
          doc(db, "characters", characterId),

          {
            ...payload,

            updatedAt: new Date(),
          } as any,
        );

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
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={handleCancel}
            className="mb-4 text-sm text-zinc-400 hover:text-white"
          >
            ← {isEditing ? "Back to character" : "Change character type"}
          </button>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
            {isEditing ? "Character Editor" : "Quick Character Creator"}
          </p>

          <h1 className="text-3xl font-bold text-white">
            {isEditing ? "Edit Character" : "Create Character"}
          </h1>

          <p className="mt-2 text-zinc-400">
            {isEditing
              ? "Update the manually entered character sheet."
              : "Enter an existing character sheet directly."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 grid gap-6 lg:grid-cols-3"
          >
            <div className="space-y-6 lg:col-span-2">
              {/* CHARACTER */}

              <Card title="Character">
                <div className="mb-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowPortraitPicker((current) => !current)}
                    className="group h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition hover:border-white/20"
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
                    />
                  </div>
                </div>

                {showPortraitPicker ? (
                  <div className="mb-6 border-t border-white/10 pt-5">
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {defaultCharacterPortraits.map((portrait) => (
                        <button
                          key={portrait.id}
                          type="button"
                          onClick={() => {
                            setImageUrl(portrait.url);

                            setShowImageUrlInput(false);
                          }}
                          className="overflow-hidden rounded-xl border border-white/10 transition hover:border-white/30"
                        >
                          <img
                            src={portrait.url}
                            alt={portrait.label}
                            className="aspect-square w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setShowImageUrlInput((current) => !current)
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10"
                      >
                        Use image URL
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setImageUrl(getRandomDefaultPortraitUrl())
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10"
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
                          className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/15"
                        >
                          Remove portrait
                        </button>
                      ) : null}
                    </div>

                    {showImageUrlInput ? (
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(event) => setImageUrl(event.target.value)}
                        placeholder="https://..."
                        className="mt-4 w-full rounded-xl border border-white/10 bg-zinc-950 p-3 outline-none"
                      />
                    ) : null}
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Class"
                    value={customClassName}
                    onChange={setCustomClassName}
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
                  />

                  <TextInput
                    label="Background"
                    value={customBackgroundName}
                    onChange={setCustomBackgroundName}
                  />

                  <TextInput
                    label="Alignment"
                    value={alignment}
                    onChange={setAlignment}
                  />
                </div>
              </Card>

              {/* ABILITIES */}

              <Card title="Ability Scores">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
                  {abilityKeys.map((key) => (
                    <div
                      key={key}
                      className="rounded-xl border border-white/10 bg-zinc-900 p-3 text-center"
                    >
                      <label className="text-xs font-bold text-zinc-500">
                        {abilityShortLabels[key]}
                      </label>

                      <input
                        type="number"
                        value={abilityScores[key]}
                        onChange={(event) =>
                          handleAbilityChange(
                            key,

                            event.target.value,
                          )
                        }
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
                <div className="grid gap-4 sm:grid-cols-5">
                  <NumberInput
                    label="AC"
                    value={customArmorClass}
                    onChange={setCustomArmorClass}
                  />

                  <NumberInput
                    label="Current HP"
                    value={customCurrentHp}
                    min={0}
                    onChange={setCustomCurrentHp}
                  />

                  <NumberInput
                    label="Max HP"
                    value={customMaxHp}
                    min={0}
                    onChange={setCustomMaxHp}
                  />

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
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900 p-3"
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
                <div className="space-y-2">
                  {customSkillDefinitions.map((skill) => (
                    <div
                      key={skill.id}
                      className="grid items-center gap-3 rounded-xl border border-white/10 bg-zinc-900 p-3 sm:grid-cols-[1fr_70px_160px]"
                    >
                      <div>
                        <p className="text-sm text-white">{skill.name}</p>

                        <p className="text-xs text-zinc-500">
                          {abilityShortLabels[skill.ability]}
                        </p>
                      </div>

                      <strong>
                        {formatModifier(
                          getSkillBonus(
                            skill.ability,

                            skillProficiencies[skill.id],
                          ),
                        )}
                      </strong>

                      <select
                        value={skillProficiencies[skill.id]}
                        onChange={(event) =>
                          setSkillProficiencies((current) => ({
                            ...current,

                            [skill.id]: event.target
                              .value as CustomProficiencyLevel,
                          }))
                        }
                        className="rounded-lg border border-white/10 bg-zinc-950 p-2 text-sm"
                      >
                        <option value="none">None</option>

                        <option value="proficient">Proficient</option>

                        <option value="expertise">Expertise</option>
                      </select>
                    </div>
                  ))}
                </div>
              </Card>

              {/* PROFICIENCIES */}

              <Card title="Other Proficiencies & Languages">
                <p className="mb-4 text-sm text-zinc-500">
                  Separate entries with commas or new lines.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Textarea
                    label="Armor Proficiencies"
                    value={armorProficienciesText}
                    onChange={setArmorProficienciesText}
                  />

                  <Textarea
                    label="Weapon Proficiencies"
                    value={weaponProficienciesText}
                    onChange={setWeaponProficienciesText}
                  />

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
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setItemPickerOpen(true)}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950"
                  >
                    + Add Item
                  </button>
                </div>

                {equipment.length === 0 ? (
                  <p className="text-sm text-zinc-500">No equipment added.</p>
                ) : (
                  <div className="space-y-2">
                    {equipment.map((entry) => (
                      <div
                        key={entry.instanceId}
                        className="grid gap-3 rounded-xl border border-white/10 bg-zinc-900 p-3 sm:grid-cols-[1fr_100px_auto]"
                      >
                        <div>
                          <p className="font-medium text-white">{entry.name}</p>

                          <p className="text-xs text-zinc-500">
                            {entry.itemId ?? entry.campaignItemId}
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
                          className="text-red-300"
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
                <label className="mb-5 flex items-center gap-3">
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
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
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
                          className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 p-3"
                        >
                          <option value="">None</option>

                          {abilityKeys.map((ability) => (
                            <option key={ability} value={ability}>
                              {abilityLabels[ability]}
                            </option>
                          ))}
                        </select>
                      </label>

                      <NumberInput
                        label="Spell Save DC"
                        value={customSpellcasting.spellSaveDc}
                        onChange={(value) =>
                          setCustomSpellcasting((current) => ({
                            ...current,

                            spellSaveDc: value,
                          }))
                        }
                      />

                      <NumberInput
                        label="Spell Attack Bonus"
                        value={customSpellcasting.spellAttackBonus}
                        onChange={(value) =>
                          setCustomSpellcasting((current) => ({
                            ...current,

                            spellAttackBonus: value,
                          }))
                        }
                      />
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
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-white">Spells</h3>

                        <button
                          type="button"
                          onClick={() => setSpellPickerOpen(true)}
                          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950"
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
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900 p-3"
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
                                  className="text-sm text-red-300"
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
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {(["cp", "sp", "ep", "gp", "pp"] as const).map((currency) => (
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
                  ))}
                </div>
              </Card>

              {/* FEATURES */}

              <Card title="Features & Traits">
                <button
                  type="button"
                  onClick={addCustomTrait}
                  className="mb-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950"
                >
                  + Add Trait
                </button>

                {customTraits.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    No features or traits added.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {customTraits.map((trait) => (
                      <div
                        key={trait.id}
                        className="rounded-xl border border-white/10 bg-zinc-900 p-4"
                      >
                        <div className="grid gap-3 sm:grid-cols-2">
                          <TextInput
                            label="Name"
                            value={trait.name}
                            onChange={(value) =>
                              updateCustomTrait(
                                trait.id,

                                {
                                  name: value,
                                },
                              )
                            }
                          />

                          <TextInput
                            label="Source"
                            value={trait.source ?? ""}
                            onChange={(value) =>
                              updateCustomTrait(
                                trait.id,

                                {
                                  source: value,
                                },
                              )
                            }
                          />
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                          <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                              Primary Activation
                            </label>

                            <select
                              value={trait.activation ?? "passive"}
                              onChange={(event) =>
                                updateCustomTrait(trait.id, {
                                  activation: event.target
                                    .value as FeatureActivation,
                                })
                              }
                              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-zinc-400"
                            >
                              {featureActivationOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={() => addCustomTraitAction(trait.id)}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                          >
                            + Secondary Action
                          </button>
                        </div>

                        {(trait.actions ?? []).length > 0 ? (
                          <div className="mt-3 space-y-2 rounded-xl border border-white/[0.07] bg-black/20 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                              Secondary Actions
                            </p>

                            {(trait.actions ?? []).map((action) => (
                              <div
                                key={action.id}
                                className="rounded-lg border border-white/[0.07] bg-zinc-950/60 p-3"
                              >
                                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_150px_auto]">
                                  <input
                                    value={action.name}
                                    onChange={(event) =>
                                      updateCustomTraitAction(
                                        trait.id,
                                        action.id,
                                        {
                                          name: event.target.value,
                                        },
                                      )
                                    }
                                    placeholder="Action name"
                                    className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none"
                                  />

                                  <select
                                    value={action.activation}
                                    onChange={(event) =>
                                      updateCustomTraitAction(
                                        trait.id,
                                        action.id,
                                        {
                                          activation: event.target
                                            .value as FeatureActionActivation,
                                        },
                                      )
                                    }
                                    className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white outline-none"
                                  >
                                    {featureActionActivationOptions.map(
                                      (option) => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </option>
                                      ),
                                    )}
                                  </select>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeCustomTraitAction(
                                        trait.id,
                                        action.id,
                                      )
                                    }
                                    className="rounded-lg px-2 text-xs text-zinc-600 transition hover:text-red-300"
                                  >
                                    Remove
                                  </button>
                                </div>

                                <textarea
                                  value={action.description ?? ""}
                                  onChange={(event) =>
                                    updateCustomTraitAction(
                                      trait.id,
                                      action.id,
                                      {
                                        description: event.target.value,
                                      },
                                    )
                                  }
                                  rows={2}
                                  placeholder="What does this action do?"
                                  className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none"
                                />
                              </div>
                            ))}
                          </div>
                        ) : null}

                        <div className="mt-3">
                          <Textarea
                            label="Description"
                            value={trait.description ?? ""}
                            onChange={(value) =>
                              updateCustomTrait(
                                trait.id,

                                {
                                  description: value,
                                },
                              )
                            }
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeCustomTrait(trait.id)}
                          className="mt-3 text-sm text-red-300"
                        >
                          Remove trait
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* DETAILS */}

              <Card title="Character Details">
                <div className="space-y-6">
                  <div>
                    <p className="mb-3 text-sm font-medium text-zinc-300">
                      Physical Details
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <TextInput label="Age" value={age} onChange={setAge} />

                      <TextInput
                        label="Height"
                        value={height}
                        onChange={setHeight}
                      />

                      <TextInput
                        label="Weight"
                        value={weight}
                        onChange={setWeight}
                      />

                      <TextInput label="Eyes" value={eyes} onChange={setEyes} />

                      <TextInput label="Skin" value={skin} onChange={setSkin} />

                      <TextInput label="Hair" value={hair} onChange={setHair} />
                    </div>
                  </div>

                  <Textarea
                    label="Character Appearance"
                    value={characterAppearance}
                    onChange={setCharacterAppearance}
                    rows={6}
                  />

                  <Textarea
                    label="Allies & Organizations"
                    value={alliesAndOrganizations}
                    onChange={setAlliesAndOrganizations}
                    rows={6}
                  />

                  <Textarea
                    label="Character Backstory"
                    value={characterBackstory}
                    onChange={setCharacterBackstory}
                    rows={10}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Textarea
                      label="Personality Traits"
                      value={personalityTraits}
                      onChange={setPersonalityTraits}
                      rows={5}
                    />

                    <Textarea
                      label="Ideals"
                      value={ideals}
                      onChange={setIdeals}
                      rows={5}
                    />

                    <Textarea
                      label="Bonds"
                      value={bonds}
                      onChange={setBonds}
                      rows={5}
                    />

                    <Textarea
                      label="Flaws"
                      value={flaws}
                      onChange={setFlaws}
                      rows={5}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* SIDEBAR */}

            <aside className="h-fit rounded-3xl border border-white/10 bg-white/5 p-5 lg:sticky lg:top-6">
              <h2 className="text-xl font-semibold text-white">Summary</h2>

              <p className="mt-5 text-xl font-bold">
                {name || "Unnamed Character"}
              </p>

              <p className="text-sm text-zinc-400">
                Level {customLevel} {customSpeciesName} {customClassName}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <MiniStat
                  label="HP"
                  value={`${customCurrentHp}/${customMaxHp}`}
                />

                <MiniStat label="AC" value={customArmorClass} />

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
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-xl bg-white p-3 font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
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
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
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
  <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
    <h2 className="mb-5 text-xl font-semibold text-white">{title}</h2>

    {children}
  </section>
);

const TextInput = ({
  label,
  value,
  onChange,
}: {
  label: string;

  value: string;

  onChange: (value: string) => void;
}) => (
  <label className="block">
    <span className="text-sm text-zinc-300">{label}</span>

    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-white outline-none focus:border-white/25"
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
}) => (
  <label className="block">
    <span className="text-sm text-zinc-300">{label}</span>

    <input
      type="number"
      min={min}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-white outline-none focus:border-white/25"
    />
  </label>
);

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
      className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-white outline-none focus:border-white/25"
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
  <div className="rounded-xl border border-white/10 bg-zinc-900 p-3">
    <p className="text-xs text-zinc-500">{label}</p>

    <p className="mt-1 font-semibold text-white">{value}</p>
  </div>
);

export default CustomCharacterCreator;
