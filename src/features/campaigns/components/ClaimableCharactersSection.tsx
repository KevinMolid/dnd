import { Link } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import type { CampaignCharacter } from "../hooks/useCampaignPageData";

type ClaimableCharactersSectionProps = {
  characters: CampaignCharacter[];
  loading?: boolean;
  isGm: boolean;
  busyCharacterId?: string | null;
  onClaimCharacter: (characterId: string) => Promise<void> | void;
};

const ClaimableCharactersSection = ({
  characters,
  loading = false,
  isGm,
  busyCharacterId = null,
  onClaimCharacter,
}: ClaimableCharactersSectionProps) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Claimable characters
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Characters in this campaign that do not currently have a player.
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 whitespace-nowrap">
          {characters.length} character{characters.length === 1 ? "" : "s"}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
          <p className="text-sm text-zinc-400">
            Loading claimable characters...
          </p>
        </div>
      ) : characters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/50 p-6 text-center">
          <p className="text-sm text-zinc-300">
            No claimable characters right now.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            {isGm
              ? "Create an unassigned campaign character to make it available here."
              : "Ask your GM to add an unassigned campaign character if needed."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {characters.map((character) => {
            const isBusy = busyCharacterId === character.id;
            const isActive = character.campaignStatus === "active";

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

                        <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300">
                          Unassigned
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${
                            isActive
                              ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                              : "border border-white/10 bg-white/5 text-zinc-300"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-zinc-400">
                        {[character.race, character.className]
                          .filter(Boolean)
                          .join(" • ")}
                        {character.level ? ` • Level ${character.level}` : ""}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        Created for this campaign and available to claim.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {isGm && (
                      <Link
                        to={`/characters/${character.id}`}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                      >
                        Open
                      </Link>
                    )}

                    <button
                      onClick={() => onClaimCharacter(character.id)}
                      disabled={isBusy}
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isBusy ? "Claiming..." : "Claim"}
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

export default ClaimableCharactersSection;
