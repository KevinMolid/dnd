import { useEffect, useState, type FormEvent } from "react";
import type { AbilityKey } from "../../../rulesets/dnd/dnd2024/types";
import type { CustomSpellcasting } from "../../../types/customCharacter";

type Props = {
  open: boolean;
  value: CustomSpellcasting;
  abilityScores: Record<AbilityKey, number>;
  proficiencyBonus: number;
  onClose: () => void;
  onSave: (settings: CustomSpellcasting) => Promise<void>;
};
const abilities: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];

export default function CustomSpellcastingEditorModal({ open, value, abilityScores, proficiencyBonus, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<CustomSpellcasting>(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (open) {
      setDraft({ ...value, spellSlots: { ...value.spellSlots }, spells: [...(value.spells ?? [])] });
      setError("");
    }
  }, [open, value]);
  if (!open) return null;

  const mod = draft.ability ? Math.floor(((abilityScores[draft.ability] ?? 10) - 10) / 2) : null;
  const changeSlots = (level: number, input: number) => {
    const key = String(level);
    const max = Math.max(0, Math.min(99, Math.floor(Number.isFinite(input) ? input : 0)));
    setDraft((current) => ({ ...current, spellSlots: {
      ...current.spellSlots,
      [key]: { max, remaining: Math.min(max, current.spellSlots?.[key]?.remaining ?? max) },
    } }));
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try { await onSave(draft); onClose(); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to save spellcasting."); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby="spellcasting-heading" className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-2xl" style={{ maxHeight: "90dvh" }}>
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 id="spellcasting-heading" className="text-sm font-bold">Edit Spellcasting</h2>
          <button type="button" aria-label="Close" disabled={saving} onClick={onClose} className="rounded-md p-2 text-zinc-400 hover:text-white"><i className="fa-solid fa-xmark" /></button>
        </div>
        <form onSubmit={(event) => void submit(event)} className="flex min-h-0 flex-col">
          <div className="workspace-scrollbar min-h-0 space-y-4 overflow-y-auto p-4">
            <label className="flex items-center gap-3 text-sm font-medium">
              <input type="checkbox" checked={draft.enabled} onChange={(event) => setDraft((current) => ({ ...current, enabled: event.target.checked }))} />
              This character uses spells
            </label>
            {draft.enabled ? <>
              <label className="block text-xs font-semibold text-zinc-300">Spellcasting Ability
                <select value={draft.ability ?? ""} onChange={(event) => setDraft((current) => ({ ...current, ability: (event.target.value || null) as AbilityKey | null }))} className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white">
                  <option value="">None</option>
                  {abilities.map((ability) => <option key={ability} value={ability}>{ability.toUpperCase()}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/[0.04] p-3"><p className="text-[10px] uppercase text-zinc-500">Save DC</p><p className="mt-1 text-lg font-bold">{mod === null ? "—" : 8 + proficiencyBonus + mod}</p></div>
                <div className="rounded-lg bg-white/[0.04] p-3"><p className="text-[10px] uppercase text-zinc-500">Spell Attack</p><p className="mt-1 text-lg font-bold">{mod === null ? "—" : `${proficiencyBonus + mod >= 0 ? "+" : ""}${proficiencyBonus + mod}`}</p></div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-300">Maximum Spell Slots</h3>
                <p className="mt-1 text-xs text-zinc-500">Slot usage is preserved where possible. A Long Rest restores remaining slots.</p>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {Array.from({ length: 9 }, (_, i) => i + 1).map((level) => (
                    <label key={level} className="text-center text-[11px] text-zinc-400">Level {level}
                      <input type="number" min={0} max={99} value={draft.spellSlots?.[String(level)]?.max ?? 0} onChange={(event) => changeSlots(level, Number(event.target.value))} className="mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 px-2 py-2 text-center text-sm text-white" />
                    </label>
                  ))}
                </div>
              </div>
            </> : <p className="text-xs text-zinc-500">Existing spells and slot settings are retained if spellcasting is disabled.</p>}
            {error ? <p role="alert" className="text-xs text-rose-300">{error}</p> : null}
          </div>
          <div className="flex shrink-0 justify-end gap-2 border-t border-white/10 p-3">
            <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg border border-emerald-600/40 bg-emerald-700/30 px-3 py-2 text-xs font-semibold text-emerald-200 disabled:opacity-50">{saving ? "Saving…" : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
