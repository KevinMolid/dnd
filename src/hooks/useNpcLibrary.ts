import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { db } from "../firebase";

export type CampaignNpcLibraryItem = {
  id: string;

  name: string;

  species?: string;

  occupation?: string;

  role?: string;

  imageUrl?: string;

  location?: string;
};

export default function useNpcLibrary(
  campaignId?: string,
) {
  const [npcs, setNpcs] =
    useState<
      CampaignNpcLibraryItem[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) {
      setNpcs([]);
      setLoading(false);

      return;
    }

    setLoading(true);
    setError(null);

    const npcsRef = collection(
      db,
      "campaigns",
      campaignId,
      "npcs",
    );

    const q = query(
      npcsRef,
      orderBy("name", "asc"),
    );

    const unsubscribe =
      onSnapshot(
        q,

        (snapshot) => {
          const next =
            snapshot.docs.map(
              (docSnap) => {
                const data =
                  docSnap.data() as Omit<
                    CampaignNpcLibraryItem,
                    "id"
                  >;

                return {
                  id: docSnap.id,
                  ...data,
                };
              },
            );

          setNpcs(next);
          setLoading(false);
        },

        (snapshotError) => {
          console.error(
            "Failed to load NPC library:",
            snapshotError,
          );

          setNpcs([]);
          setLoading(false);

          setError(
            "Failed to load NPCs.",
          );
        },
      );

    return () =>
      unsubscribe();
  }, [campaignId]);

  const sortedNpcs =
    useMemo(
      () =>
        [...npcs].sort(
          (a, b) =>
            a.name.localeCompare(
              b.name,
              undefined,
              {
                sensitivity:
                  "base",
              },
            ),
        ),
      [npcs],
    );

  return {
    npcs: sortedNpcs,
    loading,
    error,
  };
}