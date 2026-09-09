export function MapWorkspaceModule() {
  return (
    <div className="flex h-full items-center justify-center bg-black/20">
      <div className="text-center">
        <i className="fa-solid fa-map text-4xl text-emerald-400/40" />

        <p className="mt-3 text-sm font-medium text-zinc-300">Map module</p>

        <p className="mt-1 text-xs text-zinc-500">
          Map integration comes later.
        </p>
      </div>
    </div>
  );
}

export function EncounterWorkspaceModule() {
  return (
    <div className="space-y-2 p-4">
      <p className="text-xs uppercase tracking-wider text-zinc-500">
        Encounter module
      </p>

      {[
        ["Duplolas", "21"],
        ["Guard Captain", "17"],
        ["Margot", "14"],
        ["Guard", "11"],
      ].map(([name, initiative]) => (
        <div
          key={name}
          className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 px-3 py-2"
        >
          <span className="text-sm text-zinc-200">{name}</span>

          <span className="text-sm font-semibold text-white">{initiative}</span>
        </div>
      ))}
    </div>
  );
}

export function NotesWorkspaceModule() {
  return (
    <div className="h-full p-4">
      <textarea
        placeholder="Quick notes during the session..."
        className="workspace-no-drag h-full min-h-[100px] w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-emerald-500/40"
      />
    </div>
  );
}
