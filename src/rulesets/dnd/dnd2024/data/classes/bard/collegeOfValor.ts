import type { CharacterSubclass } from "../../../types";

export const collegeOfValor: CharacterSubclass = {
  id: "college-of-valor",
  name: "College of Valor",
  classId: "bard",
  description:
    "Bards of the College of Valor inspire greatness through heroic deeds and martial prowess, blending spellcasting with battlefield skill.",

  featuresByLevel: {
    3: [
      {
        id: "combat-inspiration",
        name: "Combat Inspiration",
        level: 3,
        description:
          "Your Bardic Inspiration can bolster allies in battle, aiding their defense or offense.",
        notes: [
          "A creature that has a Bardic Inspiration die from you can use it for one of the following effects.",
          "Defense. When the creature is hit by an attack roll, it can use its Reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, potentially causing the attack to miss.",
          "Offense. Immediately after the creature hits a target with an attack roll, it can roll the Bardic Inspiration die and add the number rolled to the attack’s damage against the target.",
        ],
      },
      {
        id: "martial-training",
        name: "Martial Training",
        level: 3,
        description:
          "You gain martial combat training and can integrate weapons into your spellcasting.",
        notes: [
          "You gain proficiency with Martial weapons and training with Medium armor and Shields.",
          "You can use a Simple or Martial weapon as a Spellcasting Focus to cast spells from your Bard spell list.",
        ],
        effects: [
          {
            type: "armor-training",
            armor: "medium-armor",
          },
          {
            type: "armor-training",
            armor: "shields",
          },
          {
            type: "weapon-proficiency",
            weapon: "martial-weapons",
          },
        ],
      },
    ],

    6: [
      {
        id: "extra-attack",
        name: "Extra Attack",
        level: 6,
        description:
          "You can attack more frequently and weave magic into your strikes.",
        notes: [
          "You can attack twice instead of once whenever you take the Attack action on your turn.",
          "In addition, you can cast one of your cantrips that has a casting time of an action in place of one of those attacks.",
        ],
      },
    ],

    14: [
      {
        id: "battle-magic",
        name: "Battle Magic",
        level: 14,
        description:
          "You can follow up your spells with swift weapon attacks.",
        notes: [
          "After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action.",
        ],
      },
    ],
  },
};