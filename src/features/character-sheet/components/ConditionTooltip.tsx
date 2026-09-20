import { type ReactNode, useState } from "react";

import { createPortal } from "react-dom";

import type { ConditionDefinition } from "../../../rulesets/dnd/dnd2024/data/conditions";

type ConditionTooltipProps = {
  condition: ConditionDefinition;
  children: ReactNode;
};

const ConditionTooltip = ({ condition, children }: ConditionTooltipProps) => {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  const close = () => {
    setPinned(false);
    setOpen(false);
  };

  const togglePinned = () => {
    setPinned((current) => {
      const next = !current;
      setOpen(next);
      return next;
    });
  };

  return (
    <>
      <span
        className="inline-flex"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => {
          if (!pinned) {
            setOpen(false);
          }
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          if (!pinned) {
            setOpen(false);
          }
        }}
      >
        <span
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onClick={(event) => {
            event.stopPropagation();
            togglePinned();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              togglePinned();
            }
          }}
        >
          {children}
        </span>
      </span>

      {open
        ? createPortal(
            <div className="pointer-events-auto fixed bottom-4 right-4 z-[160] w-[390px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur">
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {condition.name}
                  </h3>

                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-rose-300/70">
                    Condition
                  </p>
                </div>

                <button
                  type="button"
                  onClick={close}
                  aria-label={`Close ${condition.name} details`}
                  title="Close"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-base text-zinc-400 transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="workspace-scrollbar max-h-[360px] overflow-y-auto">
                <div className="px-4 py-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                    {condition.description}
                  </p>
                </div>

                {condition.notes?.length ? (
                  <div className="border-t border-white/[0.06] px-4 py-3">
                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                      Notes
                    </h4>

                    <ul className="space-y-2">
                      {condition.notes.map((note, index) => (
                        <li
                          key={`${condition.id}-note-${index}`}
                          className="flex items-start gap-2 text-xs leading-5 text-zinc-400"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[1px] shrink-0 text-zinc-600"
                          >
                            •
                          </span>

                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

export default ConditionTooltip;
