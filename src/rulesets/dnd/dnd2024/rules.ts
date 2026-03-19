import * as data from "./data/data";
import * as helpers from "./helpers";
import { buildDerivedCharacterData } from "./buildDerivedCharacterData";

export const dnd2024 = {
  data,
  helpers,
  buildDerivedCharacterData,
};

export type Dnd2024Ruleset = typeof dnd2024;