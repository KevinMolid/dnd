import type { CharacterSheetData } from "../../../types";
import type { CircleOfTheLandType } from "./circleOfTheLandSpellMap";

const LAND_TYPES: CircleOfTheLandType[] = [
  "arid",
  "polar",
  "temperate",
  "tropical",
];

export const isCircleOfTheLandType = (
  value: unknown,
): value is CircleOfTheLandType =>
  typeof value === "string" &&
  LAND_TYPES.includes(value as CircleOfTheLandType);

export const getCircleOfTheLandChosenLandType = (
  character: CharacterSheetData,
): CircleOfTheLandType | null => {
  const raw = character.choices?.levelUpDecisions?.[3]?.circleOfTheLandType;

  if (isCircleOfTheLandType(raw)) {
    return raw;
  }

  return null;
};