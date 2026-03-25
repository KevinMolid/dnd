import type { StatBlockProps } from "../components/StatBlock";

export type PlayerEquipment = {
  armor: string | null;
  shield: string | null;
  mainHand: string | null;
  offHand: string | null;
  bothHands: string | null;
  ring1: string | null;
  ring2: string | null;
  boots: string | null;
  gloves: string | null;
  staff: string | null;
  wand: string | null;
};

export type Money = {
  gp: number;
  sp: number;
  cp: number;
};

export type PlayerCharacter = StatBlockProps & {
  inventory: string[];
  equipment: PlayerEquipment;
  money: Money;
};

export const emptyEquipment: PlayerEquipment = {
  armor: null,
  shield: null,
  mainHand: null,
  offHand: null,
  bothHands: null,
  ring1: null,
  ring2: null,
  boots: null,
  gloves: null,
  staff: null,
  wand: null,
};

export const emptyMoney: Money = {
  gp: 0,
  sp: 0,
  cp: 0,
};
