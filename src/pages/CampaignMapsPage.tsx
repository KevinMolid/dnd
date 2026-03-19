import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MapViewer from "../components/MapViewer";
import MapEditorModal from "../components/MapEditorModal";
import CreateMapModal from "./CreateMapModal";
import { useAuth } from "../context/AuthContext";
import { createCampaignMap } from "../features/maps/mapService";
import { useCampaignMaps } from "../features/maps/useCampaignMaps";
import type { CampaignMap } from "../features/maps/types";


const DEFAULT_IMAGE_URL =
  "https://i.etsystatic.com/18388031/r/il/056bd0/6063210018/il_1080xN.6063210018_a4k1.jpg";

const CampaignMapsPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();

  const { maps, loading } = useCampaignMaps(campaignId ?? null);

  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [editingMapId, setEditingMapId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const selectedMap = useMemo(
    () => maps.find((map) => map.id === selectedMapId) ?? null,
    [maps, selectedMapId],
  );

  const editingMap = useMemo(
    () => maps.find((map) => map.id === editingMapId) ?? null,
    [maps, editingMapId],
  );

  const handleCreateMap = async (values: {
    title: string;
    imageUrl: string;
    order?: number;
  }) => {
    if (!campaignId || !user) {
      throw new Error("Missing campaign or user.");
    }

    await createCampaignMap({
      campaignId,
      createdByUid: user.uid,
      title: values.title,
      imageUrl: values.imageUrl,
      order: values.order ?? maps.length,
    });
  };

  if (!campaignId) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-6 text-zinc-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            Missing campaign ID.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to={`/campaigns/${campaignId}`}
              className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to campaign
          </Link>
        </div>

        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 shadow-2xl sm:mb-10 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Campaign maps
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Manage maps
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                Open maps in viewer mode, edit rooms and markers, or create new
                maps for this campaign.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                New map
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Maps
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Select a map to open it, or edit its rooms, notes, and markers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Add map
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
              <p className="text-sm text-zinc-400">Loading maps...</p>
            </div>
          ) : maps.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
              <p className="text-sm text-zinc-300">No maps yet.</p>
              <p className="mt-2 text-sm text-zinc-500">
                Create your first map to start adding rooms and markers.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {maps.map((map: CampaignMap) => (
                <div
                  key={map.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 text-left transition hover:border-white/20 hover:bg-zinc-800"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={map.imageUrl}
                      alt={map.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      draggable={false}
                    />
                  </div>

                  <div className="space-y-3 p-4">
                    <div>
                      <div className="text-base font-semibold text-white">
                        {map.title}
                      </div>
                      <div className="mt-1 text-sm text-white/55">
                        {map.rooms?.length ?? 0} areas
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {map.rooms?.slice(0, 4).map((room) => (
                        <span
                          key={room.id}
                          className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/75"
                        >
                          {room.id}. {room.name}
                        </span>
                      ))}

                      {(map.rooms?.length ?? 0) > 4 && (
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/60">
                          +{(map.rooms?.length ?? 0) - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedMapId(map.id)}
                        className="flex-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                      >
                        Open
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingMapId(map.id)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedMap && (
        <MapViewer
          map={selectedMap}
          onClose={() => setSelectedMapId(null)}
          players={[]}
          onGiveItemToPlayer={() => {}}
          onGiveItemToParty={() => {}}
          onGiveMoneyToPlayer={() => {}}
          onGiveMoneyToParty={() => {}}
        />
      )}

      {editingMap && (
        <MapEditorModal
          campaignId={campaignId}
          map={editingMap}
          onClose={() => setEditingMapId(null)}
        />
      )}

      {isCreateModalOpen && (
        <CreateMapModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateMap}
          defaultImageUrl={DEFAULT_IMAGE_URL}
          defaultOrder={maps.length}
        />
      )}
    </div>
  );
};

export default CampaignMapsPage;
