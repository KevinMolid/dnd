import { useMemo, useState } from "react";

type DefensesControlProps = {
  defenses: string[];
  lockedDefenses?: string[];
  onChange?: (defenses: string[]) => void | Promise<void>;
};

const normalize = (value: string) => value.trim().toLowerCase();

const DefensesControl = ({
  defenses,
  lockedDefenses = [],
  onChange,
}: DefensesControlProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const lockedKeys = useMemo(
    () => new Set(lockedDefenses.map(normalize)),
    [lockedDefenses],
  );

  const editableDefenses = defenses.filter(
    (defense) => !lockedKeys.has(normalize(defense)),
  );

  const addDefense = async () => {
    const value = draft.trim();

    if (!value || !onChange || saving) {
      return;
    }

    const alreadyExists = defenses.some(
      (defense) => normalize(defense) === normalize(value),
    );

    if (alreadyExists) {
      setDraft("");
      return;
    }

    setSaving(true);

    try {
      await onChange([...editableDefenses, value]);
      setDraft("");
    } finally {
      setSaving(false);
    }
  };

  const removeDefense = async (defense: string) => {
    if (!onChange || saving) {
      return;
    }

    const next = editableDefenses.filter(
      (value) => normalize(value) !== normalize(defense),
    );

    setSaving(true);

    try {
      await onChange(next);
    } finally {
      setSaving(false);
    }
  };

  const clearEditableDefenses = async () => {
    if (!onChange || saving || editableDefenses.length === 0) {
      return;
    }

    setSaving(true);

    try {
      await onChange([]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mt-2 grid grid-cols-[70px_minmax(0,1fr)_auto] items-center gap-2 border-t border-white/[0.06] pt-2">
        <span className="text-[7px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
          Defenses
        </span>

        <div className="min-w-0">
          {defenses.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {defenses.map((defense) => (
                <span
                  key={defense}
                  className="inline-flex rounded-md border border-orange-500/20 bg-orange-500/[0.09] px-1.5 py-0.5 text-[8px] font-medium text-orange-300"
                >
                  {defense}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[8px] text-zinc-700">—</span>
          )}
        </div>

        <button
          type="button"
          disabled={!onChange}
          onClick={() => setOpen(true)}
          className={`rounded-md border px-1.5 py-0.5 text-[7px] font-semibold transition ${
            onChange
              ? "border-white/[0.08] bg-white/[0.03] text-zinc-500 hover:border-white/15 hover:bg-white/[0.07] hover:text-zinc-200"
              : "cursor-default border-transparent text-zinc-700"
          }`}
        >
          Edit
        </button>
      </div>

      {open ? (
        <div className="fixed bottom-4 right-4 z-[145] w-[360px] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-3 py-2.5">
            <div>
              <p className="text-[10px] font-semibold text-white">
                Character Defenses
              </p>

              <p className="mt-0.5 text-[8px] text-zinc-600">
                Add resistances, immunities, vulnerabilities, or other defenses.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close defense editor"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-sm text-zinc-500 transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-3">
            {lockedDefenses.length > 0 ? (
              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                  Rules-derived
                </p>

                <div className="mt-2 space-y-1.5">
                  {lockedDefenses.map((defense) => (
                    <div
                      key={defense}
                      className="flex items-center justify-between gap-3 rounded-lg border border-orange-500/10 bg-orange-500/[0.04] px-2.5 py-2"
                    >
                      <span className="text-[9px] text-orange-200">
                        {defense}
                      </span>

                      <span className="text-[7px] uppercase tracking-[0.08em] text-zinc-600">
                        Automatic
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className={lockedDefenses.length > 0 ? "mt-4" : ""}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
                  Manual Defenses
                </p>

                <button
                  type="button"
                  disabled={
                    !onChange || saving || editableDefenses.length === 0
                  }
                  onClick={() => void clearEditableDefenses()}
                  className="text-[8px] font-medium text-rose-300/70 transition hover:text-rose-300 disabled:cursor-default disabled:opacity-30"
                >
                  Clear all
                </button>
              </div>

              {editableDefenses.length > 0 ? (
                <div className="mt-2 space-y-1.5">
                  {editableDefenses.map((defense) => (
                    <div
                      key={defense}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-black/20 px-2.5 py-2"
                    >
                      <span className="text-[9px] text-zinc-200">
                        {defense}
                      </span>

                      <button
                        type="button"
                        disabled={!onChange || saving}
                        onClick={() => void removeDefense(defense)}
                        className="text-[8px] font-medium text-zinc-600 transition hover:text-rose-300 disabled:cursor-default disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-[8px] text-zinc-600">
                  No manual defenses added.
                </p>
              )}
            </div>

            <div className="mt-4 border-t border-white/[0.06] pt-3">
              <label
                htmlFor="new-defense"
                className="text-[8px] font-semibold uppercase tracking-[0.1em] text-zinc-500"
              >
                Add Defense
              </label>

              <div className="mt-2 flex gap-2">
                <input
                  id="new-defense"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void addDefense();
                    }
                  }}
                  placeholder="e.g. Fire Resistance"
                  disabled={!onChange || saving}
                  className="min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-black/25 px-2.5 py-2 text-[9px] text-white outline-none placeholder:text-zinc-700 focus:border-white/20 disabled:opacity-50"
                />

                <button
                  type="button"
                  disabled={!onChange || saving || !draft.trim()}
                  onClick={() => void addDefense()}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 text-[8px] font-semibold text-zinc-300 transition hover:bg-white/[0.09] hover:text-white disabled:cursor-default disabled:opacity-30"
                >
                  Add
                </button>
              </div>

              <p className="mt-2 text-[7px] leading-4 text-zinc-600">
                Examples: Fire Resistance, Poison Immunity, Psychic Resistance,
                Advantage vs. Magic.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default DefensesControl;
