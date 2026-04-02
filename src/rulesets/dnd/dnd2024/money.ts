export type MoneyBreakdown = {
  gp: number;
  sp: number;
  cp: number;
};

export type LegacyCharacterMoney = {
  cp?: number;
  sp?: number;
  ep?: number;
  gp?: number;
  pp?: number;
};

export const normalizeCopper = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
};

export const copperToMoneyBreakdown = (totalCp: number): MoneyBreakdown => {
  const safeCp = normalizeCopper(totalCp);

  const gp = Math.floor(safeCp / 100);
  const remainderAfterGp = safeCp % 100;

  const sp = Math.floor(remainderAfterGp / 10);
  const cp = remainderAfterGp % 10;

  return { gp, sp, cp };
};

export const moneyBreakdownToCopper = ({
  gp = 0,
  sp = 0,
  cp = 0,
}: Partial<MoneyBreakdown>): number => {
  const safeGp = Math.max(0, Math.floor(gp));
  const safeSp = Math.max(0, Math.floor(sp));
  const safeCp = Math.max(0, Math.floor(cp));

  return safeGp * 100 + safeSp * 10 + safeCp;
};

export const formatMoneyShort = (totalCp: number): string => {
  const { gp, sp, cp } = copperToMoneyBreakdown(totalCp);
  return `${gp} GP, ${sp} SP, ${cp} CP`;
};

export const legacyMoneyToCopper = ({
  money,
  gold,
}: {
  money?: LegacyCharacterMoney | null;
  gold?: number | null;
}): number => {
  const cp = Math.max(0, Math.floor(money?.cp ?? 0));
  const sp = Math.max(0, Math.floor(money?.sp ?? 0));
  const ep = Math.max(0, Math.floor(money?.ep ?? 0));
  const gp = Math.max(0, Math.floor(money?.gp ?? gold ?? 0));
  const pp = Math.max(0, Math.floor(money?.pp ?? 0));

  return cp + sp * 10 + ep * 50 + gp * 100 + pp * 1000;
};

export const getCharacterMoneyCp = (character: {
  moneyCp?: number | null;
  money?: LegacyCharacterMoney | null;
  gold?: number | null;
}): number => {
  if (
    typeof character.moneyCp === "number" &&
    Number.isFinite(character.moneyCp)
  ) {
    return normalizeCopper(character.moneyCp);
  }

  return legacyMoneyToCopper({
    money: character.money,
    gold: character.gold,
  });
};