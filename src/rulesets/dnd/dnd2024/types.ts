export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export type SkillId =
  | "acrobatics"
  | "animal-handling"
  | "arcana"
  | "athletics"
  | "deception"
  | "history"
  | "insight"
  | "intimidation"
  | "investigation"
  | "medicine"
  | "nature"
  | "perception"
  | "performance"
  | "persuasion"
  | "religion"
  | "sleight-of-hand"
  | "stealth"
  | "survival";

export type ToolId =
  | "alchemists-supplies"
  | "brewers-supplies"
  | "calligraphers-supplies"
  | "carpenters-tools"
  | "cartographers-tools"
  | "cooks-utensils"
  | "disguise-kit"
  | "forgery-kit"
  | "gamers-set"
  | "herbalism-kit"
  | "leatherworkers-tools"
  | "masons-tools"
  | "musical-instrument"
  | "navigators-tools"
  | "painters-supplies"
  | "potters-tools"
  | "smiths-tools"
  | "thieves-tools"
  | "tinkers-tools"
  | "weavers-tools"
  | "woodcarvers-tools"
  | "vehicles-land"
  | "vehicles-water";

export type OriginFeatId =
  | "alert"
  | "crafter"
  | "healer"
  | "lucky"
  | "magic-initiate"
  | "musician"
  | "savage-attacker"
  | "skilled"
  | "tavern-brawler"
  | "tough";

export type RulesOption = {
  id: string;
  name: string;
};

export type Background = {
  id: string;
  name: string;
  abilityOptions: AbilityKey[];
  skillProficiencies: [SkillId, SkillId];
  toolProficiency: ToolId;
  originFeatId: OriginFeatId;
  equipmentGold: number;
};