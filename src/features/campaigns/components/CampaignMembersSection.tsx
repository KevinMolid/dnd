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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
      <h2 className="text-xl font-semibold text-white">Players</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Members currently in this campaign.
      </p>

      {loading ? (
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
                <div className="min-w-0 flex items-center gap-3">
                  <Avatar
                    name={member.displayName || member.email || member.uid}
                    src={member.imageUrl || ""}
                    size="md"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {member.displayName || member.email || member.uid}
                    </p>
                    <p className="mt-1 truncate text-sm text-zinc-400">
                      {member.email || "No email available"}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeClass(
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
          onClick={onInvitePlayers}
          className="mt-5 w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
        >
          Invite players
        </button>
      )}
    </section>
  );
};

export default CampaignMembersSection;
