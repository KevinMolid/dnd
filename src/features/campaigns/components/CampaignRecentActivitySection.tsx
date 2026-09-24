import { useEffect, useMemo, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  type Timestamp,
} from "firebase/firestore";

import { db } from "../../../firebase";
import type { CampaignLogEntry } from "../utils/campaignLog";

type Props = {
  campaignId?: string;
};

type StoredCampaignLogEntry = Omit<CampaignLogEntry, "createdAt"> & {
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
  const payload = entry.payload ?? {};

  switch (entry.type) {
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
      const exhaustiveType: never = entry.type;

      return {
        icon: "fa-clock-rotate-left",
        iconClassName: "border-white/10 bg-white/[0.04] text-zinc-400",
        title: exhaustiveType,
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

const ActivityRow = ({ entry }: { entry: ActivityEntry }) => {
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
    </div>
  );
};

const CampaignRecentActivitySection = ({ campaignId }: Props) => {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);

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

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <i className="fa-solid fa-clock-rotate-left text-xs text-zinc-500" />

        <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
      </div>

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
          <div className="divide-y divide-white/[0.06]">
            {visibleEntries.map((entry) => (
              <ActivityRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CampaignRecentActivitySection;
