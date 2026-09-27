import { useEffect, useState } from "react";
import type { CampaignMap } from "../features/maps/types";

type DropPosition = "before" | "after";

type Props = {
  currentMap: CampaignMap | null;
  rootMaps: CampaignMap[];
  childrenByParent: Map<string | null, CampaignMap[]>;
  onBrowse: (id: string) => void;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onAddSubmap: (id: string) => void;
  onMoveInto: (sourceId: string, parentId: string) => Promise<void> | void;
  onMoveToParent: (
    sourceId: string,
    parentId: string | null,
  ) => Promise<void> | void;
  onReorder: (
    sourceId: string,
    targetId: string,
    position: DropPosition,
  ) => Promise<void> | void;
};

const NestedMapTree = ({
  currentMap,
  rootMaps,
  childrenByParent,
  onBrowse,
  onOpen,
  onEdit,
  onAddSubmap,
  onMoveInto,
  onMoveToParent,
  onReorder,
}: Props) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [nestTargetId, setNestTargetId] = useState<string | null>(null);
  const [folderDropActive, setFolderDropActive] = useState(false);

  const clearDragState = () => {
    setDraggedId(null);
    setNestTargetId(null);
    setFolderDropActive(false);
  };

  useEffect(() => {
    const clear = () => {
      setDraggedId(null);
      setNestTargetId(null);
      setFolderDropActive(false);
    };

    // Native listeners guarantee cleanup even when a drop happens on the
    // original position, outside a valid React drop target, or after the
    // browser cancels the drag.
    window.addEventListener("dragend", clear);
    window.addEventListener("drop", clear);

    return () => {
      window.removeEventListener("dragend", clear);
      window.removeEventListener("drop", clear);
    };
  }, []);

  const startDrag = (event: React.DragEvent<HTMLElement>, mapId: string) => {
    clearDragState();
    setDraggedId(mapId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", mapId);
  };

  const getDraggedId = (event: React.DragEvent) =>
    draggedId || event.dataTransfer.getData("text/plain");

  const dragTargetHandlers = (mapId: string) => ({
    onDragEnter: (event: React.DragEvent<HTMLElement>) => {
      if (!draggedId || draggedId === mapId) return;
      event.preventDefault();
      event.stopPropagation();
      setNestTargetId(mapId);
    },
    onDragOver: (event: React.DragEvent<HTMLElement>) => {
      if (!draggedId || draggedId === mapId) return;
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
    },
    onDragLeave: (event: React.DragEvent<HTMLElement>) => {
      const nextTarget = event.relatedTarget as Node | null;
      if (nextTarget && event.currentTarget.contains(nextTarget)) return;
      if (nestTargetId === mapId) setNestTargetId(null);
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const sourceId = getDraggedId(event);
      if (sourceId && sourceId !== mapId) {
        void onMoveInto(sourceId, mapId);
      }
      clearDragState();
    },
  });

  const sideReorderHandlers = (targetId: string, position: DropPosition) => ({
    onDragEnter: (event: React.DragEvent<HTMLDivElement>) => {
      const sourceId = getDraggedId(event);
      if (!sourceId || sourceId === targetId) return;

      event.preventDefault();
      event.stopPropagation();
      setNestTargetId(null);

      /*
       * Match the original CampaignMaps behavior: reorder as soon as the
       * dragged map enters an insertion zone. This is much more reliable
       * than waiting for a drop event on a very thin target.
       */
      void onReorder(sourceId, targetId, position);
    },
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => {
      const sourceId = getDraggedId(event);
      if (!sourceId || sourceId === targetId) return;

      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "move";
      setNestTargetId(null);
    },
    onDragLeave: (event: React.DragEvent<HTMLDivElement>) => {
      const nextTarget = event.relatedTarget as Node | null;
      if (nextTarget && event.currentTarget.contains(nextTarget)) return;
    },
    onDrop: (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      clearDragState();
    },
  });

  const SideReorderZones = ({ targetId }: { targetId: string }) => {
    if (!draggedId || draggedId === targetId) return null;

    return (
      <>
        <div
          {...sideReorderHandlers(targetId, "before")}
          className="absolute -left-3 top-0 bottom-0 z-40 w-6"
          aria-hidden="true"
        ></div>

        <div
          {...sideReorderHandlers(targetId, "after")}
          className="absolute -right-3 top-0 bottom-0 z-40 w-6"
          aria-hidden="true"
        ></div>
      </>
    );
  };

  const MiniPreview = ({ map }: { map: CampaignMap }) => {
    const isNestTarget = nestTargetId === map.id && draggedId !== map.id;

    return (
      <button
        type="button"
        draggable
        onDragStart={(event) => startDrag(event, map.id)}
        onDragEnd={clearDragState}
        onClick={() => onBrowse(map.id)}
        {...dragTargetHandlers(map.id)}
        className={`group relative aspect-[16/9] w-full overflow-hidden rounded-md border bg-black transition ${
          isNestTarget
            ? "border-cyan-400/70 ring-2 ring-cyan-400/15"
            : "border-white/10 hover:border-white/30"
        }`}
        title={map.title}
      >
        <img
          src={map.imageUrl}
          alt={map.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          draggable={false}
        />
      </button>
    );
  };

  const SubSubmapStrip = ({ parentId }: { parentId: string }) => {
    const maps = childrenByParent.get(parentId) ?? [];
    if (!maps.length) return null;

    return (
      <div className="workspace-scrollbar mt-1.5 overflow-x-auto overscroll-x-contain pb-1">
        <div className="grid auto-cols-[calc((100%-1rem)/3)] grid-flow-col gap-2">
          {maps.map((map) => (
            <MiniPreview key={map.id} map={map} />
          ))}
        </div>
      </div>
    );
  };

  const ChildCard = ({ map }: { map: CampaignMap }) => {
    const isNestTarget = nestTargetId === map.id && draggedId !== map.id;

    return (
      <div className="relative min-w-0">
        <SideReorderZones targetId={map.id} />
        <button
          type="button"
          draggable
          onDragStart={(event) => startDrag(event, map.id)}
          onDragEnd={clearDragState}
          onClick={() => onBrowse(map.id)}
          {...dragTargetHandlers(map.id)}
          className={`group relative block w-full overflow-hidden rounded-lg border bg-zinc-950 text-left transition ${
            isNestTarget
              ? "border-cyan-400/70 ring-2 ring-cyan-400/15"
              : "border-white/10 hover:border-white/25"
          }`}
        >
          <div className="aspect-[16/9] overflow-hidden bg-black">
            <img
              src={map.imageUrl}
              alt={map.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              draggable={false}
            />
          </div>
          <div className="truncate px-2 py-2 text-xs font-semibold text-zinc-100">
            {map.title}
          </div>

          {isNestTarget ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/65">
              <span className="rounded-md border border-cyan-300/30 bg-cyan-400/10 px-2 py-1 text-[10px] font-semibold text-cyan-100">
                Make submap
              </span>
            </div>
          ) : null}
        </button>

        <SubSubmapStrip parentId={map.id} />
      </div>
    );
  };

  const RootCard = ({ map, index }: { map: CampaignMap; index: number }) => {
    const isNestTarget = nestTargetId === map.id && draggedId !== map.id;

    return (
      <div className="relative min-w-0">
        <SideReorderZones targetId={map.id} />

        <article
          draggable
          onDragStart={(event) => startDrag(event, map.id)}
          onDragEnd={clearDragState}
          {...dragTargetHandlers(map.id)}
          className={`group relative overflow-hidden rounded-xl border bg-zinc-900/35 transition ${
            isNestTarget
              ? "border-cyan-400/70 ring-2 ring-cyan-400/15"
              : "border-white/[0.08] hover:border-white/15"
          }`}
        >
          <button
            type="button"
            onClick={() => onBrowse(map.id)}
            className="block w-full overflow-hidden bg-black text-left"
            title={`Browse ${map.title}`}
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
                <div className="flex h-7 w-5 shrink-0 cursor-grab items-center justify-center text-zinc-600 active:cursor-grabbing">
                  <i className="fa-solid fa-grip-vertical text-[10px]" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-white">
                    <span className="mr-1.5 text-zinc-500">{index + 1}.</span>
                    {map.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {map.rooms?.length ?? 0}{" "}
                    {(map.rooms?.length ?? 0) === 1 ? "area" : "areas"}
                    <span className="mx-1.5 text-zinc-700">•</span>
                    {childrenByParent.get(map.id)?.length ?? 0}{" "}
                    {(childrenByParent.get(map.id)?.length ?? 0) === 1
                      ? "submap"
                      : "submaps"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpen(map.id)}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(map.id)}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          {isNestTarget ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/65">
              <span className="rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100">
                Drop to make submap
              </span>
            </div>
          ) : null}
        </article>
      </div>
    );
  };

  const TopLevelDropZone = () => {
    if (!draggedId) return null;

    const draggedMap = [
      ...rootMaps,
      ...Array.from(childrenByParent.values()).flat(),
    ].find((map) => map.id === draggedId);
    if (!draggedMap || (draggedMap.parentMapId ?? null) === null) return null;

    return (
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setNestTargetId(null);
          setFolderDropActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          event.dataTransfer.dropEffect = "move";
        }}
        onDragLeave={(event) => {
          const nextTarget = event.relatedTarget as Node | null;
          if (nextTarget && event.currentTarget.contains(nextTarget)) return;
          setFolderDropActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const sourceId = getDraggedId(event);
          clearDragState();
          if (sourceId) void onMoveToParent(sourceId, null);
        }}
        className={`mb-3 rounded-lg border border-dashed px-3 py-3 text-center text-xs font-medium transition ${
          folderDropActive
            ? "border-cyan-400/60 bg-cyan-400/[0.10] text-cyan-100"
            : "border-white/15 bg-white/[0.025] text-zinc-500"
        }`}
      >
        Drop here to make this a top-level map
      </div>
    );
  };

  if (!currentMap) {
    return (
      <>
        <TopLevelDropZone />
        <div className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rootMaps.map((map, index) => {
            const submaps = childrenByParent.get(map.id) ?? [];

            return (
              <div key={map.id} className="min-w-0">
                <RootCard map={map} index={index} />

                <div className="mt-2">
                  {submaps.length ? (
                    <div className="workspace-scrollbar overflow-x-auto overscroll-x-contain pb-2">
                      <div className="grid auto-cols-[calc((100%-1.5rem)/3)] grid-flow-col gap-3">
                        {submaps.map((submap) => (
                          <ChildCard key={submap.id} map={submap} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-white/[0.08] bg-white/[0.015] px-3 py-4 text-center text-xs text-zinc-600">
                      This map has no submaps
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  const submaps = childrenByParent.get(currentMap.id) ?? [];
  const parentId = currentMap.parentMapId ?? null;
  const currentIsNestTarget =
    nestTargetId === currentMap.id && draggedId !== currentMap.id;

  return (
    <>
      <TopLevelDropZone />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <article
          draggable
          onDragStart={(event) => startDrag(event, currentMap.id)}
          onDragEnd={clearDragState}
          {...dragTargetHandlers(currentMap.id)}
          className={`group relative overflow-hidden rounded-xl border bg-zinc-900/35 transition ${
            currentIsNestTarget
              ? "border-cyan-400/70 ring-2 ring-cyan-400/15"
              : "border-white/[0.08] hover:border-white/15"
          }`}
        >
          <button
            type="button"
            onClick={() => onBrowse(currentMap.id)}
            className="block w-full overflow-hidden bg-black text-left"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={currentMap.imageUrl}
                alt={currentMap.title}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </button>

          <div className="flex items-center justify-between gap-3 p-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-white">
                {currentMap.title}
              </h3>
              <p className="mt-0.5 text-xs text-zinc-500">
                {currentMap.rooms?.length ?? 0}{" "}
                {(currentMap.rooms?.length ?? 0) === 1 ? "area" : "areas"}
                <span className="mx-1.5 text-zinc-700">•</span>
                {submaps.length} {submaps.length === 1 ? "submap" : "submaps"}
              </p>
            </div>

            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => onAddSubmap(currentMap.id)}
                className="rounded-md border border-dashed border-white/10 px-2.5 py-2 text-xs text-zinc-500 transition hover:border-white/20 hover:text-zinc-300"
              >
                + Submap
              </button>
              <button
                type="button"
                onClick={() => onOpen(currentMap.id)}
                className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
              >
                Open
              </button>
              <button
                type="button"
                onClick={() => onEdit(currentMap.id)}
                className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                Edit
              </button>
            </div>
          </div>
        </article>
      </div>

      {submaps.length ? (
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-end">
            <button
              type="button"
              onClick={() => onAddSubmap(currentMap.id)}
              className="text-xs text-zinc-500 transition hover:text-white"
            >
              + Add submap
            </button>
          </div>

          <div className="workspace-scrollbar overflow-x-auto overscroll-x-contain pb-2">
            <div className="grid auto-cols-[calc((100%-1.5rem)/3)] grid-flow-col gap-3">
              {submaps.map((map) => (
                <div key={map.id} className="min-w-0">
                  <ChildCard map={map} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-end">
            <button
              type="button"
              onClick={() => onAddSubmap(currentMap.id)}
              className="text-xs text-zinc-500 transition hover:text-white"
            >
              + Add submap
            </button>
          </div>
          <div className="rounded-lg border border-dashed border-white/[0.08] bg-white/[0.015] px-3 py-4 text-center text-xs text-zinc-600">
            This map has no submaps
          </div>
        </div>
      )}

      {draggedId && parentId !== null ? (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }}
          onDrop={(event) => {
            event.preventDefault();
            const sourceId = getDraggedId(event);
            if (sourceId) void onMoveToParent(sourceId, parentId);
            clearDragState();
          }}
          className="mt-3 rounded-lg border border-dashed border-white/10 px-3 py-2 text-center text-[10px] text-zinc-600"
        >
          Drop here to move to the parent level
        </div>
      ) : null}
    </>
  );
};

export default NestedMapTree;
