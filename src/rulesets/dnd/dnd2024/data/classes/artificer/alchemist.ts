import type { CharacterSubclass } from "../../../types";
export const alchemist: CharacterSubclass = {
 id:"alchemist",name:"Alchemist",classId:"artificer",description:"Create magical concoctions and support allies.",
 featuresByLevel:{
  3:[{id:"alchemist-experimental-elixir",name:"Experimental Elixir",level:3,description:"Produce magical elixirs to aid allies."}],
  5:[{id:"alchemist-alchemical-savant",name:"Alchemical Savant",level:5,description:"Enhance selected spell effects through alchemical expertise."}],
  9:[{id:"alchemist-restorative-reagents",name:"Restorative Reagents",level:9,description:"Improve the protective benefits of your elixirs."}],
  15:[{id:"alchemist-chemical-mastery",name:"Chemical Mastery",level:15,description:"Gain advanced alchemical resilience and restoration."}],
 },
};
