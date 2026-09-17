import { useEffect, useRef, useState, type ReactNode } from "react";

export type SelectOption<T extends string = string> = {
  value: T;
  label: ReactNode;
  disabled?: boolean;
};

type SelectProps<T extends string = string> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  ariaLabel?: string;
};

export default function Select<T extends string = string>({
  value,
  options,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className = "",
  buttonClassName = "",
  menuClassName = "",
  ariaLabel,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex min-h-9 w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-left text-sm text-white outline-none transition hover:border-white/20 focus-visible:border-white/25 focus-visible:ring-2 focus-visible:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50 ${buttonClassName}`}
      >
        <span className={`min-w-0 truncate ${selected ? "" : "text-zinc-600"}`}>
          {selected?.label ?? placeholder}
        </span>
        <i
          className={`fa-solid fa-chevron-down shrink-0 text-[9px] text-zinc-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className={`absolute left-0 right-0 z-[120] mt-1 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-zinc-950 p-1 shadow-2xl shadow-black/50 ${menuClassName}`}
        >
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                disabled={option.disabled}
                onClick={() => {
                  if (option.disabled) return;
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left text-sm transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                <span className="min-w-0 truncate">{option.label}</span>
                {active ? (
                  <i className="fa-solid fa-check text-[9px] text-emerald-300" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
