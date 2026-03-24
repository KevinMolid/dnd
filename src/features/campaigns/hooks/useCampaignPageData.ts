import { useCallback, useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
  UpdateData,
} from "firebase/firestore";

import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase";
import { classesById, speciesById } from "../../../rulesets/dnd/dnd2024/helpers";
import { applyLevelUpDecision } from "../../../rulesets/dnd/dnd2024/applyLevelUpDecision";
import {
  getCharacterHp,
  recalculateMaxHp,
} from "../../../rulesets/dnd/dnd2024/getCharacterHp";
import { getLevelFromXp } from "../../../rulesets/dnd/dnd2024/xpProgression";

import {
  subscribeToJournalEntries,
} from "../../journal/journalService";

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
  CharacterSheetData,
  LevelUpDecisionsByLevel,
  LevelUpDecision,
} from "../../../rulesets/dnd/dnd2024/types";

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

export type CharacterDoc = {
  ownerUid: string;
  campaignId: string | null;

  name: string;
  imageUrl?: string;
  level: number;
  xp?: number;

  classId: string;
  speciesId: string;

  abilityScores?: Record<string, number>;

  maxHp?: number;
  currentHp?: number;
  hp?: number;

  conditions?: string[];

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
};

export type CampaignCharacter = {
  id: string;
  imageUrl?: string;
  ownerUid: string;
  ownerName?: string;
  ownerEmail?: string;
  campaignId: string | null;

  name: string;
  race?: string;
  className?: string;
  classId: string;
  speciesId: string;

  level?: number;
  derivedLevel?: number;
  levelUpAvailable?: boolean;

  xp?: number;
  currentHp?: number;
  maxHp?: number;
  conditions?: string[];

  abilityScores?: Record<string, number>;
  pendingLevelUp?: {
    fromLevel: number;
    toLevel: number;
  } | null;
  choices?: CharacterChoices;
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
  if (role === "gm") return "GM";
  if (role === "co-gm") return "Co-GM";
  return "Player";
};

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

  if (value && typeof value === "object") {
    const cleanedEntries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [key, removeUndefinedDeep(entryValue)]);

    return Object.fromEntries(cleanedEntries) as T;
  }

  return value;
};

const buildPendingLevelUp = (
  currentLevel: number,
  nextXp: number,
  existingPending?: { fromLevel: number; toLevel: number } | null,
) => {
  const derivedLevel = getLevelFromXp(nextXp);

  if (derivedLevel <= currentLevel) {
    return null;
  }

  return {
    fromLevel: existingPending?.fromLevel ?? currentLevel,
    toLevel: derivedLevel,
  };
};

export const useCampaignPageData = (campaignId?: string) => {
  const { user } = useAuth();

  const [latestJournalEntry, setLatestJournalEntry] =
    useState<CampaignJournalPreview | null>(null);
  const [latestJournalEntryLoading, setLatestJournalEntryLoading] =
    useState(true);

  const [pageState, setPageState] = useState<CampaignPageState>("loading");
  const [campaign, setCampaign] = useState<
    (CampaignDoc & { id: string }) | null
  >(null);
  const [membership, setMembership] = useState<CampaignMemberDoc | null>(null);

  const [campaignCharacters, setCampaignCharacters] = useState<
    CampaignCharacter[]
  >([]);
  const [campaignCharactersLoading, setCampaignCharactersLoading] =
    useState(true);

  const [members, setMembers] = useState<CampaignMemberDoc[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);

  const [usersById, setUsersById] = useState<Record<string, AppUserDoc>>({});

  useEffect(() => {
    const loadCampaign = async () => {
      if (!user || !campaignId) {
        setCampaign(null);
        setMembership(null);
        setPageState("forbidden");
        return;
      }

      setPageState("loading");

      try {
        const campaignRef = doc(db, "campaigns", campaignId);
        const memberRef = doc(db, "campaigns", campaignId, "members", user.uid);

        const [campaignSnap, memberSnap] = await Promise.all([
          getDoc(campaignRef),
          getDoc(memberRef),
        ]);

        if (!campaignSnap.exists()) {
          setCampaign(null);
          setMembership(null);
          setPageState("not-found");
          return;
        }

        if (!memberSnap.exists()) {
          setCampaign(null);
          setMembership(null);
          setPageState("forbidden");
          return;
        }

        setCampaign({
          id: campaignSnap.id,
          ...(campaignSnap.data() as CampaignDoc),
        });

        setMembership(memberSnap.data() as CampaignMemberDoc);
        setPageState("ready");
      } catch (error) {
        console.error("Failed to load campaign page:", error);
        setCampaign(null);
        setMembership(null);
        setPageState("error");
      }
    };

    loadCampaign();
  }, [campaignId, user]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const map: Record<string, AppUserDoc> = {};

        snapshot.docs.forEach((docSnap) => {
          map[docSnap.id] = docSnap.data() as AppUserDoc;
        });

        setUsersById(map);
      },
      (error) => {
        console.error("Failed to load users:", error);
        setUsersById({});
      },
    );

    return () => unsub();
  }, []);

  useEffect(() => {
    if (pageState !== "ready" || !campaignId) {
      setCampaignCharacters([]);
      setCampaignCharactersLoading(false);
      return;
    }

    setCampaignCharactersLoading(true);

    const q = query(
      collection(db, "characters"),
      where("campaignId", "==", campaignId),
    );

    const unsub = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const nextCharacters = await Promise.all(
            snapshot.docs.map(async (characterSnap) => {
              const data = characterSnap.data() as CharacterDoc;
              const owner = usersById[data.ownerUid];

              const ownerName = owner?.displayName ?? "";
              const ownerEmail = owner?.email ?? "";

              const xp = data.xp ?? 0;
              const currentLevel = data.level ?? 1;
              const derivedLevel = getLevelFromXp(xp);
              const levelUpAvailable =
                !!data.pendingLevelUp || derivedLevel > currentLevel;

              const hpData = getCharacterHp(data as never);

              return {
                id: characterSnap.id,
                ownerUid: data.ownerUid,
                ownerName,
                ownerEmail,
                campaignId: data.campaignId,

                name: data.name,
                imageUrl: data.imageUrl,
                classId: data.classId,
                speciesId: data.speciesId,

                race: speciesById[data.speciesId]?.name ?? data.speciesId,
                className: classesById[data.classId]?.name ?? data.classId,
                level: currentLevel,

                xp,
                currentHp: hpData.currentHp,
                maxHp: hpData.maxHp,
                conditions: data.conditions ?? [],

                abilityScores: data.abilityScores,
                pendingLevelUp: data.pendingLevelUp ?? null,
                choices: data.choices ?? {},
                derived: data.derived ?? {},
                subclassId: data.subclassId ?? null,

                derivedLevel,
                levelUpAvailable,
              } satisfies CampaignCharacter;
            }),
          );

          nextCharacters.sort((a, b) => a.name.localeCompare(b.name));
          setCampaignCharacters(nextCharacters);
          setCampaignCharactersLoading(false);
        } catch (error) {
          console.error("Failed to load campaign characters:", error);
          setCampaignCharacters([]);
          setCampaignCharactersLoading(false);
        }
      },
      (error) => {
        console.error("Failed to load campaign characters:", error);
        setCampaignCharacters([]);
        setCampaignCharactersLoading(false);
      },
    );

    return () => unsub();
  }, [campaignId, pageState, usersById]);

  useEffect(() => {
    if (pageState !== "ready" || !campaignId) {
      setMembers([]);
      setMembersLoading(false);
      return;
    }

    setMembersLoading(true);

    const membersRef = collection(db, "campaigns", campaignId, "members");

    const unsub = onSnapshot(
      membersRef,
      (snapshot) => {
        const nextMembers = snapshot.docs.map((docSnap) => {
          const member = docSnap.data() as CampaignMemberDoc;

          return {
            ...member,
            uid: docSnap.id,
          };
        });

        setMembers(nextMembers);
        setMembersLoading(false);
      },
      (error) => {
        console.error("Failed to load campaign members:", error);
        setMembers([]);
        setMembersLoading(false);
      },
    );

    return () => unsub();
  }, [campaignId, pageState]);

  const isGm = membership?.role === "gm" || membership?.role === "co-gm";

    useEffect(() => {
    if (pageState !== "ready" || !campaignId) {
      setLatestJournalEntry(null);
      setLatestJournalEntryLoading(false);
      return;
    }

    setLatestJournalEntryLoading(true);

    const currentPlayerId: string | null = null;

    const unsubscribe = subscribeToJournalEntries(campaignId, (entries) => {
      const visibleEntries = entries.filter((entry) =>
        canReadJournalEntry({
          entry,
          isDm: isGm,
          currentPlayerId,
        }),
      );

      if (visibleEntries.length === 0) {
        setLatestJournalEntry(null);
        setLatestJournalEntryLoading(false);
        return;
      }

      const sorted = [...visibleEntries].sort((a, b) => b.updatedAt - a.updatedAt);
      const latest = sorted[0];

      setLatestJournalEntry({
        id: latest.id,
        title: latest.title,
        content: latest.content,
        createdByName: latest.createdByName,
        updatedAt: latest.updatedAt,
        sessionNumber: latest.sessionNumber ?? null,
        sessionDate: latest.sessionDate ?? null,
        type: latest.type,
        pinned: latest.pinned,
        published: latest.published,
      });

      setLatestJournalEntryLoading(false);
    });

    return unsubscribe;
  }, [campaignId, pageState, isGm]);

  const systemLabel = useMemo(() => {
    if (!campaign) return "Tabletop RPG";
    return campaign.systemLabel ?? campaign.system ?? "Tabletop RPG";
  }, [campaign]);

  const updateCharacter = useCallback(
    async (id: string, updates: Record<string, unknown>) => {
      try {
        await updateDoc(
          doc(db, "characters", id),
          updates as UpdateData<CharacterDoc>
        );
      } catch (error) {
        console.error("Failed to update character:", error);
      }
    },
    [],
  );

  const updateCharacterXp = useCallback(
    async (character: CampaignCharacter, nextXp: number) => {
      const safeXp = Math.max(0, nextXp);
      const currentLevel = character.level ?? 1;

      const pendingLevelUp = buildPendingLevelUp(
        currentLevel,
        safeXp,
        character.pendingLevelUp ?? null,
      );

      await updateCharacter(character.id, {
        xp: safeXp,
        pendingLevelUp,
      });
    },
    [updateCharacter],
  );

  const toggleCondition = useCallback(
    async (character: CampaignCharacter, condition: string) => {
      const current = character.conditions ?? [];
      const next = current.includes(condition)
        ? current.filter((c) => c !== condition)
        : [...current, condition];

      await updateCharacter(character.id, { conditions: next });
    },
    [updateCharacter],
  );

const handleLevelUp = useCallback(
  async (
    character: CampaignCharacter,
    decisionsByLevel: LevelUpDecisionsByLevel,
  ) => {
    try {
      if (!character.pendingLevelUp) {
        console.error("No pending level up found.");
        return;
      }

      let updated = structuredClone(character) as unknown as CharacterSheetData;

      const cleanedIncomingDecisions = removeUndefinedDeep(
        decisionsByLevel,
        ) as LevelUpDecisionsByLevel;

        const mergedLevelUpDecisions = removeUndefinedDeep({
        ...(updated.choices?.levelUpDecisions ?? {}),
        ...cleanedIncomingDecisions,
        }) as LevelUpDecisionsByLevel;

        updated = {
        ...updated,
        choices: removeUndefinedDeep({
            ...(updated.choices ?? {}),
            levelUpDecisions: mergedLevelUpDecisions,
        }) as CharacterChoices,
        };

      for (const [levelKey, decision] of Object.entries(cleanedIncomingDecisions)) {
        updated = applyLevelUpDecision(
            updated,
            Number(levelKey),
            decision as LevelUpDecision,
        );
        }

      const oldHp = getCharacterHp(character as never);
      const nextLevel = character.pendingLevelUp.toLevel;

      updated = {
        ...updated,
        level: nextLevel,
        pendingLevelUp: null,
      };

      const newMaxHp = recalculateMaxHp(updated as never);
      const hpGain = Math.max(0, newMaxHp - oldHp.maxHp);
      const newCurrentHp = Math.min(newMaxHp, oldHp.currentHp + hpGain);

      const payload = removeUndefinedDeep({
        level: nextLevel,
        maxHp: newMaxHp,
        currentHp: newCurrentHp,
        pendingLevelUp: null,
        choices: updated.choices ?? {},
        subclassId: updated.subclassId ?? null,
      });

      await updateDoc(doc(db, "characters", character.id), payload);
    } catch (error) {
      console.error("Level up failed:", error);
    }
  },
  [],
);

  const handleApplyXp = useCallback(
    async (updates: { id: string; xp: number }[]) => {
      try {
        await Promise.all(
          updates.map(async (entry) => {
            const character = campaignCharacters.find((c) => c.id === entry.id);
            if (!character) return;

            await updateCharacterXp(character, entry.xp);
          }),
        );
      } catch (error) {
        console.error("Failed to award XP:", error);
      }
    },
    [campaignCharacters, updateCharacterXp],
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
    updateCharacterXp,
    toggleCondition,
    handleLevelUp,
    handleApplyXp,

    latestJournalEntry,
    latestJournalEntryLoading,
  };
};

export default useCampaignPageData;