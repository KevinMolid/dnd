import { classesById } from "./helpers";

type CharacterWithHp = {
  classId: string;
  level?: number;
  abilityScores?: Record<string, number>;
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
  currentHp?: number;
  hp?: number;
  maxHp?: number;
  derived?: {
    stats?: {
      currentHp?: number;
      maxHp?: number;
    };
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

export const recalculateMaxHp = (character: CharacterWithHp) => {
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

export const getCharacterHp = (character: CharacterWithHp) => {
  const maxHp =
    character.maxHp ??
    character.derived?.stats?.maxHp ??
    recalculateMaxHp(character);

  const currentHpRaw =
    character.currentHp ??
    character.hp ??
    character.derived?.stats?.currentHp ??
    maxHp;

  const currentHp = Math.max(0, Math.min(currentHpRaw, maxHp));

  return { currentHp, maxHp };
};