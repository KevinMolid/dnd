import type { SpellId, SpellLevel } from "../../../types";

export type CircleOfTheLandType =
  | "arid"
  | "polar"
  | "temperate"
  | "tropical";

export type CircleOfTheLandGrantedSpell = {
  spellId: SpellId;
  minCharacterLevel: number;
  spellLevel: SpellLevel;
  alwaysPrepared: true;
  countsAgainstLimit: false;
};

export const circleOfTheLandSpellMap: Record<
  CircleOfTheLandType,
  CircleOfTheLandGrantedSpell[]
> = {
  arid: [
    {
      spellId: "blur",
      minCharacterLevel: 3,
      spellLevel: 2,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "burning-hands",
      minCharacterLevel: 3,
      spellLevel: 1,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "fire-bolt",
      minCharacterLevel: 3,
      spellLevel: 0,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "fireball",
      minCharacterLevel: 5,
      spellLevel: 3,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "blight",
      minCharacterLevel: 7,
      spellLevel: 4,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "wall-of-stone",
      minCharacterLevel: 9,
      spellLevel: 5,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
  ],

  polar: [
    {
      spellId: "fog-cloud",
      minCharacterLevel: 3,
      spellLevel: 1,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "hold-person",
      minCharacterLevel: 3,
      spellLevel: 2,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "ray-of-frost",
      minCharacterLevel: 3,
      spellLevel: 0,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "sleet-storm",
      minCharacterLevel: 5,
      spellLevel: 3,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "ice-storm",
      minCharacterLevel: 7,
      spellLevel: 4,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "cone-of-cold",
      minCharacterLevel: 9,
      spellLevel: 5,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
  ],

  temperate: [
    {
      spellId: "misty-step",
      minCharacterLevel: 3,
      spellLevel: 2,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "shocking-grasp",
      minCharacterLevel: 3,
      spellLevel: 0,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "sleep",
      minCharacterLevel: 3,
      spellLevel: 1,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "lightning-bolt",
      minCharacterLevel: 5,
      spellLevel: 3,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "freedom-of-movement",
      minCharacterLevel: 7,
      spellLevel: 4,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "tree-stride",
      minCharacterLevel: 9,
      spellLevel: 5,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
  ],

  tropical: [
    {
      spellId: "acid-splash",
      minCharacterLevel: 3,
      spellLevel: 0,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "ray-of-sickness",
      minCharacterLevel: 3,
      spellLevel: 1,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "web",
      minCharacterLevel: 3,
      spellLevel: 2,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "stinking-cloud",
      minCharacterLevel: 5,
      spellLevel: 3,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "polymorph",
      minCharacterLevel: 7,
      spellLevel: 4,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
    {
      spellId: "insect-plague",
      minCharacterLevel: 9,
      spellLevel: 5,
      alwaysPrepared: true,
      countsAgainstLimit: false,
    },
  ],
};