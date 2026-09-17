import { type ReactNode, useState } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
  right?: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  summary?: ReactNode;
};

const SectionCard = ({
  title,
  children,
  right,
  collapsible = false,
  defaultOpen = true,
  summary,
}: SectionCardProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      <div
        className={`flex items-center justify-between gap-3 ${
          open ? "border-b border-white/[0.06]" : ""
        }`}
      >
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/[0.025]"
          >
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white sm:text-lg">
                {title}
              </h2>

              {!open && summary ? (
                <div className="mt-0.5 truncate text-xs text-zinc-500">
                  {summary}
                </div>
              ) : null}
            </div>

            <i
              className={`fa-solid fa-chevron-down shrink-0 text-[10px] text-zinc-500 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        ) : (
          <div className="min-w-0 flex-1 px-4 py-3">
            <h2 className="text-base font-semibold text-white sm:text-lg">
              {title}
            </h2>
          </div>
        )}

        {right ? <div className="shrink-0 pr-4">{right}</div> : null}
      </div>

      {open ? (
        <div className="p-4 text-sm text-zinc-200">{children}</div>
      ) : null}
    </section>
  );
};

export default SectionCard;
