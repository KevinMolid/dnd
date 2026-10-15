import type { CharacterChoices, LevelNumber } from "../../../types";
import { artificerPlansKnownByLevel, artificerReplicatedItemsByLevel } from "./artificerProgression";

/** Serializable state only: persistence should happen through your existing character save flow. */
export type ArtificerReplicationState = {
  knownPlanIds: string[];
  activeItems: Array<{ instanceId: string; planId: string; itemId: string; createdAt?: string }>;
};
export type ArtificerChoices = CharacterChoices & { artificerReplication?: ArtificerReplicationState };
export const emptyArtificerReplicationState = (): ArtificerReplicationState => ({ knownPlanIds: [], activeItems: [] });

export const validateArtificerReplication = (
  state: ArtificerReplicationState,
  level: LevelNumber,
  eligiblePlanIds: ReadonlySet<string>,
): string[] => {
  const errors: string[] = [];
  if (state.knownPlanIds.length > artificerPlansKnownByLevel[level]) errors.push("Too many known plans");
  if (new Set(state.knownPlanIds).size !== state.knownPlanIds.length) errors.push("Duplicate known plans");
  if (state.activeItems.length > artificerReplicatedItemsByLevel[level]) errors.push("Too many active replicated items");
  if (new Set(state.activeItems.map(x => x.instanceId)).size !== state.activeItems.length) errors.push("Duplicate replicated instance IDs");
  for (const planId of state.knownPlanIds) if (!eligiblePlanIds.has(planId)) errors.push(`Ineligible plan: ${planId}`);
  for (const item of state.activeItems) if (!state.knownPlanIds.includes(item.planId)) errors.push(`Item uses unknown plan: ${item.planId}`);
  if (new Set(state.activeItems.map(x => x.planId)).size !== state.activeItems.length) errors.push("Duplicate active plan (items must be different)");
  return errors;
};

// At a Long Rest: validate the proposed replacement set, then save it atomically.
// Inventory materialization/retirement is intentionally NOT automatic here;
// use the same instance IDs when you implement a full item lifecycle.
export const replaceActiveReplications = (
  current: ArtificerReplicationState,
  nextItems: ArtificerReplicationState["activeItems"],
  level: LevelNumber,
  eligiblePlanIds: ReadonlySet<string>,
): ArtificerReplicationState => {
  const next = { ...current, activeItems: nextItems };
  const errors = validateArtificerReplication(next, level, eligiblePlanIds);
  if (errors.length) throw new Error(errors.join("; "));
  return next;
};
