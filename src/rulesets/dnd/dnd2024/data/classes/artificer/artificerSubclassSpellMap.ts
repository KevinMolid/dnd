import type { SpellId } from "../../../types";
import type { ArtificerSubclassId } from "./getArtificerSubclassChoice";
export type ArtificerGrantedSpell = { spellId: SpellId; minArtificerLevel: 3 | 5 | 9 | 13 | 17; spellLevel: 1 | 2 | 3 | 4 | 5 };
// Populate these from the licensed 2025 subclass spell lists before enabling always-prepared spells.
export const artificerSubclassSpellMap: Record<ArtificerSubclassId, ArtificerGrantedSpell[]> = {
 alchemist:[], armorer:[], artillerist:[], "battle-smith":[], cartographer:[],
};
