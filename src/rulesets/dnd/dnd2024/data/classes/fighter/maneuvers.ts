import type { Trait } from "../../../types";

export type ManeuverId =
  | "ambush"
  | "bait-and-switch"
  | "commanders-strike"
  | "commanding-presence"
  | "disarming-attack"
  | "distracting-strike"
  | "evasive-footwork"
  | "feinting-attack"
  | "goading-attack"
  | "lunging-attack"
  | "maneuvering-attack"
  | "menacing-attack"
  | "parry"
  | "precision-attack"
  | "pushing-attack"
  | "rally"
  | "riposte"
  | "sweeping-attack"
  | "tactical-assessment"
  | "trip-attack";

  export const fighterManeuvers: Record<ManeuverId, Trait> = {
  ambush: {
    id: "maneuver-ambush",
    name: "Ambush",
    description:
      "Add Superiority Die to Stealth or Initiative roll.",
    effects: [
      {
        type: "text",
        text: "Add superiority die to Dexterity (Stealth) or Initiative roll.",
      },
    ],
  },

  "bait-and-switch": {
    id: "maneuver-bait-and-switch",
    name: "Bait and Switch",
    description: "Swap positions and gain AC bonus.",
    effects: [
      {
        type: "text",
        text: "Swap places with ally and gain AC bonus equal to superiority die.",
      },
    ],
  },

  "commanders-strike": {
    id: "maneuver-commanders-strike",
    name: "Commander's Strike",
    description: "Command ally to attack using reaction.",
    effects: [
      {
        type: "text",
        text: "Use attack to let ally attack and add superiority die to damage.",
      },
    ],
  },

  "commanding-presence": {
    id: "maneuver-commanding-presence",
    name: "Commanding Presence",
    description: "Add die to Charisma checks.",
    effects: [
      {
        type: "text",
        text: "Add superiority die to Intimidation, Performance, or Persuasion.",
      },
    ],
  },

  "disarming-attack": {
    id: "maneuver-disarming-attack",
    name: "Disarming Attack",
    description: "Force target to drop item.",
    effects: [
      {
        type: "text",
        text: "Add die to damage and force STR save or drop item.",
      },
    ],
  },

  "distracting-strike": {
    id: "maneuver-distracting-strike",
    name: "Distracting Strike",
    description: "Grant advantage to ally.",
    effects: [
      {
        type: "text",
        text: "Add die to damage and next attack has advantage.",
      },
    ],
  },

  "evasive-footwork": {
    id: "maneuver-evasive-footwork",
    name: "Evasive Footwork",
    description: "Gain AC while moving.",
    effects: [
      {
        type: "text",
        text: "Add superiority die to AC while moving.",
      },
    ],
  },

  "feinting-attack": {
    id: "maneuver-feinting-attack",
    name: "Feinting Attack",
    description: "Gain advantage and bonus damage.",
    effects: [
      {
        type: "text",
        text: "Gain advantage and add superiority die to damage.",
      },
    ],
  },

  "goading-attack": {
    id: "maneuver-goading-attack",
    name: "Goading Attack",
    description: "Disadvantage vs others.",
    effects: [
      {
        type: "text",
        text: "Target has disadvantage attacking others.",
      },
    ],
  },

  "lunging-attack": {
    id: "maneuver-lunging-attack",
    name: "Lunging Attack",
    description: "Increase reach.",
    effects: [
      {
        type: "text",
        text: "Increase reach and add superiority die to damage.",
      },
    ],
  },

  "maneuvering-attack": {
    id: "maneuver-maneuvering-attack",
    name: "Maneuvering Attack",
    description: "Move ally safely.",
    effects: [
      {
        type: "text",
        text: "Move ally without provoking opportunity attacks.",
      },
    ],
  },

  "menacing-attack": {
    id: "maneuver-menacing-attack",
    name: "Menacing Attack",
    description: "Frighten target.",
    effects: [
      {
        type: "condition",
        condition: "frightened",
      },
    ],
  },

  parry: {
    id: "maneuver-parry",
    name: "Parry",
    description: "Reduce damage taken.",
    effects: [
      {
        type: "text",
        text: "Reduce damage using superiority die + modifier.",
      },
    ],
  },

  "precision-attack": {
    id: "maneuver-precision-attack",
    name: "Precision Attack",
    description: "Add die to hit roll.",
    effects: [
      {
        type: "text",
        text: "Add superiority die to attack roll.",
      },
    ],
  },

  "pushing-attack": {
    id: "maneuver-pushing-attack",
    name: "Pushing Attack",
    description: "Push target away.",
    effects: [
      {
        type: "text",
        text: "Push target up to 15 ft.",
      },
    ],
  },

  rally: {
    id: "maneuver-rally",
    name: "Rally",
    description: "Grant temporary HP.",
    effects: [
      {
        type: "healing",
        amount: { type: "proficiency-bonus" },
        target: "creature",
        activation: "bonus-action",
      },
    ],
  },

  riposte: {
    id: "maneuver-riposte",
    name: "Riposte",
    description: "Counterattack with reaction.",
    effects: [
      {
        type: "text",
        text: "Make reaction attack and add superiority die.",
      },
    ],
  },

  "sweeping-attack": {
    id: "maneuver-sweeping-attack",
    name: "Sweeping Attack",
    description: "Hit second target.",
    effects: [
      {
        type: "text",
        text: "Deal damage to second target.",
      },
    ],
  },

  "tactical-assessment": {
    id: "maneuver-tactical-assessment",
    name: "Tactical Assessment",
    description: "Add die to INT/WIS checks.",
    effects: [
      {
        type: "text",
        text: "Add superiority die to Investigation, History, or Insight.",
      },
    ],
  },

  "trip-attack": {
    id: "maneuver-trip-attack",
    name: "Trip Attack",
    description: "Knock target prone.",
    effects: [
      {
        type: "condition",
        condition: "prone",
      },
    ],
  },
};