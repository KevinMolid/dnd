import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  beginSpotifyAuthorization,
  clearSpotifyTokens,
  getStoredSpotifyTokens,
  getValidSpotifyAccessToken,
} from "./spotifyAuth";
import { playSpotifyUrlOnDevice } from "./spotifyApi";
import type { SpotifyPlaybackState, SpotifyTrack } from "./spotifyTypes";

type SpotifyWebPlaybackTrack = {
  uri: string;
  id: string | null;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images?: Array<{ url: string }>;
  };
};

type SpotifyWebPlaybackState = {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: SpotifyWebPlaybackTrack;
  };
};

type SpotifyPlayer = {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (payload: any) => void) => boolean;
  removeListener: (
    event?: string,
    callback?: (payload: any) => void,
  ) => boolean;
  togglePlay: () => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  getVolume: () => Promise<number>;
  activateElement: () => Promise<void>;
};

declare global {
  interface Window {
    Spotify?: {
      Player: new (options: {
        name: string;
        getOAuthToken: (callback: (token: string) => void) => void;
        volume?: number;
        enableMediaSession?: boolean;
      }) => SpotifyPlayer;
    };

    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

type SpotifyPlayerContextValue = {
  authenticated: boolean;
  ready: boolean;
  deviceId: string | null;
  playback: SpotifyPlaybackState;
  volume: number;
  error: string | null;

  connectSpotify: () => Promise<void>;
  disconnectSpotify: () => void;
  playSpotifyUrl: (url: string) => Promise<void>;
  togglePlay: () => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
};

const EMPTY_PLAYBACK: SpotifyPlaybackState = {
  paused: true,
  position: 0,
  duration: 0,
  track: null,
};

const SpotifyPlayerContext = createContext<
  SpotifyPlayerContextValue | undefined
>(undefined);

function mapTrack(track?: SpotifyWebPlaybackTrack): SpotifyTrack | null {
  if (!track) {
    return null;
  }

  return {
    uri: track.uri,
    id: track.id,
    name: track.name,
    artists: track.artists?.map((artist) => artist.name) ?? [],
    albumName: track.album?.name ?? "",
    imageUrl: track.album?.images?.[0]?.url ?? null,
  };
}

function loadSpotifySdk() {
  if (window.Spotify) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://sdk.scdn.co/spotify-player.js"]',
    );

    const previousReady = window.onSpotifyWebPlaybackSDKReady;

    window.onSpotifyWebPlaybackSDKReady = () => {
      previousReady?.();
      resolve();
    };

    if (existing) {
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load the Spotify Web Playback SDK.")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.addEventListener("error", () =>
      reject(new Error("Failed to load the Spotify Web Playback SDK.")),
    );
    document.body.appendChild(script);
  });
}

export function SpotifyPlayerProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<SpotifyPlayer | null>(null);

  const [authenticated, setAuthenticated] = useState(() =>
    Boolean(getStoredSpotifyTokens()),
  );
  const [ready, setReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playback, setPlayback] =
    useState<SpotifyPlaybackState>(EMPTY_PLAYBACK);
  const [volume, setVolumeState] = useState(0.5);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    let cancelled = false;

    const setup = async () => {
      try {
        const token = await getValidSpotifyAccessToken();

        if (cancelled) {
          return;
        }

        if (!token) {
          setAuthenticated(false);
          return;
        }

        await loadSpotifySdk();

        if (cancelled || !window.Spotify || playerRef.current) {
          return;
        }

        const player = new window.Spotify.Player({
          name: "Lorebound",
          getOAuthToken: async (callback) => {
            try {
              const freshToken = await getValidSpotifyAccessToken();

              if (freshToken) {
                callback(freshToken);
              }
            } catch (tokenError) {
              setError(
                tokenError instanceof Error
                  ? tokenError.message
                  : "Spotify authentication failed.",
              );
            }
          },
          volume: 0.5,
          enableMediaSession: true,
        });

        playerRef.current = player;

        player.addListener("ready", ({ device_id }: { device_id: string }) => {
          setDeviceId(device_id);
          setReady(true);
          setError(null);

          player
            .getVolume()
            .then(setVolumeState)
            .catch(() => {});
        });

        player.addListener(
          "not_ready",
          ({ device_id }: { device_id: string }) => {
            setDeviceId((current) => (current === device_id ? null : current));
            setReady(false);
          },
        );

        player.addListener(
          "player_state_changed",
          (state: SpotifyWebPlaybackState | null) => {
            if (!state) {
              return;
            }

            setPlayback({
              paused: state.paused,
              position: state.position,
              duration: state.duration,
              track: mapTrack(state.track_window?.current_track),
            });
          },
        );

        const setSdkError = ({ message }: { message: string }) => {
          setError(message);
        };

        player.addListener("initialization_error", setSdkError);
        player.addListener("authentication_error", setSdkError);
        player.addListener("account_error", setSdkError);
        player.addListener("playback_error", setSdkError);
        player.addListener("autoplay_failed", () => {
          setError(
            "The browser blocked autoplay. Click a music cue or playback control again.",
          );
        });

        const connected = await player.connect();

        if (!connected) {
          setError("Spotify could not connect the Lorebound player.");
        }
      } catch (setupError) {
        setError(
          setupError instanceof Error
            ? setupError.message
            : "Spotify player setup failed.",
        );
      }
    };

    void setup();

    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  useEffect(() => {
    return () => {
      playerRef.current?.disconnect();
      playerRef.current = null;
    };
  }, []);

  const connectSpotify = useCallback(async () => {
    setError(null);
    await beginSpotifyAuthorization(
      window.location.pathname + window.location.search,
    );
  }, []);

  const disconnectSpotify = useCallback(() => {
    playerRef.current?.disconnect();
    playerRef.current = null;
    clearSpotifyTokens();
    setAuthenticated(false);
    setReady(false);
    setDeviceId(null);
    setPlayback(EMPTY_PLAYBACK);
    setError(null);
  }, []);

  const playSpotifyUrl = useCallback(
    async (url: string) => {
      const player = playerRef.current;

      if (!authenticated) {
        await connectSpotify();
        return;
      }

      if (!player || !deviceId) {
        throw new Error("The Lorebound Spotify player is not ready yet.");
      }

      setError(null);

      try {
        await player.activateElement();
        await playSpotifyUrlOnDevice(url, deviceId);
      } catch (playError) {
        const message =
          playError instanceof Error
            ? playError.message
            : "Spotify playback failed.";
        setError(message);
        throw playError;
      }
    },
    [authenticated, connectSpotify, deviceId],
  );

  const togglePlay = useCallback(async () => {
    if (!playerRef.current) return;
    setError(null);
    await playerRef.current.activateElement();
    await playerRef.current.togglePlay();
  }, []);

  const previousTrack = useCallback(async () => {
    if (!playerRef.current) return;
    setError(null);
    await playerRef.current.previousTrack();
  }, []);

  const nextTrack = useCallback(async () => {
    if (!playerRef.current) return;
    setError(null);
    await playerRef.current.nextTrack();
  }, []);

  const seek = useCallback(async (positionMs: number) => {
    if (!playerRef.current) return;
    await playerRef.current.seek(positionMs);
    setPlayback((current) => ({
      ...current,
      position: positionMs,
    }));
  }, []);

  const setVolume = useCallback(async (nextVolume: number) => {
    if (!playerRef.current) return;

    const clamped = Math.max(0, Math.min(1, nextVolume));
    await playerRef.current.setVolume(clamped);
    setVolumeState(clamped);
  }, []);

  const value = useMemo<SpotifyPlayerContextValue>(
    () => ({
      authenticated,
      ready,
      deviceId,
      playback,
      volume,
      error,
      connectSpotify,
      disconnectSpotify,
      playSpotifyUrl,
      togglePlay,
      previousTrack,
      nextTrack,
      seek,
      setVolume,
    }),
    [
      authenticated,
      ready,
      deviceId,
      playback,
      volume,
      error,
      connectSpotify,
      disconnectSpotify,
      playSpotifyUrl,
      togglePlay,
      previousTrack,
      nextTrack,
      seek,
      setVolume,
    ],
  );

  return (
    <SpotifyPlayerContext.Provider value={value}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
}

export function useSpotifyPlayer() {
  const context = useContext(SpotifyPlayerContext);

  if (!context) {
    throw new Error(
      "useSpotifyPlayer must be used inside SpotifyPlayerProvider.",
    );
  }

  return context;
}
