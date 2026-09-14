import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
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

import Avatar from "../components/Avatar";

type PageState = "loading" | "ready" | "not-found" | "forbidden" | "error";

type CampaignCharacterStatus = "inactive" | "active";

type CharacterDoc = {
  ownerUid?: string | null;
  createdByUid?: string | null;
  campaignId?: string | null;
  campaignStatus?: CampaignCharacterStatus;
  buildMode?: string;
  name?: string;
  level?: number;

  classId?: string;
  speciesId?: string;
  backgroundId?: string;
  originFeatId?: string | null;

  className?: string;
  speciesName?: string;
  backgroundName?: string;

  imageUrl?: string;

  abilityScores?: {
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

const getCharacterRace = (data: CharacterDoc) => {
  if (data.buildMode === "custom") {
    return data.speciesName?.trim() || undefined;
  }

  if (data.speciesId) {
    return speciesById[data.speciesId]?.name ?? data.speciesId;
  }

  return data.speciesName?.trim() || undefined;
};

const getCharacterClassName = (data: CharacterDoc) => {
  if (data.buildMode === "custom") {
    return data.className?.trim() || undefined;
  }

  if (data.classId) {
    return classesById[data.classId]?.name ?? data.classId;
  }

  return data.className?.trim() || undefined;
};

const getCharacterSummary = (character: CampaignCharacter) =>
  [
    character.level ? `Level ${character.level}` : null,
    character.race,
    character.className,
  ]
    .filter(Boolean)
    .join(" ");

const CampaignCharactersPage = () => {
  const { campaignId } = useParams<{
    campaignId: string;
  }>();

  const { user } = useAuth();
  const location = useLocation();

  const [pageState, setPageState] = useState<PageState>("loading");

  const [campaign, setCampaign] = useState<
    | (CampaignDoc & {
        id: string;
      })
    | null
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
    if (pageState !== "ready" || !campaignId) {
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
                campaignId: data.campaignId ?? null,
                campaignStatus: getCampaignStatus(data.campaignStatus),
                name: data.name?.trim() || "Unnamed Character",
                race: getCharacterRace(data),
                className: getCharacterClassName(data),
                level: typeof data.level === "number" ? data.level : undefined,
                imageUrl: data.imageUrl?.trim() || undefined,
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
    if (pageState !== "ready" || !user) {
      return;
    }

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
              campaignId: data.campaignId ?? null,
              campaignStatus: getCampaignStatus(data.campaignStatus),
              name: data.name?.trim() || "Unnamed Character",
              race: getCharacterRace(data),
              className: getCharacterClassName(data),
              level: typeof data.level === "number" ? data.level : undefined,
              imageUrl: data.imageUrl?.trim() || undefined,
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

  /*
   * "Your characters" should only show characters that can actually be
   * attached to this campaign. Characters assigned to another campaign are
   * deliberately hidden.
   */
  const myCampaignCharacters = useMemo(
    () =>
      myCharacters.filter((character) => character.campaignId === campaignId),
    [campaignId, myCharacters],
  );

  const myAvailableCharacters = useMemo(
    () => myCharacters.filter((character) => character.campaignId === null),
    [myCharacters],
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
        (character) => character.campaignStatus === "inactive",
      ),
    [campaignCharacters],
  );

  const claimableCount = useMemo(
    () =>
      campaignCharacters.filter((character) => character.ownerUid === null)
        .length,
    [campaignCharacters],
  );

  const handleAssignToCampaign = async (characterId: string) => {
    if (!campaignId) {
      return;
    }

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
    if (!user || !campaignId) {
      return;
    }

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
      <PageMessage>
        <p className="text-sm text-zinc-400">Loading characters...</p>
      </PageMessage>
    );
  }

  if (pageState === "not-found") {
    return (
      <PageMessage>
        <h1 className="text-xl font-bold text-white">Campaign not found</h1>

        <p className="mt-2 text-sm text-zinc-400">
          The campaign you tried to open does not exist.
        </p>

        <Link
          to="/"
          className="mt-4 inline-flex rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          Back to home
        </Link>
      </PageMessage>
    );
  }

  if (pageState === "forbidden") {
    return (
      <PageMessage>
        <h1 className="text-xl font-bold text-white">Access denied</h1>

        <p className="mt-2 text-sm text-zinc-400">
          You do not have access to this campaign.
        </p>

        <Link
          to="/"
          className="mt-4 inline-flex rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          Back to home
        </Link>
      </PageMessage>
    );
  }

  if (pageState === "error" || !campaign || !myMembership) {
    return (
      <PageMessage tone="error">
        <h1 className="text-xl font-bold text-white">Something went wrong</h1>

        <p className="mt-2 text-sm text-red-200/80">
          We could not load the campaign characters page right now.
        </p>

        <Link
          to="/"
          className="mt-4 inline-flex rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          Back to home
        </Link>
      </PageMessage>
    );
  }

  const renderCampaignCharacter = (
    character: CampaignCharacter,
    isActive: boolean,
  ) => {
    const isOwnCharacter = character.ownerUid === user?.uid;
    const isClaimable = character.ownerUid === null;
    const isBusy = busyCharacterId === character.id;

    const canOpen = isGm || isOwnCharacter;
    const canRemove = isGm || isOwnCharacter;

    return (
      <div
        key={character.id}
        className="rounded-lg border border-white/[0.08] bg-black/15 px-3 py-2.5 transition hover:border-white/15 hover:bg-white/[0.025]"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              src={character.imageUrl}
              name={character.name}
              className="h-10 w-10 shrink-0 rounded-lg"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="truncate text-xs font-semibold text-white">
                  {character.name}
                </h3>

                <StatusBadge active={isActive} />

                {isClaimable ? (
                  <span className="rounded-md border border-amber-500/20 bg-amber-500/[0.08] px-1.5 py-0.5 text-[9px] font-medium text-amber-300">
                    Claimable
                  </span>
                ) : isOwnCharacter ? (
                  <span className="rounded-md border border-sky-500/20 bg-sky-500/[0.07] px-1.5 py-0.5 text-[9px] font-medium text-sky-300">
                    Yours
                  </span>
                ) : null}
              </div>

              <p className="mt-0.5 truncate text-[10px] text-zinc-500">
                {getCharacterSummary(character) || "Character"}
              </p>

              {!isClaimable && character.ownerUid ? (
                <p className="mt-0.5 truncate text-[9px] text-zinc-600">
                  {character.ownerName ||
                    character.ownerEmail ||
                    "Assigned player"}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
            {canOpen ? (
              <Link
                to={`/characters/${character.id}`}
                state={{
                  from: `${location.pathname}${location.search}`,
                }}
                className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.09] hover:text-white"
              >
                Open
              </Link>
            ) : null}

            {isClaimable ? (
              <button
                type="button"
                onClick={() => handleClaimCharacter(character.id)}
                disabled={isBusy}
                className="rounded-md bg-white px-2.5 py-1.5 text-[10px] font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isBusy ? "Claiming…" : "Claim"}
              </button>
            ) : null}

            {isGm ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    handleSetCampaignStatus(
                      character.id,
                      isActive ? "inactive" : "active",
                    )
                  }
                  disabled={isBusy}
                  className={`rounded-md border px-2.5 py-1.5 text-[10px] font-semibold transition disabled:opacity-50 ${
                    isActive
                      ? "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                      : "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300 hover:bg-emerald-500/[0.12]"
                  }`}
                >
                  {isActive ? "Set inactive" : "Set active"}
                </button>

                {!isClaimable ? (
                  <button
                    type="button"
                    onClick={() => handleMakeCharacterClaimable(character.id)}
                    disabled={isBusy}
                    className="rounded-md border border-amber-500/20 bg-amber-500/[0.07] px-2.5 py-1.5 text-[10px] font-semibold text-amber-300 transition hover:bg-amber-500/[0.12] disabled:opacity-50"
                  >
                    Make claimable
                  </button>
                ) : null}
              </>
            ) : null}

            {canRemove && !isClaimable ? (
              <button
                type="button"
                onClick={() => handleRemoveFromCampaign(character.id)}
                disabled={isBusy}
                className="rounded-md border border-rose-500/15 bg-rose-500/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-rose-300/80 transition hover:bg-rose-500/[0.08] hover:text-rose-200 disabled:opacity-50"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">Characters</h2>

        {isGm ? (
          <Link
            to={`/characters/new?campaignId=${campaign.id}&campaignMode=unassigned`}
            className="inline-flex rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.09] hover:text-white"
          >
            Create campaign character
          </Link>
        ) : null}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
        <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-3">
          {campaignCharactersLoading ? (
            <EmptyState>Loading campaign characters…</EmptyState>
          ) : campaignCharacters.length === 0 ? (
            <EmptyState>No campaign characters yet.</EmptyState>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-white">
                    Active characters
                  </h2>

                  <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                    <span className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.08] px-2 py-0.5 text-emerald-300">
                      {activeCampaignCharacters.length} active
                    </span>

                    {claimableCount > 0 ? (
                      <span className="rounded-md border border-amber-500/20 bg-amber-500/[0.08] px-2 py-0.5 text-amber-300">
                        {claimableCount} claimable
                      </span>
                    ) : null}
                  </div>
                </div>

                {activeCampaignCharacters.length === 0 ? (
                  <EmptyState>No active characters.</EmptyState>
                ) : (
                  <div className="space-y-1.5">
                    {activeCampaignCharacters.map((character) =>
                      renderCampaignCharacter(character, true),
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-white/[0.08] pt-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-white">
                    Inactive characters
                  </h2>

                  <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[9px] text-zinc-400">
                    {inactiveCampaignCharacters.length} inactive
                  </span>
                </div>

                {inactiveCampaignCharacters.length === 0 ? (
                  <EmptyState>No inactive characters.</EmptyState>
                ) : (
                  <div className="space-y-1.5">
                    {inactiveCampaignCharacters.map((character) =>
                      renderCampaignCharacter(character, false),
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <aside>
          <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-white">
                Your characters
              </h2>

              <Link
                to="/characters/new"
                className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
              >
                Create
              </Link>
            </div>

            {myCharactersLoading ? (
              <div className="mt-3">
                <EmptyState>Loading your characters…</EmptyState>
              </div>
            ) : (
              <div className="mt-3 space-y-4">
                {myCampaignCharacters.length > 0 ? (
                  <div>
                    <h3 className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                      This campaign
                    </h3>

                    <div className="mt-2 space-y-1.5">
                      {myCampaignCharacters.map((character) => (
                        <div
                          key={character.id}
                          className="rounded-lg border border-white/[0.08] bg-black/15 px-3 py-2.5"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar
                              src={character.imageUrl}
                              name={character.name}
                              className="h-9 w-9 shrink-0 rounded-lg"
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <p className="truncate text-xs font-semibold text-white">
                                  {character.name}
                                </p>

                                <StatusBadge
                                  active={character.campaignStatus === "active"}
                                />
                              </div>

                              <p className="mt-0.5 truncate text-[10px] text-zinc-500">
                                {getCharacterSummary(character) || "Character"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2">
                            <Link
                              to={`/characters/${character.id}`}
                              state={{
                                from: `${location.pathname}${location.search}`,
                              }}
                              className="inline-flex rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                            >
                              Open
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div>
                  <h3 className="text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    Available
                  </h3>

                  {myAvailableCharacters.length === 0 ? (
                    <div className="mt-2">
                      <EmptyState>No available characters.</EmptyState>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-1.5">
                      {myAvailableCharacters.map((character) => {
                        const isBusy = busyCharacterId === character.id;

                        return (
                          <div
                            key={character.id}
                            className="rounded-lg border border-white/[0.08] bg-black/15 px-3 py-2.5"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <Avatar
                                src={character.imageUrl}
                                name={character.name}
                                className="h-9 w-9 shrink-0 rounded-lg"
                              />

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-semibold text-white">
                                  {character.name}
                                </p>

                                <p className="mt-0.5 truncate text-[10px] text-zinc-500">
                                  {getCharacterSummary(character) ||
                                    "Character"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleAssignToCampaign(character.id)
                                }
                                disabled={isBusy}
                                className="rounded-md bg-white px-2.5 py-1.5 text-[10px] font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isBusy ? "Attaching…" : "Attach"}
                              </button>

                              <Link
                                to={`/characters/${character.id}`}
                                state={{
                                  from: `${location.pathname}${location.search}`,
                                }}
                                className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                              >
                                Open
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

const StatusBadge = ({ active }: { active: boolean }) => (
  <span
    className={`rounded-md border px-1.5 py-0.5 text-[9px] font-medium ${
      active
        ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300"
        : "border-white/10 bg-white/[0.03] text-zinc-500"
    }`}
  >
    {active ? "Active" : "Inactive"}
  </span>
);

const EmptyState = ({ children }: { children: string }) => (
  <div className="rounded-lg border border-dashed border-white/[0.08] bg-black/10 px-3 py-4 text-center">
    <p className="text-[11px] text-zinc-500">{children}</p>
  </div>
);

const PageMessage = ({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "error";
}) => (
  <div className="min-h-screen bg-zinc-950 text-zinc-100">
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div
        className={`rounded-xl border p-6 text-center ${
          tone === "error"
            ? "border-red-500/20 bg-red-500/[0.08]"
            : "border-white/10 bg-zinc-900/35"
        }`}
      >
        {children}
      </div>
    </div>
  </div>
);

export default CampaignCharactersPage;
