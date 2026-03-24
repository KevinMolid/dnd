import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import type { HandoutVisibility } from "../types/handouts";

type PlayerOption = {
  uid: string;
  displayName: string;
};

type HandoutDraft = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  visibility?: HandoutVisibility;
  visibleToPlayerUids?: string[];
};

type Props = {
  campaignId: string;
  open: boolean;
  onClose: () => void;
  editingHandout?: HandoutDraft | null;
  players: PlayerOption[];
};

export default function CreateHandoutModal({
  campaignId,
  open,
  onClose,
  editingHandout = null,
  players,
}: Props) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [visibility, setVisibility] = useState<HandoutVisibility>("hidden");
  const [visibleToPlayerUids, setVisibleToPlayerUids] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!editingHandout;

  useEffect(() => {
    if (!open) return;

    setTitle(editingHandout?.title ?? "");
    setContent(editingHandout?.content ?? "");
    setImageUrl(editingHandout?.imageUrl ?? "");
    setVisibility(editingHandout?.visibility ?? "hidden");
    setVisibleToPlayerUids(editingHandout?.visibleToPlayerUids ?? []);
    setError("");
  }, [open, editingHandout]);

  const sortedPlayers = useMemo(
    () =>
      [...players].sort((a, b) => a.displayName.localeCompare(b.displayName)),
    [players],
  );

  if (!open) return null;

  function resetForm() {
    setTitle("");
    setContent("");
    setImageUrl("");
    setVisibility("hidden");
    setVisibleToPlayerUids([]);
    setError("");
  }

  function handleClose() {
    if (!saving) {
      resetForm();
      onClose();
    }
  }

  function togglePlayer(uid: string) {
    setVisibleToPlayerUids((current) =>
      current.includes(uid)
        ? current.filter((entry) => entry !== uid)
        : [...current, uid],
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const trimmedImageUrl = imageUrl.trim();

    if (!trimmedTitle) {
      setError("Please enter a title.");
      return;
    }

    if (!trimmedContent) {
      setError("Please enter some content.");
      return;
    }

    if (visibility === "selectedPlayers" && visibleToPlayerUids.length === 0) {
      setError(
        "Select at least one player, or choose another visibility option.",
      );
      return;
    }

    const payload = {
      title: trimmedTitle,
      content: trimmedContent,
      imageUrl: trimmedImageUrl || null,
      visibility,
      visibleToPlayerUids:
        visibility === "selectedPlayers" ? visibleToPlayerUids : [],
      updatedAt: serverTimestamp(),
    };

    try {
      setSaving(true);
      setError("");

      if (isEditing && editingHandout) {
        await updateDoc(
          doc(db, "campaigns", campaignId, "handouts", editingHandout.id),
          payload,
        );
      } else {
        await addDoc(collection(db, "campaigns", campaignId, "handouts"), {
          ...payload,
          createdAt: serverTimestamp(),
          createdByUid: user.uid,
          createdByName: user.displayName?.trim() || user.email || "Unknown",
        });
      }

      resetForm();
      onClose();
    } catch (err) {
      console.error("Failed to save handout:", err);
      setError(
        isEditing ? "Failed to update handout." : "Failed to create handout.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? "Edit handout" : "Create handout"}
          </h2>
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
              rows={10}
              className="w-full resize-y rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-zinc-400"
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-zinc-400"
              disabled={saving}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-800/60 p-4">
            <label className="mb-3 block text-sm font-medium text-zinc-200">
              Player visibility
            </label>

            <div className="space-y-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 px-3 py-3 hover:bg-white/5">
                <input
                  type="radio"
                  name="visibility"
                  value="hidden"
                  checked={visibility === "hidden"}
                  onChange={() => setVisibility("hidden")}
                  className="mt-1"
                  disabled={saving}
                />
                <div>
                  <div className="text-sm font-medium text-white">Hidden</div>
                  <div className="text-xs text-zinc-400">
                    Players cannot see this handout yet.
                  </div>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 px-3 py-3 hover:bg-white/5">
                <input
                  type="radio"
                  name="visibility"
                  value="allPlayers"
                  checked={visibility === "allPlayers"}
                  onChange={() => setVisibility("allPlayers")}
                  className="mt-1"
                  disabled={saving}
                />
                <div>
                  <div className="text-sm font-medium text-white">
                    Show to all players
                  </div>
                  <div className="text-xs text-zinc-400">
                    Every player in the campaign can see this handout.
                  </div>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 px-3 py-3 hover:bg-white/5">
                <input
                  type="radio"
                  name="visibility"
                  value="selectedPlayers"
                  checked={visibility === "selectedPlayers"}
                  onChange={() => setVisibility("selectedPlayers")}
                  className="mt-1"
                  disabled={saving}
                />
                <div>
                  <div className="text-sm font-medium text-white">
                    Show to selected players
                  </div>
                  <div className="text-xs text-zinc-400">
                    Only chosen players can see this handout.
                  </div>
                </div>
              </label>
            </div>

            {visibility === "selectedPlayers" ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-zinc-900/70 p-3">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Select players
                </div>

                {sortedPlayers.length === 0 ? (
                  <div className="text-sm text-zinc-500">
                    No player members found.
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {sortedPlayers.map((player) => (
                      <label
                        key={player.uid}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 px-3 py-2 hover:bg-white/5"
                      >
                        <input
                          type="checkbox"
                          checked={visibleToPlayerUids.includes(player.uid)}
                          onChange={() => togglePlayer(player.uid)}
                          disabled={saving}
                        />
                        <span className="text-sm text-zinc-200">
                          {player.displayName}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
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
              {saving
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save changes"
                  : "Create handout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
