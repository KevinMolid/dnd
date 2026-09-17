import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { useParams } from "react-router-dom";

import SpellTooltip from "../../../components/SpellTooltip";

import { abilityLabels } from "../utils/characterSheetConstants";

import { formatLabel, formatModifier } from "../utils/characterSheetHelpers";

import type { AbilityKey, Spell } from "../../../rulesets/dnd/dnd2024/types";

import SpellPickerModal from "../../../components/character/SpellPickerModal";

import type { CustomSpellEntry } from "../../../types/customCharacter";

export type OverviewAttack = {
  id: string;

  name: string;

  attackBonus?: number;

  saveDc?: number;

  damage?: string;

  isOffHand?: boolean;

  isThrown?: boolean;

  isTwoHanded?: boolean;

  isSpecial?: boolean;

  properties?: string[];

  ability?: AbilityKey;

  mastery?: string | null;

  range?: {
    normal: number;

    long?: number | null;
  } | null;

  rangeLabel?: string;

  usageLabel?: string;
};

export type OverviewSpell = Partial<Spell> & {
  id?: string;

  spellId?: string;

  name: string;

  level?: number;
};

export type OverviewSpellSlot = {
  level: number;

  max: number;

  remaining: number;
};

export type OverviewSpellcasting = {
  abilityLabel?: string;

  saveDc?: number | null;

  attackBonus?: number | null;

  slots?: OverviewSpellSlot[];
};

export type OverviewAction = {
  id: string;

  name: string;

  description?: string;

  value?: string;
};

export type PlayTab = "attacks" | "spells" | "actions";

type OverviewDashboardProps = {
  attacks?: OverviewAttack[];

  spells?: OverviewSpell[];

  spellcasting?: OverviewSpellcasting;

  onSpellSlotChange?: (
    level: number,
    remaining: number,
  ) => void | Promise<void>;

  onAddSpell?: (spell: CustomSpellEntry) => void | Promise<void>;

  onRemoveSpell?: (spellId: string) => void | Promise<void>;

  actions?: OverviewAction[];

  bonusActions?: OverviewAction[];

  reactions?: OverviewAction[];

  combatOptions?: OverviewAction[];
};

type AttackType = "melee" | "thrown" | "ranged" | "special";

type AttackRole = "main-hand" | "off-hand" | "two-handed" | "standard";

const playTabs: Array<{
  id: PlayTab;

  label: string;
}> = [
  {
    id: "attacks",
    label: "Attacks",
  },
  {
    id: "spells",
    label: "Spells",
  },
  {
    id: "actions",
    label: "Actions",
  },
];

const getAttackType = (attack: OverviewAttack): AttackType => {
  if (attack.isSpecial) {
    return "special";
  }

  if (attack.isThrown) {
    return "thrown";
  }

  const properties =
    attack.properties?.map((property) => property.toLowerCase()) ?? [];

  if (properties.includes("ammunition") || attack.range) {
    return "ranged";
  }

  return "melee";
};

const getAttackRole = (attack: OverviewAttack): AttackRole => {
  if (attack.isSpecial) {
    return "standard";
  }

  if (attack.isTwoHanded) {
    return "two-handed";
  }

  if (attack.isOffHand) {
    return "off-hand";
  }

  if (!attack.isThrown && getAttackType(attack) === "melee") {
    return "main-hand";
  }

  return "standard";
};

const attackRoleLabels: Record<AttackRole, string> = {
  "main-hand": "Main Hand",

  "off-hand": "Off Hand",

  "two-handed": "Two-Handed",

  standard: "",
};

const attackTypeLabels: Record<AttackType, string> = {
  melee: "Melee",

  thrown: "Thrown",

  ranged: "Ranged",

  special: "Special",
};

const getAttackSortWeight = (attack: OverviewAttack) => {
  if (attack.isSpecial) {
    return 5;
  }

  const role = getAttackRole(attack);

  const type = getAttackType(attack);

  if (role === "main-hand") {
    return 0;
  }

  if (type === "melee") {
    return 1;
  }

  if (role === "off-hand" && type !== "thrown") {
    return 2;
  }

  if (type === "thrown") {
    return 3;
  }

  return 4;
};

const formatAttackRange = (attack: OverviewAttack) => {
  if (attack.rangeLabel) {
    return attack.rangeLabel;
  }

  const type = getAttackType(attack);

  if (attack.range) {
    const normal = attack.range.normal;

    const long = attack.range.long;

    return long ? `${normal}/${long} ft` : `${normal} ft`;
  }

  if (type === "melee") {
    return "5 ft";
  }

  return null;
};

const OverviewDashboard = ({
  attacks = [],

  spells = [],

  spellcasting,

  onSpellSlotChange,

  onAddSpell,

  onRemoveSpell,

  actions = [],

  bonusActions = [],

  reactions = [],

  combatOptions = [],
}: OverviewDashboardProps) => {
  const { characterId } = useParams();
  const [activePlayTab, setActivePlayTab] = useState<PlayTab>("attacks");
  const restoredForCharacterRef = useRef<string | null>(null);

  useEffect(() => {
    if (!characterId || restoredForCharacterRef.current === characterId) {
      return;
    }

    restoredForCharacterRef.current = characterId;

    try {
      const stored = localStorage.getItem(
        `lorebound:character-sheet:${characterId}:play-tab`,
      );

      if (stored === "attacks" || stored === "spells" || stored === "actions") {
        /*
         * Spells is still a valid tab for a character with no spells; the panel
         * simply explains that the character has none. This also means a
         * temporarily empty spell list doesn't destroy the player's preference.
         */
        setActivePlayTab(stored);
      }
    } catch {
      // Persistence is optional.
    }
  }, [characterId]);

  useEffect(() => {
    if (!characterId || restoredForCharacterRef.current !== characterId) {
      return;
    }

    try {
      localStorage.setItem(
        `lorebound:character-sheet:${characterId}:play-tab`,
        activePlayTab,
      );
    } catch {
      // Persistence is optional.
    }
  }, [characterId, activePlayTab]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-white/10 bg-black/15 px-2">
        <div className="flex">
          {playTabs.map((tab) => {
            const active = activePlayTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePlayTab(tab.id)}
                className={`relative px-3 py-3 text-xs font-semibold transition ${
                  active ? "text-white" : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {tab.label}

                <span
                  className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full ${
                    active ? "bg-white" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
        {activePlayTab === "attacks" ? (
          <AttacksPanel attacks={attacks} />
        ) : null}

        {activePlayTab === "spells" ? (
          <SpellsPanel
            spells={spells}
            spellcasting={spellcasting}
            onSpellSlotChange={onSpellSlotChange}
            onAddSpell={onAddSpell}
            onRemoveSpell={onRemoveSpell}
          />
        ) : null}

        {activePlayTab === "actions" ? (
          <ActionsPanel
            actions={actions}
            bonusActions={bonusActions}
            reactions={reactions}
            combatOptions={combatOptions}
          />
        ) : null}
      </div>
    </div>
  );
};

/* =========================================================
   ATTACKS
========================================================= */

const AttacksPanel = ({ attacks }: { attacks: OverviewAttack[] }) => {
  const sortedAttacks = useMemo(
    () =>
      attacks
        .map((attack, originalIndex) => ({
          attack,

          originalIndex,
        }))
        .sort((a, b) => {
          const difference =
            getAttackSortWeight(a.attack) - getAttackSortWeight(b.attack);

          return difference !== 0
            ? difference
            : a.originalIndex - b.originalIndex;
        })
        .map((entry) => entry.attack),
    [attacks],
  );

  return (
    <PanelSection title="Character Attacks">
      {sortedAttacks.length > 0 ? (
        <div className="divide-y divide-white/[0.07]">
          {sortedAttacks.map((attack) => (
            <AttackRow key={attack.id} attack={attack} />
          ))}
        </div>
      ) : (
        <EmptyText>No attacks available.</EmptyText>
      )}
    </PanelSection>
  );
};

const AttackRow = ({ attack }: { attack: OverviewAttack }) => {
  const role = getAttackRole(attack);

  const type = getAttackType(attack);

  const range = formatAttackRange(attack);

  const properties = attack.properties ?? [];

  const hiddenProperties = new Set([
    "thrown",
    "two-handed",
    "ammunition",
    "range",
  ]);

  const secondaryProperties = properties.filter(
    (property) => !hiddenProperties.has(property.toLowerCase()),
  );

  const resolutionLabel = typeof attack.saveDc === "number" ? "Save" : "To Hit";

  const resolutionValue =
    typeof attack.saveDc === "number"
      ? `DC ${attack.saveDc}`
      : typeof attack.attackBonus === "number"
        ? formatModifier(attack.attackBonus)
        : "—";

  return (
    <div className="py-3.5 first:pt-0 last:pb-0">
      <div className="grid grid-cols-[minmax(0,1fr)_54px_96px] items-end gap-2">
        <p className="truncate text-sm font-semibold text-white">
          {attack.name}
        </p>

        <div className="text-right">
          <TinyLabel>{resolutionLabel}</TinyLabel>

          <p className="mt-0.5 text-sm font-bold leading-none text-white">
            {resolutionValue}
          </p>
        </div>

        <div className="text-right">
          <TinyLabel>Damage</TinyLabel>

          <p className="mt-0.5 whitespace-nowrap text-xs font-bold leading-none text-zinc-100">
            {attack.damage ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] font-medium">
        {attackRoleLabels[role] ? (
          <>
            <AttackRoleLabel role={role}>
              {attackRoleLabels[role]}
            </AttackRoleLabel>

            <Separator />
          </>
        ) : null}

        <span
          className={
            type === "ranged" || type === "thrown"
              ? "text-sky-300/80"
              : type === "special"
                ? "text-violet-300/80"
                : "text-zinc-400"
          }
        >
          {attackTypeLabels[type]}
        </span>

        {range ? (
          <>
            <Separator />

            <span className="font-semibold text-zinc-300">{range}</span>
          </>
        ) : null}
      </div>

      {attack.ability ||
      attack.mastery ||
      attack.usageLabel ||
      secondaryProperties.length > 0 ? (
        <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-[9px] text-zinc-500">
          {attack.ability ? <span>{abilityLabels[attack.ability]}</span> : null}

          {attack.ability && attack.mastery ? <Separator /> : null}

          {attack.mastery ? (
            <span>
              Mastery{" "}
              <strong className="font-medium text-zinc-500">
                {formatLabel(attack.mastery)}
              </strong>
            </span>
          ) : null}

          {(attack.ability || attack.mastery) && attack.usageLabel ? (
            <Separator />
          ) : null}

          {attack.usageLabel ? <span>{attack.usageLabel}</span> : null}

          {(attack.ability || attack.mastery || attack.usageLabel) &&
          secondaryProperties.length > 0 ? (
            <Separator />
          ) : null}

          {secondaryProperties.length > 0 ? (
            <span className="truncate">
              {secondaryProperties.map(formatLabel).join(" · ")}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

/* =========================================================
   SPELLS
========================================================= */

const SpellsPanel = ({
  spells,
  spellcasting,
  onSpellSlotChange,
  onAddSpell,
  onRemoveSpell,
}: {
  spells: OverviewSpell[];
  spellcasting?: OverviewSpellcasting;
  onSpellSlotChange?: (
    level: number,
    remaining: number,
  ) => void | Promise<void>;
  onAddSpell?: (spell: CustomSpellEntry) => void | Promise<void>;
  onRemoveSpell?: (spellId: string) => void | Promise<void>;
}) => {
  const [spellPickerOpen, setSpellPickerOpen] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<OverviewSpell | null>(
    null,
  );
  const [busySpellId, setBusySpellId] = useState<string | null>(null);

  const sorted = [...spells].sort(
    (a, b) => (a.level ?? 0) - (b.level ?? 0) || a.name.localeCompare(b.name),
  );

  const grouped = sorted.reduce<Record<number, OverviewSpell[]>>(
    (groups, spell) => {
      const level = spell.level ?? 0;
      if (!groups[level]) groups[level] = [];
      groups[level].push(spell);
      return groups;
    },
    {},
  );

  const slots = spellcasting?.slots?.filter((slot) => slot.max > 0) ?? [];

  const hasStats =
    Boolean(spellcasting?.abilityLabel) ||
    typeof spellcasting?.saveDc === "number" ||
    typeof spellcasting?.attackBonus === "number";

  const selectedSpellIds = sorted
    .map((spell) => spell.spellId ?? spell.id)
    .filter((id): id is string => Boolean(id));

  const requestRemove = (spell: OverviewSpell) => {
    if (!onRemoveSpell) return;
    setConfirmRemove(spell);
  };

  const confirmRemoval = async () => {
    if (!confirmRemove || !onRemoveSpell) return;

    const spellId = confirmRemove.spellId ?? confirmRemove.id;
    if (!spellId) return;

    setBusySpellId(spellId);

    try {
      await onRemoveSpell(spellId);
      setConfirmRemove(null);
    } finally {
      setBusySpellId(null);
    }
  };

  return (
    <>
      <div>
        {hasStats || slots.length > 0 ? (
          <section className="border-b border-white/[0.07] p-3">
            {hasStats ? (
              <div className="grid grid-cols-3 gap-1">
                <SpellcastingStat
                  label="Ability"
                  value={spellcasting?.abilityLabel ?? "—"}
                />
                <SpellcastingStat
                  label="Save DC"
                  value={spellcasting?.saveDc ?? "—"}
                />
                <SpellcastingStat
                  label="Attack"
                  value={
                    typeof spellcasting?.attackBonus === "number"
                      ? formatModifier(spellcasting.attackBonus)
                      : "—"
                  }
                />
              </div>
            ) : null}

            {slots.length > 0 ? (
              <div
                className={
                  hasStats ? "mt-3 border-t border-white/[0.06] pt-3" : ""
                }
              >
                <div className="mb-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
                    Spell Slots
                  </span>
                </div>

                <div className="space-y-2">
                  {slots.map((slot) => (
                    <SpellSlotRow
                      key={slot.level}
                      slot={slot}
                      onChange={onSpellSlotChange}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        <section
          className={`border-b p-3 transition ${
            removeMode
              ? "border-white/[0.08] bg-white/[0.015]"
              : "border-white/[0.06]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
              Spells
            </span>

            <div className="flex items-center gap-1.5">
              {onAddSpell ? (
                <button
                  type="button"
                  onClick={() => setSpellPickerOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-zinc-300 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white"
                >
                  <i className="fa-solid fa-plus text-[9px]" />
                  Add
                </button>
              ) : null}

              {onRemoveSpell && sorted.length > 0 ? (
                <button
                  type="button"
                  aria-pressed={removeMode}
                  onClick={() => setRemoveMode((current) => !current)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-semibold transition ${
                    removeMode
                      ? "border-white/[0.12] bg-white/[0.07] text-zinc-200"
                      : "border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:border-white/15 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <i
                    className={`fa-solid ${
                      removeMode ? "fa-check" : "fa-trash-can"
                    } text-[9px]`}
                  />
                  {removeMode ? "Done" : "Remove"}
                </button>
              ) : null}
            </div>
          </div>
        </section>

        {Object.entries(grouped).map(([level, levelSpells]) => (
          <section
            key={level}
            className={`border-b border-white/[0.06] p-3 last:border-b-0 ${
              removeMode ? "bg-white/[0.01]" : ""
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
                {Number(level) === 0 ? "Cantrips" : `Level ${level}`}
              </span>
              <span className="text-sm text-zinc-500">
                {levelSpells.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {levelSpells.map((spell, index) => {
                const spellId =
                  spell.spellId ?? spell.id ?? `${spell.name}-${index}`;

                return (
                  <div key={spellId} className="inline-flex items-stretch">
                    <SpellTooltip spell={spell}>
                      <div
                        className={`inline-flex cursor-pointer items-center gap-1.5 border px-2 py-1.5 transition ${
                          removeMode
                            ? "rounded-l-md border-white/[0.08] bg-white/[0.025]"
                            : "rounded-md border-white/[0.07] bg-black/20 hover:border-white/15 hover:bg-white/[0.05]"
                        }`}
                      >
                        <span className="whitespace-nowrap text-[11px] font-semibold text-white">
                          {spell.name}
                        </span>

                        {spell.concentration ? (
                          <span
                            title="Concentration"
                            className="text-[9px] font-bold text-fuchsia-300"
                          >
                            C
                          </span>
                        ) : null}

                        {spell.ritual ? (
                          <span
                            title="Ritual"
                            className="text-[9px] font-bold text-sky-300"
                          >
                            R
                          </span>
                        ) : null}
                      </div>
                    </SpellTooltip>

                    {removeMode ? (
                      <button
                        type="button"
                        title={`Remove ${spell.name}`}
                        aria-label={`Remove ${spell.name}`}
                        onClick={() => requestRemove(spell)}
                        className="inline-flex w-7 items-center justify-center rounded-r-md border border-l-0 border-white/[0.08] bg-white/[0.04] text-[10px] text-zinc-400 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {sorted.length === 0 ? (
          <div className="p-3">
            <EmptyText>No spells added.</EmptyText>
          </div>
        ) : null}
      </div>

      <SpellPickerModal
        isOpen={spellPickerOpen}
        onClose={() => setSpellPickerOpen(false)}
        selectedSpellIds={selectedSpellIds}
        onSelect={async (spell) => {
          if (!onAddSpell) return;
          await onAddSpell(spell);
        }}
        onRemove={
          onRemoveSpell
            ? async (spellId) => {
                await onRemoveSpell(spellId);
              }
            : undefined
        }
      />

      {confirmRemove ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl">
            <div className="border-b border-white/10 bg-white/[0.025] px-4 py-3">
              <h3 className="text-sm font-semibold text-white">
                Remove {confirmRemove.name}?
              </h3>
            </div>

            <div className="p-4">
              <p className="text-xs leading-5 text-zinc-400">
                Remove {confirmRemove.name} from this character&apos;s spell
                list?
              </p>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmRemove(null)}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/[0.08]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    busySpellId === (confirmRemove.spellId ?? confirmRemove.id)
                  }
                  onClick={() => void confirmRemoval()}
                  className="rounded-lg border border-red-700/60 bg-red-950/60 px-3 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-900/70 disabled:opacity-40"
                >
                  Remove Spell
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

const SpellcastingStat = ({
  label,

  value,
}: {
  label: string;

  value: string | number;
}) => (
  <div className="rounded-lg bg-black/20 px-2 py-2">
    <span className="text-xs font-semibold uppercase tracking-[0.06em] text-zinc-500">
      {label}
    </span>

    <p className="mt-1 truncate text-sm font-bold text-zinc-100">{value}</p>
  </div>
);

const SpellSlotRow = ({
  slot,

  onChange,
}: {
  slot: OverviewSpellSlot;

  onChange?: (level: number, remaining: number) => void | Promise<void>;
}) => {
  const remaining = Math.max(0, Math.min(slot.max, slot.remaining));

  const spendOne = () => {
    if (!onChange || remaining <= 0) {
      return;
    }

    onChange(slot.level, remaining - 1);
  };

  const restoreOne = () => {
    if (!onChange || remaining >= slot.max) {
      return;
    }

    onChange(slot.level, remaining + 1);
  };

  return (
    <div className="grid grid-cols-[42px_minmax(0,1fr)_30px] items-center gap-2">
      <span className="text-[10px] font-semibold text-zinc-300">
        L{slot.level}
      </span>

      <div className="flex flex-wrap gap-1">
        {Array.from(
          {
            length: slot.max,
          },
          (_, index) => {
            const filled = index < remaining;

            return (
              <button
                key={index}
                type="button"
                disabled={!onChange}
                onClick={filled ? spendOne : restoreOne}
                title={filled ? "Use one spell slot" : "Restore one spell slot"}
                aria-label={`Level ${slot.level} spell slot ${index + 1}`}
                aria-pressed={filled}
                className={`h-4 w-4 rounded-md border transition ${
                  onChange ? "cursor-pointer hover:scale-105" : "cursor-default"
                } ${
                  filled
                    ? "border-violet-400/40 bg-violet-400/30"
                    : "border-white/15 bg-transparent hover:border-violet-400/30"
                }`}
              />
            );
          },
        )}
      </div>

      <span className="text-right text-[10px] font-semibold text-zinc-400">
        {remaining}/{slot.max}
      </span>
    </div>
  );
};

/* =========================================================
   ACTIONS
========================================================= */

const ActionsPanel = ({
  actions,

  bonusActions,

  reactions,

  combatOptions,
}: {
  actions: OverviewAction[];

  bonusActions: OverviewAction[];

  reactions: OverviewAction[];

  combatOptions: OverviewAction[];
}) => {
  const empty =
    actions.length === 0 &&
    bonusActions.length === 0 &&
    reactions.length === 0 &&
    combatOptions.length === 0;

  return (
    <div className="divide-y divide-white/[0.07]">
      {actions.length > 0 ? (
        <ActionSection title="Actions" actions={actions} />
      ) : null}

      {bonusActions.length > 0 ? (
        <ActionSection title="Bonus Actions" actions={bonusActions} />
      ) : null}

      {reactions.length > 0 ? (
        <ActionSection title="Reactions" actions={reactions} />
      ) : null}

      {combatOptions.length > 0 ? (
        <ActionSection title="Combat Options" actions={combatOptions} />
      ) : null}

      {empty ? (
        <PanelSection title="Actions">
          <EmptyText>No character-specific actions.</EmptyText>
        </PanelSection>
      ) : null}
    </div>
  );
};

const ActionSection = ({
  title,

  actions,
}: {
  title: string;

  actions: OverviewAction[];
}) => (
  <section className="p-3">
    <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
      {title}
    </h3>

    <div className="grid gap-1.5">
      {actions.map((action) => (
        <div
          key={action.id}
          className="rounded-lg border border-white/[0.06] bg-black/20 px-2.5 py-2"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-zinc-100">{action.name}</p>

            {action.value ? (
              <span className="shrink-0 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-xs font-semibold text-emerald-300">
                {action.value}
              </span>
            ) : null}
          </div>

          {action.description ? (
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
              {action.description}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  </section>
);

/* =========================================================
   SHARED
========================================================= */

const AttackRoleLabel = ({
  role,

  children,
}: {
  role: AttackRole;

  children: ReactNode;
}) => {
  const className =
    role === "off-hand"
      ? "text-amber-300/80"
      : role === "two-handed"
        ? "text-violet-300/75"
        : "text-zinc-400";

  return (
    <span
      className={`text-[9px] font-bold uppercase tracking-[0.07em] ${className}`}
    >
      {children}
    </span>
  );
};

const Separator = () => <span className="text-zinc-700">·</span>;

const PanelSection = ({
  title,

  children,
}: {
  title: string;

  children: ReactNode;
}) => (
  <section className="p-3">
    <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
      {title}
    </h2>

    {children}
  </section>
);

const TinyLabel = ({ children }: { children: ReactNode }) => (
  <span className="text-xs font-semibold uppercase tracking-[0.06em] text-zinc-500">
    {children}
  </span>
);

const EmptyText = ({ children }: { children: ReactNode }) => (
  <p className="text-sm text-zinc-500">{children}</p>
);

export default OverviewDashboard;
