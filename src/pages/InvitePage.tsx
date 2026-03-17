import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import type { CampaignInviteDoc } from "../types/invite";
import type { CampaignMemberDoc } from "../types/campaign";

type InviteState =
  | "loading"
  | "ready"
  | "invalid"
  | "expired"
  | "revoked"
  | "used-up"
  | "already-member"
  | "error";

const InvitePage = () => {
  const { inviteToken } = useParams<{ inviteToken: string }>();
  const navigate = useNavigate();
  const { user, appUser } = useAuth();

  const [invite, setInvite] = useState<
    (CampaignInviteDoc & { id: string }) | null
  >(null);
  const [state, setState] = useState<InviteState>("loading");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvite = async () => {
      if (!inviteToken) {
        setState("invalid");
        return;
      }

      if (!user) {
        navigate(
          `/login?redirect=${encodeURIComponent(`/invite/${inviteToken}`)}`,
        );
        return;
      }

      try {
        const inviteRef = doc(db, "campaignInvites", inviteToken);
        const inviteSnap = await getDoc(inviteRef);

        if (!inviteSnap.exists()) {
          setState("invalid");
          return;
        }

        const inviteData = inviteSnap.data() as CampaignInviteDoc;
        const memberRef = doc(
          db,
          "campaigns",
          inviteData.campaignId,
          "members",
          user.uid,
        );
        const memberSnap = await getDoc(memberRef);

        if (memberSnap.exists()) {
          setInvite({ id: inviteSnap.id, ...inviteData });
          setState("already-member");
          return;
        }

        const expiresAtDate =
          inviteData.expiresAt &&
          typeof (inviteData.expiresAt as { toDate?: () => Date }).toDate ===
            "function"
            ? (inviteData.expiresAt as { toDate: () => Date }).toDate()
            : null;

        if (inviteData.revoked) {
          setInvite({ id: inviteSnap.id, ...inviteData });
          setState("revoked");
          return;
        }

        if (expiresAtDate && expiresAtDate.getTime() <= Date.now()) {
          setInvite({ id: inviteSnap.id, ...inviteData });
          setState("expired");
          return;
        }

        if (
          typeof inviteData.maxUses === "number" &&
          inviteData.useCount >= inviteData.maxUses
        ) {
          setInvite({ id: inviteSnap.id, ...inviteData });
          setState("used-up");
          return;
        }

        setInvite({ id: inviteSnap.id, ...inviteData });
        setState("ready");
      } catch (err) {
        console.error("Failed to load invite:", err);
        setState("error");
      }
    };

    loadInvite();
  }, [inviteToken, navigate, user]);

  const canJoin = state === "ready" && !!invite && !!user && !joining;

  const helperText = useMemo(() => {
    if (!invite) return "";

    if (state === "already-member") {
      return "You are already a member of this campaign.";
    }

    if (state === "revoked") {
      return "This invite has been revoked by the GM.";
    }

    if (state === "expired") {
      return "This invite link has expired.";
    }

    if (state === "used-up") {
      return "This invite has reached its maximum number of uses.";
    }

    return "";
  }, [invite, state]);

  const handleJoin = async () => {
    if (!invite || !inviteToken || !user) return;

    setJoining(true);
    setError("");

    try {
      const memberRef = doc(
        db,
        "campaigns",
        invite.campaignId,
        "members",
        user.uid,
      );
      const inviteRef = doc(db, "campaignInvites", inviteToken);

      const batch = writeBatch(db);

      batch.set(memberRef, {
        uid: user.uid,
        displayName: appUser?.displayName ?? user.displayName ?? "",
        email: user.email ?? "",
        role: invite.role,
        joinedAt: serverTimestamp(),
        inviteToken,
      } satisfies CampaignMemberDoc & { inviteToken: string });

      batch.update(inviteRef, {
        useCount: increment(1),
        updatedAt: serverTimestamp(),
      });

      await batch.commit();

      navigate(`/campaigns/${invite.campaignId}`);
    } catch (err) {
      console.error("Failed to join campaign:", err);
      setError(
        "Could not join the campaign. The invite may no longer be valid.",
      );
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl sm:p-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Campaign invite
          </p>

          {state === "loading" && (
            <>
              <h1 className="text-3xl font-bold text-white">
                Loading invite...
              </h1>
              <p className="mt-3 text-sm text-zinc-400">
                Please wait while we validate this invite.
              </p>
            </>
          )}

          {state === "invalid" && (
            <>
              <h1 className="text-3xl font-bold text-white">Invalid invite</h1>
              <p className="mt-3 text-sm text-zinc-400">
                This invite link does not exist or is no longer available.
              </p>
            </>
          )}

          {state === "error" && (
            <>
              <h1 className="text-3xl font-bold text-white">
                Something went wrong
              </h1>
              <p className="mt-3 text-sm text-zinc-400">
                We could not load this invite right now.
              </p>
            </>
          )}

          {invite &&
            state !== "loading" &&
            state !== "invalid" &&
            state !== "error" && (
              <>
                <h1 className="text-3xl font-bold text-white">
                  {invite.campaignName}
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  You have been invited to join this campaign as a{" "}
                  <span className="font-semibold text-white capitalize">
                    {invite.role}
                  </span>
                  .
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <div className="flex flex-wrap gap-2">
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                      Hidden campaign
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                      Role: {invite.role}
                    </div>
                  </div>

                  {helperText && (
                    <p className="mt-4 text-sm text-zinc-400">{helperText}</p>
                  )}
                </div>

                {error && (
                  <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {state === "ready" && (
                    <button
                      onClick={handleJoin}
                      disabled={!canJoin}
                      className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {joining ? "Joining..." : "Join campaign"}
                    </button>
                  )}

                  {state === "already-member" && invite && (
                    <Link
                      to={`/campaigns/${invite.campaignId}`}
                      className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                    >
                      Open campaign
                    </Link>
                  )}

                  <Link
                    to="/"
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Back to home
                  </Link>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
