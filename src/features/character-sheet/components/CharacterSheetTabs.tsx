import type { CharacterSheetTab } from "../types";
type Props = { activeTab: CharacterSheetTab; onChange: (tab: CharacterSheetTab) => void };
const tabs: Array<{ id: CharacterSheetTab; label: string; icon: string; color: string }> = [
  { id: "inventory", label: "Inventory", icon: "fa-bag-shopping", color: "text-amber-300" },
  { id: "features", label: "Features", icon: "fa-scroll", color: "text-teal-400" },
  { id: "character", label: "Character", icon: "fa-user", color: "text-zinc-300" },
  { id: "notes", label: "Notes", icon: "fa-book-open", color: "text-slate-300" },
];
const CharacterSheetTabs = ({ activeTab, onChange }: Props) => (
  <div className="shrink-0 border-b border-white/10 bg-black/15 px-2">
    <nav className="workspace-scrollbar flex overflow-x-auto" aria-label="Character detail sections">
      {tabs.map((tab) => <button key={tab.id} type="button" onClick={() => onChange(tab.id)} className={`relative shrink-0 px-3.5 py-3 text-xs font-semibold transition ${activeTab === tab.id ? "text-white" : "text-zinc-400 hover:text-zinc-100"}`}>
        <i className={`fa-solid ${tab.icon} ${tab.color} mr-2`} aria-hidden="true" />{tab.label}
        <span className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full ${activeTab === tab.id ? "bg-white" : "bg-transparent"}`} />
      </button>)}
    </nav>
  </div>
);
export default CharacterSheetTabs;
