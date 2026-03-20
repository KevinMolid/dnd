import { classesById } from "./helpers";

type CharacterWithHp = {
  classId: string;
  level?: number;
  maxHp?: number;
  currentHp?: number;
  hp?: number;
  abilityScores?: Record<string, number>;
  derived?: {
    stats?: {
      maxHp?: number;
      currentHp?: number;
    };
  };
  choices?: {
    levelUpDecisions?: Record<
      number,
      {
        asi?: {
          plus2?: string;
          plus1a?: string;
          plus1b?: string;
        };
      }
    >;
  };
};

const getAbilityModifier = (score: number) => Math.floor((score - 10) / 2);

const getFinalConScore = (character: CharacterWithHp) => {
  const baseCon = character.abilityScores?.con ?? 10;
  const decisions = character.choices?.levelUpDecisions ?? {};

  let bonus = 0;

  Object.values(decisions).forEach((decision) => {
    if (decision?.asi?.plus2 === "con") bonus += 2;
    if (decision?.asi?.plus1a === "con") bonus += 1;
    if (decision?.asi?.plus1b === "con") bonus += 1;
  });

  return baseCon + bonus;
};

export const getCalculatedMaxHp = (character: CharacterWithHp) => {
  const storedMaxHp = character.derived?.stats?.maxHp ?? character.maxHp;
  if (typeof storedMaxHp === "number" && storedMaxHp > 0) {
    return storedMaxHp;
  }

  const classDef = classesById[character.classId];
  const level = Math.max(1, character.level ?? 1);

  if (!classDef) return 1;

  const conScore = getFinalConScore(character);
  const conMod = getAbilityModifier(conScore);

  return (
    classDef.hitDie +
    conMod +
    (level - 1) * (Math.floor(classDef.hitDie / 2) + 1 + conMod)
  );
};

export const getCalculatedCurrentHp = (character: CharacterWithHp) => {
  const storedCurrentHp =
    character.derived?.stats?.currentHp ??
    character.currentHp ??
    character.hp;

  if (typeof storedCurrentHp === "number" && storedCurrentHp >= 0) {
    return storedCurrentHp;
  }

  return getCalculatedMaxHp(character);
};

export const getCharacterHp = (character: CharacterWithHp) => {
  const maxHp = getCalculatedMaxHp(character);
  const currentHp = Math.max(
    0,
    Math.min(getCalculatedCurrentHp(character), maxHp),
  );

  return {
    currentHp,
    maxHp,
  };
};