import { useEffect, useState } from "react";
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

  /*
   * Guided D&D character fields.
   */
  classId?: string;
  speciesId?: string;
  backgroundId?: string;
  originFeatId?: string | null;

  /*
   * Custom character fields.
   */
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
    return "bg-emerald-500/15 text-emerald-300";
  }

  if (role === "co-gm") {
    return "bg-amber-500/15 text-amber-300";
  }

  return "bg-blue-500/15 text-blue-300";
};

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

              /*
               * Load campaign name when assigned.
               */
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

              /*
               * Custom characters store the display names directly.
               *
               * Guided characters store class/species IDs, which we
               * resolve through the D&D ruleset.
               *
               * The fallbacks also make older or partially migrated
               * character documents display safely.
               */
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
      <div className="mx-auto w-full max-w-7xl py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* CAMPAIGNS */}

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Campaigns
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Start a new campaign or continue one you already belong to.
                </p>
              </div>

              <Link
                to="/campaigns/new"
                className="shrink-0 rounded-xl bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600"
              >
                <i className="fa-solid fa-plus" /> Create campaign
              </Link>
            </div>

            {campaignsLoading ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                <p className="text-sm text-zinc-400">Loading campaigns...</p>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                <p className="text-sm text-zinc-300">No campaigns yet.</p>

                <p className="mt-2 text-sm text-zinc-500">
                  Create your first campaign or accept an invite from a GM.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                          {campaign.imageUrl ? (
                            <img
                              src={campaign.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
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

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-white sm:text-lg">
                              {campaign.name}
                            </h3>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getRoleBadgeClass(
                                campaign.role,
                              )}`}
                            >
                              {formatRoleLabel(campaign.role)}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-zinc-400">
                            {campaign.system ?? "Tabletop RPG"}

                            {campaign.lastPlayed
                              ? ` • Last active ${campaign.lastPlayed}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/campaigns/${campaign.id}`}
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                          Continue
                        </Link>

                        {(campaign.role === "gm" ||
                          campaign.role === "co-gm") && (
                          <Link
                            to={`/campaigns/${campaign.id}/settings`}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/10"
                          >
                            <i className="fa-solid fa-gear" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* CHARACTERS */}

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Characters
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Create a new player character or open one you already use.
                </p>
              </div>

              <Link
                to="/characters/new"
                className="shrink-0 rounded-xl bg-cyan-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-600"
              >
                <i className="fa-solid fa-plus" /> Create character
              </Link>
            </div>

            {charactersLoading ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                <p className="text-sm text-zinc-400">Loading characters...</p>
              </div>
            ) : characters.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                <p className="text-sm text-zinc-300">No characters yet.</p>

                <p className="mt-2 text-sm text-zinc-500">
                  Create a character and attach it to a campaign later.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {characters.map((character) => {
                  const characterSummary = [character.race, character.className]
                    .filter(Boolean)
                    .join(" • ");

                  return (
                    <div
                      key={character.id}
                      className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          <Avatar
                            src={character.imageUrl}
                            name={character.name}
                            className="h-14 w-14 shrink-0 rounded-xl"
                          />

                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-white sm:text-lg">
                              {character.name}
                            </h3>

                            {(characterSummary || character.level) && (
                              <p className="mt-2 text-sm text-zinc-400">
                                {characterSummary}

                                {characterSummary && character.level
                                  ? " • "
                                  : ""}

                                {character.level
                                  ? `Level ${character.level}`
                                  : ""}
                              </p>
                            )}

                            <p className="mt-1 text-sm text-zinc-500">
                              Campaign:{" "}
                              {character.campaignName ?? "Not assigned"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/characters/${character.id}`}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                          >
                            Open
                          </Link>

                          <Link
                            to={`/characters/${character.id}/edit`}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/10"
                            aria-label={`Edit ${character.name}`}
                            title="Edit character"
                          >
                            <i className="fa-solid fa-pen-to-square" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteCharacter(character)}
                            disabled={deletingCharacterId === character.id}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={`Delete ${character.name}`}
                            title="Delete character"
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* DELETE BLOCKED MODAL */}

      {deleteBlockedCharacter ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setDeleteBlockedCharacter(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-white/20 bg-zinc-900 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">
                Character is assigned to a campaign
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                <span className="font-medium text-zinc-200">
                  {deleteBlockedCharacter.name}
                </span>{" "}
                is currently assigned to{" "}
                <span className="font-medium text-zinc-200">
                  {deleteBlockedCharacter.campaignName}
                </span>
                .
              </p>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Unassign the character from the campaign before deleting it.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setDeleteBlockedCharacter(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
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

export default Home;
