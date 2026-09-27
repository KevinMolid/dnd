import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MapEditorModal from "../components/MapEditorModal";
import CreateMapModal from "./CreateMapModal";
import NestedMapTree from "./NestedMapTree";
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
type DropPosition = "before" | "after";

const parentIdOf = (map: CampaignMap) => map.parentMapId ?? null;

const CampaignMapsPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { maps, loading } = useCampaignMaps(campaignId ?? null);

  const [editingMapId, setEditingMapId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createParentMapId, setCreateParentMapId] = useState<string | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("nested");
  const [currentMapId, setCurrentMapId] = useState<string | null>(null);
  const [savingStructure, setSavingStructure] = useState(false);

  const mapById = useMemo(
    () => new Map(maps.map((map) => [map.id, map])),
    [maps],
  );

  const childrenByParent = useMemo(() => {
    const result = new Map<string | null, CampaignMap[]>();

    maps.forEach((map) => {
      const parentId = parentIdOf(map);
      result.set(parentId, [...(result.get(parentId) ?? []), map]);
    });

    result.forEach((siblings) => {
      siblings.sort(
        (a, b) =>
          (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title),
      );
    });

    return result;
  }, [maps]);

  const roots = useMemo(
    () => childrenByParent.get(null) ?? [],
    [childrenByParent],
  );

  const currentMap = currentMapId ? (mapById.get(currentMapId) ?? null) : null;

  const breadcrumbs = useMemo(() => {
    if (!currentMap) return [];

    const result: CampaignMap[] = [];
    const visited = new Set<string>();
    let current: CampaignMap | null = currentMap;

    while (current) {
      if (visited.has(current.id)) break;
      visited.add(current.id);
      result.unshift(current);

      const parentId = parentIdOf(current);
      current = parentId ? (mapById.get(parentId) ?? null) : null;
    }

    return result;
  }, [currentMap, mapById]);

  const allMaps = useMemo(
    () =>
      [...maps].sort(
        (a, b) =>
          (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title),
      ),
    [maps],
  );

  const editingMap = useMemo(
    () => maps.find((map) => map.id === editingMapId) ?? null,
    [maps, editingMapId],
  );

  const openMapViewer = (mapId: string) => {
    if (!campaignId) return;
    navigate(`/campaigns/${campaignId}/maps/${mapId}`);
  };

  const browseMap = (mapId: string) => {
    setCurrentMapId(mapId);
  };

  const openCreateModal = (parentMapId: string | null) => {
    setCreateParentMapId(parentMapId);
    setIsCreateModalOpen(true);
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
      (map) => parentIdOf(map) === values.parentMapId,
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

  const wouldCreateCycle = (sourceId: string, newParentId: string) => {
    if (sourceId === newParentId) return true;

    const visited = new Set<string>();
    let currentId: string | null = newParentId;

    while (currentId) {
      if (currentId === sourceId) return true;
      if (visited.has(currentId)) return true;
      visited.add(currentId);

      const current = mapById.get(currentId);
      currentId = current ? parentIdOf(current) : null;
    }

    return false;
  };

  const normalizeSiblingOrder = async (
    parentMapId: string | null,
    orderedIds: string[],
  ) => {
    if (!campaignId) return;

    await Promise.all(
      orderedIds.map((mapId, index) =>
        updateCampaignMap(campaignId, mapId, {
          parentMapId,
          order: index,
        }),
      ),
    );
  };

  const moveMapInto = async (sourceId: string, newParentId: string) => {
    if (!campaignId || savingStructure) return;
    if (wouldCreateCycle(sourceId, newParentId)) return;

    const source = mapById.get(sourceId);
    if (!source) return;

    const oldParentId = parentIdOf(source);
    if (oldParentId === newParentId) return;

    const oldSiblings = (childrenByParent.get(oldParentId) ?? [])
      .filter((map) => map.id !== sourceId)
      .map((map) => map.id);

    const newSiblings = (childrenByParent.get(newParentId) ?? [])
      .filter((map) => map.id !== sourceId)
      .map((map) => map.id);

    setSavingStructure(true);
    try {
      await updateCampaignMap(campaignId, sourceId, {
        parentMapId: newParentId,
        order: newSiblings.length,
      });

      await Promise.all([
        normalizeSiblingOrder(oldParentId, oldSiblings),
        normalizeSiblingOrder(newParentId, [...newSiblings, sourceId]),
      ]);
    } catch (error) {
      console.error("Failed to move map into parent:", error);
    } finally {
      setSavingStructure(false);
    }
  };

  const moveMapToParent = async (
    sourceId: string,
    newParentId: string | null,
  ) => {
    if (!campaignId || savingStructure) return;

    if (newParentId) {
      await moveMapInto(sourceId, newParentId);
      return;
    }

    const source = mapById.get(sourceId);
    if (!source) return;

    const oldParentId = parentIdOf(source);
    if (oldParentId === null) return;

    const oldSiblings = (childrenByParent.get(oldParentId) ?? [])
      .filter((map) => map.id !== sourceId)
      .map((map) => map.id);

    const rootIds = roots
      .filter((map) => map.id !== sourceId)
      .map((map) => map.id);

    setSavingStructure(true);
    try {
      await updateCampaignMap(campaignId, sourceId, {
        parentMapId: null,
        order: rootIds.length,
      });

      await Promise.all([
        normalizeSiblingOrder(oldParentId, oldSiblings),
        normalizeSiblingOrder(null, [...rootIds, sourceId]),
      ]);
    } catch (error) {
      console.error("Failed to move map to root:", error);
    } finally {
      setSavingStructure(false);
    }
  };

  const reorderMap = async (
    sourceId: string,
    targetId: string,
    position: DropPosition,
  ) => {
    if (!campaignId || savingStructure || sourceId === targetId) return;

    const source = mapById.get(sourceId);
    const target = mapById.get(targetId);
    if (!source || !target) return;

    const sourceParentId = parentIdOf(source);
    const targetParentId = parentIdOf(target);

    if (sourceParentId !== targetParentId) return;

    const siblingIds = (childrenByParent.get(sourceParentId) ?? []).map(
      (map) => map.id,
    );

    const withoutSource = siblingIds.filter((id) => id !== sourceId);
    const targetIndex = withoutSource.indexOf(targetId);
    if (targetIndex === -1) return;

    const insertIndex = position === "before" ? targetIndex : targetIndex + 1;
    withoutSource.splice(insertIndex, 0, sourceId);

    setSavingStructure(true);
    try {
      await normalizeSiblingOrder(sourceParentId, withoutSource);
    } catch (error) {
      console.error("Failed to reorder maps:", error);
    } finally {
      setSavingStructure(false);
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

          {savingStructure ? (
            <span className="text-[10px] font-medium text-zinc-500">
              Saving map structure…
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() =>
            openCreateModal(
              viewMode === "nested" && currentMap ? currentMap.id : null,
            )
          }
          className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.09] hover:text-white"
        >
          <i className="fa-solid fa-plus mr-1.5 text-[10px]" />
          Add map
        </button>
      </div>

      {viewMode === "nested" && currentMap ? (
        <div className="workspace-scrollbar mb-3 flex min-h-9 items-center gap-1 overflow-x-auto rounded-lg border border-white/[0.08] bg-zinc-900/25 px-2 py-1">
          <button
            type="button"
            onClick={() => setCurrentMapId(null)}
            className={`shrink-0 rounded-md px-2 py-1.5 text-xs font-medium transition ${
              currentMap === null
                ? "text-white"
                : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
            }`}
          >
            Maps
          </button>

          {breadcrumbs.map((breadcrumb) => {
            const isCurrent = breadcrumb.id === currentMap?.id;

            return (
              <div
                key={breadcrumb.id}
                className="flex shrink-0 items-center gap-1"
              >
                <i className="fa-solid fa-chevron-right text-[8px] text-zinc-700" />
                <button
                  type="button"
                  onClick={() => setCurrentMapId(breadcrumb.id)}
                  className={`max-w-52 truncate rounded-md px-2 py-1.5 text-xs font-medium transition ${
                    isCurrent
                      ? "text-white"
                      : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"
                  }`}
                  title={breadcrumb.title}
                >
                  {breadcrumb.title}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900/35 p-6 text-center">
          <p className="text-xs text-zinc-400">Loading maps...</p>
        </div>
      ) : maps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-zinc-900/25 p-6 text-center">
          <p className="text-sm font-semibold text-zinc-100">No maps yet.</p>
          <p className="mt-1 text-xs text-zinc-400">
            Create your first map to start building the campaign world.
          </p>
        </div>
      ) : viewMode === "nested" ? (
        <NestedMapTree
          currentMap={currentMap}
          rootMaps={roots}
          childrenByParent={childrenByParent}
          onBrowse={browseMap}
          onOpen={openMapViewer}
          onEdit={setEditingMapId}
          onAddSubmap={openCreateModal}
          onMoveInto={moveMapInto}
          onMoveToParent={moveMapToParent}
          onReorder={reorderMap}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {allMaps.map((map) => {
            const parentId = parentIdOf(map);
            const parent = parentId ? (mapById.get(parentId) ?? null) : null;
            const childCount = childrenByParent.get(map.id)?.length ?? 0;

            return (
              <article
                key={map.id}
                className="group overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900/35 transition hover:border-white/15"
              >
                <button
                  type="button"
                  onClick={() => openMapViewer(map.id)}
                  className="block w-full overflow-hidden bg-black text-left"
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
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-white">
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
                            in {parent.title}
                          </>
                        ) : null}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => openMapViewer(map.id)}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingMapId(map.id)}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
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
          defaultParentMapId={createParentMapId}
        />
      ) : null}
    </>
  );
};

export default CampaignMapsPage;
