import type { CharacterSubclass } from "../../../types";

export const beastMaster: CharacterSubclass = {
  id: "beast-master",
  name: "Beast Master",
  classId: "ranger",

  description:
    "Beast Masters form a mystical bond with a primal beast and fight alongside their companion as a coordinated pair.",

  featuresByLevel: {
    3: [
      {
        id: "primal-companion",
        name: "Primal Companion",
        level: 3,
        description:
          "You magically summon a primal beast that draws strength from your bond with nature.",
        notes: [
          "Choose Beast of the Land, Beast of the Sea, or Beast of the Sky.",
          "The beast is Friendly to you and your allies and obeys your commands.",
          "In combat, the beast acts during your turn.",
          "It can move and use its Reaction on its own.",
          "The only action it takes without your command is Dodge unless you take a Bonus Action to command it to take an action in its stat block or some other action.",
          "You can also sacrifice one of your attacks when you take the Attack action to command the beast to take its Beast's Strike action.",
          "If you have the Incapacitated condition, the beast acts on its own and isn't limited to Dodge.",
          "If the beast died within the last hour, you can take a Magic action to touch it and expend a spell slot. It returns to life after 1 minute with all its Hit Points restored.",
          "Whenever you finish a Long Rest, you can summon a different primal beast.",
        ],
      },
    ],

    7: [
      {
        id: "exceptional-training",
        name: "Exceptional Training",
        level: 7,
        description:
          "Your Primal Companion becomes more capable in battle.",
        notes: [
          "When you take a Bonus Action to command your Primal Companion to take an action, you can also command it to Dash, Disengage, Dodge, or Help using its Bonus Action.",
          "Whenever the beast hits with an attack roll and deals damage, it can deal Force damage or its normal damage type.",
        ],
      },
    ],

    11: [
      {
        id: "bestial-fury",
        name: "Bestial Fury",
        level: 11,
        description:
          "Your Primal Companion attacks with greater ferocity.",
        notes: [
          "When you command your Primal Companion to take its Beast's Strike action, the beast can use it twice.",
          "The first time each turn it hits a creature under the effect of your Hunter's Mark, the beast deals extra Force damage equal to the bonus damage of that spell.",
        ],
      },
    ],

    15: [
      {
        id: "share-spells",
        name: "Share Spells",
        level: 15,
        description:
          "When you cast a spell targeting yourself, you can also affect your Primal Companion with the spell if the beast is within 30 feet of you.",
      },
    ],
  },
};