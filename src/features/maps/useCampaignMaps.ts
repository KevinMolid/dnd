import { useEffect, useState } from "react";
import { subscribeToCampaignMaps } from "./mapService";
import type { CampaignMap } from "./types";

export const useCampaignMaps = (campaignId: string | null) => {
  const [maps, setMaps] = useState<CampaignMap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) {
      setMaps([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToCampaignMaps(campaignId, (nextMaps) => {
      setMaps(nextMaps);
      setLoading(false);
    });

    return unsubscribe;
  }, [campaignId]);

  return { maps, loading };
};