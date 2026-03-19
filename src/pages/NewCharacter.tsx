import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCharacter } from "../characters";
import { backgrounds, classes, species } from "../rulesets/dnd/dnd2024/data";
import { buildDerivedCharacterData } from "../rulesets/dnd/dnd2024/buildDerivedCharacterData";
import { getSpeciesChoices } from "../rulesets/dnd/dnd2024/getSpeciesChoices";
import { getSpeciesGrantedFeatIds } from "../rulesets/dnd/dnd2024/getSpeciesGrantedFeatIds";
import {
  getBackgroundById,
  getClassById,
  getOriginFeatById,
} from "../rulesets/dnd/dnd2024/helpers";
import type {
  AbilityKey,
  CharacterSheetData,
  LanguageId,
  SkillId,
  Trait,
  TraitChoice,
  TraitEffect,
  WeaponMasteryChoiceId,
} from "../rulesets/dnd/dnd2024/types";

import { getAllCharacterTraits } from "../rulesets/dnd/dnd2024/getAllCharacterTraits";

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

const formatTraitEffect = (effect: TraitEffect): string => {
  switch (effect.type) {
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
        ? `${effect.spellName} (available from level ${effect.level})`
        : effect.spellName;

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

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const NewCharacter = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [speciesId, setSpeciesId] = useState(species[0]?.id ?? "");
  const [backgroundId, setBackgroundId] = useState(backgrounds[0]?.id ?? "");
  const [alignment, setAlignment] = useState("");
  const [notes, setNotes] = useState("");
  const [abilityScores, setAbilityScores] = useState(defaultAbilityScores);

  const [classSkillChoices, setClassSkillChoices] = useState<SkillId[]>([]);

  const [speciesTraitChoices, setSpeciesTraitChoices] = useState<
    Record<string, string | string[]>
  >({});

  const [backgroundBonusPlus2, setBackgroundBonusPlus2] = useState<AbilityKey>(
    backgrounds[0]?.abilityOptions[0] ?? "str",
  );
  const [backgroundBonusPlus1, setBackgroundBonusPlus1] = useState<AbilityKey>(
    backgrounds[0]?.abilityOptions[1] ??
      backgrounds[0]?.abilityOptions[0] ??
      "dex",
  );

  const [rogueExpertiseChoices, setRogueExpertiseChoices] = useState<
    Array<SkillId | "thieves-tools">
  >([]);
  const [rogueBonusLanguage, setRogueBonusLanguage] =
    useState<LanguageId>("common");
  const [rogueWeaponMasteryChoices, setRogueWeaponMasteryChoices] = useState<
    WeaponMasteryChoiceId[]
  >([]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const classDef = useMemo(() => getClassById(classId), [classId]);
  const backgroundDef = useMemo(
    () => getBackgroundById(backgroundId),
    [backgroundId],
  );

  const speciesChoices = useMemo<TraitChoice[]>(
    () => getSpeciesChoices(speciesId),
    [speciesId],
  );

  const isRogue = classId === "rogue";

  const backgroundGrantedFeatId = backgroundDef?.originFeatId ?? null;
  const backgroundGrantedFeatName = backgroundGrantedFeatId
    ? (getOriginFeatById(backgroundGrantedFeatId)?.name ??
      backgroundGrantedFeatId)
    : null;

  const speciesGrantedFeatIds = useMemo(
    () => getSpeciesGrantedFeatIds(speciesId, { speciesTraitChoices }),
    [speciesId, speciesTraitChoices],
  );

  const speciesGrantedFeatNames = useMemo(
    () =>
      speciesGrantedFeatIds.map(
        (featId) => getOriginFeatById(featId)?.name ?? featId,
      ),
    [speciesGrantedFeatIds],
  );

  const activeAllTraits = useMemo(() => {
    return getAllCharacterTraits({
      classId,
      speciesId,
      backgroundId,
      originFeatId: backgroundGrantedFeatId,
      level: 1,
      choices: {
        classSkillChoices,
        backgroundAbilityBonuses: {
          plus2: backgroundBonusPlus2,
          plus1: backgroundBonusPlus1,
        },
        speciesTraitChoices,
        ...(isRogue
          ? {
              rogueExpertiseChoices,
              rogueBonusLanguage,
              rogueWeaponMasteryChoices,
            }
          : {}),
      },
    });
  }, [
    backgroundBonusPlus1,
    backgroundBonusPlus2,
    backgroundId,
    classId,
    classSkillChoices,
    backgroundGrantedFeatId,
    isRogue,
    rogueBonusLanguage,
    rogueExpertiseChoices,
    rogueWeaponMasteryChoices,
    speciesId,
    speciesTraitChoices,
  ]);

  const grantedSkills = backgroundDef?.skillProficiencies ?? [];
  const grantedTool = backgroundDef?.toolProficiency ?? null;
  const abilityOptions = backgroundDef?.abilityOptions ?? [];

  const classSkillOptions = classDef?.skillChoice.options ?? [];
  const classSkillChoiceCount = classDef?.skillChoice.choose ?? 0;

  const rogueExpertiseOptions = useMemo(() => {
    if (!isRogue) return [] as Array<SkillId | "thieves-tools">;

    const all = new Set<SkillId | "thieves-tools">([
      ...grantedSkills,
      ...classSkillChoices,
      "thieves-tools",
    ]);

    return Array.from(all);
  }, [classSkillChoices, grantedSkills, isRogue]);

  useEffect(() => {
    setClassSkillChoices((prev) =>
      prev
        .filter((skill) => classSkillOptions.includes(skill))
        .slice(0, classSkillChoiceCount),
    );
  }, [classId, classSkillChoiceCount, classSkillOptions]);

  useEffect(() => {
    const options = backgroundDef?.abilityOptions ?? [];
    if (options.length === 0) return;

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
  }, [backgroundBonusPlus1, backgroundBonusPlus2, backgroundDef]);

  useEffect(() => {
    if (!isRogue) {
      setRogueExpertiseChoices([]);
      setRogueWeaponMasteryChoices([]);
      return;
    }

    setRogueExpertiseChoices((prev) =>
      prev
        .filter((choice) => rogueExpertiseOptions.includes(choice))
        .slice(0, 2),
    );

    setRogueWeaponMasteryChoices((prev) =>
      prev
        .filter((choice) => rogueWeaponMasteryOptions.includes(choice))
        .slice(0, 2),
    );
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

      return next;
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

    if (!abilityOptions.includes(backgroundBonusPlus2)) {
      return "Please choose a valid +2 background ability bonus.";
    }

    if (!abilityOptions.includes(backgroundBonusPlus1)) {
      return "Please choose a valid +1 background ability bonus.";
    }

    if (backgroundBonusPlus2 === backgroundBonusPlus1) {
      return "Your +2 and +1 background bonuses must be different abilities.";
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
      const baseCharacter: CharacterSheetData = {
        ownerUid: "",
        campaignId: null,
        name: name.trim(),
        level: 1,
        classId,
        speciesId,
        backgroundId,
        originFeatId: backgroundGrantedFeatId,
        abilityScores,
        alignment: alignment.trim(),
        notes: notes.trim(),
        choices: {
          classSkillChoices,
          backgroundAbilityBonuses: {
            plus2: backgroundBonusPlus2,
            plus1: backgroundBonusPlus1,
          },
          speciesTraitChoices,
          ...(isRogue
            ? {
                rogueExpertiseChoices,
                rogueBonusLanguage,
                rogueWeaponMasteryChoices,
              }
            : {}),
        },
        equipment: [],
      };

      const derived = buildDerivedCharacterData(baseCharacter);

      await createCharacter({
        campaignId: null,
        name: name.trim(),
        level: 1,
        classId,
        speciesId,
        backgroundId,
        originFeatId: backgroundGrantedFeatId,
        abilityScores,
        alignment: alignment.trim(),
        notes: notes.trim(),
        choices: {
          classSkillChoices,
          backgroundAbilityBonuses: {
            plus2: backgroundBonusPlus2,
            plus1: backgroundBonusPlus1,
          },
          speciesTraitChoices,
          ...(isRogue
            ? {
                rogueExpertiseChoices,
                rogueBonusLanguage,
                rogueWeaponMasteryChoices,
              }
            : {}),
        },
        derived,
        equipment: [],
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

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6 lg:col-span-2">
            <h2 className="mb-5 text-xl font-semibold text-white">
              Character Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
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
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

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
                  {species.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {speciesChoices.length > 0 && (
                <div className="space-y-4 sm:col-span-2">
                  <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
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
                </div>
              )}

              <div className="space-y-2 sm:col-span-2">
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
                  {backgrounds.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

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
                Selected: {classSkillChoices.length} / {classSkillChoiceCount}
              </p>
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
                      const isSelected = rogueExpertiseChoices.includes(choice);

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

                  <p className="mt-3 text-xs text-zinc-500">
                    Selected: {rogueExpertiseChoices.length} / 2
                  </p>
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

                  <p className="mb-4 text-sm text-zinc-400">
                    Choose 2 weapon kinds for Weapon Mastery.
                  </p>

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
                            onChange={() => toggleRogueWeaponMastery(choice)}
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
                    Selected: {rogueWeaponMasteryChoices.length} / 2
                  </p>
                </div>
              </>
            )}

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
                      onChange={(e) => handleAbilityChange(key, e.target.value)}
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
          </section>

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

            <div className="space-y-5">
              {speciesChoices.length > 0 && (
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
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Background feat
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  {backgroundGrantedFeatName ?? "None"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Species feat
                </p>

                {speciesGrantedFeatNames.length > 0 ? (
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
                  {grantedSkills.length > 0 ? (
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
                  {classSkillChoices.length > 0 ? (
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
                  {grantedTool ? formatLabel(grantedTool) : "None"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Background ability bonuses
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                    +2 {abilityLabels[backgroundBonusPlus2]}
                  </span>
                  <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                    +1 {abilityLabels[backgroundBonusPlus1]}
                  </span>
                </div>
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

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating character..." : "Create character"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default NewCharacter;
