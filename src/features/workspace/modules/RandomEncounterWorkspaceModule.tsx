import { useMemo, useState } from "react";
import type { MonsterDefinition } from "../../monsters/catalog/monsterTypes";
import { useEncounter } from "../../../context/EncounterContext";
import useMonsterLibrary from "../../../hooks/useMonsterLibrary";
import useCampaignPageData from "../../campaigns/hooks/useCampaignPageData";
import { useCampaignMaps } from "../../maps/useCampaignMaps";
import {
  DEFAULT_ENCOUNTER_WEIGHTS,
  type EncounterCategoryWeights,
  type EncounterDisposition,
  type MapEncounterEntry,
  type MapMonster,
  type RandomEncounterType,
} from "../../maps/types";
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
type RandomEncounterEntry = LocalPopulationEntry & { quantity: number };
type EncounterCandidate = { index: number; weight: number; xp: number };

type GeneratedResult =
  | { type: "creature"; creatures: RandomEncounterEntry[] }
  | {
      type: Exclude<RandomEncounterType, "creature">;
      entry: MapEncounterEntry;
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
const normalizeMonsterName = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");
const getCharacterBudget = (level: number) =>
  STANDARD_XP_BY_LEVEL[Math.max(1, Math.min(20, Math.floor(level)))] ?? 50;
const getWeightedRandomIndex = (weights: number[]) => {
  const total = weights.reduce((sum, weight) => sum + Math.max(0, weight), 0);
  if (total <= 0) return -1;
  let roll = Math.random() * total;
  for (let i = 0; i < weights.length; i += 1) {
    roll -= Math.max(0, weights[i] ?? 0);
    if (roll <= 0) return i;
  }
  return weights.length - 1;
};
const randomEntry = <T,>(entries: T[]) =>
  entries.length ? entries[Math.floor(Math.random() * entries.length)] : null;

const DISPOSITION_META: Record<
  EncounterDisposition,
  { label: string; className: string }
> = {
  friendly: { label: "Friendly", className: "text-emerald-300" },
  neutral: { label: "Neutral", className: "text-sky-300" },
  wary: { label: "Wary", className: "text-amber-300" },
  hostile: { label: "Hostile", className: "text-rose-300" },
};

const TYPE_META: Record<
  RandomEncounterType,
  { label: string; icon: string; className: string }
> = {
  creature: {
    label: "Creature Encounter",
    icon: "fa-dragon",
    className: "text-rose-300",
  },
  phenomenon: {
    label: "Phenomenon",
    icon: "fa-cloud",
    className: "text-violet-300",
  },
  event: {
    label: "Event",
    icon: "fa-bolt",
    className: "text-amber-300",
  },
  clue: {
    label: "Clue",
    icon: "fa-magnifying-glass",
    className: "text-cyan-300",
  },
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
  const [generated, setGenerated] = useState<GeneratedResult | null>(null);
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
      if (a.source === "campaign" && b.source !== "campaign") return -1;
      if (b.source === "campaign" && a.source !== "campaign") return 1;
      return 0;
    });
    sorted.forEach((monster) => {
      const key = normalizeMonsterName(monster.name);
      if (!result.has(key)) result.set(key, monster);
    });
    return result;
  }, [allMonsters]);

  const activeMap = useMemo(() => {
    if (!activeLocation) return null;
    return maps.find((map) => map.id === activeLocation.mapId) ?? null;
  }, [maps, activeLocation]);

  const activeRoom = useMemo(() => {
    if (!activeMap || !activeLocation) return null;
    return (
      activeMap.rooms.find((room) => room.id === activeLocation.roomId) ?? null
    );
  }, [activeMap, activeLocation]);

  const activeLocationName =
    activeRoom?.name ?? activeMap?.title ?? "Current map";
  const source = activeRoom ?? activeMap;

  const resolveMapMonster = (mapMonster: MapMonster) => {
    if (mapMonster.monsterKey) {
      const exact = allMonsters.find(
        (monster) =>
          `${monster.source}:${monster.id}` === mapMonster.monsterKey,
      );
      if (exact) return exact;
    }
    return monstersByName.get(normalizeMonsterName(mapMonster.name)) ?? null;
  };

  const localPopulation = useMemo<LocalPopulationEntry[]>(() => {
    const entries: LocalPopulationEntry[] = [];
    (source?.monsters ?? []).forEach((mapMonster) => {
      const monster = resolveMapMonster(mapMonster);
      if (!monster) return;
      entries.push({
        key: `${monster.source}:${monster.id}`,
        monster: monster as WorkspaceMonsterDefinition,
        mapMonster,
        maxQuantity: Math.max(1, Number(mapMonster.count ?? 1)),
      });
    });
    return entries;
  }, [source, allMonsters, monstersByName]);

  const clues = source?.clues ?? [];
  const phenomena = source?.phenomena ?? [];
  const events = source?.events ?? [];
  const weights: EncounterCategoryWeights = {
    ...DEFAULT_ENCOUNTER_WEIGHTS,
    ...(source?.encounterWeights ?? {}),
  };

  const availableTypes = useMemo(() => {
    const candidates: { type: RandomEncounterType; weight: number }[] = [];
    if (localPopulation.length)
      candidates.push({ type: "creature", weight: weights.creature });
    if (phenomena.length)
      candidates.push({ type: "phenomenon", weight: weights.phenomenon });
    if (events.length)
      candidates.push({ type: "event", weight: weights.event });
    if (clues.length) candidates.push({ type: "clue", weight: weights.clue });
    return candidates.filter((candidate) => candidate.weight > 0);
  }, [
    localPopulation,
    phenomena,
    events,
    clues,
    weights.creature,
    weights.phenomenon,
    weights.event,
    weights.clue,
  ]);

  const generatedCreatures =
    generated?.type === "creature" ? generated.creatures : [];
  const generatedXp = useMemo(
    () =>
      generatedCreatures.reduce(
        (total, entry) =>
          total + Number(entry.monster.xp ?? 0) * entry.quantity,
        0,
      ),
    [generatedCreatures],
  );

  const generateCreatures = (): RandomEncounterEntry[] => {
    let quantities: number[] = localPopulation.map(() => 0);
    let currentXp = 0;
    const minimumTarget = partyBudget * 0.75;
    const maximumTarget = partyBudget * 1.15;
    let iterations = 0;

    while (iterations < 100) {
      iterations += 1;
      if (
        currentXp >= minimumTarget &&
        (currentXp >= partyBudget || Math.random() < 0.35)
      )
        break;

      const candidates: EncounterCandidate[] = [];
      localPopulation.forEach((entry, index) => {
        const remaining = entry.maxQuantity - (quantities[index] ?? 0);
        if (remaining <= 0) return;
        const xp = Math.max(0, Number(entry.monster.xp ?? 0));
        if (currentXp > 0 && currentXp + xp > maximumTarget) return;
        candidates.push({ index, weight: remaining, xp });
      });
      if (!candidates.length) break;

      const selectedIndex = getWeightedRandomIndex(
        candidates.map((candidate) => candidate.weight),
      );
      const selected = candidates[selectedIndex];
      if (!selected) break;
      quantities[selected.index] = (quantities[selected.index] ?? 0) + 1;
      currentXp += selected.xp;
    }

    if (!quantities.some((quantity) => quantity > 0)) {
      let cheapestIndex = -1;
      let cheapestXp = Number.POSITIVE_INFINITY;
      localPopulation.forEach((entry, index) => {
        const xp = Math.max(0, Number(entry.monster.xp ?? 0));
        if (xp < cheapestXp) {
          cheapestXp = xp;
          cheapestIndex = index;
        }
      });
      if (cheapestIndex >= 0) quantities[cheapestIndex] = 1;
    }

    return localPopulation.flatMap((entry, index) => {
      const quantity = quantities[index] ?? 0;
      return quantity > 0 ? [{ ...entry, quantity }] : [];
    });
  };

  const clearEncounter = () => {
    setGenerated(null);
    setMessage(null);
  };

  const generateEncounter = () => {
    setMessage(null);
    if (!availableTypes.length) {
      setGenerated(null);
      setMessage("No random encounter content is available in this location.");
      return;
    }
    const typeIndex = getWeightedRandomIndex(
      availableTypes.map((candidate) => candidate.weight),
    );
    const selectedType = availableTypes[typeIndex]?.type;
    if (!selectedType) return;

    if (selectedType === "creature") {
      setGenerated({ type: "creature", creatures: generateCreatures() });
      return;
    }

    const pool =
      selectedType === "phenomenon"
        ? phenomena
        : selectedType === "event"
          ? events
          : clues;
    const entry = randomEntry(pool);
    if (entry) setGenerated({ type: selectedType, entry });
  };

  const adjustQuantity = (key: string, delta: number) => {
    setGenerated((current) => {
      if (!current || current.type !== "creature") return current;
      return {
        ...current,
        creatures: current.creatures
          .map((entry) =>
            entry.key === key
              ? {
                  ...entry,
                  quantity: Math.max(
                    0,
                    Math.min(entry.maxQuantity, entry.quantity + delta),
                  ),
                }
              : entry,
          )
          .filter((entry) => entry.quantity > 0),
      };
    });
  };

  const inspectMonster = (entry: RandomEncounterEntry) =>
    selectEntity({
      type: "monster",
      monsterKey: entry.key,
      encounterStatus: "manual",
    });

  const startEncounter = () => {
    if (
      !generated ||
      generated.type !== "creature" ||
      !generated.creatures.length
    )
      return;
    createNewEncounter();
    activeCharacters.forEach((character) =>
      addPlayerToEncounter(mapCharacterToEncounterPlayer(character)),
    );
    generated.creatures.forEach((entry) => {
      for (let i = 0; i < entry.quantity; i += 1)
        addMonsterToEncounter(entry.monster);
    });
    setMessage(
      `Encounter loaded from ${activeLocationName} with ${
        activeCharacters.length
      } active player${activeCharacters.length === 1 ? "" : "s"}.`,
    );
  };

  const loading = mapsLoading || monstersLoading || campaignCharactersLoading;
  if (loading)
    return (
      <div className="flex h-full items-center justify-center text-xs text-zinc-500">
        Loading encounter data...
      </div>
    );

  if (!activeLocation || !activeMap)
    return (
      <div className="flex h-full items-center justify-center p-4 text-center">
        <div>
          <i className="fa-solid fa-location-dot text-2xl text-zinc-700" />
          <div className="mt-2 text-xs font-semibold text-zinc-300">
            No active map location
          </div>
          <div className="mt-1 max-w-xs text-[10px] leading-4 text-zinc-500">
            Select a map overview or area in the Map module first.
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-white/10 p-2">
        <div className="flex items-center gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="truncate text-[10px] font-semibold text-emerald-300">
              <i className="fa-solid fa-location-dot mr-1" />
              {activeLocationName}
            </div>
            <div className="mt-0.5 text-[9px] text-zinc-500">
              {availableTypes.length} encounter type
              {availableTypes.length === 1 ? "" : "s"} available
            </div>
          </div>
          <select
            value={difficulty}
            onChange={(event) => {
              setDifficulty(event.target.value as Difficulty);
              setGenerated(null);
              setMessage(null);
            }}
            title="Creature encounter strength"
            className="workspace-no-drag h-7 rounded-md border border-white/10 bg-zinc-900 px-2 text-[9px] font-semibold text-zinc-300 outline-none"
          >
            <option value="low">Low</option>
            <option value="standard">Standard</option>
            <option value="hard">Hard</option>
          </select>

          {generated ? (
            <button
              type="button"
              onClick={clearEncounter}
              title="Clear encounter"
              className="workspace-no-drag flex h-7 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 text-[9px] font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              <i className="fa-solid fa-xmark" />
              Clear
            </button>
          ) : null}

          <button
            type="button"
            onClick={generateEncounter}
            className="workspace-no-drag flex h-7 items-center gap-1.5 rounded-md bg-violet-600 px-2.5 text-[9px] font-semibold text-white transition hover:bg-violet-500"
          >
            <i className="fa-solid fa-dice-d20" /> Roll
          </button>
        </div>
      </div>

      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
        {!generated ? (
          <div className="p-2">
            <div className="mb-2 text-[8px] font-bold uppercase tracking-wide text-zinc-600">
              Encounter pool
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  "creature",
                  "phenomenon",
                  "event",
                  "clue",
                ] as RandomEncounterType[]
              ).map((type) => {
                const count =
                  type === "creature"
                    ? localPopulation.length
                    : type === "phenomenon"
                      ? phenomena.length
                      : type === "event"
                        ? events.length
                        : clues.length;
                const meta = TYPE_META[type];
                return (
                  <div
                    key={type}
                    className={`rounded-md border border-white/5 bg-white/[0.02] p-2 ${
                      count ? "" : "opacity-35"
                    }`}
                  >
                    <div
                      className={`text-[9px] font-semibold ${meta.className}`}
                    >
                      <i className={`fa-solid ${meta.icon} mr-1`} />
                      {meta.label}
                    </div>
                    <div className="mt-0.5 text-[8px] text-zinc-500">
                      {count} available · weight {weights[type]}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              disabled={!availableTypes.length}
              onClick={generateEncounter}
              className="workspace-no-drag mt-2 w-full rounded-md bg-violet-600 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-violet-500 disabled:opacity-30"
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
        ) : generated.type === "creature" ? (
          <>
            <div className="border-b border-white/5 px-2.5 py-2">
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`text-[10px] font-bold ${TYPE_META.creature.className}`}
                >
                  <i className={`fa-solid ${TYPE_META.creature.icon} mr-1.5`} />
                  {TYPE_META.creature.label}
                </div>
                <div className="text-[9px] font-semibold text-zinc-400">
                  {generatedXp} / {partyBudget} XP
                </div>
              </div>
            </div>

            {generated.creatures.map((entry) => {
              const disposition = entry.mapMonster.disposition ?? "hostile";
              const dispositionMeta = DISPOSITION_META[disposition];
              return (
                <div
                  key={entry.key}
                  className="flex items-start gap-2 border-b border-white/5 px-2 py-2"
                >
                  <button
                    type="button"
                    onClick={() => inspectMonster(entry)}
                    className="workspace-no-drag min-w-0 flex-1 text-left"
                  >
                    <div className="truncate text-[11px] font-semibold text-zinc-200 hover:text-white">
                      {entry.monster.name}
                    </div>
                    <div className="mt-0.5 text-[8px] text-zinc-500">
                      CR {entry.monster.challengeRating} · {entry.monster.xp} XP
                      {" · "}
                      <span className={dispositionMeta.className}>
                        {dispositionMeta.label}
                      </span>
                    </div>
                    {entry.mapMonster.notes ? (
                      <div className="mt-1 text-[9px] leading-4 text-zinc-400">
                        {entry.mapMonster.notes}
                      </div>
                    ) : null}
                  </button>
                  <div className="workspace-no-drag flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => adjustQuantity(entry.key, -1)}
                      className="flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-black/20 text-[10px] text-zinc-400"
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
                      className="flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-black/20 text-[10px] text-emerald-300 disabled:opacity-25"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="p-2">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={generateEncounter}
                  className="workspace-no-drag rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold text-zinc-200 hover:bg-white/10"
                >
                  <i className="fa-solid fa-rotate mr-1.5" /> Reroll
                </button>
                <button
                  type="button"
                  onClick={startEncounter}
                  className="workspace-no-drag rounded-md bg-emerald-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-emerald-500"
                >
                  <i className="fa-solid fa-play mr-1.5" /> Start Encounter
                </button>
              </div>
              {message ? (
                <div className="mt-1.5 text-center text-[8px] text-emerald-300">
                  {message}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className="p-2">
            <div
              className={`text-[10px] font-bold ${TYPE_META[generated.type].className}`}
            >
              <i
                className={`fa-solid ${TYPE_META[generated.type].icon} mr-1.5`}
              />
              {TYPE_META[generated.type].label}
            </div>
            <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <div className="text-xs font-bold text-white">
                {generated.entry.name}
              </div>
              {generated.entry.description ? (
                <div className="mt-1.5 whitespace-pre-wrap text-[10px] leading-4 text-zinc-300">
                  {generated.entry.description}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={generateEncounter}
              className="workspace-no-drag mt-2 w-full rounded-md bg-violet-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-violet-500"
            >
              <i className="fa-solid fa-dice-d20 mr-1.5" /> Reroll
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
