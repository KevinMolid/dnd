import type { CharacterClass } from "../types";

import { barbarian } from "./classes/barbarian";
import { bard } from "./classes/bard";
import { cleric } from "./classes/cleric";
import { druid } from "./classes/druid";
import { fighter } from "./classes/fighter";
import { paladin } from "./classes/paladin";
import { ranger } from "./classes/ranger";
import { rogue } from "./classes/rogue";
import { wizard } from "./classes/wizard";

export const classes: CharacterClass[] = [
  barbarian,
  bard,
  cleric,
  druid,
  fighter,
  paladin,
  ranger,
  rogue,
  wizard,
];