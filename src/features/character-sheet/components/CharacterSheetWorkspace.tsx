import { useEffect, useRef, useState, type ReactNode } from "react";

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

const getPanelStorageKey = (
  characterId: string,
  panel: "play-panel" | "character-details",
) => `lorebound:character-sheet:${characterId}:section:${panel}`;

const readOpenState = (key: string, fallback: boolean) => {
  try {
    const stored = localStorage.getItem(key);

    if (stored === "open") return true;
    if (stored === "closed") return false;
  } catch {
    // UI persistence is optional.
  }

  return fallback;
};

const CharacterSheetWorkspace = ({
  activeTab,
  onTabChange,
  playPanel,
  children,
}: CharacterSheetWorkspaceProps) => {
  const { characterId } = useParams();
  const restoredForCharacterRef = useRef<string | null>(null);
  const restoredPanelsForCharacterRef = useRef<string | null>(null);

  // Mobile-only accordion state. Desktop (md+) is always expanded.
  const [playOpen, setPlayOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

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

  /*
   * Restore mobile accordion state separately for each character.
   * Desktop ignores these values and always displays both panels.
   */
  useEffect(() => {
    if (!characterId || restoredPanelsForCharacterRef.current === characterId) {
      return;
    }

    restoredPanelsForCharacterRef.current = characterId;

    setPlayOpen(
      readOpenState(getPanelStorageKey(characterId, "play-panel"), true),
    );

    setDetailsOpen(
      readOpenState(
        getPanelStorageKey(characterId, "character-details"),
        false,
      ),
    );
  }, [characterId]);

  useEffect(() => {
    if (!characterId || restoredPanelsForCharacterRef.current !== characterId) {
      return;
    }

    try {
      localStorage.setItem(
        getPanelStorageKey(characterId, "play-panel"),
        playOpen ? "open" : "closed",
      );
    } catch {
      // UI persistence is optional.
    }
  }, [characterId, playOpen]);

  useEffect(() => {
    if (!characterId || restoredPanelsForCharacterRef.current !== characterId) {
      return;
    }

    try {
      localStorage.setItem(
        getPanelStorageKey(characterId, "character-details"),
        detailsOpen ? "open" : "closed",
      );
    } catch {
      // UI persistence is optional.
    }
  }, [characterId, detailsOpen]);

  return (
    <div className="grid gap-3 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="min-w-0">
        <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/35 md:h-[560px]">
          <button
            type="button"
            onClick={() => setPlayOpen((current) => !current)}
            aria-expanded={playOpen}
            className="flex w-full shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-black/15 px-3 py-2.5 text-left transition hover:bg-white/[0.025] md:pointer-events-none md:cursor-default md:hover:bg-black/15"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
              Play Panel
            </p>

            <i
              className={`fa-solid fa-chevron-down text-[9px] text-zinc-500 transition-transform md:hidden ${
                playOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          <div
            className={`min-h-0 flex-1 ${
              playOpen ? "block" : "hidden md:block"
            }`}
          >
            {playPanel}
          </div>
        </section>
      </aside>

      <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/35 md:h-[560px]">
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setDetailsOpen((current) => !current)}
            aria-expanded={detailsOpen}
            className={`flex w-full items-center justify-between gap-3 bg-black/15 px-3 py-2.5 text-left transition hover:bg-white/[0.025] ${
              detailsOpen ? "border-b border-white/10" : ""
            }`}
          >
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                Character Details
              </p>

              {!detailsOpen ? (
                <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                  Inventory · Features · Character · Notes
                </p>
              ) : null}
            </div>

            <i
              className={`fa-solid fa-chevron-down shrink-0 text-[9px] text-zinc-500 transition-transform ${
                detailsOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        </div>

        <div
          className={`min-h-0 flex-1 flex-col ${
            detailsOpen ? "flex" : "hidden md:flex"
          }`}
        >
          <CharacterSheetTabs activeTab={activeTab} onChange={onTabChange} />

          <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-3.5">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CharacterSheetWorkspace;
