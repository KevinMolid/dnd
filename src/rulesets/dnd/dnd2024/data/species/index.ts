import type { Species } from "../../types";
import { aasimar } from "./aasimar";
import { dragonborn } from "./dragonborn";
import { draconicAncestors } from "./draconicAncestors";
import { dwarf } from "./dwarf";
import { elf } from "./elf";
import { elfLineages } from "./elfLineages";
import { gnome } from "./gnome";
import { gnomeLineages } from "./gnomeLineages";
import { goliath } from "./goliath";
import { goliathAncestries } from "./goliathAncestries";
import { halfling } from "./halfling";
import { human } from "./human";
import { orc } from "./orc";
import { tiefling } from "./tiefling";
import { tieflingLegacies } from "./tieflingLegacies";

export const species: Species[] = [
  human,
  elf,
  dwarf,
  halfling,
  aasimar,
  dragonborn,
  gnome,
  goliath,
  orc,
  tiefling,
];

export {
  elfLineages,
  gnomeLineages,
  goliathAncestries,
  tieflingLegacies,
  draconicAncestors,
};