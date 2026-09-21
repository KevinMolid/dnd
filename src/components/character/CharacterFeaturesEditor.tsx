import { useMemo, useState } from "react";

import TraitPickerModal from "./TraitPickerModal";

import { getTraitCatalogEntries } from "../../rulesets/dnd/dnd2024/data/traits/traitCatalog";

import type { CustomTrait } from "../../types/customCharacter";

import {
  featureActionActivationOptions,
  featureActivationOptions,
} from "../../types/featureActions";

import type {
  FeatureActionActivation,
  FeatureActivation,
} from "../../types/featureActions";

type CharacterFeaturesEditorProps = {
  catalogTraitIds: string[];
  customTraits: CustomTrait[];
  onCatalogTraitIdsChange: (value: string[]) => void;
  onCustomTraitsChange: (value: CustomTrait[]) => void;
};

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const CharacterFeaturesEditor = ({
  catalogTraitIds,
  customTraits,
  onCatalogTraitIdsChange,
  onCustomTraitsChange,
}: CharacterFeaturesEditorProps) => {
  const [traitPickerOpen, setTraitPickerOpen] = useState(false);
  const [openTraitIds, setOpenTraitIds] = useState<string[]>([]);

  const selectedCatalogTraits = useMemo(
    () => getTraitCatalogEntries(catalogTraitIds),
    [catalogTraitIds],
  );

  const addCatalogTrait = (catalogId: string) => {
    if (catalogTraitIds.includes(catalogId)) return;
    onCatalogTraitIdsChange([...catalogTraitIds, catalogId]);
  };

  const removeCatalogTrait = (catalogId: string) => {
    onCatalogTraitIdsChange(catalogTraitIds.filter((id) => id !== catalogId));
  };

  const addCustomTrait = () => {
    const id = makeId();

    onCustomTraitsChange([
      ...customTraits,
      {
        id,
        name: "",
        source: "",
        description: "",
        activation: "passive",
        actions: [],
      },
    ]);

    setOpenTraitIds((current) => [...current, id]);
  };

  const openTrait = (id: string) => {
    setOpenTraitIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
  };

  const closeTrait = (id: string) => {
    setOpenTraitIds((current) => current.filter((entry) => entry !== id));
  };

  const updateCustomTrait = (id: string, updates: Partial<CustomTrait>) => {
    onCustomTraitsChange(
      customTraits.map((trait) =>
        trait.id === id ? { ...trait, ...updates } : trait,
      ),
    );
  };

  const removeCustomTrait = (id: string) => {
    onCustomTraitsChange(customTraits.filter((trait) => trait.id !== id));
    setOpenTraitIds((current) => current.filter((entry) => entry !== id));
  };

  const addCustomTraitAction = (traitId: string) => {
    onCustomTraitsChange(
      customTraits.map((trait) =>
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
    onCustomTraitsChange(
      customTraits.map((trait) =>
        trait.id === traitId
          ? {
              ...trait,
              actions: (trait.actions ?? []).map((action) =>
                action.id === actionId ? { ...action, ...updates } : action,
              ),
            }
          : trait,
      ),
    );
  };

  const removeCustomTraitAction = (traitId: string, actionId: string) => {
    onCustomTraitsChange(
      customTraits.map((trait) =>
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

  return (
    <>
      <div className="mb-3 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => setTraitPickerOpen(true)}
          className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/[0.1] hover:text-white"
        >
          + Add from Library
        </button>

        <button
          type="button"
          onClick={addCustomTrait}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950"
        >
          + Custom Trait
        </button>
      </div>

      {selectedCatalogTraits.length > 0 ? (
        <div className="mb-3">
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Library Features
          </p>

          <div className="space-y-1.5">
            {selectedCatalogTraits.map((entry) => (
              <div
                key={entry.catalogId}
                className="flex min-h-11 items-center gap-3 rounded-lg border border-white/[0.08] bg-zinc-900/70 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="truncate text-xs font-semibold text-zinc-100">
                      {entry.trait.name}
                    </span>
                    <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase text-emerald-300">
                      Library
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-[9px] text-zinc-500">
                    {entry.sourceName}
                    {typeof entry.level === "number"
                      ? ` · Level ${entry.level}`
                      : ""}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeCatalogTrait(entry.catalogId)}
                  className="rounded-md px-2 py-1 text-[10px] text-zinc-600 transition hover:text-rose-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {customTraits.length > 0 ? (
        <div>
          <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Custom Features
          </p>

          <div className="space-y-1.5">
            {customTraits.map((trait) => {
              const open = openTraitIds.includes(trait.id);

              if (!open) {
                return (
                  <div
                    key={trait.id}
                    className="flex min-h-11 items-center gap-3 rounded-lg border border-white/[0.08] bg-zinc-900/70 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold text-zinc-100">
                        {trait.name.trim() || "Unnamed Trait"}
                      </div>
                      <div className="mt-0.5 truncate text-[9px] text-zinc-500">
                        {trait.source?.trim() || "Custom"}
                        {trait.activation && trait.activation !== "passive"
                          ? ` · ${trait.activation}`
                          : ""}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openTrait(trait.id)}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      Edit
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={trait.id}
                  className="rounded-lg border border-white/10 bg-zinc-900 p-2.5"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-white">
                        {trait.name.trim() || "New Trait"}
                      </div>
                      <div className="text-[9px] text-zinc-500">
                        Editing trait
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => closeTrait(trait.id)}
                        className="rounded-md bg-white px-2.5 py-1.5 text-[10px] font-semibold text-zinc-950"
                      >
                        Done
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCustomTrait(trait.id)}
                        className="rounded-md border border-rose-500/20 bg-rose-500/[0.06] px-2.5 py-1.5 text-[10px] font-semibold text-rose-300 transition hover:bg-rose-500/[0.12] hover:text-rose-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <TextInput
                      label="Name"
                      value={trait.name}
                      onChange={(value) =>
                        updateCustomTrait(trait.id, { name: value })
                      }
                      maxLength={80}
                    />

                    <TextInput
                      label="Source"
                      value={trait.source ?? ""}
                      onChange={(value) =>
                        updateCustomTrait(trait.id, { source: value })
                      }
                      maxLength={60}
                    />
                  </div>

                  <div className="mt-2.5 grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                        Primary Activation
                      </label>

                      <select
                        value={trait.activation ?? "passive"}
                        onChange={(event) =>
                          updateCustomTrait(trait.id, {
                            activation: event.target.value as FeatureActivation,
                          })
                        }
                        className="w-full rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-2 text-xs text-white outline-none transition focus:border-zinc-400"
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
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    >
                      + Secondary Action
                    </button>
                  </div>

                  {(trait.actions ?? []).length > 0 ? (
                    <div className="mt-2.5 space-y-1.5 rounded-lg border border-white/[0.07] bg-black/20 p-2.5">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                        Secondary Actions
                      </p>

                      {(trait.actions ?? []).map((action) => (
                        <div
                          key={action.id}
                          className="rounded-lg border border-white/[0.07] bg-zinc-950/60 p-2.5"
                        >
                          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_140px_auto]">
                            <input
                              value={action.name}
                              onChange={(event) =>
                                updateCustomTraitAction(trait.id, action.id, {
                                  name: event.target.value,
                                })
                              }
                              placeholder="Action name"
                              className="rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-2 text-xs text-white placeholder:text-zinc-600 outline-none"
                            />

                            <select
                              value={action.activation}
                              onChange={(event) =>
                                updateCustomTraitAction(trait.id, action.id, {
                                  activation: event.target
                                    .value as FeatureActionActivation,
                                })
                              }
                              className="rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-2 text-xs text-white outline-none"
                            >
                              {featureActionActivationOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={() =>
                                removeCustomTraitAction(trait.id, action.id)
                              }
                              className="rounded-lg px-2 text-[10px] text-zinc-600 transition hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>

                          <textarea
                            value={action.description ?? ""}
                            spellCheck={false}
                            onChange={(event) =>
                              updateCustomTraitAction(trait.id, action.id, {
                                description: event.target.value,
                              })
                            }
                            rows={2}
                            placeholder="What does this action do?"
                            className="workspace-scrollbar mt-2 w-full resize-none overflow-y-auto rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-2 text-xs text-white placeholder:text-zinc-600 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-2.5">
                    <Textarea
                      label="Description"
                      value={trait.description ?? ""}
                      onChange={(value) =>
                        updateCustomTrait(trait.id, { description: value })
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {selectedCatalogTraits.length === 0 && customTraits.length === 0 ? (
        <p className="text-xs text-zinc-500">No features or traits added.</p>
      ) : null}

      <TraitPickerModal
        open={traitPickerOpen}
        selectedCatalogIds={catalogTraitIds}
        onAdd={addCatalogTrait}
        onRemove={removeCatalogTrait}
        onClose={() => setTraitPickerOpen(false)}
      />
    </>
  );
};

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

const Textarea = ({
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
    <textarea
      value={value}
      spellCheck={false}
      onChange={(event) => onChange(event.target.value)}
      rows={4}
      className="workspace-scrollbar mt-1.5 w-full resize-y rounded-lg border border-white/10 bg-zinc-950/70 px-2.5 py-2 text-sm text-white outline-none transition focus:border-white/25"
    />
  </label>
);

export default CharacterFeaturesEditor;
