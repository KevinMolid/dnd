import { useMemo, useState } from "react";
import { awardExperienceToMultipleCharacters } from "../rulesets/dnd/dnd2024/awardExperience";
import { db } from "../firebase";

type CharacterOption = {
  id: string;
  name: string;
  level: number;
};

type AwardXpResult = {
  characterId: string;
  oldLevel: number;
  newLevel: number;
  leveledUp?: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterOption[];
};

const AwardXpModal = ({ isOpen, onClose, characters }: Props) => {
  const [xp, setXp] = useState<number>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [splitEvenly, setSplitEvenly] = useState(true);
  const [manualAmounts, setManualAmounts] = useState<Record<string, number>>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AwardXpResult[]>([]);

  const selectedCharacterMap = useMemo(() => {
    return new Map(characters.map((char) => [char.id, char]));
  }, [characters]);

  const selectedCharacters = useMemo(
    () => characters.filter((char) => selected.includes(char.id)),
    [characters, selected],
  );

  const evenSplitAmount = useMemo(() => {
    if (!splitEvenly) return 0;
    if (selectedCharacters.length === 0) return 0;
    if (xp <= 0) return 0;
    return Math.floor(xp / selectedCharacters.length);
  }, [splitEvenly, xp, selectedCharacters.length]);

  const previewAmounts = useMemo(() => {
    const next: Record<string, number> = {};

    for (const char of selectedCharacters) {
      next[char.id] = splitEvenly
        ? evenSplitAmount
        : Math.max(0, Math.floor(manualAmounts[char.id] ?? 0));
    }

    return next;
  }, [selectedCharacters, splitEvenly, evenSplitAmount, manualAmounts]);

  const totalPreview = useMemo(() => {
    return Object.values(previewAmounts).reduce((sum, value) => sum + value, 0);
  }, [previewAmounts]);

  const hasAnyXpToAward = useMemo(() => {
    return selectedCharacters.some(
      (char) => (previewAmounts[char.id] ?? 0) > 0,
    );
  }, [selectedCharacters, previewAmounts]);

  if (!isOpen) return null;

  const toggleCharacter = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selected.length === characters.length) {
      setSelected([]);
      return;
    }

    setSelected(characters.map((char) => char.id));
  };

  const handleManualAmountChange = (id: string, value: string) => {
    setManualAmounts((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.floor(Number(value) || 0)),
    }));
  };

  const handleAwardXp = async () => {
    if (selectedCharacters.length === 0 || !hasAnyXpToAward) return;

    try {
      setLoading(true);
      setResults([]);

      const selectedIds = selectedCharacters.map((char) => char.id);

      if (splitEvenly) {
        if (evenSplitAmount <= 0) return;

        const res = await awardExperienceToMultipleCharacters(
          db,
          selectedIds,
          evenSplitAmount,
        );

        setResults(res as AwardXpResult[]);
      } else {
        const allResults: AwardXpResult[] = [];

        for (const char of selectedCharacters) {
          const amount = previewAmounts[char.id] ?? 0;
          if (amount <= 0) continue;

          const res = await awardExperienceToMultipleCharacters(
            db,
            [char.id],
            amount,
          );
          allResults.push(...(res as AwardXpResult[]));
        }

        setResults(allResults);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const leveledUp = results.filter((r) => r.leveledUp);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70">
      <div className="flex min-h-full items-start justify-center px-4 py-6 sm:items-center sm:py-8">
        <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-zinc-900 p-5 shadow-2xl sm:p-6">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Award XP</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Select the characters who should receive experience, then
                preview the amount before applying it.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={toggleAll}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {selected.length === characters.length
                  ? "Clear all"
                  : "Select all"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium text-zinc-400">
                {splitEvenly ? "Total XP" : "Distribution Mode"}
              </p>

              {splitEvenly ? (
                <div className="mt-3">
                  <input
                    type="number"
                    value={xp}
                    onChange={(e) =>
                      setXp(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="h-11 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none"
                    placeholder="0"
                  />
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-3 text-sm text-zinc-300">
                  Enter a separate amount for each selected character.
                </div>
              )}

              <label className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={splitEvenly}
                  onChange={(e) => setSplitEvenly(e.target.checked)}
                />
                Split evenly
              </label>

              <div className="mt-4 space-y-2 rounded-xl border border-white/10 bg-zinc-950/60 p-3 text-xs text-zinc-400">
                <div className="flex items-center justify-between gap-3">
                  <span>Selected</span>
                  <span className="text-zinc-200">
                    {selectedCharacters.length}
                  </span>
                </div>

                {splitEvenly && (
                  <div className="flex items-center justify-between gap-3">
                    <span>Each gets</span>
                    <span className="text-zinc-200">{evenSplitAmount} XP</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <span>Total preview</span>
                  <span className="text-zinc-200">{totalPreview} XP</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAwardXp}
                disabled={
                  loading || selectedCharacters.length === 0 || !hasAnyXpToAward
                }
                className="mt-4 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Awarding..." : "Apply XP"}
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">Characters</p>
                <p className="text-xs text-zinc-500">
                  Click cards to select recipients
                </p>
              </div>

              {characters.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No characters available.
                </p>
              ) : (
                <div className="grid max-h-[420px] gap-2 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3">
                  {characters.map((char) => {
                    const isSelected = selected.includes(char.id);
                    const preview = previewAmounts[char.id] ?? 0;

                    return (
                      <div
                        key={char.id}
                        className={`rounded-xl border p-3 transition ${
                          isSelected
                            ? "border-white/30 bg-white/15 text-white"
                            : "border-white/10 bg-zinc-950/50 text-zinc-200 hover:bg-white/10"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleCharacter(char.id)}
                          className="w-full text-left"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {char.name}
                              </p>
                              <p className="mt-1 text-xs text-zinc-500">
                                Level {char.level}
                              </p>
                            </div>

                            <div
                              className={`rounded-full border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${
                                isSelected
                                  ? "border-white/30 bg-white/10 text-white"
                                  : "border-white/10 bg-white/5 text-zinc-400"
                              }`}
                            >
                              {isSelected ? "Selected" : "Select"}
                            </div>
                          </div>
                        </button>

                        {isSelected && (
                          <div className="mt-3 border-t border-white/10 pt-3">
                            {splitEvenly ? (
                              <div className="rounded-lg border border-white/10 bg-zinc-950/60 px-3 py-2">
                                <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                                  Preview
                                </p>
                                <p className="mt-1 text-sm font-semibold text-white">
                                  {preview} XP
                                </p>
                              </div>
                            ) : (
                              <div>
                                <label className="mb-1 block text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                                  XP amount
                                </label>
                                <input
                                  type="number"
                                  value={manualAmounts[char.id] ?? 0}
                                  onChange={(e) =>
                                    handleManualAmountChange(
                                      char.id,
                                      e.target.value,
                                    )
                                  }
                                  className="h-9 w-full rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none"
                                  placeholder="0"
                                />
                                <p className="mt-2 text-xs text-zinc-500">
                                  Preview: {preview} XP
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {results.length > 0 && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">Results</p>

                {leveledUp.length > 0 && (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                    {leveledUp.length} leveled up
                  </span>
                )}
              </div>

              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {results.map((result) => {
                  const character = selectedCharacterMap.get(
                    result.characterId,
                  );

                  return (
                    <div
                      key={result.characterId}
                      className="rounded-xl border border-white/10 bg-zinc-950/60 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {character?.name ?? result.characterId}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            Level {result.oldLevel} → {result.newLevel}
                          </p>
                        </div>

                        {result.leveledUp && (
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-emerald-300">
                            Level up
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AwardXpModal;
