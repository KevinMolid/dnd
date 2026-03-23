import { Link } from "react-router-dom";

import type { CampaignCharacter } from "../hooks/useCampaignPageData";

type CampaignCharactersSectionProps = {
  campaignId: string;
  characters: CampaignCharacter[];
  loading: boolean;
};

const CampaignCharactersSection = ({
  campaignId,
  characters,
  loading,
}: CampaignCharactersSectionProps) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Characters
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Characters currently attached to this campaign.
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
            No characters have been assigned yet.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Open the Characters page to attach characters to this campaign.
          </p>
          <div className="mt-4">
            <Link
              to={`/campaigns/${campaignId}/characters`}
              className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Open characters page
            </Link>
          </div>
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

                  <p className="mt-1 text-sm text-zinc-500">
                    Player:{" "}
                    {character.ownerName ||
                      character.ownerEmail ||
                      character.ownerUid}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/characters/${character.id}`}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                  >
                    Open
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CampaignCharactersSection;
