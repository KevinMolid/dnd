import { createContext, useContext, useMemo, useState } from "react";
import {
  players as initialPlayers,
  type Money,
  type PlayerCharacter,
} from "../data/players";

type PartyInventoryContextValue = {
  players: PlayerCharacter[];
  partyInventory: string[];
  partyMoney: Money;
  giveItemToPlayer: (itemId: string, playerName: string) => void;
  giveItemToParty: (itemId: string) => void;
  addMoneyToPlayer: (playerName: string, money: Partial<Money>) => void;
  addMoneyToParty: (money: Partial<Money>) => void;
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
  const [partyMoney, setPartyMoney] = useState<Money>({
    gp: 0,
    sp: 0,
    cp: 0,
  });

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

  const addMoneyToPlayer = (playerName: string, money: Partial<Money>) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.name === playerName
          ? {
              ...player,
              money: {
                gp: player.money.gp + (money.gp ?? 0),
                sp: player.money.sp + (money.sp ?? 0),
                cp: player.money.cp + (money.cp ?? 0),
              },
            }
          : player,
      ),
    );
  };

  const addMoneyToParty = (money: Partial<Money>) => {
    setPartyMoney((prev) => ({
      gp: prev.gp + (money.gp ?? 0),
      sp: prev.sp + (money.sp ?? 0),
      cp: prev.cp + (money.cp ?? 0),
    }));
  };

  const value = useMemo(
    () => ({
      players,
      partyInventory,
      partyMoney,
      giveItemToPlayer,
      giveItemToParty,
      addMoneyToPlayer,
      addMoneyToParty,
    }),
    [players, partyInventory, partyMoney],
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
