import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";

import { db } from "../../../firebase";
import { defaultCharacterPortraits } from "../../../data/defaultCharacterPortraits";

export type EditableCharacterIdentity = {
  id: string;
  buildMode?: string;
  name?: string;
  imageUrl?: string;
  className?: string;
  speciesName?: string;
  backgroundName?: string;
  level?: number;
  campaignId?: string | null;
};

type Props = {
  character: EditableCharacterIdentity;
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-zinc-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/30";

const CharacterIdentityEditor = ({ character }: Props) => {
  const navigate = useNavigate();
  const custom = character.buildMode === "custom";
  const characterUrl = `/characters/${character.id}`;

  const [name, setName] = useState(character.name ?? "");
  const [imageUrl, setImageUrl] = useState(character.imageUrl ?? "");
  const [className, setClassName] = useState(character.className ?? "");
  const [speciesName, setSpeciesName] = useState(character.speciesName ?? "");
  const [backgroundName, setBackgroundName] = useState(character.backgroundName ?? "");
  const [level, setLevel] = useState(character.level ?? 1);
  const [portraitPickerOpen, setPortraitPickerOpen] = useState(false);
  const [imageInputOpen, setImageInputOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Character name is required.");
      return;
    }
    if (custom && (!Number.isInteger(level) || level < 1)) {
      setError("Level must be a positive whole number.");
      return;
    }

    // Only update identity fields that have actually changed. In particular,
    // never overwrite HP, spell slots, inventory, choices, or other live state.
    const patch: Record<string, string | number> = {};
    if (trimmedName !== (character.name ?? "")) patch.name = trimmedName;
    if (imageUrl.trim() !== (character.imageUrl ?? "")) {
      patch.imageUrl = imageUrl.trim(); // Empty string deliberately removes portrait.
    }
    if (custom) {
      if (className.trim() !== (character.className ?? "")) patch.className = className.trim();
      if (speciesName.trim() !== (character.speciesName ?? "")) patch.speciesName = speciesName.trim();
      if (backgroundName.trim() !== (character.backgroundName ?? "")) patch.backgroundName = backgroundName.trim();
      if (level !== (character.level ?? 1)) patch.level = level;
    }

    if (Object.keys(patch).length === 0) {
      navigate(characterUrl);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, "characters", character.id), {
        ...patch,
        updatedAt: serverTimestamp(),
      });

      // Keep the campaign party card in sync without rewriting live stats.
      // Some characters do not have a party document yet.
      if (character.campaignId) {
        const partyRef = doc(db, "campaigns", character.campaignId, "party", character.id);
        const partySnapshot = await getDoc(partyRef);
        if (partySnapshot.exists()) {
          const partyPatch: Record<string, string | number | null> = {};
          if ("name" in patch) partyPatch.name = patch.name;
          if ("imageUrl" in patch) partyPatch.imageUrl = patch.imageUrl || null;
          if (custom) {
            if ("className" in patch) partyPatch.className = patch.className || null;
            if ("speciesName" in patch) {
              partyPatch.speciesName = patch.speciesName || null;
              partyPatch.race = patch.speciesName || null;
            }
            if ("level" in patch) partyPatch.level = patch.level;
          }
          if (Object.keys(partyPatch).length > 0) {
            batch.update(partyRef, { ...partyPatch, updatedAt: serverTimestamp() });
          }
        }
      }

      await batch.commit();
      navigate(characterUrl);
    } catch (cause) {
      console.error("Failed to update character identity:", cause);
      setError(cause instanceof Error ? cause.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-[calc(100dvh-65px)] bg-zinc-950 px-4 py-5 text-zinc-100 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-2xl">
        <button type="button" onClick={() => navigate(characterUrl)}
          className="mb-4 text-xs text-zinc-400 transition hover:text-white">
          ← Back to character
        </button>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Character Editor</p>
        <h1 className="mt-1 text-xl font-bold">Edit Character</h1>
        <p className="mt-1 text-xs text-zinc-500">
          Change basic character information here. Stats, spells, inventory, features and character details are edited in their own sections.
        </p>

        <form onSubmit={save} className="mt-5 space-y-3">
          <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-4">
            <h2 className="mb-4 text-sm font-semibold">Basic Information</h2>
            <div className="flex items-start gap-3">
              <button type="button" onClick={() => setPortraitPickerOpen((open) => !open)}
                aria-label="Change character portrait" title="Change portrait"
                className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-800 text-xl font-bold text-zinc-400 transition hover:border-white/30">
                {imageUrl.trim() ? (
                  <img src={imageUrl.trim()} alt="Character portrait" className="h-full w-full object-cover" />
                ) : (name.trim().charAt(0).toUpperCase() || "?")}
              </button>
              <label className="min-w-0 flex-1 text-xs font-medium text-zinc-300">
                Character Name
                <input value={name} onChange={(event) => setName(event.target.value)}
                  maxLength={60} required className={inputClass} />
              </label>
            </div>

            {portraitPickerOpen ? (
              <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {defaultCharacterPortraits.map((portrait) => (
                    <button key={portrait.id} type="button" title={portrait.label}
                      onClick={() => setImageUrl(portrait.url)}
                      className={`aspect-square overflow-hidden rounded-lg border transition hover:border-white/50 ${imageUrl === portrait.url ? "border-emerald-400" : "border-white/10"}`}>
                      <img src={portrait.url} alt={portrait.label} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => setImageInputOpen((open) => !open)}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/5">
                    Use image URL
                  </button>
                  <button type="button" onClick={() => setImageUrl("")}
                    className="rounded-lg border border-rose-500/20 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10">
                    Remove portrait
                  </button>
                </div>
                {imageInputOpen ? (
                  <label className="block text-xs text-zinc-300">Image URL
                    <input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)}
                      placeholder="https://..." className={inputClass} />
                  </label>
                ) : null}
              </div>
            ) : null}

            {custom ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-zinc-300">Class
                  <input value={className} onChange={(event) => setClassName(event.target.value)} maxLength={50} className={inputClass} />
                </label>
                <label className="text-xs text-zinc-300">Species / Race
                  <input value={speciesName} onChange={(event) => setSpeciesName(event.target.value)} maxLength={50} className={inputClass} />
                </label>
                <label className="text-xs text-zinc-300">Background
                  <input value={backgroundName} onChange={(event) => setBackgroundName(event.target.value)} maxLength={50} className={inputClass} />
                </label>
                <label className="text-xs text-zinc-300">Level
                  <input type="number" min={1} max={20} step={1} value={level}
                    onChange={(event) => setLevel(event.target.value === "" ? 0 : Number(event.target.value))}
                    className={inputClass} />
                </label>
              </div>
            ) : (
              <p className="mt-4 text-xs leading-5 text-zinc-500">
                Class, species, background and level are managed through the Guided character rules and level-up system.
              </p>
            )}
          </section>

          {error ? <p role="alert" className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <button type="button" disabled={saving} onClick={() => navigate(characterUrl)}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/5 disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CharacterIdentityEditor;
