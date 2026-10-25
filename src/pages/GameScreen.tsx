import { useEffect, useMemo, useState } from "react";
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

  const map = useMemo(
    () => maps.find((candidate) => candidate.id === screen.mapId),
    [maps, screen.mapId],
  );

  return (
    <main className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black text-white">
      {status === "error" ? (
        <p className="p-6 text-center text-sm text-red-300">Unable to connect to Game Screen. Check your permissions and connection.</p>
      ) : screen.type === "map" && map?.imageUrl ? (
        <img
          key={`${map.id}:${map.imageUrl}`}
          src={map.imageUrl}
          alt={map.title ?? "Game map"}
          draggable={false}
          className="h-full w-full select-none object-contain"
        />
      ) : screen.type === "map" ? (
        <p className="text-sm text-zinc-500">Loading map…</p>
      ) : status === "connecting" ? (
        <p className="text-sm text-zinc-500">Connecting…</p>
      ) : null}
    </main>
  );
}
