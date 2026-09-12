import type { CharacterClass } from "../../types";
import { barbarian } from "./barbarian/barbarian";
import { bard } from "./bard/bard";
import { cleric } from "./cleric/cleric";
import { druid } from "./druid/druid";
import { fighter } from "./fighter";
import { paladin } from "./paladin/paladin";
import { ranger } from "./ranger/ranger";
import { rogue } from "./rogue/rogue";
import { wizard } from "./wizard/wizard";


export const classes: CharacterClass[] = [barbarian, bard, cleric, druid, fighter, paladin, ranger, rogue, wizard];