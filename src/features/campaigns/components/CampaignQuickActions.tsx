import { Link } from "react-router-dom";

type CampaignQuickActionsProps = {
  campaignId: string;
  isGm: boolean;
  onCreateHandout: () => void;
  onRewardItems: () => void;
  onCreateCustomItem: () => void;
};

const actionClass =
  "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-zinc-200 transition hover:bg-white/[0.08] hover:text-white";

const CampaignQuickActions = ({
  campaignId,
  isGm,
  onRewardItems,
  onCreateCustomItem,
}: CampaignQuickActionsProps) => {
  return (
    <section className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/35 px-3 py-2.5">
      <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {isGm ? "GM Tools" : "Quick Links"}
      </span>

      {isGm ? (
        <>
          <button type="button" onClick={onRewardItems} className={actionClass}>
            <i className="fa-solid fa-trophy text-[9px]" />
            Award items
          </button>

          <button
            type="button"
            onClick={onCreateCustomItem}
            className={actionClass}
          >
            <i className="fa-solid fa-plus text-[9px]" />
            Create item
          </button>
        </>
      ) : (
        <>
          <Link
            to={`/campaigns/${campaignId}/characters`}
            className={actionClass}
          >
            Character
          </Link>
          <Link to={`/campaigns/${campaignId}/journal`} className={actionClass}>
            Journal
          </Link>
          <Link to={`/campaigns/${campaignId}/maps`} className={actionClass}>
            Maps
          </Link>
          <Link
            to={`/campaigns/${campaignId}/handouts`}
            className={actionClass}
          >
            Handouts
          </Link>
        </>
      )}
    </section>
  );
};

export default CampaignQuickActions;
