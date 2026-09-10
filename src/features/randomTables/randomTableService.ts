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

import {
  db,
} from "../../firebase";

import type {
  CampaignRandomTable,
  CampaignRandomTableDoc,
} from "./types";

const randomTablesCollection = (
  campaignId: string,
) =>
  collection(
    db,
    "campaigns",
    campaignId,
    "randomTables",
  );

export const subscribeToCampaignRandomTables =
  (
    campaignId: string,

    callback: (
      tables: CampaignRandomTable[],
    ) => void,

    onError?: (
      error: Error,
    ) => void,
  ): Unsubscribe => {
    const q =
      query(
        randomTablesCollection(
          campaignId,
        ),

        orderBy(
          "name",
          "asc",
        ),
      );

    return onSnapshot(
      q,

      (
        snapshot,
      ) => {
        const tables =
          snapshot.docs.map(
            (
              document,
            ) => ({
              id:
                document.id,

              ...(document.data() as CampaignRandomTableDoc),
            }),
          );

        callback(
          tables,
        );
      },

      (
        error,
      ) => {
        console.error(
          "Failed to load random tables:",
          error,
        );

        onError?.(
          error,
        );
      },
    );
  };

export const createCampaignRandomTable =
  async ({
    campaignId,

    userId,

    data,
  }: {
    campaignId: string;

    userId: string;

    data: Pick<
      CampaignRandomTableDoc,
      | "name"
      | "description"
      | "kind"
      | "locationNames"
      | "entries"
    >;
  }) => {
    const result =
      await addDoc(
        randomTablesCollection(
          campaignId,
        ),

        {
          ...data,

          createdByUid:
            userId,

          updatedByUid:
            userId,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        },
      );

    return result.id;
  };

export const updateCampaignRandomTable =
  async (
    campaignId: string,

    tableId: string,

    userId: string,

    data: Partial<
      Pick<
        CampaignRandomTableDoc,
        | "name"
        | "description"
        | "locationNames"
        | "entries"
      >
    >,
  ) => {
    await updateDoc(
      doc(
        db,
        "campaigns",
        campaignId,
        "randomTables",
        tableId,
      ),

      {
        ...data,

        updatedByUid:
          userId,

        updatedAt:
          serverTimestamp(),
      },
    );
  };

export const deleteCampaignRandomTable =
  async (
    campaignId: string,

    tableId: string,
  ) => {
    await deleteDoc(
      doc(
        db,
        "campaigns",
        campaignId,
        "randomTables",
        tableId,
      ),
    );
  };