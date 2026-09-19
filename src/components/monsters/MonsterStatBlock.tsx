import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type {
  MonsterDefinition,
  MonsterSkills,
  MonsterSenses,
  MonsterSavingThrows,
  MonsterSpeed,
  MonsterTextEntry,
} from "../../features/monsters/catalog/monsterTypes";

export type MonsterSource = "default" | "campaign";

export type MonsterListItem = MonsterDefinition & {
  source: MonsterSource;
  basedOnMonsterId?: string;
};

const abilityModifier = (score: number) => {
  const modifier = Math.floor((score - 10) / 2);

  return modifier >= 0 ? `+${modifier}` : String(modifier);
};

const formatSignedNumber = (value: number) =>
  value >= 0 ? `+${value}` : String(value);

const formatSpeed = (speed: MonsterSpeed) => {
  const parts: string[] = [];

  if (speed.walk !== undefined) {
    parts.push(`${speed.walk} ft.`);
  }

  if (speed.burrow !== undefined) {
    parts.push(`Burrow ${speed.burrow} ft.`);
  }

  if (speed.climb !== undefined) {
    parts.push(`Climb ${speed.climb} ft.`);
  }

  if (speed.fly !== undefined) {
    parts.push(`Fly ${speed.fly} ft.${speed.hover ? " (hover)" : ""}`);
  }

  if (speed.swim !== undefined) {
    parts.push(`Swim ${speed.swim} ft.`);
  }

  if (speed.notes) {
    parts.push(speed.notes);
  }

  return parts.join(", ") || "—";
};

const formatSkills = (skills?: MonsterSkills) => {
  if (!skills) {
    return undefined;
  }

  const entries = Object.entries(skills);

  if (!entries.length) {
    return undefined;
  }

  return entries
    .map(([skill, bonus]) => `${skill} ${formatSignedNumber(bonus)}`)
    .join(", ");
};

const formatSavingThrows = (savingThrows?: MonsterSavingThrows) => {
  if (!savingThrows) {
    return undefined;
  }

  const labels = {
    str: "Str",
    dex: "Dex",
    con: "Con",
    int: "Int",
    wis: "Wis",
    cha: "Cha",
  } as const;

  const entries = Object.entries(savingThrows);

  if (!entries.length) {
    return undefined;
  }

  return entries
    .map(
      ([ability, bonus]) =>
        `${labels[ability as keyof typeof labels]} ${formatSignedNumber(
          bonus as number,
        )}`,
    )
    .join(", ");
};

const formatSenses = (senses?: MonsterSenses) => {
  if (!senses) {
    return undefined;
  }

  const parts: string[] = [];

  if (senses.blindsight !== undefined) {
    parts.push(`Blindsight ${senses.blindsight} ft.`);
  }

  if (senses.darkvision !== undefined) {
    parts.push(`Darkvision ${senses.darkvision} ft.`);
  }

  if (senses.tremorsense !== undefined) {
    parts.push(`Tremorsense ${senses.tremorsense} ft.`);
  }

  if (senses.truesight !== undefined) {
    parts.push(`Truesight ${senses.truesight} ft.`);
  }

  if (senses.passivePerception !== undefined) {
    parts.push(`Passive Perception ${senses.passivePerception}`);
  }

  if (senses.notes) {
    parts.push(senses.notes);
  }

  return parts.join(", ") || undefined;
};

const formatList = (values?: string[]) => {
  if (!values?.length) {
    return undefined;
  }

  return values.join(", ");
};

const monsterSubtitle = (monster: MonsterDefinition) =>
  [
    monster.size,
    monster.subtype ? `${monster.type} (${monster.subtype})` : monster.type,
    monster.alignment,
  ]
    .filter(Boolean)
    .join(" • ");

const StatBlockSection = ({
  title,
  entries,
  compact = false,
}: {
  title: string;
  entries?: MonsterTextEntry[];
  compact?: boolean;
}) => {
  if (!entries?.length) {
    return null;
  }

  return (
    <div className={compact ? "mt-3" : "mt-5"}>
      <h3
        className={`border-b border-white/10 pb-1 font-bold uppercase text-zinc-300 ${
          compact
            ? "text-[10px] tracking-[0.12em]"
            : "text-xs tracking-[0.14em]"
        }`}
      >
        {title}
      </h3>

      <div className={compact ? "mt-2 space-y-2" : "mt-2.5 space-y-2.5"}>
        {entries.map((entry, index) => (
          <p
            key={`${entry.name}-${index}`}
            className={
              compact
                ? "text-sm leading-5 text-zinc-300"
                : "text-sm leading-6 text-zinc-300"
            }
          >
            <span className="font-semibold italic text-white">
              {entry.name}.
            </span>{" "}
            {entry.text}
          </p>
        ))}
      </div>
    </div>
  );
};

function SourceBadge({
  source,
  compact = false,
}: {
  source: MonsterSource;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border font-semibold ${
        compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]"
      } ${
        source === "campaign"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-white/10 bg-white/5 text-zinc-300"
      }`}
    >
      {source === "campaign" ? "Campaign" : "Default"}
    </span>
  );
}

function MonsterImageModal({
  monster,
  onClose,
}: {
  monster: MonsterListItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!monster.img) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="relative flex max-h-[94vh] max-w-[94vw] flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-zinc-900 px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-white">
              {monster.name}
            </h2>

            <p className="truncate text-xs text-zinc-500">
              {monsterSubtitle(monster)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close image"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center bg-black">
          <img
            src={monster.img}
            alt={monster.name}
            className="max-h-[85vh] max-w-[92vw] object-contain"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function MonsterStatBlock({
  monster,
  compact = false,
}: {
  monster: MonsterListItem;
  compact?: boolean;
}) {
  const [imageOpen, setImageOpen] = useState(false);

  const abilities = [
    ["STR", monster.stats.str],
    ["DEX", monster.stats.dex],
    ["CON", monster.stats.con],
    ["INT", monster.stats.int],
    ["WIS", monster.stats.wis],
    ["CHA", monster.stats.cha],
  ] as const;

  const dividerClass = compact
    ? "my-2 h-px bg-rose-900/40"
    : "my-4 h-px bg-rose-900/40";

  const subtitle = monsterSubtitle(monster);
  const speed = formatSpeed(monster.speed);
  const savingThrows = formatSavingThrows(monster.savingThrows);
  const skills = formatSkills(monster.skills);
  const senses = formatSenses(monster.senses);
  const languages = formatList(monster.languages);
  const vulnerabilities = formatList(monster.damageVulnerabilities);
  const resistances = formatList(monster.damageResistances);
  const damageImmunities = formatList(monster.damageImmunities);
  const conditionImmunities = formatList(monster.conditionImmunities);
  const gear = formatList(monster.gear);
  const habitat = formatList(monster.habitat);
  const treasure = formatList(monster.treasure);

  return (
    <>
      <div
        className={
          compact
            ? "bg-zinc-950/40"
            : "overflow-hidden rounded-xl border border-white/10 bg-zinc-950/40"
        }
      >
        {!compact && monster.img ? (
          <button
            type="button"
            onClick={() => setImageOpen(true)}
            className="group block aspect-[2.15/1] w-full overflow-hidden border-b border-white/10 bg-black/30"
            title="View larger image"
          >
            <img
              src={monster.img}
              alt={monster.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]"
            />
          </button>
        ) : null}

        <div className={compact ? "p-3" : "p-4 sm:p-5"}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  className={`min-w-0 font-bold text-white ${
                    compact ? "text-base" : "text-2xl"
                  }`}
                >
                  {monster.name}
                </h2>

                {compact && monster.source === "campaign" ? (
                  <SourceBadge source={monster.source} compact />
                ) : null}
              </div>

              <p
                className={`italic text-zinc-400 ${
                  compact ? "mt-0.5 text-xs leading-4" : "mt-1 text-xs"
                }`}
              >
                {subtitle}
              </p>
            </div>

            {compact && monster.img ? (
              <button
                type="button"
                onClick={() => setImageOpen(true)}
                title={`View ${monster.name} image`}
                className="workspace-no-drag group h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30 transition hover:border-white/25"
              >
                <img
                  src={monster.img}
                  alt={monster.name}
                  className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                />
              </button>
            ) : !compact ? (
              <SourceBadge source={monster.source} />
            ) : null}
          </div>

          <div className={dividerClass} />

          {compact ? (
            <div className="grid grid-cols-3 gap-1">
              <div className="min-w-0 rounded-md border border-white/10 bg-black/20 px-1.5 py-1">
                <div className="text-[9px] font-bold uppercase tracking-wide text-zinc-300">
                  AC
                </div>

                <div className="text-sm font-semibold text-white">
                  {monster.armorClass}
                </div>

                {monster.armorClassNotes ? (
                  <div
                    className="truncate text-[9px] text-zinc-500"
                    title={monster.armorClassNotes}
                  >
                    {monster.armorClassNotes}
                  </div>
                ) : null}
              </div>

              <div className="min-w-0 rounded-md border border-white/10 bg-black/20 px-1.5 py-1">
                <div className="text-[9px] font-bold uppercase tracking-wide text-zinc-300">
                  HP
                </div>

                <div className="text-sm font-semibold text-white">
                  {monster.hp}
                </div>

                {monster.hitDice ? (
                  <div
                    className="truncate text-[9px] text-zinc-500"
                    title={monster.hitDice}
                  >
                    {monster.hitDice}
                  </div>
                ) : null}
              </div>

              <div className="min-w-0 rounded-md border border-white/10 bg-black/20 px-1.5 py-1">
                <div className="text-[9px] font-bold uppercase tracking-wide text-zinc-300">
                  Speed
                </div>

                <div
                  className="truncate text-xs font-semibold text-white"
                  title={speed}
                >
                  {speed}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-sm text-zinc-300">
              <p>
                <span className="font-semibold text-zinc-300">Armor Class</span>{" "}
                {monster.armorClass}
                {monster.armorClassNotes ? ` (${monster.armorClassNotes})` : ""}
              </p>

              <p>
                <span className="font-semibold text-zinc-300">Hit Points</span>{" "}
                {monster.hp}
                {monster.hitDice ? ` (${monster.hitDice})` : ""}
              </p>

              {monster.initiative ? (
                <p>
                  <span className="font-semibold text-zinc-300">
                    Initiative
                  </span>{" "}
                  {formatSignedNumber(monster.initiative.modifier)}
                  {monster.initiative.score !== undefined
                    ? ` (${monster.initiative.score})`
                    : ""}
                </p>
              ) : null}

              <p>
                <span className="font-semibold text-zinc-300">Speed</span>{" "}
                {speed}
              </p>
            </div>
          )}

          <div className={dividerClass} />

          <div
            className={
              compact
                ? "grid grid-cols-3 gap-1"
                : "grid grid-cols-3 gap-2 sm:grid-cols-6"
            }
          >
            {abilities.map(([label, score]) => (
              <div
                key={label}
                className={`min-w-0 border border-white/10 bg-black/20 text-center ${
                  compact ? "rounded-md px-1 py-1" : "rounded-lg px-2 py-2"
                }`}
              >
                <div
                  className={`font-bold text-zinc-300 ${
                    compact ? "text-[9px]" : "text-xs"
                  }`}
                >
                  {label}
                </div>

                <div
                  className={`whitespace-nowrap font-semibold text-white ${
                    compact ? "mt-0.5 text-[11px]" : "mt-1 text-sm"
                  }`}
                >
                  {score}{" "}
                  <span className="text-zinc-400">
                    ({abilityModifier(score)})
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={dividerClass} />

          <div
            className={
              compact
                ? "space-y-0.5 break-words text-xs leading-5 text-zinc-300"
                : "space-y-1 text-sm leading-5 text-zinc-300"
            }
          >
            {savingThrows ? (
              <p>
                <span className="font-semibold text-zinc-300">
                  Saving Throws
                </span>{" "}
                {savingThrows}
              </p>
            ) : null}

            {skills ? (
              <p>
                <span className="font-semibold text-zinc-300">Skills</span>{" "}
                {skills}
              </p>
            ) : null}

            {vulnerabilities ? (
              <p>
                <span className="font-semibold text-zinc-300">
                  Damage Vulnerabilities
                </span>{" "}
                {vulnerabilities}
              </p>
            ) : null}

            {resistances ? (
              <p>
                <span className="font-semibold text-zinc-300">
                  Damage Resistances
                </span>{" "}
                {resistances}
              </p>
            ) : null}

            {damageImmunities ? (
              <p>
                <span className="font-semibold text-zinc-300">
                  Damage Immunities
                </span>{" "}
                {damageImmunities}
              </p>
            ) : null}

            {conditionImmunities ? (
              <p>
                <span className="font-semibold text-zinc-300">
                  Condition Immunities
                </span>{" "}
                {conditionImmunities}
              </p>
            ) : null}

            {senses ? (
              <p>
                <span className="font-semibold text-zinc-300">Senses</span>{" "}
                {senses}
              </p>
            ) : null}

            {languages ? (
              <p>
                <span className="font-semibold text-zinc-300">Languages</span>{" "}
                {languages}
              </p>
            ) : null}

            <p>
              <span className="font-semibold text-zinc-300">Challenge</span>{" "}
              {monster.challengeRating} ({monster.xp.toLocaleString()} XP)
            </p>

            {monster.proficiencyBonus !== undefined ? (
              <p>
                <span className="font-semibold text-zinc-300">
                  Proficiency Bonus
                </span>{" "}
                {formatSignedNumber(monster.proficiencyBonus)}
              </p>
            ) : null}

            {gear ? (
              <p>
                <span className="font-semibold text-zinc-300">Gear</span> {gear}
              </p>
            ) : null}

            {habitat ? (
              <p>
                <span className="font-semibold text-zinc-300">Habitat</span>{" "}
                {habitat}
              </p>
            ) : null}

            {treasure ? (
              <p>
                <span className="font-semibold text-zinc-300">Treasure</span>{" "}
                {treasure}
              </p>
            ) : null}
          </div>

          <StatBlockSection
            title="Traits"
            entries={monster.traits}
            compact={compact}
          />

          <StatBlockSection
            title="Actions"
            entries={monster.actions}
            compact={compact}
          />

          <StatBlockSection
            title="Bonus Actions"
            entries={monster.bonusActions}
            compact={compact}
          />

          <StatBlockSection
            title="Reactions"
            entries={monster.reactions}
            compact={compact}
          />

          <StatBlockSection
            title="Legendary Actions"
            entries={monster.legendaryActions}
            compact={compact}
          />

          <StatBlockSection
            title="Lair Actions"
            entries={monster.lairActions}
            compact={compact}
          />
        </div>
      </div>

      {imageOpen ? (
        <MonsterImageModal
          monster={monster}
          onClose={() => setImageOpen(false)}
        />
      ) : null}
    </>
  );
}
