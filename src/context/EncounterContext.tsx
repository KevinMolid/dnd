import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { StatBlockProps } from "../components/StatBlock";
import { monsters } from "../data/monsters";
import { players } from "../data/players";

const STORAGE_KEY = "lmop-encounter";

export type EncounterEntityKind = "monster" | "player";

export type EncounterEntry = {
  id: string;
  entityKind: EncounterEntityKind;
  entityName: string;
  instanceNumber: number;
  displayName: string;
  currentHp: number;
  maxHp: number;
  initiative: number | "";
};

type EncounterStorageData = {
  encounter: EncounterEntry[];
  currentTurnIndex: number;
  currentRound: number;
};

type EncounterContextType = {
  encounter: EncounterEntry[];
  currentTurnIndex: number;
  currentRound: number;
  addMonsterToEncounter: (monster: StatBlockProps) => void;
  addPlayerToEncounter: (player: StatBlockProps) => void;
  addEntityToEncounter: (
    entityKind: EncounterEntityKind,
    entity: StatBlockProps,
  ) => void;
  removeEntityFromEncounter: (id: string) => void;
  updateEntityHp: (id: string, hp: number) => void;
  updateEntityInitiative: (id: string, initiative: number | "") => void;
  renameEntity: (id: string, name: string) => void;
  clearEncounter: () => void;
  getEntityByName: (
    entityKind: EncounterEntityKind,
    name: string,
  ) => StatBlockProps | undefined;
  nextTurn: () => void;
  previousTurn: () => void;
  resetTurns: () => void;
  rollInitiative: () => void;
};

const EncounterContext = createContext<EncounterContextType | undefined>(
  undefined,
);

const makeId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const isValidEncounterEntry = (value: unknown): value is EncounterEntry => {
  if (!value || typeof value !== "object") return false;

  const item = value as EncounterEntry;

  return (
    typeof item.id === "string" &&
    (item.entityKind === "monster" || item.entityKind === "player") &&
    typeof item.entityName === "string" &&
    typeof item.instanceNumber === "number" &&
    typeof item.displayName === "string" &&
    typeof item.currentHp === "number" &&
    typeof item.maxHp === "number" &&
    (typeof item.initiative === "number" || item.initiative === "")
  );
};

const loadEncounterFromStorage = (): EncounterStorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return { encounter: [], currentTurnIndex: 0, currentRound: 1 };
    }

    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return { encounter: [], currentTurnIndex: 0, currentRound: 1 };
    }

    const data = parsed as Partial<EncounterStorageData>;

    const safeEncounter = Array.isArray(data.encounter)
      ? data.encounter.filter(isValidEncounterEntry)
      : [];

    const safeTurnIndex =
      typeof data.currentTurnIndex === "number" ? data.currentTurnIndex : 0;

    const safeRound =
      typeof data.currentRound === "number" && data.currentRound >= 1
        ? data.currentRound
        : 1;

    return {
      encounter: safeEncounter,
      currentTurnIndex: safeTurnIndex,
      currentRound: safeRound,
    };
  } catch (error) {
    console.error("Failed to load encounter from localStorage:", error);
    return { encounter: [], currentTurnIndex: 0, currentRound: 1 };
  }
};

const sortEncounterByInitiative = (encounter: EncounterEntry[]) => {
  return [...encounter].sort((a, b) => {
    const aInit = a.initiative === "" ? -999 : a.initiative;
    const bInit = b.initiative === "" ? -999 : b.initiative;

    if (bInit !== aInit) return bInit - aInit;

    if (a.entityKind !== b.entityKind) {
      return a.entityKind === "player" ? -1 : 1;
    }

    return a.displayName.localeCompare(b.displayName);
  });
};

const getNextInstanceNumber = (
  encounter: EncounterEntry[],
  entityKind: EncounterEntityKind,
  entityName: string,
) => {
  const sameEntries = encounter.filter(
    (entry) =>
      entry.entityKind === entityKind && entry.entityName === entityName,
  );

  if (sameEntries.length === 0) return 1;

  return Math.max(...sameEntries.map((entry) => entry.instanceNumber)) + 1;
};

export const EncounterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const initialData = loadEncounterFromStorage();

  const [encounter, setEncounter] = useState<EncounterEntry[]>(
    initialData.encounter,
  );
  const [currentTurnIndex, setCurrentTurnIndex] = useState(
    initialData.currentTurnIndex,
  );
  const [currentRound, setCurrentRound] = useState(initialData.currentRound);

  useEffect(() => {
    try {
      const data: EncounterStorageData = {
        encounter,
        currentTurnIndex,
        currentRound,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save encounter to localStorage:", error);
    }
  }, [encounter, currentTurnIndex, currentRound]);

  useEffect(() => {
    const sorted = sortEncounterByInitiative(encounter);

    if (sorted.length === 0) {
      setCurrentTurnIndex(0);
      setCurrentRound(1);
      return;
    }

    setCurrentTurnIndex((prev) => Math.min(prev, sorted.length - 1));
  }, [encounter]);

  const getEntityByName = (
    entityKind: EncounterEntityKind,
    name: string,
  ): StatBlockProps | undefined => {
    if (entityKind === "monster") {
      return monsters.find((monster) => monster.name === name);
    }

    return players.find((player) => player.name === name);
  };

  const getInitiativeBonus = (entity: StatBlockProps) => {
    return Math.floor((entity.stats.Dex - 10) / 2);
  };

  const rollInitiative = () => {
    setEncounter((prev) =>
      prev.map((entry) => {
        const entity = getEntityByName(entry.entityKind, entry.entityName);

        if (!entity) return entry;

        const roll = Math.floor(Math.random() * 20) + 1;
        const initiativeBonus = getInitiativeBonus(entity);

        return {
          ...entry,
          initiative: roll + initiativeBonus,
        };
      }),
    );

    setCurrentTurnIndex(0);
    setCurrentRound(1);
  };

  const nextTurn = () => {
    const sorted = sortEncounterByInitiative(encounter);

    if (sorted.length === 0) return;

    setCurrentTurnIndex((prev) => {
      const nextIndex = (prev + 1) % sorted.length;

      if (nextIndex === 0) {
        setCurrentRound((round) => round + 1);
      }

      return nextIndex;
    });
  };

  const previousTurn = () => {
    const sorted = sortEncounterByInitiative(encounter);

    if (sorted.length === 0) return;

    setCurrentTurnIndex((prev) => {
      const nextIndex = (prev - 1 + sorted.length) % sorted.length;

      if (prev === 0 && sorted.length > 0) {
        setCurrentRound((round) => Math.max(1, round - 1));
      }

      return nextIndex;
    });
  };

  const resetTurns = () => {
    setCurrentTurnIndex(0);
    setCurrentRound(1);
  };

  const renameEntity = (id: string, newName: string) => {
    setEncounter((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              displayName: newName,
            }
          : entry,
      ),
    );
  };

  const addEntityToEncounter = (
    entityKind: EncounterEntityKind,
    entity: StatBlockProps,
  ) => {
    setEncounter((prev) => {
      const instanceNumber = getNextInstanceNumber(
        prev,
        entityKind,
        entity.name,
      );

      return [
        ...prev,
        {
          id: makeId(),
          entityKind,
          entityName: entity.name,
          instanceNumber,
          displayName:
            entityKind === "monster"
              ? instanceNumber > 1
                ? `${entity.name} ${instanceNumber}`
                : entity.name
              : entity.name,
          currentHp: entity.HP,
          maxHp: entity.HP,
          initiative: "",
        },
      ];
    });
  };

  const addMonsterToEncounter = (monster: StatBlockProps) => {
    addEntityToEncounter("monster", monster);
  };

  const addPlayerToEncounter = (player: StatBlockProps) => {
    addEntityToEncounter("player", player);
  };

  const removeEntityFromEncounter = (id: string) => {
    setEncounter((prev) => prev.filter((entry) => entry.id !== id));
  };

  const updateEntityHp = (id: string, hp: number) => {
    setEncounter((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              currentHp: Math.max(0, Math.min(hp, entry.maxHp)),
            }
          : entry,
      ),
    );
  };

  const updateEntityInitiative = (id: string, initiative: number | "") => {
    setEncounter((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              initiative,
            }
          : entry,
      ),
    );
  };

  const clearEncounter = () => {
    setEncounter([]);
    setCurrentTurnIndex(0);
    setCurrentRound(1);
  };

  const value = useMemo(
    () => ({
      encounter,
      currentTurnIndex,
      currentRound,
      addMonsterToEncounter,
      addPlayerToEncounter,
      addEntityToEncounter,
      removeEntityFromEncounter,
      updateEntityHp,
      updateEntityInitiative,
      renameEntity,
      clearEncounter,
      getEntityByName,
      nextTurn,
      previousTurn,
      resetTurns,
      rollInitiative,
    }),
    [encounter, currentTurnIndex, currentRound],
  );

  return (
    <EncounterContext.Provider value={value}>
      {children}
    </EncounterContext.Provider>
  );
};

export const useEncounter = () => {
  const context = useContext(EncounterContext);

  if (!context) {
    throw new Error("useEncounter must be used inside an EncounterProvider");
  }

  return context;
};
