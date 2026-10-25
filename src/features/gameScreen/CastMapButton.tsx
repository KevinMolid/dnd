import { useState } from "react";
import { castMapToGameScreen } from "./gameScreen";

type Props = { campaignId: string; mapId: string };

export default function CastMapButton({ campaignId, mapId }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const cast = async () => {
    setBusy(true);
    setError("");
    setSuccess(false);
    try {
      await castMapToGameScreen(campaignId, mapId);
      setSuccess(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Casting failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={cast}
        className="inline-flex h-8 items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:opacity-50"
      >
        <i className="fa-solid fa-display text-[10px]" />
        {busy ? "Casting…" : success ? "Cast again" : "Cast to Game Screen"}
      </button>
      {error && <span role="alert" className="max-w-52 text-xs text-red-300">{error}</span>}
    </div>
  );
}
