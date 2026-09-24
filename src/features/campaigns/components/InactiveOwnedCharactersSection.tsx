import { Link, useLocation } from "react-router-dom";

import Avatar from "../../../components/Avatar";
import type { CampaignCharacter } from "../hooks/useCampaignPageData";

type InactiveOwnedCharactersSectionProps = {
  characters: CampaignCharacter[];
  loading?: boolean;
  busyCharacterId?: string | null;
  onActivateCharacter: (characterId: string) => Promise<void> | void;
};

const getCharacterSummary = (character: CampaignCharacter) =>
  [
    character.level ? `Level ${character.level}` : null,
    character.race,
    character.className,
  ]
    .filter(Boolean)
    .join(" ");

const InactiveOwnedCharactersSection = ({
  characters,
  loading = false,
  busyCharacterId = null,
  onActivateCharacter,
}: InactiveOwnedCharactersSectionProps) => {
  const location = useLocation();

  if (!loading && characters.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl border border-white/10 bg-zinc-900/35 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-user text-xs text-zinc-500" />

          <h2 className="text-base font-semibold text-white">
            Your characters
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed border-white/[0.08] bg-black/10 px-3 py-4 text-center">
          <p className="text-[11px] text-zinc-500">Loading characters…</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {characters.map((character) => {
            const isBusy = busyCharacterId === character.id;

            return (
              <div
                key={character.id}
                className="rounded-lg border border-white/[0.08] bg-black/15 px-3 py-2.5 transition hover:border-white/15 hover:bg-white/[0.025]"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar
                      src={character.imageUrl}
                      name={character.name}
                      className="h-12 w-12 shrink-0 rounded-lg"
                    />

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="truncate text-sm font-semibold text-white">
                          {character.name}
                        </h3>

                        <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                          Inactive
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-xs text-zinc-400">
                        {getCharacterSummary(character) || "Character"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <Link
                      to={`/characters/${character.id}`}
                      state={{
                        from: `${location.pathname}${location.search}`,
                      }}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      Open
                    </Link>

                    <button
                      type="button"
                      onClick={() => onActivateCharacter(character.id)}
                      disabled={isBusy}
                      className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 transition hover:border-emerald-500/40 hover:bg-emerald-500/15 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isBusy ? "Activating…" : "Set active"}
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
