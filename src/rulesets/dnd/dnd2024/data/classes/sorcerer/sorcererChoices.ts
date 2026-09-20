import type {
  ChoiceMapByLevel,
  SkillId,
  SpellId,
} from "../../../types";

import { sorcererSpellList } from "../../spells/sorcererSpellList";

export const sorcererSkillChoiceOptions: SkillId[] = [
  "arcana",
  "deception",
  "insight",
  "intimidation",
  "persuasion",
  "religion",
];

export const sorcererCantripChoicesByLevel: ChoiceMapByLevel<SpellId> = {
  1: [
    {
      id: "sorcerer-cantrips",
      level: 1,
      name: "Sorcerer Cantrips",
      choose: 4,
      source: "cantrips",
      options: sorcererSpellList,
      description: "Choose four Sorcerer cantrips.",
    },
  ],
};

export const sorcererMetamagicOptions = [
  "careful-spell",
  "distant-spell",
  "empowered-spell",
  "extended-spell",
  "heightened-spell",
  "quickened-spell",
  "seeking-spell",
  "subtle-spell",
  "transmuted-spell",
  "twinned-spell",
] as const;

export type SorcererMetamagicId =
  (typeof sorcererMetamagicOptions)[number];

export const sorcererMetamagicChoicesByLevel: ChoiceMapByLevel<SorcererMetamagicId> =
  {
    2: [
      {
        id: "sorcerer-metamagic",
        level: 2,
        name: "Metamagic",
        choose: 2,
        source: "metamagic",
        options: [...sorcererMetamagicOptions],
        description: "Choose two Metamagic options.",
      },
    ],

    10: [
      {
        id: "sorcerer-metamagic-10",
        level: 10,
        name: "Additional Metamagic",
        choose: 2,
        source: "metamagic",
        options: [...sorcererMetamagicOptions],
        description: "Choose two additional Metamagic options.",
      },
    ],

    17: [
      {
        id: "sorcerer-metamagic-17",
        level: 17,
        name: "Additional Metamagic",
        choose: 2,
        source: "metamagic",
        options: [...sorcererMetamagicOptions],
        description: "Choose two additional Metamagic options.",
      },
    ],
  };

export const sorcererSubclassChoicesByLevel: ChoiceMapByLevel<string> = {
  3: [
    {
      id: "sorcerer-subclass",
      level: 3,
      name: "Sorcerer Subclass",
      choose: 1,
      source: "subclass",
      options: [
        "aberrant-sorcery",
        "clockwork-sorcery",
        "draconic-sorcery",
        "wild-magic-sorcery",
      ],
      description: "Choose a Sorcerer subclass.",
    },
  ],
};