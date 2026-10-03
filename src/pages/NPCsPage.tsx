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

type NpcImageOption = {
  url: string;
  cropX?: number;
  cropY?: number;
};

type CampaignNpc = {
  id: string;

  campaignId?: string;

  // Identity

  name: string;

  species?: string;

  occupation?: string;

  role?: string;

  categories?: string[];

  imageUrl?: string;

  alternativeImages?: NpcImageOption[];

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

  categories: string;

  imageUrl: string;

  alternativeImages: string;

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

  categories: "",

  imageUrl: "",

  alternativeImages: "",

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

const parseAlternativeImages = (value: string): NpcImageOption[] =>
  parseList(value).map((url) => ({
    url,
    cropX: 50,
    cropY: 50,
  }));

const inputClass =
  "rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500";

const textAreaClass =
  "workspace-scrollbar rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500";

type NpcSortMode = "name-asc" | "name-desc" | "category" | "location";

type NpcViewMode = "large" | "compact";

type NpcSearchField =
  | "all"
  | "name"
  | "location"
  | "categories"
  | "species"
  | "occupation"
  | "role"
  | "personality"
  | "publicDescription"
  | "relationships"
  | "knowledge"
  | "clues"
  | "notes";

const normalizeSearchValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.map(normalizeSearchValue).join(" ");
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return "";
};

const getNpcSearchText = (npc: CampaignNpc, field: NpcSearchField): string => {
  if (field === "name")
    return normalizeSearchValue(npc.name).toLocaleLowerCase();

  if (field === "location")
    return normalizeSearchValue(npc.location).toLocaleLowerCase();

  if (field === "categories")
    return normalizeSearchValue(npc.categories).toLocaleLowerCase();

  if (field === "species")
    return normalizeSearchValue(npc.species).toLocaleLowerCase();

  if (field === "occupation")
    return normalizeSearchValue(npc.occupation).toLocaleLowerCase();

  if (field === "role")
    return normalizeSearchValue(npc.role).toLocaleLowerCase();

  if (field === "personality")
    return normalizeSearchValue(npc.personality).toLocaleLowerCase();

  if (field === "publicDescription")
    return normalizeSearchValue(npc.publicDescription).toLocaleLowerCase();

  if (field === "relationships")
    return normalizeSearchValue(npc.relationships).toLocaleLowerCase();

  if (field === "clues")
    return normalizeSearchValue(npc.clues).toLocaleLowerCase();

  if (field === "knowledge") {
    return [npc.knows, npc.doesntKnow, npc.claims, npc.secretTruth]

      .map(normalizeSearchValue)

      .join(" ")

      .toLocaleLowerCase();
  }

  if (field === "notes") {
    return [
      npc.quickReference,

      npc.notes,

      npc.statBlock,

      npc.itemsLoot,

      npc.reactions,

      npc.wants,

      npc.fears,

      npc.voice,

      npc.mannerisms,
    ]

      .map(normalizeSearchValue)

      .join(" ")

      .toLocaleLowerCase();
  }

  return [
    npc.name,

    npc.species,

    npc.occupation,

    npc.role,

    npc.categories,

    npc.publicDescription,

    npc.personality,

    npc.voice,

    npc.mannerisms,

    npc.wants,

    npc.fears,

    npc.knows,

    npc.doesntKnow,

    npc.claims,

    npc.secretTruth,

    npc.reactions,

    npc.location,

    npc.relationships,

    npc.clues,

    npc.statBlock,

    npc.itemsLoot,

    npc.quickReference,

    npc.notes,
  ]

    .map(normalizeSearchValue)

    .join(" ")

    .toLocaleLowerCase();
};

const getFirstCategory = (npc: CampaignNpc) =>
  [...(npc.categories ?? [])].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  )[0] ?? "";

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

  const [searchQuery, setSearchQuery] = useState("");

  const [searchField, setSearchField] = useState<NpcSearchField>("all");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [sortMode, setSortMode] = useState<NpcSortMode>("name-asc");

  const [viewMode, setViewMode] = useState<NpcViewMode>(() => {
    const saved = window.localStorage.getItem("lorebound:npc-view-mode");

    return saved === "compact" ? "compact" : "large";
  });

  useEffect(() => {
    window.localStorage.setItem("lorebound:npc-view-mode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    document.documentElement.classList.add("workspace-scrollbar");

    document.body.classList.add("workspace-scrollbar");

    return () => {
      document.documentElement.classList.remove("workspace-scrollbar");

      document.body.classList.remove("workspace-scrollbar");
    };
  }, []);

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

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          npcs.flatMap((npc) =>
            (npc.categories ?? [])

              .map((category) => category.trim())

              .filter(Boolean),
          ),
        ),
      ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })),

    [npcs],
  );

  const filteredAndSortedNpcs = useMemo(() => {
    const terms = searchQuery

      .trim()

      .toLocaleLowerCase()

      .split(/\s+/)

      .filter(Boolean);

    const filtered = npcs.filter((npc) => {
      if (selectedCategories.length > 0) {
        const npcCategories = (npc.categories ?? [])

          .map((category) => category.trim())

          .filter(Boolean);

        const wantsNone = selectedCategories.includes("\_\_none\_\_");

        const selectedNamedCategories = selectedCategories.filter(
          (category) => category !== "\_\_none\_\_",
        );

        const matchesNone = wantsNone && npcCategories.length === 0;

        const matchesNamedCategory = selectedNamedCategories.some((selected) =>
          npcCategories.some(
            (category) =>
              category.localeCompare(selected, undefined, {
                sensitivity: "base",
              }) === 0,
          ),
        );

        if (!matchesNone && !matchesNamedCategory) {
          return false;
        }
      }

      if (terms.length === 0) {
        return true;
      }

      const searchText = getNpcSearchText(npc, searchField);

      return terms.every((term) => searchText.includes(term));
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "name-desc") {
        return (b.name || "").localeCompare(a.name || "", undefined, {
          sensitivity: "base",
        });
      }

      if (sortMode === "category") {
        const categoryCompare = getFirstCategory(a).localeCompare(
          getFirstCategory(b),

          undefined,

          { sensitivity: "base" },
        );

        if (categoryCompare !== 0) {
          return categoryCompare;
        }
      }

      if (sortMode === "location") {
        const locationCompare = (a.location || "").localeCompare(
          b.location || "",

          undefined,

          { sensitivity: "base" },
        );

        if (locationCompare !== 0) {
          return locationCompare;
        }
      }

      return (a.name || "").localeCompare(b.name || "", undefined, {
        sensitivity: "base",
      });
    });
  }, [npcs, searchQuery, searchField, selectedCategories, sortMode]);

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

        categories: parseList(form.categories),

        imageUrl: form.imageUrl.trim(),

        alternativeImages: parseAlternativeImages(form.alternativeImages),

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
                    Categories
                  </span>

                  <input
                    value={form.categories}
                    onChange={(e) => updateField("categories", e.target.value)}
                    className={inputClass}
                    placeholder="Veyr, Main story, Den Tente Lykten..."
                    list="npc-category-suggestions"
                  />

                  <datalist id="npc-category-suggestions">
                    {categories.map((category) => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>

                  <span className="text-xs text-zinc-500">
                    Separate categories with commas. Existing categories are
                    suggested automatically.
                  </span>
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

                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Alternative image URLs
                  </span>

                  <textarea
                    value={form.alternativeImages}
                    spellCheck={false}
                    onChange={(e) =>
                      updateField("alternativeImages", e.target.value)
                    }
                    rows={4}
                    className={textAreaClass}
                    placeholder={"https://...\nhttps://..."}
                  />

                  <span className="text-xs text-zinc-500">
                    One image URL per line. Alternative images are GM-only until
                    one is set as active.
                  </span>
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
                  spellCheck={false}
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
                    spellCheck={false}
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
                    spellCheck={false}
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
                    spellCheck={false}
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
                    spellCheck={false}
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
                    spellCheck={false}
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
                    spellCheck={false}
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
                    spellCheck={false}
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
                    spellCheck={false}
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
                    spellCheck={false}
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
                  spellCheck={false}
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
                      spellCheck={false}
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
                      spellCheck={false}
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
                      spellCheck={false}
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
                      spellCheck={false}
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
                    spellCheck={false}
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
                    spellCheck={false}
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

      {!showCreateForm ? (
        <>
          <section className="mb-4 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/20 focus-within:border-emerald-500/40">
                <select
                  value={searchField}
                  onChange={(event) =>
                    setSearchField(event.target.value as NpcSearchField)
                  }
                  aria-label="Search field"
                  className="h-10 shrink-0 border-r border-white/10 bg-zinc-950 px-3 text-xs font-medium text-zinc-300 outline-none"
                >
                  <option value="all">All fields</option>

                  <option value="name">Name</option>

                  <option value="location">Location</option>

                  <option value="categories">Categories</option>

                  <option value="species">Species</option>

                  <option value="occupation">Occupation / Title</option>

                  <option value="role">Role</option>

                  <option value="personality">Play / Personality</option>

                  <option value="publicDescription">Public description</option>

                  <option value="relationships">Relationships</option>

                  <option value="knowledge">Knowledge / Claims</option>

                  <option value="clues">Clues</option>

                  <option value="notes">GM / Other notes</option>
                </select>

                <div className="relative min-w-0 flex-1">
                  <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={
                      searchField === "all"
                        ? "Search all NPC fields..."
                        : "Search selected field..."
                    }
                    className="h-10 w-full bg-transparent pl-9 pr-9 text-sm text-white outline-none placeholder:text-zinc-600"
                  />

                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-zinc-500 transition hover:bg-white/10 hover:text-white"
                    >
                      <i className="fa-solid fa-xmark text-xs" />
                    </button>
                  ) : null}
                </div>
              </div>

              <select
                value={sortMode}
                onChange={(event) =>
                  setSortMode(event.target.value as NpcSortMode)
                }
                className="h-10 rounded-xl border border-white/10 bg-zinc-950 px-3 text-sm text-zinc-200 outline-none focus:border-emerald-500/40"
              >
                <option value="name-asc">Name A–Z</option>

                <option value="name-desc">Name Z–A</option>

                <option value="category">Category</option>

                <option value="location">Location</option>
              </select>

              <div className="grid h-10 grid-cols-2 rounded-xl border border-white/10 bg-black/20 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("large")}
                  title="Large cards"
                  aria-label="Large NPC cards"
                  className={`flex min-w-10 items-center justify-center rounded-lg px-2 text-xs transition ${
                    viewMode === "large"
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
                  }`}
                >
                  <i className="fa-solid fa-grip" />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("compact")}
                  title="Compact cards"
                  aria-label="Compact NPC cards"
                  className={`flex min-w-10 items-center justify-center rounded-lg px-2 text-xs transition ${
                    viewMode === "compact"
                      ? "bg-white/10 text-white"
                      : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
                  }`}
                >
                  <i className="fa-solid fa-list" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedCategories([])}
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  selectedCategories.length === 0
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.035] text-zinc-400 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                All
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedCategories((current) =>
                    current.includes("\_\_none\_\_")
                      ? current.filter(
                          (category) => category !== "\_\_none\_\_",
                        )
                      : [...current, "\_\_none\_\_"],
                  )
                }
                className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                  selectedCategories.includes("\_\_none\_\_")
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.035] text-zinc-400 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                None
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategories((current) =>
                      current.includes(category)
                        ? current.filter((entry) => entry !== category)
                        : [...current, category],
                    )
                  }
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                    selectedCategories.includes(category)
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-white/10 bg-white/[0.035] text-zinc-400 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}

              <span className="ml-auto text-xs text-zinc-500">
                {filteredAndSortedNpcs.length} of {npcs.length} NPCs
              </span>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
            {loading ? (
              <p className="text-sm text-zinc-400">Loading NPCs...</p>
            ) : filteredAndSortedNpcs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-6 text-center">
                <p className="text-sm text-zinc-400">
                  {npcs.length === 0
                    ? "No NPCs yet. Create your first NPC to start building the campaign cast."
                    : "No NPCs match the current search or category filter."}
                </p>
              </div>
            ) : viewMode === "large" ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredAndSortedNpcs.map((npc) => (
                  <Link
                    key={npc.id}
                    to={`/campaigns/${campaignId}/npcs/${npc.id}`}
                    className="block overflow-hidden rounded-2xl border border-white/10 bg-black/10 transition hover:bg-black/20"
                  >
                    <div className="aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-black/20">
                      <img
                        src={npc.imageUrl || "/images/DefaultNPC.png"}
                        alt={npc.name || "NPC portrait"}
                        className="h-full w-full object-cover"
                        style={{
                          objectPosition: npc.imageUrl
                            ? `${npc.imageCropX ?? 50}% ${npc.imageCropY ?? 50}%`
                            : "50% 50%",
                        }}
                      />
                    </div>

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

                          {npc.categories && npc.categories.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {npc.categories.slice(0, 3).map((category) => (
                                <span
                                  key={category}
                                  className="rounded-md border border-emerald-500/15 bg-emerald-500/[0.06] px-1.5 py-0.5 text-[9px] font-medium text-emerald-300/90"
                                >
                                  {category}
                                </span>
                              ))}

                              {npc.categories.length > 3 ? (
                                <span className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-zinc-500">
                                  +{npc.categories.length - 3}
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-sm leading-5">
                        {npc.role ? (
                          <p className="text-zinc-300">
                            <span className="font-semibold text-white">
                              Role:
                            </span>{" "}
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
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredAndSortedNpcs.map((npc) => (
                  <Link
                    key={npc.id}
                    to={`/campaigns/${campaignId}/npcs/${npc.id}`}
                    className="group flex min-w-0 overflow-hidden rounded-xl border border-white/10 bg-black/10 transition hover:border-white/20 hover:bg-black/20"
                  >
                    <div className="h-24 w-20 shrink-0 overflow-hidden border-r border-white/10 bg-black/20 sm:h-auto sm:min-h-24">
                      <img
                        src={npc.imageUrl || "/images/DefaultNPC.png"}
                        alt={npc.name || "NPC portrait"}
                        className="h-full w-full object-cover transition group-hover:brightness-110"
                        style={{
                          objectPosition: npc.imageUrl
                            ? `${npc.imageCropX ?? 50}% ${npc.imageCropY ?? 50}%`
                            : "50% 50%",
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1 p-2.5">
                      <h2 className="truncate text-sm font-semibold text-white">
                        {npc.name || "Unnamed NPC"}
                      </h2>

                      <div className="mt-1 flex min-h-5 flex-wrap gap-1">
                        {npc.categories && npc.categories.length > 0 ? (
                          <>
                            {npc.categories.slice(0, 2).map((category) => (
                              <span
                                key={category}
                                className="max-w-28 truncate rounded-md border border-emerald-500/15 bg-emerald-500/[0.06] px-1.5 py-0.5 text-[9px] font-medium text-emerald-300/90"
                              >
                                {category}
                              </span>
                            ))}

                            {npc.categories.length > 2 ? (
                              <span className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-zinc-500">
                                +{npc.categories.length - 2}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <span className="text-[10px] text-zinc-600">
                            No category
                          </span>
                        )}
                      </div>

                      <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-zinc-400">
                        <span className="font-semibold text-zinc-200">
                          🎭 Play:
                        </span>{" "}
                        {npc.personality && npc.personality.length > 0
                          ? npc.personality.slice(0, 3).join(" · ")
                          : "—"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </Container>
  );
}
