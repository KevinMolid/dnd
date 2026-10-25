import { doc, getFirestore, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from "firebase/firestore";

export type GameScreenState = {
  type: "blank" | "map";
  mapId: string | null;
};

const screenRef = (campaignId: string) =>
  doc(getFirestore(), "campaigns", campaignId, "gameScreen", "state");

export function subscribeToGameScreen(
  campaignId: string,
  onChange: (state: GameScreenState) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    screenRef(campaignId),
    (snapshot) => {
      const data = snapshot.data();
      onChange(
        data?.type === "map" && typeof data.mapId === "string"
          ? { type: "map", mapId: data.mapId }
          : { type: "blank", mapId: null },
      );
    },
    onError,
  );
}

export async function castMapToGameScreen(campaignId: string, mapId: string): Promise<void> {
  if (!campaignId || !mapId) throw new Error("Campaign and map are required");
  await setDoc(screenRef(campaignId), {
    type: "map",
    mapId,
    updatedAt: serverTimestamp(),
  });
}

export async function clearGameScreen(campaignId: string): Promise<void> {
  await setDoc(screenRef(campaignId), {
    type: "blank",
    mapId: null,
    updatedAt: serverTimestamp(),
  });
}
