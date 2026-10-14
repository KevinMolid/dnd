import type { CharacterSubclass } from "../../../types";
export const armorer: CharacterSubclass = {
 id:"armorer",name:"Armorer",classId:"artificer",description:"Enhance your armor with arcane technology.",
 featuresByLevel:{
  3:[{id:"armorer-arcane-armor",name:"Arcane Armor",level:3,description:"Customize armor with magical properties and special models."}],
  5:[{id:"armorer-extra-attack",name:"Extra Attack",level:5,description:"Attack twice when you take the Attack action."}],
  9:[{id:"armorer-armor-modifications",name:"Armor Modifications",level:9,description:"Improve the flexibility of your arcane armor."}],
  15:[{id:"armorer-perfected-armor",name:"Perfected Armor",level:15,description:"Unlock a stronger benefit from your chosen armor model."}],
 },
};
