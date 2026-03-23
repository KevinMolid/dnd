export const dragonbornAncestries = {
  black: {
    name: "Black",
    damageType: "acid",
  },
  blue: {
    name: "Blue",
    damageType: "lightning",
  },
  brass: {
    name: "Brass",
    damageType: "fire",
  },
  bronze: {
    name: "Bronze",
    damageType: "lightning",
  },
  copper: {
    name: "Copper",
    damageType: "acid",
  },
  gold: {
    name: "Gold",
    damageType: "fire",
  },
  green: {
    name: "Green",
    damageType: "poison",
  },
  red: {
    name: "Red",
    damageType: "fire",
  },
  silver: {
    name: "Silver",
    damageType: "cold",
  },
  white: {
    name: "White",
    damageType: "cold",
  },
} as const;

export type DragonbornAncestryId = keyof typeof dragonbornAncestries;