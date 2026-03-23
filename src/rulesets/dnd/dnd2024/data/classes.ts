import type { CharacterClass } from "../types";

import { barbarian } from "./classes/barbarian";
import { bard } from "./classes/bard";
import { druid } from "./classes/druid";
import { fighter } from "./classes/fighter";
import { paladin } from "./classes/paladin";
import { rogue } from "./classes/rogue";

// add more

export const classes: CharacterClass[] = [
  barbarian,
  bard,
  druid,
  fighter,
  paladin,
  rogue,
];