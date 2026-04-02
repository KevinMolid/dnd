import type { CharacterSheetTab } from "../types";
import {
  sheetTabLabels,
  sheetTabs,
} from "../utils/characterSheetConstants";

type CharacterSheetTabsProps = {
  activeTab: CharacterSheetTab;
  onChange: (tab: CharacterSheetTab) => void;
};

const CharacterSheetTabs = ({
  activeTab,
  onChange,
}: CharacterSheetTabsProps) => {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {sheetTabs.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-white text-zinc-950"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {sheetTabLabels[tab]}
          </button>
        );
      })}
    </div>
  );
};

export default CharacterSheetTabs;