import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import type { EncounterTemplateMonster } from "../../context/EncounterContext";

export const createCampaignEncounterTemplate = async ({
  campaignId,
  userId,
  name,
  monsters,
}: {
  campaignId: string;
  userId: string;
  name: string;
  monsters: EncounterTemplateMonster[];
}) => {
  const ref = collection(db, "campaigns", campaignId, "encounterTemplates");

  await addDoc(ref, {
    name,
    monsters,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdByUid: userId,
    updatedByUid: userId,
  });
};

export const updateCampaignEncounterTemplate = async ({
  campaignId,
  templateId,
  userId,
  name,
  monsters,
}: {
  campaignId: string;
  templateId: string;
  userId: string;
  name: string;
  monsters: EncounterTemplateMonster[];
}) => {
  await updateDoc(
    doc(db, "campaigns", campaignId, "encounterTemplates", templateId),
    {
      name,
      monsters,
      updatedAt: serverTimestamp(),
      updatedByUid: userId,
    },
  );
};

export const deleteCampaignEncounterTemplate = async ({
  campaignId,
  templateId,
}: {
  campaignId: string;
  templateId: string;
}) => {
  await deleteDoc(doc(db, "campaigns", campaignId, "encounterTemplates", templateId));
};