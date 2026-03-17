import { useState } from "react";
import { createInvite } from "../lib/invites";
import { useAuth } from "../context/AuthContext";

type Props = {
  campaignId: string;
  campaignName: string;
  isOpen: boolean;
  onClose: () => void;
};

const InvitePlayersModal = ({
  campaignId,
  campaignName,
  isOpen,
  onClose,
}: Props) => {
  const { user, appUser } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");
  const [error, setError] = useState("");
  const [maxUses, setMaxUses] = useState<string>("");
  const [daysUntilExpire, setDaysUntilExpire] = useState<string>("");

  if (!isOpen) return null;

  const handleCreateInvite = async () => {
    if (!user) return;

    setSubmitting(true);
    setError("");

    try {
      const parsedMaxUses =
        maxUses.trim() === "" ? null : Math.max(1, Number(maxUses));
      const parsedDays =
        daysUntilExpire.trim() === ""
          ? null
          : Math.max(1, Number(daysUntilExpire));

      const expiresAt =
        parsedDays === null
          ? null
          : new Date(Date.now() + parsedDays * 24 * 60 * 60 * 1000);

      const result = await createInvite({
        campaignId,
        campaignName,
        createdByUid: user.uid,
        createdByName: appUser?.displayName ?? user.displayName ?? "",
        maxUses: Number.isFinite(parsedMaxUses as number)
          ? parsedMaxUses
          : null,
        expiresAt,
      });

      setInviteUrl(result.url);
    } catch (err) {
      console.error("Failed to create invite:", err);
      setError("Could not create invite link.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
              Invite players
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Create invite link
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Share this link with players you want to add to the campaign.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Max uses
            </label>
            <input
              type="number"
              min={1}
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              placeholder="Unlimited"
              className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Expires in days
            </label>
            <input
              type="number"
              min={1}
              value={daysUntilExpire}
              onChange={(e) => setDaysUntilExpire(e.target.value)}
              placeholder="Never"
              className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-white/20"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {inviteUrl && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
            <p className="text-sm font-medium text-white">Invite link</p>
            <p className="mt-2 break-all text-sm text-zinc-400">{inviteUrl}</p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCopy}
                className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Copy link
              </button>

              <button
                onClick={handleCreateInvite}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Generate new link
              </button>
            </div>
          </div>
        )}

        {!inviteUrl && (
          <div className="mt-6">
            <button
              onClick={handleCreateInvite}
              disabled={submitting}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create invite link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitePlayersModal;
