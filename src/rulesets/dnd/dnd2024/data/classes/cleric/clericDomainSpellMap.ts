import type { CharacterSubclassId, SpellId } from "../../../types";

export type ClericDomainGrantedSpell = {
  spellId: SpellId;
  minClericLevel: 3 | 5 | 7 | 9;
  spellLevel: 1 | 2 | 3 | 4 | 5;
};

export type ClericDomainSpellMap = Record<
  Extract<
    CharacterSubclassId,
    "life-domain" | "light-domain" | "trickery-domain" | "war-domain"
  >,
  ClericDomainGrantedSpell[]
>;

export const clericDomainSpellMap: ClericDomainSpellMap = {
  "life-domain": [
    { spellId: "aid", minClericLevel: 3, spellLevel: 2 },
    { spellId: "bless", minClericLevel: 3, spellLevel: 1 },
    { spellId: "cure-wounds", minClericLevel: 3, spellLevel: 1 },
    { spellId: "lesser-restoration", minClericLevel: 3, spellLevel: 2 },

    { spellId: "mass-healing-word", minClericLevel: 5, spellLevel: 3 },
    { spellId: "revivify", minClericLevel: 5, spellLevel: 3 },

    { spellId: "aura-of-life", minClericLevel: 7, spellLevel: 4 },
    { spellId: "death-ward", minClericLevel: 7, spellLevel: 4 },

    { spellId: "greater-restoration", minClericLevel: 9, spellLevel: 5 },
    { spellId: "mass-cure-wounds", minClericLevel: 9, spellLevel: 5 },
  ],

  "light-domain": [
    { spellId: "burning-hands", minClericLevel: 3, spellLevel: 1 },
    { spellId: "faerie-fire", minClericLevel: 3, spellLevel: 1 },
    { spellId: "scorching-ray", minClericLevel: 3, spellLevel: 2 },
    { spellId: "see-invisibility", minClericLevel: 3, spellLevel: 2 },

    { spellId: "daylight", minClericLevel: 5, spellLevel: 3 },
    { spellId: "fireball", minClericLevel: 5, spellLevel: 3 },

    { spellId: "arcane-eye", minClericLevel: 7, spellLevel: 4 },
    { spellId: "wall-of-fire", minClericLevel: 7, spellLevel: 4 },

    { spellId: "flame-strike", minClericLevel: 9, spellLevel: 5 },
    { spellId: "scrying", minClericLevel: 9, spellLevel: 5 },
  ],

  "trickery-domain": [
    { spellId: "charm-person", minClericLevel: 3, spellLevel: 1 },
    { spellId: "disguise-self", minClericLevel: 3, spellLevel: 1 },
    { spellId: "invisibility", minClericLevel: 3, spellLevel: 2 },
    { spellId: "pass-without-trace", minClericLevel: 3, spellLevel: 2 },

    { spellId: "hypnotic-pattern", minClericLevel: 5, spellLevel: 3 },
    { spellId: "nondetection", minClericLevel: 5, spellLevel: 3 },

    { spellId: "confusion", minClericLevel: 7, spellLevel: 4 },
    { spellId: "dimension-door", minClericLevel: 7, spellLevel: 4 },

    { spellId: "dominate-person", minClericLevel: 9, spellLevel: 5 },
    { spellId: "modify-memory", minClericLevel: 9, spellLevel: 5 },
  ],

  "war-domain": [
    { spellId: "guiding-bolt", minClericLevel: 3, spellLevel: 1 },
    { spellId: "magic-weapon", minClericLevel: 3, spellLevel: 2 },
    { spellId: "shield-of-faith", minClericLevel: 3, spellLevel: 1 },
    { spellId: "spiritual-weapon", minClericLevel: 3, spellLevel: 2 },

    { spellId: "crusaders-mantle", minClericLevel: 5, spellLevel: 3 },
    { spellId: "spirit-guardians", minClericLevel: 5, spellLevel: 3 },

    { spellId: "fire-shield", minClericLevel: 7, spellLevel: 4 },
    { spellId: "freedom-of-movement", minClericLevel: 7, spellLevel: 4 },

    { spellId: "hold-monster", minClericLevel: 9, spellLevel: 5 },
    { spellId: "steel-wind-strike", minClericLevel: 9, spellLevel: 5 },
  ],
};