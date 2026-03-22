import type { Spell } from "../../types";

export const paladinSpells: Spell[] = [
  // =================
  // LEVEL 1
  // =================
  { id: "bless", name: "Bless", level: 1, school: "Enchantment", classes: ["paladin"], concentration: true },
  { id: "command", name: "Command", level: 1, school: "Enchantment", classes: ["paladin"] },
  { id: "compelled-duel", name: "Compelled Duel", level: 1, school: "Enchantment", classes: ["paladin"], concentration: true },
  { id: "cure-wounds", name: "Cure Wounds", level: 1, school: "Abjuration", classes: ["paladin"] },
  { id: "detect-evil-and-good", name: "Detect Evil and Good", level: 1, school: "Divination", classes: ["paladin"], concentration: true },
  { id: "detect-magic", name: "Detect Magic", level: 1, school: "Divination", classes: ["paladin"], concentration: true, ritual: true },
  { id: "detect-poison-and-disease", name: "Detect Poison and Disease", level: 1, school: "Divination", classes: ["paladin"], concentration: true, ritual: true },
  { id: "divine-favor", name: "Divine Favor", level: 1, school: "Transmutation", classes: ["paladin"], concentration: true },
  { id: "divine-smite", name: "Divine Smite", level: 1, school: "Evocation", classes: ["paladin"] },
  { id: "heroism", name: "Heroism", level: 1, school: "Enchantment", classes: ["paladin"], concentration: true },
  { id: "protection-from-evil-and-good", name: "Protection from Evil and Good", level: 1, school: "Abjuration", classes: ["paladin"], concentration: true },
  { id: "purify-food-and-drink", name: "Purify Food and Drink", level: 1, school: "Transmutation", classes: ["paladin"], ritual: true },
  { id: "searing-smite", name: "Searing Smite", level: 1, school: "Evocation", classes: ["paladin"], concentration: true },
  { id: "shield-of-faith", name: "Shield of Faith", level: 1, school: "Abjuration", classes: ["paladin"], concentration: true },
  { id: "thunderous-smite", name: "Thunderous Smite", level: 1, school: "Evocation", classes: ["paladin"], concentration: true },
  { id: "wrathful-smite", name: "Wrathful Smite", level: 1, school: "Necromancy", classes: ["paladin"], concentration: true },

  // =================
  // LEVEL 2
  // =================
  { id: "aid", name: "Aid", level: 2, school: "Abjuration", classes: ["paladin"] },
  { id: "find-steed", name: "Find Steed", level: 2, school: "Conjuration", classes: ["paladin"] },
  { id: "gentle-repose", name: "Gentle Repose", level: 2, school: "Necromancy", classes: ["paladin"], ritual: true },
  { id: "lesser-restoration", name: "Lesser Restoration", level: 2, school: "Abjuration", classes: ["paladin"] },
  { id: "locate-object", name: "Locate Object", level: 2, school: "Divination", classes: ["paladin"], concentration: true },
  { id: "magic-weapon", name: "Magic Weapon", level: 2, school: "Transmutation", classes: ["paladin"], concentration: true },
  { id: "prayer-of-healing", name: "Prayer of Healing", level: 2, school: "Abjuration", classes: ["paladin"] },
  { id: "protection-from-poison", name: "Protection from Poison", level: 2, school: "Abjuration", classes: ["paladin"] },
  { id: "shining-smite", name: "Shining Smite", level: 2, school: "Transmutation", classes: ["paladin"], concentration: true },
  { id: "warding-bond", name: "Warding Bond", level: 2, school: "Abjuration", classes: ["paladin"] },
  { id: "zone-of-truth", name: "Zone of Truth", level: 2, school: "Enchantment", classes: ["paladin"] },

  // =================
  // LEVEL 3
  // =================
  { id: "aura-of-vitality", name: "Aura of Vitality", level: 3, school: "Abjuration", classes: ["paladin"], concentration: true },
  { id: "blinding-smite", name: "Blinding Smite", level: 3, school: "Evocation", classes: ["paladin"], concentration: true },
  { id: "create-food-and-water", name: "Create Food and Water", level: 3, school: "Conjuration", classes: ["paladin"] },
  { id: "crusaders-mantle", name: "Crusader's Mantle", level: 3, school: "Transmutation", classes: ["paladin"], concentration: true },
  { id: "daylight", name: "Daylight", level: 3, school: "Evocation", classes: ["paladin"] },
  { id: "dispel-magic", name: "Dispel Magic", level: 3, school: "Abjuration", classes: ["paladin"] },
  { id: "elemental-weapon", name: "Elemental Weapon", level: 3, school: "Transmutation", classes: ["paladin"], concentration: true },
  { id: "magic-circle", name: "Magic Circle", level: 3, school: "Abjuration", classes: ["paladin"] },
  { id: "remove-curse", name: "Remove Curse", level: 3, school: "Abjuration", classes: ["paladin"] },
  { id: "revivify", name: "Revivify", level: 3, school: "Necromancy", classes: ["paladin"] },

  // =================
  // LEVEL 4
  // =================
  { id: "aura-of-life", name: "Aura of Life", level: 4, school: "Abjuration", classes: ["paladin"], concentration: true },
  { id: "aura-of-purity", name: "Aura of Purity", level: 4, school: "Abjuration", classes: ["paladin"], concentration: true },
  { id: "banishment", name: "Banishment", level: 4, school: "Abjuration", classes: ["paladin"], concentration: true },
  { id: "death-ward", name: "Death Ward", level: 4, school: "Abjuration", classes: ["paladin"] },
  { id: "locate-creature", name: "Locate Creature", level: 4, school: "Divination", classes: ["paladin"], concentration: true },
  { id: "staggering-smite", name: "Staggering Smite", level: 4, school: "Enchantment", classes: ["paladin"], concentration: true },

  // =================
  // LEVEL 5
  // =================
  { id: "banishing-smite", name: "Banishing Smite", level: 5, school: "Conjuration", classes: ["paladin"], concentration: true },
  { id: "circle-of-power", name: "Circle of Power", level: 5, school: "Abjuration", classes: ["paladin"], concentration: true },
  { id: "destructive-wave", name: "Destructive Wave", level: 5, school: "Evocation", classes: ["paladin"] },
  { id: "dispel-evil-and-good", name: "Dispel Evil and Good", level: 5, school: "Abjuration", classes: ["paladin"], concentration: true },
  { id: "geas", name: "Geas", level: 5, school: "Enchantment", classes: ["paladin"] },
  { id: "greater-restoration", name: "Greater Restoration", level: 5, school: "Abjuration", classes: ["paladin"] },
  { id: "raise-dead", name: "Raise Dead", level: 5, school: "Necromancy", classes: ["paladin"] },
  { id: "summon-celestial", name: "Summon Celestial", level: 5, school: "Conjuration", classes: ["paladin"], concentration: true },
];