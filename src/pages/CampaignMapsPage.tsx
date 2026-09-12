import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MapEditorModal from "../components/MapEditorModal";
import CreateMapModal from "./CreateMapModal";
import { useAuth } from "../context/AuthContext";
import { createCampaignMap } from "../features/maps/mapService";
import { useCampaignMaps } from "../features/maps/useCampaignMaps";
import type { CampaignMap } from "../features/maps/types";

const DEFAULT_IMAGE_URL =
  "https://i.etsystatic.com/18388031/r/il/056bd0/6063210018/il_1080xN.6063210018_a4k1.jpg";

const CampaignMapsPage = () => {
  const { campaignId } = useParams<{
    campaignId: string;
  }>();

  const navigate = useNavigate();
  const { user } = useAuth();

  const { maps, loading } = useCampaignMaps(campaignId ?? null);

  const [editingMapId, setEditingMapId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const editingMap = useMemo(
    () => maps.find((map) => map.id === editingMapId) ?? null,
    [maps, editingMapId],
  );

  const openMap = (mapId: string) => {
    if (!campaignId) return;
    navigate(`/campaigns/${campaignId}/maps/${mapId}`);
  };

  const handleCreateMap = async (values: {
    title: string;
    imageUrl: string;
  }) => {
    if (!campaignId || !user) {
      throw new Error("Missing campaign or user.");
    }

    await createCampaignMap({
      campaignId,
      createdByUid: user.uid,
      title: values.title,
      imageUrl: values.imageUrl,
      order: maps.length,
    });
  };

  if (!campaignId) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
        Missing campaign ID.
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">Maps</h2>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.09] hover:text-white"
        >
          <i className="fa-solid fa-plus mr-1.5 text-[9px]" />
          Add map
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900/35 p-6 text-center">
          <p className="text-[11px] text-zinc-500">Loading maps...</p>
        </div>
      ) : maps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-zinc-900/25 p-6 text-center">
          <p className="text-xs font-semibold text-zinc-200">No maps yet.</p>
          <p className="mt-1 text-[11px] text-zinc-500">
            Create your first map to start adding areas.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {maps.map((map: CampaignMap) => (
            <article
              key={map.id}
              className="group overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900/35 transition hover:border-white/15"
            >
              <button
                type="button"
                onClick={() => openMap(map.id)}
                className="block w-full overflow-hidden bg-black text-left"
                title={`Open ${map.title}`}
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={map.imageUrl}
                    alt={map.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    draggable={false}
                  />
                </div>
              </button>

              <div className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-xs font-semibold text-white">
                      {map.title}
                    </h3>
                    <p className="mt-0.5 text-[10px] text-zinc-500">
                      {map.rooms?.length ?? 0} areas
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      onClick={() => openMap(map.id)}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      Open
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingMapId(map.id)}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {map.rooms?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {map.rooms.slice(0, 4).map((room) => (
                      <span
                        key={room.id}
                        className="rounded-md border border-white/[0.07] bg-black/20 px-1.5 py-0.5 text-[9px] text-zinc-500"
                      >
                        {room.id}. {room.name}
                      </span>
                    ))}

                    {map.rooms.length > 4 ? (
                      <span className="rounded-md border border-white/[0.07] bg-black/20 px-1.5 py-0.5 text-[9px] text-zinc-600">
                        +{map.rooms.length - 4}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      {editingMap ? (
        <MapEditorModal
          campaignId={campaignId}
          map={editingMap}
          onClose={() => setEditingMapId(null)}
        />
      ) : null}

      {isCreateModalOpen ? (
        <CreateMapModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateMap}
          defaultImageUrl={DEFAULT_IMAGE_URL}
        />
      ) : null}
    </>
  );
};

export default CampaignMapsPage;
