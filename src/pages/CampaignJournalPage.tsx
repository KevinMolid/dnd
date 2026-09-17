import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import type { CampaignDoc, CampaignMemberDoc } from "../types/campaign";
import RichTextContent from "../features/richText/RichTextContent";
import RichTextEditor from "../features/richText/RichTextEditor";
import Select from "../components/ui/Select";
import DatePicker from "../components/ui/DatePicker";
import Avatar from "../components/Avatar";
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

const inputClass =
  "w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/20";

const compactButton =
  "flex h-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] px-3 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white";

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

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
  const [players, setPlayers] = useState<CampaignPlayer[]>([]);
  const [authorImagesByUid, setAuthorImagesByUid] = useState<
    Record<string, string>
  >({});

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<JournalEntryType | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("updatedDesc");
  const [onlyPinned, setOnlyPinned] = useState(false);

  const [expandedEntryIds, setExpandedEntryIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [expandedStateHydrated, setExpandedStateHydrated] = useState(false);

  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<JournalEntryFormState>(
    createEmptyJournalFormState(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const requestedEntryId = searchParams.get("entry");

  const currentPlayerId = user?.uid ?? null;

  const expandedStorageKey = campaignId
    ? `lorebound:campaign:${campaignId}:journal:expanded`
    : null;

  useEffect(() => {
    if (!expandedStorageKey) return;

    try {
      const stored = localStorage.getItem(expandedStorageKey);
      const parsed = stored ? JSON.parse(stored) : [];

      setExpandedEntryIds(
        new Set(
          Array.isArray(parsed)
            ? parsed.filter(
                (value): value is string => typeof value === "string",
              )
            : [],
        ),
      );
    } catch {
      setExpandedEntryIds(new Set());
    }

    setExpandedStateHydrated(true);
  }, [expandedStorageKey]);

  useEffect(() => {
    if (!expandedStorageKey || !expandedStateHydrated) return;

    localStorage.setItem(
      expandedStorageKey,
      JSON.stringify(Array.from(expandedEntryIds)),
    );
  }, [expandedEntryIds, expandedStateHydrated, expandedStorageKey]);

  useEffect(() => {
    if (!requestedEntryId || journalLoading) return;

    const entryExists = entries.some((entry) => entry.id === requestedEntryId);

    if (!entryExists) return;

    setExpandedEntryIds((current) => {
      if (current.has(requestedEntryId)) {
        return current;
      }

      const next = new Set(current);
      next.add(requestedEntryId);

      return next;
    });

    requestAnimationFrame(() => {
      document
        .getElementById(`journal-entry-${requestedEntryId}`)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    });

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("entry");
        return next;
      },
      {
        replace: true,
      },
    );
  }, [entries, journalLoading, requestedEntryId, setSearchParams]);

  function toggleEntryExpanded(entryId: string) {
    setExpandedEntryIds((current) => {
      const next = new Set(current);

      if (next.has(entryId)) {
        next.delete(entryId);
      } else {
        next.add(entryId);
      }

      return next;
    });
  }

  useEffect(() => {
    const loadCampaignAccess = async () => {
      if (!user || !campaignId) {
        setPageState("forbidden");
        return;
      }

      setPageState("loading");

      try {
        const [campaignSnap, memberSnap] = await Promise.all([
          getDoc(doc(db, "campaigns", campaignId)),
          getDoc(doc(db, "campaigns", campaignId, "members", user.uid)),
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

    void loadCampaignAccess();
  }, [campaignId, user]);

  const isGm = membership?.role === "gm" || membership?.role === "co-gm";

  useEffect(() => {
    if (pageState !== "ready" || !campaignId) return;

    return onSnapshot(
      query(collection(db, "campaigns", campaignId, "members")),
      async (snapshot) => {
        const nextPlayers = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as CampaignMemberDoc;
            if (data.role === "gm" || data.role === "co-gm") return null;

            return {
              id: docSnap.id,
              name: data.displayName || "Unknown player",
            };
          })
          .filter((value): value is CampaignPlayer => Boolean(value));

        setPlayers(nextPlayers);

        try {
          const userSnapshots = await Promise.all(
            snapshot.docs.map((memberSnap) =>
              getDoc(doc(db, "users", memberSnap.id)),
            ),
          );

          const nextAuthorImages: Record<string, string> = {};

          userSnapshots.forEach((userSnap) => {
            if (!userSnap.exists()) return;

            const imageUrl = userSnap.data().imageUrl;

            if (typeof imageUrl === "string" && imageUrl.trim()) {
              nextAuthorImages[userSnap.id] = imageUrl.trim();
            }
          });

          setAuthorImagesByUid(nextAuthorImages);
        } catch (error) {
          console.error("Failed to load journal author images:", error);
          setAuthorImagesByUid({});
        }
      },
    );
  }, [campaignId, pageState]);

  useEffect(() => {
    if (pageState !== "ready" || !campaignId) return;

    setJournalLoading(true);

    return subscribeToJournalEntries(
      campaignId,
      { isGm, currentPlayerId },
      (nextEntries) => {
        setEntries(nextEntries);
        setJournalLoading(false);
      },
    );
  }, [campaignId, pageState, isGm, currentPlayerId]);

  const visibleEntries = useMemo(
    () =>
      entries.filter((entry) =>
        canReadJournalEntry({
          entry,
          isDm: isGm,
          currentPlayerId,
        }),
      ),
    [entries, isGm, currentPlayerId],
  );

  const filteredEntries = useMemo(() => {
    let next = [...visibleEntries];

    if (typeFilter !== "all") {
      next = next.filter((entry) => entry.type === typeFilter);
    }

    if (onlyPinned) {
      next = next.filter((entry) => entry.pinned);
    }

    if (search.trim()) {
      const searchValue = search.trim().toLowerCase();

      next = next.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchValue) ||
          stripHtml(entry.content).toLowerCase().includes(searchValue) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(searchValue)),
      );
    }

    next.sort((a, b) => {
      switch (sortBy) {
        case "updatedAsc":
          return a.updatedAt - b.updatedAt;
        case "sessionAsc":
          return (
            (a.sessionNumber ?? Number.MAX_SAFE_INTEGER) -
            (b.sessionNumber ?? Number.MAX_SAFE_INTEGER)
          );
        case "sessionDesc":
          return (b.sessionNumber ?? -1) - (a.sessionNumber ?? -1);
        case "titleAsc":
          return a.title.localeCompare(b.title);
        case "updatedDesc":
        default:
          return b.updatedAt - a.updatedAt;
      }
    });

    return next;
  }, [visibleEntries, typeFilter, onlyPinned, search, sortBy]);

  const nextSessionNumber = useMemo(() => {
    const maxSession = entries.reduce(
      (max, entry) =>
        typeof entry.sessionNumber === "number"
          ? Math.max(max, entry.sessionNumber)
          : max,
      0,
    );

    return maxSession > 0 ? maxSession + 1 : 1;
  }, [entries]);

  const orderedEntries = useMemo(
    () =>
      [...filteredEntries].sort((a, b) => {
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }

        return 0;
      }),
    [filteredEntries],
  );

  const editingEntry =
    editingEntryId === null
      ? null
      : (entries.find((entry) => entry.id === editingEntryId) ?? null);

  const editorActive = creating || editingEntryId !== null;

  function beginCreate() {
    setEditingEntryId(null);
    setForm(createEmptyJournalFormState(nextSessionNumber));
    setSaveError(null);
    setCreating(true);
  }

  function beginEdit(entry: JournalEntry) {
    setCreating(false);
    setEditingEntryId(entry.id);
    setForm(journalEntryToFormState(entry));
    setSaveError(null);
  }

  function cancelEditor() {
    if (isSaving) return;
    setCreating(false);
    setEditingEntryId(null);
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

      setCreating(false);
      setEditingEntryId(null);
    } catch (error) {
      console.error(error);
      setSaveError("Failed to save journal entry.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(entry: JournalEntry) {
    if (!campaignId) return;
    if (!window.confirm(`Delete "${entry.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteJournalEntry(campaignId, entry.id);
      if (editingEntryId === entry.id) cancelEditor();
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
    return entry.visibleToPlayerIds
      .map((playerId) => players.find((player) => player.id === playerId)?.name)
      .filter(Boolean)
      .join(", ");
  }

  if (pageState !== "ready" || !campaign || !membership) {
    const title =
      pageState === "loading"
        ? "Loading journal..."
        : pageState === "not-found"
          ? "Campaign not found"
          : pageState === "forbidden"
            ? "Access denied"
            : "Something went wrong";

    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900/35 p-6 text-center">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {pageState !== "loading" ? (
          <div className="mt-5">
            <Link
              to="/"
              className="rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
            >
              Back to home
            </Link>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((current) => !current)}
            title={filtersOpen ? "Hide search and filters" : "Search journal"}
            aria-label={
              filtersOpen ? "Hide search and filters" : "Search journal"
            }
            className={`${compactButton} w-8 px-0 ${
              filtersOpen ||
              search ||
              typeFilter !== "all" ||
              onlyPinned ||
              sortBy !== "updatedDesc"
                ? "border-sky-400/25 bg-sky-500/10 text-sky-300"
                : ""
            }`}
          >
            <i className="fa-solid fa-magnifying-glass text-[11px]" />
          </button>

          {isGm ? (
            <button
              type="button"
              onClick={beginCreate}
              disabled={editorActive}
              className={`${compactButton} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <i className="fa-solid fa-plus mr-1.5 text-[9px]" />
              New entry
            </button>
          ) : null}
        </div>
      </div>

      {filtersOpen ? (
        <div className="mb-4 grid grid-cols-1 gap-2 rounded-xl border border-white/10 bg-zinc-900/35 p-3 md:grid-cols-[minmax(0,2fr)_minmax(160px,1fr)_minmax(180px,1fr)_auto]">
          <input
            autoFocus
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, content, or tags..."
            className={inputClass}
          />

          <Select<JournalEntryType | "all">
            value={typeFilter}
            onChange={setTypeFilter}
            ariaLabel="Filter journal by type"
            options={[
              { value: "all", label: "All types" },
              ...JOURNAL_ENTRY_TYPES.map((type) => ({
                value: type,
                label: getJournalTypeLabel(type),
              })),
            ]}
          />

          <Select<SortOption>
            value={sortBy}
            onChange={setSortBy}
            ariaLabel="Sort journal entries"
            options={[
              { value: "updatedDesc", label: "Recently updated" },
              { value: "updatedAsc", label: "Oldest updated" },
              { value: "sessionAsc", label: "Session number ↑" },
              { value: "sessionDesc", label: "Session number ↓" },
              { value: "titleAsc", label: "Title A–Z" },
            ]}
          />

          <label className="flex min-h-9 items-center gap-2 whitespace-nowrap rounded-lg border border-white/10 bg-black/20 px-3 text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={onlyPinned}
              onChange={(event) => setOnlyPinned(event.target.checked)}
            />
            Pinned only
          </label>
        </div>
      ) : null}

      {creating && isGm ? (
        <div className="mb-5">
          <InlineJournalEditor
            form={form}
            setForm={setForm}
            players={players}
            isSaving={isSaving}
            saveError={saveError}
            mode="create"
            onCancel={cancelEditor}
            onSave={handleSave}
          />
        </div>
      ) : null}

      {journalLoading ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900/35 p-6 text-center text-sm text-zinc-400">
          Loading entries...
        </div>
      ) : filteredEntries.length === 0 && !creating ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-zinc-900/25 p-6 text-center">
          <h2 className="text-base font-semibold text-white">
            No journal entries
          </h2>
          <p className="mt-1.5 text-sm text-zinc-400">
            {isGm
              ? "Create your first entry to start documenting the campaign."
              : "There are no journal entries available for you yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {orderedEntries.map((entry) =>
            editingEntryId === entry.id ? (
              <InlineJournalEditor
                key={entry.id}
                form={form}
                setForm={setForm}
                players={players}
                isSaving={isSaving}
                saveError={saveError}
                mode="edit"
                onCancel={cancelEditor}
                onSave={handleSave}
              />
            ) : (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                isGm={isGm}
                authorImageUrl={
                  entry.createdByUid
                    ? authorImagesByUid[entry.createdByUid]
                    : undefined
                }
                expanded={expandedEntryIds.has(entry.id)}
                selectedPlayerNames={getSelectedPlayerNames(entry)}
                onToggleExpanded={() => toggleEntryExpanded(entry.id)}
                onEdit={() => beginEdit(entry)}
                onDelete={() => void handleDelete(entry)}
                onTogglePinned={() => void handleTogglePinned(entry)}
                onTogglePublished={() => void handleTogglePublished(entry)}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
};

type InlineJournalEditorProps = {
  form: JournalEntryFormState;
  setForm: Dispatch<SetStateAction<JournalEntryFormState>>;
  players: CampaignPlayer[];
  isSaving: boolean;
  saveError: string | null;
  mode: "create" | "edit";
  onCancel: () => void;
  onSave: () => void;
};

function InlineJournalEditor({
  form,
  setForm,
  players,
  isSaving,
  saveError,
  mode,
  onCancel,
  onSave,
}: InlineJournalEditorProps) {
  return (
    <article className="rounded-xl border border-emerald-400/20 bg-zinc-900/45 p-3 shadow-[0_0_0_1px_rgba(16,185,129,0.03)] sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300/80">
          {mode === "create" ? "New journal entry" : "Editing entry"}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className={compactButton}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex h-8 items-center justify-center rounded-lg bg-white px-3 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </div>

      <input
        value={form.title}
        onChange={(event) =>
          setForm((previous) => ({ ...previous, title: event.target.value }))
        }
        placeholder="Entry title"
        className="mb-3 w-full border-0 bg-transparent px-0 text-xl font-semibold text-white outline-none placeholder:text-zinc-600"
      />

      <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        <Select<JournalEntryType>
          value={form.type}
          onChange={(type) =>
            setForm((previous) => ({
              ...previous,
              type,
            }))
          }
          ariaLabel="Journal entry type"
          options={JOURNAL_ENTRY_TYPES.map((type) => ({
            value: type,
            label: getJournalTypeLabel(type),
          }))}
        />

        <Select<JournalEntry["visibility"]>
          value={form.visibility}
          onChange={(visibility) =>
            setForm((previous) => ({
              ...previous,
              visibility,
            }))
          }
          ariaLabel="Journal entry visibility"
          options={[
            { value: "dm", label: "DM only" },
            { value: "allPlayers", label: "All players" },
            { value: "selectedPlayers", label: "Selected players" },
          ]}
        />

        <input
          type="number"
          min={0}
          value={form.sessionNumber ?? ""}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              sessionNumber: event.target.value
                ? Number(event.target.value)
                : null,
            }))
          }
          placeholder="Session"
          className={inputClass}
        />

        <DatePicker
          value={form.sessionDate}
          onChange={(sessionDate) =>
            setForm((previous) => ({
              ...previous,
              sessionDate,
            }))
          }
          ariaLabel="Session date"
        />
      </div>

      {form.visibility === "selectedPlayers" ? (
        <div className="mb-3 rounded-lg border border-white/[0.08] bg-black/15 p-2.5">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
            Visible to
          </div>
          <div className="flex flex-wrap gap-2">
            {players.length === 0 ? (
              <span className="text-xs text-zinc-500">
                No players available.
              </span>
            ) : (
              players.map((player) => {
                const checked = form.visibleToPlayerIds.includes(player.id);

                return (
                  <label
                    key={player.id}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
                      checked
                        ? "border-sky-400/30 bg-sky-500/10 text-sky-200"
                        : "border-white/10 bg-white/[0.025] text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          visibleToPlayerIds: event.target.checked
                            ? [...previous.visibleToPlayerIds, player.id]
                            : previous.visibleToPlayerIds.filter(
                                (id) => id !== player.id,
                              ),
                        }))
                      }
                    />
                    {player.name}
                  </label>
                );
              })
            )}
          </div>
        </div>
      ) : null}

      <RichTextEditor
        value={form.content}
        onChange={(content) =>
          setForm((previous) => ({ ...previous, content }))
        }
        placeholder="Write the journal entry..."
        minHeightClassName="min-h-[220px]"
      />

      <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
        <input
          value={form.tagsText}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              tagsText: event.target.value,
            }))
          }
          placeholder="Tags, separated by commas"
          className={`${inputClass} md:flex-1`}
        />

        <div className="flex shrink-0 items-center gap-4 rounded-lg border border-white/[0.08] bg-black/15 px-3 py-2">
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  published: event.target.checked,
                }))
              }
            />
            Published
          </label>

          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  pinned: event.target.checked,
                }))
              }
            />
            Pinned
          </label>
        </div>
      </div>

      {saveError ? (
        <div className="mt-3 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {saveError}
        </div>
      ) : null}
    </article>
  );
}

type JournalEntryCardProps = {
  entry: JournalEntry;
  isGm: boolean;
  authorImageUrl?: string;
  expanded: boolean;
  selectedPlayerNames: string;
  onToggleExpanded: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePinned: () => void;
  onTogglePublished: () => void;
};

function JournalEntryCard({
  entry,
  isGm,
  authorImageUrl,
  expanded,
  selectedPlayerNames,
  onToggleExpanded,
  onEdit,
  onDelete,
  onTogglePinned,
  onTogglePublished,
}: JournalEntryCardProps) {
  const preview = stripHtml(entry.content);
  const displayDate = entry.sessionDate
    ? new Date(`${entry.sessionDate}T00:00:00`).toLocaleDateString()
    : null;

  const updatedDate = new Date(entry.updatedAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article
      id={`journal-entry-${entry.id}`}
      className={`overflow-hidden rounded-xl border transition ${
        entry.pinned
          ? "border-amber-400/15 bg-zinc-900/35"
          : expanded
            ? "border-white/[0.14] bg-zinc-900/40"
            : "border-white/[0.08] bg-zinc-900/30 hover:border-white/[0.14] hover:bg-zinc-900/40"
      }`}
    >
      <button
        type="button"
        onClick={onToggleExpanded}
        aria-expanded={expanded}
        className="grid min-h-[62px] w-full grid-cols-[20px_minmax(0,1fr)_auto] items-start gap-x-3 px-3 py-3 text-left sm:px-4"
      >
        <div className="col-start-1 row-span-2 flex h-6 items-center justify-center pt-0.5 text-[9px] text-zinc-500">
          <i
            className={`fa-solid fa-chevron-right transition-transform ${
              expanded ? "rotate-90" : ""
            }`}
          />
        </div>

        <div className="col-start-2 min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <div className="flex min-w-0 items-center gap-1.5">
              {entry.pinned ? (
                <span
                  title="Pinned"
                  className="flex h-5 w-4 shrink-0 items-center justify-center text-[10px] text-amber-300"
                >
                  <i className="fa-solid fa-thumbtack" />
                </span>
              ) : null}

              <h3 className="truncate text-sm font-semibold text-white sm:text-[15px]">
                {entry.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <Badge>{getJournalTypeLabel(entry.type)}</Badge>

              {isGm ? (
                <Badge tone={entry.published ? "green" : "yellow"}>
                  {entry.published ? "Published" : "Draft"}
                </Badge>
              ) : null}

              <Badge tone="blue">
                {getJournalVisibilityLabel(entry.visibility)}
              </Badge>
            </div>
          </div>

          {expanded ? (
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-zinc-600">
              <span>Updated {updatedDate}</span>
              {typeof entry.sessionNumber === "number" ? (
                <span>· Session {entry.sessionNumber}</span>
              ) : null}
              {displayDate ? <span>· {displayDate}</span> : null}
            </div>
          ) : preview ? (
            <p className="mt-1.5 truncate text-xs text-zinc-500">{preview}</p>
          ) : null}
        </div>

        <div className="col-start-3 row-span-2 hidden shrink-0 sm:block">
          {entry.createdByName ? (
            <div className="flex items-center justify-end gap-2">
              <Avatar
                name={entry.createdByName}
                src={authorImageUrl}
                className="h-7 w-7 shrink-0 rounded-full"
              />
              <span className="text-xs font-semibold text-zinc-200">
                {entry.createdByName}
              </span>
            </div>
          ) : null}
        </div>
      </button>

      {expanded ? (
        <div className="grid grid-cols-[20px_minmax(0,1fr)] gap-x-3 border-t border-white/[0.06] px-3 pb-4 pt-4 sm:grid-cols-[20px_minmax(0,1fr)_auto] sm:px-4">
          <div className="col-start-2 min-w-0 sm:col-end-4">
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 sm:hidden">
              {entry.createdByName ? (
                <span className="flex items-center gap-2 font-semibold text-zinc-200">
                  <Avatar
                    name={entry.createdByName}
                    src={authorImageUrl}
                    className="h-6 w-6 shrink-0 rounded-full"
                  />
                  {entry.createdByName}
                </span>
              ) : null}
            </div>

            {isGm &&
            entry.visibility === "selectedPlayers" &&
            selectedPlayerNames ? (
              <div className="mb-3 text-[11px] text-zinc-600">
                Visible to: {selectedPlayerNames}
              </div>
            ) : null}

            {entry.content ? (
              <div className="journal-entry-content [&_.workspace-note-editor]:!m-0 [&_.workspace-note-editor]:!p-0 [&_.workspace-note-editor]:!leading-5 [&_.workspace-note-editor>p]:!my-1 [&_.workspace-note-editor>p:first-child]:!mt-0 [&_.workspace-note-editor>p:last-child]:!mb-0">
                {" "}
                <RichTextContent value={entry.content} />
              </div>
            ) : (
              <p className="text-sm italic text-zinc-600">No content.</p>
            )}

            {entry.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[11px] text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            {isGm ? (
              <div className="mt-4 flex flex-wrap justify-end gap-1.5 border-t border-white/[0.06] pt-3">
                <button
                  type="button"
                  onClick={onTogglePublished}
                  className={compactButton}
                >
                  {entry.published ? "Unpublish" : "Publish"}
                </button>

                <button
                  type="button"
                  onClick={onTogglePinned}
                  className={compactButton}
                >
                  {entry.pinned ? "Unpin" : "Pin"}
                </button>

                <button
                  type="button"
                  onClick={onEdit}
                  className={compactButton}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={onDelete}
                  className="flex h-8 items-center rounded-lg border border-red-500/20 px-3 text-xs font-medium text-red-300 transition hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

type BadgeProps = {
  children: ReactNode;
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
            : "border-white/10 bg-black/20 text-zinc-300";

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export default CampaignJournalPage;
