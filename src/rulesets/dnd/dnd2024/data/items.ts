import type { Item } from "../types";

export const createMagicWeaponVariant = (
  baseItem: Item,
  bonus: 1 | 2,
): Item => {
  if (!baseItem.weapon) {
    throw new Error(`Item ${baseItem.id} is not a weapon.`);
  }

  return {
    ...baseItem,
    id: `${baseItem.id}-plus-${bonus}`,
    name: `${baseItem.name} +${bonus}`,
    magical: true,
    attackBonus: bonus,
    damageBonus: bonus,
    description: baseItem.description
      ? `${baseItem.description} This is a magical weapon that grants a +${bonus} bonus to attack and damage rolls made with it.`
      : `A magical weapon that grants a +${bonus} bonus to attack and damage rolls made with it.`,
  };
};

export const createMagicArmorVariant = (
  baseItem: Item,
  bonus: 1 | 2,
): Item => {
  if (!baseItem.armor && !baseItem.shield) {
    throw new Error(`Item ${baseItem.id} is not armor or a shield.`);
  }

  return {
    ...baseItem,
    id: `${baseItem.id}-plus-${bonus}`,
    name: `${baseItem.name} +${bonus}`,
    magical: true,
    acBonus: bonus,
    description: baseItem.description
      ? `${baseItem.description} This is magical equipment that grants a +${bonus} bonus to AC while equipped.`
      : `Magical equipment that grants a +${bonus} bonus to AC while equipped.`,
  };
};

export const magicWeaponBaseIds = [
  "dagger",
  "shortsword",
  "longsword",
  "scimitar",
  "rapier",
  "shortbow",
  "light-crossbow",
  "sling",
  "quarterstaff",
  "spear",
  "sickle",
  "javelin",
  "club",
  "greatclub",
  "handaxe",
  "light-hammer",
  "mace",
  "dart",
  "battleaxe",
  "flail",
  "glaive",
  "greataxe",
  "greatsword",
  "halberd",
  "lance",
  "maul",
  "morningstar",
  "pike",
  "trident",
  "warhammer",
  "war-pick",
  "whip",
  "blowgun",
  "hand-crossbow",
  "heavy-crossbow",
  "longbow",
  "musket",
  "pistol",
] as const;

const magicArmorBaseIds = [
  "shield",
  "padded-armor",
  "leather-armor",
  "studded-leather-armor",
  "hide-armor",
  "chain-shirt",
  "scale-mail",
  "breastplate",
  "half-plate",
  "ring-mail",
  "chain-mail",
  "splint-armor",
  "plate-armor",
] as const;

const rawItems: Item[] = [
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
      allowedWieldModes: ["two-handed"],
      slotProfile: "ranged-weapon",
      slots: [],
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
      allowedWieldModes: ["two-handed"],
      slotProfile: "ranged-weapon",
      slots: [],
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
  equippable: {
    allowedWieldModes: ["main-hand", "off-hand"],
    slotProfile: "ranged-weapon",
    slots: [],
  },
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
  equippable: {
    allowedWieldModes: ["two-handed"],
    slotProfile: "ranged-weapon",
    slots: [],
  },
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
  equippable: {
      allowedWieldModes: ["two-handed"],
      slotProfile: "ranged-weapon",
      slots: [],
    },
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
    description:
      "Includes parchment, inks, quills, rulers, and measuring instruments. Used to create maps and charts. You can add your proficiency bonus to checks related to navigation, geography, and map-making.",
  },
  {
    id: "herbalism-kit",
    name: "Herbalism Kit",
    category: "tool",
    description:
      "This kit includes tools for identifying plants and creating herbal remedies. Proficiency with the herbalism kit allows you to add your proficiency bonus to checks to identify plants, create potions, and treat wounds. It is required to craft Potions of Healing.",
  },
  { id: "navigators-tools", name: "Navigator's Tools", category: "tool" },
  { id: "forgery-kit", name: "Forgery Kit", category: "tool" },
  { id: "gamers-set", name: "Gaming Set", category: "tool" },
  { id: "musical-instrument", name: "Musical Instrument", category: "tool" },
  
  // === MUSICAL INSTRUMENTS ===
  { id: "bagpipes", name: "Bagpipes", category: "tool" },
  { id: "drum", name: "Drum", category: "tool" },
  { id: "dulcimer", name: "Dulcimer", category: "tool" },
  { id: "flute", name: "Flute", category: "tool" },
  { id: "horn", name: "Horn", category: "tool" },
  { id: "lute", name: "Lute", category: "tool" },
  { id: "lyre", name: "Lyre", category: "tool" },
  { id: "pan-flute", name: "Pan Flute", category: "tool" },
  { id: "shawm", name: "Shawm", category: "tool" },
  { id: "viol", name: "Viol", category: "tool" },
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
  {
    id: "crowbar",
    name: "Crowbar",
    category: "adventuring-gear",
    description:
      "Using a crowbar grants advantage on Strength checks where the crowbar’s leverage can be applied.",
  },
  { id: "shovel", name: "Shovel", category: "gear" },
  { id: "iron-pot", name: "Iron Pot", category: "gear" },
  { id: "bedroll", name: "Bedroll", category: "gear" },
  { id: "tent", name: "Tent", category: "gear" },
  { id: "mirror", name: "Mirror", category: "gear" },
  { id: "manacles", name: "Manacles", category: "gear" },
  { id: "book", name: "Book", category: "gear" },
  {
    id: "spellbook",
    name: "Spellbook",
    category: "adventuring-gear",
    weight: 3,
    cost: { gp: 50 },
    description:
      "A leather-bound tome with 100 blank vellum pages suitable for recording spells.",
  },
  { id: "lamp", name: "Lamp", category: "gear" },
  { id: "hooded-lantern", name: "Hooded Lantern", category: "gear" },

  // === CONTAINERS ===
  { id: "pouch", name: "Pouch", category: "container" },
  { id: "quiver", name: "Quiver", category: "container" },
  {
    id: "priests-pack",
    name: "Priest's Pack",
    category: "container",
    weight: 29,
    cost: { gp: 33 },
    description:
      "A pack containing essential supplies for a traveling priest or cleric, including sacred items and basic provisions.",
    contents: [
      { itemId: "backpack", name: "Backpack", quantity: 1 },
      { itemId: "blanket", name: "Blanket", quantity: 1 },
      { itemId: "holy-water", name: "Holy Water", quantity: 1 },
      { itemId: "lamp", name: "Lamp", quantity: 1 },
      { itemId: "rations", name: "Rations", quantity: 7, notes: "7 days" },
      { itemId: "robe", name: "Robe", quantity: 1 },
      { itemId: "tinderbox", name: "Tinderbox", quantity: 1 },
    ],
  },

  // === CONSUMABLES ===
  {
    id: "oil",
    name: "Oil (flask)",
    category: "consumable",
    description:
      "As an action, you can splash oil onto a creature within 5 feet or throw it up to 20 feet. On a hit, the target is covered in oil. If the target takes fire damage before the oil dries (1 minute), it takes an extra 5 fire damage.",
  },
  {
    id: "healers-kit",
    name: "Healer's Kit",
    category: "adventuring-gear",
    description:
      "This kit has 10 uses. As an action, you can expend one use to stabilize a creature that has 0 hit points, without needing to make a Medicine check.",
  },
  { id: "perfume", name: "Perfume", category: "consumable" },
  { id: "parchment", name: "Parchment", category: "consumable", stackable: true },

  // === CLOTHING ===
  {
    id: "travelers-clothes",
    name: "Traveler's Clothes",
    category: "adventuring-gear",
    stackable: true,
    description:
      "A set of sturdy, practical clothes suited for travel. Includes boots, a cloak, and durable garments designed to withstand long journeys and varying weather conditions.",
  },
  { id: "fine-clothes", name: "Fine Clothes", category: "clothing", stackable: true },
  { id: "costume", name: "Costume", category: "clothing", stackable: true },
  { id: "robe", name: "Robe", category: "clothing", stackable: true },

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
{
  id: "acid",
  name: "Acid (vial)",
  category: "consumable",
  description:
    "As an action, you can splash this vial onto a creature within 5 feet or throw it up to 20 feet. Make a ranged attack roll. On a hit, the target takes 2d6 acid damage.",
},
{
  id: "alchemists-fire",
  name: "Alchemist's Fire",
  category: "consumable",
  description:
    "As an action, you can throw this flask up to 20 feet. On a hit, the target takes 1d4 fire damage at the start of each of its turns. A creature can end this damage by using its action to make a DC 10 Dexterity check to extinguish the flames.",
},
{ id: "antitoxin", name: "Antitoxin", category: "consumable" },

{ id: "arcane-focus", name: "Arcane Focus", category: "gear" },

{ id: "backpack", name: "Backpack", category: "container" },
{
  id: "ball-bearings",
  name: "Ball Bearings (1,000)",
  category: "adventuring-gear",
  description:
    "As an action, you can spread these over a 10-foot square. A creature moving through the area must succeed on a DC 10 Dexterity saving throw or fall prone.",
},
{ id: "barrel", name: "Barrel", category: "container" },
{ id: "basket", name: "Basket", category: "container" },

{
  id: "bell",
  name: "Bell",
  category: "adventuring-gear",
  description:
    "A small metal bell that can be attached to a string or object to create an audible alert when disturbed.",
},
{ id: "blanket", name: "Blanket", category: "gear" },
{ id: "block-and-tackle", name: "Block and Tackle", category: "gear" },

{ id: "glass-bottle", name: "Glass Bottle", category: "container" },
{
  id: "hammer",
  name: "Hammer",
  category: "adventuring-gear",
  description:
    "A basic tool used for driving pitons, breaking objects, or light construction work.",
},
{ id: "bucket", name: "Bucket", category: "container" },

{
  id: "burglars-pack",
  name: "Burglar's Pack",
  category: "container",
  description:
    "A pack containing common tools and supplies useful for infiltration and adventuring.",
  contents: [
    { itemId: "backpack", name: "Backpack", quantity: 1 },
    { name: "Bag of 1,000 ball bearings", quantity: 1 },
    { name: "String", quantity: 1, notes: "10 feet" },
    { itemId: "bell", name: "Bell", quantity: 1 },
    { itemId: "candle", name: "Candle", quantity: 5 },
    { itemId: "crowbar", name: "Crowbar", quantity: 1 },
    { itemId: "hammer", name: "Hammer", quantity: 1 },
    { itemId: "piton", name: "Piton", quantity: 10 },
    { itemId: "hooded-lantern", name: "Hooded Lantern", quantity: 1 },
    { itemId: "oil", name: "Flask of Oil", quantity: 2 },
    { itemId: "rations", name: "Rations", quantity: 5, notes: "5 days" },
    { itemId: "tinderbox", name: "Tinderbox", quantity: 1 },
    { itemId: "waterskin", name: "Waterskin", quantity: 1 },
    { itemId: "hempen-rope", name: "Hempen Rope", quantity: 1, notes: "50 feet" },
  ],
},
{ id: "diplomats-pack", name: "Diplomat's Pack", category: "container" },
{ id: "dungeoneers-pack", name: "Dungeoneer's Pack", category: "container" },
{ id: "entertainers-pack", name: "Entertainer's Pack", category: "container" },
{
  id: "explorers-pack",
  name: "Explorer's Pack",
  category: "container",
  description:
    "A pack containing essential gear for travel, survival, and extended journeys into the wild.",
  contents: [
    { itemId: "backpack", name: "Backpack", quantity: 1 },
    { itemId: "bedroll", name: "Bedroll", quantity: 1 },
    { itemId: "mess-kit", name: "Mess Kit", quantity: 1 },
    { itemId: "tinderbox", name: "Tinderbox", quantity: 1 },
    { itemId: "torch", name: "Torch", quantity: 10 },
    { itemId: "rations", name: "Rations", quantity: 10, notes: "10 days" },
    { itemId: "waterskin", name: "Waterskin", quantity: 1 },
    { itemId: "hempen-rope", name: "Hempen Rope", quantity: 1, notes: "50 feet" },
  ],
},
{ id: "scholars-pack", name: "Scholar's Pack", category: "container" },

{
  id: "caltrops",
  name: "Caltrops (20)",
  category: "adventuring-gear",
  description:
    "As an action, you can spread these over a 5-foot square. A creature moving through the area must succeed on a DC 15 Dexterity saving throw or stop moving and take 1 piercing damage. Until it regains at least 1 hit point, its walking speed is reduced by 10 feet.",
},
{ id: "candle", name: "Candle", category: "consumable", stackable: true },

{ id: "crossbow-bolt-case", name: "Crossbow Bolt Case", category: "container" },
{ id: "map-scroll-case", name: "Map or Scroll Case", category: "container" },

{ id: "chain", name: "Chain", category: "gear" },
{ id: "chest", name: "Chest", category: "container" },

{ id: "climbers-kit", name: "Climber's Kit", category: "gear" },

{ id: "component-pouch", name: "Component Pouch", category: "gear" },

{ id: "druidic-focus", name: "Druidic Focus", category: "gear" },

{ id: "flask", name: "Flask", category: "container" },
{
  id: "grappling-hook",
  name: "Grappling Hook",
  category: "adventuring-gear",
  description:
    "You can use a grappling hook with rope to climb surfaces, secure lines, or retrieve objects at a distance. The DM may call for an Athletics check to use effectively.",
},
{
  id: "holy-water",
  name: "Holy Water",
  category: "consumable",
  description:
    "As an action, you can splash this water onto a creature within 5 feet or throw it up to 20 feet. Against undead or fiends, it deals 2d6 radiant damage.",
},
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

{
  id: "potion-of-healing",
  name: "Potion of Healing",
  category: "consumable",
  description:
    "You regain 2d4 + 2 hit points when you drink this potion. Drinking or administering it takes an action.",
},

{
  id: "potion-of-invisibility",
  name: "Potion of Invisibility",
  category: "consumable",
  stackable: true,
  description:
    "When you drink this potion, you become invisible for 1 hour. Anything you are wearing or carrying is invisible with you. The effect ends early if you attack or cast a spell.",
},

{ id: "portable-ram", name: "Portable Ram", category: "gear" },

{ id: "rations", name: "Rations", category: "consumable", stackable: true },

{ id: "sack", name: "Sack", category: "container" },

{ id: "signal-whistle", name: "Signal Whistle", category: "gear" },

{ id: "spell-scroll-cantrip", name: "Spell Scroll (Cantrip)", category: "consumable", stackable: false },
{ id: "spell-scroll-level-1", name: "Spell Scroll (Level 1)", category: "consumable", stackable: false },

{ id: "iron-spikes", name: "Iron Spikes", category: "gear", stackable: true },

{ id: "spyglass", name: "Spyglass", category: "gear" },

{ id: "string", name: "String", category: "gear", stackable: true },

{ id: "tinderbox", name: "Tinderbox", category: "gear" },

{ id: "torch", name: "Torch", category: "consumable", stackable: true },

{ id: "vial", name: "Vial", category: "container", stackable: true },

{ id: "waterskin", name: "Waterskin", category: "container" },

  // === MISSING PACK CONTENT ITEMS ===
  {
    id: "piton",
    name: "Piton",
    category: "gear",
    stackable: true,
    description:
      "A metal spike used with a hammer to secure ropes, climb, or anchor equipment.",
  },
  {
    id: "hempen-rope",
    name: "Hempen Rope",
    category: "gear",
    stackable: true,
    description:
      "A 50-foot length of hempen rope suitable for climbing, tying, hauling, and securing equipment.",
  },
  {
    id: "mess-kit",
    name: "Mess Kit",
    category: "gear",
    description:
      "A compact set of utensils and cookware used for preparing and eating meals while traveling.",
  },

  // === UNIQUE MAGIC ITEMS MIGRATED FROM THE OLD ITEM CATALOG ===
  {
    id: "boots-of-striding-and-springing",
    name: "Boots of Striding and Springing",
    category: "gear",
    magical: true,
    description:
      "Your speed while you wear these boots becomes 30 feet unless your walking speed is higher, and your speed is not reduced if you are encumbered or wearing heavy armor. In addition, whenever you jump, you can jump three times the normal distance.",
  },
  {
    id: "gauntlets-of-ogre-power",
    name: "Gauntlets of Ogre Power",
    category: "gear",
    magical: true,
    description:
      "While you wear these gauntlets, your Strength becomes 19. If your Strength is already 19 or higher, the gauntlets have no effect on you.",
  },
  {
    id: "potion-of-flying",
    name: "Potion of Flying",
    category: "consumable",
    magical: true,
    stackable: true,
    description:
      "This potion gives you a flying speed equal to your walking speed for 1 hour. If the potion wears off while you are flying and nothing else is holding you aloft, you must use your movement to descend. If you fail to land before 1 minute passes, you fall.",
  },
  {
    id: "potion-of-vitality",
    name: "Potion of Vitality",
    category: "consumable",
    magical: true,
    stackable: true,
    description:
      "Drinking this potion removes any exhaustion you are suffering, cures any disease or poison affecting you, and maximizes the effect of any Hit Die you spend to regain hit points within the next 24 hours.",
  },
  {
    id: "ring-of-protection",
    name: "Ring of Protection",
    category: "gear",
    magical: true,
    description:
      "While you are wearing this ring and are attuned to it, you have a +1 bonus to your Armor Class and saving throws.",
  },
  {
    id: "spell-scroll",
    name: "Spell Scroll",
    category: "consumable",
    magical: true,
    stackable: false,
    description:
      "A spell scroll bears the words of a single spell written in a mystical cipher. Once the spell is cast from the scroll, the words fade and the scroll crumbles to dust.",
  },
  {
    id: "spider-staff",
    name: "Spider Staff",
    category: "weapon",
    magical: true,
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
    description:
      "The top of this black adamantine staff is shaped like a spider. It can be wielded as a quarterstaff and deals an extra 1d6 poison damage on a hit. The staff has 10 charges that can fuel Spider Climb and Web, and it regains charges each day at dusk.",
  },
  {
    id: "staff-of-defense",
    name: "Staff of Defense",
    category: "weapon",
    magical: true,
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
    description:
      "While holding this magical staff, you have a +1 bonus to Armor Class. The staff has 10 charges that can be used to cast Mage Armor or Shield, and it regains charges each day at dawn.",
  },
  {
    id: "wand-of-magic-missiles",
    name: "Wand of Magic Missiles",
    category: "gear",
    magical: true,
    description:
      "This wand has 7 charges. While holding it, you can expend charges to cast Magic Missile. The wand regains expended charges each day at dawn.",
  },
  {
    id: "wand-of-eldritch-blast",
    name: "Wand of Eldritch Blast",
    category: "gear",
    magical: true,
    description:
      "This wand has 13 charges. While holding it, you can expend charges to cast Eldritch Blast using Charisma and your proficiency bonus. The wand regains expended charges each day at sunset.",
  },
  {
    id: "horde-sword",
    name: "Hordesword",
    category: "weapon",
    magical: true,
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
    description:
      "You gain a +2 bonus to attack and damage rolls made with this sword against Orcs, Half-orcs, and Ogres. The blade emits an azure glow when orcish creatures are nearby and flares brightly when spilling orcish blood.",
  },
];

const applyDefaultStackability = (item: Item): Item => {
  if (typeof item.stackable === "boolean") {
    return item;
  }

  /*
   * Default to stacking ordinary items.
   *
   * Separate instances are only required when an item can carry meaningful
   * per-instance state, such as equipment state, magic-item state, charges,
   * attunement, or other unique properties.
   *
   * This means mundane tools, gear, containers, clothing, consumables,
   * ammunition, books, rope, kits, instruments, and similar items naturally
   * render as quantities such as "2× Thieves' Tools".
   */
  if (
    item.equippable ||
    item.weapon ||
    item.armor ||
    item.shield ||
    item.magical
  ) {
    return item;
  }

  return {
    ...item,
    stackable: true,
  };
};

export const items: Item[] = rawItems.map(applyDefaultStackability);

const baseItemsById = Object.fromEntries(items.map((item) => [item.id, item]));

const magicItems: Item[] = [
  ...magicWeaponBaseIds.flatMap((id) => {
    const baseItem = baseItemsById[id];
    if (!baseItem) return [];
    return [
      createMagicWeaponVariant(baseItem, 1),
      createMagicWeaponVariant(baseItem, 2),
    ];
  }),
  ...magicArmorBaseIds.flatMap((id) => {
    const baseItem = baseItemsById[id];
    if (!baseItem) return [];
    return [
      createMagicArmorVariant(baseItem, 1),
      createMagicArmorVariant(baseItem, 2),
    ];
  }),
];

export const allItems: Item[] = [...items, ...magicItems];
export const itemsById = Object.fromEntries(
  allItems.map((item) => [item.id, item]),
) as Record<string, Item>;