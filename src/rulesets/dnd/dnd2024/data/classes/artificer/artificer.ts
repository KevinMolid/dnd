import type { CharacterClass } from "../../../types";
import { artificerCantripsKnownByLevel, artificerPreparedSpellsByLevel } from "./artificerProgression";

export const artificer: CharacterClass = {
 id: "artificer", name: "Artificer", hitDie: 8, primaryAbilities: ["int"],
 savingThrowProficiencies: ["con", "int"],
 armorTraining: ["light-armor", "medium-armor", "shields"],
 weaponProficiencies: ["simple-weapons"],
 toolProficiencies: ["thieves-tools", "tinkers-tools"],
 toolProficiencyChoice: { choose: 1, options: ["alchemists-supplies", "brewers-supplies", "calligraphers-supplies", "carpenters-tools", "cartographers-tools", "cobblers-tools", "cooks-utensils", "glassblowers-tools", "jewelers-tools", "leatherworkers-tools", "masons-tools", "painters-supplies", "potters-tools", "smiths-tools", "weavers-tools", "woodcarvers-tools"] },
 skillChoice: { choose: 2, options: ["arcana", "history", "investigation", "medicine", "nature", "perception", "sleight-of-hand"] },
 startingEquipment: {choose: 1, options: [
  {id:"artificer-starting-equipment-a",label:"Studded Leather Armor, Dagger, Thieves’ Tools, Tinker’s Tools, Dungeoneer’s Pack, 16 GP",grants:[{type:"item",id:"studded-leather",quantity:1},{type:"item",id:"dagger",quantity:1},{type:"item",id:"thieves-tools",quantity:1},{type:"item",id:"tinkers-tools",quantity:1},{type:"item",id:"dungeoneers-pack",quantity:1},{type:"currency",amount:16,currency:"gp"}]},
  {id:"artificer-starting-equipment-b",label:"150 GP",grants:[{type:"currency",amount:150,currency:"gp"}]}
 ]},
 spellcasting: { id:"artificer-spellcasting",name:"Artificer Spellcasting",sourceType:"class",sourceId:"artificer",castingAbility:"int",spellListId:"artificer",progressionType:"half",preparationMode:"custom",ritualCasting:true,slotTableId:"half-caster",
  cantrips:{knownByLevel:artificerCantripsKnownByLevel,chooseAtStart:2,additionalChoicesByLevel:{10:1,14:1},replacementRules:["You can replace one Artificer cantrip after a Long Rest."]},
  preparedSpells:{preparedByLevel:artificerPreparedSpellsByLevel,chooseAtStart:{count:2,spellLevel:1},replacementRules:["After a Long Rest, you can replace your prepared Artificer spells with spells for which you have slots.","Always-prepared subclass spells do not count against your limit."]},
  recommendedSpells:[{spellId:"cure-wounds",spellLevel:1},{spellId:"grease",spellLevel:1}],
  notes:["Mending is granted separately by Tinkers Magic and does not count against your selected Artificer cantrips.","Artificer spells require a proficient tool focus in hand, or an eligible replicated wand/weapon.","You regain spell slots after a Long Rest."]
 },
 subclasses:[
  {id:"alchemist",name:"Alchemist",description:"Create magical concoctions and support allies."},
  {id:"armorer",name:"Armorer",description:"Enhance your armor with arcane technology."},
  {id:"artillerist",name:"Artillerist",description:"Deploy a magical cannon to support your party."},
  {id:"battle-smith",name:"Battle Smith",description:"Fight alongside a constructed defender."},
  {id:"cartographer",name:"Cartographer",description:"Use magical maps to aid exploration and reposition allies."},
 ],
 featuresByLevel: {
  1: [
   {id:"spellcasting",name:"Spellcasting",level:1,description:"Cast Artificer spells using Intelligence. A proficient set of artisan’s tools, tinkers tools, or thieves’ tools serves as your focus."},
   {id:"tinkers-magic",name:"Tinker's Magic",level:1,description:"You learn Mending and can create temporary mundane equipment with tinkers’ tools. Uses per Long Rest equal your Intelligence modifier (minimum 1)."},
  ],
  2: [
   {id:"replicate-magic-item",name:"Replicate Magic Item",level:2,description:"Learn magic-item plans and create different replicated items at the end of a Long Rest; track known plans separately from active items."},
  ],
  3: [
   {id:"artificer-subclass",name:"Artificer Subclass",level:3,description:"Choose Alchemist, Armorer, Artillerist, Battle Smith, or Cartographer."},
  ],
  4: [
   {id:"asi-4",name:"Ability Score Improvement",level:4,description:"Choose Ability Score Improvement or another eligible feat."},
  ],
  5: [
   {id:"subclass-feature-5",name:"Subclass Feature",level:5,description:"Gain a feature from your Artificer subclass."},
  ],
  6: [
   {id:"magic-item-tinker",name:"Magic Item Tinker",level:6,description:"Use Charge, Drain, and Transmute Magic Item to manipulate replicated magic items and spell slots."},
  ],
  7: [
   {id:"flash-of-genius",name:"Flash of Genius",level:7,description:"When you or a nearby creature fails an ability check or saving throw, use your Reaction to improve the result with your Intelligence modifier."},
  ],
  8: [
   {id:"asi-8",name:"Ability Score Improvement",level:8,description:"Choose Ability Score Improvement or another eligible feat."},
  ],
  9: [
   {id:"subclass-feature-9",name:"Subclass Feature",level:9,description:"Gain a feature from your Artificer subclass."},
  ],
  10: [
   {id:"magic-item-adept",name:"Magic Item Adept",level:10,description:"You can attune to up to four magic items."},
  ],
  11: [
   {id:"spell-storing-item",name:"Spell-Storing Item",level:11,description:"Store a prepared Artificer spell of level 1–3 with a Magic action casting time and without consumed material components in an item."},
  ],
  12: [
   {id:"asi-12",name:"Ability Score Improvement",level:12,description:"Choose Ability Score Improvement or another eligible feat."},
  ],
  14: [
   {id:"advanced-artifice",name:"Advanced Artifice",level:14,description:"Attune to up to five magic items and regain one use of Flash of Genius after a Short Rest."},
  ],
  15: [
   {id:"subclass-feature-15",name:"Subclass Feature",level:15,description:"Gain a feature from your Artificer subclass."},
  ],
  16: [
   {id:"asi-16",name:"Ability Score Improvement",level:16,description:"Choose Ability Score Improvement or another eligible feat."},
  ],
  18: [
   {id:"magic-item-master",name:"Magic Item Master",level:18,description:"Attune to up to six magic items."},
  ],
  19: [
   {id:"epic-boon",name:"Epic Boon",level:19,description:"Choose an Epic Boon feat or another feat you qualify for."},
  ],
  20: [
   {id:"soul-of-artifice",name:"Soul of Artifice",level:20,description:"Use replicated items to avert defeat and recharge Flash of Genius while attuned to a magic item."},
  ],
 },
};
