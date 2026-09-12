export type FeatureActivation =
  | "passive"
  | "action"
  | "bonus-action"
  | "reaction";

export type FeatureActionActivation =
  Exclude<
    FeatureActivation,
    "passive"
  >;

export type FeatureAction = {
  id: string;

  name: string;

  activation: FeatureActionActivation;

  description?: string;
};

export type FeatureWithActions = {
  id: string;

  name: string;

  description?: string;

  activation?: FeatureActivation;

  actions?: FeatureAction[];
};

export const featureActivationOptions: Array<{
  value: FeatureActivation;
  label: string;
}> = [
  {
    value: "passive",
    label: "Passive / no action",
  },
  {
    value: "action",
    label: "Action",
  },
  {
    value: "bonus-action",
    label: "Bonus Action",
  },
  {
    value: "reaction",
    label: "Reaction",
  },
];

export const featureActionActivationOptions: Array<{
  value: FeatureActionActivation;
  label: string;
}> = [
  {
    value: "action",
    label: "Action",
  },
  {
    value: "bonus-action",
    label: "Bonus Action",
  },
  {
    value: "reaction",
    label: "Reaction",
  },
];

export const featureActivationLabels: Record<
  FeatureActivation,
  string
> = {
  passive: "Passive",
  action: "Action",
  "bonus-action": "Bonus Action",
  reaction: "Reaction",
};
