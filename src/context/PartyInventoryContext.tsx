import { createContext, useContext, useMemo, useState } from "react";
import {
  players as initialPlayers,
  type PlayerCharacter,
} from "../data/players";

type PartyInventoryContextValue = {
  players: PlayerCharacter[];
  partyInventory: string[];
  giveItemToPlayer: (itemId: string, playerName: string) => void;
  giveItemToParty: (itemId: string) => void;
};

const PartyInventoryContext = createContext<PartyInventoryContextValue | null>(
  null,
);

export const PartyInventoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [players, setPlayers] = useState<PlayerCharacter[]>(initialPlayers);
  const [partyInventory, setPartyInventory] = useState<string[]>([]);

  const giveItemToPlayer = (itemId: string, playerName: string) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.name === playerName
          ? {
              ...player,
              inventory: [...player.inventory, itemId],
            }
          : player,
      ),
    );
  };

  const giveItemToParty = (itemId: string) => {
    setPartyInventory((prev) => [...prev, itemId]);
  };

  const value = useMemo(
    () => ({
      players,
      partyInventory,
      giveItemToPlayer,
      giveItemToParty,
    }),
    [players, partyInventory],
  );

  return (
    <PartyInventoryContext.Provider value={value}>
      {children}
    </PartyInventoryContext.Provider>
  );
};

export const usePartyInventory = () => {
  const context = useContext(PartyInventoryContext);

  if (!context) {
    throw new Error(
      "usePartyInventory must be used within a PartyInventoryProvider",
    );
  }

  return context;
};
