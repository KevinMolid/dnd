import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import type { CampaignDoc, CampaignMemberDoc } from "../types/campaign";
import {
  createJournalEntry,
  deleteJournalEntry,
  subscribeToJournalEntries,
  toggleJournalEntryPinned,
  toggleJournalEntryPublished,
  updateJournalEntry,
} from "../features/journal/journalService";
import {
  JOURNAL_ENTRY_TYPES,
  canReadJournalEntry,
  createEmptyJournalFormState,
  formStateToJournalEntryInput,
  getJournalTypeLabel,
  getJournalVisibilityLabel,
  journalEntryToFormState,
  validateJournalEntryForm,
  type CampaignPlayer,
  type JournalEntry,
  type JournalEntryFormState,
  type JournalEntryType,
} from "../features/journal/types";

type CampaignJournalPageState =
  | "loading"
  | "ready"
  | "not-found"
  | "forbidden"
  | "error";

type SortOption =
  | "updatedDesc"
  | "updatedAsc"
  | "sessionAsc"
  | "sessionDesc"
  | "titleAsc";

const CampaignJournalPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();

  const [pageState, setPageState] =
    useState<CampaignJournalPageState>("loading");
  const [campaign, setCampaign] = useState<
    (CampaignDoc & { id: string }) | null
  >(null);
  const [membership, setMembership] = useState<CampaignMemberDoc | null>(null);

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [journalLoading, setJournalLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<JournalEntryType | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("updatedDesc");
  const [onlyPinned, setOnlyPinned] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [form, setForm] = useState<JournalEntryFormState>(
    createEmptyJournalFormState(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [players, setPlayers] = useState<CampaignPlayer[]>([]);
  const currentPlayerId: string | null = user?.uid ?? null;

  useEffect(() => {
    const loadCampaignAccess = async () => {
      if (!user || !campaignId) {
        setPageState("forbidden");
        return;
      }

      setPageState("loading");

      try {
        const campaignRef = doc(db, "campaigns", campaignId);
        const memberRef = doc(db, "campaigns", campaignId, "members", user.uid);

        const [campaignSnap, memberSnap] = await Promise.all([
          getDoc(campaignRef),
          getDoc(memberRef),
        ]);

        if (!campaignSnap.exists()) {
          setCampaign(null);
          setMembership(null);
          setPageState("not-found");
          return;
        }

        if (!memberSnap.exists()) {
          setCampaign(null);
          setMembership(null);
          setPageState("forbidden");
          return;
        }

        setCampaign({
          id: campaignSnap.id,
          ...(campaignSnap.data() as CampaignDoc),
        });

        setMembership(memberSnap.data() as CampaignMemberDoc);
        setPageState("ready");
      } catch (error) {
        console.error("Failed to load campaign journal page:", error);
        setCampaign(null);
        setMembership(null);
        setPageState("error");
      }
    };

    loadCampaignAccess();
  }, [campaignId, user]);

  const isGm = membership?.role === "gm" || membership?.role === "co-gm";

  useEffect(() => {
    if (pageState !== "ready" || !campaignId) return;

    const membersRef = collection(db, "campaigns", campaignId, "members");
    const membersQuery = query(membersRef);

    const unsubscribe = onSnapshot(membersQuery, (snapshot) => {
      const nextPlayers: CampaignPlayer[] = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data() as CampaignMemberDoc;

          if (data.role === "gm" || data.role === "co-gm") {
            return null;
          }

          return {
            id: docSnap.id, // uid
            name: data.displayName || "Unknown player",
          };
        })
        .filter((value): value is CampaignPlayer => Boolean(value));

      setPlayers(nextPlayers);
    });

    return unsubscribe;
  }, [campaignId, pageState]);

  useEffect(() => {
    if (pageState !== "ready" || !campaignId) return;

    setJournalLoading(true);

    const unsubscribe = subscribeToJournalEntries(
      campaignId,
      { isGm, currentPlayerId },
      (nextEntries) => {
        setEntries(nextEntries);
        setJournalLoading(false);
      },
    );

    return unsubscribe;
  }, [campaignId, pageState, isGm, currentPlayerId]);

  const visibleEntries = useMemo(() => {
    return entries.filter((entry) =>
      canReadJournalEntry({
        entry,
        isDm: isGm,
        currentPlayerId,
      }),
    );
  }, [entries, isGm, currentPlayerId]);

  const filteredEntries = useMemo(() => {
    let next = [...visibleEntries];

    if (typeFilter !== "all") {
      next = next.filter((entry) => entry.type === typeFilter);
    }

    if (onlyPinned) {
      next = next.filter((entry) => entry.pinned);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      next = next.filter((entry) => {
        return (
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      });
    }

    next.sort((a, b) => {
      switch (sortBy) {
        case "updatedAsc":
          return a.updatedAt - b.updatedAt;
        case "updatedDesc":
          return b.updatedAt - a.updatedAt;
        case "sessionAsc":
          return (
            (a.sessionNumber ?? Number.MAX_SAFE_INTEGER) -
            (b.sessionNumber ?? Number.MAX_SAFE_INTEGER)
          );
        case "sessionDesc":
          return (b.sessionNumber ?? -1) - (a.sessionNumber ?? -1);
        case "titleAsc":
          return a.title.localeCompare(b.title);
        default:
          return b.updatedAt - a.updatedAt;
      }
    });

    return next;
  }, [visibleEntries, typeFilter, onlyPinned, search, sortBy]);

  const nextSessionNumber = useMemo(() => {
    const maxSession = entries.reduce<number>((max, entry) => {
      if (typeof entry.sessionNumber === "number") {
        return Math.max(max, entry.sessionNumber);
      }

      return max;
    }, 0);

    return maxSession > 0 ? maxSession + 1 : 1;
  }, [entries]);

  const pinnedEntries = useMemo(
    () => filteredEntries.filter((entry) => entry.pinned),
    [filteredEntries],
  );

  const regularEntries = useMemo(
    () => filteredEntries.filter((entry) => !entry.pinned),
    [filteredEntries],
  );

  function openCreateEditor() {
    setEditingEntry(null);
    setForm(createEmptyJournalFormState(nextSessionNumber));
    setSaveError(null);
    setEditorOpen(true);
  }

  function openEditEditor(entry: JournalEntry) {
    setEditingEntry(entry);
    setForm(journalEntryToFormState(entry));
    setSaveError(null);
    setEditorOpen(true);
  }

  function closeEditor() {
    if (isSaving) return;
    setEditorOpen(false);
    setEditingEntry(null);
    setSaveError(null);
  }

  async function handleSave() {
    if (!campaignId || !user?.uid) return;

    const validationError = validateJournalEntryForm(form);
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const input = formStateToJournalEntryInput({
        form,
        createdByUid: editingEntry?.createdByUid || user.uid,
        createdByName:
          editingEntry?.createdByName ||
          user.displayName ||
          membership?.displayName ||
          "Unknown GM",
      });

      if (editingEntry) {
        await updateJournalEntry(campaignId, editingEntry.id, input);
      } else {
        await createJournalEntry(campaignId, input);
      }

      setEditorOpen(false);
      setEditingEntry(null);
    } catch (error) {
      console.error(error);
      setSaveError("Failed to save journal entry.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(entry: JournalEntry) {
    if (!campaignId) return;

    const confirmed = window.confirm(
      `Delete "${entry.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      await deleteJournalEntry(campaignId, entry.id);
    } catch (error) {
      console.error(error);
      window.alert("Failed to delete journal entry.");
    }
  }

  async function handleTogglePublished(entry: JournalEntry) {
    if (!campaignId) return;

    try {
      await toggleJournalEntryPublished(campaignId, entry.id, !entry.published);
    } catch (error) {
      console.error(error);
      window.alert("Failed to update published state.");
    }
  }

  async function handleTogglePinned(entry: JournalEntry) {
    if (!campaignId) return;

    try {
      await toggleJournalEntryPinned(campaignId, entry.id, !entry.pinned);
    } catch (error) {
      console.error(error);
      window.alert("Failed to update pinned state.");
    }
  }

  function getSelectedPlayerNames(entry: JournalEntry) {
    if (!entry.visibleToPlayerIds.length) return "";

    return entry.visibleToPlayerIds
      .map((playerId) => players.find((player) => player.id === playerId)?.name)
      .filter(Boolean)
      .join(", ");
  }

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-sm text-zinc-400">Loading journal...</p>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl py-6 sm:py-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Campaign not found
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              The campaign you tried to open does not exist.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "forbidden") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl py-6 sm:py-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">Access denied</h1>
            <p className="mt-3 text-sm text-zinc-400">
              You do not have access to this campaign.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "error" || !campaign || !membership) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl py-6 sm:py-8">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm text-red-200/80">
              We could not load this journal right now.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Retry
              </button>

              <Link
                to="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl py-6 sm:py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to={`/campaigns/${campaign.id}`}
            className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to campaign
          </Link>

          {isGm && (
            <button
              onClick={openCreateEditor}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              New journal entry
            </button>
          )}
        </div>

        <section className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 shadow-2xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Campaign journal
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {campaign.name}
              </h1>

              <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
                Keep track of sessions, lore, quests, and notes.
              </p>
            </div>
          </div>
        </section>

        <div className="mb-6 grid grid-cols-1 gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm text-zinc-300">Search</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, content, or tags..."
              className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-300">Type</label>
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as JournalEntryType | "all")
              }
              className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-white/20"
            >
              <option value="all">All</option>
              {JOURNAL_ENTRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {getJournalTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-300">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-white/20"
            >
              <option value="updatedDesc">Recently updated</option>
              <option value="updatedAsc">Oldest updated</option>
              <option value="sessionAsc">Session number ↑</option>
              <option value="sessionDesc">Session number ↓</option>
              <option value="titleAsc">Title A–Z</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-300 md:col-span-4">
            <input
              type="checkbox"
              checked={onlyPinned}
              onChange={(e) => setOnlyPinned(e.target.checked)}
            />
            Only show pinned entries
          </label>
        </div>

        {journalLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-sm text-zinc-400">Loading entries...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
            <h2 className="text-lg font-semibold text-white">
              No journal entries
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              {isGm
                ? "Create your first entry to start documenting the campaign."
                : "There are no journal entries available for you yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {pinnedEntries.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold text-white">
                  Pinned
                </h2>
                <div className="space-y-4">
                  {pinnedEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-3xl border border-amber-400/20 bg-white/5 p-5 shadow-xl"
                    >
                      <EntryCardHeader
                        entry={entry}
                        isGm={isGm}
                        selectedPlayerNames={getSelectedPlayerNames(entry)}
                        onEdit={() => openEditEditor(entry)}
                        onDelete={() => handleDelete(entry)}
                        onTogglePinned={() => handleTogglePinned(entry)}
                        onTogglePublished={() => handleTogglePublished(entry)}
                      />

                      <div className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                        {entry.content}
                      </div>

                      {entry.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/10 bg-zinc-900 px-2 py-1 text-xs text-zinc-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-3 text-lg font-semibold text-white">
                {onlyPinned ? "Pinned entries" : "Entries"}
              </h2>

              <div className="space-y-4">
                {regularEntries.map((entry) => (
                  <article
                    key={entry.id}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl"
                  >
                    <EntryCardHeader
                      entry={entry}
                      isGm={isGm}
                      selectedPlayerNames={getSelectedPlayerNames(entry)}
                      onEdit={() => openEditEditor(entry)}
                      onDelete={() => handleDelete(entry)}
                      onTogglePinned={() => handleTogglePinned(entry)}
                      onTogglePublished={() => handleTogglePublished(entry)}
                    />

                    <div className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                      {entry.content}
                    </div>

                    {entry.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-zinc-900 px-2 py-1 text-xs text-zinc-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {editorOpen && isGm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {editingEntry ? "Edit journal entry" : "New journal entry"}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Organize the campaign journal and control who can see what.
                </p>
              </div>

              <button
                onClick={closeEditor}
                className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-zinc-300">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-white/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-zinc-300">Type</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as JournalEntryType,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-white/20"
                >
                  {JOURNAL_ENTRY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {getJournalTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Visibility
                </label>
                <select
                  value={form.visibility}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      visibility: e.target.value as JournalEntry["visibility"],
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-white/20"
                >
                  <option value="dm">DM only</option>
                  <option value="allPlayers">All players</option>
                  <option value="selectedPlayers">Selected players</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Session number
                </label>
                <input
                  type="number"
                  value={form.sessionNumber ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      sessionNumber: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-white/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-zinc-300">
                  Session date
                </label>
                <input
                  type="date"
                  value={form.sessionDate ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      sessionDate: e.target.value || null,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-white/20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-zinc-300">Tags</label>
                <input
                  value={form.tagsText}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tagsText: e.target.value }))
                  }
                  placeholder="e.g. Phandalin, Redbrands, Goblins"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
                />
              </div>

              {form.visibility === "selectedPlayers" && (
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-zinc-300">
                    Visible to selected players
                  </label>

                  {players.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-zinc-400">
                      No campaign players loaded yet. Connect this to your
                      campaign player/character list.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {players.map((player) => {
                        const checked = form.visibleToPlayerIds.includes(
                          player.id,
                        );

                        return (
                          <label
                            key={player.id}
                            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                setForm((prev) => ({
                                  ...prev,
                                  visibleToPlayerIds: e.target.checked
                                    ? [...prev.visibleToPlayerIds, player.id]
                                    : prev.visibleToPlayerIds.filter(
                                        (id) => id !== player.id,
                                      ),
                                }));
                              }}
                            />
                            {player.name}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm text-zinc-300">
                  Content
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  rows={12}
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-white/20"
                  placeholder={`Summary:
- 

Important events:
- 

NPCs met:
- 

Loot / rewards:
- 

Open quests / hooks:
- `}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      published: e.target.checked,
                    }))
                  }
                />
                Published
              </label>

              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={form.pinned}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      pinned: e.target.checked,
                    }))
                  }
                />
                Pinned
              </label>
            </div>

            {saveError && (
              <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {saveError}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={closeEditor}
                className="rounded-2xl border border-white/10 px-4 py-2 text-zinc-300 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-2xl bg-white px-4 py-2 font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving
                  ? "Saving..."
                  : editingEntry
                    ? "Save changes"
                    : "Create entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

type EntryCardHeaderProps = {
  entry: JournalEntry;
  isGm: boolean;
  selectedPlayerNames: string;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePinned: () => void;
  onTogglePublished: () => void;
};

function EntryCardHeader({
  entry,
  isGm,
  selectedPlayerNames,
  onEdit,
  onDelete,
  onTogglePinned,
  onTogglePublished,
}: EntryCardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap gap-2">
          <Badge>{getJournalTypeLabel(entry.type)}</Badge>

          {entry.published ? (
            <Badge tone="green">Published</Badge>
          ) : (
            <Badge tone="yellow">Draft</Badge>
          )}

          <Badge tone="blue">
            {getJournalVisibilityLabel(entry.visibility)}
          </Badge>

          {entry.pinned && <Badge tone="amber">Pinned</Badge>}
        </div>

        <h3 className="text-xl font-semibold text-white">{entry.title}</h3>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400">
          {typeof entry.sessionNumber === "number" && (
            <span>Session {entry.sessionNumber}</span>
          )}

          {entry.sessionDate && <span>{entry.sessionDate}</span>}

          <span>Updated {new Date(entry.updatedAt).toLocaleString()}</span>

          {entry.createdByName && <span>By {entry.createdByName}</span>}
        </div>

        {isGm &&
          entry.visibility === "selectedPlayers" &&
          selectedPlayerNames && (
            <div className="mt-2 text-sm text-zinc-400">
              Visible to: {selectedPlayerNames}
            </div>
          )}
      </div>

      {isGm && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onTogglePublished}
            className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
          >
            {entry.published ? "Unpublish" : "Publish"}
          </button>

          <button
            onClick={onTogglePinned}
            className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
          >
            {entry.pinned ? "Unpin" : "Pin"}
          </button>

          <button
            onClick={onEdit}
            className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="rounded-2xl border border-red-500/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

type BadgeProps = {
  children: React.ReactNode;
  tone?: "default" | "green" | "yellow" | "blue" | "amber";
};

function Badge({ children, tone = "default" }: BadgeProps) {
  const className =
    tone === "green"
      ? "border-green-500/30 bg-green-500/10 text-green-300"
      : tone === "yellow"
        ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
        : tone === "blue"
          ? "border-sky-500/30 bg-sky-500/10 text-sky-300"
          : tone === "amber"
            ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
            : "border-white/10 bg-zinc-900 text-zinc-300";

  return (
    <span
      className={`rounded-full border px-2 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export default CampaignJournalPage;
