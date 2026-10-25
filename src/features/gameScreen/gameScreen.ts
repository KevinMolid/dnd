import { doc, getFirestore, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from "firebase/firestore";

export type GameScreenState =
  | { type: "blank"; mapId: null }
  | { type: "handout"; mapId: null; imageUrl: string }
  | { type: "map"; mapId: string }
  | {
      type: "npc";
      mapId: null;
      imageUrl: string;
      name: string;
      imageCropX: number;
      imageCropY: number;
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
      if (data?.type === "map" && typeof data.mapId === "string") {
        onChange({ type: "map", mapId: data.mapId });
      } else if (data?.type === "npc" && typeof data.imageUrl === "string" && data.imageUrl.length > 0) {
        onChange({
          type: "npc",
          mapId: null,
          imageUrl: data.imageUrl,
          name: typeof data.name === "string" ? data.name : "",
          imageCropX: typeof data.imageCropX === "number" ? data.imageCropX : 50,
          imageCropY: typeof data.imageCropY === "number" ? data.imageCropY : 50,
        });
      } else if (data?.type === "handout" && typeof data.imageUrl === "string" && data.imageUrl.trim()) {
        onChange({ type: "handout", mapId: null, imageUrl: data.imageUrl });
      } else {
        onChange({ type: "blank", mapId: null });
      }
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

export async function castNpcToGameScreen(
  campaignId: string,
  npc: { imageUrl: string; name?: string; imageCropX?: number; imageCropY?: number },
): Promise<void> {
  if (!campaignId || !npc.imageUrl?.trim()) throw new Error("NPC portrait is required");
  await setDoc(screenRef(campaignId), {
    type: "npc",
    mapId: null,
    imageUrl: npc.imageUrl,
    name: npc.name ?? "",
    imageCropX: npc.imageCropX ?? 50,
    imageCropY: npc.imageCropY ?? 50,
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

/** Cast only an image URL. Handout title/content/visibility are not published. */
export async function castHandoutImageToGameScreen(
  campaignId: string,
  imageUrl: string,
): Promise<void> {
  if (!campaignId || !imageUrl.trim()) {
    throw new Error("Campaign and handout image are required");
  }
  await setDoc(screenRef(campaignId), {
    type: "handout",
    mapId: null,
    imageUrl: imageUrl.trim(),
    updatedAt: serverTimestamp(),
  });
}
