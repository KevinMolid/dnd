import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import CreateHandoutModal from "../components/CreateHandoutModal";
import type { CampaignDoc, CampaignMemberDoc } from "../types/campaign";
import type { CampaignHandoutDoc } from "../types/handouts";

type HandoutWithId = CampaignHandoutDoc & {
  id: string;
};

type MemberWithUid = CampaignMemberDoc & {
  uid: string;
};

function formatDate(value: Timestamp | null | undefined) {
  if (!value) return "Unknown date";

  try {
    return value.toDate().toLocaleString();
  } catch {
    return "Unknown date";
  }
}

function canPlayerSeeHandout(handout: CampaignHandoutDoc, uid: string) {
  if (handout.visibility === "allPlayers") return true;
  if (handout.visibility === "selectedPlayers") {
    return (handout.visibleToPlayerUids ?? []).includes(uid);
  }
  return false;
}

function getVisibilityLabel(handout: CampaignHandoutDoc) {
  if (handout.visibility === "allPlayers") return "Visible to all";
  if (handout.visibility === "selectedPlayers") {
    const count = handout.visibleToPlayerUids?.length ?? 0;
    return `Visible to ${count} ${count === 1 ? "player" : "players"}`;
  }
  return "Hidden";
}

export default function HandoutsPage() {
  const { user } = useAuth();
  const { campaignId } = useParams<{ campaignId: string }>();

  const [campaign, setCampaign] = useState<
    (CampaignDoc & { id: string }) | null
  >(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);

  const [membership, setMembership] = useState<CampaignMemberDoc | null>(null);
  const [members, setMembers] = useState<MemberWithUid[]>([]);

  const [handouts, setHandouts] = useState<HandoutWithId[]>([]);
  const [loadingHandouts, setLoadingHandouts] = useState(true);

  const [selectedHandoutId, setSelectedHandoutId] = useState<string | null>(
    null,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!user || !campaignId) {
      setCampaign(null);
      setMembership(null);
      setLoadingCampaign(false);
      return;
    }

    const safeCampaignId = campaignId;
    let cancelled = false;

    const loadCampaign = async () => {
      try {
        setLoadingCampaign(true);

        const campaignRef = doc(db, "campaigns", safeCampaignId);
        const memberRef = doc(
          db,
          "campaigns",
          safeCampaignId,
          "members",
          user.uid,
        );

        const [campaignSnap, memberSnap] = await Promise.all([
          getDoc(campaignRef),
          getDoc(memberRef),
        ]);

        if (cancelled) return;

        if (!campaignSnap.exists()) {
          setCampaign(null);
        } else {
          setCampaign({
            id: campaignSnap.id,
            ...(campaignSnap.data() as CampaignDoc),
          });
        }

        if (memberSnap.exists()) {
          setMembership(memberSnap.data() as CampaignMemberDoc);
        } else {
          setMembership(null);
        }
      } catch (error) {
        console.error("Failed to load campaign:", error);
        if (!cancelled) {
          setCampaign(null);
          setMembership(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingCampaign(false);
        }
      }
    };

    loadCampaign();

    return () => {
      cancelled = true;
    };
  }, [campaignId, user]);

  useEffect(() => {
    if (!campaignId || !user) {
      setMembers([]);
      return;
    }

    const safeCampaignId = campaignId;
    const membersRef = collection(db, "campaigns", safeCampaignId, "members");

    const unsub = onSnapshot(
      membersRef,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => ({
          ...(docSnap.data() as CampaignMemberDoc),
          uid: docSnap.id,
        }));
        setMembers(next);
      },
      (error) => {
        console.error("Failed to load campaign members:", error);
        setMembers([]);
      },
    );

    return () => unsub();
  }, [campaignId, user]);

  useEffect(() => {
    if (!user || !campaignId) {
      setHandouts([]);
      setLoadingHandouts(false);
      return;
    }

    const safeCampaignId = campaignId;
    setLoadingHandouts(true);

    const handoutsRef = collection(db, "campaigns", safeCampaignId, "handouts");
    const q = query(handoutsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const next: HandoutWithId[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as CampaignHandoutDoc),
        }));

        setHandouts(next);
        setLoadingHandouts(false);
      },
      (error) => {
        console.error("Failed to load handouts:", error);
        setHandouts([]);
        setLoadingHandouts(false);
      },
    );

    return () => unsub();
  }, [campaignId, user]);

  const isGm = membership?.role === "gm" || membership?.role === "co-gm";

  const playerMembers = useMemo(
    () =>
      members
        .filter((member) => member.role === "player")
        .map((member) => ({
          uid: member.uid,
          displayName:
            member.displayName?.trim() ||
            member.email?.trim() ||
            "Unnamed player",
        })),
    [members],
  );

  const visibleHandouts = useMemo(() => {
    if (!user) return [];
    if (isGm) return handouts;
    return handouts.filter((handout) => canPlayerSeeHandout(handout, user.uid));
  }, [handouts, isGm, user]);

  const selectedHandout = useMemo(
    () => visibleHandouts.find((item) => item.id === selectedHandoutId) ?? null,
    [visibleHandouts, selectedHandoutId],
  );

  useEffect(() => {
    setSelectedHandoutId((current) => {
      if (current && visibleHandouts.some((item) => item.id === current)) {
        return current;
      }
      return visibleHandouts[0]?.id ?? null;
    });
  }, [visibleHandouts]);

  useEffect(() => {
    setLightboxOpen(false);
  }, [selectedHandoutId]);

  if (!campaignId) {
    return (
      <div className="p-6 text-white">
        <p>Missing campaign ID.</p>
      </div>
    );
  }

  async function handleDeleteHandout() {
    if (!selectedHandout || deleting || !campaignId) return;

    const safeCampaignId = campaignId;
    const confirmed = window.confirm(
      `Delete "${selectedHandout.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteDoc(
        doc(db, "campaigns", safeCampaignId, "handouts", selectedHandout.id),
      );
    } catch (error) {
      console.error("Failed to delete handout:", error);
      window.alert("Failed to delete handout.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 text-sm text-zinc-400">
                <Link
                  to={`/campaigns/${campaignId}`}
                  className="hover:text-white"
                >
                  ← Back to campaign
                </Link>
              </div>

              <h1 className="text-3xl font-bold">
                {loadingCampaign
                  ? "Handouts"
                  : `${campaign?.name ?? "Campaign"} Handouts`}
              </h1>

              <p className="mt-1 text-sm text-zinc-400">
                Create and manage shared player handouts.
              </p>
            </div>

            {isGm ? (
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
              >
                Create handout
              </button>
            ) : null}
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="rounded-2xl border border-white/10 bg-zinc-900">
              <div className="border-b border-white/10 px-4 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
                  Handouts
                </h2>
              </div>

              <div className="overflow-y-auto p-2">
                {loadingHandouts ? (
                  <div className="px-3 py-4 text-sm text-zinc-400">
                    Loading handouts...
                  </div>
                ) : visibleHandouts.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-zinc-400">
                    {isGm
                      ? "No handouts yet."
                      : "No handouts have been revealed to you yet."}
                  </div>
                ) : (
                  visibleHandouts.map((handout) => {
                    const selected = handout.id === selectedHandoutId;

                    return (
                      <button
                        key={handout.id}
                        type="button"
                        onClick={() => setSelectedHandoutId(handout.id)}
                        className={`mb-2 w-full rounded-xl border text-left transition ${
                          selected
                            ? "border-gray-300/30 bg-gray-500/20"
                            : "border-transparent hover:border-white/10 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3 px-3 py-1">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                            {handout.imageUrl ? (
                              <img
                                src={handout.imageUrl}
                                alt={handout.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-14 w-14 rounded-lg bg-zinc-700"></div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-white">
                              {handout.title}
                            </div>
                            <div className="mt-1 line-clamp-1 text-xs text-zinc-400">
                              {handout.content}
                            </div>
                            {isGm ? (
                              <div className="mt-1 text-[11px] text-zinc-500">
                                {getVisibilityLabel(handout)}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            <main className="rounded-2xl border border-white/10 bg-zinc-900">
              {!selectedHandout ? (
                <div className="flex min-h-[400px] items-center justify-center p-8 text-center text-zinc-400">
                  <div>
                    <p className="text-lg font-medium text-zinc-200">
                      No handout selected
                    </p>
                    <p className="mt-2 text-sm">
                      {isGm
                        ? "Create a handout to get started."
                        : "No visible handouts yet."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="mb-4 border-b border-white/10 pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {selectedHandout.title}
                        </h2>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400">
                          <span>
                            Created by: {selectedHandout.createdByName}
                          </span>
                          <span>
                            Created: {formatDate(selectedHandout.createdAt)}
                          </span>
                          <span>
                            Updated: {formatDate(selectedHandout.updatedAt)}
                          </span>
                        </div>

                        {isGm ? (
                          <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                            {getVisibilityLabel(selectedHandout)}
                          </div>
                        ) : null}
                      </div>

                      {isGm ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditOpen(true)}
                            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-white/5"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteHandout}
                            disabled={deleting}
                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                          >
                            {deleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mb-4 whitespace-pre-wrap break-words text-sm leading-7 text-zinc-200">
                    {selectedHandout.content}
                  </div>

                  {selectedHandout.imageUrl ? (
                    <div className="mb-6">
                      <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        className="group block overflow-hidden rounded-2xl border border-white/10 bg-zinc-800"
                      >
                        <img
                          src={selectedHandout.imageUrl}
                          alt={selectedHandout.title}
                          className="max-h-[340px] w-full object-contain transition group-hover:scale-[1.01]"
                        />
                        <div className="border-t border-white/10 px-4 py-2 text-left text-xs text-zinc-400">
                          Click image to enlarge
                        </div>
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </main>
          </div>
        </div>

        <CreateHandoutModal
          campaignId={campaignId}
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          players={playerMembers}
        />

        <CreateHandoutModal
          campaignId={campaignId}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          players={playerMembers}
          editingHandout={
            selectedHandout
              ? {
                  id: selectedHandout.id,
                  title: selectedHandout.title,
                  content: selectedHandout.content,
                  imageUrl: selectedHandout.imageUrl ?? null,
                  visibility: selectedHandout.visibility,
                  visibleToPlayerUids:
                    selectedHandout.visibleToPlayerUids ?? [],
                }
              : null
          }
        />
      </div>

      {lightboxOpen && selectedHandout?.imageUrl ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-h-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg bg-black/60 px-3 py-2 text-sm font-medium text-white hover:bg-black/80"
            >
              Close
            </button>

            <img
              src={selectedHandout.imageUrl}
              alt={selectedHandout.title}
              className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
