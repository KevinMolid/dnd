import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MapViewer from "../components/MapViewer";
import MapEditorModal from "../components/MapEditorModal";
import { useCampaignMaps } from "../features/maps/useCampaignMaps";

const MapViewerPage = () => {
  const { campaignId, mapId } = useParams<{
    campaignId: string;
    mapId: string;
  }>();

  const navigate = useNavigate();

  const { maps, loading } = useCampaignMaps(campaignId ?? null);

  /*
   * undefined = editor closed
   * null      = editor open on Overview
   * number    = editor open on that area
   */
  const [editingRoomId, setEditingRoomId] = useState<number | null | undefined>(
    undefined,
  );

  if (!campaignId || !mapId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
          Missing campaign or map ID.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        Loading map...
      </div>
    );
  }

  const map = maps.find((map) => map.id === mapId) ?? null;

  if (!map) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100">
        <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <h1 className="text-xl font-bold text-white">Map not found</h1>

          <p className="mt-2 text-sm text-zinc-400">
            This map may have been deleted or does not belong to this campaign.
          </p>

          <button
            type="button"
            onClick={() => navigate(`/campaigns/${campaignId}/maps`)}
            className="mt-5 rounded-xl bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600"
          >
            Back to maps
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <MapViewer
        campaignId={campaignId}
        map={map}
        onClose={() => navigate(`/campaigns/${campaignId}/maps`)}
        onEdit={(roomId) => setEditingRoomId(roomId)}
        players={[]}
        onGiveItemToPlayer={() => {}}
        onGiveItemToParty={() => {}}
        onGiveMoneyToPlayer={() => {}}
        onGiveMoneyToParty={() => {}}
      />

      {editingRoomId !== undefined && (
        <MapEditorModal
          campaignId={campaignId}
          map={map}
          initialSelectedRoomId={editingRoomId}
          onClose={() => setEditingRoomId(undefined)}
        />
      )}
    </>
  );
};

export default MapViewerPage;
