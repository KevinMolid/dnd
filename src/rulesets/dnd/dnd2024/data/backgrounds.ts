import type { Background, ToolId } from "../types";

const artisanToolOptions: ToolId[] = [
  "alchemists-supplies",
  "brewers-supplies",
  "calligraphers-supplies",
  "carpenters-tools",
  "cartographers-tools",
  "cooks-utensils",
  "glassblowers-tools",
  "jewelers-tools",
  "leatherworkers-tools",
  "masons-tools",
  "painters-supplies",
  "potters-tools",
  "smiths-tools",
  "tinkers-tools",
  "weavers-tools",
  "woodcarvers-tools",
];

const gamingSetOptions: ToolId[] = ["gamers-set"];

const musicalInstrumentOptions: ToolId[] = ["musical-instrument"];

export const backgrounds: Background[] = [
  {
    id: "acolyte",
    name: "Acolyte",
    abilityOptions: ["int", "wis", "cha"],
    skillProficiencies: ["insight", "religion"],
    toolProficiency: "calligraphers-supplies",
    toolProficiencyOptions: {
      type: "fixed",
      tool: "calligraphers-supplies",
    },
    originFeatId: "magic-initiate",
    featGrant: {
      type: "magic-initiate",
      featId: "magic-initiate",
      spellListId: "cleric",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "acolyte-equipment-a",
          label:
            "Calligrapher’s Supplies, Book, Parchment (10 sheets), Holy Symbol, Robe, and 8 GP",
          grants: [
            { type: "item", id: "calligraphers-supplies", quantity: 1 },
            { type: "item", id: "book", quantity: 1 },
            { type: "item", id: "parchment", quantity: 10 },
            { type: "item", id: "holy-symbol", quantity: 1 },
            { type: "item", id: "robe", quantity: 1 },
            { type: "currency", amount: 8, currency: "gp" },
          ],
        },
        {
          id: "acolyte-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "artisan",
    name: "Artisan",
    abilityOptions: ["str", "dex", "int"],
    skillProficiencies: ["investigation", "persuasion"],
    toolProficiencyOptions: {
      type: "choice",
      choose: 1,
      options: artisanToolOptions,
      optionGroup: "artisan-tools",
    },
    originFeatId: "crafter",
    featGrant: {
      type: "fixed",
      featId: "crafter",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "artisan-equipment-a",
          label:
            "One kind of Artisan’s Tools, 2 Pouches, Traveler’s Clothes, and 32 GP",
          grants: [
            {
              type: "choice",
              choose: 1,
              options: artisanToolOptions.map((toolId) => ({
                type: "item",
                id: toolId,
                quantity: 1,
              })),
            },
            { type: "item", id: "pouch", quantity: 2 },
            { type: "item", id: "travelers-clothes", quantity: 1 },
            { type: "currency", amount: 32, currency: "gp" },
          ],
        },
        {
          id: "artisan-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "charlatan",
    name: "Charlatan",
    abilityOptions: ["dex", "con", "cha"],
    skillProficiencies: ["deception", "sleight-of-hand"],
    toolProficiency: "forgery-kit",
    toolProficiencyOptions: {
      type: "fixed",
      tool: "forgery-kit",
    },
    originFeatId: "skilled",
    featGrant: {
      type: "fixed",
      featId: "skilled",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "charlatan-equipment-a",
          label: "Forgery Kit, Costume, Fine Clothes, and 15 GP",
          grants: [
            { type: "item", id: "forgery-kit", quantity: 1 },
            { type: "item", id: "costume", quantity: 1 },
            { type: "item", id: "fine-clothes", quantity: 1 },
            { type: "currency", amount: 15, currency: "gp" },
          ],
        },
        {
          id: "charlatan-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "criminal",
    name: "Criminal",
    abilityOptions: ["dex", "con", "int"],
    skillProficiencies: ["sleight-of-hand", "stealth"],
    toolProficiency: "thieves-tools",
    toolProficiencyOptions: {
      type: "fixed",
      tool: "thieves-tools",
    },
    originFeatId: "alert",
    featGrant: {
      type: "fixed",
      featId: "alert",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "criminal-equipment-a",
          label:
            "2 Daggers, Thieves’ Tools, Crowbar, 2 Pouches, Traveler’s Clothes, and 16 GP",
          grants: [
            { type: "item", id: "dagger", quantity: 2 },
            { type: "item", id: "thieves-tools", quantity: 1 },
            { type: "item", id: "crowbar", quantity: 1 },
            { type: "item", id: "pouch", quantity: 2 },
            { type: "item", id: "travelers-clothes", quantity: 1 },
            { type: "currency", amount: 16, currency: "gp" },
          ],
        },
        {
          id: "criminal-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "entertainer",
    name: "Entertainer",
    abilityOptions: ["str", "dex", "cha"],
    skillProficiencies: ["acrobatics", "performance"],
    toolProficiencyOptions: {
      type: "choice",
      choose: 1,
      options: musicalInstrumentOptions,
      optionGroup: "musical-instrument",
    },
    originFeatId: "musician",
    featGrant: {
      type: "fixed",
      featId: "musician",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "entertainer-equipment-a",
          label:
            "One Musical Instrument, 2 Costumes, Mirror, Perfume, Traveler’s Clothes, and 11 GP",
          grants: [
            {
              type: "choice",
              choose: 1,
              options: musicalInstrumentOptions.map((toolId) => ({
                type: "item",
                id: toolId,
                quantity: 1,
              })),
            },
            { type: "item", id: "costume", quantity: 2 },
            { type: "item", id: "mirror", quantity: 1 },
            { type: "item", id: "perfume", quantity: 1 },
            { type: "item", id: "travelers-clothes", quantity: 1 },
            { type: "currency", amount: 11, currency: "gp" },
          ],
        },
        {
          id: "entertainer-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "farmer",
    name: "Farmer",
    abilityOptions: ["str", "con", "wis"],
    skillProficiencies: ["animal-handling", "nature"],
    toolProficiency: "carpenters-tools",
    toolProficiencyOptions: {
      type: "fixed",
      tool: "carpenters-tools",
    },
    originFeatId: "tough",
    featGrant: {
      type: "fixed",
      featId: "tough",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "farmer-equipment-a",
          label:
            "Sickle, Carpenter’s Tools, Healer’s Kit, Iron Pot, Shovel, Traveler’s Clothes, and 30 GP",
          grants: [
            { type: "item", id: "sickle", quantity: 1 },
            { type: "item", id: "carpenters-tools", quantity: 1 },
            { type: "item", id: "healers-kit", quantity: 1 },
            { type: "item", id: "iron-pot", quantity: 1 },
            { type: "item", id: "shovel", quantity: 1 },
            { type: "item", id: "travelers-clothes", quantity: 1 },
            { type: "currency", amount: 30, currency: "gp" },
          ],
        },
        {
          id: "farmer-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "guard",
    name: "Guard",
    abilityOptions: ["str", "int", "wis"],
    skillProficiencies: ["athletics", "perception"],
    toolProficiencyOptions: {
      type: "choice",
      choose: 1,
      options: gamingSetOptions,
      optionGroup: "gaming-set",
    },
    originFeatId: "alert",
    featGrant: {
      type: "fixed",
      featId: "alert",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "guard-equipment-a",
          label:
            "Spear, Light Crossbow, 20 Bolts, one Gaming Set, Hooded Lantern, Manacles, Quiver, Traveler’s Clothes, and 12 GP",
          grants: [
            { type: "item", id: "spear", quantity: 1 },
            { type: "item", id: "light-crossbow", quantity: 1 },
            { type: "item", id: "crossbow-bolt", quantity: 20 },
            {
              type: "choice",
              choose: 1,
              options: gamingSetOptions.map((toolId) => ({
                type: "item",
                id: toolId,
                quantity: 1,
              })),
            },
            { type: "item", id: "hooded-lantern", quantity: 1 },
            { type: "item", id: "manacles", quantity: 1 },
            { type: "item", id: "quiver", quantity: 1 },
            { type: "item", id: "travelers-clothes", quantity: 1 },
            { type: "currency", amount: 12, currency: "gp" },
          ],
        },
        {
          id: "guard-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "guide",
    name: "Guide",
    abilityOptions: ["dex", "con", "wis"],
    skillProficiencies: ["stealth", "survival"],
    toolProficiency: "cartographers-tools",
    toolProficiencyOptions: {
      type: "fixed",
      tool: "cartographers-tools",
    },
    originFeatId: "magic-initiate",
    featGrant: {
      type: "magic-initiate",
      featId: "magic-initiate",
      spellListId: "druid",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "guide-equipment-a",
          label:
            "Shortbow, 20 Arrows, Cartographer’s Tools, Bedroll, Quiver, Tent, Traveler’s Clothes, and 3 GP",
          grants: [
            { type: "item", id: "shortbow", quantity: 1 },
            { type: "item", id: "arrow", quantity: 20 },
            { type: "item", id: "cartographers-tools", quantity: 1 },
            { type: "item", id: "bedroll", quantity: 1 },
            { type: "item", id: "quiver", quantity: 1 },
            { type: "item", id: "tent", quantity: 1 },
            { type: "item", id: "travelers-clothes", quantity: 1 },
            { type: "currency", amount: 3, currency: "gp" },
          ],
        },
        {
          id: "guide-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "hermit",
    name: "Hermit",
    abilityOptions: ["con", "wis", "cha"],
    skillProficiencies: ["medicine", "religion"],
    toolProficiency: "herbalism-kit",
    toolProficiencyOptions: {
      type: "fixed",
      tool: "herbalism-kit",
    },
    originFeatId: "healer",
    featGrant: {
      type: "fixed",
      featId: "healer",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "hermit-equipment-a",
          label:
            "Quarterstaff, Herbalism Kit, Bedroll, Book, Lamp, Oil (3 flasks), Traveler’s Clothes, and 16 GP",
          grants: [
            { type: "item", id: "quarterstaff", quantity: 1 },
            { type: "item", id: "herbalism-kit", quantity: 1 },
            { type: "item", id: "bedroll", quantity: 1 },
            { type: "item", id: "book", quantity: 1 },
            { type: "item", id: "lamp", quantity: 1 },
            { type: "item", id: "oil", quantity: 3 },
            { type: "item", id: "travelers-clothes", quantity: 1 },
            { type: "currency", amount: 16, currency: "gp" },
          ],
        },
        {
          id: "hermit-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "merchant",
    name: "Merchant",
    abilityOptions: ["con", "int", "cha"],
    skillProficiencies: ["animal-handling", "persuasion"],
    toolProficiency: "navigators-tools",
    toolProficiencyOptions: {
      type: "fixed",
      tool: "navigators-tools",
    },
    originFeatId: "lucky",
    featGrant: {
      type: "fixed",
      featId: "lucky",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "merchant-equipment-a",
          label:
            "Navigator’s Tools, 2 Pouches, Traveler’s Clothes, and 22 GP",
          grants: [
            { type: "item", id: "navigators-tools", quantity: 1 },
            { type: "item", id: "pouch", quantity: 2 },
            { type: "item", id: "travelers-clothes", quantity: 1 },
            { type: "currency", amount: 22, currency: "gp" },
          ],
        },
        {
          id: "merchant-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
    {
    id: "noble",
    name: "Noble",
    abilityOptions: ["str", "int", "cha"],
    skillProficiencies: ["history", "persuasion"],
    toolProficiencyOptions: {
      type: "choice",
      choose: 1,
      options: gamingSetOptions,
      optionGroup: "gaming-set",
    },
    originFeatId: "skilled",
    featGrant: {
      type: "fixed",
      featId: "skilled",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "noble-equipment-a",
          label: "Gaming Set, Fine Clothes, Perfume, and 29 GP",
          grants: [
            {
              type: "choice",
              choose: 1,
              options: gamingSetOptions.map((toolId) => ({
                type: "item",
                id: toolId,
                quantity: 1,
              })),
            },
            { type: "item", id: "fine-clothes", quantity: 1 },
            { type: "item", id: "perfume", quantity: 1 },
            { type: "currency", amount: 29, currency: "gp" },
          ],
        },
        {
          id: "noble-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "sailor",
    name: "Sailor",
    abilityOptions: ["str", "dex", "wis"],
    skillProficiencies: ["acrobatics", "perception"],
    toolProficiency: "navigators-tools",
    toolProficiencyOptions: {
      type: "fixed",
      tool: "navigators-tools",
    },
    originFeatId: "tavern-brawler",
    featGrant: {
      type: "fixed",
      featId: "tavern-brawler",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "sailor-equipment-a",
          label:
            "Dagger, Navigator’s Tools, Rope, Traveler’s Clothes, and 20 GP",
          grants: [
            { type: "item", id: "dagger", quantity: 1 },
            { type: "item", id: "navigators-tools", quantity: 1 },
            { type: "item", id: "rope", quantity: 1 },
            { type: "item", id: "travelers-clothes", quantity: 1 },
            { type: "currency", amount: 20, currency: "gp" },
          ],
        },
        {
          id: "sailor-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "sage",
    name: "Sage",
    abilityOptions: ["con", "int", "wis"],
    skillProficiencies: ["arcana", "history"],
    toolProficiency: "calligraphers-supplies",
    toolProficiencyOptions: {
      type: "fixed",
      tool: "calligraphers-supplies",
    },
    originFeatId: "magic-initiate",
    featGrant: {
      type: "magic-initiate",
      featId: "magic-initiate",
      spellListId: "wizard",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "sage-equipment-a",
          label:
            "Quarterstaff, Calligrapher’s Supplies, Book, Parchment (8 sheets), Robe, and 8 GP",
          grants: [
            { type: "item", id: "quarterstaff", quantity: 1 },
            { type: "item", id: "calligraphers-supplies", quantity: 1 },
            { type: "item", id: "book", quantity: 1 },
            { type: "item", id: "parchment", quantity: 8 },
            { type: "item", id: "robe", quantity: 1 },
            { type: "currency", amount: 8, currency: "gp" },
          ],
        },
        {
          id: "sage-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "scribe",
    name: "Scribe",
    abilityOptions: ["dex", "int", "wis"],
    skillProficiencies: ["investigation", "perception"],
    toolProficiency: "calligraphers-supplies",
    toolProficiencyOptions: {
      type: "fixed",
      tool: "calligraphers-supplies",
    },
    originFeatId: "skilled",
    featGrant: {
      type: "fixed",
      featId: "skilled",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "scribe-equipment-a",
          label:
            "Calligrapher’s Supplies, Fine Clothes, Lamp, Oil (3 flasks), Parchment (12 sheets), and 23 GP",
          grants: [
            { type: "item", id: "calligraphers-supplies", quantity: 1 },
            { type: "item", id: "fine-clothes", quantity: 1 },
            { type: "item", id: "lamp", quantity: 1 },
            { type: "item", id: "oil", quantity: 3 },
            { type: "item", id: "parchment", quantity: 12 },
            { type: "currency", amount: 23, currency: "gp" },
          ],
        },
        {
          id: "scribe-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "soldier",
    name: "Soldier",
    abilityOptions: ["str", "dex", "con"],
    skillProficiencies: ["athletics", "intimidation"],
    toolProficiencyOptions: {
      type: "choice",
      choose: 1,
      options: gamingSetOptions,
      optionGroup: "gaming-set",
    },
    originFeatId: "savage-attacker",
    featGrant: {
      type: "fixed",
      featId: "savage-attacker",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "soldier-equipment-a",
          label:
            "Spear, Shortbow, 20 Arrows, Gaming Set, Healer’s Kit, Quiver, Traveler’s Clothes, and 14 GP",
          grants: [
            { type: "item", id: "spear", quantity: 1 },
            { type: "item", id: "shortbow", quantity: 1 },
            { type: "item", id: "arrow", quantity: 20 },
            {
              type: "choice",
              choose: 1,
              options: gamingSetOptions.map((toolId) => ({
                type: "item",
                id: toolId,
                quantity: 1,
              })),
            },
            { type: "item", id: "healers-kit", quantity: 1 },
            { type: "item", id: "quiver", quantity: 1 },
            { type: "item", id: "travelers-clothes", quantity: 1 },
            { type: "currency", amount: 14, currency: "gp" },
          ],
        },
        {
          id: "soldier-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
  {
    id: "wayfarer",
    name: "Wayfarer",
    abilityOptions: ["dex", "wis", "cha"],
    skillProficiencies: ["insight", "stealth"],
    toolProficiency: "thieves-tools",
    toolProficiencyOptions: {
      type: "fixed",
      tool: "thieves-tools",
    },
    originFeatId: "lucky",
    featGrant: {
      type: "fixed",
      featId: "lucky",
    },
    equipmentGold: 50,
    equipment: {
      choose: 1,
      options: [
        {
          id: "wayfarer-equipment-a",
          label:
            "2 Daggers, Thieves’ Tools, Gaming Set, Bedroll, 2 Pouches, Traveler’s Clothes, and 16 GP",
          grants: [
            { type: "item", id: "dagger", quantity: 2 },
            { type: "item", id: "thieves-tools", quantity: 1 },
            {
              type: "choice",
              choose: 1,
              options: gamingSetOptions.map((toolId) => ({
                type: "item",
                id: toolId,
                quantity: 1,
              })),
            },
            { type: "item", id: "bedroll", quantity: 1 },
            { type: "item", id: "pouch", quantity: 2 },
            { type: "item", id: "travelers-clothes", quantity: 1 },
            { type: "currency", amount: 16, currency: "gp" },
          ],
        },
        {
          id: "wayfarer-equipment-b",
          label: "50 GP",
          grants: [{ type: "currency", amount: 50, currency: "gp" }],
        },
      ],
    },
  },
];