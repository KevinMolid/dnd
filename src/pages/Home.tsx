import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  collectionGroup,
  getDoc,
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

type Campaign = {
  id: string;
  name: string;
  role: CampaignRole;
  system?: string;
  lastPlayed?: string;
};

type Character = {
  id: string;
  name: string;
  race?: string;
  className?: string;
  level?: number;
  campaignName?: string;
};

type CharacterDoc = {
  ownerUid: string;
  campaignId: string | null;
  name: string;
  level: number;
  classId: string;
  speciesId: string;
  backgroundId: string;
  originFeatId: string | null;
  abilityScores: {
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
  if (role === "gm") return "GM";
  if (role === "co-gm") return "Co-GM";
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
  const { appUser, user } = useAuth();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [charactersLoading, setCharactersLoading] = useState(true);

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
      (snapshot) => {
        const nextCharacters: Character[] = snapshot.docs.map((doc) => {
          const data = doc.data() as CharacterDoc;

          return {
            id: doc.id,
            name: data.name,
            race: speciesById[data.speciesId]?.name ?? data.speciesId,
            className: classesById[data.classId]?.name ?? data.classId,
            level: data.level,
            campaignName: undefined,
          };
        });

        nextCharacters.sort((a, b) => a.name.localeCompare(b.name));

        setCharacters(nextCharacters);
        setCharactersLoading(false);
      },
      (error) => {
        console.error("Failed to load characters:", error);
        setCharacters([]);
        setCharactersLoading(false);
      },
    );

    return () => unsub();
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl py-6 sm:py-8">
        <section className="mb-8 rounded-3xl border border-green-200/15 bg-gradient-to-br from-green-600/15 to-white/3 p-6 shadow-2xl sm:mb-10 sm:p-8">
          <div className="max-w-3xl">

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Welcome{appUser?.displayName ? `, ${appUser.displayName}` : ""}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-green-100/80 sm:text-base">
              Build campaigns, manage characters, and give players access only
              to what they should see.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/campaigns/new"
                className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Start new campaign
              </Link>

              <Link
                to="/characters/new"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Create character
              </Link>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
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
                className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                New campaign
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

                      <div className="flex gap-2">
                        <Link
                          to={`/campaigns/${campaign.id}`}
                          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                        >
                          Open
                        </Link>

                        {(campaign.role === "gm" ||
                          campaign.role === "co-gm") && (
                          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                            Manage
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

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
                className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                New character
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
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4 transition hover:border-white/20 hover:bg-zinc-900"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-white sm:text-lg">
                          {character.name}
                        </h3>

                        <p className="mt-2 text-sm text-zinc-400">
                          {[character.race, character.className]
                            .filter(Boolean)
                            .join(" • ")}
                          {character.level ? ` • Level ${character.level}` : ""}
                        </p>

                        {character.campaignName && (
                          <p className="mt-1 text-sm text-zinc-500">
                            Campaign: {character.campaignName}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/characters/${character.id}`}
                          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                        >
                          Open
                        </Link>

                        <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
