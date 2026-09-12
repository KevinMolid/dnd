import { Link, useNavigate } from "react-router-dom";

type CharacterBreadcrumbsProps = {
  characterName: string;
  campaignId?: string | null;
  fallbackTo?: string;
};

const CharacterBreadcrumbs = ({
  characterName,
  campaignId,
  fallbackTo = "/",
}: CharacterBreadcrumbsProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    /*
     * Prefer real browser history so "Back" returns to the page
     * the user actually opened the character sheet from.
     *
     * fallbackTo still gives direct/deep-linked character sheets
     * a safe in-app destination.
     */
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo);
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
        <Link to="/" className="transition hover:text-zinc-200">
          Home
        </Link>

        {campaignId ? (
          <>
            <span className="text-zinc-700">›</span>

            <Link
              to={`/campaigns/${campaignId}`}
              className="transition hover:text-zinc-200"
            >
              Campaign
            </Link>

            <span className="text-zinc-700">›</span>

            <Link
              to={`/campaigns/${campaignId}/characters`}
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
