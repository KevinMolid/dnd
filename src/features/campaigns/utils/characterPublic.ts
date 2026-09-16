import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../../../firebase";
import { classesById, speciesById } from "../../../rulesets/dnd/dnd2024/helpers";
import { getCharacterHp } from "../../../rulesets/dnd/dnd2024/getCharacterHp";

export type CharacterClaimMode = "locked" | "open" | "assigned";
export type CampaignCharacterStatus = "inactive" | "active";

export type PublicCampaignCharacter = {
  characterId: string;
  campaignId: string;
  ownerUid: string | null;
  createdByUid?: string | null;
  claimMode: CharacterClaimMode;
  claimableByUid: string | null;
  campaignStatus: CampaignCharacterStatus;
  buildMode?: "guided-dnd-2024" | "custom";
  name: string;
  imageUrl?: string | null;
  level: number;
  xp: number;
  classId?: string | null;
  speciesId?: string | null;
  className?: string | null;
  speciesName?: string | null;
  race?: string | null;
  currentHp: number;
  maxHp: number;
  armorClass?: number | null;
  speed?: number | null;
  conditions: string[];
};

const asRecord = (value: unknown): Record<string, any> =>
  value && typeof value === "object" ? (value as Record<string, any>) : {};

export const getCharacterClaimMode = (data: Record<string, any>): CharacterClaimMode => {
  if (data.ownerUid) return "locked";
  if (data.claimMode === "open" || data.claimMode === "assigned") return data.claimMode;
  return "locked";
};

export const buildPublicCampaignCharacter = (
  characterId: string,
  raw: Record<string, any>,
): PublicCampaignCharacter => {
  if (!raw.campaignId || typeof raw.campaignId !== "string") {
    throw new Error("Campaign character is missing campaignId.");
  }

  const customStats = asRecord(raw.customStats);
  const derived = asRecord(raw.derived);
  const derivedStats = asRecord(derived.stats);
  const isCustom = raw.buildMode === "custom";

  let maxHp: number;
  let currentHp: number;

  if (isCustom) {
    maxHp = Math.max(
      1,
      Number(customStats.maxHp ?? raw.maxHp ?? 1) || 1,
    );

    currentHp = Math.max(
      0,
      Math.min(
        maxHp,
        Number(customStats.currentHp ?? raw.currentHp ?? maxHp) || 0,
      ),
    );
  } else {
    try {
      const hp = getCharacterHp(raw as never);
      maxHp = Math.max(1, hp.maxHp);
      currentHp = Math.max(0, Math.min(maxHp, hp.currentHp));
    } catch {
      maxHp = Math.max(
        1,
        Number(raw.maxHp ?? derivedStats.maxHp ?? derived.maxHp ?? 1) || 1,
      );
      currentHp = Math.max(
        0,
        Math.min(
          maxHp,
          Number(
            raw.currentHp ??
              derivedStats.currentHp ??
              derived.currentHp ??
              maxHp,
          ) || 0,
        ),
      );
    }
  }

  const speciesName = isCustom
    ? raw.speciesName?.trim?.() || null
    : raw.speciesId
      ? speciesById[raw.speciesId]?.name ?? raw.speciesId
      : raw.speciesName?.trim?.() || null;

  const className = isCustom
    ? raw.className?.trim?.() || null
    : raw.classId
      ? classesById[raw.classId]?.name ?? raw.classId
      : raw.className?.trim?.() || null;

  return {
    characterId,
    campaignId: raw.campaignId,
    ownerUid: raw.ownerUid ?? null,
    createdByUid: raw.createdByUid ?? null,
    claimMode: getCharacterClaimMode(raw),
    claimableByUid:
      raw.claimMode === "assigned" && typeof raw.claimableByUid === "string"
        ? raw.claimableByUid
        : null,
    campaignStatus: raw.campaignStatus === "active" ? "active" : "inactive",
    buildMode: raw.buildMode,
    name: raw.name?.trim?.() || "Unnamed Character",
    imageUrl: raw.imageUrl?.trim?.() || null,
    level: Math.max(1, Number(raw.level) || 1),
    xp: Math.max(0, Number(raw.xp) || 0),
    classId: raw.classId ?? null,
    speciesId: raw.speciesId ?? null,
    className,
    speciesName,
    race: speciesName,
    currentHp,
    maxHp,
    armorClass: isCustom
      ? customStats.armorClass ?? raw.armorClass ?? null
      : raw.armorClass ?? null,
    speed: isCustom
      ? customStats.speed ?? raw.speed ?? null
      : raw.speed ?? derivedStats.speed ?? null,
    conditions: Array.isArray(raw.conditions) ? raw.conditions : [],
  };
};

const PUBLIC_UPDATE_KEYS = new Set([
  "ownerUid",
  "claimMode",
  "claimableByUid",
  "campaignStatus",
  "name",
  "imageUrl",
  "level",
  "xp",
  "classId",
  "speciesId",
  "className",
  "speciesName",
  "currentHp",
  "maxHp",
  "armorClass",
  "speed",
  "conditions",
  "buildMode",
]);

export const pickPublicCharacterUpdates = (
  updates: Record<string, unknown>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (PUBLIC_UPDATE_KEYS.has(key)) result[key] = value;
  }
  return result;
};

export const syncPublicCharacterFields = async (
  campaignId: string,
  characterId: string,
  updates: Record<string, unknown>,
) => {
  const publicUpdates = pickPublicCharacterUpdates(updates);
  if (Object.keys(publicUpdates).length === 0) return;

  await writeBatch(db)
    .update(doc(db, "campaigns", campaignId, "party", characterId), {
      ...publicUpdates,
      updatedAt: serverTimestamp(),
    })
    .commit();
};
