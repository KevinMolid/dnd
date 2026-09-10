import { Link } from "react-router-dom";

import Avatar from "../../../components/Avatar";

type CharacterSheetHeaderProps = {
  characterId?: string;

  name: string;

  imageUrl?: string | null;

  subtitle?: string;

  eyebrow?: string;

  badges?: Array<string | null | undefined | false>;
};

const CharacterSheetHeader = ({
  characterId,

  name,

  imageUrl,

  subtitle,

  eyebrow = "Character Sheet",

  badges = [],
}: CharacterSheetHeaderProps) => {
  const visibleBadges = badges.filter(
    (badge): badge is string =>
      typeof badge === "string" && badge.trim().length > 0,
  );

  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.025] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar
            name={name}
            src={imageUrl}
            className="h-16 w-16 rounded-xl sm:h-20 sm:w-20"
          />

          <div className="min-w-0">
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
              {eyebrow}
            </p>

            <h1 className="truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {name}
            </h1>

            {subtitle ? (
              <p className="mt-1 truncate text-xs text-zinc-400 sm:text-sm">
                {subtitle}
              </p>
            ) : null}

            {visibleBadges.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {visibleBadges.map((badge, index) => (
                  <span
                    key={`${badge}-${index}`}
                    className="rounded-full border border-white/10 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-300"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {characterId ? (
          <Link
            to={`/characters/${characterId}/edit`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            <i className="fa-solid fa-pen-to-square" />
            Edit
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default CharacterSheetHeader;
