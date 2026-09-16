import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  type UpdateData,
  runTransaction,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase";

import {
  backgroundsById,
  classesById,
  speciesById,
} from "../../../rulesets/dnd/dnd2024/helpers";

import { applyLevelUpDecision } from "../../../rulesets/dnd/dnd2024/applyLevelUpDecision";

import {
  getCharacterHp,
  recalculateMaxHp,
} from "../../../rulesets/dnd/dnd2024/getCharacterHp";

import { getLevelFromXp } from "../../../rulesets/dnd/dnd2024/xpProgression";

import {
  getCharacterMoneyCp,
  moneyBreakdownToCopper,
  normalizeCopper,
} from "../../../rulesets/dnd/dnd2024/money";

import { subscribeToJournalEntries } from "../../journal/journalService";

import {
  canReadJournalEntry,
  type JournalEntry,
} from "../../journal/types";

import type {
  CampaignDoc,
  CampaignMemberDoc,
  CampaignRole,
} from "../../../types/campaign";

import type {
  CharacterChoices,
  CharacterEquipmentEntry,
  CharacterSheetData,
  LevelUpDecisionsByLevel,
  LevelUpDecision,
  Money,
} from "../../../rulesets/dnd/dnd2024/types";

import { applyBackgroundBonuses } from "../../character-sheet/utils/characterSheetHelpers";

import { itemsById } from "../../../rulesets/dnd/dnd2024/data/items";

import { addLogEntry } from "../utils/campaignLog";
import { pickPublicCharacterUpdates } from "../utils/characterPublic";

export type CampaignJournalPreview = {
  id: string;

  title: string;

  content: string;

  createdByName?: string;

  updatedAt: number;

  sessionNumber?: number | null;

  sessionDate?: string | null;

  type: JournalEntry["type"];

  pinned: boolean;

  published: boolean;
};

export type CampaignPageState =
  | "loading"
  | "ready"
  | "not-found"
  | "forbidden"
  | "error";

type CampaignCharacterStatus = "inactive" | "active";

type LegacyCharacterMoney = {
  cp?: number;
  sp?: number;
  ep?: number;
  gp?: number;
  pp?: number;
};

export type CharacterBuildMode =
  | "guided-dnd-2024"
  | "custom";

export type CustomCharacterTrait = {
  id: string;

  name: string;

  source?: string;

  description?: string;
};

export type CustomCharacterStats = {
  armorClass?: number;

  currentHp?: number;

  maxHp?: number;

  speed?: number;

  proficiencyBonus?: number;
};

export type CharacterDoc = {
  buildMode?: CharacterBuildMode;

  /*
   * Custom character display fields.
   */
  className?: string;

  speciesName?: string;

  backgroundName?: string;

  customStats?: CustomCharacterStats;

  customTraits?: CustomCharacterTrait[];

  customProficiencies?: unknown;

  customSpellcasting?: unknown;

  characterAppearance?: string;

  alliesAndOrganizations?: string;

  characterBackstory?: string;

  ownerUid: string | null;

  createdByUid?: string | null;

  campaignId: string | null;

  campaignStatus?: CampaignCharacterStatus;

  claimMode?: "locked" | "open" | "assigned";

  claimableByUid?: string | null;

  name: string;

  imageUrl?: string;

  level: number;

  xp?: number;

  /*
   * Guided-character fields.
   *
   * These must be optional because custom characters
   * do not necessarily have them.
   */
  classId?: string;

  speciesId?: string;

  backgroundId?: string;

  originFeatId?: string | null;

  abilityScores?: Record<string, number>;

  maxHp?: number;

  currentHp?: number;

  hp?: number;

  armorClass?: number;

  speed?: number;

  conditions?: string[];

  heroicInspiration?: boolean;

  deathSaves?: {
    successes: number;
    failures: number;
  };

  deathSaveSuccesses?: number;

  deathSaveFailures?: number;

  moneyCp?: number;

  money?: LegacyCharacterMoney;

  gold?: number;

  equipment?: CharacterEquipmentEntry[];

  pendingLevelUp?: {
    fromLevel: number;

    toLevel: number;
  } | null;

  choices?: CharacterChoices;

  derived?: {
    stats?: {
      maxHp?: number;

      currentHp?: number;
    };
  };

  subclassId?: string | null;
};

export type AppUserDoc = {
  displayName?: string;

  email?: string;

  imageUrl?: string;
};

export type CampaignCharacter = {
  id: string;

  /*
   * Critical:
   * expose build mode so downstream components
   * can distinguish custom from guided characters.
   */
  buildMode?: CharacterBuildMode;

  imageUrl?: string;

  ownerUid: string | null;

  createdByUid?: string | null;

  ownerName?: string;

  ownerEmail?: string;

  campaignId: string | null;

  campaignStatus: CampaignCharacterStatus;

  claimMode?: "locked" | "open" | "assigned";

  claimableByUid?: string | null;

  name: string;

  /*
   * Resolved display fields.
   */
  race?: string;

  className?: string;

  speciesName?: string;

  backgroundName?: string;

  /*
   * Guided IDs remain available when present.
   */
  classId?: string;

  speciesId?: string;

  level?: number;

  derivedLevel?: number;

  levelUpAvailable?: boolean;

  armorClass?: number;

  speed?: number;

  xp?: number;

  currentHp?: number;

  maxHp?: number;

  conditions?: string[];

  heroicInspiration?: boolean;

  deathSaves?: {
    successes: number;
    failures: number;
  };

  deathSaveSuccesses?: number;

  deathSaveFailures?: number;

  /*
   * Old copper representation retained because
   * several existing campaign systems use it.
   */
  moneyCp?: number;

  /*
   * Full money object used by Custom characters.
   */
  money?: Money;

  equipment?: CharacterEquipmentEntry[];

  abilityScores?: Record<string, number>;

  customStats?: CustomCharacterStats;

  customTraits?: CustomCharacterTrait[];

  customProficiencies?: unknown;

  customSpellcasting?: unknown;

  characterAppearance?: string;

  alliesAndOrganizations?: string;

  characterBackstory?: string;

  pendingLevelUp?: {
    fromLevel: number;

    toLevel: number;
  } | null;

  choices?: CharacterChoices;

  originFeatId?: string | null;

  derived?: CharacterDoc["derived"];

  subclassId?: string | null;
};

export const ALL_CONDITIONS = [
  "Blinded",
  "Charmed",
  "Deafened",
  "Frightened",
  "Grappled",
  "Incapacitated",
  "Invisible",
  "Paralyzed",
  "Petrified",
  "Poisoned",
  "Prone",
  "Restrained",
  "Stunned",
  "Unconscious",
  "Exhaustion",
] as const;

export const formatRoleLabel = (role: CampaignRole) => {
  if (role === "gm") {
    return "GM";
  }

  if (role === "co-gm") {
    return "Co-GM";
  }

  return "Player";
};

export const getCampaignStatus = (
  value: unknown,
): CampaignCharacterStatus =>
  value === "active"
    ? "active"
    : "inactive";

export const getRoleBadgeClass = (role: CampaignRole) => {
  if (role === "gm") {
    return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20";
  }

  if (role === "co-gm") {
    return "bg-amber-500/15 text-amber-300 border border-amber-400/20";
  }

  return "bg-blue-500/15 text-blue-300 border border-blue-400/20";
};

const removeUndefinedDeep = <T,>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => removeUndefinedDeep(item)) as T;
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const cleanedEntries = Object.entries(
      value as Record<string, unknown>,
    )
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [
        key,
        removeUndefinedDeep(entryValue),
      ]);

    return Object.fromEntries(cleanedEntries) as T;
  }

  return value;
};

const buildPendingLevelUp = (
  currentLevel: number,

  nextXp: number,

  existingPending?: {
    fromLevel: number;

    toLevel: number;
  } | null,
) => {
  const derivedLevel =
    getLevelFromXp(nextXp);

  if (
    derivedLevel <= currentLevel
  ) {
    return null;
  }

  return {
    fromLevel:
      existingPending?.fromLevel ??
      currentLevel,

    toLevel: derivedLevel,
  };
};

const isCustomCharacterDoc = (
  character: CharacterDoc,
) => {
  return character.buildMode === "custom";
};

const getDisplayRace = (
  character: CharacterDoc,
) => {
  if (
    isCustomCharacterDoc(character)
  ) {
    return (
      character.speciesName?.trim() ||
      undefined
    );
  }

  if (character.speciesId) {
    return (
      speciesById[
        character.speciesId
      ]?.name ??
      character.speciesId
    );
  }

  return (
    character.speciesName?.trim() ||
    undefined
  );
};

const getDisplayClass = (
  character: CharacterDoc,
) => {
  if (
    isCustomCharacterDoc(character)
  ) {
    return (
      character.className?.trim() ||
      undefined
    );
  }

  if (character.classId) {
    return (
      classesById[
        character.classId
      ]?.name ??
      character.classId
    );
  }

  return (
    character.className?.trim() ||
    undefined
  );
};

const getCustomHp = (
  character: CharacterDoc,
) => {
  const maxHp =
    character.customStats?.maxHp ??
    character.maxHp ??
    0;

  const currentHp =
    character.customStats?.currentHp ??
    character.currentHp ??
    maxHp;

  return {
    currentHp:
      Math.max(
        0,
        currentHp,
      ),

    maxHp:
      Math.max(
        1,
        maxHp,
      ),
  };
};

const getCharacterHpForCampaign = (
  character: CharacterDoc,
) => {
  if (
    isCustomCharacterDoc(character)
  ) {
    return getCustomHp(character);
  }

  try {
    return getCharacterHp(
      character as never,
    );
  } catch (error) {
    console.error(
      `Failed to calculate HP for ${character.name}:`,
      error,
    );

    return {
      currentHp:
        character.currentHp ??
        character.hp ??
        0,

      maxHp:
        Math.max(
          1,
          character.maxHp ??
            1,
        ),
    };
  }
};

const getAbilityScoresForCampaign = (
  character: CharacterDoc,
): Record<string, number> => {
  const baseScores =
    character.abilityScores ?? {
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
    };

  /*
   * Custom characters already contain their final
   * manually entered scores.
   *
   * Do NOT run background bonus logic over them.
   */
  if (
    isCustomCharacterDoc(character)
  ) {
    return baseScores;
  }

  const background =
    character.backgroundId
      ? backgroundsById[
          character.backgroundId
        ]
      : undefined;

  return applyBackgroundBonuses(
    baseScores,
    character.choices
      ?.backgroundAbilityBonuses,
    background?.abilityOptions ??
      [],
  );
};

const normalizeMoneyObject = (
  money?: LegacyCharacterMoney,
): Money => {
  return {
    cp: Math.max(0, Math.floor(money?.cp ?? 0)),
    sp: Math.max(0, Math.floor(money?.sp ?? 0)),
    ep: Math.max(0, Math.floor(money?.ep ?? 0)),
    gp: Math.max(0, Math.floor(money?.gp ?? 0)),
    pp: Math.max(0, Math.floor(money?.pp ?? 0)),
  };
};

const moneyToCopper = (
  money: Money,
) => {
  return (
    (money.cp ?? 0) +
    (money.sp ?? 0) * 10 +
    (money.ep ?? 0) * 50 +
    (money.gp ?? 0) * 100 +
    (money.pp ?? 0) * 1000
  );
};

type RewardBaseItemInput = {
  source: "base";

  itemId: string;

  quantity: number;
};

type RewardCampaignItemInput = {
  source: "campaign";

  campaignItemId: string;

  baseItemId: string;

  quantity: number;
};

type RewardItemInput =
  | RewardBaseItemInput
  | RewardCampaignItemInput;

type RewardMoneyInput = {
  cp?: number;

  sp?: number;

  gp?: number;
};

type RewardPayload = {
  characterIds: string[];

  money?: RewardMoneyInput;

  items?: RewardItemInput[];
};

const normalizeRewardMoneyInput = (
  money?: RewardMoneyInput,
) => ({
  cp: Math.max(
    0,
    Math.floor(
      money?.cp ?? 0,
    ),
  ),

  sp: Math.max(
    0,
    Math.floor(
      money?.sp ?? 0,
    ),
  ),

  gp: Math.max(
    0,
    Math.floor(
      money?.gp ?? 0,
    ),
  ),
});

const getRewardItemInstanceBaseId = (
  item: RewardItemInput,
) =>
  item.source === "base"
    ? item.itemId
    : item.campaignItemId;

const getRewardItemDisplayName = (
  item: RewardItemInput,
) => {
  if (
    item.source === "base"
  ) {
    return (
      itemsById[
        item.itemId
      ]?.name ??
      item.itemId
    );
  }

  return (
    itemsById[
      item.baseItemId
    ]?.name ??
    item.campaignItemId
  );
};

const createEquipmentInstanceId = (
  baseId: string,

  existing: CharacterEquipmentEntry[],
) => {
  const usedIds =
    new Set(
      existing.map(
        (item) =>
          item.instanceId,
      ),
    );

  let nextNumber = 1;

  while (
    usedIds.has(
      `${baseId}__${nextNumber}`,
    )
  ) {
    nextNumber += 1;
  }

  return `${baseId}__${nextNumber}`;
};

const isUnequippedStackableBaseEntry = (
  entry: CharacterEquipmentEntry,

  itemId: string,
) =>
  (entry.source === "base" ||
    entry.source === undefined) &&
  entry.itemId === itemId &&
  !entry.equipped &&
  (entry.equippedSlots?.length ??
    0) === 0 &&
  !entry.wieldMode;

const isUnequippedStackableCampaignEntry = (
  entry: CharacterEquipmentEntry,

  campaignItemId: string,
) =>
  entry.source ===
    "campaign" &&
  entry.campaignItemId ===
    campaignItemId &&
  !entry.equipped &&
  (entry.equippedSlots?.length ??
    0) === 0 &&
  !entry.wieldMode;

const mergeEquipmentItems = (
  current: CharacterEquipmentEntry[],

  incoming: RewardItemInput[],
): CharacterEquipmentEntry[] => {
  const result:
    CharacterEquipmentEntry[] = [
    ...current,
  ];

  incoming.forEach(
    (incomingItem) => {
      const quantity =
        Math.max(
          0,
          Math.floor(
            incomingItem.quantity,
          ),
        );

      if (
        quantity <= 0
      ) {
        return;
      }

      const baseItemId =
        incomingItem.source ===
        "base"
          ? incomingItem.itemId
          : incomingItem.baseItemId;

      const baseItemDef =
        itemsById[
          baseItemId
        ];

      const itemName =
        incomingItem.source ===
        "base"
          ? baseItemDef?.name ??
            incomingItem.itemId
          : baseItemDef?.name ??
            incomingItem.campaignItemId;

      const isStackable =
        baseItemDef?.stackable ===
        true;

      if (isStackable) {
        const existing =
          incomingItem.source ===
          "base"
            ? result.find(
                (entry) =>
                  isUnequippedStackableBaseEntry(
                    entry,
                    incomingItem.itemId,
                  ),
              )
            : result.find(
                (entry) =>
                  isUnequippedStackableCampaignEntry(
                    entry,
                    incomingItem.campaignItemId,
                  ),
              );

        if (existing) {
          existing.quantity +=
            quantity;
        } else if (
          incomingItem.source ===
          "base"
        ) {
          result.push({
            instanceId:
              createEquipmentInstanceId(
                incomingItem.itemId,
                result,
              ),

            source: "base",

            itemId:
              incomingItem.itemId,

            name: itemName,

            quantity,

            equipped: false,

            equippedSlots: [],
          });
        } else {
          result.push({
            instanceId:
              createEquipmentInstanceId(
                incomingItem.campaignItemId,
                result,
              ),

            source:
              "campaign",

            campaignItemId:
              incomingItem.campaignItemId,

            baseItemId:
              incomingItem.baseItemId,

            name: itemName,

            quantity,

            equipped: false,

            equippedSlots: [],
          });
        }

        return;
      }

      for (
        let i = 0;
        i < quantity;
        i += 1
      ) {
        if (
          incomingItem.source ===
          "base"
        ) {
          result.push({
            instanceId:
              createEquipmentInstanceId(
                incomingItem.itemId,
                result,
              ),

            source: "base",

            itemId:
              incomingItem.itemId,

            name: itemName,

            quantity: 1,

            equipped: false,

            equippedSlots: [],
          });
        } else {
          result.push({
            instanceId:
              createEquipmentInstanceId(
                incomingItem.campaignItemId,
                result,
              ),

            source:
              "campaign",

            campaignItemId:
              incomingItem.campaignItemId,

            baseItemId:
              incomingItem.baseItemId,

            name: itemName,

            quantity: 1,

            equipped: false,

            equippedSlots: [],
          });
        }
      }
    },
  );

  return result.sort(
    (a, b) =>
      a.name.localeCompare(
        b.name,
      ),
  );
};

export const useCampaignPageData = (
  campaignId?: string,
) => {
  const { user } =
    useAuth();

  const [
    latestJournalEntry,
    setLatestJournalEntry,
  ] =
    useState<CampaignJournalPreview | null>(
      null,
    );

  const [
    latestJournalEntryLoading,
    setLatestJournalEntryLoading,
  ] = useState(true);

  const [
    pageState,
    setPageState,
  ] =
    useState<CampaignPageState>(
      "loading",
    );

  const [
    campaign,
    setCampaign,
  ] = useState<
    | (CampaignDoc & {
        id: string;
      })
    | null
  >(null);

  const [
    membership,
    setMembership,
  ] =
    useState<CampaignMemberDoc | null>(
      null,
    );

  const isGm =
    membership?.role ===
      "gm" ||
    membership?.role ===
      "co-gm";

  const [
    campaignCharacters,
    setCampaignCharacters,
  ] =
    useState<CampaignCharacter[]>(
      [],
    );

  const [
    campaignCharactersLoading,
    setCampaignCharactersLoading,
  ] = useState(true);

  const [
    members,
    setMembers,
  ] =
    useState<CampaignMemberDoc[]>(
      [],
    );

  const [
    membersLoading,
    setMembersLoading,
  ] = useState(true);

  const [
    usersById,
    setUsersById,
  ] = useState<
    Record<
      string,
      AppUserDoc
    >
  >({});

  useEffect(() => {
    const loadCampaign =
      async () => {
        if (
          !user ||
          !campaignId
        ) {
          setCampaign(
            null,
          );

          setMembership(
            null,
          );

          setPageState(
            "forbidden",
          );

          return;
        }

        setPageState(
          "loading",
        );

        try {
          const campaignRef =
            doc(
              db,
              "campaigns",
              campaignId,
            );

          const memberRef =
            doc(
              db,
              "campaigns",
              campaignId,
              "members",
              user.uid,
            );

          const [
            campaignSnap,
            memberSnap,
          ] =
            await Promise.all([
              getDoc(
                campaignRef,
              ),

              getDoc(
                memberRef,
              ),
            ]);

          if (
            !campaignSnap.exists()
          ) {
            setCampaign(
              null,
            );

            setMembership(
              null,
            );

            setPageState(
              "not-found",
            );

            return;
          }

          if (
            !memberSnap.exists()
          ) {
            setCampaign(
              null,
            );

            setMembership(
              null,
            );

            setPageState(
              "forbidden",
            );

            return;
          }

          setCampaign({
            id:
              campaignSnap.id,

            ...(campaignSnap.data() as CampaignDoc),
          });

          setMembership(
            memberSnap.data() as CampaignMemberDoc,
          );

          setPageState(
            "ready",
          );
        } catch (
          error
        ) {
          console.error(
            "Failed to load campaign page:",
            error,
          );

          setCampaign(
            null,
          );

          setMembership(
            null,
          );

          setPageState(
            "error",
          );
        }
      };

    loadCampaign();
  }, [
    campaignId,
    user,
  ]);

  useEffect(() => {
    const unsub =
      onSnapshot(
        collection(
          db,
          "users",
        ),

        (snapshot) => {
          const map: Record<
            string,
            AppUserDoc
          > = {};

          snapshot.docs.forEach(
            (docSnap) => {
              map[
                docSnap.id
              ] =
                docSnap.data() as AppUserDoc;
            },
          );

          setUsersById(
            map,
          );
        },

        (error) => {
          console.error(
            "Failed to load users:",
            error,
          );

          setUsersById(
            {},
          );
        },
      );

    return () =>
      unsub();
  }, []);

  /*
   * Campaign characters
   */
  useEffect(() => {
    if (
      pageState !==
        "ready" ||
      !campaignId
    ) {
      setCampaignCharacters(
        [],
      );

      setCampaignCharactersLoading(
        false,
      );

      return;
    }

    setCampaignCharactersLoading(
      true,
    );

    const q = isGm
      ? query(
          collection(db, "characters"),
          where("campaignId", "==", campaignId),
        )
      : query(
          collection(db, "campaigns", campaignId, "party"),
        );

    const unsub =
      onSnapshot(
        q,

        async (
          snapshot,
        ) => {
          try {
            const nextCharacters =
              await Promise.all(
                snapshot.docs.map(
                  async (
                    characterSnap,
                  ) => {
                    const data =
                      characterSnap.data() as CharacterDoc;

                    const owner =
                      data.ownerUid
                        ? usersById[
                            data
                              .ownerUid
                          ]
                        : undefined;

                    const ownerName =
                      owner?.displayName ??
                      "";

                    const ownerEmail =
                      owner?.email ??
                      "";

                    const isCustom =
                      isCustomCharacterDoc(
                        data,
                      );

                    const xp =
                      data.xp ??
                      0;

                    const currentLevel =
                      data.level ??
                      1;

                    /*
                     * Custom characters are manually controlled.
                     *
                     * Don't infer a level from XP or offer the
                     * guided level-up process automatically.
                     */
                    const derivedLevel =
                      isCustom
                        ? currentLevel
                        : getLevelFromXp(
                            xp,
                          );

                    const levelUpAvailable =
                      isCustom
                        ? false
                        : Boolean(
                            data.pendingLevelUp,
                          ) ||
                          derivedLevel >
                            currentLevel;

                    const hpData =
                      isGm
                        ? getCharacterHpForCampaign(data)
                        : {
                            currentHp: Math.max(
                              0,
                              Number(data.currentHp ?? 0) || 0,
                            ),
                            maxHp: Math.max(
                              1,
                              Number(data.maxHp ?? 1) || 1,
                            ),
                          };

                    const money =
                      normalizeMoneyObject(
                        data.money,
                      );

                    /*
                     * Keep the existing copper value too.
                     *
                     * Custom characters created with the new form
                     * primarily store the full money object.
                     */
                    const moneyCp =
                      isCustom &&
                      data.money
                        ? moneyToCopper(
                            money,
                          )
                        : getCharacterMoneyCp(
                            data,
                          );

                    const finalAbilityScores =
                      getAbilityScoresForCampaign(
                        data,
                      );

                    const race =
                      getDisplayRace(
                        data,
                      );

                    const className =
                      getDisplayClass(
                        data,
                      );

                    return {
                      id:
                        characterSnap.id,

                      buildMode:
                        data.buildMode,

                      ownerUid:
                        data.ownerUid ??
                        null,

                      createdByUid:
                        data.createdByUid ??
                        null,

                      ownerName,

                      ownerEmail,

                      campaignId:
                        data.campaignId ??
                        null,

                      campaignStatus:
                        getCampaignStatus(
                          data.campaignStatus,
                        ),

                      claimMode:
                        data.claimMode ?? "locked",

                      claimableByUid:
                        data.claimableByUid ?? null,

                      name:
                        data.name?.trim() ||
                        "Unnamed Character",

                      imageUrl:
                        data.imageUrl?.trim() ||
                        undefined,

                      /*
                       * Both normalized display names and original
                       * custom names are deliberately retained.
                       */
                      race,

                      className,

                      speciesName:
                        data.speciesName,

                      backgroundName:
                        data.backgroundName,

                      classId:
                        data.classId,

                      speciesId:
                        data.speciesId,

                      level:
                        currentLevel,

                      xp,

                      /*
                       * Custom HP comes directly from customStats.
                       */
                      currentHp:
                        hpData.currentHp,

                      maxHp:
                        hpData.maxHp,

                      /*
                       * Important for CharacterWorkspaceModule.
                       */
                      armorClass:
                        isCustom
                          ? data.customStats
                              ?.armorClass ??
                            data.armorClass ??
                            10
                          : data.armorClass,

                      speed:
                        isCustom
                          ? data.customStats
                              ?.speed ??
                            data.speed ??
                            30
                          : data.speed,

                      customStats:
                        data.customStats,

                      customTraits:
                        data.customTraits,

                      customProficiencies:
                        data.customProficiencies,

                      customSpellcasting:
                        data.customSpellcasting,

                      characterAppearance:
                        data.characterAppearance,

                      alliesAndOrganizations:
                        data.alliesAndOrganizations,

                      characterBackstory:
                        data.characterBackstory,

                      conditions:
                        data.conditions ??
                        [],

                      heroicInspiration:
                        data.heroicInspiration ?? false,

                      deathSaves:
                        data.deathSaves,

                      deathSaveSuccesses:
                        data.deathSaveSuccesses,

                      deathSaveFailures:
                        data.deathSaveFailures,

                      moneyCp,

                      money,

                      equipment:
                        data.equipment ??
                        [],

                      abilityScores:
                        finalAbilityScores,

                      pendingLevelUp:
                        isCustom
                          ? null
                          : data.pendingLevelUp ??
                            null,

                      choices:
                        data.choices ??
                        {},

                      originFeatId:
                        data.originFeatId ??
                        null,

                      derived:
                        data.derived ??
                        {},

                      subclassId:
                        data.subclassId ??
                        null,

                      derivedLevel,

                      levelUpAvailable,
                    } satisfies CampaignCharacter;
                  },
                ),
              );

            nextCharacters.sort(
              (a, b) =>
                a.name.localeCompare(
                  b.name,
                ),
            );

            setCampaignCharacters(
              nextCharacters,
            );

            setCampaignCharactersLoading(
              false,
            );
          } catch (
            error
          ) {
            console.error(
              "Failed to load campaign characters:",
              error,
            );

            setCampaignCharacters(
              [],
            );

            setCampaignCharactersLoading(
              false,
            );
          }
        },

        (error) => {
          console.error(
            "Failed to load campaign characters:",
            error,
          );

          setCampaignCharacters(
            [],
          );

          setCampaignCharactersLoading(
            false,
          );
        },
      );

    return () =>
      unsub();
  }, [
    campaignId,
    pageState,
    usersById,
    isGm,
  ]);

  useEffect(() => {
    if (
      pageState !==
        "ready" ||
      !campaignId
    ) {
      setMembers([]);

      setMembersLoading(
        false,
      );

      return;
    }

    setMembersLoading(
      true,
    );

    const membersRef =
      collection(
        db,
        "campaigns",
        campaignId,
        "members",
      );

    const unsub =
      onSnapshot(
        membersRef,

        (snapshot) => {
          const nextMembers =
            snapshot.docs.map(
              (docSnap) => {
                const member =
                  docSnap.data() as CampaignMemberDoc;

                const uid =
                  docSnap.id;

                const userDoc =
                  usersById[
                    uid
                  ];

                return {
                  ...member,

                  uid,

                  displayName:
                    member.displayName ??
                    userDoc?.displayName ??
                    "",

                  email:
                    member.email ??
                    userDoc?.email ??
                    "",

                  imageUrl:
                    userDoc?.imageUrl ??
                    "",
                };
              },
            );

          setMembers(
            nextMembers,
          );

          setMembersLoading(
            false,
          );
        },

        (error) => {
          console.error(
            "Failed to load campaign members:",
            error,
          );

          setMembers([]);

          setMembersLoading(
            false,
          );
        },
      );

    return () =>
      unsub();
  }, [
    campaignId,
    pageState,
    usersById,
  ]);

  useEffect(() => {
    if (
      pageState !==
        "ready" ||
      !campaignId
    ) {
      setLatestJournalEntry(
        null,
      );

      setLatestJournalEntryLoading(
        false,
      );

      return;
    }

    setLatestJournalEntryLoading(
      true,
    );

    const currentPlayerId: string | null =
      null;

    const unsubscribe =
      subscribeToJournalEntries(
        campaignId,

        {
          isGm,
        },

        (entries) => {
          const visibleEntries =
            entries.filter(
              (entry) =>
                canReadJournalEntry({
                  entry,

                  isDm:
                    isGm,

                  currentPlayerId,
                }),
            );

          if (
            visibleEntries.length ===
            0
          ) {
            setLatestJournalEntry(
              null,
            );

            setLatestJournalEntryLoading(
              false,
            );

            return;
          }

          const sorted = [
            ...visibleEntries,
          ].sort(
            (a, b) =>
              b.updatedAt -
              a.updatedAt,
          );

          const latest =
            sorted[0];

          setLatestJournalEntry({
            id: latest.id,

            title:
              latest.title,

            content:
              latest.content,

            createdByName:
              latest.createdByName,

            updatedAt:
              latest.updatedAt,

            sessionNumber:
              latest.sessionNumber ??
              null,

            sessionDate:
              latest.sessionDate ??
              null,

            type: latest.type,

            pinned:
              latest.pinned,

            published:
              latest.published,
          });

          setLatestJournalEntryLoading(
            false,
          );
        },
      );

    return unsubscribe;
  }, [
    campaignId,
    pageState,
    isGm,
  ]);

  const queuedCharacterUpdatesRef = useRef<
    Map<string, Record<string, unknown>>
  >(new Map());

  const queuedCharacterTimersRef = useRef<
    Map<string, ReturnType<typeof setTimeout>>
  >(new Map());

  useEffect(() => {
    return () => {
      queuedCharacterTimersRef.current.forEach((timer) => clearTimeout(timer));
      queuedCharacterTimersRef.current.clear();
      queuedCharacterUpdatesRef.current.clear();
    };
  }, []);

  const applyOptimisticCharacterUpdate = useCallback(
    (id: string, updates: Record<string, unknown>) => {
      setCampaignCharacters((current) =>
        current.map((character) => {
          if (character.id !== id) {
            return character;
          }

          const next = {
            ...character,
            ...updates,
          } as CampaignCharacter;

          if (updates.customStats && typeof updates.customStats === "object") {
            next.customStats = {
              ...(character.customStats ?? {}),
              ...(updates.customStats as CustomCharacterStats),
            };
          }

          return next;
        }),
      );
    },
    [],
  );

  const systemLabel =
    useMemo(() => {
      if (!campaign) {
        return "Tabletop RPG";
      }

      return (
        campaign.systemLabel ??
        campaign.system ??
        "Tabletop RPG"
      );
    }, [campaign]);

  const commitCharacterUpdate = useCallback(
    async (id: string, updates: Record<string, unknown>) => {
      const character = campaignCharacters.find((entry) => entry.id === id);
      const batch = writeBatch(db);

      batch.update(doc(db, "characters", id), {
        ...(updates as UpdateData<CharacterDoc>),
        updatedAt: serverTimestamp(),
      });

      if (character?.campaignId) {
        const publicUpdates = pickPublicCharacterUpdates(updates);

        if (Object.keys(publicUpdates).length > 0) {
          batch.update(
            doc(db, "campaigns", character.campaignId, "party", id),
            {
              ...publicUpdates,
              updatedAt: serverTimestamp(),
            },
          );
        }
      }

      await batch.commit();
    },
    [campaignCharacters],
  );

  const updateCharacter = useCallback(
    async (id: string, updates: Record<string, unknown>) => {
      applyOptimisticCharacterUpdate(id, updates);

      try {
        await commitCharacterUpdate(id, updates);
      } catch (error) {
        console.error("Failed to update character:", error);
        throw error;
      }
    },
    [applyOptimisticCharacterUpdate, commitCharacterUpdate],
  );

  /*
   * High-frequency workspace controls (HP etc.) use this path.
   * The UI updates immediately while rapid changes to the same character are
   * collapsed into one Firestore batch after a short idle period.
   */
  const queueCharacterUpdate = useCallback(
    (id: string, updates: Record<string, unknown>, delayMs = 250) => {
      applyOptimisticCharacterUpdate(id, updates);

      const previous = queuedCharacterUpdatesRef.current.get(id) ?? {};
      const merged: Record<string, unknown> = { ...previous, ...updates };

      if (
        previous.customStats &&
        updates.customStats &&
        typeof previous.customStats === "object" &&
        typeof updates.customStats === "object"
      ) {
        merged.customStats = {
          ...(previous.customStats as Record<string, unknown>),
          ...(updates.customStats as Record<string, unknown>),
        };
      }

      queuedCharacterUpdatesRef.current.set(id, merged);

      const existingTimer = queuedCharacterTimersRef.current.get(id);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        const pending = queuedCharacterUpdatesRef.current.get(id);
        queuedCharacterUpdatesRef.current.delete(id);
        queuedCharacterTimersRef.current.delete(id);

        if (!pending) {
          return;
        }

        void commitCharacterUpdate(id, pending).catch((error) => {
          console.error("Failed to persist queued character update:", error);
        });
      }, delayMs);

      queuedCharacterTimersRef.current.set(id, timer);
    },
    [applyOptimisticCharacterUpdate, commitCharacterUpdate],
  );

  const updateCharacterXp =
    useCallback(
      async (
        character: CampaignCharacter,

        nextXp: number,
      ) => {
        const safeXp =
          Math.max(
            0,
            nextXp,
          );

        /*
         * Custom characters can still store XP,
         * but XP should not invoke the guided
         * level-up workflow.
         */
        if (
          character.buildMode ===
          "custom"
        ) {
          await updateCharacter(
            character.id,
            {
              xp: safeXp,
            },
          );

          return;
        }

        const currentLevel =
          character.level ??
          1;

        const pendingLevelUp =
          buildPendingLevelUp(
            currentLevel,
            safeXp,
            character.pendingLevelUp ??
              null,
          );

        await updateCharacter(
          character.id,
          {
            xp: safeXp,

            pendingLevelUp,
          },
        );
      },

      [updateCharacter],
    );

  const toggleCondition =
    useCallback(
      async (
        character: CampaignCharacter,

        condition: string,
      ) => {
        const current =
          character.conditions ??
          [];

        const next =
          current.includes(
            condition,
          )
            ? current.filter(
                (c) =>
                  c !==
                  condition,
              )
            : [
                ...current,
                condition,
              ];

        await updateCharacter(
          character.id,
          {
            conditions:
              next,
          },
        );
      },

      [updateCharacter],
    );

  const handleLevelUp =
    useCallback(
      async (
        character: CampaignCharacter,

        decisionsByLevel: LevelUpDecisionsByLevel,
      ) => {
        /*
         * Guided level-up logic must never be applied
         * to Custom characters.
         */
        if (
          character.buildMode ===
          "custom"
        ) {
          console.warn(
            "Guided level-up is not available for custom characters.",
          );

          return;
        }

        try {
          if (
            !character.pendingLevelUp
          ) {
            console.error(
              "No pending level up found.",
            );

            return;
          }

          let updated =
            structuredClone(
              character,
            ) as unknown as CharacterSheetData;

          const cleanedIncomingDecisions =
            removeUndefinedDeep(
              decisionsByLevel,
            ) as LevelUpDecisionsByLevel;

          const mergedLevelUpDecisions =
            removeUndefinedDeep({
              ...(updated.choices
                ?.levelUpDecisions ??
                {}),

              ...cleanedIncomingDecisions,
            }) as LevelUpDecisionsByLevel;

          updated = {
            ...updated,

            choices:
              removeUndefinedDeep({
                ...(updated.choices ??
                  {}),

                levelUpDecisions:
                  mergedLevelUpDecisions,
              }) as CharacterChoices,
          };

          for (const [
            levelKey,
            decision,
          ] of Object.entries(
            cleanedIncomingDecisions,
          )) {
            updated =
              applyLevelUpDecision(
                updated,

                Number(
                  levelKey,
                ),

                decision as LevelUpDecision,
              );
          }

          const oldHp =
            getCharacterHp(
              character as never,
            );

          const nextLevel =
            character
              .pendingLevelUp
              .toLevel;

          updated = {
            ...updated,

            level:
              nextLevel,

            pendingLevelUp:
              null,
          };

          const newMaxHp =
            recalculateMaxHp(
              updated as never,
            );

          const hpGain =
            Math.max(
              0,
              newMaxHp -
                oldHp.maxHp,
            );

          const newCurrentHp =
            Math.min(
              newMaxHp,

              oldHp.currentHp +
                hpGain,
            );

          const payload =
            removeUndefinedDeep({
              level:
                nextLevel,

              maxHp:
                newMaxHp,

              currentHp:
                newCurrentHp,

              pendingLevelUp:
                null,

              choices:
                updated.choices ??
                {},

              subclassId:
                updated.subclassId ??
                null,
            });

          await updateCharacter(
            character.id,
            payload as Record<string, unknown>,
          );
        } catch (
          error
        ) {
          console.error(
            "Level up failed:",
            error,
          );
        }
      },

      [updateCharacter],
    );

  const handleApplyXp =
    useCallback(
      async (
        updates: {
          id: string;

          xp: number;
        }[],
      ) => {
        try {
          await Promise.all(
            updates.map(
              async (
                entry,
              ) => {
                const character =
                  campaignCharacters.find(
                    (c) =>
                      c.id ===
                      entry.id,
                  );

                if (
                  !character
                ) {
                  return;
                }

                await updateCharacterXp(
                  character,

                  entry.xp,
                );
              },
            ),
          );
        } catch (
          error
        ) {
          console.error(
            "Failed to award XP:",
            error,
          );
        }
      },

      [
        campaignCharacters,
        updateCharacterXp,
      ],
    );

  const handleClaimCharacter =
    useCallback(
      async (characterId: string) => {
        if (!user || !campaignId) return;

        const character = campaignCharacters.find((entry) => entry.id === characterId);
        if (!character || character.ownerUid !== null) return;

        const canClaim =
          character.claimMode === "open" ||
          (character.claimMode === "assigned" &&
            character.claimableByUid === user.uid);

        if (!canClaim) {
          throw new Error("This character is not available to you.");
        }

        const batch = writeBatch(db);
        const claimUpdates = {
          ownerUid: user.uid,
          claimMode: "locked",
          claimableByUid: null,
          updatedAt: serverTimestamp(),
        };

        batch.update(doc(db, "characters", characterId), claimUpdates);
        batch.update(
          doc(db, "campaigns", campaignId, "party", characterId),
          claimUpdates,
        );

        await batch.commit();
      },
      [campaignCharacters, campaignId, user],
    );

  const handleSetCharacterActive =
    useCallback(
      async (
        characterId: string,
      ) => {
        await updateCharacter(
          characterId,
          {
            campaignStatus:
              "active",
          },
        );
      },

      [updateCharacter],
    );

  const handleRewardCharacters =
    useCallback(
      async ({
        characterIds,

        money,

        items = [],
      }: RewardPayload) => {
        if (
          !campaignId ||
          !isGm
        ) {
          return;
        }

        const normalizedMoney =
          normalizeRewardMoneyInput(
            money,
          );

        const rewardMoneyCp =
          moneyBreakdownToCopper(
            normalizedMoney,
          );

        const normalizedItems =
          items
            .map(
              (item) =>
                item.source ===
                "base"
                  ? {
                      source:
                        "base" as const,

                      itemId:
                        item.itemId,

                      quantity:
                        Math.max(
                          0,
                          Math.floor(
                            item.quantity,
                          ),
                        ),
                    }
                  : {
                      source:
                        "campaign" as const,

                      campaignItemId:
                        item.campaignItemId,

                      baseItemId:
                        item.baseItemId,

                      quantity:
                        Math.max(
                          0,
                          Math.floor(
                            item.quantity,
                          ),
                        ),
                    },
            )
            .filter(
              (item) =>
                item.source ===
                "base"
                  ? Boolean(
                      item.itemId,
                    ) &&
                    item.quantity >
                      0
                  : Boolean(
                      item.campaignItemId,
                    ) &&
                    Boolean(
                      item.baseItemId,
                    ) &&
                    item.quantity >
                      0,
            );

        if (
          characterIds.length ===
          0
        ) {
          return;
        }

        if (
          rewardMoneyCp <=
            0 &&
          normalizedItems.length ===
            0
        ) {
          return;
        }

        try {
          const rewardResults =
            await Promise.all(
              characterIds.map(
                async (
                  characterId,
                ) => {
                  return runTransaction(
                    db,

                    async (
                      transaction,
                    ) => {
                      const characterRef =
                        doc(
                          db,
                          "characters",
                          characterId,
                        );

                      const characterSnap =
                        await transaction.get(
                          characterRef,
                        );

                      if (
                        !characterSnap.exists()
                      ) {
                        throw new Error(
                          "Character not found.",
                        );
                      }

                      const data =
                        characterSnap.data() as CharacterDoc;

                      if (
                        data.campaignId !==
                        campaignId
                      ) {
                        throw new Error(
                          "Character is no longer in this campaign.",
                        );
                      }

                      /*
                       * Calculate existing funds correctly regardless
                       * of whether the character is Custom or Guided.
                       */
                      const currentMoneyCp =
                        data.buildMode ===
                          "custom" &&
                        data.money
                          ? moneyToCopper(
                              normalizeMoneyObject(
                                data.money,
                              ),
                            )
                          : getCharacterMoneyCp(
                              data,
                            );

                      const nextMoneyCp =
                        normalizeCopper(
                          currentMoneyCp +
                            rewardMoneyCp,
                        );

                      const nextEquipment =
                        mergeEquipmentItems(
                          data.equipment ??
                            [],

                          normalizedItems,
                        );

                      /*
                       * moneyCp remains the canonical reward currency
                       * for now because the existing campaign reward
                       * system operates in copper.
                       *
                       * The workspace can still display the original
                       * full custom money object when present.
                       */
                      transaction.update(
                        characterRef,
                        {
                          moneyCp:
                            nextMoneyCp,

                          equipment:
                            nextEquipment,
                        },
                      );

                      return {
                        characterId,

                        characterName:
                          data.name,

                        previousMoneyCp:
                          currentMoneyCp,

                        nextMoneyCp,

                        rewardedMoney:
                          normalizedMoney,

                        rewardedMoneyCp:
                          rewardMoneyCp,

                        rewardedItems:
                          normalizedItems.map(
                            (item) =>
                              item.source ===
                              "base"
                                ? {
                                    source:
                                      "base" as const,

                                    itemId:
                                      item.itemId,

                                    quantity:
                                      item.quantity,

                                    displayName:
                                      getRewardItemDisplayName(
                                        item,
                                      ),
                                  }
                                : {
                                    source:
                                      "campaign" as const,

                                    campaignItemId:
                                      item.campaignItemId,

                                    baseItemId:
                                      item.baseItemId,

                                    quantity:
                                      item.quantity,

                                    displayName:
                                      getRewardItemDisplayName(
                                        item,
                                      ),
                                  },
                          ),
                      };
                    },
                  );
                },
              ),
            );

          await Promise.all(
            rewardResults.flatMap(
              (result) => {
                const logPromises: Promise<void>[] =
                  [];

                if (
                  result.rewardedMoneyCp >
                  0
                ) {
                  logPromises.push(
                    addLogEntry({
                      campaignId,

                      type:
                        "gold_received",

                      createdByUid:
                        user?.uid ??
                        null,

                      characterId:
                        result.characterId,

                      characterName:
                        result.characterName,

                      payload: {
                        cp:
                          result
                            .rewardedMoney
                            .cp,

                        sp:
                          result
                            .rewardedMoney
                            .sp,

                        gp:
                          result
                            .rewardedMoney
                            .gp,

                        amountCp:
                          result.rewardedMoneyCp,

                        previousMoneyCp:
                          result.previousMoneyCp,

                        nextMoneyCp:
                          result.nextMoneyCp,
                      },
                    }),
                  );
                }

                result.rewardedItems.forEach(
                  (item) => {
                    if (
                      item.source ===
                      "base"
                    ) {
                      logPromises.push(
                        addLogEntry({
                          campaignId,

                          type:
                            "item_received",

                          createdByUid:
                            user?.uid ??
                            null,

                          characterId:
                            result.characterId,

                          characterName:
                            result.characterName,

                          payload: {
                            source:
                              "base",

                            itemId:
                              item.itemId,

                            itemName:
                              item.displayName,

                            quantity:
                              item.quantity,
                          },
                        }),
                      );
                    } else {
                      logPromises.push(
                        addLogEntry({
                          campaignId,

                          type:
                            "item_received",

                          createdByUid:
                            user?.uid ??
                            null,

                          characterId:
                            result.characterId,

                          characterName:
                            result.characterName,

                          payload: {
                            source:
                              "campaign",

                            campaignItemId:
                              item.campaignItemId,

                            baseItemId:
                              item.baseItemId,

                            itemName:
                              item.displayName,

                            quantity:
                              item.quantity,
                          },
                        }),
                      );
                    }
                  },
                );

                return logPromises;
              },
            ),
          );
        } catch (
          error
        ) {
          console.error(
            "Failed to reward characters:",
            error,
          );
        }
      },

      [
        campaignId,
        isGm,
        user,
      ],
    );

  return {
    user,

    pageState,

    campaign,

    membership,

    isGm,

    systemLabel,

    campaignCharacters,

    campaignCharactersLoading,

    members,

    membersLoading,

    usersById,

    updateCharacter,

    queueCharacterUpdate,

    updateCharacterXp,

    toggleCondition,

    handleLevelUp,

    handleApplyXp,

    handleClaimCharacter,

    latestJournalEntry,

    latestJournalEntryLoading,

    handleSetCharacterActive,

    handleRewardCharacters,

    getRewardItemDisplayName,

    getRewardItemInstanceBaseId,
  };
};

export default useCampaignPageData;