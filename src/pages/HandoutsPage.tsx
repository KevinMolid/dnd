import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
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
import type { CampaignDoc } from "../types/campaign";
import type { CampaignHandoutDoc } from "../types/handouts";

type HandoutWithId = CampaignHandoutDoc & {
  id: string;
};

function formatDate(value: Timestamp | null | undefined) {
  if (!value) return "Unknown date";

  try {
    return value.toDate().toLocaleString();
  } catch {
    return "Unknown date";
  }
}

export default function HandoutsPage() {
  const { user } = useAuth();
  const params = useParams<{ campaignId: string }>();
  const campaignId = params.campaignId;

  const [campaign, setCampaign] = useState<
    (CampaignDoc & { id: string }) | null
  >(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);

  const [handouts, setHandouts] = useState<HandoutWithId[]>([]);
  const [loadingHandouts, setLoadingHandouts] = useState(true);

  const [selectedHandoutId, setSelectedHandoutId] = useState<string | null>(
    null,
  );
  const [createOpen, setCreateOpen] = useState(false);

  if (!campaignId) {
    return (
      <div className="p-6 text-white">
        <p>Missing campaign ID.</p>
      </div>
    );
  }

  useEffect(() => {
    if (!user) {
      setCampaign(null);
      setLoadingCampaign(false);
      return;
    }

    let cancelled = false;

    const loadCampaign = async () => {
      try {
        setLoadingCampaign(true);

        const campaignRef = doc(db, "campaigns", campaignId);
        const campaignSnap = await getDoc(campaignRef);

        if (cancelled) return;

        if (!campaignSnap.exists()) {
          setCampaign(null);
        } else {
          setCampaign({
            id: campaignSnap.id,
            ...(campaignSnap.data() as CampaignDoc),
          });
        }
      } catch (error) {
        console.error("Failed to load campaign:", error);
        if (!cancelled) {
          setCampaign(null);
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
    if (!user) {
      setHandouts([]);
      setLoadingHandouts(false);
      return;
    }

    setLoadingHandouts(true);

    const handoutsRef = collection(db, "campaigns", campaignId, "handouts");
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

        setSelectedHandoutId((current) => {
          if (current && next.some((item) => item.id === current)) {
            return current;
          }

          return next[0]?.id ?? null;
        });
      },
      (error) => {
        console.error("Failed to load handouts:", error);
        setHandouts([]);
        setLoadingHandouts(false);
      },
    );

    return () => unsub();
  }, [campaignId, user]);

  const selectedHandout = useMemo(
    () => handouts.find((item) => item.id === selectedHandoutId) ?? null,
    [handouts, selectedHandoutId],
  );

  return (
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

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            Create handout
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-white/10 bg-zinc-900">
            <div className="border-b border-white/10 px-4 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
                Handouts
              </h2>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-2">
              {loadingHandouts ? (
                <div className="px-3 py-4 text-sm text-zinc-400">
                  Loading handouts...
                </div>
              ) : handouts.length === 0 ? (
                <div className="px-3 py-4 text-sm text-zinc-400">
                  No handouts yet.
                </div>
              ) : (
                handouts.map((handout) => {
                  const selected = handout.id === selectedHandoutId;

                  return (
                    <button
                      key={handout.id}
                      type="button"
                      onClick={() => setSelectedHandoutId(handout.id)}
                      className={`mb-2 w-full rounded-xl border px-3 py-3 text-left transition ${
                        selected
                          ? "border-white/20 bg-white/10"
                          : "border-transparent hover:border-white/10 hover:bg-white/5"
                      }`}
                    >
                      <div className="truncate text-sm font-semibold text-white">
                        {handout.title}
                      </div>
                      <div className="mt-1 text-xs text-zinc-400">
                        {formatDate(handout.createdAt)}
                      </div>
                      <div className="mt-1 line-clamp-2 text-xs text-zinc-500">
                        {handout.content}
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
                    Create a handout to get started.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-4 border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-bold">
                    {selectedHandout.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400">
                    <span>Created by: {selectedHandout.createdByName}</span>
                    <span>
                      Created: {formatDate(selectedHandout.createdAt)}
                    </span>
                    <span>
                      Updated: {formatDate(selectedHandout.updatedAt)}
                    </span>
                  </div>
                </div>

                <div className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-200">
                  {selectedHandout.content}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <CreateHandoutModal
        campaignId={campaignId}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
