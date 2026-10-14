import type { ChoiceMapByLevel, SkillId, SpellId } from "../../../types";
export const artificerSkillChoiceOptions: SkillId[] = ["arcana", "history", "investigation", "medicine", "nature", "perception", "sleight-of-hand"];
export const artificerSubclassChoicesByLevel: ChoiceMapByLevel<string> = {3:[{id:"artificer-subclass",level:3,name:"Artificer Subclass",choose:1,source:"subclass",options:["alchemist","armorer","artillerist","battle-smith","cartographer"]}]};
// The spell-selection UI should populate this from the canonical Artificer spell list.
export const artificerCantripChoicesByLevel: ChoiceMapByLevel<SpellId> = {
 1:[{id:"artificer-cantrips-1",level:1,name:"Artificer Cantrips",choose:2,source:"cantrips",description:"Choose two Artificer cantrips."}],
 10:[{id:"artificer-cantrips-10",level:10,name:"Additional Artificer Cantrip",choose:1,source:"cantrips"}],
 14:[{id:"artificer-cantrips-14",level:14,name:"Additional Artificer Cantrip",choose:1,source:"cantrips"}],
};
