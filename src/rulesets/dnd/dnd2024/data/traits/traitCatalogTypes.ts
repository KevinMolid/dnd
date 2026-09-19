import type { Trait } from "../../types";

export type TraitCatalogSourceType =
  | "class"
  | "subclass"
  | "species"
  | "background"
  | "feat";

export type TraitCatalogEntry = {
  /** Stable ID stored on custom characters. */
  catalogId: string;
  trait: Trait;
  sourceType: TraitCatalogSourceType;
  sourceId: string;
  sourceName: string;
  level?: number;
  classId?: string;
  className?: string;
};

export type TraitCatalogFilters = {
  query?: string;
  sourceType?: TraitCatalogSourceType | "all";
  sourceId?: string | "all";
  level?: number | "all";
};
