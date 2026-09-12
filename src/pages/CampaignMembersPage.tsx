import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
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
    return <PageMessage>Loading members…</PageMessage>;
  }

  if (pageState === "not-found") {
    return <PageMessage>Campaign not found.</PageMessage>;
  }

  if (pageState === "forbidden") {
    return <PageMessage>You do not have access to this campaign.</PageMessage>;
  }

  if (pageState === "error" || !campaign || !myMembership) {
    return <PageMessage error>Could not load campaign members.</PageMessage>;
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">Players</h2>

        {isGm ? (
          <button
            type="button"
            onClick={() => setInviteModalOpen(true)}
            className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.09] hover:text-white"
          >
            Invite players
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.85fr)]">
        <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">
              Campaign members
            </h3>

            <span className="text-[10px] text-zinc-500">
              {members.length} member{members.length === 1 ? "" : "s"}
            </span>
          </div>

          {membersLoading ? (
            <EmptyState>Loading members…</EmptyState>
          ) : members.length === 0 ? (
            <EmptyState>No members found.</EmptyState>
          ) : (
            <div className="space-y-1.5">
              {members.map((member) => {
                const isOwner = member.uid === campaign.ownerUid;
                const isSelf = user?.uid === member.uid;
                const canEditRole =
                  isGm && !isOwner && !isSelf && member.role !== "gm";
                const canRemove = isGm && !isOwner && !isSelf;

                return (
                  <div
                    key={member.id}
                    className="rounded-lg border border-white/[0.08] bg-black/15 px-3 py-2.5 transition hover:border-white/15 hover:bg-white/[0.025]"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar
                          name={
                            member.displayName || member.email || member.uid
                          }
                          src={member.imageUrl || ""}
                          className="h-10 w-10 shrink-0 rounded-full"
                        />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h4 className="truncate text-xs font-semibold text-white">
                              {member.displayName || member.email || member.uid}
                            </h4>

                            <span
                              className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${getRoleBadgeClass(
                                member.role,
                              )}`}
                            >
                              {formatRoleLabel(member.role)}
                            </span>

                            {isOwner ? (
                              <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-zinc-500">
                                Owner
                              </span>
                            ) : null}

                            {isSelf ? (
                              <span className="rounded-md border border-sky-500/20 bg-sky-500/[0.07] px-1.5 py-0.5 text-[9px] text-sky-300">
                                You
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-0.5 truncate text-[10px] text-zinc-500">
                            {member.email || member.uid}
                          </p>

                          <p className="mt-0.5 text-[9px] text-zinc-600">
                            Joined {formatDateTime(member.joinedAt)}
                          </p>
                        </div>
                      </div>

                      {isGm && (canEditRole || canRemove) ? (
                        <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                          {canEditRole ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleSetRole(
                                  member,
                                  member.role === "player" ? "co-gm" : "player",
                                )
                              }
                              disabled={busyKey === `role-${member.id}`}
                              className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
                            >
                              {member.role === "player"
                                ? "Make co-GM"
                                : "Set as player"}
                            </button>
                          ) : null}

                          {canRemove ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member)}
                              disabled={busyKey === `remove-${member.id}`}
                              className="rounded-md border border-rose-500/15 bg-rose-500/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-rose-300/80 transition hover:bg-rose-500/[0.08] hover:text-rose-200 disabled:opacity-50"
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <aside className="space-y-3">
          <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">Your access</h3>

              <span
                className={`rounded-md px-2 py-0.5 text-[9px] font-semibold ${getRoleBadgeClass(
                  myMembership.role,
                )}`}
              >
                {formatRoleLabel(myMembership.role)}
              </span>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">
                Active invites
              </h3>

              <span className="text-[10px] text-zinc-500">
                {activeInvites.length}
              </span>
            </div>

            {invitesLoading ? (
              <div className="mt-3">
                <EmptyState>Loading invites…</EmptyState>
              </div>
            ) : activeInvites.length === 0 ? (
              <div className="mt-3">
                <EmptyState>No active invites.</EmptyState>

                {isGm ? (
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(true)}
                    className="mt-2 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Create invite
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="mt-3 space-y-1.5">
                {activeInvites.map((invite) => {
                  const remainingUses =
                    typeof invite.maxUses === "number"
                      ? Math.max(0, invite.maxUses - invite.useCount)
                      : null;

                  const inviteUrl = `${window.location.origin}/invite/${invite.id}`;

                  return (
                    <div
                      key={invite.id}
                      className="rounded-lg border border-white/[0.08] bg-black/15 p-2.5"
                    >
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-zinc-400">
                          {formatRoleLabel(invite.role)}
                        </span>

                        <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-zinc-500">
                          {invite.useCount}
                          {typeof invite.maxUses === "number"
                            ? `/${invite.maxUses} used`
                            : " used"}
                        </span>

                        {remainingUses !== null ? (
                          <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-zinc-500">
                            {remainingUses} left
                          </span>
                        ) : null}
                      </div>

                      <p
                        className="mt-2 truncate text-[9px] text-zinc-600"
                        title={inviteUrl}
                      >
                        {inviteUrl}
                      </p>

                      <p className="mt-1 text-[9px] text-zinc-600">
                        Created {formatDateTime(invite.createdAt)}
                      </p>

                      {isGm ? (
                        <div className="mt-2 flex gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              navigator.clipboard.writeText(inviteUrl)
                            }
                            className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                          >
                            Copy
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRevokeInvite(invite)}
                            disabled={busyKey === `invite-${invite.id}`}
                            className="rounded-md border border-rose-500/15 bg-rose-500/[0.04] px-2 py-1 text-[9px] font-semibold text-rose-300/80 transition hover:bg-rose-500/[0.08] hover:text-rose-200 disabled:opacity-50"
                          >
                            Revoke
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {revokedInvites.length > 0 ? (
            <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">
                  Revoked invites
                </h3>

                <span className="text-[10px] text-zinc-500">
                  {revokedInvites.length}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                {revokedInvites.slice(0, 5).map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-black/10 px-2.5 py-2"
                  >
                    <span className="text-[10px] text-zinc-500">
                      {formatRoleLabel(invite.role)}
                    </span>

                    <span className="rounded-md border border-rose-500/15 bg-rose-500/[0.04] px-1.5 py-0.5 text-[9px] text-rose-300/70">
                      Revoked
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>

      {isGm ? (
        <InvitePlayersModal
          campaignId={campaign.id}
          campaignName={campaign.name}
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
        />
      ) : null}
    </>
  );
};

const EmptyState = ({ children }: { children: string }) => (
  <div className="rounded-lg border border-dashed border-white/[0.08] bg-black/10 px-3 py-4 text-center">
    <p className="text-[11px] text-zinc-500">{children}</p>
  </div>
);

const PageMessage = ({
  children,
  error = false,
}: {
  children: string;
  error?: boolean;
}) => (
  <div
    className={`rounded-xl border p-6 text-center ${
      error
        ? "border-red-500/20 bg-red-500/[0.08] text-red-200"
        : "border-white/10 bg-zinc-900/35 text-zinc-400"
    }`}
  >
    <p className="text-sm">{children}</p>
  </div>
);

export default CampaignMembersPage;
