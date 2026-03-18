import { useMemo, useState } from "react";
import MapViewer from "../components/MapViewer";
import type { PlayerCharacter, Money } from "../data/players";
import type { CampaignMap } from "../features/maps/types";

type Props = {
  maps: CampaignMap[];
  loading?: boolean;
  players: PlayerCharacter[];
  onGiveItemToPlayer: (itemId: string, playerName: string) => void;
  onGiveItemToParty: (itemId: string) => void;
  onGiveMoneyToPlayer: (playerName: string, money: Partial<Money>) => void;
  onGiveMoneyToParty: (money: Partial<Money>) => void;
};

const CampaignMapsOverview = ({
  maps,
  loading = false,
  players,
  onGiveItemToPlayer,
  onGiveItemToParty,
  onGiveMoneyToPlayer,
  onGiveMoneyToParty,
}: Props) => {
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

  const selectedMap = useMemo(
    () => maps.find((map) => map.id === selectedMapId) ?? null,
    [maps, selectedMapId],
  );

  return (
    <>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Maps</h2>
            <p className="text-sm text-white/60">
              Open a map to view rooms, notes, monsters, treasure, and links
              between areas.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            Loading maps...
          </div>
        ) : maps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-5 text-sm text-white/70">
            No maps in this campaign yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {maps.map((map) => (
              <button
                key={map.id}
                type="button"
                onClick={() => setSelectedMapId(map.id)}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 text-left transition hover:border-white/20 hover:bg-zinc-800"
              >
                <div className="aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={map.imageUrl}
                    alt={map.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    draggable={false}
                  />
                </div>

                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-white">
                        {map.title}
                      </div>
                      <div className="text-sm text-white/55">
                        {map.rooms?.length ?? 0} rom
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {map.rooms?.slice(0, 4).map((room) => (
                      <span
                        key={room.id}
                        className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/75"
                      >
                        {room.id}. {room.name}
                      </span>
                    ))}

                    {(map.rooms?.length ?? 0) > 4 && (
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/60">
                        +{(map.rooms?.length ?? 0) - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedMap && (
        <MapViewer
          map={selectedMap}
          onClose={() => setSelectedMapId(null)}
          players={players}
          onGiveItemToPlayer={onGiveItemToPlayer}
          onGiveItemToParty={onGiveItemToParty}
          onGiveMoneyToPlayer={onGiveMoneyToPlayer}
          onGiveMoneyToParty={onGiveMoneyToParty}
        />
      )}
    </>
  );
};

export default CampaignMapsOverview;
