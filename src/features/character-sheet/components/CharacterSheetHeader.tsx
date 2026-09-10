import { Link } from "react-router-dom";

import Avatar from "../../../components/Avatar";

type CharacterSheetHeaderProps = {
  characterId?: string;

  name: string;

  imageUrl?: string | null;

  level: number;

  speciesName?: string | null;

  className?: string | null;

  subclassName?: string | null;

  backgroundName?: string | null;
};

const CharacterSheetHeader = ({
  characterId,
  name,
  imageUrl,
  level,
  speciesName,
  className,
  subclassName,
  backgroundName,
}: CharacterSheetHeaderProps) => {
  const identityParts = [`Level ${level}`, speciesName, className].filter(
    (value): value is string => Boolean(value?.trim()),
  );

  const identityText = identityParts.join(" ");

  return (
    <header className="mb-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={name} src={imageUrl} className="h-16 w-16 rounded-xl" />

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold leading-tight tracking-tight text-white">
              {name}
            </h1>

            <div className="mt-1 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="text-sm text-zinc-300">{identityText}</p>

              {subclassName ? (
                <>
                  <span aria-hidden="true" className="text-zinc-700">
                    •
                  </span>

                  <span className="text-xs text-zinc-400">{subclassName}</span>
                </>
              ) : null}

              {backgroundName ? (
                <>
                  <span aria-hidden="true" className="text-zinc-700">
                    •
                  </span>

                  <span className="text-xs text-zinc-500">
                    {backgroundName} background
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {characterId ? (
          <Link
            to={`/characters/${characterId}/edit`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <i className="fa-solid fa-pen-to-square text-[10px]" />

            <span className="hidden sm:inline">Edit</span>
          </Link>
        ) : null}
      </div>
    </header>
  );
};

export default CharacterSheetHeader;
