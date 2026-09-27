import { Node, mergeAttributes } from "@tiptap/core";

export const ReadAloudExtension = Node.create({
  name: "readAloud",

  group: "block",
  content: "block+",
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-read-aloud="true"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-read-aloud": "true",
        class: "read-aloud-block",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      toggleReadAloud:
        () =>
        ({ state, dispatch }) => {
          const { selection, schema } = state;
          const readAloudType = schema.nodes[this.name];

          if (!readAloudType) {
            return false;
          }

          const { $from, $to } = selection;

          // If the selection/cursor is already inside a Read Aloud block,
          // unwrap the entire block back into its normal child blocks.
          let readAloudDepth: number | null = null;

          for (let depth = $from.depth; depth > 0; depth -= 1) {
            if ($from.node(depth).type === readAloudType) {
              readAloudDepth = depth;
              break;
            }
          }

          if (readAloudDepth !== null) {
            if (!dispatch) {
              return true;
            }

            const start = $from.before(readAloudDepth);
            const readAloudNode = state.doc.nodeAt(start);

            if (!readAloudNode) {
              return false;
            }

            const tr = state.tr.replaceWith(
              start,
              start + readAloudNode.nodeSize,
              readAloudNode.content,
            );

            dispatch(tr.scrollIntoView());
            return true;
          }

          // Wrap all complete block nodes touched by the selection.
          // This lets a selection spanning several paragraphs become one box.
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

          // Do not create nested Read Aloud blocks.
          if (selectedNodes.some((node) => node.type === readAloudType)) {
            return false;
          }

          const readAloudNode = readAloudType.create(null, selectedNodes);

          if (!dispatch) {
            return true;
          }

          const tr = state.tr.replaceWith(
            range.start,
            range.end,
            readAloudNode,
          );

          dispatch(tr.scrollIntoView());
          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-r": () => this.editor.commands.toggleReadAloud(),
    };
  },
});

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    readAloud: {
      toggleReadAloud: () => ReturnType;
    };
  }
}

export default ReadAloudExtension;
