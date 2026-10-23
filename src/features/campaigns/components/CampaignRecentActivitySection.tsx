import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";

import { db } from "../../../firebase";

import type { CampaignLogEntry } from "../utils/campaignLog";

type Props = {
  campaignId?: string;

  isGm: boolean;
};

type CustomCampaignLogEntry = {
  type: "custom";
  characterName?: string;
  payload: { text: string; icon: string };
};

type StoredCampaignLogEntry = (
  | Omit<CampaignLogEntry, "createdAt">
  | CustomCampaignLogEntry
) & {
  createdAt?: Timestamp | null;
};

type ActivityEntry = StoredCampaignLogEntry & {
  id: string;
};

type ActivityPresentation = {
  icon: string;

  iconClassName: string;

  title: string;

  detail?: string;
};

const MAX_ACTIVITY_ENTRIES = 20;

const CUSTOM_ICONS = [
  {
    icon: "fa-scroll",
    label: "Story",
    style: "border-amber-400/15 bg-amber-500/10 text-amber-300",
  },
  {
    icon: "fa-star",
    label: "Achievement",
    style: "border-violet-400/15 bg-violet-500/10 text-violet-300",
  },
  {
    icon: "fa-flag",
    label: "Milestone",
    style: "border-sky-400/15 bg-sky-500/10 text-sky-300",
  },
  {
    icon: "fa-skull",
    label: "Danger",
    style: "border-red-400/15 bg-red-500/10 text-red-300",
  },
  {
    icon: "fa-gem",
    label: "Treasure",
    style: "border-cyan-400/15 bg-cyan-500/10 text-cyan-300",
  },
  {
    icon: "fa-coins",
    label: "Reward",
    style: "border-yellow-400/15 bg-yellow-500/10 text-yellow-300",
  },
  {
    icon: "fa-shield-halved",
    label: "Defense",
    style: "border-emerald-400/15 bg-emerald-500/10 text-emerald-300",
  },
  {
    icon: "fa-dragon",
    label: "Monster",
    style: "border-orange-400/15 bg-orange-500/10 text-orange-300",
  },
  {
    icon: "fa-location-dot",
    label: "Location",
    style: "border-green-400/15 bg-green-500/10 text-green-300",
  },
  {
    icon: "fa-book-open",
    label: "Discovery",
    style: "border-indigo-400/15 bg-indigo-500/10 text-indigo-300",
  },
  {
    icon: "fa-heart",
    label: "Character",
    style: "border-rose-400/15 bg-rose-500/10 text-rose-300",
  },
  {
    icon: "fa-bolt",
    label: "Event",
    style: "border-fuchsia-400/15 bg-fuchsia-500/10 text-fuchsia-300",
  },
] as const;

type CustomIcon = (typeof CUSTOM_ICONS)[number]["icon"];

const readNumber = (
  payload: Record<string, unknown>,

  key: string,
): number | undefined => {
  const value = payload[key];

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
};

const readString = (
  payload: Record<string, unknown>,

  key: string,
): string | undefined => {
  const value = payload[key];

  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

const formatMoney = (payload: Record<string, unknown>) => {
  const parts: string[] = [];

  const gp = readNumber(payload, "gp");

  const sp = readNumber(payload, "sp");

  const cp = readNumber(payload, "cp");

  if (gp) {
    parts.push(`${gp} gp`);
  }

  if (sp) {
    parts.push(`${sp} sp`);
  }

  if (cp) {
    parts.push(`${cp} cp`);
  }

  if (parts.length > 0) {
    return parts.join(", ");
  }

  const amountCp = readNumber(payload, "amountCp");

  if (amountCp !== undefined) {
    return `${amountCp} cp`;
  }

  return undefined;
};

const getActivityPresentation = (
  entry: ActivityEntry,
): ActivityPresentation => {
  const characterName = entry.characterName?.trim() || "A character";

  const payload: Record<string, unknown> = entry.payload ?? {};

  switch (entry.type) {
    case "custom": {
      const savedIcon = readString(payload, "icon");
      const chosen =
        CUSTOM_ICONS.find((option) => option.icon === savedIcon) ??
        CUSTOM_ICONS[0];
      return {
        icon: chosen.icon,
        iconClassName: chosen.style,
        title: readString(payload, "text") ?? "Campaign event",
      };
    }

    case "xp_awarded": {
      const amount =
        readNumber(payload, "amount") ??
        readNumber(payload, "xp") ??
        readNumber(payload, "amountXp");

      const recipientCount = readNumber(payload, "recipientCount");

      const totalAmount = readNumber(payload, "totalAmount");

      const mixedAmounts = payload.mixedAmounts === true;

      if (recipientCount !== undefined && recipientCount > 1) {
        return {
          icon: "fa-star",

          iconClassName:
            "border-violet-400/15 bg-violet-500/10 text-violet-300",

          title:
            mixedAmounts && totalAmount !== undefined
              ? `${recipientCount} characters received ${totalAmount} XP total`
              : amount !== undefined
                ? `${recipientCount} characters received ${amount} XP each`
                : `${recipientCount} characters received XP`,
        };
      }

      return {
        icon: "fa-star",

        iconClassName: "border-violet-400/15 bg-violet-500/10 text-violet-300",

        title:
          amount !== undefined
            ? `${characterName} received ${amount} XP`
            : `${characterName} received XP`,
      };
    }

    case "level_up": {
      const level =
        readNumber(payload, "level") ?? readNumber(payload, "toLevel");

      return {
        icon: "fa-arrow-up",

        iconClassName: "border-amber-400/15 bg-amber-500/10 text-amber-300",

        title:
          level !== undefined
            ? `${characterName} reached level ${level}`
            : `${characterName} leveled up`,
      };
    }

    case "inspiration_gained":
      return {
        icon: "fa-sparkles",

        iconClassName:
          "border-fuchsia-400/15 bg-fuchsia-500/10 text-fuchsia-300",

        title: `${characterName} gained Inspiration`,
      };

    case "inspiration_used":
      return {
        icon: "fa-sparkles",

        iconClassName: "border-zinc-400/15 bg-zinc-500/10 text-zinc-300",

        title: `${characterName} used Inspiration`,
      };

    case "character_activated":
      return {
        icon: "fa-user-plus",

        iconClassName:
          "border-emerald-400/15 bg-emerald-500/10 text-emerald-300",

        title: `${characterName} joined the active party`,
      };

    case "character_deactivated":
      return {
        icon: "fa-user-minus",

        iconClassName: "border-zinc-400/15 bg-zinc-500/10 text-zinc-400",

        title: `${characterName} left the active party`,
      };

    case "character_claimed": {
      const playerName = readString(payload, "playerName") ?? "A player";

      return {
        icon: "fa-hand",
        iconClassName: "border-sky-400/15 bg-sky-500/10 text-sky-300",
        title: `${playerName} claimed ${characterName}`,
      };
    }

    case "character_released": {
      const playerName = readString(payload, "playerName") ?? "A player";

      return {
        icon: "fa-arrow-right-from-bracket",
        iconClassName: "border-amber-400/15 bg-amber-500/10 text-amber-300",
        title: `${playerName} gave up ${characterName}`,
      };
    }

    case "member_joined": {
      const playerName =
        readString(payload, "playerName") ??
        readString(payload, "memberName") ??
        "A player";

      return {
        icon: "fa-user-plus",
        iconClassName:
          "border-emerald-400/15 bg-emerald-500/10 text-emerald-300",
        title: `${playerName} joined the campaign`,
      };
    }

    case "member_left": {
      const playerName =
        readString(payload, "playerName") ??
        readString(payload, "memberName") ??
        "A player";

      return {
        icon: "fa-user-minus",
        iconClassName: "border-zinc-400/15 bg-zinc-500/10 text-zinc-400",
        title: `${playerName} left the campaign`,
      };
    }

    case "enemy_defeated": {
      const enemyName =
        readString(payload, "enemyName") ??
        readString(payload, "name") ??
        "an enemy";

      return {
        icon: "fa-skull",

        iconClassName: "border-red-400/15 bg-red-500/10 text-red-300",

        title: `The party defeated ${enemyName}`,
      };
    }

    case "character_died":
      return {
        icon: "fa-skull-crossbones",

        iconClassName: "border-red-400/15 bg-red-500/10 text-red-300",

        title: `${characterName} died`,
      };

    case "milestone": {
      const title =
        readString(payload, "title") ?? "The party reached a milestone";

      return {
        icon: "fa-flag",

        iconClassName: "border-amber-400/15 bg-amber-500/10 text-amber-300",

        title,
      };
    }

    case "item_received": {
      const itemName =
        readString(payload, "itemName") ??
        readString(payload, "name") ??
        "an item";

      const quantity = readNumber(payload, "quantity");

      return {
        icon: "fa-gem",

        iconClassName: "border-sky-400/15 bg-sky-500/10 text-sky-300",

        title: `${characterName} received ${itemName}`,

        detail:
          quantity !== undefined && quantity > 1
            ? `Quantity: ${quantity}`
            : undefined,
      };
    }

    case "gold_received": {
      const amount = formatMoney(payload);

      return {
        icon: "fa-coins",

        iconClassName: "border-yellow-400/15 bg-yellow-500/10 text-yellow-300",

        title: amount
          ? `${characterName} received ${amount}`
          : `${characterName} received currency`,
      };
    }

    default: {
      return {
        icon: "fa-clock-rotate-left",
        iconClassName: "border-white/10 bg-white/[0.04] text-zinc-400",
        title: "Unknown activity",
      };
    }
  }
};

const formatActivityTime = (timestamp?: Timestamp | null) => {
  if (!timestamp) {
    return "";
  }

  const date = timestamp.toDate();

  const now = new Date();

  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",

    month: "short",

    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const ActivityRow = ({
  entry,
  canDelete,
  deleting,
  onDelete,
}: {
  entry: ActivityEntry;
  canDelete: boolean;
  deleting: boolean;
  onDelete: (entry: ActivityEntry) => void;
}) => {
  const presentation = getActivityPresentation(entry);

  const time = formatActivityTime(entry.createdAt);

  return (
    <div className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0">
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${presentation.iconClassName}`}
      >
        <i className={`fa-solid ${presentation.icon} text-[10px]`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <p className="min-w-0 text-xs font-semibold leading-5 text-zinc-200">
            {presentation.title}
          </p>

          {time ? (
            <span className="shrink-0 pt-0.5 text-[11px] text-zinc-600">
              {time}
            </span>
          ) : null}
        </div>

        {presentation.detail ? (
          <p className="mt-0.5 text-xs leading-5 text-zinc-500">
            {presentation.detail}
          </p>
        ) : null}
      </div>

      {canDelete ? (
        <button
          type="button"
          aria-label={`Delete activity: ${presentation.title}`}
          title="Delete activity"
          onClick={() => onDelete(entry)}
          disabled={deleting}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-transparent text-zinc-600 transition hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <i
            className={`fa-solid ${deleting ? "fa-spinner fa-spin" : "fa-trash-can"} text-[11px]`}
          />
        </button>
      ) : null}
    </div>
  );
};

const CampaignRecentActivitySection = ({ campaignId, isGm }: Props) => {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);

  const [clearing, setClearing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customIcon, setCustomIcon] = useState<CustomIcon>("fa-scroll");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) {
      setEntries([]);

      setLoading(false);

      return;
    }

    setLoading(true);

    const logQuery = query(
      collection(db, "campaigns", campaignId, "logEntries"),

      orderBy("createdAt", "desc"),

      limit(MAX_ACTIVITY_ENTRIES),
    );

    const unsubscribe = onSnapshot(
      logQuery,

      (snapshot) => {
        const nextEntries = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,

          ...(docSnap.data() as StoredCampaignLogEntry),
        }));

        setEntries(nextEntries);

        setLoading(false);
      },

      (error) => {
        console.error("Failed to load campaign activity:", error);

        setEntries([]);

        setLoading(false);
      },
    );

    return unsubscribe;
  }, [campaignId]);

  const visibleEntries = useMemo(
    () => entries.slice(0, MAX_ACTIVITY_ENTRIES),

    [entries],
  );

  const handleAddActivity = async () => {
    const message = customText.trim();
    if (!isGm || !campaignId || adding || !message) return;
    try {
      setAdding(true);
      setActionError(null);
      await addDoc(collection(db, "campaigns", campaignId, "logEntries"), {
        type: "custom",
        characterName: "",
        payload: { text: message, icon: customIcon },
        createdAt: serverTimestamp(),
      });
      setAddOpen(false);
      setCustomText("");
      setCustomIcon("fa-scroll");
    } catch (error) {
      console.error("Failed to add campaign activity:", error);
      setActionError(
        "Could not add activity. Check your permissions and try again.",
      );
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteActivity = async (entry: ActivityEntry) => {
    if (!isGm || !campaignId || clearing || deletingId) return;

    const title = getActivityPresentation(entry).title;
    if (
      !window.confirm(
        `Delete this activity?\n\n${title}\n\nThis cannot be undone.`,
      )
    )
      return;

    try {
      setActionError(null);
      setDeletingId(entry.id);
      await deleteDoc(doc(db, "campaigns", campaignId, "logEntries", entry.id));
    } catch (error) {
      console.error("Failed to delete campaign activity:", error);
      setActionError(
        "Could not delete this activity. Check your permissions and try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearActivity = async () => {
    if (!isGm || !campaignId || clearing || deletingId) return;

    const confirmed = window.confirm(
      "Clear the entire activity log? This cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setActionError(null);
      setClearing(true);

      const snapshot = await getDocs(
        collection(db, "campaigns", campaignId, "logEntries"),
      );

      // Firestore write batches allow at most 500 writes per commit.
      for (let i = 0; i < snapshot.docs.length; i += 450) {
        const batch = writeBatch(db);
        snapshot.docs.slice(i, i + 450).forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      }
    } catch (error) {
      console.error("Failed to clear campaign activity:", error);
      setActionError(
        "Could not clear the activity log. Check your permissions and try again.",
      );
    } finally {
      setClearing(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-clock-rotate-left text-xs text-zinc-500" />

          <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
        </div>

        {isGm ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActionError(null);
                setAddOpen(true);
              }}
              className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              <i className="fa-solid fa-plus mr-1" /> Add
            </button>
            {entries.length > 0 ? (
              <button
                type="button"
                onClick={handleClearActivity}
                disabled={clearing || deletingId !== null}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-zinc-400 transition hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {clearing ? "Clearing…" : "Clear"}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {actionError ? (
        <p
          role="alert"
          className="border-b border-red-500/10 px-4 py-2 text-xs text-red-300"
        >
          {actionError}
        </p>
      ) : null}

      <div className="px-4 py-2.5">
        {loading ? (
          <div className="flex min-h-24 items-center justify-center">
            <span className="text-sm text-zinc-500">Loading activity...</span>
          </div>
        ) : visibleEntries.length === 0 ? (
          <div className="flex min-h-24 flex-col items-center justify-center text-center">
            <i className="fa-solid fa-clock-rotate-left mb-2 text-lg text-zinc-700" />

            <p className="text-sm text-zinc-500">No campaign activity yet.</p>
          </div>
        ) : (
          <div className="workspace-scrollbar max-h-[410px] overflow-y-auto pr-3">
            <div className="divide-y divide-white/[0.06]">
              {visibleEntries.map((entry) => (
                <ActivityRow
                  key={entry.id}
                  entry={entry}
                  canDelete={isGm}
                  deleting={clearing || deletingId === entry.id}
                  onDelete={handleDeleteActivity}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {isGm &&
        addOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !adding)
                setAddOpen(false);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="custom-activity-title"
              className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-5 text-zinc-100 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-2">
                <h3
                  id="custom-activity-title"
                  className="text-base font-semibold"
                >
                  Add custom activity
                </h3>
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  disabled={adding}
                  aria-label="Close"
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-zinc-300">
                  Choose an icon
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {CUSTOM_ICONS.map((option) => (
                    <button
                      key={option.icon}
                      type="button"
                      title={option.label}
                      aria-label={option.label}
                      aria-pressed={customIcon === option.icon}
                      onClick={() => setCustomIcon(option.icon)}
                      className={`flex h-10 items-center justify-center rounded-lg border transition ${option.style} ${customIcon === option.icon ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-950" : "hover:brightness-125"}`}
                    >
                      <i className={`fa-solid ${option.icon}`} />
                    </button>
                  ))}
                </div>
              </div>
              <label
                className="block text-xs font-semibold text-zinc-300"
                htmlFor="custom-activity-text"
              >
                Event text
              </label>
              <textarea
                id="custom-activity-text"
                autoFocus
                rows={3}
                maxLength={500}
                value={customText}
                onChange={(event) => setCustomText(event.target.value)}
                placeholder="The party discovered an ancient shrine…"
                className="w-full resize-y rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500/50"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  disabled={adding}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddActivity}
                  disabled={adding || !customText.trim()}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {adding ? "Saving…" : "Add activity"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
};

export default CampaignRecentActivitySection;
