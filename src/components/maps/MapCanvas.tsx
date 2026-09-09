import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import type { CampaignMap, CampaignMapRoom } from "../../features/maps/types";

export type MapCanvasHandle = {
  fitToViewport: () => void;
};

type MapCanvasProps = {
  map: CampaignMap;

  rooms: CampaignMapRoom[];

  selectedRoomId: number | null;

  hoveredRoomId: number | null;

  onSelectRoom: (roomId: number) => void;

  onShowOverview: () => void;

  onHoverRoom: (roomId: number | null) => void;

  getRoomEnvironmentLabel?: (room: CampaignMapRoom) => string | null;

  className?: string;
};

const MIN_ZOOM = 0.2;

const MAX_ZOOM = 4;

const VIEWPORT_PADDING = 32;

const clampZoom = (value: number) => {
  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
};

const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(
  function MapCanvas(
    {
      map,
      rooms,
      selectedRoomId,
      hoveredRoomId,
      onSelectRoom,
      onShowOverview,
      onHoverRoom,
      getRoomEnvironmentLabel,
      className = "",
    },
    ref,
  ) {
    const viewportRef = useRef<HTMLDivElement | null>(null);

    const imageRef = useRef<HTMLImageElement | null>(null);

    const resizeFrameRef = useRef<number | null>(null);

    const [zoom, setZoom] = useState(1);

    const [imageSize, setImageSize] = useState<{
      width: number;

      height: number;
    } | null>(null);

    const reactId = useId();

    const spotlightMaskId = `map-spotlight-${reactId}`.replace(/:/g, "");

    const fitToViewport = () => {
      const viewport = viewportRef.current;

      const image = imageRef.current;

      if (!viewport || !image) {
        return;
      }

      const naturalWidth = image.naturalWidth;

      const naturalHeight = image.naturalHeight;

      if (!naturalWidth || !naturalHeight) {
        return;
      }

      const availableWidth = viewport.clientWidth - VIEWPORT_PADDING;

      const availableHeight = viewport.clientHeight - VIEWPORT_PADDING;

      if (availableWidth <= 0 || availableHeight <= 0) {
        return;
      }

      /*
       * Fit both width and height.
       *
       * This behaves better inside arbitrary
       * workspace card dimensions than fitting
       * by width alone.
       */
      const widthZoom = availableWidth / naturalWidth;

      const heightZoom = availableHeight / naturalHeight;

      const nextZoom = Math.min(widthZoom, heightZoom);

      setZoom(clampZoom(nextZoom));
    };

    useImperativeHandle(ref, () => ({
      fitToViewport,
    }));

    /*
     * ResizeObserver is essential for workspace cards.
     *
     * React-grid-layout can resize the module without
     * triggering window.resize.
     */
    useEffect(() => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      if (typeof ResizeObserver === "undefined") {
        return;
      }

      const observer = new ResizeObserver(() => {
        if (resizeFrameRef.current !== null) {
          window.cancelAnimationFrame(resizeFrameRef.current);
        }

        resizeFrameRef.current = window.requestAnimationFrame(() => {
          fitToViewport();

          resizeFrameRef.current = null;
        });
      });

      observer.observe(viewport);

      return () => {
        observer.disconnect();

        if (resizeFrameRef.current !== null) {
          window.cancelAnimationFrame(resizeFrameRef.current);
        }
      };
    }, []);

    /*
     * Fallback for normal browser resizing.
     */
    useEffect(() => {
      const handleResize = () => {
        fitToViewport();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    useEffect(() => {
      setImageSize(null);

      setZoom(1);
    }, [map.id, map.imageUrl]);

    const handleImageLoad = () => {
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
    };

    const getSvgPoints = (
      markers: {
        x: number;

        y: number;
      }[],
    ) => {
      if (!imageSize) {
        return "";
      }

      return markers
        .map((point) => {
          const x = (point.x / 100) * imageSize.width;

          const y = (point.y / 100) * imageSize.height;

          return `${x},${y}`;
        })
        .join(" ");
    };

    const selectedRoom =
      selectedRoomId === null
        ? null
        : (rooms.find((room) => room.id === selectedRoomId) ?? null);

    const selectedPolygonPoints =
      selectedRoom &&
      selectedRoom.markers &&
      selectedRoom.markers.length >= 3 &&
      imageSize
        ? getSvgPoints(selectedRoom.markers)
        : null;

    return (
      <div
        ref={viewportRef}
        className={`min-h-0 min-w-0 overflow-auto bg-zinc-900 p-4 ${className}`}
      >
        <div className="flex min-h-full min-w-full items-center justify-center">
          <div
            className="relative"
            onClick={onShowOverview}
            style={{
              width: imageSize ? `${imageSize.width * zoom}px` : "100%",
            }}
          >
            <img
              ref={imageRef}
              src={map.imageUrl}
              alt={map.title}
              className="block h-auto w-full select-none rounded"
              draggable={false}
              onLoad={handleImageLoad}
            />

            {/* Interactive area polygons */}

            {imageSize && (
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
              >
                {rooms.map((room) => {
                  if (!room.markers || room.markers.length < 3) {
                    return null;
                  }

                  const isSelected = selectedRoomId === room.id;

                  const isHovered = hoveredRoomId === room.id;

                  const points = getSvgPoints(room.markers);

                  return (
                    <polygon
                      key={room.id}
                      points={points}
                      onClick={(event) => {
                        event.stopPropagation();

                        onSelectRoom(room.id);
                      }}
                      onMouseEnter={() => onHoverRoom(room.id)}
                      onMouseLeave={() => onHoverRoom(null)}
                      className="cursor-pointer"
                      fill={
                        isSelected
                          ? "transparent"
                          : isHovered
                            ? "rgba(255,255,255,0.10)"
                            : "rgba(255,255,255,0.015)"
                      }
                      stroke={
                        isSelected
                          ? "transparent"
                          : isHovered
                            ? "rgba(255,255,255,0.75)"
                            : "rgba(255,255,255,0.10)"
                      }
                      strokeWidth={isHovered ? 3 : 1.5}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </svg>
            )}

            {/* Spotlight */}

            {selectedPolygonPoints && imageSize && (
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox={`0 0 ${imageSize.width} ${imageSize.height}`}
              >
                <defs>
                  <mask
                    id={spotlightMaskId}
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
                  fill="rgba(0,0,0,0.3)"
                  mask={`url(#${spotlightMaskId})`}
                />

                <polygon
                  points={selectedPolygonPoints}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}

            {/* Area pins */}

            {rooms.map((room) => {
              if (!room.markers || room.markers.length < 3) {
                return null;
              }

              const defaultPin = {
                x:
                  room.markers.reduce((total, point) => total + point.x, 0) /
                  room.markers.length,

                y:
                  room.markers.reduce((total, point) => total + point.y, 0) /
                  room.markers.length,
              };

              const pinPosition = room.pin ?? defaultPin;

              const isSelected = selectedRoomId === room.id;

              const environmentLabel = getRoomEnvironmentLabel?.(room) ?? null;

              return (
                <div key={`area-pin-${room.id}`}>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();

                      onSelectRoom(room.id);
                    }}
                    onMouseEnter={() => onHoverRoom(room.id)}
                    onMouseLeave={() => onHoverRoom(null)}
                    className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs font-bold shadow-lg transition ${
                      isSelected
                        ? "h-9 w-9 border-white bg-white text-zinc-950"
                        : "h-8 w-8 border-white/60 bg-zinc-950/80 text-white hover:border-white hover:bg-zinc-800"
                    }`}
                    style={{
                      left: `${pinPosition.x}%`,

                      top: `${pinPosition.y}%`,
                    }}
                    title={`${room.id}. ${room.name}${
                      environmentLabel ? ` — ${environmentLabel}` : ""
                    }`}
                  >
                    {room.id}
                  </button>

                  {environmentLabel && (
                    <div
                      className="pointer-events-none absolute z-10 -translate-x-1/2 translate-y-4 whitespace-nowrap rounded-full border border-white/10 bg-zinc-950/90 px-2 py-0.5 text-[10px] font-medium text-white/80 shadow"
                      style={{
                        left: `${pinPosition.x}%`,

                        top: `${pinPosition.y}%`,
                      }}
                    >
                      {environmentLabel}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

export default MapCanvas;
