import { Link } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import type { CharacterDoc, CharacterSheetDerived } from "../types";

type CharacterSheetHeaderProps = {
  characterId?: string;
  character: CharacterDoc;
  derived: CharacterSheetDerived;
};

const CharacterSheetHeader = ({
  characterId,
  character,
  derived,
}: CharacterSheetHeaderProps) => {
  return (
    <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 shadow-2xl sm:p-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
        Character Sheet
      </p>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-6">
            <Avatar name={character.name} src={character.imageUrl} size="xl" />

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {character.name}
              </h1>

              <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
                {derived.speciesName} • {derived.className}
                {derived.subclassName ? ` • ${derived.subclassName}` : ""} •
                Level {character.level}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                  Background: {derived.backgroundName}
                </span>

                {derived.featName && (
                  <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                    Origin Feat: {derived.featName}
                  </span>
                )}

                {character.alignment && (
                  <span className="rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-xs text-zinc-200">
                    {character.alignment}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/characters/${characterId}/edit`}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Edit character
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheetHeader;