import {
  useEffect,
  useState,
} from "react";

import {
  subscribeToCampaignRandomTables,
} from "./randomTableService";

import type {
  CampaignRandomTable,
} from "./types";

export default function useCampaignRandomTables(
  campaignId?: string,
) {
  const [
    tables,
    setTables,
  ] =
    useState<
      CampaignRandomTable[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  useEffect(() => {
    if (
      !campaignId
    ) {
      setTables(
        [],
      );

      setLoading(
        false,
      );

      return;
    }

    setLoading(
      true,
    );

    setError(
      null,
    );

    const unsubscribe =
      subscribeToCampaignRandomTables(
        campaignId,

        (
          nextTables,
        ) => {
          setTables(
            nextTables.filter(
              (
                table,
              ) =>
                table.kind ===
                "encounter",
            ),
          );

          setLoading(
            false,
          );
        },

        () => {
          setError(
            "Failed to load random encounter tables.",
          );

          setLoading(
            false,
          );
        },
      );

    return unsubscribe;
  }, [
    campaignId,
  ]);

  return {
    tables,

    loading,

    error,
  };
}