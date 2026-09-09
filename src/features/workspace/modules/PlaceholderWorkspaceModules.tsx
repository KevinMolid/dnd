import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import useMonsterLibrary from "../../../hooks/useMonsterLibrary";

import useNpcLibrary from "../../../hooks/useNpcLibrary";

import useCampaignPageData from "../../campaigns/hooks/useCampaignPageData";

import {
  createEntityMentionExtension,
  type EntityMentionItem,
} from "../notes/entityMention";

import { useWorkspace } from "../WorkspaceContext";

import type { WorkspaceModuleRenderProps } from "../workspaceTypes";

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const normalizeStoredNoteContent = (value: string) => {
  if (!value.trim()) {
    return "";
  }

  const appearsToBeHtml = /<\/?[a-z][\s\S]*>/i.test(value);

  if (appearsToBeHtml) {
    return value;
  }

  return `<p>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`;
};

const getFormatButtonClass = (active: boolean) => {
  return `workspace-no-drag flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] transition ${
    active
      ? "bg-emerald-500/15 text-emerald-300"
      : "text-zinc-500 hover:bg-white/10 hover:text-white"
  }`;
};

export function NotesWorkspaceModule({
  module,
  campaignId,
  editing,
  updateModule,
  removeModule,
}: WorkspaceModuleRenderProps) {
  const noteContent = module.config?.noteContent ?? "";

  const [editingTitle, setEditingTitle] = useState(false);

  const [titleDraft, setTitleDraft] = useState(module.title);

  const [editorRevision, setEditorRevision] = useState(0);

  const { campaignCharacters } = useCampaignPageData(campaignId);

  const { allMonsters } = useMonsterLibrary(campaignId);

  const { npcs } = useNpcLibrary(campaignId);

  const { selectEntity } = useWorkspace();

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
    ],
    [campaignCharacters, allMonsters, npcs],
  );

  const mentionItemsRef = useRef(mentionItems);

  useEffect(() => {
    mentionItemsRef.current = mentionItems;
  }, [mentionItems]);

  const moduleRef = useRef(module);

  const updateModuleRef = useRef(updateModule);

  useEffect(() => {
    moduleRef.current = module;
  }, [module]);

  useEffect(() => {
    updateModuleRef.current = updateModule;
  }, [updateModule]);

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

    content: normalizeStoredNoteContent(noteContent),

    editorProps: {
      attributes: {
        class: "workspace-note-editor",
      },
    },

    onUpdate: ({ editor: currentEditor }) => {
      const currentModule = moduleRef.current;

      updateModuleRef.current(currentModule.id, {
        config: {
          ...currentModule.config,

          noteContent: currentEditor.getHTML(),
        },
      });
    },

    onSelectionUpdate: () => {
      setEditorRevision((current) => current + 1);
    },
  });

  void editorRevision;

  useEffect(() => {
    if (!editor) {
      return;
    }

    const normalized = normalizeStoredNoteContent(noteContent);

    if (!normalized && editor.isEmpty) {
      return;
    }

    if (editor.getHTML() === normalized) {
      return;
    }

    editor.commands.setContent(normalized, {
      emitUpdate: false,
    });
  }, [editor, noteContent]);

  useEffect(() => {
    setTitleDraft(module.title);
  }, [module.title]);

  const saveTitle = () => {
    const trimmed = titleDraft.trim();

    const nextTitle = trimmed || "DM Notes";

    updateModule(module.id, {
      title: nextTitle,
    });

    setTitleDraft(nextTitle);

    setEditingTitle(false);
  };

  const cancelTitleEdit = () => {
    setTitleDraft(module.title);

    setEditingTitle(false);
  };

  const handleEditorClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;

    const mention = target?.closest<HTMLElement>(
      '[data-entity-mention="true"]',
    );

    if (!mention) {
      return;
    }

    const entityType = mention.dataset.entityType;

    const entityKey = mention.dataset.entityKey;

    if (entityType === "monster" && entityKey) {
      selectEntity({
        type: "monster",

        monsterKey: entityKey,

        encounterStatus: "manual",
      });
    }
  };

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
            onBlur={saveTitle}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();

                saveTitle();
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
            onClick={() => setEditingTitle(true)}
            title="Rename notes"
            className="workspace-no-drag group flex min-w-0 flex-1 items-center gap-2 text-left"
          >
            <span className="truncate text-xs font-semibold text-zinc-200 group-hover:text-white">
              {module.title}
            </span>

            <i className="fa-solid fa-pen shrink-0 text-[9px] text-zinc-700 opacity-0 transition group-hover:opacity-100" />
          </button>
        )}

        {editor ? (
          <div className="workspace-no-drag ml-auto flex shrink-0 items-center gap-0.5">
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
