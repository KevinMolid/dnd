import type { CharacterSheetData, Trait } from "./types";
import { getSpeciesGrantedFeatIds } from "./getSpeciesGrantedFeatIds";
import { getSpeciesTraits } from "./getSpeciesTraits";
import {
  getBackgroundById,
  getClassById,
  getFeatById,
  getSubclassById,
} from "./helpers";

type CharacterLike = Pick<
  CharacterSheetData,
  | "classId"
  | "speciesId"
  | "backgroundId"
  | "originFeatId"
  | "level"
  | "choices"
> & {
  /**
   * Optional future multiclass shape.
   * Example:
   * classes: [
   *   { classId: "rogue", level: 3, subclassId: "assassin" },
   *   { classId: "fighter", level: 2, subclassId: "battle-master" },
   * ]
   */
  classes?: Array<{
    classId: string;
    level: number;
    subclassId?: string | null;
  }>;
};

export function getAllCharacterTraits(character: CharacterLike): Trait[] {
  const allTraits: Trait[] = [];

  // Species traits and species-based trait choices
  const speciesTraits = getSpeciesTraits(
    character.speciesId,
    character.choices,
  );
  allTraits.push(...speciesTraits);

  // Class and subclass traits
  const classEntries = getCharacterClassEntries(character);

  for (const classEntry of classEntries) {
    const classDef = getClassById(classEntry.classId);
    if (!classDef) continue;

    for (let lvl = 1; lvl <= classEntry.level; lvl += 1) {
      const traitsAtLevel = classDef.featuresByLevel[lvl] ?? [];
      allTraits.push(...traitsAtLevel);
    }

    const subclassIds = getSubclassIdsForClassEntry(character, classEntry);

    for (const subclassId of subclassIds) {
      const subclassDef = getSubclassById(subclassId);
      if (!subclassDef) continue;

      // Guard for future multiclass correctness
      if (subclassDef.classId !== classEntry.classId) continue;

      for (let lvl = 1; lvl <= classEntry.level; lvl += 1) {
        const traitsAtLevel = subclassDef.featuresByLevel[lvl] ?? [];
        allTraits.push(...traitsAtLevel);
      }
    }
  }

  // Background-granted origin feat traits
  const backgroundDef = getBackgroundById(character.backgroundId);
  if (backgroundDef?.originFeatId) {
    const feat = getFeatById(backgroundDef.originFeatId);
    if (feat) {
      allTraits.push(...feat.traits);
    }
  }

  // Chosen origin feat traits
  if (character.originFeatId) {
    const feat = getFeatById(character.originFeatId);
    if (feat) {
      allTraits.push(...feat.traits);
    }
  }

  // Species-granted feat traits
  const speciesGrantedFeatIds = getSpeciesGrantedFeatIds(
    character.speciesId,
    character.choices,
  );

  for (const featId of speciesGrantedFeatIds) {
    const feat = getFeatById(featId);
    if (feat) {
      allTraits.push(...feat.traits);
    }
  }

  // Feats chosen during level-up
  const levelUpFeatIds = getLevelUpFeatIds(character);
  for (const featId of levelUpFeatIds) {
    const feat = getFeatById(featId);
    if (feat) {
      allTraits.push(...feat.traits);
    }
  }

  return dedupeTraits(allTraits);
}

function getCharacterClassEntries(character: CharacterLike) {
  if (Array.isArray(character.classes) && character.classes.length > 0) {
    return character.classes;
  }

  const baseSubclassId =
    character.choices?.subclassId ??
    findFirstChosenSubclassId(character);

  return [
    {
      classId: character.classId,
      level: character.level,
      subclassId: baseSubclassId ?? null,
    },
  ];
}

function getLevelUpDecisions(character: CharacterLike) {
  return character.choices?.levelUpDecisions ?? {};
}

function getLevelUpFeatIds(character: CharacterLike): string[] {
  const decisions = getLevelUpDecisions(character);

  return Object.values(decisions)
    .map((decision: any) => decision?.featId)
    .filter((featId): featId is string => typeof featId === "string");
}

function findFirstChosenSubclassId(character: CharacterLike): string | null {
  const decisions = getLevelUpDecisions(character);

  for (const decision of Object.values(decisions) as any[]) {
    if (typeof decision?.subclassId === "string") {
      return decision.subclassId;
    }
  }

  return null;
}

function getSubclassIdsForClassEntry(
  character: CharacterLike,
  classEntry: { classId: string; level: number; subclassId?: string | null },
): Set<string> {
  const subclassIds = new Set<string>();

  if (classEntry.subclassId) {
    subclassIds.add(classEntry.subclassId);
  }

  // Current single-class model:
  // any chosen subclass in level-up decisions belongs to the one current class.
  // Future multiclass can store subclassId directly on each class entry.
  if (!character.classes || character.classes.length === 0) {
    const decisions = getLevelUpDecisions(character);

    for (const decision of Object.values(decisions) as any[]) {
      if (typeof decision?.subclassId === "string") {
        subclassIds.add(decision.subclassId);
      }
    }
  }

  return subclassIds;
}

function dedupeTraits(traits: Trait[]): Trait[] {
  const seen = new Set<string>();
  const result: Trait[] = [];

  for (const trait of traits) {
    if (seen.has(trait.id)) continue;
    seen.add(trait.id);
    result.push(trait);
  }

  return result;
}