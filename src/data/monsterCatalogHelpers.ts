import { monsters } from "../features/monsters/catalog/monsterCatalog";

export const monstersById = Object.fromEntries(
  monsters.map((monster) => [monster.id, monster]),
);

export const monsterTypes = Array.from(
  new Set(monsters.map((monster) => monster.type)),
).sort((a, b) => a.localeCompare(b));