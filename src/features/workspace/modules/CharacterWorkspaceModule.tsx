import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import Avatar from "../../../components/Avatar";

import {
  ALL_CONDITIONS,
  type CampaignCharacter,
} from "../../campaigns/hooks/useCampaignPageData";

import useCampaignPageData from "../../campaigns/hooks/useCampaignPageData";

import { getCharacterArmorClassFromEquipment } from "../../../rulesets/dnd/dnd2024/getCharacterArmorClassFromEquipment";

import { getCharacterHp } from "../../../rulesets/dnd/dnd2024/getCharacterHp";

import type {
  CharacterEquipmentEntry,
  Money,
} from "../../../rulesets/dnd/dnd2024/types";

import { useWorkspace } from "../WorkspaceContext";

import type {
  CharacterModuleMode,
  WorkspaceModuleRenderProps,
} from "../workspaceTypes";

type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

type CustomCharacterStats = {
  armorClass?: number;
  currentHp?: number;
  maxHp?: number;
  speed?: number;
  proficiencyBonus?: number;
};

type WorkspaceCharacter = CampaignCharacter & {
  buildMode?: string;

  customStats?: CustomCharacterStats;

  money?: Money;

  speciesName?: string;

  className?: string;
};

const ABILITIES: {
  id: AbilityKey;
  label: string;
}[] = [
  { id: "str", label: "STR" },
  { id: "dex", label: "DEX" },
  { id: "con", label: "CON" },
  { id: "int", label: "INT" },
  { id: "wis", label: "WIS" },
  { id: "cha", label: "CHA" },
];

const formatModifier = (value: number) => {
  return value >= 0 ? `+${value}` : `${value}`;
};

const getAbilityScore = (
  character: WorkspaceCharacter,
  ability: AbilityKey,
) => {
  return character.abilityScores?.[ability] ?? 10;
};

const getAbilityModifier = (score: number) => {
  return Math.floor((score - 10) / 2);
};

const isCustomCharacter = (character: WorkspaceCharacter) => {
  return character.buildMode === "custom";
};

const characterHasAlertFeat = (character: WorkspaceCharacter) => {
  if (isCustomCharacter(character)) {
    return false;
  }

  if (character.originFeatId === "alert") {
    return true;
  }

  const levelUpDecisions = character.choices?.levelUpDecisions ?? {};

  return Object.values(levelUpDecisions).some(
    (decision: any) => decision?.featId === "alert",
  );
};

const getInitiativeBonus = (character: WorkspaceCharacter) => {
  const dex = getAbilityScore(character, "dex");

  const dexModifier = getAbilityModifier(dex);

  if (isCustomCharacter(character)) {
    return dexModifier;
  }

  return dexModifier + (characterHasAlertFeat(character) ? 5 : 0);
};

const getArmorClass = (character: WorkspaceCharacter) => {
  if (isCustomCharacter(character)) {
    return character.customStats?.armorClass ?? character.armorClass ?? 10;
  }

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

const getLiveHp = (character: WorkspaceCharacter) => {
  if (isCustomCharacter(character)) {
    const maxHp = character.customStats?.maxHp ?? character.maxHp ?? 0;

    const currentHp =
      character.customStats?.currentHp ?? character.currentHp ?? maxHp;

    return {
      currentHp: Math.max(0, currentHp),

      maxHp: Math.max(1, maxHp),
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

      maxHp: Math.max(1, character.maxHp ?? 1),
    };
  }
};

const getCharacterProficiencyBonus = (character: WorkspaceCharacter) => {
  if (isCustomCharacter(character)) {
    return character.customStats?.proficiencyBonus ?? 2;
  }

  const level = character.level;

  if (!level || level < 1) {
    return 2;
  }

  return 2 + Math.floor((level - 1) / 4);
};

const getCharacterSpeed = (character: WorkspaceCharacter) => {
  if (isCustomCharacter(character)) {
    return character.customStats?.speed ?? 30;
  }

  return (character as any).speed ?? 30;
};

const getCharacterMoney = (character: WorkspaceCharacter) => {
  if (character.money) {
    return character.money;
  }

  const copper = Math.max(0, Math.floor((character as any).moneyCp ?? 0));

  const gp = Math.floor(copper / 100);

  const remainderAfterGp = copper % 100;

  const sp = Math.floor(remainderAfterGp / 10);

  const cp = remainderAfterGp % 10;

  return {
    cp,
    sp,
    ep: 0,
    gp,
    pp: 0,
  };
};

const formatMoney = (money: Money) => {
  const parts: string[] = [];

  if (money.pp) {
    parts.push(`${money.pp} pp`);
  }

  if (money.gp) {
    parts.push(`${money.gp} gp`);
  }

  if (money.ep) {
    parts.push(`${money.ep} ep`);
  }

  if (money.sp) {
    parts.push(`${money.sp} sp`);
  }

  if (money.cp || parts.length === 0) {
    parts.push(`${money.cp ?? 0} cp`);
  }

  return parts.join(" · ");
};

const CharacterRow = ({
  character,
  onClick,
}: {
  character: WorkspaceCharacter;
  onClick: () => void;
}) => {
  const hp = getLiveHp(character);

  const subtitle = [
    character.race ?? character.speciesName,

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
      <Avatar
        src={character.imageUrl}
        name={character.name}
        className="h-9 w-9 rounded-lg"
      />

      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold text-zinc-200 group-hover:text-white">
          {character.name}
        </div>

        <div className="mt-0.5 truncate text-[10px] text-zinc-500">
          {subtitle || "Player Character"}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-[10px] font-semibold text-zinc-300">
          HP {hp.currentHp}/{hp.maxHp}
        </div>

        {character.conditions?.length ? (
          <div className="mt-0.5 text-[9px] text-rose-400">
            {character.conditions.length} condition
            {character.conditions.length === 1 ? "" : "s"}
          </div>
        ) : null}
      </div>

      <i className="fa-solid fa-chevron-right shrink-0 text-[9px] text-zinc-600 transition group-hover:text-zinc-300" />
    </button>
  );
};

export default function CharacterWorkspaceModule({
  module,
  campaignId,
  editing,
  updateModule,
  removeModule,
}: WorkspaceModuleRenderProps) {
  const navigate = useNavigate();

  const {
    campaignCharacters: rawCampaignCharacters,

    campaignCharactersLoading,

    updateCharacter,

    toggleCondition,
  } = useCampaignPageData(campaignId);

  const campaignCharacters = rawCampaignCharacters as WorkspaceCharacter[];

  const { selectedCharacter, selectCharacter } = useWorkspace();

  const [browserOpen, setBrowserOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [portraitOpen, setPortraitOpen] = useState(false);

  const [equipmentOpen, setEquipmentOpen] = useState(false);

  const [conditionsOpen, setConditionsOpen] = useState(false);

  /*
   * Match MonsterWorkspaceModule:
   *
   * The saved module config is the authoritative pinned
   * selection.
   *
   * Defaulting to pinned also makes a saved character ID
   * useful even if an older workspace does not yet contain
   * characterMode.
   */
  const mode: CharacterModuleMode = module.config?.characterMode ?? "pinned";

  /*
   * Persisted/pinned character.
   *
   * This comes ONLY from module.config, exactly like
   * pinnedMonster in MonsterWorkspaceModule.
   */
  const pinnedCharacter = useMemo(() => {
    const characterId = module.config?.selectedCharacterId;

    if (!characterId) {
      return null;
    }

    return (
      campaignCharacters.find((character) => character.id === characterId) ??
      null
    );
  }, [campaignCharacters, module.config?.selectedCharacterId]);

  /*
   * Character currently selected by WorkspaceContext.
   *
   * This is relevant only while following.
   */
  const followedCharacter = useMemo(() => {
    const characterId = selectedCharacter?.characterId;

    if (!characterId) {
      return null;
    }

    return (
      campaignCharacters.find((character) => character.id === characterId) ??
      null
    );
  }, [campaignCharacters, selectedCharacter]);

  /*
   * Exact same fallback behavior as Monster:
   *
   * Follow:
   * workspace selection first, persisted character second.
   *
   * Pinned:
   * persisted character only.
   */
  const displayedCharacter =
    mode === "follow"
      ? (followedCharacter ?? pinnedCharacter)
      : pinnedCharacter;

  const displayedCharacterId = displayedCharacter?.id;

  /*
   * Only show encounter/manual state if the Workspace
   * selection is actually the character being displayed.
   */
  const visibleCharacterSelection =
    mode === "follow" && selectedCharacter?.characterId === displayedCharacterId
      ? selectedCharacter
      : null;

  const filteredCharacters = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return campaignCharacters;
    }

    return campaignCharacters.filter((character) =>
      [
        character.name,
        character.race,
        character.speciesName,
        character.className,
        character.ownerName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [campaignCharacters, search]);

  /*
   * Same behavior as selectMonster().
   *
   * PINNED:
   * replace the persisted pinned character.
   *
   * FOLLOW:
   * retain this character as the module fallback AND
   * create a manual Workspace selection.
   */
  const selectCharacterFromBrowser = (character: WorkspaceCharacter) => {
    if (mode === "pinned") {
      updateModule(module.id, {
        config: {
          ...module.config,

          characterMode: "pinned",

          selectedCharacterId: character.id,
        },
      });
    } else {
      updateModule(module.id, {
        config: {
          ...module.config,

          characterMode: "follow",

          selectedCharacterId: character.id,
        },
      });

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
   * Same pin/follow behavior as MonsterWorkspaceModule.
   *
   * Follow -> Pin freezes the character CURRENTLY VISIBLE,
   * not merely whatever happened to be saved previously.
   */
  const setMode = (nextMode: CharacterModuleMode) => {
    if (nextMode === "pinned") {
      updateModule(module.id, {
        config: {
          ...module.config,

          characterMode: "pinned",

          selectedCharacterId:
            displayedCharacterId ?? module.config?.selectedCharacterId,
        },
      });

      setBrowserOpen(false);

      return;
    }

    updateModule(module.id, {
      config: {
        ...module.config,

        characterMode: "follow",

        /*
         * Keep the last displayed character as the
         * persisted fallback, just like the Monster
         * module retains selectedMonsterKey.
         */
        selectedCharacterId:
          displayedCharacterId ?? module.config?.selectedCharacterId,
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
   * ==========================================================
   * CHARACTER BROWSER
   * ==========================================================
   */

  if (browserOpen) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div
          className={`workspace-drag-handle flex h-9 shrink-0 items-center gap-1.5 border-b border-white/10 bg-white/[0.025] px-2.5 ${
            editing ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <i className="fa-solid fa-user-shield shrink-0 text-xs text-emerald-400" />

          <div className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-100">
            Choose Character
          </div>

          {displayedCharacter ? (
            <button
              type="button"
              onClick={() => setBrowserOpen(false)}
              title="Back to character"
              aria-label="Back to character"
              className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <i className="fa-solid fa-arrow-left text-[10px]" />
            </button>
          ) : null}

          <div className="workspace-no-drag flex shrink-0 rounded-md border border-white/10 bg-black/20 p-0.5">
            <button
              type="button"
              onClick={() => setMode("pinned")}
              disabled={!displayedCharacter}
              title="Pin current character"
              aria-label="Pin current character"
              className={`flex h-6 w-6 items-center justify-center rounded text-[9px] transition disabled:opacity-25 ${
                mode === "pinned"
                  ? "bg-amber-500/15 text-amber-300"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <i className="fa-solid fa-thumbtack" />
            </button>

            <button
              type="button"
              onClick={() => setMode("follow")}
              title="Follow character selections and encounter turns"
              aria-label="Follow character selections and encounter turns"
              className={`flex h-6 w-6 items-center justify-center rounded text-[9px] transition ${
                mode === "follow"
                  ? "bg-sky-500/15 text-sky-300"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <i className="fa-solid fa-crosshairs" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/campaigns/${campaignId}/characters`)}
            title="Open campaign characters"
            aria-label="Open campaign characters"
            className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-up-right-from-square text-[10px]" />
          </button>

          {editing ? (
            <button
              type="button"
              onClick={() => removeModule(module.id)}
              title="Remove module"
              aria-label="Remove character module"
              className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <i className="fa-solid fa-xmark text-[10px]" />
            </button>
          ) : null}
        </div>

        <div className="workspace-no-drag shrink-0 p-2">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500" />

            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search characters..."
              aria-label="Search characters"
              className="h-8 w-full rounded-lg border border-white/10 bg-black/30 py-1.5 pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-500 focus:border-emerald-500/30"
            />
          </div>
        </div>

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto border-t border-white/5">
          {filteredCharacters.length === 0 ? (
            <div className="p-5 text-center text-xs text-zinc-500">
              No matching characters.
            </div>
          ) : (
            filteredCharacters.map((character) => (
              <CharacterRow
                key={character.id}
                character={character}
                onClick={() => selectCharacterFromBrowser(character)}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * NO CHARACTER
   * ==========================================================
   */

  if (!displayedCharacter) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div
          className={`workspace-drag-handle flex h-9 shrink-0 items-center gap-1.5 border-b border-white/10 bg-white/[0.025] px-2.5 ${
            editing ? "cursor-grab active:cursor-grabbing" : ""
          }`}
        >
          <i className="fa-solid fa-user-shield shrink-0 text-xs text-emerald-400" />

          <div className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-100">
            Character
          </div>

          <div className="workspace-no-drag flex shrink-0 rounded-md border border-white/10 bg-black/20 p-0.5">
            <button
              type="button"
              disabled
              title="Pin current character"
              className="flex h-6 w-6 items-center justify-center rounded text-[9px] text-zinc-600 opacity-25"
            >
              <i className="fa-solid fa-thumbtack" />
            </button>

            <button
              type="button"
              onClick={() => setMode("follow")}
              title="Follow character selections and encounter turns"
              className={`flex h-6 w-6 items-center justify-center rounded text-[9px] transition ${
                mode === "follow"
                  ? "bg-sky-500/15 text-sky-300"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              <i className="fa-solid fa-crosshairs" />
            </button>
          </div>

          {editing ? (
            <button
              type="button"
              onClick={() => removeModule(module.id)}
              title="Remove module"
              className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-300"
            >
              <i className="fa-solid fa-xmark text-[10px]" />
            </button>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center p-5 text-center">
          <div>
            <i
              className={`fa-solid ${
                mode === "follow"
                  ? "fa-crosshairs text-sky-400/20"
                  : "fa-user-shield text-emerald-400/20"
              } text-3xl`}
            />

            <p className="mt-3 text-sm font-semibold text-zinc-300">
              {mode === "follow"
                ? "Waiting for character"
                : "No character pinned"}
            </p>

            {mode === "follow" ? (
              <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-500">
                The active player, next player, or a manually inspected
                character will appear here.
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => setBrowserOpen(true)}
              className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              Choose Character
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * CHARACTER SHEET
   * ==========================================================
   */

  const hp = getLiveHp(displayedCharacter);

  const armorClass = getArmorClass(displayedCharacter);

  const initiative = getInitiativeBonus(displayedCharacter);

  const proficiency = getCharacterProficiencyBonus(displayedCharacter);

  const speed = getCharacterSpeed(displayedCharacter);

  const money = getCharacterMoney(displayedCharacter);

  const subtitle = [
    displayedCharacter.race ?? displayedCharacter.speciesName,

    displayedCharacter.className,

    displayedCharacter.level ? `Level ${displayedCharacter.level}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  const hpPercentage = Math.max(
    0,
    Math.min(100, (hp.currentHp / Math.max(1, hp.maxHp)) * 100),
  );

  const setHp = async (nextHp: number) => {
    const safeHp = Math.max(0, Math.min(hp.maxHp, Math.floor(nextHp)));

    if (isCustomCharacter(displayedCharacter)) {
      await updateCharacter(displayedCharacter.id, {
        customStats: {
          ...(displayedCharacter.customStats ?? {}),

          currentHp: safeHp,
        },
      } as any);

      return;
    }

    await updateCharacter(displayedCharacter.id, {
      currentHp: safeHp,
    });
  };

  const equipment = (displayedCharacter.equipment ??
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
      {/* Integrated header */}

      <div
        className={`workspace-drag-handle flex h-9 shrink-0 items-center gap-1.5 border-b border-white/10 bg-white/[0.025] px-2.5 ${
          editing ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <i className="fa-solid fa-user-shield shrink-0 text-xs text-emerald-400" />

        <button
          type="button"
          onClick={() => setBrowserOpen(true)}
          title="Browse characters"
          className="workspace-no-drag min-w-0 flex-1 truncate text-left text-xs font-semibold text-zinc-100 transition hover:text-white"
        >
          {displayedCharacter.name}
        </button>

        <button
          type="button"
          onClick={() => setBrowserOpen(true)}
          title="Browse characters"
          aria-label="Browse characters"
          className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-list text-[10px]" />
        </button>

        <div className="workspace-no-drag flex shrink-0 rounded-md border border-white/10 bg-black/20 p-0.5">
          <button
            type="button"
            onClick={() => setMode("pinned")}
            title="Pin this character"
            aria-label="Pin this character"
            className={`flex h-6 w-6 items-center justify-center rounded text-[9px] transition ${
              mode === "pinned"
                ? "bg-amber-500/15 text-amber-300"
                : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            <i className="fa-solid fa-thumbtack" />
          </button>

          <button
            type="button"
            onClick={() => setMode("follow")}
            title="Follow character selections and encounter turns"
            aria-label="Follow character selections and encounter turns"
            className={`flex h-6 w-6 items-center justify-center rounded text-[9px] transition ${
              mode === "follow"
                ? "bg-sky-500/15 text-sky-300"
                : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            <i className="fa-solid fa-crosshairs" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/characters/${displayedCharacter.id}`)}
          title="Open full character sheet"
          aria-label="Open full character sheet"
          className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        >
          <i className="fa-solid fa-up-right-from-square text-[10px]" />
        </button>

        {editing ? (
          <button
            type="button"
            onClick={() => removeModule(module.id)}
            title="Remove module"
            aria-label="Remove character module"
            className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <i className="fa-solid fa-xmark text-[10px]" />
          </button>
        ) : null}
      </div>

      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
        {/* Identity */}

        <section className="border-b border-white/10 p-3">
          <div className="flex items-start gap-3">
            <button
              type="button"
              disabled={!displayedCharacter.imageUrl}
              onClick={() => setPortraitOpen(true)}
              className="shrink-0 disabled:cursor-default"
              aria-label={`Open portrait for ${displayedCharacter.name}`}
            >
              <Avatar
                src={displayedCharacter.imageUrl}
                name={displayedCharacter.name}
                className="h-16 w-16 rounded-xl"
              />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h2 className="truncate text-base font-bold text-white">
                  {displayedCharacter.name}
                </h2>

                <span
                  className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${statusBadge.className}`}
                >
                  {statusBadge.text}
                </span>
              </div>

              <div className="mt-0.5 truncate text-[10px] text-zinc-500">
                {subtitle || "Player Character"}
              </div>

              {displayedCharacter.ownerName ? (
                <div className="mt-1 truncate text-[10px] text-zinc-500">
                  Player: {displayedCharacter.ownerName}
                </div>
              ) : null}

              <div className="mt-2 flex flex-wrap gap-1">
                {displayedCharacter.conditions?.map((condition) => (
                  <span
                    key={condition}
                    className="rounded-md border border-rose-500/15 bg-rose-500/[0.07] px-1.5 py-0.5 text-[9px] font-medium text-rose-300"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core stats */}

        <section className="border-b border-white/10 p-3">
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-lg border border-rose-500/10 bg-rose-500/[0.04] p-2 text-center">
              <div className="text-[9px] font-bold uppercase text-rose-300/70">
                HP
              </div>

              <div className="mt-0.5 text-sm font-bold text-white">
                {hp.currentHp}/{hp.maxHp}
              </div>
            </div>

            <div className="rounded-lg border border-sky-500/10 bg-sky-500/[0.04] p-2 text-center">
              <div className="text-[9px] font-bold uppercase text-sky-300/70">
                AC
              </div>

              <div className="mt-0.5 text-sm font-bold text-white">
                {armorClass}
              </div>
            </div>

            <div className="rounded-lg border border-amber-500/10 bg-amber-500/[0.04] p-2 text-center">
              <div className="text-[9px] font-bold uppercase text-amber-300/70">
                Initiative
              </div>

              <div className="mt-0.5 text-sm font-bold text-white">
                {formatModifier(initiative)}
              </div>
            </div>

            <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.04] p-2 text-center">
              <div className="text-[9px] font-bold uppercase text-emerald-300/70">
                Speed
              </div>

              <div className="mt-0.5 text-sm font-bold text-white">
                {speed} ft
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
              aria-label="Decrease hit points by 1"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/20 text-xs text-rose-300 hover:bg-rose-500/10"
            >
              −
            </button>

            <input
              type="number"
              value={hp.currentHp}
              aria-label="Current hit points"
              onChange={(event) => setHp(Number(event.target.value))}
              className="h-7 w-14 rounded-md border border-white/10 bg-black/30 text-center text-xs font-semibold text-white outline-none"
            />

            <button
              type="button"
              onClick={() => setHp(hp.currentHp + 1)}
              aria-label="Increase hit points by 1"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/20 text-xs text-emerald-300 hover:bg-emerald-500/10"
            >
              +
            </button>
          </div>
        </section>

        {/* Ability scores */}

        <section className="border-b border-white/10 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
              Ability Scores
            </div>

            <div className="text-[10px] text-zinc-500">
              PB{" "}
              <span className="font-semibold text-zinc-300">
                {formatModifier(proficiency)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-1">
            {ABILITIES.map((ability) => {
              const score = getAbilityScore(displayedCharacter, ability.id);

              const modifier = getAbilityModifier(score);

              return (
                <div
                  key={ability.id}
                  title={`${ability.label}: ${score} (${formatModifier(modifier)})`}
                  className="rounded-lg border border-white/5 bg-white/[0.025] px-1 py-2 text-center"
                >
                  <div className="text-[9px] font-bold uppercase text-zinc-500">
                    {ability.label}
                  </div>

                  <div className="mt-0.5 text-base font-bold leading-none text-white">
                    {formatModifier(modifier)}
                  </div>

                  <div className="mt-1 text-[9px] font-medium leading-none text-zinc-500">
                    {score}
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
            aria-expanded={conditionsOpen}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.025]"
          >
            <i className="fa-solid fa-heart-pulse w-4 text-[10px] text-rose-400" />

            <span className="flex-1 text-xs font-semibold text-zinc-300">
              Conditions
            </span>

            <span className="text-[10px] text-zinc-500">
              {displayedCharacter.conditions?.length ?? 0}
            </span>

            <i
              className={`fa-solid fa-chevron-down text-[9px] text-zinc-500 transition ${
                conditionsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {conditionsOpen ? (
            <div className="grid grid-cols-2 gap-1.5 border-t border-white/5 p-2">
              {ALL_CONDITIONS.map((condition) => {
                const active =
                  displayedCharacter.conditions?.includes(condition) ?? false;

                return (
                  <button
                    key={condition}
                    type="button"
                    onClick={() =>
                      toggleCondition(displayedCharacter, condition)
                    }
                    className={`rounded-md border px-2 py-1.5 text-left text-[10px] font-medium transition ${
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
            aria-expanded={equipmentOpen}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.025]"
          >
            <i className="fa-solid fa-backpack w-4 text-[10px] text-amber-400" />

            <span className="flex-1 text-xs font-semibold text-zinc-300">
              Equipment
            </span>

            <span className="text-[10px] text-zinc-500">
              {equipment.length}
            </span>

            <i
              className={`fa-solid fa-chevron-down text-[9px] text-zinc-500 transition ${
                equipmentOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {equipmentOpen ? (
            <div className="border-t border-white/5">
              {equipment.length === 0 ? (
                <div className="p-3 text-xs text-zinc-500">No equipment.</div>
              ) : (
                equipment.map((item) => (
                  <div
                    key={item.instanceId}
                    className="flex items-center gap-2 border-b border-white/5 px-3 py-2 last:border-b-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[11px] font-medium text-zinc-300">
                        {item.name}
                      </div>

                      <div className="mt-0.5 text-[9px] text-zinc-500">
                        Qty {item.quantity}
                        {item.equipped ? " · Equipped" : ""}
                      </div>
                    </div>

                    {item.equipped ? (
                      <i className="fa-solid fa-shield-halved text-[9px] text-emerald-400" />
                    ) : null}
                  </div>
                ))
              )}
            </div>
          ) : null}
        </section>

        {/* XP / Money */}

        <section className="grid grid-cols-2 gap-2 p-3">
          <div className="rounded-lg border border-white/5 bg-white/[0.025] p-2">
            <div className="text-[9px] font-bold uppercase text-zinc-500">
              XP
            </div>

            <div className="mt-0.5 text-xs font-semibold text-zinc-300">
              {displayedCharacter.xp ?? 0}
            </div>
          </div>

          <div className="rounded-lg border border-white/5 bg-white/[0.025] p-2">
            <div className="text-[9px] font-bold uppercase text-zinc-500">
              Money
            </div>

            <div className="mt-0.5 truncate text-[10px] font-semibold text-zinc-300">
              {formatMoney(money)}
            </div>
          </div>

          {displayedCharacter.levelUpAvailable ? (
            <div className="col-span-2 rounded-lg border border-amber-500/15 bg-amber-500/[0.05] px-2.5 py-2 text-[10px] font-semibold text-amber-300">
              <i className="fa-solid fa-arrow-up mr-1.5" />
              Level up available
            </div>
          ) : null}
        </section>
      </div>

      {/* Portrait viewer */}

      {portraitOpen && displayedCharacter.imageUrl ? (
        <div
          className="workspace-no-drag absolute inset-0 z-50 flex items-center justify-center bg-black/85 p-3"
          onMouseDown={() => setPortraitOpen(false)}
        >
          <button
            type="button"
            onClick={() => setPortraitOpen(false)}
            aria-label="Close portrait"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-zinc-300 hover:text-white"
          >
            <i className="fa-solid fa-xmark" />
          </button>

          <img
            src={displayedCharacter.imageUrl}
            alt={displayedCharacter.name}
            onMouseDown={(event) => event.stopPropagation()}
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </div>
  );
}
