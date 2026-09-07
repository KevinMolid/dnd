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

type ViewMode = "player" | "gm";

type DetailTab =
  | "knowledge"
  | "claims"
  | "reactions"
  | "gameplay"
  | "stats"
  | "notes";

type CampaignNpc = {
  id: string;
  campaignId?: string;

  // Identity
  name?: string;
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
  imageCropX: number;
  imageCropY: number;

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

const createEmptyForm = (): NpcFormState => ({
  name: "",
  species: "",
  occupation: "",
  role: "",
  imageUrl: "",
  imageCropX: 50,
  imageCropY: 50,

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
  occupation: npc?.occupation ?? "",
  role: npc?.role ?? "",
  imageUrl: npc?.imageUrl ?? "",
  imageCropX: clampPercentage(npc?.imageCropX ?? 50),
  imageCropY: clampPercentage(npc?.imageCropY ?? 50),

  publicDescription: npc?.publicDescription ?? "",

  personality: toMultiline(npc?.personality),
  voice: npc?.voice ?? "",
  mannerisms: toMultiline(npc?.mannerisms),

  wants: npc?.wants ?? "",
  fears: npc?.fears ?? "",

  knows: toMultiline(npc?.knows),
  doesntKnow: toMultiline(npc?.doesntKnow),

  claims: toMultiline(npc?.claims),
  secretTruth: npc?.secretTruth ?? "",

  reactions: toMultiline(npc?.reactions),

  location: npc?.location ?? "",
  relationships: toMultiline(npc?.relationships),
  clues: toMultiline(npc?.clues),
  statBlock: npc?.statBlock ?? "",
  itemsLoot: toMultiline(npc?.itemsLoot),

  quickReference: npc?.quickReference ?? "",
  notes: npc?.notes ?? "",
});

const inputClass =
  "rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500";

const textAreaClass =
  "rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500";

const sectionClass =
  "rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl";

const hasText = (value?: string) => Boolean(value?.trim());
const hasList = (value?: string[]) => Boolean(value && value.length > 0);

const RenderList = ({ items }: { items?: string[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
};

const EditStringField = ({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-sm font-medium text-zinc-300">{label}</span>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={textAreaClass}
    />
  </label>
);

const EditListField = ({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-sm font-medium text-zinc-300">{label}</span>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={textAreaClass}
    />
    <span className="text-xs text-zinc-500">
      One entry per line. Commas also work.
    </span>
  </label>
);

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
  const [viewMode, setViewMode] = useState<ViewMode>("gm");
  const [activeTab, setActiveTab] = useState<DetailTab | null>(null);
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

  const publicSubtitle = useMemo(
    () => [npc?.species, npc?.occupation].filter(Boolean).join(" · "),
    [npc?.species, npc?.occupation],
  );

  const updateField = (key: keyof NpcFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
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

        // Identity
        name: trimmedName,
        species: form.species.trim(),
        occupation: form.occupation.trim(),
        role: form.role.trim(),
        imageUrl: form.imageUrl.trim(),
        imageCropX: clampPercentage(form.imageCropX),
        imageCropY: clampPercentage(form.imageCropY),

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
        </div>
      </Container>
    );
  }

  const tabs: {
    id: DetailTab;
    label: string;
    visible: boolean;
  }[] = [
    {
      id: "knowledge",
      label: "Knowledge",
      visible: hasList(npc?.knows) || hasList(npc?.doesntKnow),
    },
    {
      id: "claims",
      label: "Claims",
      visible: hasList(npc?.claims),
    },
    {
      id: "reactions",
      label: "Reactions",
      visible: hasList(npc?.reactions),
    },
    {
      id: "gameplay",
      label: "Gameplay",
      visible:
        hasText(npc?.location) ||
        hasList(npc?.relationships) ||
        hasList(npc?.clues) ||
        hasList(npc?.itemsLoot),
    },
    {
      id: "stats",
      label: "Stats",
      visible: hasText(npc?.statBlock),
    },
    {
      id: "notes",
      label: "Notes",
      visible: hasText(npc?.notes),
    },
  ];

  const visibleTabs = tabs.filter((tab) => tab.visible);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "knowledge":
        return (
          <div className="grid gap-6 md:grid-cols-2">
            {hasList(npc?.knows) ? (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Knows
                </div>
                <RenderList items={npc?.knows} />
              </div>
            ) : null}

            {hasList(npc?.doesntKnow) ? (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Doesn&apos;t Know
                </div>
                <RenderList items={npc?.doesntKnow} />
              </div>
            ) : null}
          </div>
        );

      case "claims":
        return <RenderList items={npc?.claims} />;

      case "reactions":
        return (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Triggers / Reactions
            </div>
            <RenderList items={npc?.reactions} />
          </div>
        );

      case "gameplay":
        return (
          <div className="grid gap-6 md:grid-cols-2">
            {hasText(npc?.location) ? (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Location
                </div>
                <div className="whitespace-pre-wrap">{npc?.location}</div>
              </div>
            ) : null}

            {hasList(npc?.relationships) ? (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Relationships
                </div>
                <RenderList items={npc?.relationships} />
              </div>
            ) : null}

            {hasList(npc?.clues) ? (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Clues
                </div>
                <RenderList items={npc?.clues} />
              </div>
            ) : null}

            {hasList(npc?.itemsLoot) ? (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Items / Loot
                </div>
                <RenderList items={npc?.itemsLoot} />
              </div>
            ) : null}
          </div>
        );

      case "stats":
        return <div className="whitespace-pre-wrap">{npc?.statBlock}</div>;

      case "notes":
        return <div className="whitespace-pre-wrap">{npc?.notes}</div>;

      default:
        return null;
    }
  };

  return (
    <Container>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <Link
          to={campaignId ? `/campaigns/${campaignId}/npcs` : "/campaigns"}
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← NPCs
        </Link>

        <div className="flex flex-wrap gap-2">
          {!editing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setViewMode("player");
                  setActiveTab(null);
                }}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  viewMode === "player"
                    ? "border-white/20 bg-white/15 text-white"
                    : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                }`}
              >
                Player View
              </button>

              <button
                type="button"
                onClick={() => setViewMode("gm")}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  viewMode === "gm"
                    ? "border-white/20 bg-white/15 text-white"
                    : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                }`}
              >
                GM View
              </button>

              <button
                type="button"
                onClick={handleStartEditing}
                className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-60"
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
                className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={handleCancelEditing}
                disabled={saving}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {error ? (
        <div className="mb-5 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {editing ? (
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className={sectionClass}>
              <h2 className="mb-4 text-lg font-semibold text-white">
                Identity
              </h2>

              <div className="space-y-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Name
                  </span>
                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={inputClass}
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
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Image URL
                  </span>
                  <input
                    value={form.imageUrl}
                    onChange={(e) => updateField("imageUrl", e.target.value)}
                    className={inputClass}
                  />
                </label>

                {form.imageUrl ? (
                  <>
                    <div
                      className="relative aspect-[16/9] cursor-crosshair overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                      onClick={handlePortraitFocusClick}
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
                        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white/30"
                        style={{
                          left: `${form.imageCropX}%`,
                          top: `${form.imageCropY}%`,
                        }}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={form.imageCropX}
                        onChange={(e) =>
                          updateNumberField(
                            "imageCropX",
                            Number(e.target.value),
                          )
                        }
                      />
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={form.imageCropY}
                        onChange={(e) =>
                          updateNumberField(
                            "imageCropY",
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </section>

            <section className={sectionClass}>
              <h2 className="mb-4 text-lg font-semibold text-white">
                Roleplay
              </h2>

              <div className="space-y-4">
                <EditListField
                  label="Personality"
                  value={form.personality}
                  onChange={(value) => updateField("personality", value)}
                />

                <EditStringField
                  label="Voice"
                  value={form.voice}
                  onChange={(value) => updateField("voice", value)}
                />

                <EditListField
                  label="Mannerisms"
                  value={form.mannerisms}
                  onChange={(value) => updateField("mannerisms", value)}
                />
              </div>
            </section>
          </aside>

          <main className="space-y-6">
            <section className={sectionClass}>
              <h2 className="mb-4 text-lg font-semibold text-white">Public</h2>
              <EditStringField
                label="Description"
                value={form.publicDescription}
                onChange={(value) => updateField("publicDescription", value)}
                rows={6}
              />
            </section>

            <section className={sectionClass}>
              <h2 className="mb-4 text-lg font-semibold text-white">Drive</h2>
              <div className="grid gap-5 lg:grid-cols-2">
                <EditStringField
                  label="Wants"
                  value={form.wants}
                  onChange={(value) => updateField("wants", value)}
                />
                <EditStringField
                  label="Fears"
                  value={form.fears}
                  onChange={(value) => updateField("fears", value)}
                />
              </div>
            </section>

            <section className={sectionClass}>
              <h2 className="mb-4 text-lg font-semibold text-white">
                Knowledge
              </h2>
              <div className="grid gap-5 lg:grid-cols-2">
                <EditListField
                  label="Knows"
                  value={form.knows}
                  onChange={(value) => updateField("knows", value)}
                />
                <EditListField
                  label="Doesn't Know"
                  value={form.doesntKnow}
                  onChange={(value) => updateField("doesntKnow", value)}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-5 shadow-xl">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Deception
              </h2>
              <div className="grid gap-5 lg:grid-cols-2">
                <EditListField
                  label="Claims"
                  value={form.claims}
                  onChange={(value) => updateField("claims", value)}
                />
                <EditStringField
                  label="Secret / Truth"
                  value={form.secretTruth}
                  onChange={(value) => updateField("secretTruth", value)}
                />
              </div>
            </section>

            <section className={sectionClass}>
              <h2 className="mb-4 text-lg font-semibold text-white">
                Reactions
              </h2>
              <EditListField
                label="Triggers / Reactions"
                value={form.reactions}
                onChange={(value) => updateField("reactions", value)}
                rows={6}
              />
            </section>

            <section className={sectionClass}>
              <h2 className="mb-4 text-lg font-semibold text-white">
                Gameplay
              </h2>

              <div className="space-y-5">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Location
                  </span>
                  <input
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className={inputClass}
                  />
                </label>

                <div className="grid gap-5 lg:grid-cols-2">
                  <EditListField
                    label="Relationships"
                    value={form.relationships}
                    onChange={(value) => updateField("relationships", value)}
                  />
                  <EditListField
                    label="Clues"
                    value={form.clues}
                    onChange={(value) => updateField("clues", value)}
                  />
                  <EditStringField
                    label="Stat Block"
                    value={form.statBlock}
                    onChange={(value) => updateField("statBlock", value)}
                    rows={8}
                  />
                  <EditListField
                    label="Items / Loot"
                    value={form.itemsLoot}
                    onChange={(value) => updateField("itemsLoot", value)}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-5 shadow-xl">
              <h2 className="mb-4 text-lg font-semibold text-white">GM</h2>
              <div className="grid gap-5 lg:grid-cols-2">
                <EditStringField
                  label="Quick Reference"
                  value={form.quickReference}
                  onChange={(value) => updateField("quickReference", value)}
                  rows={6}
                />
                <EditStringField
                  label="Notes"
                  value={form.notes}
                  onChange={(value) => updateField("notes", value)}
                  rows={8}
                />
              </div>
            </section>
          </main>
        </div>
      ) : viewMode === "player" ? (
        <div className="mx-auto max-w-5xl">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl">
            <div className="grid md:grid-cols-[42%_58%]">
              {npc?.imageUrl ? (
                <div className="min-h-[360px] bg-black">
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

              <div className="flex flex-col justify-center p-7 sm:p-10">
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  {npc?.name || "Unnamed NPC"}
                </h1>

                {publicSubtitle ? (
                  <p className="mt-2 text-base italic text-zinc-400">
                    {publicSubtitle}
                  </p>
                ) : null}

                {hasText(npc?.publicDescription) ? (
                  <div className="mt-7 whitespace-pre-wrap text-base leading-8 text-zinc-200">
                    {npc?.publicDescription}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl">
            <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
              {npc?.imageUrl ? (
                <div className="bg-black">
                  <img
                    src={npc.imageUrl}
                    alt={npc.name || "NPC portrait"}
                    className="h-full min-h-[360px] w-full object-cover"
                    style={{
                      objectPosition: `${npc.imageCropX ?? 50}% ${npc.imageCropY ?? 50}%`,
                    }}
                  />
                </div>
              ) : null}

              <div className="p-6 sm:p-7">
                <div className="border-b border-white/10 pb-5">
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    {npc?.name || "Unnamed NPC"}
                  </h1>

                  {publicSubtitle ? (
                    <p className="mt-1 italic text-zinc-400">
                      {publicSubtitle}
                    </p>
                  ) : null}

                  {hasText(npc?.role) ? (
                    <p className="mt-4 text-sm leading-6 text-zinc-200">
                      <span className="font-bold text-white">Role:</span>{" "}
                      {npc?.role}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 py-5 lg:grid-cols-3">
                  {hasList(npc?.personality) ? (
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                        🎭 Play
                      </div>
                      <div className="text-sm font-semibold leading-6 text-white">
                        {npc?.personality?.join(" · ")}
                      </div>
                    </div>
                  ) : null}

                  {hasText(npc?.wants) ? (
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                        🎯 Wants
                      </div>
                      <div className="whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                        {npc?.wants}
                      </div>
                    </div>
                  ) : null}

                  {hasText(npc?.fears) ? (
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                        ⚠️ Fears
                      </div>
                      <div className="whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                        {npc?.fears}
                      </div>
                    </div>
                  ) : null}
                </div>

                {hasText(npc?.voice) || hasList(npc?.mannerisms) ? (
                  <div className="grid gap-4 border-t border-white/10 py-4 md:grid-cols-2">
                    {hasText(npc?.voice) ? (
                      <div>
                        <div className="mb-1 text-xs font-bold uppercase tracking-wide text-zinc-500">
                          Voice
                        </div>
                        <div className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                          {npc?.voice}
                        </div>
                      </div>
                    ) : null}

                    {hasList(npc?.mannerisms) ? (
                      <div>
                        <div className="mb-1 text-xs font-bold uppercase tracking-wide text-zinc-500">
                          Mannerisms
                        </div>
                        <div className="text-sm leading-6 text-zinc-300">
                          {npc?.mannerisms?.join(" · ")}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {hasText(npc?.secretTruth) ? (
                  <div className="mt-1 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6">
                    <span className="font-bold text-amber-200">🔒 SECRET:</span>{" "}
                    <span className="whitespace-pre-wrap text-zinc-100">
                      {npc?.secretTruth}
                    </span>
                  </div>
                ) : null}

                {hasText(npc?.quickReference) ? (
                  <div className="mt-4 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wide text-violet-300">
                      Quick Reference
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-6 text-zinc-100">
                      {npc?.quickReference}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {visibleTabs.length > 0 ? (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab((current) =>
                        current === tab.id ? null : tab.id,
                      )
                    }
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "border-white/20 bg-white/15 text-white"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab ? (
                <section className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-zinc-200 shadow-xl">
                  {renderActiveTab()}
                </section>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </Container>
  );
}
