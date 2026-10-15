import type { ChoiceMapByLevel, SkillId, SpellId, ToolId } from "../../../types";
// Supply the canonical Artificer cantrip IDs from the spell registry here.
// Do not pass the full spell list, as that contains spells of levels 1–5.
export const artificerSelectableCantrips: SpellId[] = [
  "acid-splash", "dancing-lights", "elementalism", "fire-bolt", "guidance", "light",
  "mage-hand", "message", "poison-spray", "prestidigitation", "ray-of-frost",
  "resistance", "shocking-grasp", "spare-the-dying", "thorn-whip", "thunderclap", "true-strike",
];

export const artificerSkillChoiceOptions: SkillId[] = ["arcana", "history", "investigation", "medicine", "nature", "perception", "sleight-of-hand"];
export const artificerToolChoiceOptions: ToolId[] = ["alchemists-supplies", "brewers-supplies", "calligraphers-supplies", "carpenters-tools", "cartographers-tools", "cobblers-tools", "cooks-utensils", "glassblowers-tools", "jewelers-tools", "leatherworkers-tools", "masons-tools", "painters-supplies", "potters-tools", "smiths-tools", "weavers-tools", "woodcarvers-tools"];
export const artificerToolChoicesByLevel: ChoiceMapByLevel<ToolId> = {
  1: [{ id: "artificer-artisan-tool", level: 1, name: "Artisan's Tools", choose: 1, source: "tool-proficiencies", options: artificerToolChoiceOptions }],
};
export const artificerSubclassChoicesByLevel: ChoiceMapByLevel<string> = {
  3: [{ id: "artificer-subclass", level: 3, name: "Artificer Subclass", choose: 1, source: "subclass", options: ["alchemist", "armorer", "artillerist", "battle-smith", "cartographer"] }],
};
// Only cantrips in the actual spell registry; Mending is a fixed grant and cannot be picked twice.

export const artificerCantripChoicesByLevel: ChoiceMapByLevel<SpellId> = {
  1: [{ id: "artificer-cantrips-1", level: 1, name: "Artificer Cantrips", choose: 2, source: "cantrips", options: artificerSelectableCantrips, description: "Choose two Artificer cantrips; Mending is granted separately." }],
  10: [{ id: "artificer-cantrips-10", level: 10, name: "Additional Artificer Cantrip", choose: 1, source: "cantrips", options: artificerSelectableCantrips }],
  14: [{ id: "artificer-cantrips-14", level: 14, name: "Additional Artificer Cantrip", choose: 1, source: "cantrips", options: artificerSelectableCantrips }],
};
