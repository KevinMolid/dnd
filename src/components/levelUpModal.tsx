import { useMemo, useState } from "react";
import { classesById, subclassesById } from "../rulesets/dnd/dnd2024/helpers";
import { getPendingLevelUpSteps } from "../rulesets/dnd/dnd2024/getPendingLevelUpSteps";
import {
  getAvailableCantripsForRules,
  getAvailableLeveledSpellsForRules,
  getSpellById,
} from "../rulesets/dnd/dnd2024/data/spells/helpers";
import type {
  AbilityKey,
  LanguageId,
  LevelNumber,
  LevelUpDecision,
  SkillId,
  SpellId,
  SpellSelection,
  WeaponMasteryChoiceId,
  SpellLevel,
} from "../rulesets/dnd/dnd2024/types";

type Props = {
  character: any;
  onClose: () => void;
  onConfirm: (decisionsByLevel: Record<number, LevelUpDecision>) => void;
};

type CantripReplacement = {
  removeSpellId?: SpellId;
  addSpellId?: SpellId;
};

type LeveledSpellReplacement = {
  removeSpellId?: SpellId;
  addSpellId?: SpellId;
  level?: number;
};

const ALL_ABILITIES: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];

const FALLBACK_LANGUAGES: LanguageId[] = [
  "common",
  "dwarvish",
  "elvish",
  "giant",
  "gnomish",
  "goblin",
  "halfling",
  "orc",
  "draconic",
  "infernal",
  "celestial",
  "sylvan",
  "undercommon",
];

const FALLBACK_SKILLS: SkillId[] = [
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
];

const FALLBACK_FEATS = [
  { id: "alert", name: "Alert" },
  { id: "lucky", name: "Lucky" },
  { id: "skilled", name: "Skilled" },
  { id: "tough", name: "Tough" },
];

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const choiceButtonClass = (selected: boolean) =>
  [
    "rounded-xl border px-3 py-2 text-sm transition text-left",
    selected
      ? "border-amber-400/40 bg-amber-400/15 text-amber-200"
      : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white",
  ].join(" ");

const sectionCardClass = "rounded-xl border border-white/10 bg-white/5 p-4";

const LevelUpModal = ({ character, onClose, onConfirm }: Props) => {
  const [loading, setLoading] = useState(false);
  const [decisionsByLevel, setDecisionsByLevel] = useState<
    Record<number, LevelUpDecision>
  >({});

  const classDef = classesById[character.classId];

  const subclassOptions = useMemo(() => {
    return classDef?.subclasses ?? [];
  }, [classDef]);

  const weaponMasteryOptions = useMemo(() => {
    return classDef?.weaponMasteryOptions ?? [];
  }, [classDef]);

  const selectedSubclassId =
    decisionsByLevel[3]?.subclassId ??
    character.choices?.levelUpDecisions?.[3]?.subclassId ??
    character.choices?.subclassId ??
    character.subclassId;

  const selectedSubclass = useMemo(() => {
    return selectedSubclassId ? subclassesById[selectedSubclassId] : undefined;
  }, [selectedSubclassId]);

  const pendingSteps = useMemo(
    () => getPendingLevelUpSteps(character as any, selectedSubclass),
    [character, selectedSubclass],
  );

  const activeSubclassSpellcasting = selectedSubclass?.spellcasting;

  const getEffectiveDecisionForLevel = (level: number): LevelUpDecision => {
    const saved = character.choices?.levelUpDecisions?.[level] ?? {};
    const local = decisionsByLevel[level] ?? {};

    return {
      ...saved,
      ...local,
    };
  };

  const updateDecision = (level: number, patch: Partial<LevelUpDecision>) => {
    setDecisionsByLevel((prev) => ({
      ...prev,
      [level]: {
        ...(prev[level] ?? {}),
        ...patch,
      },
    }));
  };

  const toggleExpertise = (
    level: number,
    value: SkillId | "thieves-tools",
    maxChoices: number,
  ) => {
    const current = (
      getEffectiveDecisionForLevel(level).expertise ?? []
    ).slice();
    const exists = current.includes(value);

    const next = exists
      ? current.filter((item) => item !== value)
      : current.length < maxChoices
        ? [...current, value]
        : current;

    updateDecision(level, { expertise: next });
  };

  const toggleWeaponMastery = (
    level: number,
    value: WeaponMasteryChoiceId,
    maxChoices: number,
  ) => {
    const current = (
      getEffectiveDecisionForLevel(level).weaponMastery ?? []
    ).slice();
    const exists = current.includes(value);

    const next = exists
      ? current.filter((item) => item !== value)
      : current.length < maxChoices
        ? [...current, value]
        : current;

    updateDecision(level, { weaponMastery: next });
  };

  const toggleCantripChoice = (
    level: number,
    spellId: SpellId,
    maxChoices: number,
  ) => {
    const current = (
      getEffectiveDecisionForLevel(level).cantripChoices ?? []
    ).slice();
    const exists = current.includes(spellId);

    const next = exists
      ? current.filter((id) => id !== spellId)
      : current.length < maxChoices
        ? [...current, spellId]
        : current;

    updateDecision(level, { cantripChoices: next });
  };

  const toggleSpellChoice = (
    level: number,
    spell: SpellSelection,
    maxChoices: number,
  ) => {
    const current = (
      getEffectiveDecisionForLevel(level).spellChoices ?? []
    ).slice();
    const exists = current.some((s) => s.spellId === spell.spellId);

    const next = exists
      ? current.filter((s) => s.spellId !== spell.spellId)
      : current.length < maxChoices
        ? [...current, spell]
        : current;

    updateDecision(level, { spellChoices: next });
  };

  const setCantripReplacement = (
    level: number,
    replacement: CantripReplacement,
  ) => {
    const current =
      (getEffectiveDecisionForLevel(level).cantripReplacements?.[0] as
        | CantripReplacement
        | undefined) ?? {};

    updateDecision(level, {
      cantripReplacements: [
        {
          removeSpellId: replacement.removeSpellId ?? current.removeSpellId,
          addSpellId: replacement.addSpellId ?? current.addSpellId,
        },
      ],
    });
  };

  const setSpellReplacement = (
    level: number,
    replacement: LeveledSpellReplacement,
  ) => {
    const current =
      (getEffectiveDecisionForLevel(level).spellReplacements?.[0] as
        | LeveledSpellReplacement
        | undefined) ?? {};

    updateDecision(level, {
      spellReplacements: [
        {
          removeSpellId: replacement.removeSpellId ?? current.removeSpellId,
          addSpellId: replacement.addSpellId ?? current.addSpellId,
          level:
            (replacement.level as SpellLevel) ?? (current.level as SpellLevel),
        },
      ],
    });
  };

  const getAvailableCantripsForStep = (stepLevel: LevelNumber) => {
    if (!activeSubclassSpellcasting) return [];
    void stepLevel;
    return getAvailableCantripsForRules(activeSubclassSpellcasting);
  };

  const getAvailableLeveledSpellsForStep = (step: any) => {
    if (!activeSubclassSpellcasting) return [];

    let spells = getAvailableLeveledSpellsForRules(
      activeSubclassSpellcasting,
      step.level as LevelNumber,
    );

    const restrictions = step.choice?.restrictions ?? [];

    const levelRestriction = restrictions.find((restriction: string) =>
      restriction.startsWith("Must be a level "),
    );

    if (levelRestriction) {
      const match = levelRestriction.match(/Must be a level (\d+) spell/);
      if (match) {
        const restrictedLevel = Number(match[1]);
        spells = spells.filter((spell) => spell.level === restrictedLevel);
      }
    }

    return spells;
  };

  const getKnownSpellsBeforeLevel = (level: number) => {
    const cantripIds = new Set<SpellId>();
    const spellSelections: SpellSelection[] = [];

    const savedDecisions = character.choices?.levelUpDecisions ?? {};
    const allLevels = Object.keys(savedDecisions)
      .map(Number)
      .filter((l) => l < level)
      .sort((a, b) => a - b);

    for (const prevLevel of allLevels) {
      const decision = savedDecisions[prevLevel];
      if (!decision) continue;

      if (Array.isArray(decision.cantripChoices)) {
        for (const spellId of decision.cantripChoices as SpellId[]) {
          cantripIds.add(spellId);
        }
      }

      if (Array.isArray(decision.spellChoices)) {
        for (const spell of decision.spellChoices as SpellSelection[]) {
          if (!spellSelections.some((s) => s.spellId === spell.spellId)) {
            spellSelections.push(spell);
          }
        }
      }

      if (Array.isArray(decision.cantripReplacements)) {
        for (const replacement of decision.cantripReplacements as CantripReplacement[]) {
          if (replacement.removeSpellId)
            cantripIds.delete(replacement.removeSpellId);
          if (replacement.addSpellId) cantripIds.add(replacement.addSpellId);
        }
      }

      if (Array.isArray(decision.spellReplacements)) {
        for (const replacement of decision.spellReplacements as LeveledSpellReplacement[]) {
          if (replacement.removeSpellId) {
            const index = spellSelections.findIndex(
              (s) => s.spellId === replacement.removeSpellId,
            );
            if (index >= 0) {
              spellSelections.splice(index, 1);
            }
          }

          if (replacement.addSpellId) {
            const spellData = getSpellById(replacement.addSpellId);
            const spellLevel = replacement.level ?? spellData?.level ?? 1;

            if (
              !spellSelections.some((s) => s.spellId === replacement.addSpellId)
            ) {
              spellSelections.push({
                spellId: replacement.addSpellId,
                level: spellLevel as SpellLevel,
              });
            }
          }
        }
      }
    }

    return {
      cantripIds: Array.from(cantripIds),
      spellSelections,
    };
  };

  const isFeatStepComplete = (decision: LevelUpDecision | undefined) => {
    if (decision?.featId) return true;
    if (decision?.asi?.plus2) return true;

    if (
      decision?.asi?.plus1a &&
      decision?.asi?.plus1b &&
      decision.asi.plus1a !== decision.asi.plus1b
    ) {
      return true;
    }

    return false;
  };

  const isStepComplete = (step: any) => {
    const decision = getEffectiveDecisionForLevel(step.level);

    if (step.type === "subclass-choice") {
      return !!decision?.subclassId;
    }

    if (step.type === "feat-choice") {
      return isFeatStepComplete(decision);
    }

    if (step.type === "expertise-choice") {
      const requiredCount =
        typeof step.choice?.choose === "number" ? step.choice.choose : 2;

      return (
        Array.isArray(decision?.expertise) &&
        decision.expertise.length >= requiredCount
      );
    }

    if (step.type === "language-choice") {
      return !!decision?.language;
    }

    if (step.type === "weapon-mastery-choice") {
      const requiredCount =
        typeof step.choice?.choose === "number" ? step.choice.choose : 1;

      return (
        Array.isArray(decision?.weaponMastery) &&
        decision.weaponMastery.length >= requiredCount
      );
    }

    if (step.type === "cantrip-choice") {
      const requiredCount =
        typeof step.choice?.choose === "number" ? step.choice.choose : 1;

      return (
        Array.isArray(decision?.cantripChoices) &&
        decision.cantripChoices.length >= requiredCount
      );
    }

    if (step.type === "spell-choice") {
      const requiredCount =
        typeof step.choice?.choose === "number" ? step.choice.choose : 1;

      return (
        Array.isArray(decision?.spellChoices) &&
        decision.spellChoices.length >= requiredCount
      );
    }

    if (step.type === "cantrip-replacement") {
      const replacement =
        (decision.cantripReplacements?.[0] as CantripReplacement | undefined) ??
        {};
      return !!replacement.removeSpellId && !!replacement.addSpellId;
    }

    if (step.type === "spell-replacement") {
      const replacement =
        (decision.spellReplacements?.[0] as
          | LeveledSpellReplacement
          | undefined) ?? {};
      return !!replacement.removeSpellId && !!replacement.addSpellId;
    }

    return true;
  };

  const canConfirm = pendingSteps.every(isStepComplete);

  const handleConfirm = async () => {
    setLoading(true);

    try {
      await onConfirm(decisionsByLevel);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Level Up Available
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              {character.name} can advance from level {character.level} to level{" "}
              {character.derivedLevel}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
          Confirm all required choices below to complete the level-up.
        </div>

        <div className="mt-6 space-y-4">
          {pendingSteps.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
              No additional choices are required. This level-up can be applied
              directly.
            </div>
          ) : (
            pendingSteps.map((step) => {
              const decision = getEffectiveDecisionForLevel(step.level);
              const stepLevel = step.level as LevelNumber;
              const availableStepCantrips =
                getAvailableCantripsForStep(stepLevel);
              const availableStepLeveledSpells =
                step.type === "spell-choice" ||
                step.type === "spell-replacement"
                  ? getAvailableLeveledSpellsForStep(step)
                  : [];

              const knownBeforeStep = getKnownSpellsBeforeLevel(step.level);
              const knownCantripsBeforeStep = knownBeforeStep.cantripIds;
              const knownSpellsBeforeStep = knownBeforeStep.spellSelections;

              const cantripReplacement =
                (decision.cantripReplacements?.[0] as
                  | CantripReplacement
                  | undefined) ?? {};
              const spellReplacement =
                (decision.spellReplacements?.[0] as
                  | LeveledSpellReplacement
                  | undefined) ?? {};

              const filteredAvailableStepCantrips =
                availableStepCantrips.filter(
                  (spell) =>
                    !knownCantripsBeforeStep.includes(spell.id) ||
                    (decision.cantripChoices ?? []).includes(spell.id) ||
                    spell.id === cantripReplacement.removeSpellId,
                );

              const knownSpellIdsBeforeStep = knownSpellsBeforeStep.map(
                (spell) => spell.spellId,
              );

              const filteredAvailableStepLeveledSpells =
                availableStepLeveledSpells.filter(
                  (spell) =>
                    !knownSpellIdsBeforeStep.includes(spell.id) ||
                    (decision.spellChoices ?? []).some(
                      (selected) => selected.spellId === spell.id,
                    ) ||
                    spell.id === spellReplacement.removeSpellId,
                );

              return (
                <div
                  key={step.id}
                  className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white">
                          {step.title}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500">
                          Level {step.level}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          isStepComplete(step)
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {isStepComplete(step) ? "Complete" : "Required"}
                      </span>
                    </div>

                    {step.description && (
                      <p className="mt-3 text-sm text-zinc-400">
                        {step.description}
                      </p>
                    )}
                  </div>

                  {step.type === "feature" && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                      <p className="text-sm font-medium text-emerald-200">
                        {step.title}
                      </p>
                      {step.description && (
                        <p className="mt-1 text-sm text-emerald-100/80">
                          {step.description}
                        </p>
                      )}
                    </div>
                  )}

                  {step.type === "subclass-choice" && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {subclassOptions.length > 0 ? (
                        subclassOptions.map((subclass) => {
                          const subclassId = subclass.id;
                          const subclassName =
                            subclass.name ?? formatLabel(subclassId);

                          return (
                            <button
                              key={subclassId}
                              onClick={() =>
                                updateDecision(step.level, { subclassId })
                              }
                              className={choiceButtonClass(
                                decision.subclassId === subclassId,
                              )}
                            >
                              <span className="block font-medium">
                                {subclassName}
                              </span>
                              {subclass.description && (
                                <span className="mt-1 block text-xs text-zinc-400">
                                  {subclass.description}
                                </span>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-sm text-zinc-500">
                          No subclass options found for this class yet.
                        </p>
                      )}
                    </div>
                  )}

                  {step.type === "feat-choice" && (
                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-sm font-medium text-zinc-200">
                          Choose a feat
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {FALLBACK_FEATS.map((feat) => (
                            <button
                              key={feat.id}
                              onClick={() =>
                                updateDecision(step.level, {
                                  featId: feat.id,
                                  asi: undefined,
                                })
                              }
                              className={choiceButtonClass(
                                decision.featId === feat.id,
                              )}
                            >
                              {feat.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-4">
                        <p className="mb-2 text-sm font-medium text-zinc-200">
                          Or choose an Ability Score Improvement
                        </p>

                        <div className="grid gap-4 lg:grid-cols-2">
                          <div className={sectionCardClass}>
                            <p className="mb-3 text-sm font-medium text-zinc-200">
                              Option A: +2 to one ability
                            </p>

                            <select
                              value={decision.asi?.plus2 ?? ""}
                              onChange={(e) =>
                                updateDecision(step.level, {
                                  featId: undefined,
                                  asi: e.target.value
                                    ? {
                                        plus2: e.target.value as AbilityKey,
                                      }
                                    : undefined,
                                })
                              }
                              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                            >
                              <option value="">Select ability</option>
                              {ALL_ABILITIES.map((ability) => (
                                <option key={ability} value={ability}>
                                  {ability.toUpperCase()}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className={sectionCardClass}>
                            <p className="mb-3 text-sm font-medium text-zinc-200">
                              Option B: +1 to two abilities
                            </p>

                            <div className="grid gap-3">
                              <select
                                value={decision.asi?.plus1a ?? ""}
                                onChange={(e) =>
                                  updateDecision(step.level, {
                                    featId: undefined,
                                    asi: {
                                      plus1a: (e.target.value || undefined) as
                                        | AbilityKey
                                        | undefined,
                                      plus1b: decision.asi?.plus1b ?? undefined,
                                    },
                                  })
                                }
                                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                              >
                                <option value="">First ability</option>
                                {ALL_ABILITIES.map((ability) => (
                                  <option key={ability} value={ability}>
                                    {ability.toUpperCase()}
                                  </option>
                                ))}
                              </select>

                              <select
                                value={decision.asi?.plus1b ?? ""}
                                onChange={(e) =>
                                  updateDecision(step.level, {
                                    featId: undefined,
                                    asi: {
                                      plus1a: decision.asi?.plus1a ?? undefined,
                                      plus1b: (e.target.value || undefined) as
                                        | AbilityKey
                                        | undefined,
                                    },
                                  })
                                }
                                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                              >
                                <option value="">Second ability</option>
                                {ALL_ABILITIES.map((ability) => (
                                  <option key={ability} value={ability}>
                                    {ability.toUpperCase()}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {decision.asi?.plus1a &&
                          decision.asi?.plus1b &&
                          decision.asi.plus1a === decision.asi.plus1b && (
                            <p className="mt-3 text-xs text-amber-300">
                              Choose two different abilities for the +1 / +1
                              option.
                            </p>
                          )}
                      </div>
                    </div>
                  )}

                  {step.type === "expertise-choice" && (
                    <div>
                      <p className="mb-2 text-sm text-zinc-400">
                        Choose {step.choice?.choose ?? 2} expertise options.
                      </p>

                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {(
                          (step.choice?.options as Array<string>) ?? [
                            ...FALLBACK_SKILLS,
                            "thieves-tools",
                          ]
                        ).map((option) => (
                          <button
                            key={option}
                            onClick={() =>
                              toggleExpertise(
                                step.level,
                                option as SkillId | "thieves-tools",
                                step.choice?.choose ?? 2,
                              )
                            }
                            className={choiceButtonClass(
                              (decision.expertise ?? []).includes(
                                option as SkillId | "thieves-tools",
                              ),
                            )}
                          >
                            {formatLabel(option)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.type === "language-choice" && (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {(
                        (step.choice?.options as Array<string>) ??
                        FALLBACK_LANGUAGES
                      ).map((language) => (
                        <button
                          key={language}
                          onClick={() =>
                            updateDecision(step.level, {
                              language: language as LanguageId,
                            })
                          }
                          className={choiceButtonClass(
                            decision.language === language,
                          )}
                        >
                          {formatLabel(language)}
                        </button>
                      ))}
                    </div>
                  )}

                  {step.type === "weapon-mastery-choice" && (
                    <div>
                      <p className="mb-2 text-sm text-zinc-400">
                        Choose {step.choice?.choose ?? 1} weapon mastery option
                        {(step.choice?.choose ?? 1) > 1 ? "s" : ""}.
                      </p>

                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {(
                          (step.choice?.options as Array<string>) ??
                          weaponMasteryOptions
                        ).map((option) => (
                          <button
                            key={option}
                            onClick={() =>
                              toggleWeaponMastery(
                                step.level,
                                option as WeaponMasteryChoiceId,
                                step.choice?.choose ?? 1,
                              )
                            }
                            className={choiceButtonClass(
                              (decision.weaponMastery ?? []).includes(
                                option as WeaponMasteryChoiceId,
                              ),
                            )}
                          >
                            {formatLabel(option)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.type === "cantrip-choice" && (
                    <div>
                      <p className="mb-2 text-sm text-zinc-400">
                        Choose {step.choice?.choose ?? 1} cantrip
                        {(step.choice?.choose ?? 1) > 1 ? "s" : ""}.
                      </p>

                      {knownCantripsBeforeStep.length > 0 && (
                        <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                            Already Known
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {knownCantripsBeforeStep.map((spellId) => (
                              <span
                                key={spellId}
                                className="rounded-full border border-white/10 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300"
                              >
                                {getSpellById(spellId)?.name ?? spellId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {!activeSubclassSpellcasting ? (
                        <p className="text-sm text-zinc-500">
                          Select a spellcasting subclass first.
                        </p>
                      ) : (
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {filteredAvailableStepCantrips.map((spell) => (
                            <button
                              key={spell.id}
                              onClick={() =>
                                toggleCantripChoice(
                                  step.level,
                                  spell.id,
                                  step.choice?.choose ?? 1,
                                )
                              }
                              className={choiceButtonClass(
                                (decision.cantripChoices ?? []).includes(
                                  spell.id,
                                ),
                              )}
                            >
                              <span className="block font-medium">
                                {spell.name}
                              </span>
                              <span className="mt-1 block text-xs text-zinc-400">
                                {spell.school}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {step.type === "spell-choice" && (
                    <div>
                      <p className="mb-2 text-sm text-zinc-400">
                        Choose {step.choice?.choose ?? 1} spell
                        {(step.choice?.choose ?? 1) > 1 ? "s" : ""}.
                      </p>

                      {knownSpellsBeforeStep.length > 0 && (
                        <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                            Already Chosen
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {knownSpellsBeforeStep.map((spell) => (
                              <span
                                key={spell.spellId}
                                className="rounded-full border border-white/10 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300"
                              >
                                {getSpellById(spell.spellId)?.name ??
                                  spell.spellId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {!activeSubclassSpellcasting ? (
                        <p className="text-sm text-zinc-500">
                          Select a spellcasting subclass first.
                        </p>
                      ) : (
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {filteredAvailableStepLeveledSpells.map((spell) => (
                            <button
                              key={spell.id}
                              onClick={() =>
                                toggleSpellChoice(
                                  step.level,
                                  {
                                    spellId: spell.id,
                                    level: spell.level as SpellLevel,
                                  },
                                  step.choice?.choose ?? 1,
                                )
                              }
                              className={choiceButtonClass(
                                (decision.spellChoices ?? []).some(
                                  (selected) => selected.spellId === spell.id,
                                ),
                              )}
                            >
                              <span className="block font-medium">
                                {spell.name}
                              </span>
                              <span className="mt-1 block text-xs text-zinc-400">
                                Level {spell.level} · {spell.school}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {step.type === "cantrip-replacement" && (
                    <div className="space-y-4">
                      <div className={sectionCardClass}>
                        <p className="mb-2 text-sm font-medium text-zinc-200">
                          Replace one known cantrip
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {knownCantripsBeforeStep.map((spellId) => {
                            const spellData = getSpellById(spellId);
                            const selected =
                              cantripReplacement.removeSpellId === spellId;

                            return (
                              <button
                                key={spellId}
                                onClick={() =>
                                  setCantripReplacement(step.level, {
                                    removeSpellId: spellId,
                                  })
                                }
                                className={choiceButtonClass(selected)}
                              >
                                <span className="block font-medium">
                                  {spellData?.name ?? spellId}
                                </span>
                                <span className="mt-1 block text-xs text-zinc-400">
                                  Known cantrip
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className={sectionCardClass}>
                        <p className="mb-2 text-sm font-medium text-zinc-200">
                          Choose replacement cantrip
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {filteredAvailableStepCantrips.map((spell) => {
                            const selected =
                              cantripReplacement.addSpellId === spell.id;

                            return (
                              <button
                                key={spell.id}
                                onClick={() =>
                                  setCantripReplacement(step.level, {
                                    addSpellId: spell.id,
                                  })
                                }
                                className={choiceButtonClass(selected)}
                              >
                                <span className="block font-medium">
                                  {spell.name}
                                </span>
                                <span className="mt-1 block text-xs text-zinc-400">
                                  {spell.school}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {step.type === "spell-replacement" && (
                    <div className="space-y-4">
                      <div className={sectionCardClass}>
                        <p className="mb-2 text-sm font-medium text-zinc-200">
                          Replace one known spell
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {knownSpellsBeforeStep.map((knownSpell) => {
                            const spellData = getSpellById(knownSpell.spellId);
                            const selected =
                              spellReplacement.removeSpellId ===
                              knownSpell.spellId;

                            return (
                              <button
                                key={knownSpell.spellId}
                                onClick={() =>
                                  setSpellReplacement(step.level, {
                                    removeSpellId: knownSpell.spellId,
                                    level: knownSpell.level,
                                  })
                                }
                                className={choiceButtonClass(selected)}
                              >
                                <span className="block font-medium">
                                  {spellData?.name ?? knownSpell.spellId}
                                </span>
                                <span className="mt-1 block text-xs text-zinc-400">
                                  Level {spellData?.level ?? knownSpell.level}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className={sectionCardClass}>
                        <p className="mb-2 text-sm font-medium text-zinc-200">
                          Choose replacement spell
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {filteredAvailableStepLeveledSpells.map((spell) => {
                            const selected =
                              spellReplacement.addSpellId === spell.id;

                            return (
                              <button
                                key={spell.id}
                                onClick={() =>
                                  setSpellReplacement(step.level, {
                                    addSpellId: spell.id,
                                    level: spell.level,
                                  })
                                }
                                className={choiceButtonClass(selected)}
                              >
                                <span className="block font-medium">
                                  {spell.name}
                                </span>
                                <span className="mt-1 block text-xs text-zinc-400">
                                  Level {spell.level} · {spell.school}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading || !canConfirm}
            className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : "Apply Level Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
