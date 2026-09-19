import type { GoliathAncestry } from "../../types";

export const goliathAncestries: GoliathAncestry[] = [
  {
    id: "clouds-jaunt",
    name: "Cloud's Jaunt",
    traits: [
      {
        id: "clouds-jaunt-trait",
        name: "Cloud's Jaunt",
        description:
          "As a Bonus Action, you magically teleport up to 30 feet to an unoccupied space you can see. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.",
        activation: "bonus-action",
        usage: {
          type: "limited",
          uses: {
            type: "proficiency-bonus",
          },
          recharge: "long-rest",
        },
        notes: [
          "You magically teleport up to 30 feet to an unoccupied space you can see.",
        ],
      },
    ],
  },

  {
    id: "fires-burn",
    name: "Fire's Burn",
    traits: [
      {
        id: "fires-burn-trait",
        name: "Fire's Burn",
        description:
          "When you hit a target with an attack roll and deal damage to it, you can deal an extra 1d10 Fire damage to that target. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.",
        usage: {
          type: "limited",
          uses: {
            type: "proficiency-bonus",
          },
          recharge: "long-rest",
        },
        effects: [
          {
            type: "text",
            text: "When you hit a target with an attack roll and deal damage to it, you can also deal 1d10 Fire damage to that target.",
          },
        ],
      },
    ],
  },

  {
    id: "frosts-chill",
    name: "Frost's Chill",
    traits: [
      {
        id: "frosts-chill-trait",
        name: "Frost's Chill",
        description:
          "When you hit a target with an attack roll and deal damage to it, you can deal an extra 1d6 Cold damage to that target and reduce its Speed by 10 feet until the start of your next turn. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.",
        usage: {
          type: "limited",
          uses: {
            type: "proficiency-bonus",
          },
          recharge: "long-rest",
        },
        effects: [
          {
            type: "text",
            text: "When you hit a target with an attack roll and deal damage to it, you can also deal 1d6 Cold damage to that target and reduce its Speed by 10 feet until the start of your next turn.",
          },
        ],
      },
    ],
  },

  {
    id: "hills-tumble",
    name: "Hill's Tumble",
    traits: [
      {
        id: "hills-tumble-trait",
        name: "Hill's Tumble",
        description:
          "When you hit a Large or smaller creature with an attack roll and deal damage to it, you can give that target the Prone condition. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.",
        usage: {
          type: "limited",
          uses: {
            type: "proficiency-bonus",
          },
          recharge: "long-rest",
        },
        effects: [
          {
            type: "text",
            text: "When you hit a Large or smaller creature with an attack roll and deal damage to it, you can give that target the Prone condition.",
          },
        ],
      },
    ],
  },

  {
    id: "stones-endurance",
    name: "Stone's Endurance",
    traits: [
      {
        id: "stones-endurance-trait",
        name: "Stone's Endurance",
        description:
          "When you take damage, you can use your Reaction to roll 1d12 and add your Constitution modifier to the number rolled, reducing the damage by that total. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.",
        activation: "reaction",
        usage: {
          type: "limited",
          uses: {
            type: "proficiency-bonus",
          },
          recharge: "long-rest",
        },
        effects: [
          {
            type: "text",
            text: "When you take damage, you can roll 1d12 and add your Constitution modifier to reduce the damage by that total.",
          },
        ],
      },
    ],
  },

  {
    id: "storms-thunder",
    name: "Storm's Thunder",
    traits: [
      {
        id: "storms-thunder-trait",
        name: "Storm's Thunder",
        description:
          "When you take damage from a creature within 60 feet of you, you can use your Reaction to deal 1d8 Thunder damage to that creature. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.",
        activation: "reaction",
        usage: {
          type: "limited",
          uses: {
            type: "proficiency-bonus",
          },
          recharge: "long-rest",
        },
        effects: [
          {
            type: "text",
            text: "When you take damage from a creature within 60 feet of you, you can deal 1d8 Thunder damage to that creature.",
          },
        ],
      },
    ],
  },
];