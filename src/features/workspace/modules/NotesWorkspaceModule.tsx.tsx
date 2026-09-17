import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";

import { db } from "../../../firebase";

import useMonsterLibrary from "../../../hooks/useMonsterLibrary";
import useNpcLibrary from "../../../hooks/useNpcLibrary";
import useCampaignPageData from "../../campaigns/hooks/useCampaignPageData";

import { allItems } from "../../../rulesets/dnd/dnd2024/data/items";

import {
  createEntityMentionExtension,
  type EntityMentionItem,
} from "../notes/entityMention";

import { useWorkspace } from "../WorkspaceContext";
import type { WorkspaceModuleRenderProps } from "../workspaceTypes";

type CampaignNote = {
  id: string;
  title: string;
  content: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

type NotesModuleConfig = {
  selectedNoteId?: string;
  /**
   * Legacy browser-local note body. Kept only so old notes can be migrated
   * once into the campaign notes collection.
   */
  noteContent?: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const normalizeStoredNoteContent = (value: string) => {
  if (!value.trim()) return "";

  const appearsToBeHtml = /<\/?[a-z][\s\S]*>/i.test(value);
  if (appearsToBeHtml) return value;

  return `<p>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`;
};

const getFormatButtonClass = (active: boolean) =>
  `workspace-no-drag flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] transition ${
    active
      ? "bg-emerald-500/15 text-emerald-300"
      : "text-zinc-500 hover:bg-white/10 hover:text-white"
  }`;

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getTimestampMillis = (value?: Timestamp | null) =>
  value?.toMillis?.() ?? 0;

export function NotesWorkspaceModule({
  module,
  campaignId,
  editing,
  updateModule,
  removeModule,
}: WorkspaceModuleRenderProps) {
  const config = (module.config ?? {}) as NotesModuleConfig;
  const selectedNoteId = config.selectedNoteId;

  const [notes, setNotes] = useState<CampaignNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [browserOpen, setBrowserOpen] = useState(!selectedNoteId);
  const [search, setSearch] = useState("");

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  const [editorRevision, setEditorRevision] = useState(0);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedNoteIdRef = useRef<string | undefined>(selectedNoteId);
  const pendingContentRef = useRef<string | null>(null);
  const migratingLegacyRef = useRef(false);

  const { campaignCharacters } = useCampaignPageData(campaignId);
  const { allMonsters } = useMonsterLibrary(campaignId);
  const { npcs } = useNpcLibrary(campaignId);
  const { selectEntity, selectCharacter } = useWorkspace();

  useEffect(() => {
    selectedNoteIdRef.current = selectedNoteId;
  }, [selectedNoteId]);

  /*
   * Campaign notes are real campaign data. Every browser/device subscribes to
   * this same Firestore collection. Workspace modules only remember which
   * note they are currently showing.
   */
  useEffect(() => {
    if (!campaignId) {
      setNotes([]);
      setNotesLoading(false);
      return;
    }

    setNotesLoading(true);

    const unsubscribe = onSnapshot(
      collection(db, "campaigns", campaignId, "notes"),
      (snapshot) => {
        const nextNotes = snapshot.docs
          .map((noteSnapshot): CampaignNote => {
            const data = noteSnapshot.data() as {
              title?: string;
              content?: string;
              createdAt?: Timestamp | null;
              updatedAt?: Timestamp | null;
            };

            return {
              id: noteSnapshot.id,
              title: data.title?.trim() || "Untitled Note",
              content: typeof data.content === "string" ? data.content : "",
              createdAt: data.createdAt ?? null,
              updatedAt: data.updatedAt ?? null,
            };
          })
          .sort(
            (a, b) =>
              getTimestampMillis(b.updatedAt) - getTimestampMillis(a.updatedAt),
          );

        setNotes(nextNotes);
        setNotesLoading(false);
      },
      (error) => {
        console.error("Failed to load campaign notes:", error);
        setNotes([]);
        setNotesLoading(false);
      },
    );

    return () => unsubscribe();
  }, [campaignId]);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? null,
    [notes, selectedNoteId],
  );

  /*
   * Migrate the old module.config.noteContent model exactly once.
   * The old browser that still has the local note is the only device capable
   * of performing this migration, which preserves existing work.
   */
  useEffect(() => {
    if (
      !campaignId ||
      selectedNoteId ||
      !config.noteContent?.trim() ||
      migratingLegacyRef.current
    ) {
      return;
    }

    migratingLegacyRef.current = true;

    const migrate = async () => {
      try {
        const noteRef = await addDoc(
          collection(db, "campaigns", campaignId, "notes"),
          {
            title: module.title?.trim() || "DM Notes",
            content: normalizeStoredNoteContent(config.noteContent ?? ""),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
        );

        updateModule(module.id, {
          title: module.title?.trim() || "DM Notes",
          config: {
            ...module.config,
            selectedNoteId: noteRef.id,
            noteContent: undefined,
          },
        });

        setBrowserOpen(false);
      } catch (error) {
        console.error("Failed to migrate legacy workspace note:", error);
        migratingLegacyRef.current = false;
      }
    };

    void migrate();
  }, [
    campaignId,
    selectedNoteId,
    config.noteContent,
    module.id,
    module.title,
    module.config,
    updateModule,
  ]);

  /*
   * If this local workspace points to a note that was deleted on another
   * device, return the module to the note browser.
   */
  useEffect(() => {
    if (notesLoading || !selectedNoteId) return;

    if (!notes.some((note) => note.id === selectedNoteId)) {
      updateModule(module.id, {
        title: "DM Notes",
        config: {
          ...module.config,
          selectedNoteId: undefined,
          noteContent: undefined,
        },
      });

      setBrowserOpen(true);
    }
  }, [
    notes,
    notesLoading,
    selectedNoteId,
    module.id,
    module.config,
    updateModule,
  ]);

  const mentionItems = useMemo<EntityMentionItem[]>(
    () => [
      ...campaignCharacters.map(
        (character): EntityMentionItem => ({
          id: character.id,
          entityType: "player",
          entityKey: character.id,
          label: character.name,
          imageUrl: character.imageUrl,
          meta: [
            character.level ? `Level ${character.level}` : "",
            character.className ?? "",
          ]
            .filter(Boolean)
            .join(" · "),
        }),
      ),
      ...allMonsters.map(
        (monster): EntityMentionItem => ({
          id: `${monster.source}:${monster.id}`,
          entityType: "monster",
          entityKey: `${monster.source}:${monster.id}`,
          label: monster.name,
          imageUrl: monster.img,
          meta: [`CR ${monster.challengeRating}`, monster.type]
            .filter(Boolean)
            .join(" · "),
        }),
      ),
      ...npcs.map(
        (npc): EntityMentionItem => ({
          id: npc.id,
          entityType: "npc",
          entityKey: npc.id,
          label: npc.name,
          imageUrl: npc.imageUrl,
          meta: [npc.species, npc.occupation].filter(Boolean).join(" · "),
        }),
      ),
      ...allItems.map(
        (item): EntityMentionItem => ({
          id: `base:${item.id}`,
          entityType: "item",
          entityKey: `base:${item.id}`,
          label: item.name,
          meta: [
            item.category ? formatLabel(item.category) : "",
            item.magical ? "Magical" : "",
          ]
            .filter(Boolean)
            .join(" · "),
        }),
      ),
    ],
    [campaignCharacters, allMonsters, npcs],
  );

  const mentionItemsRef = useRef(mentionItems);
  useEffect(() => {
    mentionItemsRef.current = mentionItems;
  }, [mentionItems]);

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        blockquote: false,
        bulletList: false,
        code: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        orderedList: false,
        strike: false,
        link: false,
      }),
      createEntityMentionExtension(() => mentionItemsRef.current),
    ],
    [],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: "",
    editorProps: {
      attributes: {
        class: "workspace-note-editor",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      const noteId = selectedNoteIdRef.current;
      if (!noteId || !campaignId) return;

      const content = currentEditor.getHTML();
      pendingContentRef.current = content;

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        const savingNoteId = noteId;
        const savingContent = content;

        void updateDoc(
          doc(db, "campaigns", campaignId, "notes", savingNoteId),
          {
            content: savingContent,
            updatedAt: serverTimestamp(),
          },
        )
          .then(() => {
            if (
              selectedNoteIdRef.current === savingNoteId &&
              pendingContentRef.current === savingContent
            ) {
              pendingContentRef.current = null;
            }
          })
          .catch((error) => {
            console.error("Failed to save note:", error);
          });
      }, 350);
    },
    onSelectionUpdate: () => {
      setEditorRevision((current) => current + 1);
    },
  });

  void editorRevision;

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  /*
   * Load selected/remote content into TipTap. Do not overwrite text while a
   * local debounced save is still pending.
   */
  useEffect(() => {
    if (!editor) return;

    if (!selectedNote) {
      if (!editor.isEmpty) {
        editor.commands.clearContent(false);
      }
      return;
    }

    if (pendingContentRef.current !== null) {
      return;
    }

    const normalized = normalizeStoredNoteContent(selectedNote.content);

    if (editor.getHTML() !== normalized) {
      editor.commands.setContent(normalized, {
        emitUpdate: false,
      });
    }
  }, [editor, selectedNote]);

  useEffect(() => {
    setTitleDraft(selectedNote?.title ?? "");
  }, [selectedNote?.id, selectedNote?.title]);

  const selectNote = (note: CampaignNote) => {
    pendingContentRef.current = null;

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    updateModule(module.id, {
      title: note.title,
      config: {
        ...module.config,
        selectedNoteId: note.id,
        noteContent: undefined,
      },
    });

    setBrowserOpen(false);
    setSearch("");
    setEditingTitle(false);
  };

  const createNote = async () => {
    if (!campaignId) return;

    try {
      const noteRef = await addDoc(
        collection(db, "campaigns", campaignId, "notes"),
        {
          title: "New Note",
          content: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      );

      updateModule(module.id, {
        title: "New Note",
        config: {
          ...module.config,
          selectedNoteId: noteRef.id,
          noteContent: undefined,
        },
      });

      setBrowserOpen(false);
      setSearch("");
      setTitleDraft("New Note");
      setEditingTitle(true);
    } catch (error) {
      console.error("Failed to create note:", error);
      alert("Could not create note.");
    }
  };

  const saveTitle = async () => {
    if (!campaignId || !selectedNote) {
      setEditingTitle(false);
      return;
    }

    const nextTitle = titleDraft.trim() || "Untitled Note";

    try {
      await updateDoc(
        doc(db, "campaigns", campaignId, "notes", selectedNote.id),
        {
          title: nextTitle,
          updatedAt: serverTimestamp(),
        },
      );

      updateModule(module.id, {
        title: nextTitle,
      });

      setTitleDraft(nextTitle);
      setEditingTitle(false);
    } catch (error) {
      console.error("Failed to rename note:", error);
      alert("Could not rename note.");
    }
  };

  const cancelTitleEdit = () => {
    setTitleDraft(selectedNote?.title ?? "");
    setEditingTitle(false);
  };

  const deleteSelectedNote = async () => {
    if (!campaignId || !selectedNote) return;

    const confirmed = window.confirm(
      `Delete "${selectedNote.title}"? This deletes the note from the campaign on every device.`,
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, "campaigns", campaignId, "notes", selectedNote.id),
      );

      updateModule(module.id, {
        title: "DM Notes",
        config: {
          ...module.config,
          selectedNoteId: undefined,
          noteContent: undefined,
        },
      });

      setBrowserOpen(true);
      setEditingTitle(false);
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Could not delete note.");
    }
  };

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notes;

    return notes.filter((note) => note.title.toLowerCase().includes(query));
  }, [notes, search]);

  const handleEditorClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    const mention = target?.closest<HTMLElement>(
      '[data-entity-mention="true"]',
    );

    if (!mention) return;

    const entityType = mention.dataset.entityType;
    const entityKey = mention.dataset.entityKey;
    if (!entityKey) return;

    if (entityType === "monster") {
      selectEntity({
        type: "monster",
        monsterKey: entityKey,
        encounterStatus: "manual",
      });
      return;
    }

    if (entityType === "npc") {
      selectEntity({ type: "npc", npcId: entityKey });
      return;
    }

    if (entityType === "item") {
      selectEntity({ type: "item", itemKey: entityKey });
      return;
    }

    if (entityType === "player") {
      selectCharacter(entityKey);
    }
  };

  if (browserOpen || (!selectedNoteId && !config.noteContent?.trim())) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-black/10">
        <div
          className={`workspace-drag-handle flex h-10 shrink-0 items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-2 ${
            editing ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <i className="fa-solid fa-note-sticky mx-1 shrink-0 text-xs text-emerald-400" />

          <div className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-200">
            Notes
          </div>

          {selectedNote ? (
            <button
              type="button"
              onClick={() => setBrowserOpen(false)}
              title="Back to note"
              className="workspace-no-drag flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <i className="fa-solid fa-arrow-left text-[10px]" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => void createNote()}
            title="Create note"
            className="workspace-no-drag flex h-7 items-center gap-1.5 rounded-md bg-emerald-500 px-2 text-[10px] font-semibold text-white transition hover:bg-emerald-400"
          >
            <i className="fa-solid fa-plus text-[9px]" />
            New
          </button>

          {editing ? (
            <button
              type="button"
              onClick={() => removeModule(module.id)}
              title="Remove notes module"
              className="workspace-no-drag flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          ) : null}
        </div>

        <div className="workspace-no-drag shrink-0 p-2">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500" />
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notes..."
              className="h-8 w-full rounded-lg border border-white/10 bg-black/30 py-1.5 pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-500 focus:border-emerald-500/30"
            />
          </div>
        </div>

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-white/5">
          {notesLoading ? (
            <div className="p-5 text-center text-xs text-zinc-500">
              Loading notes...
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex h-full min-h-32 items-center justify-center p-5 text-center">
              <div>
                <i className="fa-solid fa-note-sticky text-2xl text-zinc-700" />
                <p className="mt-2 text-xs font-semibold text-zinc-400">
                  {notes.length === 0
                    ? "No campaign notes yet"
                    : "No matching notes"}
                </p>
                <button
                  type="button"
                  onClick={() => void createNote()}
                  className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                >
                  Create Note
                </button>
              </div>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => selectNote(note)}
                className={`group flex w-full items-center gap-2.5 border-b border-white/5 px-3 py-2.5 text-left transition last:border-b-0 hover:bg-white/[0.035] ${
                  note.id === selectedNoteId ? "bg-emerald-500/[0.05]" : ""
                }`}
              >
                <i
                  className={`fa-solid fa-note-sticky shrink-0 text-[11px] ${
                    note.id === selectedNoteId
                      ? "text-emerald-400"
                      : "text-zinc-600 group-hover:text-zinc-400"
                  }`}
                />
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-300 group-hover:text-white">
                  {note.title}
                </span>
                {note.id === selectedNoteId ? (
                  <span className="text-[9px] font-medium text-emerald-400">
                    Open
                  </span>
                ) : null}
                <i className="fa-solid fa-chevron-right shrink-0 text-[8px] text-zinc-700" />
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-black/10">
      <div
        className={`workspace-drag-handle flex h-10 shrink-0 items-center gap-1 border-b border-white/10 bg-white/[0.03] px-2 ${
          editing ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <i className="fa-solid fa-note-sticky mx-1 shrink-0 text-xs text-emerald-400" />

        {editingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(event) => setTitleDraft(event.target.value)}
            onBlur={() => void saveTitle()}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void saveTitle();
              }

              if (event.key === "Escape") {
                event.preventDefault();
                cancelTitleEdit();
              }
            }}
            className="workspace-no-drag min-w-0 flex-1 rounded-md border border-emerald-500/30 bg-black/30 px-2 py-1 text-xs font-semibold text-white outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setBrowserOpen(true)}
            title="Browse campaign notes"
            className="workspace-no-drag group flex min-w-0 flex-1 items-center gap-2 text-left"
          >
            <span className="truncate text-xs font-semibold text-zinc-200 group-hover:text-white">
              {selectedNote?.title ?? "Notes"}
            </span>
            <i className="fa-solid fa-chevron-down shrink-0 text-[8px] text-zinc-600 group-hover:text-zinc-400" />
          </button>
        )}

        {selectedNote && !editingTitle ? (
          <button
            type="button"
            onClick={() => setEditingTitle(true)}
            title="Rename note"
            className="workspace-no-drag flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] text-zinc-600 transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-pen" />
          </button>
        ) : null}

        {editor && selectedNote ? (
          <div className="workspace-no-drag ml-1 flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold (Ctrl+B)"
              className={getFormatButtonClass(editor.isActive("bold"))}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic (Ctrl+I)"
              className={getFormatButtonClass(editor.isActive("italic"))}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Underline (Ctrl+U)"
              className={getFormatButtonClass(editor.isActive("underline"))}
            >
              <span className="underline">U</span>
            </button>
          </div>
        ) : null}

        {selectedNote ? (
          <button
            type="button"
            onClick={() => void deleteSelectedNote()}
            title="Delete note"
            className="workspace-no-drag ml-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] text-zinc-600 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <i className="fa-solid fa-trash" />
          </button>
        ) : null}

        {editing ? (
          <button
            type="button"
            onClick={() => removeModule(module.id)}
            title="Remove notes module"
            className="workspace-no-drag ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        ) : null}
      </div>

      <div
        onClick={handleEditorClick}
        className="workspace-no-drag workspace-scrollbar min-h-0 flex-1 overflow-y-auto"
      >
        <EditorContent editor={editor} className="min-h-full" />
      </div>
    </div>
  );
}

export default NotesWorkspaceModule;
