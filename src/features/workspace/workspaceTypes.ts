export type WorkspaceModuleType =
  | "map"
  | "encounter"
  | "monster"
  | "notes";

export type MonsterModuleMode =
  | "pinned"
  | "follow";

export type WorkspaceModuleConfig = {
  /*
   * Monster module
   */
  selectedMonsterKey?: string;

  monsterMode?: MonsterModuleMode;

  /*
   * Notes module
   */
  noteContent?: string;
};

export type WorkspaceModule = {
  id: string;

  type: WorkspaceModuleType;

  title: string;

  config?: WorkspaceModuleConfig;
};

export type WorkspaceModuleRenderProps = {
  module: WorkspaceModule;

  campaignId: string;

  editing: boolean;

  updateModule: (
    moduleId: string,
    changes: Partial<WorkspaceModule>,
  ) => void;

  removeModule: (
    moduleId: string,
  ) => void;
};