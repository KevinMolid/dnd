import { useState } from "react";
import { Link } from "react-router-dom";

import Avatar from "../../../components/Avatar";
import CharacterRestButtons, {
  type CharacterRestConfig,
} from "./CharacterRestButtons";

type CharacterSheetHeaderProps = {
  characterId?: string;
  name: string;
  imageUrl?: string;
  level: number;
  speciesName?: string | null;
  className?: string | null;
  subclassName?: string | null;
  backgroundName?: string | null;
  currentHp?: number;
  maxHp?: number;
  rest?: CharacterRestConfig;
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
  currentHp,
  maxHp,
  rest,
}: CharacterSheetHeaderProps) => {
  const [portraitOpen, setPortraitOpen] = useState(false);
  const classLabel = [className, subclassName].filter(Boolean).join(" · ");

  return (
    <>
      <header className="mb-3 flex flex-col gap-3 border-b border-white/10 pb-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full min-w-0 items-center gap-3 md:w-auto">
          {imageUrl ? (
            <button
              type="button"
              onClick={() => setPortraitOpen(true)}
              aria-label={`Enlarge portrait for ${name}`}
              title="Enlarge portrait"
              className="group shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
            >
              <Avatar
                src={imageUrl}
                name={name}
                className="h-16 w-16 rounded-xl transition group-hover:brightness-110"
              />
            </button>
          ) : (
            <Avatar
              src={imageUrl}
              name={name}
              className="h-16 w-16 shrink-0 rounded-xl"
            />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="min-w-0 flex-1 truncate text-2xl font-bold tracking-tight text-white">
                {name}
              </h1>
              {characterId ? (
                <>
                  <Link
                    to={`/characters/${characterId}/print`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Print ${name}`}
                    title="Print character sheet"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white md:hidden"
                  >
                    <i className="fa-solid fa-print text-[12px]" aria-hidden="true" />
                  </Link>
                  <Link
                    to={`/characters/${characterId}/edit`}
                    aria-label={`Edit ${name}`}
                    title="Edit character"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white md:hidden"
                  >
                    <i className="fa-solid fa-pen-to-square text-[12px]" aria-hidden="true" />
                  </Link>
                </>
              ) : null}
            </div>
            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
              <span className="font-semibold text-zinc-100">Level {level}</span>
              {speciesName ? <span className="font-medium text-zinc-200">{speciesName}</span> : null}
              {classLabel ? <span className="font-semibold text-zinc-100">{classLabel}</span> : null}
              {backgroundName ? (
                <>
                  <span className="mx-0.5 text-zinc-600">•</span>
                  <span className="text-zinc-500">{backgroundName} background</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Keep rest + action buttons on desktop; mobile uses icons above. */}
        <div className="hidden shrink-0 flex-wrap items-center gap-2 md:flex md:justify-end">
          {rest && typeof currentHp === "number" && typeof maxHp === "number" ? (
            <CharacterRestButtons currentHp={currentHp} maxHp={maxHp} {...rest} />
          ) : null}
          {characterId ? (
            <>
              <Link
                to={`/characters/${characterId}/print`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Print ${name}`}
                title="Print character sheet"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
              >
                <i className="fa-solid fa-print text-[11px]" aria-hidden="true" />
                Print
              </Link>
              <Link
                to={`/characters/${characterId}/edit`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
              >
                <i className="fa-solid fa-pen-to-square text-[11px]" aria-hidden="true" />
                Edit
              </Link>
            </>
          ) : null}
        </div>
      </header>

      {portraitOpen && imageUrl ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} portrait`}
          onMouseDown={() => setPortraitOpen(false)}
        >
          <button
            type="button"
            onClick={() => setPortraitOpen(false)}
            aria-label="Close portrait"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
          <img
            src={imageUrl}
            alt={name}
            onMouseDown={(event) => event.stopPropagation()}
            className="max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] rounded-xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </>
  );
};

export default CharacterSheetHeader;
