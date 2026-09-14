import type { Item } from "../types";

export const createMagicWeaponVariant = (
  baseItem: Item,
  bonus: 1 | 2 | 3,
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
      ? `${baseItem.description} This magical weapon grants a +${bonus} bonus to attack and damage rolls made with it.`
      : `A magical weapon that grants a +${bonus} bonus to attack and damage rolls made with it.`,
  };
};

export const createMagicArmorVariant = (
  baseItem: Item,
  bonus: 1 | 2 | 3,
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
      ? `${baseItem.description} This magical equipment grants a +${bonus} bonus to AC while equipped.`
      : `Magical equipment that grants a +${bonus} bonus to AC while equipped.`,
  };
};

export const magicWeaponBaseIds = [
  "dagger", "shortsword", "longsword", "scimitar", "rapier", "shortbow",
  "light-crossbow", "sling", "quarterstaff", "spear", "sickle", "javelin",
  "club", "greatclub", "handaxe", "light-hammer", "mace", "dart",
  "battleaxe", "flail", "glaive", "greataxe", "greatsword", "halberd",
  "lance", "maul", "morningstar", "pike", "trident", "warhammer",
  "war-pick", "whip", "blowgun", "hand-crossbow", "heavy-crossbow",
  "longbow", "musket", "pistol",
] as const;

const magicArmorBaseIds = [
  "shield", "padded-armor", "leather-armor", "studded-leather-armor",
  "hide-armor", "chain-shirt", "scale-mail", "breastplate", "half-plate",
  "ring-mail", "chain-mail", "splint-armor", "plate-armor",
] as const;

const rawItems: Item[] = [
  // === WEAPONS ===
  {
      id: "club",
      name: "Club",
      category: "weapon",
      weight: 2,
      cost: {
        sp: 1,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "off-hand"],
      },
      weapon: {
        weaponKind: "simple-melee",
        damage: {
          dice: {
            count: 1,
            die: 4,
          },
          damageType: "bludgeoning",
        },
        properties: ["light"],
        mastery: "slow",
      },
    },
  {
      id: "dagger",
      name: "Dagger",
      category: "weapon",
      weight: 1,
      cost: {
        gp: 2,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "off-hand"],
      },
      weapon: {
        weaponKind: "simple-melee",
        damage: {
          dice: {
            count: 1,
            die: 4,
          },
          damageType: "piercing",
        },
        properties: ["finesse", "light", "thrown"],
        mastery: "nick",
        range: {
          normal: 20,
          long: 60,
        },
      },
    },
  {
      id: "greatclub",
      name: "Greatclub",
      category: "weapon",
      weight: 10,
      cost: {
        sp: 2,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["two-handed"],
      },
      weapon: {
        weaponKind: "simple-melee",
        damage: {
          dice: {
            count: 1,
            die: 8,
          },
          damageType: "bludgeoning",
        },
        properties: ["two-handed"],
        mastery: "push",
      },
    },
  {
      id: "handaxe",
      name: "Handaxe",
      category: "weapon",
      weight: 2,
      cost: {
        gp: 5,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "off-hand"],
      },
      weapon: {
        weaponKind: "simple-melee",
        damage: {
          dice: {
            count: 1,
            die: 6,
          },
          damageType: "slashing",
        },
        properties: ["light", "thrown"],
        mastery: "vex",
        range: {
          normal: 20,
          long: 60,
        },
      },
    },
  {
      id: "javelin",
      name: "Javelin",
      category: "weapon",
      weight: 2,
      cost: {
        sp: 5,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "off-hand"],
      },
      weapon: {
        weaponKind: "simple-melee",
        damage: {
          dice: {
            count: 1,
            die: 6,
          },
          damageType: "piercing",
        },
        properties: ["thrown"],
        mastery: "slow",
        range: {
          normal: 30,
          long: 120,
        },
      },
    },
  {
      id: "light-hammer",
      name: "Light Hammer",
      category: "weapon",
      weight: 2,
      cost: {
        gp: 2,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "off-hand"],
      },
      weapon: {
        weaponKind: "simple-melee",
        damage: {
          dice: {
            count: 1,
            die: 4,
          },
          damageType: "bludgeoning",
        },
        properties: ["light", "thrown"],
        mastery: "nick",
        range: {
          normal: 20,
          long: 60,
        },
      },
    },
  {
      id: "mace",
      name: "Mace",
      category: "weapon",
      weight: 4,
      cost: {
        gp: 5,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["main-hand"],
      },
      weapon: {
        weaponKind: "simple-melee",
        damage: {
          dice: {
            count: 1,
            die: 6,
          },
          damageType: "bludgeoning",
        },
        properties: [],
        mastery: "sap",
      },
    },
  {
      id: "quarterstaff",
      name: "Quarterstaff",
      category: "weapon",
      weight: 4,
      cost: {
        sp: 2,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "two-handed"],
      },
      weapon: {
        weaponKind: "simple-melee",
        damage: {
          dice: {
            count: 1,
            die: 6,
          },
          damageType: "bludgeoning",
        },
        properties: ["versatile"],
        mastery: "topple",
        versatileDamage: {
          dice: {
            count: 1,
            die: 8,
          },
          damageType: "bludgeoning",
        },
      },
    },
  {
      id: "sickle",
      name: "Sickle",
      category: "weapon",
      weight: 2,
      cost: {
        gp: 1,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "off-hand"],
      },
      weapon: {
        weaponKind: "simple-melee",
        damage: {
          dice: {
            count: 1,
            die: 4,
          },
          damageType: "slashing",
        },
        properties: ["light"],
        mastery: "nick",
      },
    },
  {
      id: "spear",
      name: "Spear",
      category: "weapon",
      weight: 3,
      cost: {
        gp: 1,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "off-hand", "two-handed"],
      },
      weapon: {
        weaponKind: "simple-melee",
        damage: {
          dice: {
            count: 1,
            die: 6,
          },
          damageType: "piercing",
        },
        properties: ["thrown", "versatile"],
        mastery: "sap",
        versatileDamage: {
          dice: {
            count: 1,
            die: 8,
          },
          damageType: "piercing",
        },
        range: {
          normal: 20,
          long: 60,
        },
      },
    },
  {
      id: "dart",
      name: "Dart",
      category: "weapon",
      weight: 0.25,
      cost: {
        cp: 5,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "off-hand"],
      },
      weapon: {
        weaponKind: "simple-ranged",
        damage: {
          dice: {
            count: 1,
            die: 4,
          },
          damageType: "piercing",
        },
        properties: ["finesse", "thrown"],
        mastery: "vex",
        range: {
          normal: 20,
          long: 60,
        },
      },
    },
  {
      id: "light-crossbow",
      name: "Light Crossbow",
      category: "weapon",
      weight: 5,
      cost: {
        gp: 25,
      },
      equippable: {
        slots: [],
        allowedWieldModes: ["two-handed"],
        slotProfile: "ranged-weapon",
      },
      weapon: {
        weaponKind: "simple-ranged",
        damage: {
          dice: {
            count: 1,
            die: 8,
          },
          damageType: "piercing",
        },
        properties: ["ammunition", "loading", "two-handed"],
        mastery: "slow",
        range: {
          normal: 80,
          long: 320,
        },
        ammunitionType: "crossbow-bolt",
      },
    },
  {
      id: "shortbow",
      name: "Shortbow",
      category: "weapon",
      weight: 2,
      cost: {
        gp: 25,
      },
      equippable: {
        slots: [],
        allowedWieldModes: ["two-handed"],
        slotProfile: "ranged-weapon",
      },
      weapon: {
        weaponKind: "simple-ranged",
        damage: {
          dice: {
            count: 1,
            die: 6,
          },
          damageType: "piercing",
        },
        properties: ["ammunition", "two-handed"],
        mastery: "vex",
        range: {
          normal: 80,
          long: 320,
        },
        ammunitionType: "arrow",
      },
    },
  {
      id: "sling",
      name: "Sling",
      category: "weapon",
      weight: 0,
      cost: {
        sp: 1,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "off-hand"],
      },
      weapon: {
        weaponKind: "simple-ranged",
        damage: {
          dice: {
            count: 1,
            die: 4,
          },
          damageType: "bludgeoning",
        },
        properties: ["ammunition"],
        mastery: "slow",
        range: {
          normal: 30,
          long: 120,
        },
        ammunitionType: "sling-bullet",
      },
    },
  {
      id: "battleaxe",
      name: "Battleaxe",
      category: "weapon",
      weight: 4,
      cost: {
        gp: 10,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["main-hand", "two-handed"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 8,
          },
          damageType: "slashing",
        },
        properties: ["versatile"],
        mastery: "topple",
        versatileDamage: {
          dice: {
            count: 1,
            die: 10,
          },
          damageType: "slashing",
        },
      },
    },
  {
      id: "flail",
      name: "Flail",
      category: "weapon",
      weight: 2,
      cost: {
        gp: 10,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["main-hand"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 8,
          },
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
      weight: 6,
      cost: {
        gp: 20,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["two-handed"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 10,
          },
          damageType: "slashing",
        },
        properties: ["heavy", "reach", "two-handed"],
        mastery: "graze",
      },
    },
  {
      id: "greataxe",
      name: "Greataxe",
      category: "weapon",
      weight: 7,
      cost: {
        gp: 30,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["two-handed"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 12,
          },
          damageType: "slashing",
        },
        properties: ["heavy", "two-handed"],
        mastery: "cleave",
      },
    },
  {
      id: "greatsword",
      name: "Greatsword",
      category: "weapon",
      weight: 6,
      cost: {
        gp: 50,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["two-handed"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 2,
            die: 6,
          },
          damageType: "slashing",
        },
        properties: ["heavy", "two-handed"],
        mastery: "graze",
      },
    },
  {
      id: "halberd",
      name: "Halberd",
      category: "weapon",
      weight: 6,
      cost: {
        gp: 20,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["two-handed"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 10,
          },
          damageType: "slashing",
        },
        properties: ["heavy", "reach", "two-handed"],
        mastery: "cleave",
      },
    },
  {
      id: "lance",
      name: "Lance",
      category: "weapon",
      weight: 6,
      cost: {
        gp: 10,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["main-hand", "two-handed"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 10,
          },
          damageType: "piercing",
        },
        properties: ["heavy", "reach", "two-handed"],
        mastery: "topple",
        mountedOneHanded: true,
      },
    },
  {
      id: "longsword",
      name: "Longsword",
      category: "weapon",
      weight: 3,
      cost: {
        gp: 15,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "off-hand", "two-handed"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 8,
          },
          damageType: "slashing",
        },
        properties: ["versatile"],
        mastery: "sap",
        versatileDamage: {
          dice: {
            count: 1,
            die: 10,
          },
          damageType: "slashing",
        },
      },
    },
  {
      id: "maul",
      name: "Maul",
      category: "weapon",
      weight: 10,
      cost: {
        gp: 10,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["two-handed"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 2,
            die: 6,
          },
          damageType: "bludgeoning",
        },
        properties: ["heavy", "two-handed"],
        mastery: "topple",
      },
    },
  {
      id: "morningstar",
      name: "Morningstar",
      category: "weapon",
      weight: 4,
      cost: {
        gp: 15,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["main-hand"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 8,
          },
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
      weight: 18,
      cost: {
        gp: 5,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["two-handed"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 10,
          },
          damageType: "piercing",
        },
        properties: ["heavy", "reach", "two-handed"],
        mastery: "push",
      },
    },
  {
      id: "rapier",
      name: "Rapier",
      category: "weapon",
      weight: 2,
      cost: {
        gp: 25,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["main-hand"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 8,
          },
          damageType: "piercing",
        },
        properties: ["finesse"],
        mastery: "vex",
      },
    },
  {
      id: "scimitar",
      name: "Scimitar",
      category: "weapon",
      weight: 3,
      cost: {
        gp: 25,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "off-hand"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 6,
          },
          damageType: "slashing",
        },
        properties: ["finesse", "light"],
        mastery: "nick",
      },
    },
  {
      id: "shortsword",
      name: "Shortsword",
      category: "weapon",
      weight: 2,
      cost: {
        gp: 10,
      },
      equippable: {
        slots: ["main-hand", "off-hand"],
        allowedWieldModes: ["main-hand", "off-hand"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 6,
          },
          damageType: "piercing",
        },
        properties: ["finesse", "light"],
        mastery: "vex",
      },
    },
  {
      id: "trident",
      name: "Trident",
      category: "weapon",
      weight: 4,
      cost: {
        gp: 5,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["main-hand", "two-handed"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 8,
          },
          damageType: "piercing",
        },
        properties: ["thrown", "versatile"],
        mastery: "topple",
        versatileDamage: {
          dice: {
            count: 1,
            die: 10,
          },
          damageType: "piercing",
        },
        range: {
          normal: 20,
          long: 60,
        },
      },
    },
  {
      id: "warhammer",
      name: "Warhammer",
      category: "weapon",
      weight: 5,
      cost: {
        gp: 15,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["main-hand", "two-handed"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 8,
          },
          damageType: "bludgeoning",
        },
        properties: ["versatile"],
        mastery: "push",
        versatileDamage: {
          dice: {
            count: 1,
            die: 10,
          },
          damageType: "bludgeoning",
        },
      },
    },
  {
      id: "war-pick",
      name: "War Pick",
      category: "weapon",
      weight: 2,
      cost: {
        gp: 5,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["main-hand", "two-handed"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 8,
          },
          damageType: "piercing",
        },
        properties: ["versatile"],
        mastery: "sap",
        versatileDamage: {
          dice: {
            count: 1,
            die: 10,
          },
          damageType: "piercing",
        },
      },
    },
  {
      id: "whip",
      name: "Whip",
      category: "weapon",
      weight: 3,
      cost: {
        gp: 2,
      },
      equippable: {
        slots: ["main-hand"],
        allowedWieldModes: ["main-hand"],
      },
      weapon: {
        weaponKind: "martial-melee",
        damage: {
          dice: {
            count: 1,
            die: 4,
          },
          damageType: "slashing",
        },
        properties: ["finesse", "reach"],
        mastery: "slow",
      },
    },
  {
      id: "blowgun",
      name: "Blowgun",
      category: "weapon",
      weight: 1,
      cost: {
        gp: 10,
      },
      equippable: {
        slots: [],
        allowedWieldModes: ["main-hand"],
        slotProfile: "ranged-weapon",
      },
      weapon: {
        weaponKind: "martial-ranged",
        damage: {
          dice: {
            count: 1,
            die: 1,
          },
          damageType: "piercing",
        },
        properties: ["ammunition", "loading"],
        mastery: "vex",
        range: {
          normal: 25,
          long: 100,
        },
        ammunitionType: "blowgun-needle",
      },
    },
  {
      id: "hand-crossbow",
      name: "Hand Crossbow",
      category: "weapon",
      weight: 3,
      cost: {
        gp: 75,
      },
      equippable: {
        slots: [],
        allowedWieldModes: ["main-hand", "off-hand"],
        slotProfile: "ranged-weapon",
      },
      weapon: {
        weaponKind: "martial-ranged",
        damage: {
          dice: {
            count: 1,
            die: 6,
          },
          damageType: "piercing",
        },
        properties: ["ammunition", "light", "loading"],
        mastery: "vex",
        range: {
          normal: 30,
          long: 120,
        },
        ammunitionType: "crossbow-bolt",
      },
    },
  {
      id: "heavy-crossbow",
      name: "Heavy Crossbow",
      category: "weapon",
      weight: 18,
      cost: {
        gp: 50,
      },
      equippable: {
        slots: [],
        allowedWieldModes: ["two-handed"],
        slotProfile: "ranged-weapon",
      },
      weapon: {
        weaponKind: "martial-ranged",
        damage: {
          dice: {
            count: 1,
            die: 10,
          },
          damageType: "piercing",
        },
        properties: ["ammunition", "heavy", "loading", "two-handed"],
        mastery: "push",
        range: {
          normal: 100,
          long: 400,
        },
        ammunitionType: "crossbow-bolt",
      },
    },
  {
      id: "longbow",
      name: "Longbow",
      category: "weapon",
      weight: 2,
      cost: {
        gp: 50,
      },
      equippable: {
        slots: [],
        allowedWieldModes: ["two-handed"],
        slotProfile: "ranged-weapon",
      },
      weapon: {
        weaponKind: "martial-ranged",
        damage: {
          dice: {
            count: 1,
            die: 8,
          },
          damageType: "piercing",
        },
        properties: ["ammunition", "heavy", "two-handed"],
        mastery: "slow",
        range: {
          normal: 150,
          long: 600,
        },
        ammunitionType: "arrow",
      },
    },
  {
      id: "musket",
      name: "Musket",
      category: "weapon",
      weight: 10,
      cost: {
        gp: 500,
      },
      equippable: {
        slots: [],
        allowedWieldModes: ["two-handed"],
        slotProfile: "ranged-weapon",
      },
      weapon: {
        weaponKind: "martial-ranged",
        damage: {
          dice: {
            count: 1,
            die: 12,
          },
          damageType: "piercing",
        },
        properties: ["ammunition", "loading", "two-handed"],
        mastery: "slow",
        range: {
          normal: 40,
          long: 120,
        },
        ammunitionType: "firearm-bullet",
      },
    },
  {
      id: "pistol",
      name: "Pistol",
      category: "weapon",
      weight: 3,
      cost: {
        gp: 250,
      },
      equippable: {
        slots: [],
        allowedWieldModes: ["main-hand"],
        slotProfile: "ranged-weapon",
      },
      weapon: {
        weaponKind: "martial-ranged",
        damage: {
          dice: {
            count: 1,
            die: 10,
          },
          damageType: "piercing",
        },
        properties: ["ammunition", "loading"],
        mastery: "vex",
        range: {
          normal: 30,
          long: 90,
        },
        ammunitionType: "firearm-bullet",
      },
    },

  // === ARMOR / SHIELDS ===
  {
      id: "padded-armor",
      name: "Padded Armor",
      category: "armor",
      weight: 8,
      cost: {
        gp: 5,
      },
      equippable: {
        slots: ["armor"],
      },
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
      weight: 10,
      cost: {
        gp: 10,
      },
      equippable: {
        slots: ["armor"],
      },
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
      weight: 13,
      cost: {
        gp: 45,
      },
      equippable: {
        slots: ["armor"],
      },
      armor: {
        armorCategory: "light",
        baseAc: 12,
        dexCap: null,
        stealthDisadvantage: false,
      },
    },
  {
      id: "hide-armor",
      name: "Hide Armor",
      category: "armor",
      weight: 12,
      cost: {
        gp: 10,
      },
      equippable: {
        slots: ["armor"],
      },
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
      weight: 20,
      cost: {
        gp: 50,
      },
      equippable: {
        slots: ["armor"],
      },
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
      weight: 45,
      cost: {
        gp: 50,
      },
      equippable: {
        slots: ["armor"],
      },
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
      weight: 20,
      cost: {
        gp: 400,
      },
      equippable: {
        slots: ["armor"],
      },
      armor: {
        armorCategory: "medium",
        baseAc: 14,
        dexCap: 2,
        stealthDisadvantage: false,
      },
    },
  {
      id: "half-plate",
      name: "Half Plate Armor",
      category: "armor",
      weight: 40,
      cost: {
        gp: 750,
      },
      equippable: {
        slots: ["armor"],
      },
      armor: {
        armorCategory: "medium",
        baseAc: 15,
        dexCap: 2,
        stealthDisadvantage: true,
      },
    },
  {
      id: "ring-mail",
      name: "Ring Mail",
      category: "armor",
      weight: 40,
      cost: {
        gp: 30,
      },
      equippable: {
        slots: ["armor"],
      },
      armor: {
        armorCategory: "heavy",
        baseAc: 14,
        dexCap: 0,
        stealthDisadvantage: true,
      },
    },
  {
      id: "chain-mail",
      name: "Chain Mail",
      category: "armor",
      weight: 55,
      cost: {
        gp: 75,
      },
      equippable: {
        slots: ["armor"],
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
      id: "splint-armor",
      name: "Splint Armor",
      category: "armor",
      weight: 60,
      cost: {
        gp: 200,
      },
      equippable: {
        slots: ["armor"],
      },
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
      weight: 65,
      cost: {
        gp: 1500,
      },
      equippable: {
        slots: ["armor"],
      },
      armor: {
        armorCategory: "heavy",
        baseAc: 18,
        dexCap: 0,
        stealthDisadvantage: true,
        strengthRequirement: 15,
      },
    },
  {
      id: "shield",
      name: "Shield",
      category: "shield",
      weight: 6,
      cost: {
        gp: 10,
      },
      equippable: {
        slots: ["off-hand"],
      },
      shield: {
        acBonus: 2,
      },
      actions: [
        {
          name: "Don or Doff",
          activation: "utilize",
          description: "Don or doff the shield.",
        },
      ],
    },

  // === AMMUNITION ===
  {
      id: "arrow",
      name: "Arrows (20)",
      category: "ammunition",
      stackable: true,
      weight: 1,
      cost: {
        gp: 1,
      },
      ammunition: {
        bundleSize: 20,
        storageItemId: "quiver",
      },
    },
  {
      id: "crossbow-bolt",
      name: "Bolts (20)",
      category: "ammunition",
      stackable: true,
      weight: 1.5,
      cost: {
        gp: 1,
      },
      ammunition: {
        bundleSize: 20,
        storageItemId: "crossbow-bolt-case",
      },
    },
  {
      id: "firearm-bullet",
      name: "Firearm Bullets (10)",
      category: "ammunition",
      stackable: true,
      weight: 2,
      cost: {
        gp: 3,
      },
      ammunition: {
        bundleSize: 10,
        storageItemId: "pouch",
      },
    },
  {
      id: "sling-bullet",
      name: "Sling Bullets (20)",
      category: "ammunition",
      stackable: true,
      weight: 1.5,
      cost: {
        cp: 4,
      },
      ammunition: {
        bundleSize: 20,
        storageItemId: "pouch",
      },
    },
  {
      id: "blowgun-needle",
      name: "Needles (50)",
      category: "ammunition",
      stackable: true,
      weight: 1,
      cost: {
        gp: 1,
      },
      ammunition: {
        bundleSize: 50,
        storageItemId: "pouch",
      },
    },

  // === TOOLS ===
  {
      id: "alchemists-supplies",
      name: "Alchemist's Supplies",
      category: "tool",
      weight: 8,
      cost: {
        gp: 50,
      },
      tool: {
        ability: "int",
        utilize: [
          {
            description: "Identify a substance",
            dc: 15,
          },
          {
            description: "Start a fire",
            dc: 15,
          },
        ],
        craft: ["acid", "alchemists-fire", "component-pouch", "oil", "paper", "perfume"],
      },
    },
  {
      id: "brewers-supplies",
      name: "Brewer's Supplies",
      category: "tool",
      weight: 9,
      cost: {
        gp: 20,
      },
      tool: {
        ability: "int",
        utilize: [
          {
            description: "Detect a poisoned drink",
            dc: 15,
          },
          {
            description: "Identify alcohol",
            dc: 10,
          },
        ],
        craft: ["antitoxin"],
      },
    },
  {
      id: "calligraphers-supplies",
      name: "Calligrapher's Supplies",
      category: "tool",
      weight: 5,
      cost: {
        gp: 10,
      },
      tool: {
        ability: "dex",
        utilize: [
          {
            description: "Write flourished text that is difficult to forge",
            dc: 15,
          },
        ],
        craft: ["ink", "spell-scroll"],
      },
    },
  {
      id: "carpenters-tools",
      name: "Carpenter's Tools",
      category: "tool",
      weight: 6,
      cost: {
        gp: 8,
      },
      tool: {
        ability: "str",
        utilize: [
          {
            description: "Seal or pry open a door or container",
            dc: 20,
          },
        ],
        craft: [
          "club",
          "greatclub",
          "quarterstaff",
          "barrel",
          "chest",
          "ladder",
          "pole",
          "portable-ram",
          "torch",
        ],
      },
    },
  {
      id: "cartographers-tools",
      name: "Cartographer's Tools",
      category: "tool",
      weight: 6,
      cost: {
        gp: 15,
      },
      tool: {
        ability: "wis",
        utilize: [
          {
            description: "Draft a map of a small area",
            dc: 15,
          },
        ],
        craft: ["map"],
      },
    },
  {
      id: "cobblers-tools",
      name: "Cobbler's Tools",
      category: "tool",
      weight: 5,
      cost: {
        gp: 5,
      },
      tool: {
        ability: "dex",
        utilize: [
          {
            description: "Modify footwear to aid the wearer’s next Acrobatics check",
            dc: 10,
          },
        ],
        craft: ["climbers-kit"],
      },
    },
  {
      id: "cooks-utensils",
      name: "Cook's Utensils",
      category: "tool",
      weight: 8,
      cost: {
        gp: 1,
      },
      tool: {
        ability: "wis",
        utilize: [
          {
            description: "Improve the flavor of food",
            dc: 10,
          },
          {
            description: "Detect spoiled or poisoned food",
            dc: 15,
          },
        ],
        craft: ["rations"],
      },
    },
  {
      id: "glassblowers-tools",
      name: "Glassblower's Tools",
      category: "tool",
      weight: 5,
      cost: {
        gp: 30,
      },
      tool: {
        ability: "int",
        utilize: [
          {
            description: "Discern what a glass object held in the past 24 hours",
            dc: 15,
          },
        ],
        craft: ["glass-bottle", "magnifying-glass", "spyglass", "vial"],
      },
    },
  {
      id: "jewelers-tools",
      name: "Jeweler's Tools",
      category: "tool",
      weight: 2,
      cost: {
        gp: 25,
      },
      tool: {
        ability: "int",
        utilize: [
          {
            description: "Discern a gem’s value",
            dc: 15,
          },
        ],
        craft: ["arcane-focus", "holy-symbol"],
      },
    },
  {
      id: "leatherworkers-tools",
      name: "Leatherworker's Tools",
      category: "tool",
      weight: 5,
      cost: {
        gp: 5,
      },
      tool: {
        ability: "dex",
        utilize: [
          {
            description: "Add a design to a leather item",
            dc: 10,
          },
        ],
        craft: [
          "sling",
          "whip",
          "hide-armor",
          "leather-armor",
          "studded-leather-armor",
          "backpack",
          "crossbow-bolt-case",
          "map-scroll-case",
          "parchment",
          "pouch",
          "quiver",
          "waterskin",
        ],
      },
    },
  {
      id: "masons-tools",
      name: "Mason's Tools",
      category: "tool",
      weight: 8,
      cost: {
        gp: 10,
      },
      tool: {
        ability: "str",
        utilize: [
          {
            description: "Chisel a symbol or hole in stone",
            dc: 10,
          },
        ],
        craft: ["block-and-tackle"],
      },
    },
  {
      id: "painters-supplies",
      name: "Painter's Supplies",
      category: "tool",
      weight: 5,
      cost: {
        gp: 10,
      },
      tool: {
        ability: "wis",
        utilize: [
          {
            description: "Paint a recognizable image of something you have seen",
            dc: 10,
          },
        ],
        craft: ["druidic-focus", "holy-symbol"],
      },
    },
  {
      id: "potters-tools",
      name: "Potter's Tools",
      category: "tool",
      weight: 3,
      cost: {
        gp: 10,
      },
      tool: {
        ability: "int",
        utilize: [
          {
            description: "Discern what a ceramic object held in the past 24 hours",
            dc: 15,
          },
        ],
        craft: ["jug", "lamp"],
      },
    },
  {
      id: "smiths-tools",
      name: "Smith's Tools",
      category: "tool",
      weight: 8,
      cost: {
        gp: 20,
      },
      tool: {
        ability: "str",
        utilize: [
          {
            description: "Pry open a door or container",
            dc: 20,
          },
        ],
        craft: [
          "melee-weapons",
          "medium-armor",
          "heavy-armor",
          "ball-bearings",
          "bucket",
          "caltrops",
          "chain",
          "crowbar",
          "firearm-bullet",
          "grappling-hook",
          "iron-pot",
          "iron-spikes",
          "sling-bullet",
        ],
      },
    },
  {
      id: "tinkers-tools",
      name: "Tinker's Tools",
      category: "tool",
      weight: 10,
      cost: {
        gp: 50,
      },
      tool: {
        ability: "dex",
        utilize: [
          {
            description: "Assemble a Tiny item from scrap that lasts 1 minute",
            dc: 20,
          },
        ],
        craft: [
          "musket",
          "pistol",
          "bell",
          "bullseye-lantern",
          "flask",
          "hooded-lantern",
          "hunting-trap",
          "lock",
          "manacles",
          "mirror",
          "shovel",
          "signal-whistle",
          "tinderbox",
        ],
      },
    },
  {
      id: "weavers-tools",
      name: "Weaver's Tools",
      category: "tool",
      weight: 5,
      cost: {
        gp: 1,
      },
      tool: {
        ability: "dex",
        utilize: [
          {
            description: "Mend a tear in clothing",
            dc: 10,
          },
          {
            description: "Sew a Tiny design",
            dc: 10,
          },
        ],
        craft: [
          "padded-armor",
          "basket",
          "bedroll",
          "blanket",
          "fine-clothes",
          "net",
          "robe",
          "rope",
          "sack",
          "string",
          "tent",
          "travelers-clothes",
        ],
      },
    },
  {
      id: "woodcarvers-tools",
      name: "Woodcarver's Tools",
      category: "tool",
      weight: 5,
      cost: {
        gp: 1,
      },
      tool: {
        ability: "dex",
        utilize: [
          {
            description: "Carve a pattern in wood",
            dc: 10,
          },
        ],
        craft: [
          "club",
          "greatclub",
          "quarterstaff",
          "ranged-weapons",
          "arcane-focus",
          "arrow",
          "crossbow-bolt",
          "druidic-focus",
          "ink-pen",
          "blowgun-needle",
        ],
      },
    },
  {
      id: "disguise-kit",
      name: "Disguise Kit",
      category: "tool",
      weight: 3,
      cost: {
        gp: 25,
      },
      tool: {
        ability: "cha",
        utilize: [
          {
            description: "Apply makeup",
            dc: 10,
          },
        ],
        craft: ["costume"],
      },
    },
  {
      id: "forgery-kit",
      name: "Forgery Kit",
      category: "tool",
      weight: 5,
      cost: {
        gp: 15,
      },
      tool: {
        ability: "dex",
        utilize: [
          {
            description: "Mimic 10 or fewer words of handwriting",
            dc: 15,
          },
          {
            description: "Duplicate a wax seal",
            dc: 20,
          },
        ],
      },
    },
  {
      id: "herbalism-kit",
      name: "Herbalism Kit",
      category: "tool",
      weight: 3,
      cost: {
        gp: 5,
      },
      tool: {
        ability: "int",
        utilize: [
          {
            description: "Identify a plant",
            dc: 10,
          },
        ],
        craft: ["antitoxin", "candle", "healers-kit", "potion-of-healing"],
      },
    },
  {
      id: "navigators-tools",
      name: "Navigator's Tools",
      category: "tool",
      weight: 2,
      cost: {
        gp: 25,
      },
      tool: {
        ability: "wis",
        utilize: [
          {
            description: "Plot a course",
            dc: 10,
          },
          {
            description: "Determine position by stargazing",
            dc: 15,
          },
        ],
      },
    },
  {
      id: "poisoners-kit",
      name: "Poisoner's Kit",
      category: "tool",
      weight: 2,
      cost: {
        gp: 50,
      },
      tool: {
        ability: "int",
        utilize: [
          {
            description: "Detect a poisoned object",
            dc: 10,
          },
        ],
        craft: ["basic-poison"],
      },
    },
  {
      id: "thieves-tools",
      name: "Thieves' Tools",
      category: "tool",
      weight: 1,
      cost: {
        gp: 25,
      },
      tool: {
        ability: "dex",
        utilize: [
          {
            description: "Pick a lock",
            dc: 15,
          },
          {
            description: "Disarm a trap",
            dc: 15,
          },
        ],
      },
    },
  {
      id: "gamers-set",
      name: "Gaming Set",
      category: "tool",
      description: "Choose a specific gaming set; each variant is a separate tool proficiency.",
      tool: {
        ability: "wis",
        utilize: [
          {
            description: "Discern whether someone is cheating",
            dc: 10,
          },
          {
            description: "Win the game",
            dc: 20,
          },
        ],
      },
    },
  {
      id: "dice-set",
      name: "Dice Set",
      category: "tool",
      cost: {
        sp: 1,
      },
      tool: {
        ability: "wis",
        utilize: [
          {
            description: "Discern whether someone is cheating",
            dc: 10,
          },
          {
            description: "Win the game",
            dc: 20,
          },
        ],
      },
    },
  {
      id: "dragonchess-set",
      name: "Dragonchess Set",
      category: "tool",
      cost: {
        gp: 1,
      },
      tool: {
        ability: "wis",
        utilize: [
          {
            description: "Discern whether someone is cheating",
            dc: 10,
          },
          {
            description: "Win the game",
            dc: 20,
          },
        ],
      },
    },
  {
      id: "playing-card-set",
      name: "Playing Card Set",
      category: "tool",
      cost: {
        sp: 5,
      },
      tool: {
        ability: "wis",
        utilize: [
          {
            description: "Discern whether someone is cheating",
            dc: 10,
          },
          {
            description: "Win the game",
            dc: 20,
          },
        ],
      },
    },
  {
      id: "three-dragon-ante-set",
      name: "Three-Dragon Ante Set",
      category: "tool",
      cost: {
        gp: 1,
      },
      tool: {
        ability: "wis",
        utilize: [
          {
            description: "Discern whether someone is cheating",
            dc: 10,
          },
          {
            description: "Win the game",
            dc: 20,
          },
        ],
      },
    },
  {
      id: "musical-instrument",
      name: "Musical Instrument",
      category: "tool",
      description: "Choose a specific instrument; each instrument is a separate tool proficiency.",
      tool: {
        ability: "cha",
        utilize: [
          {
            description: "Play a known tune",
            dc: 10,
          },
          {
            description: "Improvise a song",
            dc: 15,
          },
        ],
      },
    },
  {
      id: "bagpipes",
      name: "Bagpipes",
      category: "tool",
      weight: 6,
      cost: {
        gp: 30,
      },
      tool: {
        ability: "cha",
        utilize: [
          {
            description: "Play a known tune",
            dc: 10,
          },
          {
            description: "Improvise a song",
            dc: 15,
          },
        ],
      },
    },
  {
      id: "drum",
      name: "Drum",
      category: "tool",
      weight: 3,
      cost: {
        gp: 6,
      },
      tool: {
        ability: "cha",
        utilize: [
          {
            description: "Play a known tune",
            dc: 10,
          },
          {
            description: "Improvise a song",
            dc: 15,
          },
        ],
      },
    },
  {
      id: "dulcimer",
      name: "Dulcimer",
      category: "tool",
      weight: 10,
      cost: {
        gp: 25,
      },
      tool: {
        ability: "cha",
        utilize: [
          {
            description: "Play a known tune",
            dc: 10,
          },
          {
            description: "Improvise a song",
            dc: 15,
          },
        ],
      },
    },
  {
      id: "flute",
      name: "Flute",
      category: "tool",
      weight: 1,
      cost: {
        gp: 2,
      },
      tool: {
        ability: "cha",
        utilize: [
          {
            description: "Play a known tune",
            dc: 10,
          },
          {
            description: "Improvise a song",
            dc: 15,
          },
        ],
      },
    },
  {
      id: "horn",
      name: "Horn",
      category: "tool",
      weight: 2,
      cost: {
        gp: 3,
      },
      tool: {
        ability: "cha",
        utilize: [
          {
            description: "Play a known tune",
            dc: 10,
          },
          {
            description: "Improvise a song",
            dc: 15,
          },
        ],
      },
    },
  {
      id: "lute",
      name: "Lute",
      category: "tool",
      weight: 2,
      cost: {
        gp: 35,
      },
      tool: {
        ability: "cha",
        utilize: [
          {
            description: "Play a known tune",
            dc: 10,
          },
          {
            description: "Improvise a song",
            dc: 15,
          },
        ],
      },
    },
  {
      id: "lyre",
      name: "Lyre",
      category: "tool",
      weight: 2,
      cost: {
        gp: 30,
      },
      tool: {
        ability: "cha",
        utilize: [
          {
            description: "Play a known tune",
            dc: 10,
          },
          {
            description: "Improvise a song",
            dc: 15,
          },
        ],
      },
    },
  {
      id: "pan-flute",
      name: "Pan Flute",
      category: "tool",
      weight: 2,
      cost: {
        gp: 12,
      },
      tool: {
        ability: "cha",
        utilize: [
          {
            description: "Play a known tune",
            dc: 10,
          },
          {
            description: "Improvise a song",
            dc: 15,
          },
        ],
      },
    },
  {
      id: "shawm",
      name: "Shawm",
      category: "tool",
      weight: 1,
      cost: {
        gp: 2,
      },
      tool: {
        ability: "cha",
        utilize: [
          {
            description: "Play a known tune",
            dc: 10,
          },
          {
            description: "Improvise a song",
            dc: 15,
          },
        ],
      },
    },
  {
      id: "viol",
      name: "Viol",
      category: "tool",
      weight: 1,
      cost: {
        gp: 30,
      },
      tool: {
        ability: "cha",
        utilize: [
          {
            description: "Play a known tune",
            dc: 10,
          },
          {
            description: "Improvise a song",
            dc: 15,
          },
        ],
      },
    },

  // === ADVENTURING GEAR / FOCUSES / PACKS ===
  {
      id: "acid",
      name: "Acid (vial)",
      category: "consumable",
      weight: 1,
      cost: {
        gp: 25,
      },
      description: "A corrosive vial that can replace one attack from the Attack action.",
      actions: [
        {
          name: "Throw Acid",
          activation: "attack-replacement",
          description: "Throw at a creature or object within 20 feet. On a failed Dexterity save, the target takes 2d6 acid damage.",
          range: 20,
          save: {
            ability: "dex",
            dcFormula: "8+dex+proficiency",
          },
        },
      ],
    },
  {
      id: "alchemists-fire",
      name: "Alchemist's Fire",
      category: "consumable",
      weight: 1,
      cost: {
        gp: 50,
      },
      description: "An incendiary flask that can replace one attack from the Attack action.",
      actions: [
        {
          name: "Throw Alchemist's Fire",
          activation: "attack-replacement",
          description: "Throw at a creature or object within 20 feet. On a failed Dexterity save, it takes 1d4 fire damage and starts burning.",
          range: 20,
          save: {
            ability: "dex",
            dcFormula: "8+dex+proficiency",
          },
        },
      ],
    },
  {
      id: "antitoxin",
      name: "Antitoxin",
      category: "consumable",
      cost: {
        gp: 50,
      },
      description: "For 1 hour after drinking it, you have advantage on saving throws to avoid or end the Poisoned condition.",
      actions: [
        {
          name: "Drink Antitoxin",
          activation: "bonus-action",
          description: "Drink the vial to gain the antitoxin benefit for 1 hour.",
        },
      ],
    },
  {
      id: "arcane-focus",
      name: "Arcane Focus",
      category: "gear",
      description: "A generic arcane spellcasting focus. Choose a crystal, orb, rod, staff, or wand when a specific form matters.",
      spellcastingFocus: {
        tradition: "arcane",
        usage: "held",
      },
    },
  {
      id: "arcane-focus-crystal",
      name: "Arcane Focus — Crystal",
      category: "gear",
      weight: 1,
      cost: {
        gp: 10,
      },
      spellcastingFocus: {
        tradition: "arcane",
        usage: "held",
      },
    },
  {
      id: "arcane-focus-orb",
      name: "Arcane Focus — Orb",
      category: "gear",
      weight: 3,
      cost: {
        gp: 20,
      },
      spellcastingFocus: {
        tradition: "arcane",
        usage: "held",
      },
    },
  {
      id: "arcane-focus-rod",
      name: "Arcane Focus — Rod",
      category: "gear",
      weight: 2,
      cost: {
        gp: 10,
      },
      spellcastingFocus: {
        tradition: "arcane",
        usage: "held",
      },
    },
  {
      id: "arcane-focus-staff",
      name: "Arcane Focus — Staff",
      category: "gear",
      weight: 4,
      cost: {
        gp: 5,
      },
      spellcastingFocus: {
        tradition: "arcane",
        usage: "held",
        weaponEquivalentId: "quarterstaff",
      },
    },
  {
      id: "arcane-focus-wand",
      name: "Arcane Focus — Wand",
      category: "gear",
      weight: 1,
      cost: {
        gp: 10,
      },
      spellcastingFocus: {
        tradition: "arcane",
        usage: "held",
      },
    },
  {
      id: "backpack",
      name: "Backpack",
      category: "container",
      weight: 5,
      cost: {
        gp: 2,
      },
      description: "Holds up to 30 pounds in 1 cubic foot and can also serve as a saddlebag.",
      container: {
        capacityWeight: 30,
        capacityVolume: "1 cubic foot",
      },
    },
  {
      id: "ball-bearings",
      name: "Ball Bearings (1,000)",
      category: "adventuring-gear",
      weight: 2,
      cost: {
        gp: 1,
      },
      actions: [
        {
          name: "Spill Ball Bearings",
          activation: "utilize",
          description: "Cover a level 10-foot square within 10 feet. A creature entering the area for the first time on a turn must make a DC 10 Dexterity save or fall Prone. Recovery takes 10 minutes.",
          range: 10,
          save: {
            ability: "dex",
            dc: 10,
          },
        },
      ],
    },
  {
      id: "barrel",
      name: "Barrel",
      category: "container",
      weight: 70,
      cost: {
        gp: 2,
      },
      container: {
        capacityVolume: "40 gallons of liquid or 4 cubic feet of dry goods",
      },
    },
  {
      id: "basket",
      name: "Basket",
      category: "container",
      weight: 2,
      cost: {
        sp: 4,
      },
      container: {
        capacityWeight: 40,
        capacityVolume: "2 cubic feet",
      },
    },
  {
      id: "bedroll",
      name: "Bedroll",
      category: "gear",
      weight: 7,
      cost: {
        gp: 1,
      },
      description: "Sleeps one Small or Medium creature. A creature in it automatically succeeds on saving throws against extreme cold.",
    },
  {
      id: "bell",
      name: "Bell",
      category: "adventuring-gear",
      cost: {
        gp: 1,
      },
      actions: [
        {
          name: "Ring Bell",
          activation: "utilize",
          description: "The sound can be heard up to 60 feet away.",
        },
      ],
    },
  {
      id: "blanket",
      name: "Blanket",
      category: "gear",
      weight: 3,
      cost: {
        sp: 5,
      },
      description: "While wrapped in it, you have advantage on saving throws against extreme cold.",
    },
  {
      id: "block-and-tackle",
      name: "Block and Tackle",
      category: "gear",
      weight: 5,
      cost: {
        gp: 1,
      },
      description: "Lets you hoist up to four times the weight you could normally lift.",
    },
  {
      id: "book",
      name: "Book",
      category: "gear",
      weight: 5,
      cost: {
        gp: 25,
      },
      description: "A bound book suitable for ordinary reading, records, or reference.",
    },
  {
      id: "glass-bottle",
      name: "Glass Bottle",
      category: "container",
      weight: 2,
      cost: {
        gp: 2,
      },
      container: {
        capacityVolume: "1.5 pints",
      },
    },
  {
      id: "bucket",
      name: "Bucket",
      category: "container",
      weight: 2,
      cost: {
        cp: 5,
      },
      container: {
        capacityVolume: "3 gallons",
      },
    },
  {
      id: "burglars-pack",
      name: "Burglar's Pack",
      category: "container",
      weight: 42,
      cost: {
        gp: 16,
      },
      description: "A bundled set of infiltration and exploration supplies.",
      contents: [
        {
          itemId: "backpack",
          name: "Backpack",
          quantity: 1,
        },
        {
          itemId: "ball-bearings",
          name: "Ball Bearings",
          quantity: 1,
        },
        {
          itemId: "bell",
          name: "Bell",
          quantity: 1,
        },
        {
          itemId: "candle",
          name: "Candle",
          quantity: 10,
        },
        {
          itemId: "crowbar",
          name: "Crowbar",
          quantity: 1,
        },
        {
          itemId: "hooded-lantern",
          name: "Hooded Lantern",
          quantity: 1,
        },
        {
          itemId: "oil",
          name: "Oil",
          quantity: 7,
        },
        {
          itemId: "rations",
          name: "Rations",
          quantity: 5,
          notes: "5 days",
        },
        {
          itemId: "rope",
          name: "Rope",
          quantity: 1,
        },
        {
          itemId: "tinderbox",
          name: "Tinderbox",
          quantity: 1,
        },
        {
          itemId: "waterskin",
          name: "Waterskin",
          quantity: 1,
        },
      ],
    },
  {
      id: "caltrops",
      name: "Caltrops (20)",
      category: "adventuring-gear",
      weight: 2,
      cost: {
        gp: 1,
      },
      actions: [
        {
          name: "Spread Caltrops",
          activation: "utilize",
          description: "Cover a 5-foot square within 5 feet. A creature entering it for the first time on a turn must make a DC 15 Dexterity save or take 1 piercing damage and have Speed 0 until the start of its next turn. Recovery takes 10 minutes.",
          range: 5,
          save: {
            ability: "dex",
            dc: 15,
          },
        },
      ],
    },
  {
      id: "candle",
      name: "Candle",
      category: "consumable",
      stackable: true,
      cost: {
        cp: 1,
      },
      light: {
        brightRadius: 5,
        dimRadius: 5,
        durationMinutes: 60,
      },
    },
  {
      id: "crossbow-bolt-case",
      name: "Crossbow Bolt Case",
      category: "container",
      weight: 1,
      cost: {
        gp: 1,
      },
      container: {
        capacityItems: [
          {
            itemId: "crossbow-bolt",
            quantity: 20,
          },
        ],
      },
    },
  {
      id: "map-scroll-case",
      name: "Map or Scroll Case",
      category: "container",
      weight: 1,
      cost: {
        gp: 1,
      },
      container: {
        capacityVolume: "10 sheets of paper or 5 sheets of parchment",
      },
    },
  {
      id: "chain",
      name: "Chain",
      category: "gear",
      weight: 10,
      cost: {
        gp: 5,
      },
      description: "Can restrain a suitable grappled, incapacitated, or restrained creature; escaping or bursting it requires checks.",
      actions: [
        {
          name: "Bind with Chain",
          activation: "utilize",
          description: "Wrap the chain around a qualifying creature within 5 feet with a DC 13 Strength (Athletics) check. Bound legs impose Restrained until escape.",
          range: 5,
          check: {
            ability: "str",
            dc: 13,
            skill: "athletics",
          },
        },
      ],
    },
  {
      id: "chest",
      name: "Chest",
      category: "container",
      weight: 25,
      cost: {
        gp: 5,
      },
      container: {
        capacityVolume: "12 cubic feet",
      },
    },
  {
      id: "climbers-kit",
      name: "Climber's Kit",
      category: "gear",
      weight: 12,
      cost: {
        gp: 25,
      },
      actions: [
        {
          name: "Anchor Yourself",
          activation: "utilize",
          description: "Anchor yourself so you cannot fall more than 25 feet from the anchor and cannot move more than 25 feet away until you undo it as a Bonus Action.",
        },
      ],
    },
  {
      id: "fine-clothes",
      name: "Fine Clothes",
      category: "clothing",
      equippable: {
        slots: ["clothing"],
      },
      weight: 6,
      cost: {
        gp: 15,
      },
      description: "Expensive formal clothing suitable for places or events with a dress requirement.",
    },
  {
      id: "travelers-clothes",
      name: "Traveler's Clothes",
      category: "clothing",
      equippable: {
        slots: ["clothing"],
      },
      weight: 4,
      cost: {
        gp: 2,
      },
      description: "Durable clothing made for travel in varied environments.",
    },
  {
      id: "component-pouch",
      name: "Component Pouch",
      category: "gear",
      weight: 2,
      cost: {
        gp: 25,
      },
      description: "A watertight compartmented pouch containing the free Material components used by your spells.",
    },
  {
      id: "costume",
      name: "Costume",
      category: "clothing",
      equippable: {
        slots: ["clothing"],
      },
      weight: 4,
      cost: {
        gp: 5,
      },
      description: "While wearing it, you have advantage on checks made to impersonate the person or type it represents.",
    },
  {
      id: "crowbar",
      name: "Crowbar",
      category: "adventuring-gear",
      weight: 5,
      cost: {
        gp: 2,
      },
      description: "Grants advantage on Strength checks where leverage from the crowbar can be applied.",
    },
  {
      id: "diplomats-pack",
      name: "Diplomat's Pack",
      category: "container",
      weight: 39,
      cost: {
        gp: 39,
      },
      contents: [
        {
          itemId: "chest",
          name: "Chest",
          quantity: 1,
        },
        {
          itemId: "fine-clothes",
          name: "Fine Clothes",
          quantity: 1,
        },
        {
          itemId: "ink",
          name: "Ink",
          quantity: 1,
        },
        {
          itemId: "ink-pen",
          name: "Ink Pen",
          quantity: 5,
        },
        {
          itemId: "lamp",
          name: "Lamp",
          quantity: 1,
        },
        {
          itemId: "map-scroll-case",
          name: "Map or Scroll Case",
          quantity: 2,
        },
        {
          itemId: "oil",
          name: "Oil",
          quantity: 4,
        },
        {
          itemId: "paper",
          name: "Paper",
          quantity: 5,
        },
        {
          itemId: "parchment",
          name: "Parchment",
          quantity: 5,
        },
        {
          itemId: "perfume",
          name: "Perfume",
          quantity: 1,
        },
        {
          itemId: "tinderbox",
          name: "Tinderbox",
          quantity: 1,
        },
      ],
    },
  {
      id: "druidic-focus",
      name: "Druidic Focus",
      category: "gear",
      description: "A generic druidic spellcasting focus. Choose a specific form when it matters.",
      spellcastingFocus: {
        tradition: "druidic",
        usage: "held",
      },
    },
  {
      id: "druidic-focus-mistletoe",
      name: "Druidic Focus — Sprig of Mistletoe",
      category: "gear",
      cost: {
        gp: 1,
      },
      spellcastingFocus: {
        tradition: "druidic",
        usage: "held",
      },
    },
  {
      id: "druidic-focus-wooden-staff",
      name: "Druidic Focus — Wooden Staff",
      category: "gear",
      weight: 4,
      cost: {
        gp: 5,
      },
      spellcastingFocus: {
        tradition: "druidic",
        usage: "held",
        weaponEquivalentId: "quarterstaff",
      },
    },
  {
      id: "druidic-focus-yew-wand",
      name: "Druidic Focus — Yew Wand",
      category: "gear",
      weight: 1,
      cost: {
        gp: 10,
      },
      spellcastingFocus: {
        tradition: "druidic",
        usage: "held",
      },
    },
  {
      id: "dungeoneers-pack",
      name: "Dungeoneer's Pack",
      category: "container",
      weight: 55,
      cost: {
        gp: 12,
      },
      contents: [
        {
          itemId: "backpack",
          name: "Backpack",
          quantity: 1,
        },
        {
          itemId: "caltrops",
          name: "Caltrops",
          quantity: 1,
        },
        {
          itemId: "crowbar",
          name: "Crowbar",
          quantity: 1,
        },
        {
          itemId: "oil",
          name: "Oil",
          quantity: 2,
        },
        {
          itemId: "rations",
          name: "Rations",
          quantity: 10,
          notes: "10 days",
        },
        {
          itemId: "rope",
          name: "Rope",
          quantity: 1,
        },
        {
          itemId: "tinderbox",
          name: "Tinderbox",
          quantity: 1,
        },
        {
          itemId: "torch",
          name: "Torch",
          quantity: 10,
        },
        {
          itemId: "waterskin",
          name: "Waterskin",
          quantity: 1,
        },
      ],
    },
  {
      id: "entertainers-pack",
      name: "Entertainer's Pack",
      category: "container",
      weight: 58.5,
      cost: {
        gp: 40,
      },
      contents: [
        {
          itemId: "backpack",
          name: "Backpack",
          quantity: 1,
        },
        {
          itemId: "bedroll",
          name: "Bedroll",
          quantity: 1,
        },
        {
          itemId: "bell",
          name: "Bell",
          quantity: 1,
        },
        {
          itemId: "bullseye-lantern",
          name: "Bullseye Lantern",
          quantity: 1,
        },
        {
          itemId: "costume",
          name: "Costume",
          quantity: 3,
        },
        {
          itemId: "mirror",
          name: "Mirror",
          quantity: 1,
        },
        {
          itemId: "oil",
          name: "Oil",
          quantity: 8,
        },
        {
          itemId: "rations",
          name: "Rations",
          quantity: 9,
          notes: "9 days",
        },
        {
          itemId: "tinderbox",
          name: "Tinderbox",
          quantity: 1,
        },
        {
          itemId: "waterskin",
          name: "Waterskin",
          quantity: 1,
        },
      ],
    },
  {
      id: "explorers-pack",
      name: "Explorer's Pack",
      category: "container",
      weight: 55,
      cost: {
        gp: 10,
      },
      contents: [
        {
          itemId: "backpack",
          name: "Backpack",
          quantity: 1,
        },
        {
          itemId: "bedroll",
          name: "Bedroll",
          quantity: 1,
        },
        {
          itemId: "oil",
          name: "Oil",
          quantity: 2,
        },
        {
          itemId: "rations",
          name: "Rations",
          quantity: 10,
          notes: "10 days",
        },
        {
          itemId: "rope",
          name: "Rope",
          quantity: 1,
        },
        {
          itemId: "tinderbox",
          name: "Tinderbox",
          quantity: 1,
        },
        {
          itemId: "torch",
          name: "Torch",
          quantity: 10,
        },
        {
          itemId: "waterskin",
          name: "Waterskin",
          quantity: 1,
        },
      ],
    },
  {
      id: "flask",
      name: "Flask",
      category: "container",
      weight: 1,
      cost: {
        cp: 2,
      },
      container: {
        capacityVolume: "1 pint",
      },
    },
  {
      id: "grappling-hook",
      name: "Grappling Hook",
      category: "adventuring-gear",
      weight: 4,
      cost: {
        gp: 2,
      },
      actions: [
        {
          name: "Throw Grappling Hook",
          activation: "utilize",
          description: "Throw it at a railing, ledge, or similar catch within 50 feet. It catches on a successful DC 13 Dexterity (Acrobatics) check.",
          range: 50,
          check: {
            ability: "dex",
            dc: 13,
            skill: "acrobatics",
          },
        },
      ],
    },
  {
      id: "healers-kit",
      name: "Healer's Kit",
      category: "adventuring-gear",
      weight: 3,
      cost: {
        gp: 5,
      },
      description: "Contains 10 uses.",
      actions: [
        {
          name: "Stabilize",
          activation: "utilize",
          description: "Expend one use to stabilize an unconscious creature at 0 HP without a Medicine check.",
        },
      ],
    },
  {
      id: "holy-symbol",
      name: "Holy Symbol",
      category: "holy-symbol",
      description: "A generic divine spellcasting focus. Choose an amulet, emblem, or reliquary when a specific form matters.",
      spellcastingFocus: {
        tradition: "divine",
      },
    },
  {
      id: "holy-symbol-amulet",
      name: "Holy Symbol — Amulet",
      category: "holy-symbol",
      weight: 1,
      cost: {
        gp: 5,
      },
      equippable: {
        slots: ["neck"],
      },
      spellcastingFocus: {
        tradition: "divine",
        usage: "worn-or-held",
      },
    },
  {
      id: "holy-symbol-emblem",
      name: "Holy Symbol — Emblem",
      category: "holy-symbol",
      cost: {
        gp: 5,
      },
      spellcastingFocus: {
        tradition: "divine",
        usage: "borne-on-fabric-or-shield",
      },
    },
  {
      id: "holy-symbol-reliquary",
      name: "Holy Symbol — Reliquary",
      category: "holy-symbol",
      weight: 2,
      cost: {
        gp: 5,
      },
      spellcastingFocus: {
        tradition: "divine",
        usage: "held",
      },
    },
  {
      id: "holy-water",
      name: "Holy Water",
      category: "consumable",
      weight: 1,
      cost: {
        gp: 25,
      },
      actions: [
        {
          name: "Throw Holy Water",
          activation: "attack-replacement",
          description: "Throw at a creature within 20 feet. On a failed Dexterity save, a Fiend or Undead takes 2d8 radiant damage.",
          range: 20,
          save: {
            ability: "dex",
            dcFormula: "8+dex+proficiency",
          },
        },
      ],
    },
  {
      id: "hunting-trap",
      name: "Hunting Trap",
      category: "gear",
      weight: 25,
      cost: {
        gp: 5,
      },
      description: "A chained steel jaw trap. A creature that triggers it must make a DC 13 Dexterity save or take 1d4 piercing damage and have Speed 0 until the start of its next turn; escaping later requires a DC 13 Strength (Athletics) check.",
      actions: [
        {
          name: "Set Hunting Trap",
          activation: "utilize",
          description: "Set the trap and secure its chain to an immobile object.",
        },
      ],
    },
  {
      id: "ink",
      name: "Ink",
      category: "consumable",
      stackable: true,
      cost: {
        gp: 10,
      },
      description: "A 1-ounce bottle holds enough ink for about 500 written pages.",
    },
  {
      id: "ink-pen",
      name: "Ink Pen",
      category: "gear",
      cost: {
        cp: 2,
      },
      description: "Used with ink for writing or drawing.",
    },
  {
      id: "jug",
      name: "Jug",
      category: "container",
      weight: 4,
      cost: {
        cp: 2,
      },
      container: {
        capacityVolume: "1 gallon",
      },
    },
  {
      id: "ladder",
      name: "Ladder",
      category: "gear",
      weight: 25,
      cost: {
        sp: 1,
      },
      description: "A 10-foot ladder.",
    },
  {
      id: "lamp",
      name: "Lamp",
      category: "gear",
      weight: 1,
      cost: {
        sp: 5,
      },
      light: {
        brightRadius: 15,
        dimRadius: 30,
        fuelItemId: "oil",
      },
      description: "Burns oil; one flask fuels a lamp for a total of 6 hours.",
    },
  {
      id: "bullseye-lantern",
      name: "Bullseye Lantern",
      category: "gear",
      weight: 2,
      cost: {
        gp: 10,
      },
      light: {
        brightRadius: 60,
        dimRadius: 60,
        cone: true,
        fuelItemId: "oil",
      },
      description: "Burns oil and projects its light in a cone.",
    },
  {
      id: "hooded-lantern",
      name: "Hooded Lantern",
      category: "gear",
      weight: 2,
      cost: {
        gp: 5,
      },
      light: {
        brightRadius: 30,
        dimRadius: 30,
        fuelItemId: "oil",
      },
      description: "Burns oil. The hood can be lowered or raised as a Bonus Action; lowered, it gives only dim light in a 5-foot radius.",
      actions: [
        {
          name: "Raise or Lower Hood",
          activation: "bonus-action",
          description: "Toggle between normal light and dim light in a 5-foot radius.",
        },
      ],
    },
  {
      id: "lock",
      name: "Lock",
      category: "gear",
      weight: 1,
      cost: {
        gp: 10,
      },
      description: "Comes with a key. Without it, the lock can be picked with Thieves’ Tools and a DC 15 Dexterity (Sleight of Hand) check.",
    },
  {
      id: "magnifying-glass",
      name: "Magnifying Glass",
      category: "gear",
      cost: {
        gp: 100,
      },
      description: "Gives advantage on checks to appraise or inspect highly detailed items. With bright sunlight and tinder, it can start a fire in about 5 minutes.",
    },
  {
      id: "manacles",
      name: "Manacles",
      category: "gear",
      weight: 6,
      cost: {
        gp: 2,
      },
      description: "Used to bind a qualifying Small or Medium creature. Escaping, bursting, or picking the lock uses the listed checks in the 2024 rules.",
      actions: [
        {
          name: "Bind with Manacles",
          activation: "utilize",
          description: "Bind a qualifying creature within 5 feet with a DC 13 Dexterity (Sleight of Hand) check.",
          range: 5,
          check: {
            ability: "dex",
            dc: 13,
            skill: "sleight-of-hand",
          },
        },
      ],
    },
  {
      id: "map",
      name: "Map",
      category: "gear",
      cost: {
        gp: 1,
      },
      description: "Consulting an accurate map gives +5 to Wisdom (Survival) checks made to find your way in the depicted place.",
    },
  {
      id: "mirror",
      name: "Mirror",
      category: "gear",
      weight: 0.5,
      cost: {
        gp: 5,
      },
      description: "A handheld steel mirror useful for cosmetics, peeking around corners, or reflecting light as a signal.",
    },
  {
      id: "net",
      name: "Net",
      category: "adventuring-gear",
      weight: 3,
      cost: {
        gp: 1,
      },
      description: "A thrown restraining net. Huge or larger targets automatically succeed against it.",
      actions: [
        {
          name: "Throw Net",
          activation: "attack-replacement",
          description: "Target a creature within 15 feet. On a failed Dexterity save, it is Restrained until it escapes.",
          range: 15,
          save: {
            ability: "dex",
            dcFormula: "8+dex+proficiency",
          },
        },
      ],
    },
  {
      id: "oil",
      name: "Oil (flask)",
      category: "consumable",
      weight: 1,
      cost: {
        sp: 1,
      },
      description: "Can coat a creature or object, cover a 5-foot space, or fuel lamps and lanterns for 6 total hours. A coated target takes 5 extra fire damage if it takes fire damage before the oil dries.",
      actions: [
        {
          name: "Throw Oil",
          activation: "attack-replacement",
          description: "Throw at a creature or object within 20 feet; the target avoids being coated on a successful Dexterity save.",
          range: 20,
          save: {
            ability: "dex",
            dcFormula: "8+dex+proficiency",
          },
        },
        {
          name: "Douse Space",
          activation: "utilize",
          description: "Cover a level 5-foot square within 5 feet. If lit, it burns briefly and deals 5 fire damage to creatures entering or ending a turn there.",
          range: 5,
        },
      ],
    },
  {
      id: "paper",
      name: "Paper",
      category: "consumable",
      stackable: true,
      cost: {
        sp: 2,
      },
      description: "One sheet holds about 250 handwritten words.",
    },
  {
      id: "parchment",
      name: "Parchment",
      category: "consumable",
      stackable: true,
      cost: {
        sp: 1,
      },
      description: "One sheet holds about 250 handwritten words.",
    },
  {
      id: "perfume",
      name: "Perfume",
      category: "consumable",
      cost: {
        gp: 5,
      },
      description: "After applying it, for 1 hour you have advantage on Charisma (Persuasion) checks to influence an Indifferent Humanoid within 5 feet.",
    },
  {
      id: "basic-poison",
      name: "Basic Poison",
      category: "consumable",
      cost: {
        gp: 100,
      },
      description: "Coat one weapon or up to three pieces of ammunition. The next piercing or slashing damage dealt by the coating adds 1d4 poison damage; the coating lasts up to 1 minute or until it deals damage.",
      actions: [
        {
          name: "Apply Poison",
          activation: "bonus-action",
          description: "Coat one weapon or up to three pieces of ammunition.",
        },
      ],
    },
  {
      id: "pole",
      name: "Pole",
      category: "gear",
      weight: 7,
      cost: {
        cp: 5,
      },
      description: "A 10-foot pole. It can touch objects up to 10 feet away and grants advantage on the Athletics check for a high or long jump when used to vault.",
    },
  {
      id: "iron-pot",
      name: "Iron Pot",
      category: "container",
      weight: 10,
      cost: {
        gp: 2,
      },
      container: {
        capacityVolume: "1 gallon",
      },
    },
  {
      id: "potion-of-healing",
      name: "Potion of Healing",
      category: "consumable",
      magical: true,
      weight: 0.5,
      cost: {
        gp: 50,
      },
      description: "Drinking or administering it restores 2d4 + 2 Hit Points.",
      actions: [
        {
          name: "Drink or Administer",
          activation: "bonus-action",
          description: "Drink the potion or administer it to a creature within 5 feet; the drinker regains 2d4 + 2 Hit Points.",
          range: 5,
        },
      ],
    },
  {
      id: "pouch",
      name: "Pouch",
      category: "container",
      weight: 1,
      cost: {
        sp: 5,
      },
      container: {
        capacityWeight: 6,
        capacityVolume: "1/5 cubic foot",
      },
    },
  {
      id: "priests-pack",
      name: "Priest's Pack",
      category: "container",
      weight: 29,
      cost: {
        gp: 33,
      },
      contents: [
        {
          itemId: "backpack",
          name: "Backpack",
          quantity: 1,
        },
        {
          itemId: "blanket",
          name: "Blanket",
          quantity: 1,
        },
        {
          itemId: "holy-water",
          name: "Holy Water",
          quantity: 1,
        },
        {
          itemId: "lamp",
          name: "Lamp",
          quantity: 1,
        },
        {
          itemId: "rations",
          name: "Rations",
          quantity: 7,
          notes: "7 days",
        },
        {
          itemId: "robe",
          name: "Robe",
          quantity: 1,
        },
        {
          itemId: "tinderbox",
          name: "Tinderbox",
          quantity: 1,
        },
      ],
    },
  {
      id: "quiver",
      name: "Quiver",
      category: "container",
      weight: 1,
      cost: {
        gp: 1,
      },
      container: {
        capacityItems: [
          {
            itemId: "arrow",
            quantity: 20,
          },
        ],
      },
    },
  {
      id: "portable-ram",
      name: "Portable Ram",
      category: "gear",
      weight: 35,
      cost: {
        gp: 4,
      },
      description: "Gives +4 to Strength checks made to break down doors. A helper can give you advantage on that check.",
    },
  {
      id: "rations",
      name: "Rations",
      category: "consumable",
      stackable: true,
      weight: 2,
      cost: {
        sp: 5,
      },
      description: "One day of travel-ready food.",
    },
  {
      id: "robe",
      name: "Robe",
      category: "clothing",
      equippable: {
        slots: ["clothing"],
      },
      weight: 4,
      cost: {
        gp: 1,
      },
      description: "A robe with vocational or ceremonial significance.",
    },
  {
      id: "rope",
      name: "Rope",
      category: "gear",
      weight: 5,
      cost: {
        gp: 1,
      },
      description: "Used for knots, climbing, hauling, or binding. Tying a secure knot uses a DC 10 Dexterity (Sleight of Hand) check; the rope can be burst with a DC 20 Strength (Athletics) check.",
      actions: [
        {
          name: "Tie Knot",
          activation: "utilize",
          description: "Tie a knot with a DC 10 Dexterity (Sleight of Hand) check.",
          check: {
            ability: "dex",
            dc: 10,
            skill: "sleight-of-hand",
          },
        },
      ],
    },
  {
      id: "sack",
      name: "Sack",
      category: "container",
      weight: 0.5,
      cost: {
        cp: 1,
      },
      container: {
        capacityWeight: 30,
        capacityVolume: "1 cubic foot",
      },
    },
  {
      id: "scholars-pack",
      name: "Scholar's Pack",
      category: "container",
      weight: 22,
      cost: {
        gp: 40,
      },
      contents: [
        {
          itemId: "backpack",
          name: "Backpack",
          quantity: 1,
        },
        {
          itemId: "book",
          name: "Book",
          quantity: 1,
        },
        {
          itemId: "ink",
          name: "Ink",
          quantity: 1,
        },
        {
          itemId: "ink-pen",
          name: "Ink Pen",
          quantity: 1,
        },
        {
          itemId: "lamp",
          name: "Lamp",
          quantity: 1,
        },
        {
          itemId: "oil",
          name: "Oil",
          quantity: 10,
        },
        {
          itemId: "parchment",
          name: "Parchment",
          quantity: 10,
        },
        {
          itemId: "tinderbox",
          name: "Tinderbox",
          quantity: 1,
        },
      ],
    },
  {
      id: "shovel",
      name: "Shovel",
      category: "gear",
      weight: 5,
      cost: {
        gp: 2,
      },
      description: "One hour of work can dig a 5-foot-by-5-foot hole in soil or similar material.",
    },
  {
      id: "signal-whistle",
      name: "Signal Whistle",
      category: "gear",
      cost: {
        cp: 5,
      },
      actions: [
        {
          name: "Blow Whistle",
          activation: "utilize",
          description: "The sound can be heard up to 600 feet away.",
        },
      ],
    },
  {
      id: "spell-scroll-cantrip",
      name: "Spell Scroll (Cantrip)",
      category: "consumable",
      magical: true,
      stackable: false,
      cost: {
        gp: 30,
      },
      description: "Contains one cantrip chosen by its creator. If it is on your class spell list, you can cast it from the scroll without Material components. Scroll save DC 13; spell attack +5. The scroll is destroyed when cast.",
    },
  {
      id: "spell-scroll-level-1",
      name: "Spell Scroll (Level 1)",
      category: "consumable",
      magical: true,
      stackable: false,
      cost: {
        gp: 50,
      },
      description: "Contains one level 1 spell chosen by its creator. If it is on your class spell list, you can cast it from the scroll without Material components. Scroll save DC 13; spell attack +5. The scroll is destroyed when cast.",
    },
  {
      id: "iron-spikes",
      name: "Iron Spikes (10)",
      category: "gear",
      stackable: true,
      weight: 5,
      cost: {
        gp: 1,
      },
      description: "A bundle of ten spikes. As a Utilize action, hammer one into suitable material to jam a door or provide an anchor for rope or chain.",
      actions: [
        {
          name: "Hammer Spike",
          activation: "utilize",
          description: "Drive a spike into wood, earth, or similar material with a blunt object.",
        },
      ],
    },
  {
      id: "spyglass",
      name: "Spyglass",
      category: "gear",
      weight: 1,
      cost: {
        gp: 1000,
      },
      description: "Objects viewed through it appear twice their normal size.",
    },
  {
      id: "string",
      name: "String",
      category: "gear",
      stackable: true,
      cost: {
        sp: 1,
      },
      description: "A 10-foot length of string.",
      actions: [
        {
          name: "Tie Knot",
          activation: "utilize",
          description: "Tie a knot in the string.",
        },
      ],
    },
  {
      id: "tent",
      name: "Tent",
      category: "gear",
      weight: 20,
      cost: {
        gp: 2,
      },
      description: "Sleeps up to two Small or Medium creatures.",
    },
  {
      id: "tinderbox",
      name: "Tinderbox",
      category: "gear",
      weight: 1,
      cost: {
        sp: 5,
      },
      description: "Lights a candle, lamp, lantern, torch, or other exposed fuel as a Bonus Action; other fires take about 1 minute.",
      actions: [
        {
          name: "Light Exposed Fuel",
          activation: "bonus-action",
          description: "Light a candle, lamp, lantern, torch, or similar exposed fuel.",
        },
      ],
    },
  {
      id: "torch",
      name: "Torch",
      category: "consumable",
      stackable: true,
      weight: 1,
      cost: {
        cp: 1,
      },
      light: {
        brightRadius: 20,
        dimRadius: 20,
        durationMinutes: 60,
      },
      description: "Burns for 1 hour. It can also be used as a Simple Melee weapon that deals 1 fire damage on a hit.",
    },
  {
      id: "vial",
      name: "Vial",
      category: "container",
      stackable: true,
      cost: {
        gp: 1,
      },
      container: {
        capacityVolume: "4 ounces",
      },
    },
  {
      id: "waterskin",
      name: "Waterskin",
      category: "container",
      weight: 5,
      cost: {
        sp: 2,
      },
      container: {
        capacityVolume: "4 pints",
      },
      description: "Weight is listed when full.",
    },

  // === EXISTING EXTRA ITEMS ===
  {
      id: "spellbook",
      name: "Spellbook",
      category: "adventuring-gear",
      weight: 3,
      cost: {
        gp: 50,
      },
      description: "A leather-bound tome with 100 blank vellum pages suitable for recording spells.",
    },
  {
      id: "potion-of-invisibility",
      name: "Potion of Invisibility",
      category: "consumable",
      stackable: true,
      description: "When you drink this potion, you become invisible for 1 hour. Anything you are wearing or carrying is invisible with you. The effect ends early if you attack or cast a spell.",
    },

  // === LEGACY MUNDANE COMPATIBILITY ===
  {
      id: "hammer",
      name: "Hammer",
      category: "adventuring-gear",
      description: "Legacy compatibility item retained for older saved equipment.",
    },
  {
      id: "piton",
      name: "Piton",
      category: "gear",
      stackable: true,
      description: "Legacy compatibility item retained for older saved equipment.",
    },
  {
      id: "hempen-rope",
      name: "Hempen Rope",
      category: "gear",
      stackable: true,
      description: "Legacy compatibility alias. New 2024 equipment should use Rope.",
    },
  {
      id: "mess-kit",
      name: "Mess Kit",
      category: "gear",
      description: "Legacy compatibility item retained for older saved equipment.",
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
      createMagicWeaponVariant(baseItem, 3),
    ];
  }),
  ...magicArmorBaseIds.flatMap((id) => {
    const baseItem = baseItemsById[id];
    if (!baseItem) return [];
    return [
      createMagicArmorVariant(baseItem, 1),
      createMagicArmorVariant(baseItem, 2),
      createMagicArmorVariant(baseItem, 3),
    ];
  }),
];

export const allItems: Item[] = [...items, ...magicItems];
export const itemsById = Object.fromEntries(
  allItems.map((item) => [item.id, item]),
) as Record<string, Item>;
