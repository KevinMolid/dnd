export type WorkspaceModuleType =
  | "map"
  | "encounter"
  | "monster"
  | "notes";

export type MonsterModuleMode =
  | "pinned"
  | "follow";

export type WorkspaceModuleConfig = {
  /**
   * Used by Monster modules in pinned mode.
   *
   * Example:
   * default:shadow
   * campaign:abc123
   */
  selectedMonsterKey?: string;

  /**
   * pinned:
   * Always show selectedMonsterKey.
   *
   * follow:
   * Show the monster currently selected
   * elsewhere in the workspace.
   */
  monsterMode?: MonsterModuleMode;
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

  updateModule: (
    moduleId: string,
    changes: Partial<WorkspaceModule>,
  ) => void;
};