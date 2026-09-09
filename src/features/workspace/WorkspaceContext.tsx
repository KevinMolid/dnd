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
   * Specific encounter instance, when relevant.
   */
  encounterEntryId?: string;

  encounterStatus?: WorkspaceMonsterEncounterStatus;
};

export type WorkspaceSelectedNpc = {
  type: "npc";

  npcId: string;
};

export type WorkspaceSelectedEntity =
  | WorkspaceSelectedMonster
  | WorkspaceSelectedNpc
  | null;

/**
 * Location is deliberately separate from selectedEntity.
 *
 * The party can remain at a location while the DM
 * inspects monsters, NPCs, characters, etc.
 */
export type WorkspaceActiveLocation = {
  mapId: string;

  mapTitle: string;

  roomId: number;

  roomName: string;
};

type WorkspaceContextValue = {
  selectedEntity: WorkspaceSelectedEntity;

  activeLocation: WorkspaceActiveLocation | null;

  selectEntity: (entity: WorkspaceSelectedEntity) => void;

  clearSelection: () => void;

  setActiveLocation: (location: WorkspaceActiveLocation | null) => void;

  clearActiveLocation: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
  undefined,
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedEntity, setSelectedEntity] =
    useState<WorkspaceSelectedEntity>(null);

  const [activeLocation, setActiveLocationState] =
    useState<WorkspaceActiveLocation | null>(null);

  /*
   * These callbacks stay stable so modules that
   * react to workspace selection don't constantly
   * retrigger effects.
   */
  const selectEntity = useCallback((entity: WorkspaceSelectedEntity) => {
    setSelectedEntity(entity);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEntity(null);
  }, []);

  const setActiveLocation = useCallback(
    (location: WorkspaceActiveLocation | null) => {
      setActiveLocationState(location);
    },
    [],
  );

  const clearActiveLocation = useCallback(() => {
    setActiveLocationState(null);
  }, []);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      selectedEntity,

      activeLocation,

      selectEntity,

      clearSelection,

      setActiveLocation,

      clearActiveLocation,
    }),
    [
      selectedEntity,
      activeLocation,
      selectEntity,
      clearSelection,
      setActiveLocation,
      clearActiveLocation,
    ],
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
