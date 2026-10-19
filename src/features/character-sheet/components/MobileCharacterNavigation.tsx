import { useEffect, useRef } from "react";

export const mobileSections = [
  { id: "live-state", label: "Live State", icon: "fa-heart-pulse", tone: "text-emerald-400" },
  { id: "abilities", label: "Abilities", icon: "fa-dice-d20", tone: "text-amber-400" },
  { id: "skills", label: "Skills", icon: "fa-list-check", tone: "text-sky-400" },
  { id: "proficiencies", label: "Proficiencies", icon: "fa-shield-halved", tone: "text-cyan-400" },
  { id: "attacks", label: "Attacks", icon: "fa-khanda", tone: "text-rose-400" },
  { id: "spells", label: "Spells", icon: "fa-wand-magic-sparkles", tone: "text-violet-400" },
  { id: "actions", label: "Actions", icon: "fa-bolt", tone: "text-orange-400" },
  { id: "inventory", label: "Inventory", icon: "fa-bag-shopping", tone: "text-amber-300" },
  { id: "features", label: "Features", icon: "fa-scroll", tone: "text-teal-400" },
  { id: "character", label: "Character", icon: "fa-user", tone: "text-zinc-300" },
  { id: "notes", label: "Notes", icon: "fa-book-open", tone: "text-slate-300" },
] as const;

export type MobileCharacterSection = (typeof mobileSections)[number]["id"];

type Props = {
  activeSection: MobileCharacterSection;
  onChange: (section: MobileCharacterSection) => void;
};

const MobileCharacterNavigation = ({ activeSection, onChange }: Props) => {
  const activeIndex = mobileSections.findIndex((s) => s.id === activeSection);
  const active = mobileSections[activeIndex] ?? mobileSections[0];
  const selectedRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeSection]);

  const move = (delta: number) => {
    const next = mobileSections[activeIndex + delta];
    if (next) onChange(next.id);
  };

  return (
    <div className="sticky top-0 z-30 mb-3 rounded-xl border border-white/10 bg-zinc-950/95 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between px-2 py-2">
        <button type="button" onClick={() => move(-1)} disabled={activeIndex === 0} aria-label="Previous section" className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 disabled:opacity-20">
          <i className="fa-solid fa-chevron-left" />
        </button>
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <i className={`fa-solid ${active.icon} ${active.tone}`} aria-hidden="true" />
          {active.label}
          <span className="ml-1 text-[10px] font-medium text-zinc-500">{activeIndex + 1}/{mobileSections.length}</span>
        </div>
        <button type="button" onClick={() => move(1)} disabled={activeIndex === mobileSections.length - 1} aria-label="Next section" className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 disabled:opacity-20">
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
      <nav aria-label="Character sections" className="workspace-scrollbar flex gap-1 overflow-x-auto border-t border-white/[0.06] px-2 py-1">
        {mobileSections.map((section) => (
          <button key={section.id} ref={section.id === activeSection ? selectedRef : undefined} type="button" title={section.label} aria-label={section.label} aria-current={section.id === activeSection ? "page" : undefined} onClick={() => onChange(section.id)} className={`relative flex h-10 min-w-10 shrink-0 items-center justify-center rounded-lg text-sm transition ${section.id === activeSection ? `bg-white/[0.09] ${section.tone}` : "text-zinc-500"}`}>
            <i className={`fa-solid ${section.icon}`} aria-hidden="true" />
            {section.id === activeSection ? <span className="absolute bottom-0 h-0.5 w-5 rounded-full bg-current" /> : null}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MobileCharacterNavigation;
