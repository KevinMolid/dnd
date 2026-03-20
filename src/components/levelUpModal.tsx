import { useState } from "react";

type Props = {
  character: any;
  onClose: () => void;
  onConfirm: (updates: any) => void;
};

const LevelUpModal = ({ character, onClose, onConfirm }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleLevelUp = async () => {
    setLoading(true);

    try {
      // 👉 For now: simple level up
      // Later: plug into full decision system

      onConfirm({
        level: character.derivedLevel,
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">
          Level Up Available 🎉
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          {character.name} can advance from level{" "}
          {character.level} → {character.derivedLevel}
        </p>

        <div className="mt-6 space-y-2 text-sm text-zinc-300">
          <p>• Hit points will increase</p>
          <p>• New features may be unlocked</p>
          <p>• You may need to make choices</p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl border border-white/10 text-zinc-300 hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            onClick={handleLevelUp}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-xl bg-amber-400 text-zinc-900 font-semibold hover:bg-amber-300"
          >
            {loading ? "Processing..." : "Level Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;