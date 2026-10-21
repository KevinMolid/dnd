import type { CharacterSubclass } from "../../../../types";
export const warriorOfTheOpenHand: CharacterSubclass = {
  id: "warrior-of-the-open-hand",
  name: "Warrior Of The Open Hand",
  classId: "monk",
  featuresByLevel: {
    3: [
      { id: "open-hand-technique", name: "Open Hand Technique", level: 3, description: "When you hit with Flurry of Blows, choose to prevent Opportunity Attacks, push a target 15 feet on a failed Strength save, or knock it Prone on a failed Dexterity save." },
    ],
    6: [
      { id: "wholeness-of-body", name: "Wholeness of Body", level: 6, description: "As a Bonus Action, regain Hit Points equal to one Martial Arts die plus Wisdom modifier; limited uses based on Wisdom modifier, restored on a Long Rest." },
    ],
    11: [
      { id: "fleet-step", name: "Fleet Step", level: 11, description: "When you use a Bonus Action other than Step of the Wind, you can also use Step of the Wind." },
    ],
    17: [
      { id: "quivering-palm", name: "Quivering Palm", level: 17, description: "Spend 4 Focus Points when hitting with an Unarmed Strike to set up deadly vibrations; later use an action to force a Constitution save for massive Force damage." },
    ],
  },
};
