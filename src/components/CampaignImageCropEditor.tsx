import { useRef, type PointerEvent } from "react";

type CampaignImageCropEditorProps = {
  imageUrl: string;
  positionX: number;
  positionY: number;
  zoom: number;
  onImageUrlChange: (value: string) => void;
  onPositionChange: (x: number, y: number) => void;
  onZoomChange: (zoom: number) => void;
  label?: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const CampaignImageCropEditor = ({
  imageUrl,
  positionX,
  positionY,
  zoom,
  onImageUrlChange,
  onPositionChange,
  onZoomChange,
  label = "Campaign image",
}: CampaignImageCropEditorProps) => {
  const previewRef = useRef<HTMLDivElement | null>(null);

  const dragState = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startPositionX: number;
    startPositionY: number;
  } | null>(null);

  const trimmedImageUrl = imageUrl.trim();

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!trimmedImageUrl) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    dragState.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPositionX: positionX,
      startPositionY: positionY,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    const preview = previewRef.current;

    if (!drag || !preview || drag.pointerId !== event.pointerId) return;

    const rect = preview.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const deltaX = event.clientX - drag.startClientX;
    const deltaY = event.clientY - drag.startClientY;

    /*
     * positionX / positionY are the focal point in the original image.
     * Dragging the picture to the left therefore moves the focal point
     * further right, and vice versa.
     */
    const nextX = clamp(
      drag.startPositionX - (deltaX / rect.width) * (100 / zoom),
      0,
      100,
    );

    const nextY = clamp(
      drag.startPositionY - (deltaY / rect.height) * (100 / zoom),
      0,
      100,
    );

    onPositionChange(nextX, nextY);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId === event.pointerId) {
      dragState.current = null;
    }
  };

  const resetCrop = () => {
    onPositionChange(50, 50);
    onZoomChange(1);
  };

  const removeImage = () => {
    onImageUrlChange("");
    onPositionChange(50, 50);
    onZoomChange(1);
  };

  return (
    <div>
      <label
        htmlFor="campaign-image"
        className="mb-2 block text-sm font-medium text-zinc-200"
      >
        {label}
      </label>

      <input
        id="campaign-image"
        type="url"
        value={imageUrl}
        onChange={(event) => onImageUrlChange(event.target.value)}
        placeholder="https://example.com/campaign-image.jpg"
        className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20 focus:bg-zinc-900"
      />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-zinc-500">
          Paste an image URL, then drag the preview to position it.
        </p>

        {trimmedImageUrl && (
          <button
            type="button"
            onClick={removeImage}
            className="text-xs font-medium text-zinc-400 transition hover:text-white"
          >
            Remove image
          </button>
        )}
      </div>

      {trimmedImageUrl && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-3">
          <div
            ref={previewRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="relative aspect-[16/6] w-full cursor-grab touch-none select-none overflow-hidden rounded-xl border border-white/10 bg-zinc-950 active:cursor-grabbing"
          >
            <img
              src={trimmedImageUrl}
              alt="Campaign crop preview"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: `${positionX}% ${positionY}%`,
                transform: `scale(${zoom})`,
                transformOrigin: `${positionX}% ${positionY}%`,
              }}
            />

            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

            <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 text-xs text-zinc-200 backdrop-blur-sm">
              Drag to reposition
            </div>

            <div
              className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black/35 shadow-lg"
              style={{
                left: `${positionX}%`,
                top: `${positionY}%`,
              }}
            />
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="campaign-image-zoom"
                  className="text-xs font-medium text-zinc-300"
                >
                  Zoom
                </label>

                <span className="text-xs text-zinc-500">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <input
                id="campaign-image-zoom"
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(event) =>
                  onZoomChange(Number.parseFloat(event.target.value))
                }
                className="w-full accent-white"
              />
            </div>

            <button
              type="button"
              onClick={resetCrop}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              Reset crop
            </button>
          </div>

          <p className="mt-3 text-xs leading-5 text-zinc-500">
            The marked point is the image focus. Lorebound will keep that part
            of the image visible when the same picture is shown at different
            aspect ratios.
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignImageCropEditor;
