import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

type NumberStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  ariaLabel?: string;
  size?: "compact" | "default";
  className?: string;
};

const HOLD_DELAY_MS = 350;
const HOLD_INTERVAL_MS = 80;

const clamp = (value: number, min: number, max?: number) => {
  const lower = Math.max(min, value);
  return typeof max === "number" ? Math.min(max, lower) : lower;
};

const NumberStepper = ({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  disabled = false,
  ariaLabel = "Number",
  size = "compact",
  className = "",
}: NumberStepperProps) => {
  const normalizedValue = clamp(Math.floor(value) || 0, min, max);

  const [draft, setDraft] = useState(String(normalizedValue));

  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestValueRef = useRef(normalizedValue);

  useEffect(() => {
    latestValueRef.current = normalizedValue;
    setDraft(String(normalizedValue));
  }, [normalizedValue]);

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }

      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, []);

  const decreaseDisabled = disabled || normalizedValue <= min;
  const increaseDisabled =
    disabled || (typeof max === "number" && normalizedValue >= max);

  const heightClass = size === "default" ? "h-10" : "h-8";
  const buttonWidthClass = size === "default" ? "w-9" : "w-8";
  const valueWidthClass =
    size === "default" ? "w-[54px] min-w-[54px]" : "w-[42px] min-w-[42px]";
  const textClass = size === "default" ? "text-sm" : "text-[10px]";

  const applyValue = (nextValue: number) => {
    const next = clamp(Math.floor(nextValue), min, max);

    latestValueRef.current = next;
    setDraft(String(next));
    onChange(next);
  };

  const changeBy = (delta: number) => {
    if (disabled) {
      return;
    }

    applyValue(latestValueRef.current + delta);
  };

  const stopHold = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  const startHold = (
    event: ReactPointerEvent<HTMLButtonElement>,
    delta: number,
  ) => {
    if (event.currentTarget.disabled) {
      return;
    }

    event.currentTarget.setPointerCapture?.(event.pointerId);

    /*
     * Apply one step immediately so a normal click still behaves normally.
     * After a short pause, repeat rapidly while the button remains held.
     */
    changeBy(delta);

    stopHold();

    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        const current = latestValueRef.current;
        const next = clamp(current + delta, min, max);

        if (next === current) {
          stopHold();
          return;
        }

        applyValue(next);
      }, HOLD_INTERVAL_MS);
    }, HOLD_DELAY_MS);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextDraft = event.target.value;

    /*
     * Keep an empty draft while typing so the user can replace the whole
     * number without it instantly snapping back to the minimum.
     */
    if (nextDraft === "") {
      setDraft("");
      return;
    }

    if (!/^\d+$/.test(nextDraft)) {
      return;
    }

    setDraft(nextDraft);

    const parsed = Number(nextDraft);

    if (Number.isFinite(parsed)) {
      applyValue(parsed);
    }
  };

  const commitDraft = () => {
    if (draft.trim() === "") {
      applyValue(min);
      return;
    }

    const parsed = Number(draft);

    if (!Number.isFinite(parsed)) {
      setDraft(String(normalizedValue));
      return;
    }

    applyValue(parsed);
  };

  return (
    <div
      className={`inline-flex ${heightClass} items-stretch overflow-hidden rounded-md border border-white/[0.08] bg-black/20 ${className}`}
      aria-label={`${ariaLabel} controls`}
    >
      <button
        type="button"
        onPointerDown={(event) => startHold(event, -step)}
        onPointerUp={stopHold}
        onPointerCancel={stopHold}
        onLostPointerCapture={stopHold}
        onContextMenu={(event) => event.preventDefault()}
        disabled={decreaseDisabled}
        aria-label={`Decrease ${ariaLabel}`}
        className={`flex ${buttonWidthClass} select-none items-center justify-center ${textClass} font-semibold text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200 disabled:cursor-default disabled:opacity-30`}
      >
        −
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        disabled={disabled}
        onChange={handleInputChange}
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            changeBy(step);
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            changeBy(-step);
          }
        }}
        aria-label={ariaLabel}
        className={`${valueWidthClass} border-x border-white/[0.06] bg-transparent px-1 text-center ${textClass} font-semibold tabular-nums text-zinc-200 outline-none transition focus:bg-white/[0.04] disabled:cursor-default disabled:opacity-50 ${
          draft.length > (size === "default" ? 5 : 4) ? "w-auto" : ""
        }`}
      />

      <button
        type="button"
        onPointerDown={(event) => startHold(event, step)}
        onPointerUp={stopHold}
        onPointerCancel={stopHold}
        onLostPointerCapture={stopHold}
        onContextMenu={(event) => event.preventDefault()}
        disabled={increaseDisabled}
        aria-label={`Increase ${ariaLabel}`}
        className={`flex ${buttonWidthClass} select-none items-center justify-center ${textClass} font-semibold text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200 disabled:cursor-default disabled:opacity-30`}
      >
        +
      </button>
    </div>
  );
};

export default NumberStepper;
