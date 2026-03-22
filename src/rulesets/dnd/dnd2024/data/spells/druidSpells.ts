import type { Spell } from "../../types";

export const druidSpells: Spell[] = [
  // =================
  // CANTRIPS
  // =================
  { id: "druidcraft", name: "Druidcraft", level: 0, school: "Transmutation", classes: ["druid"] },
  { id: "elementalism", name: "Elementalism", level: 0, school: "Transmutation", classes: ["druid"] },
  { id: "guidance", name: "Guidance", level: 0, school: "Divination", classes: ["druid"], concentration: true },
  { id: "mending", name: "Mending", level: 0, school: "Transmutation", classes: ["druid"] },
  { id: "message", name: "Message", level: 0, school: "Transmutation", classes: ["druid"] },
  { id: "poison-spray", name: "Poison Spray", level: 0, school: "Necromancy", classes: ["druid"] },
  { id: "produce-flame", name: "Produce Flame", level: 0, school: "Conjuration", classes: ["druid"] },
  { id: "resistance", name: "Resistance", level: 0, school: "Abjuration", classes: ["druid"], concentration: true },
  { id: "shillelagh", name: "Shillelagh", level: 0, school: "Transmutation", classes: ["druid"] },
  { id: "spare-the-dying", name: "Spare the Dying", level: 0, school: "Necromancy", classes: ["druid"] },
  { id: "starry-wisp", name: "Starry Wisp", level: 0, school: "Evocation", classes: ["druid"] },
  { id: "thorn-whip", name: "Thorn Whip", level: 0, school: "Transmutation", classes: ["druid"] },
  { id: "thunderclap", name: "Thunderclap", level: 0, school: "Evocation", classes: ["druid"] },

  // =================
  // LEVEL 1
  // =================
  { id: "animal-friendship", name: "Animal Friendship", level: 1, school: "Enchantment", classes: ["druid"] },
  { id: "charm-person", name: "Charm Person", level: 1, school: "Enchantment", classes: ["druid"] },
  { id: "create-or-destroy-water", name: "Create or Destroy Water", level: 1, school: "Transmutation", classes: ["druid"] },
  { id: "cure-wounds", name: "Cure Wounds", level: 1, school: "Abjuration", classes: ["druid"] },
  { id: "detect-magic", name: "Detect Magic", level: 1, school: "Divination", classes: ["druid"], concentration: true, ritual: true },
  { id: "detect-poison-and-disease", name: "Detect Poison and Disease", level: 1, school: "Divination", classes: ["druid"], concentration: true, ritual: true },
  { id: "entangle", name: "Entangle", level: 1, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "faerie-fire", name: "Faerie Fire", level: 1, school: "Evocation", classes: ["druid"], concentration: true },
  { id: "fog-cloud", name: "Fog Cloud", level: 1, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "goodberry", name: "Goodberry", level: 1, school: "Conjuration", classes: ["druid"] },
  { id: "healing-word", name: "Healing Word", level: 1, school: "Abjuration", classes: ["druid"] },
  { id: "ice-knife", name: "Ice Knife", level: 1, school: "Conjuration", classes: ["druid"] },
  { id: "jump", name: "Jump", level: 1, school: "Transmutation", classes: ["druid"] },
  { id: "longstrider", name: "Longstrider", level: 1, school: "Transmutation", classes: ["druid"] },
  { id: "protection-from-evil-and-good", name: "Protection from Evil and Good", level: 1, school: "Abjuration", classes: ["druid"], concentration: true },
  { id: "purify-food-and-drink", name: "Purify Food and Drink", level: 1, school: "Transmutation", classes: ["druid"], ritual: true },
  { id: "speak-with-animals", name: "Speak with Animals", level: 1, school: "Divination", classes: ["druid"], ritual: true },
  { id: "thunderwave", name: "Thunderwave", level: 1, school: "Evocation", classes: ["druid"] },

  // =================
  // LEVEL 2
  // =================
  { id: "aid", name: "Aid", level: 2, school: "Abjuration", classes: ["druid"] },
  { id: "animal-messenger", name: "Animal Messenger", level: 2, school: "Enchantment", classes: ["druid"], ritual: true },
  { id: "augury", name: "Augury", level: 2, school: "Divination", classes: ["druid"], ritual: true },
  { id: "barkskin", name: "Barkskin", level: 2, school: "Transmutation", classes: ["druid"] },
  { id: "beast-sense", name: "Beast Sense", level: 2, school: "Divination", classes: ["druid"], concentration: true, ritual: true },
  { id: "continual-flame", name: "Continual Flame", level: 2, school: "Evocation", classes: ["druid"] },
  { id: "darkvision", name: "Darkvision", level: 2, school: "Transmutation", classes: ["druid"] },
  { id: "enhance-ability", name: "Enhance Ability", level: 2, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "enlarge-reduce", name: "Enlarge/Reduce", level: 2, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "find-traps", name: "Find Traps", level: 2, school: "Divination", classes: ["druid"] },
  { id: "flame-blade", name: "Flame Blade", level: 2, school: "Evocation", classes: ["druid"], concentration: true },
  { id: "flaming-sphere", name: "Flaming Sphere", level: 2, school: "Evocation", classes: ["druid"], concentration: true },
  { id: "gust-of-wind", name: "Gust of Wind", level: 2, school: "Evocation", classes: ["druid"], concentration: true },
  { id: "heat-metal", name: "Heat Metal", level: 2, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "hold-person", name: "Hold Person", level: 2, school: "Enchantment", classes: ["druid"], concentration: true },
  { id: "lesser-restoration", name: "Lesser Restoration", level: 2, school: "Abjuration", classes: ["druid"] },
  { id: "locate-animals-or-plants", name: "Locate Animals or Plants", level: 2, school: "Divination", classes: ["druid"], ritual: true },
  { id: "locate-object", name: "Locate Object", level: 2, school: "Divination", classes: ["druid"], concentration: true },
  { id: "moonbeam", name: "Moonbeam", level: 2, school: "Evocation", classes: ["druid"], concentration: true },
  { id: "pass-without-trace", name: "Pass without Trace", level: 2, school: "Abjuration", classes: ["druid"], concentration: true },
  { id: "protection-from-poison", name: "Protection from Poison", level: 2, school: "Abjuration", classes: ["druid"] },
  { id: "spike-growth", name: "Spike Growth", level: 2, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "summon-beast", name: "Summon Beast", level: 2, school: "Conjuration", classes: ["druid"], concentration: true },

  // =================
  // LEVEL 3
  // =================
  { id: "aura-of-vitality", name: "Aura of Vitality", level: 3, school: "Abjuration", classes: ["druid"], concentration: true },
  { id: "call-lightning", name: "Call Lightning", level: 3, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "conjure-animals", name: "Conjure Animals", level: 3, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "daylight", name: "Daylight", level: 3, school: "Evocation", classes: ["druid"] },
  { id: "dispel-magic", name: "Dispel Magic", level: 3, school: "Abjuration", classes: ["druid"] },
  { id: "elemental-weapon", name: "Elemental Weapon", level: 3, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "feign-death", name: "Feign Death", level: 3, school: "Necromancy", classes: ["druid"], ritual: true },
  { id: "meld-into-stone", name: "Meld into Stone", level: 3, school: "Transmutation", classes: ["druid"], ritual: true },
  { id: "plant-growth", name: "Plant Growth", level: 3, school: "Transmutation", classes: ["druid"] },
  { id: "protection-from-energy", name: "Protection from Energy", level: 3, school: "Abjuration", classes: ["druid"], concentration: true },
  { id: "revivify", name: "Revivify", level: 3, school: "Necromancy", classes: ["druid"] },
  { id: "sleet-storm", name: "Sleet Storm", level: 3, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "speak-with-plants", name: "Speak with Plants", level: 3, school: "Transmutation", classes: ["druid"] },
  { id: "summon-fey", name: "Summon Fey", level: 3, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "water-breathing", name: "Water Breathing", level: 3, school: "Transmutation", classes: ["druid"], ritual: true },
  { id: "water-walk", name: "Water Walk", level: 3, school: "Transmutation", classes: ["druid"], ritual: true },
  { id: "wind-wall", name: "Wind Wall", level: 3, school: "Evocation", classes: ["druid"], concentration: true },

  // =================
  // LEVEL 4
  // =================
  { id: "blight", name: "Blight", level: 4, school: "Necromancy", classes: ["druid"] },
  { id: "charm-monster", name: "Charm Monster", level: 4, school: "Enchantment", classes: ["druid"] },
  { id: "confusion", name: "Confusion", level: 4, school: "Enchantment", classes: ["druid"], concentration: true },
  { id: "conjure-minor-elementals", name: "Conjure Minor Elementals", level: 4, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "conjure-woodland-beings", name: "Conjure Woodland Beings", level: 4, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "control-water", name: "Control Water", level: 4, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "divination", name: "Divination", level: 4, school: "Divination", classes: ["druid"], ritual: true },
  { id: "dominate-beast", name: "Dominate Beast", level: 4, school: "Enchantment", classes: ["druid"], concentration: true },
  { id: "fire-shield", name: "Fire Shield", level: 4, school: "Evocation", classes: ["druid"] },
  { id: "fount-of-moonlight", name: "Fount of Moonlight", level: 4, school: "Evocation", classes: ["druid"], concentration: true },
  { id: "freedom-of-movement", name: "Freedom of Movement", level: 4, school: "Abjuration", classes: ["druid"] },
  { id: "giant-insect", name: "Giant Insect", level: 4, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "grasping-vine", name: "Grasping Vine", level: 4, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "hallucinatory-terrain", name: "Hallucinatory Terrain", level: 4, school: "Illusion", classes: ["druid"] },
  { id: "ice-storm", name: "Ice Storm", level: 4, school: "Evocation", classes: ["druid"] },
  { id: "locate-creature", name: "Locate Creature", level: 4, school: "Divination", classes: ["druid"], concentration: true },
  { id: "polymorph", name: "Polymorph", level: 4, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "stone-shape", name: "Stone Shape", level: 4, school: "Transmutation", classes: ["druid"] },
  { id: "stoneskin", name: "Stoneskin", level: 4, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "summon-elemental", name: "Summon Elemental", level: 4, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "wall-of-fire", name: "Wall of Fire", level: 4, school: "Evocation", classes: ["druid"], concentration: true },

  // =================
  // LEVEL 5
  // =================
  { id: "antilife-shell", name: "Antilife Shell", level: 5, school: "Abjuration", classes: ["druid"], concentration: true },
  { id: "awaken", name: "Awaken", level: 5, school: "Transmutation", classes: ["druid"] },
  { id: "commune-with-nature", name: "Commune with Nature", level: 5, school: "Divination", classes: ["druid"], ritual: true },
  { id: "cone-of-cold", name: "Cone of Cold", level: 5, school: "Evocation", classes: ["druid"] },
  { id: "conjure-elemental", name: "Conjure Elemental", level: 5, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "contagion", name: "Contagion", level: 5, school: "Necromancy", classes: ["druid"] },
  { id: "geas", name: "Geas", level: 5, school: "Enchantment", classes: ["druid"] },
  { id: "greater-restoration", name: "Greater Restoration", level: 5, school: "Abjuration", classes: ["druid"] },
  { id: "insect-plague", name: "Insect Plague", level: 5, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "mass-cure-wounds", name: "Mass Cure Wounds", level: 5, school: "Abjuration", classes: ["druid"] },
  { id: "planar-binding", name: "Planar Binding", level: 5, school: "Abjuration", classes: ["druid"] },
  { id: "reincarnate", name: "Reincarnate", level: 5, school: "Necromancy", classes: ["druid"] },
  { id: "scrying", name: "Scrying", level: 5, school: "Divination", classes: ["druid"], concentration: true },
  { id: "tree-stride", name: "Tree Stride", level: 5, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "wall-of-stone", name: "Wall of Stone", level: 5, school: "Evocation", classes: ["druid"], concentration: true },

  // =================
  // LEVEL 6
  // =================
  { id: "conjure-fey", name: "Conjure Fey", level: 6, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "find-the-path", name: "Find the Path", level: 6, school: "Divination", classes: ["druid"], concentration: true },
  { id: "flesh-to-stone", name: "Flesh to Stone", level: 6, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "heal", name: "Heal", level: 6, school: "Abjuration", classes: ["druid"] },
  { id: "heroes-feast", name: "Heroes' Feast", level: 6, school: "Conjuration", classes: ["druid"] },
  { id: "move-earth", name: "Move Earth", level: 6, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "sunbeam", name: "Sunbeam", level: 6, school: "Evocation", classes: ["druid"], concentration: true },
  { id: "transport-via-plants", name: "Transport via Plants", level: 6, school: "Conjuration", classes: ["druid"] },
  { id: "wall-of-thorns", name: "Wall of Thorns", level: 6, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "wind-walk", name: "Wind Walk", level: 6, school: "Transmutation", classes: ["druid"] },

  // =================
  // LEVEL 7
  // =================
  { id: "fire-storm", name: "Fire Storm", level: 7, school: "Evocation", classes: ["druid"] },
  { id: "mirage-arcane", name: "Mirage Arcane", level: 7, school: "Illusion", classes: ["druid"] },
  { id: "plane-shift", name: "Plane Shift", level: 7, school: "Conjuration", classes: ["druid"] },
  { id: "regenerate", name: "Regenerate", level: 7, school: "Transmutation", classes: ["druid"] },
  { id: "reverse-gravity", name: "Reverse Gravity", level: 7, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "symbol", name: "Symbol", level: 7, school: "Abjuration", classes: ["druid"] },

  // =================
  // LEVEL 8
  // =================
  { id: "animal-shapes", name: "Animal Shapes", level: 8, school: "Transmutation", classes: ["druid"] },
  { id: "antipathy-sympathy", name: "Antipathy/Sympathy", level: 8, school: "Enchantment", classes: ["druid"] },
  { id: "befuddlement", name: "Befuddlement", level: 8, school: "Enchantment", classes: ["druid"] },
  { id: "control-weather", name: "Control Weather", level: 8, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "earthquake", name: "Earthquake", level: 8, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "incendiary-cloud", name: "Incendiary Cloud", level: 8, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "sunburst", name: "Sunburst", level: 8, school: "Evocation", classes: ["druid"] },
  { id: "tsunami", name: "Tsunami", level: 8, school: "Conjuration", classes: ["druid"], concentration: true },

  // =================
  // LEVEL 9
  // =================
  { id: "foresight", name: "Foresight", level: 9, school: "Divination", classes: ["druid"] },
  { id: "shapechange", name: "Shapechange", level: 9, school: "Transmutation", classes: ["druid"], concentration: true },
  { id: "storm-of-vengeance", name: "Storm of Vengeance", level: 9, school: "Conjuration", classes: ["druid"], concentration: true },
  { id: "true-resurrection", name: "True Resurrection", level: 9, school: "Necromancy", classes: ["druid"] },
];