import type { Background, RulesOption } from "./types";
import { backgrounds, classes, originFeats, species } from "./rules";

const toMap = <T extends { id: string }>(items: T[]): Record<string, T> =>
  Object.fromEntries(items.map((item) => [item.id, item]));

export const classesById = toMap<RulesOption>(classes);
export const speciesById = toMap<RulesOption>(species);
export const originFeatsById = toMap<RulesOption>(originFeats);
export const backgroundsById = toMap<Background>(backgrounds);

export const getBackgroundById = (backgroundId: string) =>
  backgroundsById[backgroundId];

export const getBackgroundFeat = (backgroundId: string) =>
  backgroundsById[backgroundId]?.originFeatId ?? null;

export const getBackgroundSkills = (backgroundId: string) =>
  backgroundsById[backgroundId]?.skillProficiencies ?? [];

export const getBackgroundTool = (backgroundId: string) =>
  backgroundsById[backgroundId]?.toolProficiency ?? null;

export const getBackgroundAbilityOptions = (backgroundId: string) =>
  backgroundsById[backgroundId]?.abilityOptions ?? [];