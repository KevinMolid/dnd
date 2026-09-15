import { type ReactNode, useState } from "react";

import { createPortal } from "react-dom";

import type { CustomTrait } from "../../../types/customCharacter";

type CustomFeatureTooltipProps = {
  trait: CustomTrait;
  children: ReactNode;
};

const CustomFeatureTooltip = ({
  trait,
  children,
}: CustomFeatureTooltipProps) => {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  const handleEnter = () => {
    setOpen(true);
  };

  const handleLeave = () => {
    if (!pinned) {
      setOpen(false);
    }
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
      <div
        className="block"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={() => {
          if (!pinned) {
            setOpen(false);
          }
        }}
      >
        <div
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onClick={togglePinned}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              togglePinned();
            }
          }}
        >
          {children}
        </div>
      </div>

      {open
        ? createPortal(
            <div className="fixed bottom-4 right-4 z-[140] w-[430px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur">
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white">
                    {trait.name}
                  </h3>

                  {trait.source ? (
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-zinc-500">
                      {trait.source}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPinned(false);
                    setOpen(false);
                  }}
                  aria-label="Close feature details"
                  title="Close"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-base text-zinc-400 transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="workspace-scrollbar max-h-[440px] overflow-y-auto p-4">
                {trait.description ? (
                  <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                    {trait.description}
                  </p>
                ) : (
                  <p className="text-sm text-zinc-500">
                    No description entered.
                  </p>
                )}
              </div>

              <div className="border-t border-white/[0.06] px-4 py-2">
                <p className="text-xs text-zinc-600">
                  Click the feature to pin or unpin these details.
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

export default CustomFeatureTooltip;
