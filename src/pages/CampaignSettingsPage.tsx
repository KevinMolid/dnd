import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import type {
  CampaignDoc,
  CampaignMemberDoc,
  CampaignSystem,
} from "../types/campaign";

type PageState = "loading" | "ready" | "not-found" | "forbidden" | "error";

type CampaignSystemOption = {
  value: CampaignSystem;
  label: string;
  description: string;
};

const SYSTEM_OPTIONS: CampaignSystemOption[] = [
  {
    value: "dnd2024",
    label: "D&D 2024",
    description: "Newest Dungeons & Dragons ruleset",
  },
  {
    value: "dnd5e",
    label: "D&D 5e",
    description: "Classic 5e / 2014-compatible campaigns",
  },
  {
    value: "pathfinder2e",
    label: "Pathfinder 2e",
    description: "Paizo’s tactical fantasy RPG",
  },
  {
    value: "custom",
    label: "Custom system",
    description: "For homebrew or unsupported systems",
  },
];

const CampaignSettingsPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { user } = useAuth();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [campaign, setCampaign] = useState<
    (CampaignDoc & { id: string }) | null
  >(null);
  const [myMembership, setMyMembership] = useState<CampaignMemberDoc | null>(
    null,
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [system, setSystem] = useState<CampaignSystem>("dnd2024");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [archived, setArchived] = useState(false);

  const [saving, setSaving] = useState(false);
  const [archiveBusy, setArchiveBusy] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadPage = async () => {
      if (!user || !campaignId) {
        setPageState("forbidden");
        return;
      }

      setPageState("loading");

      try {
        const campaignRef = doc(db, "campaigns", campaignId);
        const memberRef = doc(db, "campaigns", campaignId, "members", user.uid);

        const [campaignSnap, memberSnap] = await Promise.all([
          getDoc(campaignRef),
          getDoc(memberRef),
        ]);

        if (!campaignSnap.exists()) {
          setCampaign(null);
          setMyMembership(null);
          setPageState("not-found");
          return;
        }

        if (!memberSnap.exists()) {
          setCampaign(null);
          setMyMembership(null);
          setPageState("forbidden");
          return;
        }

        const memberData = memberSnap.data() as CampaignMemberDoc;
        const campaignData = campaignSnap.data() as CampaignDoc;

        if (memberData.role !== "gm" && memberData.role !== "co-gm") {
          setCampaign(null);
          setMyMembership(memberData);
          setPageState("forbidden");
          return;
        }

        setCampaign({
          id: campaignSnap.id,
          ...campaignData,
        });

        setMyMembership(memberData);
        setName(campaignData.name ?? "");
        setDescription(campaignData.description ?? "");
        setSystem((campaignData.system ?? "dnd2024") as CampaignSystem);
        setVisibility(
          campaignData.visibility === "public" ? "public" : "private",
        );
        setArchived(Boolean(campaignData.archived));

        setPageState("ready");
      } catch (err) {
        console.error("Failed to load campaign settings:", err);
        setCampaign(null);
        setMyMembership(null);
        setPageState("error");
      }
    };

    loadPage();
  }, [campaignId, user]);

  const systemLabel = useMemo(() => {
    return (
      SYSTEM_OPTIONS.find((option) => option.value === system)?.label ?? system
    );
  }, [system]);

  const canSave = name.trim().length >= 3 && !saving;

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (!campaignId || !campaign) return;

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (trimmedName.length < 3) {
      setError("Campaign name must be at least 3 characters long.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await updateDoc(doc(db, "campaigns", campaignId), {
        name: trimmedName,
        description: trimmedDescription,
        system,
        systemLabel,
        visibility,
        archived,
        updatedAt: serverTimestamp(),
      });

      setCampaign((prev) =>
        prev
          ? {
              ...prev,
              name: trimmedName,
              description: trimmedDescription,
              system,
              systemLabel,
              visibility,
              archived,
            }
          : prev,
      );

      setSuccessMessage("Campaign settings saved.");
    } catch (err) {
      console.error("Failed to save campaign settings:", err);
      setError("Could not save campaign settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleArchiveToggle = async () => {
    if (!campaignId || !campaign) return;

    const nextArchived = !archived;
    const confirmed = window.confirm(
      nextArchived
        ? "Archive this campaign? You can unarchive it later."
        : "Unarchive this campaign?",
    );

    if (!confirmed) return;

    setArchiveBusy(true);
    setError("");
    setSuccessMessage("");

    try {
      await updateDoc(doc(db, "campaigns", campaignId), {
        archived: nextArchived,
        updatedAt: serverTimestamp(),
      });

      setArchived(nextArchived);
      setCampaign((prev) =>
        prev
          ? {
              ...prev,
              archived: nextArchived,
            }
          : prev,
      );

      setSuccessMessage(
        nextArchived ? "Campaign archived." : "Campaign unarchived.",
      );
    } catch (err) {
      console.error("Failed to update archive state:", err);
      setError("Could not update archive state.");
    } finally {
      setArchiveBusy(false);
    }
  };

  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-sm text-zinc-400">
              Loading campaign settings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "not-found") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Campaign not found
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              The campaign you tried to open does not exist.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "forbidden") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">Access denied</h1>
            <p className="mt-3 text-sm text-zinc-400">
              Only GMs or co-GMs can edit campaign settings.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageState === "error" || !campaign || !myMembership) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm text-red-200/80">
              We could not load the campaign settings right now.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6">
          <Link
            to={`/campaigns/${campaign.id}`}
            className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to campaign
          </Link>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Campaign settings
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Update the title, description, ruleset, visibility, and status for{" "}
            <span className="font-medium text-white">{campaign.name}</span>.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <form
            onSubmit={handleSave}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                General
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Core campaign details visible throughout the app.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="campaign-name"
                  className="mb-2 block text-sm font-medium text-zinc-200"
                >
                  Campaign title
                </label>

                <input
                  id="campaign-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Lost Mine of Phandelver"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
                />

                <p className="mt-2 text-xs text-zinc-500">
                  Minimum 3 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="campaign-description"
                  className="mb-2 block text-sm font-medium text-zinc-200"
                >
                  Description
                </label>

                <textarea
                  id="campaign-description"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  placeholder="Write a short summary of the campaign, tone, world, or current situation."
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
                />

                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-xs text-zinc-500">Optional.</p>
                  <p className="text-xs text-zinc-500">
                    {description.length}/1000
                  </p>
                </div>
              </div>

              <div>
                <span className="mb-2 block text-sm font-medium text-zinc-200">
                  Ruleset / system
                </span>

                <div className="grid gap-3 sm:grid-cols-2">
                  {SYSTEM_OPTIONS.map((option) => {
                    const isSelected = system === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`cursor-pointer rounded-2xl border p-4 transition ${
                          isSelected
                            ? "border-white/25 bg-white/10"
                            : "border-white/10 bg-zinc-900/70 hover:border-white/20 hover:bg-zinc-900"
                        }`}
                      >
                        <input
                          type="radio"
                          name="system"
                          value={option.value}
                          checked={isSelected}
                          onChange={() => setSystem(option.value)}
                          className="sr-only"
                        />

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {option.label}
                            </p>
                            <p className="mt-1 text-sm text-zinc-400">
                              {option.description}
                            </p>
                          </div>

                          <div
                            className={`mt-1 h-4 w-4 rounded-full border ${
                              isSelected
                                ? "border-white bg-white"
                                : "border-white/30 bg-transparent"
                            }`}
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-sm font-medium text-zinc-200">
                  Visibility
                </span>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      visibility === "private"
                        ? "border-white/25 bg-white/10"
                        : "border-white/10 bg-zinc-900/70 hover:border-white/20 hover:bg-zinc-900"
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={visibility === "private"}
                      onChange={() => setVisibility("private")}
                      className="sr-only"
                    />

                    <p className="text-sm font-semibold text-white">Private</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Hidden campaign. Players need an invite to join.
                    </p>
                  </label>

                  <label
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      visibility === "public"
                        ? "border-white/25 bg-white/10"
                        : "border-white/10 bg-zinc-900/70 hover:border-white/20 hover:bg-zinc-900"
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={visibility === "public"}
                      onChange={() => setVisibility("public")}
                      className="sr-only"
                    />

                    <p className="text-sm font-semibold text-white">Public</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Discoverable later when public browsing is added.
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {(error || successMessage) && (
              <div className="mt-6 space-y-3">
                {error && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    {successMessage}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-500">
                Last saved changes update the campaign for all members.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/campaigns/${campaign.id}`}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={!canSave}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save settings"}
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
              <h2 className="text-xl font-semibold text-white">
                Current status
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Quick overview of this campaign configuration.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Title</p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {name.trim() || "Untitled campaign"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">System</p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {systemLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Visibility</p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {visibility === "public" ? "Public" : "Private"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Archived</p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {archived ? "Yes" : "No"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm text-zinc-400">Your role</p>
                  <p className="mt-1 text-base font-semibold capitalize text-white">
                    {myMembership.role === "co-gm"
                      ? "Co-GM"
                      : myMembership.role}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-5 shadow-xl sm:p-6">
              <h2 className="text-xl font-semibold text-white">
                Archive campaign
              </h2>
              <p className="mt-1 text-sm text-yellow-100/80">
                Archived campaigns stay in the system but can be treated as
                inactive in the UI later.
              </p>

              <div className="mt-5 rounded-2xl border border-yellow-500/20 bg-zinc-900/50 p-4">
                <p className="text-sm text-zinc-300">
                  Current state:{" "}
                  <span className="font-semibold text-white">
                    {archived ? "Archived" : "Active"}
                  </span>
                </p>
              </div>

              <button
                onClick={handleArchiveToggle}
                disabled={archiveBusy}
                className="mt-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-5 py-3 text-sm font-semibold text-yellow-100 transition hover:bg-yellow-500/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {archiveBusy
                  ? "Updating..."
                  : archived
                    ? "Unarchive campaign"
                    : "Archive campaign"}
              </button>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
              <h2 className="text-xl font-semibold text-white">Coming next</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Useful settings you can add after this first version.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm font-medium text-white">
                    Character assignment rules
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Let GMs decide whether players can attach characters freely.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm font-medium text-white">
                    Invite defaults
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Default expiry time and usage limits for invite links.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
                  <p className="text-sm font-medium text-white">Danger zone</p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Permanent delete or transfer ownership later.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CampaignSettingsPage;
