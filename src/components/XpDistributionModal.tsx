import { FormEvent, useEffect, useMemo, useState } from "react";

type CharacterForXp = {
  id: string;
  name: string;
  xp?: number;
};

type Props = {
  characters: CharacterForXp[];
  isOpen: boolean;
  onClose: () => void;
  onApply: (updates: { id: string; xp: number }[]) => Promise<void> | void;
};

const XpDistributionModal = ({
  characters,
  isOpen,
  onClose,
  onApply,
}: Props) => {
  const [splitEvenly, setSplitEvenly] = useState(true);
  const [totalXp, setTotalXp] = useState(0);
  const [manualAwards, setManualAwards] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setSplitEvenly(true);
    setTotalXp(0);

    const initialManualAwards: Record<string, number> = {};
    characters.forEach((character) => {
      initialManualAwards[character.id] = 0;
    });

    setManualAwards(initialManualAwards);
    setIsSubmitting(false);
  }, [isOpen, characters]);

  const characterCount = characters.length;

  const splitPreview = useMemo(() => {
    if (characterCount <= 0) return [];

    const safeTotalXp = Math.max(0, totalXp);
    const baseShare = Math.floor(safeTotalXp / characterCount);
    const remainder = safeTotalXp % characterCount;

    return characters.map((character, index) => {
      const bonus = index < remainder ? 1 : 0;
      const award = baseShare + bonus;

      return {
        id: character.id,
        name: character.name,
        currentXp: character.xp ?? 0,
        award,
        nextXp: (character.xp ?? 0) + award,
      };
    });
  }, [characters, totalXp, characterCount]);

  const manualPreview = useMemo(() => {
    return characters.map((character) => {
      const award = Math.max(0, manualAwards[character.id] ?? 0);

      return {
        id: character.id,
        name: character.name,
        currentXp: character.xp ?? 0,
        award,
        nextXp: (character.xp ?? 0) + award,
      };
    });
  }, [characters, manualAwards]);

  const totalManualAwarded = useMemo(() => {
    return manualPreview.reduce((sum, character) => sum + character.award, 0);
  }, [manualPreview]);

  const handleManualChange = (id: string, value: string) => {
    const parsed = Number(value);

    setManualAwards((prev) => ({
      ...prev,
      [id]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (characters.length === 0 || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const updates = splitEvenly
        ? splitPreview.map((character) => ({
            id: character.id,
            xp: character.nextXp,
          }))
        : manualPreview.map((character) => ({
            id: character.id,
            xp: character.nextXp,
          }));

      await onApply(updates);
      onClose();
    } catch (error) {
      console.error("Failed to apply XP distribution:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Award XP</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Distribute experience points to the party.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={splitEvenly}
                  onChange={(e) => setSplitEvenly(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-zinc-900"
                />
                <span className="text-sm font-medium text-white">
                  Split evenly across all party members
                </span>
              </label>

              <p className="mt-2 text-xs text-zinc-500">
                {splitEvenly
                  ? "Enter the total XP amount. It will be divided automatically."
                  : "Enter a manual XP amount for each character below."}
              </p>
            </div>

            {splitEvenly ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <label className="block text-sm font-medium text-white">
                  Total XP to distribute
                </label>

                <input
                  type="number"
                  min={0}
                  value={totalXp}
                  onChange={(e) =>
                    setTotalXp(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="mt-3 h-11 w-full rounded-xl border border-white/10 bg-zinc-900 px-4 text-sm text-white outline-none transition focus:border-white/20"
                  placeholder="0"
                />

                <p className="mt-2 text-xs text-zinc-500">
                  {characterCount > 0
                    ? `${characterCount} character${characterCount === 1 ? "" : "s"} in party`
                    : "No characters in party"}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">
                    Manual XP awards
                  </p>
                  <p className="text-xs text-zinc-400">
                    Total awarded: {totalManualAwarded} XP
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {characters.map((character) => (
                    <div
                      key={character.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900/70 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {character.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          Current XP: {character.xp ?? 0}
                        </p>
                      </div>

                      <input
                        type="number"
                        min={0}
                        value={manualAwards[character.id] ?? 0}
                        onChange={(e) =>
                          handleManualChange(character.id, e.target.value)
                        }
                        className="h-10 w-28 rounded-lg border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">Preview</h3>
                {splitEvenly && (
                  <p className="text-xs text-zinc-400">
                    Total distributed:{" "}
                    {splitPreview.reduce((sum, c) => sum + c.award, 0)} XP
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {(splitEvenly ? splitPreview : manualPreview).map(
                  (character) => (
                    <div
                      key={character.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2"
                    >
                      <p className="text-sm text-white">{character.name}</p>

                      <div className="text-right text-xs">
                        <p className="text-zinc-300">+{character.award} XP</p>
                        <p className="text-zinc-500">
                          {character.currentXp} → {character.nextXp}
                        </p>
                      </div>
                    </div>
                  ),
                )}

                {characters.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 bg-zinc-900/50 p-4 text-center text-sm text-zinc-500">
                    No characters available.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={characters.length === 0 || isSubmitting}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Applying..." : "Award XP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default XpDistributionModal;
