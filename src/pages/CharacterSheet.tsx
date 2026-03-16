import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  backgroundsById,
  classesById,
  originFeatsById,
  speciesById,
} from "../rulesets/dnd/dnd2024/helpers";
import type { AbilityKey, SkillId } from "../rulesets/dnd/dnd2024/types";

type CharacterDoc = {
  ownerUid: string;
  campaignId: string | null;

  name: string;
  level: number;

  classId: string;
  speciesId: string;
  backgroundId: string;
  originFeatId: string | null;

  abilityScores: Record<AbilityKey, number>;

  alignment?: string;
  notes?: string;

  choices?: {
    backgroundAbilityBonuses?: {
      plus2: AbilityKey;
      plus1: AbilityKey;
    };
    classSkillChoices?: SkillId[];
    rogueExpertiseChoices?: Array<SkillId | "thieves-tools">;
  };

  derived?: {
    stats?: {
      proficiencyBonus?: number;
      maxHp?: number;
      currentHp?: number;
      armorClass?: number;
      speed?: number;
      initiativeBonus?: number;
      passivePerception?: number;
    };
    skillProficiencies?: SkillId[];
    savingThrowProficiencies?: AbilityKey[];
    toolProficiencies?: string[];
    languages?: string[];
    expertise?: Array<SkillId | "thieves-tools">;
  };

  // legacy / fallback fields
  maxHp?: number;
  currentHp?: number;
  armorClass?: number;
  speed?: number;
  proficiencyBonus?: number;
  initiativeBonus?: number;
  skillProficiencies?: string[];
  toolProficiencies?: string[];
  savingThrowProficiencies?: string[];
  languages?: string[];

  spells?: Array<{
    id: string;
    name: string;
    level?: number;
    school?: string;
    prepared?: boolean;
  }>;

  equipment?: Array<{
    id: string;
    name: string;
    quantity: number;
    equipped?: boolean;
  }>;
};

const abilityLabels: Record<AbilityKey, string> = {
  str: "STR",
  dex: "DEX",
  con: "CON",
  int: "INT",
  wis: "WIS",
  cha: "CHA",
};

const abilityFullLabels: Record<AbilityKey, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

const skillAbilityMap: Record<SkillId, AbilityKey> = {
  acrobatics: "dex",
  "animal-handling": "wis",
  arcana: "int",
  athletics: "str",
  deception: "cha",
  history: "int",
  insight: "wis",
  intimidation: "cha",
  investigation: "int",
  medicine: "wis",
  nature: "int",
  perception: "wis",
  performance: "cha",
  persuasion: "cha",
  religion: "int",
  "sleight-of-hand": "dex",
  stealth: "dex",
  survival: "wis",
};

const allSkills: SkillId[] = [
  "acrobatics",
  "animal-handling",
  "arcana",
  "athletics",
  "deception",
  "history",
  "insight",
  "intimidation",
  "investigation",
  "medicine",
  "nature",
  "perception",
  "performance",
  "persuasion",
  "religion",
  "sleight-of-hand",
  "stealth",
  "survival",
];

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getAbilityModifier = (score: number) => Math.floor((score - 10) / 2);

const applyBackgroundBonuses = (
  abilityScores: Record<AbilityKey, number>,
  bonuses:
    | {
        plus2: AbilityKey;
        plus1: AbilityKey;
      }
    | undefined,
  allowedOptions: AbilityKey[],
) => {
  const nextScores = { ...abilityScores };

  if (!bonuses) return nextScores;

  const { plus2, plus1 } = bonuses;

  if (allowedOptions.includes(plus2)) {
    nextScores[plus2] += 2;
  }

  if (allowedOptions.includes(plus1) && plus1 !== plus2) {
    nextScores[plus1] += 1;
  }

  return nextScores;
};

const formatModifier = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);

const unique = <T,>(values: T[]) => [...new Set(values)];

const StatCard = ({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string | number;
  subValue?: string;
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      {subValue && <p className="mt-1 text-sm text-zinc-400">{subValue}</p>}
    </div>
  );
};

const SectionCard = ({
  title,
  children,
  right,
}: {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-white sm:text-2xl">
          {title}
        </h2>
        {right}
      </div>
      {children}
    </section>
  );
};

const CharacterSheet = () => {
  const { characterId } = useParams();
  const { user } = useAuth();

  const [character, setCharacter] = useState<CharacterDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCharacter = async () => {
      if (!characterId) {
        setError("Missing character ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const snap = await getDoc(doc(db, "characters", characterId));

        if (!snap.exists()) {
          setError("Character not found.");
          setCharacter(null);
          setLoading(false);
          return;
        }

        const data = snap.data() as CharacterDoc;

        if (user && data.ownerUid !== user.uid) {
          setError("You do not have access to this character.");
          setCharacter(null);
          setLoading(false);
          return;
        }

        setCharacter(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load character.");
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [characterId, user]);

  const derived = useMemo(() => {
    if (!character) return null;

    const background = backgroundsById[character.backgroundId];
    const classDef = classesById[character.classId];

    const finalAbilityScores = applyBackgroundBonuses(
      character.abilityScores,
      character.choices?.backgroundAbilityBonuses,
      background?.abilityOptions ?? [],
    );

    const proficiencyBonus =
      character.derived?.stats?.proficiencyBonus ??
      character.proficiencyBonus ??
      2 + Math.floor((character.level - 1) / 4);

    const dexMod = getAbilityModifier(finalAbilityScores.dex);
    const wisMod = getAbilityModifier(finalAbilityScores.wis);
    const conMod = getAbilityModifier(finalAbilityScores.con);

    const fallbackSkillProficiencies = unique<SkillId>([
      ...(background?.skillProficiencies ?? []),
      ...(character.choices?.classSkillChoices ?? []),
    ]);

    const skillProficiencies = unique<SkillId>([
      ...(character.derived?.skillProficiencies ?? []),
      ...((character.skillProficiencies as SkillId[] | undefined) ?? []),
      ...fallbackSkillProficiencies,
    ]);

    const expertise = unique<SkillId | "thieves-tools">([
      ...(character.derived?.expertise ?? []),
      ...(character.choices?.rogueExpertiseChoices ?? []),
    ]);

    const savingThrowProficiencies = unique<AbilityKey>([
      ...(character.derived?.savingThrowProficiencies ?? []),
      ...((character.savingThrowProficiencies as AbilityKey[] | undefined) ??
        []),
      ...(classDef?.savingThrowProficiencies ?? []),
    ]);

    const skillRows = allSkills.map((skill) => {
      const ability = skillAbilityMap[skill];
      const baseMod = getAbilityModifier(finalAbilityScores[ability]);
      const proficient = skillProficiencies.includes(skill);
      const expertiseApplies = expertise.includes(skill);

      const total =
        baseMod +
        (proficient ? proficiencyBonus : 0) +
        (expertiseApplies ? proficiencyBonus : 0);

      return {
        id: skill,
        name: formatLabel(skill),
        ability,
        proficient,
        expertise: expertiseApplies,
        total,
      };
    });

    const saveRows = (Object.keys(abilityLabels) as AbilityKey[]).map(
      (ability) => {
        const baseMod = getAbilityModifier(finalAbilityScores[ability]);
        const proficient = savingThrowProficiencies.includes(ability);
        const total = baseMod + (proficient ? proficiencyBonus : 0);

        return {
          id: ability,
          name: abilityFullLabels[ability],
          proficient,
          total,
        };
      },
    );

    const computedMaxHp =
      classDef && character.level >= 1
        ? classDef.hitDie +
          conMod +
          (character.level - 1) * (Math.floor(classDef.hitDie / 2) + 1 + conMod)
        : 0;

    return {
      className: classDef?.name ?? character.classId,
      speciesName:
        speciesById[character.speciesId]?.name ?? character.speciesId,
      backgroundName: background?.name ?? character.backgroundId,
      featName: character.originFeatId
        ? (originFeatsById[character.originFeatId]?.name ??
          character.originFeatId)
        : null,
      proficiencyBonus,
      initiativeBonus:
        character.derived?.stats?.initiativeBonus ??
        character.initiativeBonus ??
        dexMod,
      passivePerception:
        character.derived?.stats?.passivePerception ?? 10 + wisMod,
      armorClass:
        character.derived?.stats?.armorClass ??
        character.armorClass ??
        10 + dexMod,
      speed: character.derived?.stats?.speed ?? character.speed ?? 30,
      currentHp:
        character.derived?.stats?.currentHp ??
        character.currentHp ??
        character.derived?.stats?.maxHp ??
        character.maxHp ??
        computedMaxHp,
      maxHp:
        character.derived?.stats?.maxHp ?? character.maxHp ?? computedMaxHp,
      finalAbilityScores,
      skillRows,
      saveRows,
      skillProficiencies,
      savingThrowProficiencies,
      toolProficiencies:
        character.derived?.toolProficiencies ??
        (character.toolProficiencies as string[] | undefined) ??
        (background?.toolProficiency ? [background.toolProficiency] : []),
      languages:
        character.derived?.languages ??
        character.languages ??
        speciesById[character.speciesId]?.languages ??
        [],
    };
  }, [character]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-zinc-400">Loading character...</p>
        </div>
      </div>
    );
  }

  if (error || !character || !derived) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            {error || "Something went wrong."}
          </div>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 shadow-2xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Character Sheet
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {character.name}
              </h1>

              <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
                {derived.speciesName} • {derived.className} • Level{" "}
                {character.level}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                  Background: {derived.backgroundName}
                </span>

                {derived.featName && (
                  <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                    Origin Feat: {derived.featName}
                  </span>
                )}

                {character.alignment && (
                  <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                    {character.alignment}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back home
              </Link>

              <Link
                to={`/characters/${characterId}/edit`}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Edit character
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <StatCard
            label="HP"
            value={`${derived.currentHp}/${derived.maxHp}`}
            subValue="Current / Max"
          />
          <StatCard label="AC" value={derived.armorClass} />
          <StatCard
            label="Initiative"
            value={formatModifier(derived.initiativeBonus)}
          />
          <StatCard label="Speed" value={`${derived.speed} ft`} />
          <StatCard
            label="Prof Bonus"
            value={formatModifier(derived.proficiencyBonus)}
          />
          <StatCard
            label="Passive Perception"
            value={derived.passivePerception}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <SectionCard title="Ability Scores">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(Object.keys(derived.finalAbilityScores) as AbilityKey[]).map(
                  (key) => {
                    const score = derived.finalAbilityScores[key];
                    const mod = getAbilityModifier(score);
                    const baseScore = character.abilityScores[key];
                    const bonus = score - baseScore;

                    return (
                      <div
                        key={key}
                        className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                          {abilityLabels[key]}
                        </p>
                        <div className="mt-3 flex items-end justify-between">
                          <p className="text-3xl font-bold text-white">
                            {score}
                          </p>
                          <p className="text-lg font-semibold text-zinc-300">
                            {formatModifier(mod)}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-zinc-500">
                          Base {baseScore}
                          {bonus > 0 ? ` • +${bonus} background` : ""}
                        </p>
                      </div>
                    );
                  },
                )}
              </div>
            </SectionCard>

            <SectionCard title="Skills">
              <div className="grid gap-2">
                {derived.skillRows.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-white">{skill.name}</p>
                        <span className="rounded-full border border-white/10 bg-zinc-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                          {abilityLabels[skill.ability]}
                        </span>
                        {skill.proficient && (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                            Proficient
                          </span>
                        )}
                        {skill.expertise && (
                          <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-blue-300">
                            Expertise
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="ml-4 text-sm font-semibold text-zinc-200">
                      {formatModifier(skill.total)}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Saving Throws">
              <div className="grid gap-3 sm:grid-cols-2">
                {derived.saveRows.map((save) => (
                  <div
                    key={save.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-white">{save.name}</p>
                      {save.proficient && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                          Proficient
                        </span>
                      )}
                    </div>

                    <p className="ml-4 text-sm font-semibold text-zinc-200">
                      {formatModifier(save.total)}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Proficiencies">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-zinc-200">Skills</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {derived.skillProficiencies.length > 0 ? (
                      derived.skillProficiencies.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                        >
                          {formatLabel(skill)}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">None</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-200">Tools</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {derived.toolProficiencies.length > 0 ? (
                      derived.toolProficiencies.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                        >
                          {formatLabel(tool)}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">None</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-200">
                    Saving Throw Proficiencies
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {derived.savingThrowProficiencies.length > 0 ? (
                      derived.savingThrowProficiencies.map((save) => (
                        <span
                          key={save}
                          className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                        >
                          {abilityFullLabels[save]}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">None</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-200">
                    Languages
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {derived.languages.length > 0 ? (
                      derived.languages.map((language) => (
                        <span
                          key={language}
                          className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                        >
                          {formatLabel(language)}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">None</p>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Inventory">
              {character.equipment?.length ? (
                <div className="space-y-3">
                  {character.equipment.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                    >
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        {item.equipped && (
                          <p className="mt-1 text-xs text-zinc-500">Equipped</p>
                        )}
                      </div>
                      <p className="text-sm text-zinc-300">x{item.quantity}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No equipment added yet.</p>
              )}
            </SectionCard>

            <SectionCard title="Spells">
              {character.spells?.length ? (
                <div className="space-y-3">
                  {character.spells.map((spell) => (
                    <div
                      key={spell.id}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-white">{spell.name}</p>
                        <div className="flex items-center gap-2">
                          {typeof spell.level === "number" && (
                            <span className="rounded-full border border-white/10 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                              Level {spell.level}
                            </span>
                          )}
                          {spell.prepared && (
                            <span className="rounded-full border border-white/10 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                              Prepared
                            </span>
                          )}
                        </div>
                      </div>
                      {spell.school && (
                        <p className="mt-2 text-sm text-zinc-500">
                          {spell.school}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No spells added yet.</p>
              )}
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="Character Info">
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Species
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {derived.speciesName}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Class
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {derived.className}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Background
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {derived.backgroundName}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Origin Feat
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {derived.featName ?? "None"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Alignment
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {character.alignment || "—"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Campaign
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {character.campaignId || "Not assigned"}
                  </dd>
                </div>
              </dl>
            </SectionCard>

            <SectionCard title="Rules Notes">
              <p className="text-sm leading-6 text-zinc-300">
                Initiative uses your Dexterity modifier. Dexterity saving throw
                proficiency applies to Dexterity saves, not Initiative, unless a
                separate feature says otherwise.
              </p>
            </SectionCard>

            <SectionCard title="Notes">
              {character.notes ? (
                <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                  {character.notes}
                </p>
              ) : (
                <p className="text-sm text-zinc-500">No notes yet.</p>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
