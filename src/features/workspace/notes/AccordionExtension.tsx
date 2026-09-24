import { Node, mergeAttributes } from "@tiptap/core";
import { Fragment, Slice } from "@tiptap/pm/model";
import { Plugin, TextSelection } from "@tiptap/pm/state";
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
  getPos,
  deleteNode,
}: NodeViewProps) {
  const storedOpen = node.attrs.open !== false;
  const [localOpen, setLocalOpen] = useState(storedOpen);
  const [, refresh] = useState(0);

  useEffect(() => setLocalOpen(storedOpen), [storedOpen]);

useEffect(() => {
  const update = () => {
    refresh((value) => value + 1);
  };

  editor.on("transaction", update);

  return () => {
    editor.off("transaction", update);
  };
}, [editor]);

  const open = editor.isEditable ? storedOpen : localOpen;

  const toggleOpen = () => {
    if (editor.isEditable) updateAttributes({ open: !storedOpen });
    else setLocalOpen((current) => !current);
  };

  const getAccordionDepth = () => {
    const pos = getPos();
    if (typeof pos !== "number") return 0;

    const $pos = editor.state.doc.resolve(pos);
    let depth = 0;

    for (let d = 0; d <= $pos.depth; d += 1) {
      if ($pos.node(d).type.name === "accordion") depth += 1;
    }

    return depth;
  };

  const accordionDepth = getAccordionDepth();
  const isNested = accordionDepth > 0;

  const insertParagraphBefore = () => {
    const pos = getPos();
    if (typeof pos !== "number") return;

    editor
      .chain()
      .focus()
      .insertContentAt(pos, { type: "paragraph" })
      .setTextSelection(pos + 1)
      .run();
  };

  const insertParagraphAfter = () => {
    const pos = getPos();
    if (typeof pos !== "number") return;

    const insertPos = pos + node.nodeSize;

    editor
      .chain()
      .focus()
      .insertContentAt(insertPos, { type: "paragraph" })
      .setTextSelection(insertPos + 1)
      .run();
  };

  return (
    <NodeViewWrapper
      className={`note-accordion group/accordion relative my-1 overflow-visible border-b border-white/[0.07] pb-1 ${
        isNested ? "ml-3" : ""
      } ${
        selected && editor.isEditable ? "rounded-md bg-white/[0.015]" : ""
      }`}
      data-accordion="true"
      data-accordion-depth={accordionDepth}
    >
      <div
        className="group/title flex min-h-7 items-center gap-1.5 rounded-md transition hover:bg-white/[0.025]"
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
              updateAttributes({ title: event.target.value })
            }
            spellCheck={false}
            placeholder="Section title"
            className="min-w-0 flex-1 bg-transparent py-1 text-xs font-semibold text-zinc-200 outline-none placeholder:text-zinc-600"
          />
        ) : (
          <div className="min-w-0 flex-1 py-1 text-xs font-semibold text-zinc-200">
            {(node.attrs.title as string) || "Section"}
          </div>
        )}

        {editor.isEditable ? (
          <div className="flex shrink-0 items-center gap-0.5 pr-1 opacity-0 transition group-hover/title:opacity-100">
            <button
              type="button"
              onClick={insertParagraphBefore}
              title="Add text above"
              className="flex h-6 w-6 items-center justify-center rounded-md text-[9px] text-zinc-500 transition hover:bg-white/10 hover:text-white"
            >
              <span className="relative block h-3 w-3">
                <i className="fa-solid fa-plus absolute left-0.5 top-1 text-[7px]" />
                <i className="fa-solid fa-arrow-up absolute right-0 top-0 text-[6px]" />
              </span>
            </button>

            <button
              type="button"
              onClick={insertParagraphAfter}
              title="Add text below"
              className="flex h-6 w-6 items-center justify-center rounded-md text-[9px] text-zinc-500 transition hover:bg-white/10 hover:text-white"
            >
              <span className="relative block h-3 w-3">
                <i className="fa-solid fa-plus absolute left-0.5 top-1 text-[7px]" />
                <i className="fa-solid fa-arrow-down absolute bottom-0 right-0 text-[6px]" />
              </span>
            </button>

            <div className="mx-0.5 h-3 w-px bg-white/10" />

            <button
              type="button"
              onClick={deleteNode}
              title="Delete section"
              className="flex h-6 w-6 items-center justify-center rounded-md text-[9px] text-zinc-600 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        ) : null}
      </div>

      <div className={open ? "block" : "hidden"}>
        <NodeViewContent className="note-accordion-content min-h-6" />
      </div>
    </NodeViewWrapper>
  );
}

export const AccordionExtension = Node.create({
  name: "accordion",
  priority: 1000,
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
        renderHTML: (attributes) => ({ "data-title": attributes.title }),
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
      mergeAttributes(HTMLAttributes, { "data-note-accordion": "true" }),
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
            attrs: { title, open: true },
            content: [{ type: "paragraph" }],
          }),
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-a": () =>
        this.editor.commands.insertAccordion("New section"),
    };
  },

  addProseMirrorPlugins() {
    const accordionTypeName = this.name;

    const unwrapAccordions = (fragment: Fragment): Fragment => {
      const nodes: any[] = [];

      fragment.forEach((node) => {
        if (node.type.name === accordionTypeName) {
          unwrapAccordions(node.content).forEach((child) => nodes.push(child));
        } else if (node.content.size > 0) {
          nodes.push(node.copy(unwrapAccordions(node.content)));
        } else {
          nodes.push(node);
        }
      });

      return Fragment.fromArray(nodes);
    };

    return [
      new Plugin({
        props: {
          transformCopied: (slice) =>
            new Slice(unwrapAccordions(slice.content), 0, 0),

          handleKeyDown: (view, event) => {
            const { state } = view;
            const { selection } = state;
            const { $from } = selection;

            if (
              event.key !== "Backspace" ||
              !selection.empty ||
              $from.parent.type.name !== "paragraph" ||
              $from.parent.content.size !== 0 ||
              $from.parentOffset !== 0
            ) {
              return false;
            }

            const paragraphDepth = $from.depth;
            if (paragraphDepth < 1) return false;

            const containerDepth = paragraphDepth - 1;
            const container = $from.node(containerDepth);
            const paragraphIndex = $from.index(containerDepth);

            // An accordion must always retain at least one block.
            if (
              container.type.name === accordionTypeName &&
              container.childCount === 1
            ) {
              event.preventDefault();
              return true;
            }

            // Preserve the special case for an empty paragraph directly
            // before an accordion, at root level or inside another accordion.
            if (paragraphIndex >= container.childCount - 1) return false;

            const nextNode = container.child(paragraphIndex + 1);
            if (nextNode.type.name !== accordionTypeName) return false;

            const paragraphFrom = $from.before(paragraphDepth);
            const paragraphTo = $from.after(paragraphDepth);
            const tr = state.tr.delete(paragraphFrom, paragraphTo);

            const mappedPosition = tr.mapping.map(paragraphFrom);
            const nextSelection = TextSelection.findFrom(
              tr.doc.resolve(mappedPosition),
              1,
              true,
            );

            if (nextSelection) tr.setSelection(nextSelection);

            view.dispatch(tr.scrollIntoView());
            event.preventDefault();
            return true;
          },
        },
      }),
    ];
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
