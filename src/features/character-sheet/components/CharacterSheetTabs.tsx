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
    id: "inventory",
    label: "Inventory",
  },
  {
    id: "features",
    label: "Features",
  },
  {
    id: "notes",
    label: "Notes",
  },
];

const CharacterSheetTabs = ({
  activeTab,

  onChange,
}: CharacterSheetTabsProps) => (
  <div className="shrink-0 border-b border-white/10 bg-black/15 px-2">
    <nav
      className="workspace-scrollbar flex overflow-x-auto"
      aria-label="Character detail sections"
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative shrink-0 px-3 py-3 text-[11px] font-semibold transition ${
              active ? "text-white" : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            {tab.label}

            <span
              className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full ${
                active ? "bg-white" : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </nav>
  </div>
);

export default CharacterSheetTabs;
