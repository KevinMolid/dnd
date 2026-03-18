import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreate: (values: {
    title: string;
    imageUrl: string;
    order?: number;
  }) => Promise<void>;
  defaultImageUrl?: string;
  defaultOrder?: number;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-white/20";

const CreateMapModal = ({
  onClose,
  onCreate,
  defaultImageUrl = "",
  defaultOrder = 0,
}: Props) => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState(defaultImageUrl);
  const [order, setOrder] = useState(String(defaultOrder));
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
        order: Number(order) || 0,
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
    <div className="fixed inset-0 z-[80] bg-black/80 p-4 md:p-6">
      <div className="mx-auto flex h-full max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-6">
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

          {error && (
            <div className="border-b border-red-500/15 bg-red-500/10 px-5 py-3 text-sm text-red-300 md:px-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5 md:px-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/85">
                Map title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Cragmaw Hideout"
                className={inputClass}
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/85">
                Image URL
              </label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className={inputClass}
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/85">
                Order
              </label>
              <input
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                inputMode="numeric"
                placeholder="0"
                className={inputClass}
                disabled={isSaving}
              />
            </div>

            {imageUrl.trim() && (
              <div>
                <div className="mb-2 block text-sm font-medium text-white/85">
                  Preview
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <img
                    src={imageUrl}
                    alt={title || "Map preview"}
                    className="block max-h-[320px] w-full object-cover"
                    draggable={false}
                  />
                </div>
              </div>
            )}

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
    </div>
  );
};

export default CreateMapModal;
