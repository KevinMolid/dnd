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

type CampaignCharacterStatus = "inactive" | "active";

type DeathSaves = {
  successes: number;
  failures: number;
};

type PartyCharacter = CampaignCharacter & {
  campaignStatus?: CampaignCharacterStatus;

  currentHp?: number;
  maxHp?: number;

  conditions?: string[];

  heroicInspiration?: boolean;

  deathSaves?: DeathSaves;

  deathSaveSuccesses?: number;
  deathSaveFailures?: number;

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

  abilityScores?: {
    str?: number;
    dex?: number;
    con?: number;
    int?: number;
    wis?: number;
    cha?: number;
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

const getFallbackArmorClass = (character: PartyCharacter) => {
  if (character.buildMode === "custom") {
    return character.customStats?.armorClass ?? character.armorClass ?? 10;
  }

  return character.armorClass ?? 10;
};

type CompactStatProps = {
  label: string;

  value: string | number;

  title?: string;

  accent?: boolean;
};

function CompactStat({
  label,
  value,
  title,
  accent = false,
}: CompactStatProps) {
  return (
    <div title={title} className="min-w-0 text-center">
      <div
        className={`truncate text-[7px] font-bold uppercase leading-none tracking-wide ${
          accent ? "text-sky-300/70" : "text-zinc-500"
        }`}
      >
        {label}
      </div>

      <div className="mt-1 text-[11px] font-bold leading-none text-zinc-100">
        {value}
      </div>
    </div>
  );
}

type DeathSaveTrackProps = {
  value: number;

  type: "success" | "failure";

  onChange: (value: number) => void;
};

function DeathSaveTrack({ value, type, onChange }: DeathSaveTrackProps) {
  const isSuccess = type === "success";

  return (
    <div className="flex items-center justify-center gap-1">
      <div
        title={isSuccess ? "Successes" : "Failures"}
        className={`flex h-[9px] w-[9px] shrink-0 items-center justify-center text-[7px] ${
          isSuccess ? "text-emerald-300" : "text-rose-300"
        }`}
      >
        <i className={`fa-solid ${isSuccess ? "fa-check" : "fa-xmark"}`} />
      </div>

      <div className="flex items-center gap-[3px]">
        {[1, 2, 3].map((slot) => {
          const active = value >= slot;

          return (
            <button
              key={slot}
              type="button"
              title={`${isSuccess ? "Success" : "Failure"} ${slot}`}
              aria-label={`Set ${
                isSuccess ? "successful" : "failed"
              } death saves to ${active && value === slot ? slot - 1 : slot}`}
              onClick={(event) => {
                event.stopPropagation();

                onChange(active && value === slot ? slot - 1 : slot);
              }}
              className={`workspace-no-drag h-[9px] w-[9px] rounded-full border transition ${
                active
                  ? isSuccess
                    ? "border-emerald-300 bg-emerald-400"
                    : "border-rose-300 bg-rose-400"
                  : "border-zinc-500 bg-transparent hover:border-zinc-200"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

type PartyCharacterRowProps = {
  character: PartyCharacter;

  onInspect: () => void;

  onSetHp: (character: PartyCharacter, nextHp: number) => Promise<void>;

  onToggleCondition: (
    character: PartyCharacter,
    condition: string,
  ) => Promise<void>;
};

function PartyCharacterRow({
  character,
  onInspect,
  onSetHp,
  onToggleCondition,
}: PartyCharacterRowProps) {
  /*
   * Character sheet data is used for:
   *
   * - calculated AC
   * - passive senses
   * - Heroic Inspiration updates
   * - Death Save updates
   *
   * This keeps Party Control synchronized with the
   * real character sheet.
   */
  const {
    character: sheetCharacter,

    derived,

    handleSetHeroicInspiration,

    handleSetDeathSaves,
  } = useCharacterSheetData(character.id);

  const [conditionsOpen, setConditionsOpen] = useState(false);

  const liveCharacter = (sheetCharacter ?? character) as PartyCharacter;

  /*
   * Campaign snapshot remains the visible HP source,
   * because this is already updated in realtime.
   */
  const currentHp = Math.max(
    0,
    character.currentHp ?? liveCharacter.currentHp ?? 0,
  );

  const maxHp = Math.max(1, character.maxHp ?? liveCharacter.maxHp ?? 1);

  const armorClass =
    derived?.armorClass ?? getFallbackArmorClass(liveCharacter);

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

    return getFallbackPassiveSenses(liveCharacter);
  }, [derived, liveCharacter]);

  const conditions = character.conditions ?? liveCharacter.conditions ?? [];

  const heroicInspiration = liveCharacter.heroicInspiration ?? false;

  const deathSaves: DeathSaves = {
    successes:
      liveCharacter.deathSaves?.successes ??
      liveCharacter.deathSaveSuccesses ??
      0,

    failures:
      liveCharacter.deathSaves?.failures ??
      liveCharacter.deathSaveFailures ??
      0,
  };

  const subtitle = [
    liveCharacter.className,

    liveCharacter.level ? `Lv ${liveCharacter.level}` : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  const hpPercentage = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

  const setDeathSaves = async (next: Partial<DeathSaves>) => {
    await handleSetDeathSaves({
      successes: next.successes ?? deathSaves.successes,

      failures: next.failures ?? deathSaves.failures,
    });
  };

  /*
   * Regaining HP clears Death Saves.
   *
   * We only do this when crossing specifically from
   * 0 HP to a positive HP value.
   */
  const setHp = async (nextHp: number) => {
    const safeHp = Math.max(0, Math.min(maxHp, Math.floor(nextHp)));

    await onSetHp(character, safeHp);

    if (currentHp === 0 && safeHp > 0) {
      await handleSetDeathSaves({
        successes: 0,
        failures: 0,
      });
    }
  };

  const toggleInspiration = async () => {
    await handleSetHeroicInspiration(!heroicInspiration);
  };

  return (
    <article className="border-b border-white/[0.07] last:border-b-0">
      <div className="flex min-h-[54px]">
        {/* =====================================================
            PORTRAIT / DEATH SAVES
        ===================================================== */}

        <div
          className={`group relative aspect-square w-[54px] shrink-0 overflow-hidden bg-black/30 ${
            heroicInspiration ? "ring-2 ring-inset ring-amber-400/80" : ""
          }`}
        >
          {currentHp === 0 ? (
            /*
             * At 0 HP the portrait area becomes the
             * Death Save controller.
             */
            <div className="flex h-full w-full flex-col justify-center px-1">
              <div className="mb-1 text-center text-[6px] font-bold uppercase tracking-[0.08em] text-zinc-300">
                Death Saves
              </div>

              <div className="space-y-1">
                <DeathSaveTrack
                  value={deathSaves.successes}
                  type="success"
                  onChange={(successes) =>
                    setDeathSaves({
                      successes,
                    })
                  }
                />

                <DeathSaveTrack
                  value={deathSaves.failures}
                  type="failure"
                  onChange={(failures) =>
                    setDeathSaves({
                      failures,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onInspect}
              title={`Inspect ${liveCharacter.name}`}
              className="h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400/40"
            >
              <Avatar
                src={liveCharacter.imageUrl}
                name={liveCharacter.name}
                className="h-full w-full rounded-none object-cover"
              />
            </button>
          )}

          {/* =================================================
              HEROIC INSPIRATION

              No inspiration:
              - visible outlined star
              - subdued normally
              - clearly highlighted when portrait is hovered

              Inspiration:
              - solid gold star
              - gold border around image/death-save square
          ================================================= */}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();

              toggleInspiration();
            }}
            title={
              heroicInspiration
                ? "Remove Heroic Inspiration"
                : "Grant Heroic Inspiration"
            }
            aria-label={
              heroicInspiration
                ? `Remove Heroic Inspiration from ${liveCharacter.name}`
                : `Grant Heroic Inspiration to ${liveCharacter.name}`
            }
            className={`workspace-no-drag absolute right-0.5 top-0.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border text-[7px] shadow transition-all ${
              heroicInspiration
                ? "border-amber-200 bg-amber-400 text-zinc-950 opacity-100"
                : "border-white/25 bg-black/65 text-zinc-300 opacity-60 group-hover:border-amber-400/60 group-hover:bg-black/85 group-hover:text-amber-300 group-hover:opacity-100 hover:border-amber-300 hover:bg-amber-400 hover:text-zinc-950"
            }`}
          >
            <i
              className={`${
                heroicInspiration ? "fa-solid" : "fa-regular"
              } fa-star`}
            />
          </button>
        </div>

        {/* =====================================================
            CHARACTER CONTENT
        ===================================================== */}

        <div className="min-w-0 flex-1 px-1.5 py-1.5">
          {/* Main row */}

          <div className="flex min-w-0 items-center gap-1.5">
            {/* Identity */}

            <div className="w-[102px] min-w-0 shrink-0">
              <button
                type="button"
                onClick={onInspect}
                title={`Inspect ${liveCharacter.name}`}
                className="workspace-no-drag block max-w-full truncate text-left text-[10px] font-bold leading-4 text-zinc-100 transition hover:text-emerald-300"
              >
                {liveCharacter.name}
              </button>

              <div className="truncate text-[7px] leading-3 text-zinc-500">
                {subtitle || "Character"}
              </div>
            </div>

            {/* AC + passive senses */}

            <div className="grid w-[116px] shrink-0 grid-cols-4 gap-0.5">
              <CompactStat label="AC" value={armorClass} accent />

              <CompactStat
                label="PER"
                value={passiveSenses.perception ?? "—"}
                title="Passive Perception"
              />

              <CompactStat
                label="INS"
                value={passiveSenses.insight ?? "—"}
                title="Passive Insight"
              />

              <CompactStat
                label="INV"
                value={passiveSenses.investigation ?? "—"}
                title="Passive Investigation"
              />
            </div>

            {/* HP controls */}

            <div className="workspace-no-drag ml-auto flex shrink-0 items-center gap-0.5">
              <div className="mr-0.5 w-[34px] text-right">
                <div className="text-[7px] font-bold uppercase leading-none text-rose-300/70">
                  HP
                </div>

                <div
                  className={`mt-0.5 whitespace-nowrap text-[9px] font-bold leading-none ${
                    currentHp === 0 ? "text-rose-300" : "text-zinc-100"
                  }`}
                >
                  {currentHp}/{maxHp}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setHp(currentHp - 1)}
                aria-label={`Decrease ${liveCharacter.name}'s hit points by 1`}
                className="flex h-[22px] w-[22px] items-center justify-center rounded border border-white/10 bg-black/20 text-[9px] text-rose-300 transition hover:bg-rose-500/10"
              >
                −
              </button>

              <input
                type="number"
                value={currentHp}
                aria-label={`${liveCharacter.name} current hit points`}
                onChange={(event) => setHp(Number(event.target.value))}
                className="h-[22px] w-8 rounded border border-white/10 bg-black/30 text-center text-[9px] font-semibold text-white outline-none focus:border-emerald-500/30"
              />

              <button
                type="button"
                onClick={() => setHp(currentHp + 1)}
                aria-label={`Increase ${liveCharacter.name}'s hit points by 1`}
                className="flex h-[22px] w-[22px] items-center justify-center rounded border border-white/10 bg-black/20 text-[9px] text-emerald-300 transition hover:bg-emerald-500/10"
              >
                +
              </button>
            </div>
          </div>

          {/* Second row */}

          <div className="mt-1 flex min-w-0 items-center gap-1.5">
            {/* HP bar */}

            <div className="h-1 min-w-6 flex-1 overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full transition-all ${
                  currentHp === 0
                    ? "bg-rose-500"
                    : hpPercentage <= 25
                      ? "bg-rose-400"
                      : hpPercentage <= 50
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                }`}
                style={{
                  width: currentHp === 0 ? "100%" : `${hpPercentage}%`,
                }}
              />
            </div>

            {/* Active conditions */}

            {conditions.length > 0 ? (
              <div className="flex min-w-0 items-center gap-1 overflow-hidden">
                {conditions.slice(0, 2).map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => onToggleCondition(character, condition)}
                    title={`Remove ${condition}`}
                    className="workspace-no-drag inline-flex h-5 max-w-20 items-center gap-1 truncate rounded border border-rose-500/20 bg-rose-500/[0.07] px-1 text-[7px] font-medium text-rose-300 transition hover:bg-rose-500/15"
                  >
                    <span className="truncate">{condition}</span>

                    <i className="fa-solid fa-xmark shrink-0 text-[6px] opacity-70" />
                  </button>
                ))}

                {conditions.length > 2 ? (
                  <span className="shrink-0 text-[7px] font-semibold text-rose-300/70">
                    +{conditions.length - 2}
                  </span>
                ) : null}
              </div>
            ) : null}

            {/* Condition button */}

            <button
              type="button"
              onClick={() => setConditionsOpen((current) => !current)}
              title="Add or remove conditions"
              aria-expanded={conditionsOpen}
              className={`workspace-no-drag flex h-5 shrink-0 items-center gap-1 rounded border px-1.5 text-[7px] font-semibold transition ${
                conditionsOpen
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                  : conditions.length > 0
                    ? "border-rose-500/20 bg-rose-500/[0.07] text-rose-300"
                    : "border-white/10 bg-white/[0.025] text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-300"
              }`}
            >
              <i className="fa-solid fa-plus text-[6px]" />
              Condition
            </button>
          </div>

          {/* Condition picker */}

          {conditionsOpen ? (
            <div className="workspace-no-drag mt-1.5 grid grid-cols-3 gap-1 rounded-md border border-white/10 bg-black/30 p-1.5">
              {ALL_CONDITIONS.map((condition) => {
                const active = conditions.includes(condition);

                return (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => onToggleCondition(character, condition)}
                    title={condition}
                    className={`truncate rounded border px-1.5 py-1 text-left text-[8px] font-medium transition ${
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

    toggleCondition,
  } = useCampaignPageData(campaignId);

  const { selectCharacter } = useWorkspace();

  const [manageOpen, setManageOpen] = useState(false);

  const [search, setSearch] = useState("");

  const campaignCharacters = rawCampaignCharacters as PartyCharacter[];

  /*
   * Same active/inactive state used by
   * CampaignCharactersPage.
   */
  const activeCharacters = useMemo(
    () =>
      campaignCharacters.filter(
        (character) => character.campaignStatus === "active",
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

  const setCharacterStatus = async (
    character: PartyCharacter,

    status: CampaignCharacterStatus,
  ) => {
    try {
      await updateCharacter(
        character.id,

        {
          campaignStatus: status,
        },
      );
    } catch (error) {
      console.error("Failed to update campaign character status:", error);
    }
  };

  /*
   * Custom and guided characters persist HP differently.
   */
  const setCharacterHp = async (
    character: PartyCharacter,

    nextHp: number,
  ) => {
    const maxHp = Math.max(
      1,

      character.maxHp ?? character.customStats?.maxHp ?? 1,
    );

    const safeHp = Math.max(0, Math.min(maxHp, Math.floor(nextHp)));

    try {
      if (character.buildMode === "custom") {
        await updateCharacter(
          character.id,

          {
            customStats: {
              ...(character.customStats ?? {}),

              currentHp: safeHp,
            },
          },
        );

        return;
      }

      await updateCharacter(
        character.id,

        {
          currentHp: safeHp,
        },
      );
    } catch (error) {
      console.error("Failed to update character HP:", error);
    }
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
          HEADER
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
                Set campaign characters to active to monitor them here.
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
            <PartyCharacterRow
              key={character.id}
              character={character}
              onInspect={() => inspectCharacter(character.id)}
              onSetHp={setCharacterHp}
              onToggleCondition={toggleCondition}
            />
          ))
        )}
      </div>

      {/* =====================================================
          PARTY MANAGER
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
                const active = character.campaignStatus === "active";

                const subtitle = [
                  character.className,

                  character.level ? `Lv ${character.level}` : undefined,
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <button
                    key={character.id}
                    type="button"
                    onClick={() =>
                      setCharacterStatus(
                        character,

                        active ? "inactive" : "active",
                      )
                    }
                    className="flex w-full items-center gap-2.5 border-b border-white/5 px-2.5 py-2 text-left transition hover:bg-white/[0.035]"
                  >
                    <Avatar
                      src={character.imageUrl}
                      name={character.name}
                      className="h-8 w-8 rounded-md"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <div className="truncate text-[11px] font-semibold text-zinc-200">
                          {character.name}
                        </div>

                        <span
                          className={`shrink-0 rounded border px-1.5 py-0.5 text-[8px] font-medium ${
                            active
                              ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300"
                              : "border-white/10 bg-white/[0.03] text-zinc-500"
                          }`}
                        >
                          {active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="mt-0.5 truncate text-[8px] text-zinc-500">
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
