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
    "relative whitespace-nowrap px-4 py-3 text-sm font-medium transition";

  const tabInactiveClass =
    "text-zinc-300 hover:bg-white/[0.06] hover:text-white";

  const tabActiveClass = "bg-white/[0.07] text-white";

  const gmToolClass =
    "inline-flex min-h-9 items-center whitespace-nowrap rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.09] hover:text-white";

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex min-h-9 items-center text-sm text-zinc-400 transition hover:text-white"
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
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p
                className={`mb-3 text-xs font-semibold uppercase tracking-[0.28em] ${
                  campaignImageUrl ? "text-zinc-300" : "text-zinc-500"
                }`}
              >
                Campaign
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

              {campaign.description?.trim() ? (
                <p
                  className={`mt-3 max-w-3xl text-sm leading-6 sm:text-base ${
                    campaignImageUrl ? "text-zinc-200" : "text-zinc-400"
                  }`}
                >
                  {campaign.description}
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-zinc-200 backdrop-blur-sm">
                  {systemLabel}
                </span>

                <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-zinc-200 backdrop-blur-sm">
                  {campaign.visibility === "public" ? "Public" : "Private"}
                </span>

                {campaign.archived ? (
                  <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-300 backdrop-blur-sm">
                    Archived
                  </span>
                ) : null}
              </div>
            </div>

            {canManageCampaign ? (
              <button
                type="button"
                onClick={onOpenSettings}
                aria-label={
                  isGm ? "Campaign settings" : "View campaign details"
                }
                title={isGm ? "Campaign settings" : "View campaign details"}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/25 text-sm text-zinc-300 backdrop-blur-sm transition hover:bg-black/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {isGm ? (
                  <i className="fa-solid fa-gear" />
                ) : (
                  <i className="fa-solid fa-circle-info" />
                )}
              </button>
            ) : null}
          </div>

          <div className="-mx-6 -mb-6 overflow-x-auto border-t border-white/10 bg-zinc-950/55 px-6 backdrop-blur-sm sm:-mx-8 sm:-mb-8 sm:px-8">
            <div className="flex min-w-max items-center">
              <NavLink
                to={`/campaigns/${campaign.id}`}
                end
                className={({ isActive }) =>
                  [
                    "mr-3 inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-black/20 text-zinc-300 hover:bg-white/[0.07] hover:text-white",
                  ].join(" ")
                }
              >
                <i className="fa-solid fa-house text-xs" />
                Overview
              </NavLink>

              <div className="mr-2 h-6 w-px shrink-0 bg-white/10" />

              <NavLink
                to={`/campaigns/${campaign.id}/handouts`}
                className={({ isActive }) =>
                  `${tabBaseClass} ${
                    isActive ? tabActiveClass : tabInactiveClass
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Handouts
                    <TabUnderline active={isActive} />
                  </>
                )}
              </NavLink>

              <NavLink
                to={`/campaigns/${campaign.id}/characters`}
                className={({ isActive }) =>
                  `${tabBaseClass} ${
                    isActive ? tabActiveClass : tabInactiveClass
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Characters
                    <TabUnderline active={isActive} />
                  </>
                )}
              </NavLink>

              <NavLink
                to={`/campaigns/${campaign.id}/journal`}
                className={({ isActive }) =>
                  `${tabBaseClass} ${
                    isActive ? tabActiveClass : tabInactiveClass
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    Journal
                    <TabUnderline active={isActive} />
                  </>
                )}
              </NavLink>

              {canManageCampaign ? (
                <NavLink
                  to={`/campaigns/${campaign.id}/maps`}
                  className={({ isActive }) =>
                    `${tabBaseClass} ${
                      isActive ? tabActiveClass : tabInactiveClass
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Maps
                      <TabUnderline active={isActive} />
                    </>
                  )}
                </NavLink>
              ) : null}

              {canManageCampaign ? (
                <NavLink
                  to={`/campaigns/${campaign.id}/members`}
                  className={({ isActive }) =>
                    `${tabBaseClass} ${
                      isActive ? tabActiveClass : tabInactiveClass
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Players
                      <TabUnderline active={isActive} />
                    </>
                  )}
                </NavLink>
              ) : null}

              {canManageCampaign ? (
                <>
                  <div className="mx-3 h-6 w-px shrink-0 bg-white/10" />

                  <div className="flex shrink-0 items-center gap-2 py-2">
                    <Link
                      to={`/campaigns/${campaign.id}/workspace`}
                      className={gmToolClass}
                    >
                      Workspace
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-zinc-500" />
                    </Link>

                    <Link
                      to={`/campaigns/${campaign.id}/encounter`}
                      className={gmToolClass}
                    >
                      Encounters
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-zinc-500" />
                    </Link>

                    <Link
                      to={`/campaigns/${campaign.id}/npcs`}
                      className={gmToolClass}
                    >
                      NPCs
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-zinc-500" />
                    </Link>

                    <Link
                      to={`/campaigns/${campaign.id}/monsters`}
                      className={gmToolClass}
                    >
                      Monsters
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-zinc-500" />
                    </Link>

                    <Link
                      to={`/campaigns/${campaign.id}/items`}
                      className={gmToolClass}
                    >
                      Items
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-zinc-500" />
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const TabUnderline = ({ active }: { active: boolean }) => (
  <span
    className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full ${
      active ? "bg-white" : "bg-transparent"
    }`}
  />
);

export default CampaignHeader;
