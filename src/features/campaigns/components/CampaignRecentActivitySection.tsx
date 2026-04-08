import { Link } from "react-router-dom";

import { getJournalTypeLabel } from "../../journal/types";
import type { CampaignJournalPreview } from "../hooks/useCampaignPageData";

type CampaignRecentActivitySectionProps = {
  campaignId: string;
  loading: boolean;
  latestJournalEntry: CampaignJournalPreview | null;
};

const CampaignRecentActivitySection = ({
  campaignId,
  loading,
  latestJournalEntry,
}: CampaignRecentActivitySectionProps) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Recent activity</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Latest visible journal update from this campaign.
          </p>
        </div>

        <Link
          to={`/campaigns/${campaignId}/journal`}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Open journal
        </Link>
      </div>

      {loading ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-5 text-center">
          <p className="text-sm text-zinc-400">Loading recent activity...</p>
        </div>
      ) : !latestJournalEntry ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-5 text-center">
          <p className="text-sm text-zinc-300">No journal entries yet.</p>
          <p className="mt-2 text-sm text-zinc-500">
            Add the first journal entry to start documenting the campaign.
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
              {getJournalTypeLabel(latestJournalEntry.type)}
            </span>

            {latestJournalEntry.pinned && (
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-xs text-amber-300">
                Pinned
              </span>
            )}

            {latestJournalEntry.published ? (
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                Published
              </span>
            ) : (
              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-1 text-xs text-yellow-300">
                Draft
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-white">
            {latestJournalEntry.title}
          </h3>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
            {typeof latestJournalEntry.sessionNumber === "number" && (
              <span>Session {latestJournalEntry.sessionNumber}</span>
            )}

            {latestJournalEntry.sessionDate && (
              <span>{latestJournalEntry.sessionDate}</span>
            )}

            <span>
              Updated {new Date(latestJournalEntry.updatedAt).toLocaleString()}
            </span>

            {latestJournalEntry.createdByName && (
              <span>By {latestJournalEntry.createdByName}</span>
            )}
          </div>

          <p className="mt-4 line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
            {latestJournalEntry.content}
          </p>

          <div className="mt-4">
            <Link
              to={`/campaigns/${campaignId}/journal`}
              className="inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              Read more
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default CampaignRecentActivitySection;
