import type {
  FeatureActionActivation,
  FeatureWithActions,
} from "../../../types/featureActions";

export type PlayPanelFeatureAction = {
  id: string;
  name: string;
  description?: string;
  source?: string;
  notes?: string[];
};

export type CollectedFeatureActions = {
  actions: PlayPanelFeatureAction[];
  bonusActions: PlayPanelFeatureAction[];
  reactions: PlayPanelFeatureAction[];
};

const isActionableActivation = (
  activation: string | undefined,
): activation is FeatureActionActivation =>
  activation === "action" ||
  activation === "bonus-action" ||
  activation === "reaction";

const dedupe = (entries: PlayPanelFeatureAction[]) => {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    if (seen.has(entry.id)) {
      return false;
    }

    seen.add(entry.id);

    return true;
  });
};

export const collectFeatureActions = (
  features: FeatureWithActions[],
): CollectedFeatureActions => {
  const actions: PlayPanelFeatureAction[] = [];
  const bonusActions: PlayPanelFeatureAction[] = [];
  const reactions: PlayPanelFeatureAction[] = [];

  const push = (
    activation: FeatureActionActivation,
    entry: PlayPanelFeatureAction,
  ) => {
    if (activation === "action") {
      actions.push(entry);
      return;
    }

    if (activation === "bonus-action") {
      bonusActions.push(entry);
      return;
    }

    reactions.push(entry);
  };

  for (const feature of features) {
    /*
     * Primary activation:
     * the feature itself is a playable action.
     */
    if (isActionableActivation(feature.activation)) {
      push(feature.activation, {
        id: `feature-${feature.id}`,
        name: feature.name,
        description: feature.description,
        source: feature.source,
        notes: feature.notes,
      });
    }

    /*
     * Secondary actions:
     * one feature can expose additional playable actions without pretending
     * the entire feature has that activation.
     *
     * The parent feature's source and notes are retained so the play panel
     * can expose the complete feature details.
     */
    for (const action of feature.actions ?? []) {
      push(action.activation, {
        id: `feature-${feature.id}-action-${action.id}`,
        name: action.name,
        description: action.description ?? feature.description,
        source: feature.source,
        notes: feature.notes,
      });
    }
  }

  return {
    actions: dedupe(actions),
    bonusActions: dedupe(bonusActions),
    reactions: dedupe(reactions),
  };
};