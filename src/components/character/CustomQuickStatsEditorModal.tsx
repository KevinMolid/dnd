import { useEffect, useMemo, useState } from "react";

import AbilityScoresSavingThrowsEditor from "./AbilityScoresSavingThrowsEditor";

import SkillsEditor from "./SkillsEditor";

import CombatStatsEditor from "./CombatStatsEditor";

import ProficienciesLanguagesEditor, {
  armorProficiencyPresets,
  weaponProficiencyPresets,
  getCustomProficiencyValues,
  getSelectedProficiencyPresetIds,
  joinProficiencyText,
  mergePresetAndCustomProficiencies,
  splitProficiencyText,
  type ArmorProficiencyPresetId,
  type WeaponProficiencyPresetId,
} from "./ProficienciesLanguagesEditor";

import type { AbilityKey } from "../../rulesets/dnd/dnd2024/types";

import { createEmptyCustomSkills } from "../../types/customCharacter";

import type {
  CustomCharacterStats,
  CustomProficiencies,
} from "../../types/customCharacter";

type EditorMode = "combat" | "saving-throws" | "skills" | "proficiencies";

type Props = {
  open: boolean;

  mode: EditorMode;

  abilityScores: Record<AbilityKey, number>;

  customStats: CustomCharacterStats;

  customProficiencies: CustomProficiencies;

  calculatedArmorClass: number;

  onClose: () => void;

  onSaveCombat: (
    abilityScores: Record<AbilityKey, number>,

    customStats: CustomCharacterStats,
  ) => void | Promise<void>;

  onSaveProficiencies: (
    customProficiencies: CustomProficiencies,
  ) => void | Promise<void>;
};

const CustomQuickStatsEditorModal = ({
  open,

  mode,

  abilityScores,

  customStats,

  customProficiencies,

  calculatedArmorClass,

  onClose,

  onSaveCombat,

  onSaveProficiencies,
}: Props) => {
  const [draftAbilities, setDraftAbilities] = useState(abilityScores);

  const [draftStats, setDraftStats] = useState(customStats);

  const [draftProficiencies, setDraftProficiencies] =
    useState(customProficiencies);

  const [armorText, setArmorText] = useState("");

  const [weaponText, setWeaponText] = useState("");

  const [toolText, setToolText] = useState("");

  const [languageText, setLanguageText] = useState("");

  const [armorPresetIds, setArmorPresetIds] = useState<
    ArmorProficiencyPresetId[]
  >([]);

  const [weaponPresetIds, setWeaponPresetIds] = useState<
    WeaponProficiencyPresetId[]
  >([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setDraftAbilities({ ...abilityScores });

    setDraftStats({ ...customStats });

    setDraftProficiencies({
      ...customProficiencies,

      savingThrows: [...customProficiencies.savingThrows],

      skills: {
        ...createEmptyCustomSkills(),

        ...customProficiencies.skills,
      },

      armor: [...customProficiencies.armor],

      weapons: [...customProficiencies.weapons],

      tools: [...customProficiencies.tools],

      languages: [...customProficiencies.languages],
    });

    setArmorPresetIds(
      getSelectedProficiencyPresetIds(
        customProficiencies.armor,
        armorProficiencyPresets,
      ),
    );

    setArmorText(
      joinProficiencyText(
        getCustomProficiencyValues(
          customProficiencies.armor,
          armorProficiencyPresets,
        ),
      ),
    );

    setWeaponPresetIds(
      getSelectedProficiencyPresetIds(
        customProficiencies.weapons,
        weaponProficiencyPresets,
      ),
    );

    setWeaponText(
      joinProficiencyText(
        getCustomProficiencyValues(
          customProficiencies.weapons,
          weaponProficiencyPresets,
        ),
      ),
    );

    setToolText(joinProficiencyText(customProficiencies.tools));

    setLanguageText(joinProficiencyText(customProficiencies.languages));

    setSaving(false);
  }, [open, abilityScores, customStats, customProficiencies]);

  const title = useMemo(() => {
    if (mode === "combat") return "Edit Combat";

    if (mode === "saving-throws") return "Edit Abilities & Saving Throws";

    if (mode === "skills") return "Edit Skills";

    return "Edit Proficiencies";
  }, [mode]);

  if (!open) return null;

  const handleSave = async () => {
    try {
      setSaving(true);

      if (mode === "combat") {
        await onSaveCombat(draftAbilities, {
          ...draftStats,

          maxHp: Math.max(0, Math.floor(draftStats.maxHp ?? 0)),

          currentHp: Math.min(
            Math.max(0, Math.floor(draftStats.currentHp ?? 0)),

            Math.max(0, Math.floor(draftStats.maxHp ?? 0)),
          ),

          speed: Math.max(0, Math.floor(draftStats.speed ?? 0)),

          proficiencyBonus: Math.max(
            0,

            Math.floor(draftStats.proficiencyBonus ?? 0),
          ),

          armorClassBonus: Math.trunc(draftStats.armorClassBonus ?? 0),

          manualArmorClass: Math.max(
            0,

            Math.floor(draftStats.manualArmorClass ?? calculatedArmorClass),
          ),
        });
      } else if (mode === "saving-throws") {
        await onSaveCombat(draftAbilities, draftStats);

        await onSaveProficiencies(draftProficiencies);
      } else {
        const nextProficiencies =
          mode === "proficiencies"
            ? {
                ...draftProficiencies,

                armor: mergePresetAndCustomProficiencies(
                  armorPresetIds,
                  armorText,
                ),

                weapons: mergePresetAndCustomProficiencies(
                  weaponPresetIds,
                  weaponText,
                ),

                tools: splitProficiencyText(toolText),

                languages: splitProficiencyText(languageText),
              }
            : draftProficiencies;

        await onSaveProficiencies(nextProficiencies);
      }

      onClose();
    } finally {
      setSaving(false);
    }
  };

  const toggleSavingThrow = (ability: AbilityKey) => {
    setDraftProficiencies((current) => ({
      ...current,

      savingThrows: current.savingThrows.includes(ability)
        ? current.savingThrows.filter((item) => item !== ability)
        : [...current.savingThrows, ability],
    }));
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section className="flex max-h-[min(760px,calc(100vh-24px))] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.08] px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Custom Character
            </p>

            <h2 className="mt-0.5 text-base font-semibold text-white">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close editor"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm text-zinc-500 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
          >
            ×
          </button>
        </header>

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
          {mode === "combat" ? (
            <CombatStatsEditor
              armorClassMode={draftStats.armorClassMode ?? "automatic"}
              manualArmorClass={
                draftStats.manualArmorClass ?? calculatedArmorClass
              }
              armorClassBonus={draftStats.armorClassBonus ?? 0}
              maxHp={draftStats.maxHp ?? 0}
              hitDie={draftStats.hitDie ?? "d8"}
              speed={draftStats.speed ?? 30}
              proficiencyBonus={draftStats.proficiencyBonus ?? 2}
              resolvedArmorClass={
                draftStats.armorClassMode === "manual"
                  ? (draftStats.manualArmorClass ?? calculatedArmorClass)
                  : calculatedArmorClass
              }
              onArmorClassModeChange={(armorClassMode) =>
                setDraftStats((current) => ({
                  ...current,
                  armorClassMode,
                }))
              }
              onManualArmorClassChange={(manualArmorClass) =>
                setDraftStats((current) => ({
                  ...current,
                  manualArmorClass,
                }))
              }
              onArmorClassBonusChange={(armorClassBonus) =>
                setDraftStats((current) => ({
                  ...current,
                  armorClassBonus,
                }))
              }
              onMaxHpChange={(maxHp) =>
                setDraftStats((current) => ({ ...current, maxHp }))
              }
              onHitDieChange={(hitDie) =>
                setDraftStats((current) => ({ ...current, hitDie }))
              }
              onSpeedChange={(speed) =>
                setDraftStats((current) => ({ ...current, speed }))
              }
              onProficiencyBonusChange={(proficiencyBonus) =>
                setDraftStats((current) => ({
                  ...current,
                  proficiencyBonus,
                }))
              }
            />
          ) : null}

          {mode === "saving-throws" ? (
            <AbilityScoresSavingThrowsEditor
              abilityScores={draftAbilities}
              savingThrowProficiencies={draftProficiencies.savingThrows}
              proficiencyBonus={draftStats.proficiencyBonus ?? 2}
              onAbilityScoreChange={(ability, value) =>
                setDraftAbilities((current) => ({
                  ...current,

                  [ability]: value,
                }))
              }
              onSavingThrowToggle={toggleSavingThrow}
            />
          ) : null}

          {mode === "skills" ? (
            <SkillsEditor
              abilityScores={draftAbilities}
              skillProficiencies={draftProficiencies.skills}
              proficiencyBonus={draftStats.proficiencyBonus ?? 2}
              onSkillProficiencyChange={(skillId, nextLevel) =>
                setDraftProficiencies((current) => ({
                  ...current,

                  skills: {
                    ...current.skills,

                    [skillId]:
                      current.skills[skillId] === nextLevel
                        ? "none"
                        : nextLevel,
                  },
                }))
              }
            />
          ) : null}

          {mode === "proficiencies" ? (
            <ProficienciesLanguagesEditor
              armorPresetIds={armorPresetIds}
              weaponPresetIds={weaponPresetIds}
              armorText={armorText}
              weaponText={weaponText}
              toolText={toolText}
              languageText={languageText}
              onArmorPresetToggle={(id) =>
                setArmorPresetIds((current) =>
                  current.includes(id)
                    ? current.filter((entry) => entry !== id)
                    : [...current, id],
                )
              }
              onWeaponPresetToggle={(id) =>
                setWeaponPresetIds((current) =>
                  current.includes(id)
                    ? current.filter((entry) => entry !== id)
                    : [...current, id],
                )
              }
              onArmorTextChange={setArmorText}
              onWeaponTextChange={setWeaponText}
              onToolTextChange={setToolText}
              onLanguageTextChange={setLanguageText}
            />
          ) : null}
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-white/[0.08] px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-semibold text-zinc-400 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </footer>
      </section>
    </div>
  );
};

export default CustomQuickStatsEditorModal;
