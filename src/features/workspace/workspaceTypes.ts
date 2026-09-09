export type WorkspaceModuleType =
  | "map"
  | "encounter"
  | "monster"
  | "npc"
  | "character"
  | "notes";

export type MonsterModuleMode =
  | "pinned"
  | "follow";

export type NpcModuleMode =
  | "pinned"
  | "follow";

export type CharacterModuleMode =
  | "pinned"
  | "follow";

export type WorkspaceModuleConfig = {
  /*
   * Monster module
   */
  selectedMonsterKey?: string;

  monsterMode?: MonsterModuleMode;

  /*
   * NPC module
   */
  selectedNpcId?: string;

  npcMode?: NpcModuleMode;

  /*
   * Character module
   */
  selectedCharacterId?: string;

  characterMode?: CharacterModuleMode;

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