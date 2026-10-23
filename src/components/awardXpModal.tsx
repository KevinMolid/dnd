import { useEffect, useMemo, useState } from "react";
import { awardExperienceToMultipleCharacters } from "../rulesets/dnd/dnd2024/awardExperience";
import { addLogEntry } from "../features/campaigns/utils/campaignLog";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

type CharacterOption = { id: string; name: string; level: number };
type Props = {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterOption[];
  campaignId?: string;
};
type DistributionMode = "total" | "each" | "manual";

const parseXp = (input: string) => Math.max(0, Math.floor(Number(input) || 0));

const AwardXpModal = ({ isOpen, onClose, characters, campaignId }: Props) => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<DistributionMode>("total");
  const [xpInput, setXpInput] = useState("0");
  const [manualInputs, setManualInputs] = useState<Record<string, string>>({});
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setSelected([]);
    setMode("total");
    setXpInput("0");
    setManualInputs({});
    setReason("");
    setLoading(false);
    setError("");
  }, [isOpen]);

  const selectedCharacters = useMemo(
    () => characters.filter((character) => selected.includes(character.id)),
    [characters, selected],
  );

  const awards = useMemo(() => {
    const recipients = selectedCharacters.length;
    const total = parseXp(xpInput);
    const values: Record<string, number> = {};
    selectedCharacters.forEach((character, index) => {
      values[character.id] =
        mode === "total"
          ? Math.floor(total / recipients) +
            (index < total % recipients ? 1 : 0)
          : mode === "each"
            ? total
            : parseXp(manualInputs[character.id] ?? "0");
    });
    return values;
  }, [selectedCharacters, mode, xpInput, manualInputs]);

  const totalAward = Object.values(awards).reduce(
    (sum, amount) => sum + amount,
    0,
  );
  const canAward = !loading && selectedCharacters.length > 0 && totalAward > 0;

  if (!isOpen) return null;

  const toggleCharacter = (id: string) => {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id],
    );
  };

  const handleAward = async () => {
    if (!canAward) return;
    setLoading(true);
    setError("");
    const cleanReason = reason.trim().slice(0, 100);

    try {
      // Apply the exact amount to each character. Log a single campaign event
      // only after every award has succeeded.
      const awarded = selectedCharacters
        .map((character) => ({
          character,
          amount: awards[character.id] ?? 0,
        }))
        .filter(({ amount }) => amount > 0);

      for (const { character, amount } of awarded) {
        await awardExperienceToMultipleCharacters(db, [character.id], amount);
      }

      if (campaignId && awarded.length > 0) {
        const amounts = awarded.map(({ amount }) => amount);
        const allSameAmount = amounts.every((amount) => amount === amounts[0]);
        const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
        const singleRecipient = awarded.length === 1 ? awarded[0] : null;

        await addLogEntry({
          campaignId,
          type: "xp_awarded",
          createdByUid: user?.uid ?? null,
          ...(singleRecipient
            ? {
                characterId: singleRecipient.character.id,
                characterName: singleRecipient.character.name,
              }
            : {}),
          payload: {
            recipientCount: awarded.length,
            totalAmount,
            mixedAmounts: !allSameAmount,
            ...(allSameAmount ? { amount: amounts[0] } : {}),
            ...(cleanReason ? { reason: cleanReason } : {}),
          },
        });
      }
      onClose();
    } catch (cause) {
      console.error("Failed to award XP:", cause);
      setError(
        "Could not finish all rewards. Some characters may already have received XP. Check the activity log before retrying.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 sm:p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="award-xp-title"
        className="flex max-h-[90dvh] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] px-4 py-3">
          <h2 id="award-xp-title" className="text-sm font-bold text-white">
            Award XP
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-zinc-300 hover:bg-white/10 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-semibold text-zinc-200">
              Characters{" "}
              <span className="ml-1 font-normal text-zinc-400">
                {selected.length}/{characters.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setSelected(
                  selected.length === characters.length
                    ? []
                    : characters.map((character) => character.id),
                )
              }
              className="text-[11px] font-medium text-zinc-300 hover:text-white"
            >
              {selected.length === characters.length && characters.length > 0
                ? "Clear all"
                : "Select all"}
            </button>
          </div>

          <div className="mb-5 flex flex-wrap gap-1.5">
            {characters.map((character) => {
              const checked = selected.includes(character.id);
              return (
                <button
                  key={character.id}
                  type="button"
                  onClick={() => toggleCharacter(character.id)}
                  aria-pressed={checked}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${checked ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-200" : "border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/10"}`}
                >
                  {checked ? "✓ " : ""}
                  {character.name}
                </button>
              );
            })}
            {characters.length === 0 && (
              <span className="text-xs text-zinc-400">
                No characters available.
              </span>
            )}
          </div>

          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-4">
            <label
              htmlFor="award-xp-amount"
              className="text-xs font-semibold text-zinc-200"
            >
              XP
            </label>
            <div
              role="group"
              aria-label="XP distribution"
              className="inline-flex rounded-lg border border-white/10 bg-zinc-900 p-0.5 text-[11px]"
            >
              {(
                [
                  ["total", "Total"],
                  ["each", "Per character"],
                  ["manual", "Manual"],
                ] as const
              ).map(([value, name]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  aria-pressed={mode === value}
                  className={`rounded-md px-2.5 py-1.5 transition ${mode === value ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {mode !== "manual" ? (
            <input
              id="award-xp-amount"
              type="number"
              min={0}
              step={1}
              value={xpInput}
              onChange={(event) => setXpInput(event.target.value)}
              className="h-9 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 text-sm font-semibold text-white outline-none focus:border-emerald-500/50"
            />
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {selectedCharacters.map((character) => (
                <label
                  key={character.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-zinc-900/60 px-2.5 py-1.5 text-xs text-zinc-200"
                >
                  <span className="truncate">{character.name}</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    aria-label={`${character.name} XP`}
                    value={manualInputs[character.id] ?? "0"}
                    onChange={(event) =>
                      setManualInputs((previous) => ({
                        ...previous,
                        [character.id]: event.target.value,
                      }))
                    }
                    className="w-24 rounded-md border border-white/10 bg-zinc-950 px-2 py-1.5 text-right text-xs text-white outline-none"
                  />
                </label>
              ))}
              {selectedCharacters.length === 0 && (
                <p className="text-xs text-zinc-400">
                  Select characters to enter XP.
                </p>
              )}
            </div>
          )}

          <p className="mt-2 text-[11px] text-zinc-400">
            {selectedCharacters.length} characters · {totalAward} XP total
            {mode === "total" && selectedCharacters.length > 0
              ? ` · ${Math.floor(totalAward / selectedCharacters.length)} XP each${totalAward % selectedCharacters.length ? ", remainder distributed" : ""}`
              : ""}
          </p>

          <label
            htmlFor="award-xp-reason"
            className="mt-5 block text-xs font-semibold text-zinc-200"
          >
            Reason <span className="font-normal text-zinc-400">· optional</span>
          </label>
          <input
            id="award-xp-reason"
            type="text"
            maxLength={100}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. for defeating the goblins"
            className="mt-2 h-9 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 text-xs text-white outline-none placeholder:text-zinc-500 focus:border-emerald-500/50"
          />

          {error && (
            <p role="alert" className="mt-3 text-xs text-red-300">
              {error}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.08] px-4 py-3">
          <span className="text-[11px] text-zinc-400">
            {selectedCharacters.length} characters · {totalAward} XP
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAward}
              disabled={!canAward}
              className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Awarding…" : "Award XP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardXpModal;
