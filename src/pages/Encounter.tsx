import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Container from "../components/Container";
import H1 from "../components/H1";
import H3 from "../components/H3";
import StatBlock, { StatBlockProps } from "../components/StatBlock";
import { useEncounter } from "../context/EncounterContext";
import useCampaignPageData, {
  type CampaignCharacter,
} from "../features/campaigns/hooks/useCampaignPageData";

type EncounterPlayerInput = {
  name: string;
  maxHp: number;
  currentHp?: number;
  armorClass?: number;
  initiativeBonus?: number;
  level?: number;
  classId?: string;
  speciesId?: string;
};

const getEncounterInitiativeBonus = (character: CampaignCharacter) => {
  const dex = character.abilityScores?.dex;
  if (typeof dex === "number") {
    return Math.floor((dex - 10) / 2);
  }

  return 0;
};

const getEncounterArmorClass = (_character: CampaignCharacter) => {
  return 10;
};

const formatModifier = (value: number) =>
  value >= 0 ? `+${value}` : `${value}`;

const getPassivePerception = (character?: CampaignCharacter) => {
  const wis = character?.abilityScores?.wis;
  if (typeof wis === "number") {
    return 10 + Math.floor((wis - 10) / 2);
  }

  return undefined;
};

const getProficiencyBonus = (level?: number) => {
  if (!level || level < 1) return undefined;
  return 2 + Math.floor((level - 1) / 4);
};

const buildPlayerSubtitle = (character?: CampaignCharacter) => {
  if (!character) return "Player Character";

  const parts = [
    character.race,
    character.className,
    typeof character.level === "number"
      ? `Level ${character.level}`
      : undefined,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" • ") : "Player Character";
};

const mapCharacterToEncounterPlayer = (
  character: CampaignCharacter,
): EncounterPlayerInput => {
  return {
    name: character.name,
    maxHp: character.maxHp ?? 1,
    currentHp: character.currentHp ?? character.maxHp ?? 1,
    armorClass: getEncounterArmorClass(character),
    initiativeBonus: getEncounterInitiativeBonus(character),
    level: character.level,
    classId: character.classId,
    speciesId: character.speciesId,
  };
};

const Encounter = () => {
  const { campaignId } = useParams<{ campaignId: string }>();

  const { campaignCharacters, campaignCharactersLoading } =
    useCampaignPageData(campaignId);

  const {
    encounter,
    currentTurnIndex,
    currentRound,
    savedEncounters,
    activeEncounterId,
    addPlayerToEncounter,
    removeEntityFromEncounter,
    updateEntityHp,
    renameEntity,
    clearEncounter,
    createNewEncounter,
    saveCurrentEncounter,
    loadEncounter,
    deleteEncounter,
    getEntityByName,
    nextTurn,
    previousTurn,
    resetTurns,
    rollInitiative,
  } = useEncounter();

  const [encounterName, setEncounterName] = useState("");

  const trackerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hiddenLeftCount, setHiddenLeftCount] = useState(0);
  const [hiddenRightCount, setHiddenRightCount] = useState(0);

  useEffect(() => {
    if (!activeEncounterId) {
      setEncounterName("");
      return;
    }

    const activeSavedEncounter = savedEncounters.find(
      (saved) => saved.id === activeEncounterId,
    );

    if (activeSavedEncounter) {
      setEncounterName(activeSavedEncounter.name);
    }
  }, [activeEncounterId, savedEncounters]);

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
      (entry) =>
        entry.entityKind === "player" && entry.entityName === playerName,
    );

  const areAllPlayersInEncounter =
    campaignCharacters.length > 0 &&
    campaignCharacters.every((character) =>
      isPlayerInEncounter(character.name),
    );

  const togglePlayerInEncounter = (character: CampaignCharacter) => {
    const existing = encounter.find(
      (entry) =>
        entry.entityKind === "player" && entry.entityName === character.name,
    );

    if (existing) {
      removeEntityFromEncounter(existing.id);
      return;
    }

    addPlayerToEncounter(mapCharacterToEncounterPlayer(character));
  };

  const toggleAllPlayers = () => {
    if (areAllPlayersInEncounter) {
      encounter
        .filter((entry) => entry.entityKind === "player")
        .forEach((entry) => removeEntityFromEncounter(entry.id));
      return;
    }

    campaignCharacters.forEach((character) => {
      if (!isPlayerInEncounter(character.name)) {
        addPlayerToEncounter(mapCharacterToEncounterPlayer(character));
      }
    });
  };

  const handleSaveEncounter = () => {
    saveCurrentEncounter(encounterName.trim());
  };

  const handleCreateNewEncounter = () => {
    createNewEncounter();
    setEncounterName("");
  };

  const handleLoadEncounter = (id: string) => {
    loadEncounter(id);
  };

  const handleDeleteEncounter = (id: string) => {
    deleteEncounter(id);

    if (activeEncounterId === id) {
      setEncounterName("");
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

  const monsterStatBlocks: StatBlockProps[] = uniqueEncounterEntities
    .filter((entry) => entry.entityKind !== "player")
    .map((entry) => getEntityByName(entry.entityKind, entry.entityName))
    .filter((entity): entity is StatBlockProps => entity !== undefined);

  const encounterPlayers = sortedEncounter
    .filter((entry) => entry.entityKind === "player")
    .map((entry) => {
      const snapshotId = entry.playerSnapshot?.characterId;

      const campaignCharacter = campaignCharacters.find((character) => {
        if (snapshotId) return character.id === snapshotId;
        return character.name === entry.entityName;
      });

      return {
        entry,
        campaignCharacter,
      };
    });

  if (!campaignId) {
    return (
      <Container>
        <div className="rounded-2xl border border-red-800 bg-red-500/10 p-4 text-sm text-red-300">
          No campaign selected.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-2">
            <H1>Encounter</H1>
            <p className="text-sm text-neutral-400">
              Manage initiative, turn order, and active characters from the
              campaign.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <H3 className="mb-0">Campaign Characters</H3>

                {campaignCharacters.length > 0 && (
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-yellow-700/60 bg-yellow-500/10 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={areAllPlayersInEncounter}
                      onChange={toggleAllPlayers}
                    />
                    <span className="font-medium text-yellow-300">All</span>
                  </label>
                )}
              </div>

              {campaignCharactersLoading ? (
                <p className="text-sm text-neutral-400">
                  Loading campaign characters...
                </p>
              ) : campaignCharacters.length === 0 ? (
                <p className="text-sm text-neutral-400">
                  No characters found for this campaign.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {campaignCharacters.map((character) => {
                    const isChecked = isPlayerInEncounter(character.name);

                    return (
                      <button
                        key={character.id}
                        type="button"
                        onClick={() => togglePlayerInEncounter(character)}
                        className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                          isChecked
                            ? "border-green-700 bg-green-500/10 text-green-300"
                            : "border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-neutral-600"
                        }`}
                      >
                        <div className="font-medium">{character.name}</div>
                        <div className="text-xs text-neutral-400">
                          HP {character.currentHp ?? 1}/{character.maxHp ?? 1}
                          {typeof character.level === "number"
                            ? ` • Level ${character.level}`
                            : ""}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
              <H3 className="mb-3">Saved Encounters</H3>

              <div className="mb-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={encounterName}
                  onChange={(e) => setEncounterName(e.target.value)}
                  placeholder="Encounter name..."
                  className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none transition focus:border-yellow-600"
                />

                <button
                  onClick={handleSaveEncounter}
                  className="rounded-xl border border-green-700 bg-green-500/10 px-3 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/15"
                >
                  Save
                </button>

                <button
                  onClick={handleCreateNewEncounter}
                  className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm font-medium text-neutral-200 transition hover:border-neutral-600"
                >
                  New Encounter
                </button>
              </div>

              <div className="space-y-2">
                {savedEncounters.length === 0 ? (
                  <p className="text-sm text-neutral-400">
                    No saved encounters yet.
                  </p>
                ) : (
                  savedEncounters.map((saved) => (
                    <div
                      key={saved.id}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 ${
                        activeEncounterId === saved.id
                          ? "border-yellow-700 bg-yellow-500/10"
                          : "border-neutral-800 bg-neutral-900"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-neutral-100">
                          {saved.name}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => handleLoadEncounter(saved.id)}
                          className="rounded-lg border border-blue-700 bg-blue-500/10 px-2.5 py-1.5 text-xs font-medium text-blue-300"
                        >
                          Load
                        </button>

                        <button
                          onClick={() => handleDeleteEncounter(saved.id)}
                          className="rounded-lg border border-red-700 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>

        {encounter.length > 0 ? (
          <>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-300">
                  <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2">
                    Round{" "}
                    <span className="font-semibold text-yellow-400">
                      {currentRound}
                    </span>
                  </div>

                  <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2">
                    Active{" "}
                    <span className="font-semibold text-yellow-400">
                      {activeEntity?.displayName ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={rollInitiative}
                    className="rounded-xl border border-blue-700 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-300"
                  >
                    Start Encounter
                  </button>

                  <button
                    onClick={previousTurn}
                    className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm font-medium text-neutral-200"
                  >
                    Previous Turn
                  </button>

                  <button
                    onClick={nextTurn}
                    className="rounded-xl border border-green-700 bg-green-500/10 px-3 py-2 text-sm font-medium text-green-300"
                  >
                    Next Turn
                  </button>

                  <button
                    onClick={resetTurns}
                    className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm font-medium text-neutral-200"
                  >
                    Reset
                  </button>

                  <button
                    onClick={clearEncounter}
                    className="rounded-xl border border-red-700 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300"
                  >
                    Delete Active Encounter
                  </button>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between gap-3">
                <H3 className="mb-0">Turn Order</H3>

                <div className="flex items-center gap-2">
                  <div className="min-w-6 text-center text-xs text-neutral-500">
                    {hiddenLeftCount > 0 ? hiddenLeftCount : ""}
                  </div>

                  <button
                    onClick={() => scrollTracker("left")}
                    className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
                    title="Scroll left"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>

                  <button
                    onClick={() => scrollTracker("right")}
                    className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white"
                    title="Scroll right"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>

                  <div className="min-w-6 text-center text-xs text-neutral-500">
                    {hiddenRightCount > 0 ? hiddenRightCount : ""}
                  </div>
                </div>
              </div>

              <div
                ref={trackerRef}
                className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {sortedEncounter.map((entry, index) => {
                  const isPlayer = entry.entityKind === "player";
                  const isActive =
                    sortedEncounter[currentTurnIndex]?.id === entry.id;

                  return (
                    <div
                      key={entry.id}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      className={`w-56 shrink-0 rounded-2xl border p-3 transition ${
                        isActive
                          ? isPlayer
                            ? "border-green-600 bg-green-500/10"
                            : "border-yellow-600 bg-yellow-500/10"
                          : "border-neutral-800 bg-neutral-950"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <input
                          value={entry.displayName}
                          onChange={(e) =>
                            renameEntity(entry.id, e.target.value)
                          }
                          className={`min-w-0 flex-1 border-b bg-transparent pb-1 font-semibold outline-none ${
                            isPlayer
                              ? "border-green-800 text-green-300"
                              : "border-yellow-800 text-yellow-300"
                          }`}
                        />

                        <button
                          onClick={() => removeEntityFromEncounter(entry.id)}
                          className="shrink-0 text-neutral-500 transition hover:text-red-400"
                          title="Remove from encounter"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-neutral-400">HP</span>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={entry.currentHp}
                              onChange={(e) =>
                                updateEntityHp(entry.id, Number(e.target.value))
                              }
                              className="w-16 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1 text-right text-white"
                            />
                            <span className="text-neutral-500">
                              / {entry.maxHp}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-neutral-400">Initiative</span>
                          <span className="font-medium text-neutral-100">
                            {entry.initiative === "" ? "—" : entry.initiative}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-neutral-400">Type</span>
                          <span className="capitalize text-neutral-300">
                            {entry.entityKind}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {encounterPlayers.length > 0 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-sm">
                <H3 className="mb-4">Players in the Encounter</H3>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {encounterPlayers.map(({ entry, campaignCharacter }) => {
                    const armorClass = entry.playerSnapshot?.armorClass ?? "—";
                    const initiativeBonus =
                      entry.playerSnapshot?.initiativeBonus;
                    const passivePerception =
                      getPassivePerception(campaignCharacter);
                    const proficiencyBonus = getProficiencyBonus(
                      campaignCharacter?.level,
                    );

                    return (
                      <StatBlock
                        key={entry.id}
                        variant="player"
                        name={entry.displayName}
                        img={campaignCharacter?.imageUrl}
                        quickView={{
                          subtitle: buildPlayerSubtitle(campaignCharacter),
                          armorClass,
                          currentHp: entry.currentHp,
                          maxHp: entry.maxHp,
                          initiativeBonus:
                            typeof initiativeBonus === "number"
                              ? formatModifier(initiativeBonus)
                              : undefined,
                          passivePerception,
                          proficiencyBonus:
                            typeof proficiencyBonus === "number"
                              ? formatModifier(proficiencyBonus)
                              : undefined,
                          conditions: campaignCharacter?.conditions ?? [],
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {monsterStatBlocks.length > 0 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-sm">
                <H3 className="mb-4">Stat Blocks</H3>

                <div className="flex flex-wrap gap-4">
                  {monsterStatBlocks.map((entity) => (
                    <StatBlock key={`${entity.name}`} {...entity} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 text-sm text-neutral-400 shadow-sm">
            No characters have been added yet. Select players from the campaign
            or add enemies to the encounter system.
          </div>
        )}
      </div>
    </Container>
  );
};

export default Encounter;
