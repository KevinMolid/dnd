import { Link } from "react-router-dom";
import { type ReactNode } from "react";

type CampaignQuickActionsProps = {
  campaignId: string;
  isGm: boolean;
  onCreateHandout: () => void;
  onRewardItems: () => void;
  onCreateCustomItem: () => void;
};

type QuickActionCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

const QuickActionCard = ({
  description,
  children,
}: QuickActionCardProps) => {
  return (
    <div className="group relative min-w-0">
      {children}

      <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-zinc-950/95 p-3 text-xs text-zinc-300 shadow-2xl group-hover:block">
        {description}
      </div>
    </div>
  );
};

const baseActionClassName =
  "inline-flex min-w-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-sm font-medium text-white transition hover:border-white/20 hover:bg-zinc-900";

const CampaignQuickActions = ({
  campaignId,
  isGm,
  onRewardItems,
  onCreateCustomItem,
}: CampaignQuickActionsProps) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Quick actions
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Fast access to common campaign tools.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {isGm ? (
          <>
            <QuickActionCard
              title="Rewards"
              description="Search for items and award players with items or gold."
            >
              <button
                type="button"
                onClick={onRewardItems}
                className={baseActionClassName}
              >
                <i className="fa-solid fa-trophy mr-2"></i> Rewards
              </button>
            </QuickActionCard>

            <QuickActionCard
              title="Custom item"
              description="Choose a base item and create a campaign-specific version with custom flavor text."
            >
              <button
                type="button"
                onClick={onCreateCustomItem}
                className={baseActionClassName}
              >
                <i className="fa-solid fa-plus mr-2"></i> Custom item
              </button>
            </QuickActionCard>
          </>
        ) : (
          <>
            <QuickActionCard
              title="Character"
              description="Open the character you are using in this campaign."
            >
              <Link
                to={`/campaigns/${campaignId}/characters`}
                className={baseActionClassName}
              >
                Character
              </Link>
            </QuickActionCard>

            <QuickActionCard
              title="Journal"
              description="Review revealed notes, summaries, and campaign events."
            >
              <Link
                to={`/campaigns/${campaignId}/journal`}
                className={baseActionClassName}
              >
                Journal
              </Link>
            </QuickActionCard>

            <QuickActionCard
              title="Maps"
              description="See the maps and locations the GM has revealed."
            >
              <Link
                to={`/campaigns/${campaignId}/maps`}
                className={baseActionClassName}
              >
                Maps
              </Link>
            </QuickActionCard>

            <QuickActionCard
              title="Handouts"
              description="Open letters, clues, lore, and other shared information."
            >
              <Link
                to={`/campaigns/${campaignId}/handouts`}
                className={baseActionClassName}
              >
                Handouts
              </Link>
            </QuickActionCard>
          </>
        )}
      </div>
    </section>
  );
};

export default CampaignQuickActions;