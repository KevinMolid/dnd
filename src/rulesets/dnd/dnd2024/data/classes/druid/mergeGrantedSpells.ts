import type { SpellId } from "../../../types";
import type {
  DerivedGrantedCantrip,
  DerivedGrantedPreparedSpell,
} from "./getCircleOfTheLandGrantedSpells";

const cantripKey = (spell: { spellId: SpellId }) => spell.spellId;
const preparedKey = (spell: { spellId: SpellId }) => spell.spellId;

export const mergeGrantedCantrips = (
  base: DerivedGrantedCantrip[],
  extra: DerivedGrantedCantrip[],
): DerivedGrantedCantrip[] => {
  const byId = new Map<SpellId, DerivedGrantedCantrip>();

  for (const spell of base) {
    byId.set(cantripKey(spell), spell);
  }

  for (const spell of extra) {
    byId.set(cantripKey(spell), spell);
  }

  return Array.from(byId.values());
};

export const mergeGrantedPreparedSpells = (
  base: DerivedGrantedPreparedSpell[],
  extra: DerivedGrantedPreparedSpell[],
): DerivedGrantedPreparedSpell[] => {
  const byId = new Map<SpellId, DerivedGrantedPreparedSpell>();

  for (const spell of base) {
    byId.set(preparedKey(spell), spell);
  }

  for (const spell of extra) {
    byId.set(preparedKey(spell), spell);
  }

  return Array.from(byId.values()).sort(
    (a, b) => a.spellLevel - b.spellLevel || a.spellId.localeCompare(b.spellId),
  );
};