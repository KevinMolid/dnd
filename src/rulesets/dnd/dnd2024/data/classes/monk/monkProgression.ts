export const monkMartialArtsDie = (level: number): number => level >= 17 ? 12 : level >= 11 ? 10 : level >= 5 ? 8 : 6;
export const monkFocusPoints = (level: number): number => level >= 2 ? Math.min(level, 20) : 0;
export const monkUnarmoredMovementBonus = (level: number): number => level >= 18 ? 30 : level >= 14 ? 25 : level >= 10 ? 20 : level >= 6 ? 15 : level >= 2 ? 10 : 0;
export const monkFocusSaveDC = (proficiencyBonus: number, wisdomModifier: number): number => 8 + proficiencyBonus + wisdomModifier;
