import { backgrounds, classes, originFeats, species } from "./data";

const toMap = <T extends { id: string }>(items: T[]): Record<string, T> =>
  Object.fromEntries(items.map((item) => [item.id, item]));

export const classesById = toMap(classes);
export const speciesById = toMap(species);
export const backgroundsById = toMap(backgrounds);
export const originFeatsById = toMap(originFeats);

export const getClassById = (id: string) => classesById[id];
export const getSpeciesById = (id: string) => speciesById[id];
export const getBackgroundById = (id: string) => backgroundsById[id];
export const getOriginFeatById = (id: string) => originFeatsById[id];