import type { CharacterClass } from "../types";

import { artificer } from "./classes/artificer";
import { barbarian } from "./classes/barbarian";
import { bard } from "./classes/bard";
import { cleric } from "./classes/cleric";
import { druid } from "./classes/druid";
import { fighter } from "./classes/fighter";
import { monk } from "./classes/monk";
import { paladin } from "./classes/paladin";
import { ranger } from "./classes/ranger";
import { rogue } from "./classes/rogue";
import { sorcerer } from "./classes/sorcerer";
import { warlock } from "./classes/warlock";
import { wizard } from "./classes/wizard";

export const classes: CharacterClass[] = [
  artificer,
  barbarian,
  bard,
  cleric,
  druid,
  fighter,
  monk,
  paladin,
  ranger,
  rogue,
  sorcerer,
  warlock,
  wizard,
];