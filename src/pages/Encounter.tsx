import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Avatar from "../components/Avatar";
import AwardXpModal from "../components/awardXpModal";
import Container from "../components/Container";
import H1 from "../components/H1";
import H3 from "../components/H3";
import StatBlock from "../components/StatBlock";
import { useEncounter } from "../context/EncounterContext";
import useCampaignPageData, {
  ALL_CONDITIONS,
  type CampaignCharacter,
} from "../features/campaigns/hooks/useCampaignPageData";

import { getXpProgressWithinLevel } from "../rulesets/dnd/dnd2024/xpProgression";
import { getCharacterArmorClassFromEquipment } from "../rulesets/dnd/dnd2024/getCharacterArmorClassFromEquipment";
import { getCharacterHp } from "../rulesets/dnd/dnd2024/getCharacterHp";
import type { CharacterEquipmentEntry } from "../rulesets/dnd/dnd2024/types";

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

const formatModifier = (value: number) =>
  value >= 0 ? `+${value}` : `${value}`;

const getEncounterInitiativeBonus = (character: CampaignCharacter) => {
  const dex = character.abilityScores?.dex;
  if (typeof dex === "number") {
    return Math.floor((dex - 10) / 2);
  }

  return 0;
};

const getEncounterArmorClass = (character: CampaignCharacter) => {
  const dex = character.abilityScores?.dex ?? 10;
  const equipment =
    (character as { equipment?: CharacterEquipmentEntry[] }).equipment ?? [];

  try {
    return getCharacterArmorClassFromEquipment({
      dexterityScore: dex,
      equipment,
    });
  } catch (error) {
    console.error("Failed to calculate armor class for encounter:", error);
    return 10;
  }
};

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

const getLiveCharacterHp = (character?: CampaignCharacter) => {
  if (!character) {
    return {
      currentHp: 0,
      maxHp: 1,
    };
  }

  try {
    const hp = getCharacterHp(character as never);

    return {
      currentHp: hp.currentHp,
      maxHp: hp.maxHp,
    };
  } catch {
    return {
      currentHp: character.currentHp ?? 0,
      maxHp: character.maxHp ?? 1,
    };
  }
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
  const liveHp = getLiveCharacterHp(character);

  return {
    name: character.name,
    maxHp: liveHp.maxHp,
    currentHp: liveHp.currentHp,
    armorClass: getEncounterArmorClass(character),
    initiativeBonus: getEncounterInitiativeBonus(character),
    level: character.level,
    classId: character.classId,
    speciesId: character.speciesId,
  };
};

const Encounter = () => {
  const { campaignId } = useParams<{ campaignId: string }>();

  const {
    campaignCharacters,
    campaignCharactersLoading,
    updateCharacter,
    updateCharacterXp,
    toggleCondition,
  } = useCampaignPageData(campaignId);

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
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);
  const [hpAdjustments, setHpAdjustments] = useState<Record<string, number>>(
    {},
  );
  const [xpAdjustments, setXpAdjustments] = useState<Record<string, number>>(
    {},
  );
  const [openConditionMenuId, setOpenConditionMenuId] = useState<string | null>(
    null,
  );
  const [isAwardXpModalOpen, setIsAwardXpModalOpen] = useState(false);

  useEffect(() => {
    if (!activeEncounterId) {
      setEncounterName((prev) => (prev === "" ? prev : ""));
      return;
    }

    const activeSavedEncounter = savedEncounters.find(
      (saved) => saved.id === activeEncounterId,
    );

    const nextName = activeSavedEncounter?.name ?? "";
    setEncounterName((prev) => (prev === nextName ? prev : nextName));
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

  const campaignCharactersById = useMemo(() => {
    return new Map(
      campaignCharacters.map((character) => [character.id, character]),
    );
  }, [campaignCharacters]);

  const campaignCharactersByName = useMemo(() => {
    return new Map(
      campaignCharacters.map((character) => [character.name, character]),
    );
  }, [campaignCharacters]);

  const findCampaignCharacterForEntry = (
    entry: (typeof encounter)[number],
  ): CampaignCharacter | undefined => {
    const snapshotId = entry.playerSnapshot?.characterId;

    if (snapshotId) {
      return campaignCharactersById.get(snapshotId);
    }

    return campaignCharactersByName.get(entry.entityName);
  };

  const hpSyncQueue = useMemo(() => {
    return encounter
      .filter((entry) => entry.entityKind === "player")
      .map((entry) => {
        const campaignCharacter = findCampaignCharacterForEntry(entry);
        if (!campaignCharacter) return null;

        const liveHp = getLiveCharacterHp(campaignCharacter);

        if (entry.currentHp === liveHp.currentHp) {
          return null;
        }

        return {
          entryId: entry.id,
          nextHp: liveHp.currentHp,
        };
      })
      .filter(
        (
          item,
        ): item is {
          entryId: string;
          nextHp: number;
        } => item !== null,
      );
  }, [encounter, campaignCharactersById, campaignCharactersByName]);

  useEffect(() => {
    if (hpSyncQueue.length === 0) return;

    hpSyncQueue.forEach(({ entryId, nextHp }) => {
      updateEntityHp(entryId, nextHp);
    });
  }, [hpSyncQueue, updateEntityHp]);

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

  const handleTurnOrderHpChange = async (
    entryId: string,
    nextHp: number,
    entry: (typeof encounter)[number],
  ) => {
    const clampedHp = Math.max(0, Number.isFinite(nextHp) ? nextHp : 0);

    updateEntityHp(entryId, clampedHp);

    if (entry.entityKind !== "player") return;

    const campaignCharacter = findCampaignCharacterForEntry(entry);
    if (!campaignCharacter) return;

    const liveHp = getLiveCharacterHp(campaignCharacter);
    const nextCharacterHp = Math.min(liveHp.maxHp, clampedHp);

    await updateCharacter(campaignCharacter.id, {
      currentHp: nextCharacterHp,
    });
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

  const monsterStatBlocks = uniqueEncounterEntities
    .filter((entry) => entry.entityKind !== "player")
    .map((entry) => getEntityByName(entry.entityKind, entry.entityName))
    .filter((entity) => entity !== undefined);

  const encounterPlayers = sortedEncounter
    .filter((entry) => entry.entityKind === "player")
    .map((entry) => {
      const campaignCharacter = findCampaignCharacterForEntry(entry);

      return {
        entry,
        campaignCharacter,
      };
    });

  const encounterPlayerCharacters = encounterPlayers
    .map(({ campaignCharacter }) => campaignCharacter)
    .filter(
      (character): character is CampaignCharacter => character !== undefined,
    );

  const awardXpCharacters = encounterPlayerCharacters.map((character) => ({
    id: character.id,
    name: character.name,
    level: character.level ?? 1,
  }));

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
        <div className="flex items-center justify-between gap-4">
          <Link
            to={`/campaigns/${campaignId}`}
            className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to campaign
          </Link>
        </div>

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
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={areAllPlayersInEncounter}
                      onChange={toggleAllPlayers}
                    />
                    <span className="font-medium text-white">All</span>
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
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${
                          isChecked
                            ? "border-white/20 bg-white/15 text-white"
                            : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                        }`}
                      >
                        <Avatar
                          name={character.name}
                          src={character.imageUrl}
                          size="sm"
                        />

                        <div>
                          <div className="font-medium">{character.name}</div>
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
                  {encounterPlayerCharacters.length > 0 && (
                    <button
                      onClick={() => setIsAwardXpModalOpen(true)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Award XP
                    </button>
                  )}

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
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/60">
                <div className="grid grid-cols-[90px_56px_minmax(0,1fr)_150px_44px] gap-3 border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  <div>Initiative</div>
                  <div>Image</div>
                  <div>Name</div>
                  <div>HP</div>
                  <div></div>
                </div>

                <div className="divide-y divide-white/10">
                  {sortedEncounter.map((entry) => {
                    const isPlayer = entry.entityKind === "player";
                    const isActive =
                      sortedEncounter[currentTurnIndex]?.id === entry.id;

                    const campaignCharacter = isPlayer
                      ? findCampaignCharacterForEntry(entry)
                      : undefined;

                    const monsterEntity = !isPlayer
                      ? getEntityByName(entry.entityKind, entry.entityName)
                      : undefined;

                    const avatarSrc = isPlayer
                      ? campaignCharacter?.imageUrl
                      : monsterEntity?.img;

                    const displayMaxHp = isPlayer
                      ? campaignCharacter
                        ? getLiveCharacterHp(campaignCharacter).maxHp
                        : entry.maxHp
                      : entry.maxHp;

                    return (
                      <div
                        key={entry.id}
                        className={`grid grid-cols-[90px_56px_minmax(0,1fr)_150px_44px] items-center gap-3 px-4 py-3 transition ${
                          isActive ? "bg-white/10" : "bg-transparent"
                        }`}
                      >
                        <div className="text-sm font-semibold text-white">
                          {entry.initiative === "" ? "—" : entry.initiative}
                        </div>

                        <div className="flex justify-center">
                          <Avatar
                            name={entry.displayName}
                            src={avatarSrc}
                            size="sm"
                          />
                        </div>

                        <div className="min-w-0">
                          <input
                            value={entry.displayName}
                            onChange={(e) =>
                              renameEntity(entry.id, e.target.value)
                            }
                            className={`w-full border-b bg-transparent pb-1 text-sm font-semibold outline-none ${
                              isPlayer
                                ? "border-green-800 text-green-300"
                                : "border-yellow-800 text-yellow-300"
                            }`}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={entry.currentHp}
                            onChange={(e) =>
                              handleTurnOrderHpChange(
                                entry.id,
                                Number(e.target.value),
                                entry,
                              )
                            }
                            className="w-16 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1 text-right text-sm text-white"
                          />
                          <span className="text-sm text-neutral-500">
                            / {displayMaxHp}
                          </span>
                        </div>

                        <button
                          onClick={() => removeEntityFromEncounter(entry.id)}
                          className="text-neutral-500 transition hover:text-red-400"
                          title="Remove from encounter"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {encounterPlayers.length > 0 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-sm">
                <H3 className="mb-4">Players in the Encounter</H3>

                <div className="space-y-3">
                  {encounterPlayers.map(({ entry, campaignCharacter }) => {
                    if (!campaignCharacter) return null;

                    const liveHp = getLiveCharacterHp(campaignCharacter);
                    const armorClass =
                      getEncounterArmorClass(campaignCharacter);
                    const initiativeBonus =
                      getEncounterInitiativeBonus(campaignCharacter);
                    const passivePerception =
                      getPassivePerception(campaignCharacter);
                    const proficiencyBonus = getProficiencyBonus(
                      campaignCharacter.level,
                    );

                    const hp = liveHp.currentHp;
                    const maxHp = liveHp.maxHp;
                    const hpPercent = Math.max(
                      0,
                      Math.min(100, (hp / Math.max(1, maxHp)) * 100),
                    );
                    const xpData = getXpProgressWithinLevel(
                      campaignCharacter.xp ?? 0,
                    );
                    const isExpanded =
                      expandedPlayerId === campaignCharacter.id;
                    const pendingHpDelta =
                      hpAdjustments[campaignCharacter.id] ?? 0;
                    const pendingXpDelta =
                      xpAdjustments[campaignCharacter.id] ?? 0;

                    return (
                      <div
                        key={entry.id}
                        className="rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-4 transition hover:border-white/15"
                      >
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                          <div className="min-w-0 flex-1">
                            <StatBlock
                              variant="player"
                              name={entry.displayName}
                              img={campaignCharacter.imageUrl}
                              quickView={{
                                subtitle:
                                  buildPlayerSubtitle(campaignCharacter),
                                armorClass,
                                currentHp: liveHp.currentHp,
                                maxHp: liveHp.maxHp,
                                initiativeBonus:
                                  formatModifier(initiativeBonus),
                                passivePerception,
                                proficiencyBonus:
                                  typeof proficiencyBonus === "number"
                                    ? formatModifier(proficiencyBonus)
                                    : undefined,
                                conditions: campaignCharacter.conditions ?? [],
                              }}
                            />
                          </div>

                          <div className="w-full xl:max-w-[360px]">
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-300">
                                  HP {hp}/{maxHp}
                                </span>

                                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-blue-300">
                                  XP {campaignCharacter.xp ?? 0}
                                </span>

                                {xpData.nextLevelXp !== null ? (
                                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-zinc-400">
                                    {xpData.neededXp} to next
                                  </span>
                                ) : (
                                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-zinc-400">
                                    Max level
                                  </span>
                                )}
                              </div>

                              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    hpPercent <= 25
                                      ? "bg-red-400"
                                      : hpPercent <= 60
                                        ? "bg-amber-400"
                                        : "bg-emerald-400"
                                  }`}
                                  style={{ width: `${hpPercent}%` }}
                                />
                              </div>

                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                {(campaignCharacter.conditions ?? []).length >
                                0 ? (
                                  (campaignCharacter.conditions ?? []).map(
                                    (condition) => (
                                      <span
                                        key={condition}
                                        className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-300"
                                      >
                                        {condition}
                                      </span>
                                    ),
                                  )
                                ) : (
                                  <span className="text-xs text-zinc-500">
                                    No conditions
                                  </span>
                                )}

                                <button
                                  onClick={() =>
                                    setExpandedPlayerId((prev) =>
                                      prev === campaignCharacter.id
                                        ? null
                                        : campaignCharacter.id,
                                    )
                                  }
                                  className="ml-auto rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                                >
                                  {isExpanded ? "Close" : "Manage"}
                                </button>

                                <Link
                                  to={`/characters/${campaignCharacter.id}`}
                                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                                >
                                  Open
                                </Link>
                              </div>

                              {isExpanded && (
                                <div className="mt-4 grid gap-3">
                                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-xs font-medium text-zinc-400">
                                      Adjust HP
                                    </p>

                                    <div className="mt-3 flex items-center gap-2">
                                      <button
                                        onClick={() =>
                                          setHpAdjustments((prev) => ({
                                            ...prev,
                                            [campaignCharacter.id]:
                                              (prev[campaignCharacter.id] ??
                                                0) - 1,
                                          }))
                                        }
                                        className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-sm text-white transition hover:bg-white/10"
                                      >
                                        −
                                      </button>

                                      <input
                                        type="number"
                                        value={pendingHpDelta}
                                        onChange={(e) =>
                                          setHpAdjustments((prev) => ({
                                            ...prev,
                                            [campaignCharacter.id]:
                                              Number(e.target.value) || 0,
                                          }))
                                        }
                                        className="h-9 w-20 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none"
                                      />

                                      <button
                                        onClick={() =>
                                          setHpAdjustments((prev) => ({
                                            ...prev,
                                            [campaignCharacter.id]:
                                              (prev[campaignCharacter.id] ??
                                                0) + 1,
                                          }))
                                        }
                                        className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-sm text-white transition hover:bg-white/10"
                                      >
                                        +
                                      </button>

                                      <button
                                        onClick={async () => {
                                          const nextHp = Math.max(
                                            0,
                                            Math.min(
                                              maxHp,
                                              hp + pendingHpDelta,
                                            ),
                                          );

                                          await updateCharacter(
                                            campaignCharacter.id,
                                            {
                                              currentHp: nextHp,
                                            },
                                          );

                                          updateEntityHp(entry.id, nextHp);

                                          setHpAdjustments((prev) => ({
                                            ...prev,
                                            [campaignCharacter.id]: 0,
                                          }));
                                        }}
                                        className="ml-auto rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
                                      >
                                        Apply
                                      </button>
                                    </div>
                                  </div>

                                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-xs font-medium text-zinc-400">
                                      Award XP
                                    </p>

                                    <div className="mt-3 flex items-center gap-2">
                                      <input
                                        type="number"
                                        value={pendingXpDelta}
                                        onChange={(e) =>
                                          setXpAdjustments((prev) => ({
                                            ...prev,
                                            [campaignCharacter.id]:
                                              Number(e.target.value) || 0,
                                          }))
                                        }
                                        className="h-9 w-24 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none"
                                        placeholder="0"
                                      />

                                      <button
                                        onClick={async () => {
                                          await updateCharacterXp(
                                            campaignCharacter,
                                            (campaignCharacter.xp ?? 0) +
                                              pendingXpDelta,
                                          );

                                          setXpAdjustments((prev) => ({
                                            ...prev,
                                            [campaignCharacter.id]: 0,
                                          }));
                                        }}
                                        className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
                                      >
                                        Apply
                                      </button>
                                    </div>
                                  </div>

                                  <div className="relative rounded-xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-xs font-medium text-zinc-400">
                                      Conditions
                                    </p>

                                    <button
                                      onClick={() =>
                                        setOpenConditionMenuId((prev) =>
                                          prev === campaignCharacter.id
                                            ? null
                                            : campaignCharacter.id,
                                        )
                                      }
                                      className="mt-3 inline-flex h-9 items-center rounded-lg border border-white/10 bg-zinc-950 px-3 text-xs text-white transition hover:bg-white/10"
                                    >
                                      Edit conditions
                                    </button>

                                    {openConditionMenuId ===
                                      campaignCharacter.id && (
                                      <div className="absolute left-3 right-3 top-[76px] z-20 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-zinc-950 p-2 shadow-2xl">
                                        <div className="grid gap-1">
                                          {ALL_CONDITIONS.map((condition) => {
                                            const active = (
                                              campaignCharacter.conditions ?? []
                                            ).includes(condition);

                                            return (
                                              <button
                                                key={condition}
                                                onClick={() =>
                                                  toggleCondition(
                                                    campaignCharacter,
                                                    condition,
                                                  )
                                                }
                                                className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                                                  active
                                                    ? "bg-amber-500/10 text-amber-300"
                                                    : "text-zinc-300 hover:bg-white/5"
                                                }`}
                                              >
                                                <span>{condition}</span>
                                                <span className="text-[10px]">
                                                  {active ? "Selected" : ""}
                                                </span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
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

      <AwardXpModal
        isOpen={isAwardXpModalOpen}
        onClose={() => setIsAwardXpModalOpen(false)}
        characters={awardXpCharacters}
      />
    </Container>
  );
};

export default Encounter;
