import Mention from "@tiptap/extension-mention";

export type EntityMentionType =
  | "player"
  | "monster"
  | "npc";

export type EntityMentionItem = {
  id: string;

  entityType:
    EntityMentionType;

  /**
   * Player:
   * character document ID
   *
   * Monster:
   * default:goblin
   * campaign:abc123
   *
   * NPC:
   * NPC Firestore document ID
   */
  entityKey: string;

  label: string;

  meta?: string;

  imageUrl?: string;
};

const getEntityTypeFromQuery = (
  query: string,
): EntityMentionType | null => {
  const prefix =
    query
      .trimStart()
      .charAt(0)
      .toLowerCase();

  if (prefix === "p") {
    return "player";
  }

  if (prefix === "m") {
    return "monster";
  }

  if (prefix === "n") {
    return "npc";
  }

  return null;
};

const getSearchTerm = (
  query: string,
) => {
  return query
    .trimStart()
    .slice(1)
    .trim()
    .toLowerCase();
};

const getEntityLetter = (
  type: EntityMentionType,
) => {
  if (type === "player") {
    return "P";
  }

  if (type === "monster") {
    return "M";
  }

  return "N";
};

const createSuggestionRenderer =
  () => {
    let popup:
      | HTMLDivElement
      | null = null;

    let unmountPopup:
      | (() => void)
      | null = null;

    let selectedIndex = 0;

    let currentItems:
      EntityMentionItem[] = [];

    let currentCommand:
      | ((
          item: EntityMentionItem,
        ) => void)
      | null = null;

    const updateSelection =
      () => {
        if (!popup) {
          return;
        }

        const buttons =
          popup.querySelectorAll<HTMLButtonElement>(
            "[data-entity-suggestion-item]",
          );

        buttons.forEach(
          (
            button,
            index,
          ) => {
            button.dataset.selected =
              index ===
              selectedIndex
                ? "true"
                : "false";
          },
        );
      };

    const renderItems = (
      props: {
        items:
          EntityMentionItem[];

        command: (
          item: EntityMentionItem,
        ) => void;
      },
    ) => {
      if (!popup) {
        return;
      }

      currentItems =
        props.items;

      currentCommand =
        props.command;

      selectedIndex =
        Math.min(
          selectedIndex,
          Math.max(
            0,
            currentItems.length -
              1,
          ),
        );

      popup.replaceChildren();

      if (
        currentItems.length ===
        0
      ) {
        const empty =
          document.createElement(
            "div",
          );

        empty.className =
          "entity-suggestion-empty";

        empty.textContent =
          "No matches";

        popup.appendChild(
          empty,
        );

        return;
      }

      currentItems.forEach(
        (
          item,
          index,
        ) => {
          const button =
            document.createElement(
              "button",
            );

          button.type =
            "button";

          button.className =
            "entity-suggestion-item";

          button.dataset.entitySuggestionItem =
            "true";

          button.dataset.selected =
            index ===
            selectedIndex
              ? "true"
              : "false";

          const badge =
            document.createElement(
              "span",
            );

          badge.className = `entity-suggestion-badge entity-suggestion-badge--${item.entityType}`;

          badge.textContent =
            getEntityLetter(
              item.entityType,
            );

          const text =
            document.createElement(
              "span",
            );

          text.className =
            "entity-suggestion-text";

          const label =
            document.createElement(
              "span",
            );

          label.className =
            "entity-suggestion-label";

          label.textContent =
            item.label;

          text.appendChild(
            label,
          );

          if (item.meta) {
            const meta =
              document.createElement(
                "span",
              );

            meta.className =
              "entity-suggestion-meta";

            meta.textContent =
              item.meta;

            text.appendChild(
              meta,
            );
          }

          button.appendChild(
            badge,
          );

          button.appendChild(
            text,
          );

          button.addEventListener(
            "mouseenter",
            () => {
              selectedIndex =
                index;

              updateSelection();
            },
          );

          button.addEventListener(
            "mousedown",
            (event) => {
              event.preventDefault();

              props.command(item);
            },
          );

          popup?.appendChild(
            button,
          );
        },
      );
    };

    return {
      onStart(
        props: {
          items:
            EntityMentionItem[];

          command: (
            item: EntityMentionItem,
          ) => void;

          mount: (
            element:
              HTMLElement,
          ) => () => void;
        },
      ) {
        popup =
          document.createElement(
            "div",
          );

        popup.className =
          "entity-suggestion-popup";

        selectedIndex = 0;

        unmountPopup =
          props.mount(popup);

        renderItems(props);
      },

      onUpdate(
        props: {
          items:
            EntityMentionItem[];

          command: (
            item: EntityMentionItem,
          ) => void;
        },
      ) {
        renderItems(props);
      },

      onKeyDown(
        props: {
          event:
            KeyboardEvent;
        },
      ) {
        if (
          props.event.key ===
          "Escape"
        ) {
          return false;
        }

        if (
          currentItems.length ===
          0
        ) {
          return false;
        }

        if (
          props.event.key ===
          "ArrowDown"
        ) {
          selectedIndex =
            (selectedIndex + 1) %
            currentItems.length;

          updateSelection();

          return true;
        }

        if (
          props.event.key ===
          "ArrowUp"
        ) {
          selectedIndex =
            (selectedIndex -
              1 +
              currentItems.length) %
            currentItems.length;

          updateSelection();

          return true;
        }

        if (
          props.event.key ===
          "Enter"
        ) {
          const selected =
            currentItems[
              selectedIndex
            ];

          if (
            selected &&
            currentCommand
          ) {
            currentCommand(
              selected,
            );

            return true;
          }
        }

        return false;
      },

      onExit() {
        unmountPopup?.();

        popup = null;

        unmountPopup = null;

        currentItems = [];

        currentCommand = null;

        selectedIndex = 0;
      },
    };
  };

export const createEntityMentionExtension =
  (
    getItems: () =>
      EntityMentionItem[],
  ) => {
    return Mention.extend({
      name:
        "entityMention",

      addAttributes() {
        return {
          ...(
            this.parent?.() ??
            {}
          ),

          /*
           * Explicitly persist the visible label.
           *
           * This is the important fix.
           */
          label: {
            default: null,

            parseHTML:
              (element) =>
                element.getAttribute(
                  "data-label",
                ) ??
                element.textContent ??
                null,

            renderHTML:
              (attributes) => {
                if (
                  !attributes.label
                ) {
                  return {};
                }

                return {
                  "data-label":
                    attributes.label,
                };
              },
          },

          entityType: {
            default: null,

            parseHTML:
              (element) =>
                element.getAttribute(
                  "data-entity-type",
                ),

            renderHTML:
              (attributes) => {
                if (
                  !attributes.entityType
                ) {
                  return {};
                }

                return {
                  "data-entity-type":
                    attributes.entityType,
                };
              },
          },

          entityKey: {
            default: null,

            parseHTML:
              (element) =>
                element.getAttribute(
                  "data-entity-key",
                ),

            renderHTML:
              (attributes) => {
                if (
                  !attributes.entityKey
                ) {
                  return {};
                }

                return {
                  "data-entity-key":
                    attributes.entityKey,
                };
              },
          },
        };
      },
    }).configure({
      HTMLAttributes: {
        class:
          "entity-mention",
      },

      renderText({
        node,
      }) {
        return (
          node.attrs.label ??
          node.attrs.id ??
          ""
        );
      },

      renderHTML({
        node,
      }) {
        const entityType =
          node.attrs.entityType as
            | EntityMentionType
            | null;

        const entityKey =
          typeof node.attrs
            .entityKey ===
          "string"
            ? node.attrs
                .entityKey
            : "";

        const label =
          typeof node.attrs
            .label ===
          "string"
            ? node.attrs.label
            : typeof node.attrs
                  .id ===
                "string"
              ? node.attrs.id
              : "";

        return [
          "span",

          {
            "data-type":
              "entityMention",

            "data-entity-mention":
              "true",

            "data-entity-type":
              entityType ??
              "",

            "data-entity-key":
              entityKey,

            /*
             * Critical:
             * persist the human-readable name too.
             */
            "data-label":
              label,

            class: `entity-mention entity-mention--${entityType ?? "unknown"}`,
          },

          label,
        ];
      },

      suggestion: {
        char: "@",

        allowSpaces: true,

        items: ({
          query,
        }) => {
          const entityType =
            getEntityTypeFromQuery(
              query,
            );

          if (!entityType) {
            return [];
          }

          const term =
            getSearchTerm(
              query,
            );

          return getItems()
            .filter(
              (item) => {
                if (
                  item.entityType !==
                  entityType
                ) {
                  return false;
                }

                if (!term) {
                  return true;
                }

                return [
                  item.label,
                  item.meta ?? "",
                ]
                  .join(" ")
                  .toLowerCase()
                  .includes(term);
              },
            )
            .slice(0, 8);
        },

        render:
          createSuggestionRenderer,
      },
    });
  };