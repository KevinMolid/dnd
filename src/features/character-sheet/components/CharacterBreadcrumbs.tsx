import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

type CharacterBreadcrumbsProps = {
  characterId?: string;
  characterName: string;
  campaignId?: string | null;
  fallbackTo?: string;
};

const CharacterBreadcrumbs = ({
  characterId,
  characterName,
  campaignId,
  fallbackTo = "/",
}: CharacterBreadcrumbsProps) => {
  const navigate = useNavigate();

  const storageKey = useMemo(
    () =>
      characterId ? `rphub:character-sheet:return-to:${characterId}` : null,
    [characterId],
  );

  /*
   * The first destination recorded for this character-sheet visit is kept
   * through Sheet -> Edit -> Save -> Sheet.
   *
   * It is cleared only when the user actually leaves through the Back button
   * or one of these breadcrumbs, so Edit can never become the return target.
   */
  useEffect(() => {
    if (!storageKey) {
      return;
    }

    const existing = sessionStorage.getItem(storageKey);

    if (!existing) {
      sessionStorage.setItem(storageKey, fallbackTo);
    }
  }, [fallbackTo, storageKey]);

  const getReturnTo = () => {
    if (!storageKey) {
      return fallbackTo;
    }

    return sessionStorage.getItem(storageKey) ?? fallbackTo;
  };

  const clearStoredReturnTo = () => {
    if (storageKey) {
      sessionStorage.removeItem(storageKey);
    }
  };

  const handleBack = () => {
    const returnTo = getReturnTo();

    clearStoredReturnTo();

    navigate(returnTo);
  };

  const handleBreadcrumbNavigation = () => {
    clearStoredReturnTo();
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px]">
      <button
        type="button"
        onClick={handleBack}
        className="font-medium text-zinc-400 transition hover:text-white"
      >
        ← Back
      </button>

      <span className="text-zinc-700">|</span>

      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 flex-wrap items-center gap-1.5 text-zinc-500"
      >
        <Link
          to="/"
          onClick={handleBreadcrumbNavigation}
          className="transition hover:text-zinc-200"
        >
          Home
        </Link>

        {campaignId ? (
          <>
            <span className="text-zinc-700">›</span>

            <Link
              to={`/campaigns/${campaignId}`}
              onClick={handleBreadcrumbNavigation}
              className="transition hover:text-zinc-200"
            >
              Campaign
            </Link>

            <span className="text-zinc-700">›</span>

            <Link
              to={`/campaigns/${campaignId}/characters`}
              onClick={handleBreadcrumbNavigation}
              className="transition hover:text-zinc-200"
            >
              Characters
            </Link>
          </>
        ) : null}

        <span className="text-zinc-700">›</span>

        <span
          className="max-w-[240px] truncate font-medium text-zinc-300"
          aria-current="page"
        >
          {characterName}
        </span>
      </nav>
    </div>
  );
};

export default CharacterBreadcrumbs;
