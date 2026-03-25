import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

type CampaignSystem = "dnd2024" | "dnd5e" | "pathfinder2e" | "custom";

const SYSTEM_OPTIONS: {
  value: CampaignSystem;
  label: string;
  description: string;
}[] = [
  {
    value: "dnd2024",
    label: "D&D 2024",
    description: "Newest Dungeons & Dragons ruleset",
  },
  {
    value: "dnd5e",
    label: "D&D 5e",
    description: "Classic 5e / 2014-compatible campaigns",
  },
  {
    value: "pathfinder2e",
    label: "Pathfinder 2e",
    description: "Paizo’s tactical fantasy RPG",
  },
  {
    value: "custom",
    label: "Custom system",
    description: "For homebrew or unsupported systems",
  },
];

const NewCampaign = () => {
  const navigate = useNavigate();
  const { user, appUser } = useAuth();

  const [name, setName] = useState("");
  const [system, setSystem] = useState<CampaignSystem>("dnd2024");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedSystem = useMemo(
    () => SYSTEM_OPTIONS.find((option) => option.value === system),
    [system],
  );

  const canSubmit = name.trim().length >= 3 && !!user && !submitting;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be signed in to create a campaign.");
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (trimmedName.length < 3) {
      setError("Campaign name must be at least 3 characters long.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const campaignRef = doc(collection(db, "campaigns"));
      const memberRef = doc(
        db,
        "campaigns",
        campaignRef.id,
        "members",
        user.uid,
      );

      const batch = writeBatch(db);

      batch.set(campaignRef, {
        name: trimmedName,
        system,
        systemLabel: selectedSystem?.label ?? system,
        description: trimmedDescription,
        visibility: isPublic ? "public" : "private",
        ownerUid: user.uid,
        createdByUid: user.uid,
        createdByName:
          appUser?.displayName ?? user.displayName ?? "Unknown user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        archived: false,
      });

      batch.set(memberRef, {
        uid: user.uid,
        displayName: appUser?.displayName ?? user.displayName ?? "",
        email: user.email ?? "",
        role: "gm",
        inviteToken: null,
        joinedAt: serverTimestamp(),
      });

      await batch.commit();

      navigate(`/campaigns/${campaignRef.id}`);
    } catch (err) {
      console.error("Failed to create campaign:", err);
      setError("Something went wrong while creating the campaign.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to home
          </Link>
        </div>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 shadow-2xl sm:p-8">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
              Campaign setup
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Create a new campaign
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
              Set up your campaign shell first. You can add players, maps,
              monsters, items, notes, and secret GM information afterward.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="lg:col-span-2">
                <label
                  htmlFor="campaign-name"
                  className="mb-2 block text-sm font-medium text-zinc-200"
                >
                  Campaign name
                </label>

                <input
                  id="campaign-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lost Mine of Phandelver"
                  maxLength={80}
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:bg-zinc-900"
                />

                <p className="mt-2 text-xs text-zinc-500">
                  This is the name your players will see.
                </p>
              </div>

              <div className="lg:col-span-2">
                <span className="mb-2 block text-sm font-medium text-zinc-200">
                  Ruleset / system
                </span>

                <div className="grid gap-3 sm:grid-cols-2">
                  {SYSTEM_OPTIONS.map((option) => {
                    const isSelected = system === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`cursor-pointer rounded-2xl border p-4 transition ${
                          isSelected
                            ? "border-white/25 bg-white/10"
                            : "border-white/10 bg-zinc-900/70 hover:border-white/20 hover:bg-zinc-900"
                        }`}
                      >
                        <input
                          type="radio"
                          name="system"
                          value={option.value}
                          checked={isSelected}
                          onChange={() => setSystem(option.value)}
                          className="sr-only"
                        />

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {option.label}
                            </p>
                            <p className="mt-1 text-sm text-zinc-400">
                              {option.description}
                            </p>
                          </div>

                          <div
                            className={`mt-1 h-4 w-4 rounded-full border ${
                              isSelected
                                ? "border-white bg-white"
                                : "border-white/30 bg-transparent"
                            }`}
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="campaign-description"
                  className="mb-2 block text-sm font-medium text-zinc-200"
                >
                  Description
                </label>

                <textarea
                  id="campaign-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  maxLength={500}
                  placeholder="Write a short summary of the campaign, tone, world, or what the players should expect."
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:bg-zinc-900"
                />

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-zinc-500">
                    Optional. You can change this later.
                  </p>
                  <p className="text-xs text-zinc-500">
                    {description.length}/500
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-zinc-950 text-white"
                  />

                  <div>
                    <p className="text-sm font-medium text-white">
                      Allow campaign to be discoverable later
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Keep this off for now unless you want public/discoverable
                      campaigns in the future.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-500">
                You will be added as the GM automatically.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/"
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Creating campaign..." : "Create campaign"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default NewCampaign;
