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

  // Identity
  name: string;
  species?: string;
  occupation?: string;
  role?: string;
  imageUrl?: string;
  imageCropX?: number;
  imageCropY?: number;

  // Public
  publicDescription?: string;

  // Roleplay
  personality?: string[];
  voice?: string;
  mannerisms?: string[];

  // Drive
  wants?: string;
  fears?: string;

  // Knowledge
  knows?: string[];
  doesntKnow?: string[];

  // Deception
  claims?: string[];
  secretTruth?: string;

  // Reactions
  reactions?: string[];

  // Gameplay
  location?: string;
  relationships?: string[];
  clues?: string[];
  statBlock?: string;
  itemsLoot?: string[];

  // GM
  quickReference?: string;
  notes?: string;

  createdByUid?: string;
};

type NpcFormState = {
  name: string;
  species: string;
  occupation: string;
  role: string;
  imageUrl: string;

  publicDescription: string;

  personality: string;
  voice: string;
  mannerisms: string;

  wants: string;
  fears: string;

  knows: string;
  doesntKnow: string;

  claims: string;
  secretTruth: string;

  reactions: string;

  location: string;
  relationships: string;
  clues: string;
  statBlock: string;
  itemsLoot: string;

  quickReference: string;
  notes: string;
};

const createEmptyNpcForm = (): NpcFormState => ({
  name: "",
  species: "",
  occupation: "",
  role: "",
  imageUrl: "",

  publicDescription: "",

  personality: "",
  voice: "",
  mannerisms: "",

  wants: "",
  fears: "",

  knows: "",
  doesntKnow: "",

  claims: "",
  secretTruth: "",

  reactions: "",

  location: "",
  relationships: "",
  clues: "",
  statBlock: "",
  itemsLoot: "",

  quickReference: "",
  notes: "",
});

const parseList = (value: string): string[] =>
  value
    .split(/\n|,/g)
    .map((part) => part.trim())
    .filter(Boolean);

const inputClass =
  "rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500";

const textAreaClass =
  "rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500";

const Section = ({
  title,
  children,
  tone = "default",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "default" | "amber" | "violet";
}) => {
  const toneClass =
    tone === "amber"
      ? "border-amber-500/20 bg-amber-500/5"
      : tone === "violet"
        ? "border-violet-500/20 bg-violet-500/5"
        : "border-white/10 bg-black/10";

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <h3 className="mb-4 text-base font-semibold uppercase tracking-wide text-white">
        {title}
      </h3>
      {children}
    </div>
  );
};

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
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
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

        // Identity
        name: trimmedName,
        species: form.species.trim(),
        occupation: form.occupation.trim(),
        role: form.role.trim(),
        imageUrl: form.imageUrl.trim(),
        imageCropX: 50,
        imageCropY: 50,

        // Public
        publicDescription: form.publicDescription.trim(),

        // Roleplay
        personality: parseList(form.personality),
        voice: form.voice.trim(),
        mannerisms: parseList(form.mannerisms),

        // Drive
        wants: form.wants.trim(),
        fears: form.fears.trim(),

        // Knowledge
        knows: parseList(form.knows),
        doesntKnow: parseList(form.doesntKnow),

        // Deception
        claims: parseList(form.claims),
        secretTruth: form.secretTruth.trim(),

        // Reactions
        reactions: parseList(form.reactions),

        // Gameplay
        location: form.location.trim(),
        relationships: parseList(form.relationships),
        clues: parseList(form.clues),
        statBlock: form.statBlock.trim(),
        itemsLoot: parseList(form.itemsLoot),

        // GM
        quickReference: form.quickReference.trim(),
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
            Occupation / Title and Public Description are safe for players. Role
            and everything below Public are GM information.
          </p>

          <div className="space-y-6">
            <Section title="Identity">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Name *
                  </span>
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={inputClass}
                    placeholder="Elias"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Species
                  </span>
                  <input
                    value={form.species}
                    onChange={(e) => updateField("species", e.target.value)}
                    className={inputClass}
                    placeholder="Human"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Occupation / Title
                  </span>
                  <input
                    value={form.occupation}
                    onChange={(e) => updateField("occupation", e.target.value)}
                    className={inputClass}
                    placeholder="Wanderer, innkeeper, priest..."
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Role
                  </span>
                  <input
                    value={form.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    className={inputClass}
                    placeholder="Main antagonist / false ally"
                  />
                  <span className="text-xs text-zinc-500">GM-only.</span>
                </label>

                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Image URL
                  </span>
                  <input
                    value={form.imageUrl}
                    onChange={(e) => updateField("imageUrl", e.target.value)}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </label>
              </div>
            </Section>

            <Section title="Public">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">
                  Description
                </span>
                <textarea
                  value={form.publicDescription}
                  onChange={(e) =>
                    updateField("publicDescription", e.target.value)
                  }
                  rows={5}
                  className={textAreaClass}
                  placeholder="What the players can safely see, hear, or know..."
                />
              </label>
            </Section>

            <Section title="Roleplay">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Personality
                  </span>
                  <textarea
                    value={form.personality}
                    onChange={(e) => updateField("personality", e.target.value)}
                    rows={4}
                    className={textAreaClass}
                    placeholder={`Warm\nHumble\nPatient`}
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
                    rows={4}
                    className={textAreaClass}
                    placeholder="Soft voice. Listens before answering."
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Mannerisms
                  </span>
                  <textarea
                    value={form.mannerisms}
                    onChange={(e) => updateField("mannerisms", e.target.value)}
                    rows={4}
                    className={textAreaClass}
                    placeholder={`Holds eye contact too long\nSmiles after difficult questions`}
                  />
                </label>
              </div>
            </Section>

            <Section title="Drive">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Wants
                  </span>
                  <textarea
                    value={form.wants}
                    onChange={(e) => updateField("wants", e.target.value)}
                    rows={4}
                    className={textAreaClass}
                    placeholder="Get the players to collect the artifacts."
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Fears
                  </span>
                  <textarea
                    value={form.fears}
                    onChange={(e) => updateField("fears", e.target.value)}
                    rows={4}
                    className={textAreaClass}
                    placeholder="That they discover the truth about the mark / well."
                  />
                </label>
              </div>
            </Section>

            <Section title="Knowledge">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Knows
                  </span>
                  <textarea
                    value={form.knows}
                    onChange={(e) => updateField("knows", e.target.value)}
                    rows={5}
                    className={textAreaClass}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Doesn&apos;t Know
                  </span>
                  <textarea
                    value={form.doesntKnow}
                    onChange={(e) => updateField("doesntKnow", e.target.value)}
                    rows={5}
                    className={textAreaClass}
                  />
                </label>
              </div>
            </Section>

            <Section title="Deception" tone="amber">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Claims
                  </span>
                  <textarea
                    value={form.claims}
                    onChange={(e) => updateField("claims", e.target.value)}
                    rows={5}
                    className={textAreaClass}
                    placeholder={`Silas is a tyrant\nThe White Gate kills anyone who enters`}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Secret / Truth
                  </span>
                  <textarea
                    value={form.secretTruth}
                    onChange={(e) => updateField("secretTruth", e.target.value)}
                    rows={5}
                    className={textAreaClass}
                    placeholder="The artifacts will free him."
                  />
                </label>
              </div>
            </Section>

            <Section title="Reactions">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">
                  Triggers / Reactions
                </span>
                <textarea
                  value={form.reactions}
                  onChange={(e) => updateField("reactions", e.target.value)}
                  rows={6}
                  className={textAreaClass}
                  placeholder={`If Silas is mentioned, becomes tense\nIf challenged, acts hurt rather than angry`}
                />
              </label>
            </Section>

            <Section title="Gameplay">
              <div className="space-y-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Location
                  </span>
                  <input
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className={inputClass}
                    placeholder="Inn, village, Black Tower..."
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-zinc-300">
                      Relationships
                    </span>
                    <textarea
                      value={form.relationships}
                      onChange={(e) =>
                        updateField("relationships", e.target.value)
                      }
                      rows={5}
                      className={textAreaClass}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-zinc-300">
                      Clues
                    </span>
                    <textarea
                      value={form.clues}
                      onChange={(e) => updateField("clues", e.target.value)}
                      rows={5}
                      className={textAreaClass}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-zinc-300">
                      Stat Block
                    </span>
                    <textarea
                      value={form.statBlock}
                      onChange={(e) => updateField("statBlock", e.target.value)}
                      rows={5}
                      className={textAreaClass}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-zinc-300">
                      Items / Loot
                    </span>
                    <textarea
                      value={form.itemsLoot}
                      onChange={(e) => updateField("itemsLoot", e.target.value)}
                      rows={5}
                      className={textAreaClass}
                      placeholder="Optional"
                    />
                  </label>
                </div>
              </div>
            </Section>

            <Section title="GM" tone="violet">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Quick Reference
                  </span>
                  <textarea
                    value={form.quickReference}
                    onChange={(e) =>
                      updateField("quickReference", e.target.value)
                    }
                    rows={6}
                    className={textAreaClass}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Notes
                  </span>
                  <textarea
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    rows={6}
                    className={textAreaClass}
                  />
                </label>
              </div>
            </Section>
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
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold text-white">
                        {npc.name || "Unnamed NPC"}
                      </h2>

                      <p className="mt-1 truncate text-sm italic text-zinc-400">
                        {[npc.species, npc.occupation]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm leading-5">
                    {npc.role ? (
                      <p className="text-zinc-300">
                        <span className="font-semibold text-white">Role:</span>{" "}
                        {npc.role}
                      </p>
                    ) : null}

                    {npc.personality && npc.personality.length > 0 ? (
                      <p className="text-zinc-300">
                        <span className="font-semibold text-white">
                          🎭 Play:
                        </span>{" "}
                        {npc.personality.slice(0, 3).join(" · ")}
                      </p>
                    ) : null}

                    {npc.wants ? (
                      <p className="line-clamp-2 text-zinc-300">
                        <span className="font-semibold text-white">
                          🎯 Wants:
                        </span>{" "}
                        {npc.wants}
                      </p>
                    ) : npc.quickReference ? (
                      <p className="line-clamp-2 whitespace-pre-wrap text-zinc-400">
                        {npc.quickReference}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
