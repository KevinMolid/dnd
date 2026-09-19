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

export type MonsterSize =
  | "Tiny"
  | "Small"
  | "Medium"
  | "Large"
  | "Huge"
  | "Gargantuan";

export type AbilityName =
  | "str"
  | "dex"
  | "con"
  | "int"
  | "wis"
  | "cha";

export type MonsterTextEntry = {
  name: string;
  text: string;
};

export type MonsterSpeed = {
  walk?: number;
  burrow?: number;
  climb?: number;
  fly?: number;
  hover?: boolean;
  swim?: number;
  notes?: string;
};

export type MonsterSavingThrows = Partial<
  Record<AbilityName, number>
>;

export type MonsterSkills = Record<string, number>;

export type MonsterSenses = {
  blindsight?: number;
  darkvision?: number;
  tremorsense?: number;
  truesight?: number;
  passivePerception?: number;

  notes?: string;
};

export type MonsterDefinition = {
  // Identity
  id: string;
  name: string;
  type: MonsterType;
  subtype?: string;
  size: MonsterSize;
  alignment?: string;

  img?: string;

  // Defense
  armorClass: number;
  armorClassNotes?: string;

  hp: number;
  hitDice?: string;

  // Initiative
  initiative?: {
    modifier: number;
    score?: number;
  };

  // Equipment
  gear?: string[];

  // Monster information
  habitat?: string[];
  treasure?: string[];

  // Movement
  speed: MonsterSpeed;

  // Ability Scores
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };

  // Proficiencies
  savingThrows?: MonsterSavingThrows;
  skills?: MonsterSkills;

  // Defenses
  damageVulnerabilities?: string[];
  damageResistances?: string[];
  damageImmunities?: string[];
  conditionImmunities?: string[];

  // Senses & Communication
  senses?: MonsterSenses;
  languages?: string[];

  // Challenge
  challengeRating: string;
  xp: number;
  proficiencyBonus?: number;

  // Stat Block Sections
  traits?: MonsterTextEntry[];
  actions?: MonsterTextEntry[];
  bonusActions?: MonsterTextEntry[];
  reactions?: MonsterTextEntry[];

  // Higher-level monsters
  legendaryActions?: MonsterTextEntry[];
  lairActions?: MonsterTextEntry[];
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