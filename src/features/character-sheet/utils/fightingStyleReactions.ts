/** Play-panel reactions granted by the currently selected Fighting Style. */
export function getFightingStyleReactions(styleId?: string | null) {
  switch (styleId) {
    case "interception":
      return [{
        id: "fighting-style-interception",
        name: "Interception",
        source: "Fighting Style",
        description:
          "Reaction: When a creature you can see hits a target other than you within 5 feet of you with an attack roll, you can reduce the target's damage by 1d10 + your Proficiency Bonus. You must be holding a shield or a Simple or Martial weapon.",
      }];
    case "protection":
      return [{
        id: "fighting-style-protection",
        name: "Protection",
        source: "Fighting Style",
        description:
          "Reaction: When a creature you can see attacks a target other than you within 5 feet of you, impose Disadvantage on the attack roll. You must be holding a shield.",
      }];
    default:
      return [];
  }
}
