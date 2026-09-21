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

import {
  monsters,
  monsterTypes,
  type MonsterDefinition,
  type MonsterTextEntry,
  type MonsterType,
} from "../features/monsters/catalog/monsterCatalog";

import Container from "../components/Container";
import H1 from "../components/H1";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

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
  subtype: string;
  size: MonsterDefinition["size"];
  alignment: string;
  img: string;

  armorClass: string;
  armorClassNotes: string;
  hp: string;
  hitDice: string;

  initiativeModifier: string;
  initiativeScore: string;

  walkSpeed: string;
  burrowSpeed: string;
  climbSpeed: string;
  flySpeed: string;
  swimSpeed: string;
  hover: boolean;
  speedNotes: string;

  str: string;
  dex: string;
  con: string;
  int: string;
  wis: string;
  cha: string;

  savingThrows: string;
  skills: string;

  damageVulnerabilities: string;
  damageResistances: string;
  damageImmunities: string;
  conditionImmunities: string;

  senses: string;
  languages: string;

  challengeRating: string;
  xp: string;
  proficiencyBonus: string;

  gear: string;
  habitat: string;
  treasure: string;

  traits: string;
  actions: string;
  bonusActions: string;
  reactions: string;
  legendaryActions: string;
  lairActions: string;
};

const inputClass =
  "rounded-lg border border-white/10 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 hover:border-white/15 focus:border-emerald-500/40 focus:bg-zinc-950";

const textAreaClass =
  "rounded-lg border border-white/10 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 hover:border-white/15 focus:border-emerald-500/40 focus:bg-zinc-950";

const emptyForm = (): MonsterFormState => ({
  name: "",
  type: "Humanoid",
  subtype: "",
  size: "Medium",
  alignment: "",
  img: "",

  armorClass: "10",
  armorClassNotes: "",
  hp: "1",
  hitDice: "",

  initiativeModifier: "0",
  initiativeScore: "10",

  walkSpeed: "30",
  burrowSpeed: "",
  climbSpeed: "",
  flySpeed: "",
  swimSpeed: "",
  hover: false,
  speedNotes: "",

  str: "10",
  dex: "10",
  con: "10",
  int: "10",
  wis: "10",
  cha: "10",

  savingThrows: "",
  skills: "",

  damageVulnerabilities: "",
  damageResistances: "",
  damageImmunities: "",
  conditionImmunities: "",

  senses: "",
  languages: "",

  challengeRating: "0",
  xp: "0",
  proficiencyBonus: "2",

  gear: "",
  habitat: "",
  treasure: "",

  traits: "",
  actions: "",
  bonusActions: "",
  reactions: "",
  legendaryActions: "",
  lairActions: "",
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

const listToText = (values?: string[]) => (values ?? []).join(", ");

const textToList = (value: string): string[] | undefined => {
  const values = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return values.length > 0 ? values : undefined;
};

const bonusesToText = (values?: Record<string, number>) =>
  values
    ? Object.entries(values)
        .map(([name, bonus]) => `${name} ${bonus >= 0 ? "+" : ""}${bonus}`)
        .join(", ")
    : "";

const textToBonuses = (value: string): Record<string, number> | undefined => {
  const result: Record<string, number> = {};

  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      const match = item.match(/^(.+?)\s+([+-]?\d+)$/);

      if (match) {
        result[match[1].trim()] = Number(match[2]);
      }
    });

  return Object.keys(result).length > 0 ? result : undefined;
};

const sensesToText = (senses?: MonsterDefinition["senses"]) => {
  if (!senses) return "";

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

  return parts.join(", ");
};

const textToSenses = (
  value: string,
): MonsterDefinition["senses"] | undefined => {
  const raw = value.trim();

  if (!raw) return undefined;

  const senses: NonNullable<MonsterDefinition["senses"]> = {};

  const readDistance = (label: string) => {
    const match = raw.match(new RegExp(`${label}\\s+(\\d+)\\s*ft\\.?`, "i"));
    return match ? Number(match[1]) : undefined;
  };

  senses.blindsight = readDistance("Blindsight");
  senses.darkvision = readDistance("Darkvision");
  senses.tremorsense = readDistance("Tremorsense");
  senses.truesight = readDistance("Truesight");

  const passive = raw.match(/passive perception\s+(\d+)/i);
  if (passive) {
    senses.passivePerception = Number(passive[1]);
  }

  const knownParts = [
    /Blindsight\s+\d+\s*ft\.?/gi,
    /Darkvision\s+\d+\s*ft\.?/gi,
    /Tremorsense\s+\d+\s*ft\.?/gi,
    /Truesight\s+\d+\s*ft\.?/gi,
    /Passive Perception\s+\d+/gi,
  ];

  let notes = raw;
  knownParts.forEach((pattern) => {
    notes = notes.replace(pattern, "");
  });

  notes = notes
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");

  if (notes) {
    senses.notes = notes;
  }

  return senses;
};

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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const finiteNumber = (value: unknown, fallback: number) => {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
};

const optionalFiniteNumber = (value: unknown) => {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;

  return Number.isFinite(parsed) ? parsed : undefined;
};

const stringArray = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    const values = value.map((item) => String(item).trim()).filter(Boolean);

    return values.length ? values : undefined;
  }

  if (typeof value === "string") {
    const values = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item && item !== "-");

    return values.length ? values : undefined;
  }

  return undefined;
};

const bonusRecord = (value: unknown): Record<string, number> | undefined => {
  if (isRecord(value)) {
    const entries = Object.entries(value)
      .map(([key, bonus]) => [key, optionalFiniteNumber(bonus)] as const)
      .filter(
        (entry): entry is readonly [string, number] => entry[1] !== undefined,
      );

    return entries.length ? Object.fromEntries(entries) : undefined;
  }

  return typeof value === "string" ? textToBonuses(value) : undefined;
};

const textEntries = (value: unknown): MonsterTextEntry[] | undefined => {
  if (!Array.isArray(value)) {
    return typeof value === "string" ? textToEntries(value) : undefined;
  }

  const entries = value
    .filter(isRecord)
    .map((entry) => ({
      name: typeof entry.name === "string" ? entry.name.trim() : "",
      text: typeof entry.text === "string" ? entry.text : "",
    }))
    .filter((entry) => entry.name);

  return entries.length ? entries : undefined;
};

const parseLegacyDescription = (description: unknown) => {
  if (typeof description !== "string") {
    return {};
  }

  const trimmed = description.trim();
  const sizeMatch = trimmed.match(
    /^(Tiny|Small|Medium|Large|Huge|Gargantuan)\b/i,
  );
  const subtypeMatch = trimmed.match(/\(([^)]+)\)/);
  const commaIndex = trimmed.indexOf(",");

  return {
    size: sizeMatch
      ? `${sizeMatch[1][0].toUpperCase()}${sizeMatch[1].slice(1).toLowerCase()}`
      : undefined,
    subtype: subtypeMatch?.[1]?.trim() || undefined,
    alignment:
      commaIndex >= 0
        ? trimmed.slice(commaIndex + 1).trim() || undefined
        : undefined,
  };
};

const normalizeSpeed = (value: unknown): MonsterDefinition["speed"] => {
  if (isRecord(value)) {
    const speed: MonsterDefinition["speed"] = {};

    const walk = optionalFiniteNumber(value.walk);
    const burrow = optionalFiniteNumber(value.burrow);
    const climb = optionalFiniteNumber(value.climb);
    const fly = optionalFiniteNumber(value.fly);
    const swim = optionalFiniteNumber(value.swim);

    if (walk !== undefined) speed.walk = walk;
    if (burrow !== undefined) speed.burrow = burrow;
    if (climb !== undefined) speed.climb = climb;
    if (fly !== undefined) speed.fly = fly;
    if (swim !== undefined) speed.swim = swim;
    if (value.hover === true) speed.hover = true;
    if (typeof value.notes === "string" && value.notes.trim()) {
      speed.notes = value.notes.trim();
    }

    return speed;
  }

  if (typeof value === "number") {
    return { walk: value };
  }

  if (typeof value === "string") {
    const raw = value.trim();

    if (!raw) return {};

    const speed: MonsterDefinition["speed"] = {};
    const read = (label: string) => {
      const match = raw.match(
        new RegExp(`${label}\\s*(\\d+)\\s*ft\\\\.?`, "i"),
      );
      return match ? Number(match[1]) : undefined;
    };

    const bare = raw.match(/^(\d+)(?:\s*ft\.?)?$/i);
    const walk = read("(?:walk|speed)") ?? (bare ? Number(bare[1]) : undefined);

    if (walk !== undefined) speed.walk = walk;

    const burrow = read("burrow");
    const climb = read("climb");
    const fly = read("fly");
    const swim = read("swim");

    if (burrow !== undefined) speed.burrow = burrow;
    if (climb !== undefined) speed.climb = climb;
    if (fly !== undefined) speed.fly = fly;
    if (swim !== undefined) speed.swim = swim;
    if (/\bhover\b/i.test(raw)) speed.hover = true;

    if (Object.keys(speed).length === 0) {
      speed.notes = raw;
    }

    return speed;
  }

  return {};
};

const normalizeSenses = (
  value: unknown,
): MonsterDefinition["senses"] | undefined => {
  if (isRecord(value)) {
    const senses: NonNullable<MonsterDefinition["senses"]> = {};

    const blindsight = optionalFiniteNumber(value.blindsight);
    const darkvision = optionalFiniteNumber(value.darkvision);
    const tremorsense = optionalFiniteNumber(value.tremorsense);
    const truesight = optionalFiniteNumber(value.truesight);
    const passivePerception = optionalFiniteNumber(value.passivePerception);

    if (blindsight !== undefined) senses.blindsight = blindsight;
    if (darkvision !== undefined) senses.darkvision = darkvision;
    if (tremorsense !== undefined) senses.tremorsense = tremorsense;
    if (truesight !== undefined) senses.truesight = truesight;
    if (passivePerception !== undefined) {
      senses.passivePerception = passivePerception;
    }
    if (typeof value.notes === "string" && value.notes.trim()) {
      senses.notes = value.notes.trim();
    }

    return Object.keys(senses).length ? senses : undefined;
  }

  return typeof value === "string" ? textToSenses(value) : undefined;
};

const proficiencyBonusFromCr = (cr: string) => {
  const numeric = crToNumber(cr);

  if (numeric <= 4) return 2;
  if (numeric <= 8) return 3;
  if (numeric <= 12) return 4;
  if (numeric <= 16) return 5;
  if (numeric <= 20) return 6;
  if (numeric <= 24) return 7;
  if (numeric <= 28) return 8;
  return 9;
};

const normalizeCampaignMonster = (
  id: string,
  raw: Record<string, unknown>,
): CampaignMonster => {
  const legacyIdentity = parseLegacyDescription(raw.description);

  const rawStats = isRecord(raw.stats) ? raw.stats : {};
  const stats = {
    str: finiteNumber(rawStats.str, 10),
    dex: finiteNumber(rawStats.dex, 10),
    con: finiteNumber(rawStats.con, 10),
    int: finiteNumber(rawStats.int, 10),
    wis: finiteNumber(rawStats.wis, 10),
    cha: finiteNumber(rawStats.cha, 10),
  };

  const challengeRating =
    typeof raw.challengeRating === "string"
      ? raw.challengeRating
      : String(raw.challengeRating ?? "0");

  const initiativeRecord = isRecord(raw.initiative) ? raw.initiative : null;
  const dexModifier = Math.floor((stats.dex - 10) / 2);

  const sizeCandidate =
    typeof raw.size === "string" ? raw.size : legacyIdentity.size;

  const validSizes = new Set([
    "Tiny",
    "Small",
    "Medium",
    "Large",
    "Huge",
    "Gargantuan",
  ]);

  const size = validSizes.has(String(sizeCandidate))
    ? (sizeCandidate as MonsterDefinition["size"])
    : "Medium";

  const languages = stringArray(raw.languages) ?? stringArray(raw.language);

  const monster: CampaignMonster = {
    id,
    source: "campaign",
    name:
      typeof raw.name === "string" && raw.name.trim()
        ? raw.name.trim()
        : "Unnamed Monster",
    type:
      typeof raw.type === "string" &&
      (monsterTypes as readonly string[]).includes(raw.type)
        ? (raw.type as MonsterType)
        : "Monstrosity",
    size,
    armorClass: finiteNumber(raw.armorClass, 10),
    hp: finiteNumber(raw.hp, 1),
    initiative: {
      modifier: initiativeRecord
        ? finiteNumber(initiativeRecord.modifier, dexModifier)
        : dexModifier,
      score: initiativeRecord
        ? finiteNumber(initiativeRecord.score, 10 + dexModifier)
        : 10 + dexModifier,
    },
    speed: normalizeSpeed(raw.speed),
    stats,
    challengeRating,
    xp: finiteNumber(raw.xp, 0),
  };

  const subtype =
    typeof raw.subtype === "string" && raw.subtype.trim()
      ? raw.subtype.trim()
      : legacyIdentity.subtype;
  if (subtype) monster.subtype = subtype;

  const alignment =
    typeof raw.alignment === "string" && raw.alignment.trim()
      ? raw.alignment.trim()
      : legacyIdentity.alignment;
  if (alignment) monster.alignment = alignment;

  if (typeof raw.img === "string" && raw.img.trim()) {
    monster.img = raw.img.trim();
  }

  if (typeof raw.armorClassNotes === "string" && raw.armorClassNotes.trim()) {
    monster.armorClassNotes = raw.armorClassNotes.trim();
  }

  if (typeof raw.hitDice === "string" && raw.hitDice.trim()) {
    monster.hitDice = raw.hitDice.trim();
  }

  const savingThrows = bonusRecord(raw.savingThrows);
  if (savingThrows) {
    monster.savingThrows = {
      str: savingThrows.str,
      dex: savingThrows.dex,
      con: savingThrows.con,
      int: savingThrows.int,
      wis: savingThrows.wis,
      cha: savingThrows.cha,
    };
  }

  const skills = bonusRecord(raw.skills);
  if (skills) monster.skills = skills;

  const vulnerabilities = stringArray(raw.damageVulnerabilities);
  if (vulnerabilities) monster.damageVulnerabilities = vulnerabilities;

  const resistances =
    stringArray(raw.damageResistances) ?? stringArray(raw.damageResistance);
  if (resistances) monster.damageResistances = resistances;

  const damageImmunities = stringArray(raw.damageImmunities);
  if (damageImmunities) monster.damageImmunities = damageImmunities;

  const conditionImmunities = stringArray(raw.conditionImmunities);
  if (conditionImmunities) monster.conditionImmunities = conditionImmunities;

  const senses = normalizeSenses(raw.senses);
  if (senses) monster.senses = senses;

  if (languages) monster.languages = languages;

  const proficiencyBonus = optionalFiniteNumber(raw.proficiencyBonus);
  monster.proficiencyBonus =
    proficiencyBonus ?? proficiencyBonusFromCr(challengeRating);

  const gear = stringArray(raw.gear);
  if (gear) monster.gear = gear;

  const habitat = stringArray(raw.habitat);
  if (habitat) monster.habitat = habitat;

  const treasure = stringArray(raw.treasure);
  if (treasure) monster.treasure = treasure;

  const traits = textEntries(raw.traits);
  if (traits) monster.traits = traits;

  const actions = textEntries(raw.actions);
  if (actions) monster.actions = actions;

  const bonusActions = textEntries(raw.bonusActions);
  if (bonusActions) monster.bonusActions = bonusActions;

  const reactions = textEntries(raw.reactions);
  if (reactions) monster.reactions = reactions;

  const legendaryActions = textEntries(raw.legendaryActions);
  if (legendaryActions) monster.legendaryActions = legendaryActions;

  const lairActions = textEntries(raw.lairActions);
  if (lairActions) monster.lairActions = lairActions;

  if (typeof raw.campaignId === "string") monster.campaignId = raw.campaignId;
  if (typeof raw.basedOnMonsterId === "string") {
    monster.basedOnMonsterId = raw.basedOnMonsterId;
  }
  if (typeof raw.createdByUid === "string") {
    monster.createdByUid = raw.createdByUid;
  }

  return monster;
};

const removeUndefined = <T,>(value: T): T => {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => removeUndefined(item)) as T;
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, removeUndefined(item)]),
    ) as T;
  }

  return value;
};

const monsterToForm = (monster: MonsterDefinition): MonsterFormState => ({
  name: monster.name,
  type: monster.type,
  subtype: monster.subtype ?? "",
  size: monster.size,
  alignment: monster.alignment ?? "",
  img: monster.img ?? "",

  armorClass: String(monster.armorClass),
  armorClassNotes: monster.armorClassNotes ?? "",
  hp: String(monster.hp),
  hitDice: monster.hitDice ?? "",

  initiativeModifier: String(monster.initiative?.modifier ?? 0),
  initiativeScore: String(monster.initiative?.score ?? 10),

  walkSpeed: monster.speed.walk !== undefined ? String(monster.speed.walk) : "",
  burrowSpeed:
    monster.speed.burrow !== undefined ? String(monster.speed.burrow) : "",
  climbSpeed:
    monster.speed.climb !== undefined ? String(monster.speed.climb) : "",
  flySpeed: monster.speed.fly !== undefined ? String(monster.speed.fly) : "",
  swimSpeed: monster.speed.swim !== undefined ? String(monster.speed.swim) : "",
  hover: monster.speed.hover ?? false,
  speedNotes: monster.speed.notes ?? "",

  str: String(monster.stats.str),
  dex: String(monster.stats.dex),
  con: String(monster.stats.con),
  int: String(monster.stats.int),
  wis: String(monster.stats.wis),
  cha: String(monster.stats.cha),

  savingThrows: bonusesToText(monster.savingThrows),
  skills: bonusesToText(monster.skills),

  damageVulnerabilities: listToText(monster.damageVulnerabilities),
  damageResistances: listToText(monster.damageResistances),
  damageImmunities: listToText(monster.damageImmunities),
  conditionImmunities: listToText(monster.conditionImmunities),

  senses: sensesToText(monster.senses),
  languages: listToText(monster.languages),

  challengeRating: monster.challengeRating,
  xp: String(monster.xp),
  proficiencyBonus: String(monster.proficiencyBonus ?? 2),

  gear: listToText(monster.gear),
  habitat: listToText(monster.habitat),
  treasure: listToText(monster.treasure),

  traits: entriesToText(monster.traits),
  actions: entriesToText(monster.actions),
  bonusActions: entriesToText(monster.bonusActions),
  reactions: entriesToText(monster.reactions),
  legendaryActions: entriesToText(monster.legendaryActions),
  lairActions: entriesToText(monster.lairActions),
});

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

  const [minCrFilter, setMinCrFilter] = useState("all");
  const [maxCrFilter, setMaxCrFilter] = useState("all");
  const [sortMode, setSortMode] = useState<"name-asc" | "cr-asc" | "cr-desc">(
    "name-asc",
  );

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
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [warningSaveArmed, setWarningSaveArmed] = useState(false);

  useEffect(() => {
    if (!campaignId) {
      return;
    }

    const monstersRef = collection(db, "campaigns", campaignId, "monsters");

    const q = query(monstersRef, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next: CampaignMonster[] = snapshot.docs.map((docSnap) =>
          normalizeCampaignMonster(
            docSnap.id,
            docSnap.data() as Record<string, unknown>,
          ),
        );

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

  const crOptions = useMemo(() => {
    const standardCrs = [
      "0",
      "1/8",
      "1/4",
      "1/2",
      ...Array.from({ length: 30 }, (_, index) => String(index + 1)),
    ];

    const availableCrs = new Set(
      allMonsters.map((monster) => monster.challengeRating),
    );

    return standardCrs.filter((cr) => availableCrs.has(cr));
  }, [allMonsters]);

  const hasActiveFilters =
    search.trim() !== "" ||
    sourceFilter !== "all" ||
    typeFilter !== "all" ||
    minCrFilter !== "all" ||
    maxCrFilter !== "all" ||
    sortMode !== "name-asc";

  const filteredMonsters = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return allMonsters.filter((monster) => {
      if (sourceFilter !== "all" && monster.source !== sourceFilter) {
        return false;
      }

      if (typeFilter !== "all" && monster.type !== typeFilter) {
        return false;
      }

      const monsterCr = crToNumber(monster.challengeRating);

      if (minCrFilter !== "all" && monsterCr < crToNumber(minCrFilter)) {
        return false;
      }

      if (maxCrFilter !== "all" && monsterCr > crToNumber(maxCrFilter)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        monster.name,
        monster.type,
        monster.subtype,
        monster.size,
        monster.alignment,
        monster.challengeRating,
        ...(monster.habitat ?? []),
        ...(monster.languages ?? []),
        ...(monster.damageVulnerabilities ?? []),
        ...(monster.damageResistances ?? []),
        ...(monster.damageImmunities ?? []),
        ...(monster.conditionImmunities ?? []),
        ...Object.keys(monster.skills ?? {}),
        ...(monster.traits ?? []).flatMap((entry) => [entry.name, entry.text]),
        ...(monster.actions ?? []).flatMap((entry) => [entry.name, entry.text]),
        ...(monster.bonusActions ?? []).flatMap((entry) => [
          entry.name,
          entry.text,
        ]),
        ...(monster.reactions ?? []).flatMap((entry) => [
          entry.name,
          entry.text,
        ]),
        ...(monster.legendaryActions ?? []).flatMap((entry) => [
          entry.name,
          entry.text,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [allMonsters, search, sourceFilter, typeFilter, minCrFilter, maxCrFilter]);

  const sortedMonsters = useMemo(() => {
    return [...filteredMonsters].sort((a, b) => {
      const nameCompare = a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      });
      const crCompare =
        crToNumber(a.challengeRating) - crToNumber(b.challengeRating);

      if (sortMode === "cr-asc") {
        return crCompare || nameCompare;
      }

      if (sortMode === "cr-desc") {
        return -crCompare || nameCompare;
      }

      return nameCompare || crCompare;
    });
  }, [filteredMonsters, sortMode]);

  const clearFilters = () => {
    setSearch("");
    setSourceFilter("all");
    setTypeFilter("all");
    setMinCrFilter("all");
    setMaxCrFilter("all");
    setSortMode("name-asc");
  };

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

  const updateField = <K extends keyof MonsterFormState>(
    key: K,
    value: MonsterFormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setWarningSaveArmed(false);
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
    setValidationWarnings([]);
    setWarningSaveArmed(false);
  };

  const parseRequiredNumber = (value: string, label: string) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      throw new Error(`${label} must be a number.`);
    }

    return parsed;
  };

  const validateMonsterForm = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const readNumber = (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return undefined;
      const parsed = Number(trimmed);
      return Number.isFinite(parsed) ? parsed : undefined;
    };

    const requireRange = (
      value: string,
      label: string,
      min: number,
      max: number,
    ) => {
      const parsed = readNumber(value);
      if (parsed === undefined) {
        errors.push(`${label} must be a number.`);
      } else if (parsed < min || parsed > max) {
        errors.push(`${label} must be between ${min} and ${max}.`);
      }
    };

    const optionalNonNegative = (value: string, label: string) => {
      if (!value.trim()) return;
      const parsed = readNumber(value);
      if (parsed === undefined) {
        errors.push(`${label} must be a number.`);
      } else if (parsed < 0) {
        errors.push(`${label} cannot be negative.`);
      }
    };

    if (!form.name.trim()) errors.push("Name is required.");

    requireRange(form.armorClass, "Armor Class", 0, 1000);
    requireRange(form.hp, "Hit Points", 1, 10000);

    (
      [
        ["STR", form.str],
        ["DEX", form.dex],
        ["CON", form.con],
        ["INT", form.int],
        ["WIS", form.wis],
        ["CHA", form.cha],
      ] as const
    ).forEach(([label, value]) => requireRange(value, label, 1, 30));

    (
      [
        ["Walk Speed", form.walkSpeed],
        ["Burrow Speed", form.burrowSpeed],
        ["Climb Speed", form.climbSpeed],
        ["Fly Speed", form.flySpeed],
        ["Swim Speed", form.swimSpeed],
      ] as const
    ).forEach(([label, value]) => optionalNonNegative(value, label));

    const initiativeModifier = readNumber(form.initiativeModifier);
    if (initiativeModifier === undefined) {
      errors.push("Initiative Modifier must be a number.");
    } else if (initiativeModifier < -20 || initiativeModifier > 30) {
      warnings.push(`Initiative modifier ${initiativeModifier} is unusual.`);
    }

    const initiativeScore = readNumber(form.initiativeScore);
    if (form.initiativeScore.trim() && initiativeScore === undefined) {
      errors.push("Initiative Score must be a number.");
    } else if (
      initiativeScore !== undefined &&
      (initiativeScore < 0 || initiativeScore > 50)
    ) {
      warnings.push(`Initiative score ${initiativeScore} is unusual.`);
    }

    const xp = readNumber(form.xp);
    if (xp === undefined) errors.push("XP must be a number.");
    else if (xp < 0) errors.push("XP cannot be negative.");

    const proficiencyBonus = readNumber(form.proficiencyBonus);
    if (form.proficiencyBonus.trim() && proficiencyBonus === undefined) {
      errors.push("Proficiency Bonus must be a number.");
    } else if (
      proficiencyBonus !== undefined &&
      (proficiencyBonus < 2 || proficiencyBonus > 9)
    ) {
      warnings.push(
        `Proficiency Bonus ${proficiencyBonus >= 0 ? "+" : ""}${proficiencyBonus} is outside the normal monster range (+2 to +9).`,
      );
    }

    const cr = form.challengeRating.trim();
    if (!/^(0|1\/8|1\/4|1\/2|[1-9]|[12]\d|30)$/.test(cr)) {
      errors.push(
        "Challenge Rating must be 0, 1/8, 1/4, 1/2, or a whole number from 1 to 30.",
      );
    }

    const commonAlignments = new Set([
      "lawful good",
      "neutral good",
      "chaotic good",
      "lawful neutral",
      "neutral",
      "chaotic neutral",
      "lawful evil",
      "neutral evil",
      "chaotic evil",
      "unaligned",
      "any alignment",
      "typically lawful good",
      "typically neutral good",
      "typically chaotic good",
      "typically lawful neutral",
      "typically neutral",
      "typically chaotic neutral",
      "typically lawful evil",
      "typically neutral evil",
      "typically chaotic evil",
    ]);

    const alignment = form.alignment.trim();
    if (alignment && !commonAlignments.has(alignment.toLowerCase())) {
      warnings.push(
        `"${alignment}" does not look like a standard D&D alignment. Check that legacy descriptive text was not migrated into Alignment.`,
      );
    }

    const ac = readNumber(form.armorClass);
    if (ac !== undefined && ac > 30) {
      warnings.push(
        `Armor Class ${ac} is exceptionally high. Check for a migrated value such as 115 instead of 15.`,
      );
    }

    const hp = readNumber(form.hp);
    if (hp !== undefined && hp > 1000) {
      warnings.push(`Hit Points ${hp} is exceptionally high.`);
    }

    const movement = [
      form.walkSpeed,
      form.burrowSpeed,
      form.climbSpeed,
      form.flySpeed,
      form.swimSpeed,
    ]
      .map(readNumber)
      .filter((value): value is number => value !== undefined);

    if (movement.some((value) => value > 200)) {
      warnings.push("One or more movement speeds exceed 200 ft.");
    }

    return { errors, warnings };
  };

  const handleSaveMonster = async () => {
    if (!campaignId || !user) {
      return;
    }

    const name = form.name.trim();
    const validation = validateMonsterForm();

    setValidationWarnings(validation.warnings);

    if (validation.errors.length > 0) {
      setWarningSaveArmed(false);
      setError(validation.errors.join(" "));
      return;
    }

    // Warnings require an explicit second click. The first click only
    // displays the warnings and pauses the save.
    if (validation.warnings.length > 0 && !warningSaveArmed) {
      setWarningSaveArmed(true);
      setError(null);
      return;
    }

    setWarningSaveArmed(false);
    setSaving(true);
    setError(null);

    try {
      const optionalNumber = (value: string, label: string) => {
        const trimmed = value.trim();

        if (!trimmed) {
          return undefined;
        }

        return parseRequiredNumber(trimmed, label);
      };

      const speed: MonsterDefinition["speed"] = {
        walk: optionalNumber(form.walkSpeed, "Walk Speed"),
        burrow: optionalNumber(form.burrowSpeed, "Burrow Speed"),
        climb: optionalNumber(form.climbSpeed, "Climb Speed"),
        fly: optionalNumber(form.flySpeed, "Fly Speed"),
        swim: optionalNumber(form.swimSpeed, "Swim Speed"),
        hover: form.hover || undefined,
        notes: form.speedNotes.trim() || undefined,
      };

      const savingThrowsRaw = textToBonuses(form.savingThrows);
      const savingThrows: MonsterDefinition["savingThrows"] = savingThrowsRaw
        ? {
            str: savingThrowsRaw.str,
            dex: savingThrowsRaw.dex,
            con: savingThrowsRaw.con,
            int: savingThrowsRaw.int,
            wis: savingThrowsRaw.wis,
            cha: savingThrowsRaw.cha,
          }
        : undefined;

      const rawMonsterCore: Omit<MonsterDefinition, "id"> = {
        name,
        type: form.type,
        subtype: form.subtype.trim() || undefined,
        size: form.size,
        alignment: form.alignment.trim() || undefined,
        img: form.img.trim() || undefined,

        armorClass: parseRequiredNumber(form.armorClass, "Armor Class"),
        armorClassNotes: form.armorClassNotes.trim() || undefined,
        hp: parseRequiredNumber(form.hp, "Hit Points"),
        hitDice: form.hitDice.trim() || undefined,

        initiative: {
          modifier: parseRequiredNumber(
            form.initiativeModifier,
            "Initiative Modifier",
          ),
          score: optionalNumber(form.initiativeScore, "Initiative Score"),
        },

        speed,

        stats: {
          str: parseRequiredNumber(form.str, "STR"),
          dex: parseRequiredNumber(form.dex, "DEX"),
          con: parseRequiredNumber(form.con, "CON"),
          int: parseRequiredNumber(form.int, "INT"),
          wis: parseRequiredNumber(form.wis, "WIS"),
          cha: parseRequiredNumber(form.cha, "CHA"),
        },

        savingThrows,
        skills: textToBonuses(form.skills),

        damageVulnerabilities: textToList(form.damageVulnerabilities),
        damageResistances: textToList(form.damageResistances),
        damageImmunities: textToList(form.damageImmunities),
        conditionImmunities: textToList(form.conditionImmunities),

        senses: textToSenses(form.senses),
        languages: textToList(form.languages),

        challengeRating: form.challengeRating.trim() || "0",
        xp: parseRequiredNumber(form.xp, "XP"),
        proficiencyBonus: optionalNumber(
          form.proficiencyBonus,
          "Proficiency Bonus",
        ),

        gear: textToList(form.gear),
        habitat: textToList(form.habitat),
        treasure: textToList(form.treasure),

        traits: textToEntries(form.traits),
        actions: textToEntries(form.actions),
        bonusActions: textToEntries(form.bonusActions),
        reactions: textToEntries(form.reactions),
        legendaryActions: textToEntries(form.legendaryActions),
        lairActions: textToEntries(form.lairActions),
      };

      // Firestore rejects undefined anywhere in an object. Keep the React/domain
      // model ergonomic, then sanitize only at the persistence boundary.
      const monsterCore = removeUndefined(rawMonsterCore);

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
      <div className="mb-5">
        <Link
          to={campaignId ? `/campaigns/${campaignId}` : "/campaigns"}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-zinc-100"
        >
          <i className="fa-solid fa-arrow-left text-[10px]" />
          Back to campaign
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <H1>Monsters</H1>

            <p className="mt-1.5 text-sm text-zinc-500">
              Browse the monster catalog and campaign-specific creatures.
            </p>
          </div>

          <button
            type="button"
            onClick={showCreateForm ? cancelCreate : beginCreate}
            className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${
              showCreateForm
                ? "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
                : "border-emerald-500/30 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/20"
            }`}
          >
            <i
              className={`fa-solid ${
                showCreateForm ? "fa-xmark" : "fa-plus"
              } text-xs`}
            />
            {showCreateForm ? "Close" : "Create monster"}
          </button>
        </div>
      </div>

      {showCreateForm ? (
        <section className="mb-5 rounded-xl border border-white/10 bg-zinc-950/40 p-4">
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
            <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
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

              <div className="workspace-scrollbar mt-3 max-h-56 overflow-y-auto rounded-lg border border-white/10 bg-black/20">
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
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
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

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Size
                  </span>

                  <select
                    value={form.size}
                    onChange={(e) =>
                      updateField(
                        "size",
                        e.target.value as MonsterDefinition["size"],
                      )
                    }
                    className={inputClass}
                  >
                    {[
                      "Tiny",
                      "Small",
                      "Medium",
                      "Large",
                      "Huge",
                      "Gargantuan",
                    ].map((size) => (
                      <option key={size} value={size} className="bg-zinc-900">
                        {size}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Subtype
                  </span>

                  <input
                    value={form.subtype}
                    onChange={(e) => updateField("subtype", e.target.value)}
                    className={inputClass}
                    placeholder="Goblinoid, Shapechanger..."
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-300">
                    Alignment
                  </span>

                  <input
                    value={form.alignment}
                    onChange={(e) => updateField("alignment", e.target.value)}
                    className={inputClass}
                    placeholder="Neutral Evil"
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

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                Core Stats
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">AC</span>
                  <input
                    value={form.armorClass}
                    onChange={(e) => updateField("armorClass", e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-2">
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
                  <span className="text-sm text-zinc-300">Hit Dice</span>
                  <input
                    value={form.hitDice}
                    onChange={(e) => updateField("hitDice", e.target.value)}
                    className={inputClass}
                    placeholder="5d8 + 10"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">
                    Initiative Modifier
                  </span>
                  <input
                    value={form.initiativeModifier}
                    onChange={(e) =>
                      updateField("initiativeModifier", e.target.value)
                    }
                    className={inputClass}
                    placeholder="+2"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">
                    Initiative Score
                  </span>
                  <input
                    value={form.initiativeScore}
                    onChange={(e) =>
                      updateField("initiativeScore", e.target.value)
                    }
                    className={inputClass}
                    placeholder="12"
                  />
                </label>
              </div>

              <div className="mt-5">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Movement
                </h4>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {(
                    [
                      ["walkSpeed", "Walk"],
                      ["burrowSpeed", "Burrow"],
                      ["climbSpeed", "Climb"],
                      ["flySpeed", "Fly"],
                      ["swimSpeed", "Swim"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="flex flex-col gap-2">
                      <span className="text-sm text-zinc-300">{label}</span>
                      <input
                        value={form[key]}
                        onChange={(e) => updateField(key, e.target.value)}
                        className={inputClass}
                        placeholder="ft."
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-[auto_1fr]">
                  <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-300">
                    <input
                      type="checkbox"
                      checked={form.hover}
                      onChange={(e) => updateField("hover", e.target.checked)}
                    />
                    Hover
                  </label>

                  <input
                    value={form.speedNotes}
                    onChange={(e) => updateField("speedNotes", e.target.value)}
                    className={inputClass}
                    placeholder="Movement notes"
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
                Details
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">Saving Throws</span>
                  <input
                    value={form.savingThrows}
                    onChange={(e) =>
                      updateField("savingThrows", e.target.value)
                    }
                    className={inputClass}
                    placeholder="str +5, wis +3"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">Skills</span>
                  <input
                    value={form.skills}
                    onChange={(e) => updateField("skills", e.target.value)}
                    className={inputClass}
                    placeholder="Perception +3, Stealth +4"
                  />
                </label>

                {(
                  [
                    ["damageVulnerabilities", "Damage Vulnerabilities"],
                    ["damageResistances", "Damage Resistances"],
                    ["damageImmunities", "Damage Immunities"],
                    ["conditionImmunities", "Condition Immunities"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex flex-col gap-2">
                    <span className="text-sm text-zinc-300">{label}</span>
                    <input
                      value={form[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      className={inputClass}
                      placeholder="Comma-separated"
                    />
                  </label>
                ))}

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">Senses</span>
                  <input
                    value={form.senses}
                    onChange={(e) => updateField("senses", e.target.value)}
                    className={inputClass}
                    placeholder="Darkvision 60 ft., Passive Perception 13"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-zinc-300">Languages</span>
                  <input
                    value={form.languages}
                    onChange={(e) => updateField("languages", e.target.value)}
                    className={inputClass}
                    placeholder="Common, Goblin"
                  />
                </label>

                <div className="grid grid-cols-3 gap-3 md:col-span-2">
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

                  <label className="flex flex-col gap-2">
                    <span className="text-sm text-zinc-300">Prof. Bonus</span>
                    <input
                      value={form.proficiencyBonus}
                      onChange={(e) =>
                        updateField("proficiencyBonus", e.target.value)
                      }
                      className={inputClass}
                      placeholder="2"
                    />
                  </label>
                </div>

                {(
                  [
                    ["gear", "Gear"],
                    ["habitat", "Habitat"],
                    ["treasure", "Treasure"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex flex-col gap-2">
                    <span className="text-sm text-zinc-300">{label}</span>
                    <input
                      value={form[key]}
                      onChange={(e) => updateField(key, e.target.value)}
                      className={inputClass}
                      placeholder="Comma-separated"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
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
                    ["legendaryActions", "Legendary Actions"],
                    ["lairActions", "Lair Actions"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-zinc-300">
                      {label}
                    </span>

                    <textarea
                      value={form[key]}
                      spellCheck={false}
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

          {validationWarnings.length > 0 ? (
            <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-xs text-amber-200">
              <div className="mb-1 flex items-center gap-2 font-semibold">
                <i className="fa-solid fa-triangle-exclamation" />
                Review before saving
              </div>
              <ul className="list-disc space-y-0.5 pl-5 text-amber-200/80">
                {validationWarnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
              <p className="mt-2 border-t border-amber-500/15 pt-2 text-amber-100/90">
                {warningSaveArmed
                  ? "If these values are intentional, click Save anyway below."
                  : "Saving is paused until you review these warnings."}
              </p>
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-3 py-2 text-sm text-rose-300">
              {error}
            </div>
          ) : null}

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
                : warningSaveArmed
                  ? "Save anyway"
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

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(360px,0.82fr)_minmax(0,1.18fr)]">
        <section className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950/40">
          <div className="border-b border-white/10 p-3">
            <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto_auto]">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-600" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${inputClass} w-full pl-8`}
                  placeholder="Search name, habitat, traits, actions..."
                />
              </div>

              <select
                value={sourceFilter}
                onChange={(e) =>
                  setSourceFilter(
                    e.target.value as "all" | "default" | "campaign",
                  )
                }
                className={inputClass}
                aria-label="Filter by source"
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
                aria-label="Filter by creature type"
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

            <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-[auto_auto_minmax(150px,auto)_auto]">
              <select
                value={minCrFilter}
                onChange={(e) => setMinCrFilter(e.target.value)}
                className={inputClass}
                aria-label="Minimum challenge rating"
              >
                <option value="all" className="bg-zinc-900">
                  Min CR
                </option>
                {crOptions.map((cr) => (
                  <option key={cr} value={cr} className="bg-zinc-900">
                    CR {cr}
                  </option>
                ))}
              </select>

              <select
                value={maxCrFilter}
                onChange={(e) => setMaxCrFilter(e.target.value)}
                className={inputClass}
                aria-label="Maximum challenge rating"
              >
                <option value="all" className="bg-zinc-900">
                  Max CR
                </option>
                {crOptions.map((cr) => (
                  <option key={cr} value={cr} className="bg-zinc-900">
                    CR {cr}
                  </option>
                ))}
              </select>

              <select
                value={sortMode}
                onChange={(e) =>
                  setSortMode(
                    e.target.value as "name-asc" | "cr-asc" | "cr-desc",
                  )
                }
                className={inputClass}
                aria-label="Sort monsters"
              >
                <option value="name-asc" className="bg-zinc-900">
                  Name A-Z
                </option>
                <option value="cr-asc" className="bg-zinc-900">
                  CR Low-High
                </option>
                <option value="cr-desc" className="bg-zinc-900">
                  CR High-Low
                </option>
              </select>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-[10px]" />
                  Clear
                </button>
              ) : (
                <div />
              )}
            </div>

            <div className="mt-2.5 flex items-center justify-between px-0.5 text-[11px] text-zinc-600">
              <span>
                {filteredMonsters.length}{" "}
                {filteredMonsters.length === 1 ? "monster" : "monsters"}
              </span>
              <span>{campaignMonsters.length} campaign-specific</span>
            </div>
          </div>

          <div className="workspace-scrollbar max-h-[calc(100vh-245px)] min-h-[420px] overflow-y-auto bg-black/10">
            {loading ? (
              <p className="p-5 text-sm text-zinc-400">Loading monsters...</p>
            ) : filteredMonsters.length === 0 ? (
              <p className="p-5 text-sm text-zinc-400">
                No monsters match the current filters.
              </p>
            ) : (
              sortedMonsters.map((monster) => {
                const key = `${monster.source}:${monster.id}`;

                const selected = key === selectedKey;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedKey(key)}
                    className={`group flex w-full items-center gap-3 border-b border-white/[0.06] px-3 py-2.5 text-left transition last:border-b-0 ${
                      selected
                        ? "bg-emerald-500/[0.09] shadow-[inset_2px_0_0_rgba(52,211,153,0.7)]"
                        : "hover:bg-white/[0.035]"
                    }`}
                  >
                    {monster.img ? (
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                        <img
                          src={monster.img}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-sm text-zinc-600">
                        ?
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate text-sm font-semibold text-white">
                          {monster.name}
                        </h2>

                        {monster.source === "campaign" ? (
                          <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-300">
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
              <div className="mb-2 flex flex-wrap justify-end gap-2">
                {selectedMonster.source === "campaign" ? (
                  <button
                    type="button"
                    onClick={() => beginEdit(selectedMonster)}
                    className="rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
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
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Create Copy
                </button>
              </div>

              <MonsterStatBlock monster={selectedMonster} />
            </>
          ) : (
            <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-zinc-950/30 p-8 text-center">
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
