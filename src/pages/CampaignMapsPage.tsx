import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MapEditorModal from "../components/MapEditorModal";
import CreateMapModal from "./CreateMapModal";
import { useAuth } from "../context/AuthContext";
import {
  createCampaignMap,
  updateCampaignMap,
} from "../features/maps/mapService";
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

  const [orderedMapIds, setOrderedMapIds] = useState<string[]>([]);
  const [draggedMapId, setDraggedMapId] = useState<string | null>(null);
  const [dragOverMapId, setDragOverMapId] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  /*
   * Keep the local order in sync with Firestore, while preserving an
   * in-progress local reorder until the updated order comes back.
   */
  useEffect(() => {
    const sortedIds = [...maps]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((map) => map.id);

    setOrderedMapIds((current) => {
      const sameMaps =
        current.length === sortedIds.length &&
        current.every((id) => sortedIds.includes(id));

      return sameMaps ? current : sortedIds;
    });
  }, [maps]);

  const orderedMaps = useMemo(() => {
    const byId = new Map(maps.map((map) => [map.id, map]));

    const ordered = orderedMapIds
      .map((id) => byId.get(id))
      .filter((map): map is CampaignMap => Boolean(map));

    const missing = maps
      .filter((map) => !orderedMapIds.includes(map.id))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return [...ordered, ...missing];
  }, [maps, orderedMapIds]);

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
      order: orderedMaps.length,
    });
  };

  const moveMap = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) {
      return;
    }

    setOrderedMapIds((current) => {
      const next = [...current];
      const sourceIndex = next.indexOf(sourceId);
      const targetIndex = next.indexOf(targetId);

      if (sourceIndex === -1 || targetIndex === -1) {
        return current;
      }

      next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, sourceId);

      return next;
    });
  };

  const persistMapOrder = async () => {
    if (!campaignId || savingOrder) {
      return;
    }

    const ids = orderedMapIds.length
      ? orderedMapIds
      : orderedMaps.map((map) => map.id);

    setSavingOrder(true);

    try {
      await Promise.all(
        ids.map((mapId, index) =>
          updateCampaignMap(campaignId, mapId, {
            order: index,
          }),
        ),
      );
    } catch (error) {
      console.error("Failed to save map order:", error);

      /*
       * Restore the authoritative Firestore order if saving failed.
       */
      setOrderedMapIds(
        [...maps]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((map) => map.id),
      );
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    mapId: string,
  ) => {
    setDraggedMapId(mapId);
    setDragOverMapId(mapId);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", mapId);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLElement>,
    targetMapId: string,
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (!draggedMapId || draggedMapId === targetMapId) {
      return;
    }

    if (dragOverMapId === targetMapId) {
      return;
    }

    setDragOverMapId(targetMapId);
    moveMap(draggedMapId, targetMapId);
  };

  const handleDragEnd = () => {
    const hadDrag = Boolean(draggedMapId);

    setDraggedMapId(null);
    setDragOverMapId(null);

    if (hadDrag) {
      void persistMapOrder();
    }
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
      <div className="mb-3 flex items-center justify-end gap-2">
        {savingOrder ? (
          <span className="text-[10px] font-medium text-zinc-500">
            Saving order…
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.09] hover:text-white"
        >
          <i className="fa-solid fa-plus mr-1.5 text-[10px]" />
          Add map
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900/35 p-6 text-center">
          <p className="text-xs text-zinc-400">Loading maps...</p>
        </div>
      ) : orderedMaps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-zinc-900/25 p-6 text-center">
          <p className="text-sm font-semibold text-zinc-100">No maps yet.</p>

          <p className="mt-1 text-xs text-zinc-400">
            Create your first map to start building the campaign world.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {orderedMaps.map((map, index) => {
            const isDragging = draggedMapId === map.id;
            const isDragTarget =
              Boolean(draggedMapId) &&
              dragOverMapId === map.id &&
              draggedMapId !== map.id;

            return (
              <article
                key={map.id}
                onDragOver={(event) => handleDragOver(event, map.id)}
                className={`group relative overflow-hidden rounded-xl border bg-zinc-900/35 transition ${
                  isDragging
                    ? "scale-[0.985] border-cyan-400/25 opacity-50"
                    : isDragTarget
                      ? "border-cyan-400/35 bg-cyan-400/[0.03]"
                      : "border-white/[0.08] hover:border-white/15"
                }`}
              >
                <button
                  type="button"
                  onClick={() => openMap(map.id)}
                  className="block w-full overflow-hidden bg-black text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-inset"
                  title={`Open ${map.title}`}
                  aria-label={`Open map ${map.title}`}
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
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) =>
                          handleDragStart(event, map.id)
                        }
                        onDragEnd={handleDragEnd}
                        onClick={(event) => event.stopPropagation()}
                        title="Drag to reorder"
                        aria-label={`Drag ${map.title} to reorder`}
                        className="flex h-8 w-7 shrink-0 cursor-grab items-center justify-center rounded-md text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-300 active:cursor-grabbing"
                      >
                        <i className="fa-solid fa-grip-vertical text-xs" />
                      </button>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-white">
                          <span className="mr-1.5 text-zinc-500">
                            {index + 1}.
                          </span>
                          {map.title}
                        </h3>

                        <p className="mt-0.5 text-xs text-zinc-500">
                          {map.rooms?.length ?? 0}{" "}
                          {(map.rooms?.length ?? 0) === 1 ? "area" : "areas"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => openMap(map.id)}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        Open
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingMapId(map.id)}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
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
