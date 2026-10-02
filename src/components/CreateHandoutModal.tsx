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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-2 backdrop-blur-[2px] sm:p-4"
      onClick={handleClose}
    >
      <div
        className="
        flex
        max-h-[calc(100dvh-1rem)]
        w-full
        max-w-2xl
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-white/[0.08]
        bg-zinc-950
        shadow-2xl
        sm:max-h-[calc(100dvh-2rem)]
      "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-white">
              {isEditing ? "Edit handout" : "Create handout"}
            </h2>

            <p className="mt-0.5 text-xs text-zinc-500">
              {isEditing
                ? "Update the handout content and player visibility."
                : "Create information that can be shared with your players."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="
            ml-4
            inline-flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-white/[0.08]
            bg-white/[0.03]
            text-zinc-400
            transition
            hover:bg-white/[0.07]
            hover:text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          {/* Scrollable content */}
          <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-5 p-4 sm:p-5">
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The Goblin Ambush"
                  disabled={saving}
                  className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  px-3
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  hover:border-white/[0.12]
                  focus:border-cyan-400/40
                  focus:bg-white/[0.05]
                  focus:ring-1
                  focus:ring-cyan-400/10
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                />
              </div>

              {/* Content */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
                  Content
                </label>

                <textarea
                  value={content}
                  spellCheck={false}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the handout text here..."
                  rows={9}
                  disabled={saving}
                  className="
                  min-h-44
                  w-full
                  resize-y
                  rounded-lg
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  px-3
                  py-2.5
                  text-sm
                  leading-6
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  hover:border-white/[0.12]
                  focus:border-cyan-400/40
                  focus:bg-white/[0.05]
                  focus:ring-1
                  focus:ring-cyan-400/10
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
                  Image URL
                </label>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={saving}
                  className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-white/[0.08]
                  bg-white/[0.035]
                  px-3
                  text-sm
                  text-white
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  hover:border-white/[0.12]
                  focus:border-cyan-400/40
                  focus:bg-white/[0.05]
                  focus:ring-1
                  focus:ring-cyan-400/10
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                />
              </div>

              {/* Player visibility */}
              <section className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]">
                <div className="border-b border-white/[0.06] px-4 py-3">
                  <div className="text-sm font-semibold text-zinc-200">
                    Player visibility
                  </div>

                  <div className="mt-0.5 text-xs text-zinc-500">
                    Choose who can see this handout.
                  </div>
                </div>

                <div className="space-y-1.5 p-2">
                  <label
                    className={`
                    flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 transition
                    ${
                      visibility === "hidden"
                        ? "border-cyan-400/20 bg-cyan-400/[0.06]"
                        : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]"
                    }
                  `}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="hidden"
                      checked={visibility === "hidden"}
                      onChange={() => setVisibility("hidden")}
                      disabled={saving}
                      className="mt-0.5 accent-cyan-500"
                    />

                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">
                        Hidden
                      </div>

                      <div className="mt-0.5 text-xs leading-5 text-zinc-500">
                        Players cannot see this handout yet.
                      </div>
                    </div>
                  </label>

                  <label
                    className={`
                    flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 transition
                    ${
                      visibility === "allPlayers"
                        ? "border-cyan-400/20 bg-cyan-400/[0.06]"
                        : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]"
                    }
                  `}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="allPlayers"
                      checked={visibility === "allPlayers"}
                      onChange={() => setVisibility("allPlayers")}
                      disabled={saving}
                      className="mt-0.5 accent-cyan-500"
                    />

                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">
                        Show to all players
                      </div>

                      <div className="mt-0.5 text-xs leading-5 text-zinc-500">
                        Every player in the campaign can see this handout.
                      </div>
                    </div>
                  </label>

                  <label
                    className={`
                    flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 transition
                    ${
                      visibility === "selectedPlayers"
                        ? "border-cyan-400/20 bg-cyan-400/[0.06]"
                        : "border-transparent hover:border-white/[0.06] hover:bg-white/[0.035]"
                    }
                  `}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="selectedPlayers"
                      checked={visibility === "selectedPlayers"}
                      onChange={() => setVisibility("selectedPlayers")}
                      disabled={saving}
                      className="mt-0.5 accent-cyan-500"
                    />

                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">
                        Show to selected players
                      </div>

                      <div className="mt-0.5 text-xs leading-5 text-zinc-500">
                        Only chosen players can see this handout.
                      </div>
                    </div>
                  </label>
                </div>

                {visibility === "selectedPlayers" ? (
                  <div className="border-t border-white/[0.06] p-3">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      Select players
                    </div>

                    {sortedPlayers.length === 0 ? (
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-3 text-sm text-zinc-500">
                        No player members found.
                      </div>
                    ) : (
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {sortedPlayers.map((player) => {
                          const selected = visibleToPlayerUids.includes(
                            player.uid,
                          );

                          return (
                            <label
                              key={player.uid}
                              className={`
                              flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition
                              ${
                                selected
                                  ? "border-cyan-400/20 bg-cyan-400/[0.06]"
                                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]"
                              }
                            `}
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => togglePlayer(player.uid)}
                                disabled={saving}
                                className="accent-cyan-500"
                              />

                              <span className="truncate text-sm text-zinc-200">
                                {player.displayName}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : null}
              </section>

              {error ? (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/[0.08] px-3 py-2.5 text-sm text-red-300">
                  <i className="fa-solid fa-circle-exclamation mt-0.5 text-xs" />

                  <span>{error}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-white/[0.06] bg-zinc-950 px-4 py-3 sm:px-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="
              inline-flex
              h-9
              items-center
              justify-center
              rounded-lg
              border
              border-white/[0.08]
              bg-white/[0.035]
              px-4
              text-xs
              font-semibold
              text-zinc-300
              transition
              hover:bg-white/[0.07]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
              inline-flex
              h-9
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-cyan-400/20
              bg-cyan-600
              px-4
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-cyan-500
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            >
              {saving ? (
                <i className="fa-solid fa-spinner fa-spin text-[10px]" />
              ) : (
                <i
                  className={`fa-solid ${
                    isEditing ? "fa-floppy-disk" : "fa-plus"
                  } text-[10px]`}
                />
              )}

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
