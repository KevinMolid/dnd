import { Link } from "react-router-dom";

type CampaignQuickActionsProps = {
  campaignId: string;
  isGm: boolean;
  onCreateHandout: () => void;
  onRewardItems: () => void;
};

const CampaignQuickActions = ({
  campaignId,
  isGm,
  onCreateHandout,
  onRewardItems,
}: CampaignQuickActionsProps) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Quick actions
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Jump into the parts of the campaign you are most likely to use.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {isGm ? (
          <>
            <Link
              to={`/campaigns/${campaignId}/session`}
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
              to={`/campaigns/${campaignId}/members`}
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
              to={`/campaigns/${campaignId}/maps/new`}
              className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
            >
              <h3 className="text-base font-semibold text-white">Add map</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Create a new map and prepare player-visible content.
              </p>
            </Link>

            <button
              onClick={onRewardItems}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Reward items
            </button>

            <button
              type="button"
              onClick={onCreateHandout}
              className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 text-left transition hover:border-white/20 hover:bg-zinc-900"
            >
              <h3 className="text-base font-semibold text-white">
                Create handout
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Add lore, clues, notes, or revealable documents.
              </p>
            </button>
          </>
        ) : (
          <>
            <Link
              to={`/campaigns/${campaignId}/characters`}
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
              to={`/campaigns/${campaignId}/journal`}
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
              to={`/campaigns/${campaignId}/maps`}
              className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
            >
              <h3 className="text-base font-semibold text-white">World map</h3>
              <p className="mt-2 text-sm text-zinc-400">
                See the maps and locations the GM has revealed.
              </p>
            </Link>

            <Link
              to={`/campaigns/${campaignId}/handouts`}
              className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
            >
              <h3 className="text-base font-semibold text-white">Handouts</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Open letters, clues, lore, and other shared information.
              </p>
            </Link>
          </>
        )}
      </div>
    </section>
  );
};

export default CampaignQuickActions;
