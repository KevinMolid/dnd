import type { CharacterChoices, CharacterSubclassId } from "../../../types";

export type ClericDomainId = Extract<
  CharacterSubclassId,
  "life-domain" | "light-domain" | "trickery-domain" | "war-domain"
>;

export const isClericDomainId = (value: unknown): value is ClericDomainId =>
  value === "life-domain" ||
  value === "light-domain" ||
  value === "trickery-domain" ||
  value === "war-domain";

export const getChosenClericDomain = (
  choices?: CharacterChoices | null,
): ClericDomainId | null => {
  const subclassId = choices?.subclassId;
  return isClericDomainId(subclassId) ? subclassId : null;
};