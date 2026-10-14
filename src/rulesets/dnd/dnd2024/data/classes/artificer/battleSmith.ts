import type { CharacterSubclass } from "../../../types";
export const battleSmith: CharacterSubclass = {
 id:"battle-smith",name:"Battle Smith",classId:"artificer",description:"Fight alongside a constructed defender.",
 featuresByLevel:{
  3:[{id:"battle-smith-steel-defender",name:"Steel Defender",level:3,description:"Fight alongside a magical constructed companion."}],
  5:[{id:"battle-smith-extra-attack",name:"Extra Attack",level:5,description:"Attack twice when you take the Attack action."}],
  9:[{id:"battle-smith-arcane-jolt",name:"Arcane Jolt",level:9,description:"Channel magical power through an attack or your defender."}],
  15:[{id:"battle-smith-improved-defender",name:"Improved Defender",level:15,description:"Upgrade your defender and its combat support."}],
 },
};
