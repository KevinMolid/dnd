import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

import type { CampaignMap, CampaignMapRoom } from "../../features/maps/types";

export type MapCanvasHandle = {
  fitToViewport: () => void;
};

export type MapNpcMini = {
  npcId: string;
  name: string;
  imageUrl?: string;
  imageCropX?: number;
  imageCropY?: number;
  x: number;
  y: number;
  size?: number;
  hidden?: boolean;
};

type MapCanvasProps = {
  map: CampaignMap;

  rooms?: CampaignMapRoom[];

  selectedRoomId?: number | null;

  hoveredRoomId?: number | null;

  onSelectRoom?: (roomId: number) => void;

  onShowOverview?: () => void;

  onHoverRoom?: (roomId: number | null) => void;

  getRoomEnvironmentLabel?: (room: CampaignMapRoom) => string | null;

  showAreaNumbers?: boolean;
  showAreaNames?: boolean;
  showEnvironmentLabels?: boolean;
  showAreaBoundaries?: boolean;

  npcMinis?: MapNpcMini[];
  showNpcMinis?: boolean;
  placingNpcId?: string | null;
  onPlaceNpcMini?: (npcId: string, x: number, y: number) => void;
  onMoveNpcMini?: (npcId: string, x: number, y: number) => void;
  onSelectNpcMini?: (npcId: string) => void;

  className?: string;
};

type ImageSize = {
  width: number;

  height: number;
};

const MIN_ZOOM = 0.05;

const MAX_ZOOM = 4;

const MANUAL_ZOOM_STEP = 0.12;

const clampZoom = (value: number) =>
  Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));

const getSvgPoints = (
  room: CampaignMapRoom,

  imageSize: ImageSize,
) =>
  (room.markers ?? [])
    .map((point) => {
      const x = (point.x / 100) * imageSize.width;

      const y = (point.y / 100) * imageSize.height;

      return `${x},${y}`;
    })
    .join(" ");

const getDefaultPinPosition = (room: CampaignMapRoom) => {
  if (!room.markers || room.markers.length === 0) {
    return {
      x: 50,
      y: 50,
    };
  }

  return {
    x:
      room.markers.reduce((total, point) => total + point.x, 0) /
      room.markers.length,

    y:
      room.markers.reduce((total, point) => total + point.y, 0) /
      room.markers.length,
  };
};

const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(
  (
    {
      map,

      rooms,

      selectedRoomId = null,

      hoveredRoomId = null,

      onSelectRoom,

      onShowOverview,

      onHoverRoom,

      getRoomEnvironmentLabel,

      showAreaNumbers = true,

      showAreaNames = true,

      showEnvironmentLabels = true,

      showAreaBoundaries = true,

      npcMinis = [],

      showNpcMinis = true,

      placingNpcId = null,

      onPlaceNpcMini,

      onMoveNpcMini,

      onSelectNpcMini,

      className = "",
    },

    ref,
  ) => {
    const viewportRef = useRef<HTMLDivElement | null>(null);

    const imageRef = useRef<HTMLImageElement | null>(null);

    const imageLayerRef = useRef<HTMLDivElement | null>(null);

    const draggingMiniRef = useRef<{
      npcId: string;
      pointerId: number;
      x: number;
      y: number;
    } | null>(null);

    const [draggingMiniId, setDraggingMiniId] = useState<string | null>(null);

    const [imageSize, setImageSize] = useState<ImageSize | null>(null);

    const [zoom, setZoom] = useState(1);

    const [fitZoom, setFitZoom] = useState(1);

    const [isDragging, setIsDragging] = useState(false);

    const dragStartRef = useRef<{
      clientX: number;
      clientY: number;
      scrollLeft: number;
      scrollTop: number;
    } | null>(null);

    const displayedRooms = rooms ?? map.rooms ?? [];

    const selectedRoom = useMemo(
      () =>
        selectedRoomId === null
          ? null
          : (displayedRooms.find((room) => room.id === selectedRoomId) ?? null),

      [displayedRooms, selectedRoomId],
    );

    const selectedPolygonPoints = useMemo(() => {
      if (
        !selectedRoom ||
        !imageSize ||
        !selectedRoom.markers ||
        selectedRoom.markers.length < 3
      ) {
        return null;
      }

      return getSvgPoints(selectedRoom, imageSize);
    }, [selectedRoom, imageSize]);

    const fitToViewport = useCallback(() => {
      const viewport = viewportRef.current;

      const image = imageRef.current;

      if (!viewport || !image) {
        return;
      }

      const naturalWidth = image.naturalWidth;

      const naturalHeight = image.naturalHeight;

      if (naturalWidth <= 0 || naturalHeight <= 0) {
        return;
      }

      const availableWidth = viewport.clientWidth;

      const availableHeight = viewport.clientHeight;

      if (availableWidth <= 0 || availableHeight <= 0) {
        return;
      }

      const widthScale = availableWidth / naturalWidth;

      const heightScale = availableHeight / naturalHeight;

      const nextZoom = clampZoom(Math.min(widthScale, heightScale));

      setFitZoom(nextZoom);

      setZoom(nextZoom);

      window.requestAnimationFrame(() => {
        viewport.scrollLeft = 0;

        viewport.scrollTop = 0;
      });
    }, []);

    useImperativeHandle(
      ref,

      () => ({
        fitToViewport,
      }),

      [fitToViewport],
    );

    const handleImageLoad = useCallback(() => {
      const image = imageRef.current;

      if (!image) {
        return;
      }

      setImageSize({
        width: image.naturalWidth,

        height: image.naturalHeight,
      });

      window.requestAnimationFrame(() => {
        fitToViewport();
      });
    }, [fitToViewport]);

    useEffect(() => {
      setImageSize(null);

      setZoom(1);

      setFitZoom(1);

      const image = imageRef.current;

      if (image && image.complete && image.naturalWidth > 0) {
        handleImageLoad();
      }
    }, [map.id, map.imageUrl, handleImageLoad]);

    useEffect(() => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      let frame = 0;

      const observer = new ResizeObserver(() => {
        window.cancelAnimationFrame(frame);

        frame = window.requestAnimationFrame(() => {
          fitToViewport();
        });
      });

      observer.observe(viewport);

      return () => {
        observer.disconnect();

        window.cancelAnimationFrame(frame);
      };
    }, [fitToViewport]);

    const setZoomAroundCenter = useCallback(
      (nextZoom: number) => {
        const viewport = viewportRef.current;

        if (!viewport) {
          setZoom(clampZoom(nextZoom));

          return;
        }

        const previousZoom = zoom;

        const clamped = clampZoom(nextZoom);

        if (clamped === previousZoom) {
          return;
        }

        const centerX = viewport.scrollLeft + viewport.clientWidth / 2;

        const centerY = viewport.scrollTop + viewport.clientHeight / 2;

        const scale = clamped / previousZoom;

        setZoom(clamped);

        window.requestAnimationFrame(() => {
          viewport.scrollLeft = centerX * scale - viewport.clientWidth / 2;

          viewport.scrollTop = centerY * scale - viewport.clientHeight / 2;
        });
      },
      [zoom],
    );

    const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();

      const direction = event.deltaY > 0 ? -1 : 1;

      setZoomAroundCenter(zoom + direction * MANUAL_ZOOM_STEP);
    };

    const handlePointerDown = (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return;
      }

      const target = event.target as HTMLElement;

      if (target.closest("[data-map-interactive]")) {
        return;
      }

      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      dragStartRef.current = {
        clientX: event.clientX,

        clientY: event.clientY,

        scrollLeft: viewport.scrollLeft,

        scrollTop: viewport.scrollTop,
      };

      setIsDragging(true);
    };

    const handlePointerMove = (event: ReactMouseEvent<HTMLDivElement>) => {
      const dragStart = dragStartRef.current;

      const viewport = viewportRef.current;

      if (!dragStart || !viewport) {
        return;
      }

      const deltaX = event.clientX - dragStart.clientX;

      const deltaY = event.clientY - dragStart.clientY;

      viewport.scrollLeft = dragStart.scrollLeft - deltaX;

      viewport.scrollTop = dragStart.scrollTop - deltaY;
    };

    const stopDragging = () => {
      dragStartRef.current = null;

      setIsDragging(false);
    };

    const getImagePercentFromClientPoint = (
      clientX: number,
      clientY: number,
    ) => {
      const layer = imageLayerRef.current;

      if (!layer) {
        return null;
      }

      const rect = layer.getBoundingClientRect();

      if (rect.width <= 0 || rect.height <= 0) {
        return null;
      }

      return {
        x: Math.max(
          0,
          Math.min(100, ((clientX - rect.left) / rect.width) * 100),
        ),
        y: Math.max(
          0,
          Math.min(100, ((clientY - rect.top) / rect.height) * 100),
        ),
      };
    };

    const handleMiniPointerDown = (
      event: ReactPointerEvent<HTMLButtonElement>,
      mini: MapNpcMini,
    ) => {
      if (!onMoveNpcMini) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);

      draggingMiniRef.current = {
        npcId: mini.npcId,
        pointerId: event.pointerId,
        x: mini.x,
        y: mini.y,
      };

      setDraggingMiniId(mini.npcId);
    };

    const handleMiniPointerMove = (
      event: ReactPointerEvent<HTMLButtonElement>,
    ) => {
      const dragging = draggingMiniRef.current;

      if (!dragging || dragging.pointerId !== event.pointerId) {
        return;
      }

      const point = getImagePercentFromClientPoint(
        event.clientX,
        event.clientY,
      );

      if (!point) {
        return;
      }

      dragging.x = point.x;
      dragging.y = point.y;

      const target = event.currentTarget;
      target.style.left = `${point.x}%`;
      target.style.top = `${point.y}%`;
    };

    const finishMiniDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
      const dragging = draggingMiniRef.current;

      if (!dragging || dragging.pointerId !== event.pointerId) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      draggingMiniRef.current = null;
      setDraggingMiniId(null);

      onMoveNpcMini?.(dragging.npcId, dragging.x, dragging.y);
    };

    const scaledWidth = imageSize ? imageSize.width * zoom : 0;

    const scaledHeight = imageSize ? imageSize.height * zoom : 0;

    const isAtFitZoom = Math.abs(zoom - fitZoom) < 0.001;

    return (
      <div
        ref={viewportRef}
        onWheel={handleWheel}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={`workspace-scrollbar relative min-h-0 overflow-auto bg-zinc-950 select-none ${
          isDragging ? "cursor-grabbing" : zoom > fitZoom ? "cursor-grab" : ""
        } ${className}`}
      >
        <div
          className="relative flex min-h-full min-w-full items-center justify-center"
          style={{
            width: scaledWidth > 0 ? `max(100%, ${scaledWidth}px)` : "100%",

            height: scaledHeight > 0 ? `max(100%, ${scaledHeight}px)` : "100%",
          }}
        >
          <div
            ref={imageLayerRef}
            className="relative shrink-0"
            style={{
              width: scaledWidth > 0 ? `${scaledWidth}px` : undefined,

              height: scaledHeight > 0 ? `${scaledHeight}px` : undefined,
            }}
          >
            <img
              ref={imageRef}
              src={map.imageUrl}
              alt={map.title}
              draggable={false}
              onLoad={handleImageLoad}
              className="pointer-events-none block h-full w-full select-none"
            />

            {imageSize ? (
              <>
                {/* Interactive area polygons */}

                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
                  preserveAspectRatio="none"
                >
                  {displayedRooms.map((room) => {
                    if (!room.markers || room.markers.length < 3) {
                      return null;
                    }

                    const isSelected = selectedRoomId === room.id;

                    const isHovered = hoveredRoomId === room.id;

                    const points = getSvgPoints(room, imageSize);

                    return (
                      <polygon
                        key={room.id}
                        data-map-interactive
                        points={points}
                        onClick={(event) => {
                          event.stopPropagation();

                          onSelectRoom?.(room.id);
                        }}
                        onMouseEnter={() => onHoverRoom?.(room.id)}
                        onMouseLeave={() => onHoverRoom?.(null)}
                        className="cursor-pointer"
                        fill={
                          isSelected
                            ? "transparent"
                            : isHovered
                              ? "rgba(255,255,255,0.10)"
                              : showAreaBoundaries
                                ? "rgba(255,255,255,0.015)"
                                : "transparent"
                        }
                        stroke={
                          isSelected
                            ? "transparent"
                            : isHovered
                              ? "rgba(255,255,255,0.75)"
                              : showAreaBoundaries
                                ? "rgba(255,255,255,0.10)"
                                : "transparent"
                        }
                        strokeWidth={isHovered ? 3 : 1.5}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}
                </svg>

                {/* Selected-area spotlight */}

                {selectedPolygonPoints ? (
                  <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <mask
                        id={`selected-map-area-${map.id}`}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width={imageSize.width}
                        height={imageSize.height}
                      >
                        <rect
                          x="0"
                          y="0"
                          width={imageSize.width}
                          height={imageSize.height}
                          fill="white"
                        />

                        <polygon points={selectedPolygonPoints} fill="black" />
                      </mask>
                    </defs>

                    <rect
                      x="0"
                      y="0"
                      width={imageSize.width}
                      height={imageSize.height}
                      fill="rgba(0,0,0,0.30)"
                      mask={`url(#selected-map-area-${map.id})`}
                    />

                    <polygon
                      points={selectedPolygonPoints}
                      fill="transparent"
                      stroke="rgba(255,255,255,0.95)"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                ) : null}

                {/* Area pins */}

                {displayedRooms.map((room) => {
                  if (!room.markers || room.markers.length < 3) {
                    return null;
                  }

                  const pinPosition = room.pin ?? getDefaultPinPosition(room);

                  const isSelected = selectedRoomId === room.id;

                  const isHovered = hoveredRoomId === room.id;

                  const environmentLabel =
                    getRoomEnvironmentLabel?.(room) ?? null;

                  return (
                    <button
                      key={`pin-${room.id}`}
                      type="button"
                      data-map-interactive
                      onClick={(event) => {
                        event.stopPropagation();

                        onSelectRoom?.(room.id);
                      }}
                      onMouseEnter={() => onHoverRoom?.(room.id)}
                      onMouseLeave={() => onHoverRoom?.(null)}
                      title={`${room.id}. ${room.name}`}
                      aria-label={`${room.id}. ${room.name}${
                        environmentLabel ? `, ${environmentLabel}` : ""
                      }`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
                      style={{
                        left: `${pinPosition.x}%`,

                        top: `${pinPosition.y}%`,
                      }}
                    >
                      <div className="flex flex-col items-center">
                        {showAreaNumbers ? (
                          <div
                            className={`flex h-7 min-w-7 items-center justify-center rounded-full border px-1.5 text-[10px] font-bold shadow-lg backdrop-blur-sm transition ${
                              isSelected
                                ? "border-emerald-200 bg-emerald-500 text-white ring-2 ring-emerald-300/25"
                                : isHovered
                                  ? "border-white/70 bg-zinc-900/95 text-white"
                                  : "border-white/30 bg-black/90 text-white"
                            }`}
                          >
                            {room.id}
                          </div>
                        ) : null}

                        {showAreaNames ||
                        (showEnvironmentLabels && environmentLabel) ? (
                          <div
                            className={`${showAreaNumbers ? "mt-1" : ""} max-w-32 rounded-md border border-white/5 bg-black/90 px-2 py-1 text-center shadow-lg backdrop-blur-sm transition ${
                              isSelected || isHovered
                                ? "text-white"
                                : "text-zinc-200"
                            }`}
                          >
                            {showAreaNames ? (
                              <div className="truncate text-[9px] font-semibold leading-3.5">
                                {room.name}
                              </div>
                            ) : null}

                            {showEnvironmentLabels && environmentLabel ? (
                              <div
                                className={`${showAreaNames ? "mt-0.5" : ""} truncate text-[8px] font-semibold leading-3 text-emerald-300`}
                              >
                                {environmentLabel}
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        {!showAreaNumbers &&
                        !showAreaNames &&
                        !(showEnvironmentLabels && environmentLabel) ? (
                          <div className="h-4 w-4 rounded-full border border-transparent bg-transparent" />
                        ) : null}
                      </div>
                    </button>
                  );
                })}

                {/* NPC minis */}
                {showNpcMinis
                  ? npcMinis.map((mini) => {
                      const size = Math.max(28, Math.min(72, mini.size ?? 42));
                      const isDragging = draggingMiniId === mini.npcId;

                      return (
                        <button
                          key={`npc-mini-${mini.npcId}`}
                          type="button"
                          data-map-interactive
                          onClick={(event) => {
                            event.stopPropagation();

                            if (!isDragging) {
                              onSelectNpcMini?.(mini.npcId);
                            }
                          }}
                          onPointerDown={(event) =>
                            handleMiniPointerDown(event, mini)
                          }
                          onPointerMove={handleMiniPointerMove}
                          onPointerUp={finishMiniDrag}
                          onPointerCancel={finishMiniDrag}
                          title={`${mini.name}${mini.hidden ? " (hidden)" : ""}`}
                          aria-label={`NPC mini: ${mini.name}`}
                          className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-zinc-950 p-0.5 shadow-xl transition ${
                            isDragging
                              ? "cursor-grabbing border-emerald-300 ring-2 ring-emerald-300/30"
                              : mini.hidden
                                ? "cursor-grab border-violet-400/80 ring-2 ring-violet-400/15 hover:scale-105"
                                : "cursor-grab border-white/80 hover:scale-105 hover:border-emerald-300"
                          }`}
                          style={{
                            left: `${mini.x}%`,
                            top: `${mini.y}%`,
                            width: `${size}px`,
                            height: `${size}px`,
                            touchAction: "none",
                          }}
                        >
                          <img
                            src={mini.imageUrl || "/images/DefaultNPC.png"}
                            alt=""
                            draggable={false}
                            className="pointer-events-none h-full w-full rounded-full object-cover"
                            style={{
                              objectPosition: `${mini.imageCropX ?? 50}% ${mini.imageCropY ?? 50}%`,
                            }}
                          />

                          {mini.hidden ? (
                            <span className="pointer-events-none absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-violet-300/30 bg-violet-950 text-[7px] text-violet-200 shadow">
                              <i className="fa-solid fa-eye-slash" />
                            </span>
                          ) : null}
                        </button>
                      );
                    })
                  : null}

                {/* Placement overlay */}
                {placingNpcId ? (
                  <button
                    type="button"
                    data-map-interactive
                    onClick={(event) => {
                      event.stopPropagation();

                      const point = getImagePercentFromClientPoint(
                        event.clientX,
                        event.clientY,
                      );

                      if (point) {
                        onPlaceNpcMini?.(placingNpcId, point.x, point.y);
                      }
                    }}
                    className="absolute inset-0 z-30 cursor-crosshair bg-emerald-400/[0.02]"
                    aria-label="Place NPC mini on map"
                    title="Click to place NPC mini"
                  >
                    <span className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-md border border-emerald-400/20 bg-black/85 px-2.5 py-1 text-[10px] font-semibold text-emerald-200 shadow-lg">
                      Click map to place NPC mini
                    </span>
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        {/* Fit control shown after manual zoom */}

        {!isAtFitZoom ? (
          <button
            type="button"
            data-map-interactive
            onClick={(event) => {
              event.stopPropagation();

              fitToViewport();
            }}
            title="Fit map"
            aria-label="Fit map to available space"
            className="absolute bottom-2 right-2 flex h-8 items-center gap-1.5 rounded-md border border-white/15 bg-black/85 px-2.5 text-[10px] font-semibold text-zinc-200 shadow-lg backdrop-blur transition hover:bg-zinc-900 hover:text-white"
          >
            <i className="fa-solid fa-expand text-[9px]" />
            Fit
          </button>
        ) : null}

        {/* Overview control */}

        {selectedRoomId !== null && onShowOverview ? (
          <button
            type="button"
            data-map-interactive
            onClick={onShowOverview}
            title="Return to map overview"
            aria-label="Return to map overview"
            className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-md border border-white/15 bg-black/80 text-[10px] text-zinc-200 shadow-lg backdrop-blur transition hover:bg-zinc-900 hover:text-white"
          >
            <i className="fa-solid fa-map" />
          </button>
        ) : null}
      </div>
    );
  },
);

MapCanvas.displayName = "MapCanvas";

export default MapCanvas;
