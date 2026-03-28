import { Link, useLocation } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import type { CampaignCharacter } from "../hooks/useCampaignPageData";

type InactiveOwnedCharactersSectionProps = {
  characters: CampaignCharacter[];
  loading?: boolean;
  busyCharacterId?: string | null;
  onActivateCharacter: (characterId: string) => Promise<void> | void;
};

const InactiveOwnedCharactersSection = ({
  characters,
  loading = false,
  busyCharacterId = null,
  onActivateCharacter,
}: InactiveOwnedCharactersSectionProps) => {
  const location = useLocation();

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Your inactive characters
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Characters you own in this campaign that are not currently active.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
          {characters.length} character{characters.length === 1 ? "" : "s"}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
          <p className="text-sm text-zinc-400">Loading characters...</p>
        </div>
      ) : characters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
          <p className="text-sm text-zinc-300">
            You have no inactive characters in this campaign.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {characters.map((character) => {
            const isBusy = busyCharacterId === character.id;

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
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-white sm:text-lg">
                          {character.name}
                        </h3>

                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                          Inactive
                        </span>

                        <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-300">
                          Yours
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-zinc-400">
                        {[character.race, character.className]
                          .filter(Boolean)
                          .join(" • ")}
                        {character.level ? ` • Level ${character.level}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/characters/${character.id}`}
                      state={{
                        from: `${location.pathname}${location.search}`,
                        label: "Back to campaign",
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Open
                    </Link>

                    <button
                      onClick={() => onActivateCharacter(character.id)}
                      disabled={isBusy}
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isBusy ? "Activating..." : "Set active"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default InactiveOwnedCharactersSection;
