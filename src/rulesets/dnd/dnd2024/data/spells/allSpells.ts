import type { Spell } from "../../types";
import { wizardSpells } from "./wizardSpells";
import { clericSpells } from "./clericSpells";
import { druidSpells } from "./druidSpells";
import { paladinSpells } from "./paladinSpells";

const mergeSpellLists = (...lists: Spell[][]): Spell[] => {
  const byId = new Map<string, Spell>();

  for (const list of lists) {
    for (const spell of list) {
      const existing = byId.get(spell.id);

      if (!existing) {
        byId.set(spell.id, {
          ...spell,
          classes: [...spell.classes],
        });
        continue;
      }

      byId.set(spell.id, {
        ...existing,
        ...spell,
        classes: Array.from(
          new Set([...existing.classes, ...spell.classes]),
        ),
        ritual: existing.ritual || spell.ritual || false,
        concentration:
          existing.concentration || spell.concentration || false,
      });
    }
  }

  return Array.from(byId.values()).sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return a.name.localeCompare(b.name);
  });
};

export {
  wizardSpells,
  clericSpells,
  druidSpells,
  paladinSpells,
};

export const allSpells: Spell[] = mergeSpellLists(
  wizardSpells,
  clericSpells,
  druidSpells,
  paladinSpells,
);