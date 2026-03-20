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
export const getSubclassById = (id: string) => subclassesById[id];