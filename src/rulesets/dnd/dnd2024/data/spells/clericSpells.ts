import type { Spell } from "../../types";

export const clericSpells: Spell[] = [
  // =================
  // CANTRIPS
  // =================
  { id: "guidance", name: "Guidance", level: 0, school: "Divination", classes: ["cleric"], concentration: true },
  { id: "light", name: "Light", level: 0, school: "Evocation", classes: ["cleric"] },
  { id: "mending", name: "Mending", level: 0, school: "Transmutation", classes: ["cleric"] },
  { id: "resistance", name: "Resistance", level: 0, school: "Abjuration", classes: ["cleric"], concentration: true },
  { id: "sacred-flame", name: "Sacred Flame", level: 0, school: "Evocation", classes: ["cleric"] },
  { id: "spare-the-dying", name: "Spare the Dying", level: 0, school: "Necromancy", classes: ["cleric"] },
  { id: "thaumaturgy", name: "Thaumaturgy", level: 0, school: "Transmutation", classes: ["cleric"] },
  { id: "toll-the-dead", name: "Toll the Dead", level: 0, school: "Necromancy", classes: ["cleric"] },
  { id: "word-of-radiance", name: "Word of Radiance", level: 0, school: "Evocation", classes: ["cleric"] },

  // =================
  // LEVEL 1
  // =================
  { id: "bane", name: "Bane", level: 1, school: "Enchantment", classes: ["cleric"], concentration: true },
  { id: "bless", name: "Bless", level: 1, school: "Enchantment", classes: ["cleric"], concentration: true },
  { id: "command", name: "Command", level: 1, school: "Enchantment", classes: ["cleric"] },
  { id: "create-or-destroy-water", name: "Create or Destroy Water", level: 1, school: "Transmutation", classes: ["cleric"] },
  { id: "cure-wounds", name: "Cure Wounds", level: 1, school: "Abjuration", classes: ["cleric"] },
  { id: "detect-evil-and-good", name: "Detect Evil and Good", level: 1, school: "Divination", classes: ["cleric"], concentration: true },
  { id: "detect-magic", name: "Detect Magic", level: 1, school: "Divination", classes: ["cleric"], concentration: true, ritual: true },
  { id: "detect-poison-and-disease", name: "Detect Poison and Disease", level: 1, school: "Divination", classes: ["cleric"], concentration: true, ritual: true },
  { id: "guiding-bolt", name: "Guiding Bolt", level: 1, school: "Evocation", classes: ["cleric"] },
  { id: "healing-word", name: "Healing Word", level: 1, school: "Abjuration", classes: ["cleric"] },
  { id: "inflict-wounds", name: "Inflict Wounds", level: 1, school: "Necromancy", classes: ["cleric"] },
  { id: "protection-from-evil-and-good", name: "Protection from Evil and Good", level: 1, school: "Abjuration", classes: ["cleric"], concentration: true },
  { id: "purify-food-and-drink", name: "Purify Food and Drink", level: 1, school: "Transmutation", classes: ["cleric"], ritual: true },
  { id: "sanctuary", name: "Sanctuary", level: 1, school: "Abjuration", classes: ["cleric"] },
  { id: "shield-of-faith", name: "Shield of Faith", level: 1, school: "Abjuration", classes: ["cleric"], concentration: true },

  // =================
  // LEVEL 2
  // =================
  { id: "aid", name: "Aid", level: 2, school: "Abjuration", classes: ["cleric"] },
  { id: "augury", name: "Augury", level: 2, school: "Divination", classes: ["cleric"], ritual: true },
  { id: "blindness-deafness", name: "Blindness/Deafness", level: 2, school: "Transmutation", classes: ["cleric"] },
  { id: "calm-emotions", name: "Calm Emotions", level: 2, school: "Enchantment", classes: ["cleric"], concentration: true },
  { id: "continual-flame", name: "Continual Flame", level: 2, school: "Evocation", classes: ["cleric"] },
  { id: "enhance-ability", name: "Enhance Ability", level: 2, school: "Transmutation", classes: ["cleric"], concentration: true },
  { id: "find-traps", name: "Find Traps", level: 2, school: "Divination", classes: ["cleric"] },
  { id: "gentle-repose", name: "Gentle Repose", level: 2, school: "Necromancy", classes: ["cleric"], ritual: true },
  { id: "hold-person", name: "Hold Person", level: 2, school: "Enchantment", classes: ["cleric"], concentration: true },
  { id: "lesser-restoration", name: "Lesser Restoration", level: 2, school: "Abjuration", classes: ["cleric"] },
  { id: "locate-object", name: "Locate Object", level: 2, school: "Divination", classes: ["cleric"], concentration: true },
  { id: "prayer-of-healing", name: "Prayer of Healing", level: 2, school: "Abjuration", classes: ["cleric"] },
  { id: "protection-from-poison", name: "Protection from Poison", level: 2, school: "Abjuration", classes: ["cleric"] },
  { id: "silence", name: "Silence", level: 2, school: "Illusion", classes: ["cleric"], concentration: true, ritual: true },
  { id: "spiritual-weapon", name: "Spiritual Weapon", level: 2, school: "Evocation", classes: ["cleric"], concentration: true },
  { id: "warding-bond", name: "Warding Bond", level: 2, school: "Abjuration", classes: ["cleric"] },
  { id: "zone-of-truth", name: "Zone of Truth", level: 2, school: "Enchantment", classes: ["cleric"] },

  // =================
  // LEVEL 3
  // =================
  { id: "animate-dead", name: "Animate Dead", level: 3, school: "Necromancy", classes: ["cleric"] },
  { id: "aura-of-vitality", name: "Aura of Vitality", level: 3, school: "Abjuration", classes: ["cleric"], concentration: true },
  { id: "beacon-of-hope", name: "Beacon of Hope", level: 3, school: "Abjuration", classes: ["cleric"], concentration: true },
  { id: "bestow-curse", name: "Bestow Curse", level: 3, school: "Necromancy", classes: ["cleric"], concentration: true },
  { id: "clairvoyance", name: "Clairvoyance", level: 3, school: "Divination", classes: ["cleric"], concentration: true },
  { id: "create-food-and-water", name: "Create Food and Water", level: 3, school: "Conjuration", classes: ["cleric"] },
  { id: "daylight", name: "Daylight", level: 3, school: "Evocation", classes: ["cleric"] },
  { id: "dispel-magic", name: "Dispel Magic", level: 3, school: "Abjuration", classes: ["cleric"] },
  { id: "feign-death", name: "Feign Death", level: 3, school: "Necromancy", classes: ["cleric"], ritual: true },
  { id: "glyph-of-warding", name: "Glyph of Warding", level: 3, school: "Abjuration", classes: ["cleric"] },
  { id: "magic-circle", name: "Magic Circle", level: 3, school: "Abjuration", classes: ["cleric"] },
  { id: "mass-healing-word", name: "Mass Healing Word", level: 3, school: "Abjuration", classes: ["cleric"] },
  { id: "meld-into-stone", name: "Meld into Stone", level: 3, school: "Transmutation", classes: ["cleric"], ritual: true },
  { id: "protection-from-energy", name: "Protection from Energy", level: 3, school: "Abjuration", classes: ["cleric"], concentration: true },
  { id: "remove-curse", name: "Remove Curse", level: 3, school: "Abjuration", classes: ["cleric"] },
  { id: "revivify", name: "Revivify", level: 3, school: "Necromancy", classes: ["cleric"] },
  { id: "sending", name: "Sending", level: 3, school: "Divination", classes: ["cleric"] },
  { id: "speak-with-dead", name: "Speak with Dead", level: 3, school: "Necromancy", classes: ["cleric"] },
  { id: "spirit-guardians", name: "Spirit Guardians", level: 3, school: "Conjuration", classes: ["cleric"], concentration: true },
  { id: "tongues", name: "Tongues", level: 3, school: "Divination", classes: ["cleric"] },
  { id: "water-walk", name: "Water Walk", level: 3, school: "Transmutation", classes: ["cleric"], ritual: true },

  // =================
  // LEVEL 4
  // =================
  { id: "aura-of-life", name: "Aura of Life", level: 4, school: "Abjuration", classes: ["cleric"], concentration: true },
  { id: "aura-of-purity", name: "Aura of Purity", level: 4, school: "Abjuration", classes: ["cleric"], concentration: true },
  { id: "banishment", name: "Banishment", level: 4, school: "Abjuration", classes: ["cleric"], concentration: true },
  { id: "control-water", name: "Control Water", level: 4, school: "Transmutation", classes: ["cleric"], concentration: true },
  { id: "divination", name: "Divination", level: 4, school: "Divination", classes: ["cleric"], ritual: true },
  { id: "death-ward", name: "Death Ward", level: 4, school: "Abjuration", classes: ["cleric"] },
  { id: "freedom-of-movement", name: "Freedom of Movement", level: 4, school: "Abjuration", classes: ["cleric"] },
  { id: "guardian-of-faith", name: "Guardian of Faith", level: 4, school: "Conjuration", classes: ["cleric"] },
  { id: "locate-creature", name: "Locate Creature", level: 4, school: "Divination", classes: ["cleric"], concentration: true },
  { id: "stone-shape", name: "Stone Shape", level: 4, school: "Transmutation", classes: ["cleric"] },

  // =================
  // LEVEL 5
  // =================
  { id: "circle-of-power", name: "Circle of Power", level: 5, school: "Abjuration", classes: ["cleric"], concentration: true },
  { id: "commune", name: "Commune", level: 5, school: "Divination", classes: ["cleric"], ritual: true },
  { id: "contagion", name: "Contagion", level: 5, school: "Necromancy", classes: ["cleric"] },
  { id: "dispel-evil-and-good", name: "Dispel Evil and Good", level: 5, school: "Abjuration", classes: ["cleric"], concentration: true },
  { id: "flame-strike", name: "Flame Strike", level: 5, school: "Evocation", classes: ["cleric"] },
  { id: "geas", name: "Geas", level: 5, school: "Enchantment", classes: ["cleric"] },
  { id: "greater-restoration", name: "Greater Restoration", level: 5, school: "Abjuration", classes: ["cleric"] },
  { id: "hallow", name: "Hallow", level: 5, school: "Abjuration", classes: ["cleric"] },
  { id: "insect-plague", name: "Insect Plague", level: 5, school: "Conjuration", classes: ["cleric"], concentration: true },
  { id: "legend-lore", name: "Legend Lore", level: 5, school: "Divination", classes: ["cleric"] },
  { id: "mass-cure-wounds", name: "Mass Cure Wounds", level: 5, school: "Abjuration", classes: ["cleric"] },
  { id: "planar-binding", name: "Planar Binding", level: 5, school: "Abjuration", classes: ["cleric"] },
  { id: "raise-dead", name: "Raise Dead", level: 5, school: "Necromancy", classes: ["cleric"] },
  { id: "scrying", name: "Scrying", level: 5, school: "Divination", classes: ["cleric"], concentration: true },
  { id: "summon-celestial", name: "Summon Celestial", level: 5, school: "Conjuration", classes: ["cleric"], concentration: true },

  // =================
  // LEVEL 6
  // =================
  { id: "blade-barrier", name: "Blade Barrier", level: 6, school: "Evocation", classes: ["cleric"], concentration: true },
  { id: "create-undead", name: "Create Undead", level: 6, school: "Necromancy", classes: ["cleric"] },
  { id: "find-the-path", name: "Find the Path", level: 6, school: "Divination", classes: ["cleric"] },
  { id: "forbiddance", name: "Forbiddance", level: 6, school: "Abjuration", classes: ["cleric"], ritual: true },
  { id: "harm", name: "Harm", level: 6, school: "Necromancy", classes: ["cleric"] },
  { id: "heal", name: "Heal", level: 6, school: "Abjuration", classes: ["cleric"] },
  { id: "heroes-feast", name: "Heroes' Feast", level: 6, school: "Conjuration", classes: ["cleric"] },
  { id: "planar-ally", name: "Planar Ally", level: 6, school: "Conjuration", classes: ["cleric"] },
  { id: "sunbeam", name: "Sunbeam", level: 6, school: "Evocation", classes: ["cleric"], concentration: true },
  { id: "true-seeing", name: "True Seeing", level: 6, school: "Divination", classes: ["cleric"] },
  { id: "word-of-recall", name: "Word of Recall", level: 6, school: "Conjuration", classes: ["cleric"] },

  // =================
  // LEVEL 7
  // =================
  { id: "conjure-celestial", name: "Conjure Celestial", level: 7, school: "Conjuration", classes: ["cleric"], concentration: true },
  { id: "divine-word", name: "Divine Word", level: 7, school: "Evocation", classes: ["cleric"] },
  { id: "etherealness", name: "Etherealness", level: 7, school: "Conjuration", classes: ["cleric"] },
  { id: "fire-storm", name: "Fire Storm", level: 7, school: "Evocation", classes: ["cleric"] },
  { id: "plane-shift", name: "Plane Shift", level: 7, school: "Conjuration", classes: ["cleric"] },
  { id: "power-word-fortify", name: "Power Word Fortify", level: 7, school: "Enchantment", classes: ["cleric"] },
  { id: "regenerate", name: "Regenerate", level: 7, school: "Transmutation", classes: ["cleric"] },
  { id: "resurrection", name: "Resurrection", level: 7, school: "Necromancy", classes: ["cleric"] },
  { id: "symbol", name: "Symbol", level: 7, school: "Abjuration", classes: ["cleric"] },

  // =================
  // LEVEL 8
  // =================
  { id: "antimagic-field", name: "Antimagic Field", level: 8, school: "Abjuration", classes: ["cleric"], concentration: true },
  { id: "control-weather", name: "Control Weather", level: 8, school: "Transmutation", classes: ["cleric"], concentration: true },
  { id: "earthquake", name: "Earthquake", level: 8, school: "Transmutation", classes: ["cleric"], concentration: true },
  { id: "holy-aura", name: "Holy Aura", level: 8, school: "Abjuration", classes: ["cleric"], concentration: true },
  { id: "sunburst", name: "Sunburst", level: 8, school: "Evocation", classes: ["cleric"] },

  // =================
  // LEVEL 9
  // =================
  { id: "astral-projection", name: "Astral Projection", level: 9, school: "Necromancy", classes: ["cleric"] },
  { id: "gate", name: "Gate", level: 9, school: "Conjuration", classes: ["cleric"], concentration: true },
  { id: "mass-heal", name: "Mass Heal", level: 9, school: "Abjuration", classes: ["cleric"] },
  { id: "power-word-heal", name: "Power Word Heal", level: 9, school: "Enchantment", classes: ["cleric"] },
  { id: "true-resurrection", name: "True Resurrection", level: 9, school: "Necromancy", classes: ["cleric"] },
];