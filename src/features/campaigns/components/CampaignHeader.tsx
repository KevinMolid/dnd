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

      <section className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-start justify-between">
              <div className="max-w-3xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                  Campaign overview
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {campaign.name}
                  </h1>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeClass(
                      membership.role,
                    )}`}
                  >
                    {formatRoleLabel(membership.role)}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
                  {campaign.description?.trim()
                    ? campaign.description
                    : "No campaign description has been added yet."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                    {systemLabel}
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                    {campaign.visibility === "public" ? "Public" : "Private"}
                  </div>

                  {campaign.archived && (
                    <div className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-300">
                      Archived
                    </div>
                  )}
                </div>
              </div>

              {canManageCampaign && (
                <button
                  onClick={onOpenSettings}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/10"
                >
                  {isGm ? <i className="fa-solid fa-gear"></i> : "View details"}
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
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
