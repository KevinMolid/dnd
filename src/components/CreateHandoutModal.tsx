import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuth } from "../context/AuthContext";

type Props = {
  campaignId: string;
  open: boolean;
  onClose: () => void;
};

const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];

export default function CreateHandoutModal({
  campaignId,
  open,
  onClose,
}: Props) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const imagePreviewUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  if (!open) return null;

  function resetForm() {
    setTitle("");
    setContent("");
    setImageFile(null);
    setError("");
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Please upload a PNG, JPG, WEBP, or GIF image.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_IMAGE_SIZE_MB} MB.`);
      e.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError("Please enter a title.");
      return;
    }

    if (!trimmedContent) {
      setError("Please enter some content.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      let imageUrl: string | null = null;
      let imagePath: string | null = null;

      if (imageFile) {
        const safeFileName = imageFile.name.replace(/[^\w.-]/g, "_");
        const uniqueFileName = `${Date.now()}-${safeFileName}`;

        imagePath = `campaigns/${campaignId}/handouts/${uniqueFileName}`;
        const storageRef = ref(storage, imagePath);

        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "campaigns", campaignId, "handouts"), {
        title: trimmedTitle,
        content: trimmedContent,
        imageUrl,
        imagePath,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdByUid: user.uid,
        createdByName: user.displayName?.trim() || user.email || "Unknown",
      });

      resetForm();
      onClose();
    } catch (err) {
      console.error("Failed to create handout:", err);
      setError("Failed to create handout.");
    } finally {
      setSaving(false);
    }
  }

  function handleBackdropClick() {
    if (!saving) {
      resetForm();
      onClose();
    }
  }

  function handleClose() {
    if (!saving) {
      resetForm();
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Create handout</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-md px-3 py-1 text-sm text-zinc-300 hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Goblin Ambush"
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-zinc-400"
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the handout text here..."
              rows={12}
              className="w-full resize-y rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-zinc-400"
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Image
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={saving}
              className="block w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-zinc-200 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-zinc-200"
            />

            <p className="mt-2 text-xs text-zinc-500">
              Optional. PNG, JPG, WEBP, or GIF. Max {MAX_IMAGE_SIZE_MB} MB.
            </p>

            {imagePreviewUrl ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-zinc-800">
                <img
                  src={imagePreviewUrl}
                  alt="Selected preview"
                  className="max-h-72 w-full object-contain"
                />
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create handout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
