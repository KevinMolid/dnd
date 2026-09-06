import type { EnvironmentEffect } from "./types";

export const DEFAULT_FOG_EFFECT: EnvironmentEffect = {
  id: "fog",
  name: "Fog",

  levels: [
    {
      value: 0,
      name: "No fog",
    },
    {
      value: 1,
      name: "Light fog",
    },
    {
      value: 2,
      name: "Medium fog",
    },
    {
      value: 3,
      name: "Heavy fog",
    },
  ],

  diceSides: 8,

  rollRanges: [
    {
      min: 1,
      max: 2,
      targetLevel: 0,
    },
    {
      min: 3,
      max: 4,
      targetLevel: 1,
    },
    {
      min: 5,
      max: 6,
      targetLevel: 2,
    },
    {
      min: 7,
      max: 8,
      targetLevel: 3,
    },
  ],

  maxChangePerRoll: 1,
};

export const DEFAULT_ENVIRONMENT_EFFECTS: EnvironmentEffect[] = [
  DEFAULT_FOG_EFFECT,
];