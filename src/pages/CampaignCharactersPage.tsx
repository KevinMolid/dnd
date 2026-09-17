import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

import type { CampaignDoc, CampaignMemberDoc } from "../types/campaign";

import Avatar from "../components/Avatar";

type PageState = "loading" | "ready" | "not-found" | "forbidden" | "error";
type CampaignCharacterStatus = "inactive" | "active";
type CharacterClaimMode = "locked" | "open" | "assigned";

type PublicCharacterDoc = {
  characterId?: string;
  ownerUid?: string | null;
  createdByUid?: string | null;
  campaignStatus?: CampaignCharacterStatus;
  claimMode?: CharacterClaimMode;
  claimableByUid?: string | null;

  name?: string;
  race?: string;
  speciesName?: string;
  className?: string;
  level?: number;
  imageUrl?: string;
};

type CampaignMemberListItem = {
  uid: string;
  displayName: string;
  email?: string;
  role?: CampaignMemberDoc["role"];
};

type CampaignCharacter = {
  id: string;
  ownerUid: string | null;
  createdByUid?: string | null;

  campaignId: string;
  campaignStatus: CampaignCharacterStatus;

  claimMode: CharacterClaimMode;
  claimableByUid: string | null;

  name: string;
  race?: string;
  className?: string;
  level?: number;
  imageUrl?: string;
};

type AppUserDoc = {
  displayName?: string;
  email?: string;
};

const getCampaignStatus = (value: unknown): CampaignCharacterStatus =>
  value === "active" ? "active" : "inactive";

const getClaimMode = (
  value: unknown,
  ownerUid: string | null,
): CharacterClaimMode => {
  if (ownerUid) {
    return "locked";
  }

  return value === "open" || value === "assigned" ? value : "locked";
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
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();
  const location = useLocation();

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

  const [members, setMembers] = useState<CampaignMemberListItem[]>([]);
  const [busyCharacterId, setBusyCharacterId] = useState<string | null>(null);
  const [accessEditorId, setAccessEditorId] = useState<string | null>(null);
  const [portraitCharacter, setPortraitCharacter] =
    useState<CampaignCharacter | null>(null);

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

    void loadAccess();
  }, [campaignId, user]);

  const isGm = myMembership?.role === "gm" || myMembership?.role === "co-gm";

  /*
   * The campaign roster is intentionally loaded from the public party
   * collection. Campaign members must not need read access to the private
   * /characters documents just to see the roster.
   */
  useEffect(() => {
    if (pageState !== "ready" || !campaignId) {
      return;
    }

    setCampaignCharactersLoading(true);

    const unsub = onSnapshot(
      collection(db, "campaigns", campaignId, "party"),
      (snapshot) => {
        const nextCharacters: CampaignCharacter[] = snapshot.docs.map(
          (characterSnap) => {
            const data = characterSnap.data() as PublicCharacterDoc;
            const ownerUid = data.ownerUid ?? null;

            return {
              id: data.characterId || characterSnap.id,
              ownerUid,
              createdByUid: data.createdByUid ?? null,
              campaignId,
              campaignStatus: getCampaignStatus(data.campaignStatus),
              claimMode: getClaimMode(data.claimMode, ownerUid),
              claimableByUid: data.claimableByUid ?? null,
              name: data.name?.trim() || "Unnamed Character",
              race: data.race?.trim() || data.speciesName?.trim() || undefined,
              className: data.className?.trim() || undefined,
              level: typeof data.level === "number" ? data.level : undefined,
              imageUrl: data.imageUrl?.trim() || undefined,
            };
          },
        );

        nextCharacters.sort((a, b) => a.name.localeCompare(b.name));
        setCampaignCharacters(nextCharacters);
        setCampaignCharactersLoading(false);
      },
      (error) => {
        console.error("Failed to load campaign character roster:", error);
        setCampaignCharacters([]);
        setCampaignCharactersLoading(false);
      },
    );

    return () => unsub();
  }, [campaignId, pageState]);

  /*
   * GM-only member list used by the Assigned access mode. We resolve names
   * from /users so the access picker remains useful even if the membership
   * document itself only contains role/status information.
   */
  useEffect(() => {
    if (pageState !== "ready" || !campaignId) {
      setMembers([]);
      return;
    }

    const unsub = onSnapshot(
      collection(db, "campaigns", campaignId, "members"),
      async (snapshot) => {
        try {
          const nextMembers = await Promise.all(
            snapshot.docs.map(async (memberSnap) => {
              const membership = memberSnap.data() as CampaignMemberDoc;
              let displayName = "";
              let email = "";

              try {
                const userSnap = await getDoc(doc(db, "users", memberSnap.id));

                if (userSnap.exists()) {
                  const userData = userSnap.data() as AppUserDoc;
                  displayName = userData.displayName?.trim() ?? "";
                  email = userData.email?.trim() ?? "";
                }
              } catch (error) {
                console.warn(
                  `Could not load user ${memberSnap.id} for assignment picker:`,
                  error,
                );
              }

              return {
                uid: memberSnap.id,
                displayName:
                  displayName || email || `Player ${memberSnap.id.slice(0, 6)}`,
                email: email || undefined,
                role: membership.role,
              } satisfies CampaignMemberListItem;
            }),
          );

          nextMembers.sort((a, b) =>
            a.displayName.localeCompare(b.displayName),
          );
          setMembers(nextMembers);
        } catch (error) {
          console.error("Failed to load campaign members:", error);
          setMembers([]);
        }
      },
      (error) => {
        console.error("Failed to subscribe to campaign members:", error);
        setMembers([]);
      },
    );

    return () => unsub();
  }, [campaignId, pageState]);

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

  const openCount = useMemo(
    () =>
      campaignCharacters.filter(
        (character) => !character.ownerUid && character.claimMode === "open",
      ).length,
    [campaignCharacters],
  );

  const assignedCount = useMemo(
    () =>
      campaignCharacters.filter(
        (character) =>
          !character.ownerUid && character.claimMode === "assigned",
      ).length,
    [campaignCharacters],
  );

  const lockedCount = useMemo(
    () =>
      campaignCharacters.filter(
        (character) => !character.ownerUid && character.claimMode === "locked",
      ).length,
    [campaignCharacters],
  );

  const getMemberName = (uid: string | null | undefined) => {
    if (!uid) {
      return undefined;
    }

    if (uid === user?.uid) {
      return "You";
    }

    return members.find((member) => member.uid === uid)?.displayName;
  };

  const updateCharacterAndParty = async (
    characterId: string,
    updates: Record<string, unknown>,
  ) => {
    if (!campaignId) {
      return;
    }

    const batch = writeBatch(db);

    batch.update(doc(db, "characters", characterId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    batch.update(doc(db, "campaigns", campaignId, "party", characterId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
  };

  const handleSetCampaignStatus = async (
    characterId: string,
    nextStatus: CampaignCharacterStatus,
  ) => {
    setBusyCharacterId(characterId);

    try {
      await updateCharacterAndParty(characterId, {
        campaignStatus: nextStatus,
      });
    } catch (error) {
      console.error("Failed to update campaign character status:", error);
      alert("Could not update character status.");
    } finally {
      setBusyCharacterId(null);
    }
  };

  const handleSetAccess = async (
    character: CampaignCharacter,
    claimMode: CharacterClaimMode,
    claimableByUid: string | null = null,
  ) => {
    if (!isGm || character.ownerUid) {
      return;
    }

    if (claimMode === "assigned" && !claimableByUid) {
      return;
    }

    setBusyCharacterId(character.id);

    try {
      await updateCharacterAndParty(character.id, {
        claimMode,
        claimableByUid: claimMode === "assigned" ? claimableByUid : null,
      });

      setAccessEditorId(null);
    } catch (error) {
      console.error("Failed to update character access:", error);
      alert("Could not update character access.");
    } finally {
      setBusyCharacterId(null);
    }
  };

  const handleClaimCharacter = async (character: CampaignCharacter) => {
    if (!user || !campaignId) {
      return;
    }

    setBusyCharacterId(character.id);

    try {
      /*
       * The public party document is readable to campaign members and is used
       * as the transaction's claim source. Firestore rules must enforce the
       * corresponding private /characters ownership transition.
       */
      await runTransaction(db, async (transaction) => {
        const partyRef = doc(
          db,
          "campaigns",
          campaignId,
          "party",
          character.id,
        );
        const characterRef = doc(db, "characters", character.id);

        const partySnap = await transaction.get(partyRef);

        if (!partySnap.exists()) {
          throw new Error("Character is no longer available.");
        }

        const partyData = partySnap.data() as PublicCharacterDoc;
        const ownerUid = partyData.ownerUid ?? null;
        const claimMode = getClaimMode(partyData.claimMode, ownerUid);

        if (ownerUid) {
          throw new Error("Character has already been claimed.");
        }

        const canClaim =
          claimMode === "open" ||
          (claimMode === "assigned" && partyData.claimableByUid === user.uid);

        if (!canClaim) {
          throw new Error("This character is not available to you.");
        }

        const updates = {
          ownerUid: user.uid,
          claimMode: "locked" as const,
          claimableByUid: null,
          updatedAt: serverTimestamp(),
        };

        transaction.update(characterRef, updates);
        transaction.update(partyRef, updates);
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

  const canPlayerOpen = (character: CampaignCharacter) =>
    isGm ||
    character.ownerUid === user?.uid ||
    (!character.ownerUid &&
      character.claimMode === "assigned" &&
      character.claimableByUid === user?.uid);

  const canPlayerClaim = (character: CampaignCharacter) =>
    !character.ownerUid &&
    (character.claimMode === "open" ||
      (character.claimMode === "assigned" &&
        character.claimableByUid === user?.uid));

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

  const renderAccessBadge = (character: CampaignCharacter) => {
    if (character.ownerUid) {
      const ownerName = getMemberName(character.ownerUid);

      return (
        <span className="rounded-md border border-sky-500/20 bg-sky-500/[0.07] px-1.5 py-0.5 text-[10px] font-medium text-sky-300">
          {character.ownerUid === user?.uid
            ? "Yours"
            : ownerName || "Assigned player"}
        </span>
      );
    }

    if (character.claimMode === "open") {
      return (
        <span className="rounded-md border border-amber-500/20 bg-amber-500/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
          Available
        </span>
      );
    }

    if (character.claimMode === "assigned") {
      const assignedName = getMemberName(character.claimableByUid);

      return (
        <span className="rounded-md border border-violet-500/20 bg-violet-500/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-violet-300">
          {character.claimableByUid === user?.uid
            ? "Reserved for you"
            : isGm && assignedName
              ? `Reserved: ${assignedName}`
              : "Reserved"}
        </span>
      );
    }

    return isGm ? (
      <span className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
        <i className="fa-solid fa-lock mr-1" />
        Locked
      </span>
    ) : null;
  };

  const renderAccessEditor = (character: CampaignCharacter) => {
    if (!isGm || character.ownerUid || accessEditorId !== character.id) {
      return null;
    }

    return (
      <div className="mt-2 rounded-lg border border-white/[0.08] bg-black/20 p-2.5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
              Character access
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">
              Locked hides the sheet. Open lets any player claim it. Assigned
              lets only the selected player inspect and claim it.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => void handleSetAccess(character, "locked")}
              disabled={busyCharacterId === character.id}
              className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                character.claimMode === "locked"
                  ? "border-white/20 bg-white/[0.1] text-white"
                  : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
              }`}
            >
              <i className="fa-solid fa-lock mr-1.5" />
              Locked
            </button>

            <button
              type="button"
              onClick={() => void handleSetAccess(character, "open")}
              disabled={busyCharacterId === character.id}
              className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                character.claimMode === "open"
                  ? "border-amber-500/30 bg-amber-500/[0.12] text-amber-200"
                  : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]"
              }`}
            >
              Open to players
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-1.5 sm:flex-row sm:items-center">
          <span className="text-xs font-medium text-zinc-400">
            Assign to player
          </span>

          <select
            value={
              character.claimMode === "assigned"
                ? (character.claimableByUid ?? "")
                : ""
            }
            onChange={(event) => {
              const uid = event.target.value;

              if (uid) {
                void handleSetAccess(character, "assigned", uid);
              }
            }}
            disabled={busyCharacterId === character.id}
            className="h-8 min-w-52 rounded-md border border-white/[0.08] bg-zinc-950 px-2 text-xs text-zinc-200 outline-none transition focus:border-white/20 disabled:opacity-50"
          >
            <option value="">Select player…</option>
            {members
              .filter(
                (member) => member.role !== "gm" && member.role !== "co-gm",
              )
              .map((member) => (
                <option key={member.uid} value={member.uid}>
                  {member.displayName}
                </option>
              ))}
          </select>
        </div>
      </div>
    );
  };

  const renderCampaignCharacter = (
    character: CampaignCharacter,
    isActive: boolean,
  ) => {
    const isBusy = busyCharacterId === character.id;
    const canOpen = canPlayerOpen(character);
    const canClaim = canPlayerClaim(character);

    return (
      <div
        key={character.id}
        className="rounded-lg border border-white/[0.08] bg-black/15 px-3 py-3 transition hover:border-white/15 hover:bg-white/[0.025]"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {character.imageUrl ? (
              <button
                type="button"
                onClick={() => setPortraitCharacter(character)}
                aria-label={`Enlarge portrait for ${character.name}`}
                title="Enlarge portrait"
                className="group shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
              >
                <Avatar
                  src={character.imageUrl}
                  name={character.name}
                  className="h-12 w-12 rounded-lg transition group-hover:brightness-110"
                />
              </button>
            ) : (
              <Avatar
                src={character.imageUrl}
                name={character.name}
                className="h-12 w-12 shrink-0 rounded-lg"
              />
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="truncate text-sm font-semibold text-white">
                  {character.name}
                </h3>

                <StatusBadge active={isActive} />
                {renderAccessBadge(character)}
              </div>

              <p className="mt-0.5 truncate text-xs text-zinc-400">
                {getCharacterSummary(character) || "Character"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
            {canOpen ? (
              <Link
                to={`/characters/${character.id}`}
                state={{
                  from: `${location.pathname}${location.search}`,
                  label: "Back to campaign",
                }}
                className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.09] hover:text-white"
              >
                Open
              </Link>
            ) : null}

            {canClaim ? (
              <button
                type="button"
                onClick={() => void handleClaimCharacter(character)}
                disabled={isBusy}
                className="rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isBusy ? "Claiming…" : "Claim"}
              </button>
            ) : null}

            {isGm ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    void handleSetCampaignStatus(
                      character.id,
                      isActive ? "inactive" : "active",
                    )
                  }
                  disabled={isBusy}
                  className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                    isActive
                      ? "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                      : "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300 hover:bg-emerald-500/[0.12]"
                  }`}
                >
                  {isActive ? "Set inactive" : "Set active"}
                </button>

                {!character.ownerUid ? (
                  <button
                    type="button"
                    onClick={() =>
                      setAccessEditorId((current) =>
                        current === character.id ? null : character.id,
                      )
                    }
                    disabled={isBusy}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
                  >
                    <i className="fa-solid fa-key mr-1.5" />
                    Access
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        {renderAccessEditor(character)}
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
            className="inline-flex rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.09] hover:text-white"
          >
            Create campaign character
          </Link>
        ) : null}
      </div>

      {isGm ? (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-zinc-400">
            <i className="fa-solid fa-lock mr-1" />
            {lockedCount} locked
          </span>
          <span className="rounded-md border border-amber-500/20 bg-amber-500/[0.08] px-2 py-1 text-[10px] text-amber-300">
            {openCount} open
          </span>
          <span className="rounded-md border border-violet-500/20 bg-violet-500/[0.08] px-2 py-1 text-[10px] text-violet-300">
            {assignedCount} reserved
          </span>
        </div>
      ) : null}

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

                <span className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.08] px-2 py-0.5 text-[10px] text-emerald-300">
                  {activeCampaignCharacters.length} active
                </span>
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

                <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-400">
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

      {portraitCharacter?.imageUrl ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${portraitCharacter.name} portrait`}
          onMouseDown={() => setPortraitCharacter(null)}
        >
          <button
            type="button"
            onClick={() => setPortraitCharacter(null)}
            aria-label="Close portrait"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
          >
            <i className="fa-solid fa-xmark" />
          </button>

          <img
            src={portraitCharacter.imageUrl}
            alt={portraitCharacter.name}
            onMouseDown={(event) => event.stopPropagation()}
            className="max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] rounded-xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </div>
  );
};

const StatusBadge = ({ active }: { active: boolean }) => (
  <span
    className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${
      active
        ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300"
        : "border-white/10 bg-white/[0.03] text-zinc-400"
    }`}
  >
    {active ? "Active" : "Inactive"}
  </span>
);

const EmptyState = ({ children }: { children: string }) => (
  <div className="rounded-lg border border-dashed border-white/[0.08] bg-black/10 px-3 py-4 text-center">
    <p className="text-xs text-zinc-400">{children}</p>
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
