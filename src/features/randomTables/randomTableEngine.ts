import type {
  DiceRollResult,
  RandomEncounterEntry,
  RolledRandomEncounter,
} from "./types";

const normalizeDiceExpression = (
  expression: string,
) => {
  return expression
    .trim()
    .toLowerCase()
    .replace(/\s/g, "");
};

export const rollDiceExpression = (
  expression: string,
): DiceRollResult => {
  const normalized =
    normalizeDiceExpression(
      expression,
    );

  /*
   * Plain integer:
   *
   * "3"
   */
  if (
    /^\d+$/.test(
      normalized,
    )
  ) {
    return {
      expression:
        normalized,

      total:
        Math.max(
          0,
          Number(
            normalized,
          ),
        ),

      rolls: [],

      modifier: 0,
    };
  }

  /*
   * Dice:
   *
   * d6
   * 1d6
   * 2d4
   * 1d4+2
   * 2d6-1
   */
  const match =
    normalized.match(
      /^(\d*)d(\d+)([+-]\d+)?$/,
    );

  if (!match) {
    /*
     * Invalid expressions fall back to 1 so a typo
     * doesn't silently erase an encounter monster.
     */
    return {
      expression:
        normalized,

      total: 1,

      rolls: [],

      modifier: 0,
    };
  }

  const count =
    match[1]
      ? Number(
          match[1],
        )
      : 1;

  const sides =
    Number(
      match[2],
    );

  const modifier =
    match[3]
      ? Number(
          match[3],
        )
      : 0;

  if (
    count <= 0 ||
    sides <= 0
  ) {
    return {
      expression:
        normalized,

      total: 1,

      rolls: [],

      modifier: 0,
    };
  }

  /*
   * Avoid accidental pathological expressions
   * such as 999999d20.
   */
  const safeCount =
    Math.min(
      100,
      count,
    );

  const safeSides =
    Math.min(
      10000,
      sides,
    );

  const rolls =
    Array.from(
      {
        length:
          safeCount,
      },

      () =>
        Math.floor(
          Math.random() *
            safeSides,
        ) + 1,
    );

  const rolledTotal =
    rolls.reduce(
      (
        sum,
        value,
      ) =>
        sum + value,
      0,
    );

  return {
    expression:
      normalized,

    total:
      Math.max(
        0,
        rolledTotal +
          modifier,
      ),

    rolls,

    modifier,
  };
};

const getSafeWeight = (
  value: number,
) => {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 1;
  }

  return Math.max(
    1,
    Math.floor(
      value,
    ),
  );
};

export const rollWeightedEncounterEntry = (
  entries: RandomEncounterEntry[],
): RolledRandomEncounter | null => {
  if (
    entries.length === 0
  ) {
    return null;
  }

  const weightedEntries =
    entries.map(
      (entry) => ({
        entry,

        weight:
          getSafeWeight(
            entry.weight,
          ),
      }),
    );

  const totalWeight =
    weightedEntries.reduce(
      (
        sum,
        item,
      ) =>
        sum +
        item.weight,
      0,
    );

  const weightedRoll =
    Math.floor(
      Math.random() *
        totalWeight,
    ) + 1;

  let cursor = 0;

  let selected =
    weightedEntries[
      weightedEntries.length -
        1
    ].entry;

  for (
    const item of
    weightedEntries
  ) {
    cursor +=
      item.weight;

    if (
      weightedRoll <=
      cursor
    ) {
      selected =
        item.entry;

      break;
    }
  }

  const rolledMonsters =
    (
      selected.monsters ??
      []
    ).map(
      (monster) => {
        const quantityRoll =
          rollDiceExpression(
            monster.quantityExpression ||
              "1",
          );

        return {
          monsterKey:
            monster.monsterKey,

          displayName:
            monster.displayName,

          quantityExpression:
            monster.quantityExpression ||
            "1",

          quantity:
            quantityRoll.total,

          rolls:
            quantityRoll.rolls,
        };
      },
    );

  return {
    entryId:
      selected.id,

    entryName:
      selected.name,

    entryType:
      selected.type,

    description:
      selected.description,

    weightedRoll,

    totalWeight,

    monsters:
      rolledMonsters,
  };
};