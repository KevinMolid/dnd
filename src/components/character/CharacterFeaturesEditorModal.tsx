import { useEffect, useState } from "react";

import type { CustomTrait } from "../../types/customCharacter";

import CharacterFeaturesEditor from "./CharacterFeaturesEditor";

type CharacterFeaturesEditorModalProps = {
  open: boolean;
  catalogTraitIds: string[];
  customTraits: CustomTrait[];
  onClose: () => void;
  onSave: (
    catalogTraitIds: string[],
    customTraits: CustomTrait[],
  ) => Promise<void> | void;
};

const CharacterFeaturesEditorModal = ({
  open,
  catalogTraitIds,
  customTraits,
  onClose,
  onSave,
}: CharacterFeaturesEditorModalProps) => {
  const [draftCatalogTraitIds, setDraftCatalogTraitIds] = useState<string[]>([]);
  const [draftCustomTraits, setDraftCustomTraits] = useState<CustomTrait[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setDraftCatalogTraitIds([...catalogTraitIds]);
    setDraftCustomTraits(customTraits.map((trait) => ({
      ...trait,
      actions: trait.actions?.map((action) => ({ ...action })) ?? [],
    })));
    setSaving(false);
    setError("");
  }, [open, catalogTraitIds, customTraits]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, saving]);

  if (!open) return null;

  const handleSave = async () => {
    const visibleTraits = draftCustomTraits.filter(
      (trait) =>
        trait.name.trim() ||
        trait.source?.trim() ||
        trait.description?.trim(),
    );

    if (visibleTraits.some((trait) => !trait.name.trim())) {
      setError("Every custom trait must have a name.");
      return;
    }

    const cleanedTraits = visibleTraits.map((trait) => ({
      ...trait,
      name: trait.name.trim(),
      source: trait.source?.trim() ?? "",
      description: trait.description?.trim() ?? "",
      activation: trait.activation ?? "passive",
      actions: (trait.actions ?? [])
        .filter((action) => action.name.trim())
        .map((action) => ({
          ...action,
          name: action.name.trim(),
          description: action.description?.trim() ?? "",
        })),
    }));

    try {
      setSaving(true);
      setError("");
      await onSave(draftCatalogTraitIds, cleanedTraits);
      onClose();
    } catch (err) {
      console.error("Failed to save character features:", err);
      setError("Failed to save features.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 sm:p-5">
      <button
        type="button"
        aria-label="Close feature editor"
        onClick={() => !saving && onClose()}
        className="absolute inset-0 cursor-default"
      />

      <section className="relative flex max-h-[calc(100vh-24px)] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl sm:max-h-[calc(100vh-40px)]">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Edit Features</h2>
            <p className="mt-0.5 text-[10px] text-zinc-500">
              Add library features or create custom traits for this character.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-md px-2 py-1 text-sm text-zinc-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
          <CharacterFeaturesEditor
            catalogTraitIds={draftCatalogTraitIds}
            customTraits={draftCustomTraits}
            onCatalogTraitIdsChange={setDraftCatalogTraitIds}
            onCustomTraitsChange={setDraftCustomTraits}
          />

          {error ? (
            <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          ) : null}
        </div>

        <footer className="flex shrink-0 justify-end gap-2 border-t border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </footer>
      </section>
    </div>
  );
};

export default CharacterFeaturesEditorModal;
