import type { CharacterSubclass } from "../../../types";
export const artillerist: CharacterSubclass = {
 id:"artillerist",name:"Artillerist",classId:"artificer",description:"Deploy a magical cannon to support your party.",
 featuresByLevel:{
  3:[{id:"artillerist-eldritch-cannon",name:"Eldritch Cannon",level:3,description:"Deploy a magical cannon that supports your allies or damages enemies."}],
  5:[{id:"artillerist-arcane-firearm",name:"Arcane Firearm",level:5,description:"Channel magic through an empowered focus."}],
  9:[{id:"artillerist-explosive-cannon",name:"Explosive Cannon",level:9,description:"Improve your cannon and its offensive potential."}],
  15:[{id:"artillerist-fortified-position",name:"Fortified Position",level:15,description:"Protect allies while deploying additional artillery."}],
 },
};
