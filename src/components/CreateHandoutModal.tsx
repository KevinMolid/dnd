import { FormEvent, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

type Props = {
  campaignId: string;
  open: boolean;
  onClose: () => void;
};

export default function CreateHandoutModal({
  campaignId,
  open,
  onClose,
}: Props) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

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

      await addDoc(collection(db, "campaigns", campaignId, "handouts"), {
        title: trimmedTitle,
        content: trimmedContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdByUid: user.uid,
        createdByName: user.displayName?.trim() || user.email || "Unknown",
      });

      setTitle("");
      setContent("");
      onClose();
    } catch (err) {
      console.error("Failed to create handout:", err);
      setError("Failed to create handout.");
    } finally {
      setSaving(false);
    }
  }

  function handleBackdropClick() {
    if (!saving) onClose();
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
            onClick={onClose}
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

          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
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
