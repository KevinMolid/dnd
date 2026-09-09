import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WorkspaceMonsterEncounterStatus = "active" | "up-next" | "manual";

export type WorkspaceSelectedMonster = {
  type: "monster";

  /**
   * Examples:
   * default:goblin
   * campaign:abc123
   */
  monsterKey: string;

  /**
   * Specific encounter instance.
   */
  encounterEntryId?: string;

  /**
   * active:
   * Monster currently taking its turn.
   *
   * up-next:
   * Player currently has the turn and this
   * is the next monster in initiative.
   *
   * manual:
   * DM manually selected this monster.
   */
  encounterStatus?: WorkspaceMonsterEncounterStatus;
};

export type WorkspaceSelectedEntity = WorkspaceSelectedMonster | null;

type WorkspaceContextValue = {
  selectedEntity: WorkspaceSelectedEntity;

  selectEntity: (entity: WorkspaceSelectedEntity) => void;

  clearSelection: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
  undefined,
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedEntity, setSelectedEntity] =
    useState<WorkspaceSelectedEntity>(null);

  /*
   * Important:
   * These callbacks must stay stable when the
   * selection itself changes.
   *
   * Otherwise effects that depend on selectEntity
   * can run again immediately after a manual selection.
   */
  const selectEntity = useCallback((entity: WorkspaceSelectedEntity) => {
    setSelectedEntity(entity);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEntity(null);
  }, []);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      selectedEntity,
      selectEntity,
      clearSelection,
    }),
    [selectedEntity, selectEntity, clearSelection],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspace must be used inside a WorkspaceProvider");
  }

  return context;
}
