import type { ReactNode } from "react";

import CharacterSheetTabs from "./CharacterSheetTabs";

import type { CharacterSheetTab } from "../types";

type CharacterSheetWorkspaceProps = {
  activeTab: CharacterSheetTab;

  onTabChange: (tab: CharacterSheetTab) => void;

  playPanel: ReactNode;

  children: ReactNode;
};

const CharacterSheetWorkspace = ({
  activeTab,
  onTabChange,
  playPanel,
  children,
}: CharacterSheetWorkspaceProps) => {
  return (
    <div className="grid gap-3 xl:grid-cols-[360px_minmax(0,1fr)]">
      {/* =====================================================
          PLAY PANEL
      ===================================================== */}

      <aside className="min-w-0">
        <section className="flex h-[560px] min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/35">
          <div className="shrink-0 border-b border-white/10 bg-black/15 px-3 py-2">
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Play Panel
            </p>
          </div>

          <div className="min-h-0 flex-1">{playPanel}</div>
        </section>
      </aside>

      {/* =====================================================
          DETAIL WORKSPACE
      ===================================================== */}

      <section className="flex h-[560px] min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/35">
        <CharacterSheetTabs activeTab={activeTab} onChange={onTabChange} />

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
          {children}
        </div>
      </section>
    </div>
  );
};

export default CharacterSheetWorkspace;
