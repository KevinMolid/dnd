import type { CharacterChoices, SkillId } from "./types";

const skillIds: SkillId[] = [
  "acrobatics",
  "animal-handling",
  "arcana",
  "athletics",
  "deception",
  "history",
  "insight",
  "intimidation",
  "investigation",
  "medicine",
  "nature",
  "perception",
  "performance",
  "persuasion",
  "religion",
  "sleight-of-hand",
  "stealth",
  "survival",
];

function isSkillId(value: string): value is SkillId {
  return skillIds.includes(value as SkillId);
}

export function getSpeciesGrantedSkillProficiencies(
  speciesId: string,
  choices?: CharacterChoices,
): SkillId[] {
  const speciesTraitChoices = choices?.speciesTraitChoices;

  switch (speciesId) {
    case "human": {
      const selectedSkill = speciesTraitChoices?.["human-skill-choice"];

      if (typeof selectedSkill === "string" && isSkillId(selectedSkill)) {
        return [selectedSkill];
      }

      return [];
    }

    case "elf": {
      const selectedSkill = speciesTraitChoices?.["keen-senses-skill"];

      if (typeof selectedSkill === "string" && isSkillId(selectedSkill)) {
        return [selectedSkill];
      }

      return [];
    }

    default:
      return [];
  }
}