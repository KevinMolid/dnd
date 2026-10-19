import { useEffect, useRef, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import CharacterSheetTabs from "./CharacterSheetTabs";
import type { CharacterSheetTab } from "../types";
import type { MobileCharacterSection } from "./MobileCharacterNavigation";

type Props = {
  activeTab: CharacterSheetTab;
  onTabChange: (tab: CharacterSheetTab) => void;
  mobileSection?: MobileCharacterSection;
  playPanel: ReactNode;
  children: ReactNode;
};
const validTabs: CharacterSheetTab[] = ["inventory", "features", "character", "notes"];
const getStorageKey = (id: string) => `lorebound:character-sheet:${id}:workspace-tab`;

const CharacterSheetWorkspace = ({ activeTab, onTabChange, mobileSection, playPanel, children }: Props) => {
  const { characterId } = useParams();
  const restored = useRef<string | null>(null);
  useEffect(() => {
    if (!characterId || restored.current === characterId) return;
    restored.current = characterId;
    try {
      const saved = localStorage.getItem(getStorageKey(characterId));
      if (saved && validTabs.includes(saved as CharacterSheetTab)) onTabChange(saved as CharacterSheetTab);
    } catch { /* storage optional */ }
  }, [characterId, onTabChange]);
  useEffect(() => {
    if (!characterId || restored.current !== characterId) return;
    try { localStorage.setItem(getStorageKey(characterId), activeTab); } catch { /* storage optional */ }
  }, [characterId, activeTab]);

  const playVisible = mobileSection === "attacks" || mobileSection === "spells" || mobileSection === "actions";
  const detailsVisible = mobileSection === "inventory" || mobileSection === "features" || mobileSection === "character" || mobileSection === "notes";

  return (
    <div className="grid gap-3 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className={`min-w-0 ${!playVisible ? "hidden md:block" : ""}`}>
        <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/35 md:h-[560px]">
          <div className="hidden shrink-0 border-b border-white/10 bg-black/15 px-3 py-2.5 md:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-300"><i className="fa-solid fa-dice-d20 mr-2 text-rose-400" />Play Panel</p>
          </div>
          <div className="min-h-0 flex-1">{playPanel}</div>
        </section>
      </aside>
      <section className={`flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/35 md:h-[560px] ${!detailsVisible ? "hidden md:flex" : ""}`}>
        <div className="hidden md:block"><CharacterSheetTabs activeTab={activeTab} onChange={onTabChange} /></div>
        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-3.5">
          {children}
        </div>
      </section>
    </div>
  );
};

export default CharacterSheetWorkspace;
