import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams,
} from "react-router-dom";

import type { CampaignDoc, CampaignMemberDoc } from "../../../types/campaign";

type CampaignOutletContext = {
  campaign: CampaignDoc & { id: string };
  membership: CampaignMemberDoc;
  isGm: boolean;
  canManageCampaign: boolean;
};

const CampaignGmOutlet = () => {
  const { campaignId } = useParams<{ campaignId: string }>();

  const { canManageCampaign } = useOutletContext<CampaignOutletContext>();

  if (!canManageCampaign) {
    return <Navigate to={`/campaigns/${campaignId}`} replace />;
  }

  return <Outlet />;
};

export default CampaignGmOutlet;
