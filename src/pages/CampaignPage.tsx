import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  classesById,
  speciesById,
} from "../rulesets/dnd/dnd2024/helpers";
import type {
  CampaignDoc,
  CampaignMemberDoc,
  CampaignRole,
} from "../types/campaign";

import Avatar from "../components/Avatar";

import InvitePlayersModal from "../components/InvitePlayersModal";

type CampaignPageState =
  | "loading"
  | "ready"
  | "not-found"
  | "forbidden"
  | "error";

type CharacterDoc = {
  ownerUid: string;
  campaignId: string | null;
  name: string;
  level: number;
  classId: string;
  speciesId: string;
};

type AppUserDoc = {
  displayName?: string;
  email?: string;
};

type CampaignCharacter = {
  id: string;
  ownerUid: string;
  ownerName?: string;
  ownerEmail?: string;
  campaignId: string | null;
  name: string;
  race?: string;
  className?: string;
  level?: number;
};

const formatRoleLabel = (role: CampaignRole) => {
  if (role === "gm") return "GM";
  if (role === "co-gm") return "Co-GM";
  return "Player";
};

const getRoleBadgeClass = (role: CampaignRole) => {
  if (role === "gm") {
    return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20";
  }

  if (role === "co-gm") {
    return "bg-amber-500/15 text-amber-300 border border-amber-400/20";
  }

  return "bg-blue-500/15 text-blue-300 border border-blue-400/20";
};

const CampaignPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pageState, setPageState] = useState<CampaignPageState>("loading");
  const [campaign, setCampaign] = useState<
    (CampaignDoc & { id: string }) | null
  >(null);
  const [membership, setMembership] = useState<CampaignMemberDoc | null>(null);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);

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
  const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
    const map: Record<string, AppUserDoc> = {};

    snapshot.docs.forEach((docSnap) => {
      map[docSnap.id] = docSnap.data() as AppUserDoc;
    });

    setUsersById(map);
  });

  return () => unsub();
}, []);

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

              const owner = usersById[data.ownerUid];

              const ownerName = owner?.displayName ?? "";
              const ownerEmail = owner?.email ?? "";


              return {
                id: characterSnap.id,
                ownerUid: data.ownerUid,
                ownerName,
                ownerEmail,
                campaignId: data.campaignId,
                name: data.name,
                race: speciesById[data.speciesId]?.name ?? data.speciesId,
                className: classesById[data.classId]?.name ?? data.classId,
                level: data.level,
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
    if (pageState !== "ready" || !campaignId) return;

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

  const systemLabel = useMemo(() => {
    if (!campaign) return "Tabletop RPG";
    return campaign.systemLabel ?? campaign.system ?? "Tabletop RPG";
  }, [campaign]);

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-sm text-zinc-400">Loading campaign...</p>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
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
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
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

  if (pageState === "error" || !campaign || !membership) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm text-red-200/80">
              We could not load this campaign right now.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Retry
              </button>

              <Link
                to="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
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
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to home
          </Link>

          <button
            onClick={() => navigate(`/campaigns/${campaign.id}/settings`)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {isGm ? "Campaign settings" : "View details"}
          </button>
        </div>

        <section className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 shadow-2xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Campaign overview
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {campaign.name}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeClass(
                    membership.role,
                  )}`}
                >
                  {formatRoleLabel(membership.role)}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
                {campaign.description?.trim()
                  ? campaign.description
                  : "No campaign description has been added yet."}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                  {systemLabel}
                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                  {campaign.visibility === "public" ? "Public" : "Private"}
                </div>

                {campaign.archived && (
                  <div className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-300">
                    Archived
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
              <Link
                to={`/campaigns/${campaign.id}/journal`}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
              >
                Journal
              </Link>

              <Link
                to={`/campaigns/${campaign.id}/characters`}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
              >
                Characters
              </Link>

              <Link
                to={`/campaigns/${campaign.id}/maps`}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
              >
                Maps
              </Link>

              <Link
                to={`/campaigns/${campaign.id}/handouts`}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
              >
                Handouts
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white sm:text-2xl">
                    Quick actions
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Jump into the parts of the campaign you are most likely to
                    use.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {isGm ? (
                  <>
                    <Link
                      to={`/campaigns/${campaign.id}/session`}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                    >
                      <h3 className="text-base font-semibold text-white">
                        Run session
                      </h3>
                      <p className="mt-2 text-sm text-zinc-400">
                        Open the campaign in a focused GM-friendly session view.
                      </p>
                    </Link>

                    <Link
                      to={`/campaigns/${campaign.id}/members`}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                    >
                      <h3 className="text-base font-semibold text-white">
                        Manage players
                      </h3>
                      <p className="mt-2 text-sm text-zinc-400">
                        Invite users, review members, and control roles.
                      </p>
                    </Link>

                    <Link
                      to={`/campaigns/${campaign.id}/maps/new`}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                    >
                      <h3 className="text-base font-semibold text-white">
                        Add map
                      </h3>
                      <p className="mt-2 text-sm text-zinc-400">
                        Create a new map and prepare player-visible content.
                      </p>
                    </Link>

                    <Link
                      to={`/campaigns/${campaign.id}/handouts/new`}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                    >
                      <h3 className="text-base font-semibold text-white">
                        Create handout
                      </h3>
                      <p className="mt-2 text-sm text-zinc-400">
                        Add lore, clues, notes, or revealable documents.
                      </p>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/campaigns/${campaign.id}/characters`}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                    >
                      <h3 className="text-base font-semibold text-white">
                        My character
                      </h3>
                      <p className="mt-2 text-sm text-zinc-400">
                        Open the character you are using in this campaign.
                      </p>
                    </Link>

                    <Link
                      to={`/campaigns/${campaign.id}/journal`}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                    >
                      <h3 className="text-base font-semibold text-white">
                        Party journal
                      </h3>
                      <p className="mt-2 text-sm text-zinc-400">
                        Review revealed notes, summaries, and campaign events.
                      </p>
                    </Link>

                    <Link
                      to={`/campaigns/${campaign.id}/maps`}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                    >
                      <h3 className="text-base font-semibold text-white">
                        World map
                      </h3>
                      <p className="mt-2 text-sm text-zinc-400">
                        See the maps and locations the GM has revealed.
                      </p>
                    </Link>

                    <Link
                      to={`/campaigns/${campaign.id}/handouts`}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                    >
                      <h3 className="text-base font-semibold text-white">
                        Handouts
                      </h3>
                      <p className="mt-2 text-sm text-zinc-400">
                        Open letters, clues, lore, and other shared information.
                      </p>
                    </Link>
                  </>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white sm:text-2xl">
                    Party overview
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Current party members in this campaign.
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                  {campaignCharacters.length} member
                  {campaignCharacters.length === 1 ? "" : "s"}
                </div>
              </div>

              {campaignCharactersLoading ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                  <p className="text-sm text-zinc-400">Loading party...</p>
                </div>
              ) : campaignCharacters.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                  <p className="text-sm text-zinc-300">No party members yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaignCharacters.map((character) => (
                    <div
                      key={character.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                    >
                      {/* LEFT SIDE */}
                      <div className="flex items-center gap-4 min-w-0">
                        <Avatar
                          uid={character.ownerUid}
                          name={character.ownerName}
                          email={character.ownerEmail}
                          size="md"
                        />

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {character.name}
                          </p>

                          <p className="text-xs text-zinc-400 truncate">
                            {[character.race, character.className]
                              .filter(Boolean)
                              .join(" • ")}
                          </p>

                          <p className="text-xs text-zinc-500 truncate">
                            {character.ownerName ||
                              character.ownerEmail ||
                              character.ownerUid}
                          </p>
                        </div>
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="flex items-center gap-3">
                        {/* LEVEL BADGE */}
                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white">
                          Lv {character.level ?? "-"}
                        </div>

                        <Link
                          to={`/characters/${character.id}`}
                          className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white sm:text-2xl">
                    Characters
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Characters currently attached to this campaign.
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                  {campaignCharacters.length} character
                  {campaignCharacters.length === 1 ? "" : "s"}
                </div>
              </div>

              {campaignCharactersLoading ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                  <p className="text-sm text-zinc-400">Loading characters...</p>
                </div>
              ) : campaignCharacters.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                  <p className="text-sm text-zinc-300">
                    No characters have been assigned yet.
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Open the Characters page to attach characters to this
                    campaign.
                  </p>
                  <div className="mt-4">
                    <Link
                      to={`/campaigns/${campaign.id}/characters`}
                      className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Open characters page
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaignCharacters.map((character) => (
                    <div
                      key={character.id}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-white sm:text-lg">
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

                          <p className="mt-1 text-sm text-zinc-500">
                            Player:{" "}
                            {character.ownerName ||
                            character.ownerEmail ||
                            character.ownerUid}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/characters/${character.id}`}
                            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                          >
                            Open
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
              <h2 className="text-xl font-semibold text-white">Your access</h2>
              <p className="mt-1 text-sm text-zinc-400">
                This is what role you currently have in the campaign.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-zinc-400">Role</p>
                    <p className="mt-1 text-base font-semibold text-white">
                      {formatRoleLabel(membership.role)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeClass(
                      membership.role,
                    )}`}
                  >
                    {formatRoleLabel(membership.role)}
                  </span>
                </div>
              </div>

              <div className="mt-4 text-sm text-zinc-400">
                {isGm
                  ? "You can manage campaign content, members, and GM-only information."
                  : "You can access the player-visible parts of the campaign and your assigned character information."}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
              <h2 className="text-xl font-semibold text-white">Players</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Members currently in this campaign.
              </p>

              {membersLoading ? (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-5 text-center">
                  <p className="text-sm text-zinc-400">Loading players...</p>
                </div>
              ) : members.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-5 text-center">
                  <p className="text-sm text-zinc-300">
                    No members found in this campaign.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.uid}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white">
                            {member.displayName ||
                              member.email ||
                              member.uid}
                          </p>
                          <p className="mt-1 text-sm text-zinc-400">
                            {member.email || "No email available"}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeClass(
                            member.role,
                          )}`}
                        >
                          {formatRoleLabel(member.role)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isGm && (
                <button
                  onClick={() => setInviteModalOpen(true)}
                  className="mt-5 w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  Invite players
                </button>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
              <h2 className="text-xl font-semibold text-white">Coming next</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Good next modules for this campaign page.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm font-medium text-white">
                    Recent activity
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Show latest notes, reveals, updates, and session logs.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm font-medium text-white">
                    Party summary
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Show average level, assigned players, and session readiness.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm font-medium text-white">
                    GM campaign tools
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Award XP, review notes, and manage campaign progression.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {campaign && isGm && (
        <InvitePlayersModal
          campaignId={campaign.id}
          campaignName={campaign.name}
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CampaignPage;