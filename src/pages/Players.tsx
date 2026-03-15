import Container from "../components/Container";
import H1 from "../components/H1";
import H2 from "../components/H2";
import StatBlock from "../components/StatBlock";
import { itemList } from "../data/items";
import { usePartyInventory } from "../context/PartyInventoryContext";

const Players = () => {
  const { players, partyInventory, partyMoney } = usePartyInventory();

  const sortedPlayers = [...players].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const getItemName = (itemId: string) => {
    return itemList.find((item) => item.id === itemId)?.name ?? itemId;
  };

  return (
    <div>
      <Container>
        <H1>Spillere</H1>

        <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
          <H2>Party inventory</H2>

          <div className="mb-2">
            <div className="flex gap-3 text-sm text-white/80">
              <span>{partyMoney.gp} gp</span>
              <span>{partyMoney.sp} sp</span>
              <span>{partyMoney.cp} cp</span>
            </div>
          </div>

          {partyInventory.length === 0 ? (
            <p className="text-sm text-white/60">No shared items yet.</p>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
              {partyInventory.map((itemId, index) => (
                <li key={`${itemId}-${index}`}>{getItemName(itemId)}</li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-wrap gap-4">
          {sortedPlayers.map((player) => (
            <div
              key={player.name}
              className="flex max-w-full flex-col gap-3 rounded-lg"
            >
              <StatBlock {...player} />

              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="mb-2 text-lg font-semibold text-white">
                  Inventory
                </div>

                <div className="mb-2">
                  <div className="flex gap-3 text-sm text-white/80">
                    <span>{player.money.gp} gp</span>
                    <span>{player.money.sp} sp</span>
                    <span>{player.money.cp} cp</span>
                  </div>
                </div>

                {player.inventory.length === 0 ? (
                  <p className="text-sm text-white/60">No items.</p>
                ) : (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-white/80">
                    {player.inventory.map((itemId, index) => (
                      <li key={`${player.name}-${itemId}-${index}`}>
                        {getItemName(itemId)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Players;
