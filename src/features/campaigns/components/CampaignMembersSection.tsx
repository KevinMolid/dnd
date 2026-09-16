import Avatar from "../../../components/Avatar";
import type { CampaignMemberDoc } from "../../../types/campaign";
import {
  formatRoleLabel,
  getRoleBadgeClass,
} from "../hooks/useCampaignPageData";

type CampaignMembersSectionProps = {
  members: CampaignMemberDoc[];
  loading: boolean;
  isGm: boolean;
  onInvitePlayers: () => void;
};

const CampaignMembersSection = ({
  members,
  loading,
  isGm,
  onInvitePlayers,
}: CampaignMembersSectionProps) => {
  return (
    <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Players</h2>
        </div>

        {isGm ? (
          <button
            type="button"
            onClick={onInvitePlayers}
            className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
          >
            Invite
          </button>
        ) : null}
      </div>

      {loading ? (
        <p className="mt-3 text-xs text-zinc-400">Loading players…</p>
      ) : members.length === 0 ? (
        <p className="mt-3 text-xs text-zinc-400">No members yet.</p>
      ) : (
        <div className="mt-3 divide-y divide-white/[0.055]">
          {members.map((member) => (
            <div
              key={member.uid}
              className="flex min-w-0 items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar
                  name={
                    member.displayName?.trim() || member.email || member.uid
                  }
                  src={member.imageUrl?.trim() || ""}
                  className="h-9 w-9 shrink-0 rounded-full"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-100">
                    {member.displayName || member.email || member.uid}
                  </p>

                  {member.email ? (
                    <p className="mt-0.5 truncate text-xs text-zinc-400">
                      {member.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <span
                className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${getRoleBadgeClass(
                  member.role,
                )}`}
              >
                {formatRoleLabel(member.role)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CampaignMembersSection;
