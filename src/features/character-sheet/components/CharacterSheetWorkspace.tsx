import { useEffect, useRef, type ReactNode } from "react";

import { useParams } from "react-router-dom";

import CharacterSheetTabs from "./CharacterSheetTabs";

import type { CharacterSheetTab } from "../types";

type CharacterSheetWorkspaceProps = {
  activeTab: CharacterSheetTab;
  onTabChange: (tab: CharacterSheetTab) => void;
  playPanel: ReactNode;
  children: ReactNode;
};

const validTabs: CharacterSheetTab[] = [
  "inventory",
  "features",
  "character",
  "notes",
];

const isCharacterSheetTab = (value: unknown): value is CharacterSheetTab =>
  typeof value === "string" && validTabs.includes(value as CharacterSheetTab);

const getStorageKey = (characterId: string) =>
  `lorebound:character-sheet:${characterId}:workspace-tab`;

const CharacterSheetWorkspace = ({
  activeTab,
  onTabChange,
  playPanel,
  children,
}: CharacterSheetWorkspaceProps) => {
  const { characterId } = useParams();
  const restoredForCharacterRef = useRef<string | null>(null);

  /*
   * Restore the last workspace tab once for each character.
   * The parent remains the source of truth for activeTab.
   */
  useEffect(() => {
    if (!characterId || restoredForCharacterRef.current === characterId) {
      return;
    }

    restoredForCharacterRef.current = characterId;

    try {
      const stored = localStorage.getItem(getStorageKey(characterId));

      if (isCharacterSheetTab(stored) && stored !== activeTab) {
        onTabChange(stored);
      }
    } catch {
      // localStorage can be unavailable in privacy-restricted environments.
    }
  }, [characterId, activeTab, onTabChange]);

  useEffect(() => {
    if (!characterId || restoredForCharacterRef.current !== characterId) {
      return;
    }

    try {
      localStorage.setItem(getStorageKey(characterId), activeTab);
    } catch {
      // UI persistence is optional; never block the sheet if storage fails.
    }
  }, [characterId, activeTab]);

  return (
    <div className="grid gap-3 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="min-w-0">
        <section className="flex h-[560px] min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/35">
          <div className="shrink-0 border-b border-white/10 bg-black/15 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
              Play Panel
            </p>
          </div>

          <div className="min-h-0 flex-1">{playPanel}</div>
        </section>
      </aside>

      <section className="flex h-[560px] min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/35">
        <CharacterSheetTabs activeTab={activeTab} onChange={onTabChange} />

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-3.5">
          {children}
        </div>
      </section>
    </div>
  );
};

export default CharacterSheetWorkspace;
