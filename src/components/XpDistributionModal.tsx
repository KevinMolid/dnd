import { useMemo, useState } from "react";
import { awardXp } from "../rulesets/dnd/dnd2024/xpProgression";

type Character = {
  id: string;
  name: string;
  xp?: number;
  level?: number;
};

type Props = {
  characters: Character[];
  isOpen: boolean;
  onClose: () => void;
  onApply: (updates: { id: string; xp: number }[]) => Promise<void>;
};

const XpDistributionModal = ({
  characters,
  isOpen,
  onClose,
  onApply,
}: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [xpAmount, setXpAmount] = useState(100);
  const [splitEvenly, setSplitEvenly] = useState(true);
  const [manualXp, setManualXp] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[]>([]);

  const selectedCharacters = useMemo(
    () => characters.filter((c) => selectedIds.includes(c.id)),
    [characters, selectedIds],
  );

  const distributed = useMemo(() => {
    if (selectedCharacters.length === 0) return [];

    if (splitEvenly) {
      const perChar = Math.floor(xpAmount / selectedCharacters.length);

      return selectedCharacters.map((c) => {
        const res = awardXp(c.xp ?? 0, perChar);
        return { ...c, awarded: perChar, result: res };
      });
    }

    return selectedCharacters.map((c) => {
      const amount = manualXp[c.id] ?? 0;
      const res = awardXp(c.xp ?? 0, amount);
      return { ...c, awarded: amount, result: res };
    });
  }, [selectedCharacters, xpAmount, splitEvenly, manualXp]);

  const toggleCharacter = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleApply = async () => {
    setLoading(true);

    try {
      const updates = distributed.map((c) => ({
        id: c.id,
        xp: c.result.newXp,
      }));

      await onApply(updates);

      const leveled = distributed
        .filter((c) => c.result.leveledUp)
        .map((c) => `${c.name} → Lv ${c.result.newLevel}`);

      setResult(leveled);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl rounded-2xl bg-zinc-900 p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white">Award XP</h2>

        {/* XP INPUT */}
        <div className="mt-4">
          <label className="text-sm text-zinc-400">Total XP</label>
          <input
            type="number"
            value={xpAmount}
            onChange={(e) => setXpAmount(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded bg-zinc-800 text-white"
          />
        </div>

        {/* SPLIT MODE */}
        <div className="mt-3 flex items-center gap-3">
          <input
            type="checkbox"
            checked={splitEvenly}
            onChange={() => setSplitEvenly(!splitEvenly)}
          />
          <span className="text-sm text-zinc-300">Split evenly</span>
        </div>

        {/* CHARACTER LIST */}
        <div className="mt-4 space-y-2 max-h-64 overflow-auto">
          {characters.map((c) => {
            const selected = selectedIds.includes(c.id);

            return (
              <div
                key={c.id}
                className={`p-3 rounded border ${
                  selected
                    ? "border-blue-400 bg-blue-500/10"
                    : "border-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => toggleCharacter(c.id)}
                    className="cursor-pointer"
                  >
                    <p className="text-white">{c.name}</p>
                    <p className="text-xs text-zinc-400">
                      Lv {c.level} • XP {c.xp}
                    </p>
                  </div>

                  {!splitEvenly && selected && (
                    <input
                      type="number"
                      value={manualXp[c.id] ?? 0}
                      onChange={(e) =>
                        setManualXp((prev) => ({
                          ...prev,
                          [c.id]: Number(e.target.value),
                        }))
                      }
                      className="w-20 p-1 rounded bg-zinc-800 text-white text-sm"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* PREVIEW */}
        <div className="mt-4">
          <h3 className="text-sm text-zinc-400 mb-2">Preview</h3>

          <div className="space-y-1 text-sm">
            {distributed.map((c) => (
              <div key={c.id} className="flex justify-between">
                <span className="text-zinc-300">{c.name}</span>

                <span
                  className={
                    c.result.leveledUp ? "text-amber-300" : "text-zinc-400"
                  }
                >
                  +{c.awarded} XP
                  {c.result.leveledUp && ` → Lv ${c.result.newLevel}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RESULT */}
        {result.length > 0 && (
          <div className="mt-4 text-amber-300 text-sm">
            🎉 Level ups: {result.join(", ")}
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-white/10 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-500 rounded text-white"
          >
            {loading ? "Applying..." : "Award XP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default XpDistributionModal;
