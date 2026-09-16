import { Navigate, Outlet, useParams } from "react-router-dom";

import useCampaignPageData from "../hooks/useCampaignPageData";

const CampaignGmOnly = () => {
  const { campaignId } = useParams<{ campaignId: string }>();

  const { pageState, membership } = useCampaignPageData(campaignId);

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

  if (
    pageState !== "ready" ||
    !membership ||
    !["gm", "co-gm"].includes(membership.role)
  ) {
    return (
      <Navigate to={campaignId ? `/campaigns/${campaignId}` : "/"} replace />
    );
  }

  return <Outlet />;
};

export default CampaignGmOnly;
