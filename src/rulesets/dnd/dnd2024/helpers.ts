import type {
  Background,
  CharacterClass,
  CharacterSubclass,
  Feat,
  Species,
} from "./types";
import {
  backgrounds,
  classes,
  feats,
  species,
  subclasses,
} from "./data";

import type { CharacterChoices } from "./types";

const toMap = <T extends { id: string }>(items: T[]): Record<string, T> =>
  Object.fromEntries(items.map((item) => [item.id, item])) as Record<string, T>;

export const classesById: Record<string, CharacterClass> = toMap(classes);
export const speciesById: Record<string, Species> = toMap(species);
export const backgroundsById: Record<string, Background> = toMap(backgrounds);
export const featsById: Record<string, Feat> = toMap(feats);
export const subclassesById: Record<string, CharacterSubclass> = toMap(subclasses);

export const getClassById = (id: string) => classesById[id];
export const getSpeciesById = (id: string) => speciesById[id];
export const getBackgroundById = (id: string) => backgroundsById[id];
export const getFeatById = (id: string) => featsById[id];
export const getSubclassById = (
  subclassId: string | undefined | null,
) => {
  if (!subclassId) return undefined;
  return subclassesById[subclassId];
};

export const getChosenSubclassId = (
  choices: CharacterChoices | undefined,
): string | undefined => {
  if (choices?.subclassId) return choices.subclassId;

  const decisions = choices?.levelUpDecisions;
  if (!decisions) return undefined;

  const levels = Object.keys(decisions)
    .map(Number)
    .sort((a, b) => a - b);

  for (let i = levels.length - 1; i >= 0; i -= 1) {
    const subclassId = decisions[levels[i]]?.subclassId;
    if (subclassId) return subclassId;
  }

  return undefined;
};