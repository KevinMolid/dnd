import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";

function GMNoteNodeView({ node, editor, updateAttributes }: NodeViewProps) {
  return (
    <NodeViewWrapper
      className="gm-note-block"
      data-gm-note="true"
      data-gm-note-title={(node.attrs.title as string) || "GM NOTE"}
    >
      {editor.isEditable ? (
        <input
          type="text"
          value={(node.attrs.title as string) || ""}
          onChange={(event) =>
            updateAttributes({
              title: event.target.value,
            })
          }
          onBlur={(event) => {
            if (!event.target.value.trim()) {
              updateAttributes({
                title: "GM NOTE",
              });
            }
          }}
          spellCheck={false}
          placeholder="GM NOTE"
          aria-label="GM note title"
          className="gm-note-title gm-note-title-input"
        />
      ) : (
        <div className="gm-note-title">
          {(node.attrs.title as string) || "GM NOTE"}
        </div>
      )}

      <NodeViewContent className="gm-note-content" />
    </NodeViewWrapper>
  );
}

export const GMNoteExtension = Node.create({
  name: "gmNote",

  group: "block",
  content: "block+",
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      title: {
        default: "GM NOTE",

        parseHTML: (element) =>
          element.getAttribute("data-gm-note-title") || "GM NOTE",

        renderHTML: (attributes) => ({
          "data-gm-note-title": attributes.title,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-gm-note="true"]',

        /*
         * Only the contents of .gm-note-content belong to the
         * ProseMirror node. The title is stored as an attribute.
         */
        contentElement: ".gm-note-content",

        getAttrs: (element) => ({
          title:
            (element as HTMLElement).getAttribute("data-gm-note-title") ||
            "GM NOTE",
        }),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-gm-note": "true",
        "data-gm-note-title": node.attrs.title || "GM NOTE",
        class: "gm-note-block",
      }),

      [
        "div",
        {
          class: "gm-note-title",
          "data-gm-note-title-display": "true",
        },
        node.attrs.title || "GM NOTE",
      ],

      [
        "div",
        {
          class: "gm-note-content",
        },
        0,
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(GMNoteNodeView);
  },

  addCommands() {
    return {
      toggleGMNote:
        (title = "GM NOTE") =>
        ({ state, dispatch }) => {
          const { selection, schema } = state;
          const gmNoteType = schema.nodes[this.name];

          if (!gmNoteType) {
            return false;
          }

          const { $from, $to } = selection;

          /*
           * If already inside a GM Note, unwrap it.
           */
          let gmNoteDepth: number | null = null;

          for (let depth = $from.depth; depth > 0; depth -= 1) {
            if ($from.node(depth).type === gmNoteType) {
              gmNoteDepth = depth;
              break;
            }
          }

          if (gmNoteDepth !== null) {
            if (!dispatch) {
              return true;
            }

            const start = $from.before(gmNoteDepth);
            const gmNoteNode = state.doc.nodeAt(start);

            if (!gmNoteNode) {
              return false;
            }

            const tr = state.tr.replaceWith(
              start,
              start + gmNoteNode.nodeSize,
              gmNoteNode.content,
            );

            dispatch(tr.scrollIntoView());

            return true;
          }

          /*
           * Otherwise wrap the selected blocks.
           */
          const range = $from.blockRange($to);

          if (!range) {
            return false;
          }

          const selectedNodes = [];

          for (
            let index = range.startIndex;
            index < range.endIndex;
            index += 1
          ) {
            selectedNodes.push(range.parent.child(index));
          }

          if (selectedNodes.length === 0) {
            return false;
          }

          if (selectedNodes.some((child) => child.type === gmNoteType)) {
            return false;
          }

          const gmNoteNode = gmNoteType.create(
            {
              title: title.trim() || "GM NOTE",
            },
            selectedNodes,
          );

          if (!dispatch) {
            return true;
          }

          const tr = state.tr.replaceWith(range.start, range.end, gmNoteNode);

          dispatch(tr.scrollIntoView());

          return true;
        },

      setGMNoteTitle:
        (title: string) =>
        ({ state, dispatch }) => {
          const { $from } = state.selection;
          const gmNoteType = state.schema.nodes[this.name];

          if (!gmNoteType) {
            return false;
          }

          for (let depth = $from.depth; depth > 0; depth -= 1) {
            const currentNode = $from.node(depth);

            if (currentNode.type !== gmNoteType) {
              continue;
            }

            if (!dispatch) {
              return true;
            }

            const position = $from.before(depth);

            dispatch(
              state.tr.setNodeMarkup(position, undefined, {
                ...currentNode.attrs,
                title: title.trim() || "GM NOTE",
              }),
            );

            return true;
          }

          return false;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-g": () => this.editor.commands.toggleGMNote(),
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    gmNote: {
      toggleGMNote: (title?: string) => ReturnType;

      setGMNoteTitle: (title: string) => ReturnType;
    };
  }
}

export default GMNoteExtension;
