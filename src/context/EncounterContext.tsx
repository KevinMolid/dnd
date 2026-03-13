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

export type EncounterTemplateEntity = {
  entityKind: EncounterEntityKind;
  entityName: string;
  count?: number;
};

export type EncounterTemplate = {
  name: string;
  entities: EncounterTemplateEntity[];
};

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

export type SavedEncounter = {
  id: string;
  name: string;
  encounter: EncounterEntry[];
  currentTurnIndex: number;
  currentRound: number;
};

type EncounterStorageData = {
  activeEncounterId: string | null;
  activeEncounter: {
    encounter: EncounterEntry[];
    currentTurnIndex: number;
    currentRound: number;
  };
  savedEncounters: SavedEncounter[];
};

type EncounterContextType = {
  encounter: EncounterEntry[];
  currentTurnIndex: number;
  currentRound: number;
  savedEncounters: SavedEncounter[];
  activeEncounterId: string | null;
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
  createNewEncounter: () => void;
  saveCurrentEncounter: (name: string) => void;
  loadEncounter: (id: string) => void;
  deleteEncounter: (id: string) => void;
  renameEncounter: (id: string, name: string) => void;
  loadEncounterTemplate: (template: EncounterTemplate) => void;
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

const cloneEncounterEntry = (entry: EncounterEntry): EncounterEntry => ({
  ...entry,
});

const cloneEncounter = (entries: EncounterEntry[]): EncounterEntry[] =>
  entries.map(cloneEncounterEntry);

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

const isValidSavedEncounter = (value: unknown): value is SavedEncounter => {
  if (!value || typeof value !== "object") return false;

  const item = value as SavedEncounter;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    Array.isArray(item.encounter) &&
    item.encounter.every(isValidEncounterEntry) &&
    typeof item.currentTurnIndex === "number" &&
    typeof item.currentRound === "number"
  );
};

const loadEncounterFromStorage = (): EncounterStorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {
        activeEncounterId: null,
        activeEncounter: {
          encounter: [],
          currentTurnIndex: 0,
          currentRound: 1,
        },
        savedEncounters: [],
      };
    }

    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return {
        activeEncounterId: null,
        activeEncounter: {
          encounter: [],
          currentTurnIndex: 0,
          currentRound: 1,
        },
        savedEncounters: [],
      };
    }

    const data = parsed as Partial<EncounterStorageData>;

    const safeActiveEncounter = data.activeEncounter;
    const safeEncounter =
      safeActiveEncounter && Array.isArray(safeActiveEncounter.encounter)
        ? safeActiveEncounter.encounter.filter(isValidEncounterEntry)
        : [];

    const safeTurnIndex =
      safeActiveEncounter &&
      typeof safeActiveEncounter.currentTurnIndex === "number"
        ? safeActiveEncounter.currentTurnIndex
        : 0;

    const safeRound =
      safeActiveEncounter &&
      typeof safeActiveEncounter.currentRound === "number" &&
      safeActiveEncounter.currentRound >= 1
        ? safeActiveEncounter.currentRound
        : 1;

    const safeSavedEncounters = Array.isArray(data.savedEncounters)
      ? data.savedEncounters.filter(isValidSavedEncounter)
      : [];

    return {
      activeEncounterId:
        typeof data.activeEncounterId === "string"
          ? data.activeEncounterId
          : null,
      activeEncounter: {
        encounter: safeEncounter,
        currentTurnIndex: safeTurnIndex,
        currentRound: safeRound,
      },
      savedEncounters: safeSavedEncounters,
    };
  } catch (error) {
    console.error("Failed to load encounter from localStorage:", error);
    return {
      activeEncounterId: null,
      activeEncounter: {
        encounter: [],
        currentTurnIndex: 0,
        currentRound: 1,
      },
      savedEncounters: [],
    };
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
    initialData.activeEncounter.encounter,
  );
  const [currentTurnIndex, setCurrentTurnIndex] = useState(
    initialData.activeEncounter.currentTurnIndex,
  );
  const [currentRound, setCurrentRound] = useState(
    initialData.activeEncounter.currentRound,
  );
  const [savedEncounters, setSavedEncounters] = useState<SavedEncounter[]>(
    initialData.savedEncounters,
  );
  const [activeEncounterId, setActiveEncounterId] = useState<string | null>(
    initialData.activeEncounterId,
  );

  useEffect(() => {
    try {
      const data: EncounterStorageData = {
        activeEncounterId,
        activeEncounter: {
          encounter,
          currentTurnIndex,
          currentRound,
        },
        savedEncounters,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save encounter to localStorage:", error);
    }
  }, [
    encounter,
    currentTurnIndex,
    currentRound,
    savedEncounters,
    activeEncounterId,
  ]);

  useEffect(() => {
    const sorted = sortEncounterByInitiative(encounter);

    if (sorted.length === 0) {
      setCurrentTurnIndex(0);
      setCurrentRound(1);
      return;
    }

    setCurrentTurnIndex((prev) => Math.min(prev, sorted.length - 1));
  }, [encounter]);

  useEffect(() => {
    if (!activeEncounterId) return;

    setSavedEncounters((prev) =>
      prev.map((saved) =>
        saved.id === activeEncounterId
          ? {
              ...saved,
              encounter: cloneEncounter(encounter),
              currentTurnIndex,
              currentRound,
            }
          : saved,
      ),
    );
  }, [encounter, currentTurnIndex, currentRound, activeEncounterId]);

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

      if (prev === 0) {
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
    if (Number.isNaN(hp)) return;

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
    setActiveEncounterId(null);
  };

  const createNewEncounter = () => {
    clearEncounter();
  };

  const saveCurrentEncounter = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    if (activeEncounterId) {
      setSavedEncounters((prev) =>
        prev.map((saved) =>
          saved.id === activeEncounterId
            ? {
                ...saved,
                name: trimmedName,
                encounter: cloneEncounter(encounter),
                currentTurnIndex,
                currentRound,
              }
            : saved,
        ),
      );
      return;
    }

    const newId = makeId();

    setSavedEncounters((prev) => [
      ...prev,
      {
        id: newId,
        name: trimmedName,
        encounter: cloneEncounter(encounter),
        currentTurnIndex,
        currentRound,
      },
    ]);

    setActiveEncounterId(newId);
  };

  const loadEncounter = (id: string) => {
    const saved = savedEncounters.find((enc) => enc.id === id);
    if (!saved) return;

    setEncounter(cloneEncounter(saved.encounter));
    setCurrentTurnIndex(saved.currentTurnIndex);
    setCurrentRound(saved.currentRound);
    setActiveEncounterId(saved.id);
  };

  const deleteEncounter = (id: string) => {
    setSavedEncounters((prev) => prev.filter((enc) => enc.id !== id));

    if (activeEncounterId === id) {
      setActiveEncounterId(null);
      setEncounter([]);
      setCurrentTurnIndex(0);
      setCurrentRound(1);
    }
  };

  const renameEncounter = (id: string, name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setSavedEncounters((prev) =>
      prev.map((enc) =>
        enc.id === id
          ? {
              ...enc,
              name: trimmedName,
            }
          : enc,
      ),
    );
  };

  const loadEncounterTemplate = (template: EncounterTemplate) => {
    const nextEncounter: EncounterEntry[] = [];

    template.entities.forEach((templateEntity) => {
      const count = templateEntity.count ?? 1;
      const statBlock = getEntityByName(
        templateEntity.entityKind,
        templateEntity.entityName,
      );

      if (!statBlock) return;

      for (let i = 0; i < count; i++) {
        const instanceNumber = getNextInstanceNumber(
          nextEncounter,
          templateEntity.entityKind,
          templateEntity.entityName,
        );

        nextEncounter.push({
          id: makeId(),
          entityKind: templateEntity.entityKind,
          entityName: templateEntity.entityName,
          instanceNumber,
          displayName:
            templateEntity.entityKind === "monster"
              ? instanceNumber > 1
                ? `${templateEntity.entityName} ${instanceNumber}`
                : templateEntity.entityName
              : templateEntity.entityName,
          currentHp: statBlock.HP,
          maxHp: statBlock.HP,
          initiative: "",
        });
      }
    });

    const newId = makeId();

    setEncounter(nextEncounter);
    setCurrentTurnIndex(0);
    setCurrentRound(1);
    setActiveEncounterId(newId);

    setSavedEncounters((prev) => [
      ...prev,
      {
        id: newId,
        name: template.name.trim() || "Ny kamp",
        encounter: cloneEncounter(nextEncounter),
        currentTurnIndex: 0,
        currentRound: 1,
      },
    ]);
  };

  const value = useMemo(
    () => ({
      encounter,
      currentTurnIndex,
      currentRound,
      savedEncounters,
      activeEncounterId,
      addMonsterToEncounter,
      addPlayerToEncounter,
      addEntityToEncounter,
      removeEntityFromEncounter,
      updateEntityHp,
      updateEntityInitiative,
      renameEntity,
      clearEncounter,
      createNewEncounter,
      saveCurrentEncounter,
      loadEncounter,
      deleteEncounter,
      renameEncounter,
      loadEncounterTemplate,
      getEntityByName,
      nextTurn,
      previousTurn,
      resetTurns,
      rollInitiative,
    }),
    [
      encounter,
      currentTurnIndex,
      currentRound,
      savedEncounters,
      activeEncounterId,
    ],
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
