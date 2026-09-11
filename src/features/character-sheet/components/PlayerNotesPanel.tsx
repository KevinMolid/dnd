import { useEffect, useRef, useState } from "react";

import { doc, updateDoc } from "firebase/firestore";

import { db } from "../../../firebase";

type SaveState = "saved" | "saving" | "error";

type PlayerNotesPanelProps = {
  characterId?: string;
  initialValue?: string | null;
};

const AUTOSAVE_DELAY_MS = 700;

const PlayerNotesPanel = ({
  characterId,
  initialValue = "",
}: PlayerNotesPanelProps) => {
  const normalizedInitialValue = initialValue ?? "";

  const [value, setValue] = useState(normalizedInitialValue);

  const [saveState, setSaveState] = useState<SaveState>("saved");

  const lastSavedValueRef = useRef(normalizedInitialValue);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(normalizedInitialValue);
    lastSavedValueRef.current = normalizedInitialValue;
    setSaveState("saved");
  }, [characterId, normalizedInitialValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const save = async (nextValue: string) => {
    if (!characterId) {
      setSaveState("error");
      return;
    }

    if (nextValue === lastSavedValueRef.current) {
      setSaveState("saved");
      return;
    }

    setSaveState("saving");

    try {
      await updateDoc(doc(db, "characters", characterId), {
        playerNotes: nextValue,
        updatedAt: new Date(),
      });

      lastSavedValueRef.current = nextValue;

      setSaveState("saved");
    } catch (error) {
      console.error("Failed to save player notes:", error);

      setSaveState("error");
    }
  };

  const queueSave = (nextValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (nextValue === lastSavedValueRef.current) {
      setSaveState("saved");
      return;
    }

    setSaveState("saving");

    timeoutRef.current = setTimeout(() => {
      void save(nextValue);
    }, AUTOSAVE_DELAY_MS);
  };

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    queueSave(nextValue);
  };

  const handleBlur = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = null;
    }

    void save(value);
  };

  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold text-zinc-200">
            Player Notes
          </p>

          <p className="mt-0.5 text-[8px] text-zinc-600">
            Personal notes for play. Autosaved.
          </p>
        </div>

        <SaveIndicator state={saveState} />
      </div>

      <div className="min-h-0 flex-1 p-3">
        <textarea
          value={value}
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
