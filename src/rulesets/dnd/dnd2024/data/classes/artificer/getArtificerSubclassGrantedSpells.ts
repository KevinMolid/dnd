import type { CharacterChoices, CharacterSpell, LevelNumber } from "../../../types";
import { artificerSubclassSpellMap } from "./artificerSubclassSpellMap";
import { getChosenArtificerSubclass, type ArtificerSubclassId } from "./getArtificerSubclassChoice";
export const getArtificerSubclassGrantedSpells = ({artificerLevel,subclassId}:{artificerLevel:LevelNumber;subclassId:ArtificerSubclassId|null}):CharacterSpell[] =>
 !subclassId ? [] : artificerSubclassSpellMap[subclassId].filter(e => artificerLevel >= e.minArtificerLevel).map(e=>({spellId:e.spellId,level:e.spellLevel,sourceType:"subclass",sourceId:subclassId,prepared:true,alwaysPrepared:true,countsAgainstPreparationLimit:false}));
export const getArtificerSubclassGrantedSpellsFromChoices = ({artificerLevel,choices}:{artificerLevel:LevelNumber;choices?:CharacterChoices|null}) => getArtificerSubclassGrantedSpells({artificerLevel,subclassId:getChosenArtificerSubclass(choices)});
