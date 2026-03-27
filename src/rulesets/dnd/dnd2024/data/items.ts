import type { Item } from "../types";

export const items: Item[] = [
  // === WEAPONS ===
  {
    id: "dagger",
    name: "Dagger",
    category: "weapon",
    equippable: {
      slots: ["main-hand", "off-hand"],
      allowedWieldModes: ["main-hand", "off-hand"],
    },
    weapon: {
      weaponKind: "simple-melee",
      damage: {
        dice: { count: 1, die: 4 },
        damageType: "piercing",
      },
      properties: ["finesse", "light", "thrown"],
      range: { normal: 20, long: 60 },
      mastery: "nick",
    },
  },
  {
    id: "shortsword",
    name: "Shortsword",
    category: "weapon",
    equippable: {
      slots: ["main-hand", "off-hand"],
      allowedWieldModes: ["main-hand", "off-hand"],
    },
    weapon: {
      weaponKind: "martial-melee",
      damage: {
        dice: { count: 1, die: 6 },
        damageType: "piercing",
      },
      properties: ["finesse", "light"],
      mastery: "vex",
    },
  },
  {
    id: "longsword",
    name: "Longsword",
    category: "weapon",
    equippable: {
      slots: ["main-hand", "off-hand"],
      allowedWieldModes: ["main-hand", "off-hand", "two-handed"],
    },
    weapon: {
      weaponKind: "martial-melee",
      damage: {
        dice: { count: 1, die: 8 },
        damageType: "slashing",
      },
      versatileDamage: {
        dice: { count: 1, die: 10 },
        damageType: "slashing",
      },
      properties: ["versatile"],
      mastery: "sap",
    },
  },
  {
    id: "scimitar",
    name: "Scimitar",
    category: "weapon",
    equippable: {
      slots: ["main-hand", "off-hand"],
      allowedWieldModes: ["main-hand", "off-hand"],
    },
    weapon: {
      weaponKind: "martial-melee",
      damage: {
        dice: { count: 1, die: 6 },
        damageType: "slashing",
      },
      properties: ["finesse", "light"],
      mastery: "nick",
    },
  },
  {
    id: "rapier",
    name: "Rapier",
    category: "weapon",
    equippable: {
      slots: ["main-hand"],
      allowedWieldModes: ["main-hand"],
    },
    weapon: {
      weaponKind: "martial-melee",
      damage: {
        dice: { count: 1, die: 8 },
        damageType: "piercing",
      },
      properties: ["finesse"],
      mastery: "vex",
    },
  },
  {
    id: "shortbow",
    name: "Shortbow",
    category: "weapon",
    equippable: {
      slots: ["main-hand", "off-hand"],
      allowedWieldModes: ["two-handed"],
    },
    weapon: {
      weaponKind: "simple-ranged",
      damage: {
        dice: { count: 1, die: 6 },
        damageType: "piercing",
      },
      properties: ["ammunition", "range", "two-handed"],
      range: { normal: 80, long: 320 },
      mastery: "vex",
    },
  },
  {
    id: "light-crossbow",
    name: "Light Crossbow",
    category: "weapon",
    equippable: {
      slots: ["main-hand", "off-hand"],
      allowedWieldModes: ["two-handed"],
    },
    weapon: {
      weaponKind: "simple-ranged",
      damage: {
        dice: { count: 1, die: 8 },
        damageType: "piercing",
      },
      properties: ["ammunition", "loading", "range", "two-handed"],
      range: { normal: 80, long: 320 },
      mastery: "slow",
    },
  },
  {
    id: "sling",
    name: "Sling",
    category: "weapon",
    equippable: {
      slots: ["main-hand", "off-hand"],
      allowedWieldModes: ["main-hand", "off-hand"],
    },
    weapon: {
      weaponKind: "simple-ranged",
      damage: {
        dice: { count: 1, die: 4 },
        damageType: "bludgeoning",
      },
      properties: ["ammunition", "range"],
      range: { normal: 30, long: 120 },
      mastery: "slow",
    },
  },
  {
    id: "quarterstaff",
    name: "Quarterstaff",
    category: "weapon",
    equippable: {
      slots: ["main-hand", "off-hand"],
      allowedWieldModes: ["main-hand", "two-handed"],
    },
    weapon: {
      weaponKind: "simple-melee",
      damage: {
        dice: { count: 1, die: 6 },
        damageType: "bludgeoning",
      },
      versatileDamage: {
        dice: { count: 1, die: 8 },
        damageType: "bludgeoning",
      },
      properties: ["versatile"],
      mastery: "topple",
    },
  },
  {
    id: "spear",
    name: "Spear",
    category: "weapon",
    equippable: {
      slots: ["main-hand", "off-hand"],
      allowedWieldModes: ["main-hand", "off-hand", "two-handed"],
    },
    weapon: {
      weaponKind: "simple-melee",
      damage: {
        dice: { count: 1, die: 6 },
        damageType: "piercing",
      },
      versatileDamage: {
        dice: { count: 1, die: 8 },
        damageType: "piercing",
      },
      properties: ["thrown", "versatile"],
      range: { normal: 20, long: 60 },
      mastery: "sap",
    },
  },
  {
    id: "sickle",
    name: "Sickle",
    category: "weapon",
    equippable: {
      slots: ["main-hand", "off-hand"],
      allowedWieldModes: ["main-hand", "off-hand"],
    },
    weapon: {
      weaponKind: "simple-melee",
      damage: {
        dice: { count: 1, die: 4 },
        damageType: "slashing",
      },
      properties: ["light"],
      mastery: "nick",
    },
  },
  {
    id: "javelin",
    name: "Javelin",
    category: "weapon",
    stackable: false,
    equippable: {
      slots: ["main-hand", "off-hand"],
      allowedWieldModes: ["main-hand", "off-hand"],
    },
    weapon: {
      weaponKind: "simple-melee",
      damage: {
        dice: { count: 1, die: 6 },
        damageType: "piercing",
      },
      properties: ["thrown"],
      range: { normal: 30, long: 120 },
      mastery: "slow",
    },
  },
  // === ADDITIONAL SIMPLE MELEE ===
{
  id: "club",
  name: "Club",
  category: "weapon",
  equippable: { slots: ["main-hand", "off-hand"], allowedWieldModes: ["main-hand", "off-hand"] },
  weapon: {
    weaponKind: "simple-melee",
    damage: { dice: { count: 1, die: 4 }, damageType: "bludgeoning" },
    properties: ["light"],
    mastery: "slow",
  },
},
{
  id: "greatclub",
  name: "Greatclub",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["two-handed"] },
  weapon: {
    weaponKind: "simple-melee",
    damage: { dice: { count: 1, die: 8 }, damageType: "bludgeoning" },
    properties: ["two-handed"],
    mastery: "push",
  },
},
{
  id: "handaxe",
  name: "Handaxe",
  category: "weapon",
  equippable: { slots: ["main-hand", "off-hand"], allowedWieldModes: ["main-hand", "off-hand"] },
  weapon: {
    weaponKind: "simple-melee",
    damage: { dice: { count: 1, die: 6 }, damageType: "slashing" },
    properties: ["light", "thrown"],
    range: { normal: 20, long: 60 },
    mastery: "vex",
  },
},
{
  id: "light-hammer",
  name: "Light Hammer",
  category: "weapon",
  equippable: { slots: ["main-hand", "off-hand"], allowedWieldModes: ["main-hand", "off-hand"] },
  weapon: {
    weaponKind: "simple-melee",
    damage: { dice: { count: 1, die: 4 }, damageType: "bludgeoning" },
    properties: ["light", "thrown"],
    range: { normal: 20, long: 60 },
    mastery: "nick",
  },
},
{
  id: "mace",
  name: "Mace",
  category: "weapon",
  equippable: {
    slots: ["main-hand"],
    allowedWieldModes: ["main-hand"],
  },
  weapon: {
    weaponKind: "simple-melee",
    damage: {
      dice: { count: 1, die: 6 },
      damageType: "bludgeoning",
    },
    properties: [],
    mastery: "sap",
  },
},

// === SIMPLE RANGED ===
{
  id: "dart",
  name: "Dart",
  category: "weapon",
  equippable: { slots: ["main-hand", "off-hand"], allowedWieldModes: ["main-hand", "off-hand"] },
  weapon: {
    weaponKind: "simple-ranged",
    damage: { dice: { count: 1, die: 4 }, damageType: "piercing" },
    properties: ["finesse", "thrown"],
    range: { normal: 20, long: 60 },
    mastery: "vex",
  },
},

// === MARTIAL MELEE ===
{
  id: "battleaxe",
  name: "Battleaxe",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["main-hand", "two-handed"] },
  weapon: {
    weaponKind: "martial-melee",
    damage: { dice: { count: 1, die: 8 }, damageType: "slashing" },
    versatileDamage: { dice: { count: 1, die: 10 }, damageType: "slashing" },
    properties: ["versatile"],
    mastery: "topple",
  },
},
{
  id: "flail",
  name: "Flail",
  category: "weapon",
  equippable: {
    slots: ["main-hand"],
    allowedWieldModes: ["main-hand"],
  },
  weapon: {
    weaponKind: "martial-melee",
    damage: {
      dice: { count: 1, die: 8 },
      damageType: "bludgeoning",
    },
    properties: [],
    mastery: "sap",
  },
},
{
  id: "glaive",
  name: "Glaive",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["two-handed"] },
  weapon: {
    weaponKind: "martial-melee",
    damage: { dice: { count: 1, die: 10 }, damageType: "slashing" },
    properties: ["heavy", "reach", "two-handed"],
    mastery: "graze",
  },
},
{
  id: "greataxe",
  name: "Greataxe",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["two-handed"] },
  weapon: {
    weaponKind: "martial-melee",
    damage: { dice: { count: 1, die: 12 }, damageType: "slashing" },
    properties: ["heavy", "two-handed"],
    mastery: "cleave",
  },
},
{
  id: "greatsword",
  name: "Greatsword",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["two-handed"] },
  weapon: {
    weaponKind: "martial-melee",
    damage: { dice: { count: 2, die: 6 }, damageType: "slashing" },
    properties: ["heavy", "two-handed"],
    mastery: "graze",
  },
},
{
  id: "halberd",
  name: "Halberd",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["two-handed"] },
  weapon: {
    weaponKind: "martial-melee",
    damage: { dice: { count: 1, die: 10 }, damageType: "slashing" },
    properties: ["heavy", "reach", "two-handed"],
    mastery: "cleave",
  },
},
{
  id: "lance",
  name: "Lance",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["two-handed"] },
  weapon: {
    weaponKind: "martial-melee",
    damage: { dice: { count: 1, die: 10 }, damageType: "piercing" },
    properties: ["heavy", "reach"],
    mastery: "topple",
  },
},
{
  id: "maul",
  name: "Maul",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["two-handed"] },
  weapon: {
    weaponKind: "martial-melee",
    damage: { dice: { count: 2, die: 6 }, damageType: "bludgeoning" },
    properties: ["heavy", "two-handed"],
    mastery: "topple",
  },
},
{
  id: "morningstar",
  name: "Morningstar",
  category: "weapon",
  equippable: {
    slots: ["main-hand"],
    allowedWieldModes: ["main-hand"],
  },
  weapon: {
    weaponKind: "martial-melee",
    damage: {
      dice: { count: 1, die: 8 },
      damageType: "piercing",
    },
    properties: [],
    mastery: "sap",
  },
},
{
  id: "pike",
  name: "Pike",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["two-handed"] },
  weapon: {
    weaponKind: "martial-melee",
    damage: { dice: { count: 1, die: 10 }, damageType: "piercing" },
    properties: ["heavy", "reach", "two-handed"],
    mastery: "push",
  },
},
{
  id: "trident",
  name: "Trident",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["main-hand", "two-handed"] },
  weapon: {
    weaponKind: "martial-melee",
    damage: { dice: { count: 1, die: 8 }, damageType: "piercing" },
    versatileDamage: { dice: { count: 1, die: 10 }, damageType: "piercing" },
    properties: ["thrown", "versatile"],
    range: { normal: 20, long: 60 },
    mastery: "topple",
  },
},
{
  id: "warhammer",
  name: "Warhammer",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["main-hand", "two-handed"] },
  weapon: {
    weaponKind: "martial-melee",
    damage: { dice: { count: 1, die: 8 }, damageType: "bludgeoning" },
    versatileDamage: { dice: { count: 1, die: 10 }, damageType: "bludgeoning" },
    properties: ["versatile"],
    mastery: "push",
  },
},
{
  id: "war-pick",
  name: "War Pick",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["main-hand", "two-handed"] },
  weapon: {
    weaponKind: "martial-melee",
    damage: { dice: { count: 1, die: 8 }, damageType: "piercing" },
    versatileDamage: { dice: { count: 1, die: 10 }, damageType: "piercing" },
    properties: ["versatile"],
    mastery: "sap",
  },
},
{
  id: "whip",
  name: "Whip",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["main-hand"] },
  weapon: {
    weaponKind: "martial-melee",
    damage: { dice: { count: 1, die: 4 }, damageType: "slashing" },
    properties: ["finesse", "reach"],
    mastery: "slow",
  },
},

// === MARTIAL RANGED ===
{
  id: "blowgun",
  name: "Blowgun",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["two-handed"] },
  weapon: {
    weaponKind: "martial-ranged",
    damage: { dice: { count: 1, die: 1 }, damageType: "piercing" },
    properties: ["ammunition", "loading"],
    range: { normal: 25, long: 100 },
    mastery: "vex",
  },
},
{
  id: "hand-crossbow",
  name: "Hand Crossbow",
  category: "weapon",
  equippable: { slots: ["main-hand", "off-hand"], allowedWieldModes: ["main-hand", "off-hand"] },
  weapon: {
    weaponKind: "martial-ranged",
    damage: { dice: { count: 1, die: 6 }, damageType: "piercing" },
    properties: ["ammunition", "light", "loading"],
    range: { normal: 30, long: 120 },
    mastery: "vex",
  },
},
{
  id: "heavy-crossbow",
  name: "Heavy Crossbow",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["two-handed"] },
  weapon: {
    weaponKind: "martial-ranged",
    damage: { dice: { count: 1, die: 10 }, damageType: "piercing" },
    properties: ["ammunition", "heavy", "loading", "two-handed"],
    range: { normal: 100, long: 400 },
    mastery: "push",
  },
},
{
  id: "longbow",
  name: "Longbow",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["two-handed"] },
  weapon: {
    weaponKind: "martial-ranged",
    damage: { dice: { count: 1, die: 8 }, damageType: "piercing" },
    properties: ["ammunition", "heavy", "two-handed"],
    range: { normal: 150, long: 600 },
    mastery: "slow",
  },
},
{
  id: "musket",
  name: "Musket",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["two-handed"] },
  weapon: {
    weaponKind: "martial-ranged",
    damage: { dice: { count: 1, die: 12 }, damageType: "piercing" },
    properties: ["ammunition", "loading", "two-handed"],
    range: { normal: 40, long: 120 },
    mastery: "slow",
  },
},
{
  id: "pistol",
  name: "Pistol",
  category: "weapon",
  equippable: { slots: ["main-hand"], allowedWieldModes: ["main-hand"] },
  weapon: {
    weaponKind: "martial-ranged",
    damage: { dice: { count: 1, die: 10 }, damageType: "piercing" },
    properties: ["ammunition", "loading"],
    range: { normal: 30, long: 90 },
    mastery: "vex",
  },
},


  // === ARMOR / SHIELDS ===
  {
    id: "chain-mail",
    name: "Chain Mail",
    category: "armor",
    equippable: {
      slots: ["body"],
    },
    armor: {
      armorCategory: "heavy",
      baseAc: 16,
      dexCap: 0,
      stealthDisadvantage: true,
      strengthRequirement: 13,
    },
  },
  {
    id: "shield",
    name: "Shield",
    category: "shield",
    equippable: {
      slots: ["off-hand"],
    },
    shield: {
      acBonus: 2,
    },
  },
  // === LIGHT ARMOR ===
{
  id: "padded-armor",
  name: "Padded Armor",
  category: "armor",
  equippable: { slots: ["body"] },
  armor: {
    armorCategory: "light",
    baseAc: 11,
    dexCap: null,
    stealthDisadvantage: true,
  },
},
{
  id: "leather-armor",
  name: "Leather Armor",
  category: "armor",
  equippable: { slots: ["body"] },
  armor: {
    armorCategory: "light",
    baseAc: 11,
    dexCap: null,
    stealthDisadvantage: false,
  },
},
{
  id: "studded-leather-armor",
  name: "Studded Leather Armor",
  category: "armor",
  equippable: { slots: ["body"] },
  armor: {
    armorCategory: "light",
    baseAc: 12,
    dexCap: null,
    stealthDisadvantage: false,
  },
},

// === MEDIUM ARMOR ===
{
  id: "hide-armor",
  name: "Hide Armor",
  category: "armor",
  equippable: { slots: ["body"] },
  armor: {
    armorCategory: "medium",
    baseAc: 12,
    dexCap: 2,
    stealthDisadvantage: false,
  },
},
{
  id: "chain-shirt",
  name: "Chain Shirt",
  category: "armor",
  equippable: { slots: ["body"] },
  armor: {
    armorCategory: "medium",
    baseAc: 13,
    dexCap: 2,
    stealthDisadvantage: false,
  },
},
{
  id: "scale-mail",
  name: "Scale Mail",
  category: "armor",
  equippable: { slots: ["body"] },
  armor: {
    armorCategory: "medium",
    baseAc: 14,
    dexCap: 2,
    stealthDisadvantage: true,
  },
},
{
  id: "breastplate",
  name: "Breastplate",
  category: "armor",
  equippable: { slots: ["body"] },
  armor: {
    armorCategory: "medium",
    baseAc: 14,
    dexCap: 2,
    stealthDisadvantage: false,
  },
},
{
  id: "half-plate",
  name: "Half Plate",
  category: "armor",
  equippable: { slots: ["body"] },
  armor: {
    armorCategory: "medium",
    baseAc: 15,
    dexCap: 2,
    stealthDisadvantage: true,
  },
},

// === HEAVY ARMOR ===
{
  id: "ring-mail",
  name: "Ring Mail",
  category: "armor",
  equippable: { slots: ["body"] },
  armor: {
    armorCategory: "heavy",
    baseAc: 14,
    dexCap: 0,
    stealthDisadvantage: true,
  },
},
{
  id: "splint-armor",
  name: "Splint Armor",
  category: "armor",
  equippable: { slots: ["body"] },
  armor: {
    armorCategory: "heavy",
    baseAc: 17,
    dexCap: 0,
    stealthDisadvantage: true,
    strengthRequirement: 15,
  },
},
{
  id: "plate-armor",
  name: "Plate Armor",
  category: "armor",
  equippable: { slots: ["body"] },
  armor: {
    armorCategory: "heavy",
    baseAc: 18,
    dexCap: 0,
    stealthDisadvantage: true,
    strengthRequirement: 15,
  },
},


  // === AMMUNITION ===
  { id: "arrow", name: "Arrow", category: "ammunition", stackable: true },
  {
    id: "crossbow-bolt",
    name: "Crossbow Bolt",
    category: "ammunition",
    stackable: true,
  },
  { id: "firearm-bullet", name: "Firearm Bullet", category: "ammunition", stackable: true },
  { id: "sling-bullet", name: "Sling Bullet", category: "ammunition", stackable: true },
  { id: "blowgun-needle", name: "Blowgun Needle", category: "ammunition", stackable: true },

  // === TOOLS ===
  { id: "thieves-tools", name: "Thieves' Tools", category: "tool" },
  {
    id: "calligraphers-supplies",
    name: "Calligrapher's Supplies",
    category: "tool",
  },
  { id: "carpenters-tools", name: "Carpenter's Tools", category: "tool" },
  {
    id: "cartographers-tools",
    name: "Cartographer's Tools",
    category: "tool",
  },
  { id: "herbalism-kit", name: "Herbalism Kit", category: "tool" },
  { id: "navigators-tools", name: "Navigator's Tools", category: "tool" },
  { id: "forgery-kit", name: "Forgery Kit", category: "tool" },
  { id: "gamers-set", name: "Gaming Set", category: "tool" },
  { id: "musical-instrument", name: "Musical Instrument", category: "tool" },
  {
    id: "disguise-kit",
    name: "Disguise Kit",
    category: "tool",
  },
  {
    id: "poisoners-kit",
    name: "Poisoner's Kit",
    category: "tool",
  },

  // Artisan tools
  { id: "alchemists-supplies", name: "Alchemist's Supplies", category: "tool" },
  { id: "brewers-supplies", name: "Brewer's Supplies", category: "tool" },
  { id: "cooks-utensils", name: "Cook's Utensils", category: "tool" },
  { id: "glassblowers-tools", name: "Glassblower's Tools", category: "tool" },
  { id: "jewelers-tools", name: "Jeweler's Tools", category: "tool" },
  {
    id: "leatherworkers-tools",
    name: "Leatherworker's Tools",
    category: "tool",
  },
  { id: "masons-tools", name: "Mason's Tools", category: "tool" },
  { id: "painters-supplies", name: "Painter's Supplies", category: "tool" },
  { id: "potters-tools", name: "Potter's Tools", category: "tool" },
  { id: "smiths-tools", name: "Smith's Tools", category: "tool" },
  { id: "tinkers-tools", name: "Tinker's Tools", category: "tool" },
  { id: "weavers-tools", name: "Weaver's Tools", category: "tool" },
  { id: "woodcarvers-tools", name: "Woodcarver's Tools", category: "tool" },
  {
    id: "cobblers-tools",
    name: "Cobbler's Tools",
    category: "tool",
  },

  // === GEAR ===
  { id: "rope", name: "Rope", category: "gear" },
  { id: "crowbar", name: "Crowbar", category: "gear" },
  { id: "shovel", name: "Shovel", category: "gear" },
  { id: "iron-pot", name: "Iron Pot", category: "gear" },
  { id: "bedroll", name: "Bedroll", category: "gear" },
  { id: "tent", name: "Tent", category: "gear" },
  { id: "mirror", name: "Mirror", category: "gear" },
  { id: "manacles", name: "Manacles", category: "gear" },
  { id: "book", name: "Book", category: "gear" },
  { id: "lamp", name: "Lamp", category: "gear" },
  { id: "hooded-lantern", name: "Hooded Lantern", category: "gear" },

  // === CONTAINERS ===
  { id: "pouch", name: "Pouch", category: "container" },
  { id: "quiver", name: "Quiver", category: "container" },
  { id: "priests-pack", name: "Priest's Pack", category: "container" },

  // === CONSUMABLES ===
  { id: "oil", name: "Oil (flask)", category: "consumable", stackable: true },
  { id: "healers-kit", name: "Healer's Kit", category: "consumable" },
  { id: "perfume", name: "Perfume", category: "consumable" },
  { id: "parchment", name: "Parchment", category: "consumable", stackable: true },

  // === CLOTHING ===
  { id: "travelers-clothes", name: "Traveler's Clothes", category: "clothing" },
  { id: "fine-clothes", name: "Fine Clothes", category: "clothing" },
  { id: "costume", name: "Costume", category: "clothing" },
  { id: "robe", name: "Robe", category: "clothing" },

  // === MAGIC / SYMBOLS ===
  {
    id: "holy-symbol",
    name: "Holy Symbol",
    category: "holy-symbol",
    equippable: {
      slots: ["neck"],
    },
  },

  // Adventuring Gear
  // === ADDITIONAL GEAR ===
{ id: "acid", name: "Acid (vial)", category: "consumable", stackable: true },
{ id: "alchemists-fire", name: "Alchemist's Fire", category: "consumable", stackable: true },
{ id: "antitoxin", name: "Antitoxin", category: "consumable" },

{ id: "arcane-focus", name: "Arcane Focus", category: "gear" },

{ id: "backpack", name: "Backpack", category: "container" },
{ id: "ball-bearings", name: "Ball Bearings", category: "gear", stackable: true },
{ id: "barrel", name: "Barrel", category: "container" },
{ id: "basket", name: "Basket", category: "container" },

{ id: "bell", name: "Bell", category: "gear" },
{ id: "blanket", name: "Blanket", category: "gear" },
{ id: "block-and-tackle", name: "Block and Tackle", category: "gear" },

{ id: "glass-bottle", name: "Glass Bottle", category: "container" },
{ id: "bucket", name: "Bucket", category: "container" },

{ id: "burglars-pack", name: "Burglar's Pack", category: "container" },
{ id: "diplomats-pack", name: "Diplomat's Pack", category: "container" },
{ id: "dungeoneers-pack", name: "Dungeoneer's Pack", category: "container" },
{ id: "entertainers-pack", name: "Entertainer's Pack", category: "container" },
{ id: "explorers-pack", name: "Explorer's Pack", category: "container" },
{ id: "scholars-pack", name: "Scholar's Pack", category: "container" },

{ id: "caltrops", name: "Caltrops", category: "gear", stackable: true },
{ id: "candle", name: "Candle", category: "consumable", stackable: true },

{ id: "crossbow-bolt-case", name: "Crossbow Bolt Case", category: "container" },
{ id: "map-scroll-case", name: "Map or Scroll Case", category: "container" },

{ id: "chain", name: "Chain", category: "gear" },
{ id: "chest", name: "Chest", category: "container" },

{ id: "climbers-kit", name: "Climber's Kit", category: "gear" },

{ id: "component-pouch", name: "Component Pouch", category: "gear" },
{ id: "costume", name: "Costume", category: "clothing" }, // (already exists, skip if duplicate)

{ id: "druidic-focus", name: "Druidic Focus", category: "gear" },

{ id: "flask", name: "Flask", category: "container" },
{ id: "grappling-hook", name: "Grappling Hook", category: "gear" },

{ id: "holy-water", name: "Holy Water", category: "consumable" },
{ id: "hunting-trap", name: "Hunting Trap", category: "gear" },

{ id: "ink", name: "Ink", category: "consumable", stackable: true },
{ id: "ink-pen", name: "Ink Pen", category: "gear" },

{ id: "jug", name: "Jug", category: "container" },
{ id: "ladder", name: "Ladder", category: "gear" },

{ id: "bullseye-lantern", name: "Bullseye Lantern", category: "gear" },

{ id: "lock", name: "Lock", category: "gear" },
{ id: "magnifying-glass", name: "Magnifying Glass", category: "gear" },

{ id: "map", name: "Map", category: "gear" },

{ id: "net", name: "Net", category: "gear" },

{ id: "paper", name: "Paper", category: "consumable", stackable: true },

{ id: "basic-poison", name: "Basic Poison", category: "consumable" },

{ id: "pole", name: "Pole", category: "gear" },

{ id: "potion-of-healing", name: "Potion of Healing", category: "consumable", stackable: true },

{ id: "portable-ram", name: "Portable Ram", category: "gear" },

{ id: "rations", name: "Rations", category: "consumable", stackable: true },

{ id: "sack", name: "Sack", category: "container" },

{ id: "signal-whistle", name: "Signal Whistle", category: "gear" },

{ id: "spell-scroll-cantrip", name: "Spell Scroll (Cantrip)", category: "consumable" },
{ id: "spell-scroll-level-1", name: "Spell Scroll (Level 1)", category: "consumable" },

{ id: "iron-spikes", name: "Iron Spikes", category: "gear", stackable: true },

{ id: "spyglass", name: "Spyglass", category: "gear" },

{ id: "string", name: "String", category: "gear", stackable: true },

{ id: "tinderbox", name: "Tinderbox", category: "gear" },

{ id: "torch", name: "Torch", category: "consumable", stackable: true },

{ id: "vial", name: "Vial", category: "container", stackable: true },

{ id: "waterskin", name: "Waterskin", category: "container" },
];

export const itemsById = Object.fromEntries(
  items.map((item) => [item.id, item]),
) as Record<string, Item>;