import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

type CommonProps = {
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  ariaLabel?: string;
  size?: "compact" | "default";
  width?: "fixed" | "full";
  className?: string;
};

type RequiredNumberProps = CommonProps & {
  value: number;
  onChange: (value: number) => void;
  allowEmpty?: false;
  emptyLabel?: never;
};

type OptionalNumberProps = CommonProps & {
  value: number | null;
  onChange: (value: number | null) => void;
  allowEmpty: true;
  emptyLabel?: string;
};

type NumberStepperProps = RequiredNumberProps | OptionalNumberProps;

const HOLD_DELAY_MS = 350;
const HOLD_INTERVAL_MS = 80;
const HOLD_ACCELERATION_STAGE_MS = 2000;

const clamp = (value: number, min: number, max?: number) => {
  const lower = Math.max(min, value);
  return typeof max === "number" ? Math.min(max, lower) : lower;
};

const NumberStepper = (props: NumberStepperProps) => {
  const {
    value,
    min = 0,
    max,
    step = 1,
    disabled = false,
    ariaLabel = "Number",
    size = "compact",
    width = "fixed",
    className = "",
  } = props;

  const allowEmpty = props.allowEmpty === true;
  const emptyLabel =
    props.allowEmpty === true ? (props.emptyLabel ?? "None") : "None";

  const normalizedValue =
    value === null
      ? null
      : clamp(Number.isFinite(value) ? value : min, min, max);

  const [draft, setDraft] = useState(
    normalizedValue === null ? "" : String(normalizedValue),
  );

  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartedAtRef = useRef<number | null>(null);
  const latestValueRef = useRef<number | null>(normalizedValue);

  useEffect(() => {
    latestValueRef.current = normalizedValue;
    setDraft(normalizedValue === null ? "" : String(normalizedValue));
  }, [normalizedValue]);

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  /*
   * Important: when allowEmpty is enabled, the minus button remains enabled
   * at the minimum value. That lets min -> null (e.g. 1 -> Never).
   */
  const decreaseDisabled =
    disabled ||
    (normalizedValue === null && allowEmpty) ||
    (!allowEmpty && normalizedValue !== null && normalizedValue <= min);

  const increaseDisabled =
    disabled ||
    (normalizedValue !== null &&
      typeof max === "number" &&
      normalizedValue >= max);

  const heightClass = size === "default" ? "h-10" : "h-8";
  const buttonWidthClass = size === "default" ? "w-9" : "w-8";
  const textClass = size === "default" ? "text-sm" : "text-[10px]";
  const displayPlaceholder =
    allowEmpty && normalizedValue === null ? emptyLabel : undefined;
  const baseCharacterWidth = size === "default" ? 5 : 4;
  const visibleText = draft.length > 0 ? draft : (displayPlaceholder ?? "");
  const fixedCharacterWidth = Math.max(baseCharacterWidth, visibleText.length);
  const containerWidthClass = width === "full" ? "flex w-full" : "inline-flex";
  const inputWidthClass = width === "full" ? "min-w-0 flex-1" : "";

  const emitChange = (next: number | null) => {
    if (props.allowEmpty === true) {
      props.onChange(next);
    } else if (next !== null) {
      props.onChange(next);
    }
  };

  const applyValue = (nextValue: number | null) => {
    if (nextValue === null) {
      if (!allowEmpty) return;

      latestValueRef.current = null;
      setDraft("");
      emitChange(null);
      return;
    }

    const precision = Math.max(0, (String(step).split(".")[1] ?? "").length);
    const rounded =
      precision > 0
        ? Number(nextValue.toFixed(precision))
        : Math.round(nextValue);
    const next = clamp(rounded, min, max);
    latestValueRef.current = next;
    setDraft(String(next));
    emitChange(next);
  };

  const changeBy = (delta: number) => {
    if (disabled) return;

    const current = latestValueRef.current;

    if (current === null) {
      if (delta > 0) {
        applyValue(clamp(Math.max(min, step), min, max));
      }
      return;
    }

    const next = current + delta;

    if (allowEmpty && delta < 0 && next < min) {
      applyValue(null);
      return;
    }

    applyValue(next);
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

    holdStartedAtRef.current = null;
  };

  const getHoldMultiplier = () => {
    if (holdStartedAtRef.current === null) return 1;

    const elapsed = Date.now() - holdStartedAtRef.current;
    const stage = Math.floor(elapsed / HOLD_ACCELERATION_STAGE_MS);

    return 10 ** stage;
  };

  const startHold = (
    event: ReactPointerEvent<HTMLButtonElement>,
    delta: number,
  ) => {
    if (event.currentTarget.disabled) return;

    event.currentTarget.setPointerCapture?.(event.pointerId);

    stopHold();
    holdStartedAtRef.current = Date.now();

    // A normal press always changes by one configured step immediately.
    changeBy(delta);

    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        const current = latestValueRef.current;

        if (current === null) {
          if (delta > 0) {
            applyValue(clamp(Math.max(min, step), min, max));
          } else {
            stopHold();
          }
          return;
        }

        const multiplier = getHoldMultiplier();
        const acceleratedDelta = delta * multiplier;
        const next = current + acceleratedDelta;

        if (allowEmpty && acceleratedDelta < 0 && next < min) {
          applyValue(null);
          stopHold();
          return;
        }

        const clamped = clamp(next, min, max);

        if (clamped === current) {
          stopHold();
          return;
        }

        applyValue(clamped);
      }, HOLD_INTERVAL_MS);
    }, HOLD_DELAY_MS);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextDraft = event.target.value;

    if (nextDraft === "") {
      setDraft("");

      if (allowEmpty) {
        latestValueRef.current = null;
        emitChange(null);
      }

      return;
    }

    const allowsNegative = min < 0;
    const decimalPattern = allowsNegative
      ? /^-?\d*(?:\.\d*)?$/
      : /^\d*(?:\.\d*)?$/;

    if (!decimalPattern.test(nextDraft)) return;

    // Keep incomplete-but-valid editing states without committing yet.
    if (
      nextDraft === "-" ||
      nextDraft === "." ||
      nextDraft === "-." ||
      nextDraft.endsWith(".")
    ) {
      setDraft(nextDraft);
      return;
    }

    setDraft(nextDraft);

    const parsed = Number(nextDraft);
    if (Number.isFinite(parsed)) applyValue(parsed);
  };

  const commitDraft = () => {
    if (draft.trim() === "") {
      applyValue(allowEmpty ? null : min);
      return;
    }

    const parsed = Number(draft);

    if (!Number.isFinite(parsed)) {
      setDraft(normalizedValue === null ? "" : String(normalizedValue));
      return;
    }

    applyValue(parsed);
  };

  return (
    <div
      className={`${containerWidthClass} ${heightClass} items-stretch overflow-hidden rounded-md border border-white/[0.08] bg-black/20 ${className}`}
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
        className={`flex ${buttonWidthClass} shrink-0 select-none items-center justify-center ${textClass} font-semibold text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200 disabled:cursor-default disabled:opacity-30`}
      >
        −
      </button>

      <input
        type="text"
        inputMode={step % 1 === 0 ? "numeric" : "decimal"}
        pattern={min < 0 ? "-?[0-9]*[.]?[0-9]*" : "[0-9]*[.]?[0-9]*"}
        value={draft}
        placeholder={displayPlaceholder}
        disabled={disabled}
        onChange={handleInputChange}
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();

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
        className={`${inputWidthClass} border-x border-white/[0.06] bg-transparent px-2 text-center ${textClass} font-semibold tabular-nums text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:bg-white/[0.04] disabled:cursor-default disabled:opacity-50`}
        style={
          width === "fixed"
            ? { width: `${fixedCharacterWidth + 3}ch` }
            : undefined
        }
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
        className={`flex ${buttonWidthClass} shrink-0 select-none items-center justify-center ${textClass} font-semibold text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-200 disabled:cursor-default disabled:opacity-30`}
      >
        +
      </button>
    </div>
  );
};

export default NumberStepper;
