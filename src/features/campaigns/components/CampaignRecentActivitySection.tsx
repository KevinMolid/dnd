import { Link } from "react-router-dom";

import Avatar from "../../../components/Avatar";
import { getJournalTypeLabel } from "../../journal/types";
import type { CampaignJournalPreview } from "../hooks/useCampaignPageData";

const stripHtml = (value: string) => {
  if (!value) return "";

  const doc = new DOMParser().parseFromString(value, "text/html");

  return (doc.body.textContent ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

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
        <h2 className="text-base font-semibold text-white">Recent activity</h2>

        <Link
          to={`/campaigns/${campaignId}/journal`}
          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
        >
          Journal
        </Link>
      </div>

      {loading ? (
        <p className="mt-3 text-xs text-zinc-400">Loading activity…</p>
      ) : !latestJournalEntry ? (
        <p className="mt-3 text-xs text-zinc-400">
          No published journal entries yet.
        </p>
      ) : (
        <Link
          to={`/campaigns/${campaignId}/journal?entry=${latestJournalEntry.id}`}
          className="group mt-3 block rounded-lg border border-white/[0.06] bg-black/10 p-3 transition hover:border-white/[0.12] hover:bg-white/[0.03]"
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
                {latestJournalEntry.pinned ? (
                  <span
                    title="Pinned"
                    className="flex h-4 w-3.5 shrink-0 items-center justify-center text-[9px] text-amber-300"
                  >
                    <i className="fa-solid fa-thumbtack" />
                  </span>
                ) : null}

                <h3 className="min-w-0 truncate text-sm font-semibold text-zinc-100 transition group-hover:text-white">
                  {latestJournalEntry.title}
                </h3>

                <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-zinc-400">
                  {getJournalTypeLabel(latestJournalEntry.type)}
                </span>
              </div>

              {latestJournalEntry.createdByName ? (
                <div className="mt-2 flex items-center gap-2">
                  <Avatar
                    name={latestJournalEntry.createdByName}
                    src={latestJournalEntry.createdByImageUrl}
                    className="h-6 w-6 shrink-0 rounded-full"
                  />

                  <span className="text-[11px] font-semibold text-zinc-300">
                    {latestJournalEntry.createdByName}
                  </span>
                </div>
              ) : null}

              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-zinc-500">
                {typeof latestJournalEntry.sessionNumber === "number" ? (
                  <span>Session {latestJournalEntry.sessionNumber}</span>
                ) : null}

                {latestJournalEntry.sessionDate ? (
                  <span>
                    {new Date(
                      `${latestJournalEntry.sessionDate}T00:00:00`,
                    ).toLocaleDateString()}
                  </span>
                ) : null}

                <span>
                  Updated{" "}
                  {new Date(latestJournalEntry.updatedAt).toLocaleDateString()}
                </span>
              </div>

              {latestJournalEntry.content ? (
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400">
                  {stripHtml(latestJournalEntry.content)}
                </p>
              ) : null}
            </div>

            <i className="fa-solid fa-chevron-right mt-1 shrink-0 text-[9px] text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-400" />
          </div>
        </Link>
      )}
    </section>
  );
};

export default CampaignRecentActivitySection;
