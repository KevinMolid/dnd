import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../firebase";
import type { CampaignMapDoc } from "./types";

const mapsCollection = (campaignId: string) =>
  collection(db, "campaigns", campaignId, "maps");

export const subscribeToCampaignMaps = (
  campaignId: string,
  callback: (maps: (CampaignMapDoc & { id: string })[]) => void,
): Unsubscribe => {
  const q = query(mapsCollection(campaignId), orderBy("order", "asc"));

  return onSnapshot(q, (snapshot) => {
    const maps = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as CampaignMapDoc),
    }));

    callback(maps);
  });
};

export const createCampaignMap = async ({
  campaignId,
  createdByUid,
  title,
  imageUrl,
  order,
}: {
  campaignId: string;
  createdByUid: string;
  title: string;
  imageUrl: string;
  order: number;
}) => {
  await addDoc(mapsCollection(campaignId), {
    campaignId,
    createdByUid,
    ownerUid: createdByUid,
    title,
    imageUrl,
    order,
    rooms: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateCampaignMap = async (
  campaignId: string,
  mapId: string,
  data: Partial<CampaignMapDoc>,
) => {
  await updateDoc(doc(db, "campaigns", campaignId, "maps", mapId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCampaignMap = async (
  campaignId: string,
  mapId: string,
) => {
  const ref = doc(db, "campaigns", campaignId, "maps", mapId);
  await deleteDoc(ref);
};