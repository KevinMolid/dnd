import type {
  ComponentType,
} from "react";

import EncounterWorkspaceModule from "./modules/EncounterWorkspaceModule";

import MonsterWorkspaceModule from "./modules/MonsterWorkspaceModule";

import NpcWorkspaceModule from "./modules/NpcWorkspaceModule";

import CharacterWorkspaceModule from "./modules/CharacterWorkspaceModule";

import PartyControlWorkspaceModule from "./modules/PartyControlWorkspaceModule";

import MapWorkspaceModule from "./modules/MapWorkspaceModule";

import RandomEncounterWorkspaceModule from "./modules/RandomEncounterWorkspaceModule";

import {
  NotesWorkspaceModule,
} from "./modules/NotesWorkspaceModule.tsx";

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
      "Campaign map, areas, environment and location controls.",

    icon:
      "fa-solid fa-map",

    component:
      MapWorkspaceModule,

    showHeader: false,

    defaultW: 14,

    defaultH: 20,

    minW: 6,

    minH: 6,
  },

  encounter: {
    type: "encounter",

    title: "Encounter",

    description:
      "Run initiative, turns and combat.",

    icon:
      "fa-solid fa-swords",

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

    showHeader: false,

    component:
      MonsterWorkspaceModule,
  },

  npc: {
    type: "npc",

    title: "NPC",

    description:
      "Browse, pin and inspect campaign NPCs during play.",

    icon:
      "fa-solid fa-user",

    defaultW: 4,

    defaultH: 10,

    minW: 2,

    minH: 5,

    showHeader: true,

    component:
      NpcWorkspaceModule,
  },

  character: {
    type: "character",

    title: "Character",

    description:
      "Keep player character stats, HP, conditions and equipment visible.",

    icon:
      "fa-solid fa-user-shield",

    defaultW: 4,

    defaultH: 10,

    minW: 2,

    minH: 5,

    showHeader: false,

    component:
      CharacterWorkspaceModule,
  },

  partyControl: {
    type:
      "partyControl",

    title:
      "Party Control",

    description:
      "Monitor the active party, passive senses, HP and conditions.",

    icon:
      "fa-solid fa-users",

    /*
     * Party Control owns its own compact integrated header.
     */
    showHeader: false,

    defaultW: 6,

    defaultH: 14,

    minW: 4,

    minH: 6,

    component:
      PartyControlWorkspaceModule,
  },

  randomEncounter: {
    type:
      "randomEncounter",

    title:
      "Random Encounter",

    description:
      "Roll campaign-specific combat encounters, events and discoveries.",

    icon:
      "fa-solid fa-dice-d20",

    defaultW: 4,

    defaultH: 9,

    minW: 3,

    minH: 5,

    showHeader: true,

    component:
      RandomEncounterWorkspaceModule,
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