import type { CharacterClass } from "../types";

import { rogue } from "./classes/rogue";
import { fighter } from "./classes/fighter";
import { paladin } from "./classes/paladin";

// add more as you go

export const classes: CharacterClass[] = [
  rogue,
  fighter,
  paladin,
];