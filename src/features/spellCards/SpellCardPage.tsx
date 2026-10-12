import { useMemo } from "react";
import { SpellCard, type SpellCardData } from "./SpellCard";
import { SPELL_CARD_STORAGE_PREFIX } from "./spellCardTransfer";
import "./spell-card.css";

// Demo data. Replace with the spell loaded from your existing spell database.
export const sacredFlame: SpellCardData = {
  id: "sacred-flame",
  name: "Sacred Flame",
  level: 0,
  school: "Evocation",
  castingTime: "Action",
  range: "60 feet",
  components: "V, S",
  duration: "Instantaneous",
  description: "Flame-like radiance descends on a creature that you can see within range.",
  effects: "The target must succeed on a Dexterity saving throw or take 1d8 Radiant damage. The target gains no benefit from Half Cover or Three-Quarters Cover for this save.",
  savingThrow: "Dexterity",
};

export type SpellCardPageProps = {
  spell?: SpellCardData;
};

export default function SpellCardPage({ spell }: SpellCardPageProps) {
  const token = new URLSearchParams(window.location.search).get("card");
  const resolvedSpell = useMemo(() => {
    if (spell) return spell;
    if (!token) return sacredFlame;
    try {
      const stored = localStorage.getItem(`${SPELL_CARD_STORAGE_PREFIX}${token}`);
      return stored ? (JSON.parse(stored) as SpellCardData) : null;
    } catch {
      return null;
    }
  }, [spell, token]);

  if (!resolvedSpell) {
    return <main className="spell-print-page">Spell card data unavailable. Reopen the spell from Lorebound.</main>;
  }

  return (
    <main className="spell-print-page">
      <div className="spell-print-page__controls">
        <strong>Spell card · {resolvedSpell.name}</strong>
        <span>2.5 × 3.5 in / 63.5 × 88.9 mm</span>
        <button type="button" onClick={() => window.print()}>
          Print card
        </button>
      </div>
      <SpellCard spell={resolvedSpell} />
    </main>
  );
}
