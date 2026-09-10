import type { CharacterSheetTab } from "../types";

type CharacterSheetTabsProps = {
  activeTab: CharacterSheetTab;

  onChange: (tab: CharacterSheetTab) => void;
};

const tabs: Array<{
  id: CharacterSheetTab;
  label: string;
}> = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "combat",
    label: "Combat",
  },
  {
    id: "features",
    label: "Features",
  },
  {
    id: "inventory",
    label: "Inventory",
  },
  {
    id: "spells",
    label: "Spells",
  },
  {
    id: "notes",
    label: "Notes",
  },
];

const CharacterSheetTabs = ({
  activeTab,
  onChange,
}: CharacterSheetTabsProps) => {
  return (
    <div className="mb-4 border-b border-white/10">
      <nav
        className="workspace-scrollbar flex gap-1 overflow-x-auto"
        aria-label="Character sheet sections"
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative shrink-0 px-3 py-2.5 text-xs font-medium transition ${
                active ? "text-white" : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              {tab.label}

              <span
                className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full transition ${
                  active ? "bg-white" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default CharacterSheetTabs;
