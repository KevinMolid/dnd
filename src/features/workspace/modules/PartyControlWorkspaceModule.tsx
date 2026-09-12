import { useMemo, useState } from "react";

import Avatar from "../../../components/Avatar";

import {
  ALL_CONDITIONS,
  type CampaignCharacter,
} from "../../campaigns/hooks/useCampaignPageData";

import useCampaignPageData from "../../campaigns/hooks/useCampaignPageData";

import { useCharacterSheetData } from "../../character-sheet/hooks/useCharacterSheetData";

import { useWorkspace } from "../WorkspaceContext";

import type { WorkspaceModuleRenderProps } from "../workspaceTypes";

type PartyCharacter = CampaignCharacter & {
  activeInParty?: boolean;

  buildMode?: string;

  className?: string;

  speciesName?: string;

  customStats?: {
    armorClass?: number;

    currentHp?: number;

    maxHp?: number;

    speed?: number;

    proficiencyBonus?: number;
  };
};

type PassiveSenses = {
  perception: number | null;

  insight: number | null;

  investigation: number | null;
};

const getAbilityModifier = (score: number) => {
  return Math.floor((score - 10) / 2);
};

const getFallbackPassiveSenses = (character: PartyCharacter): PassiveSenses => {
  const wis = character.abilityScores?.wis ?? 10;

  const int = character.abilityScores?.int ?? 10;

  return {
    perception: 10 + getAbilityModifier(wis),

    insight: 10 + getAbilityModifier(wis),

    investigation: 10 + getAbilityModifier(int),
  };
};

const getFallbackHp = (character: PartyCharacter) => {
  const maxHp =
    character.buildMode === "custom"
      ? (character.customStats?.maxHp ?? character.maxHp ?? 1)
      : (character.maxHp ?? 1);

  const currentHp =
    character.buildMode === "custom"
      ? (character.customStats?.currentHp ?? character.currentHp ?? maxHp)
      : (character.currentHp ?? maxHp);

  return {
    currentHp: Math.max(0, currentHp),

    maxHp: Math.max(1, maxHp),
  };
};

const getFallbackArmorClass = (character: PartyCharacter) => {
  if (character.buildMode === "custom") {
    return character.customStats?.armorClass ?? character.armorClass ?? 10;
  }

  return character.armorClass ?? 10;
};

type PartyCharacterCardProps = {
  character: PartyCharacter;

  onInspect: () => void;

  onDeactivate: () => void;
};

function PartyCharacterCard({
  character,
  onInspect,
  onDeactivate,
}: PartyCharacterCardProps) {
  const {
    character: sheetCharacter,

    derived,

    loading,

    handleSetCurrentHp,

    handleSetConditions,
  } = useCharacterSheetData(character.id);

  const [conditionsOpen, setConditionsOpen] = useState(false);

  const displayCharacter = (sheetCharacter ?? character) as PartyCharacter;

  const fallbackHp = getFallbackHp(displayCharacter);

  const currentHp = derived?.currentHp ?? fallbackHp.currentHp;

  const maxHp = derived?.maxHp ?? fallbackHp.maxHp;

  const armorClass =
    derived?.armorClass ?? getFallbackArmorClass(displayCharacter);

  const passiveSenses = useMemo<PassiveSenses>(() => {
    if (derived) {
      const insight = derived.skillRows.find((skill) => skill.id === "insight");

      const investigation = derived.skillRows.find(
        (skill) => skill.id === "investigation",
      );

      return {
        perception: derived.passivePerception,

        insight: insight ? 10 + insight.total : null,

        investigation: investigation ? 10 + investigation.total : null,
      };
    }

    return getFallbackPassiveSenses(displayCharacter);
  }, [derived, displayCharacter]);

  const conditions = displayCharacter.conditions ?? [];

  const subtitle = [
    displayCharacter.race ?? displayCharacter.speciesName,

    displayCharacter.className,

    displayCharacter.level ? `Level ${displayCharacter.level}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  const hpPercentage = Math.max(
    0,
    Math.min(100, (currentHp / Math.max(1, maxHp)) * 100),
  );

  const setHp = async (nextHp: number) => {
    const safeHp = Math.max(0, Math.min(maxHp, Math.floor(nextHp)));

    await handleSetCurrentHp(safeHp);
  };

  const toggleCondition = async (condition: string) => {
    const nextConditions = conditions.includes(condition)
      ? conditions.filter((current) => current !== condition)
      : [...conditions, condition];

    await handleSetConditions(nextConditions);
  };

  if (loading && !sheetCharacter) {
    return (
      <div className="border-b border-white/10 p-3 last:border-b-0">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <i className="fa-solid fa-spinner fa-spin" />
          Loading {character.name}...
        </div>
      </div>
    );
  }

  return (
    <article className="border-b border-white/10 last:border-b-0">
      {/* =====================================================
          IDENTITY
      ===================================================== */}

      <div className="flex items-start gap-2.5 px-3 pb-2 pt-3">
        <button
          type="button"
          onClick={onInspect}
          title={`Inspect ${displayCharacter.name}`}
          className="workspace-no-drag shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
        >
          <Avatar
            src={displayCharacter.imageUrl}
            name={displayCharacter.name}
            className="h-11 w-11 rounded-lg"
          />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onInspect}
              title={`Inspect ${displayCharacter.name}`}
              className="workspace-no-drag min-w-0 truncate text-left text-sm font-bold text-zinc-100 transition hover:text-emerald-300"
            >
              {displayCharacter.name}
            </button>

            {conditions.length > 0 ? (
              <span className="shrink-0 rounded-full border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 text-[8px] font-bold text-rose-300">
                {conditions.length}
              </span>
            ) : null}
          </div>

          <div className="mt-0.5 truncate text-[10px] text-zinc-500">
            {subtitle || "Player Character"}
          </div>

          {displayCharacter.ownerName ? (
            <div className="mt-0.5 truncate text-[9px] text-zinc-600">
              {displayCharacter.ownerName}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onDeactivate}
          title="Set character inactive"
          aria-label={`Set ${displayCharacter.name} inactive`}
          className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-600 transition hover:bg-rose-500/10 hover:text-rose-300"
        >
          <i className="fa-solid fa-user-minus text-[10px]" />
        </button>
      </div>

      {/* =====================================================
          PASSIVE / DEFENSE STATS
      ===================================================== */}

      <div className="grid grid-cols-4 gap-1.5 px-3">
        <div className="rounded-lg border border-sky-500/10 bg-sky-500/[0.04] px-1.5 py-2 text-center">
          <div className="text-[8px] font-bold uppercase tracking-wide text-sky-300/70">
            AC
          </div>

          <div className="mt-0.5 text-sm font-bold leading-none text-white">
            {armorClass}
          </div>
        </div>

        <div
          title="Passive Perception"
          className="rounded-lg border border-white/5 bg-white/[0.025] px-1 py-2 text-center"
        >
          <div className="text-[8px] font-bold uppercase tracking-wide text-zinc-500">
            PER
          </div>

          <div className="mt-0.5 text-sm font-bold leading-none text-white">
            {passiveSenses.perception ?? "—"}
          </div>
        </div>

        <div
          title="Passive Insight"
          className="rounded-lg border border-white/5 bg-white/[0.025] px-1 py-2 text-center"
        >
          <div className="text-[8px] font-bold uppercase tracking-wide text-zinc-500">
            INS
          </div>

          <div className="mt-0.5 text-sm font-bold leading-none text-white">
            {passiveSenses.insight ?? "—"}
          </div>
        </div>

        <div
          title="Passive Investigation"
          className="rounded-lg border border-white/5 bg-white/[0.025] px-1 py-2 text-center"
        >
          <div className="text-[8px] font-bold uppercase tracking-wide text-zinc-500">
            INV
          </div>

          <div className="mt-0.5 text-sm font-bold leading-none text-white">
            {passiveSenses.investigation ?? "—"}
          </div>
        </div>
      </div>

      {/* =====================================================
          HP
      ===================================================== */}

      <div className="px-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="shrink-0">
            <div className="text-[8px] font-bold uppercase tracking-wide text-rose-300/70">
              HP
            </div>

            <div className="text-xs font-bold text-zinc-100">
              {currentHp}/{maxHp}
            </div>
          </div>

          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full rounded-full transition-all ${
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

          <div className="workspace-no-drag flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setHp(currentHp - 1)}
              aria-label={`Decrease ${displayCharacter.name}'s hit points by 1`}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/20 text-xs text-rose-300 transition hover:bg-rose-500/10"
            >
              −
            </button>

            <input
              type="number"
              value={currentHp}
              aria-label={`${displayCharacter.name} current hit points`}
              onChange={(event) => setHp(Number(event.target.value))}
              className="h-7 w-12 rounded-md border border-white/10 bg-black/30 text-center text-xs font-semibold text-white outline-none focus:border-emerald-500/30"
            />

            <button
              type="button"
              onClick={() => setHp(currentHp + 1)}
              aria-label={`Increase ${displayCharacter.name}'s hit points by 1`}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/20 text-xs text-emerald-300 transition hover:bg-emerald-500/10"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONDITIONS
      ===================================================== */}

      <div className="px-3 pb-3 pt-2">
        <div className="flex flex-wrap items-center gap-1">
          {conditions.map((condition) => (
            <button
              key={condition}
              type="button"
              onClick={() => toggleCondition(condition)}
              title={`Remove ${condition}`}
              className="workspace-no-drag inline-flex h-6 items-center gap-1 rounded-md border border-rose-500/20 bg-rose-500/[0.08] px-1.5 text-[9px] font-medium text-rose-300 transition hover:bg-rose-500/15"
            >
              {condition}

              <i className="fa-solid fa-xmark text-[7px] opacity-70" />
            </button>
          ))}

          <button
            type="button"
            onClick={() => setConditionsOpen((current) => !current)}
            aria-expanded={conditionsOpen}
            className={`workspace-no-drag inline-flex h-6 items-center gap-1 rounded-md border px-1.5 text-[9px] font-semibold transition ${
              conditionsOpen
                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                : "border-white/10 bg-white/[0.035] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-200"
            }`}
          >
            <i className="fa-solid fa-plus text-[7px]" />
            Condition
          </button>
        </div>

        {conditionsOpen ? (
          <div className="workspace-no-drag mt-2 grid grid-cols-2 gap-1.5 rounded-lg border border-white/10 bg-black/20 p-2">
            {ALL_CONDITIONS.map((condition) => {
              const active = conditions.includes(condition);

              return (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleCondition(condition)}
                  className={`rounded-md border px-2 py-1.5 text-left text-[9px] font-medium transition ${
                    active
                      ? "border-rose-500/25 bg-rose-500/10 text-rose-300"
                      : "border-white/5 bg-white/[0.025] text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"
                  }`}
                >
                  {condition}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function PartyControlWorkspaceModule({
  module,
  campaignId,
  editing,
  removeModule,
}: WorkspaceModuleRenderProps) {
  const {
    campaignCharacters: rawCampaignCharacters,

    campaignCharactersLoading,

    updateCharacter,
  } = useCampaignPageData(campaignId);

  const { selectCharacter } = useWorkspace();

  const [manageOpen, setManageOpen] = useState(false);

  const [search, setSearch] = useState("");

  const campaignCharacters = rawCampaignCharacters as PartyCharacter[];

  /*
   * undefined = active
   *
   * This preserves backwards compatibility:
   * every existing campaign character automatically
   * appears in Party Control until explicitly disabled.
   */
  const activeCharacters = useMemo(
    () =>
      campaignCharacters.filter(
        (character) => character.activeInParty !== false,
      ),
    [campaignCharacters],
  );

  const filteredManageCharacters = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return campaignCharacters;
    }

    return campaignCharacters.filter((character) =>
      [
        character.name,

        character.ownerName,

        character.race,

        character.speciesName,

        character.className,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [campaignCharacters, search]);

  const setCharacterActive = async (
    character: PartyCharacter,

    active: boolean,
  ) => {
    await updateCharacter(
      character.id,

      {
        activeInParty: active,
      } as any,
    );
  };

  const inspectCharacter = (characterId: string) => {
    selectCharacter(characterId, {
      encounterStatus: "manual",
    });
  };

  if (campaignCharactersLoading) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-zinc-500">
        Loading party...
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {/* =====================================================
          INTEGRATED HEADER
      ===================================================== */}

      <div
        className={`workspace-drag-handle flex h-9 shrink-0 items-center gap-2 border-b border-white/10 bg-white/[0.025] px-2.5 ${
          editing ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <i className="fa-solid fa-users shrink-0 text-xs text-emerald-400" />

        <div className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-100">
          Party Control
        </div>

        <span
          title={`${activeCharacters.length} active characters`}
          className="shrink-0 rounded-md border border-emerald-500/15 bg-emerald-500/[0.07] px-1.5 py-0.5 text-[9px] font-semibold text-emerald-300"
        >
          {activeCharacters.length} active
        </span>

        <button
          type="button"
          onClick={() => setManageOpen((current) => !current)}
          title="Manage active party"
          aria-label="Manage active party"
          className={`workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition ${
            manageOpen
              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
              : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          <i className="fa-solid fa-users-gear text-[10px]" />
        </button>

        {editing ? (
          <button
            type="button"
            onClick={() => removeModule(module.id)}
            title="Remove module"
            aria-label="Remove Party Control module"
            className="workspace-no-drag flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <i className="fa-solid fa-xmark text-[10px]" />
          </button>
        ) : null}
      </div>

      {/* =====================================================
          ACTIVE PARTY
      ===================================================== */}

      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
        {activeCharacters.length === 0 ? (
          <div className="flex min-h-full items-center justify-center p-6 text-center">
            <div>
              <i className="fa-solid fa-users text-3xl text-emerald-400/20" />

              <p className="mt-3 text-sm font-semibold text-zinc-300">
                No active characters
              </p>

              <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-500">
                Add characters to the active party to monitor them here.
              </p>

              <button
                type="button"
                onClick={() => setManageOpen(true)}
                className="workspace-no-drag mt-3 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400"
              >
                Manage Party
              </button>
            </div>
          </div>
        ) : (
          activeCharacters.map((character) => (
            <PartyCharacterCard
              key={character.id}
              character={character}
              onInspect={() => inspectCharacter(character.id)}
              onDeactivate={() => setCharacterActive(character, false)}
            />
          ))
        )}
      </div>

      {/* =====================================================
          PARTY MANAGER OVERLAY
      ===================================================== */}

      {manageOpen ? (
        <div className="workspace-no-drag absolute inset-0 z-40 flex flex-col bg-zinc-900">
          <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/10 px-2.5">
            <i className="fa-solid fa-users-gear text-xs text-emerald-400" />

            <div className="min-w-0 flex-1 text-xs font-semibold text-zinc-100">
              Manage Party
            </div>

            <span className="text-[9px] text-zinc-500">
              {activeCharacters.length}/{campaignCharacters.length}
            </span>

            <button
              type="button"
              onClick={() => setManageOpen(false)}
              aria-label="Close party manager"
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <i className="fa-solid fa-xmark text-[10px]" />
            </button>
          </div>

          <div className="shrink-0 border-b border-white/10 p-2">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search characters..."
                aria-label="Search characters"
                className="h-8 w-full rounded-lg border border-white/10 bg-black/30 py-1.5 pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-500 focus:border-emerald-500/30"
              />
            </div>
          </div>

          <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
            {filteredManageCharacters.length === 0 ? (
              <div className="p-5 text-center text-xs text-zinc-500">
                No matching characters.
              </div>
            ) : (
              filteredManageCharacters.map((character) => {
                const active = character.activeInParty !== false;

                const subtitle = [
                  character.race ?? character.speciesName,

                  character.className,

                  character.level ? `Level ${character.level}` : undefined,
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <button
                    key={character.id}
                    type="button"
                    onClick={() => setCharacterActive(character, !active)}
                    className="flex w-full items-center gap-2.5 border-b border-white/5 p-2.5 text-left transition hover:bg-white/[0.035]"
                  >
                    <Avatar
                      src={character.imageUrl}
                      name={character.name}
                      className="h-9 w-9 rounded-lg"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold text-zinc-200">
                        {character.name}
                      </div>

                      <div className="mt-0.5 truncate text-[9px] text-zinc-500">
                        {subtitle || "Player Character"}
                      </div>
                    </div>

                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                        active
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-white/10 bg-white/[0.025] text-zinc-600"
                      }`}
                    >
                      {active ? (
                        <i className="fa-solid fa-check text-[9px]" />
                      ) : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="shrink-0 border-t border-white/10 p-2">
            <button
              type="button"
              onClick={() => setManageOpen(false)}
              className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
