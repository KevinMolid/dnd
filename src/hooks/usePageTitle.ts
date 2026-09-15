import { useEffect } from "react";

const APP_NAME = "Lorebound";

export const usePageTitle = (
  title?: string | null,
  section?: string | null,
) => {
  useEffect(() => {
    const parts = [title, section, APP_NAME].filter(
      (part): part is string => Boolean(part?.trim()),
    );

    document.title = parts.join(" · ");

    return () => {
      document.title = APP_NAME;
    };
  }, [title, section]);
};