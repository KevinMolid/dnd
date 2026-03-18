import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import type { JournalEntry, JournalEntryInput } from "./types";

function journalCollectionRef(campaignId: string) {
  return collection(db, "campaigns", campaignId, "journalEntries");
}

function journalDocRef(campaignId: string, entryId: string) {
  return doc(db, "campaigns", campaignId, "journalEntries", entryId);
}

function mapJournalEntryDoc(
  id: string,
  data: Record<string, unknown>,
): JournalEntry {
  return {
    id,
    title: typeof data.title === "string" ? data.title : "",
    content: typeof data.content === "string" ? data.content : "",

    type:
      typeof data.type === "string"
        ? (data.type as JournalEntry["type"])
        : "custom",

    visibility:
      typeof data.visibility === "string"
        ? (data.visibility as JournalEntry["visibility"])
        : "dm",

    visibleToPlayerIds: Array.isArray(data.visibleToPlayerIds)
      ? data.visibleToPlayerIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [],

    published: Boolean(data.published),
    pinned: Boolean(data.pinned),

    sessionNumber:
      typeof data.sessionNumber === "number" ? data.sessionNumber : null,

    sessionDate: typeof data.sessionDate === "string" ? data.sessionDate : null,

    tags: Array.isArray(data.tags)
      ? data.tags.filter((value): value is string => typeof value === "string")
      : [],

    relatedQuestIds: Array.isArray(data.relatedQuestIds)
      ? data.relatedQuestIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [],

    relatedNpcIds: Array.isArray(data.relatedNpcIds)
      ? data.relatedNpcIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [],

    relatedLocationIds: Array.isArray(data.relatedLocationIds)
      ? data.relatedLocationIds.filter(
          (value): value is string => typeof value === "string",
        )
      : [],

    relatedMapId:
      typeof data.relatedMapId === "string" ? data.relatedMapId : null,

    relatedRoomId:
      typeof data.relatedRoomId === "string" ||
      typeof data.relatedRoomId === "number"
        ? data.relatedRoomId
        : null,

    createdAt: typeof data.createdAt === "number" ? data.createdAt : 0,
    updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : 0,

    createdByUid: typeof data.createdByUid === "string" ? data.createdByUid : "",
    createdByName:
      typeof data.createdByName === "string" ? data.createdByName : undefined,
  };
}

export function subscribeToJournalEntries(
  campaignId: string,
  callback: (entries: JournalEntry[]) => void,
) {
  const q = query(journalCollectionRef(campaignId), orderBy("updatedAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map((docSnap) =>
      mapJournalEntryDoc(docSnap.id, docSnap.data()),
    );

    callback(entries);
  });
}

export async function getJournalEntries(
  campaignId: string,
): Promise<JournalEntry[]> {
  const q = query(journalCollectionRef(campaignId), orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) =>
    mapJournalEntryDoc(docSnap.id, docSnap.data()),
  );
}

export async function createJournalEntry(
  campaignId: string,
  input: JournalEntryInput,
) {
  const now = Date.now();

  await addDoc(journalCollectionRef(campaignId), {
    ...input,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateJournalEntry(
  campaignId: string,
  entryId: string,
  input: Partial<JournalEntryInput>,
) {
  await updateDoc(journalDocRef(campaignId, entryId), {
    ...input,
    updatedAt: Date.now(),
  });
}

export async function deleteJournalEntry(
  campaignId: string,
  entryId: string,
) {
  await deleteDoc(journalDocRef(campaignId, entryId));
}

export async function toggleJournalEntryPublished(
  campaignId: string,
  entryId: string,
  published: boolean,
) {
  await updateDoc(journalDocRef(campaignId, entryId), {
    published,
    updatedAt: Date.now(),
  });
}

export async function toggleJournalEntryPinned(
  campaignId: string,
  entryId: string,
  pinned: boolean,
) {
  await updateDoc(journalDocRef(campaignId, entryId), {
    pinned,
    updatedAt: Date.now(),
  });
}