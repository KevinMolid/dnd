import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { classesById, speciesById } from "../rulesets/dnd/dnd2024/helpers";
import type { CampaignDoc, CampaignMemberDoc } from "../types/campaign";
import ClaimableCharactersSection from "../features/campaigns/components/ClaimableCharactersSection";

import Avatar from "../components/Avatar";

type PageState = "loading" | "ready" | "not-found" | "forbidden" | "error";
type CampaignCharacterStatus = "inactive" | "active";

type CharacterDoc = {
  ownerUid: string | null;
  createdByUid?: string | null;
  campaignId: string | null;
  campaignStatus?: CampaignCharacterStatus;
  name: string;
  level: number;
  classId: string;
  speciesId: string;
  backgroundId: string;
  originFeatId: string | null;
  imageUrl?: string;
  abilityScores: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  alignment?: string;
  notes?: string;
};

type AppUserDoc = {
  displayName?: string;
  email?: string;
};

type CampaignCharacter = {
  id: string;
  ownerUid: string | null;
  createdByUid?: string | null;
  ownerName?: string;
  ownerEmail?: string;
  campaignId: string | null;
  campaignStatus: CampaignCharacterStatus;
  name: string;
  race?: string;
  className?: string;
  level?: number;
  imageUrl?: string;
};

const getCampaignStatus = (value: unknown): CampaignCharacterStatus =>
  value === "active" ? "active" : "inactive";

const CampaignCharactersPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [campaign, setCampaign] = useState<
    (CampaignDoc & { id: string }) | null
  >(null);
  const [myMembership, setMyMembership] = useState<CampaignMemberDoc | null>(
    null,
  );

  const [campaignCharacters, setCampaignCharacters] = useState<
    CampaignCharacter[]
  >([]);
  const [campaignCharactersLoading, setCampaignCharactersLoading] =
    useState(true);

  const [myCharacters, setMyCharacters] = useState<CampaignCharacter[]>([]);
  const [myCharactersLoading, setMyCharactersLoading] = useState(true);

  const [busyCharacterId, setBusyCharacterId] = useState<string | null>(null);

  const claimableCharacters = useMemo(
    () => campaignCharacters.filter((character) => character.ownerUid === null),
    [campaignCharacters],
  );

  useEffect(() => {
    const loadAccess = async () => {
      if (!user || !campaignId) {
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
          setMyMembership(null);
          setPageState("not-found");
          return;
        }

        if (!memberSnap.exists()) {
          setCampaign(null);
          setMyMembership(null);
          setPageState("forbidden");
          return;
        }

        setCampaign({
          id: campaignSnap.id,
          ...(campaignSnap.data() as CampaignDoc),
        });

        setMyMembership(memberSnap.data() as CampaignMemberDoc);
        setPageState("ready");
      } catch (error) {
        console.error("Failed to load campaign characters page:", error);
        setCampaign(null);
        setMyMembership(null);
        setPageState("error");
      }
    };

    loadAccess();
  }, [campaignId, user]);

  useEffect(() => {
    if (pageState !== "ready" || !campaignId) return;

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

              let ownerName = "";
              let ownerEmail = "";

              if (data.ownerUid) {
                try {
                  const ownerSnap = await getDoc(
                    doc(db, "users", data.ownerUid),
                  );
                  if (ownerSnap.exists()) {
                    const ownerData = ownerSnap.data() as AppUserDoc;
                    ownerName = ownerData.displayName ?? "";
                    ownerEmail = ownerData.email ?? "";
                  }
                } catch (error) {
                  console.warn("Could not load character owner:", error);
                }
              }

              return {
                id: characterSnap.id,
                ownerUid: data.ownerUid ?? null,
                createdByUid: data.createdByUid ?? null,
                ownerName,
                ownerEmail,
                campaignId: data.campaignId,
                campaignStatus: getCampaignStatus(data.campaignStatus),
                name: data.name,
                race: speciesById[data.speciesId]?.name ?? data.speciesId,
                className: classesById[data.classId]?.name ?? data.classId,
                level: data.level,
                imageUrl: data.imageUrl,
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
  }, [campaignId, pageState]);

  useEffect(() => {
    if (pageState !== "ready" || !user) return;

    setMyCharactersLoading(true);

    const q = query(
      collection(db, "characters"),
      where("ownerUid", "==", user.uid),
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const nextCharacters: CampaignCharacter[] = snapshot.docs.map(
          (characterSnap) => {
            const data = characterSnap.data() as CharacterDoc;

            return {
              id: characterSnap.id,
              ownerUid: data.ownerUid ?? null,
              createdByUid: data.createdByUid ?? null,
              ownerName: "",
              ownerEmail: user.email ?? "",
              campaignId: data.campaignId,
              campaignStatus: getCampaignStatus(data.campaignStatus),
              name: data.name,
              race: speciesById[data.speciesId]?.name ?? data.speciesId,
              className: classesById[data.classId]?.name ?? data.classId,
              level: data.level,
              imageUrl: data.imageUrl,
            };
          },
        );

        nextCharacters.sort((a, b) => a.name.localeCompare(b.name));
        setMyCharacters(nextCharacters);
        setMyCharactersLoading(false);
      },
      (error) => {
        console.error("Failed to load your characters:", error);
        setMyCharacters([]);
        setMyCharactersLoading(false);
      },
    );

    return () => unsub();
  }, [pageState, user]);

  const isGm = myMembership?.role === "gm" || myMembership?.role === "co-gm";

  const myAvailableCharacters = useMemo(
    () =>
      myCharacters.filter((character) => character.campaignId !== campaignId),
    [campaignId, myCharacters],
  );

  const myAssignedCharacters = useMemo(
    () =>
      myCharacters.filter((character) => character.campaignId === campaignId),
    [campaignId, myCharacters],
  );

  const activeCampaignCharacters = useMemo(
    () =>
      campaignCharacters.filter(
        (character) => character.campaignStatus === "active",
      ),
    [campaignCharacters],
  );

  const inactiveCampaignCharacters = useMemo(
    () =>
      campaignCharacters.filter(
        (character) => character.campaignStatus !== "active",
      ),
    [campaignCharacters],
  );

  const handleAssignToCampaign = async (characterId: string) => {
    if (!campaignId) return;

    setBusyCharacterId(characterId);

    try {
      const characterRef = doc(db, "characters", characterId);
      await updateDoc(characterRef, {
        campaignId,
        campaignStatus: "inactive",
      });
    } catch (error) {
      console.error("Failed to assign character to campaign:", error);
      alert("Could not assign character to campaign.");
    } finally {
      setBusyCharacterId(null);
    }
  };

  const handleRemoveFromCampaign = async (characterId: string) => {
    setBusyCharacterId(characterId);

    try {
      const characterRef = doc(db, "characters", characterId);
      await updateDoc(characterRef, {
        campaignId: null,
        campaignStatus: "inactive",
      });
    } catch (error) {
      console.error("Failed to remove character from campaign:", error);
      alert("Could not remove character from campaign.");
    } finally {
      setBusyCharacterId(null);
    }
  };

  const handleSetCampaignStatus = async (
    characterId: string,
    nextStatus: CampaignCharacterStatus,
  ) => {
    setBusyCharacterId(characterId);

    try {
      const characterRef = doc(db, "characters", characterId);
      await updateDoc(characterRef, {
        campaignStatus: nextStatus,
      });
    } catch (error) {
      console.error("Failed to update campaign character status:", error);
      alert("Could not update character status.");
    } finally {
      setBusyCharacterId(null);
    }
  };

  const handleClaimCharacter = async (characterId: string) => {
    if (!user || !campaignId) return;

    setBusyCharacterId(characterId);

    try {
      await runTransaction(db, async (transaction) => {
        const characterRef = doc(db, "characters", characterId);
        const characterSnap = await transaction.get(characterRef);

        if (!characterSnap.exists()) {
          throw new Error("Character not found.");
        }

        const data = characterSnap.data() as CharacterDoc;

        if (data.campaignId !== campaignId) {
          throw new Error("Character is no longer in this campaign.");
        }

        if (data.ownerUid) {
          throw new Error("Character has already been claimed.");
        }

        transaction.update(characterRef, {
          ownerUid: user.uid,
        });
      });
    } catch (error) {
      console.error("Failed to claim character:", error);
      alert(
        error instanceof Error ? error.message : "Could not claim character.",
      );
    } finally {
      setBusyCharacterId(null);
    }
  };

  const handleMakeCharacterClaimable = async (characterId: string) => {
    setBusyCharacterId(characterId);

    try {
      const characterRef = doc(db, "characters", characterId);
      await updateDoc(characterRef, {
        ownerUid: null,
        campaignStatus: "inactive",
      });
    } catch (error) {
      console.error("Failed to make character claimable:", error);
      alert("Could not make character claimable.");
    } finally {
      setBusyCharacterId(null);
    }
  };

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl py-6 sm:py-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-sm text-zinc-400">Loading characters...</p>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl py-6 sm:py-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Campaign not found
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              The campaign you tried to open does not exist.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "forbidden") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl py-6 sm:py-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">Access denied</h1>
            <p className="mt-3 text-sm text-zinc-400">
              You do not have access to this campaign.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "error" || !campaign || !myMembership) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl py-6 sm:py-8">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm text-red-200/80">
              We could not load the campaign characters page right now.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl py-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to={`/campaigns/${campaign.id}`}
              className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
            >
              ← Back to campaign
            </Link>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Characters
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              View the roster for{" "}
              <span className="font-medium text-white">{campaign.name}</span>.
            </p>
          </div>

          {isGm && (
            <Link
              to={`/characters/new?campaignId=${campaign.id}&campaignMode=unassigned`}
              className="inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              Create campaign character
            </Link>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Campaign characters
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Characters that exist in this campaign, whether active or
                  inactive.
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                {activeCampaignCharacters.length} active •{" "}
                {inactiveCampaignCharacters.length} inactive
              </div>
            </div>

            {campaignCharactersLoading ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                <p className="text-sm text-zinc-400">
                  Loading campaign characters...
                </p>
              </div>
            ) : campaignCharacters.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                <p className="text-sm text-zinc-300">
                  No characters have been assigned yet.
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Players can attach their own characters or claim unassigned
                  campaign characters.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {campaignCharacters.map((character) => {
                  const isOwnCharacter = character.ownerUid === user?.uid;
                  const canRemove = isOwnCharacter || isGm;
                  const isClaimable = !character.ownerUid;
                  const isActive = character.campaignStatus === "active";

                  return (
                    <div
                      key={character.id}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          <Avatar
                            src={character.imageUrl}
                            name={character.name}
                            className="h-14 w-14 shrink-0 rounded-xl"
                          />

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-semibold text-white sm:text-lg">
                                {character.name}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-xs ${
                                  isActive
                                    ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                                    : "border border-white/10 bg-white/5 text-zinc-300"
                                }`}
                              >
                                {isActive ? "Active" : "Inactive"}
                              </span>

                              {isClaimable ? (
                                <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300">
                                  Unassigned
                                </span>
                              ) : isOwnCharacter ? (
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                                  Yours
                                </span>
                              ) : null}
                            </div>

                            <p className="mt-2 text-sm text-zinc-400">
                              {[character.race, character.className]
                                .filter(Boolean)
                                .join(" • ")}
                              {character.level
                                ? ` • Level ${character.level}`
                                : ""}
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                              {isClaimable
                                ? "Available for a player to claim"
                                : `Player: ${
                                    character.ownerName ||
                                    character.ownerEmail ||
                                    character.ownerUid
                                  }`}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/characters/${character.id}`}
                            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                          >
                            Open
                          </Link>

                          {!isGm && isClaimable && (
                            <button
                              onClick={() => handleClaimCharacter(character.id)}
                              disabled={busyCharacterId === character.id}
                              className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Claim
                            </button>
                          )}

                          {isGm && (
                            <>
                              <button
                                onClick={() =>
                                  handleSetCampaignStatus(
                                    character.id,
                                    isActive ? "inactive" : "active",
                                  )
                                }
                                disabled={busyCharacterId === character.id}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isActive ? "Set inactive" : "Set active"}
                              </button>

                              {!isClaimable && (
                                <button
                                  onClick={() =>
                                    handleMakeCharacterClaimable(character.id)
                                  }
                                  disabled={busyCharacterId === character.id}
                                  className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Make claimable
                                </button>
                              )}
                            </>
                          )}

                          {canRemove && (
                            <button
                              onClick={() =>
                                handleRemoveFromCampaign(character.id)
                              }
                              disabled={busyCharacterId === character.id}
                              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <ClaimableCharactersSection
              characters={claimableCharacters}
              loading={campaignCharactersLoading}
              isGm={isGm}
              busyCharacterId={busyCharacterId}
              onClaimCharacter={handleClaimCharacter}
            />
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
              <h2 className="text-xl font-semibold text-white">
                Your characters
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Attach one of your existing characters to this campaign.
              </p>

              {myCharactersLoading ? (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-5 text-center">
                  <p className="text-sm text-zinc-400">
                    Loading your characters...
                  </p>
                </div>
              ) : myCharacters.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-5 text-center">
                  <p className="text-sm text-zinc-300">
                    You have no characters yet.
                  </p>

                  <Link
                    to="/characters/new"
                    className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Create character
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mt-5 space-y-3">
                    {myAvailableCharacters.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-5 text-center">
                        <p className="text-sm text-zinc-300">
                          No unassigned characters available.
                        </p>
                      </div>
                    ) : (
                      myAvailableCharacters.map((character) => (
                        <div
                          key={character.id}
                          className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar
                              src={character.imageUrl}
                              name={character.name}
                              className="h-12 w-12 shrink-0 rounded-xl"
                            />

                            <div className="min-w-0">
                              <h3 className="text-base font-semibold text-white">
                                {character.name}
                              </h3>

                              <p className="mt-2 text-sm text-zinc-400">
                                {[character.race, character.className]
                                  .filter(Boolean)
                                  .join(" • ")}
                                {character.level
                                  ? ` • Level ${character.level}`
                                  : ""}
                              </p>

                              {character.campaignId && (
                                <p className="mt-1 text-xs text-zinc-500">
                                  Already attached to another campaign
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() =>
                                handleAssignToCampaign(character.id)
                              }
                              disabled={
                                busyCharacterId === character.id ||
                                character.campaignId !== null
                              }
                              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Attach to campaign
                            </button>

                            <Link
                              to={`/characters/${character.id}`}
                              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                            >
                              Open
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {myAssignedCharacters.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Already in this campaign
                      </h3>

                      <div className="mt-3 space-y-3">
                        {myAssignedCharacters.map((character) => (
                          <div
                            key={character.id}
                            className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                          >
                            <div className="flex items-center gap-4">
                              <Avatar
                                src={character.imageUrl}
                                name={character.name}
                                className="h-12 w-12 shrink-0 rounded-xl"
                              />

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-base font-semibold text-white">
                                    {character.name}
                                  </h4>

                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs ${
                                      character.campaignStatus === "active"
                                        ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                                        : "border border-white/10 bg-white/5 text-zinc-300"
                                    }`}
                                  >
                                    {character.campaignStatus === "active"
                                      ? "Active"
                                      : "Inactive"}
                                  </span>
                                </div>

                                <p className="mt-2 text-sm text-zinc-400">
                                  {[character.race, character.className]
                                    .filter(Boolean)
                                    .join(" • ")}
                                  {character.level
                                    ? ` • Level ${character.level}`
                                    : ""}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                              <Link
                                to={`/characters/${character.id}`}
                                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                              >
                                Open
                              </Link>

                              <button
                                onClick={() =>
                                  handleRemoveFromCampaign(character.id)
                                }
                                disabled={busyCharacterId === character.id}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
              <h2 className="text-xl font-semibold text-white">
                What this page does
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                A quick overview of the current character flow.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm font-medium text-white">
                    Characters can exist without being active
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Only active characters appear in the party controls.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm font-medium text-white">
                    GMs can create unassigned campaign characters
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Players can later claim those characters and become their
                    owner.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm font-medium text-white">
                    Players can still attach their own characters
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    A character can only belong to one campaign at a time.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CampaignCharactersPage;
