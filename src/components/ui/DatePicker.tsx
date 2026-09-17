import { useEffect, useMemo, useRef, useState } from "react";

type DatePickerProps = {
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  ariaLabel?: string;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const pad = (value: number) => String(value).padStart(2, "0");

const toIsoDate = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

const parseIsoDate = (value?: string | null) => {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);

  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

const formatDisplayDate = (value?: string | null) => {
  const date = parseIsoDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  className = "",
  buttonClassName = "",
  ariaLabel,
}: DatePickerProps) {
  const selectedDate = parseIsoDate(value);
  const today = new Date();

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    selectedDate?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    selectedDate?.getMonth() ?? today.getMonth(),
  );

  const rootRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!open || !selectedDate) return;
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
  }, [open, value]);

  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const previousMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    return Array.from({ length: 42 }, (_, index) => {
      const dayNumber = index - mondayOffset + 1;

      if (dayNumber < 1) {
        const date = new Date(
          viewYear,
          viewMonth - 1,
          previousMonthDays + dayNumber,
        );
        return { date, outside: true };
      }

      if (dayNumber > daysInMonth) {
        const date = new Date(viewYear, viewMonth + 1, dayNumber - daysInMonth);
        return { date, outside: true };
      }

      return {
        date: new Date(viewYear, viewMonth, dayNumber),
        outside: false,
      };
    });
  }, [viewMonth, viewYear]);

  const moveMonth = (offset: number) => {
    const next = new Date(viewYear, viewMonth + offset, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const selectToday = () => {
    const now = new Date();
    onChange(toIsoDate(now.getFullYear(), now.getMonth(), now.getDate()));
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex min-h-9 w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-left text-sm text-white outline-none transition hover:border-white/20 focus-visible:border-white/25 focus-visible:ring-2 focus-visible:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50 ${buttonClassName}`}
      >
        <span className={value ? "" : "text-zinc-600"}>
          {formatDisplayDate(value) || placeholder}
        </span>
        <i className="fa-regular fa-calendar shrink-0 text-[11px] text-zinc-500" />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Choose date"
          className="absolute right-0 z-[120] mt-1 w-[292px] rounded-xl border border-white/10 bg-zinc-950 p-3 shadow-2xl shadow-black/50"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              aria-label="Previous month"
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
            >
              <i className="fa-solid fa-chevron-left text-[9px]" />
            </button>

            <div className="text-sm font-semibold text-zinc-100">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>

            <button
              type="button"
              onClick={() => moveMonth(1)}
              aria-label="Next month"
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
            >
              <i className="fa-solid fa-chevron-right text-[9px]" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((weekday) => (
              <div
                key={weekday}
                className="flex h-7 items-center justify-center text-[10px] font-medium text-zinc-600"
              >
                {weekday}
              </div>
            ))}

            {days.map(({ date, outside }) => {
              const iso = toIsoDate(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
              );
              const active = iso === value;
              const isToday =
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate();

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  className={`flex h-8 items-center justify-center rounded-md text-xs transition ${
                    active
                      ? "bg-emerald-500/20 font-semibold text-emerald-200 ring-1 ring-emerald-400/30"
                      : outside
                        ? "text-zinc-700 hover:bg-white/[0.05] hover:text-zinc-400"
                        : isToday
                          ? "bg-white/[0.06] font-semibold text-white"
                          : "text-zinc-300 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-2">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="rounded-md px-2 py-1 text-xs text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={selectToday}
              className="rounded-md px-2 py-1 text-xs text-emerald-300 transition hover:bg-emerald-500/10"
            >
              Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
