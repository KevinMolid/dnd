import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import Container from "../components/Container";
import H1 from "../components/H1";
import { db } from "../firebase";

type CampaignNpc = {
  id: string;
  campaignId?: string;
  name?: string;
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
  imageCropX: number;
  imageCropY: number;

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

const createEmptyForm = (): NpcFormState => ({
  name: "",
  species: "",
  role: "",
  imageUrl: "",
  imageCropX: 50,
  imageCropY: 50,

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

const toMultiline = (value?: string[]) => (value ?? []).join("\n");

const parseList = (value: string): string[] =>
  value
    .split(/\n|,/g)
    .map((line) => line.trim())
    .filter(Boolean);

const clampPercentage = (value: number) => Math.max(0, Math.min(100, value));

const mapNpcToForm = (npc: CampaignNpc | null): NpcFormState => ({
  name: npc?.name ?? "",
  species: npc?.species ?? "",
  role: npc?.role ?? "",
  imageUrl: npc?.imageUrl ?? "",
  imageCropX: clampPercentage(npc?.imageCropX ?? 50),
  imageCropY: clampPercentage(npc?.imageCropY ?? 50),

  publicDescription: npc?.publicDescription ?? "",
  physicalDescription: npc?.physicalDescription ?? "",
  alignment: npc?.alignment ?? "",

  personality: toMultiline(npc?.personality),
  voice: npc?.voice ?? "",
  quirks: toMultiline(npc?.quirks),

  motivation: npc?.motivation ?? "",
  goals: toMultiline(npc?.goals),

  secret: npc?.secret ?? "",
  truth: npc?.truth ?? "",
  notes: npc?.notes ?? "",
});

const RenderList = ({
  items,
  fallback = "—",
}: {
  items?: string[];
  fallback?: string;
}) => {
  if (!items || items.length === 0) {
    return <span>{fallback}</span>;
  }

  return (
    <ul className="list-disc space-y-1 pl-5 text-white">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
};

export default function NpcDetailPage() {
  const { campaignId, npcId } = useParams<{
    campaignId: string;
    npcId: string;
  }>();
  const navigate = useNavigate();

  const [npc, setNpc] = useState<CampaignNpc | null>(null);
  const [form, setForm] = useState<NpcFormState>(createEmptyForm());
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!campaignId || !npcId) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const npcRef = doc(db, "campaigns", campaignId, "npcs", npcId);

    const unsubscribe = onSnapshot(
      npcRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setNpc(null);
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = snapshot.data() as Omit<CampaignNpc, "id">;
        const nextNpc: CampaignNpc = {
          id: snapshot.id,
          ...data,
        };

        setNpc(nextNpc);
        setForm((prev) => {
          if (editing) return prev;
          return mapNpcToForm(nextNpc);
        });
        setNotFound(false);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to load NPC.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [campaignId, npcId, editing]);

  const subtitle = useMemo(() => {
    const primary = [npc?.species, npc?.role].filter(Boolean).join(" • ");
    if (primary && npc?.alignment) {
      return `${primary} • ${npc.alignment}`;
    }
    return primary || npc?.alignment || "";
  }, [npc?.species, npc?.role, npc?.alignment]);

  const updateField = (key: keyof NpcFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateNumberField = (
    key: "imageCropX" | "imageCropY",
    value: number,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: clampPercentage(value),
    }));
  };

  const handlePortraitFocusClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setForm((prev) => ({
      ...prev,
      imageCropX: clampPercentage(x),
      imageCropY: clampPercentage(y),
    }));
  };

  const handleStartEditing = () => {
    setForm(mapNpcToForm(npc));
    setEditing(true);
    setError(null);
  };

  const handleCancelEditing = () => {
    setForm(mapNpcToForm(npc));
    setEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!campaignId || !npcId || !npc) return;

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateDoc(doc(db, "campaigns", campaignId, "npcs", npcId), {
        campaignId,
        name: trimmedName,
        species: form.species.trim(),
        role: form.role.trim(),
        imageUrl: form.imageUrl.trim(),
        imageCropX: clampPercentage(form.imageCropX),
        imageCropY: clampPercentage(form.imageCropY),

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

        updatedAt: serverTimestamp(),
      });

      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("Failed to save NPC changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!campaignId || !npcId || !npc) return;

    const confirmed = window.confirm(
      `Delete "${npc.name || "this NPC"}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteDoc(doc(db, "campaigns", campaignId, "npcs", npcId));
      navigate(`/campaigns/${campaignId}/npcs`);
    } catch (err) {
      console.error(err);
      setError("Failed to delete NPC.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <p className="text-sm text-zinc-400">Loading NPC...</p>
      </Container>
    );
  }

  if (notFound) {
    return (
      <Container>
        <div className="mb-4">
          <Link
            to={campaignId ? `/campaigns/${campaignId}/npcs` : "/campaigns"}
            className="text-sm text-zinc-400 hover:text-white"
          >
            ← Back to NPCs
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <H1>NPC not found</H1>
          <p className="mt-3 text-sm text-zinc-400">
            This NPC does not exist or you do not have access to it.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex flex-wrap gap-3 text-sm text-zinc-400">
            <Link
              to={campaignId ? `/campaigns/${campaignId}` : "/campaigns"}
              className="hover:text-white"
            >
              Campaign
            </Link>
            <span>/</span>
            <Link
              to={campaignId ? `/campaigns/${campaignId}/npcs` : "/campaigns"}
              className="hover:text-white"
            >
              NPCs
            </Link>
          </div>

          <H1>{editing ? "Edit NPC" : npc?.name || "Unnamed NPC"}</H1>

          {!editing ? (
            <p className="mt-2 text-sm text-zinc-400">
              {subtitle || "No species, role, or alignment set yet."}
            </p>
          ) : (
            <p className="mt-2 text-sm text-zinc-400">
              Update the NPC&apos;s table-facing roleplay tools and hidden GM
              information.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {!editing ? (
            <>
              <button
                type="button"
                onClick={handleStartEditing}
                className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Edit NPC
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button
                type="button"
                onClick={handleCancelEditing}
                disabled={saving}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-white">Portrait</h2>

            {editing ? (
              <div className="space-y-4">
                <label className="flex flex-col gap-2">
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

                {form.imageUrl ? (
                  <>
                    <div>
                      <p className="mb-2 text-sm font-medium text-zinc-300">
                        Portrait focus
                      </p>
                      <p className="mb-3 text-xs text-zinc-500">
                        Click the preview to choose which part of the image
                        should stay centered in portrait crops.
                      </p>

                      <div
                        className="relative aspect-[16/9] cursor-crosshair overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                        onClick={handlePortraitFocusClick}
                        role="button"
                        tabIndex={0}
                      >
                        <img
                          src={form.imageUrl}
                          alt="Portrait focus preview"
                          className="h-full w-full object-cover"
                          style={{
                            objectPosition: `${form.imageCropX}% ${form.imageCropY}%`,
                          }}
                        />

                        <div
                          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white/30 shadow"
                          style={{
                            left: `${form.imageCropX}%`,
                            top: `${form.imageCropY}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-zinc-300">
                          Horizontal focus
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={form.imageCropX}
                          onChange={(e) =>
                            updateNumberField(
                              "imageCropX",
                              Number(e.target.value),
                            )
                          }
                          className="w-full"
                        />
                        <span className="text-xs text-zinc-500">
                          {Math.round(form.imageCropX)}%
                        </span>
                      </label>

                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-zinc-300">
                          Vertical focus
                        </span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={form.imageCropY}
                          onChange={(e) =>
                            updateNumberField(
                              "imageCropY",
                              Number(e.target.value),
                            )
                          }
                          className="w-full"
                        />
                        <span className="text-xs text-zinc-500">
                          {Math.round(form.imageCropY)}%
                        </span>
                      </label>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-medium text-zinc-300">
                        Card preview
                      </p>
                      <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                        <img
                          src={form.imageUrl}
                          alt="Card crop preview"
                          className="h-full w-full object-cover"
                          style={{
                            objectPosition: `${form.imageCropX}% ${form.imageCropY}%`,
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 text-sm text-zinc-500">
                    Add an image URL to preview and set portrait focus
                  </div>
                )}
              </div>
            ) : npc?.imageUrl ? (
              <img
                src={npc.imageUrl}
                alt={npc.name || "NPC portrait"}
                className="w-full rounded-2xl border border-white/10 object-cover"
                style={{
                  objectPosition: `${npc.imageCropX ?? 50}% ${npc.imageCropY ?? 50}%`,
                }}
              />
            ) : (
              <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 text-sm text-zinc-500">
                No portrait yet
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-white">Identity</h2>

            <div className="space-y-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">Name</span>
                {editing ? (
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="NPC name"
                  />
                ) : (
                  <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-white">
                    {npc?.name || "—"}
                  </div>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">
                  Species
                </span>
                {editing ? (
                  <input
                    value={form.species}
                    onChange={(e) => updateField("species", e.target.value)}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Human, Elf, Tiefling..."
                  />
                ) : (
                  <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-white">
                    {npc?.species || "—"}
                  </div>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">Role</span>
                {editing ? (
                  <input
                    value={form.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Innkeeper, guard captain, priest..."
                  />
                ) : (
                  <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-white">
                    {npc?.role || "—"}
                  </div>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">
                  Alignment
                </span>
                {editing ? (
                  <input
                    value={form.alignment}
                    onChange={(e) => updateField("alignment", e.target.value)}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Neutral Good"
                  />
                ) : (
                  <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-white">
                    {npc?.alignment || "—"}
                  </div>
                )}
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-white">Roleplay</h2>

            <div className="space-y-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">
                  Personality
                </span>
                {editing ? (
                  <>
                    <textarea
                      value={form.personality}
                      onChange={(e) =>
                        updateField("personality", e.target.value)
                      }
                      rows={4}
                      className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                      placeholder={`Calm and controlled\nPatient\nSmiles during violence`}
                    />
                    <span className="text-xs text-zinc-500">One per line.</span>
                  </>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-white">
                    <RenderList items={npc?.personality} />
                  </div>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">Voice</span>
                {editing ? (
                  <textarea
                    value={form.voice}
                    onChange={(e) => updateField("voice", e.target.value)}
                    rows={4}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Quiet, hesitant, avoids eye contact..."
                  />
                ) : (
                  <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 whitespace-pre-wrap text-white">
                    {npc?.voice || "—"}
                  </div>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">
                  Quirks
                </span>
                {editing ? (
                  <>
                    <textarea
                      value={form.quirks}
                      onChange={(e) => updateField("quirks", e.target.value)}
                      rows={4}
                      className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                      placeholder={`Avoids eye contact\nSmiles during violence\nRepeats questions`}
                    />
                    <span className="text-xs text-zinc-500">One per line.</span>
                  </>
                ) : (
                  <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-white">
                    <RenderList items={npc?.quirks} />
                  </div>
                )}
              </label>
            </div>
          </section>
        </aside>

        <main className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Public information
              </h2>
            </div>

            <div className="space-y-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">
                  Description
                </span>
                {editing ? (
                  <textarea
                    value={form.publicDescription}
                    onChange={(e) =>
                      updateField("publicDescription", e.target.value)
                    }
                    rows={5}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="What the players immediately see or can easily learn..."
                  />
                ) : npc?.publicDescription ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-6 whitespace-pre-wrap text-zinc-200">
                    {npc.publicDescription}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-3 text-sm italic text-zinc-500">
                    No public description yet.
                  </div>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">
                  Physical characterization
                </span>
                {editing ? (
                  <textarea
                    value={form.physicalDescription}
                    onChange={(e) =>
                      updateField("physicalDescription", e.target.value)
                    }
                    rows={5}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Tall, tired eyes, stained gloves..."
                  />
                ) : npc?.physicalDescription ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-6 whitespace-pre-wrap text-zinc-200">
                    {npc.physicalDescription}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-3 text-sm italic text-zinc-500">
                    No physical characterization yet.
                  </div>
                )}
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Motivation and goals
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                The most important information for running the NPC under
                pressure.
              </p>
            </div>

            <div className="space-y-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">
                  Motivation
                </span>
                {editing ? (
                  <textarea
                    value={form.motivation}
                    onChange={(e) => updateField("motivation", e.target.value)}
                    rows={4}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Protect her son at all costs..."
                  />
                ) : npc?.motivation ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-6 whitespace-pre-wrap text-zinc-200">
                    {npc.motivation}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-3 text-sm italic text-zinc-500">
                    No motivation set yet.
                  </div>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">Goals</span>
                {editing ? (
                  <>
                    <textarea
                      value={form.goals}
                      onChange={(e) => updateField("goals", e.target.value)}
                      rows={4}
                      className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                      placeholder={`Convince the player\nComplete the ritual\nCreate a family`}
                    />
                    <span className="text-xs text-zinc-500">One per line.</span>
                  </>
                ) : npc?.goals && npc.goals.length > 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-6 text-zinc-200">
                    <RenderList items={npc.goals} />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-3 text-sm italic text-zinc-500">
                    No goals set yet.
                  </div>
                )}
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5 shadow-xl">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">Hidden truth</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Private GM information: secrets, motives, lies, hidden agendas,
                and what is actually true.
              </p>
            </div>

            <div className="space-y-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">
                  Secret
                </span>
                {editing ? (
                  <textarea
                    value={form.secret}
                    onChange={(e) => updateField("secret", e.target.value)}
                    rows={4}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="She knows exactly what happened that night..."
                  />
                ) : npc?.secret ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-6 whitespace-pre-wrap text-zinc-200">
                    {npc.secret}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-3 text-sm italic text-zinc-500">
                    No secret yet.
                  </div>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">Truth</span>
                {editing ? (
                  <textarea
                    value={form.truth}
                    onChange={(e) => updateField("truth", e.target.value)}
                    rows={5}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="What is actually going on beneath the surface?"
                  />
                ) : npc?.truth ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-6 whitespace-pre-wrap text-zinc-200">
                    {npc.truth}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-3 text-sm italic text-zinc-500">
                    No truth section yet.
                  </div>
                )}
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-zinc-300">
                  GM notes
                </span>
                {editing ? (
                  <textarea
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    rows={8}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500"
                    placeholder="Extra prep notes, scene ideas, reveals, encounter use, relationships..."
                  />
                ) : npc?.notes ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-6 whitespace-pre-wrap text-zinc-200">
                    {npc.notes}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-3 text-sm italic text-zinc-500">
                    No GM notes yet.
                  </div>
                )}
              </label>
            </div>
          </section>
        </main>
      </div>
    </Container>
  );
}
