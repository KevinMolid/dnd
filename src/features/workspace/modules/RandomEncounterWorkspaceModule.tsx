import { useMemo, useState } from "react";

import type { MonsterDefinition } from "../../../data/monsterCatalog";

import { useEncounter } from "../../../context/EncounterContext";

import useMonsterLibrary from "../../../hooks/useMonsterLibrary";

import useCampaignPageData from "../../campaigns/hooks/useCampaignPageData";

import { useCampaignMaps } from "../../maps/useCampaignMaps";

import type { MapMonster } from "../../maps/types";

import { useWorkspace } from "../WorkspaceContext";

import type { WorkspaceModuleRenderProps } from "../workspaceTypes";

import {
  getActiveCampaignCharacters,
  mapCharacterToEncounterPlayer,
} from "../../../utils/encounterPlayers";

type Difficulty = "low" | "standard" | "hard";

type WorkspaceMonsterDefinition = MonsterDefinition & {
  source?: "default" | "campaign";
};

type LocalPopulationEntry = {
  key: string;
  monster: WorkspaceMonsterDefinition;
  mapMonster: MapMonster;
  maxQuantity: number;
};

type RandomEncounterEntry = {
  key: string;
  monster: WorkspaceMonsterDefinition;
  mapMonster: MapMonster;
  quantity: number;
  maxQuantity: number;
};

type EncounterCandidate = {
  index: number;
  weight: number;
  xp: number;
};

const normalizeMonsterName = (value: string) => {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
};

const STANDARD_XP_BY_LEVEL: Record<number, number> = {
  1: 50,
  2: 100,
  3: 150,
  4: 250,
  5: 500,
  6: 600,
  7: 750,
  8: 900,
  9: 1100,
  10: 1200,
  11: 1300,
  12: 1500,
  13: 1600,
  14: 1800,
  15: 2000,
  16: 2100,
  17: 2400,
  18: 2800,
  19: 3200,
  20: 3600,
};

const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  low: 0.65,
  standard: 1,
  hard: 1.5,
};

const getCharacterBudget = (level: number) => {
  const safeLevel = Math.max(1, Math.min(20, Math.floor(level)));

  return STANDARD_XP_BY_LEVEL[safeLevel] ?? 50;
};

const getWeightedRandomIndex = (weights: number[]) => {
  const total = weights.reduce((sum, weight) => sum + Math.max(0, weight), 0);

  if (total <= 0) {
    return -1;
  }

  let roll = Math.random() * total;

  for (let index = 0; index < weights.length; index += 1) {
    roll -= Math.max(0, weights[index] ?? 0);

    if (roll <= 0) {
      return index;
    }
  }

  return weights.length - 1;
};

export default function RandomEncounterWorkspaceModule({
  campaignId,
}: WorkspaceModuleRenderProps) {
  const { maps, loading: mapsLoading } = useCampaignMaps(campaignId);

  const { allMonsters, loading: monstersLoading } =
    useMonsterLibrary(campaignId);

  const { campaignCharacters, campaignCharactersLoading } =
    useCampaignPageData(campaignId);

  const { activeLocation, selectEntity } = useWorkspace();

  const { createNewEncounter, addMonsterToEncounter, addPlayerToEncounter } =
    useEncounter();

  const [difficulty, setDifficulty] = useState<Difficulty>("standard");

  const [generatedEncounter, setGeneratedEncounter] = useState<
    RandomEncounterEntry[]
  >([]);

  const [message, setMessage] = useState<string | null>(null);

  const activeCharacters = useMemo(
    () => getActiveCampaignCharacters(campaignCharacters),
    [campaignCharacters],
  );

  const partyBudget = useMemo(() => {
    const standard = activeCharacters.reduce(
      (total, character) => total + getCharacterBudget(character.level ?? 1),
      0,
    );

    return Math.max(
      25,
      Math.round(standard * DIFFICULTY_MULTIPLIER[difficulty]),
    );
  }, [activeCharacters, difficulty]);

  const monstersByName = useMemo(() => {
    const result = new Map<string, (typeof allMonsters)[number]>();

    const sorted = [...allMonsters].sort((a, b) => {
      if (a.source === "campaign" && b.source !== "campaign") {
        return -1;
      }

      if (b.source === "campaign" && a.source !== "campaign") {
        return 1;
      }

      return 0;
    });

    sorted.forEach((monster) => {
      const key = normalizeMonsterName(monster.name);

      if (!result.has(key)) {
        result.set(key, monster);
      }
    });

    return result;
  }, [allMonsters]);

  const activeMap = useMemo(() => {
    if (!activeLocation) {
      return null;
    }

    return maps.find((map) => map.id === activeLocation.mapId) ?? null;
  }, [maps, activeLocation]);

  const activeRoom = useMemo(() => {
    if (!activeMap || !activeLocation) {
      return null;
    }

    return (
      activeMap.rooms.find((room) => room.id === activeLocation.roomId) ?? null
    );
  }, [activeMap, activeLocation]);

  const resolveMapMonster = (mapMonster: MapMonster) => {
    if (mapMonster.monsterKey) {
      const exact = allMonsters.find(
        (monster) =>
          `${monster.source}:${monster.id}` === mapMonster.monsterKey,
      );

      if (exact) {
        return exact;
      }
    }

    return monstersByName.get(normalizeMonsterName(mapMonster.name)) ?? null;
  };

  const localPopulation = useMemo<LocalPopulationEntry[]>(() => {
    if (!activeRoom?.monsters?.length) {
      return [];
    }

    const entries: LocalPopulationEntry[] = [];

    activeRoom.monsters.forEach((mapMonster) => {
      const monster = resolveMapMonster(mapMonster);

      if (!monster) {
        return;
      }

      entries.push({
        key: `${monster.source}:${monster.id}`,
        monster: monster as WorkspaceMonsterDefinition,
        mapMonster,
        maxQuantity: Math.max(1, Number(mapMonster.count ?? 1)),
      });
    });

    return entries;
  }, [activeRoom, allMonsters, monstersByName]);

  const generatedXp = useMemo(
    () =>
      generatedEncounter.reduce(
        (total, entry) => total + entry.monster.xp * entry.quantity,
        0,
      ),
    [generatedEncounter],
  );

  const generateEncounter = () => {
    setMessage(null);

    if (localPopulation.length === 0) {
      setGeneratedEncounter([]);
      setMessage("No linked monsters are available in this area.");
      return;
    }

    const quantities: number[] = Array.from(
      { length: localPopulation.length },
      () => 0,
    );

    let currentXp = 0;

    const minimumTarget = partyBudget * 0.75;
    const maximumTarget = partyBudget * 1.15;

    let iterations = 0;

    while (iterations < 100) {
      iterations += 1;

      if (
        currentXp >= minimumTarget &&
        (currentXp >= partyBudget || Math.random() < 0.35)
      ) {
        break;
      }

      const candidates: EncounterCandidate[] = [];

      localPopulation.forEach((entry, index) => {
        const currentQuantity = quantities[index] ?? 0;

        const remaining = entry.maxQuantity - currentQuantity;

        if (remaining <= 0) {
          return;
        }

        const xp = Math.max(0, Number(entry.monster.xp ?? 0));

        if (currentXp > 0 && currentXp + xp > maximumTarget) {
          return;
        }

        candidates.push({
          index,
          weight: remaining,
          xp,
        });
      });

      if (candidates.length === 0) {
        break;
      }

      const randomIndex = getWeightedRandomIndex(
        candidates.map((candidate) => candidate.weight),
      );

      if (randomIndex < 0) {
        break;
      }

      const selected = candidates[randomIndex];

      if (!selected) {
        break;
      }

      quantities[selected.index] = (quantities[selected.index] ?? 0) + 1;

      currentXp += selected.xp;
    }

    /*
     * Avoid `every(quantity => quantity === 0)` here.
     * TypeScript can narrow the array to literal 0[] inside
     * that block, which makes assigning 1 invalid.
     */
    const hasGeneratedMonster = quantities.some((quantity) => quantity > 0);

    if (!hasGeneratedMonster) {
      let cheapestIndex = -1;
      let cheapestXp = Number.POSITIVE_INFINITY;

      localPopulation.forEach((entry, index) => {
        const xp = Math.max(0, Number(entry.monster.xp ?? 0));

        if (xp < cheapestXp) {
          cheapestXp = xp;
          cheapestIndex = index;
        }
      });

      if (cheapestIndex >= 0) {
        quantities[cheapestIndex] = 1;
      }
    }

    const next: RandomEncounterEntry[] = [];

    localPopulation.forEach((entry, index) => {
      const quantity = quantities[index] ?? 0;

      if (quantity <= 0) {
        return;
      }

      next.push({
        key: entry.key,
        monster: entry.monster,
        mapMonster: entry.mapMonster,
        quantity,
        maxQuantity: entry.maxQuantity,
      });
    });

    setGeneratedEncounter(next);
  };

  const adjustQuantity = (key: string, delta: number) => {
    setGeneratedEncounter((current) =>
      current
        .map((entry): RandomEncounterEntry => {
          if (entry.key !== key) {
            return entry;
          }

          const nextQuantity = Math.max(
            0,
            Math.min(entry.maxQuantity, entry.quantity + delta),
          );

          return {
            ...entry,
            quantity: nextQuantity,
          };
        })
        .filter((entry) => entry.quantity > 0),
    );
  };

  const addFromPopulation = (key: string) => {
    const source = localPopulation.find((entry) => entry.key === key);

    if (!source) {
      return;
    }

    setGeneratedEncounter((current) => {
      const existing = current.find((entry) => entry.key === key);

      if (existing) {
        return current.map((entry): RandomEncounterEntry => {
          if (entry.key !== key) {
            return entry;
          }

          return {
            ...entry,
            quantity: Math.min(entry.maxQuantity, entry.quantity + 1),
          };
        });
      }

      const newEntry: RandomEncounterEntry = {
        key: source.key,
        monster: source.monster,
        mapMonster: source.mapMonster,
        quantity: 1,
        maxQuantity: source.maxQuantity,
      };

      return [...current, newEntry];
    });
  };

  const inspectMonster = (entry: RandomEncounterEntry) => {
    selectEntity({
      type: "monster",
      monsterKey: entry.key,
      encounterStatus: "manual",
    });
  };

  const startEncounter = () => {
    if (generatedEncounter.length === 0) {
      return;
    }

    createNewEncounter();

    /*
     * Only characters marked active for
     * this campaign join the encounter.
     */
    activeCharacters.forEach((character) => {
      addPlayerToEncounter(mapCharacterToEncounterPlayer(character));
    });

    generatedEncounter.forEach((entry) => {
      for (let index = 0; index < entry.quantity; index += 1) {
        addMonsterToEncounter(entry.monster);
      }
    });

    setMessage(
      `Encounter loaded from ${activeRoom?.name ?? "current area"} with ${
        activeCharacters.length
      } active player${activeCharacters.length === 1 ? "" : "s"}.`,
    );
  };

  const loading = mapsLoading || monstersLoading || campaignCharactersLoading;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-zinc-500">
        Loading encounter data...
      </div>
    );
  }

  if (!activeLocation || !activeRoom) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center">
        <div>
          <i className="fa-solid fa-location-dot text-2xl text-zinc-700" />

          <div className="mt-2 text-xs font-semibold text-zinc-300">
            No active area
          </div>

          <div className="mt-1 max-w-xs text-[10px] leading-4 text-zinc-500">
            Select an area in the Map module first.
          </div>
        </div>
      </div>
    );
  }

  if (localPopulation.length === 0) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0 border-b border-white/10 px-3 py-2">
          <div className="text-[10px] font-semibold text-emerald-300">
            <i className="fa-solid fa-location-dot mr-1" />

            {activeRoom.name}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center p-4 text-center">
          <div>
            <i className="fa-solid fa-dice-d20 text-2xl text-zinc-700" />

            <div className="mt-2 text-xs font-semibold text-zinc-300">
              No encounter population
            </div>

            <div className="mt-1 max-w-xs text-[10px] leading-4 text-zinc-500">
              Add monsters to this map area to generate encounters from it.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-white/10 p-2">
        <div className="flex items-center gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="truncate text-[10px] font-semibold text-emerald-300">
              <i className="fa-solid fa-location-dot mr-1" />

              {activeRoom.name}
            </div>

            <div className="mt-0.5 text-[9px] text-zinc-500">
              {activeCharacters.length} active player
              {activeCharacters.length === 1 ? "" : "s"} · Target {partyBudget}{" "}
              XP
            </div>
          </div>

          <select
            value={difficulty}
            onChange={(event) => {
              setDifficulty(event.target.value as Difficulty);
              setGeneratedEncounter([]);
              setMessage(null);
            }}
            title="Encounter strength"
            className="workspace-no-drag h-7 rounded-md border border-white/10 bg-zinc-900 px-2 text-[9px] font-semibold text-zinc-300 outline-none"
          >
            <option value="low">Low</option>
            <option value="standard">Standard</option>
            <option value="hard">Hard</option>
          </select>

          <button
            type="button"
            onClick={generateEncounter}
            title="Generate random encounter"
            className="workspace-no-drag flex h-7 items-center gap-1.5 rounded-md bg-violet-600 px-2.5 text-[9px] font-semibold text-white transition hover:bg-violet-500"
          >
            <i className="fa-solid fa-dice-d20" />
            Roll
          </button>
        </div>
      </div>

      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
        {generatedEncounter.length > 0 ? (
          <>
            <div className="border-b border-white/5 px-2.5 py-1.5">
              <div className="flex items-center justify-between text-[9px]">
                <span className="font-semibold text-zinc-300">Encounter</span>

                <span
                  className={`font-semibold ${
                    generatedXp > partyBudget * 1.2
                      ? "text-rose-300"
                      : generatedXp > partyBudget
                        ? "text-amber-300"
                        : "text-emerald-300"
                  }`}
                >
                  {generatedXp} / {partyBudget} XP
                </span>
              </div>
            </div>

            {generatedEncounter.map((entry) => (
              <div
                key={entry.key}
                className="flex items-center gap-2 border-b border-white/5 px-2 py-2"
              >
                <button
                  type="button"
                  onClick={() => inspectMonster(entry)}
                  className="workspace-no-drag min-w-0 flex-1 text-left"
                >
                  <div className="truncate text-[11px] font-semibold text-zinc-200 hover:text-white">
                    {entry.monster.name}
                  </div>

                  <div className="mt-0.5 truncate text-[8px] text-zinc-500">
                    CR {entry.monster.challengeRating} · {entry.monster.xp} XP
                    each · max {entry.maxQuantity}
                  </div>

                  {entry.mapMonster.notes ? (
                    <div className="mt-0.5 truncate text-[8px] text-zinc-600">
                      {entry.mapMonster.notes}
                    </div>
                  ) : null}
                </button>

                <div className="workspace-no-drag flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustQuantity(entry.key, -1)}
                    aria-label={`Decrease ${entry.monster.name} quantity`}
                    className="flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-black/20 text-[10px] text-zinc-400 transition hover:bg-white/5 hover:text-white"
                  >
                    −
                  </button>

                  <div className="flex h-6 min-w-7 items-center justify-center rounded border border-white/10 bg-black/20 px-1.5 text-[10px] font-bold text-white">
                    {entry.quantity}
                  </div>

                  <button
                    type="button"
                    disabled={entry.quantity >= entry.maxQuantity}
                    onClick={() => adjustQuantity(entry.key, 1)}
                    aria-label={`Increase ${entry.monster.name} quantity`}
                    className="flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-black/20 text-[10px] text-emerald-300 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            {localPopulation.some(
              (population) =>
                !generatedEncounter.some(
                  (entry) => entry.key === population.key,
                ),
            ) ? (
              <div className="border-b border-white/5 p-2">
                <div className="mb-1 text-[8px] font-bold uppercase tracking-wide text-zinc-600">
                  Add from area
                </div>

                <div className="flex flex-wrap gap-1">
                  {localPopulation
                    .filter(
                      (population) =>
                        !generatedEncounter.some(
                          (entry) => entry.key === population.key,
                        ),
                    )
                    .map((population) => (
                      <button
                        key={population.key}
                        type="button"
                        onClick={() => addFromPopulation(population.key)}
                        className="workspace-no-drag rounded border border-white/10 bg-white/[0.025] px-1.5 py-1 text-[8px] font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        + {population.monster.name}
                      </button>
                    ))}
                </div>
              </div>
            ) : null}

            <div className="p-2">
              <button
                type="button"
                onClick={startEncounter}
                className="workspace-no-drag w-full rounded-md bg-emerald-600 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-emerald-500"
              >
                <i className="fa-solid fa-play mr-1.5" />
                Start Encounter
              </button>

              {message ? (
                <div className="mt-1.5 text-center text-[8px] text-emerald-300">
                  {message}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className="p-2">
            <div className="mb-2 text-[8px] font-bold uppercase tracking-wide text-zinc-600">
              Area population
            </div>

            <div className="space-y-1">
              {localPopulation.map((entry) => (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() =>
                    selectEntity({
                      type: "monster",
                      monsterKey: entry.key,
                      encounterStatus: "manual",
                    })
                  }
                  className="workspace-no-drag flex w-full items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5 text-left transition hover:bg-white/[0.05]"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[10px] font-semibold text-zinc-300">
                      {entry.monster.name}
                    </div>

                    <div className="mt-0.5 text-[8px] text-zinc-600">
                      CR {entry.monster.challengeRating} · {entry.monster.xp} XP
                    </div>

                    {entry.mapMonster.notes ? (
                      <div className="mt-0.5 truncate text-[8px] text-zinc-600">
                        {entry.mapMonster.notes}
                      </div>
                    ) : null}
                  </div>

                  <span className="shrink-0 text-[9px] font-bold text-zinc-400">
                    ×{entry.maxQuantity}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={generateEncounter}
              className="workspace-no-drag mt-2 w-full rounded-md bg-violet-600 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-violet-500"
            >
              <i className="fa-solid fa-dice-d20 mr-1.5" />
              Generate Encounter
            </button>

            {message ? (
              <div className="mt-2 text-center text-[9px] text-rose-300">
                {message}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
