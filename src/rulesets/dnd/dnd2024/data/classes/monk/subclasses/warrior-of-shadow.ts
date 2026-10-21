import type { CharacterSubclass } from "../../../../types";
export const warriorOfShadow: CharacterSubclass = {
  id: "warrior-of-shadow",
  name: "Warrior Of Shadow",
  classId: "monk",
  featuresByLevel: {
    3: [
      { id: "shadow-arts", name: "Shadow Arts", level: 3, description: "Spend 1 Focus Point to cast Darkness without material components, and see through the darkness you create. Learn Minor Illusion." },
    ],
    6: [
      { id: "shadow-step", name: "Shadow Step", level: 6, description: "As a Bonus Action while in Dim Light or Darkness, teleport up to 60 feet to an unoccupied space in Dim Light or Darkness and gain Advantage on your next melee attack this turn." },
    ],
    11: [
      { id: "improved-shadow-step", name: "Improved Shadow Step", level: 11, description: "Spend 1 Focus Point to use Shadow Step even when you are not in Dim Light or Darkness, and make an Unarmed Strike immediately after teleporting." },
    ],
    17: [
      { id: "cloak-of-shadows", name: "Cloak of Shadows", level: 17, description: "As a Magic action while in Dim Light or Darkness, become Invisible for 1 minute; spend Focus Points to extend or enhance this effect as specified by the feature." },
    ],
  },
};
