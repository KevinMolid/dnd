import type { CharacterSubclass } from "../../../types";
import { lifeDomain } from "./lifeDomain";
import { lightDomain } from "./lightDomain";
import { trickeryDomain } from "./trickeryDomain";
import { warDomain } from "./warDomain";

export const clericSubclasses: CharacterSubclass[] = [
  lifeDomain,
  lightDomain,
  trickeryDomain,
  warDomain,
];