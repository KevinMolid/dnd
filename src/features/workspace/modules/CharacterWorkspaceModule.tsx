import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  ALL_CONDITIONS,
  type CampaignCharacter,
} from "../../campaigns/hooks/useCampaignPageData";

import useCampaignPageData from "../../campaigns/hooks/useCampaignPageData";

import { getCharacterArmorClassFromEquipment } from "../../../rulesets/dnd/dnd2024/getCharacterArmorClassFromEquipment";

import { getCharacterHp } from "../../../rulesets/dnd/dnd2024/getCharacterHp";

import type { CharacterEquipmentEntry } from "../../../rulesets/dnd/dnd2024/types";

import { useWorkspace } from "../WorkspaceContext";

import type {
  CharacterModuleMode,
  WorkspaceModuleRenderProps,
} from "../workspaceTypes";

type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

const ABILITIES: {
  id: AbilityKey;

  label: string;
}[] = [
  {
    id: "str",
    label: "STR",
  },

  {
    id: "dex",
    label: "DEX",
  },

  {
    id: "con",
    label: "CON",
  },

  {
    id: "int",
    label: "INT",
  },

  {
    id: "wis",
    label: "WIS",
  },

  {
    id: "cha",
    label: "CHA",
  },
];

const formatModifier = (value: number) => {
  return value >= 0 ? `+${value}` : `${value}`;
};

const getAbilityScore = (
  character: CampaignCharacter,

  ability: AbilityKey,
) => {
  return character.abilityScores?.[ability] ?? 10;
};

const getAbilityModifier = (score: number) => {
  return Math.floor((score - 10) / 2);
};

const characterHasAlertFeat = (character: CampaignCharacter) => {
  if (character.originFeatId === "alert") {
    return true;
  }

  const levelUpDecisions = character.choices?.levelUpDecisions ?? {};

  return Object.values(levelUpDecisions).some(
    (decision: any) => decision?.featId === "alert",
  );
};

const getInitiativeBonus = (character: CampaignCharacter) => {
  const dex = getAbilityScore(character, "dex");

  const dexModifier = getAbilityModifier(dex);

  return dexModifier + (characterHasAlertFeat(character) ? 5 : 0);
};

const getArmorClass = (character: CampaignCharacter) => {
  const dexterityScore = getAbilityScore(character, "dex");

  const equipment = character.equipment ?? [];

  try {
    return getCharacterArmorClassFromEquipment({
      dexterityScore,

      equipment,
    });
  } catch (error) {
    console.error("Failed to calculate character AC:", error);

    return character.armorClass ?? 10;
  }
};

const getLiveHp = (character: CampaignCharacter) => {
  try {
    const hp = getCharacterHp(character as never);

    return {
      currentHp: hp.currentHp,

      maxHp: hp.maxHp,
    };
  } catch {
    return {
      currentHp: character.currentHp ?? 0,

      maxHp: Math.max(
        1,

        character.maxHp ?? 1,
      ),
    };
  }
};

const getProficiencyBonus = (level?: number) => {
  if (!level || level < 1) {
    return 2;
  }

  return 2 + Math.floor((level - 1) / 4);
};

const formatMoney = (copper: number) => {
  const safeCopper = Math.max(
    0,

    Math.floor(copper),
  );

  const gp = Math.floor(safeCopper / 100);

  const remaining = safeCopper % 100;

  const sp = Math.floor(remaining / 10);

  const cp = remaining % 10;

  const parts: string[] = [];

  if (gp) {
    parts.push(`${gp} gp`);
  }

  if (sp) {
    parts.push(`${sp} sp`);
  }

  if (cp || parts.length === 0) {
    parts.push(`${cp} cp`);
  }

  return parts.join(" · ");
};

const CharacterRow = ({
  character,

  onClick,
}: {
  character: CampaignCharacter;

  onClick: () => void;
}) => {
  const hp = getLiveHp(character);

  const subtitle = [
    character.race,

    character.className,

    character.level ? `Level ${character.level}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-2.5 border-b border-white/5 p-2.5 text-left transition last:border-b-0 hover:bg-white/[0.035]"
    >
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
        {character.imageUrl ? (
          <img
            src={character.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-600">
            <i className="fa-solid fa-user-shield text-xs" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold text-zinc-200 group-hover:text-white">
          {character.name}
        </div>

        <div className="mt-0.5 truncate text-[9px] text-zinc-600">
          {subtitle || "Player Character"}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[9px] font-semibold text-zinc-400">
          HP {hp.currentHp}/{hp.maxHp}
        </div>

        {character.conditions?.length ? (
          <div className="mt-0.5 text-[8px] text-rose-400">
            {character.conditions.length} condition
            {character.conditions.length === 1 ? "" : "s"}
          </div>
        ) : null}
      </div>

      <i className="fa-solid fa-chevron-right shrink-0 text-[8px] text-zinc-700 transition group-hover:text-zinc-400" />
    </button>
  );
};

export default function CharacterWorkspaceModule({
  module,

  campaignId,

  updateModule,
}: WorkspaceModuleRenderProps) {
  const navigate = useNavigate();

  const {
    campaignCharacters,

    campaignCharactersLoading,

    updateCharacter,

    toggleCondition,
  } = useCampaignPageData(campaignId);

  const {
    selectedCharacter,

    selectedCharacterId,

    selectCharacter,
  } = useWorkspace();

  const [browserOpen, setBrowserOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [portraitOpen, setPortraitOpen] = useState(false);

  const [equipmentOpen, setEquipmentOpen] = useState(false);

  const [conditionsOpen, setConditionsOpen] = useState(false);

  const mode: CharacterModuleMode = module.config?.characterMode ?? "follow";

  const visibleCharacterId =
    mode === "follow"
      ? (selectedCharacterId ?? module.config?.selectedCharacterId)
      : module.config?.selectedCharacterId;

  const visibleCharacterSelection =
    mode === "follow" && selectedCharacter?.characterId === visibleCharacterId
      ? selectedCharacter
      : null;

  const selectedCharacterDoc = useMemo(
    () =>
      campaignCharacters.find(
        (character) => character.id === visibleCharacterId,
      ) ?? null,
    [campaignCharacters, visibleCharacterId],
  );

  /*
   * Remember latest Follow selection.
   *
   * This also gives us a persistent fallback after
   * a refresh, but Pin no longer depends on this effect.
   */
  useEffect(() => {
    if (mode !== "follow" || !selectedCharacterId) {
      return;
    }

    if (module.config?.selectedCharacterId === selectedCharacterId) {
      return;
    }

    updateModule(module.id, {
      config: {
        ...module.config,

        selectedCharacterId,
      },
    });
  }, [mode, selectedCharacterId, module.id, module.config, updateModule]);

  useEffect(() => {
    if (campaignCharactersLoading) {
      return;
    }

    const storedId = module.config?.selectedCharacterId;

    if (!storedId) {
      return;
    }

    const exists = campaignCharacters.some(
      (character) => character.id === storedId,
    );

    if (exists) {
      return;
    }

    updateModule(module.id, {
      config: {
        ...module.config,

        selectedCharacterId: undefined,
      },
    });
  }, [
    campaignCharacters,
    campaignCharactersLoading,
    module.id,
    module.config,
    updateModule,
  ]);

  const filteredCharacters = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return campaignCharacters;
    }

    return campaignCharacters.filter((character) =>
      [character.name, character.race, character.className, character.ownerName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [campaignCharacters, search]);

  /*
   * Browser selection does NOT change Pin/Follow mode.
   *
   * In Follow it becomes a manual workspace selection.
   * In Pinned it replaces the pinned character.
   */
  const inspectCharacter = (character: CampaignCharacter) => {
    updateModule(module.id, {
      config: {
        ...module.config,

        selectedCharacterId: character.id,
      },
    });

    if (mode === "follow") {
      selectCharacter(character.id, {
        encounterStatus: "manual",
      });
    }

    setBrowserOpen(false);

    setEquipmentOpen(false);

    setConditionsOpen(false);

    setSearch("");
  };

  /*
   * Follow -> Pin explicitly captures the entity
   * currently visible, exactly like Monster.
   */
  const setMode = (nextMode: CharacterModuleMode) => {
    if (nextMode === "pinned") {
      updateModule(module.id, {
        config: {
          ...module.config,

          characterMode: "pinned",

          selectedCharacterId:
            visibleCharacterId ?? module.config?.selectedCharacterId,
        },
      });

      setBrowserOpen(false);

      return;
    }

    updateModule(module.id, {
      config: {
        ...module.config,

        characterMode: "follow",
      },
    });

    setBrowserOpen(false);
  };

  if (campaignCharactersLoading) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-zinc-500">
        Loading characters...
      </div>
    );
  }

  if (campaignCharacters.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-5 text-center">
        <div>
          <i className="fa-solid fa-user-shield text-3xl text-zinc-700" />

          <p className="mt-3 text-sm font-semibold text-zinc-300">
            No campaign characters
          </p>
        </div>
      </div>
    );
  }

  /*
   * Browser.
   */
  if (browserOpen || !selectedCharacterDoc) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {/* Same toolbar structure as Monster */}

        <div className="workspace-no-drag flex h-10 shrink-0 items-center gap-1.5 border-b border-white/10 bg-black/20 px-2">
          <button
            type="button"
            onClick={() => setBrowserOpen(false)}
            disabled={!selectedCharacterDoc}
            title="Back to character"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white disabled:opacity-25"
          >
            <i className="fa-solid fa-arrow-left text-[9px]" />
          </button>

          <div className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-200">
            Choose Character
          </div>

          <div className="flex shrink-0 rounded-lg border border-white/10 bg-black/20 p-0.5">
            <button
              type="button"
              onClick={() => setMode("pinned")}
              disabled={!selectedCharacterDoc}
              title="Pin current character"
              className={`flex h-6 w-6 items-center justify-center rounded-md text-[9px] transition disabled:opacity-25 ${
                mode === "pinned"
                  ? "bg-amber-500/15 text-amber-300"
                  : "text-zinc-600 hover:text-zinc-300"
              }`}
            >
              <i className="fa-solid fa-thumbtack" />
            </button>

            <button
              type="button"
              onClick={() => setMode("follow")}
              title="Follow character selections and encounter turns"
              className={`flex h-6 w-6 items-center justify-center rounded-md text-[9px] transition ${
                mode === "follow"
                  ? "bg-sky-500/15 text-sky-300"
                  : "text-zinc-600 hover:text-zinc-300"
              }`}
            >
              <i className="fa-solid fa-crosshairs" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/campaigns/${campaignId}/characters`)}
            title="Open campaign characters"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-up-right-from-square text-[9px]" />
          </button>
        </div>

        <div className="workspace-no-drag shrink-0 p-2">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-zinc-600" />

            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search characters..."
              className="h-8 w-full rounded-lg border border-white/10 bg-black/30 py-1.5 pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500/30"
            />
          </div>
        </div>

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-white/5">
          {filteredCharacters.length === 0 ? (
            <div className="p-5 text-center text-xs text-zinc-600">
              No matching characters.
            </div>
          ) : (
            filteredCharacters.map((character) => (
              <CharacterRow
                key={character.id}
                character={character}
                onClick={() => inspectCharacter(character)}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  const hp = getLiveHp(selectedCharacterDoc);

  const armorClass = getArmorClass(selectedCharacterDoc);

  const initiative = getInitiativeBonus(selectedCharacterDoc);

  const proficiency = getProficiencyBonus(selectedCharacterDoc.level);

  const subtitle = [
    selectedCharacterDoc.race,

    selectedCharacterDoc.className,

    selectedCharacterDoc.level
      ? `Level ${selectedCharacterDoc.level}`
      : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  const hpPercentage = Math.max(
    0,

    Math.min(
      100,

      (hp.currentHp / Math.max(1, hp.maxHp)) * 100,
    ),
  );

  const setHp = async (nextHp: number) => {
    const safeHp = Math.max(
      0,

      Math.min(
        hp.maxHp,

        Math.floor(nextHp),
      ),
    );

    await updateCharacter(selectedCharacterDoc.id, {
      currentHp: safeHp,
    });
  };

  const equipment = (selectedCharacterDoc.equipment ??
    []) as CharacterEquipmentEntry[];

  const getStatusBadge = () => {
    if (mode === "pinned") {
      return {
        text: "Pinned",

        className: "border-amber-500/15 bg-amber-500/[0.07] text-amber-300",
      };
    }

    if (visibleCharacterSelection?.encounterStatus === "active") {
      return {
        text: "Current Turn",

        className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      };
    }

    if (visibleCharacterSelection?.encounterStatus === "up-next") {
      return {
        text: "Up Next",

        className: "border-sky-500/20 bg-sky-500/10 text-sky-300",
      };
    }

    if (visibleCharacterSelection?.encounterStatus === "manual") {
      return {
        text: "Inspecting",

        className: "border-violet-500/20 bg-violet-500/10 text-violet-300",
      };
    }

    return {
      text: "Follow",

      className: "border-sky-500/15 bg-sky-500/[0.07] text-sky-300",
    };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* Standardized toolbar */}

      <div className="workspace-no-drag flex h-10 shrink-0 items-center gap-1.5 border-b border-white/10 bg-black/20 px-2">
        <button
          type="button"
          onClick={() => setBrowserOpen(true)}
          title="Browse characters"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-list text-[9px]" />
        </button>

        <div className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-200">
          {selectedCharacterDoc.name}
        </div>

        <div className="flex shrink-0 rounded-lg border border-white/10 bg-black/20 p-0.5">
          <button
            type="button"
            onClick={() => setMode("pinned")}
            title="Pin this character"
            className={`flex h-6 w-6 items-center justify-center rounded-md text-[9px] transition ${
              mode === "pinned"
                ? "bg-amber-500/15 text-amber-300"
                : "text-zinc-600 hover:text-zinc-300"
            }`}
          >
            <i className="fa-solid fa-thumbtack" />
          </button>

          <button
            type="button"
            onClick={() => setMode("follow")}
            title="Follow character selections and encounter turns"
            className={`flex h-6 w-6 items-center justify-center rounded-md text-[9px] transition ${
              mode === "follow"
                ? "bg-sky-500/15 text-sky-300"
                : "text-zinc-600 hover:text-zinc-300"
            }`}
          >
            <i className="fa-solid fa-crosshairs" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/characters/${selectedCharacterDoc.id}`)}
          title="Open full character sheet"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-500 transition hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-up-right-from-square text-[9px]" />
        </button>
      </div>

      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
        {/* Identity */}

        <section className="border-b border-white/10 p-3">
          <div className="flex items-start gap-3">
            <button
              type="button"
              disabled={!selectedCharacterDoc.imageUrl}
              onClick={() => setPortraitOpen(true)}
              className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30 disabled:cursor-default"
            >
              {selectedCharacterDoc.imageUrl ? (
                <img
                  src={selectedCharacterDoc.imageUrl}
                  alt={selectedCharacterDoc.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-700">
                  <i className="fa-solid fa-user-shield text-xl" />
                </div>
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="truncate text-base font-bold text-white">
                  {selectedCharacterDoc.name}
                </h2>

                <span
                  className={`rounded-full border px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide ${statusBadge.className}`}
                >
                  {statusBadge.text}
                </span>
              </div>

              <div className="mt-0.5 truncate text-[10px] text-zinc-500">
                {subtitle}
              </div>

              {selectedCharacterDoc.ownerName ? (
                <div className="mt-1 truncate text-[9px] text-zinc-600">
                  Player: {selectedCharacterDoc.ownerName}
                </div>
              ) : null}

              <div className="mt-2 flex flex-wrap gap-1">
                {selectedCharacterDoc.conditions?.map((condition) => (
                  <span
                    key={condition}
                    className="rounded-md border border-rose-500/15 bg-rose-500/[0.07] px-1.5 py-0.5 text-[8px] font-medium text-rose-300"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Combat stats */}

        <section className="border-b border-white/10 p-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-rose-500/10 bg-rose-500/[0.04] p-2 text-center">
              <div className="text-[8px] font-bold uppercase text-rose-300/60">
                HP
              </div>

              <div className="mt-0.5 text-sm font-bold text-white">
                {hp.currentHp}/{hp.maxHp}
              </div>
            </div>

            <div className="rounded-lg border border-sky-500/10 bg-sky-500/[0.04] p-2 text-center">
              <div className="text-[8px] font-bold uppercase text-sky-300/60">
                AC
              </div>

              <div className="mt-0.5 text-sm font-bold text-white">
                {armorClass}
              </div>
            </div>

            <div className="rounded-lg border border-amber-500/10 bg-amber-500/[0.04] p-2 text-center">
              <div className="text-[8px] font-bold uppercase text-amber-300/60">
                Initiative
              </div>

              <div className="mt-0.5 text-sm font-bold text-white">
                {formatModifier(initiative)}
              </div>
            </div>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full rounded-full ${
                hpPercentage <= 25
                  ? "bg-rose-400"
                  : hpPercentage <= 60
                    ? "bg-amber-400"
                    : "bg-emerald-400"
              }`}
              style={{
                width: `${hpPercentage}%`,
              }}
            />
          </div>

          <div className="workspace-no-drag mt-2 flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={() => setHp(hp.currentHp - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/20 text-xs text-rose-300 hover:bg-rose-500/10"
            >
              −
            </button>

            <input
              type="number"
              value={hp.currentHp}
              onChange={(event) => setHp(Number(event.target.value))}
              className="h-7 w-14 rounded-md border border-white/10 bg-black/30 text-center text-xs font-semibold text-white outline-none"
            />

            <button
              type="button"
              onClick={() => setHp(hp.currentHp + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/20 text-xs text-emerald-300 hover:bg-emerald-500/10"
            >
              +
            </button>
          </div>
        </section>

        {/* Ability scores */}

        <section className="border-b border-white/10 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-600">
              Ability Scores
            </div>

            <div className="text-[9px] text-zinc-600">
              PB{" "}
              <span className="font-semibold text-zinc-400">
                {formatModifier(proficiency)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1">
            {ABILITIES.map((ability) => {
              const score = getAbilityScore(selectedCharacterDoc, ability.id);

              const modifier = getAbilityModifier(score);

              return (
                <div
                  key={ability.id}
                  className="rounded-lg border border-white/5 bg-white/[0.025] px-1 py-2 text-center"
                >
                  <div className="text-[8px] font-bold text-zinc-600">
                    {ability.label}
                  </div>

                  <div className="mt-0.5 text-xs font-bold text-white">
                    {score}
                  </div>

                  <div className="text-[9px] text-zinc-400">
                    {formatModifier(modifier)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Conditions */}

        <section className="border-b border-white/10">
          <button
            type="button"
            onClick={() => setConditionsOpen((current) => !current)}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.025]"
          >
            <i className="fa-solid fa-heart-pulse w-4 text-[10px] text-rose-400" />

            <span className="flex-1 text-xs font-semibold text-zinc-300">
              Conditions
            </span>

            <span className="text-[9px] text-zinc-600">
              {selectedCharacterDoc.conditions?.length ?? 0}
            </span>

            <i
              className={`fa-solid fa-chevron-down text-[8px] text-zinc-600 transition ${
                conditionsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {conditionsOpen ? (
            <div className="grid grid-cols-2 gap-1.5 border-t border-white/5 p-2">
              {ALL_CONDITIONS.map((condition) => {
                const active =
                  selectedCharacterDoc.conditions?.includes(condition) ?? false;

                return (
                  <button
                    key={condition}
                    type="button"
                    onClick={() =>
                      toggleCondition(selectedCharacterDoc, condition)
                    }
                    className={`rounded-md border px-2 py-1.5 text-left text-[9px] font-medium transition ${
                      active
                        ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
                        : "border-white/5 bg-white/[0.025] text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300"
                    }`}
                  >
                    {condition}
                  </button>
                );
              })}
            </div>
          ) : null}
        </section>

        {/* Equipment */}

        <section className="border-b border-white/10">
          <button
            type="button"
            onClick={() => setEquipmentOpen((current) => !current)}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.025]"
          >
            <i className="fa-solid fa-backpack w-4 text-[10px] text-amber-400" />

            <span className="flex-1 text-xs font-semibold text-zinc-300">
              Equipment
            </span>

            <span className="text-[9px] text-zinc-600">{equipment.length}</span>

            <i
              className={`fa-solid fa-chevron-down text-[8px] text-zinc-600 transition ${
                equipmentOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {equipmentOpen ? (
            <div className="border-t border-white/5">
              {equipment.length === 0 ? (
                <div className="p-3 text-xs text-zinc-600">No equipment.</div>
              ) : (
                equipment.map((item) => (
                  <div
                    key={item.instanceId}
                    className="flex items-center gap-2 border-b border-white/5 px-3 py-2 last:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[10px] font-medium text-zinc-300">
                        {item.name}
                      </div>

                      <div className="mt-0.5 text-[8px] text-zinc-600">
                        Qty {item.quantity}
                        {item.equipped ? " · Equipped" : ""}
                      </div>
                    </div>

                    {item.equipped ? (
                      <i className="fa-solid fa-shield-halved text-[8px] text-emerald-400" />
                    ) : null}
                  </div>
                ))
              )}
            </div>
          ) : null}
        </section>

        {/* General */}

        <section className="grid grid-cols-2 gap-2 p-3">
          <div className="rounded-lg border border-white/5 bg-white/[0.025] p-2">
            <div className="text-[8px] font-bold uppercase text-zinc-600">
              XP
            </div>

            <div className="mt-0.5 text-xs font-semibold text-zinc-300">
              {selectedCharacterDoc.xp ?? 0}
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-white/[0.025] p-2">
            <div className="text-[8px] font-bold uppercase text-zinc-600">
              Money
            </div>

            <div className="mt-0.5 truncate text-[10px] font-semibold text-zinc-300">
              {formatMoney(selectedCharacterDoc.moneyCp ?? 0)}
            </div>
          </div>

          {selectedCharacterDoc.levelUpAvailable ? (
            <div className="col-span-2 rounded-lg border border-amber-500/15 bg-amber-500/[0.05] px-2.5 py-2 text-[10px] font-semibold text-amber-300">
              <i className="fa-solid fa-arrow-up mr-1.5" />
              Level up available
            </div>
          ) : null}
        </section>
      </div>

      {/* Portrait popup */}

      {portraitOpen && selectedCharacterDoc.imageUrl ? (
        <div
          className="workspace-no-drag absolute inset-0 z-50 flex items-center justify-center bg-black/85 p-3"
          onMouseDown={() => setPortraitOpen(false)}
        >
          <button
            type="button"
            onClick={() => setPortraitOpen(false)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-zinc-300 hover:text-white"
          >
            <i className="fa-solid fa-xmark" />
          </button>

          <img
            src={selectedCharacterDoc.imageUrl}
            alt={selectedCharacterDoc.name}
            onMouseDown={(event) => event.stopPropagation()}
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </div>
  );
}
