export type MonsterType =
  | "Aberration"
  | "Beast"
  | "Celestial"
  | "Construct"
  | "Dragon"
  | "Elemental"
  | "Fey"
  | "Fiend"
  | "Giant"
  | "Humanoid"
  | "Monstrosity"
  | "Ooze"
  | "Plant"
  | "Undead";

export type MonsterTextEntry = {
  name: string;
  text: string;
};

export type MonsterDefinition = {
  id: string;
  name: string;
  type: MonsterType;
  description: string;
  img?: string;

  armorClass: number;
  armorClassNotes?: string;

  hp: number;
  speed: number | string;

  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };

  skills?: string;
  senses?: string;
  language?: string;

  challengeRating: string;
  xp: number;

  traits?: MonsterTextEntry[];
  actions?: MonsterTextEntry[];
  bonusActions?: MonsterTextEntry[];
  reactions?: MonsterTextEntry[];
};

export const monsterTypes: MonsterType[] = [
  "Aberration",
  "Beast",
  "Celestial",
  "Construct",
  "Dragon",
  "Elemental",
  "Fey",
  "Fiend",
  "Giant",
  "Humanoid",
  "Monstrosity",
  "Ooze",
  "Plant",
  "Undead",
];