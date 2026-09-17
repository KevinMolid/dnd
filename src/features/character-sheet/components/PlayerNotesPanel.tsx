import { useEffect, useMemo, useRef, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import AccordionExtension from "../../workspace/notes/AccordionExtension";

type SaveState = "saved" | "saving" | "error";

type PlayerNotesPanelProps = {
  value?: string | null;
  onSave: (notes: string) => Promise<void>;
};

const AUTOSAVE_DELAY_MS = 700;

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

  if (appearsToBeHtml) {
    return value;
  }

  return `<p>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`;
};

const getFormatButtonClass = (active: boolean) =>
  `flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] transition ${
    active
      ? "bg-emerald-500/15 text-emerald-300"
      : "text-zinc-500 hover:bg-white/10 hover:text-white"
  }`;

const PlayerNotesPanel = ({
  value: savedValue = "",
  onSave,
}: PlayerNotesPanelProps) => {
  const normalizedSavedValue = savedValue ?? "";

  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [editorRevision, setEditorRevision] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDraftRef = useRef(normalizedSavedValue);
  const lastSavedRef = useRef(normalizedSavedValue);

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

      AccordionExtension,
    ],
    [],
  );

  const saveDraft = async (nextValue: string) => {
    if (nextValue === lastSavedRef.current) {
      setSaveState("saved");
      return;
    }

    setSaveState("saving");

    try {
      await onSave(nextValue);

      lastSavedRef.current = nextValue;

      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const queueSave = (nextValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (nextValue === lastSavedRef.current) {
      setSaveState("saved");
      return;
    }

    setSaveState("saving");

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;

      void saveDraft(nextValue);
    }, AUTOSAVE_DELAY_MS);
  };

  const editor = useEditor({
    immediatelyRender: false,

    extensions,

    content: normalizeStoredNoteContent(normalizedSavedValue),

    editorProps: {
      attributes: {
        class: "workspace-note-editor min-h-full",
      },
    },

    onUpdate: ({ editor: currentEditor }) => {
      const nextValue = currentEditor.getHTML();

      latestDraftRef.current = nextValue;

      queueSave(nextValue);
    },

    onSelectionUpdate: () => {
      setEditorRevision((current) => current + 1);
    },

    onBlur: ({ editor: currentEditor }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const nextValue = currentEditor.getHTML();

      latestDraftRef.current = nextValue;

      void saveDraft(nextValue);
    },
  });

  void editorRevision;

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (normalizedSavedValue === lastSavedRef.current) {
      return;
    }

    lastSavedRef.current = normalizedSavedValue;
    latestDraftRef.current = normalizedSavedValue;

    const nextContent = normalizeStoredNoteContent(normalizedSavedValue);

    if (editor.getHTML() !== nextContent) {
      editor.commands.setContent(nextContent, {
        emitUpdate: false,
      });
    }

    setSaveState("saved");
  }, [editor, normalizedSavedValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-black/20">
      <div className="flex h-10 shrink-0 items-center gap-0.5 border-b border-white/[0.08] bg-white/[0.025] px-2">
        {editor ? (
          <>
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

            <div className="mx-1 h-4 w-px bg-white/10" />

            <button
              type="button"
              onClick={() =>
                editor.chain().focus().insertAccordion("New section").run()
              }
              title="Insert accordion (Ctrl+Alt+A)"
              className={getFormatButtonClass(false)}
            >
              <i className="fa-solid fa-bars-staggered text-[9px]" />
            </button>
          </>
        ) : null}

        <div className="ml-auto px-1">
          <SaveIndicator state={saveState} />
        </div>
      </div>

      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="min-h-[390px] p-4 text-sm leading-6 text-zinc-200"
        />
      </div>
    </div>
  );
};

const SaveIndicator = ({ state }: { state: SaveState }) => {
  if (state === "saving") {
    return (
      <span className="text-[10px] font-medium text-amber-300">Saving…</span>
    );
  }

  if (state === "error") {
    return (
      <span className="text-[10px] font-medium text-rose-300">Save failed</span>
    );
  }

  return <span className="text-[10px] font-medium text-zinc-500">Saved</span>;
};

export default PlayerNotesPanel;
