import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import Container from "../components/Container";
import H1 from "../components/H1";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  monsters,
  monsterTypes,
  type MonsterDefinition,
  type MonsterTextEntry,
  type MonsterType,
} from "../data/monsterCatalog";

import MonsterStatBlock, {
  type MonsterListItem,
} from "../components/monsters/MonsterStatBlock";

type CampaignMonster = MonsterDefinition & {
  campaignId?: string;
  source: "campaign";
  basedOnMonsterId?: string;
  createdByUid?: string;
};

type MonsterFormState = {
  name: string;
  type: MonsterType;
  description: string;
  img: string;

  armorClass: string;
  armorClassNotes: string;
  hp: string;
  speed: string;

  str: string;
  dex: string;
  con: string;
  int: string;
  wis: string;
  cha: string;

  skills: string;
  senses: string;
  language: string;

  challengeRating: string;
  xp: string;

  traits: string;
  actions: string;
  bonusActions: string;
  reactions: string;
};

const inputClass =
  "rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500 focus:border-emerald-500/40";

const textAreaClass =
  "rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none placeholder:text-zinc-500 focus:border-emerald-500/40";

const emptyForm = (): MonsterFormState => ({
  name: "",
  type: "Humanoid",
  description: "",
  img: "",

  armorClass: "10",
  armorClassNotes: "",
  hp: "1",
  speed: "30",

  str: "10",
  dex: "10",
  con: "10",
  int: "10",
  wis: "10",
  cha: "10",

  skills: "",
  senses: "",
  language: "",

  challengeRating: "0",
  xp: "0",

  traits: "",
  actions: "",
  bonusActions: "",
  reactions: "",
});

const entriesToText = (entries?: MonsterTextEntry[]) =>
  (entries ?? []).map((entry) => `${entry.name} :: ${entry.text}`).join("\n");

const textToEntries = (value: string): MonsterTextEntry[] | undefined => {
  const entries = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const divider = line.indexOf("::");

      if (divider === -1) {
        return {
          name: line,
          text: "",
        };
      }

      return {
        name: line.slice(0, divider).trim(),
        text: line.slice(divider + 2).trim(),
      };
    })
    .filter((entry) => entry.name);

  return entries.length > 0 ? entries : undefined;
};

const monsterToForm = (monster: MonsterDefinition): MonsterFormState => ({
  name: monster.name,
  type: monster.type,
  description: monster.description,
  img: monster.img ?? "",

  armorClass: String(monster.armorClass),
  armorClassNotes: monster.armorClassNotes ?? "",
  hp: String(monster.hp),
  speed: String(monster.speed),

  str: String(monster.stats.str),
  dex: String(monster.stats.dex),
  con: String(monster.stats.con),
  int: String(monster.stats.int),
  wis: String(monster.stats.wis),
  cha: String(monster.stats.cha),

  skills: monster.skills ?? "",
  senses: monster.senses ?? "",
  language: monster.language ?? "",

  challengeRating: monster.challengeRating,
  xp: String(monster.xp),

  traits: entriesToText(monster.traits),
  actions: entriesToText(monster.actions),
  bonusActions: entriesToText(monster.bonusActions),
  reactions: entriesToText(monster.reactions),
});

const crToNumber = (cr: string) => {
  if (cr.includes("/")) {
    const [numerator, denominator] = cr.split("/").map(Number);

    if (denominator) {
      return numerator / denominator;
    }
  }

  const numeric = Number(cr);

  return Number.isFinite(numeric) ? numeric : 999;
};

export default function MonstersPage() {
  const { campaignId } = useParams<{ campaignId: string }>();

  const { user } = useAuth();

  const [campaignMonsters, setCampaignMonsters] = useState<CampaignMonster[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [sourceFilter, setSourceFilter] = useState<
    "all" | "default" | "campaign"
  >("all");

  const [typeFilter, setTypeFilter] = useState<"all" | MonsterType>("all");

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [createMode, setCreateMode] = useState<"scratch" | "copy">("scratch");

  const [editingMonsterId, setEditingMonsterId] = useState<string | null>(null);

  const [copySearch, setCopySearch] = useState("");

  const [basedOnMonsterId, setBasedOnMonsterId] = useState<
    string | undefined
  >();

  const [form, setForm] = useState<MonsterFormState>(emptyForm());

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) {
      return;
    }

    const monstersRef = collection(db, "campaigns", campaignId, "monsters");

    const q = query(monstersRef, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next: CampaignMonster[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<CampaignMonster, "id">;

          return {
            id: docSnap.id,
            ...data,
            source: "campaign" as const,
          };
        });

        setCampaignMonsters(next);
        setLoading(false);
      },
      (snapshotError) => {
        console.error(snapshotError);

        setError("Failed to load campaign monsters.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [campaignId]);

  const allMonsters = useMemo<MonsterListItem[]>(() => {
    const defaults: MonsterListItem[] = monsters.map((monster) => ({
      ...monster,
      source: "default",
    }));

    return [...defaults, ...campaignMonsters].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      }),
    );
  }, [campaignMonsters]);

  const filteredMonsters = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return allMonsters.filter((monster) => {
      if (sourceFilter !== "all" && monster.source !== sourceFilter) {
        return false;
      }

      if (typeFilter !== "all" && monster.type !== typeFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        monster.name,
        monster.type,
        monster.description,
        monster.challengeRating,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [allMonsters, search, sourceFilter, typeFilter]);

  const selectedMonster = useMemo(() => {
    if (!selectedKey) {
      return null;
    }

    return (
      allMonsters.find(
        (monster) => `${monster.source}:${monster.id}` === selectedKey,
      ) ?? null
    );
  }, [allMonsters, selectedKey]);

  const copyCandidates = useMemo(() => {
    const value = copySearch.trim().toLowerCase();

    if (!value) {
      return allMonsters.slice(0, 20);
    }

    return allMonsters
      .filter((monster) =>
        [monster.name, monster.type, monster.challengeRating]
          .join(" ")
          .toLowerCase()
          .includes(value),
      )
      .slice(0, 20);
  }, [allMonsters, copySearch]);

  const updateField = (key: keyof MonsterFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const beginCreate = () => {
    setShowCreateForm(true);
    setEditingMonsterId(null);
    setCreateMode("scratch");
    setBasedOnMonsterId(undefined);
    setCopySearch("");
    setForm(emptyForm());
    setError(null);
  };

  const selectCopySource = (monster: MonsterListItem) => {
    setForm(monsterToForm(monster));
    setBasedOnMonsterId(monster.id);
    setCopySearch(monster.name);
  };

  const beginEdit = (monster: MonsterListItem) => {
    if (monster.source !== "campaign") {
      return;
    }

    setEditingMonsterId(monster.id);
    setShowCreateForm(true);
    setCreateMode("scratch");

    setBasedOnMonsterId(monster.basedOnMonsterId);

    setCopySearch("");
    setForm(monsterToForm(monster));
    setError(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelCreate = () => {
    setShowCreateForm(false);
    setEditingMonsterId(null);
    setForm(emptyForm());
    setBasedOnMonsterId(undefined);
    setCopySearch("");
    setError(null);
  };

  const parseRequiredNumber = (value: string, label: string) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      throw new Error(`${label} must be a number.`);
    }

    return parsed;
  };

  const handleSaveMonster = async () => {
    if (!campaignId || !user) {
      return;
    }

    const name = form.name.trim();

    if (!name) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const speedValue = form.speed.trim();

      const numericSpeed = Number(speedValue);

      const speed: number | string =
        speedValue !== "" && Number.isFinite(numericSpeed)
          ? numericSpeed
          : speedValue || 30;

      const monsterCore: Omit<MonsterDefinition, "id"> = {
        name,
        type: form.type,
        description: form.description.trim(),
        img: form.img.trim(),

        armorClass: parseRequiredNumber(form.armorClass, "Armor Class"),

        armorClassNotes: form.armorClassNotes.trim(),

        hp: parseRequiredNumber(form.hp, "Hit Points"),

        speed,

        stats: {
          str: parseRequiredNumber(form.str, "STR"),
          dex: parseRequiredNumber(form.dex, "DEX"),
          con: parseRequiredNumber(form.con, "CON"),
          int: parseRequiredNumber(form.int, "INT"),
          wis: parseRequiredNumber(form.wis, "WIS"),
          cha: parseRequiredNumber(form.cha, "CHA"),
        },

        skills: form.skills.trim(),
        senses: form.senses.trim(),
        language: form.language.trim(),

        challengeRating: form.challengeRating.trim() || "0",

        xp: parseRequiredNumber(form.xp, "XP"),

        traits: textToEntries(form.traits) ?? [],

        actions: textToEntries(form.actions) ?? [],

        bonusActions: textToEntries(form.bonusActions) ?? [],

        reactions: textToEntries(form.reactions) ?? [],
      };

      /*
       * EDIT EXISTING CAMPAIGN MONSTER
       */
      if (editingMonsterId) {
        const monsterRef = doc(
          db,
          "campaigns",
          campaignId,
          "monsters",
          editingMonsterId,
        );

        await updateDoc(monsterRef, {
          ...monsterCore,

          basedOnMonsterId: basedOnMonsterId ?? null,

          updatedAt: serverTimestamp(),
        });

        /*
         * Optimistic local update.
         * The Firestore listener will later
         * reconcile this with the server.
         */
        setCampaignMonsters((prev) =>
          prev.map((monster) =>
            monster.id === editingMonsterId
              ? {
                  ...monster,
                  ...monsterCore,
                  basedOnMonsterId,
                }
              : monster,
          ),
        );

        setSelectedKey(`campaign:${editingMonsterId}`);

        cancelCreate();

        return;
      }

      /*
       * CREATE NEW CAMPAIGN MONSTER
       */
      const docRef = await addDoc(
        collection(db, "campaigns", campaignId, "monsters"),
        {
          campaignId,
          source: "campaign",

          basedOnMonsterId: basedOnMonsterId ?? null,

          ...monsterCore,

          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),

          createdByUid: user.uid,
        },
      );

      /*
       * Add it immediately to local state.
       * No refresh required.
       */
      const optimisticMonster: CampaignMonster = {
        id: docRef.id,
        campaignId,

        source: "campaign",

        basedOnMonsterId,
        createdByUid: user.uid,

        ...monsterCore,
      };

      setCampaignMonsters((prev) => {
        /*
         * onSnapshot may theoretically update
         * before this line executes, so avoid
         * creating a duplicate.
         */
        if (prev.some((monster) => monster.id === docRef.id)) {
          return prev;
        }

        return [...prev, optimisticMonster];
      });

      setSelectedKey(`campaign:${docRef.id}`);

      cancelCreate();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : editingMonsterId
            ? "Failed to update monster."
            : "Failed to create monster.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2">
            <Link
              to={campaignId ? `/campaigns/${campaignId}` : "/campaigns"}
              className="text-sm text-zinc-400 hover:text-white"
            >
              ← Back to campaign
            </Link>
          </div>

          <H1>Monsters</H1>

          <p className="mt-2 text-sm text-zinc-400">
            Browse the default monster catalog and monsters created for this
            campaign.
          </p>
        </div>

        <button
          type="button"
          onClick={showCreateForm ? cancelCreate : beginCreate}
          className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
        >
          {showCreateForm ? "Close" : "Create Monster"}
        </button>
      </div>

      {showCreateForm ? (
        <section className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {editingMonsterId ? "Edit Monster" : "New Monster"}
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                {editingMonsterId
                  ? "Update this campaign-specific monster."
                  : "Create a monster from scratch or copy an existing stat block and tweak it."}
              </p>
            </div>

            {!editingMonsterId ? (
              <div className="flex rounded-xl border border-white/10 bg-black/20 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setCreateMode("scratch");
                    setBasedOnMonsterId(undefined);
                    setCopySearch("");
                    setForm(emptyForm());
                  }}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    createMode === "scratch"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  From scratch
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCreateMode("copy");
                    setBasedOnMonsterId(undefined);
                    setCopySearch("");
                    setForm(emptyForm());
                  }}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    createMode === "copy"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Copy existing
                </button>
              </div>
            ) : null}
          </div>

          {createMode === "copy" && !editingMonsterId ? (
            <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-emerald-200">
                  Choose monster to copy
                </span>

                <input
                  value={copySearch}
                  onChange={(e) => setCopySearch(e.target.value)}
                  className={inputClass}
                  placeholder="Search by name, type or CR..."
                />
              </label>

              <div className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-black/20">
                {copyCandidates.map((monster) => (
                  <button
                    key={`${monster.source}:${monster.id}`}
                    type="button"
                    onClick={() => selectCopySource(monster)}
                    className={`flex w-full items-center justify-between gap-3 border-b border-white/5 px-3 py-2 text-left last:border-b-0 hover:bg-white/5 ${
                      basedOnMonsterId === monster.id ? "bg-emerald-500/10" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {monster.name}
                      </p>

                      <p className="text-xs text-zinc-500">
                        {monster.type} · CR {monster.challengeRating}
                      </p>
                    </div>

                    <span className="text-xs text-zinc-500">
                      {monster.source === "campaign" ? "Campaign" : "Default"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                Identity
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Name *
                  </span>

                  <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={inputClass}
                    placeholder="Fog Crawler"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Type
                  </span>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      updateField("type", e.target.value as MonsterType)
                    }
                    className={inputClass}
                  >
                    {monsterTypes.map((type) => (
                      <option key={type} value={type} className="bg-zinc-900">
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Description
                  </span>

                  <input
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className={inputClass}
                    placeholder="Medium Monstrosity, Unaligned"
                  />
                </label>

                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Image URL / path
                  </span>

                  <input
                    value={form.img}
                    onChange={(e) => updateField("img", e.target.value)}
                    className={inputClass}
                    placeholder="/Monsters/FogCrawler.png or https://..."
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                Core Stats
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">AC</span>

                  <input
                    value={form.armorClass}
                    onChange={(e) => updateField("armorClass", e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-2 lg:col-span-2">
                  <span className="text-sm text-zinc-300">AC Notes</span>

                  <input
                    value={form.armorClassNotes}
                    onChange={(e) =>
                      updateField("armorClassNotes", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Natural Armor"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">HP</span>

                  <input
                    value={form.hp}
                    onChange={(e) => updateField("hp", e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">Speed</span>

                  <input
                    value={form.speed}
                    onChange={(e) => updateField("speed", e.target.value)}
                    className={inputClass}
                    placeholder="30 or 30 ft., fly 40 ft."
                  />
                </label>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {(["str", "dex", "con", "int", "wis", "cha"] as const).map(
                  (ability) => (
                    <label key={ability} className="flex flex-col gap-2">
                      <span className="text-center text-xs font-semibold uppercase text-zinc-400">
                        {ability}
                      </span>

                      <input
                        value={form[ability]}
                        onChange={(e) => updateField(ability, e.target.value)}
                        className={`${inputClass} text-center`}
                      />
                    </label>
                  ),
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                Details
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">Skills</span>

                  <input
                    value={form.skills}
                    onChange={(e) => updateField("skills", e.target.value)}
                    className={inputClass}
                    placeholder="Perception +3, Stealth +4"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">Senses</span>

                  <input
                    value={form.senses}
                    onChange={(e) => updateField("senses", e.target.value)}
                    className={inputClass}
                    placeholder="Darkvision 60 ft., passive Perception 13"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">Languages</span>

                  <input
                    value={form.language}
                    onChange={(e) => updateField("language", e.target.value)}
                    className={inputClass}
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm text-zinc-300">CR</span>

                    <input
                      value={form.challengeRating}
                      onChange={(e) =>
                        updateField("challengeRating", e.target.value)
                      }
                      className={inputClass}
                      placeholder="1/4"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm text-zinc-300">XP</span>

                    <input
                      value={form.xp}
                      onChange={(e) => updateField("xp", e.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-white">
                Features
              </h3>

              <p className="mb-4 text-xs text-zinc-500">
                One feature per line using: Name :: Description
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {(
                  [
                    ["traits", "Traits"],
                    ["actions", "Actions"],
                    ["bonusActions", "Bonus Actions"],
                    ["reactions", "Reactions"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-zinc-300">
                      {label}
                    </span>

                    <textarea
                      value={form[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      rows={7}
                      className={textAreaClass}
                      placeholder={`Pack Tactics :: The monster has advantage...\nBite :: Melee Weapon Attack: +4 to hit...`}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSaveMonster}
              disabled={saving}
              className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? editingMonsterId
                  ? "Saving..."
                  : "Creating..."
                : editingMonsterId
                  ? "Save Changes"
                  : "Save Monster"}
            </button>

            <button
              type="button"
              onClick={cancelCreate}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={inputClass}
              placeholder="Search monsters..."
            />

            <select
              value={sourceFilter}
              onChange={(e) =>
                setSourceFilter(
                  e.target.value as "all" | "default" | "campaign",
                )
              }
              className={inputClass}
            >
              <option value="all" className="bg-zinc-900">
                All sources
              </option>

              <option value="default" className="bg-zinc-900">
                Default
              </option>

              <option value="campaign" className="bg-zinc-900">
                Campaign
              </option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as "all" | MonsterType)
              }
              className={inputClass}
            >
              <option value="all" className="bg-zinc-900">
                All types
              </option>

              {monsterTypes.map((type) => (
                <option key={type} value={type} className="bg-zinc-900">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
            <span>{filteredMonsters.length} monsters</span>

            <span>{campaignMonsters.length} campaign-specific</span>
          </div>

          <div className="mt-4 max-h-[70vh] overflow-y-auto rounded-2xl border border-white/10 bg-black/10">
            {loading ? (
              <p className="p-5 text-sm text-zinc-400">Loading monsters...</p>
            ) : filteredMonsters.length === 0 ? (
              <p className="p-5 text-sm text-zinc-400">
                No monsters match the current filters.
              </p>
            ) : (
              [...filteredMonsters]
                .sort((a, b) => {
                  const nameCompare = a.name.localeCompare(b.name, undefined, {
                    sensitivity: "base",
                  });

                  return (
                    nameCompare ||
                    crToNumber(a.challengeRating) -
                      crToNumber(b.challengeRating)
                  );
                })
                .map((monster) => {
                  const key = `${monster.source}:${monster.id}`;

                  const selected = key === selectedKey;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedKey(key)}
                      className={`flex w-full items-center gap-3 border-b border-white/5 p-3 text-left transition last:border-b-0 ${
                        selected ? "bg-emerald-500/10" : "hover:bg-white/5"
                      }`}
                    >
                      {monster.img ? (
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                          <img
                            src={monster.img}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-lg text-zinc-600">
                          ?
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-sm font-semibold text-white">
                            {monster.name}
                          </h2>

                          {monster.source === "campaign" ? (
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                              Campaign
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-1 truncate text-xs text-zinc-500">
                          {monster.type} · CR {monster.challengeRating} ·{" "}
                          {monster.hp} HP · AC {monster.armorClass}
                        </p>
                      </div>
                    </button>
                  );
                })
            )}
          </div>
        </section>

        <section>
          {selectedMonster ? (
            <>
              <div className="mb-3 flex flex-wrap justify-end gap-2">
                {selectedMonster.source === "campaign" ? (
                  <button
                    type="button"
                    onClick={() => beginEdit(selectedMonster)}
                    className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
                  >
                    Edit Monster
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    setEditingMonsterId(null);

                    setShowCreateForm(true);

                    setCreateMode("copy");

                    selectCopySource(selectedMonster);

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Create Copy
                </button>
              </div>

              <MonsterStatBlock monster={selectedMonster} />
            </>
          ) : (
            <div className="flex min-h-72 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
              <div>
                <p className="font-semibold text-white">Select a monster</p>

                <p className="mt-2 text-sm text-zinc-500">
                  Click a monster in the list to view its stat block.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}
