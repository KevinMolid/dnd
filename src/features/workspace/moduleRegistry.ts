import type {
  ComponentType,
} from "react";

import EncounterWorkspaceModule from "./modules/EncounterWorkspaceModule";

import MonsterWorkspaceModule from "./modules/MonsterWorkspaceModule";

import MapWorkspaceModule from "./modules/MapWorkspaceModule";

import {
  NotesWorkspaceModule,
} from "./modules/PlaceholderWorkspaceModules";

import type {
  WorkspaceModuleRenderProps,
  WorkspaceModuleType,
} from "./workspaceTypes";

export type ModuleDefinition = {
  type: WorkspaceModuleType;

  title: string;

  description: string;

  icon: string;

  defaultW: number;

  defaultH: number;

  minW: number;

  minH: number;

  /**
   * false means the module renders its own
   * title/drag header.
   */
  showHeader?: boolean;

  component:
    ComponentType<WorkspaceModuleRenderProps>;
};

export const MODULE_REGISTRY: Record<
  WorkspaceModuleType,
  ModuleDefinition
> = {
  map: {
    type: "map",

    title: "Map",

    description:
      "Keep an interactive campaign map visible during play.",

    icon: "fa-solid fa-map",

    defaultW: 7,
    defaultH: 10,

    minW: 3,
    minH: 5,

    showHeader: true,

    component:
      MapWorkspaceModule,
  },

  encounter: {
    type: "encounter",

    title: "Encounter",

    description:
      "Run initiative, turns and combat.",

    icon: "fa-solid fa-swords",

    defaultW: 5,
    defaultH: 12,

    minW: 3,
    minH: 6,

    showHeader: true,

    component:
      EncounterWorkspaceModule,
  },

  monster: {
    type: "monster",

    title:
      "Monster Stat Block",

    description:
      "Keep a monster stat block visible.",

    icon:
      "fa-solid fa-dragon",

    defaultW: 3,
    defaultH: 13,

    minW: 2,
    minH: 6,

    showHeader: true,

    component:
      MonsterWorkspaceModule,
  },

  notes: {
    type: "notes",

    title: "DM Notes",

    description:
      "Quick persistent notes during the session.",

    icon:
      "fa-solid fa-note-sticky",

    defaultW: 4,
    defaultH: 6,

    minW: 2,
    minH: 3,

    showHeader: false,

    component:
      NotesWorkspaceModule,
  },
};