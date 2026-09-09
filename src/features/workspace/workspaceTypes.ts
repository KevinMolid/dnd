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

  /*
   * Map module
   */
  mapId?: string;

  /**
   * null = map overview
   * number = selected map area
   */
  selectedRoomId?: number | null;

  /**
   * Selected environment effect for this
   * particular Map module.
   */
  mapEnvironmentEffectId?: string;
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