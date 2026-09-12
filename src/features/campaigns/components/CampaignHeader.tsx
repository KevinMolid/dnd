import { Link, NavLink } from "react-router-dom";

import type { CampaignDoc, CampaignMemberDoc } from "../../../types/campaign";
import {
  formatRoleLabel,
  getRoleBadgeClass,
} from "../hooks/useCampaignPageData";

type CampaignHeaderProps = {
  campaign: CampaignDoc & { id: string };
  membership: CampaignMemberDoc;
  systemLabel: string;
  isGm: boolean;
  onOpenSettings: () => void;
};

const CampaignHeader = ({
  campaign,
  membership,
  systemLabel,
  isGm,
  onOpenSettings,
}: CampaignHeaderProps) => {
  const canManageCampaign =
    membership.role === "gm" || membership.role === "co-gm";

  const campaignImageUrl = campaign.imageUrl?.trim();
  const imagePositionX = campaign.imagePositionX ?? 50;
  const imagePositionY = campaign.imagePositionY ?? 50;
  const imageZoom = campaign.imageZoom ?? 1;

  const tabBaseClass =
    "whitespace-nowrap px-4 py-2.5 text-sm font-medium transition";
  const tabInactiveClass = "text-zinc-300 hover:bg-white/8 hover:text-white";
  const tabActiveClass =
    "bg-white/10 text-white shadow-lg shadow-sky-500/20 border-b-2";

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
        >
          ← Back to home
        </Link>
      </div>

      <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 shadow-2xl">
        {campaignImageUrl && (
          <>
            <img
              src={campaignImageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                objectPosition: `${imagePositionX}% ${imagePositionY}%`,
                transform: `scale(${imageZoom})`,
                transformOrigin: `${imagePositionX}% ${imagePositionY}%`,
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/35" />

            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-black/25" />
          </>
        )}

        <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8">
          <div>
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-3xl">
                <p
                  className={`mb-3 text-xs font-semibold uppercase tracking-[0.28em] ${
                    campaignImageUrl ? "text-zinc-300" : "text-zinc-500"
                  }`}
                >
                  Campaign overview
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl">
                    {campaign.name}
                  </h1>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${getRoleBadgeClass(
                      membership.role,
                    )}`}
                  >
                    {formatRoleLabel(membership.role)}
                  </span>
                </div>

                <p
                  className={`mt-3 text-sm leading-6 sm:text-base ${
                    campaignImageUrl ? "text-zinc-200" : "text-zinc-400"
                  }`}
                >
                  {campaign.description?.trim()
                    ? campaign.description
                    : "No campaign description has been added yet."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <div className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-zinc-200 backdrop-blur-sm">
                    {systemLabel}
                  </div>

                  <div className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-zinc-200 backdrop-blur-sm">
                    {campaign.visibility === "public" ? "Public" : "Private"}
                  </div>

                  {campaign.archived && (
                    <div className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-300 backdrop-blur-sm">
                      Archived
                    </div>
                  )}
                </div>
              </div>

              {canManageCampaign && (
                <button
                  onClick={onOpenSettings}
                  className="shrink-0 rounded-xl border border-white/10 bg-black/25 px-4 py-2 text-sm font-medium text-zinc-300 backdrop-blur-sm transition hover:bg-black/40 hover:text-white"
                >
                  {isGm ? <i className="fa-solid fa-gear"></i> : "View details"}
                </button>
              )}
            </div>
          </div>

          <div className="-mx-6 -mb-6 overflow-x-auto border-t border-white/10 bg-zinc-950/55 px-6 backdrop-blur-sm sm:-mx-8 sm:-mb-8 sm:px-8">
            <div className="inline-flex min-w-full">
              <NavLink
                to={`/campaigns/${campaign.id}`}
                end
                className={({ isActive }) =>
                  `${tabBaseClass} ${isActive ? tabActiveClass : tabInactiveClass}`
                }
              >
                Overview
              </NavLink>

              <NavLink
                to={`/campaigns/${campaign.id}/handouts`}
                className={({ isActive }) =>
                  `${tabBaseClass} ${isActive ? tabActiveClass : tabInactiveClass}`
                }
              >
                Handouts
              </NavLink>

              <NavLink
                to={`/campaigns/${campaign.id}/characters`}
                className={({ isActive }) =>
                  `${tabBaseClass} ${isActive ? tabActiveClass : tabInactiveClass}`
                }
              >
                Characters
              </NavLink>

              <NavLink
                to={`/campaigns/${campaign.id}/journal`}
                className={({ isActive }) =>
                  `${tabBaseClass} ${isActive ? tabActiveClass : tabInactiveClass}`
                }
              >
                Journal
              </NavLink>

              {canManageCampaign && (
                <>
                  <NavLink
                    to={`/campaigns/${campaign.id}/workspace`}
                    className={({ isActive }) =>
                      `${tabBaseClass} ${isActive ? tabActiveClass : tabInactiveClass}`
                    }
                  >
                    Workspace
                  </NavLink>

                  <NavLink
                    to={`/campaigns/${campaign.id}/maps`}
                    className={({ isActive }) =>
                      `${tabBaseClass} ${isActive ? tabActiveClass : tabInactiveClass}`
                    }
                  >
                    Maps
                  </NavLink>

                  <NavLink
                    to={`/campaigns/${campaign.id}/members`}
                    className={({ isActive }) =>
                      `${tabBaseClass} ${isActive ? tabActiveClass : tabInactiveClass}`
                    }
                  >
                    Players
                  </NavLink>

                  <NavLink
                    to={`/campaigns/${campaign.id}/encounter`}
                    className={({ isActive }) =>
                      `${tabBaseClass} ${isActive ? tabActiveClass : tabInactiveClass}`
                    }
                  >
                    Encounters
                  </NavLink>

                  <NavLink
                    to={`/campaigns/${campaign.id}/npcs`}
                    className={({ isActive }) =>
                      `${tabBaseClass} ${isActive ? tabActiveClass : tabInactiveClass}`
                    }
                  >
                    NPCs
                  </NavLink>

                  <NavLink
                    to={`/campaigns/${campaign.id}/monsters`}
                    className={({ isActive }) =>
                      `${tabBaseClass} ${isActive ? tabActiveClass : tabInactiveClass}`
                    }
                  >
                    Monsters
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CampaignHeader;
