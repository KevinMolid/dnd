import type { CharacterSubclass } from "../../../types";

export const collegeOfLore: CharacterSubclass = {
  id: "college-of-lore",
  name: "College of Lore",
  classId: "bard",
  description:
    "Bards of the College of Lore collect magical knowledge from diverse traditions, using wit and insight to uncover secrets and undermine their foes.",

  featuresByLevel: {
    3: [
      {
        id: "bonus-proficiencies",
        name: "Bonus Proficiencies",
        level: 3,
        description:
          "You gain proficiency with additional skills of your choice.",
        notes: [
          "You gain proficiency with three skills of your choice.",
        ],
      },
      {
        id: "cutting-words",
        name: "Cutting Words",
        level: 3,
        activation: "reaction",
        description:
          "You can use your Bardic Inspiration to disrupt and weaken your enemies.",
        notes: [
          "When a creature you can see within 60 feet of yourself makes a damage roll or succeeds on an ability check or attack roll, you can take a Reaction to expend one use of your Bardic Inspiration.",
          "Roll your Bardic Inspiration die and subtract the number rolled from the creature’s roll.",
          "This can reduce the damage or potentially turn a success into a failure.",
        ],
      },
    ],

    6: [
      {
        id: "magical-discoveries",
        name: "Magical Discoveries",
        level: 6,
        description:
          "You learn spells from other magical traditions and add them to your repertoire.",
        notes: [
          "You learn two spells of your choice.",
          "These spells can come from the Cleric, Druid, or Wizard spell list, or any combination thereof.",
          "A chosen spell must be a cantrip or a spell for which you have spell slots.",
          "You always have the chosen spells prepared.",
          "Whenever you gain a Bard level, you can replace one of these spells with another spell that meets these requirements.",
        ],
      },
    ],

    14: [
      {
        id: "peerless-skill",
        name: "Peerless Skill",
        level: 14,
        description:
          "Your mastery allows you to turn near-failure into success.",
        notes: [
          "When you make an ability check or attack roll and fail, you can expend one use of your Bardic Inspiration.",
          "Roll the Bardic Inspiration die and add the number rolled to the d20, potentially turning the failure into a success.",
          "On a failure, the Bardic Inspiration die isn’t expended.",
        ],
      },
    ],
  },
};