import type { ReactNode } from "react";

type AttackModePillProps = {
  children: ReactNode;
  tone?: "neutral" | "offhand" | "thrown" | "twohanded";
};

const AttackModePill = ({
  children,
  tone = "neutral",
}: AttackModePillProps) => {
  const className =
    tone === "offhand"
      ? "border border-amber-500/20 bg-amber-500/10 text-amber-300"
      : tone === "thrown"
        ? "border border-sky-500/20 bg-sky-500/10 text-sky-300"
        : tone === "twohanded"
          ? "border border-violet-500/20 bg-violet-500/10 text-violet-300"
          : "border border-white/10 bg-zinc-900 text-zinc-300";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${className}`}
    >
      {children}
    </span>
  );
};

export default AttackModePill;