import type {
  CharacterSpell,
  SpellId,
  Trait,
  TraitEffect,
} from "../../../rulesets/dnd/dnd2024/types";
import { getSpellById } from "../../../rulesets/dnd/dnd2024/data/spells/helpers";
import { formatLabel, unique } from "./characterSheetHelpers";
import type { TraitGroupKey } from "../types";

export const dedupeTraits = (traits: Trait[]) => {
  const seen = new Set<string>();
  const result: Trait[] = [];

  for (const trait of traits) {
    if (seen.has(trait.id)) continue;
    seen.add(trait.id);
    result.push(trait);
  }

  return result;
};

export const formatUsage = (usage: Trait["usage"]) => {
  if (!usage) return null;

  if (usage.type === "at-will") {
    return "At will";
  }

  if (usage.type === "limited") {
    if (usage.recharge === "short-rest") return "Limited • Short Rest";
    if (usage.recharge === "long-rest") return "Limited • Long Rest";
    return "Limited use";
  }

  return null;
};

export const getTraitResistances = (traits: Trait[]): string[] =>
  unique(
    traits.flatMap((trait) =>
      (trait.effects ?? []).flatMap((effect) =>
        effect.type === "resistance" ? [effect.damageType] : [],
      ),
    ),
  );

export const getTraitGrantedSpells = (
  traits: Trait[],
  characterLevel: number,
): CharacterSpell[] => {
  const result: CharacterSpell[] = [];

  for (const trait of traits) {
    for (const effect of trait.effects ?? []) {
      if (effect.type !== "spell") continue;

      const requiredCharacterLevel = effect.level ?? 1;
      if (characterLevel < requiredCharacterLevel) continue;

      const usage =
        effect.frequency?.type === "at-will"
          ? {
              type: "at-will" as const,
            }
          : effect.frequency?.type === "limited"
            ? {
                type: "limited" as const,
                recharge: effect.frequency.recharge,
                max:
                  effect.frequency.uses?.type === "fixed"
                    ? effect.frequency.uses.value
                    : 1,
              }
            : undefined;

      const spellData = getSpellById(effect.spellId as SpellId);

      result.push({
        spellId: effect.spellId as SpellId,
        level: (spellData?.level ?? 0) as CharacterSpell["level"],
        sourceType: "species",
        sourceId: trait.id,
        known: true,
        prepared: false,
        countsAgainstKnownLimit: false,
        countsAgainstPreparationLimit: false,
        ...(usage ? { usage } : {}),
      });
    }
  }

  return result;
};

export const getEffectLabel = (effect: TraitEffect) => {
  switch (effect.type) {
    case "sense":
      return `${formatLabel(effect.sense)} ${effect.range} ft`;
    case "resistance":
      return `${formatLabel(effect.damageType)} resistance`;
    case "advantage-on-saving-throws-against":
      return `Advantage vs ${effect.conditions.map(formatLabel).join(", ")}`;
    case "advantage-on-saving-throws":
      return `Advantage on ${effect.abilities.map((a) => a.toUpperCase()).join(", ")} saves`;
    case "hp-max-bonus":
      return "HP maximum bonus";
    case "spell":
      return `Spell: ${effect.spellId}`;
    case "healing":
      return "Healing";
    case "transformation":
      return "Transformation";
    case "speed-bonus":
      return `${formatLabel(effect.speedType)} speed`;
    case "aoe-damage":
      return "Area damage";
    case "condition":
      return `Condition: ${formatLabel(effect.condition)}`;
    case "light":
      return "Creates light";
    case "choice-ref":
      return "Choice";
    case "text":
      return "Special effect";
    default:
      return "Feature";
  }
};

export const getGroupMeta = (key: TraitGroupKey) => {
  switch (key) {
    case "species":
      return {
        label: "SP",
        className: "border-sky-500/20 bg-sky-500/10 text-sky-300",
      };
    case "class":
      return {
        label: "CL",
        className: "border-violet-500/20 bg-violet-500/10 text-violet-300",
      };
    case "subclass":
      return {
        label: "SC",
        className: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300",
      };
    case "background":
      return {
        label: "BG",
        className: "border-amber-500/20 bg-amber-500/10 text-amber-300",
      };
    case "feats":
      return {
        label: "FT",
        className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      };
    default:
      return {
        label: "TR",
        className: "border-white/10 bg-white/5 text-zinc-300",
      };
  }
};