import { backgrounds } from "../backgrounds";
import { classes } from "../classes";
import { feats } from "../feats";
import {
  species,
  elfLineages,
  gnomeLineages,
  goliathAncestries,
  tieflingLegacies,
} from "../species";
import { subclasses } from "../subclasses";
import type { Trait } from "../../types";
import type { TraitCatalogEntry } from "./traitCatalogTypes";

const classNameById = new Map(classes.map((item) => [item.id, item.name]));
const featById = new Map(feats.map((item) => [item.id, item]));

/*
 * ---------------------------------------------------------------------------
 * Classes
 * ---------------------------------------------------------------------------
 */

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

/*
 * ---------------------------------------------------------------------------
 * Subclasses
 * ---------------------------------------------------------------------------
 */

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

/*
 * ---------------------------------------------------------------------------
 * Base Species
 * ---------------------------------------------------------------------------
 */

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

/*
 * ---------------------------------------------------------------------------
 * Elf Lineages
 *
 * These remain Species traits in the catalog. The parent species is encoded
 * into sourceId so lineage IDs can't collide with other species options.
 * ---------------------------------------------------------------------------
 */

const elfLineageEntries: TraitCatalogEntry[] = elfLineages.flatMap((lineage) =>
  lineage.traits.map((trait) => ({
    catalogId: `species:elf:${lineage.id}:${trait.id}`,
    trait,
    sourceType: "species" as const,
    sourceId: `elf:${lineage.id}`,
    sourceName: `Elf — ${lineage.name}`,
    level: trait.level ?? trait.minLevel,
  })),
);

/*
 * ---------------------------------------------------------------------------
 * Gnome Lineages
 * ---------------------------------------------------------------------------
 */

const gnomeLineageEntries: TraitCatalogEntry[] = gnomeLineages.flatMap(
  (lineage) =>
    lineage.traits.map((trait) => ({
      catalogId: `species:gnome:${lineage.id}:${trait.id}`,
      trait,
      sourceType: "species" as const,
      sourceId: `gnome:${lineage.id}`,
      sourceName: `Gnome — ${lineage.name}`,
      level: trait.level ?? trait.minLevel,
    })),
);

/*
 * ---------------------------------------------------------------------------
 * Goliath Ancestries
 * ---------------------------------------------------------------------------
 */

const goliathAncestryEntries: TraitCatalogEntry[] = goliathAncestries.flatMap(
  (ancestry) =>
    ancestry.traits.map((trait) => ({
      catalogId: `species:goliath:${ancestry.id}:${trait.id}`,
      trait,
      sourceType: "species" as const,
      sourceId: `goliath:${ancestry.id}`,
      sourceName: `Goliath — ${ancestry.name}`,
      level: trait.level ?? trait.minLevel,
    })),
);

/*
 * ---------------------------------------------------------------------------
 * Tiefling Legacies
 * ---------------------------------------------------------------------------
 */

const tieflingLegacyEntries: TraitCatalogEntry[] = tieflingLegacies.flatMap(
  (legacy) =>
    legacy.traits.map((trait) => ({
      catalogId: `species:tiefling:${legacy.id}:${trait.id}`,
      trait,
      sourceType: "species" as const,
      sourceId: `tiefling:${legacy.id}`,
      sourceName: `Tiefling — ${legacy.name}`,
      level: trait.level ?? trait.minLevel,
    })),
);

/*
 * ---------------------------------------------------------------------------
 * Feats
 * ---------------------------------------------------------------------------
 */

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
 * ---------------------------------------------------------------------------
 * Backgrounds
 *
 * Backgrounds currently grant feats rather than owning Trait[] directly.
 * Expose that granted feat through the background source so the library can
 * still be filtered by Background without duplicating rules text in the data.
 * ---------------------------------------------------------------------------
 */

const backgroundEntries: TraitCatalogEntry[] = backgrounds.flatMap(
  (background) => {
    const featId = background.featGrant?.featId ?? background.originFeatId;

    if (!featId) {
      return [];
    }

    const feat = featById.get(featId);

    if (!feat) {
      return [];
    }

    return feat.traits.map(
      (trait): TraitCatalogEntry => ({
        catalogId: `background:${background.id}:${feat.id}:${trait.id}`,
        trait,
        sourceType: "background",
        sourceId: background.id,
        sourceName: background.name,
        level: trait.level ?? trait.minLevel,
      }),
    );
  },
);

/*
 * ---------------------------------------------------------------------------
 * Complete Trait Catalog
 * ---------------------------------------------------------------------------
 */

export const traitCatalog: TraitCatalogEntry[] = [
  ...classEntries,
  ...subclassEntries,

  // Species
  ...speciesEntries,
  ...elfLineageEntries,
  ...gnomeLineageEntries,
  ...goliathAncestryEntries,
  ...tieflingLegacyEntries,

  // Other sources
  ...backgroundEntries,
  ...featEntries,
];

/*
 * ---------------------------------------------------------------------------
 * Lookup helpers
 * ---------------------------------------------------------------------------
 */

export const traitCatalogById: Record<string, TraitCatalogEntry> =
  Object.fromEntries(
    traitCatalog.map((entry) => [entry.catalogId, entry]),
  );

export const getTraitCatalogEntry = (
  catalogId: string | undefined | null,
): TraitCatalogEntry | undefined => {
  if (!catalogId) {
    return undefined;
  }

  return traitCatalogById[catalogId];
};

export const getTraitCatalogEntries = (
  catalogIds: readonly string[] | undefined,
): TraitCatalogEntry[] =>
  (catalogIds ?? [])
    .map((catalogId) => getTraitCatalogEntry(catalogId))
    .filter(
      (entry): entry is TraitCatalogEntry => Boolean(entry),
    );

export const getCatalogTraits = (
  catalogIds: readonly string[] | undefined,
): Trait[] =>
  getTraitCatalogEntries(catalogIds).map(
    (entry) => entry.trait,
  );