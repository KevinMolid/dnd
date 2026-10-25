import { useEffect, useMemo, useState } from "react";
import MapCanvas from "../components/maps/MapCanvas";
import { EMPTY_LIVE, subscribePlayerMap, type PlayerMapLive } from "../features/gameScreen/mapLive";
import { useParams } from "react-router-dom";
import { useCampaignMaps } from "../features/maps/useCampaignMaps";
import {
  subscribeToGameScreen,
  type GameScreenState,
} from "../features/gameScreen/gameScreen";

const BLANK: GameScreenState = { type: "blank", mapId: null };

/** TV/projector-facing view: deliberately no campaign layout, sidebar, or DM notes. */
export default function GameScreen() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [live, setLive] = useState<PlayerMapLive>(EMPTY_LIVE);
  const [screen, setScreen] = useState<GameScreenState>(BLANK);
  const [status, setStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const { maps } = useCampaignMaps(campaignId ?? "");

  useEffect(() => {
    if (!campaignId) return;
    setStatus("connecting");
    return subscribeToGameScreen(
      campaignId,
      (next) => {
        setScreen(next);
        setStatus("connected");
      },
      (error) => {
        console.error("Game Screen subscription failed", error);
        setStatus("error");
      },
    );
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId || screen.type !== "map" || !screen.mapId) { setLive(EMPTY_LIVE); return; }
    setLive(EMPTY_LIVE);
    return subscribePlayerMap(campaignId, screen.mapId, setLive, error => {
      console.error("Live map subscription failed", error);
      setStatus("error");
    });
  }, [campaignId, screen.type, screen.mapId]);

  const map = useMemo(
    () => maps.find((candidate) => candidate.id === screen.mapId),
    [maps, screen.mapId],
  );

  return (
    <main className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black text-white">
      {status === "error" ? (
        <p className="p-6 text-center text-sm text-red-300">Unable to connect to Game Screen. Check your permissions and connection.</p>
      ) : screen.type === "map" && map?.imageUrl ? (
        <MapCanvas key={map.id} map={map} rooms={[]}
          npcMinis={live.minis} showNpcMinis
          fogEnabled={live.fogEnabled} fogStrokes={live.fogStrokes}
          playerView showAreaNumbers={false} showAreaNames={false}
          showEnvironmentLabels={false} showAreaBoundaries={false}
          className="h-full w-full" />
      ) : screen.type === "map" ? (
        <p className="text-sm text-zinc-500">Loading map…</p>
      ) : screen.type === "npc" ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-5 sm:p-8">
          <div className="min-h-0 min-w-0 flex-1 w-full flex items-center justify-center">
            <img
              src={screen.imageUrl}
              alt={screen.name || "NPC portrait"}
              className="block max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              draggable={false}
            />
          </div>
          {screen.name ? (
            <h1 className="shrink-0 text-center text-xl font-semibold tracking-wide text-white sm:text-3xl">
              {screen.name}
            </h1>
          ) : null}
        </div>
      ) : screen.type === "handout" ? (
        <img
          src={screen.imageUrl}
          alt="Handout"
          draggable={false}
          className="block max-h-full max-w-full object-contain"
        />
      ) : status === "connecting" ? (
        <p className="text-sm text-zinc-500">Connecting…</p>
      ) : null}
    </main>
  );
}
