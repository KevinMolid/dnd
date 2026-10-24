import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import useMonsterLibrary from "../../../hooks/useMonsterLibrary";
import MonsterStatBlock from "../../../components/monsters/MonsterStatBlock";

type Props = {
  characterId: string;
  campaignId?: string | null;
  level: number;
  knownFormKeys?: string[];
  /** Only render for a character who has Wild Shape. */
};

type MonsterForm = ReturnType<typeof useMonsterLibrary>["allMonsters"][number];

const maxCr = (level: number) => (level >= 8 ? 1 : level >= 4 ? 0.5 : 0.25);
const formLimit = (level: number) => (level >= 8 ? 8 : level >= 4 ? 6 : 4);
const crNumber = (raw: unknown): number => {
  if (typeof raw === "number") return raw;
  const value = String(raw ?? "").trim();
  if (/^\d+\/\d+$/.test(value)) {
    const [a, b] = value.split("/").map(Number);
    return b ? a / b : Infinity;
  }
  return value ? Number(value) : Infinity;
};
const isBeast = (monster: MonsterForm) => {
  const value = monster as MonsterForm & Record<string, unknown>;
  const raw = value.creatureType ?? value.type ?? value.monsterType;
  return (
    String(raw ?? "")
      .trim()
      .toLowerCase() === "beast"
  );
};
const hasFlySpeed = (monster: MonsterForm) => {
  const value = monster as MonsterForm & Record<string, unknown>;
  const speed = value.speed ?? value.speeds;
  if (typeof speed === "string") return /\bfly\b\s*[: ]\s*\d+/i.test(speed);
  if (speed && typeof speed === "object") {
    const fly = (speed as Record<string, unknown>).fly;
    return typeof fly === "number" ? fly > 0 : /\d+/.test(String(fly ?? ""));
  }
  return false;
};

export default function WildShapePicker({
  characterId,
  campaignId,
  level,
  knownFormKeys = [],
}: Props) {
  const { allMonsters, loading } = useMonsterLibrary(campaignId ?? undefined);
  const [keys, setKeys] = useState<string[]>(knownFormKeys);
  const [editing, setEditing] = useState(false);
  const [viewKey, setViewKey] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    () => setKeys(knownFormKeys),
    [characterId, JSON.stringify(knownFormKeys)],
  );
  const byKey = useMemo(
    () =>
      new Map(
        allMonsters.map((monster) => [
          `${monster.source}:${monster.id}`,
          monster,
        ]),
      ),
    [allMonsters],
  );
  const eligible = useMemo(
    () =>
      allMonsters
        .filter(
          (monster) =>
            isBeast(monster) &&
            crNumber(monster.challengeRating) <= maxCr(level) &&
            (level >= 8 || !hasFlySpeed(monster)),
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [allMonsters, level],
  );
  const shown = eligible.filter((monster) =>
    monster.name.toLowerCase().includes(search.toLowerCase()),
  );
  const selectedMonster = viewKey ? byKey.get(viewKey) : null;
  const max = formLimit(level);
  const persist = async (next: string[]) => {
    setSaving(true);
    setError("");
    try {
      await updateDoc(doc(db, "characters", characterId), {
        wildShapeFormKeys: next,
      });
      setKeys(next);
    } catch (cause) {
      console.error("Failed to save Wild Shape forms:", cause);
      setError("Could not save forms. Check permissions and try again.");
    } finally {
      setSaving(false);
    }
  };
  const toggle = async (key: string) => {
    if (saving) return;
    const next = keys.includes(key)
      ? keys.filter((entry) => entry !== key)
      : keys.length < max
        ? [...keys, key]
        : keys;
    if (next !== keys) await persist(next);
  };
  return (
    <>
      <section className="mt-2 rounded-xl border border-emerald-400/15 bg-emerald-500/[0.035] p-3 text-zinc-100">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold">
              Wild Shape{" "}
              <span className="ml-1 text-[10px] font-normal text-zinc-400">
                BONUS ACTION
              </span>
            </div>
            <div className="mt-0.5 text-[10px] text-zinc-400">
              Known forms: {keys.length}/{max}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-200 hover:bg-white/10"
          >
            Edit forms
          </button>
        </div>
        {keys.length ? (
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {keys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setViewKey(key)}
                className="truncate rounded-md border border-white/10 bg-zinc-900 px-2 py-2 text-left text-xs hover:border-emerald-500/40 hover:bg-zinc-800"
              >
                {byKey.get(key)?.name ?? "Unavailable form"}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-zinc-400">
            Choose Beast forms to view their stat blocks.
          </p>
        )}
      </section>
      {editing &&
        createPortal(
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-3"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setEditing(false);
            }}
          >
            <div
              className="flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Choose Wild Shape forms"
            >
              <div className="flex items-center justify-between border-b border-white/10 p-3">
                <div className="text-sm font-semibold">
                  Wild Shape forms{" "}
                  <span className="text-xs text-zinc-400">
                    {keys.length}/{max}
                  </span>
                </div>
                <button
                  onClick={() => setEditing(false)}
                  className="text-xs text-zinc-300"
                >
                  Close
                </button>
              </div>
              <div className="p-3">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search beasts..."
                  className="w-full rounded-lg border border-white/10 bg-zinc-900 p-2 text-sm outline-none"
                />
                <div className="mt-1 text-[11px] text-zinc-400">
                  CR ≤ {maxCr(level)} ·{" "}
                  {level < 8 ? "No Fly Speed" : "Flight allowed"}
                </div>
                {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
              </div>
              <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-3">
                {loading ? (
                  <p className="text-xs text-zinc-400">Loading beasts...</p>
                ) : shown.length === 0 ? (
                  <p className="text-xs text-zinc-400">
                    No matching Beast stat blocks. Verify your monster library
                    has creature types and speed data.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {shown.map((monster) => {
                      const key = `${monster.source}:${monster.id}`;
                      const checked = keys.includes(key);
                      return (
                        <button
                          key={key}
                          disabled={saving || (!checked && keys.length >= max)}
                          onClick={() => void toggle(key)}
                          className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs disabled:opacity-50 ${checked ? "border-emerald-500/40 bg-emerald-500/10" : "border-white/10 bg-zinc-900 hover:bg-zinc-800"}`}
                        >
                          <span>
                            {checked ? "✓ " : ""}
                            {monster.name}
                          </span>
                          <span className="text-zinc-400">
                            CR {monster.challengeRating}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
      {viewKey &&
        createPortal(
          <div
            className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/80 p-3"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setViewKey(null);
            }}
          >
            <div
              className="flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 text-zinc-100"
              role="dialog"
              aria-modal="true"
              aria-label="Wild Shape stat block"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-3">
                <strong className="text-sm">
                  {selectedMonster?.name ?? "Unknown Beast"}
                </strong>
                <button
                  onClick={() => setViewKey(null)}
                  className="text-xs text-zinc-300"
                >
                  Close
                </button>
              </div>
              <div className="workspace-scrollbar min-h-0 overflow-y-auto p-3">
                {selectedMonster ? (
                  <MonsterStatBlock monster={selectedMonster} compact />
                ) : (
                  <p className="text-sm text-zinc-400">
                    This form is not in the current monster library.
                  </p>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
