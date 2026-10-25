import { useState } from "react";
import { clearGameScreen } from "./gameScreen";

export default function GameScreenControls({ campaignId }: { campaignId: string }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const open = () => {
    window.open(`/campaigns/${encodeURIComponent(campaignId)}/game-screen`, "_blank", "noopener,noreferrer");
  };

  const clear = async () => {
    setBusy(true);
    setError("");
    try {
      await clearGameScreen(campaignId);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not clear screen");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={open} className="h-8 rounded-lg border border-white/10 px-3 text-xs text-zinc-200 hover:bg-white/10">Open Game Screen</button>
      <button type="button" onClick={clear} disabled={busy} className="h-8 rounded-lg border border-white/10 px-3 text-xs text-zinc-200 hover:bg-white/10 disabled:opacity-50">Clear Screen</button>
      {error && <span role="alert" className="text-xs text-red-300">{error}</span>}
    </div>
  );
}
