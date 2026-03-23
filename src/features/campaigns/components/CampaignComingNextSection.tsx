const CampaignComingNextSection = () => {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl sm:p-6">
      <h2 className="text-xl font-semibold text-white">Coming next</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Good next modules for this campaign page.
      </p>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
          <p className="text-sm font-medium text-white">Recent activity</p>
          <p className="mt-1 text-sm text-zinc-400">
            Show latest notes, reveals, updates, and session logs.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
          <p className="text-sm font-medium text-white">Party summary</p>
          <p className="mt-1 text-sm text-zinc-400">
            Show average level, assigned players, and session readiness.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
          <p className="text-sm font-medium text-white">GM campaign tools</p>
          <p className="mt-1 text-sm text-zinc-400">
            Award XP, review notes, and manage campaign progression.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CampaignComingNextSection;
