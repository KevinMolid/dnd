import { useState } from "react";
import { awardExperienceToMultipleCharacters } from "../rulesets/dnd/dnd2024/awardExperience";
import { db } from "../firebase";

type CharacterOption = {
  id: string;
  name: string;
  level: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterOption[];
};

const AwardXpModal = ({ isOpen, onClose, characters }: Props) => {
  const [xp, setXp] = useState<number>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  if (!isOpen) return null;

  const toggleCharacter = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleAwardXp = async () => {
    if (!xp || selected.length === 0) return;

    try {
      setLoading(true);
      setResults([]);

      const res = await awardExperienceToMultipleCharacters(
        db,
        selected,
        xp,
      );

      setResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const leveledUp = results.filter((r) => r.leveledUp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-4">
          Award Experience
        </h2>

        {/* XP INPUT */}
        <div className="mb-4">
          <label className="text-sm text-zinc-400">XP Amount</label>
          <input
            type="number"
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            className="mt-1 w-full rounded-xl bg-zinc-800 px-3 py-2 text-white outline-none border border-white/10"
            placeholder="e.g. 300"
          />
        </div>

        {/* CHARACTER LIST */}
        <div className="mb-4 max-h-48 overflow-y-auto space-y-2">
          {characters.map((char) => (
            <div
              key={char.id}
              onClick={() => toggleCharacter(char.id)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer border ${
                selected.includes(char.id)
                  ? "bg-white text-black border-white"
                  : "bg-zinc-800 text-white border-white/10"
              }`}
            >
              <span>{char.name}</span>
              <span className="text-xs opacity-70">Lvl {char.level}</span>
            </div>
          ))}
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={handleAwardXp}
          disabled={loading}
          className="w-full rounded-xl bg-white text-black py-2 font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {loading ? "Awarding..." : "Award XP"}
        </button>

        {/* RESULTS */}
        {results.length > 0 && (
          <div className="mt-4 rounded-xl border border-white/10 bg-zinc-800 p-3 text-sm text-zinc-300">
            <p className="mb-2 font-medium text-white">Results:</p>

            {results.map((r) => (
              <div key={r.characterId} className="flex justify-between">
                <span>{r.characterId}</span>
                <span>
                  {r.oldLevel} → {r.newLevel}
                </span>
              </div>
            ))}

            {leveledUp.length > 0 && (
              <p className="mt-2 text-emerald-400">
                🎉 {leveledUp.length} character(s) leveled up!
              </p>
            )}
          </div>
        )}

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-zinc-400 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AwardXpModal;