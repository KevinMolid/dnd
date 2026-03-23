import type { ToolChoiceGroup, ToolId, MusicalInstrumentToolId } from "./types";

export const musicalInstrumentToolOptions: MusicalInstrumentToolId[] = [
  "bagpipes",
  "drum",
  "dulcimer",
  "flute",
  "horn",
  "lute",
  "lyre",
  "pan-flute",
  "shawm",
  "viol",
];

export const artisanToolOptions: ToolId[] = [
  "alchemists-supplies",
  "brewers-supplies",
  "calligraphers-supplies",
  "carpenters-tools",
  "cartographers-tools",
  "cobblers-tools",
  "cooks-utensils",
  "glassblowers-tools",
  "jewelers-tools",
  "leatherworkers-tools",
  "masons-tools",
  "painters-supplies",
  "potters-tools",
  "smiths-tools",
  "tinkers-tools",
  "weavers-tools",
  "woodcarvers-tools",
];

export const gamingSetOptions: ToolId[] = ["gaming-set"];

export const toolOptionsByGroup: Record<ToolChoiceGroup, ToolId[]> = {
  "artisan-tools": artisanToolOptions,
  "gaming-set": gamingSetOptions,
  "musical-instrument": musicalInstrumentToolOptions,
};

export const isToolId = (value: string): value is ToolId => {
  return (
    musicalInstrumentToolOptions.includes(value as MusicalInstrumentToolId) ||
    artisanToolOptions.includes(value as ToolId) ||
    gamingSetOptions.includes(value as ToolId) ||
    [
      "disguise-kit",
      "forgery-kit",
      "herbalism-kit",
      "navigator-tools",
      "poisoners-kit",
      "thieves-tools",
      "vehicles-land",
      "vehicles-water",
    ].includes(value)
  );
};