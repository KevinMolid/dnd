import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { monsters, type MonsterDefinition } from "../data/monsterCatalog";

const STORAGE_KEY = "lmop-encounter";

export type EncounterEntityKind = "monster" | "player";

export type EncounterTemplateMonster = {
  id: string;
  monsterId: string;
  quantity: number;
  customName?: string;
};

export type EncounterTemplate = {
  name: string;
  monsters: EncounterTemplateMonster[];
};

type LegacyEncounterTemplateEntity = {
  entityKind: EncounterEntityKind;
  entityName: string;
  count?: number;
};

type LegacyEncounterTemplate = {
  name: string;
  entities: LegacyEncounterTemplateEntity[];
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
  addMonsterToEncounter: (monster: MonsterDefinition) => void;
  addPlayerToEncounter: (player: EncounterPlayerInput) => void;
  addEntityToEncounter: (
    entityKind: EncounterEntityKind,
    entity: MonsterDefinition | EncounterPlayerInput,
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
  loadEncounterTemplate: (
    template: EncounterTemplate | LegacyEncounterTemplate,
  ) => void;
  getEntityByName: (
    entityKind: EncounterEntityKind,
    name: string,
  ) => MonsterDefinition | undefined;
  nextTurn: () => void;
  previousTurn: () => void;
  resetTurns: () => void;
  rollInitiative: () => void;
  rollInitiativeWithPlayerRolls: (
    playerRollsByEntryId: Record<string, number>,
  ) => void;
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

const getMonsterInitiativeBonus = (monster: MonsterDefinition) => {
  return Math.floor((monster.stats.dex - 10) / 2);
};

const getPlayerInitiativeBonus = (entry: EncounterEntry) => {
  if (entry.entityKind !== "player") return 0;
  return entry.playerSnapshot?.initiativeBonus ?? 0;
};

const buildMonsterEncounterEntry = (
  previousEncounter: EncounterEntry[],
  monster: MonsterDefinition,
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
    currentHp: monster.hp,
    maxHp: monster.hp,
    initiative: "",
  };
};

const buildMonsterEncounterEntriesFromTemplateRow = (
  previousEncounter: EncounterEntry[],
  templateMonster: EncounterTemplateMonster,
  monster: MonsterDefinition,
): EncounterEntry[] => {
  const entries: EncounterEntry[] = [];
  const quantity = Math.max(1, templateMonster.quantity);
  const baseName = templateMonster.customName?.trim() || monster.name;

  for (let i = 0; i < quantity; i++) {
    const instanceNumber = getNextInstanceNumber(
      [...previousEncounter, ...entries],
      "monster",
      monster.name,
    );

    entries.push({
      id: makeId(),
      entityKind: "monster",
      entityName: monster.name,
      instanceNumber,
      displayName: quantity > 1 ? `${baseName} ${i + 1}` : baseName,
      currentHp: monster.hp,
      maxHp: monster.hp,
      initiative: "",
    });
  }

  return entries;
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

const normalizeEncounterTemplate = (
  template: EncounterTemplate | LegacyEncounterTemplate,
): EncounterTemplate => {
  if ("monsters" in template && Array.isArray(template.monsters)) {
    return template;
  }

  const legacyTemplate = template as LegacyEncounterTemplate;

  return {
    name: legacyTemplate.name,
    monsters: legacyTemplate.entities
      .filter((entity) => entity.entityKind === "monster")
      .map((entity, index) => {
        const monster = monsters.find((m) => m.name === entity.entityName);

        return {
          id: `legacy-${index}-${entity.entityName}`,
          monsterId: monster?.id ?? "",
          quantity: Math.max(1, entity.count ?? 1),
          customName: undefined,
        };
      })
      .filter((row) => row.monsterId),
  };
};

export const EncounterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [initialData] = useState<EncounterStorageData>(() =>
    loadEncounterFromStorage(),
  );

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

    setSavedEncounters((prev) => {
      let changed = false;

      const next = prev.map((saved) => {
        if (saved.id !== activeEncounterId) return saved;

        const sameTurnIndex = saved.currentTurnIndex === currentTurnIndex;
        const sameRound = saved.currentRound === currentRound;
        const sameEncounter =
          JSON.stringify(saved.encounter) === JSON.stringify(encounter);

        if (sameTurnIndex && sameRound && sameEncounter) {
          return saved;
        }

        changed = true;
        return {
          ...saved,
          encounter: cloneEncounter(encounter),
          currentTurnIndex,
          currentRound,
        };
      });

      return changed ? next : prev;
    });
  }, [encounter, currentTurnIndex, currentRound, activeEncounterId]);

  const getEntityByName = useCallback(
    (
      entityKind: EncounterEntityKind,
      name: string,
    ): MonsterDefinition | undefined => {
      if (entityKind !== "monster") return undefined;
      return monsters.find((monster) => monster.name === name);
    },
    [],
  );

  const getMonsterById = useCallback((monsterId: string) => {
    return monsters.find((monster) => monster.id === monsterId);
  }, []);

  const rollInitiative = useCallback(() => {
    setEncounter((prev) =>
      prev.map((entry) => {
        const roll = Math.floor(Math.random() * 20) + 1;

        if (entry.entityKind === "player") {
          return {
            ...entry,
            initiative: roll + getPlayerInitiativeBonus(entry),
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
  }, [getEntityByName]);

  const rollInitiativeWithPlayerRolls = useCallback(
    (playerRollsByEntryId: Record<string, number>) => {
      setEncounter((prev) =>
        prev.map((entry) => {
          if (entry.entityKind === "player") {
            const manualRoll = playerRollsByEntryId[entry.id];

            if (typeof manualRoll === "number") {
              return {
                ...entry,
                initiative: manualRoll + getPlayerInitiativeBonus(entry),
              };
            }

            return entry;
          }

          const monster = getEntityByName("monster", entry.entityName);
          if (!monster) return entry;

          const autoRoll = Math.floor(Math.random() * 20) + 1;

          return {
            ...entry,
            initiative: autoRoll + getMonsterInitiativeBonus(monster),
          };
        }),
      );

      setCurrentTurnIndex(0);
      setCurrentRound(1);
    },
    [getEntityByName],
  );

  const nextTurn = useCallback(() => {
    setCurrentTurnIndex((prev) => {
      const sorted = sortEncounterByInitiative(encounter);

      if (sorted.length === 0) return prev;

      const nextIndex = (prev + 1) % sorted.length;

      if (nextIndex === 0) {
        setCurrentRound((round) => round + 1);
      }

      return nextIndex;
    });
  }, [encounter]);

  const previousTurn = useCallback(() => {
    setCurrentTurnIndex((prev) => {
      const sorted = sortEncounterByInitiative(encounter);

      if (sorted.length === 0) return prev;

      const nextIndex = (prev - 1 + sorted.length) % sorted.length;

      if (prev === 0) {
        setCurrentRound((round) => Math.max(1, round - 1));
      }

      return nextIndex;
    });
  }, [encounter]);

  const resetTurns = useCallback(() => {
    setCurrentTurnIndex(0);
    setCurrentRound(1);
  }, []);

  const renameEntity = useCallback((id: string, newName: string) => {
    setEncounter((prev) => {
      let changed = false;

      const next = prev.map((entry) => {
        if (entry.id !== id) return entry;
        if (entry.displayName === newName) return entry;

        changed = true;
        return {
          ...entry,
          displayName: newName,
        };
      });

      return changed ? next : prev;
    });
  }, []);

  const addEntityToEncounter = useCallback(
    (
      entityKind: EncounterEntityKind,
      entity: MonsterDefinition | EncounterPlayerInput,
    ) => {
      setEncounter((prev) => {
        if (entityKind === "monster") {
          return [
            ...prev,
            buildMonsterEncounterEntry(prev, entity as MonsterDefinition),
          ];
        }

        return [
          ...prev,
          buildPlayerEncounterEntry(prev, entity as EncounterPlayerInput),
        ];
      });
    },
    [],
  );

  const addMonsterToEncounter = useCallback(
    (monster: MonsterDefinition) => {
      addEntityToEncounter("monster", monster);
    },
    [addEntityToEncounter],
  );

  const addPlayerToEncounter = useCallback(
    (player: EncounterPlayerInput) => {
      addEntityToEncounter("player", player);
    },
    [addEntityToEncounter],
  );

  const removeEntityFromEncounter = useCallback((id: string) => {
    setEncounter((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      return next.length === prev.length ? prev : next;
    });
  }, []);

  const updateEntityHp = useCallback((id: string, hp: number) => {
    if (Number.isNaN(hp)) return;

    setEncounter((prev) => {
      let changed = false;

      const next = prev.map((entry) => {
        if (entry.id !== id) return entry;

        const nextHp = Math.max(0, Math.min(hp, entry.maxHp));
        if (entry.currentHp === nextHp) return entry;

        changed = true;
        return {
          ...entry,
          currentHp: nextHp,
        };
      });

      return changed ? next : prev;
    });
  }, []);

  const updateEntityInitiative = useCallback(
    (id: string, initiative: number | "") => {
      setEncounter((prev) => {
        let changed = false;

        const next = prev.map((entry) => {
          if (entry.id !== id) return entry;
          if (entry.initiative === initiative) return entry;

          changed = true;
          return {
            ...entry,
            initiative,
          };
        });

        return changed ? next : prev;
      });
    },
    [],
  );

  const clearEncounter = useCallback(() => {
    setEncounter([]);
    setCurrentTurnIndex(0);
    setCurrentRound(1);
    setActiveEncounterId(null);
  }, []);

  const createNewEncounter = useCallback(() => {
    clearEncounter();
  }, [clearEncounter]);

  const saveCurrentEncounter = useCallback(
    (name: string) => {
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
    },
    [activeEncounterId, encounter, currentTurnIndex, currentRound],
  );

  const loadEncounter = useCallback(
    (id: string) => {
      const saved = savedEncounters.find((enc) => enc.id === id);
      if (!saved) return;

      setEncounter(cloneEncounter(saved.encounter));
      setCurrentTurnIndex(saved.currentTurnIndex);
      setCurrentRound(saved.currentRound);
      setActiveEncounterId(saved.id);
    },
    [savedEncounters],
  );

  const deleteEncounter = useCallback(
    (id: string) => {
      setSavedEncounters((prev) => prev.filter((enc) => enc.id !== id));

      if (activeEncounterId === id) {
        setActiveEncounterId(null);
        setEncounter([]);
        setCurrentTurnIndex(0);
        setCurrentRound(1);
      }
    },
    [activeEncounterId],
  );

  const renameEncounter = useCallback((id: string, name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setSavedEncounters((prev) => {
      let changed = false;

      const next = prev.map((enc) => {
        if (enc.id !== id) return enc;
        if (enc.name === trimmedName) return enc;

        changed = true;
        return {
          ...enc,
          name: trimmedName,
        };
      });

      return changed ? next : prev;
    });
  }, []);

  const loadEncounterTemplate = useCallback(
    (template: EncounterTemplate | LegacyEncounterTemplate) => {
      const normalizedTemplate = normalizeEncounterTemplate(template);
      const nextEncounter: EncounterEntry[] = [];

      normalizedTemplate.monsters.forEach((templateMonster) => {
        const monster = getMonsterById(templateMonster.monsterId);
        if (!monster) return;

        nextEncounter.push(
          ...buildMonsterEncounterEntriesFromTemplateRow(
            nextEncounter,
            templateMonster,
            monster,
          ),
        );
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
          name: normalizedTemplate.name.trim() || "Ny kamp",
          encounter: cloneEncounter(nextEncounter),
          currentTurnIndex: 0,
          currentRound: 1,
        },
      ]);
    },
    [getMonsterById],
  );

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
      rollInitiativeWithPlayerRolls,
    }),
    [
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
      rollInitiativeWithPlayerRolls,
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