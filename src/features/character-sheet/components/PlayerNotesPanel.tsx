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
      <div className="flex shrink-0 justify-end px-1 pb-2">
        <SaveIndicator state={saveState} />
      </div>

      <div className="min-h-0 flex-1">
        <textarea
          value={draft}
          spellCheck={false}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={handleBlur}
          placeholder="Write notes from the game here..."
          className="workspace-scrollbar h-full min-h-[390px] w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 p-4 text-sm leading-6 text-zinc-200 outline-none transition placeholder:text-zinc-600 focus:border-white/20 focus:bg-black/25"
        />
      </div>
    </div>
  );
};

const SaveIndicator = ({ state }: { state: SaveState }) => {
  if (state === "saving") {
    return (
      <span className="text-[10px] font-medium text-amber-300">Saving…</span>
    );
  }

  if (state === "error") {
    return (
      <span className="text-[10px] font-medium text-rose-300">Save failed</span>
    );
  }

  return <span className="text-[10px] font-medium text-zinc-500">Saved</span>;
};

export default PlayerNotesPanel;
