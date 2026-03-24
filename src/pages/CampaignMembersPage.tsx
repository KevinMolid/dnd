import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import InvitePlayersModal from "../components/InvitePlayersModal";
import type {
  CampaignDoc,
  CampaignMemberDoc,
  CampaignRole,
} from "../types/campaign";
import type { CampaignInviteDoc } from "../types/invite";

import Avatar from "../components/Avatar";

type CampaignMember = CampaignMemberDoc & {
  id: string;
};

type CampaignInvite = CampaignInviteDoc & {
  id: string;
};

type PageState = "loading" | "ready" | "not-found" | "forbidden" | "error";

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

const getDateValue = (value: unknown): number => {
  if (!value) return 0;

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().getTime();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "number") {
    return value;
  }

  return 0;
};

const formatDateTime = (value: unknown) => {
  const timestamp = getDateValue(value);

  if (!timestamp) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
};

const CampaignMembersPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [campaign, setCampaign] = useState<
    (CampaignDoc & { id: string }) | null
  >(null);
  const [myMembership, setMyMembership] = useState<CampaignMemberDoc | null>(
    null,
  );

  const [members, setMembers] = useState<CampaignMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);

  const [invites, setInvites] = useState<CampaignInvite[]>([]);
  const [invitesLoading, setInvitesLoading] = useState(true);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    const loadAccess = async () => {
      if (!user || !campaignId) {
        setPageState("forbidden");
        return;
      }

      setPageState("loading");

      try {
        const campaignRef = doc(db, "campaigns", campaignId);
        const myMemberRef = doc(
          db,
          "campaigns",
          campaignId,
          "members",
          user.uid,
        );

        const [campaignSnap, myMemberSnap] = await Promise.all([
          getDoc(campaignRef),
          getDoc(myMemberRef),
        ]);

        if (!campaignSnap.exists()) {
          setCampaign(null);
          setMyMembership(null);
          setPageState("not-found");
          return;
        }

        if (!myMemberSnap.exists()) {
          setCampaign(null);
          setMyMembership(null);
          setPageState("forbidden");
          return;
        }

        setCampaign({
          id: campaignSnap.id,
          ...(campaignSnap.data() as CampaignDoc),
        });

        setMyMembership(myMemberSnap.data() as CampaignMemberDoc);
        setPageState("ready");
      } catch (error) {
        console.error("Failed to load campaign members page:", error);
        setCampaign(null);
        setMyMembership(null);
        setPageState("error");
      }
    };

    loadAccess();
  }, [campaignId, user]);

  useEffect(() => {
    if (pageState !== "ready" || !campaignId) return;

    setMembersLoading(true);

    const membersRef = collection(db, "campaigns", campaignId, "members");

    const unsub = onSnapshot(
      membersRef,
      (snapshot) => {
        const nextMembers: CampaignMember[] = snapshot.docs.map(
          (memberDoc) => ({
            id: memberDoc.id,
            ...(memberDoc.data() as CampaignMemberDoc),
          }),
        );

        nextMembers.sort((a, b) => {
          const roleOrder = { gm: 0, "co-gm": 1, player: 2 };
          const roleDiff = roleOrder[a.role] - roleOrder[b.role];

          if (roleDiff !== 0) return roleDiff;

          const aName = (a.displayName || a.email || a.uid).toLowerCase();
          const bName = (b.displayName || b.email || b.uid).toLowerCase();

          return aName.localeCompare(bName);
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

  useEffect(() => {
    if (pageState !== "ready" || !campaignId) return;

    setInvitesLoading(true);

    const invitesQuery = query(
      collection(db, "campaignInvites"),
      where("campaignId", "==", campaignId),
    );

    const unsub = onSnapshot(
      invitesQuery,
      (snapshot) => {
        const nextInvites: CampaignInvite[] = snapshot.docs.map(
          (inviteDoc) => ({
            id: inviteDoc.id,
            ...(inviteDoc.data() as CampaignInviteDoc),
          }),
        );

        nextInvites.sort((a, b) => {
          const revokedDiff = Number(a.revoked) - Number(b.revoked);
          if (revokedDiff !== 0) return revokedDiff;

          return getDateValue(b.createdAt) - getDateValue(a.createdAt);
        });

        setInvites(nextInvites);
        setInvitesLoading(false);
      },
      (error) => {
        console.error("Failed to load campaign invites:", error);
        setInvites([]);
        setInvitesLoading(false);
      },
    );

    return () => unsub();
  }, [campaignId, pageState]);

  const isGm = myMembership?.role === "gm" || myMembership?.role === "co-gm";

  const activeInvites = useMemo(
    () => invites.filter((invite) => !invite.revoked),
    [invites],
  );

  const revokedInvites = useMemo(
    () => invites.filter((invite) => invite.revoked),
    [invites],
  );

  const handleSetRole = async (
    member: CampaignMember,
    nextRole: CampaignRole,
  ) => {
    if (!campaignId || member.role === nextRole) return;

    setBusyKey(`role-${member.id}`);

    try {
      const memberRef = doc(db, "campaigns", campaignId, "members", member.id);
      await updateDoc(memberRef, { role: nextRole });
    } catch (error) {
      console.error("Failed to update member role:", error);
      alert("Could not update member role.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleRemoveMember = async (member: CampaignMember) => {
    if (!campaignId) return;

    const label = member.displayName || member.email || member.uid;
    const confirmed = window.confirm(`Remove ${label} from this campaign?`);

    if (!confirmed) return;

    setBusyKey(`remove-${member.id}`);

    try {
      const memberRef = doc(db, "campaigns", campaignId, "members", member.id);
      await deleteDoc(memberRef);
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Could not remove member.");
    } finally {
      setBusyKey(null);
    }
  };

  const handleRevokeInvite = async (invite: CampaignInvite) => {
    const confirmed = window.confirm("Revoke this invite link?");

    if (!confirmed) return;

    setBusyKey(`invite-${invite.id}`);

    try {
      const inviteRef = doc(db, "campaignInvites", invite.id);
      await updateDoc(inviteRef, { revoked: true });
    } catch (error) {
      console.error("Failed to revoke invite:", error);
      alert("Could not revoke invite.");
    } finally {
      setBusyKey(null);
    }
  };

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-sm text-zinc-400">Loading members...</p>
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

  if (pageState === "error" || !campaign || !myMembership) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm text-red-200/80">
              We could not load the members page right now.
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
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to={`/campaigns/${campaign.id}`}
              className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
            >
              ← Back to campaign
            </Link>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Members
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Manage players, roles, and invite links for{" "}
              <span className="font-medium text-white">{campaign.name}</span>.
            </p>
          </div>

          {isGm && (
            <button
              onClick={() => setInviteModalOpen(true)}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              Invite players
            </button>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Campaign members
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Everyone who currently has access to this campaign.
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                {members.length} member{members.length === 1 ? "" : "s"}
              </div>
            </div>

            {membersLoading ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                <p className="text-sm text-zinc-400">Loading members...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                <p className="text-sm text-zinc-300">No members found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((member) => {
                  const isOwner = member.uid === campaign.ownerUid;
                  const isSelf = user?.uid === member.uid;
                  const canEditRole =
                    isGm && !isOwner && !isSelf && member.role !== "gm";
                  const canRemove = isGm && !isOwner && !isSelf;

                  return (
                    <div
                      key={member.id}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0 flex items-center gap-3">
                          <Avatar
                            name={
                              member.displayName || member.email || member.uid
                            }
                            src={member.imageUrl || ""}
                            size="lg"
                          />

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-semibold text-white sm:text-lg">
                                {member.displayName ||
                                  member.email ||
                                  member.uid}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getRoleBadgeClass(
                                  member.role,
                                )}`}
                              >
                                {formatRoleLabel(member.role)}
                              </span>

                              {isOwner && (
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                                  Owner
                                </span>
                              )}

                              {isSelf && (
                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                                  You
                                </span>
                              )}
                            </div>

                            <p className="mt-2 text-sm text-zinc-400">
                              {member.email || member.uid}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              Joined {formatDateTime(member.joinedAt)}
                            </p>
                          </div>
                        </div>

                        {isGm && (
                          <div className="flex flex-col gap-2 sm:flex-row">
                            {canEditRole && (
                              <>
                                {member.role === "player" ? (
                                  <button
                                    onClick={() =>
                                      handleSetRole(member, "co-gm")
                                    }
                                    disabled={busyKey === `role-${member.id}`}
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    Make co-GM
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleSetRole(member, "player")
                                    }
                                    disabled={busyKey === `role-${member.id}`}
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    Set as player
                                  </button>
                                )}
                              </>
                            )}

                            {canRemove && (
                              <button
                                onClick={() => handleRemoveMember(member)}
                                disabled={busyKey === `remove-${member.id}`}
                                className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
              <h2 className="text-xl font-semibold text-white">Your access</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Your current role in this campaign.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-zinc-400">Role</p>
                    <p className="mt-1 text-base font-semibold text-white">
                      {formatRoleLabel(myMembership.role)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeClass(
                      myMembership.role,
                    )}`}
                  >
                    {formatRoleLabel(myMembership.role)}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-zinc-400">
                {isGm
                  ? "You can manage members and invite links."
                  : "You can view the campaign roster, but only GMs can manage it."}
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Active invites
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Invite links that can still be used.
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                  {activeInvites.length}
                </div>
              </div>

              {invitesLoading ? (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-5 text-center">
                  <p className="text-sm text-zinc-400">Loading invites...</p>
                </div>
              ) : activeInvites.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-5 text-center">
                  <p className="text-sm text-zinc-300">No active invites.</p>
                  {isGm && (
                    <button
                      onClick={() => setInviteModalOpen(true)}
                      className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Create invite
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {activeInvites.map((invite) => {
                    const remainingUses =
                      typeof invite.maxUses === "number"
                        ? Math.max(0, invite.maxUses - invite.useCount)
                        : null;

                    return (
                      <div
                        key={invite.id}
                        className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                              Role: {invite.role}
                            </span>

                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                              Used: {invite.useCount}
                              {typeof invite.maxUses === "number"
                                ? ` / ${invite.maxUses}`
                                : ""}
                            </span>

                            {remainingUses !== null && (
                              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                                Remaining: {remainingUses}
                              </span>
                            )}
                          </div>

                          <p className="break-all text-xs text-zinc-500">
                            {window.location.origin}/invite/{invite.id}
                          </p>

                          <div className="text-xs text-zinc-500">
                            Created {formatDateTime(invite.createdAt)}
                          </div>

                          {isGm && (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    `${window.location.origin}/invite/${invite.id}`,
                                  )
                                }
                                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                              >
                                Copy
                              </button>

                              <button
                                onClick={() => handleRevokeInvite(invite)}
                                disabled={busyKey === `invite-${invite.id}`}
                                className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Revoke
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {revokedInvites.length > 0 && (
              <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
                <h2 className="text-xl font-semibold text-white">
                  Revoked invites
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Old invite links that are no longer valid.
                </p>

                <div className="mt-5 space-y-3">
                  {revokedInvites.slice(0, 5).map((invite) => (
                    <div
                      key={invite.id}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                          Role: {invite.role}
                        </span>

                        <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs text-red-200">
                          Revoked
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-zinc-500">
                        Created {formatDateTime(invite.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>

      {isGm && (
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

export default CampaignMembersPage;
