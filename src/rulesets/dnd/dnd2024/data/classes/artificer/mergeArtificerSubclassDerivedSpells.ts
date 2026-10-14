import type { CharacterSheetData, CharacterSpell, LevelNumber } from "../../../types";
import { getArtificerSubclassGrantedSpellsFromChoices } from "./getArtificerSubclassGrantedSpells";
export const mergeArtificerSubclassDerivedSpells = (character:CharacterSheetData, spells:CharacterSpell[]):CharacterSpell[] => {
 if(character.classId !== "artificer") return spells;
 const granted = getArtificerSubclassGrantedSpellsFromChoices({artificerLevel:character.level as LevelNumber,choices:character.choices});
 const merged = new Map<string,CharacterSpell>();
 for(const spell of [...spells,...granted]) {const key = `${spell.sourceType}:${spell.sourceId}:${spell.spellId}:${spell.level ?? "x"}`; const current=merged.get(key); merged.set(key,current?{...current,...spell,prepared:!!(current.prepared||spell.prepared),alwaysPrepared:!!(current.alwaysPrepared||spell.alwaysPrepared),countsAgainstPreparationLimit:(current.countsAgainstPreparationLimit??true)&&(spell.countsAgainstPreparationLimit??true)}:spell);}
 return [...merged.values()];
};
