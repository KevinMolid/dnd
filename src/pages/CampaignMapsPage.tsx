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

type ViewMode = "all" | "nested";

const normalizeParentId = (map: CampaignMap) => map.parentMapId ?? null;

const CampaignMapsPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { maps, loading } = useCampaignMaps(campaignId ?? null);

  const [editingMapId, setEditingMapId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("nested");
  const [currentParentMapId, setCurrentParentMapId] = useState<string | null>(
    null,
  );

  const [orderedMapIds, setOrderedMapIds] = useState<string[]>([]);
  const [draggedMapId, setDraggedMapId] = useState<string | null>(null);
  const [dragOverMapId, setDragOverMapId] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const mapById = useMemo(
    () => new Map(maps.map((map) => [map.id, map])),
    [maps],
  );

  const childrenByParent = useMemo(() => {
    const result = new Map<string | null, CampaignMap[]>();

    maps.forEach((map) => {
      const parentId = normalizeParentId(map);
      const current = result.get(parentId) ?? [];
      current.push(map);
      result.set(parentId, current);
    });

    result.forEach((children) => {
      children.sort(
        (a, b) =>
          (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title),
      );
    });

    return result;
  }, [maps]);

  const getChildCount = (mapId: string) =>
    childrenByParent.get(mapId)?.length ?? 0;

  const currentParentMap =
    currentParentMapId !== null
      ? (mapById.get(currentParentMapId) ?? null)
      : null;

  const nestedMaps = useMemo(
    () => childrenByParent.get(currentParentMapId) ?? [],
    [childrenByParent, currentParentMapId],
  );

  const allMaps = useMemo(
    () =>
      [...maps].sort(
        (a, b) =>
          (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title),
      ),
    [maps],
  );

  const displayedMaps = viewMode === "nested" ? nestedMaps : allMaps;

  useEffect(() => {
    if (
      currentParentMapId !== null &&
      maps.length > 0 &&
      !mapById.has(currentParentMapId)
    ) {
      setCurrentParentMapId(null);
    }
  }, [currentParentMapId, mapById, maps.length]);

  useEffect(() => {
    if (viewMode !== "nested") {
      setOrderedMapIds([]);
      return;
    }

    setOrderedMapIds(nestedMaps.map((map) => map.id));
  }, [nestedMaps, viewMode]);

  const orderedNestedMaps = useMemo(() => {
    if (viewMode !== "nested") {
      return displayedMaps;
    }

    const byId = new Map(nestedMaps.map((map) => [map.id, map]));
    const ordered = orderedMapIds
      .map((id) => byId.get(id))
      .filter((map): map is CampaignMap => Boolean(map));
    const missing = nestedMaps.filter((map) => !orderedMapIds.includes(map.id));

    return [...ordered, ...missing];
  }, [displayedMaps, nestedMaps, orderedMapIds, viewMode]);

  const visibleMaps = viewMode === "nested" ? orderedNestedMaps : displayedMaps;

  const editingMap = useMemo(
    () => maps.find((map) => map.id === editingMapId) ?? null,
    [maps, editingMapId],
  );

  const breadcrumbs = useMemo(() => {
    const result: CampaignMap[] = [];
    const visited = new Set<string>();
    let id = currentParentMapId;

    while (id) {
      if (visited.has(id)) break;
      visited.add(id);

      const map = mapById.get(id);
      if (!map) break;

      result.unshift(map);
      id = normalizeParentId(map);
    }

    return result;
  }, [currentParentMapId, mapById]);

  const openMap = (mapId: string) => {
    if (!campaignId) return;
    navigate(`/campaigns/${campaignId}/maps/${mapId}`);
  };

  const openNestedMap = (mapId: string) => {
    setCurrentParentMapId(mapId);
  };

  const handleCreateMap = async (values: {
    title: string;
    imageUrl: string;
    parentMapId: string | null;
  }) => {
    if (!campaignId || !user) {
      throw new Error("Missing campaign or user.");
    }

    const siblingCount = maps.filter(
      (map) => normalizeParentId(map) === values.parentMapId,
    ).length;

    await createCampaignMap({
      campaignId,
      createdByUid: user.uid,
      title: values.title,
      imageUrl: values.imageUrl,
      parentMapId: values.parentMapId,
      order: siblingCount,
    });
  };

  const moveMap = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;

    setOrderedMapIds((current) => {
      const next = [...current];
      const sourceIndex = next.indexOf(sourceId);
      const targetIndex = next.indexOf(targetId);

      if (sourceIndex === -1 || targetIndex === -1) return current;

      next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, sourceId);
      return next;
    });
  };

  const persistMapOrder = async (ids: string[]) => {
    if (!campaignId || savingOrder || viewMode !== "nested") return;

    setSavingOrder(true);

    try {
      await Promise.all(
        ids.map((mapId, index) =>
          updateCampaignMap(campaignId, mapId, { order: index }),
        ),
      );
    } catch (error) {
      console.error("Failed to save map order:", error);
      setOrderedMapIds(nestedMaps.map((map) => map.id));
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    mapId: string,
  ) => {
    if (viewMode !== "nested") return;

    setDraggedMapId(mapId);
    setDragOverMapId(mapId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", mapId);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLElement>,
    targetMapId: string,
  ) => {
    if (viewMode !== "nested") return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (!draggedMapId || draggedMapId === targetMapId) return;
    if (dragOverMapId === targetMapId) return;

    setDragOverMapId(targetMapId);
    moveMap(draggedMapId, targetMapId);
  };

  const handleDragEnd = () => {
    const idsToSave = [...orderedMapIds];
    const hadDrag = Boolean(draggedMapId);

    setDraggedMapId(null);
    setDragOverMapId(null);

    if (hadDrag) {
      void persistMapOrder(idsToSave);
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
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex rounded-lg border border-white/10 bg-zinc-900/50 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("all")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === "all"
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              All maps
            </button>
            <button
              type="button"
              onClick={() => setViewMode("nested")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === "nested"
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Nested
            </button>
          </div>

          {viewMode === "nested" && savingOrder ? (
            <span className="text-[10px] font-medium text-zinc-500">
              Saving order…
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.09] hover:text-white"
        >
          <i className="fa-solid fa-plus mr-1.5 text-[10px]" />
          Add map
        </button>
      </div>

      {viewMode === "nested" ? (
        <div className="mb-3 flex min-h-9 items-center gap-1 overflow-x-auto rounded-lg border border-white/[0.07] bg-white/[0.02] px-2 py-1.5 text-xs workspace-scrollbar">
          <button
            type="button"
            onClick={() => setCurrentParentMapId(null)}
            className={`shrink-0 rounded-md px-2 py-1 transition ${
              currentParentMapId === null
                ? "font-semibold text-white"
                : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
            }`}
          >
            Maps
          </button>

          {breadcrumbs.map((map) => (
            <div key={map.id} className="flex shrink-0 items-center gap-1">
              <i className="fa-solid fa-chevron-right text-[8px] text-zinc-700" />
              <button
                type="button"
                onClick={() => setCurrentParentMapId(map.id)}
                className={`max-w-48 truncate rounded-md px-2 py-1 transition ${
                  map.id === currentParentMapId
                    ? "font-semibold text-white"
                    : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
                }`}
              >
                {map.title}
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {viewMode === "nested" && currentParentMap ? (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              Current map
            </div>
            <div className="truncate text-sm font-semibold text-white">
              {currentParentMap.title}
            </div>
          </div>

          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={() => openMap(currentParentMap.id)}
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => setEditingMapId(currentParentMap.id)}
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              Edit
            </button>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900/35 p-6 text-center">
          <p className="text-xs text-zinc-400">Loading maps...</p>
        </div>
      ) : visibleMaps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-zinc-900/25 p-6 text-center">
          <p className="text-sm font-semibold text-zinc-100">
            {viewMode === "nested" && currentParentMap
              ? "No submaps yet."
              : "No maps yet."}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            {viewMode === "nested" && currentParentMap
              ? `Add a map here to make it a submap of ${currentParentMap.title}.`
              : "Create your first map to start building the campaign world."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleMaps.map((map, index) => {
            const isDragging = draggedMapId === map.id;
            const isDragTarget =
              Boolean(draggedMapId) &&
              dragOverMapId === map.id &&
              draggedMapId !== map.id;
            const childCount = getChildCount(map.id);
            const parent =
              viewMode === "all" && normalizeParentId(map)
                ? mapById.get(normalizeParentId(map)!)
                : null;

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
                      {viewMode === "nested" ? (
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
                      ) : null}

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-white">
                          {viewMode === "nested" ? (
                            <span className="mr-1.5 text-zinc-500">
                              {index + 1}.
                            </span>
                          ) : null}
                          {map.title}
                        </h3>

                        <p className="mt-0.5 truncate text-xs text-zinc-500">
                          {map.rooms?.length ?? 0}{" "}
                          {(map.rooms?.length ?? 0) === 1 ? "area" : "areas"}
                          <span className="mx-1.5 text-zinc-700">•</span>
                          {childCount} {childCount === 1 ? "submap" : "submaps"}
                          {parent ? (
                            <>
                              <span className="mx-1.5 text-zinc-700">•</span>
                              <span>in {parent.title}</span>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-1.5">
                      {viewMode === "nested" ? (
                        <button
                          type="button"
                          onClick={() => openNestedMap(map.id)}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                          title={`Show submaps of ${map.title}`}
                        >
                          Browse
                        </button>
                      ) : null}

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
          allMaps={maps}
          onClose={() => setEditingMapId(null)}
        />
      ) : null}

      {isCreateModalOpen ? (
        <CreateMapModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateMap}
          maps={maps}
          defaultImageUrl={DEFAULT_IMAGE_URL}
          defaultParentMapId={viewMode === "nested" ? currentParentMapId : null}
        />
      ) : null}
    </>
  );
};

export default CampaignMapsPage;
