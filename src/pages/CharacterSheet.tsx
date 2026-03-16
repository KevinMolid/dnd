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
import type { AbilityKey } from "../rulesets/dnd/dnd2024/types";

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

  // future-ready optional fields
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

const formatLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getAbilityModifier = (score: number) => Math.floor((score - 10) / 2);

const formatModifier = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);

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

    const dexMod = getAbilityModifier(character.abilityScores.dex);
    const wisMod = getAbilityModifier(character.abilityScores.wis);

    return {
      className: classesById[character.classId]?.name ?? character.classId,
      speciesName:
        speciesById[character.speciesId]?.name ?? character.speciesId,
      backgroundName:
        backgroundsById[character.backgroundId]?.name ?? character.backgroundId,
      featName: character.originFeatId
        ? (originFeatsById[character.originFeatId]?.name ??
          character.originFeatId)
        : null,
      proficiencyBonus:
        character.proficiencyBonus ?? 2 + Math.floor((character.level - 1) / 4),
      initiativeBonus: character.initiativeBonus ?? dexMod,
      passivePerception: 10 + wisMod,
      armorClass: character.armorClass ?? 10 + dexMod,
      speed: character.speed ?? 30,
      currentHp: character.currentHp ?? character.maxHp ?? 0,
      maxHp: character.maxHp ?? 0,
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
                {(Object.keys(character.abilityScores) as AbilityKey[]).map(
                  (key) => {
                    const score = character.abilityScores[key];
                    const mod = getAbilityModifier(score);

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
                      </div>
                    );
                  },
                )}
              </div>
            </SectionCard>

            <SectionCard title="Proficiencies">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-zinc-200">Skills</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(character.skillProficiencies?.length
                      ? character.skillProficiencies
                      : (backgroundsById[character.backgroundId]
                          ?.skillProficiencies ?? [])
                    ).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                      >
                        {formatLabel(skill)}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-200">Tools</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(character.toolProficiencies?.length
                      ? character.toolProficiencies
                      : [
                          backgroundsById[character.backgroundId]
                            ?.toolProficiency,
                        ].filter(Boolean)
                    ).map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                      >
                        {formatLabel(tool)}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-200">
                    Saving Throw Proficiencies
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {character.savingThrowProficiencies?.length ? (
                      character.savingThrowProficiencies.map((save) => (
                        <span
                          key={save}
                          className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                        >
                          {formatLabel(save)}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">Not added yet.</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-200">
                    Languages
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {character.languages?.length ? (
                      character.languages.map((language) => (
                        <span
                          key={language}
                          className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200"
                        >
                          {language}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">Not added yet.</p>
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
