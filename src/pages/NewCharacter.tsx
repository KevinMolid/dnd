import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCharacter } from "../characters";
import { backgrounds, classes, species } from "../rulesets/dnd/dnd2024/rules";
import {
  getBackgroundAbilityOptions,
  getBackgroundFeat,
  getBackgroundSkills,
  getBackgroundTool,
  originFeatsById,
} from "../rulesets/dnd/dnd2024/helpers";
import type { AbilityKey } from "../rulesets/dnd/dnd2024/types";

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

const NewCharacter = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [speciesId, setSpeciesId] = useState(species[0]?.id ?? "");
  const [backgroundId, setBackgroundId] = useState(backgrounds[0]?.id ?? "");
  const [alignment, setAlignment] = useState("");
  const [notes, setNotes] = useState("");
  const [abilityScores, setAbilityScores] = useState(defaultAbilityScores);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const grantedFeatId = useMemo(
    () => getBackgroundFeat(backgroundId),
    [backgroundId],
  );

  const grantedFeatName = grantedFeatId
    ? (originFeatsById[grantedFeatId]?.name ?? grantedFeatId)
    : null;

  const grantedSkills = useMemo(
    () => getBackgroundSkills(backgroundId),
    [backgroundId],
  );

  const grantedTool = useMemo(
    () => getBackgroundTool(backgroundId),
    [backgroundId],
  );

  const abilityOptions = useMemo(
    () => getBackgroundAbilityOptions(backgroundId),
    [backgroundId],
  );

  const handleAbilityChange = (key: AbilityKey, value: string) => {
    const parsed = Number(value);

    setAbilityScores((prev) => ({
      ...prev,
      [key]: Number.isNaN(parsed) ? 0 : parsed,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await createCharacter({
        campaignId: null,
        name,
        level: 1,
        classId,
        speciesId,
        backgroundId,
        originFeatId: grantedFeatId,
        abilityScores,
        alignment,
        notes,
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
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
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
                Ability Scores
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
              Background Summary
            </h2>

            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Granted feat
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  {grantedFeatName ?? "None"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Skill proficiencies
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {grantedSkills.length > 0 ? (
                    grantedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400">None</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Tool proficiency
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  {grantedTool ?? "None"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Ability options
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {abilityOptions.length > 0 ? (
                    abilityOptions.map((ability) => (
                      <span
                        key={ability}
                        className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                      >
                        {abilityLabels[ability]}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400">None</p>
                  )}
                </div>
              </div>
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
