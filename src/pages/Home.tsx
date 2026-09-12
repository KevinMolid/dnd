import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  collectionGroup,
  deleteDoc,
  getDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

import { classesById, speciesById } from "../rulesets/dnd/dnd2024/helpers";

import type {
  CampaignDoc,
  CampaignMemberDoc,
  CampaignRole,
} from "../types/campaign";

import Avatar from "../components/Avatar";

type Campaign = {
  id: string;
  name: string;
  role: CampaignRole;
  system?: string;
  imageUrl?: string;
  imagePositionX?: number;
  imagePositionY?: number;
  imageZoom?: number;
  lastPlayed?: string;
};

type Character = {
  id: string;
  name: string;
  race?: string;
  className?: string;
  level?: number;
  campaignName?: string;
  imageUrl?: string;
};

type CharacterDoc = {
  ownerUid?: string | null;
  campaignId?: string | null;

  buildMode?: string;

  name?: string;
  level?: number;

  classId?: string;
  speciesId?: string;
  backgroundId?: string;
  originFeatId?: string | null;

  className?: string;
  speciesName?: string;
  backgroundName?: string;

  imageUrl?: string;

  abilityScores?: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };

  alignment?: string;
  notes?: string;
};

const formatRoleLabel = (role: CampaignRole) => {
  if (role === "gm") {
    return "GM";
  }

  if (role === "co-gm") {
    return "Co-GM";
  }

  return "Player";
};

const getRoleBadgeClass = (role: CampaignRole) => {
  if (role === "gm") {
    return "border border-emerald-400/20 bg-emerald-500/15 text-emerald-300";
  }

  if (role === "co-gm") {
    return "border border-amber-400/20 bg-amber-500/15 text-amber-300";
  }

  return "border border-blue-400/20 bg-blue-500/15 text-blue-300";
};

const getCharacterSummary = (character: Character) =>
  [
    character.level ? `Level ${character.level}` : null,
    character.race,
    character.className,
  ]
    .filter(Boolean)
    .join(" ");

const Home = () => {
  const { user } = useAuth();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [charactersLoading, setCharactersLoading] = useState(true);

  const [deletingCharacterId, setDeletingCharacterId] = useState<string | null>(
    null,
  );

  const [deleteBlockedCharacter, setDeleteBlockedCharacter] =
    useState<Character | null>(null);

  /*
   * Campaigns
   */
  useEffect(() => {
    if (!user) {
      setCampaigns([]);
      setCampaignsLoading(false);

      return;
    }

    setCampaignsLoading(true);

    const q = query(
      collectionGroup(db, "members"),
      where("uid", "==", user.uid),
    );

    const unsub = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const nextCampaigns: Array<Campaign | null> = await Promise.all(
            snapshot.docs.map(async (memberSnap): Promise<Campaign | null> => {
              const memberData = memberSnap.data() as CampaignMemberDoc;

              const campaignRef = memberSnap.ref.parent.parent;

              if (!campaignRef) {
                return null;
              }

              const campaignSnap = await getDoc(campaignRef);

              if (!campaignSnap.exists()) {
                return null;
              }

              const campaignData = campaignSnap.data() as CampaignDoc;

              return {
                id: campaignSnap.id,
                name: campaignData.name,
                role: memberData.role,
                system: campaignData.systemLabel ?? campaignData.system,
                imageUrl: campaignData.imageUrl?.trim() || undefined,
                imagePositionX: campaignData.imagePositionX ?? 50,
                imagePositionY: campaignData.imagePositionY ?? 50,
                imageZoom: campaignData.imageZoom ?? 1,
              };
            }),
          );

          const cleanedCampaigns: Campaign[] = nextCampaigns
            .filter((campaign): campaign is Campaign => campaign !== null)
            .sort((a, b) => a.name.localeCompare(b.name));

          setCampaigns(cleanedCampaigns);
          setCampaignsLoading(false);
        } catch (error) {
          console.error("Failed to load campaigns:", error);

          setCampaigns([]);
          setCampaignsLoading(false);
        }
      },
      (error) => {
        console.error("Failed to load campaign memberships:", error);

        setCampaigns([]);
        setCampaignsLoading(false);
      },
    );

    return () => unsub();
  }, [user]);

  /*
   * Characters
   */
  useEffect(() => {
    if (!user) {
      setCharacters([]);
      setCharactersLoading(false);

      return;
    }

    setCharactersLoading(true);

    const q = query(
      collection(db, "characters"),
      where("ownerUid", "==", user.uid),
    );

    const unsub = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const nextCharacters: Character[] = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const data = docSnap.data() as CharacterDoc;

              let campaignName: string | undefined;

              if (data.campaignId) {
                try {
                  const campaignSnap = await getDoc(
                    doc(db, "campaigns", data.campaignId),
                  );

                  if (campaignSnap.exists()) {
                    const campaignData = campaignSnap.data() as CampaignDoc;

                    campaignName = campaignData.name;
                  }
                } catch (error) {
                  console.error(
                    `Failed to load campaign for character ${docSnap.id}:`,
                    error,
                  );
                }
              }

              const race =
                data.buildMode === "custom"
                  ? data.speciesName?.trim() || undefined
                  : data.speciesId
                    ? (speciesById[data.speciesId]?.name ?? data.speciesId)
                    : data.speciesName?.trim() || undefined;

              const className =
                data.buildMode === "custom"
                  ? data.className?.trim() || undefined
                  : data.classId
                    ? (classesById[data.classId]?.name ?? data.classId)
                    : data.className?.trim() || undefined;

              return {
                id: docSnap.id,
                name: data.name?.trim() || "Unnamed Character",
                race,
                className,
                level: typeof data.level === "number" ? data.level : undefined,
                campaignName,
                imageUrl: data.imageUrl?.trim() || undefined,
              };
            }),
          );

          nextCharacters.sort((a, b) => a.name.localeCompare(b.name));

          setCharacters(nextCharacters);
          setCharactersLoading(false);
        } catch (error) {
          console.error("Failed to load characters:", error);

          setCharacters([]);
          setCharactersLoading(false);
        }
      },
      (error) => {
        console.error("Failed to load characters:", error);

        setCharacters([]);
        setCharactersLoading(false);
      },
    );

    return () => unsub();
  }, [user]);

  async function handleDeleteCharacter(character: Character) {
    if (character.campaignName) {
      setDeleteBlockedCharacter(character);

      return;
    }

    const confirmed = window.confirm(
      `Delete "${character.name}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingCharacterId(character.id);

      await deleteDoc(doc(db, "characters", character.id));
    } catch (error) {
      console.error("Failed to delete character:", error);

      window.alert("Failed to delete character.");
    } finally {
      setDeletingCharacterId(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
          {/* =====================================================
              CAMPAIGNS
          ===================================================== */}

          <section className="rounded-2xl border border-white/10 bg-zinc-900/35 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h1 className="text-xl font-semibold text-white sm:text-2xl">
                Campaigns
              </h1>

              <Link
                to="/campaigns/new"
                className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <i className="fa-solid fa-plus text-xs" />
                Create campaign
              </Link>
            </div>

            {campaignsLoading ? (
              <EmptyState>Loading campaigns...</EmptyState>
            ) : campaigns.length === 0 ? (
              <EmptyState
                title="No campaigns yet"
                action={
                  <Link
                    to="/campaigns/new"
                    className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
                  >
                    Create your first campaign
                  </Link>
                }
              >
                Create a campaign or accept an invitation from a GM.
              </EmptyState>
            ) : (
              <div className="space-y-2.5">
                {campaigns.map((campaign) => (
                  <article
                    key={campaign.id}
                    className="group relative rounded-xl border border-white/[0.08] bg-black/15 p-3 transition hover:border-white/15 hover:bg-white/[0.025]"
                  >
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="flex min-w-0 flex-1 items-center gap-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        aria-label={`Open ${campaign.name}`}
                      >
                        <div className="h-[72px] w-28 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                          {campaign.imageUrl ? (
                            <img
                              src={campaign.imageUrl}
                              alt=""
                              className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                              style={{
                                objectPosition: `${campaign.imagePositionX ?? 50}% ${
                                  campaign.imagePositionY ?? 50
                                }%`,
                                transform: `scale(${campaign.imageZoom ?? 1})`,
                                transformOrigin: `${campaign.imagePositionX ?? 50}% ${
                                  campaign.imagePositionY ?? 50
                                }%`,
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-700">
                              <i className="fa-solid fa-dice-d20 text-2xl" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-base font-semibold text-white sm:text-lg">
                              {campaign.name}
                            </h2>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getRoleBadgeClass(
                                campaign.role,
                              )}`}
                            >
                              {formatRoleLabel(campaign.role)}
                            </span>
                          </div>

                          <p className="mt-1.5 text-sm text-zinc-400">
                            {campaign.system ?? "Tabletop RPG"}
                            {campaign.lastPlayed
                              ? ` · Last active ${campaign.lastPlayed}`
                              : ""}
                          </p>
                        </div>
                      </Link>

                      <div className="flex shrink-0 items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="hidden text-zinc-600 transition group-hover:text-zinc-400 sm:inline"
                        >
                          <i className="fa-solid fa-chevron-right text-xs" />
                        </span>

                        {(campaign.role === "gm" ||
                          campaign.role === "co-gm") && (
                          <Link
                            to={`/campaigns/${campaign.id}/settings`}
                            aria-label={`Settings for ${campaign.name}`}
                            title="Campaign settings"
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm text-zinc-400 transition hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                          >
                            <i className="fa-solid fa-gear" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* =====================================================
              CHARACTERS
          ===================================================== */}

          <section className="rounded-2xl border border-white/10 bg-zinc-900/35 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Characters
              </h2>

              <Link
                to="/characters/new"
                className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <i className="fa-solid fa-plus text-xs" />
                Create character
              </Link>
            </div>

            {charactersLoading ? (
              <EmptyState>Loading characters...</EmptyState>
            ) : characters.length === 0 ? (
              <EmptyState
                title="No characters yet"
                action={
                  <Link
                    to="/characters/new"
                    className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
                  >
                    Create your first character
                  </Link>
                }
              >
                Create a character now and attach it to a campaign later.
              </EmptyState>
            ) : (
              <div className="space-y-2.5">
                {characters.map((character) => {
                  const summary = getCharacterSummary(character);

                  return (
                    <article
                      key={character.id}
                      className="group rounded-xl border border-white/[0.08] bg-black/15 p-3 transition hover:border-white/15 hover:bg-white/[0.025]"
                    >
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/characters/${character.id}`}
                          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                          aria-label={`Open ${character.name}`}
                        >
                          <Avatar
                            src={character.imageUrl}
                            name={character.name}
                            className="h-12 w-12 shrink-0 rounded-lg"
                          />

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-base font-semibold text-white">
                              {character.name}
                            </h3>

                            {summary ? (
                              <p className="mt-1 text-sm text-zinc-400">
                                {summary}
                              </p>
                            ) : null}

                            <p className="mt-1 truncate text-sm text-zinc-500">
                              {character.campaignName ?? "Not assigned"}
                            </p>
                          </div>
                        </Link>

                        <div className="flex shrink-0 items-center gap-2">
                          <Link
                            to={`/characters/${character.id}/edit`}
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm text-zinc-400 transition hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            aria-label={`Edit ${character.name}`}
                            title="Edit character"
                          >
                            <i className="fa-solid fa-pen-to-square" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteCharacter(character)}
                            disabled={deletingCharacterId === character.id}
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm text-zinc-500 transition hover:border-rose-500/20 hover:bg-rose-500/[0.07] hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            aria-label={`Delete ${character.name}`}
                            title="Delete character"
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* =====================================================
          DELETE BLOCKED MODAL
      ===================================================== */}

      {deleteBlockedCharacter ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setDeleteBlockedCharacter(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/15 bg-zinc-900 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-white">
              Character is assigned to a campaign
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              <span className="font-medium text-zinc-200">
                {deleteBlockedCharacter.name}
              </span>{" "}
              is currently assigned to{" "}
              <span className="font-medium text-zinc-200">
                {deleteBlockedCharacter.campaignName}
              </span>
              .
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Remove the character from that campaign before deleting it.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setDeleteBlockedCharacter(null)}
                className="min-h-10 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const EmptyState = ({
  title,
  children,
  action,
}: {
  title?: string;
  children: string;
  action?: ReactNode;
}) => (
  <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-5 py-8 text-center">
    {title ? (
      <p className="text-base font-semibold text-zinc-200">{title}</p>
    ) : null}

    <p className={`${title ? "mt-2" : ""} text-sm leading-6 text-zinc-500`}>
      {children}
    </p>

    {action}
  </div>
);

export default Home;
