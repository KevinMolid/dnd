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

  monsterKey: string;

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

export type WorkspaceCharacterEncounterStatus = "active" | "up-next" | "manual";

export type WorkspaceSelectedCharacter = {
  characterId: string;

  /**
   * Specific encounter row when the selection
   * originated from the encounter tracker.
   */
  encounterEntryId?: string;

  /**
   * active:
   * This player currently has the turn.
   *
   * up-next:
   * A monster currently has the turn and this
   * is the next player in initiative.
   *
   * manual:
   * DM manually clicked this player.
   */
  encounterStatus?: WorkspaceCharacterEncounterStatus;
};

export type WorkspaceActiveLocation = {
  mapId: string;

  mapTitle: string;

  roomId: number;

  roomName: string;
};

type SelectCharacterOptions = {
  encounterEntryId?: string;

  encounterStatus?: WorkspaceCharacterEncounterStatus;
};

type WorkspaceContextValue = {
  selectedEntity: WorkspaceSelectedEntity;

  activeLocation: WorkspaceActiveLocation | null;

  selectedCharacter: WorkspaceSelectedCharacter | null;

  /**
   * Convenience property kept for modules that only
   * care about which character is selected.
   */
  selectedCharacterId: string | null;

  selectEntity: (entity: WorkspaceSelectedEntity) => void;

  clearSelection: () => void;

  selectCharacter: (
    characterId: string | null,
    options?: SelectCharacterOptions,
  ) => void;

  clearCharacterSelection: () => void;

  setActiveLocation: (location: WorkspaceActiveLocation | null) => void;

  clearActiveLocation: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
  undefined,
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedEntity, setSelectedEntity] =
    useState<WorkspaceSelectedEntity>(null);

  const [selectedCharacter, setSelectedCharacter] =
    useState<WorkspaceSelectedCharacter | null>(null);

  const [activeLocation, setActiveLocationState] =
    useState<WorkspaceActiveLocation | null>(null);

  /*
   * These callbacks deliberately stay stable.
   *
   * Encounter auto-follow effects depend on that
   * so manual selections are not immediately
   * overwritten by callback identity changes.
   */
  const selectEntity = useCallback((entity: WorkspaceSelectedEntity) => {
    setSelectedEntity(entity);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEntity(null);
  }, []);

  const selectCharacter = useCallback(
    (characterId: string | null, options?: SelectCharacterOptions) => {
      if (!characterId) {
        setSelectedCharacter(null);

        return;
      }

      setSelectedCharacter({
        characterId,

        encounterEntryId: options?.encounterEntryId,

        encounterStatus: options?.encounterStatus,
      });
    },
    [],
  );

  const clearCharacterSelection = useCallback(() => {
    setSelectedCharacter(null);
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

  const selectedCharacterId = selectedCharacter?.characterId ?? null;

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      selectedEntity,

      activeLocation,

      selectedCharacter,

      selectedCharacterId,

      selectEntity,

      clearSelection,

      selectCharacter,

      clearCharacterSelection,

      setActiveLocation,

      clearActiveLocation,
    }),
    [
      selectedEntity,
      activeLocation,
      selectedCharacter,
      selectedCharacterId,
      selectEntity,
      clearSelection,
      selectCharacter,
      clearCharacterSelection,
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
