import { FormEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createCharacter } from "../characters";
import type { AbilityKey, Money } from "../rulesets/dnd/dnd2024/types";
import { defaultCharacterPortraits } from "../data/defaultCharacterPortraits";

type CustomCharacterCreatorProps = {
  onBackToModeSelect: () => void;
};

type CustomTraitDraft = {
  id: string;
  name: string;
  source: string;
  description: string;
};

type CustomCharacterStep = "details" | "traits" | "review";

const steps: CustomCharacterStep[] = ["details", "traits", "review"];

const stepLabels: Record<CustomCharacterStep, string> = {
  details: "Details",
  traits: "Traits",
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

const emptyMoney: Money = {
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

const CustomCharacterCreator = ({
  onBackToModeSelect,
}: CustomCharacterCreatorProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const campaignIdFromQuery = searchParams.get("campaignId");
  const campaignMode = searchParams.get("campaignMode");

  const isCampaignUnassignedCreate =
    Boolean(campaignIdFromQuery) && campaignMode === "unassigned";

  const [currentStep, setCurrentStep] =
    useState<CustomCharacterStep>("details");

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(() => getRandomDefaultPortraitUrl());
  const [showPortraitPicker, setShowPortraitPicker] = useState(false);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);

  const [customClassName, setCustomClassName] = useState("");
  const [customSpeciesName, setCustomSpeciesName] = useState("");
  const [customBackgroundName, setCustomBackgroundName] = useState("");
  const [customLevel, setCustomLevel] = useState(1);

  const [alignment, setAlignment] = useState("");
  const [notes, setNotes] = useState("");

  const [abilityScores, setAbilityScores] =
    useState<Record<AbilityKey, number>>(defaultAbilityScores);

  const [customArmorClass, setCustomArmorClass] = useState(10);
  const [customMaxHp, setCustomMaxHp] = useState(10);
  const [customCurrentHp, setCustomCurrentHp] = useState(10);
  const [customSpeed, setCustomSpeed] = useState(30);
  const [customProficiencyBonus, setCustomProficiencyBonus] = useState(2);

  const [customTraits, setCustomTraits] = useState<CustomTraitDraft[]>([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const visibleTraits = useMemo(
    () =>
      customTraits.filter(
        (trait) => trait.name.trim() || trait.description.trim(),
      ),
    [customTraits],
  );

  const handleAbilityChange = (key: AbilityKey, value: string) => {
    const parsed = Number(value);

    setAbilityScores((prev) => ({
      ...prev,
      [key]: Number.isNaN(parsed) ? 0 : parsed,
    }));
  };

  const addCustomTrait = () => {
    setCustomTraits((prev) => [
      ...prev,
      {
        id: makeId(),
        name: "",
        source: "",
        description: "",
      },
    ]);
  };

  const updateCustomTrait = (
    id: string,
    updates: Partial<CustomTraitDraft>,
  ) => {
    setCustomTraits((prev) =>
      prev.map((trait) => (trait.id === id ? { ...trait, ...updates } : trait)),
    );
  };

  const removeCustomTrait = (id: string) => {
    setCustomTraits((prev) => prev.filter((trait) => trait.id !== id));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case "details":
        if (!name.trim()) return "Character name is required.";
        if (!customClassName.trim()) return "Class is required.";
        if (!customSpeciesName.trim()) return "Species / race is required.";
        if (customLevel < 1) return "Level must be at least 1.";
        return "";

      case "traits":
        if (
          customTraits.some(
            (trait) => !trait.name.trim() && trait.description.trim(),
          )
        ) {
          return "Custom traits with descriptions must also have a name.";
        }

        return "";

      case "review":
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    if (!name.trim()) return "Character name is required.";
    if (!customClassName.trim()) return "Class is required.";
    if (!customSpeciesName.trim()) return "Species / race is required.";
    if (customLevel < 1) return "Level must be at least 1.";

    if (
      customTraits.some(
        (trait) => !trait.name.trim() && trait.description.trim(),
      )
    ) {
      return "Custom traits with descriptions must also have a name.";
    }

    return "";
  };

  const goToNextStep = () => {
    const stepError = validateCurrentStep();

    if (stepError) {
      setError(stepError);
      return;
    }

    setError("");

    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) setCurrentStep(nextStep);
  };

  const goToPreviousStep = () => {
    setError("");

    const previousStep = steps[currentStepIndex - 1];
    if (previousStep) setCurrentStep(previousStep);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      await createCharacter({
        ownerUid: isCampaignUnassignedCreate ? null : undefined,
        createdByUid: undefined,
        campaignId: campaignIdFromQuery ?? null,
        campaignStatus: "inactive",

        buildMode: "custom",

        name: name.trim(),
        ...(imageUrl.trim() ? { imageUrl: imageUrl.trim() } : {}),

        level: customLevel,
        className: customClassName.trim(),
        speciesName: customSpeciesName.trim(),
        backgroundName: customBackgroundName.trim(),

        abilityScores,
        alignment: alignment.trim(),
        notes: notes.trim(),

        customStats: {
          armorClass: customArmorClass,
          currentHp: customCurrentHp,
          maxHp: customMaxHp,
          speed: customSpeed,
          proficiencyBonus: customProficiencyBonus,
        },

        customTraits: visibleTraits.map((trait) => ({
          id: trait.id,
          name: trait.name.trim(),
          source: trait.source.trim(),
          description: trait.description.trim(),
        })),

        choices: {},
        equipment: [],
        money: emptyMoney,
      } as any);

      navigate(
        campaignIdFromQuery
          ? `/campaigns/${campaignIdFromQuery}/characters`
          : "/",
      );
    } catch (err: any) {
      setError(err?.message || "Failed to create character.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRandomDefaultPortraitUrl = () => {
    if (defaultCharacterPortraits.length === 0) return "";

    const randomIndex = Math.floor(
      Math.random() * defaultCharacterPortraits.length,
    );
    return defaultCharacterPortraits[randomIndex].url;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={onBackToModeSelect}
            className="mb-4 text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            ← Change character type
          </button>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Custom Character Creator
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Create Custom Character
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Manually enter the character values. This works for homebrew, custom
            rules, NPCs and non-D&amp;D systems.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {steps.map((step, index) => {
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
                      onClick={() => setShowPortraitPicker((prev) => !prev)}
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
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Elaris, Brom, Kael..."
                          className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {showPortraitPicker && (
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="mb-3 text-sm font-medium text-zinc-200">
                        Choose default portrait
                      </p>

                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                        {defaultCharacterPortraits.map((portrait) => {
                          const isSelected = imageUrl === portrait.url;

                          return (
                            <button
                              key={portrait.id}
                              type="button"
                              onClick={() => {
                                setImageUrl(portrait.url);
                                setShowImageUrlInput(false);
                              }}
                              className={`overflow-hidden rounded-2xl border transition ${
                                isSelected
                                  ? "border-white bg-white/10"
                                  : "border-white/10 bg-zinc-900 hover:border-white/25"
                              }`}
                              title={portrait.label}
                            >
                              <img
                                src={portrait.url}
                                alt={portrait.label}
                                className="aspect-square w-full object-cover"
                              />
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => setShowImageUrlInput((prev) => !prev)}
                          className="text-sm font-medium text-zinc-400 transition hover:text-white"
                        >
                          Use image URL instead
                        </button>

                        {imageUrl.trim() && (
                          <button
                            type="button"
                            onClick={() => {
                              setImageUrl("");
                              setShowImageUrlInput(false);
                            }}
                            className="text-sm font-medium text-zinc-500 transition hover:text-red-300"
                          >
                            Remove portrait
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {showImageUrlInput && (
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <label className="mb-1 block text-sm font-medium text-zinc-200">
                        Character image URL
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(event) => setImageUrl(event.target.value)}
                        placeholder="https://example.com/character.jpg"
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
                      />
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">
                      Class
                    </label>
                    <input
                      value={customClassName}
                      onChange={(event) =>
                        setCustomClassName(event.target.value)
                      }
                      placeholder="Fighter, Witch, Blood Hunter..."
                      className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">
                      Species / Race
                    </label>
                    <input
                      value={customSpeciesName}
                      onChange={(event) =>
                        setCustomSpeciesName(event.target.value)
                      }
                      placeholder="Human, Elf, Goblin, Homebrew..."
                      className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">
                      Background
                    </label>
                    <input
                      value={customBackgroundName}
                      onChange={(event) =>
                        setCustomBackgroundName(event.target.value)
                      }
                      placeholder="Soldier, Noble, Cultist..."
                      className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-200">
                      Level
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={customLevel}
                      onChange={(event) =>
                        setCustomLevel(Number(event.target.value))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-zinc-200">
                      Alignment
                    </label>
                    <input
                      value={alignment}
                      onChange={(event) => setAlignment(event.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Ability Scores
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {(Object.keys(abilityLabels) as AbilityKey[]).map((key) => (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-medium text-zinc-200">
                          {abilityLabels[key]}
                        </label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={abilityScores[key]}
                          onChange={(event) =>
                            handleAbilityChange(key, event.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Combat Values
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">
                        AC
                      </label>
                      <input
                        type="number"
                        value={customArmorClass}
                        onChange={(event) =>
                          setCustomArmorClass(Number(event.target.value))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">
                        Current HP
                      </label>
                      <input
                        type="number"
                        value={customCurrentHp}
                        onChange={(event) =>
                          setCustomCurrentHp(Number(event.target.value))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">
                        Max HP
                      </label>
                      <input
                        type="number"
                        value={customMaxHp}
                        onChange={(event) =>
                          setCustomMaxHp(Number(event.target.value))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">
                        Speed
                      </label>
                      <input
                        type="number"
                        value={customSpeed}
                        onChange={(event) =>
                          setCustomSpeed(Number(event.target.value))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-200">
                        Proficiency
                      </label>
                      <input
                        type="number"
                        value={customProficiencyBonus}
                        onChange={(event) =>
                          setCustomProficiencyBonus(Number(event.target.value))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-2">
                  <label className="text-sm font-medium text-zinc-200">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Appearance, personality, backstory, goals..."
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-zinc-400"
                  />
                </div>
              </>
            )}

            {currentStep === "traits" && (
              <>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-white">
                    Custom Traits
                  </h2>

                  <button
                    type="button"
                    onClick={addCustomTrait}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                  >
                    Add trait
                  </button>
                </div>

                <div className="space-y-4">
                  {customTraits.map((trait) => (
                    <div
                      key={trait.id}
                      className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4"
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          value={trait.name}
                          onChange={(event) =>
                            updateCustomTrait(trait.id, {
                              name: event.target.value,
                            })
                          }
                          placeholder="Trait name"
                          className="rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none"
                        />

                        <input
                          value={trait.source}
                          onChange={(event) =>
                            updateCustomTrait(trait.id, {
                              source: event.target.value,
                            })
                          }
                          placeholder="Source, optional"
                          className="rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none"
                        />
                      </div>

                      <textarea
                        value={trait.description}
                        onChange={(event) =>
                          updateCustomTrait(trait.id, {
                            description: event.target.value,
                          })
                        }
                        placeholder="Description"
                        rows={4}
                        className="mt-3 w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => removeCustomTrait(trait.id)}
                        className="mt-3 text-sm font-medium text-zinc-500 transition hover:text-red-300"
                      >
                        Remove trait
                      </button>
                    </div>
                  ))}

                  {customTraits.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
                      <p className="text-sm text-zinc-400">
                        No custom traits added yet.
                      </p>
                    </div>
                  )}
                </div>
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
                        {customClassName || "—"}
                      </p>
                      <p>
                        <span className="text-zinc-500">Species / Race:</span>{" "}
                        {customSpeciesName || "—"}
                      </p>
                      <p>
                        <span className="text-zinc-500">Background:</span>{" "}
                        {customBackgroundName || "—"}
                      </p>
                      <p>
                        <span className="text-zinc-500">Level:</span>{" "}
                        {customLevel}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Combat
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-zinc-200 sm:grid-cols-5">
                      <div className="rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2">
                        AC: {customArmorClass}
                      </div>
                      <div className="rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2">
                        HP: {customCurrentHp}/{customMaxHp}
                      </div>
                      <div className="rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2">
                        Speed: {customSpeed}
                      </div>
                      <div className="rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2">
                        Prof: +{customProficiencyBonus}
                      </div>
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

                  <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      Traits
                    </p>

                    <div className="mt-3 space-y-3">
                      {visibleTraits.length > 0 ? (
                        visibleTraits.map((trait) => (
                          <div
                            key={trait.id}
                            className="rounded-xl border border-white/10 bg-zinc-950/60 p-3"
                          >
                            <p className="text-sm font-medium text-white">
                              {trait.name}
                            </p>

                            {trait.source.trim() && (
                              <p className="mt-1 text-xs text-zinc-500">
                                {trait.source}
                              </p>
                            )}

                            {trait.description.trim() && (
                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                                {trait.description}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-400">
                          No custom traits.
                        </p>
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
                onClick={isFirstStep ? onBackToModeSelect : goToPreviousStep}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {isFirstStep ? "Back" : "Previous"}
              </button>

              {!isLastStep ? (
                <button
                  type="button"
                  onClick={goToNextStep}
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

          <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
            <h2 className="mb-5 text-xl font-semibold text-white">
              Character Summary
            </h2>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Identity
                </p>

                <div className="mt-2 space-y-1 text-sm text-zinc-200">
                  <p>{name || "Unnamed character"}</p>
                  <p className="text-zinc-400">
                    Level {customLevel} {customSpeciesName || "Custom Species"}{" "}
                    {customClassName || "Custom Class"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Combat
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                    AC {customArmorClass}
                  </span>
                  <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                    HP {customCurrentHp}/{customMaxHp}
                  </span>
                  <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                    Speed {customSpeed}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Traits
                </p>

                <div className="mt-3 space-y-3">
                  {visibleTraits.length > 0 ? (
                    visibleTraits.map((trait) => (
                      <div
                        key={trait.id}
                        className="rounded-2xl border border-white/10 bg-zinc-900/70 p-3"
                      >
                        <p className="text-sm font-medium text-white">
                          {trait.name || "Unnamed trait"}
                        </p>

                        {trait.description.trim() ? (
                          <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-xs leading-5 text-zinc-400">
                            {trait.description}
                          </p>
                        ) : (
                          <p className="mt-2 text-xs text-zinc-500">
                            No description.
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400">
                      No custom traits added.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
              <p className="text-sm font-medium text-white">
                Step {currentStepIndex + 1} of {steps.length}
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

export default CustomCharacterCreator;
