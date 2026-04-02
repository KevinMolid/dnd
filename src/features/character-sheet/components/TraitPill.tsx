import type { ReactNode } from "react";

type TraitPillProps = {
  children: ReactNode;
  tone?: "neutral" | "accent";
};

const TraitPill = ({ children, tone = "neutral" }: TraitPillProps) => {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${
        tone === "accent"
          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          : "border border-white/10 bg-zinc-800 text-zinc-300"
      }`}
    >
      {children}
    </span>
  );
};

export default TraitPill;