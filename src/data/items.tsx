export type EquipmentSlot =
  | "armor"
  | "shield"
  | "mainHand"
  | "offHand"
  | "bothHands"
  | "ring1"
  | "ring2"
  | "boots"
  | "gloves"
  | "staff"
  | "wand";

export type ItemCategory =
  | "Armor"
  | "Weapon"
  | "Potion"
  | "Wondrous Item"
  | "Ring"
  | "Scroll"
  | "Staff"
  | "Wand";

export type ItemRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Very Rare"
  | "Legendary"
  | "Varies";

export type ItemData = {
  id: string;
  name: string;
  category: ItemCategory;
  rarity?: ItemRarity;
  requiresAttunement?: boolean;
  subtype?: string;
  equipSlots?: EquipmentSlot[];
  consumable?: boolean;
  description: string;
};

const armorTypes = [
  "Padded Armor",
  "Leather Armor",
  "Studded Leather Armor",
  "Hide Armor",
  "Chain Shirt",
  "Scale Mail",
  "Breastplate",
  "Half Plate",
  "Ring Mail",
  "Chain Mail",
  "Splint Armor",
  "Plate Armor",
  "Shield",
];

const weaponTypes = [
  "Club",
  "Dagger",
  "Greatclub",
  "Handaxe",
  "Javelin",
  "Light Hammer",
  "Mace",
  "Quarterstaff",
  "Sickle",
  "Spear",
  "Light Crossbow",
  "Dart",
  "Shortbow",
  "Sling",
  "Battleaxe",
  "Flail",
  "Glaive",
  "Greataxe",
  "Greatsword",
  "Halberd",
  "Lance",
  "Longsword",
  "Maul",
  "Morningstar",
  "Pike",
  "Rapier",
  "Scimitar",
  "Shortsword",
  "Trident",
  "War Pick",
  "Warhammer",
  "Whip",
  "Blowgun",
  "Hand Crossbow",
  "Heavy Crossbow",
  "Longbow",
  "Net",
];

const twoHandedWeapons = new Set([
  "Greatclub",
  "Glaive",
  "Greataxe",
  "Greatsword",
  "Halberd",
  "Maul",
  "Pike",
  "Heavy Crossbow",
  "Longbow",
  "Shortbow",
  "Light Crossbow",
  "Blowgun",
  "Net",
]);

const plusOneArmorItems: ItemData[] = armorTypes.map((armor) => ({
  id: `plus-1-${armor.toLowerCase().replace(/\s+/g, "-")}`,
  name: `+1 ${armor}`,
  category: "Armor",
  rarity: "Rare",
  subtype: armor,
  equipSlots: armor === "Shield" ? ["shield"] : ["armor"],
  description:
    "The most basic form of magic armor is a superb product of physical and magical craft. You have a +1 bonus to your Armor Class while wearing this armor. A suit of +1 armor never rusts or deteriorates, and it magically resizes to fit its wearer.",
}));

const plusOneWeaponItems: ItemData[] = weaponTypes.map((weapon) => ({
  id: `plus-1-${weapon.toLowerCase().replace(/\s+/g, "-")}`,
  name: `+1 ${weapon}`,
  category: "Weapon",
  rarity: "Uncommon",
  subtype: weapon,
  equipSlots: twoHandedWeapons.has(weapon)
    ? ["bothHands"]
    : ["mainHand", "offHand"],
  description:
    "Magic weapons are unmistakably finer in quality than their ordinary counterparts. You have a +1 bonus to the attack rolls and damage rolls you make with this weapon. Some +1 weapons (swords in particular) have additional properties, such as shedding light.",
}));

export const itemList: ItemData[] = [
  ...plusOneArmorItems,
  ...plusOneWeaponItems,

  {
    id: "boots-of-striding-and-springing",
    name: "Boots of Striding and Springing",
    category: "Wondrous Item",
    rarity: "Uncommon",
    requiresAttunement: true,
    equipSlots: ["boots"],
    description:
      "Your speed while you wear these boots becomes 30 feet, unless your walking speed is higher, and your speed is not reduced if you are encumbered or wearing heavy armor. In addition, whenever you jump, you can jump three times the normal distance.",
  },
  {
    id: "gauntlets-of-ogre-power",
    name: "Gauntlets of Ogre Power",
    category: "Wondrous Item",
    rarity: "Uncommon",
    requiresAttunement: true,
    equipSlots: ["gloves"],
    description:
      "While you wear these gauntlets, your Strength becomes 19. If your Strength is already 19 or higher, the gauntlets have no effect on you.",
  },
  {
    id: "potion-of-flying",
    name: "Potion of Flying",
    category: "Potion",
    rarity: "Very Rare",
    consumable: true,
    description:
      "This potion gives you a flying speed equal to your walking speed for 1 hour. If the potion wears off while you’re flying and nothing else is holding you aloft, you must use your movement to descend. If you fail to land before 1 minute passes, you fall.",
  },
  {
    id: "potion-of-healing",
    name: "Potion of Healing",
    category: "Potion",
    rarity: "Common",
    consumable: true,
    description: "When you drink this potion, you regain 2d4 + 2 hit points.",
  },
  {
    id: "potion-of-invisibility",
    name: "Potion of Invisibility",
    category: "Potion",
    rarity: "Very Rare",
    consumable: true,
    description:
      "When you drink this potion, you—along with the clothing, armor, weapons, and other equipment on your person—become invisible for 1 hour. The invisibility ends if you attack or cast a spell.",
  },
  {
    id: "potion-of-vitality",
    name: "Potion of Vitality",
    category: "Potion",
    rarity: "Very Rare",
    consumable: true,
    description:
      "Drinking this potion removes any exhaustion you are suffering, cures any disease or poison affecting you, and maximizes the effect of any Hit Die you spend to regain hit points within the next 24 hours.",
  },
  {
    id: "ring-of-protection",
    name: "Ring of Protection",
    category: "Ring",
    rarity: "Rare",
    requiresAttunement: true,
    equipSlots: ["ring1", "ring2"],
    description:
      "While you are wearing this ring and are attuned to it, you have a +1 bonus to your Armor Class and saving throws.",
  },
  {
    id: "spell-scroll",
    name: "Spell Scroll",
    category: "Scroll",
    rarity: "Varies",
    consumable: true,
    description:
      "A spell scroll bears the words of a single spell, written in a mystical cipher. If the spell is on your class’s spell list, you can use an action to read the scroll and cast its spell without having to provide any of the spell’s components. Otherwise, the scroll is unintelligible.\n\nIf the spell is on your class’s spell list but of a higher level than you can normally cast, you must make an ability check using your spellcasting ability to determine whether you cast it successfully. The DC equals 10 + the spell’s level. On a failed check, the spell disappears from the scroll with no other effect.\n\nOnce the spell is cast, the words on the scroll fade, and the scroll itself crumbles to dust.",
  },
  {
    id: "spider-staff",
    name: "Spider Staff",
    category: "Staff",
    rarity: "Rare",
    requiresAttunement: true,
    equipSlots: ["staff"],
    description:
      "The top of this black, adamantine staff is shaped like a spider. The staff weighs 6 pounds. You must be attuned to the staff to gain its benefits and cast its spells.\n\nThe staff can be wielded as a quarterstaff. It deals 1d6 extra poison damage on a hit when used to make a weapon attack.\n\nThe staff has 10 charges, which are used to fuel the spells within it. With the staff in hand, you can use your action to cast one of the following spells from the staff if the spell is on your class’s spell list: spider climb (1 charge) or web (2 charges, spell save DC 15). No components are required.\n\nThe staff regains 1d6 + 4 expended charges each day at dusk. If you expend the staff’s last charge, roll a d20. On a 1, the staff crumbles to dust and is destroyed.",
  },
  {
    id: "staff-of-defense",
    name: "Staff of Defense",
    category: "Staff",
    rarity: "Rare",
    requiresAttunement: true,
    equipSlots: ["staff"],
    description:
      "This slender, hollow staff is made of glass yet is as strong as oak. It weighs 3 pounds. You must be attuned to the staff to gain its benefits and cast its spells.\n\nWhile holding the staff, you have a +1 bonus to your Armor Class.\n\nThe staff has 10 charges, which are used to fuel the spells within it. With the staff in hand, you can use your action to cast one of the following spells from the staff if the spell is on your class’s spell list: mage armor (1 charge) or shield (2 charges). No components are required.\n\nThe staff regains 1d6 + 4 expended charges each day at dawn. If you expend the staff’s last charge, roll a d20. On a 1, the staff shatters and is destroyed.",
  },
  {
    id: "wand-of-magic-missiles",
    name: "Wand of Magic Missiles",
    category: "Wand",
    rarity: "Uncommon",
    equipSlots: ["wand"],
    description:
      "This wand has 7 charges. With the wand in hand, you can use your action to fire the magic missile spell from the wand—no components required—and expend 1 to 3 of the wand’s charges. For each charge you expend beyond 1, the spell’s level increases by 1. You can use this wand even if you are incapable of casting spells.\n\nThe wand regains 1d6 + 1 expended charges each day at dawn. If you expend the wand’s last charge, roll a d20. On a 1, the wand crumbles into ash and is destroyed.",
  },
  {
    id: "wand-of-eldritch-blast",
    name: "Wand of Eldritch Blast",
    category: "Wand",
    rarity: "Uncommon",
    requiresAttunement: true,
    equipSlots: ["wand"],
    description:
      "This wand has 13 charges. While holding it, you can use an action to expend one charge to cast the Eldritch Blast spell. Make a ranged attack roll using your Charisma modifier and proficiency bonus against the target. On a hit, the target takes 1d10 force damage.\n\nThe wand can create more than one beam when attuned to a spellcaster: Two beams at 5th level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam. Each additional beam expends an additional charge.\n\nThe wand regains 2d6 + 1 expended charges daily at sunset. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into dust and is destroyed.",
  },
  {
    id: "horde-sword",
    name: "Hordesword",
    category: "Weapon",
    rarity: "Uncommon",
    requiresAttunement: true,
    equipSlots: ["mainHand", "offHand"],
    description:
      "You gain a +2 bonus to attack and damage against Orcs, Half-orcs and Ogres.\n\nThe sword blade emits an azure glow when orcish creatures are nearby and flares brightly when spilling orcish blood.",
  },
];

const Items = () => {
  return <div></div>;
};

export default Items;
