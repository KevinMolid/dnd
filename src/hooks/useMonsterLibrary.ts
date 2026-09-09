import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  monsters,
  type MonsterDefinition,
} from "../data/monsterCatalog";

import type {
  MonsterListItem,
} from "../components/monsters/MonsterStatBlock";

type CampaignMonster = MonsterDefinition & {
  campaignId?: string;
  source: "campaign";
  basedOnMonsterId?: string;
  createdByUid?: string;
};

export default function useMonsterLibrary(
  campaignId?: string,
) {
  const [campaignMonsters, setCampaignMonsters] =
    useState<CampaignMonster[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) {
      setCampaignMonsters([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const monstersRef = collection(
      db,
      "campaigns",
      campaignId,
      "monsters",
    );

    const q = query(
      monstersRef,
      orderBy("name", "asc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const next: CampaignMonster[] =
          snapshot.docs.map((docSnap) => {
            const data =
              docSnap.data() as Omit<
                CampaignMonster,
                "id"
              >;

            return {
              id: docSnap.id,
              ...data,
              source: "campaign" as const,
            };
          });

        setCampaignMonsters(next);
        setLoading(false);
      },

      (snapshotError) => {
        console.error(snapshotError);

        setError(
          "Failed to load campaign monsters.",
        );

        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [campaignId]);

  const allMonsters =
    useMemo<MonsterListItem[]>(() => {
      const defaultMonsters: MonsterListItem[] =
        monsters.map((monster) => ({
          ...monster,
          source: "default" as const,
        }));

      return [
        ...defaultMonsters,
        ...campaignMonsters,
      ].sort((a, b) =>
        a.name.localeCompare(
          b.name,
          undefined,
          {
            sensitivity: "base",
          },
        ),
      );
    }, [campaignMonsters]);

  return {
    allMonsters,
    campaignMonsters,
    loading,
    error,
  };
}