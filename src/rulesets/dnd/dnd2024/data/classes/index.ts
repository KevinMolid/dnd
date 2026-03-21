import type { CharacterClass } from "../../types";
import { fighter } from "./fighter";
import { rogue } from "./rogue/rogue";
import { paladin } from "./paladin/paladin";


export const classes: CharacterClass[] = [fighter, rogue, paladin];