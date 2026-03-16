import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Campaign = {
  id: string;
  name: string;
  role: "dm" | "player";
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

const Home = () => {
  const { appUser } = useAuth();

  // Replace these with Firestore data later
  const campaigns: Campaign[] = [
    {
      id: "1",
      name: "Lost Mine of Phandelver",
      role: "dm",
      system: "D&D 5e",
      lastPlayed: "2 days ago",
    },
    {
      id: "2",
      name: "Curse of Strahd",
      role: "player",
      system: "D&D 5e",
      lastPlayed: "1 week ago",
    },
  ];

  const characters: Character[] = [
    {
      id: "1",
      name: "Elaris",
      race: "Elf",
      className: "Wizard",
      level: 4,
      campaignName: "Curse of Strahd",
    },
    {
      id: "2",
      name: "Brom",
      race: "Dwarf",
      className: "Fighter",
      level: 3,
      campaignName: "Lost Mine of Phandelver",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 shadow-2xl sm:mb-10 sm:p-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
              rphub
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Welcome{appUser?.displayName ? `, ${appUser.displayName}` : ""}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
              Build campaigns, manage characters, and give players access only
              to what they should see.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200">
                Start new campaign
              </button>

              <Link
                to="/characters/new"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
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

              <button className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                New campaign
              </button>
            </div>

            {campaigns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
                <p className="text-sm text-zinc-300">No campaigns yet.</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Create your first campaign or accept an invite from a DM.
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
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              campaign.role === "dm"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : "bg-blue-500/15 text-blue-300"
                            }`}
                          >
                            {campaign.role === "dm" ? "DM" : "Player"}
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

                        {campaign.role === "dm" && (
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

            {characters.length === 0 ? (
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
