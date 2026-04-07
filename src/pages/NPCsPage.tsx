import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import Container from "../components/Container";
import H1 from "../components/H1";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

type CampaignNpc = {
  id: string;
  campaignId?: string;
  name: string;
  species?: string;
  role?: string;
  imageUrl?: string;

  imageCropX?: number;
  imageCropY?: number;

  publicDescription?: string;
  physicalDescription?: string;
  alignment?: string;

  personality?: string[];
  voice?: string;
  quirks?: string[];

  motivation?: string;
  goals?: string[];

  secret?: string;
  truth?: string;
  notes?: string;

  createdByUid?: string;
};

type NpcFormState = {
  name: string;
  species: string;
  role: string;
  imageUrl: string;

  publicDescription: string;
  physicalDescription: string;
  alignment: string;

  personality: string;
  voice: string;
  quirks: string;

  motivation: string;
  goals: string;

  secret: string;
  truth: string;
  notes: string;
};

const createEmptyNpcForm = (): NpcFormState => ({
  name: "",
  species: "",
  role: "",
  imageUrl: "",

  publicDescription: "",
  physicalDescription: "",
  alignment: "",

  personality: "",
  voice: "",
  quirks: "",

  motivation: "",
  goals: "",

  secret: "",
  truth: "",
  notes: "",
});

const parseList = (value: string): string[] =>
  value
    .split(/\n|,/g)
    .map((part) => part.trim())
    .filter(Boolean);

export default function NPCsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();

  const [npcs, setNpcs] = useState<CampaignNpc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NpcFormState>(createEmptyNpcForm());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) return;

    const npcsRef = collection(db, "campaigns", campaignId, "npcs");
    const q = query(npcsRef, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const next: CampaignNpc[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Omit<CampaignNpc, "id">;
        return {
          id: docSnap.id,
          ...data,
        };
      });

      setNpcs(next);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [campaignId]);

  const sortedNpcs = useMemo(
    () =>
      [...npcs].sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", undefined, {
          sensitivity: "base",
        }),
      ),
    [npcs],
  );

  const updateField = (key: keyof NpcFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateNpc = async () => {
    if (!campaignId || !user) return;

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await addDoc(collection(db, "campaigns", campaignId, "npcs"), {
        campaignId,
        name: trimmedName,
        species: form.species.trim(),
        role: form.role.trim(),
        imageUrl: form.imageUrl.trim(),

        imageCropX: 50,
        imageCropY: 50,

        publicDescription: form.publicDescription.trim(),
        physicalDescription: form.physicalDescription.trim(),
        alignment: form.alignment.trim(),

        personality: parseList(form.personality),
        voice: form.voice.trim(),
        quirks: parseList(form.quirks),

        motivation: form.motivation.trim(),
        goals: parseList(form.goals),

        secret: form.secret.trim(),
        truth: form.truth.trim(),
        notes: form.notes.trim(),

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdByUid: user.uid,
      });

      setForm(createEmptyNpcForm());
      setShowCreateForm(false);
    } catch (err) {
      console.error(err);
      setError("Failed to create NPC.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-2">
            <Link
              to={campaignId ? `/campaigns/${campaignId}` : "/campaigns"}
              className="text-sm text-zinc-400 hover:text-white"
            >
              ← Back to campaign
            </Link>
          </div>
          <H1>NPCs</H1>
          <p className="mt-2 text-sm text-zinc-400">
            Create and manage non-player characters for this campaign.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowCreateForm((prev) => !prev);
            setError(null);
          }}
          className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
        >
          {showCreateForm ? "Close" : "Create NPC"}
        </button>
      </div>

      {showCreateForm && (
        <section className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
          <h2 className="mb-2 text-lg font-semibold text-white">New NPC</h2>
          <p className="mb-5 text-sm text-zinc-400">
            Focus on the traits that make the NPC easy to run at the table: who
            they are, how they feel, what they want, and what they hide.
          </p>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <h3 className="mb-4 text-base font-semibold text-white">
                Identity
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Name *
                  </span>
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Isolde Marr"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Species
                  </span>
                  <input
                    value={form.species}
                    onChange={(e) => updateField("species", e.target.value)}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Human"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Role
                  </span>
                  <input
                    value={form.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Innkeeper"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Alignment
                  </span>
                  <input
                    value={form.alignment}
                    onChange={(e) => updateField("alignment", e.target.value)}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Neutral Good"
                  />
                </label>

                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Image URL
                  </span>
                  <input
                    value={form.imageUrl}
                    onChange={(e) => updateField("imageUrl", e.target.value)}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="https://..."
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <h3 className="mb-4 text-base font-semibold text-white">
                Public / player-facing
              </h3>

              <div className="grid gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Public description
                  </span>
                  <textarea
                    value={form.publicDescription}
                    onChange={(e) =>
                      updateField("publicDescription", e.target.value)
                    }
                    rows={3}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="What the players immediately see or can easily learn..."
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Physical characterization
                  </span>
                  <textarea
                    value={form.physicalDescription}
                    onChange={(e) =>
                      updateField("physicalDescription", e.target.value)
                    }
                    rows={3}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Tall, tired eyes, stained gloves, always smells faintly of smoke..."
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <h3 className="mb-4 text-base font-semibold text-white">
                Roleplay core
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Personality
                  </span>
                  <textarea
                    value={form.personality}
                    onChange={(e) => updateField("personality", e.target.value)}
                    rows={3}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder={`nervous\npolite\nevasive`}
                  />
                  <span className="text-xs text-zinc-500">
                    One per line. Commas also work.
                  </span>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Voice
                  </span>
                  <textarea
                    value={form.voice}
                    onChange={(e) => updateField("voice", e.target.value)}
                    rows={3}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Quiet, hesitant, avoids eye contact, speaks in short sentences..."
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Quirks
                  </span>
                  <textarea
                    value={form.quirks}
                    onChange={(e) => updateField("quirks", e.target.value)}
                    rows={3}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder={`fidgets with ring\nrepeats questions\nnever says names first`}
                  />
                  <span className="text-xs text-zinc-500">
                    One per line. Commas also work.
                  </span>
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <h3 className="mb-4 text-base font-semibold text-white">
                Motivation and goals
              </h3>

              <div className="grid gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Motivation
                  </span>
                  <textarea
                    value={form.motivation}
                    onChange={(e) => updateField("motivation", e.target.value)}
                    rows={3}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Protect her son at all costs. Keep suspicion away from the cellar."
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Goals
                  </span>
                  <textarea
                    value={form.goals}
                    onChange={(e) => updateField("goals", e.target.value)}
                    rows={3}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder={`keep the inn running\navoid the hunter\nhide the body`}
                  />
                  <span className="text-xs text-zinc-500">
                    One per line. Commas also work.
                  </span>
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <h3 className="mb-4 text-base font-semibold text-white">
                Hidden truth
              </h3>

              <div className="grid gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Secret
                  </span>
                  <textarea
                    value={form.secret}
                    onChange={(e) => updateField("secret", e.target.value)}
                    rows={3}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="She knows exactly what happened that night, but will deny it."
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Truth
                  </span>
                  <textarea
                    value={form.truth}
                    onChange={(e) => updateField("truth", e.target.value)}
                    rows={4}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="What is actually going on with this NPC beneath the surface?"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    GM notes
                  </span>
                  <textarea
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    rows={5}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Extra prep notes, scene ideas, reveals, encounter use, relationships..."
                  />
                </label>
              </div>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCreateNpc}
              disabled={saving}
              className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Creating..." : "Save NPC"}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm(createEmptyNpcForm());
                setShowCreateForm(false);
                setError(null);
              }}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
        {loading ? (
          <p className="text-sm text-zinc-400">Loading NPCs...</p>
        ) : sortedNpcs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-6 text-center">
            <p className="text-sm text-zinc-400">
              No NPCs yet. Create your first NPC to start building the campaign
              cast.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedNpcs.map((npc) => (
              <Link
                key={npc.id}
                to={`/campaigns/${campaignId}/npcs/${npc.id}`}
                className="block overflow-hidden rounded-2xl border border-white/10 bg-black/10 transition hover:bg-black/20"
              >
                {npc.imageUrl ? (
                  <div className="aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-black/20">
                    <img
                      src={npc.imageUrl}
                      alt={npc.name || "NPC portrait"}
                      className="h-full w-full object-cover"
                      style={{
                        objectPosition: `${npc.imageCropX ?? 50}% ${npc.imageCropY ?? 50}%`,
                      }}
                    />
                  </div>
                ) : null}

                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {npc.name || "Unnamed NPC"}
                      </h2>
                      <p className="text-sm text-zinc-400">
                        {[npc.species, npc.role].filter(Boolean).join(" • ") ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  {npc.personality && npc.personality.length > 0 ? (
                    <p className="mb-2 text-sm text-zinc-300">
                      <span className="font-medium text-zinc-200">
                        Personality:
                      </span>{" "}
                      {npc.personality.join(", ")}
                    </p>
                  ) : null}

                  {npc.motivation ? (
                    <p className="mb-2 text-sm leading-6 text-zinc-300">
                      <span className="font-medium text-zinc-200">
                        Motivation:
                      </span>{" "}
                      {npc.motivation}
                    </p>
                  ) : npc.publicDescription ? (
                    <p className="mb-2 text-sm leading-6 text-zinc-300">
                      {npc.publicDescription}
                    </p>
                  ) : (
                    <p className="mb-2 text-sm italic text-zinc-500">
                      No summary yet.
                    </p>
                  )}

                  {npc.voice ? (
                    <p className="text-xs text-zinc-500">
                      <span className="font-medium text-zinc-400">Voice:</span>{" "}
                      {npc.voice}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
