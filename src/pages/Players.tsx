import Container from "../components/Container";
import H1 from "../components/H1";
import H2 from "../components/H2";
import StatBlock from "../components/StatBlock";
import { itemList, type ItemData } from "../data/items";
import { usePartyInventory } from "../context/PartyInventoryContext";

const ItemTooltipLink = ({ item }: { item: ItemData }) => {
  return (
    <span className="group relative inline-block font-semibold text-white">
      <span className="cursor-pointer">{item.name}</span>

      <span className="pointer-events-none absolute left-0 top-full z-30 mt-2 hidden w-80 rounded-lg border border-white/10 bg-zinc-900 p-3 text-left shadow-2xl group-hover:block">
        <span className="mb-1 block text-sm font-bold text-white">
          {item.name}
        </span>

        <span className="mb-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded bg-white/10 px-2 py-1 text-white/80">
            {item.category}
          </span>

          {item.subtype && (
            <span className="rounded bg-white/10 px-2 py-1 text-white/80">
              {item.subtype}
            </span>
          )}

          {item.rarity && (
            <span className="rounded bg-yellow-500/15 px-2 py-1 text-yellow-300">
              {item.rarity}
            </span>
          )}

          {item.requiresAttunement && (
            <span className="rounded bg-blue-500/15 px-2 py-1 text-blue-300">
              Attunement
            </span>
          )}
        </span>

        <span className="block whitespace-pre-line text-xs leading-5 text-white/75">
          {item.description}
        </span>
      </span>
    </span>
  );
};

const Players = () => {
  const { players, partyInventory, partyMoney } = usePartyInventory();

  const sortedPlayers = [...players].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const getItemById = (itemId: string) => {
    return itemList.find((item) => item.id === itemId) ?? null;
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
              {partyInventory.map((itemId, index) => {
                const item = getItemById(itemId);

                return (
                  <li key={`${itemId}-${index}`}>
                    {item ? <ItemTooltipLink item={item} /> : itemId}
                  </li>
                );
              })}
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
                    {player.inventory.map((itemId, index) => {
                      const item = getItemById(itemId);

                      return (
                        <li key={`${player.name}-${itemId}-${index}`}>
                          {item ? <ItemTooltipLink item={item} /> : itemId}
                        </li>
                      );
                    })}
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
