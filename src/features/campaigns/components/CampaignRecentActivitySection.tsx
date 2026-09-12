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
    <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">
            Recent activity
          </h2>
        </div>

        <Link
          to={`/campaigns/${campaignId}/journal`}
          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
        >
          Journal
        </Link>
      </div>

      {loading ? (
        <p className="mt-3 text-[11px] text-zinc-500">Loading activity…</p>
      ) : !latestJournalEntry ? (
        <p className="mt-3 text-[11px] text-zinc-500">
          No journal entries yet.
        </p>
      ) : (
        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-zinc-400">
              {getJournalTypeLabel(latestJournalEntry.type)}
            </span>

            {latestJournalEntry.pinned ? (
              <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-300">
                Pinned
              </span>
            ) : null}
          </div>

          <h3 className="mt-2 text-xs font-semibold text-zinc-100">
            {latestJournalEntry.title}
          </h3>

          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[9px] text-zinc-500">
            {typeof latestJournalEntry.sessionNumber === "number" ? (
              <span>Session {latestJournalEntry.sessionNumber}</span>
            ) : null}

            {latestJournalEntry.sessionDate ? (
              <span>{latestJournalEntry.sessionDate}</span>
            ) : null}

            <span>
              {new Date(latestJournalEntry.updatedAt).toLocaleDateString()}
            </span>
          </div>

          {latestJournalEntry.content ? (
            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-[11px] leading-5 text-zinc-300">
              {latestJournalEntry.content}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
};

export default CampaignRecentActivitySection;
