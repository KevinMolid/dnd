import type { CharacterClass } from "../types";

import { rogue } from "./classes/rogue";
import { fighter } from "./classes/fighter";
// add more as you go

export const classes: CharacterClass[] = [
  rogue,
  fighter,
];