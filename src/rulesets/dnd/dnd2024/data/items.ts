import type { Item } from "../types";

export const items: Item[] = [
  // === WEAPONS ===
  { id: "dagger", name: "Dagger", category: "weapon" },
  { id: "shortsword", name: "Shortsword", category: "weapon" },
  { id: "scimitar", name: "Scimitar", category: "weapon" },
  { id: "rapier", name: "Rapier", category: "weapon" },
  { id: "shortbow", name: "Shortbow", category: "weapon" },
  { id: "light-crossbow", name: "Light Crossbow", category: "weapon" },
  { id: "sling", name: "Sling", category: "weapon" },
  { id: "quarterstaff", name: "Quarterstaff", category: "weapon" },
  { id: "spear", name: "Spear", category: "weapon" },
  { id: "sickle", name: "Sickle", category: "weapon" },

  // === AMMUNITION ===
  { id: "arrow", name: "Arrow", category: "ammunition", stackable: true },
  { id: "crossbow-bolt", name: "Crossbow Bolt", category: "ammunition", stackable: true },

  // === TOOLS ===
  { id: "thieves-tools", name: "Thieves' Tools", category: "tool" },
  { id: "calligraphers-supplies", name: "Calligrapher's Supplies", category: "tool" },
  { id: "carpenters-tools", name: "Carpenter's Tools", category: "tool" },
  { id: "cartographers-tools", name: "Cartographer's Tools", category: "tool" },
  { id: "herbalism-kit", name: "Herbalism Kit", category: "tool" },
  { id: "navigators-tools", name: "Navigator's Tools", category: "tool" },
  { id: "forgery-kit", name: "Forgery Kit", category: "tool" },
  { id: "gamers-set", name: "Gaming Set", category: "tool" },
  { id: "musical-instrument", name: "Musical Instrument", category: "tool" },

  // Artisan tools (important for choices)
  { id: "alchemists-supplies", name: "Alchemist's Supplies", category: "tool" },
  { id: "brewers-supplies", name: "Brewer's Supplies", category: "tool" },
  { id: "cooks-utensils", name: "Cook's Utensils", category: "tool" },
  { id: "glassblowers-tools", name: "Glassblower's Tools", category: "tool" },
  { id: "jewelers-tools", name: "Jeweler's Tools", category: "tool" },
  { id: "leatherworkers-tools", name: "Leatherworker's Tools", category: "tool" },
  { id: "masons-tools", name: "Mason's Tools", category: "tool" },
  { id: "painters-supplies", name: "Painter's Supplies", category: "tool" },
  { id: "potters-tools", name: "Potter's Tools", category: "tool" },
  { id: "smiths-tools", name: "Smith's Tools", category: "tool" },
  { id: "tinkers-tools", name: "Tinker's Tools", category: "tool" },
  { id: "weavers-tools", name: "Weaver's Tools", category: "tool" },
  { id: "woodcarvers-tools", name: "Woodcarver's Tools", category: "tool" },

  // === GEAR ===
  { id: "rope", name: "Rope", category: "gear" },
  { id: "crowbar", name: "Crowbar", category: "gear" },
  { id: "shovel", name: "Shovel", category: "gear" },
  { id: "iron-pot", name: "Iron Pot", category: "gear" },
  { id: "bedroll", name: "Bedroll", category: "gear" },
  { id: "tent", name: "Tent", category: "gear" },
  { id: "mirror", name: "Mirror", category: "gear" },
  { id: "manacles", name: "Manacles", category: "gear" },

  // === CONTAINERS ===
  { id: "pouch", name: "Pouch", category: "container" },
  { id: "quiver", name: "Quiver", category: "container" },

  // === CONSUMABLES ===
  { id: "oil", name: "Oil (flask)", category: "consumable", stackable: true },
  { id: "healers-kit", name: "Healer's Kit", category: "consumable" },
  { id: "perfume", name: "Perfume", category: "consumable" },

  // === CLOTHING ===
  { id: "travelers-clothes", name: "Traveler's Clothes", category: "clothing" },
  { id: "fine-clothes", name: "Fine Clothes", category: "clothing" },
  { id: "costume", name: "Costume", category: "clothing" },
  { id: "robe", name: "Robe", category: "clothing" },

  // === BOOKS / PAPER ===
  { id: "book", name: "Book", category: "gear" },
  { id: "parchment", name: "Parchment", category: "consumable", stackable: true },

  // === LIGHT ===
  { id: "lamp", name: "Lamp", category: "gear" },
  { id: "hooded-lantern", name: "Hooded Lantern", category: "gear" },

  // === MAGIC / SYMBOLS ===
  { id: "holy-symbol", name: "Holy Symbol", category: "holy-symbol" },
];

export const itemsById = Object.fromEntries(
  items.map((item) => [item.id, item]),
);