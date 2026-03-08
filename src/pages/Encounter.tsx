import { useEffect, useMemo, useRef, useState } from "react";
import Container from "../components/Container";
import H1 from "../components/H1";
import H3 from "../components/H3";
import StatBlock, { StatBlockProps } from "../components/StatBlock";
import { useEncounter } from "../context/EncounterContext";
import { players } from "../data/players";

const Encounter = () => {
  const {
    encounter,
    currentTurnIndex,
    currentRound,
    addPlayerToEncounter,
    removeEntityFromEncounter,
    updateEntityHp,
    renameEntity,
    clearEncounter,
    getEntityByName,
    nextTurn,
    previousTurn,
    resetTurns,
    rollInitiative,
  } = useEncounter();

  const trackerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hiddenLeftCount, setHiddenLeftCount] = useState(0);
  const [hiddenRightCount, setHiddenRightCount] = useState(0);

  const sortedEncounter = useMemo(() => {
    return [...encounter].sort((a, b) => {
      const aInit = a.initiative === "" ? -999 : a.initiative;
      const bInit = b.initiative === "" ? -999 : b.initiative;

      if (bInit !== aInit) return bInit - aInit;

      if (a.entityKind !== b.entityKind) {
        return a.entityKind === "player" ? -1 : 1;
      }

      return a.displayName.localeCompare(b.displayName);
    });
  }, [encounter]);

  const activeEntity = sortedEncounter[currentTurnIndex];

  const updateHiddenCounts = () => {
    const container = trackerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    let left = 0;
    let right = 0;

    itemRefs.current.forEach((item) => {
      if (!item) return;

      const itemRect = item.getBoundingClientRect();

      if (itemRect.right < containerRect.left) {
        left += 1;
      } else if (itemRect.left > containerRect.right) {
        right += 1;
      }
    });

    setHiddenLeftCount(left);
    setHiddenRightCount(right);
  };

  useEffect(() => {
    updateHiddenCounts();

    const container = trackerRef.current;
    if (!container) return;

    const handleScroll = () => updateHiddenCounts();
    const handleResize = () => updateHiddenCounts();

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [sortedEncounter]);

  useEffect(() => {
    const activeItem = itemRefs.current[currentTurnIndex];
    if (!activeItem) return;

    activeItem.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    const timeout = window.setTimeout(() => {
      updateHiddenCounts();
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [currentTurnIndex, sortedEncounter]);

  const scrollTracker = (direction: "left" | "right") => {
    const container = trackerRef.current;
    if (!container) return;

    const firstItem = itemRefs.current.find(Boolean);
    const step = firstItem ? firstItem.offsetWidth + 8 : 260;

    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });

    const timeout = window.setTimeout(() => {
      updateHiddenCounts();
    }, 300);

    return () => window.clearTimeout(timeout);
  };

  const isPlayerInEncounter = (playerName: string) =>
    encounter.some(
      (e) => e.entityKind === "player" && e.entityName === playerName,
    );

  const areAllPlayersInEncounter =
    players.length > 0 && players.every((p) => isPlayerInEncounter(p.name));

  const togglePlayerInEncounter = (playerName: string) => {
    const existing = encounter.find(
      (e) => e.entityKind === "player" && e.entityName === playerName,
    );

    if (existing) {
      removeEntityFromEncounter(existing.id);
      return;
    }

    const player = players.find((p) => p.name === playerName);
    if (player) addPlayerToEncounter(player);
  };

  const toggleAllPlayers = () => {
    if (areAllPlayersInEncounter) {
      encounter
        .filter((e) => e.entityKind === "player")
        .forEach((e) => removeEntityFromEncounter(e.id));
    } else {
      players.forEach((player) => {
        if (!isPlayerInEncounter(player.name)) {
          addPlayerToEncounter(player);
        }
      });
    }
  };

  const uniqueEncounterEntities = Array.from(
    new Map(
      encounter.map((entry) => [
        `${entry.entityKind}-${entry.entityName}`,
        {
          entityKind: entry.entityKind,
          entityName: entry.entityName,
        },
      ]),
    ).values(),
  );

  const relevantStatBlocks: StatBlockProps[] = uniqueEncounterEntities
    .map((entry) => getEntityByName(entry.entityKind, entry.entityName))
    .filter((entity): entity is StatBlockProps => entity !== undefined);

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="flex w-full flex-col gap-3">
            <H1>Kamp</H1>

            <div className="mb-4">
              <p className="mb-2 font-medium">Aktive spillere</p>

              <div className="flex flex-wrap gap-2">
                <label className="flex cursor-pointer items-center gap-2 rounded border border-yellow-700 bg-neutral-900 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={areAllPlayersInEncounter}
                    onChange={toggleAllPlayers}
                  />
                  <span className="font-medium text-yellow-400">Alle</span>
                </label>

                {players.map((player) => {
                  const isChecked = isPlayerInEncounter(player.name);

                  return (
                    <label
                      key={player.name}
                      className="flex cursor-pointer items-center gap-2 rounded border border-neutral-600 px-3 py-2"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePlayerInEncounter(player.name)}
                      />
                      <span>{player.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {encounter.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={rollInitiative}
                  className="rounded border border-blue-700 bg-blue-900 px-2 py-1 text-white"
                >
                  <i className="fa-solid fa-play"></i> Start Kamp
                </button>

                <button
                  onClick={previousTurn}
                  className="rounded border border-neutral-600 bg-neutral-800 px-2 py-1 text-white"
                >
                  <i className="fa-solid fa-angle-left"></i> Forrige Tur
                </button>

                <button
                  onClick={nextTurn}
                  className="rounded border border-green-700 bg-green-900 px-2 py-1 text-white"
                >
                  <i className="fa-solid fa-angle-right"></i> Neste Tur
                </button>

                <button
                  onClick={resetTurns}
                  className="rounded border border-neutral-600 bg-neutral-800 px-2 py-1 text-white"
                >
                  <i className="fa-solid fa-arrow-rotate-left"></i> Tilbakestill
                </button>

                {encounter.length > 0 && (
                  <button
                    onClick={clearEncounter}
                    className="rounded border border-red-700 bg-red-900 px-2 py-1 text-white"
                  >
                    <i className="fa-solid fa-trash"></i> Slett Kamp
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {encounter.length === 0 ? (
          <p className="text-neutral-400">
            No entities added yet. Go to Stats or Players and add them to the
            encounter.
          </p>
        ) : (
          <>
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between gap-3">
                <H3 className="mb-0">Tur</H3>
                <div className="flex items-center gap-4 text-sm text-neutral-300">
                  <p>
                    Runde{" "}
                    <span className="font-semibold text-yellow-500">
                      {currentRound}
                    </span>
                  </p>

                  {activeEntity && (
                    <p>
                      Aktiv karakter:{" "}
                      <span className="font-semibold text-yellow-500">
                        {activeEntity.displayName}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="min-w-8 text-center text-sm text-neutral-400">
                    {hiddenLeftCount > 0 ? hiddenLeftCount : ""}
                  </div>

                  <button
                    onClick={() => scrollTracker("left")}
                    className="rounded border border-neutral-600 bg-neutral-800 px-3 py-2 text-white"
                    title="Scroll left"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>

                  <button
                    onClick={() => scrollTracker("right")}
                    className="rounded border border-neutral-600 bg-neutral-800 px-3 py-2 text-white"
                    title="Scroll right"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>

                  <div className="min-w-8 text-center text-sm text-neutral-400">
                    {hiddenRightCount > 0 ? hiddenRightCount : ""}
                  </div>
                </div>
              </div>

              <div
                ref={trackerRef}
                className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {sortedEncounter.map((entry, index) => {
                  const entity = getEntityByName(
                    entry.entityKind,
                    entry.entityName,
                  );

                  if (!entity) {
                    return (
                      <div
                        key={entry.id}
                        className="w-44 shrink-0 rounded border border-red-700 bg-neutral-800 p-3"
                      >
                        <p className="text-red-400">
                          Entity data not found for: {entry.entityName}
                        </p>
                        <button
                          onClick={() => removeEntityFromEncounter(entry.id)}
                          className="mt-2 text-sm text-white underline"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  }

                  const isPlayer = entry.entityKind === "player";
                  const isActive =
                    sortedEncounter[currentTurnIndex]?.id === entry.id;

                  return (
                    <div
                      key={entry.id}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      className={`w-44 shrink-0 rounded border-2 px-2 py-1 ${
                        isActive
                          ? isPlayer
                            ? "border-green-500 bg-neutral-800"
                            : "border-yellow-500 bg-neutral-800"
                          : "border-neutral-700 bg-neutral-800"
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <input
                          value={entry.displayName}
                          onChange={(e) =>
                            renameEntity(entry.id, e.target.value)
                          }
                          className={`min-w-0 flex-1 border-b bg-transparent font-semibold focus:outline-none ${
                            isPlayer
                              ? "border-neutral-600 text-green-400"
                              : "border-neutral-600 text-yellow-500"
                          }`}
                        />

                        <button
                          onClick={() => removeEntityFromEncounter(entry.id)}
                          className="shrink-0 text-neutral-400 transition hover:text-red-400"
                          title="Remove from encounter"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-sm">
                        <label className="flex items-center gap-1">
                          <span>
                            <i className="fa-solid fa-heart"></i>
                          </span>
                          <input
                            type="number"
                            value={entry.currentHp}
                            onChange={(e) =>
                              updateEntityHp(entry.id, Number(e.target.value))
                            }
                            className="w-14 rounded border border-neutral-600 bg-neutral-900 px-2 py-1 text-white"
                          />
                          <span className="text-neutral-400">
                            / {entry.maxHp}
                          </span>
                        </label>

                        <div className="flex items-center gap-2 text-neutral-200">
                          <span>
                            <i className="fa-solid fa-forward-fast"></i>
                          </span>
                          <span>
                            {entry.initiative === "" ? "—" : entry.initiative}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <H3 className="mb-4">Stats</H3>

              <div className="flex flex-wrap gap-4">
                {relevantStatBlocks.map((entity) => (
                  <StatBlock
                    key={`${entity.type}-${entity.name}`}
                    {...entity}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Encounter;
