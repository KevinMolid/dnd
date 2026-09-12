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
  const classLabel = [className, subclassName].filter(Boolean).join(" · ");

  return (
    <header className="mb-3 flex flex-col gap-3 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar
          src={imageUrl}
          name={name}
          className="h-16 w-16 shrink-0 rounded-xl"
        />

        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight text-white">
            {name}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="font-medium text-zinc-200">Level {level}</span>

            {speciesName ? (
              <>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-300">{speciesName}</span>
              </>
            ) : null}

            {classLabel ? (
              <>
                <span className="text-zinc-700">•</span>
                <span className="font-medium text-zinc-200">{classLabel}</span>
              </>
            ) : null}

            {backgroundName ? (
              <>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">
                  {backgroundName} background
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
        {rest && typeof currentHp === "number" && typeof maxHp === "number" ? (
          <CharacterRestButtons currentHp={currentHp} maxHp={maxHp} {...rest} />
        ) : null}

        {characterId ? (
          <Link
            to={`/characters/${characterId}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
          >
            <i className="fa-solid fa-pen-to-square text-[11px]" />
            Edit
          </Link>
        ) : null}
      </div>
    </header>
  );
};

export default CharacterSheetHeader;
