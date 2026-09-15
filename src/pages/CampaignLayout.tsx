import { Outlet, useNavigate, useParams } from "react-router-dom";

import CampaignHeader from "../features/campaigns/components/CampaignHeader";
import useCampaignPageData from "../features/campaigns/hooks/useCampaignPageData";

import { usePageTitle } from "../hooks/usePageTitle";

const CampaignLayout = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();

  const { pageState, campaign, membership, isGm, systemLabel } =
    useCampaignPageData(campaignId);

  usePageTitle(campaign?.name);

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-white/10 bg-zinc-900/35 p-6 text-center">
            <p className="text-sm text-zinc-400">Loading campaign...</p>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <CampaignLayoutMessage
        title="Campaign not found"
        text="The campaign you tried to open does not exist."
      />
    );
  }

  if (pageState === "forbidden") {
    return (
      <CampaignLayoutMessage
        title="Access denied"
        text="You do not have access to this campaign."
      />
    );
  }

  if (pageState === "error" || !campaign || !membership) {
    return (
      <CampaignLayoutMessage
        title="Something went wrong"
        text="We could not load this campaign right now."
        error
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <CampaignHeader
          campaign={campaign}
          membership={membership}
          systemLabel={systemLabel}
          isGm={isGm}
          onOpenSettings={() => navigate(`/campaigns/${campaign.id}/settings`)}
        />

        <Outlet />
      </div>
    </div>
  );
};

const CampaignLayoutMessage = ({
  title,
  text,
  error = false,
}: {
  title: string;
  text: string;
  error?: boolean;
}) => (
  <div className="min-h-screen bg-zinc-950 text-zinc-100">
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div
        className={`rounded-xl border p-6 text-center ${
          error
            ? "border-red-500/20 bg-red-500/[0.08]"
            : "border-white/10 bg-zinc-900/35"
        }`}
      >
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <p
          className={`mt-2 text-sm ${error ? "text-red-200/80" : "text-zinc-400"}`}
        >
          {text}
        </p>
      </div>
    </div>
  </div>
);

export default CampaignLayout;
