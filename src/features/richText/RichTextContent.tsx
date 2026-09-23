import { useEffect, useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import AccordionExtension from "../workspace/notes/AccordionExtension";
import { normalizeRichTextContent } from "./RichTextEditor";

type RichTextContentProps = {
  value: string;
};

export default function RichTextContent({ value }: RichTextContentProps) {
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
    editable: false,
    extensions,
    content: normalizeRichTextContent(value),
    editorProps: {
      attributes: {
        class: "workspace-note-editor outline-none",
        spellcheck: "false",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const normalized = normalizeRichTextContent(value);
    if (editor.getHTML() !== normalized) {
      editor.commands.setContent(normalized, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <EditorContent
      editor={editor}
      className="text-sm leading-6 text-zinc-200"
    />
  );
}
