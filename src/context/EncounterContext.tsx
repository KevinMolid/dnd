import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { StatBlockProps } from "../components/StatBlock";
import { monsters } from "../data/monsters";

type MonsterEncounterSource = Extract<StatBlockProps, { HP: number }>;

const isMonsterStatBlock = (
  value: StatBlockProps,
): value is MonsterEncounterSource => {
  return "HP" in value && "stats" in value;
};

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

export type EncounterPlayerInput = {
  characterId?: string;
  name: string;
  maxHp: number;
  currentHp?: number;
  armorClass?: number;
  initiativeBonus?: number;
  level?: number;
  classId?: string;
  speciesId?: string;
};

export type EncounterPlayerSnapshot = {
  characterId: string | null;
  armorClass: number | null;
  initiativeBonus: number;
  level: number | null;
  classId: string | null;
  speciesId: string | null;
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
  playerSnapshot?: EncounterPlayerSnapshot;
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
  addMonsterToEncounter: (monster: MonsterEncounterSource) => void;
  addPlayerToEncounter: (player: EncounterPlayerInput) => void;
  addEntityToEncounter: (
    entityKind: EncounterEntityKind,
    entity: MonsterEncounterSource | EncounterPlayerInput,
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
  ) => MonsterEncounterSource | undefined;
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
  playerSnapshot: entry.playerSnapshot
    ? { ...entry.playerSnapshot }
    : undefined,
});

const cloneEncounter = (entries: EncounterEntry[]): EncounterEntry[] =>
  entries.map(cloneEncounterEntry);

const isEncounterPlayerSnapshot = (
  value: unknown,
): value is EncounterPlayerSnapshot => {
  if (!value || typeof value !== "object") return false;

  const item = value as EncounterPlayerSnapshot;

  return (
    (typeof item.characterId === "string" || item.characterId === null) &&
    (typeof item.armorClass === "number" || item.armorClass === null) &&
    typeof item.initiativeBonus === "number" &&
    (typeof item.level === "number" || item.level === null) &&
    (typeof item.classId === "string" || item.classId === null) &&
    (typeof item.speciesId === "string" || item.speciesId === null)
  );
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
    (typeof item.initiative === "number" || item.initiative === "") &&
    (item.playerSnapshot === undefined ||
      isEncounterPlayerSnapshot(item.playerSnapshot))
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

const getMonsterInitiativeBonus = (monster: MonsterEncounterSource) => {
  return Math.floor((monster.stats.Dex - 10) / 2);
};

const buildMonsterEncounterEntry = (
  previousEncounter: EncounterEntry[],
  monster: MonsterEncounterSource,
): EncounterEntry => {
  const instanceNumber = getNextInstanceNumber(
    previousEncounter,
    "monster",
    monster.name,
  );

  return {
    id: makeId(),
    entityKind: "monster",
    entityName: monster.name,
    instanceNumber,
    displayName:
      instanceNumber > 1 ? `${monster.name} ${instanceNumber}` : monster.name,
    currentHp: monster.HP,
    maxHp: monster.HP,
    initiative: "",
  };
};

const buildPlayerEncounterEntry = (
  previousEncounter: EncounterEntry[],
  player: EncounterPlayerInput,
): EncounterEntry => {
  const instanceNumber = getNextInstanceNumber(
    previousEncounter,
    "player",
    player.name,
  );

  const maxHp = Math.max(1, player.maxHp);
  const currentHp = Math.max(
    0,
    Math.min(player.currentHp ?? player.maxHp, player.maxHp),
  );

  return {
    id: makeId(),
    entityKind: "player",
    entityName: player.name,
    instanceNumber,
    displayName: player.name,
    currentHp,
    maxHp,
    initiative: "",
    playerSnapshot: {
      characterId: player.characterId ?? null,
      armorClass:
        typeof player.armorClass === "number" ? player.armorClass : null,
      initiativeBonus: player.initiativeBonus ?? 0,
      level: typeof player.level === "number" ? player.level : null,
      classId: player.classId ?? null,
      speciesId: player.speciesId ?? null,
    },
  };
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
  ): MonsterEncounterSource | undefined => {
    if (entityKind !== "monster") return undefined;

    const monster = monsters.find((monster) => monster.name === name);
    return monster && isMonsterStatBlock(monster) ? monster : undefined;
  };

  const rollInitiative = () => {
    setEncounter((prev) =>
      prev.map((entry) => {
        const roll = Math.floor(Math.random() * 20) + 1;

        if (entry.entityKind === "player") {
          const initiativeBonus = entry.playerSnapshot?.initiativeBonus ?? 0;

          return {
            ...entry,
            initiative: roll + initiativeBonus,
          };
        }

        const monster = getEntityByName("monster", entry.entityName);
        if (!monster) return entry;

        return {
          ...entry,
          initiative: roll + getMonsterInitiativeBonus(monster),
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
    entity: MonsterEncounterSource | EncounterPlayerInput,
  ) => {
    setEncounter((prev) => {
      if (entityKind === "monster") {
        return [
          ...prev,
          buildMonsterEncounterEntry(prev, entity as MonsterEncounterSource),
        ];
      }

      return [
        ...prev,
        buildPlayerEncounterEntry(prev, entity as EncounterPlayerInput),
      ];
    });
  };

  const addMonsterToEncounter = (monster: MonsterEncounterSource) => {
    addEntityToEncounter("monster", monster);
  };

  const addPlayerToEncounter = (player: EncounterPlayerInput) => {
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

      if (templateEntity.entityKind !== "monster") {
        return;
      }

      const monster = getEntityByName("monster", templateEntity.entityName);
      if (!monster) return;

      for (let i = 0; i < count; i++) {
        nextEncounter.push(buildMonsterEncounterEntry(nextEncounter, monster));
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
