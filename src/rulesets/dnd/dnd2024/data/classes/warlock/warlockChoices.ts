import type { ChoiceMapByLevel, SkillId } from "../../../types";

export const warlockSkillChoiceOptions: SkillId[] = [
  "arcana",
  "deception",
  "history",
  "intimidation",
  "investigation",
  "nature",
  "religion",
];

export const warlockSubclassChoicesByLevel: ChoiceMapByLevel<string> = {
  3: [
    {
      id: "warlock-subclass",
      level: 3,
      name: "Warlock Subclass",
      choose: 1,
      source: "subclass",
      options: [
        "archfey-patron",
        "celestial-patron",
        "fiend-patron",
        "great-old-one-patron",
      ],
      description: "Choose a Warlock patron.",
    },
  ],
};
