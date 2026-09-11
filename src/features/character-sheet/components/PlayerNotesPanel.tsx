import { useEffect, useRef, useState } from "react";

type SaveState = "saved" | "saving" | "error";

type PlayerNotesPanelProps = {
  value?: string | null;

  onSave: (notes: string) => Promise<void>;
};

const AUTOSAVE_DELAY_MS = 700;

const PlayerNotesPanel = ({
  value: savedValue = "",

  onSave,
}: PlayerNotesPanelProps) => {
  const normalizedSavedValue = savedValue ?? "";

  const [draft, setDraft] = useState(normalizedSavedValue);

  const [saveState, setSaveState] = useState<SaveState>("saved");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const latestDraftRef = useRef(normalizedSavedValue);

  const lastSavedRef = useRef(normalizedSavedValue);

  /*
   * Whenever the canonical character state changes,
   * synchronize the editor unless the value is already
   * what we're editing.
   *
   * This is what makes switching tabs safe.
   */
  useEffect(() => {
    if (normalizedSavedValue === lastSavedRef.current) {
      return;
    }

    lastSavedRef.current = normalizedSavedValue;

    latestDraftRef.current = normalizedSavedValue;

    setDraft(normalizedSavedValue);

    setSaveState("saved");
  }, [normalizedSavedValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const saveDraft = async (nextValue: string) => {
    if (nextValue === lastSavedRef.current) {
      setSaveState("saved");

      return;
    }

    setSaveState("saving");

    try {
      await onSave(nextValue);

      lastSavedRef.current = nextValue;

      setSaveState("saved");
    } catch {
      /*
       * The hook handles rollback and the global error.
       * This component only reflects that saving failed.
       */
      setSaveState("error");
    }
  };

  const queueSave = (nextValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (nextValue === lastSavedRef.current) {
      setSaveState("saved");

      return;
    }

    setSaveState("saving");

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;

      void saveDraft(nextValue);
    }, AUTOSAVE_DELAY_MS);
  };

  const handleChange = (nextValue: string) => {
    latestDraftRef.current = nextValue;

    setDraft(nextValue);

    queueSave(nextValue);
  };

  const handleBlur = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = null;
    }

    void saveDraft(latestDraftRef.current);
  };

  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold text-zinc-200">
            Player Notes
          </p>

          <p className="mt-0.5 text-[8px] text-zinc-600">
            Personal notes for play.
          </p>
        </div>

        <SaveIndicator state={saveState} />
      </div>

      <div className="min-h-0 flex-1 p-3">
        <textarea
          value={draft}
          spellCheck={false}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={handleBlur}
          placeholder="Write notes from the game here..."
          className="workspace-scrollbar h-full min-h-[360px] w-full resize-none rounded-lg border border-white/[0.07] bg-black/20 p-3 text-[11px] leading-5 text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-white/15 focus:bg-black/25"
        />
      </div>
    </div>
  );
};

const SaveIndicator = ({ state }: { state: SaveState }) => {
  if (state === "saving") {
    return (
      <span className="text-[8px] font-medium text-amber-400/80">Saving…</span>
    );
  }

  if (state === "error") {
    return (
      <span className="text-[8px] font-medium text-rose-400">Save failed</span>
    );
  }

  return <span className="text-[8px] font-medium text-zinc-600">Saved</span>;
};

export default PlayerNotesPanel;
