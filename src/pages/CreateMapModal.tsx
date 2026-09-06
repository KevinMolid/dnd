import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreate: (values: { title: string; imageUrl: string }) => Promise<void>;
  defaultImageUrl?: string;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-white/20";

const CreateMapModal = ({ onClose, onCreate, defaultImageUrl = "" }: Props) => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState(defaultImageUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedImageUrl = imageUrl.trim();

    if (!trimmedTitle) {
      setError("Please enter a map title.");
      return;
    }

    if (!trimmedImageUrl) {
      setError("Please enter an image URL.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await onCreate({
        title: trimmedTitle,
        imageUrl: trimmedImageUrl,
      });

      onClose();
    } catch (err) {
      console.error("Failed to create map:", err);
      setError("Failed to create map.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-black/80 p-4 md:p-6">
      <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl md:max-h-[calc(100dvh-3rem)]">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-6">
          <div>
            <h2 className="text-xl font-bold">Create map</h2>
            <p className="mt-1 text-sm text-white/55">
              Add a new map to this campaign.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            Close
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="shrink-0 border-b border-red-500/15 bg-red-500/10 px-5 py-3 text-sm text-red-300 md:px-6">
            {error}
          </div>
        )}

        {/* Scrollable content */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5 md:px-6"
        >
          {/* Map title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/85">
              Map title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              disabled={isSaving}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/85">
              Image URL
            </label>

            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={inputClass}
              disabled={isSaving}
            />
          </div>

          {/* Map preview */}
          {imageUrl.trim() && (
            <div>
              <div className="mb-2 block text-sm font-medium text-white/85">
                Preview
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                <img
                  src={imageUrl}
                  alt={title || "Map preview"}
                  className="block h-auto w-full"
                  draggable={false}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {isSaving ? "Creating..." : "Create map"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMapModal;
