import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import AccordionExtension from "../workspace/notes/AccordionExtension";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeightClassName?: string;
};

export function normalizeRichTextContent(value: string) {
  if (!value.trim()) return "";

  if (/<\/?[a-z][\s\S]*>/i.test(value)) {
    return value;
  }

  const escaped = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  return `<p>${escaped.replace(/\n/g, "<br>")}</p>`;
}

const formatButtonClass = (active: boolean) =>
  `flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] transition ${
    active
      ? "bg-emerald-500/15 text-emerald-300"
      : "text-zinc-500 hover:bg-white/10 hover:text-white"
  }`;

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write here...",
  minHeightClassName = "min-h-[260px]",
}: RichTextEditorProps) {
  const [revision, setRevision] = useState(0);

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

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: normalizeRichTextContent(value),
    editorProps: {
      attributes: {
        class: `workspace-note-editor ${minHeightClassName} outline-none`,
        "data-placeholder": placeholder,
        spellcheck: "false",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    onSelectionUpdate: () => {
      setRevision((current) => current + 1);
    },
  });

  void revision;

  useEffect(() => {
    if (!editor) return;

    const normalized = normalizeRichTextContent(value);
    if (editor.getHTML() !== normalized) {
      editor.commands.setContent(normalized, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/20">
      <div className="flex h-9 items-center gap-0.5 border-b border-white/[0.08] bg-white/[0.025] px-2">
        {editor ? (
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold (Ctrl+B)"
              className={formatButtonClass(editor.isActive("bold"))}
            >
              <strong>B</strong>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic (Ctrl+I)"
              className={formatButtonClass(editor.isActive("italic"))}
            >
              <em>I</em>
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Underline (Ctrl+U)"
              className={formatButtonClass(editor.isActive("underline"))}
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
              className={formatButtonClass(false)}
            >
              <i className="fa-solid fa-bars-staggered text-[9px]" />
            </button>
          </>
        ) : null}
      </div>

      <div className="workspace-scrollbar max-h-[520px] overflow-y-auto">
        <EditorContent
          editor={editor}
          className={`px-3 py-3 text-sm leading-6 text-zinc-200 ${minHeightClassName}`}
        />
      </div>
    </div>
  );
}
