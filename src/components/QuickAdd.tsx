import { useMemo, useState } from "react";
import Avatar from "./Avatar";
import H3 from "./H3";
import { useEncounter } from "../context/EncounterContext";
import { monsters, type MonsterDefinition } from "../data/monsterCatalog";

const QuickAdd = () => {
  const { addMonsterToEncounter } = useEncounter();

  const [search, setSearch] = useState("");
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const filteredMonsters = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const results =
      normalizedSearch.length === 0
        ? monsters
        : monsters.filter((monster) => {
            const nameMatch = monster.name
              .toLowerCase()
              .includes(normalizedSearch);

            const typeMatch =
              typeof monster.type === "string" &&
              monster.type.toLowerCase().includes(normalizedSearch);

            return nameMatch || typeMatch;
          });

    return results.slice(0, 12);
  }, [search]);

  const selectedMonster = useMemo(
    () => monsters.find((monster) => monster.id === selectedMonsterId),
    [selectedMonsterId],
  );

  const handleAdd = () => {
    if (!selectedMonster) return;

    const safeQuantity = Math.max(1, Math.floor(quantity) || 1);

    for (let i = 0; i < safeQuantity; i += 1) {
      addMonsterToEncounter(selectedMonster);
    }

    setQuantity(1);
  };

  const handleQuickPick = (monster: MonsterDefinition) => {
    setSelectedMonsterId(monster.id);
  };

  const initiativeBonus = selectedMonster
    ? Math.floor((selectedMonster.stats.dex - 10) / 2)
    : null;

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
      <div className="mb-3">
        <H3 className="mb-0">Quick Add</H3>
        <p className="mt-1 text-sm text-neutral-400">
          Search monsters and add them directly to the current fight.
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search monsters..."
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none transition focus:border-yellow-600"
        />

        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {filteredMonsters.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-neutral-400">
              No monsters found.
            </div>
          ) : (
            filteredMonsters.map((monster) => {
              const isSelected = monster.id === selectedMonsterId;
              const monsterInitiativeBonus = Math.floor(
                (monster.stats.dex - 10) / 2,
              );

              return (
                <button
                  key={monster.id}
                  type="button"
                  onClick={() => handleQuickPick(monster)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                    isSelected
                      ? "border-yellow-700 bg-yellow-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Avatar name={monster.name} src={monster.img} size="sm" />

                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-white">
                      {monster.name}
                    </div>

                    <div className="mt-0.5 text-xs text-neutral-400">
                      AC {monster.armorClass} • HP {monster.hp} • Init{" "}
                      {monsterInitiativeBonus >= 0
                        ? `+${monsterInitiativeBonus}`
                        : monsterInitiativeBonus}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          {selectedMonster ? (
            <>
              <div className="mb-3 flex items-center gap-3">
                <Avatar
                  name={selectedMonster.name}
                  src={selectedMonster.img}
                  size="sm"
                />

                <div className="min-w-0">
                  <div className="font-medium text-white">
                    {selectedMonster.name}
                  </div>
                  <div className="text-xs text-neutral-400">
                    AC {selectedMonster.armorClass} • HP {selectedMonster.hp} •
                    Init{" "}
                    {initiativeBonus !== null
                      ? initiativeBonus >= 0
                        ? ` +${initiativeBonus}`
                        : ` ${initiativeBonus}`
                      : " —"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-400">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value) || 1))
                    }
                    className="w-24 rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none transition focus:border-yellow-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="rounded-xl border border-emerald-700 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/15"
                >
                  Add to Encounter
                </button>
              </div>
            </>
          ) : (
            <div className="text-sm text-neutral-400">
              Select a monster to add it to the encounter.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuickAdd;
