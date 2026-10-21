import type { CharacterSubclass } from "../../../../types";
export const warriorOfMercy: CharacterSubclass = {
  id: "warrior-of-mercy",
  name: "Warrior Of Mercy",
  classId: "monk",
  featuresByLevel: {
    3: [
      { id: "implements-of-mercy", name: "Implements of Mercy", level: 3, description: "Gain proficiency in Insight and Medicine and with the Herbalism Kit; gain a mask." },
      { id: "hand-of-healing", name: "Hand of Healing", level: 3, description: "Spend 1 Focus Point as a Magic action to heal a creature you touch by your Martial Arts die plus Wisdom modifier. Replace one Flurry of Blows strike with this healing without spending another Focus Point." },
      { id: "hand-of-harm", name: "Hand of Harm", level: 3, description: "Once per turn, when you hit with an Unarmed Strike, spend 1 Focus Point to deal extra Necrotic damage equal to your Martial Arts die plus Wisdom modifier." },
    ],
    6: [
      { id: "physicians-touch", name: "Physician\u2019s Touch", level: 6, description: "Hand of Healing can end Blinded, Deafened, Paralyzed, Poisoned, or Stunned; Hand of Harm also inflicts Poisoned until the end of your next turn." },
    ],
    11: [
      { id: "flurry-of-healing-and-harm", name: "Flurry of Healing and Harm", level: 11, description: "Replace each Flurry of Blows strike with Hand of Healing without spending additional Focus Points; use Hand of Harm once during Flurry of Blows without its Focus Point cost." },
    ],
    17: [
      { id: "hand-of-ultimate-mercy", name: "Hand of Ultimate Mercy", level: 17, description: "Spend 5 Focus Points to restore a creature that died within the last 24 hours to life, with Hit Points equal to 4d10 + Wisdom modifier; once per Long Rest." },
    ],
  },
};
