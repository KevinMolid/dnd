import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
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
  parentMapId = null,
}: {
  campaignId: string;
  createdByUid: string;
  title: string;
  imageUrl: string;
  order: number;
  parentMapId?: string | null;
}) => {
  await addDoc(mapsCollection(campaignId), {
    campaignId,
    createdByUid,
    ownerUid: createdByUid,
    title,
    imageUrl,
    order,
    parentMapId,
    rooms: [],
    musicCues: [],
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
  const mapRef = doc(db, "campaigns", campaignId, "maps", mapId);
  const mapSnapshot = await getDoc(mapRef);

  if (!mapSnapshot.exists()) {
    return;
  }

  const deletedMap = mapSnapshot.data() as CampaignMapDoc;
  const newParentMapId = deletedMap.parentMapId ?? null;

  // Preserve the hierarchy when deleting a parent:
  // direct children move up one level instead of becoming unreachable.
  const childQuery = query(
    mapsCollection(campaignId),
    where("parentMapId", "==", mapId),
  );
  const childSnapshot = await getDocs(childQuery);

  if (childSnapshot.empty) {
    await deleteDoc(mapRef);
    return;
  }

  const batch = writeBatch(db);

  childSnapshot.docs.forEach((childDoc) => {
    batch.update(childDoc.ref, {
      parentMapId: newParentMapId,
      updatedAt: serverTimestamp(),
    });
  });

  batch.delete(mapRef);
  await batch.commit();
};
