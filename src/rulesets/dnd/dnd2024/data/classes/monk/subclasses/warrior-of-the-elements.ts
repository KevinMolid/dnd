import type { CharacterSubclass } from "../../../../types";
export const warriorOfTheElements: CharacterSubclass = {
  id: "warrior-of-the-elements",
  name: "Warrior Of The Elements",
  classId: "monk",
  featuresByLevel: {
    3: [
      { id: "elemental-attunement", name: "Elemental Attunement", level: 3, description: "Learn Elementalism and channel elemental energy through your Unarmed Strikes." },
      { id: "elemental-strikes", name: "Elemental Strikes", level: 3, description: "Spend 1 Focus Point to extend Unarmed Strike reach by 10 feet and deal Acid, Cold, Fire, Lightning, or Thunder damage for 10 minutes. On a hit, move a target up to 10 feet on a failed Strength save." },
    ],
    6: [
      { id: "elemental-burst", name: "Elemental Burst", level: 6, description: "Spend 2 Focus Points as a Magic action to create a 20-foot-radius burst within 120 feet; creatures make a Dexterity save against three Martial Arts dice of elemental damage, half on success." },
    ],
    11: [
      { id: "stride-of-the-elements", name: "Stride of the Elements", level: 11, description: "While Elemental Strikes is active, gain Fly and Swim Speeds equal to your Speed." },
    ],
    17: [
      { id: "elemental-epitome", name: "Elemental Epitome", level: 17, description: "Improve elemental strikes, mobility, and reactive damage while Elemental Strikes is active." },
    ],
  },
};
