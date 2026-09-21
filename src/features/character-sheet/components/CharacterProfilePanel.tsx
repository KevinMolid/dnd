import { useEffect, useMemo, useState } from "react";

import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

import { db } from "../../../firebase";

export type CharacterProfileValues = {
  age?: string;
  height?: string;
  weight?: string;
  eyes?: string;
  skin?: string;
  hair?: string;
  alignment?: string;
  appearance?: string;
  connections?: string;
  backstory?: string;
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
};

type CharacterProfilePanelProps = CharacterProfileValues & {
  editable?: boolean;
  onSave?: (values: CharacterProfileValues) => void | Promise<void>;
};

/*
 * The character sheet hook currently loads a snapshot rather than subscribing
 * to Firestore. Keep successful inline edits available while switching tabs
 * during the same page session; a full refresh then reads the saved Firestore
 * values normally.
 */
const savedProfileCache = new Map<string, CharacterProfileValues>();

const emptyToUndefined = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const CharacterProfilePanel = ({
  age,
  height,
  weight,
  eyes,
  skin,
  hair,
  alignment,
  appearance,
  connections,
  backstory,
  personalityTraits,
  ideals,
  bonds,
  flaws,
  editable = true,
  onSave,
}: CharacterProfilePanelProps) => {
  const { characterId } = useParams();

  const propValues = useMemo<CharacterProfileValues>(
    () => ({
      age,
      height,
      weight,
      eyes,
      skin,
      hair,
      alignment,
      appearance,
      connections,
      backstory,
      personalityTraits,
      ideals,
      bonds,
      flaws,
    }),
    [
      age,
      height,
      weight,
      eyes,
      skin,
      hair,
      alignment,
      appearance,
      connections,
      backstory,
      personalityTraits,
      ideals,
      bonds,
      flaws,
    ],
  );

  const values = useMemo(
    () =>
      characterId
        ? {
            ...propValues,
            ...(savedProfileCache.get(characterId) ?? {}),
          }
        : propValues,
    [characterId, propValues],
  );

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<CharacterProfileValues>(values);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) {
      setDraft(values);
    }
  }, [values, editing]);

  const setField = (field: keyof CharacterProfileValues, value: string) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const cancel = () => {
    setDraft(values);
    setError("");
    setEditing(false);
  };

  const save = async () => {
    const normalized = Object.fromEntries(
      Object.entries(draft).map(([key, value]) => [
        key,
        typeof value === "string" ? emptyToUndefined(value) : value,
      ]),
    ) as CharacterProfileValues;

    try {
      setSaving(true);
      setError("");

      if (onSave) {
        await onSave(normalized);
      } else {
        if (!characterId) {
          throw new Error("Missing character ID.");
        }

        await updateDoc(doc(db, "characters", characterId), {
          age: normalized.age ?? "",
          height: normalized.height ?? "",
          weight: normalized.weight ?? "",
          eyes: normalized.eyes ?? "",
          skin: normalized.skin ?? "",
          hair: normalized.hair ?? "",
          alignment: normalized.alignment ?? "",
          characterAppearance: normalized.appearance ?? "",
          alliesAndOrganizations: normalized.connections ?? "",
          characterBackstory: normalized.backstory ?? "",
          personalityTraits: normalized.personalityTraits ?? "",
          ideals: normalized.ideals ?? "",
          bonds: normalized.bonds ?? "",
          flaws: normalized.flaws ?? "",
          updatedAt: serverTimestamp(),
        });
      }

      if (characterId) {
        savedProfileCache.set(characterId, normalized);
      }

      setDraft(normalized);
      setEditing(false);
    } catch (err) {
      console.error("Failed to save character profile:", err);
      setError("Failed to save character details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="divide-y divide-white/[0.07]">
      <section className="px-4 py-3.5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.11em] text-zinc-400">
            Character Details
          </h2>

          {editable && (onSave || characterId) ? (
            editing ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={saving}
                  onClick={cancel}
                  className="rounded-md px-2 py-1 text-xs font-semibold text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-200 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={save}
                  className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/15 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-md border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-xs font-semibold text-zinc-400 transition hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
              >
                Edit
              </button>
            )
          ) : null}
        </div>

        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          <DetailField
            label="Age"
            value={draft.age}
            editing={editing}
            onChange={(value) => setField("age", value)}
          />
          <DetailField
            label="Height"
            value={draft.height}
            editing={editing}
            onChange={(value) => setField("height", value)}
          />
          <DetailField
            label="Weight"
            value={draft.weight}
            editing={editing}
            onChange={(value) => setField("weight", value)}
          />
          <DetailField
            label="Alignment"
            value={draft.alignment}
            editing={editing}
            onChange={(value) => setField("alignment", value)}
          />
          <DetailField
            label="Eyes"
            value={draft.eyes}
            editing={editing}
            onChange={(value) => setField("eyes", value)}
          />
          <DetailField
            label="Skin"
            value={draft.skin}
            editing={editing}
            onChange={(value) => setField("skin", value)}
          />
          <DetailField
            label="Hair"
            value={draft.hair}
            editing={editing}
            onChange={(value) => setField("hair", value)}
          />
        </div>
      </section>

      <LongField
        label="Appearance"
        value={draft.appearance}
        editing={editing}
        onChange={(value) => setField("appearance", value)}
      />

      <LongField
        label="Connections"
        value={draft.connections}
        editing={editing}
        emptyText="No connections recorded."
        onChange={(value) => setField("connections", value)}
      />

      <LongField
        label="Backstory"
        value={draft.backstory}
        editing={editing}
        onChange={(value) => setField("backstory", value)}
      />

      {editing || draft.personalityTraits ? (
        <LongField
          label="Personality Traits"
          value={draft.personalityTraits}
          editing={editing}
          onChange={(value) => setField("personalityTraits", value)}
        />
      ) : null}

      {editing || draft.ideals ? (
        <LongField
          label="Ideals"
          value={draft.ideals}
          editing={editing}
          onChange={(value) => setField("ideals", value)}
        />
      ) : null}

      {editing || draft.bonds ? (
        <LongField
          label="Bonds"
          value={draft.bonds}
          editing={editing}
          onChange={(value) => setField("bonds", value)}
        />
      ) : null}

      {editing || draft.flaws ? (
        <LongField
          label="Flaws"
          value={draft.flaws}
          editing={editing}
          onChange={(value) => setField("flaws", value)}
        />
      ) : null}

      {error ? (
        <div className="px-4 py-2 text-sm text-red-300">{error}</div>
      ) : null}
    </div>
  );
};

const DetailField = ({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value?: string;
  editing: boolean;
  onChange: (value: string) => void;
}) => (
  <label className="min-w-0">
    <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">
      {label}
    </span>

    {editing ? (
      <input
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-white/[0.09] bg-black/25 px-2.5 py-2 text-sm font-medium text-white outline-none transition focus:border-emerald-500/35"
      />
    ) : (
      <p className="mt-1.5 truncate text-sm font-semibold text-zinc-100">
        {value?.trim() || "—"}
      </p>
    )}
  </label>
);

const LongField = ({
  label,
  value,
  editing,
  emptyText = "—",
  onChange,
}: {
  label: string;
  value?: string;
  editing: boolean;
  emptyText?: string;
  onChange: (value: string) => void;
}) => (
  <section className="px-4 py-3.5">
    <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
      {label}
    </h3>

    {editing ? (
      <textarea
        value={value ?? ""}
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
        rows={label === "Backstory" ? 5 : 3}
        className="workspace-scrollbar mt-2 w-full resize-none rounded-lg border border-white/[0.09] bg-black/25 px-3 py-2.5 text-sm leading-6 text-white outline-none transition focus:border-emerald-500/35"
      />
    ) : (
      <p
        className={`mt-2 whitespace-pre-wrap text-sm leading-6 ${
          value?.trim() ? "text-zinc-200" : "text-zinc-600"
        }`}
      >
        {value?.trim() || emptyText}
      </p>
    )}
  </section>
);

export default CharacterProfilePanel;
