import { backgrounds } from "../backgrounds";
import { classes } from "../classes";
import { feats } from "../feats";
import { species } from "../species";
import { subclasses } from "../subclasses";
import type { Trait } from "../../types";
import type { TraitCatalogEntry } from "./traitCatalogTypes";

const classNameById = new Map(classes.map((item) => [item.id, item.name]));
const featById = new Map(feats.map((item) => [item.id, item]));

const classEntries: TraitCatalogEntry[] = classes.flatMap((characterClass) =>
  Object.entries(characterClass.featuresByLevel).flatMap(([levelKey, traits]) =>
    (traits ?? []).map((trait) => ({
      catalogId: `class:${characterClass.id}:${trait.id}`,
      trait,
      sourceType: "class" as const,
      sourceId: characterClass.id,
      sourceName: characterClass.name,
      classId: characterClass.id,
      className: characterClass.name,
      level: trait.level ?? Number(levelKey),
    })),
  ),
);

const subclassEntries: TraitCatalogEntry[] = subclasses.flatMap((subclass) =>
  Object.entries(subclass.featuresByLevel).flatMap(([levelKey, traits]) =>
    (traits ?? []).map((trait) => ({
      catalogId: `subclass:${subclass.id}:${trait.id}`,
      trait,
      sourceType: "subclass" as const,
      sourceId: subclass.id,
      sourceName: subclass.name,
      classId: subclass.classId,
      className: classNameById.get(subclass.classId),
      level: trait.level ?? Number(levelKey),
    })),
  ),
);

const speciesEntries: TraitCatalogEntry[] = species.flatMap((item) =>
  item.traits.map((trait) => ({
    catalogId: `species:${item.id}:${trait.id}`,
    trait,
    sourceType: "species" as const,
    sourceId: item.id,
    sourceName: item.name,
    level: trait.level ?? trait.minLevel,
  })),
);

const featEntries: TraitCatalogEntry[] = feats.flatMap((feat) =>
  feat.traits.map((trait) => ({
    catalogId: `feat:${feat.id}:${trait.id}`,
    trait,
    sourceType: "feat" as const,
    sourceId: feat.id,
    sourceName: feat.name,
    level: trait.level ?? trait.minLevel,
  })),
);

/*
 * Backgrounds currently grant feats rather than owning Trait[] directly.
 * Expose that granted feat through the background source so the library can
 * still be filtered by Background without duplicating rules text in the data.
 */
const backgroundEntries: TraitCatalogEntry[] = backgrounds.flatMap((background) => {
  const featId = background.featGrant?.featId ?? background.originFeatId;
  if (!featId) return [];

  const feat = featById.get(featId);
  if (!feat) return [];

  return feat.traits.map((trait): TraitCatalogEntry => ({
    catalogId: `background:${background.id}:${feat.id}:${trait.id}`,
    trait,
    sourceType: "background",
    sourceId: background.id,
    sourceName: background.name,
    level: trait.level ?? trait.minLevel,
  }));
});

export const traitCatalog: TraitCatalogEntry[] = [
  ...classEntries,
  ...subclassEntries,
  ...speciesEntries,
  ...backgroundEntries,
  ...featEntries,
];

export const traitCatalogById: Record<string, TraitCatalogEntry> =
  Object.fromEntries(traitCatalog.map((entry) => [entry.catalogId, entry]));

export const getTraitCatalogEntry = (
  catalogId: string | undefined | null,
): TraitCatalogEntry | undefined => {
  if (!catalogId) return undefined;
  return traitCatalogById[catalogId];
};

export const getTraitCatalogEntries = (
  catalogIds: readonly string[] | undefined,
): TraitCatalogEntry[] =>
  (catalogIds ?? [])
    .map((catalogId) => getTraitCatalogEntry(catalogId))
    .filter((entry): entry is TraitCatalogEntry => Boolean(entry));

export const getCatalogTraits = (
  catalogIds: readonly string[] | undefined,
): Trait[] => getTraitCatalogEntries(catalogIds).map((entry) => entry.trait);
