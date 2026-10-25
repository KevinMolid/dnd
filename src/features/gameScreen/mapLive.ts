import { doc, onSnapshot, setDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "../../firebase";
import type { FogStroke, MapNpcMini } from "../../components/maps/MapCanvas";

export type PlayerMapLive = {
  fogEnabled: boolean;
  fogStrokes: FogStroke[];
  minis: MapNpcMini[];
};

export const EMPTY_LIVE: PlayerMapLive = {
  fogEnabled: false,
  fogStrokes: [],
  minis: [],
};

const liveRef = (campaignId: string, mapId: string) =>
  doc(db, "campaigns", campaignId, "gameScreenMaps", mapId);

export function subscribePlayerMap(
  campaignId: string,
  mapId: string,
  onChange: (live: PlayerMapLive) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    liveRef(campaignId, mapId),
    (snapshot) => {
      const data = snapshot.data();
      onChange({
        fogEnabled: data?.fogEnabled === true,
        fogStrokes: Array.isArray(data?.fogStrokes) ? data.fogStrokes : [],
        minis: Array.isArray(data?.minis) ? data.minis : [],
      });
    },
    onError,
  );
}

export async function publishPlayerMap(
  campaignId: string,
  mapId: string,
  state: PlayerMapLive,
): Promise<void> {
  // Firestore rejects undefined fields (including nested fields in arrays).
  // Publish only player-safe fields and explicit defaults.
  const minis = state.minis
    .filter(
      (mini) =>
        !mini.hidden &&
        typeof mini.x === "number" &&
        Number.isFinite(mini.x) &&
        typeof mini.y === "number" &&
        Number.isFinite(mini.y),
    )
    .map((mini) => ({
      npcId: mini.npcId,
      name: mini.name,
      imageUrl: mini.imageUrl ?? "",
      imageCropX: mini.imageCropX ?? 50,
      imageCropY: mini.imageCropY ?? 50,
      x: mini.x,
      y: mini.y,
      size: mini.size ?? 42,
      hidden: false,
    }));

  await setDoc(liveRef(campaignId, mapId), {
    fogEnabled: state.fogEnabled,
    fogStrokes: state.fogStrokes,
    minis,
  });
}
