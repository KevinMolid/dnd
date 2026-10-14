import type { CharacterChoices, CharacterSubclassId } from "../../../types";
export type ArtificerSubclassId = Extract<CharacterSubclassId, "alchemist" | "armorer" | "artillerist" | "battle-smith" | "cartographer">;
const ids = ["alchemist", "armorer", "artillerist", "battle-smith", "cartographer"] as const;
export const isArtificerSubclassId = (v: unknown): v is ArtificerSubclassId => ids.some(id => id === v);
export const getChosenArtificerSubclass = (choices?: CharacterChoices | null): ArtificerSubclassId | null => isArtificerSubclassId(choices?.subclassId) ? choices!.subclassId as ArtificerSubclassId : null;
