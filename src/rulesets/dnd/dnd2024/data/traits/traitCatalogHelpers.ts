import type { Trait } from "../../types";
import { traitCatalog } from "./traitCatalog";
import type {
  TraitCatalogEntry,
  TraitCatalogFilters,
  TraitCatalogSourceType,
} from "./traitCatalogTypes";

export const traitSourceLabels: Record<TraitCatalogSourceType, string> = {
  class: "Class",
  subclass: "Subclass",
  species: "Species",
  background: "Background",
  feat: "Feat",
};

const traitSearchText = (entry: TraitCatalogEntry) => {
  const trait = entry.trait;

  return [
    trait.name,
    trait.description,
    entry.sourceName,
    entry.sourceType,
    entry.className,
    ...(trait.notes ?? []),
    ...(trait.effects ?? []).map((effect) => JSON.stringify(effect)),
    ...(trait.actions ?? []).map((action) => JSON.stringify(action)),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

export const filterTraitCatalog = (
  filters: TraitCatalogFilters,
  entries: readonly TraitCatalogEntry[] = traitCatalog,
): TraitCatalogEntry[] => {
  const query = filters.query?.trim().toLowerCase() ?? "";

  return entries.filter((entry) => {
    if (
      filters.sourceType &&
      filters.sourceType !== "all" &&
      entry.sourceType !== filters.sourceType
    ) {
      return false;
    }

    if (
      filters.sourceId &&
      filters.sourceId !== "all" &&
      entry.sourceId !== filters.sourceId
    ) {
      return false;
    }

    if (
      filters.level !== undefined &&
      filters.level !== "all" &&
      entry.level !== filters.level
    ) {
      return false;
    }

    return !query || traitSearchText(entry).includes(query);
  });
};

export const getTraitCatalogSources = (
  sourceType: TraitCatalogSourceType | "all" = "all",
  entries: readonly TraitCatalogEntry[] = traitCatalog,
) => {
  const seen = new Map<string, string>();

  for (const entry of entries) {
    if (sourceType !== "all" && entry.sourceType !== sourceType) continue;
    seen.set(entry.sourceId, entry.sourceName);
  }

  return [...seen.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getTraitCatalogLevels = (
  entries: readonly TraitCatalogEntry[] = traitCatalog,
): number[] =>
  [...new Set(entries.map((entry) => entry.level).filter((v): v is number => typeof v === "number"))]
    .sort((a, b) => a - b);

export const dedupeTraitCatalogIds = (ids: readonly string[]): string[] =>
  [...new Set(ids)];

export const resolveCatalogTraits = (
  ids: readonly string[],
  entries: readonly TraitCatalogEntry[] = traitCatalog,
): Trait[] => {
  const byId = new Map(entries.map((entry) => [entry.catalogId, entry]));
  return dedupeTraitCatalogIds(ids)
    .map((id) => byId.get(id)?.trait)
    .filter((trait): trait is Trait => Boolean(trait));
};
