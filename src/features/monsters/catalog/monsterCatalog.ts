import type { MonsterDefinition } from "./monsterTypes";
import { customMonsters } from "./customMonsterCatalog";
import { legacyMonsters } from "./legacyMonsterCatalog";
import { aberrations } from "./monsters/aberrations";
import { beasts } from "./monsters/beasts";
import { celestials } from "./monsters/celestials";
import { constructs } from "./monsters/constructs";
import { dragons } from "./monsters/dragons";
import { elementals } from "./monsters/elementals";
import { fey } from "./monsters/fey";
import { fiends } from "./monsters/fiends";
import { giants } from "./monsters/giants";
import { humanoids } from "./monsters/humanoids";
import { monstrosities } from "./monsters/monstrosities";
import { oozes } from "./monsters/oozes";
import { plants } from "./monsters/plants";
import { undead } from "./monsters/undead";

export type {
  MonsterDefinition,
  MonsterTextEntry,
  MonsterType,
} from "./monsterTypes";

export { monsterTypes } from "./monsterTypes";

/**
 * Canonical SRD-oriented core catalog.
 *
 * Aberrations are complete for SRD 5.2.1.
 * Remaining categories are being migrated one at a time.
 */
export const coreMonsters: MonsterDefinition[] = [
  ...aberrations,
  ...beasts,
  ...celestials,
  ...constructs,
  ...dragons,
  ...elementals,
  ...fey,
  ...fiends,
  ...giants,
  ...humanoids,
  ...monstrosities,
  ...oozes,
  ...plants,
  ...undead,
];

/**
 * Non-SRD entries retained for backwards compatibility.
 */
export const supplementalMonsters: MonsterDefinition[] = [
  ...legacyMonsters,
  ...customMonsters,
];

/**
 * Full library used by the app.
 */
export const monsters: MonsterDefinition[] = [
  ...coreMonsters,
  ...supplementalMonsters,
];

