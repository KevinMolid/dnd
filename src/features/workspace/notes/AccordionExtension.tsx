import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { useEffect, useState } from "react";

function AccordionNodeView({
  node,
  editor,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const storedOpen = node.attrs.open !== false;
  const [localOpen, setLocalOpen] = useState(storedOpen);

  useEffect(() => {
    setLocalOpen(storedOpen);
  }, [storedOpen]);

  const open = editor.isEditable ? storedOpen : localOpen;

  const toggleOpen = () => {
    if (editor.isEditable) {
      updateAttributes({ open: !storedOpen });
    } else {
      setLocalOpen((current) => !current);
    }
  };

  return (
    <NodeViewWrapper
      className={`note-accordion my-2 overflow-hidden rounded-lg border ${
        selected && editor.isEditable
          ? "border-emerald-500/30"
          : "border-white/10"
      } bg-black/15`}
      data-accordion="true"
    >
      <div
        className="flex min-h-8 items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.025] px-2"
        contentEditable={false}
      >
        <button
          type="button"
          onClick={toggleOpen}
          title={open ? "Collapse section" : "Expand section"}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] text-zinc-500 transition hover:bg-white/10 hover:text-white"
        >
          <i
            className={`fa-solid fa-chevron-right transition-transform ${
              open ? "rotate-90" : ""
            }`}
          />
        </button>

        {editor.isEditable ? (
          <input
            value={(node.attrs.title as string) || ""}
            onChange={(event) =>
              updateAttributes({
                title: event.target.value,
              })
            }
            placeholder="Section title"
            className="min-w-0 flex-1 bg-transparent py-1 text-xs font-semibold text-zinc-200 outline-none placeholder:text-zinc-600"
          />
        ) : (
          <div className="min-w-0 flex-1 py-1 text-xs font-semibold text-zinc-200">
            {(node.attrs.title as string) || "Section"}
          </div>
        )}
      </div>

      <div className={open ? "block" : "hidden"}>
        <NodeViewContent className="note-accordion-content min-h-9 px-3 py-2" />
      </div>
    </NodeViewWrapper>
  );
}

export const AccordionExtension = Node.create({
  name: "accordion",
  group: "block",
  content: "block+",
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      title: {
        default: "New section",
        parseHTML: (element) =>
          element.getAttribute("data-title") || "New section",
        renderHTML: (attributes) => ({
          "data-title": attributes.title,
        }),
      },

      open: {
        default: true,
        parseHTML: (element) => element.getAttribute("data-open") !== "false",
        renderHTML: (attributes) => ({
          "data-open": attributes.open === false ? "false" : "true",
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-note-accordion="true"]',
        contentElement: '[data-note-accordion-content="true"]',
        getAttrs: (element) => ({
          title:
            (element as HTMLElement).getAttribute("data-title") ||
            "New section",
          open: (element as HTMLElement).getAttribute("data-open") !== "false",
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-note-accordion": "true",
      }),
      ["div", { "data-note-accordion-content": "true" }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AccordionNodeView);
  },

  addCommands() {
    return {
      insertAccordion:
        (title = "New section") =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              title,
              open: true,
            },
            content: [{ type: "paragraph" }],
          }),
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-a": () => this.editor.commands.insertAccordion("New section"),
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    accordion: {
      insertAccordion: (title?: string) => ReturnType;
    };
  }
}

export default AccordionExtension;
