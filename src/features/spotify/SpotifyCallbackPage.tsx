import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  completeSpotifyAuthorization,
  consumeSpotifyReturnTo,
  getStoredSpotifyTokens,
} from "./spotifyAuth";

let callbackPromise: Promise<string> | null = null;
let callbackCode: string | null = null;

function exchangeSpotifyCode(
  code: string,
  state: string | null,
): Promise<string> {
  /*
   * Module scope is intentional. React StrictMode mounts, unmounts and mounts
   * the component again in development, so a component ref is not sufficient.
   * Spotify authorization codes are single-use.
   */
  if (callbackPromise && callbackCode === code) {
    return callbackPromise;
  }

  callbackCode = code;
  callbackPromise = completeSpotifyAuthorization(code, state).then(() =>
    consumeSpotifyReturnTo(),
  );

  return callbackPromise;
}

export default function SpotifyCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const spotifyError = searchParams.get("error");
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (spotifyError) {
      setError(`Spotify authorization failed: ${spotifyError}`);
      return;
    }

    // If StrictMode remounted us after a successful exchange, just continue.
    if (!code && getStoredSpotifyTokens()) {
      navigate("/", { replace: true });
      return;
    }

    if (!code) {
      setError("Spotify did not return an authorization code.");
      return;
    }

    void exchangeSpotifyCode(code, state)
      .then((returnTo) => {
        window.location.replace(returnTo);
      })
      .catch((callbackError) => {
        setError(
          callbackError instanceof Error
            ? callbackError.message
            : "Spotify authorization failed.",
        );
      });
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-white">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 text-center shadow-2xl">
        <i className="fa-brands fa-spotify mb-4 text-4xl text-emerald-400" />

        {error ? (
          <>
            <h1 className="text-lg font-bold">Spotify connection failed</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/", { replace: true })}
              className="mt-5 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
            >
              Return to Lorebound
            </button>
          </>
        ) : (
          <>
            <h1 className="text-lg font-bold">Connecting Spotify</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Finishing the connection to Lorebound...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
