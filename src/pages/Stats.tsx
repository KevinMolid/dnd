import { useEffect, useMemo, useRef, useState } from "react";
import Container from "../components/Container";
import H1 from "../components/H1";
import StatBlock from "../components/StatBlock";
import { monsters, monsterTypes } from "../data/monsters";
import { useEncounter } from "../context/EncounterContext";

const Stats = () => {
  const [search, setSearch] = useState("");
  const [lockedNames, setLockedNames] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { addMonsterToEncounter } = useEncounter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsTypeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleLock = (name: string) => {
    setLockedNames((prev) => {
      const next = new Set(prev);

      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }

      return next;
    });
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);

      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }

      return next;
    });
  };

  const visibleMonsters = useMemo(() => {
    const query = search.trim().toLowerCase();
    const hasSearch = query !== "";
    const hasTypeFilter = selectedTypes.size > 0;
    const hasAnyFilter = hasSearch || hasTypeFilter;

    return [...monsters]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((monster) => {
        const isLocked = lockedNames.has(monster.name);

        if (isLocked) return true;
        if (!hasAnyFilter) return false;

        const matchesSearch = hasSearch
          ? monster.name.toLowerCase().includes(query)
          : true;

        const matchesType = hasTypeFilter
          ? selectedTypes.has(monster.type)
          : true;

        return matchesSearch && matchesType;
      });
  }, [search, selectedTypes, lockedNames]);

  return (
    <div>
      <Container>
        <H1>Stats</H1>

        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search monsters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm rounded border border-neutral-600 bg-neutral-800 px-3 py-2 text-white"
          />

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsTypeDropdownOpen((prev) => !prev)}
              className="rounded border border-neutral-600 bg-neutral-800 px-3 py-2 text-white"
            >
              Types {selectedTypes.size > 0 ? `(${selectedTypes.size})` : ""}
            </button>

            {isTypeDropdownOpen && (
              <div className="absolute z-20 mt-2 max-h-80 w-56 overflow-y-auto rounded border border-neutral-600 bg-neutral-900 p-2 shadow-lg">
                {monsterTypes.map((type) => (
                  <label
                    key={type}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-neutral-800"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.has(type)}
                      onChange={() => toggleType(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {visibleMonsters.map((monster) => (
            <StatBlock
              key={monster.name}
              {...monster}
              isLocked={lockedNames.has(monster.name)}
              onToggleLock={() => toggleLock(monster.name)}
              onAddToEncounter={() => addMonsterToEncounter(monster)}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Stats;
